---
layout: page
title: constructing triplets
subtitle: 
category:
  - LLM
tags:
  - rag
links:
---

A graph database is a type of NoSQL database that uses graph structures to store and query data. It consists of nodes (also called vertices) and edges (also called relationships) that connect those nodes. Nodes represent entities, while edges represent the relationships between those entities. Graph databases are optimized for traversing and querying complex relationships, making them an excellent choice for applications that require high levels of interconnectedness.

**Cypher** is a declarative graph query language designed specifically for querying and manipulating graph data

---


The knowledge graph consists of triplets having the following structure:

**subject → predicate → object**



https://medium.com/@milena.trajanoska/automated-knowledge-graph-construction-using-chatgpt-ba959050405a



## tagging words based on parts of speech


<script type="text/javascript" src="https://asciinema.org/a/630607.js" id="asciicast-630607" async="async"></script>

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

## example class Recursive Knowledge Graph Query

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




---
#TODO 

https://reinteractive.com/articles/creating-intelligent-knowledge-base-q&a-app-with-gpt-3-and-ruby
https://medium.com/@young.scottw/implementing-an-undirected-graph-in-ruby-c11258b3d95b
https://gist.github.com/SYoung82/31b156cacccb20c888d106027cfc6b95#file-undirectedgraph-rb
https://reintech.io/blog/using-graph-databases-in-ruby
https://medium.com/@Arafatkatze/ruby-tensorflow-for-developers-2ec56b8668c5
https://www.siwei.io/en/graph-enabled-llama-index/
https://www.siwei.io/en/demos/graph-rag/
https://www.siwei.io/en/demos/text2cypher/
https://kg-llm-build.streamlit.app/?utm_medium=oembed

![[Pasted image 20240126224214.png]]