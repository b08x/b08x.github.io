---
title: Custom Shell Commands
excerpt: 
layout: note
category: DeadBeef
---

# notes on shellexec

[[DeadBeef]]

> in Encyclopedia of Knowledge Management, Schwartz, D. Ed. Idea Group, 2005. Knowledge Management and Musical Metadata François Pachet Sony CSL – Paris, 6 rue Amyot, 75005 Paris Email: pachet@csl.sony.fr Abstract: The explosion of digital music has created in the recent years an urgent need for powerful knowledge management techniques and tools. Without such tools, users are confronted to huge music catalogues they cannot fully exploit. The very nature of music calls for the development of specific knowledge management techniques: on the one hand, the goals of users are ill-defined, or rather, based on enjoyment rather than on clear tasks or problems to solve. On the other hand, music in Western countries has been the subject of a long tradition of formalization and knowledge which is of crucial importance for building reasonable music information systems. The article outlines the main issues on music management, and focuses on the three main types of musical metadata being currently considered: editorial, cultural and acoustic. For each of these, the main issues are stated an

[](Knowledge_Management_and_Musical_Metadata.pdf#page=2&selection=0,2,23,58)

{% picture image.jpg --link https://google.com %}
{% picture image.jpg --picture class="some classes" --img id="object-cover" %}
{% picture screenshot/commandparams.png %}


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

