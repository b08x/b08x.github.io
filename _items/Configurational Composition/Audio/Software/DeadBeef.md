---
layout: note
title: DeadBeef Audio Sampler
subtitle: 
category: Audio
tags: 
links:
---


> DeaDBeeF (as in [0xDEADBEEF](http://en.wikipedia.org/wiki/Hexspeak)) is a modular cross-platform audio player which runs on GNU/Linux distributions, macOS, Windows, *BSD, OpenSolaris, and other UNIX-like systems.

You can customize DeadBeef in a number of different ways. 

We will create menu items and gui buttons to:

* select files and create a [beats drum machine](https://github.com/jstrait/beats)
* select files to create sfz 
	* selected files are copied to a tmpfs folder
	* 
* select up to three files and analyzse with sonic-vis, sonic-lineup or tony
* select files to analyse and tag with sonic-annontator



* analysyse clipping and rms with sox | ffmpeg info
* 
* *

---
## custom shell commands


```
/usr/local/bin/svosc.rb %F
```

```bash
mpv %F
```

```bash
ocenaudio %F
```

```bash
audacity %F
```

```
shellexec_config_wip [{"command": "audacity %F", "flags": ["local", "single"], "title": "Edit/Audacity", "name": "new_cmd"},
{"command": "mkdir -pv %D/converted && sox %F -r 48k %D/converted/%f", "flags": ["local", "single", "multiple"], "title": "Edit/Sox/Resample", "name": "sox_resample"}, {"command": "normalize-audio -m %F", "flags": ["local", "single", "multiple"], "title": "Edit/Normalize", "name": "norm_audos"}, {"command": "puddletag %D", "flags": ["local", "single"], "title": "Edit/Puddletag", "name": "puddle_tag"}, 

{"command": "mkdir -pv %D/converted && sox %F -r 48k %D/converted/%f channels 1", "flags": ["local", "single", "multiple"], "title": "Edit/Sox/To Mono and Resample", "name": "sox_mixres"}]

xterm -bg black -hold -title MakeSFZ -font 9x15 -e "mkdir -pv %D/converted && sox %F -r 48k %d/converted/%N"

```

