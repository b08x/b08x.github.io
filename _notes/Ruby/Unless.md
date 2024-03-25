---
layout: page
title: Document Processing Techniques
subtitle: with Ruby's "unless" Method
category:
  - Dev
tags:
  - ruby
  - nlp
links:
---

Narrator: Today we explore document processing techniques using Ruby's "unless" method. We consult the popular Large Language Model interfaces of the day to help understand the process, as well provide muse service for alternative methods that optimize or otherwise enhance the accuracy and realism of Model interactions.


Narrator: First we establish context by asking the Model to provide some examples of using "unless" function
 
 Explain the Ruby `unless` function using illustrative examples

---

> we then layer the context by asking for examples on how to use the function with a specific intention
 
 Great. Now please generate some examples that use `unless` for Document Processing that use the RubyGems `pragmatic_tokenizer` and `ruby-spacy`

---
# 3

> The response gives us an idea. We're reminded of the many conditionals involved when chunking a document for initial vectorization. We ask the model about this, providing some direction with the libraries we plan on using. 

[[assets/aud/unless/03_ElevenLabs_2024-01-31T03_05_50_Rylan - calming male_gen_s50_sb75_se0_b_m2.mp3|03_ElevenLabs_2024-01-31T03_05_50_Rylan - calming male_gen_s50_sb75_se0_b_m2]]

 Awesome. Now, please generate some examples of using `unless` specifically for Document Chunking using the rubygems `spacy` and `pragmatic tokenizer`

---
# 4
 What are some practical applications of extracting verb phrases from chunks?


# 5



So welcome. ....This is "All Things Configured".... We'll be talking about various subjects using techniques like verbs,...adjectives,... nouns,...some times improper nouns,...usually referring to the same subjects mentioned earlier in *this* sentence but not necessarily referring to this particular sentence, which currently just only happens to be setting expectations of well...by the rules of grammar, not my rules by the way, you could call it a way to establish meaning in the present but you could also consider it information relevant in a future circumstance, if it all.  


or rather which is to say, timeless....what i* continue to literally describe the process about talking about talking about process...and other wise fun recursive language describing...*




















unless and drop_while

```ruby
def lines_after(lines,target)
  lines.drop_while { |line| !line.include?(target) }
end
```

