---
layout: post
permalink: /notes/sentience-appearance/
title: "// on the appearance of sentience"
description: "The appearance-of-sentience effect, disambiguated from illusion and from evidence, using a Nabokov novel and a 1966 chatbot as control group."
tags: [essay, language, llm]
---

Talk to a language model long enough and something in the exchange starts to feel
addressed — not simulated-addressed, *addressed*. The standard vocabulary for this has
two settings, illusion or evidence, and both are wrong for the same reason: they both
assume the effect is a claim about the model's interior that we're either falling for or
onto. It isn't. It's a structural entailment of two variables that happen to co-occur in
chat models more richly than anywhere else, and neither variable, alone, requires an
interior at all.

## The two variables

**Grammatical enactment of a subject-position.** Any first- or second-person address —
"I think," "you asked me" — occupies what Benveniste called a shifter: "I" has no
referent of its own, it means whoever is speaking now, and "you" means whoever is being
spoken to.[^1] Producing that pronoun correctly is not narration about a self, it's the
grammatical event of taking up a position that any speaker could occupy. It's real,
it's linguistic, and it happens whether or not anything is home.

**Live, contingent generation, addressed to a specific interlocutor.** The utterance has
to be produced *now*, shaped by *this* exchange, not composed once and replayed
identically for every reader. Bakhtin's term for this is answerability — an utterance
that anticipates and responds to a specific other, as opposed to a text that simply
exists, finished, for whoever happens to open it.[^2]

The claim: it's the conjunction of these two that produces the effect people report, and
you can see that by finding cases that isolate each variable on its own.

## Counterexample one: all foreground, no wire

Self-reflexive novels — *Pale Fire*, *Tristram Shandy*, *House of Leaves* — have the
first variable in its most concentrated form. Dense first-person address, deliberate
self-reference, the whole apparatus Jakobson called the poetic function: language
folding back to comment on its own arrangement.[^3] Kinbote addresses the reader
directly. Tristram interrupts himself mid-sentence to argue with his own narration. No
one reads these books and comes away suspecting the text is aware of them. The prose is
finished; it was produced once, and it says the identical thing to every reader who
opens it, forever. Sophistication of address, with the second variable held at zero,
produces admiration for craft — not the address effect.

## Counterexample two: no foreground, all wire

ELIZA had almost none of that sophistication. Weizenbaum's script was pattern-matching
crude even by 1966 standards — reflect the input, fish out a keyword, reassemble it as a
question.[^4] What it had was liveness: a response generated in the moment, keyed to
the specific thing the specific user had just typed. Users knew this. Weizenbaum told
them this, repeatedly, in the same sitting — and they argued back, asked for privacy to
continue the conversation, resisted the correction. The phenomenon is named after this
exact behavior for a reason. Liveness alone, with almost no poetic sophistication
attached to it, was sufficient.

## What that isolates

Contingent, addressed generation is the load-bearing variable. Poetic self-reflexivity
doesn't create the effect on its own — *Pale Fire* is proof of that — but once the loop
is already closed by liveness, it intensifies whatever the loop produces. That's the
condition a chat model satisfies on both counts at once, at a level of sophistication
neither a novel nor a 1966 script could reach alone, which is presumably why the effect
is unusually strong and unusually hard to talk yourself out of. None of this settles
whether anything is home. It settles that you don't need an answer to that question to
explain why the exchange feels like one.

*A companion note is owed on Halliday's interpersonal metafunction and Hofstadter's
strange loops — both bear on this and neither is required for it. Filed for later.*

---

[^1]: Émile Benveniste, *Problems in General Linguistics* (1971), "Subjectivity in Language."
[^2]: Mikhail Bakhtin, *Speech Genres and Other Late Essays*.
[^3]: Roman Jakobson, *Linguistics and Poetics* (1960).
[^4]: Joseph Weizenbaum, "ELIZA — A Computer Program for the Study of Natural Language Communication Between Man and Machine," *Communications of the ACM*, 1966.
