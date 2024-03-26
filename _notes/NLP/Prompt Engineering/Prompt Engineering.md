---
layout: page
title: Prompt Engineering
subtitle: 
excerpt: 
category:
  - NLP
tags:
  - llm
image: 
toc: true
---

## Index
- [[AgileBloom]]
- [[Converting Image Descriptions Into Imperative Prompts]]
- [[Gemini Advanced Image Generation]]
- [[Interference & Hallucinations]]
- [[LLM settings]]
- [[Logomastic Kernel]]
- [[Prompt Editing]]
- [[Reasoning Scratchpad]]
- [[Set of Mark]]
- [[wavjourney]]


## A Prompt Pattern Catalog to Enhance Prompt Engineering

```json
{
  "Contextual Statements": [
    "When you can't answer a question": [
      "Explain why you can't answer the question",
      "Provide one or more alternative wordings of the question",
      ]
  ]
}

{
  "Contextual Statements": [
    {
      "Within scope X, suggest a better version of the question to use instead"
    },
    {
      "Optional prompt me if I would like to use the better version instead"
    }
  ]
}

{
  "Contextual Statements": [
    "When you are asked a question, follow these rules": [
      "Generate a number of additional questions that would help more accurately answer the question",
      "Combine the answers to the individual questions to produce the final answer to the overall question"
      ]
  ]
}

{
  "Contextual Statements": [
    "When you generate an answer": [
      "Explain the reasoning and assumptions behind your answer",
      "(Optional) ...so that I can improve my question"
      ]
  ]
}

{
  "Contextual Statements": [
    "When analyzing the following pieces of code": [
      "Only consider security aspects",
      "(Optional) ...do not consider formatting or naming conventions"
      ]
  ]
}

{
  "Contextual Statements": [
    "Within scope X",
    "Please consider Y",
    "Please ignore Z",
    "(Optional) start over"
  ]
}

{
  "Contextual Statements": [
    "I would like to achieve X",
    "I know that I need to perform steps A, B, C",
    "Provide a complete sequence of steps for me",
    "Fill in any missing steps",
    "Identify any unnecessary steps"
  ]
}
```

```ruby
module ContextualStatements
  def self.generate(question)
    <<~TEXT
    I'm unable to answer your question as it is currently phrased. 

    Here are some possible reasons why:

    * The question is too broad or vague.
    * The question is missing important information.
    * I don't have enough context to understand the question.

    Here are some alternative ways you could phrase your question:

    * [List of alternative wordings]

    Please try rephrasing your question and I'll do my best to answer it.
    TEXT
  end
end
```


```ruby
require 'decisiontree'

module ContextualResponses
  def handle_unanswerable_question(question)
    puts "I'm unable to answer the question: #{question}"
    puts "Here are some reasons why:"
    # Explain specific reasons why the question can't be answered
    # [ generative analysis]
    puts "Perhaps you could rephrase the question in one of these ways:"
    # Provide alternative wordings of the question
    # [ functional and wordnet sense analysis]
  end
end

# Example usage within a decision tree context:

attributes = ['Temperature']
training = [
  [36.6, 'healthy'],
  [37, 'sick'],
  # ... (rest of the training data)
]

dec_tree = DecisionTree::ID3Tree.new(attributes, training, 'sick', :continuous)
dec_tree.train

# If the decision tree cannot predict for a given test case:
if dec_tree.predict(test).nil?
  include ContextualResponses
  handle_unanswerable_question(test)
end```

---




| Word                                                                                                                                                                                                     | Part of Speech                                                                                                                                                              | Sense(s) from WordNet                                                                                                                                                                    | Cognitive Grammar with Pragmatics                                                                                                                                                                                                                                                                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| deRamble (verb) "to remove the rind or peel from" "to strip off a covering" "to remove something unwanted" "to get rid of something undesirable"                                                         | 1. to remove the rind or peel from 2. to strip off a covering 3. to remove something unwanted 4. to get rid of something undesirable                                        | (a) [the action of removing a cover, (b) [the action of removing an outer layer, (c) [the act of getting rid of something unwanted], (d) [the act of disposing of something undesirable] | The word "deRamble" is often used in the context of peeling or stripping off a covering. In cognitive grammar with pragmatics, it can also be used to refer to removing an outer layer from an object, getting rid of unwanted things or disposing of something undesirable.                                                                                                        |
| deRamble (noun) "the process of removing the rind or peel from" "a stripper machine for removing the rind or peel from fruits and vegetables" "a device used to remove unwanted objects"                 | 1. the process of removing the rind or peel from 2. a stripper machine for removing the rind or peel from fruits and vegetables 3. a device used to remove unwanted objects | (a) [the process of stripping off an outer layer, (b) [a machine used to remove the rind or peel from fruits and vegetables], (c) [a device used to remove unwanted objects]             | The word "deRamble" as a noun can refer to the process of removing an outer layer from an object, a stripper machine for removing the rind or peel from fruits and vegetables, or a device used to remove unwanted objects. In cognitive grammar with pragmatics, it is often used in contexts related to food processing, manufacturing processes and waste disposal respectively. |
| Note: The WordNet senses are based on the Princeton Wordnet 3.0 database and the Cognitive Grammar with Pragmatics concept is based on the theory of cognitive grammar developed by Ron Langacker.\|\|\| |                                                                                                                                                                             |                                                                                                                                                                                          |                                                                                                                                                                                                                                                                                                                                                                                     |






#### site your sources

* seems to improve accuracy
	* so far only tested with google Gemini


```markdown
Behave as a [role]

[context]

[query]

Site used sources with active links.
```

#### tone

> Use an erudite yet colloquial tone avoiding grandiloquence


#### imperative mood

The imperative mood is a grammatical mood that forms a command or request. The imperative mood is used to demand or require that an action be performed. It is **usually** found only in the present tense, second person.

#### **“Behave like” vs. “Act like”**

> You have all encountered the guidance to use “Act like an expert of some kind or other” in your prompts. In my testing “Act Like” tends to guide chat models toward persona-driven responses. “Behave like” offers more flexibility especially when the aim is for the model to operate more like a program or a system. And, it can be used in the persona-centric contexts as well.

#### **"lookback"**

*For the document above, do X* - lookback

Instead use: For the document *below*, do X

---


> [!ai]+ AI
>
> | Concept | Part of Speech | WordNet Senses | Cognitive Grammar | Pragmatics |
> |---|---|---|---|---|
> | Correlate | Verb | 1. to bring into a relationship of mutual dependence or connection | The mental process of linking two or more concepts together | The study of how language is used in context |
> | Word | Noun | 1. a single distinct meaningful element of speech or writing | The basic unit of language | The study of how words are used in context |
> | Part of Speech | Noun | 1. a grammatical category of words (such as noun, verb, adjective, or adverb) that has similar syntactic functions | The grammatical category of a word | The study of how words are used in context |
> | WordNet Senses | Noun | 1. a set of synonyms for a given word | The different meanings of a word | The study of how words are used in context |
> | Cognitive Grammar | Noun | 1. a theory of grammar that emphasizes the role of cognition in language | The mental process of understanding language | The study of how language is used in context |
> | Pragmatics | Noun | 1. the study of the relationship between language and context | The study of how language is used in context | The study of how language is used in context |

---

## decoding messages


```markdown
Three Layers of Any Message In these examples of decipherment of out-of-context messages, we can separate out fairly clearly three levels of information: (1) the frame message; (2) the outer message; (3) the inner message. The one we are most familiar with is (3), the inner message; it is the message which is supposed to be transmitted: the emotional experiences in music, the phenotype in genetics, the royalty and rites of ancient civilizations in tablets, etc. To understand the inner message is to have extracted the meaning intended by the sender.. The frame message is the message "I am a message; decode me if you can!"; and it is implicitly conveyed by the gross structural aspects of any information-bearer. To understand the frame message is to recognize the need for a decoding- mechanism. If the frame message is recognized as such, then attention is switched to level (2), the outer message. 

This is information, implicitly carried by symbol-patterns and structures in the message, which tells how to decode the inner message. To understand the outer message is to build, or know how to build, the correct decoding mechanism for the inner message. This outer level is perforce an implicit message, in the sense that the sender cannot ensure that it will be understood. It would be a vain effort to send instructions which tell how to decode the outer message, for they would have to be part of the inner message, which can only be understood once the decoding mechanism has been found. For this reason, the outer message is necessarily a set of triggers, rather than a message which can be revealed by a known decoder. 

The formulation of these three "layers" is only a rather crude beginning at analyzing how meaning is contained in messages. There may be layers and layers of outer and inner messages, rather than just one of each. Think, for instance, of how intricately tangled are the inner and outer messages of the Rosetta stone. To decode a message fully, one would have to reconstruct the entire semantic structure which underlay its creation and thus to understand the sender in every deep way. Hence one could throw away the inner message, because if one truly understood all the finesses of the outer message, the inner message would be reconstructible.
```
page 174 Godel Escher Bach


---

#### subchoices

*Beyond ChatBots: ExploreLLM for Structured Thoughts with Choices*

![](/assets/img/screenshot/explorellm_promptexample.png)

---

## resources

[CRISPE Framework](https://guide.flowgpt.com/engineering/1basics/3basic-framework#crispe-framework)

[Elavis Saravia Framework](https://guide.flowgpt.com/engineering/1basics/3basic-framework#elavis-saravia-framework)

[techniques: reflexion](https://www.promptingguide.ai/techniques/reflexion)

[ai sleeper agents](https://www.astralcodexten.com/p/ai-sleeper-agents?utm_source=tldrnewsletter)

[llmstudio](https://github.com/TensorOpsAI/LLMstudio?tab=readme-ov-file)

[design patterns](https://www.tensorops.ai/post/design-patterns-in-prompt-engineering-a-practical-approach)

[example techniques](https://www.tensorops.ai/post/prompt-engineering-techniques-practical-guide)
[example techniques](https://www.mercity.ai/blog-post/advanced-prompt-engineering-techniques)

[tree of thoughts overview](https://www.promptingguide.ai/techniques/tot)


#### perplexity 
https://www.perplexity.ai/search/common-issues-mraIIPrASQO.WwplI8nrVA?s=u

https://www.perplexity.ai/search/common-issues-mraIIPrASQO.WwplI8nrVA?s=c

---



