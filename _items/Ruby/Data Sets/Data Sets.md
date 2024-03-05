---
title: Training
layout: page
tags:
  - nlp
  - huggingface
  - llama2
category:
  - LLM
permalink:
---


## Index
- [[dataset notes]]
- [[few_shot questions]]
- [[Generating Questions with Llama-2-70b-chat-hf]]
- [[Generating Sample Data with Inference]]

---


<div class="figure left">
    <div class="liner">
     {% picture default screenshot/tuning_stages.png 4:3 center wide: screenshot/autonma01.png mobile: screenshot/music_production_workflow.png %}
     <p class="caption">Steve manually compiles a dataset from one of the models </p>
     </div>
</div>

In the training phase, a developer feeds their model a curated dataset so that it can “learn” everything it needs to about the type of data it will analyze. Then, in the inference phase, the model can make predictions based on live data to produce actionable results.

<div class="figure right">
    <div class="liner">
     {% picture default headers/img-2023-06-08.png 4:3 center wide: screenshot/autonma01.png mobile: screenshot/music_production_workflow.png %}
     <p class="caption">Steve manually compiles a dataset from one of the models </p>
     </div>
</div>
 
  <p>Instruction Tuning is a technique used to improve the performance of language models by training them to follow natural language commands or instructions. This includes positive or negative examples, prompts, constraints, and other elements that are commonly found in human language. The main goal of instruction-tuning is to improve the model’s ability to perform well on multiple tasks and to generalize more effectively to new or unseen tasks. This is achieved by teaching the model to understand and incorporate various language cues and constraints that are relevant to the task at hand. Instruction-tuning is a powerful technique that is widely used in natural language processing, machine learning, and related areas. By improving the ability of language models to understand and follow natural language commands, this approach can help to unlock new levels of performance and productivity in a wide range of applications.</p>  

### [Instruction Tuning](https://optimalscale.github.io/LMFlow/#instruction-tuning "Permalink to this heading")

Instruction Tuning is a technique used to improve the performance of language models by training them to follow natural language commands or instructions. This includes positive or negative examples, prompts, constraints, and other elements that are commonly found in human language. The main goal of instruction-tuning is to improve the model’s ability to perform well on multiple tasks and to generalize more effectively to new or unseen tasks. This is achieved by teaching the model to understand and incorporate various language cues and constraints that are relevant to the task at hand. Instruction-tuning is a powerful technique that is widely used in natural language processing, machine learning, and related areas. By improving the ability of language models to understand and follow natural language commands, this approach can help to unlock new levels of performance and productivity in a wide range of applications.
  <p>Lorem ipsum id occaecat officia ex laboris tempor commodo et tempor ea sed. Lorem ipsum culpa sit consequat eiusmod officia ea ut Excepteur consectetur et occaecat occaecat mollit aliquip dolore adipisicing ad velit voluptate cillum amet in exercitation velit aliqua laborum Excepteur aliquip in ex exercitation ad adipisicing nostrud minim magna cillum pariatur ut ullamco officia adipisicing elit pariatur culpa nostrud ex do sed aliquip Duis dolor ad mollit voluptate tempor in ut eu ullamco enim pariatur aliqua in anim voluptate ut culpa elit proident do qui laboris adipisicing reprehenderit elit commodo dolor.  </p>
  
  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> 


## second header
I suppose I would argue it would take just as much effort to maintain a project that conforms to package updates. 

Then again it would take as much effort to not conform. What if Steven Segal told you to update your versioning scheme? WOuld you?




<div class="figure left">
  <div class="liner">
    <img src="{{ site.baseurl }}/assets/img/headers/img-2023-06-08.png" style="float:left"/>
    <p class="caption">Steve manually compiles a dataset from one of the models </p>
  </div>
</div>



Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

<p>Lorem ipsum id occaecat officia ex laboris tempor commodo et tempor ea sed. Lorem ipsum culpa sit consequat eiusmod officia ea ut Excepteur consectetur et occaecat occaecat mollit aliquip dolore adipisicing ad velit voluptate cillum amet in exercitation velit aliqua laborum Excepteur aliquip in ex exercitation ad adipisicing nostrud minim magna cillum pariatur ut ullamco officia adipisicing elit pariatur culpa nostrud ex do sed aliquip Duis dolor ad mollit voluptate tempor in ut eu ullamco enim pariatur aliqua in anim voluptate ut culpa elit proident do qui laboris adipisicing reprehenderit elit commodo dolor.  </p>

<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> 

### third header

Instead of marking `package==0.25.2` just mark `package` and if there is an update to the package that "breaks the code", then update the code. Because some years later when package 0.25.2 is no longer easily available on a active mirror, then whomever picks up the project has the task of resolving dependencies for code they didn't write. 

#### fourth header

There are too many libraries and too many versions to keep track of long term. The reliance on the various package managers like conda or pyenv or...or rbenv or rvm (or recently asdf) is making the tasks of deployment and maintenance rather tedious. 

##### fifth header
