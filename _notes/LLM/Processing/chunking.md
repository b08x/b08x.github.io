---
---


![](Pasted%20image%2020231010175152.png)
page 294 Godel Escher Bach

## chunking based on keywords

```
Additionally, document chunking can be performed based on specific criteria or patterns within the text. For example, chunks can be created based on the occurrence of certain keywords, the presence of specific types of content (e.g., tables, images), or the structure of the sentences (e.g., subject-verb-object patterns). This method allows for targeted extraction of relevant information.
```


* skip embedding chunks that are assessed to contain non-sense topics
	* for example `1. Chatper Name.........................` should not be included in the vectorstore
* 