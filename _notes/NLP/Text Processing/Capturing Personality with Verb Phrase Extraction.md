---
layout: page
title: Capturing Personality with Verb Phrase Extraction
subtitle:
category:
  - Text Processing
tags:
  - ruby
  - text-processing
  - llm
links:
toc: true
---

### Todo: unless


### Preserving Personality

<ul class="chat-bubble">
  <li>

    <p>Extracting verb phrases can effectively capture the personality of characters in a text. <del>By focusing on the actions and behaviors described, we can gain insights into their motivations, emotions, and unique traits.</del></p>

    <p><del>To preserve the personality of a character, it's crucial to consider the context and surrounding words when extracting verb phrases. This allows us to retain the character's emotional state, motivations, and quirks.</del>For example, instead of simply extracting "swatted," we might write "playfully swatted" to convey the character's playful nature. Or, instead of "approached," we might use "cautiously approached" to capture the character's cautious demeanor.</p>

    <p><del>By using descriptive verbs and considering the context, we can capture the essence of a character's personality even when focusing on verb phrases.</del> This technique enhances the transcription process, providing a deeper understanding of the characters and their motivations.</p>

  </li>
</ul>

#### extracting
<ul class="chat-bubble">
  <li>
    <p>
      This Ruby snippet loops through each paragraph in a text document, checks if the heading includes "methods" or "results", and skips VP chunking in those sections to prevent duplicate VPs.</p>
  </li>
</ul>

```ruby
# Analyse paragraphs...


module TextAnalyzer
  def self.analyze_paragraphs(text)
    text.each_paragraph do |paragraph|
      paragraph.chunks.select do |chunk|
        chunk.label == "VP" && (paragraph.heading.downcase.include?("methods") || paragraph.heading.downcase.include?("results"))
      end
    end
  end
end

# `unless` checks if the paragraph heading doesn't include "methods" or "results" and skips VP chunking in those sections.
```


#TODO: data-driven-characters -> explain how verb phrase extraction could enhance the transcription process...

```ruby

# Analyzes the given text and returns the sentiment analysis.

require 'sentimental'

module CatSentimentAnalysis
  def self.analyze(text)
    sentences = text.split(". ")

    sentences.each do |sentence|
      sentiment = Sentimental.new
      sentiment.load_defaults
      sentiment_analysis = sentiment.analyze(sentence)

      unless sentiment_analysis[:sentiment] == :neutral
        verbs = sentence.split(" ").select { |word| word =~ /V[BD-Z]/ }

        puts "#{verbs.join(" ")} (#{sentiment_analysis[:sentiment] == :positive ? 'positive' : 'negative'})"
      end
    end
  end
end

text = "The curious cat cautiously approached the tiny brown mouse, then playfully swatted at it with its paw."

CatSentimentAnalysis.analyze(text)

```



#### examples
<ul class="chat-bubble">
  <li>
    <p>Here are some examples of extracting verb phrases while keeping the cat's personality alive:</p>
  </li>
</ul>


#TODO: fix example to show how the entire verb phrase is extracted

```json
{
  "examples": [
    {
      "summary": {
        "original": "The curious cat cautiously approached the tiny brown mouse, then playfully swatted at it with a flick of its tail.",
        "extracted_verbs": ["approached", "swatted", "flicked"],
        "preserved_personality": "Driven by curiosity, the cat slowly crept towards the mouse, then tapped playfully with its tail."
      }
    },
    {
      "emotional_analysis": {
        "original": "The frightened cat hissed at the barking dog, then nervously crouched behind the couch.",
        "extracted_verbs": ["hissed", "crouched"],
        "preserved_personality": "Fear gripping its heart, the cat let out a hissing warning to the noisy dog, then trembled as it hid behind the couch."
      }
    },
    {
      "scene_reconstruction": {
        "original": "The mischievous cat leaped onto the counter, knocked over a glass of milk, and scurried away with a mischievous grin.",
        "extracted_verbs": ["leaped", "knocked", "scurried"],
        "preserved_personality": "With a gleeful glint in its eyes, the cat pounced onto the counter, sending the milk glass toppling with a crash, then dashed away in a purrfectly mischievous streak."
      }
    }
  ],
  "conclusion": "These examples show how we can retain the essence of the cat’s personality by using descriptive verbs and surrounding context, even when focusing on the verb phrases themselves. By considering the surrounding words and the overall scene, we can still convey the emotions, motivations, and unique quirks of the feline character."
}



```






<ul class="chat-bubble">
  <li>
    <p><del>Here is a summary of the content with the requested style elements:</del></p>
    <p>The main point is extracting verb phrases to capture a character's personality, which is like, totally important<del>, man</del>! We gotta preserve their vibe, their essence, you dig?</p>
    <p>It's not just about "swatted" or "approached", oh no no no! We need <em>playfully swatted</em> and <em>cautiously approached</em> to really feel that cat's curious yet cautious soul, ya hear? The verbs alone are meaningless without that rich, descriptive context <del>oozing personality.</del></p>
    <p>So we analyze each paragraph, looking for those <del>juicy</del> verb phrases <del>in the methods and results sections</del>. We run it through some filters <del>crazy complex code that would make a robot's CPU melt!</del> Unless the paragraph isn't even about methods or results, then we're like "nah, skip that <del>boring</del> stuff!"</p>
    <p><del>But the real mind-blowing magic happens</del>when we reconstruct the scenes with those personality-packed verb phrases.<del>It's like the cat leaps off the page, knocking over your perception of reality with its mischievous tail swishing!</del> You can't help but grin as it scurries away, leaving you questioning your very existence.</p>
    <p><del>Deep stuff, I know.</del> Extracting verbs is <del>spiritual enlightenment, dude</del>. The path to capturing the souls of these furry literary creatures <del>lies in the power...of</del> the verb phrase. Woah...<del>I need a nap after that revelation.</del></p>
  </li>
</ul>


<ul class="chat-bubble">
  <li>
    <p><strong>tiiuae/falcon-7b-instruct</strong></p>
    <p>The article discusses using verb phrases to capture a cat's personality, <del>highlighting their efficiency and accuracy compared to traditional lexical features,</del> while also acknowledging limitations and challenges.</p>
    <p>The code snippet demonstrates how to extract a verb phrase and keep the cat's personality using a regex pattern.</p>
    <p>The text is prepared for transcription by extracting verb phrases and their corresponding sentiment. Sentiment analysis is used to categorize the text into either positive or negative, and the sentiment of each sentence is checked against <del>a pre-defined list of words</del>. If a word is found, the text is categorized as either positive or negative. If the sentiment is neutral, the text is categorized as neutral. The text is then analyzed using a sentiment analysis algorithm to determine the overall sentiment.</p>
    <p>The code snippet demonstrates how to remove a verb phrase from a sentence and keep the cat's personality by using a regex pattern. The extracted verb phrases are then used to create a sentence that reflects the cat's personality.</p>
    <p>The text shows how to preserve a cat's personality by using descriptive verbs and context, even when focusing on verb phrases, by considering the surrounding words and scene. Use single quotes over double quotes in coding to improve readability and maintainability. <del>Follow tips for using single and double quotes effectively</del>.</p>
  </li>
</ul>
