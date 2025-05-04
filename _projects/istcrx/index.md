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

<div id="elevenlabs-audionative-widget" data-height="90" data-width="100%" data-frameborder="no" data-scrolling="no" data-publicuserid="92d135b76a931d6c34c5346b967eba55b32811b1f0d1b81d613d61bc1ca54732" data-playerurl="https://elevenlabs.io/player/index.html" data-projectid="pO1i8JEPfyZxhEINaPtM" >Loading the <a href="https://elevenlabs.io/text-to-speech" target="_blank" rel="noopener">Elevenlabs Text to Speech</a> AudioNative Player...</div><script src="https://elevenlabs.io/player/audioNativeHelper.js" type="text/javascript"></script>

# Introduction

A nice and relaxing narrative to help the brain put itself in the mood....

## A Proof of Concept Approach to Cloud Infrastructure Interrogation

The war room had that particular tension unique to production outages - a mixture of focused determination and simmering urgency. Eight engineers hunched over keyboards, the blue light of monitors illuminating tired faces, while the CEO's voice periodically crackled through the speakerphone asking for updates.

In the center of it all was Elena, methodically typing commands with the precision of someone performing surgery. What caught my attention wasn't just her technical skill but the structured approach she applied to an inherently chaotic situation.

"Our entire patient management system is distributed across multiple cloud regions," Elena explained when she noticed my interest. "When something breaks, it's like trying to find a specific tree in a forest while blindfolded."

Her approach was fascinating - a systematic interrogation protocol designed to extract information from systems that weren't explicitly built to provide it. She had created what she called "cloud archaeology tools" - scripts that methodically excavated information layers from their AWS infrastructure.



"Most people think cloud outages are about fixing things," she said, "but they're actually about information gathering first. You can't fix what you don't understand."

The investigation followed a clear pattern: first establishing broad context about the environment, then examining specific service health metrics, before diving into the relationships between components. This wasn't random troubleshooting - it was a deliberate conversation with their infrastructure.

Her script first queried the overall health of their production environment, then examined each microservice's state, and finally analyzed the network pathways between them. The code itself formed a kind of narrative, starting with general questions before moving to increasingly specific inquiries.

"This section," Elena said, pointing to a function labeled 'inspect_security_groups', "is checking which services are allowed to communicate with each other. Often our problems aren't technical failures but permission misconfigurations."

  <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/2025-044.jpg" title="example image" class="img-fluid rounded z-depth-1" %}
   </div>

What struck me was how this resembled a medical diagnostic procedure - gathering baseline measurements, checking vital signs, and examining the connections between systems. The parallels to human medicine were unmistakable.

When she executed the code, the terminal filled with structured data - services reporting their status, configuration details, and connection information. The information transformed the team's understanding from vague concern to precise diagnosis.

"There," Elena said, pointing to an anomaly in the logs. "Our authentication service has been rate-limited because of unexpected traffic patterns. That's causing the cascading failures downstream."

For those of us designing new systems, this experience highlighted something crucial: the importance of building observability from the beginning. The ability to systematically question and receive answers from your infrastructure isn't a luxury - it's a fundamental requirement for operating complex systems.

By the end of the incident, they had identified and resolved the issue. But more importantly, they had demonstrated that even the most complex technical systems respond to structured investigation. By asking the right questions in the right sequence, what initially appeared as inscrutable technology revealed its inner workings.

The most valuable insight wasn't the specific technique Elena used, but the mindset behind it - the understanding that our relationship with technology is fundamentally a conversation. 

---

## PoC [in progress]

[idea](idea)

[plan](plan)

[example](example)


---