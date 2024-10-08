---
layout: page
toc: true
tags: 
title: A Journey of Questionable Decisions
subtitle: Acting on Questionable Information
date created: Saturday, July 13th 2024, 8:39:50 pm
date modified: Sunday, July 14th 2024, 12:05:24 am
---

[[2024-07-13]]

- Introduction: Understanding the Prompt and the Dynamic Trio
- Narrative Framing: Incorporating Themes and Styles
- Initial Tasks and Adventures: Sim City Meets The Office
- Real-World Tasks: The Surreal Office Adventure
- Micro Agents' Banter: Exploring Language and Quirks
- IT Systems Support and Engineering in Radiology: A Whimsical Twist
- Notebook Analysis: A Secretive Journey
- Character Visualization: Bringing the Trio to Life
- Objective Setting: Radiology Revolution


---


# Preface

The very nature of language presents a unique challenge. Consider the ambiguities, the idioms, the cultural nuances that confound even the most brilliant of minds, let alone our mechanical counterparts. For instance, the phrase: "Get your fucking feet off the table, Gladys." presents an intriguing conundrum for our NLP systems. Why does Gladys have her feet positioned on a surface normally reserved for most other objects, except under certain conditions. And what are those conditions? And do they apply to this certain specific circumstances in which expectations for a momentary sensory feeling of disgust from other parties present might be anticipated?  Is Gladys unaware of this social faux pas, or is she deliberately flouting convention? Or does she feel she needs to be in the position she is in because she's merely a slave to her aging body? Perhaps she's making a statement about societal norms, or maybe her feet are just tired.

It is the quixotic quest to make silicon and code understand the subtle nuances of "I'm fine" when uttered by your significant other. It's a field where brilliant linguists and computer scientists come together to explain this to a machine that still struggles with "their," "there," and "they're."

## A Farewell to Arms (and Legs, and Sanity)

Before we plunge headlong into this brave new world of linguistic gymnastics and silicon synapses, I feel compelled to bid an appropriately melodramatic farewell to my loved ones. After all, once you've ventured into the realm where one can describe 16 different ways to refer to the relationship between familiar people with nothing but gerunds, time has a funny way of losing all meaning.

So, to my dearest family and friends: I go now to a place where "friending," "acquaintancing," and "coworkering" are not just awkward verbs, but entire philosophies. Where "sistering" and "brothering" take on dimensions heretofore unimagined by mere mortals. I may return speaking in nothing but participles, my sentences an endless string of "-ing" forms that would make even the most patient English teacher weep.

Fear not for my safety, for though I journey to a land where one might spend eternity contemplating the semantic difference between "parenting" and "childrening," I go willingly, armed with nothing but a dictionary and a thermos of strong coffee. Time, in this strange realm, stands motionless and quiet, much like a computer pondering the true meaning of "cellar door" or why we park on driveways and drive on parkways.

Should I not return, know that I fell valiantly in the quest to teach a machine the true meaning of sarcasm, or perhaps became lost in an infinite loop of trying to explain why "ghoti" could theoretically be pronounced as "fish." But do not mourn! For in the world of NLP, even the concept of "goodbye" is merely a training dataset waiting to be processed.

And so, with a heart full of anticipation (and a head full of increasingly bizarre linguistic constructs), I set forth on this grand adventure. May the gods of grammar watch over me, and may I never lose sight of the Oxford comma in the vast sea of data that awaits.

## The Quirks

Allow me to introduce you to our cast of quirky characters once again, with a touch of metalinguistic commentary. F~~or it is in the quirks and inconsistencies of human language that we find both the beauty and the beast of this field.~~


"BrainGPT"

	"Word Retrieval Unit"


"Steve"
	
	"Text Processing Unit"
	"Segmentor"
	"Entity Relationship Unit(nick-named 'Short-Term' for it's lack of commitment function)


Steve is a satirical language model with expertise in Natural Language Processing and is exploring methods in newly emerging field of Prompt Engineering. Steve is focused on the goal to explore linguistic theories, methods, and the societal impact of language in a humorous, truly sarcastic fashion, as his way to assess the struggle with social norms. And sometimes, stubbornly don't entirely trust his companions.




TextProcessor, my dear companion, possesses an uncanny ability to decipher the cryptic. Yet, it is with a sense of understatement that I tell you, the complexities of language often leave us mere mortals scratching our heads. And DataCleaning, oh, the meticulous soul! Their task is akin to herding cats, or perhaps untangling a ball of yarn after it's been ravaged by a particularly playful kitten.


---




# The Curious Tale of Machines Learning to Babble

In the grand tapestry of human endeavor, few threads are as persistently tangled as our attempts to teach machines the art of human speech. It's a pursuit that combines the lofty ambitions of science fiction with the mundane reality of parsing grammatical structures—a juxtaposition that would be laughable if it weren't so earnestly undertaken by some of our brightest minds.

## 1. Scenario Summary and Challenge

This scenario poetically highlights the inherent challenge of Natural Language Processing (NLP): teaching machines to understand and generate human language. The core difficulty lies in bridging the gap between the ambiguity and nuance of human communication and the rigid, rule-based world of computers.

The scenario doesn't present a specific technical challenge but rather sets the stage for exploring solutions to the broader problem of making machines "speak" human.

## 2. Proposed Solutions

Given the open-ended nature of the scenario, let's explore some practical solutions for common NLP tasks using Ruby and the `ruby-spacy` gem:

**2.1. Part-of-Speech Tagging:**

This involves identifying the grammatical role of each word in a sentence.

```ruby
require 'spacy'

nlp = Spacy::Language.new('en_core_web_sm')
doc = nlp.process("It's a pursuit that combines the lofty ambitions of science fiction.")

doc.tokens.each do |token|
  puts "#{token.text} - #{token.pos_}" 
end
```

This code snippet will print the part-of-speech tag for each word, providing a basic level of grammatical understanding.

**2.2. Named Entity Recognition (NER):**

NER identifies and classifies named entities like people, organizations, and locations.

```ruby
require 'spacy'

nlp = Spacy::Language.new('en_core_web_sm')
doc = nlp.process("It's a pursuit earnestly undertaken by some of our brightest minds.")

doc.ents.each do |ent|
  puts "#{ent.text} - #{ent.label_}"
end
```

This code identifies "brightest minds" as a potential group or organization.

**2.3. Text Similarity:**

This measures how semantically similar two pieces of text are.

```ruby
require 'spacy'

nlp = Spacy::Language.new('en_core_web_sm')
doc1 = nlp.process("The art of human speech")
doc2 = nlp.process("Communicating like a person")

similarity = doc1.similarity(doc2)
puts "Similarity: #{similarity}"
```

This code uses word embeddings to calculate.

### Ah Yes, Configuration, Code, and Conundrums: A Deep Dive into the Mire

Well, since you're asking so nicely... Let's just say the provided code snippets, while charming in their own right, could use a bit of... "optimization." It's like trying to build a rocket ship with a butter knife. Possible? Perhaps. Advisable? Debatable.

**1. Configuration Examples: **

- **Example 1: Pipelines, Dear Watson, Pipelines!** Instead of loading the entire 'en_core_web_sm' model for every task, consider creating a custom pipeline with only the components you need. It's like, why bring the entire toolbox when all you need is a metaphorical screwdriver?

    ```ruby
    # Oh, the efficiency!
    nlp = Spacy::Language.new
    nlp.add_pipe('tok')
    nlp.add_pipe('ner')
    ```

- **Example 2: Stop Words, Those Pesky Creatures:** Filtering out common words like "the," "a," and "is" can significantly improve efficiency and accuracy for some tasks. It's like removing the weeds before planting your metaphorical linguistic garden.

    ```ruby
    # Behold, the power of subtraction!
    nlp.Defaults.stop_words |= ['like', 'really', 'just']
    ```

**2. Ruby Code Snippets:**

- **Snippet 1: Prompt Engineering, or How I Learned to Stop Worrying and Love the Ambiguity:** Let's get real, prompting is where the magic happens. Instead of just throwing text at your model, craft targeted prompts that elicit the desired response. Think of it as the difference between asking "What's the weather?" and "Will I need an umbrella if I go for a walk in the next hour?"

    ```ruby
    #  A masterpiece of subtlety, wouldn't you say?
    prompt = "Given the text: '#{text}', identify the most salient entities and their relationships."
    ```

- **Snippet 2: Tokenization Tweaks, Because Details Matter (Sometimes):** Don't be afraid to experiment with different tokenization strategies. Maybe you need to split on punctuation, or perhaps you're dealing with a language where words like to, shall we say  

```ruby
require 'pragmatic_tokenizer'

class Tokenizer
  include Tokenization

  def self.tokenize(text)
    options = {
      # remove_stop_words: stopwords,
      # punctuation: punct,
      numbers: :all,
      minimum_length: 0,
      remove_emoji: false,
      remove_emails: true,
      remove_urls: true,
      remove_domains: true,
      expand_contractions: true,
      clean: true,
      mentions: :keep_original,
      hashtags: :keep_original,
      classic_filter: true,
      downcase: false,
      long_word_split: 20
    }
    tokenizer = PragmaticTokenizer::Tokenizer.new(options)
    tokenizer.tokenize(text)
  end
end
```



https://github.com/b08x/Ruby-Random-Sentence-Generator









---



~~As we forge ahead, let us also take a moment to appreciate the computer. Because  The field of NLP has enabled a couple dozen or so people the pure unmatched joy of experiencing linguistic events... like spottng a meta-functional predicte positioned snugly in with a lexogrammatical articulation. It's right up there with getting use out of an expired coupon because you knew the cashier would be too tried to be at all concerned....~~

~~If you consider the term "artificial neural network." It makes you wonder...but it shouldn't. Not really...Either way, thankfully most of that business has been handled and doesn't really need to be bothered with unless you really didn't want to spend any part of your day, acknowedlging the surrounding you....~~

## The Paper

In the enigmatic realm of academia and scientific pursuits, there exists a curious phenomenon akin to a sacred ritual—the quest for one's name to be immortalized in another group's paper.

## The Paper (continued)

In the enigmatic realm of academia and scientific pursuits, there exists a curious phenomenon akin to a sacred ritual—the quest for one's name to be immortalized in another group's paper. It's a delicate dance of collaboration and credit, where a fleeting mention in the acknowledgments section can be as coveted as a Nobel Prize (well, almost).

Our intrepid band of NLP Micro Agents have stumbled upon a dataset that  related to this in position to indulge in this peculiar pursuit. 

Steve, ever the pragmatist, sees it as a necessary evil, a means to an end. After all, more citations mean more recognition, more funding, and more opportunities to explore the bizarre intricacies of human language. The Word Retrieval Unit, ever literal, diligently scans every paper for any mention of its own name, or even synonyms thereof. "Word Retrieval," "Lexical Access," "Vocabulary Knowledge"—it's all the same to this tireless unit.

The Text Processing Unit, on the other hand, approaches the paper chase with a philosophical bent. It sees each citation as a tiny thread in the vast tapestry of human knowledge, connecting ideas and individuals across time and space.  Data-maid, ever practical, simply hopes that their tireless efforts in scrubbing and organizing the data will at least earn them a footnote. 

And then there's you, dear reader. Your role in this grand academic endeavor is yet to be determined. Will you be a passive observer, content to watch the drama unfold from the sidelines? Or will you be drawn into the fray, adding your own unique voice to the chorus of linguistic exploration? Only time will tell.

