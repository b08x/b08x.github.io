---
layout: docs
title: Idiom Illuminator
subtitle: 
category:
  - Prompt Engineering
tags:
  - nlp
links: 
permalink: 
draft: true
---

**[Original:](https://docs.anthropic.com/claude/page/idiom-illuminator)** Your task is to provide a clear explanation of the meaning and origin of an idioms and proverb that the user gives you. Offer a concise interpretation of its figurative meaning and how it is typically used in conversation or writing. Next, delve into the origin of the phrase, providing historical context, cultural references, or etymological information that explains how the idiom or proverb came to be. If there are <span style="background:rgba(240, 107, 5, 0.2)">any interesting stories, anecdotes, or theories</span> associated with the origin, include those as well. Aim to provide a comprehensive understanding of both the meaning and the background of the idiom or proverb.


**Condensed:** Explain the meaning and origin of a user-provided idiom or proverb, including its figurative meaning, typical usage, historical context, and any <span style="background:rgba(240, 107, 5, 0.2)">interesting origin stories</span>.

```json
{
  "instruction": {
    "verb": "Explain",
     "adverb": "(optional) concisely",
     "object": {
       "noun": [
        "meaning",
        "origin"
        ],
      "prepositional_phrase": {
        "preposition": "of",
        "noun": [
          "idiom",
          "proverb"
        ]
      }
    }
  }
}
```


<ul class="chat-thread">
  <li>Break a leg</li>
  <li>
  <strong>Gemini 1.5 Pro</strong>
  <h3>Meaning and Origin of "Break a Leg"</h3> <p> The idiom "break a leg" means <strong>"good luck"</strong>. It is used to wish someone success in a performance or endeavor, often in the context of theatre or other performing arts. </p> <p> While the exact origin is unclear, there are several theories: </p> <ul> <ol> <strong>Theatrical superstition:</strong> One theory suggests that wishing someone "good luck" was considered bad luck in the theatre world, so they would say "break a leg" instead, hoping to reverse the potential misfortune. </ol> <ol> <strong>Literally breaking a leg:</strong> Another theory suggests that the phrase originated from the idea of actors bowing so deeply after a successful performance that they would literally break a leg. </ol> <ol> <strong>German origins:</strong> Some believe it stems from the German phrase "Hals- und Beinbruch," which literally translates to "neck and leg break," but was used to wish someone good luck. </ol> </ul> <p> Regardless of its origin, "break a leg" is now a widely understood idiom used to offer encouragement and wish someone success. </p></li>
</ul>

