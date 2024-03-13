---
layout: page
title: Command Line Snippets
subtitle: 
category:
  - OS
  - Linux
tags:
  - bash
links: 
toc: true
---

#### while loop example

```sh
#!/bin/bash
let i=0 # define counting variable
W=() # define working array
while read -r line; do # process file by file
    let i=$i+1
    W+=($i "$line")
done < <( ls -1 /home/b08x)


```

#### bash select

```sh
select fname in *;
do
  echo you picked $fname \($REPLY\)
  break;
done
```
 
## utils
#### adjusting monitor brightness with ddcutil

[ddcutil](https://man.archlinux.org/man/extra/ddcutil/ddcutil.1.en#setvcp)

```shell
# install
sudo pacman -S ddcutil

# identify all attached monitors.
sudo ddcutil detect

# query the luminosity value of the second monitor.
sudo ddctpp getvcp 10 --display 2

# set the luminosity value for the first display
sudo ddcutil setvcp 10 30 --display 1
```

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


## rsync
#### copy files that are symlinked

f.e:
```
rsync --copy-links -rvP xfce4 /home/b08x/tmp
```

#### snapshots and images

initial 
```
rsync --copy-device /dev/sda /archive/timestamp_image.img
```

to update
```
rsync --inplace --copy-device /archive/timestamp_image.img
```

```

rsync -aii --recursive --verbose --delete --force --stats --sparse --delete-excluded --link-dest=/run/timeshift/backup/timeshift/snapshots/2021-09-20_22-00-01/localhost/ --log-file=/run/timeshift/backup/timeshift/snapshots/2021-10-13_02-43-13/rsync-log --exclude-from=/run/timeshift/backup/timeshift/snapshots/2021-10-13_02-43-13/exclude.list --delete-excluded / /run/timeshift/backup/timeshift/snapshots/2021-10-13_02-43-13/localhost/

```

#### remount backup read only on exit

```
trap "
  mount -o remount,ro /backup;
" INT QUIT TERM EXIT

mount -o remount,rw /backup

```


#### a good explanation on using include_from

[source: superuser thread](https://superuser.com/a/1804191)

Put it this way: `-r` and `-a` tell `rsync` to transfer files/subfolders inside the source directory, "exclude" rules let you make exceptions to that (i.e. skip some of the items that would've been transferred), and "include" rules let you make exceptions to the exceptions (i.e. transfer items that a later "exclude" rule would've excluded).

Now, let's go over the commands that didn't work:

```
rsync --include-from include.txt foo remotehost:foo
```

The problem here is that you're telling it to sync a directory (foo), not the files _in_ that directory. With the `-r` (or `-a`) option, it doesn't do that, so it just skips the directory. So, you add `-a`:

```
rsync -a --include-from include.txt foo remotehost:foo
```

...and now it sends everything, because you gave it a list of things to include, but didn't tell it to _exclude_ anything. The default is to include things, and adding an explicit instruction to include specific things doesn't change that.

So you add an exclude instruction:

```
rsync -a --exclude '*' --include-from include.txt foo remotehost:foo
```

...but you put the exclude rule first, and it checks rules from left to right, acting on the first match. Since everything matches `*`, everything gets excluded, and the include rule from the file never gets applied.

You should be able to get it to work by putting the include rule first:

```
rsync -a --include-from include.txt --exclude '*' foo remotehost:foo
```


---


## libvirt

```bash
#!/usr/bin/env bash

virt-clone --connect=qemu:///system \
--original <source-vm-name> \
--name <dest-vm-name-clone> \
--auto-clone
```


## sysrq

`Alt + PrintScreen + $command`

https://docs.kernel.org/admin-guide/sysrq.html

[Okay, so what can I use them for?](https://docs.kernel.org/admin-guide/sysrq.html#okay-so-what-can-i-use-them-for "Permalink to this heading")

Well, unraw(r) is very handy when your X server or a svgalib program crashes.

The loglevels `0`-`9` are useful when your console is being flooded with kernel messages you do not want to see. Selecting `0` will prevent all but the most urgent kernel messages from reaching your console. (They will still be logged if syslogd/klogd are alive, though.)

`term(e)` and `kill(i)` are useful if you have some sort of runaway process you are unable to kill any other way, especially if it's spawning other processes.

"just thaw `it(j)`" is useful if your system becomes unresponsive due to a frozen (probably root) filesystem via the FIFREEZE ioctl.

