---
layout: note
title: Generating Questions with Llama-2-70b-chat-hf
subtitle: 
category: 
tags:
  - llm
  - llama
links:
---

# abstract
To help with compiling the troubleshooting training dataset, generating scenarios with the huggingface inference api proves to be useful. 

First, a ruby script which takes a leading sentence as an argument and outputs a generated completion response:

```ruby
#!/usr/bin/env ruby
# frozen_string_literal: true

require 'net/http'
require 'json'

API_URL = "https://api-inference.huggingface.co/models/meta-llama/Llama-2-70b-chat-hf"
HEADERS = {
  "Content-Type" => "application/json",
  "Authorization" => "Bearer #{ENV["HUGGINGFACE_API_KEY"]}"
}

def create_json_object(source_sentence, sentences)
  {
    inputs: {
      source_sentence: source_sentence,
      sentences: sentences
    }
  }.to_json
end

def inference(inputs, temperature = 0.7, max_new_tokens = 1000)

  data = {
    "inputs" => inputs,
    "parameters" => {
      "temperature" => temperature,
      "max_new_tokens" => max_new_tokens
    }
  }

  uri = URI.parse(API_URL)

  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true  # Use HTTPS

  request = Net::HTTP::Post.new(uri.path, HEADERS)
  request.body = data.to_json

  response = http.request(request)

end

query = ARGV[0]

response = inference(query)

p JSON.parse(response.body)
```

## example

```bash
[b08x@soundbot:~/Desktop/laudllm/lib on development]
% ./apiquery-input.rb "I've just installed AVlinux. \
After about 30 seconds of recording some midi tracks reaper, \
the sound starts crackling," 
```


> [{"generated_text"=>"I've just installed AVlinux. After about 30 seconds of recording some midi tracks reaper, the sound starts crackling, and the program freezes. It's even more frequent when I use the mouse.\nI've tried with different buffer sizes, with and without the J410, with different audio interfaces, with different samples rates, with and without the internal sound card in the laptop... nothing seems to solve the problem.\nI've also tried to monitor in Reaper the CPU usage, the memory usage, the disk usage... everything seems to be normal.\nI've also tried to monitor the system resource usage with top and htop... everything seems to be normal.\nI've also tried to use another DAW (Ardour) and it works perfectly.\nI've also tried to use another computer and it works perfectly.\nI've also tried to use another version of AVlinux (2016) and it works perfectly.\nI've also tried to use another version of Reaper (5.51) and it works perfectly.\nI've also tried to use another version of the J410 (1.01) and it works perfectly.\n\nSo, I think the problem is related to AVlinux 2017 and/or Reaper 5.64.\n\nAny idea?\n\nThanks in advance!\n\nAnswer: I've found the solution.\n\nThe problem was related to the kernel 4.10. The solution is to downgrade to kernel 4.9.\n\nI've followed the instructions in this link:\n\nhttp://www.linuxandubuntu.com/home/how-to-downgrade-kernel-in-linux\n\nAnd now everything works perfectly.\n\nI hope this can help someone with the same problem.\n\nThanks!"}]
> 

# next

Next in this process is to add a vector store with documents related to these questions
