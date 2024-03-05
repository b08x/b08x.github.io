---
layout: page
title: video conversion using ffmpeg
subtitle: 
category: 
tags:
  - ffmpeg
links:
---

# process

* convert mkv to mp4
* ffmpeg-normalize mp4
* unsilence mp4
* 

```shell
#!/usr/bin/env bash

local infile=$1
fbasename=$(basename "$1")
filename="${fbasename%.*}"

local outfile="${filename}.mp4"

/usr/bin/ffmpeg -i ${infile} -crf 15.0 -vcodec libx264 -acodec copy -coder 1 -flags +loop -cmp +chroma -partitions +parti4x4+partp8x8+partb8x8 -me_method hex -subq 6 -me_range 16 -g 250 -keyint_min 25 -sc_threshold 40 -i_qfactor 0.71 -b_strategy 1 -strict -2 -threads 19 -y ${outfile}
```

```
ffmpeg-normalize -pr -nt rms 2023-08-12_08-16-16.mp4 -prf "highpass=f=62" -prf "dynaudnorm=p=0.3:s=15" -ar 48000 -c:a libvorbis --keep-loudness-range-target -o 2023-08-12_08-16-16_n.mp4
```

```shell
# unsilence -sl -30 2023-08-12_08-16-16_n.mp4 -t 8 2023-08-12_08-16-16_us.mp4
unsilence -sl -30 2023-08-12_08-16-16_n.mp4 -t 8 2023-08-12_08-16-16_us.ogg -ao
```




```sh
for vid in *.mkv; do ffmpeg -i "$vid" -vn -acodec copy "${vid%.mkv}.wav"; done
```


#### Adjust the Volume (percentage or db works):

```sh
ffmpeg -i input.wav -af "volume=0.5" -c:a output.wav
```

```sh
`sox -V2 JoMoX_808_Kick_23-01.flac -n stats`

DC offset  -0.000000
Min level  -0.883103
Max level   0.913178
Pk lev dB      -0.79
RMS lev dB    -12.94
RMS Pk dB      -8.27
RMS Tr dB     -78.90
Crest factor    4.05
Flat factor     0.00
Pk count           2
Bit-depth      24/24
Num samples    72.2k
Length s       1.504
Scale max   1.000000
Window s       0.050


```

```sh
`ffmpeg -i JoMoX_808_Kick_23-01.flac -af "volume=0.5" JoMoX_808_Kick_23-01a.flac`
```

```sh
`sox -V2 JoMoX_808_Kick_23-01a.flac -n stats`

DC offset  -0.000000
Min level  -0.441552
Max level   0.456589
Pk lev dB      -6.81
RMS lev dB    -18.96
RMS Pk dB     -14.30
RMS Tr dB     -84.92
Crest factor    4.05
Flat factor     0.00
Pk count           2
Bit-depth      23/24
Num samples    72.2k
Length s       1.504
Scale max   1.000000
Window s       0.050

```

```sh
`ffmpeg -i JoMoX_808_Kick_23-01.flac -af volumedetect -f null /dev/null`

[Parsed_volumedetect_0 @ 0x564707b03980] n_samples: 72201
[Parsed_volumedetect_0 @ 0x564707b03980] mean_volume: -12.9 dB
[Parsed_volumedetect_0 @ 0x564707b03980] max_volume: -0.8 dB
[Parsed_volumedetect_0 @ 0x564707b03980] histogram_0db: 120


```

```sh
# sox analysis
Min level  -0.883103
Pk lev dB      -0.79

# ffmpeg analysis
[Parsed_volumedetect_0 @ 0x564707b03980] max_volume: -0.8 dB

```

