---
id: 1708912375-VABT
title: LocalAI
aliases:
  - enabling ccache with local-ai builds
category:
  - Applications
tags:
  - llm
---

# Enabling `ccache` When building LocalAI Images

https://askubuntu.com/questions/470545/how-do-i-set-up-ccache

```bash
diff --git a/Dockerfile b/Dockerfile
index a04a866..35e75c3 100644
--- a/Dockerfile
+++ b/Dockerfile
@@ -18,7 +18,9 @@ ENV EXTERNAL_GRPC_BACKENDS="coqui:/build/backend/python/coqui/run.sh,huggingface
 ARG GO_TAGS="stablediffusion tinydream tts"
 
 RUN apt-get update && \
-    apt-get install -y ca-certificates curl patch pip cmake git && apt-get clean
+  apt-get install -y ca-certificates curl patch pip ccache cmake git wget && apt-get clean && \
+  update-ccache-symlinks && \
+  echo 'export PATH="/usr/lib/ccache:$PATH"' | tee -a ~/.bashrc
```

```bash
+RUN echo "deb [signed-by=/usr/share/keyrings/oneapi-archive-keyring.gpg] https://apt.repos.intel.com/oneapi all main" | tee /etc/apt/sources.list.d/oneAPI.list && \
+  wget -O- https://apt.repos.intel.com/intel-gpg-keys/GPG-PUB-KEY-INTEL-SW-PRODUCTS.PUB \ | gpg --dearmor | tee /usr/share/keyrings/oneapi-archive-keyring.gpg > /dev/null && \
+  apt-get update -qq && apt-get autoremove -y
+
+RUN apt-get install -y intel-basekit && \
+  echo '/opt/intel/oneapi/2024.0/lib' > /etc/ld.so.conf.d/intel-oneapi-basekit.conf && \
+  echo '/opt/intel/oneapi/mkl/2024.0/lib' >> /etc/ld.so.conf.d/intel-oneapi-basekit.conf
```

```bash
+GALLERIES=[{"name":"model-gallery", "url":"github:go-skynet/model-gallery/index.yaml"}, {"url": "github:go-skynet/model-gallery/huggingface.yaml","name":"huggingface"}]
 ## CORS settings
-# CORS=true
-# CORS_ALLOW_ORIGINS=*
+CORS=true
+CORS_ALLOW_ORIGINS=*
 
 ## Default path for models
 #
 MODELS_PATH=/models
 
 ## Enable debug mode
-# DEBUG=true
+DEBUG=true
 
 ## Disables COMPEL (Diffusers)
 # COMPEL=0
@@ -33,14 +33,14 @@ MODELS_PATH=/models
 ## cuBLAS: This is a GPU-accelerated version of the complete standard BLAS (Basic Linear Algebra Subprograms) library. It's provided by Nvidia and is part of their CUDA toolkit.
 ## OpenBLAS: This is an open-source implementation of the BLAS library that aims to provide highly optimized code for various platforms. It includes support for multi-threading and can be compiled to use hardware-specific features for additional performance. OpenBLAS can run on many kinds of hardware, including CPUs from Intel, AMD, and ARM.
 ## clBLAS:   This is an open-source implementation of the BLAS library that uses OpenCL, a framework for writing programs that execute across heterogeneous platforms consisting of CPUs, GPUs, and other processors. clBLAS is designed to take advantage of the parallel computing power of GPUs but can also run on any hardware that supports OpenCL. This includes hardware from different vendors like Nvidia, AMD, and Intel.
-# BUILD_TYPE=openblas
+BUILD_TYPE=sycl_f32

```


