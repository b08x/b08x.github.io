---
layout: folder
title: Graph RAG
subtitle: 
excerpt: 
category: 
tags:
  - llm
  - gpt
  - nlp
  - ruby
  - redis
image: 
permalink: /llm/graph
---

## tagging words based on parts of speech

{% asciicast 630607 %}



[booknlp](https://github.com/booknlp/booknlp)


* things in between ````
	* `()`



```ruby
# in this case 'JACK should be a ner'
werd: {"JACK"=>{:dep=>"ROOT", :lemma=>"JACK", :pos=>:nnp}}
POS: nnp
lemma: jack
```
