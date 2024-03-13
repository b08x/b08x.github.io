---
layout: page
title: LLM Notepad
subtitle: 
category:
  - LLM
tags:
  - docker
  - ollama
  - localai
links: 
image: /assets/img/generative/pixel_crow-02
---




#### implementing sycl in local-ai

[some notes on working with intel-gpu & docker](https://github.com/LostRuins/koboldcpp/blob/concedo/README-sycl.md#intel-gpu)

[fixing permissions when using /dev/dri in compose](https://github.com/linuxserver/docker-plex/issues/187)

#### implementing sycl in local-ai

https://github.com/felipeagc/ollama


# ollama model usage


## gemma:7b

https://www.promptingguide.ai/models/gemma

## phi

[phi](https://ollama.ai/library/phi)

> Phi-2 is intended for QA, chat, and code purposes. The model-generated text/code should be treated as a starting point rather than a definitive solution for potential use cases. Users should be cautious when employing these models in their applications.

[limitations](https://huggingface.co/microsoft/phi-2#limitations-of-phi-2)

##### Parameter
```
stop "User:"
stop "Assistant:"
stop "System:"
```

##### Template
{% raw %}
```
{{ if .System }}System: {{ .System }}{{ end }}
User: {{ .Prompt }}
Assistant:
```
{% endraw %}

##### System
```
A chat between a curious user and an artificial intelligence assistant. The assistant gives helpful answers to the user's questions.
```

### Example prompt

By default, `phi` includes a chat prompt template designed for multi-turn conversations:

```
% ollama run phi
>>> Hello, can you help me find my way to Toronto?
 Certainly! What is the exact location in Toronto that you are looking for?

>>> Yonge & Bloor
 Sure, Yonge and Bloor is a busy intersection in downtown Toronto. Would you like to take public transportation or drive there?

>>> Public transportation
 Great! The easiest way to get there is by taking the TTC subway. You can take Line 1, which runs along Yonge Street and passes through downtown Toronto.
```

Using Ollama’s API:

```
curl http://localhost:11434/api/chat -d '{
  "model": "phi",
  "messages": [
    { "role": "user", "content": "why is the sky blue?" }
  ]
}'
```

### Example prompts (raw mode)

Phi also responds well to a wide variety of prompt formats when using [raw mode](https://github.com/jmorganca/ollama/blob/main/docs/api.md#request-raw-mode) in Ollama’s API, which bypasses all default prompt templating:

#### Instruct

```
curl http://localhost:11434/api/generate -d '{
  "model": "phi",
  "prompt": "Instruct: Write a detailed analogy between mathematics and a lighthouse.\nOutput:",
  "options": {
    "stop": ["Instruct:", "Output:"]
  },
  "raw": true,
  "stream": false
}'
```

#### Code Completion

```
curl http://localhost:11434/api/generate -d '{
  "model": "phi",
  "prompt": "def print_prime(n):\n  ",
  "raw": true,
  "stream": false
}'
```

#### Text completion

```
curl http://localhost:11434/api/generate -d '{
  "model": "phi",
  "prompt": "There once was a mouse named",
  "raw": true,
  "stream": false
}'
```

---


[[Prompt Engineering]]

[[Reasoning Scratchpad]]
		
[[Ranking Chunks]]

[[Graph Retrieval Augmenting Generation]]


* generating datasets
	* agenta
	* nakersuite
	* langfuse
	* *

---

<div class="figure left">
    <div class="liner">
     {% picture default screenshot/autonma01.png --img id="dark" --link https://github.com %}
     <p class="caption">Steve manually compiles a dataset from one of the models </p>
     </div>
</div>

[[Flowise]]

[[Testing with Agenta]]

[chatbot arena](https://chat.lmsys.org/)

---


## misc

#openai
* The `seed` parameter enables [reproducible outputs](https://platform.openai.com/docs/guides/text-generation/reproducible-outputs) by making the model return consistent completions most of the time

#cohere
https://docs.cohere.com/reference/intent-recognition

#palm2 #training
[palm2 model tuning guide](https://developers.generativeai.google/guide/model_tuning_guidance)

#llm #gpt #vscode
[colab example](https://colab.research.google.com/github/google/generative-ai-docs/blob/main/site/en/examples/text_calculator.ipynb)
[vscode extension](https://developers.generativeai.google/develop/sample-apps/pipet-code-agent)
[playground](https://makersuite.google.com/app/prompts/simple-summarizer)

### llama index
[llama index document management](https://docs.llamaindex.ai/en/stable/module_guides/indexing/document_management.html)

[llama index defining document metadata methods ](https://docs.llamaindex.ai/en/stable/module_guides/loading/documents_and_nodes/usage_documents.html)

### topic modeling
[topicGPT](https://github.com/chtmp223/topicGPT/tree/main)

### charm mods
[mods: ai for the commandline](https://github.com/charmbracelet/mods)
https://github.com/MadBomber/scripts/blob/master/aip.rb

### parameter iterations
Since there are 5 possibilities for each parameter, and we want to explore all combinations, this results in:

5 * 5 * 5 * 5 = 625

temp 0
top p 0
presence 0
frequency 0


```ruby
# Define ranges for each parameter
temp_range = (-2..2).to_a 
top_p_range = (-2..2).to_a
presence_range = (-2..2).to_a
frequency_range = (-2..2).to_a

# Method to test each combination
def test_combination(temp, top_p, presence, frequency)
  # Code to test combination
  puts "Testing: temp=#{temp}, top_p=#{top_p}, presence=#{presence}, frequency=#{frequency}"
end

# Iterate through all combinations
temp_range.each do |temp|
  top_p_range.each do |top_p|
    presence_range.each do |presence|
      frequency_range.each do |frequency|
        
        # Test each combination
        test_combination(temp, top_p, presence, frequency)
        
      end
    end
  end
end

```

if a class is necessary:

```ruby
class ParameterCombinationTester

	attr_accessor :prompt, :response

  def initialize(temp_range, top_p_range, presence_range, frequency_range, prompt)
    @temp_range = temp_range
    @top_p_range = top_p_range 
    @presence_range = presence_range
    @frequency_range = frequency_range
    @prompt = prompt
    @response = {}
  end

  def test_all_combinations
    @temp_range.each do |temp|
      @top_p_range.each do |top_p| 
        @presence_range.each do |presence|
          @frequency_range.each do |frequency|
            
            test_combination(temp, top_p, presence, frequency)
            
          end
        end
      end
    end
  end

  private
  
  def test_combination(temp, top_p, presence, frequency)
    # Test code here
  end

end

# create folder for test results
# cli-ui test name
# prompt - prompt template file

tester = ParameterCombinationTester.new(-2..2, -2..2, -2..2, -2..2)
tester.test_all_combinations
```