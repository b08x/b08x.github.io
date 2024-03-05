---
layout: note
title: Reducing Docker Images Size
subtitle: 
category:
  - OS
tags:
  - docker
links:
---



# 
[[Using Ruby with Jupyter]]


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

# Using mutable.ai for suggestions

Here is one way we could refactor the Dockerfile to use a multi-stage build approach:

1. Add a new build stage at the top to handle compiling dependencies:


```
FROM ubuntu:focal as build
```


#### install build deps


```
RUN apt-get update && apt-get install -y build-essential
```


2. Copy just the Gemfile and execute bundle install


```
COPY Gemfile /app/ COPY Gemfile.lock /app/ WORKDIR /app RUN bundle install
```


3. Add a new deployment stage:


```
FROM ubuntu:focal
```


#### Copy installed gems to deployment image


```
COPY --from=build /app/vendor/bundle /app/vendor/bundle
```


4. Continue with existing steps like copying source code


```
COPY . /app
```


5. Set PATH and entrypoint


```
ENV BUNDLE_PATH /app/vendor/bundle CMD ["irb"]
```


This avoids installing all build tooling and dependencies into the final image layer, keeping it small and efficient. Only the compiled gems are copied over.

We optimize by separating building/compiling from packaging for deployment. Let me know if any part needs more explanation!

---

Here is how we could modify the Dockerfile in the /docker-stacks/nlp folder to use multi-stage builds for the 'notebook-nlp' image:

1. Add a 'build' stage to install dependencies:


```
FROM conda:latest as build RUN conda install -c conda-forge nltk spacy keras tensorflow pytorch scipy scikit-learn pandas numpy
```


2. Add a 'deploy' stage with a lightweight base image:


```
FROM continuumio/miniconda3
```


3. Copy just the requirements/files from build stage:


```
COPY --from=build /opt/conda/pkgs /opt/conda/pkgs COPY --from=build /opt/conda/envs/default/bin/python /usr/bin/python COPY --from=build /opt/conda/etc/conda/ .
```


4. Set environment variables:


```
ENV PATH="/opt/conda/envs/default/bin:${PATH}"
```


5. Copy rest of files:


```
COPY . /home/jovyan/
```


6. Set entrypoint


```
ENTRYPOINT ["jupyter", "notebook"]
```


This separates the build from final image, avoiding large dev tools in final layer. Only compiled pkgs from build are copied over, keeping the image slim.

Let me know if any part needs more explanation or improvement! Referencing files/stages clearly is important for multi-stage builds.