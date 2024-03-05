---
layout: note
title: rsync
subtitle: 
category:
  - OS
  - Linux
tags:
  - linux
links:
---


## copy files that are symlinked

f.e:
```
rsync --copy-links -rvP xfce4 /home/b08x/tmp
```



## snapshots and images

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


## remount backup read only on exit

```
trap "
  mount -o remount,ro /backup;
" INT QUIT TERM EXIT

mount -o remount,rw /backup

```


## a good explanation on using include_from

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