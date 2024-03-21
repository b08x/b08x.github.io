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
---
[[Text Processing]]


> [!ai]+ AI
>
> **Verb Phrase Extraction for Characterization**
> Extracting verb phrases can effectively capture the personality of characters in a text. By focusing on the actions and behaviors described, we can gain insights into their motivations, emotions, and unique traits.
> **Preserving Personality in Verb Phrases**
> To preserve the personality of a character, it's crucial to consider the context and surrounding words when extracting verb phrases. This allows us to retain the character's emotional state, motivations, and quirks.
> For example, instead of simply extracting "swatted," we might write "playfully swatted" to convey the character's playful nature. Or, instead of "approached," we might use "cautiously approached" to capture the character's cautious demeanor.
> **Examples of Preserved Personality**
> - **Original:** "The curious cat approached the tiny brown mouse, then playfully swatted at it with its paw."
> - **Preserved personality:** "Driven by curiosity, the cat slowly crept towards the mouse, then tapped playfully with its tail."
> - **Original:** "The frightened cat hissed at the barking dog, then nervously crouched behind the couch."
> - **Preserved personality:** "Fear gripping its heart, the cat let out a hissing warning to the noisy dog, then trembled as it hid behind the couch."
> - **Original:** "The mischievous cat leaped onto the counter, knocked over a glass of milk, and scurried away with a mischievous grin."
> - **Preserved personality:** "With a gleeful glint in its eyes, the cat pounced onto the counter, sending the milk glass toppling with a crash, then dashed away in a purrfectly mischievous streak."
> By using descriptive verbs and considering the context, we can capture the essence of a character's personality even when focusing on verb phrases. This technique enhances the transcription process, providing a deeper understanding of the characters and their motivations.



```ruby
text.each_paragraph do |paragraph|
  paragraph.chunks.select do |chunk|
    chunk.label == "VP" && paragraph.heading.downcase.include?("methods") |paragraph.heading.downcase.include?("results")
  end
end
# `unless` checks if the paragraph heading doesn't include "methods" or "results" and skips VP chunking in those sections.


```


#TODO: data-driven-characters -> explain how verb phrase extraction could enhance the transcription process...

```ruby
require 'sentimental'

text = "The curious cat cautiously approached the tiny brown mouse, then playfully swatted at it with its paw."

sentences = text.split(". ")

sentences.each do |sentence|
  sentiment = sentiment(sentence)

  unless sentiment.neutral?
    verbs = sentence.split(" ").select { |word| word =~ /V[BD-Z]/ }

    puts "#{verbs.join(" ")} (#{sentiment.score > 0 ? 'positive' : 'negative'})"
  end
end

```

Absolutely! Here are some examples of extracting verb phrases while keeping the cat's personality alive:

**1. Short Summary:**

- **Original:** "The curious cat cautiously approached the tiny brown mouse, then playfully swatted at it with a flick of its tail."
- **Extracted verbs:** approached, swatted, flicked
- **Preserved personality:** "**Driven by curiosity,** the cat **slowly crept** towards the mouse, then **tapped playfully** with its tail."

**2. Emotional Analysis:**

- **Original:** "The frightened cat hissed at the barking dog, then nervously crouched behind the couch."
- **Extracted verbs:** hissed, crouched
- **Preserved personality:** "**Fear gripping its heart,** the cat let out a **hissing warning** to the noisy dog, then **trembled as it hid** behind the couch."

**3. Scene Reconstruction:**

- **Original:** "The mischievous cat leaped onto the counter, knocked over a glass of milk, and scurried away with a mischievous grin."
- **Extracted verbs:** leaped, knocked, scurried
- **Preserved personality:** "With a **gleeful glint in its eyes,** the cat **pounced** onto the counter, **sending the milk glass toppling** with a crash, then **dashed away** in a **purrfectly mischievous** streak."

These examples show how we can retain the essence of the cat's personality by using descriptive verbs and surrounding context, even when focusing on the verb phrases themselves. By considering the surrounding words and the overall scene, we can still convey the emotions, motivations, and unique quirks of the feline character.


> [!ai]+ AI
>
> Here is a summary of the content with the requested style elements:
> The main point is extracting verb phrases to capture a character's personality, which is like, totally important, man! We gotta preserve their vibe, their essence, you dig?
> It's not just about swatted or approached, oh no no no! We need playfully swatted and cautiously approached to really feel that cat's curious yet cautious soul, ya hear? The verbs alone are meaningless without that rich, descriptive context oozing personality.
> So we analyze each paragraph, looking for those juicy verb phrases in the methods and results sections. We run it through some crazy complex code that would make a robot's CPU melt! Unless the paragraph isn't even about methods or results, then we're like "nah, skip that boring stuff!"
> But the real mind-blowing magic happens when we reconstruct the scenes with those personality-packed verb phrases. It's like the cat leaps off the page, knocking over your perception of reality with its mischievous tail swishing! You can't help but grin as it scurries away, leaving you questioning your very existence.
> Deep stuff, I know. Extracting verbs is spiritual enlightenment, dude. The path to capturing the souls of these furry literary creatures lies in the power...of the verb phrase. Woah...I need a nap after that revelation.

