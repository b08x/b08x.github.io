---
id: Graph RAG
aliases:
  - tagging words based on parts of speech
tags:
  - llm
  - gpt
  - nlp
  - ruby
  - redis
layout: folder
permalink: /llm/graph
title: Graph RAG
---

![[Pasted image 20240126224214.png]]
[source](https://gradientflow.com/techniques-challenges-and-future-of-augmented-language-models/)

---

## tagging words based on parts of speech

<div>
{% asciicast 630607 %}
</div>

[booknlp](https://github.com/booknlp/booknlp)

- things in between ````
  - `()`

```ruby
# in this case 'JACK should be a ner'
werd: {"JACK"=>{:dep=>"ROOT", :lemma=>"JACK", :pos=>:nnp}}
POS: nnp
lemma: jack
```

---

A graph database is a type of NoSQL database that uses graph structures to store and query data. It consists of nodes (also called vertices) and edges (also called relationships) that connect those nodes. Nodes represent entities, while edges represent the relationships between those entities. Graph databases are optimized for traversing and querying complex relationships, making them an excellent choice for applications that require high levels of interconnectedness.

**Cypher** is a declarative graph query language designed specifically for querying and manipulating graph data

https://reinteractive.com/articles/creating-intelligent-knowledge-base-q&a-app-with-gpt-3-and-ruby

https://medium.com/@young.scottw/implementing-an-undirected-graph-in-ruby-c11258b3d95b

https://gist.github.com/SYoung82/31b156cacccb20c888d106027cfc6b95#file-undirectedgraph-rb

https://reintech.io/blog/using-graph-databases-in-ruby
https://medium.com/@Arafatkatze/ruby-tensorflow-for-developers-2ec56b8668c5

https://www.siwei.io/en/graph-enabled-llama-index/
https://www.siwei.io/en/demos/graph-rag/
https://www.siwei.io/en/demos/text2cypher/
https://kg-llm-build.streamlit.app/?utm_medium=oembed

---


Behave as an expert Rubyist and generate classes and methods from this description: 

```
Recursive Knowledge Graph Queries Why: This is used to combine information extracted and store a cohesive conjoined answer. LLM query the graph for the answer. This is functionally similar to a Tree of Thought or a Chain of Thought process where external information is stored in a knowledge graph to help determine the next step of investigation. You basically run the chunk extraction again and again, retrieve extracted information, and store in a knowledge graph to enforce connections to reveal relationships. Once relationships are established and the information is saved in the KG, run the query again with the full context extracted from the KG. If insufficient context, save the extracted answer in the same KG again to enforce more connections and rinse/repeat. This is also especially useful if data is continuously flowing into your system and you want to make sure that answers are updated over time with new context.
```

[source](https://medium.com/enterprise-rag/injecting-knowledge-graphs-in-different-rag-stages-a3cd1221f57b)

**Here's a Ruby design that incorporates practices to addresses the description's requirements:**

**Class:**

```ruby
class RecursiveKnowledgeGraphQuery
  attr_reader :knowledge_graph, :llm

  def initialize(knowledge_graph:, llm:)
    @knowledge_graph = knowledge_graph
    @llm = llm
  end

  def query(initial_query)
    query_with_context(initial_query, [])
  end

  private

  def query_with_context(query, context)
    extracted_info = llm.extract_information(query, context)
    knowledge_graph.add_information(extracted_info)

    full_context = knowledge_graph.retrieve_context(query)
    answer = llm.query_graph(query, full_context)

    if answer.sufficient?
      return answer
    else
      query_with_context(answer.missing_context_query, full_context)
    end
  end
end
```

**Key Points:**

- **Encapsulation:** The class manages the knowledge graph and LLM, promoting modularity and testability.
- **Dependency Injection:** The LLM and knowledge graph are injected as dependencies, allowing flexibility and customization.
- **Recursive Querying:** The `query_with_context` method recursively calls itself to refine the query based on extracted information until a sufficient answer is obtained.
- **Context Management:** The method explicitly tracks context to ensure the LLM and knowledge graph are operating with the most relevant information.
- **Interface-Driven Design:** The `llm` and `knowledge_graph` are expected to implement certain methods, fostering loose coupling and adaptability.

**Additional Considerations:**

- **Error Handling:** Consider adding error handling to address potential issues with LLM or knowledge graph interactions.
- **Performance Optimization:** For large knowledge graphs or complex queries, explore optimization techniques like caching or indexing.
- **Knowledge Graph Implementation:** Choose a suitable knowledge graph implementation (e.g., Neo4j, RDF store) based on your specific requirements.
- **Testing:** Thoroughly test the class and its interactions with the LLM and knowledge graph to ensure correctness and robustness.




---

