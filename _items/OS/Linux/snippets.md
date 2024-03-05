---
layout: note
title: Command Line Snippets
subtitle: 
category:
  - OS
  - Linux
tags:
  - linux
links:
---



#### creating usb iso with dd
```sh
#for optimal imaging of a drive with an iso:
# check the I/O size with fdisk and use that as the byte size
sudo dd if=path_to.iso of=/dev/drive bs=$ status=progress && sync
```

#### extracting wavs from mkv
```sh
for vid in *.mkv; do ffmpeg -i "$vid" -vn -acodec copy "${vid%.mkv}.wav"; done
```

#### normalizing flac files
```sh
for flac in *.flac; do bs1770gain --codec=flac --suffix=flac "$flac" --overwrite
```

#### writing a Raspberry Pi image to disk
```sh
unzip -p NOOBS_v3_2_0.zip | sudo dd of=/dev/mmcblk0 bs=4M status=progress conv=fsync
```

#### normalize files with sox
```bash
for i in *; do echo $i && sox $i -n --norm -R gain 0.1 2>&1; done 
```

#### sd: a new generation of sed
```markdown
#  sd

##  Intuitive find and replace.
##  More information: https://github.com/chmln/sd.

- Trim some whitespace using a regular expression (output stream: `stdout`):
  echo 'lorem ipsum 23   ' | sd '\s+$' ''

- Replace words using capture groups (output stream: `stdout`):
  echo 'cargo +nightly watch' | sd '(\w+)\s+\+(\w+)\s+(\w+)' 'cmd: $1, channel: $2, subcmd: $3'

- Find and replace in a specific file (output stream: `stdout`):
  sd -p 'window.fetch' 'fetch' path/to/file.js

- Find and replace in all files in the current project (output stream: `stdout`):
  sd 'from "react"' 'from "preact"' "$(find . -type f)"
```

#### launch a particular application with a specific GTK theme
```bash
Exec=env GTK_THEME=Yaru-dark /usr/bin/zim %F
```

#### ydotool
```bash
ydotool key super+d return , sleep 2000 , type 'Hey guys. This is Austin.'
```
