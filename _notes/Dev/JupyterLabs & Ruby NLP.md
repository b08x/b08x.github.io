---
title: JupyterLabs & Ruby NLP
date: 2023-11-04T19:51:00
cssid: test
description: Rustle up Jupyter Notebook, cram it in a Docker then throw a stack of Ruby NLP Gems on top and you got yourself a thing.
layout: page
category:
  - Dev
tags:
  - ruby
  - docker
  - llm
  - nlp
abstract: Python Data Science Docker images, with Ruby 3.1.0 install along with RubyGems
toc: true
---


```
```bash
+------------------+
| NLP RubyGems     |---{docker pull -p 8080:8080 b08x/notebook-nlp:latest}
+------------------+
| Python Data-Sci  |---{docker pull -p 8080:8080 b08x/notebook-datascience:latest}
+------------------+
| Jupyter Notebook |---{docker pull -p 8080:8080 b08x/notebook-minimal:latest}
+------------------+
```

## Commanding the Computer with Usurped Authority

Have you ever wanted to fly? Personally, I have not. Honestly, I feel most like a bird when I run; `docker-compose up -d` 

Which isn't true of course, but this instruction, when successful in it's compilation, is a delight compared most things I do with my fingers during the course of any particular day.

So let's continue caring about this, for a few more minutes at least, before the annoying realization makes itself that this process is incredibly tedious and you wish Google just fucking take care of it. 









---
# Included Gems

## Text Processing

[Pragmatic Segmenter](https://github.com/diasks2/pragmatic_segmenter) is a sentence segmentation tool for Ruby. It allows you to split a text into an array of sentences. This gem provides 2 main benefits over other segmentation gems - 1) It works well even with ill-formatted text 2) It works for multiple languages


[pragmatic_tokenizer 3.2.0](https://github.com/diasks2/pragmatic_tokenizer)
A multilingual tokenizer to split a string into tokens.

[ruby-spacy 0.2.2](https://github.com/yohasebe/ruby-spacy)
ruby-spacy is a wrapper module for using spaCy from the Ruby programming language via PyCall. This module aims to make it easy and natural for Ruby programmers to use spaCy. This module covers the areas of spaCy functionality for using many varieties of its language models, not for building ones.


[lemmatizer 0.2.2](http://github.com/yohasebe/lemmatizer)
Lemmatizer for text in English. Inspired by Python's nltk.corpus.reader.wordnet.morphy package.

[engtagger 0.4.0](https://github.com/yohasebe/engtagger)
A Ruby port of Perl Lingua::EN::Tagger, a probability based, corpus-trained tagger that assigns POS tags to English text based on a lookup dictionary and a set of probability values.

[scalpel 0.2.1](https://github.com/louismullie/scalpel)

Scalpel is a sentence segmentation tool for Ruby. It allows you to split a text into an array of sentences. It is simple, lightweight, blazing fast and does not require any domain-specific training. It works well even in the face of ill-formatted texts.

[tokenizers 0.4.1](https://github.com/ankane/tokenizers-ruby)
Fast state-of-the-art tokenizers for Ruby

## document parsing

[pdf_paradise 0.2.3](https://rubygems.org/gems/pdf_paradise)
This gem is called pdf_paradise. It attempts to be a swiss army knife, a wrapper, over pdf-related functionality in general, by tapping into external projects, such as prawn, qpdf and so forth. For more information, please have a look at the documentation of the project on the homepage of this gem, at: https://www.rubydoc.info/gems/pdf_paradise/

```ruby
```

[beckett 0.1.0](https://github.com/coreyti/beckett)
A Markdown renderer, using Kramdown, to convert to JSON, HTML5 or a Ruby Hash.

```ruby
```


## building operation pipeline with a strategy pattern 
[composable_operations 0.10.1](http://github.com/t6d/composable_operations)

Composable Operations is a tool set for creating operations and assembling multiple of these operations in operation pipelines.

## topic modeling
[tomoto 0.3.3](https://github.com/ankane/tomoto-ruby)

Ruby's LDA algorithm is a popular choice for topic modeling. It can be used to discover latent topics in a collection of documents. LDA assigns each document a distribution over topics and each topic a distribution over words. It is important to preprocess the documents by removing stop words, stemming, and applying other text normalization techniques before running LDA.

## llm tools
[langchainrb](https://github.com/andreibondarev/langchainrb)

```ruby
```


## objection relation mapping
[ohm 3.1.1](http://soveran.github.io/ohm/)
Ohm is a library that allows to store an object in Redis, a persistent key-value database. It has very good performance.


```ruby
```


[ohm-contrib 3.0.0](http://github.com/cyx/ohm-contrib)
Includes a couple of core functions such as callbacks, timestamping, typecasting and lots of generic validation routines.

```ruby
```



## also included....


[wordnet 1.2.0](https://github.com/ged/ruby-wordnet)
This library is a Ruby interface to WordNet®. WordNet® is an online lexical reference system whose design is inspired by current psycholinguistic theories of human lexical memory. English nouns, verbs, adjectives and adverbs are organized into synonym sets, each representing one underlying lexical concept. Different relations link the synonym sets.





[decisiontree 0.5.0](https://github.com/igrigorik/decisiontree)

ID3-based implementation of the M.L. Decision Tree algorithm


[fuzzy-string-match 1.0.1]()

calculate Jaro Winkler distance.

[fuzzy_tools 1.0.0](githubrepo)

Easy, high quality fuzzy search in Ruby.


[verbal_expressions 0.1.5](https://github.com/ryan-endacott/verbal_expressions)
Verbal Expressions is a library that makes constructing difficult regular expressions simple and easy!

[jongleur 1.1.1](https://gitlab.com/RedFred7/Jongleur)
Launches, schedules and manages tasks represented in a DAG, as multiple processes

[ferret 0.11.8.7](https://github.com/dbalmain/ferret)

Ferret is a super fast, highly configurable search library.


[eqn 1.6.5](https://github.com/schneidmaster/eqn)
A gem to evaluate mathematical equations. Includes support for variables and functions.

[google_search_results 0.0.1](https://github.com/serpapi/google-search-results-ruby)
Get Google Search Results via SERP API. Hash, JSON, and HTML outputs supported.


## nlp projects

[llm_memory 0.1.14](https://github.com/shohey1226/llm_memory)
LLM Memory is a Ruby gem designed to provide large language models (LLMs) like ChatGPT with memory using in-context learning. This enables better integration with systems such as Rails and web services while providing a more user-friendly and abstract interface based on brain terms.

![](https://user-images.githubusercontent.com/1880965/239105431-b77d0efa-3fec-4549-b98a-eae510de5c3d.png)

anoononoachain

monadic
