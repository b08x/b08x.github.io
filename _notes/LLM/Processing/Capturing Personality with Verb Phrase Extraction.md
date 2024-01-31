---
---


```ruby
text.each_paragraph do |paragraph|
  paragraph.chunks.select do |chunk|
    chunk.label == "VP" && paragraph.heading.downcase.include?("methods") |paragraph.heading.downcase.include?("results")
  end
end
# `unless` checks if the paragraph heading doesn't include "methods" or "results" and skips VP chunking in those sections.


```


mutable.ai -> data-driven-characters -> explain how verb phrase extraction could enhance the transcription process...

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

I hope this demonstrates how verb phrase extraction can be a valuable tool while appreciating the richness of language and character details. Do you have any other scenarios where you'd like to see this applied?