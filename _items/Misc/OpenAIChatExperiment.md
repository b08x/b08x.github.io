---
layout: page
title: OpenAIChatExperiment
subtitle: 
excerpt: 
category: misc
tags:
  - llm
image: 
permalink:
---


# OpenAI Chat Experiment Example

## Installations


```python
# !pip install --quiet --force-reinstall prompttools
```

## Setup imports and API keys

First, we'll need to set our API keys. If we are in DEBUG mode, we don't need to use a real OpenAI key, so for now we'll set them to empty strings.


```python
import os

os.environ["DEBUG"] = "1"  # Set this to "" to call OpenAI's API
os.environ["OPENAI_API_KEY"] = ""  # Insert your key here
```

Then we'll import the relevant `prompttools` modules to setup our experiment.


```python
from typing import Dict, List
from prompttools.experiment import OpenAIChatExperiment
```

## Run an experiment

Next, we create our test inputs. We can iterate over models, inputs, and configurations like temperature.


```python
models = ["gpt-3.5-turbo", "gpt-3.5-turbo-0613"]  # You can also use a fine-tuned model here, e.g. ["ft:gpt-3.5-turbo:org_id"]
messages = [
    [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Who was the first president?"},
    ]
]
temperatures = [0.0, 1.0]
# You can add more parameters that you'd like to test here.

experiment = OpenAIChatExperiment(models, messages, temperature=temperatures)
```

We can then run the experiment to get results.


```python
experiment.run()
```


```python
experiment.visualize()
```


<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>model</th>
      <th>messages</th>
      <th>temperature</th>
      <th>response</th>
      <th>response_usage</th>
      <th>latency</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>gpt-3.5-turbo</td>
      <td>[{'role': 'system', 'content': 'You are a helpful assistant.'}, {'role': 'user', 'content': 'Who was the first president?'}]</td>
      <td>0.0</td>
      <td>George Washington</td>
      <td>{'completion_tokens': 18, 'prompt_tokens': 57, 'total_tokens': 75}</td>
      <td>0.000006</td>
    </tr>
    <tr>
      <th>1</th>
      <td>gpt-3.5-turbo</td>
      <td>[{'role': 'system', 'content': 'You are a helpful assistant.'}, {'role': 'user', 'content': 'Who was the first president?'}]</td>
      <td>1.0</td>
      <td>George Washington</td>
      <td>{'completion_tokens': 18, 'prompt_tokens': 57, 'total_tokens': 75}</td>
      <td>0.000005</td>
    </tr>
    <tr>
      <th>2</th>
      <td>gpt-3.5-turbo-0613</td>
      <td>[{'role': 'system', 'content': 'You are a helpful assistant.'}, {'role': 'user', 'content': 'Who was the first president?'}]</td>
      <td>0.0</td>
      <td>George Washington</td>
      <td>{'completion_tokens': 18, 'prompt_tokens': 57, 'total_tokens': 75}</td>
      <td>0.000003</td>
    </tr>
    <tr>
      <th>3</th>
      <td>gpt-3.5-turbo-0613</td>
      <td>[{'role': 'system', 'content': 'You are a helpful assistant.'}, {'role': 'user', 'content': 'Who was the first president?'}]</td>
      <td>1.0</td>
      <td>George Washington</td>
      <td>{'completion_tokens': 18, 'prompt_tokens': 57, 'total_tokens': 75}</td>
      <td>0.000002</td>
    </tr>
  </tbody>
</table>
</div>


## Evaluate the model response

To evaluate the results, we'll define an eval function. We can use semantic distance to check if the model's response is similar to our expected output.

Since we are using semantic similarity, you need to have the library `sentence_transformers` installed.


```python
# !pip install --quiet sentence_transformers
```


```python
from prompttools.utils import similarity
```


```python
experiment.evaluate("similar_to_expected", similarity.semantic_similarity, expected=["George Washington"] * 4)
```

Finally, we can visualize the results.


```python
experiment.visualize()
```


<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>model</th>
      <th>messages</th>
      <th>temperature</th>
      <th>response</th>
      <th>response_usage</th>
      <th>latency</th>
      <th>similar_to_expected</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>gpt-3.5-turbo</td>
      <td>[{'role': 'system', 'content': 'You are a helpful assistant.'}, {'role': 'user', 'content': 'Who was the first president?'}]</td>
      <td>0.0</td>
      <td>George Washington</td>
      <td>{'completion_tokens': 18, 'prompt_tokens': 57, 'total_tokens': 75}</td>
      <td>0.000006</td>
      <td>1.0</td>
    </tr>
    <tr>
      <th>1</th>
      <td>gpt-3.5-turbo</td>
      <td>[{'role': 'system', 'content': 'You are a helpful assistant.'}, {'role': 'user', 'content': 'Who was the first president?'}]</td>
      <td>1.0</td>
      <td>George Washington</td>
      <td>{'completion_tokens': 18, 'prompt_tokens': 57, 'total_tokens': 75}</td>
      <td>0.000005</td>
      <td>1.0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>gpt-3.5-turbo-0613</td>
      <td>[{'role': 'system', 'content': 'You are a helpful assistant.'}, {'role': 'user', 'content': 'Who was the first president?'}]</td>
      <td>0.0</td>
      <td>George Washington</td>
      <td>{'completion_tokens': 18, 'prompt_tokens': 57, 'total_tokens': 75}</td>
      <td>0.000003</td>
      <td>1.0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>gpt-3.5-turbo-0613</td>
      <td>[{'role': 'system', 'content': 'You are a helpful assistant.'}, {'role': 'user', 'content': 'Who was the first president?'}]</td>
      <td>1.0</td>
      <td>George Washington</td>
      <td>{'completion_tokens': 18, 'prompt_tokens': 57, 'total_tokens': 75}</td>
      <td>0.000002</td>
      <td>1.0</td>
    </tr>
  </tbody>
</table>
</div>


## Saving to Remote

For users interested to manage their experiments in a hosted environment. We provide APIs to securely store your experiments in our backend, from which you can load experiments for re-run or share with your team. 

If you are interested in our hosted solution, please reach out to us.


```python
os.environ["HEGELAI_API_KEY"] = ""
```


```python

```

## Aggregate Results

You can optionally visualize the results with the following command


```python
experiment.aggregate(metric_name="latency", column_name="model")
```


    
![png](OpenAIChatExperiment_files/OpenAIChatExperiment_27_0.png)
    



```python

```
