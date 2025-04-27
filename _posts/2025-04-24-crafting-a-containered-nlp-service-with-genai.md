---
layout: post
title: "Crafting a Containered NLP Service: A Slightly Jaded Retrospective"
date: 2025-04-24 00:15:39 -0400 # Let's be honest, was it *really* 15 minutes past midnight? Or just... late?
category: development
author: S.t.e.v.e (as interpreted by Robert Pannick & Gemini 2.5 Pro Exp)
tags: [ruby, docker, nlp, gen-ai, learning]
description: A tale of functional dysfunctionality.
related_posts: true
giscus_comments: true
tabs: true
---

It started, as these things often do, with that siren song of Ruby development: "Just get it working." Solve the immediate fire, worry about the structural integrity of the firehouse later. It's a philosophy that's launched a thousand MVPs and probably just as many late-night refactoring sessions fueled by caffeine and regret. It values momentum, sometimes at the cost of, well, *predictability*.

The core idea? Take the `informers` gem – a neat bit of kit for transformer inference in Ruby – and shove it into a Docker container. Why? To let it play outside the Ruby sandbox, making its NLP magic accessible to anything that speaks HTTP. Standard procedure for letting your code leave home.

## The Noble Goal: Open-Source Embeddings & Sweet Autonomy

Beyond just containerizing, the *real* ambition was loftier: a self-contained, Dockerized NLP service running open-source embedding models. Think of it as building your own little NLP Fort Knox – no external API dependencies, no vendor lock-in, just pure, unadulterated vector calculation served up via a tidy API. An autonomous component, blissfully ignorant of the swirling chaos of external ecosystems.

Naturally, this noble quest acquired a "secondary objective," which is corporate-speak for "scope creep we retroactively justified." We decided to test compatibility with [Dify.ai](http://dify.ai/), a rather slick AI platform. This was framed as "validation," aka "let's see if our pristine creation can survive contact with the messy real world and its opinions on API design."

## An Evolutionary Trajectory (Read: We Made It Up As We Went)

The development path looked surprisingly linear in hindsight, probably because we tidied up the story afterward:

1. **Foundation**: Basic Dockerized `informers` with a barebones Sinatra API. Enough rope to prove it wouldn't immediately hang itself. *Get something blinking.*

2. **Capability**: Add the core NLP stuff – similarity, reranking. The reason this service exists. *Make it do the thing.*

### That Awkward Phase When Your Script Demands Structure

You know the tipping point? When your "simple script" suddenly looks less like a helpful utility and more like your weekend Arduino project that somehow evolved into the central controller for your home's HVAC system? It *works*, mostly, but the wiring is suspect, and you're starting to think about diagrams and maybe fire insurance. That's where we landed. The initial bits started colliding, demanding refactoring. It was that quintessential Ruby moment – needing just enough Rails-inspired convention (even without Rails itself) to prevent the whole thing from collapsing into a spaghetti singularity. That precarious balance between nimble script and maintainable application, usually discovered slightly too late. We needed blueprints after the first floor was already built.

*(Back to our alleged plan...)*

3. **Structure**: The inevitable refactoring. Paying down the technical debt incurred by steps 1 & 2. Addressing the "what hath we wrought?" phase. This wasn't just tidying; it was recognizing that convention isn't pathology, it's *survival*, especially when complexity starts knocking. Trying to build this without structure felt like coding with only global variables – technically possible, ultimately maddening.

4. **Expansion**: Bolting on more NLP endpoints – summarization, sentiment, etc. Carefully adding features without (hopefully) destabilizing the now slightly-less-shaky foundation.

5. **Integration**: Making nice with Dify and the TEI specification. Reality bites. Balancing our internal architectural sensibilities with the demands of the outside world.

Maintaining focus felt like juggling chainsaws, especially with an LLM co-pilot spitting out code. That "finger memory" of the codebase fades. Ruby proficiency became the safety net; without it, you're just blindly trusting the output of something that learned programming from the internet – fast, often impressive, occasionally hallucinatory.

## The Human-LLM Codependency Tango

Working with the LLM wasn't a straightforward collaboration. It was... weirder.

* **Phase 1: LLM as Sketchy Code Dealer:** Early on, the AI was slinging code snippets like cheap watches in a back alley. "You need an endpoint? Got one right here, buddy." My job? Smile, nod, and verify if the thing actually worked without pawnable side effects.

* **Phase 2: LLM as Passive-Aggressive QA:** As things got complex, the AI shifted tactics. It became that colleague who flags potential issues by "just asking questions" about your life choices (and variable naming). This was oddly freeing – it handled the nitpicking, I handled the existential dread ("Why *did* I design it this way?"). It felt like pair programming with someone who crammed the entire internet yesterday – incredibly fast, knows all the patterns, but lacks the scars and wisdom that come from *maintaining* the monstrosities they create.

* **Phase 3: Me as Architectural Bouncer:** Integration time. Dify/TEI demanded specific interfaces. Suddenly, domain knowledge was critical to differentiate between the LLM's plausible-sounding architectural suggestions and actual structural integrity. You need a human to tell the difference between a solid foundation and a sophisticated hallucination.

## Technical Choices & The Ghosts of Decisions Past

Looking back, some choices stand out, gleaming with the wisdom of hindsight:

* **Convention vs. Configuration (Sinatra Style):** Even escaping Rails didn't mean escaping the need for structure. That gravitational pull towards convention is Ruby's survival instinct, not a pathology. You *need* shared rules when the codebase grows beyond a single screen, especially when parts of it are generated by something without opinions.

* **Docker as the Unavoidable Ex:** Yep, Docker. Necessary for consistency and isolation, ensuring the NLP bits behave the same everywhere. But managing its ecosystem sometimes feels like promising yourself you're done with your ex, only to keep finding their YAML files scattered around your life. Still beats manually managing dependencies like it's 1995, though.

* **Dify Integration: API Blind Date:** Trying to mesh with Dify was a stark reminder: integrating with external systems is like meeting someone from a dating app whose profile pics were clearly ten years old. Expectations rarely align perfectly with reality. Someone's API design is going to feel... awkward.

## TEI vs. Architectural Dignity: The Integration Compromise

Here's where pragmatism elbowed elegance aside. Dify integration required conforming to certain specs, including the Text Embedding Inference (TEI) standard. Specifically, the `/v1/embeddings` endpoint needed to be *synchronous*. Our internal design, quite reasonably, favored handling potentially slow embedding generation via asynchronous background jobs.

The choice: maintain our async purity or implement the synchronous endpoint TEI/Dify demanded? We chose the latter. It felt like wearing a suit and tie to a beach party because the host insisted. You're there, you're compliant, but you're uncomfortable, it doesn't fit, and you know you'll overheat if things get too active. That endpoint *works*, but it's a monument to external compromise, a potential scaling bottleneck born entirely from needing to play nice with the ecosystem. The eternal tech dilemma: adhere to internal elegance or ship something compatible?

## Advice for Your AI Coding Partner Relationship

Thinking of bringing an LLM onto your project team? Here's some unsolicited advice, forged in the fires of this experience:

1. **Define Boundaries (Then Watch Them Blur):** My initial "Dockerize this gem with an API and worker" seemed simple. Too simple. Ambiguity allowed speed but led straight to the "refactoring cliff" when the initial quick-and-dirty implementation couldn't scale. Be specific, or prepare for architectural surprises.

2. **Treat Your LLM Like a Hyper-Confident Junior Dev:** It's not magic, it's not sentient. It's brilliant at patterns, but terrible at context and long-term consequences. Guide it, review its work *critically*, and don't assume it understands the *why*.

3. **Enforce Convention Ruthlessly:** Especially with generated code, you need rules. Framework conventions, team style guides, *something*. Without them, your codebase risks becoming a Tower of Babel built by caffeine-fueled developers and an overly enthusiastic AI. Consistency is key.

4. **Question Every Integration Point:** Treat each external API like you're vetting your daughter's prom date. What are the real benefits? What are the risks? How will it inevitably break or change unexpectedly? Keep coupling minimal and interfaces clean. Principle of least surprise is your friend.

## Conclusion: Embrace the Functional Dysfunctionality

This project wasn't a pristine example of software engineering. It was messy, iterative, and full of compromises. The AI accelerated parts of it, but human judgment, Ruby fundamentals, and a healthy dose of skepticism were essential navigators.

The pragmatic Ruby approach, even augmented by AI, delivered something *functional*, if slightly dysfunctional. It highlights that getting something *working* is often the crucial first step, even if the path involves questionable shortcuts and future refactoring promises.

Just remember: an LLM will cheerfully generate *exactly* what you ask for, even if you accidentally ask for the same endpoint five different ways. Caveat developer.
