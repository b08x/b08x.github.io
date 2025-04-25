---
layout: post
title: "8 More Hours with a Genai Co-pilot: Troubleshooting"
date: 2025-04-24 20:56:59 -0400
category: development
author: b08x
tags: [genai, troubleshooting, concurrency]
description: "Troubleshooting concurrent model loading issues with a GenAI co-pilot"
---

<style>
  .post .post-content blockquote {
    &.block-tip {
      border-color: var(--global-tip-block);
      background-color: var(--global-tip-block-bg);

      p {
        color: var(--global-tip-block-text);
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        color: var(--global-tip-block-title);
      }
    }

    &.block-warning {
      border-color: var(--global-warning-block);
      background-color: var(--global-warning-block-bg);

      p {
        color: var(--global-warning-block-text);
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        color: var(--global-warning-block-title);
      }
    }

    &.block-danger {
      border-color: var(--global-danger-block);
      background-color: var(--global-danger-block-bg);

      p {
        color: var(--global-danger-block-text);
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        color: var(--global-danger-block-title);
      }
    }
  }

  .block-chat-user {
    background-color: #e0e0e0;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
  }

  .block-chat-assistant {
    background-color: #083b75;
    color: white;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
  }
</style>

## Diagnosing Concurrent Model Loading Issues

When working with AI models in a web service environment, concurrent requests can lead to unexpected issues. In this post, I'll share my experience troubleshooting a problem with the Informers gem and model loading.

> Okay, the logs clearly show the problem:
>
> **Concurrent Requests**: Multiple requests are hitting /v1/embeddings almost simultaneously (Processing /v1/embeddings request synchronously... appears multiple times very close together).
> 
> **Concurrent Model Loading**: Because the /v1/embeddings endpoint loads the model synchronously within the request cycle, each concurrent request triggers a separate attempt to load the jina-v2-base model.
> 
> **Cache Write Conflicts**: The Informers gem tries to download and write the model files (tokenizer.json, config.json, model.onnx) to the cache directory (/root/.cache/informers/...). When multiple processes/threads try to write and rename the same files (*.incomplete to the final name) concurrently, they clash, leading to the No such file or directory @ rb_file_s_rename errors. One process likely finishes renaming/moving the file just before another tries to do the same thing.
>
> **Memory Exhaustion**: Loading a large transformer model like Jina is memory-intensive. Loading it multiple times concurrently within the same informer_web container consumes a huge amount of RAM very quickly, exhausting the resources available to the container and potentially the host machine, leading to instability or crashes. The Docker volume for the cache helps persist downloads but doesn't prevent this concurrent loading into memory issue.
{: .block-chat-assistant }

## Solution: Synchronize Model Loading

We need to prevent multiple threads within the informer_web process from trying to load the same model simultaneously. We can achieve this using a Mutex in the EmbeddingWorker.get_model method, which is called by the /v1/embeddings route.

I'll update the EmbeddingWorker to include this synchronization.

### Explanation of Changes:

- **require 'mutex'**: Added to make the Mutex class available.
- **@load_mutex = Mutex.new**: A class instance variable is created to hold a mutex object. This single mutex will coordinate loading across all threads in the process.
- **@load_mutex.synchronize do ... end**: The critical section of code that checks the cache (again) and potentially loads the model is wrapped in this block. Only one thread can execute this block at a time.
- **Double-Checked Locking**: The cache is checked before entering the synchronized block for efficiency, and again immediately after entering it. This ensures that if multiple threads queue up waiting for the mutex, only the first one actually loads the model; the subsequent threads will find it in the cache when they eventually get the lock.
- **Async perform Update**: The asynchronous perform method used by the /embed route is also updated to use self.class.get_model for consistency, although the race condition is less likely there as Sidekiq usually processes jobs one per thread (depending on concurrency settings).

After applying this change to workers/embedding_worker.rb, restart your services (docker-compose down && docker-compose up -d --build). Now, when multiple requests hit /v1/embeddings concurrently, only the first one should trigger the actual model download/load, preventing the cache write errors and the massive memory spike. Subsequent requests will wait briefly for the first one to finish and then use the cached model instance.

> ok
{: .block-chat-user }

## Implementation Details

Here's the code I added to the EmbeddingWorker class:

```ruby
require 'mutex'

class EmbeddingWorker
  # Class variable for mutex to synchronize model loading
  @load_mutex = Mutex.new
  
  def self.get_model(model_name)
    # Check cache first (outside the lock for efficiency)
    return @@models[model_name] if defined?(@@models) && @@models&.key?(model_name)
    
    # Synchronize the model loading
    @load_mutex.synchronize do
      # Double-check the cache now that we have the lock
      @@models ||= {}
      return @@models[model_name] if @@models.key?(model_name)
      
      # Load the model (only one thread will get here at a time)
      logger.info "Loading embedding model #{model_name}..."
      @@models[model_name] = Informers::Embedding.for(model_name)
      logger.info "Model #{model_name} loaded successfully"
      
      @@models[model_name]
    end
  end
  
  # Update the perform method to use the synchronized get_model
  def perform(text, model_name = "jina-v2-base")
    model = self.class.get_model(model_name)
    model.embed(text)
  end
end
```

## Results

After implementing the mutex-based synchronization, the system became much more stable. The memory usage remained consistent even under heavy load, and the error logs no longer showed file rename conflicts. This simple change significantly improved the reliability of our embedding service without adding much overhead.

## Key Takeaways

1. **Understand Concurrency Issues**: When working with large models, be aware of how concurrent requests interact with resource-intensive operations.
2. **Use Appropriate Synchronization**: Mutex locks are perfect for this scenario where we need to coordinate access to a shared resource.
3. **Implement Double-Checked Locking**: This pattern minimizes the time spent in the synchronized block, improving performance.
4. **Monitor Resource Usage**: Keep an eye on memory consumption, especially when working with large ML models in containerized environments.

This experience highlights the importance of considering concurrency patterns when designing systems that work with resource-intensive AI models.
