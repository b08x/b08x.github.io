---
layout: wiki-page
title: Docker Deployment
hide_header: true
wiki_id: video-chapter-automater
page_id: docker-integration
permalink: "/wikis/video-chapter-automater/10-docker-integration/"
repository: https://github.com/b08x/video-chapter-automater
left_sidebar: wiki-nav
right_sidebar: toc
right_sidebar_xl_only: true
show_metadata: false
related_pages:
- id: gpu-acceleration
  url: "/wikis/video-chapter-automater/05-gpu-acceleration/"
  title: Gpu Acceleration
file_paths:
- path: README.md
  url: https://github.com/b08x/video-chapter-automater/blob/main/README.md
pagination:
  previous:
    title: '09-configuration-system'
    url: "/wikis/video-chapter-automater/09-configuration-system/"
  next:
    title: 11-cli-reference
    url: "/wikis/video-chapter-automater/11-cli-reference/"
---

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:
- [README.md](https://github.com/b08x/video-chapter-automater/blob/main/README.md)
- [src/video_chapter_automater/setup_wizard.py](https://github.com/b08x/video-chapter-automater/blob/main/src/video_chapter_automater/setup_wizard.py)
- [src/video_chapter_automater/pipeline/config.py](https://github.com/b08x/video-chapter-automater/blob/main/src/video_chapter_automater/pipeline/config.py)
- [src/video_chapter_automater/output/manager.py](https://github.com/b08x/video-chapter-automater/blob/main/src/video_chapter_automater/output/manager.py)
- [src/video_chapter_automater/pipeline/orchestrator.py](https://github.com/b08x/video-chapter-automater/blob/main/src/video_chapter_automater/pipeline/orchestrator.py)
</details>

# Docker Deployment

## Introduction

Docker deployment in VideoChapterAutomater serves as a containerized execution environment designed to encapsulate system dependencies such as FFmpeg, PySceneDetect, and NVIDIA GPU acceleration. The mechanism relies on a host-to-container volume mapping strategy to facilitate I/O operations, ensuring that the heavy lifting of video analysis and metadata embedding occurs within a controlled, immutable runtime.

Sources: [README.md](https://github.com/b08x/video-chapter-automater/blob/main/README.md), [src/video_chapter_automater/setup_wizard.py:#L175-L185](https://github.com/b08x/video-chapter-automater/blob/main/src/video_chapter_automater/setup_wizard.py#L175-L185)

## Container Architecture and Environment

The system utilizes a multi-layered approach to environment parity. While the application can run natively, the Docker configuration explicitly targets an NVIDIA CUDA base image to provide the necessary drivers and toolkits for GPU-accelerated video processing.

### Dockerfile Specification

The container environment is built on `python:3.11-slim` (or an NVIDIA CUDA base as noted in the README) and implements the following structural components:
- **System Dependencies**: Installation of `ffmpeg` via `apt-get`.
- **Dependency Management**: Utilization of `uv` for fast, frozen dependency resolution via `uv.lock`.
- **Entry Point**: The container is configured to execute the module directly using `python -m video_chapter_automater`.

Sources: [src/video_chapter_automater/setup_wizard.py:#L198-L220](https://github.com/b08x/video-chapter-automater/blob/main/src/video_chapter_automater/setup_wizard.py#L198-L220), [README.md](https://github.com/b08x/video-chapter-automater/blob/main/README.md)

### Hardware Integration

The deployment architecture is heavily dependent on the NVIDIA Container Toolkit. This dependency creates a rigid requirement for host-side configuration to enable the `--gpus all` flag, which is necessary for the container to access hardware encoders/decoders.

Sources: [README.md](https://github.com/b08x/video-chapter-automater/blob/main/README.md)

## Data Flow and Volume Mapping

The containerized execution follows a strict volume mounting pattern. Because the container is transient (`--rm`), all persistent data must be mapped to the host filesystem.

graph TD
    HostDir[Host Working Directory] -->|Mounted to /app| ContainerApp[/app inside Container]
    ContainerApp -->|Reads| InputVideo[Input Video File]
    ContainerApp -->|Executes| VCAProcess[VCA Processing Pipeline]
    VCAProcess -->|Writes| OutputVideo[Output Video with Chapters]
    OutputVideo -->|Persisted to| HostDir

The observed flow shows a fucking simple but effective mapping: the host's current working directory is mirrored to `/app`, making the container's output immediately available to the user upon process completion.

Sources: [README.md](https://github.com/b08x/video-chapter-automater/blob/main/README.md), [src/video_chapter_automater/output/manager.py:#L125-L140](https://github.com/b08x/video-chapter-automater/blob/main/src/video_chapter_automater/output/manager.py#L125-L140)

## Setup and Orchestration

The system provides an interactive `SetupWizard` that includes a `DOCKER_ONLY` installation type. This wizard automates the verification of the Docker daemon and the generation of the environment.

### Docker Setup Logic

The `_setup_docker_environment` method performs the following validation steps:
1. **Binary Check**: Verifies `docker` exists in the system PATH.
2. **Daemon Check**: Executes `docker info` to ensure the service is active.
3. **Template Generation**: Programmatically writes the `Dockerfile` if it is missing from the local environment.

Sources: [src/video_chapter_automater/setup_wizard.py:#L175-L196](https://github.com/b08x/video-chapter-automater/blob/main/src/video_chapter_automater/setup_wizard.py#L175-L196)

### Execution Parameters

The following table describes the standard parameters for deploying the container:

| Parameter | Function | Structural Impact |
| :--- | :--- | :--- |
| `--rm` | Container Removal | Ensures no leftover container state; enforces statelessness. |
| `-it` | Interactive TTY | Allows for real-time progress bar rendering via Rich. |
| `--gpus all` | Hardware Passthrough | Critical for GPU-based scene detection and encoding. |
| `-v "$(pwd)":/app` | Bind Mount | Maps the host filesystem to the container's working directory. |

Sources: [README.md](https://github.com/b08x/video-chapter-automater/blob/main/README.md), [src/video_chapter_automater/pipeline/config.py:#L100-L115](https://github.com/b08x/video-chapter-automater/blob/main/src/video_chapter_automater/pipeline/config.py#L100-L115)

## Operational Tendencies and Constraints

A structural inconsistency exists between the "Standard" local installation and the "Docker" deployment. The local installation utilizes platform-specific paths (e.g., `~/.config/vca`), whereas the Docker deployment forces a flat structure within the `/app` mount. This divergence means configuration persistence behaves differently: in Docker, the configuration is often transient or must be manually injected via additional volume flags, which is a somewhat annoying gap in the otherwise automated setup.

Sources: [README.md](https://github.com/b08x/video-chapter-automater/blob/main/README.md), [src/video_chapter_automater/setup_wizard.py:#L55-L70](https://github.com/b08x/video-chapter-automater/blob/main/src/video_chapter_automater/setup_wizard.py#L55-L70)

## Sequence of Container Execution

The following diagram illustrates the interaction between the host, the Docker engine, and the internal VCA Pipeline Orchestrator.

sequenceDiagram
    participant Host as User/Host OS
    participant Docker as Docker Engine
    participant VCA as PipelineOrchestrator
    participant GPU as NVIDIA GPU

    Host->>Docker: docker run --gpus all -v /app
    activate Docker
    Docker->>VCA: Initialize(input_path)
    activate VCA
    VCA->>GPU: Detect hardware capabilities
    GPU-->>VCA: GPUVendor.NVIDIA detected
    VCA->>VCA: Execute Sequential Stages
    Note over VCA: Video -> Audio -> Scenes -> Chapters
    VCA->>Host: Write output_with_chapters.mp4
    deactivate VCA
    Docker-->>Host: Process Complete (Container Exit)
    deactivate Docker

Sources: [src/video_chapter_automater/pipeline/orchestrator.py:#L55-L85](https://github.com/b08x/video-chapter-automater/blob/main/src/video_chapter_automater/pipeline/orchestrator.py#L55-L85), [src/video_chapter_automater/setup_wizard.py:#L180-L200](https://github.com/b08x/video-chapter-automater/blob/main/src/video_chapter_automater/setup_wizard.py#L180-L200)

## Conclusion

Docker Deployment is the primary mechanism for ensuring environment consistency in VideoChapterAutomater. It abstracts the complexity of FFmpeg and GPU driver integration into a single command-line interface. While it introduces a slight overhead in terms of volume management and configuration mapping, it provides the structural isolation necessary for high-performance video processing without polluting the host system's global namespace.