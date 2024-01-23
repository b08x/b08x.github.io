---
---



Increasing the amount of inotify watchers
If you are running Debian, RedHat, or another similar Linux distribution, run the following in a terminal:

$ sudo sh -c "echo fs.inotify.max_user_watches=524288 >> /etc/sysctl.conf"
$ sudo sysctl -p

