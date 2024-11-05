---
layout: note
title: Optimizing Semantic Chunking with Embedding Models and Text Splitters
category: Development
tags:
  - nlp
image: 
summary: 
date created: Monday, October 21st 2024, 3:12:16 pm
date modified: Tuesday, November 5th 2024, 3:11:19 am
---

1. **Which embedding model are you using, and what chunk sizes does it perform optimally on?** For instance, [sentence-transformer](https://huggingface.co/sentence-transformers) models work well on individual sentences, but a model like [text-embedding-ada-002](https://openai.com/blog/new-and-improved-embedding-model) performs better on chunks containing 256 or 512 tokens.

```python
from langchain.text_splitter import MarkdownTextSplitter
markdown_text = "..."

markdown_splitter = MarkdownTextSplitter(chunk_size=100, chunk_overlap=0)
docs = markdown_splitter.create_documents([markdown_text])
```

Here are the steps that make semantic chunking work:

Break up the document into sentences.  
Create sentence groups: for each sentence, create a group containing some sentences before and after the given sentence. The group is essentially "anchored" by the sentence use to create it. You can decide the specific numbers before or after to include in each group - but all sentences in a group will be associated with one "anchor" sentence.  
Generate embeddings for each sentence group and associate them with their "anchor" sentence.  
Compare distances between each group sequentially: When you look at the sentences in the document sequentially, as long as the topic or theme is the same - the distance between the sentence group embedding for a given sentence and the sentence group preceding it will be low. On the other hand, higher semantic distance indicates that the theme or topic has changed. This can effectively delineate one chunk from the next.  
LangChain has created a semantic chunking splitter implemented based on Kamradt's work. You can also try out our notebook for advanced chunking methods for RAG.

---
We found that it was necessary to alter some defaults to achieve fair results. By default, the RecursiveCharacterTextSplitter uses the following separators: ["\n\n", "\n", " ", ""]. We found this would commonly result in very short chunks, which performed poorly in comparison to TokenTextSplitter which produces chunks of a fixed length by default. Therefore we use ["\n\n", "\n", ".", "?", "!", " ", ""] as the set of separators.

---

We report the results for n=5 retrieved chunks, using OpenAI's text-embedding-3-large as the embedding...

We find that the heuristic RecursiveCharacterTextSplitter with chunk size 200 and no overlap performs well. While it does not achieve the best result, it is consistently high performing across all evaluation metrtics

---

We repeat our experiments with the embedding model changed to the Sentence Transformers 'all-MiniLM-L6-v2'[26]....

We find that the ClusterSemanticChunker achieves the highest precision, Precision  
Ω  
 and IoU however has slightly below average recall likely due to its small average chunk size. The TokenTextSplitter achieves the highest recall of 0.824 when configured with chunk size 250 and chunk overlap of 125. This then drops to 0.771 when chunk overlap is set to zero, suggesting that for smaller context, overlapping chunks are necessary for high recall.

<https://research.trychroma.com/evaluating-chunking>

---

<https://www.promptfoo.dev/>
