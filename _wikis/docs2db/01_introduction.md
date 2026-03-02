---
layout: wiki-page
title: Introduction
hide_header: true
wiki_id: docs2db
page_id: introduction
permalink: "/wikis/docs2db/01-introduction/"
repository: https://github.com/b08x/docs2db
left_sidebar: wiki-nav
right_sidebar: toc
right_sidebar_xl_only: true
show_metadata: false
related_pages:
- id: quickstart
  url: "/wikis/docs2db/02-quickstart/"
  title: Quickstart
- id: system-architecture
  url: "/wikis/docs2db/03-system-architecture/"
  title: System Architecture
file_paths:
- path: README.md
  url: https://github.com/b08x/docs2db/blob/main/README.md
pagination:
  next:
    title: 02-quickstart
    url: "/wikis/docs2db/02-quickstart/"
---

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:
- [README.md](https://github.com/b08x/docs2db/blob/main/README.md)
- [src/docs2db/docs2db.py](https://github.com/b08x/docs2db/blob/main/src/docs2db/docs2db.py)
- [src/docs2db/chunks.py](https://github.com/b08x/docs2db/blob/main/src/docs2db/chunks.py)
- [src/docs2db/ingest.py](https://github.com/b08x/docs2db/blob/main/src/docs2db/ingest.py)
- [src/docs2db/multiproc.py](https://github.com/b08x/docs2db/blob/main/src/docs2db/multiproc.py)

</details>

# Introduction

docs2db is a command-line tool that transforms source documents into a Retrieval Augmented Generation (RAG) database. The system operates as a multi-stage pipeline that converts various document formats into vector embeddings stored in PostgreSQL, enabling hybrid search capabilities that combine semantic similarity with full-text search.

## System Overview

The architecture follows a sequential processing pipeline where each stage produces artifacts that subsequent stages consume. The pipeline consists of three primary processing stages: ingestion, chunking, and embedding. Each stage operates independently and produces intermediate files within a content directory structure that mirrors the source document hierarchy.

```
graph TD
    A[Source Documents] -->|ingest| B[source.json]
    B -->|chunk| C[chunks.json]
    C -->|embed| D[Vector Embeddings]
    D --> E[PostgreSQL Database]
    
    F[CLI Commands] -->|ingest| A
    F -->|chunk| B
    F -->|embed| C
    F -->|load| E
```

The CLI application defined in `docs2db.py` exposes commands that correspond to each pipeline stage. The `typer` framework provides the command-line interface with subcommands for `ingest`, `chunk`, `embed`, and `load` operations.

Sources: [src/docs2db/docs2db.py#L1-L30](), [README.md#L1-L50]()

## Core Components

### CLI Application Structure

The main application entry point uses Typer to define command handlers. Each command maps to a specific function that orchestrates the corresponding pipeline stage.

| Command | Function | Purpose |
|---------|----------|---------|
| `ingest` | `ingest_command()` | Convert documents to Docling JSON format |
| `chunk` | `generate_chunks()` | Split documents into contextually enriched chunks |
| `embed` | `generate_embeddings()` | Generate vector embeddings from chunks |
| `load` | `load_documents()` | Load embeddings into PostgreSQL |
| `db-start` | `start_database()` | Start the PostgreSQL container |
| `db-stop` | `stop_database()` | Stop the PostgreSQL container |

Sources: [src/docs2db/docs2db.py#L40-L150]()

### Pipeline Stage: Ingestion

The ingestion stage uses Docling to convert various document formats (PDF, HTML, Markdown, Word) into a standardized JSON representation. The conversion process is handled by a `DocumentConverter` singleton that is initialized once and reused across multiple files to minimize startup overhead.

```python
def _get_converter() -> Any:
    """Get or create the DocumentConverter singleton."""
    global _converter, _last_converter_settings
    
    current_settings = (
        settings.docling_pipeline,
        settings.docling_model,
        settings.docling_device,
        settings.docling_batch_size,
    )
    
    if _converter is not None and _last_converter_settings == current_settings:
        return _converter
```

Sources: [src/docs2db/ingest.py#L80-L120]()

The ingestion process:
1. Locates all ingestible files using `find_ingestible_files()`
2. Converts each file to Docling JSON format
3. Saves the result as `source.json` in a content directory
4. Stores processing metadata in `meta.json`

### Pipeline Stage: Chunking

The chunking stage uses `HybridChunker` from Docling to split documents into manageable pieces. The chunker supports configurable maximum token limits and peer merging for improved context continuity.

```python
# Create chunker and chunk document

chunker = HybridChunker(tokenizer=get_tokenizer(), merge_peers=True)
chunks_data = []

for chunk in chunker.chunk(dl_doc=dl_doc):
    structural_context_text = chunker.contextualize(chunk=chunk)
    chunk_text = structural_context_text.replace("\xa0", " ")
```

Sources: [src/docs2db/chunks.py#L200-L220]()

**Contextual Enrichment**: Optionally, an LLM generates semantic context for each chunk using a provider abstraction. The system supports multiple LLM providers:

| Provider | Configuration | Purpose |
|----------|---------------|---------|
| WatsonX | `watsonx_url`, `WATSONX_API_KEY`, `WATSONX_PROJECT_ID` | IBM WatsonX API |
| OpenAI | `openai_url`, `OPENAI_API_KEY` | OpenAI-compatible endpoints |
| OpenRouter | `openrouter_url`, `OPENROUTER_API_KEY` | Multi-provider aggregation |
| Mistral | `mistral_url`, `MISTRAL_API_KEY` | Mistral AI |

Sources: [src/docs2db/chunks.py#L50-L180]()

### Pipeline Stage: Embedding

The embedding stage generates vector representations of text chunks using various embedding models. The system supports multiple embedding models including `ibm-granite/granite-embedding-30m-english`, `e5-small-v2`, `slate-125m-english-rtrvr`, and others.

## Processing Flow

The following sequence diagram illustrates the document processing flow:

```sequenceDiagram
    participant User
    participant CLI as docs2db CLI
    participant Ingest as Ingestion Stage
    participant Chunk as Chunking Stage
    participant Embed as Embedding Stage
    participant DB as PostgreSQL
    
    User->>CLI: docs2db ingest
    CLI->>Ingest: find_ingestible_files()
    Ingest-->>CLI: source_files[]
    CLI->>Ingest: BatchProcessor.process_files()
    loop For each source file
        Ingest->>Ingest: DocumentConverter.convert()
        Ingest->>Ingest: Save source.json
    end
    Ingest-->>CLI: processed, errors
    
    User->>CLI: docs2db chunk
    CLI->>Chunk: find_source_files()
    Chunk-->>CLI: source_list[]
    CLI->>Chunk: BatchProcessor.process_files()
    loop For each source.json
        Chunk->>Chunk: HybridChunker.chunk()
        opt LLM enabled
            Chunk->>Chunk: LLMProvider.get_chunk_context()
        end
        Chunk->>Chunk: Save chunks.json
    end
    Chunk-->>CLI: chunked, errors
    
    User->>CLI: docs2db embed
    CLI->>Embed: find_chunk_files()
    CLI->>Embed: BatchProcessor.process_files()
    loop For each chunks.json
        Embed->>Embed: Generate embeddings
        Embed->>Embed: Save embeddings file
    end
    
    User->>CLI: docs2db load
    CLI->>DB: load_documents()
    DB-->>CLI: Success/Failure
```

Sources: [src/docs2db/docs2db.py#L150-L250](), [src/docs2db/ingest.py#L1-L50](), [src/docs2db/chunks.py#L1-L50]()

## Parallel Processing Architecture

The system uses `BatchProcessor` for parallel file processing. This class manages worker pools, progress tracking, and error handling across multiple processes.

```python
processor = BatchProcessor(
    worker_function=ingest_batch,
    worker_args=(str(source_root), force, pipeline, model, device, batch_size),
    progress_message="Ingesting files...",
    batch_size=settings.docling_batch_size,
    mem_threshold_mb=1500,
    max_workers=settings.docling_workers,
)

processed, errors = processor.process_files(source_files)
```

Sources: [src/docs2db/ingest.py#L100-L115]()

The `BatchProcessor` class:
- Manages worker pool creation and lifecycle
- Provides progress tracking via Rich console output
- Implements memory threshold checking to prevent OOM conditions
- Returns tuple of `(processed_count, error_count)`

Sources: [src/docs2db/multiproc.py#L1-L80]()

## Content Directory Structure

The system creates a content directory (default: `docs2db_content/`) that stores intermediate processing files. The directory structure mirrors the source document hierarchy:

```
docs2db_content/
├── path/
│   └── to/
│       └── document/
│           ├── source.json      # Docling ingested document
│           ├── chunks.json      # Text chunks with context
│           ├── gran.json        # Vector embeddings
│           └── meta.json        # Processing metadata
└── README.md
```

Each source file generates four associated files. The system tracks file modification times to enable incremental processing—unchanged files are automatically skipped in subsequent pipeline runs.

Sources: [README.md#L80-L120]()

## Configuration Mechanisms

Configuration is managed through multiple mechanisms:

1. **Environment variables** - API keys, database credentials
2. **`.env` file** - Local configuration overrides
3. **CLI options** - Command-specific parameters
4. **Settings object** - Runtime configuration singleton

The settings object maintains defaults for:
- Docling pipeline options (pipeline, model, device, batch_size, workers)
- LLM provider selection and endpoints
- Database connection parameters

Sources: [src/docs2db/docs2db.py#L30-L80]()

## Key Design Patterns

### Singleton Pattern for Converters

The document converter is implemented as a module-level singleton to avoid repeated initialization costs:

```python
global _converter, _last_converter_settings

if _converter is not None and _last_converter_settings == current_settings:
    return _converter
```

This pattern ensures that expensive model loading occurs once per session rather than per file.

Sources: [src/docs2db/ingest.py#L80-L85]()

### Provider Abstraction for LLM Integration

The chunking stage uses an abstract `LLMProvider` base class with concrete implementations for WatsonX, OpenAI, OpenRouter, and Mistral. This enables flexible provider selection without code changes:

```python
class LLMProvider(ABC):
    @abstractmethod
    def get_chunk_context(self, chunk_prompt: str) -> str:
        pass
    
    @abstractmethod
    def summarize_text(self, text: str) -> str:
        pass
```

Sources: [src/docs2db/chunks.py#L30-L60]()

### Incremental Processing

The system implements incremental processing by comparing file modification times:

```python
if not force and not is_chunks_stale(chunks_file, source_file):
    return chunks_file  # Skip processing
```

This design enables efficient updates in CI/CD pipelines where only changed documents require reprocessing.

Sources: [src/docs2db/chunks.py#L190-L200]()

## Database Integration

The final pipeline stage loads processed embeddings into PostgreSQL. The database schema includes:
- Vector similarity search via `pgvector` extension with HNSW indexes
- Full-text search via `tsvector` with GIN indexing for BM25-style ranking
- Schema versioning for tracking metadata and schema changes

The `load_documents()` function handles bulk insertion of embeddings with proper error handling and transaction management.

Sources: [README.md#L50-L70]()

## Structural Observations

The system demonstrates several architectural decisions worth noting:

1. **Separation of concerns** - Each pipeline stage operates independently, producing intermediate files that enable debugging and manual intervention at any stage.

2. **Provider flexibility** - The LLM provider abstraction supports multiple backends, though the implementation details vary significantly between providers (some use httpx clients, others use SDK-specific inference clients).

3. **Memory management** - The BatchProcessor includes memory threshold checking, suggesting awareness of the memory-intensive nature of document conversion and embedding generation.

4. **Idempotency** - The force flag and staleness checking provide control over reprocessing behavior, though the interaction between these mechanisms could benefit from more explicit documentation.

5. **Version control integration** - The README explicitly recommends committing the content directory to version control, indicating that the intermediate files are considered valuable artifacts rather than pure cache.

The absence of explicit error recovery mechanisms in the chunking and embedding stages represents a potential fragility point—individual file failures can halt batch processing without partial results being saved.

Sources: [README.md#L100-L110](), [src/docs2db/chunks.py#L200-L250](), [src/docs2db/multiproc.py#L50-L100]()

## Conclusion

The Introduction to docs2db reveals a well-structured RAG pipeline tool that transforms source documents into searchable vector databases through three distinct processing stages. The architecture prioritizes incremental processing, parallel execution, and provider flexibility. The system uses Docling for document conversion, multiple LLM providers for contextual enrichment, and PostgreSQL with pgvector for storage and retrieval.

The design patterns employed—singleton converters, provider abstractions, and incremental processing—reflect practical concerns for production deployment in CI/CD environments. The content directory structure provides transparency into processing artifacts while enabling manual intervention when automated processing fails.

The modular structure allows individual components to be used as a library, as evidenced by the documented import patterns for `ingest_file()` and `ingest_from_content()` functions. This flexibility supports both CLI-driven workflows and programmatic integration into larger systems.