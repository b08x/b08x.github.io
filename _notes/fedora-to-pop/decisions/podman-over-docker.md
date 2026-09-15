---
layout: post
permalink: /notes/fedora-to-pop/decisions/podman-over-docker/
title: "Podman over Docker"
description: "Why the container role installs Podman by default and leaves Docker behind an opt-in flag."
summary: "Why the container role installs Podman by default and leaves Docker behind an opt-in flag."
id: 20260810-podman-over-docker
tags: [decision, containers]
created: 2026-08-10
updated: 2026-08-10
related: [20260810-no-host-cuda, 20260810-three-layer-split]
---

> Summary: Podman is the default runtime. Docker is opt-in behind
> `containers_install_docker`, and the `docker` group is only granted when
> Docker is actually installed.

## Context

The Fedora machine ran both. Not because anything needed both — because
`container-tools` bundled podman and docker together, and nobody had ever made
the call. The cost was a second root daemon, a systemd socket, and a second
container storage pool holding its own copy of overlapping image layers.

## Details

### What tipped it

Three things, in order of weight:

**The `docker` group is root-equivalent.** Anyone in it can start a container
that bind-mounts `/` and writes as uid 0. Adding a user to `docker`
unconditionally, as the old role did, is a privilege grant dressed as a
convenience. Podman rootless needs no such group.

**Two storage pools is two copies.** On a machine that hit 84 % of 475 G, a
duplicate image store is not a rounding error.

**Nothing on the machine actually required the Docker socket.** Worth
re-checking rather than assuming — some tooling reaches for
`/var/run/docker.sock` directly and will not accept a Podman socket without
being told to.

### How it's expressed

```yaml
containers_install_podman: true
containers_install_docker: false
containers_user_groups: [audio, video, render]
```

The `docker` group is appended to that list only when
`containers_install_docker` is true:

{% raw %}
```yaml
groups: "{{ containers_user_groups + (['docker'] if containers_install_docker | bool else []) }}"
```
{% endraw %}

Lingering is enabled via `loginctl enable-linger` so rootless Podman units
survive logout — the failure mode otherwise is a service that works while you
are logged in and vanishes when you are not.

### The honest counterargument

Podman's Docker compatibility is good but not total. Compose files with
unusual networking, tools that shell out to a `docker` binary, and anything
expecting Docker's specific socket semantics will need attention. If that
becomes a running cost rather than a one-time fix, flipping the flag is one
line and the reasoning above is not so strong that it should not be revisited.

## Related

- [No host CUDA toolkit](no-host-cuda.md) — supports: the GPU story assumes a container runtime is present and working.
- [The three-layer split](three-layer-split.md) — context: container runtimes are Layer 1; the images they run are not.
