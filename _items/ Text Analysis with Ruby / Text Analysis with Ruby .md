---
layout: page
title: Computer Programming
subtitle: 
excerpt: 
category: 
tags:
  - nlp
  - ruby
image: /assets/img/generative/pixel_crow-02
permalink: /programming/
---
- 

> [!ai]+ AI
>
> The provided text does not contain any information about categories for marked regions or categories that are selected in the assessment. Therefore, I cannot extract the requested data from the provided context.

```mermaid!
graph LR

subgraph N[Item]

subgraph E[Embedding]

  
  

subgraph Subject

subgraph Content

subgraph Page

subgraph Sections

A[Heading<br/>Paragraphs]

  

J[Subheading<br/>Paragraphs]

  

K[Lists<br/>Tables<br/>Figures]

end

end

end

end

A --- F[Sentences] --> U[Phrases] --> W[Words] ---> S[Tokens] ---> T[Subject]

  

J --- F[Sentences] --> U[Phrases] --> W[Words] --> S[Tokens] --> T[Subject]

  

K --- F[Sentences] --> U[Phrases] --> W[Words] ---> S[Tokens] ---> T[Subject]

end

  
  

end

style N fill:#1a1a1a,stroke:#333,stroke-width:4px

style E fill:#2a1a2a,stroke:#f66,stroke-width:2px,color:#fff,stroke-dasharray: 5 5

```


[[NLP]]

[[Ruby]]


![](Pasted%20image%2020240301232004.png)
> [!ai]+ AI
>
> **Categories for all marked regions:**
> * **Background:** Regions that are not part of any object.
> * **Object:** Regions that are part of an object.
> **Categories that are selected in the assessment:**
> * **Relevant:** Regions that are relevant to the referring expression.
> * **Irrelevant:** Regions that are not relevant to the referring expression.
> The **Find_Center** function is used to find the center of a region. The center of a region is the point that is equidistant from all points in the region. The function takes a region definition (r) as input and returns the center of the region as an output.
> The **Mark_Allocation** function is used to mark the allocation of regions to categories. The function takes a list of regions (R) as input and returns a list of categories (C) as output. The function first sorts the regions in ascending order of areas. Then, for each region, the function checks if the region is not part of any of the previously marked regions. If the region is not part of any of the previously marked regions, the function marks the region as relevant and adds it to the list of categories.
