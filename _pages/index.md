---
id: index
aliases:
  - Welcome!
tags: 
layout: graph
permalink: /index
title: Home
---


# Example: Medical Research RAG

Query: "impact of simond's disease on memory" (Note the misspelling of "Simond's")
Semantic Chunking:
"impact of Simond's disease" (noun phrase)
"on memory" (prepositional phrase)
Echo Embeddings: Repeat the noun phrase. Focus on getting richer embeddings for "Simond's disease" in the second pass.
Soundex:
Generate the Soundex code for "Simond's"
Create echo embeddings for the Soundex variations as well.
Retrieval: Search the knowledge base using:
Embeddings of the original terms and phrases
Embeddings of Soundex variations for key terms
Benefits of this Combined Approach

Higher Precision: Retrieval becomes more focused, less likely to be misled by errors.
Improved Recall: Retrieves articles that might have been missed due to spelling mistakes but are contextually very relevant.
Better RAG Output: With more accurate retrieval results, the generation stage of the RAG system has a higher quality foundation to produce better answers.
Important Considerations

Computational Cost: There's increased computation due to repetition, Soundex calculations, and the larger embedding space. Optimization would be crucial.
Balance: Finding the right balance between applying echo embeddings to all chunks vs. only critical chunks is important.
Domain Specificity: The effectiveness of Soundex is domain-dependent.