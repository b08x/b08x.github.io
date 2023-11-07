---
layout: project
title: laudllm
subtitle: linux audio users and developers large language model
status: ongoing
dates: 
2023-11-05: In progress.
links: 
image: /assets/headers/image011.png
permalink: /laudllm
---

> Linux Audio with LLM As the sun set over the bustling city, Linux sat in his small, cluttered apartment, surrounded by piles of old computer parts and wires. He had always been fascinated by the potential of technology, and he spent most of his days tinkering with various projects, trying to create something truly innovative. But today, he was working on something special - a new audio system using LLM (LLM: Low-Level Music) technology. It was an experimental method of sound production that promised to revolutionize the music industry, and Linux was determined to be the first to harness its power. W

- Tasks:
    1. Glob for compatible text files (markdown, pdf)
    2. Assign UUID and path name, store in Redis
    3. Convert documents to text and store in Redis with UUID, file path, title, and text
    4. Chunk the document and store in Redis with UUID, directory path, title, and indexed chunks
    5. Tokenize the text and store in Redis with UUID, directory path, title, and tokenized text
    6. Topic model each tokenized chunk and attach topics to the metadata
    7. Determine ontology label for each topic using language model and attach to root metadata

[[Training]]

[[notebook]]
