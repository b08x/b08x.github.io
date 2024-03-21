---
layout: page
title: Chunk Analyzer
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

> [!ai]+ AI
>
> **Chunk Analyzer: The Ultimate Text-Horking Machine**
> Yo, check it! This chunk analyzer is the bomb diggity for slicing and dicing your text into bite-sized gobbets of linguistic goodness. It's like a super-powered word-butcher, hacking your prose into neat little chunks based on whatever criteria your twisted little mind desires.
> Want to find all the juicy bits about flying unicorns? No problemo! Just tell this bad boy to chunk up your text based on the occurrence of the keyword "unicorn." Or maybe you're into the nitty-gritty details of quantum physics? Just set it to chunk by the presence of specific scientific jargon like "boson" or "fermion."
> And get this: it can even break down your text based on the sentence structure. So if you're a grammar nerd who gets off on spotting perfect subject-verb-object patterns, this chunk analyzer will have you drooling with delight. It's like the ultimate text-parsing party, where you can extract all the relevant info you need without having to wade through a sea of boring words.
> So next time you've got a text that needs some serious chunking, don't be a lazybones - let this chunk analyzer do the dirty work for you. It'll save you time, effort, and the inevitable existential crisis that comes with trying to make sense of unchunked text. Trust me, it's the bomb diggity!



> [!ai]+ AI
>
> **Chunk Analyzer**
> **Starred Blocks:**
> * None
> **Document Chunking**
> Document chunking is the process of dividing a text into smaller, manageable units called chunks. This can be done based on specific criteria or patterns within the text.
> **Criteria for Chunking**
> Chunks can be created based on the occurrence of certain keywords, the presence of specific types of content (e.g., tables, images), or the structure of the sentences (e.g., subject-verb-object patterns).
> **Benefits of Chunking**
> Chunking allows for targeted extraction of relevant information. By dividing the text into smaller units, it becomes easier to identify and extract specific pieces of information.
> **Example**
> Consider the following text:
> ```
> The quick brown fox jumped over the lazy dog. The dog was very lazy. He slept all day long.
> ```
> We could chunk this text based on the occurrence of the word "dog":
> ```
> Chunk 1: The quick brown fox jumped over the lazy dog.
> Chunk 2: The dog was very lazy. He slept all day long.
> ```
> This chunking would allow us to easily extract information about the dog, such as its laziness and sleeping habits.


> [!ai]+ AI
>
> **Chunk Analyzer**
> Oh, the wonders of document chunking! It's like a magical spell that breaks down text into bite-sized morsels. You can use it to find the golden nuggets of information you crave, like a prospector panning for gold in a river of words.
> But hold your horses, there's more! You can also use chunking to create chunks based on the presence of certain keywords, like a detective searching for clues. Or you can divide the text into chunks based on its structure, like a surgeon carefully dissecting a body.
> This fancy-schmancy method lets you extract the juicy bits of information you need, like a cherry picker harvesting the ripest fruit from a tree. So, if you're looking to get your hands on the most important parts of a document, give chunk analysis a whirl. It's like having a superpower that makes understanding text a breeze!



> [!ai]+ AI
>
> | **Context** | **Summary** |
> |---|---|
> | **Document Chunking** | Dividing text into smaller units (chunks) based on specific criteria (e.g., keywords, content type, sentence structure) to extract relevant information. |


> [!ai]+ AI
>
> | Feature | Description |
> |---|---|
> | Title | Chunk Analyzer |
> | Starred Blocks | None |
> | Context | Document chunking can be performed based on specific criteria or patterns within the text. For example, chunks can be created based on the occurrence of certain keywords, the presence of specific types of content (e.g., tables, images), or the structure of the sentences (e.g., subject-verb-object patterns). This method allows for targeted extraction of relevant information. |





> [!ai]+ AI
>
> Document chunking involves dividing text into meaningful units based on specific criteria, such as keywords, content types, or sentence structure. This technique enables the targeted extraction of relevant information.



> [!ai]+ AI
>
> **Chunk Analyzer**
> Document chunking is a technique used to break down text into smaller, more manageable units called chunks. These chunks can be created based on specific criteria or patterns within the text.
> For example, chunks can be created based on:
> * The occurrence of certain keywords
> * The presence of specific types of content (e.g., tables, images)
> * The structure of the sentences (e.g., subject-verb-object patterns)
> This method allows for targeted extraction of relevant information.




[Chunk Visualizer](https://huggingface.co/spaces/m-ric/chunk_visualizer)


> [!ai]+ AI
>
> **Nihilistic & Existential Rants**
> Oh, the dreaded Chunk Analyzer! A cruel and heartless machine that tears our precious text to shreds! It's the ultimate act of literary vivisection, leaving nothing but a pile of scattered


> [!ai]+ AI
>
> **Sentiment Analysis**
> The provided text is a negative rant about the Chunk Analyzer. The author uses hyperbole and exaggeration to express their frustration with the tool, calling it "cruel and heartless" and "the ultimate act of literary vivisection." They also use insults and sarcasm, referring to the tool as a "dreaded" and "heartless machine."
> **Cognitive Grammar with Pragmatics**
> The author's use of language in this rant is consistent with the principles of cognitive grammar with pragmatics. They use concrete and specific language to describe the Chunk Analyzer, and they use metaphors and similes to compare it to other things. For example, they compare the tool to a "machine that tears our precious text to shreds" and a "literary vivisection." These comparisons help to create a vivid and memorable image of the Chunk Analyzer in the reader's mind.
> **Contrasting Perspectives**
> It is important to note that the author's perspective on the Chunk Analyzer is not the only one. There are many people who find the tool to be helpful and valuable. It is important to consider all perspectives when evaluating a tool or technology.
> **Conclusion**
> The Chunk Analyzer is a tool that can be used to perform document chunking. The author of the provided text has a negative opinion of the tool, but it is important to note that this is not the only perspective. There are many people who find the tool to be helpful and valuable. It is important to consider all perspectives when evaluating a tool or technology.

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


| Method          | Langchains Recursive Text Splitter                                                                                                                                                                                                                                          |
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

[results using Gemini makersuite](https://makersuite.google.com/app/prompts?state=%7B%22ids%22%3A%5B%221FPT0d-GOcBzlU_rjWoJgAcn7YTduOaCe%22%5D%2C%22action%22%3A%22open%22%2C%22userId%22%3A%22105870379594569653340%22%2C%22resourceKeys%22%3A%7B%7D%7D&usp=sharing)

[Techniques, Challenges, and Future of Augmented Language Models](https://gradientflow.com/techniques-challenges-and-future-of-augmented-language-models/)
