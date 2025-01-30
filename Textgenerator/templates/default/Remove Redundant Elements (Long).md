---
tags: 
title: Remove Redundant Elements (Long)
date created: Saturday, August 10th 2024, 9:19:47 pm
date modified: Tuesday, November 5th 2024, 2:27:12 am
promptId: removeRedundantElementsLong
name: 🗃️ Remove Redundant Elements (Long)
description: Parse a long transcript
author: b08x
version: 0.0.1
model: 
temperature: 0.4
max_tokens: 2048
top_p: 0.4
top_k: 200
n: 1
mode: insert
system: Analyze the text for redundancies. Remove them while preserving the original meaning and ensuring the final text is clear.
---

{{#each headings}}

## HEADER: {{@key}}

{{this}}

{{/each}}

output:
