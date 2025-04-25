---
layout: post
title: "Crafting a Containered NLP Service with Genai"
date: 2025-04-25 00:15:39 -0400
category: development
author: Robert Pannick using Gemini 2.5 Pro Exp
tags: [ruby, docker, nlp, gen-ai]
description: "A pragmatic journey building a containerized Ruby NLP service with an LLM assistant, navigating complexity, containers, and integrations."
---

It began with that classic Ruby developer approach: solve the immediate problem first, consider the long-term architecture later. This guiding principle has served the Ruby community well for years—balancing practical solutions with sustainable design. It values working solutions and iterative improvement, sometimes leading down interesting paths.

At the heart of this project is the `informers` gem – designed for fast transformer inference in Ruby. The first step was clear: wrap this core inference engine in Docker to expand its potential beyond the Ruby ecosystem, making its capabilities accessible to a broader range of applications and developers.

## The Objective: Open-Source Embeddings with Complete Autonomy

Beyond simply containerizing the gem, the core objective was creating a uniform, Dockerized NLP service leveraging open-source embedding models – essentially a self-contained, modular solution. The aim was an autonomous component that wouldn't depend on external APIs or get locked into proprietary ecosystems, allowing it to be easily integrated into larger systems via a clean API interface.

Along the way, a secondary "opportunity" (air quotes doing Olympic-level heavy lifting here) appeared: testing compatibility with [Dify.ai](http://dify.ai/), a fantastically capable AI application platform. This was framed as a "validation exercise," which is developer-speak for "let's see if this solution can integrate seamlessly with established systems".

## The LLM-Guided Development Journey: An Iterative Evolution

The development process followed a surprisingly structured evolutionary pattern, driven by that pragmatic, iterative approach:

1. **Foundation**: Establishing a basic, Dockerized Informers gem with a minimalist Sinatra API - just enough to prove the concept. Get something working first.

2. **Capability**: Adding core NLP functions for similarity calculation and document reranking - delivering the service's fundamental value proposition. Focus on the core task.

## When Your "Simple Script" Grows Beyond Control

You know that moment when a simple script suddenly outgrows its original scope? That magical threshold where "it works" transforms into "what have I created?". This project hit that evolutionary milestone right about here, when the initial foundation and core capabilities started bumping into each other. It necessitated refactoring that represented that quintessential Ruby moment—when code needs just enough Rails-style convention to stay manageable, even without the full framework. That precarious sweet spot between "simple script" and "structured application".

*(Continuing the Journey...)*

3. **Structure**: Implementing this necessary refactoring phase to improve code organization as complexity increased. Addressing the technical debt incurred by the "solve it now" approach.

4. **Expansion**: Adding supplementary NLP endpoints—summarization, sentiment analysis, classification—expanding capabilities to meet broader use cases, adding features carefully.

5. **Integration**: Adapting to Dify ecosystem expectations and TEI specifications, balancing internal architecture with external compatibility. The reality of making your code play well with others.

Despite the benefits of this iterative approach, maintaining context and focus presents its own challenge, especially with code generation playing a significant role. There's less "finger memory" of the codebase structure. Familiarity with Ruby became crucial. Without it, developers might become overly dependent on AI assistance, highlighting the continued importance of language expertise even in an AI-assisted workflow.

## The Codependent Relationship: Stockholm Syndrome in Action

The interaction with the LLM wasn't a one-way street. It resembled couples therapy where both parties have questionable boundaries:

* **Early Stages: LLM as Sketchy Code Dealer:** The AI pushed code like a street vendor with suspiciously cheap Rolex watches. My role? Nodding enthusiastically while checking if the API endpoints actually told time.

* **Mid-Stages: LLM as Passive-Aggressive QA Tester:** As complexity spiraled like collective anxiety, the AI morphed into that coworker who says "I'm just asking questions" while pointing out every flaw in your logic. This freed me to dissociate and ponder bigger questions, like "why am I building this again?".

* **Late Stages: Me as Architectural Bouncer:** Integration with Dify and TEI conformity demanded someone with enough domain expertise to distinguish between genuine architectural integrity and the LLM's sophisticated hallucinations about system design. Like separating actual memories from that time you dreamed you could fly.

## Technical Choices and Regrettable Life Decisions

Post-mortem analysis of the code offspring revealed several painful truths:

* **Convention over Configuration (Sinatra Edition):** Even without Rails, Ruby's pathological need for structure couldn't be escaped. Like someone who claims they're "totally casual" but secretly labels their sock drawer. A familiar tension between starting simple and needing structure later.

* **Docker as Unavoidable Ex:** The project's Docker dependency confirmed what we all know—containerization is that ex you keep going back to, despite promising yourself "never again". Yet, the isolation and consistency it provides are often necessary evils in modern deployment.

* **Dify Integration: Testing the Limits of Sanity:** Attempting to play nice with Dify exposed the fundamental truth of integration: someone's API expectations are always going to disappoint you, like meeting your online date who's clearly using profile photos from 2010.

## TEI vs. Self-Respect: The Integration Struggle

Integrating with Dify meant conforming to their required API specifications, which included adhering to the Text Embedding Inference (TEI) standard for certain endpoints. This forced an existential crisis: maintain our service's internal architectural dignity (built around asynchronous background jobs for embedding) or sacrifice it at the altar of external compatibility? The `/v1/embeddings` endpoint, required by Dify/TEI to operate synchronously, became our moral compromise. It works, but it screams "I've abandoned my preferred design principles for market acceptance."

This highlights tech's eternal dilemma: stick rigidly to your internal standards or adapt to actually ship something people can integrate with. Sometimes you have to implement the interface demanded by the ecosystem, even if it deviates from your ideal internal patterns.

## Lessons for the LLM-Curious: Couples Therapy for Human-AI Programming

If you're considering an AI coding partner, remember these relationship rules, learned through this pragmatic journey:

1. **Define Your Boundaries (and Expect Them to Be Tested):** My initial objective—"Dockerize this gem with a Sinatra API and worker"—was deceptively simple, like saying you want a "casual" relationship. This ambiguity allowed fast progress but led to architectural commitment issues and eventual refactoring couples therapy.

    * **Pro:** The honeymoon phase moves quickly.

    * **Con:** Eventually, you'll wake up surrounded by architectural decisions you don't remember making, facing a "refactoring cliff" where the project has become too dysfunctional to salvage without intensive intervention.
  
2. **Treat Your LLM Like a Junior Dev With Confidence Issues:** It's neither oracle nor idiot. It's that enthusiastic new hire with impressive credentials and questionable judgment. It needs clear direction and careful review.

3. **Enforce Convention Like an Obsessive-Compulsive Dungeon Master:** Without rigid rules (whether framework-imposed or team-defined), your codebase will develop multiple personality disorder faster than you can say "technical debt". Clear interfaces and predictable behavior matter.

4. **Question Every Integration Like It's Meeting Your Daughter's Prom Date:** Calculate benefits, risks, and how many ways it could break your heart. Ensure each integration point is minimal, well-defined, and follows the principle of least surprise.

## Conclusion: Functional Dysfunctionality

This project demonstrates that while an AI coding partner might accelerate development like a questionable performance-enhancing substance, maintaining direction requires human intervention and sound judgment. The ideal human-AI collaboration resembles a functioning codependent relationship: leveraging strengths while maintaining just enough boundaries to avoid complete systemic collapse.

The pragmatic Ruby approach—solving immediate problems first while deferring some architectural decisions—proved effective, if sometimes messy, even in this AI-assisted context. It allowed for rapid prototyping, iterative improvement, and the flexibility to adapt. The result may not be perfect, but it works, and sometimes, getting something working is the most important first step.

Remember, an LLM will generate whatever code you ask for, so watch out for those redundant requests...
