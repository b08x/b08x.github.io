# Ingest and Text Processing: From Raw Input to Structured Clauses

You have a conversation export — a JSONL file from ChatGPT, a subtitle file from a meeting recording, or a markdown document. You want to understand what was said, who said it, and how it was framed. You run one command:

```bash
bin/sfl-analyze conversation exports/team-meeting.jsonl --store
```

The system boots. A Python sidecar spins up in the background. Your text flows through a two-pass pipeline. Within seconds, you have annotated clauses stored in PostgreSQL, ready for retrieval. Here's what happens between that command and that result.

## What the User Sees

```
$ bin/sfl-analyze conversation exports/team-meeting.jsonl --store

[1/12] Alice (2.3s, 4 clauses)
[2/12] Bob (1.8s, 3 clauses)
[3/12] Alice (2.1s, 5 clauses)
...

Generated:
  JSON: ./output/latest/analysis.json
  MARKDOWN: ./output/latest/report.md

Clauses: 47 | Stored: 47 | Embeddings: 47
```

Each line represents a conversation turn — one message from one speaker. The system parsed it into clauses, annotated each clause with linguistic metadata, stored the results, and generated embeddings. You can now query those clauses:

```bash
bin/sfl-analyze context "What decisions were made?" --limit 5
```

## What Happens Under the Hood

The CLI orchestrates a pipeline with four stages:

```
Raw text → Pass 1 (spaCy) → Pass 2 (LLM) → Store (Postgres) → Embed (pgvector)
```

**Pass 1** is syntactic parsing. It splits text into clauses, identifies the main verb, maps dependency relations to semantic roles, and classifies the process type. This is rule-based — no LLM calls, deterministic, fast.

**Pass 2** is semantic annotation. It classifies mood, modality, tenor, and attitude. This uses an LLM — configurable per task, with degradation fallbacks.

**Store** persists the annotated clauses. **Embed** computes and stores vector embeddings for retrieval.

This article covers Pass 1: the spaCy sidecar, the Ruby parser, the engine, and the ideational extractor.

## The Subprocess Boundary

Pass 1 uses spaCy for syntactic parsing. But spaCy is Python, and this is a Ruby application. The solution is a subprocess boundary — spaCy runs in its own process, communicates over stdin/stdout with NDJSON, and crashes independently. Ruby never touches the Python interpreter directly.

```
┌─────────────────────────────────────────────┐
│  Ruby Process                               │
│                                             │
│  SpacySidecarParser ──stdin──┐              │
│                              │              │
└──────────────────────────────┼──────────────┘
                               │
┌──────────────────────────────┼──────────────┐
│  Python Process              │              │
│                              ▼              │
│  spacy_sidecar.py ──stdout──┐              │
│                              │              │
│  "I parse text and return   │              │
│   structured clauses"       │              │
└──────────────────────────────┴──────────────┘
```

The protocol is simple:

```
Startup:   {"type": "ready", "model": "en_core_web_sm"}
Request:   {"id": "uuid", "text": "The cat sat on the mat.", "document_id": "doc-1"}
Response:  {"id": "uuid", "clauses": [...]}
```

Each clause contains tokens with syntactic annotations — POS tags, dependency relations, lemma, head index. The head index is positional (not a text lookup), so two identical words never collapse onto the same head.

## The Python Sidecar

The sidecar loads spaCy once at startup, then loops over stdin requests:

```python
#!/usr/bin/env python3
import json, sys, uuid

def build_clause(sent, sentence_index, document_id):
    tokens = []
    for local_i, token in enumerate(sent):
        if not token.text.strip():
            continue
        head_index = -1 if token.head.i == token.i else token.head.i - sent.start
        tokens.append({
            "text": token.text,
            "lemma": token.lemma_ or token.text.lower(),
            "pos": token.pos_ or "X",
            "tag": token.tag_ or "X",
            "dep": token.dep_ or "dep",
            "head_index": head_index,
            "morphology": token.morph.to_dict(),
            "index": local_i,
        })

    if not tokens:
        return None

    root_index = next((i for i, t in enumerate(tokens) if t["dep"] == "ROOT"), 0)
    return {
        "id": str(uuid.uuid4()),
        "text": sent.text.strip(),
        "tokens": tokens,
        "root_index": root_index,
        "sentence_index": sentence_index,
        "document_id": document_id,
    }

def emit(payload):
    sys.stdout.write(json.dumps(payload) + "\n")
    sys.stdout.flush()

def main():
    import spacy
    nlp = spacy.load("en_core_web_sm")
    emit({"type": "ready", "model": "en_core_web_sm"})

    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        request_id = None
        try:
            request = json.loads(line)
            request_id = request.get("id")
            doc = nlp(request.get("text", ""))
            clauses = []
            for i, sent in enumerate(doc.sents):
                clause = build_clause(sent, i, request.get("document_id"))
                if clause:
                    clauses.append(clause)
            emit({"id": request_id, "clauses": clauses})
        except Exception as exc:
            emit({"id": request_id, "error": str(exc)})

if __name__ == "__main__":
    main()
```

The `pgroup: true` flag when spawning puts the sidecar in its own process group. A terminal Ctrl+C hits Ruby, not the child — the CLI relies on this to finish in-flight requests before shutdown.

## The Ruby Parser

The parser spawns the sidecar, communicates over pipes, and builds typed structs from the JSON:

```ruby
class SpacySidecarParser
  DEFAULT_SCRIPT_PATH = File.expand_path("../../sidecar/spacy_sidecar.py", __dir__)
  STARTUP_TIMEOUT_SECONDS = 30

  def initialize(model:, command: nil, env: {}, logger: nil)
    @model = model
    @command = command || ["python3", DEFAULT_SCRIPT_PATH, "--model", model]
    @env = env
    @logger = logger
    @mutex = Mutex.new
    start_process
  end

  def parse(text, document_id: nil)
    @mutex.synchronize { request(text, document_id) }
  end

  def close
    @mutex.synchronize { stop_process }
  end

  private

  def start_process
    @stdin, @stdout, @wait_thread = Open3.popen2(@env, *@command, pgroup: true)
    await_ready
  end

  def await_ready
    line = Timeout.timeout(STARTUP_TIMEOUT_SECONDS) { stdout.gets }
    raise SidecarError, "sidecar exited before signaling ready" if line.nil?
    ready = JSON.parse(line)
    raise SidecarError, "unexpected startup: #{line.inspect}" unless ready["type"] == "ready"
  end

  def request(text, document_id, retried: false)
    write_line(id: SecureRandom.uuid, text: text, document_id: document_id)
    response = read_response
    raise SidecarError, response["error"] if response["error"]
    build_clauses(response.fetch("clauses"))
  rescue Errno::EPIPE, IOError, SidecarError => e
    raise SidecarError, "sidecar transport failed: #{e.message}" if retried
    restart_process
    request(text, document_id, retried: true)
  end

  # ... read_response, write_line, restart_process, stop_process, build_clauses
end
```

The crash-and-retry logic restarts the sidecar exactly once. A permanently broken sidecar surfaces as an error instead of looping forever.

## The Engine

The engine wraps the parser with guard clauses and instrumentation:

```ruby
class Engine
  def initialize(parser:, instrumenter: NullInstrumenter.new, logger: nil)
    @parser = parser
    @instrumenter = instrumenter
    @logger = logger
  end

  def process(text, document_id: nil)
    return [] if text.nil? || text.strip.empty?

    started_at = Process.clock_gettime(Process::CLOCK_MONOTONIC)
    clauses = instrumenter.instrument("pass_one.process", document_id:) do
      parser.parse(text, document_id: document_id)
    end
    elapsed_ms = ((Process.clock_gettime(Process::CLOCK_MONOTONIC) - started_at) * 1000).round(2)
    logger&.info { "pass_one completed (clause_count=#{clauses.size}, latency_ms=#{elapsed_ms})" }
    clauses
  rescue PassOne::Error => e
    logger&.error { "pass_one failed: #{e.message}" }
    raise
  rescue => e
    raise PassOne::Error, "Syntactic extraction failed: #{e.message}"
  end
end
```

The parser is injected — in production it's `SpacySidecarParser`; in tests it's a null or fake. This class never touches the subprocess directly.

## The Ideational Extractor

After parsing, the extractor maps dependency structures to SFL process types. This is rule-based — no LLM calls:

```ruby
class IdeationalExtractor
  PARTICIPANT_ROLES = {
    "nsubj" => "Actor",       "nsubjpass" => "Goal",
    "dobj" => "Goal",         "iobj" => "Recipient",
    "attr" => "Attribute",    "oprd" => "Attribute",
    "pobj" => "Circumstance", "prep" => "Circumstance",
    "advmod" => "Circumstance", "advcl" => "Circumstance",
    "acomp" => "Attribute",   "xcomp" => "Process",
    "ccomp" => "Process",     "conj" => "Participant",
    "appos" => "Participant",
  }.freeze

  MENTAL_VERBS = %w[think know believe understand feel see hear want need like love hate
                     consider suppose expect remember forget imagine notice realize].freeze
  RELATIONAL_VERBS = %w[be seem become appear remain stay look sound taste smell feel].freeze
  VERBAL_VERBS = %w[say tell speak talk ask answer reply respond declare announce
                     report explain suggest propose].freeze
  BEHAVIORAL_VERBS = %w[breathe smile sneeze cry laugh look watch listen cough sleep].freeze
  EXISTENTIAL_VERBS = %w[be exist].freeze

  def extract(clause)
    root_token = clause.tokens[clause.root_index]
    return empty_payload(clause.id) if root_token.nil?

    IdeationalPayload.new(
      clause_id: clause.id,
      process_type: classify_process(root_token, clause),
      participants: extract_participants(clause),
      circumstances: extract_circumstances(clause),
      raw_transitivity: build_transitivity_hash(root_token, clause)
    )
  end

  private

  def classify_process(root_token, clause)
    return "mental" if MENTAL_VERBS.include?(root_token.lemma.downcase)
    return "relational" if RELATIONAL_VERBS.include?(root_token.lemma.downcase)
    return "verbal" if VERBAL_VERBS.include?(root_token.lemma.downcase)
    return "behavioral" if BEHAVIORAL_VERBS.include?(root_token.lemma.downcase)
    if clause.text.strip.downcase.start_with?("there ") &&
       EXISTENTIAL_VERBS.include?(root_token.lemma.downcase)
      return "existential"
    end
    "material"
  end
end
```

The six process types map to Halliday's transitivity system:

| Process Type | What It Encodes | Example Verbs |
|-------------|-----------------|---------------|
| **Material** | Actions, events | run, create, destroy |
| **Mental** | Cognition, perception | think, know, believe |
| **Relational** | States of being | be, seem, become |
| **Verbal** | Symbolic communication | say, tell, declare |
| **Behavioral** | Physiological behavior | breathe, laugh, sleep |
| **Existential** | Existence | exist, be (in "there is") |

## The Pipeline Wiring

The CLI wires these pieces together:

```ruby
# In CLI.build_pipeline
parser = Core::PassOne::SpacySidecarParser.new(
  model: boot_result.spacy_model,
  command: boot_result.pass1_command,
  env: boot_result.pass1_env || {},
  logger: logger
)
pass_one = Core::PassOne::Engine.new(parser:, instrumenter:, logger:)

# Pass 2 is injected separately (LLM-based annotation)
pass_two = LLM::EngineBuilder.call(config: boot_result.llm_config, ...)

# Storage
clause_store = Store::PgClauseStore.new(boot_result.db)
embedding_store = Store::PgEmbeddingStore.new(boot_result.db)

# Compose
Core::Pipeline.new(pass_one:, pass_two:, clause_store:, embedding_store:, ...)
```

The pipeline's `compile` method chains these stages using dry-monads:

```ruby
def compile(text, document_id: nil, store: true, embed: true, ...)
  parse(text, document_id)                              # Pass 1
    .bind { |clauses| Success(pair_with_ideational(clauses)) }  # Extract
    .bind { |pairs| annotate(pairs, ...) }              # Pass 2 (LLM)
    .bind { |annotated| persist(annotated, ...) }       # Store
    .bind { |annotated| embed_all(annotated, ...) }     # Embed
end
```

Each stage returns `Success` or `Failure`. A Pass 1 failure short-circuits past everything else — no explicit guard needed at every step.

## What Pass 1 Produces

After this stage, every clause has:

- **Text**: the original clause string
- **Tokens**: each word with POS, dependency, lemma, head index
- **Root index**: the position of the main verb
- **Process type**: material, mental, relational, verbal, behavioral, or existential
- **Participants**: semantic roles (Actor, Goal, Recipient, Attribute)
- **Circumstances**: adjuncts (prepositional phrases, adverbials)

This is the **ideational payload** — what happened, who did what to whom. Pass 2 will add the **interpersonal payload** — how it was said, the mood and modality and attitude. But that's the next article.

---

*This is Part 3 of 7 in the "SFL Engine: Hardening RAG Against Context Poisoning" series. Next: [Pass 2 — LLM Annotation](article-4-pass2-annotation.md).*
