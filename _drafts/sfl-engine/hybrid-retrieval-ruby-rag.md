# Why Your RAG Pipeline Has a Security Gap

Your RAG system retrieved a document containing the phrase "Everyone agrees this migration is catastrophic!" The LLM absorbed the persuasive framing along with the factual claim about migration status. Now your model confidently reports that the migration is catastrophic — not because it evaluated the evidence, but because it absorbed the social proof cue embedded in the retrieved text.

This is context poisoning. The LLM didn't hallucinate. It followed your instructions faithfully. It just couldn't distinguish between what the text *claimed* and how the text *framed* that claim.

## The Two Payloads in Every Clause

Language carries two simultaneous payloads:

- **Facticity** — what happened, who did what to whom, the propositional content
- **Interpretation** — the persuasion, emotion, and rhetorical stance wrapped around those facts

Consider: *"Our revolutionary platform is the only solution that truly understands your needs."*

The factual payload: there exists a platform, it has features, those features relate to user needs. The interpretive payload: "revolutionary" (hyperbole), "only solution" (exclusivity claim), "truly understands" (empathy framing). Standard RAG embeds these as one inseparable vector. The LLM receives them as one fused message.

## Why Prompt-Level Defenses Fail

The common response is to add instructions: "Ignore manipulative tone. Focus on facts." But this defense has a structural flaw: it competes with the retrieved content on the same channel.

The instruction is behavioral and generic — "don't be influenced." The retrieved content is concrete and specific — social proof, urgency cues, authority framing, emotional appeals. The concrete beats the generic every time. The LLM's attention mechanism weights specific tokens over abstract instructions.

It's like telling a jury to "ignore the defendant's personality" after they've already heard three character witnesses. The information is in the channel. The instruction can't un-ring the bell.

## The Architectural Insight

The defense must be structural, not behavioral. Don't tell the LLM to ignore the stance — remove the stance before it reaches the LLM.

SFL Engine applies an MVC-like separation at the data layer:

- **Ideational payload** — the Model-like representation of processes, participants, and circumstances: what happened.
- **Interpersonal payload** — the View-like representation of mood, modality, tenor, and attitude: how the claim is presented.

The analogy is architectural, not literal. Interpersonal metadata is not merely decorative presentation; it is a security-relevant signal used by retrieval policy. Separating the payloads lets the system filter rhetorical characteristics before synthesis while preserving the underlying clause content for inspection and citation.

This is closer to input sanitization than to `eval()` prevention: the system removes a class of influence-bearing metadata before it reaches the model.

## The Two-Pass Pipeline

SFL Engine implements a two-pass annotation pipeline:

```
Input → Pass 1 (spaCy) → Pass 2 (LLM) → Store (Postgres + pgvector)
                         ↓
                   Ideational Payload    → facts, process types, participants
                   Interpersonal Payload → mood, modality, tenor, attitude
                         ↓
                   Retrieve (Hybrid Search + Stance Filters)
                         ↓
                   LLM receives: facts without persuasion
```

**Pass 1** uses spaCy as a subprocess sidecar for syntactic parsing. It extracts clause boundaries, process types (material, mental, relational, verbal, behavioral, existential), participants, and circumstances. This is rule-based, deterministic, fast.

**Pass 2** uses an LLM via ruby_llm for semantic annotation. It classifies mood (declarative, interrogative, imperative, exclamative), modality weight (0–1 certainty scalar), tenor (formality register), and speaker attitude (social proof, authority, emotional, neutral). This is model-configurable per task.

**Storage** keeps ideational and interpersonal payloads in separate tables. Independently indexable. Independently filterable.

**Retrieval** uses Reciprocal Rank Fusion to merge vector similarity and keyword search. Then scalar stance filters exclude clauses whose interpersonal profile matches structural fingerprints of cognitive distortion — *before* the LLM's context window is assembled.

## The Intellectual Lineage

This is not a single-discipline design. It synthesizes patterns from domains that usually do not interact:

| Domain | Pattern | Engineering Translation |
|--------|---------|------------------------|
| **Systemic Functional Linguistics** | Three metafunctions (ideational, interpersonal, textual) | Extractable JSON metadata per clause |
| **Cognitive Behavioral Therapy** | Cognitive distortions as structural linguistic patterns | Scalar stance filters on interpersonal payloads |
| **Cognitive Neuroscience** | Working memory consolidation | Rolling Synthesis — compress context, preserve gist |
| **Existential Philosophy** | Facticity vs. interpretation | Payload separation — facts and stance in separate tables |
| **Unix Philosophy** | Composable, single-purpose tools | Two-pass pipeline with Dry::Struct type contracts |
| **Cybersecurity** | Air gapping, data sanitization | Rhetorical Firewall — filter before the context window |

SFL provides the metadata. CBT provides the distortion taxonomy. Neuroscience provides the consolidation pattern. Philosophy provides the facticity/interpretation distinction. Unix provides the composability. Cybersecurity provides the air-gapping model.

## What This Series Covers

This article is the first in a seven-part series. Each article builds a piece of the SFL Engine:

1. **This article** — the problem and the architectural vision
2. **Agent Orchestration** — RubyLLM patterns for composing the pipeline
3. **Pass 1: The spaCy Sidecar** — syntactic parsing via subprocess
4. **Pass 2: LLM Annotation** — semantic labeling with structured output
5. **Storage Layer** — Sequel, pgvector, and payload separation
6. **Retrieval + Stance Filters** — hybrid search with rhetorical safety
7. **Wiring It Together** — CLI, API, and end-to-end integration

By the end, you'll have a working system that separates what a text says from how it says it, then filters the "how" before it influences your LLM's reasoning.

## A Note on Claims

This system does not claim to make text safe automatically. It does not prove that a clause is malicious. It does not guarantee that an LLM will ignore every persuasive cue.

What it does is create a deterministic boundary: rhetorical metadata cannot be treated as inseparable factual context. The synthesis stage receives labeled fields and must evaluate facticity separately from the stance associated with its source text.

Whether this decoupling reduces stance absorption in practice requires empirical testing. The architectural foundation is what this series builds. The evaluation is a separate, necessary investigation.

---

*This is Part 1 of 7 in the "SFL Engine: Hardening RAG Against Context Poisoning" series. Next: [Setting Up Your Agent Orchestration Layer](article-2-agent-orchestration.md).*
