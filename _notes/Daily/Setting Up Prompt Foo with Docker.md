---
layout: note
title: Setting Up Prompt Foo with Docker
category: Prompt Engineering
tags:
  - docker
  - evals
image: 
summary: 
date created: Monday, October 21st 2024, 5:06:54 pm
date modified: Tuesday, November 5th 2024, 3:11:58 am
---



![\_systemSculpt/Recordings/Recording-2024-10-21-17-08-20.mp3](/assets/audio/Recording-2024-10-21-17-08-20.mp3)  
 All right. Oh, so it does work. Okay. So I've come across a sort of prompt evaluation suite. It looks very promising. So I'm going to try and set that up now. it's called prompt foo Well, yeah, I was looking for the Docker details. See, I don't necessarily want to transcribe all this.

## Processed Transcription

**Summary**  
The speaker has discovered a promising prompt evaluation suite called "Prompt Foo" and is attempting to set it up. They are currently searching for Docker details to facilitate the setup process.

**Key Points**
* The speaker has found a prompt evaluation suite called "Prompt Foo".
* They are trying to set up the suite.
* They are looking for Docker details to aid in the setup process.

**Actionable Takeaways**
* Consider exploring the Prompt Foo evaluation suite for potential benefits.
* If using Docker for setup, ensure you have the necessary details and documentation to facilitate a smooth process.
* Evaluate the suitability of Prompt Foo for your specific needs and use case.

[[Optimizing Semantic Chunking with Embedding Models and Text Splitters]]

```yaml
services:
  promptfoo_container:
    image: ghcr.io/promptfoo/promptfoo:main
    container_name: promptfoo_container
    ports:

      - "3000:3000"
    volumes:

      - /path/to/local_promptfoo:/root/.promptfoo
    environment:
      VITE_PUBLIC_BASENAME: "/your-basename"  # Define appropriate values
      PROMPTFOO_REMOTE_API_BASE_URL: "https://your-api-url"
      API_PORT: 3000
      HOST: "0.0.0.0"
    build:
      context: .
      args:
        VITE_PUBLIC_BASENAME: "/your-basename"
        PROMPTFOO_REMOTE_API_BASE_URL: "https://your-api-url"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 5s
    restart: unless-stopped
```
