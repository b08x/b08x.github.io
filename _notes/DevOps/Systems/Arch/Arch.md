---
---

[repo manager](https://repod.archlinux.page/)

[rts is a collection of systemd services and scripts that allow to set pre-defined real-time related scheduling settings, using [tuna](https://rt.wiki.kernel.org/index.php/Tuna).](https://sleepmap.de/software/rts/)


---

Adjust monitor brightness  

[https://man.archlinux.org/man/extra/ddcutil/ddcutil.1.en#setvcp](https://man.archlinux.org/man/extra/ddcutil/ddcutil.1.en#setvcp)

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

---

## [Known Issues](https://gist.github.com/yqlbu/70c3aa3f1612f7e35d9847a9855b6f73#known-issues)

GTK apps starting very slowly with xdg-desktop-portal-gnome  

Ref: [https://bugs.archlinux.org/task/78627](https://bugs.archlinux.org/task/78627)

```shell
sudo pacman -Rns xdg-desktop-portal-gnome
sudo reboot
```

newest version of ncurses interferes with ranger
downgrade to 6.4.1

```shell
sudo downgrade ncurses
```

## [Further reading](https://gist.github.com/yqlbu/70c3aa3f1612f7e35d9847a9855b6f73#further-reading)

- [https://arch.icekylin.online/](https://arch.icekylin.online/)
- [https://sspai.com/post/78916](https://sspai.com/post/78916)

---



