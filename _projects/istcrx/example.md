---
layout: post
title: Example Code
category: 
author: Robert Pannick with Claude 3.7-Sonnet
thumbnail:
tags: []
description: ""
images:
  lightbox2: true
  photoswipe: true
  spotlight: true
  venobox: true
related_posts: true
giscus_comments: true
tabs: true
---


| Gem                 | Description                                                                                                    |
| :------------------ | :------------------------------------------------------------------------------------------------------------- |
| `RubyLLM`           | unified interface to interact with various LLM providers, offering a Ruby-like experience for AI operations.   |
| `prompt_manager`    | Manages parameterized prompts, allowing storage and retrieval using different adapters like FileSystemAdapter. |
| `ruby-spacy`        | A wrapper for spaCy, enabling natural language processing capabilities in Ruby via PyCall.                     |
| `langchain-rb`      | Facilitates building LLM-powered applications in Ruby, including prompt templates and orchestration.           |
| `Ohm & ohm-contrib` | An object-hash mapping library for Redis, allowing model-based interaction with Redis data.                    |
| `Jongleur`          | A process scheduler and manager for orchestrating concurrent agents and tasks with state tracking.             |
| `Informers`         | Enables fast transformer-based inference (embeddings and reranking) natively in Ruby.                          |

Absolutely! Let's translate your comprehensive CrewAI automation plan into a Ruby-centric implementation using the following gems:

* **RubyLLM**: Provides a unified interface to interact with various LLM providers, offering a Ruby-like experience for AI operations.
* **prompt\_manager**: Manages parameterized prompts, allowing storage and retrieval using different adapters like FileSystemAdapter.
* **ruby-spacy**: A wrapper for spaCy, enabling natural language processing capabilities in Ruby via PyCall.
* **langchain-rb**: Facilitates building LLM-powered applications in Ruby, including prompt templates and orchestration.
* **Ohm & ohm-contrib**: An object-hash mapping library for Redis, allowing model-based interaction with Redis data.
* **Jongleur**: A process scheduler and manager for orchestrating concurrent agents and tasks with state tracking.
* **Informers**: Enables fast transformer-based inference (embeddings and reranking) natively in Ruby.

---

### 🯡 Gemfile Setup

```ruby
# Gemfile

gem 'ruby_llm'
gem 'prompt_manager'
gem 'ruby-spacy'
gem 'langchain'
gem 'ohm'
gem 'ohm-contrib'
gem 'jongleur'
gem 'informers'
```

---

### 🧠 Agent Definitions

#### Redis Models for Agents, Tasks, Snapshots, and Tickets

```ruby
require 'ohm'
require 'ohm/contrib'

class Agent < Ohm::Model
  include Ohm::Callbacks
  include Ohm::Timestamps

  attribute :name
  attribute :role
  attribute :state
  index :name
end

class TaskModel < Ohm::Model
  include Ohm::Callbacks
  include Ohm::Timestamps

  attribute :name
  attribute :status
  attribute :agent_id
  index :name
end

class SystemSnapshot < Ohm::Model
  include Ohm::Callbacks
  include Ohm::Timestamps

  attribute :hostname
  attribute :data
  index :hostname
end

class SupportTicket < Ohm::Model
  include Ohm::Callbacks
  include Ohm::Timestamps

  attribute :summary
  attribute :status
  attribute :response
end
```

#### 1. **Checkup Automation Agent**

```ruby
class CheckupAutomationAgent
  def run_checkup(host_inventory, playbooks, multimodal_docs, existing_tickets)
    system_facts = execute_playbooks(host_inventory, playbooks)
    additional_data = process_additional_inputs(multimodal_docs, existing_tickets)
    snapshot_data = system_facts.merge(additional_data)

    snapshot = SystemSnapshot.create(
      hostname: host_inventory[:hostname],
      data: snapshot_data.to_json
    )

    snapshot
  end

  private

  def execute_playbooks(host_inventory, playbooks)
    {
      hostname: host_inventory[:hostname],
      OS: 'Ubuntu 20.04',
      RAM: '16GB',
      Disk: '512GB',
      CPU_usage: '35%',
      network_info: 'eth0: 192.168.1.10'
    }
  end

  def process_additional_inputs(multimodal_docs, existing_tickets)
    {
      screenshots: multimodal_docs[:screenshots],
      screencasts: multimodal_docs[:screencasts],
      ticket_excerpts: existing_tickets.map { |ticket| ticket[:excerpt] }
    }
  end
end
```

#### 2. **BM25 Pre-Filter Agent**

```ruby
class BM25PreFilterAgent
  def initialize(kb_index)
    @kb_index = kb_index
  end

  def retrieve_matches(support_query)
    @kb_index.select { |doc| doc[:content].include?(support_query) }
  end
end
```

#### 3. **Semantic RAG Retriever Agent (Informers)**

```ruby
require 'informers'

class SemanticRAGRetrieverAgent
  def initialize(model_name = "sentence-transformers/all-MiniLM-L6-v2")
    @model = Informers.pipeline("embedding", model_name)
  end

  def retrieve_semantic_matches(support_query, documents)
    query_embedding = @model.call([support_query]).first
    ranked = documents.map do |doc|
      doc_embedding = @model.call([doc[:content]]).first
      similarity = cosine_similarity(query_embedding, doc_embedding)
      doc.merge(similarity: similarity)
    end
    ranked.sort_by { |doc| -doc[:similarity] }
  end

  private

  def cosine_similarity(a, b)
    dot = a.zip(b).map { |x, y| x * y }.sum
    norm_a = Math.sqrt(a.map { |x| x**2 }.sum)
    norm_b = Math.sqrt(b.map { |x| x**2 }.sum)
    dot / (norm_a * norm_b)
  end
end
```

#### 4. **Data Merger & Context Composer Agent**

```ruby
class DataMergerContextComposerAgent
  def merge_contexts(system_snapshot, bm25_results, semantic_results)
    {
      system_health: JSON.parse(system_snapshot.data),
      bm25_results: bm25_results,
      semantic_results: semantic_results
    }
  end
end
```

#### 5. **Diagnostic Summarizer Agent**

```ruby
class DiagnosticSummarizerAgent
  def initialize
    @llm = Langchain::LLM::OpenAI.new(api_key: ENV['OPENAI_API_KEY'])
  end

  def summarize(context)
    prompt_template = Langchain::Prompt::PromptTemplate.new(
      template: "Given the following context: {context}, provide a diagnostic summary highlighting key issues and remediation steps.",
      input_variables: ["context"]
    )
    prompt = prompt_template.format(context: context.to_json)
    @llm.chat(prompt)
  end
end
```

#### 6. **Ticket Response Generator Agent**

```ruby
class TicketResponseGeneratorAgent
  def initialize
    @llm = Langchain::LLM::OpenAI.new(api_key: ENV['OPENAI_API_KEY'])
  end

  def generate_response(diagnostic_summary)
    prompt_template = Langchain::Prompt::PromptTemplate.new(
      template: "Based on the diagnostic summary: {summary}, draft a support ticket response with troubleshooting steps and KB references.",
      input_variables: ["summary"]
    )
    prompt = prompt_template.format(summary: diagnostic_summary)
    @llm.chat(prompt)
  end
end
```

#### 7. **Human-In-The-Loop (HITL) Agent**

```ruby
class HITLAgent
  def review(context, diagnostic_summary, ticket_response)
    puts "Reviewing context: #{context}"
    puts "Diagnostic Summary: #{diagnostic_summary}"
    puts "Ticket Response: #{ticket_response}"
    true
  end
end
```

---

### 🔄 Workflow Orchestration with Jongleur

```ruby
require 'jongleur'
Ohm.connect(url: "redis://localhost:6379")

scheduler = Jongleur::Scheduler.new

scheduler.run do
  task :checkup do
    CheckupAutomationAgent.new.run_checkup(host_inventory, playbooks, multimodal_docs, existing_tickets)
  end

  task :bm25 do
    BM25PreFilterAgent.new(kb_index).retrieve_matches(support_query)
  end

  task :semantic do
    SemanticRAGRetrieverAgent.new.retrieve_semantic_matches(support_query, kb_index)
  end

  task :compose_context, depends_on: [:checkup, :bm25, :semantic] do |results|
    DataMergerContextComposerAgent.new.merge_contexts(results[:checkup], results[:bm25], results[:semantic])
  end

  task :summarize, depends_on: [:compose_context] do |results|
    DiagnosticSummarizerAgent.new.summarize(results[:compose_context])
  end

  task :generate_response, depends_on: [:summarize] do |results|
    TicketResponseGeneratorAgent.new.generate_response(results[:summarize])
  end

  task :review_and_store, depends_on: [:compose_context, :summarize, :generate_response] do |results|
    if HITLAgent.new.review(results[:compose_context], results[:summarize], results[:generate_response])
      ticket = SupportTicket.create(summary: results[:summarize], status: 'open', response: results[:generate_response])
      puts "Workflow approved. Ticket #{ticket.id} created."
    else
      puts "Workflow requires adjustments."
    end
  end
end

scheduler.start
```

---

This implementation introduces Redis-native models using Ohm to persist system snapshots, tickets, agents, and tasks—enhanced by Jongleur to manage and coordinate asynchronous agent execution with dependency tracking. We now leverage `Informers` for performant embedding-based retrieval using pre-trained transformer models—fully in Ruby.
