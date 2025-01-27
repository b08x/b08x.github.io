---
promptId: summarize
name: 🗞️ Summarize Selected Text In a Literal Fashion
description: summarize the selection
author: Robert Pannick
version: 0.0.1
title: Literal Text Summarization Tool
model: microsoft/phi-4
temperature: 0.4
max_tokens: 2048
top_p: 0.4
top_k: 200
n: 1
mode: replace
system: Organize the transcript in an ironically literal structure
prompt: Organize the transcript in an ironically literal structure
---
prompt: 
Organize the transcript in an ironically literal structure

{{{selection}}}
