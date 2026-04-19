---
layout:
deck_id: this-is-a-demo-slide-deck
order: 4
title: The Grand Unification of Prompting
subtitle: 'PromptSFL: A Data Structure for Meaning'
author: Prompt Engineer
date: '2026-04-11 16:31:48 -0400'
tags:
- PromptSFL
- architecture
- SFL
---
<div style='font-size: 2em; line-height: 1.5;'>And So We Forged This Trinity Into A Data Structure</div><hr><div style='font-size: 1.2em;'><pre><code>export interface PromptSFL {
  id: string;
  title: string;
  promptText: string;
  sflField: SFLField;
  sflTenor: SFLTenor;
  sflMode: SFLMode;
}</code></pre></div><div style='font-size: 1em; margin-top: 20px;'><strong>SFL Register Realized in PromptSFL:</strong><ul><li><strong>FIELD:</strong> sflField.topic, taskType, domainSpecifics</li><li><strong>TENOR:</strong> sflTenor.aiPersona, targetAudience, desiredTone</li><li><strong>MODE:</strong> sflMode.outputFormat, rhetoricalStructure</li></ul></div>