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
layout: page
permalink: /nlp/grag/
title: Optimize Retrieval Augmented Generation with Generating Augmented Retrieval by Generating Augments Retrieved with Generated Augmented Retrieval.
---

#TODO process with lida, in two years

[something nice to read](https://gradientflow.com/techniques-challenges-and-future-of-augmented-language-models/)

---
**Analyzing the Language Model's Responses**

- You're testing the language model's ability to understand natural language and provide grammatically correct explanations.
- You're intentionally playing with sentence structure and word choice to see how the model reacts and interprets your input.
- You're analyzing the concept of RAG, a technique where an AI model retrieves information from external sources to improve its text generation capabilities.
- You're fascinated by how subtle changes in word order ("augmented retrieval generation" vs. "retrieval augmented generation") shift the emphasis and meaning of the description.

**Linguistic Experimentation**

- You're engaging in playful experimentation by switching words within a sentence and seeing how this alters the meaning for the model.
- You note that even when a sentence might sound awkward, it can still be grammatically correct.
- You're exploring the boundaries of how language can be manipulated.

**Frustrations and Insights**

- You express frustration with the limitations of language and your own struggles to find the perfect phrasing to express your thoughts.
- Yet, you also demonstrate how this process leads to a deeper understanding as you gain insights along the way.

This transcript shows you diving deep into understanding how AI language models work, the nuances of language, and your own thought processes during this investigation. It's a fascinating mix of technical analysis and a playful exploration of the limits of language.


---

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

A graph database is a type of NoSQL database that uses graph structures to store and query data. It consists of nodes (also called vertices) and edges (also called relationships) that connect those nodes. Nodes represent entities, while edges represent the relationships between those entities. Graph databases are optimized for traversing and querying complex relationships, making them an excellent choice for applications that require high levels of interconnectedness.

**Cypher** is a declarative graph query language designed specifically for querying and manipulating graph data



---


Behave as an expert Rubyist and generate classes and methods from this description: 

```

Thank you for explaining the recursive knowledge graph queries. It's interesting to see how this technology can be used to combine information and store it in a cohesive way. Can you tell me more about how this technology is used in industries such as healthcare and finance? 

In healthcare, knowledge graphs can be used to store patient data and medical records, allowing doctors and other healthcare professionals to quickly access relevant information and make informed decisions. For example, a knowledge graph could be used to store information about a patient's medical history, including their symptoms, diagnoses, and treatments. This information could then be used to identify patterns and make predictions about the patient's health outcomes.

In finance, knowledge graphs can be used to store financial data and market information, allowing investors and analysts to quickly access relevant information and make informed decisions. For example, a knowledge graph could be used to store information about a company's financial performance, including its revenue, profits, and debt levels. This information could then be used to identify trends and make predictions about the company's future performance.

Do you have any other questions about knowledge graphs and their applications?
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