---
layout: note
title: Sonic-Visualizer
subtitle: 
category: 
tags: 
links:
---

## using osc
To open an audio file with specific layers and/or views, create a text file with the osc commands to send to SV:

```text
/open /mnt/bender/backup/Library/sounds/collections/freesound/015_waveplaysfx_synth-seq-mellow-bass-guitar-melody-90-bpm.wav
/add spectrogram
/transform vamp:vamp-aubio:aubionotes:notes
/setcurrent 2 3
/set 'layer' 'Scale-Units' 'dB'
/set 'layer' 'Vertical Scale' 'MIDI Notes'
```


[sv osc documentation](https://github.com/danstowell/Sonic-Visualiser/blob/master/README.OSC)

