---
title: MemexRAG
---

Alright, let's unpack this Memex-RAG system in Ruby. Standard RAG, bless its heart, has done wonders for factual recall. It grounds those verbose LLMs, turning their "closed-book" tests into "open-book" exams, which is a godsend for mitigating hallucinations and keeping things factually sound. But like any good tool, it has its limits. It's a reactive, transactional beast, designed to answer specific questions, not to facilitate the kind of non-linear knowledge exploration or serendipitous discovery that true knowledge work demands. It's fundamentally stateless, an ephemeral interaction with no memory of your intellectual journey.

Enter Vannevar Bush, nearly eight decades ago, who already saw this coming. He knew our minds don't just index; they *associate*. His vision for the Memex was precisely about building a "mechanized, private supplement to human memory," operating by association and allowing users to forge persistent "associative trails" through information. This wasn't about mere retrieval; it was about *knowledge construction*.

The brilliance of the Memex-RAG fusion is that it bridges this 80-year gap, creating a system that marries the automated semantic power of modern RAG with the human-curated, associative structure of the Memex. It's where the machines find the atomic data, and we, the actual humans, make the molecular connections, creating a "living" knowledge base that grows more valuable and interconnected with every user interaction. This transforms the user from a passive questioner into an active "trail blazer". And for us Rubyists, there's a beautifully idiomatic stack ready to make this happen.

[diagram](sys-arch-v1.html)

Let's dissect the architectural blueprint:

### 1. The RAG Foundation: Building the Semantic Retrieval Engine

The system proposes a robust RAG pipeline, which is the high-performance engine for finding those "atomic" units of information.

#### Data Ingestion and Semantic Enrichment: No "Garbage In" Allowed

The efficacy of any RAG system lives and dies by the quality of its input. "Garbage in, garbage out" has never been truer here. Naive fixed-size chunking just won't cut it; you're just begging to sever sentences mid-thought or combine unrelated ideas, degrading the semantic signal. We need precision.

The recommended approach is a sophisticated, two-stage hybrid preprocessing pipeline:

* **`pragmatic_segmenter`**: This gem is your front-line defense, a rule-based sentence boundary detection library. It's robust, handling ill-formatted text and multiple languages without complex machine learning models, ensuring clean, coherent sentence-level chunks from the get-go. It's the perfect tool for initial, coarse-grained chunking.
* **`ruby-spacy`**: Once we have clean sentences, we bring in the heavy artillery. `ruby-spacy` wraps Python's powerful spaCy, offering deep linguistic analysis capabilities like tokenization, part-of-speech tagging, named-entity recognition (NER), and dependency parsing. This extracts rich metadata (people, organizations, locations) that can be stored alongside the vector embeddings.

This two-stage process enables a powerful "filter-then-fetch" retrieval pattern. You first perform a precise relational query on the extracted metadata to narrow down the search space, *then* execute a semantic vector search within that refined subset. This dramatically improves retrieval precision, mitigating semantic drift in large knowledge bases. It's a pragmatic synergy that neither tool provides in isolation.

#### Embedding Generation: Local First, Cloud Flexible

Embeddings are the cornerstone of semantic search, turning text into high-dimensional numerical vectors that capture its meaning. This is a critical architectural decision.

* **API-based models** (via `ruby_llm` or `langchainrb`): Provide immediate access to cutting-edge models from providers like OpenAI, Anthropic, or Google. Simple to use, but watch those API costs, network latency, and, critically, data privacy concerns with sensitive information leaving your environment.
* **Local models** (via `informers`, `transformers-rb`, `red-candle`): Allow you to run transformer models like `all-MiniLM-L6-v2` directly within your Ruby application. The benefits here are massive: complete data privacy, no per-call costs, and reduced latency. The trade-off is managing larger model files and computational resources.

For the Memex-RAG system, a hybrid strategy is the clear winner. Use `informers` for bulk embedding the core knowledge base. This is your privacy-preserving, cost-effective workhorse. Reserve the flexibility and brute-force power of API-based models via `ruby_llm` for dynamic tasks, like embedding user queries on-the-fly or for specialized generative tasks. It's a pragmatic balance of security, cost, and performance.

#### Vector Storage and High-Performance Retrieval: PostgreSQL, the Unsung Hero

Once documents are chunked and embedded, we need a place to store those vectors for efficient similarity search. While dedicated vector databases exist, for many Ruby on Rails applications, the answer is often right under your nose: PostgreSQL, augmented with the `pgvector` extension.

* **`pgvector`**: This open-source extension adds a vector data type to PostgreSQL and provides functions for L2 distance, inner product, and cosine distance searches. Crucially, it supports Approximate Nearest Neighbor (ANN) search with indexing methods like HNSW and IVFFlat, trading a smidgen of perfect recall for a massive gain in speed on large datasets.
* **`neighbor`**: To integrate `pgvector` seamlessly into Rails, the `neighbor` gem is an absolute must-have. It provides a clean, ActiveRecord-native interface (think `has_neighbors` and `nearest_neighbors`) that abstracts away the underlying SQL, making vector search feel natural within your Rails application.

The key advantage here is architectural simplicity. Consolidating both standard relational data (e.g., users, trails) and vector data into a single, robust database reduces operational overhead. It also enables powerful, unified queries that can combine traditional metadata filtering with semantic vector search in a single SQL statement. One less database to babysit, fewer late-night pager calls, and more coherent SQL.

#### LLM Orchestration and Structured Generation: The `ruby_llm` Ecosystem

The final piece of the RAG puzzle is the orchestration layer, managing interactions with the LLM. Here, the `ruby_llm` gem and its ecosystem are the clear architectural choice, embracing the Ruby community's preference for composable, focused tools.

* **`ruby_llm`**: This gem is the central nervous system, offering "one beautiful Ruby API" for a multitude of LLM providers (OpenAI, Anthropic, Google Gemini, Ollama, etc.). This provider-agnostic design is a critical strategic advantage, preventing vendor lock-in and allowing you to route different tasks to the most appropriate model. It supports real-time streaming, multi-modal inputs (images, audio, PDFs), and has a built-in Rails `acts_as_chat` concern.
* **`ruby_llm-schema`**: A cornerstone for the Memex vision is programmatically creating and managing associative trails. This requires structured, predictable output from the LLM, not just free-form text. `ruby_llm-schema` provides a Rails-inspired DSL for creating JSON schemas directly in Ruby. By passing a schema to the LLM call, you transform the LLM from a mere text generator into a reliable component in a data processing pipeline, ensuring AI-generated contributions are programmatically usable for your knowledge graph. This is actively *directing* AI to perform structured data manipulation, a far more powerful paradigm.
* **`ruby_llm-mcp`**: To elevate the system to a true intelligent agent, the Model Context Protocol (MCP) is integrated. The `ruby_llm-mcp` gem brings this capability, allowing the application to connect to MCP servers and utilize external tools (like a `live_web_search` or `query_internal_api`) and resources (real-time data) as part of an LLM conversation. This is crucial for building advanced agentic workflows, overcoming the static knowledge limitations of standard RAG, and creating a "self-healing and continuously improving knowledge base".

The argument that "an LLM client shouldn't also be trying to be your vector database" is particularly compelling. This compositional approach leads to a cleaner, more idiomatic, and ultimately more scalable architecture with a clear separation of concerns.

### 2. Engineering Associative Trails: The Memex Core

Now, the Memex trails themselves. This is where things get interesting, and where the relational model starts showing its age when you push it too hard. Conventional RAG operates on ephemeral, ordered lists. The Memex, in stark contrast, demands a persistent network of explicit, user-defined connections.

#### The Challenge of Representing Association

The data model for associative trails needs to capture:

* **Nodes**: The fundamental units of information, primarily `DocumentChunk` records.
* **Edges**: Directed links from a source node to a target node, forming the basic unit of association.
* **Trails**: Named, ordered sequences of these edges, representing a complete thought process.
* **Annotations**: User-generated comments or notes attached to nodes or edges within a trail's context.

#### Data Modeling Strategies: A Phased, Hybrid Approach

Trying to force a truly graph-like structure into a purely relational model is like trying to hammer a square peg into a round hole... repeatedly, with recursive CTEs. You *can* do it, but at what cost to your sanity and query performance?

1. **PostgreSQL (Relational)**: The pragmatic starting point for an MVP. You model trails with tables like `documents`, `trails`, and a crucial `trail_links` join table that stores `source_document_id`, `target_document_id`, `trail_id`, position, and annotations. It integrates seamlessly with ActiveRecord/Sequel. However, complex graph traversal queries (e.g., "find all documents reachable from X within three steps") become notoriously difficult, slow, and hard to maintain with recursive SQL queries.
2. **Neo4j (Graph-Native)**: This is the ideal long-term target. A dedicated graph database like Neo4j is purpose-built for highly interconnected data. Documents become nodes, and trails become relationships, queryable naturally and efficiently with the Cypher language. The `activegraph` gem provides a high-level OGM for Ruby. The main drawback? Introducing a second database increases operational complexity.
3. **Redis (Key-Value)**: A lightweight option for simple write/read operations (e.g., fetching all documents in a trail as a list). It's fast for what it does, and often already in a Rails stack. But its querying capabilities are severely limited, making complex traversals or "find which trails contain document X" queries highly inefficient. Not for persistent, analytical trail storage.

The pragmatic architectural recommendation is a **phased, two-database approach**. Start with an all-PostgreSQL model for the MVP to keep things simple and accelerate initial development. Crucially, encapsulate all trail management logic in dedicated Service Objects from the outset. This creates a clean abstraction, making the future migration to a dedicated graph database like Neo4j (using `activegraph`) a contained and predictable engineering task when advanced graph query capabilities become necessary. Don't paint yourself into a corner with an MVP, but don't over-engineer from day one either.

#### Advanced Graph Algorithms with `rgl`

Even with persistent storage, sometimes you need to do complex, ad-hoc graph analysis in memory. The Ruby Graph Library (`rgl`) steps in here, offering implementations of algorithms like Breadth-First Search (BFS), Depth-First Search (DFS), topological sorting, and Dijkstra's shortest path. You can load a subset of the trail data into an `rgl` graph object to, say, find the shortest path between two documents across different trails, or detect cycles, without burdening the primary database with these intensive computations.

### 3. System Integration and Advanced Architectural Considerations

The true power of Memex-RAG unfolds in the integration layer, orchestrating seamless interaction between automated RAG and human-curated Memex trails. It's not just RAG; it's RAG *with purpose*, RAG *with memory*.

#### Fusing Retrieval and Association: Query and Traversal Flows

Two primary flows define this synergy:

1. **Query Flow (RAG → Memex)**: A user submits a query. The RAG system does its thing (embed, retrieve chunks, generate answer). The integration layer then queries the associative trail database for *each source document* and displays not just the answer and sources, but also a list of trails those sources belong to. This allows the user to instantly pivot from a specific fact to a broader, curated context.
2. **Traversal Flow (Memex → RAG)**: A user is navigating an existing trail and poses a contextual question. The application captures the context of their current position within the trail (e.g., trail name, summary, recent documents). This rich contextual information is prepended to the user's query, augmenting the prompt for the RAG system. The retrieval step is now biased by the trail's context, yielding a much more relevant and nuanced answer tailored to the user's current line of inquiry.

#### The Imperative of Asynchronous Processing: Scaling for LLM Workloads

This is a critical, and often overlooked, architectural decision for any application involving LLMs. LLM interactions, especially streaming responses, are I/O-bound operations that can hold connections open for seconds, even minutes.

In a traditional, multi-threaded Ruby web server like Puma, this is a significant scaling bottleneck. Threads block while waiting for I/O, meaning your server can only handle a handful of concurrent LLM requests (e.g., 25 with a typical pool size) before users are stuck in a queue.

The solution is a shift to a cooperative, fiber-based concurrency model, enabled by Ruby 3's native Fiber Scheduler:

* **`async` gem**: When a Fiber encounters a blocking I/O operation (like an HTTP request to an LLM API), it voluntarily yields control, allowing another Fiber to execute on the same OS thread. This means a single thread can manage thousands of concurrent I/O-bound operations.
* **`falcon` web server**: Built on `async`, Falcon handles each incoming request in a lightweight Fiber, making it exceptionally well-suited for applications with many long-lived, I/O-heavy connections, such as LLM streaming.
* **`async-job` gem**: For background job processing, this provides an Active Job adapter that executes jobs in Fibers instead of threads, offering dramatically higher concurrency for I/O-bound tasks.

This asynchronous architecture isn't merely an optimization; it is a *fundamental requirement* for building a scalable, performant, and responsive Memex-RAG system. Ignoring this will result in a system that functions at a small scale but will inevitably fail to meet real-world demands.

#### Containerization Strategy for Development and Deployment

To ensure a consistent, reproducible, and scalable environment, Docker containerization is highly recommended.

* **`pgvector` Database**: Use pre-built Docker images like `ankane/pgvector` for PostgreSQL, simplifying setup.
* **`ruby-spacy` as a Microservice**: Encapsulate the Python `spaCy` functionality into a dedicated, containerized microservice with a REST API (e.g., `jgontrum/spacyapi`). This isolates the Python environment from the main Rails app, improves scalability, and allows the Rails app to communicate via simple HTTP requests using a client like `faraday`. This service-oriented approach simplifies the primary Rails Dockerfile and allows independent scaling.

#### The Memex Interface: A Command-Line Workspace

While a fancy GUI is a long-term goal, a well-designed Command-Line Interface (CLI) offers a powerful, direct, and efficient way to interact with the core Memex functionality for initial development and power users. It embodies the spirit of Bush's focused "desk".

The `tty-toolkit` is an exceptional suite of Ruby gems for building interactive and beautiful terminal applications:

* **`tty-prompt`**: For creating menus, selection lists, confirmation prompts, and validated text inputs for core operations like trail creation, linking, and annotation.
* **`tty-table`**: For displaying structured information, like ranked search results or documents within a trail, in well-formatted ASCII tables.
* **`tty-progressbar`**: For providing crucial user feedback with animated progress bars during long-running asynchronous operations like initial ingestion and embedding.

Composing these tools creates a highly functional and aesthetically pleasing CLI, serving as a powerful interface for early adopters and a solid foundation for defining future GUI interactions.

In conclusion, the Memex-RAG system in Ruby is not just an incremental improvement; it's a strategic leap towards knowledge tools that mirror the associative nature of human thought. By embracing a modern, composable Ruby stack and explicitly tackling the inherent architectural challenges, this blueprint provides a durable and scalable foundation for a platform that moves beyond merely providing facts to actively helping us build wisdom.
