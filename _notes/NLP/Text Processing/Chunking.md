---
layout: page
title: Chunking Text
subtitle: Its not as gross as it sounds
category:
  - Text Processing
tags:
  - llm
links:
  - https://gradientflow.com/techniques-challenges-and-future-of-augmented-language-models/
image: /assets/img/chunking_01.png
caption: page 294 Godel Escher Bach
toc: true
---

Document chunking can be performed based on specific criteria or patterns within the text. For example, chunks can be created based on the occurrence of certain keywords, the presence of specific types of content (e.g., tables, images), or the structure of the sentences (e.g., subject-verb-object patterns). This method allows for targeted extraction of relevant information.

<div class="figure right">
    <div class="liner">
     {% picture default chunking_01.png --img id="dark" --link https://github.com %}
     <p class="caption">page 294 Godel Escher Bach </p>
     </div>
</div>

# Comparing Length Functions

After a messing a bit with the various settings, three configurations seemed to produce the best results when I processed the transcript from an unscripted video recently recorded.

### Starting with this prompt:

```markdown
Summarize the chunk of a youtube transcript in descriptive detail, then correlate the speaker's functional, generative, cognitive and pragmatic grammars into a markdown table. *Make note if the dependent clause is not in the correct form*.
```

Adding the instruction to note faulty dependent clauses seemed to add small amount of clarity to the subsequent repsonses.

---

# Visualizing Chunks and Processing the Raw Results



### Splitting by BERT tokens

| Method          | Langchains Recursive Text Splitter                                                       |
| :-------------- | :-------------------------------------------------------------------------------------- |
| separators      | ['\n\n', '\n', ' ', '']                                                                 |
| length function | Token Count (BERT Tokens)                                                               |
| chunk length    | 500                                                                                     |
| overlap         | 0                                                                                       |
| notes           | *in this case, there wasn't a difference between recursive or character text splitting* \



### Splitting by Character Count

| Method          | Langchains Recursive Text Splitter                                     |
| :-------------- | :-------------------------------------------------------------------- |
| separators      | ['\n\n', '\n', ' ', '']                                               |
| length function | Character Count                                                       |
| chunk length    | 200                                                                   |
| overlap         | 10                                                                    |
| notes           | *oddly enough, the overlapped chunks seemed appropriate to cut out..* |
| ^^              |                                                                       |

### Odd sense & Surprise

|--|--|--|--|--|--|--|--|
| :----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| notes: | both sets weren't always able to pick out the specific grammars. One result;                                                                                                                                                                                                                                                                                 |
| ^^     | "**Note:** The provided text does not contain enough information to fully analyze the speaker's cognitive and pragmatic grammars."                                                                                                                                                                                                                           |
| ^^     | the phrase "rag hopping" is a result of transcription mistake. however it makes sense enough in the overall context, for the Gemini model to output it's predicted guess as a statement.                                                                                                                                                                     |
| ^^     | "The speaker discusses a process commonly referred to as "rag hopping," which involves using recent information from the web to enhance search resuwralts." 
| ^^     | -- This is just something ***it just made up*** as apparently "rag hopping" more commonly has to do with cars and their hydraulic systems as depicted in the 1998 classic music video "Let me Ride" |



| input chunk                                                                                                                                                                        | output summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| descriptive of the process that com uh is commonly referred to as rag hoping rag is recent enough in Bard's access to the web search just is like oh yeah I know what you mean bro | **Summary:** The speaker discusses the concept of combining information retrieval and text generation to produce more accurate and relevant outputs.                                                                                                                                                                                                                                                                                                                                |
| ^^                                                                                                                                                                                   | **Correlation of Speaker's Grammars:** \| Grammar Type \| Description \| \|---\|---\| \| Functional \| Focuses on the combination of information retrieval and text generation. \| \| Generative \| Not evident in the provided text. \| \| Cognitive \| Not evident in the provided text. \| \| Pragmatic \| Not evident in the provided text. \| **Note:** The provided text does not contain enough information to fully analyze the speaker's cognitive and pragmatic grammars. |
| ^^                                                                                                                                                                                   | ^^                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ^^                                                                                                                                                                                   | ^^                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| *notes*                                                                                                                                                                           | I find it impressive it reached that conclusion based on this utterance.                                                                                                                                                                                                                                                                                                                                                                                                            |


## Unexpected visual breakdown


| Method          | Langchains Recursive Text Splitter                                                                                                                                                                                                                                           |
| :-------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| separators      | ['\n\n', '\n', ' ', '']                                                                                                                                                                                                                                                     |
| length function | Character Count                                                                                                                                                                                                                                                             |
| chunk length    | 100                                                                                                                                                                                                                                                                         |
| overlap         | 50                                                                                                                                                                                                                                                                          |
| notes           | *interesting results. like an inverse chunking that in some ways made the statements line up well. I might try these settings, putting the result chunks into an array, to the summarize. It'll interesting to see what these settings look like after some pre-processing* |



| Method          | Langchains Recursive Text Splitter                                                                                                                                                                                                 |
| :-------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| separators      | ['\n\n', '\n', ' ', '']                                                                                                                                                                                                           |
| length function | Character Count                                                                                                                                                                                                                   |
| chunk length    | 200                                                                                                                                                                                                                               |
| overlap         | 50                                                                                                                                                                                                                                |
| notes           | *more quite interesting results. the overlapped chunks read like cascading poetry, while the chunks themselves oddly fit together quite nicely. It'll interesting to see what these settings look like after some pre-processing* |


---


### Dependent clauses 

* When using dependent clauses, make sure that they are grammatically correct. This can be done by checking that the dependent clause is in the correct form (e.g. past tense) and that it agrees with the main clause (e.g. subject-verb agreement).


---

* skip embedding chunks that are assessed to contain non-sense topics
	* for example `1. Chatper Name.........................` should not be included in the vectorstore

---

- While larger chunk sizes can enhance performance, an excess of context might introduce noise.
- Strategies worth noting encompass utilizing smaller chunks and retrieving adjacent chunk content or maintaining multiple embeddings for a document.
- overlaps: For instance, if data is divided into chunks of 100 tokens, overlapping by 50 tokens would mean that the last 50 tokens of one chunk are the same as the first 50 tokens of the next chunk, thus preserving surrounding context.


---


### sources


[Chunk Visualizer](https://huggingface.co/spaces/m-ric/chunk_visualizer)

[results using Gemini makersuite](https://makersuite.google.com/app/prompts?state=%7B%22ids%22%3A%5B%221FPT0d-GOcBzlU_rjWoJgAcn7YTduOaCe%22%5D%2C%22action%22%3A%22open%22%2C%22userId%22%3A%22105870379594569653340%22%2C%22resourceKeys%22%3A%7B%7D%7D&usp=sharing)

[Techniques, Challenges, and Future of Augmented Language Models](https://gradientflow.com/techniques-challenges-and-future-of-augmented-language-models/)
