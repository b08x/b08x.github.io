---
---



copy files that are symlinked
-----------------------------
@rsync

f.e:
rsync --copy-links -rvP xfce4 /home/b08x/tmp


snapshots and images
--------------------

initial 
rsync --copy-device /dev/sda /archive/timestamp_image.img

to update
rsync --inplace --copy-device /archive/timestamp_image.img

example from timeshift{{{code: lang="sh" linenumbers="False"
rsync -aii --recursive --verbose --delete --force --stats --sparse --delete-excluded --link-dest=/run/timeshift/backup/timeshift/snapshots/2021-09-20_22-00-01/localhost/ --log-file=/run/timeshift/backup/timeshift/snapshots/2021-10-13_02-43-13/rsync-log --exclude-from=/run/timeshift/backup/timeshift/snapshots/2021-10-13_02-43-13/exclude.list --delete-excluded / /run/timeshift/backup/timeshift/snapshots/2021-10-13_02-43-13/localhost/
}}}


trap "
  mount -o remount,ro /backup;
" INT QUIT TERM EXIT

mount -o remount,rw /backup

