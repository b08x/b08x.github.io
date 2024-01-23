---
title: Custom Shell Commands
excerpt: 
layout: note
category: DeadBeef
---

# notes on shellexec

[[DeadBeef]]

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

