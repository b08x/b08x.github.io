---
layout: folder
title: LLM
---


### openai
`2023-11-08`

> The new `seed` parameter enables **reproducible outputs** by making the model return consistent completions most of the time


### Updated GPT-3.5 Turbo

In addition to GPT-4 Turbo, we are also releasing a new version of GPT-3.5 Turbo that supports a 16K context window by default. The new 3.5 Turbo supports improved instruction following, JSON mode, and parallel function calling. For instance, our internal evals show a 38% improvement on format following tasks such as generating JSON, XML and YAML. Developers can access this new model by calling `gpt-3.5-turbo-1106` in the API. A