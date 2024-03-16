---
layout: page
title: Reducing Docker Images Size
subtitle: 
category:
  - OS
tags:
  - docker
links:
---

[[_drafts/JupyterLabs & Ruby NLP]]

Here are some ways the 'notebook-nlp' Docker image size could be reduced:

1. Only install specific NLP libraries/tools needed instead of all via Conda. This would reduce unnecessary dependencies.
    
2. Install libraries from source instead of pre-built packages which are typically larger. Could build packages during docker build.
    
3. Use a smaller base image like Alpine Linux instead of larger Ubuntu base. Alpine is much smaller but may require tweaks for some packages.
    
4. Prune cached layers and intermediate images during/after docker build to reduce unnecessary files.
    
5. Multistage builds - build dependencies in one stage then copy only the final files to a lightweight base image.
    
6. Use a `.dockerignore` file to exclude unnecessary files/folders that get bundled in the image.
    
7. Consider splitting out common libraries/tools used by multiple images into shared images to reduce duplication.
    
8. Use a tool like docker-slim to optimize the final image layers, removing unnecessary files.
    
9. Minimize layers by combining common steps like ENV/RUN statements together where possible.
    
10. Publish a lightweight version separately from the full-featured version for those concerned with only size.
    

The key things that increase size are large pre-built packages, unnecessary files, and layer duplication. Targeting those areas is how one could most significantly reduce the image footprint.

---
