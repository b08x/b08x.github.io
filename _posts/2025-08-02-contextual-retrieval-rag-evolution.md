---
layout: post
title: "Contextual Retrieval: The Next Evolution of RAG Systems"
description: "How Anthropic's contextual retrieval technique dramatically improves RAG performance by solving the context destruction problem"
categories: [ai-ml, rag]
tags: [rag, retrieval-augmented-generation, contextual-retrieval, anthropic, llm, embeddings, bm25, ai-applications]
date: 2025-08-02
author: "b08x"
reading_time: 15
excerpt: "Traditional RAG systems lose crucial context when splitting documents into chunks. Contextual Retrieval solves this by adding contextual information to each chunk, reducing retrieval failures by up to 67%."
---

# Contextual Retrieval: The Next Evolution of RAG Systems

Retrieval-Augmented Generation (RAG) has become the gold standard for giving AI models access to specific knowledge bases. But traditional RAG systems have a fundamental flaw: they **destroy context** when splitting documents into chunks. Anthropic's new **Contextual Retrieval** technique solves this problem, dramatically improving retrieval accuracy while maintaining the scalability benefits of RAG.

<hr class="section-divider">

## The Context Problem in Traditional RAG

Traditional RAG works by breaking documents into small chunks (typically a few hundred tokens), embedding them, and storing them in a vector database. When a user asks a question, the system retrieves the most semantically similar chunks and uses them to generate an answer.

**The problem**: Individual chunks often lack sufficient context to be properly retrieved or understood.

Consider this example from SEC filings:

<div class="demo-card p-6">
  <div class="grid md:grid-cols-2 gap-6">
    <div>
      <h4 class="text-lg font-medium text-red-600 mb-3">❌ Original Chunk (Context-Free)</h4>
      <div class="code-block">
"The company's revenue grew by 3% over the previous quarter."
      </div>
      <p class="text-sm text-gray-600 mt-2">
        Which company? Which quarter? This chunk is nearly useless without context.
      </p>
    </div>
    <div>
      <h4 class="text-lg font-medium text-green-600 mb-3">✅ Contextual Chunk</h4>
      <div class="code-block">
"This chunk is from an SEC filing on ACME corp's performance in Q2 2023; the previous quarter's revenue was $314 million. The company's revenue grew by 3% over the previous quarter."
      </div>
      <p class="text-sm text-gray-600 mt-2">
        Now the chunk contains all necessary context for accurate retrieval and understanding.
      </p>
    </div>
  </div>
</div>

<hr class="section-divider">

## How Contextual Retrieval Works

Contextual Retrieval solves the context problem by **prepending chunk-specific explanatory context** to each chunk before embedding and indexing. This context is generated automatically using Claude.

### The Process

<div class="demo-card p-6">
  <h4 class="text-lg font-medium mb-4">Contextual Retrieval Pipeline</h4>
  
  <ol class="list-decimal list-inside space-y-3">
    <li><strong>Document Chunking:</strong> Split documents into manageable chunks (same as traditional RAG)</li>
    <li><strong>Context Generation:</strong> Use Claude to generate concise context for each chunk</li>
    <li><strong>Context Prepending:</strong> Add the generated context to the beginning of each chunk</li>
    <li><strong>Enhanced Indexing:</strong> Create both embeddings and BM25 indices with the contextualized chunks</li>
    <li><strong>Improved Retrieval:</strong> Query against the enhanced index for better results</li>
  </ol>
</div>

### The Context Generation Prompt

Anthropic uses this simple but effective prompt with Claude 3 Haiku:

```xml
<document> 
{{WHOLE_DOCUMENT}} 
</document> 

Here is the chunk we want to situate within the whole document 
<chunk> 
{{CHUNK_CONTENT}} 
</chunk> 

Please give a short succinct context to situate this chunk within the overall document for the purposes of improving search retrieval of the chunk. Answer only with the succinct context and nothing else.
```

This generates 50-100 tokens of context that situate each chunk within its document, dramatically improving retrieval accuracy.

<hr class="section-divider">

## Performance Improvements

The results are impressive:

<div class="demo-card p-6">
  <ul class="feature-list">
    <li>
      <div class="feature-icon">📈</div>
      <div class="feature-content">
        <span class="feature-title">Contextual Embeddings:</span> 35% reduction in retrieval failure rate (5.7% → 3.7%)
      </div>
    </li>
    <li>
      <div class="feature-icon">🎯</div>
      <div class="feature-content">
        <span class="feature-title">Contextual Embeddings + BM25:</span> 49% reduction in retrieval failure rate (5.7% → 2.9%)
      </div>
    </li>
    <li>
      <div class="feature-icon">🚀</div>
      <div class="feature-content">
        <span class="feature-title">With Reranking:</span> 67% reduction in retrieval failure rate (5.7% → 1.9%)
      </div>
    </li>
  </ul>
</div>

These improvements translate directly to better user experiences—fewer "I don't know" responses and more accurate answers.

<hr class="section-divider">

## The Power of BM25 + Embeddings

Contextual Retrieval works even better when combined with both **semantic embeddings** and **lexical matching** via BM25 (Best Matching 25).

### Why Both Matter

<div class="demo-card p-6">
  <div class="grid md:grid-cols-2 gap-6">
    <div>
      <h4 class="text-lg font-medium mb-3">🧠 Semantic Embeddings</h4>
      <ul class="space-y-2 text-sm">
        <li>• Capture meaning and concepts</li>
        <li>• Handle synonyms and paraphrasing</li>
        <li>• Good for conceptual queries</li>
        <li>• May miss exact term matches</li>
      </ul>
    </div>
    <div>
      <h4 class="text-lg font-medium mb-3">🔍 BM25 (Lexical Matching)</h4>
      <ul class="space-y-2 text-sm">
        <li>• Precise word/phrase matching</li>
        <li>• Excellent for technical terms</li>
        <li>• Handles unique identifiers well</li>
        <li>• May miss semantic relationships</li>
      </ul>
    </div>
  </div>
</div>

**Example**: For the query "Error code TS-999", embeddings might find general error documentation, while BM25 finds the exact "TS-999" reference. Combining both approaches captures the best of both worlds.

### BM25 Explained

BM25 builds on TF-IDF (Term Frequency-Inverse Document Frequency) but adds:

- **Document length normalization** - Prevents long documents from dominating
- **Term frequency saturation** - Diminishing returns for repeated terms
- **Tunable parameters** - k1 and b parameters for fine-tuning

```ruby
# Simplified BM25 scoring concept
def bm25_score(term, document, corpus)
  tf = term_frequency(term, document)
  idf = inverse_document_frequency(term, corpus)
  doc_length = document.length
  avg_doc_length = corpus.average_document_length
  
  # BM25 formula with saturation and normalization
  numerator = tf * (k1 + 1)
  denominator = tf + k1 * (1 - b + b * (doc_length / avg_doc_length))
  
  idf * (numerator / denominator)
end
```

<hr class="section-divider">

## Cost Optimization with Prompt Caching

One concern with Contextual Retrieval is cost—you need to process each chunk with the full document as context. Anthropic solves this with **prompt caching**.

### How Prompt Caching Works

<div class="demo-card p-6">
  <ol class="list-decimal list-inside space-y-2">
    <li><strong>Cache the document once:</strong> Load the full document into Claude's cache</li>
    <li><strong>Reference cached content:</strong> For each chunk, reference the cached document</li>
    <li><strong>Process chunks efficiently:</strong> Only pay for the new chunk content + context generation</li>
  </ol>
</div>

**Cost breakdown** (assuming 800-token chunks, 8k-token documents):

- One-time cost: **$1.02 per million document tokens**
- Massive savings compared to processing full documents repeatedly

<hr class="section-divider">

## Adding Reranking for Maximum Performance

For even better results, Contextual Retrieval can be combined with **reranking**:

<div class="demo-card p-6">
  <h4 class="text-lg font-medium mb-4">Reranking Process</h4>
  
  <ol class="list-decimal list-inside space-y-2">
    <li><strong>Initial Retrieval:</strong> Get top 150 potentially relevant chunks</li>
    <li><strong>Rerank with Specialized Model:</strong> Use Cohere or Voyage reranker</li>
    <li><strong>Select Top Results:</strong> Choose the top 20 most relevant chunks</li>
    <li><strong>Generate Final Response:</strong> Use the refined context for generation</li>
  </ol>
</div>

Reranking adds latency but provides the best possible results—useful for high-stakes applications where accuracy is paramount.

<hr class="section-divider">

## Implementation Considerations

When implementing Contextual Retrieval, consider:

### Chunk Boundaries

<div class="demo-card p-6">
  <ul class="feature-list">
    <li>
      <div class="feature-icon">📏</div>
      <div class="feature-content">
        <span class="feature-title">Chunk Size:</span> Balance between context and specificity (typically 200-800 tokens)
      </div>
    </li>
    <li>
      <div class="feature-icon">🔀</div>
      <div class="feature-content">
        <span class="feature-title">Overlap:</span> Consider overlapping chunks to prevent boundary issues
      </div>
    </li>
    <li>
      <div class="feature-icon">📝</div>
      <div class="feature-content">
        <span class="feature-title">Natural Boundaries:</span> Split on paragraphs or sections when possible
      </div>
    </li>
  </ul>
</div>

### Model Selection

**Embedding Models**: Anthropic found **Gemini** and **Voyage** embeddings particularly effective with Contextual Retrieval.

**Context Generation**: **Claude 3 Haiku** provides the best balance of cost and quality for context generation.

### Custom Contextualizer Prompts

While the generic prompt works well, domain-specific prompts can improve results:

```xml
<!-- For Technical Documentation -->
<document>{{WHOLE_DOCUMENT}}</document>

<chunk>{{CHUNK_CONTENT}}</chunk>

Provide concise technical context for this chunk, including:
- The system/component being discussed
- The technical domain (API, database, deployment, etc.)
- Any relevant version or environment information

Keep context under 100 tokens and focus on information that would help developers find this content.
```

<hr class="section-divider">

## Ruby Implementation Example

Here's how you might implement Contextual Retrieval in Ruby:

```ruby
require 'ruby_llm'
require 'tf-idf-similarity'
require 'pgvector'

class ContextualRAG
  def initialize
    @llm = RubyLLM::Anthropic.new(api_key: ENV['ANTHROPIC_API_KEY'])
    @embeddings = PgVector::Client.new
    @bm25 = TfIdfSimilarity::BM25Model.new
  end

  def index_document(document)
    chunks = chunk_document(document)
    
    contextualized_chunks = chunks.map do |chunk|
      context = generate_context(document, chunk)
      "#{context} #{chunk}"
    end
    
    # Create both embeddings and BM25 index
    contextualized_chunks.each_with_index do |chunk, idx|
      @embeddings.add_document(chunk, metadata: { original_idx: idx })
      @bm25.add_document(chunk)
    end
  end

  def query(question, top_k: 20)
    # Combine embedding and BM25 results
    embedding_results = @embeddings.similarity_search(question, k: top_k)
    bm25_results = @bm25.find_similar(question, limit: top_k)
    
    # Merge and deduplicate results
    merged_results = merge_and_rank(embedding_results, bm25_results)
    
    # Build context and generate response
    context = merged_results.first(top_k).join("\n\n")
    @llm.complete(build_prompt(question, context))
  end

  private

  def generate_context(document, chunk)
    prompt = build_context_prompt(document, chunk)
    
    # Use prompt caching for cost efficiency
    @llm.complete(prompt, cache: document_cache_key(document))
  end

  def build_context_prompt(document, chunk)
    <<~PROMPT
      <document>
      #{document}
      </document>

      Here is the chunk we want to situate within the whole document:
      <chunk>
      #{chunk}
      </chunk>

      Please give a short succinct context to situate this chunk within the overall document for the purposes of improving search retrieval of the chunk. Answer only with the succinct context and nothing else.
    PROMPT
  end

  def chunk_document(document)
    # Simple sentence-based chunking
    sentences = document.split(/[.!?]+/)
    sentences.each_slice(5).map(&:join)
  end

  def merge_and_rank(embedding_results, bm25_results)
    # Implement rank fusion (RRF or similar)
    # This is a simplified version
    all_results = (embedding_results + bm25_results).uniq
    all_results.sort_by { |result| combined_score(result) }.reverse
  end
end
```

<hr class="section-divider">

## When to Use Contextual Retrieval

### Perfect For

<div class="demo-card p-6">
  <ul class="feature-list">
    <li>
      <div class="feature-icon">📚</div>
      <div class="feature-content">
        <span class="feature-title">Large Knowledge Bases:</span> Technical documentation, legal documents, research papers
      </div>
    </li>
    <li>
      <div class="feature-icon">🎯</div>
      <div class="feature-content">
        <span class="feature-title">High-Accuracy Requirements:</span> Customer support, compliance, medical information
      </div>
    </li>
    <li>
      <div class="feature-icon">🔍</div>
      <div class="feature-content">
        <span class="feature-title">Complex Queries:</span> Multi-step reasoning, context-dependent questions
      </div>
    </li>
    <li>
      <div class="feature-icon">📊</div>
      <div class="feature-content">
        <span class="feature-title">Structured Content:</span> Reports, manuals, procedural documents
      </div>
    </li>
  </ul>
</div>

### Alternative Approaches

**For smaller knowledge bases** (< 200K tokens): Consider using the entire knowledge base in the prompt with prompt caching—simpler and potentially more effective.

**For real-time applications**: Weigh the cost of context generation against the accuracy improvement.

<hr class="section-divider">

## The Future of RAG

Contextual Retrieval represents a significant evolution in RAG systems, but it's not the end of the story. Future developments might include:

- **Dynamic Context Generation**: Tailoring context based on query type
- **Hierarchical Chunking**: Multi-level context preservation
- **Cross-Document Context**: Understanding relationships between documents
- **Real-Time Context Updates**: Keeping context current as documents change

<hr class="section-divider">

## Key Takeaways

1. **Context Destruction is Real**: Traditional RAG loses crucial information when chunking documents

2. **Simple Solutions Work**: Adding contextual information to chunks dramatically improves performance

3. **Combine Approaches**: Embeddings + BM25 + reranking provides the best results

4. **Cost-Effective**: Prompt caching makes contextual retrieval economically viable

5. **Measurable Impact**: 35-67% reduction in retrieval failures translates to significantly better user experiences

6. **Implementation Flexibility**: The technique works across different domains with appropriate prompt customization

Contextual Retrieval solves one of RAG's fundamental problems while maintaining its scalability benefits. For applications where retrieval accuracy matters, it's quickly becoming the new standard. The combination of better performance, reasonable costs, and straightforward implementation makes it an essential technique for modern AI applications.

---

*Contextual Retrieval was developed by Anthropic and represents a significant advancement in retrieval-augmented generation techniques. The research demonstrates that simple, principled approaches can yield dramatic improvements in AI system performance.*
