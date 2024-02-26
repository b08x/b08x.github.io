---
layout: note
title: Chunking Text
subtitle: 
category: LLM
tags:
  - llm
links:
  - https://gradientflow.com/techniques-challenges-and-future-of-augmented-language-models/
image: /assets/img/chunking_01.png
caption: page 294 Godel Escher Bach
---


### Dependent clauses 

* When using dependent clauses, make sure that they are grammatically correct. This can be done by checking that the dependent clause is in the correct form (e.g. past tense) and that it agrees with the main clause (e.g. subject-verb agreement).





---

```
Document chunking can be performed based on specific criteria or patterns within the text. For example, chunks can be created based on the occurrence of certain keywords, the presence of specific types of content (e.g., tables, images), or the structure of the sentences (e.g., subject-verb-object patterns). This method allows for targeted extraction of relevant information.
```

---

* skip embedding chunks that are assessed to contain non-sense topics
	* for example `1. Chatper Name.........................` should not be included in the vectorstore

---
/
- While larger chunk sizes can enhance performance, an excess of context might introduce noise.
- Strategies worth noting encompass utilizing smaller chunks and retrieving adjacent chunk content or maintaining multiple embeddings for a document.
- overlaps: For instance, if data is divided into chunks of 100 tokens, overlapping by 50 tokens would mean that the last 50 tokens of one chunk are the same as the first 50 tokens of the next chunk, thus preserving surrounding context.

[source: Techniques, Challenges, and Future of Augmented Language Models](https://gradientflow.com/techniques-challenges-and-future-of-augmented-language-models/)
