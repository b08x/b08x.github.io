---
layout: note
title: ranking chunks
subtitle: 
category: 
tags:
  - llm
  - nlp
  - ruby
  - linux
  - audio
links:
---

1. The input text or query is analyzed to identify keywords and topics that match an ontology or knowledge graph. 
2. The text is tokenized into an array of individual words and phrases. 
3. These tokens are converted into vectorized numerical representations called embeddings. 
4. The embeddings are stored in a vector cache database (Redis)
5. The query embeddings are compared to existing embeddings stored in a database (PostgreSQL) to find similar or related vectors based on mathematical similarity. 
6. ~~Related keywords and topics are looked up in the knowledge graph tables to provide additional contextual information.~~ 
 
* The ontology provides a formal representation of concepts and relationships that aids in understanding the meaning and context of the input text. 
* The knowledge graph and ontology help associate the query with relevant data to improve the quality of the analysis.


sources:
https://eugeneyan.com/writing/llm-patterns/
https://github.com/huggingface/setfit
https://github.com/davidberenstein1957/spacy-setfit
https://huggingface.co/SetFit/MiniLM_L3_clinc_oos_plus_distilled

> most similar != most relevant

### input query + related_chunks_from_vectordb_or_redis:

``` ruby
# use the query as the source setenence
source_sentence = "Explain JACK audio routing"

# top 5 chunks retrived
sentences = [
  "JACK (Jack Audio Connection Kit) is a versatile audio routing system that allows applications to connect and communicate with each other for seamless audio processing and sharing.",
  "In JACK, audio routing involves establishing connections between audio sources and destinations, enabling precise control over how audio flows through the system.",
  "Understanding JACK audio routing is crucial for efficiently managing complex audio setups in professional music production or audio engineering environments.",
  "While discussing audio routing, it's important to mention the role of buffers in managing latency within the JACK system.",
  "A squirrel ran across the backyard as I was trying contact Jack. (Unrelated sentence)"
]
```

### create a json object of the query and matching vectorstore responses

``` ruby
require 'json'

def create_json_object(source_sentence, sentences)
  {
    inputs: {
      source_sentence: source_sentence,
      sentences: sentences
    }
  }.to_json
end

# Usage example
source_sentence = "Explain JACK audio routing"

sentences = [
  "JACK (Jack Audio Connection Kit) is a versatile audio routing system that allows applications to connect and communicate with each other for seamless audio processing and sharing.",
  "In JACK, audio routing involves establishing connections between audio sources and destinations, enabling precise control over how audio flows through the system.",
  "Understanding JACK audio routing is crucial for efficiently managing complex audio setups in professional music production or audio engineering environments.",
  "While discussing audio routing, it's important to mention the role of buffers in managing latency within the JACK system.",
  "A squirrel ran across the backyard as I was trying to grasp the concept of JACK audio routing. (Unrelated sentence)"
]

json_object = create_json_object(source_sentence, sentences)
puts json_object
```

``` json
{"inputs":{"source_sentence":"Explain JACK audio routing","sentences":["JACK (Jack Audio Connection Kit) is a versatile audio routing system that allows applications to connect and communicate with each other for seamless audio processing and sharing.","In JACK, audio routing involves establishing connections between audio sources and destinations, enabling precise control over how audio flows through the system.","Understanding JACK audio routing is crucial for efficiently managing complex audio setups in professional music production or audio engineering environments.","While discussing audio routing, it's important to mention the role of buffers in managing latency within the JACK system.","A squirrel ran across the backyard as I was trying to grasp the concept of JACK audio routing. (Unrelated sentence)"]}}
```

### use the json_object in the ranking query

``` ruby
response = `curl https://api-inference.huggingface.co/models/SetFit/MiniLM_L3_clinc_oos_plus_distilled \
    -X POST \
    -d json_object \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer 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"
`
p response
```

``` ruby
"[0.6867787837982178,0.7152249217033386,0.6588611006736755,0.6283782720565796,0.5117526650428772]"
```

#### to extract an array contained within a string

``` ruby
def extract_array_from_string(string) 
    # Remove leading and trailing characters "[" and "]" 
    clean_string = string.tr('[]', '') 
    # Split the string into an array of floats 
    array = clean_string.split(',').map(&:to_f) array 
end

scores = extract_array_from_string(response)

p scores
```

    [0.6867787837982178, 0.7152249217033386, 0.6588611006736755, 0.6283782720565796, 0.5117526650428772]

### create an a hash array of sentences and their rankings

``` ruby
def assign_scores(sentences, scores)
  sentences_with_scores = sentences.zip(scores).map { |sentence, score| { sentence: sentence, score: score } }
  sentences_with_scores
end

# Assign scores to each sentence
sentences_with_scores = assign_scores(sentences, scores)
puts sentences_with_scores
```

``` ruby
[{:sentence=>"JACK (Jack Audio Connection Kit) is a versatile audio routing system that allows applications to connect and communicate with each other for seamless audio processing and sharing.",
  :score=>0.6867787837982178},
 {:sentence=>"In JACK, audio routing involves establishing connections between audio sources and destinations, enabling precise control over how audio flows through the system.", :score=>0.7152249217033386},
 {:sentence=>"Understanding JACK audio routing is crucial for efficiently managing complex audio setups in professional music production or audio engineering environments.", :score=>0.6588611006736755},
 {:sentence=>"While discussing audio routing, it's important to mention the role of buffers in managing latency within the JACK system.", :score=>0.6283782720565796},
 {:sentence=>"A squirrel ran across the backyard as I was trying to grasp the concept of JACK audio routing. (Unrelated sentence)", :score=>0.5117526650428772}]
```

### now, the `assign_scores` refactored to sort the results and keep the top 3

``` ruby
def assign_scores(sentences, scores)
  sentences_with_scores = sentences.map.with_index { |sentence, idx| { sentence: sentence, score: scores[idx] } }
  sorted_sentences = sentences_with_scores.sort_by { |item| -item[:score] }.take(3)

  top_sentences = sorted_sentences.each_with_index.map { |item, index| { rank: index + 1, sentence: item[:sentence], score: item[:score] } }
  top_sentences_hash = {}
  top_sentences.each { |item| top_sentences_hash[item[:rank]] = { sentence: item[:sentence], score: item[:score] } }
  top_sentences_hash
end

# Assign scores to sentences and sort the top 3
top_sentences = assign_scores(sentences, scores)

puts "Top 3 sentences with scores and ranks:"
top_sentences.each do |rank, data|
  puts "#{rank}. Sentence: #{data[:sentence]}, Score: #{data[:score]}"
end
```

``` ruby

1. Sentence: In JACK, audio routing involves establishing connections between audio sources and destinations, enabling precise control over how audio flows through the system., Score: 0.7152249217033386
2. Sentence: JACK (Jack Audio Connection Kit) is a versatile audio routing system that allows applications to connect and communicate with each other for seamless audio processing and sharing., Score: 0.6867787837982178
3. Sentence: Understanding JACK audio routing is crucial for efficiently managing complex audio setups in professional music production or audio engineering environments., Score: 0.6588611006736755

=> 
{

1=>{:sentence=>"In JACK, audio routing involves establishing connections between audio sources and destinations, enabling precise control over how audio flows through the system.", :score=>0.7152249217033386},

2=>{:sentence=>"JACK (Jack Audio Connection Kit) is a versatile audio routing system that allows applications to connect and communicate with each other for seamless audio processing and sharing." :score=>0.6867787837982178},

3=>{:sentence=>"Understanding JACK audio routing is crucial for efficiently managing complex audio setups in professional music production or audio engineering environments.", :score=>0.6588611006736755}
 
 }

```

### generate a new prompt from the ranked vectorstore chunks

For example:

> paraphrase and summarize the combination of source_sentence and top_sentences to generate a GPT query prompt that requests comprehensive, technical details regarding the main topic

``` markdown

Paraphrased Source Sentence:
"Provide a detailed explanation of the intricacies of JACK audio routing."

Summarized Top 3 Sentences:
1. "Explain the core concepts and mechanics behind JACK audio routing."
2. "Elaborate on the capabilities and functioning of JACK in routing audio."
3. "Discuss the critical aspects of JACK audio routing and its relevance in audio engineering."

GPT Query Prompt:
"Delve into the technical depths of JACK audio routing, explaining its key mechanisms, functionalities, and relevance within the realm of audio engineering."
```
