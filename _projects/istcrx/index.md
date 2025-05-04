---
layout: post
title: Intelligent Support Ticket Context Retrieval
category: GenAI
author: Robert Pannick using several models
img: assets/img/syncopated/syncopated030.png
tags: [ansible, automation, support]
description: Hybrid RAG Retrieval & Diagnostic Workflow for IT Checkup & Support
images:
  lightbox2: true
  photoswipe: true
  spotlight: true
  venobox: true
related_posts: true
giscus_comments: true
tabs: true
permalink: /projects/istcrx/
importance: 1
category: work
---

<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include video.liquid path="assets/video/Video_Ready_Querying_Technology.mp4" class="img-fluid rounded z-depth-1" controls=true autoplay=true loop=true %}
    </div>

</div>


<div class="row mt-3">
    <div class="col-sm mt-3 mt-md-0">
        {% include audio.liquid path="assets/audio/ElevenLabs_Untitled_Project_b.mp3" controls=true %}
    </div>
</div>
<div class="caption">
    An allegory...
</div>

Picture this: a room full of allegedly professional adults experiencing what corporate euphemism generators call a "service availability challenge" – translation: everything's spectacularly fucked and nobody knows why. 

The war room had that special bouquet of desperation – six technically-overtitled individuals hunched over MacBooks like medieval monks awaiting divine intervention, while some disembodied voice on speakerphone helpfully suggested, "Is it plugged in?" prompting facial expressions normally reserved for people contemplating arson.

In the corner sat Marco, finger-dancing across his keyboard with the neurotic precision of someone who definitely has strong opinions about mechanical switch types. He was writing what he called an "Ansible playbook," which is tech-speak for "I'm going to passive-aggressively interrogate inanimate servers until they confess their sins."

"You see," Marco explained, noticing my civilian confusion, "we've built this entire medical system—LumineScan—scattered across Azure's digital purgatory like the belongings of a messy roommate. Diagnosing it is like trying to extract a medical history from a patient who's both unconscious and pathologically dishonest."

His playbook, I learned, was essentially a formalized way of asking the cloud increasingly pointed questions that become progressively more accusatory. "Where EXACTLY is our resource group hiding? Why is the web app giving us the silent treatment? Is the SQL database having an existential crisis or just being deliberately obtuse?"

What truly captivated me wasn't the technical elegance but the deeply codependent relationship on display. Humans building systems so incomprehensible that we need to develop formal protocols just to ask them why they've decided to ruin our Tuesday. It's like Victorian courtship rituals but with JSON objects and significantly more caffeine.

The playbook itself read like a passive-aggressive letter to an ex: starting with superficially polite inquiries before diving into invasive demands for explanation. First, it introduced itself to the resource group—digital equivalent of "Remember me? The one who CREATED you?" Then came increasingly probing questions about each component's life choices and current emotional state.

"This part here," Marco said, pointing to a section labeled 'Display LumineScan App Service Info', "is essentially asking our web application if it's taking its meds. Is it functional? What aliases is it using these days? Is it insisting on encryption, or has it gone full exhibitionist?"

Further down, the script was interrogating databases – both SQL and Cosmos DB – "Think of SQL as your accountant uncle who still uses a flip phone, and Cosmos as that roommate who claims to be 'between jobs' but somehow affords designer everything."

The technical approach mirrored how detectives break down reluctant witnesses. First establishing baseline facts, then checking for inconsistencies, before methodically cornering each component with its contradictions. The connectivity checks between components were essentially asking, "Your story doesn't match what your friend told us – care to explain?"

When Marco finally executed his digital subpoena, the previously mute machines suddenly became chatty witnesses, responding with locations, statuses, and various technical admissions. The NSG Rules section—which Marco described as "the bouncer deciding which packets get VIP access and which get told the system is at capacity"—revealed exactly which digital hooligans were being allowed past the velvet rope.

As information flooded in, room anxiety visibly downshifted from "imminent career extinction" to "probably won't need to update LinkedIn tonight." There's something weirdly comforting about transitioning from "everything's burning and we're clueless" to "specific things are burning in specifically identifiable ways."

I couldn't help seeing parallels to how humans handle any mysterious breakdown—whether it's a car making that not-right noise, a relationship imploding, or in this case, virtual machines staging a coordinated rebellion. We interrogate, document contradictions, construct theories, and gradually force chaotic nightmares into merely complicated annoyances.

By the time I escaped, they'd identified the culprit—something about Redis cache permissions, which Marco characterized as "just a consent issue between services that never learned to use their safe words"—and were implementing solutions.

I departed thinking perhaps the most remarkable thing about our digital age isn't the technology, but the elaborate psychological manipulation techniques we've developed to communicate with it—these formal gaslighting protocols that let us extract confessions from our own creations. For those designing proof-of-concept implementations, these infrastructure interrogations aren't just troubleshooting—they're psychological profiles revealing how our theoretical fantasies collapse upon contact with reality. In teaching machines to talk, we've inadvertently created a new therapeutic modality—one conducted in YAML and curl commands rather than natural language, but therapy nonetheless.

And in that therapy session, even buried under technical jargon and stack traces, you can still hear the distinctly human voice asking the most fundamentally codependent question: "What did I do wrong this time, and how can I make you love me again?"

---

[idea](idea)

[plan](plan)

[example](example)


---