---
title: FFmpeg NVENC Video Splitting Notes
tags:
  - ffmpeg
  - video-encoding
  - hardware-acceleration
  - gpu
  - nvidia
last updated: Wednesday, December 24th 2025, 11:10:55 pm
---

---

# FFmpeg Notes on Splitting Large Videos

T1200 GPU supports NVENC (Hardware Encoding), which is very fast for *compressing* video. However, re-encoding this file—even with hardware acceleration—would take 10-20 minutes and reduce quality. Stream copying will take roughly **10-30 seconds** because your SK Hynix NVMe drive can write at ~3GB/s.


Using `pyscenedetect` changes your goal from "splitting by time" (instant) to "splitting by content" (slower, because it must watch the video).

Since you are asking for **custom flags** and have an **NVIDIA T1200**, you likely want to use your GPU to accelerate this. However, `pyscenedetect` works in two distinct phases, and the optimizations for each are different.

Here is the fastest way to use `pyscenedetect` on your hardware profile.

## The Strategy: "Hybrid" Acceleration

1. **Analysis Phase:** Use your CPU (i7-11800H). `pyscenedetect` is Python-based and usually CPU-bound. Passing ffmpeg flags to the analysis engine is difficult without complex piping. Your 8-core Tiger Lake CPU is fast enough to scan this file in 5-10 minutes.
    
2. **Splitting Phase:** Use **Stream Copy**. This is where the "Custom Flags" come in. You want to force ffmpeg to *not* re-encode.
    

## The Command (Fastest / Stream Copy)

Use this command to detect scenes and split them without re-encoding. This is the absolute fastest method.

Bash

```shell
scenedetect -i jekyll-tailwind-refactor-sift-toolbox-2025-12-24_21-13-10.mkv \
  detect-content --threshold 27 \
  split-video --copy \
  -a "-map 0 -c:v copy -c:a copy"
```

* `detect-content`: The standard detector.
    
* `--threshold 27`: A standard sensitivity (default is 30, slightly lower is often safer for screen recordings).
    
* `split-video --copy`: Tells the tool to try to stream copy.
    
* `-a "-map 0 -c:v copy -c:a copy"`: **These are the custom flags.**
    
    * `-map 0`: Ensures *all* tracks (audio/subs) are copied, not just the first one.
        
    * `-c:v copy`: Forces video stream copy.
        
    * `-c:a copy`: Forces audio stream copy.
        

## The Command (Frame-Perfect / NVENC)

**Warning:** The "Stream Copy" method above acts like a pair of scissors; it can only cut at "Keyframes" (every few seconds). If a scene changes *between* keyframes, the cut might be slightly off.

If you need **frame-perfect cuts**, you *must* re-encode. To make this fast, use your NVIDIA T1200 (`h264_nvenc`).

Bash

```shell
scenedetect -i jekyll-tailwind-refactor-sift-toolbox-2025-12-24_21-13-10.mkv \
  detect-content \
  split-video \
  -a "-map 0 -c:v h264_nvenc -preset p1 -qp 19 -c:a copy"
```

* `h264_nvenc`: Uses your NVIDIA GPU to encode.
    
* `-preset p1`: The fastest NVENC preset (Quality is lower, speed is max).
    
* `-qp 19`: Constant quantization parameter (roughly visually lossless).
    

## Summary Table

| **Method**          | **Speed**   | **Precision**    | **Use Case**                                       |
| ------------------- | ----------- | ---------------- | -------------------------------------------------- |
| **Stream Copy**     | ~1-2 mins   | Keyframe (Rough) | Archiving, long talks, simple backups.             |
| **NVENC Re-encode** | ~20-30 mins | Exact Frame      | Editing, music videos, precise content separation. |
