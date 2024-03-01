---
layout: note
title: Notes
subtitle: 
category: Audio
tags: 
links:
---

# s


[dont forget about ](https://github.com/crlandsc/tiny-audio-diffusion.git



[patches for IEM pluginsuite](https://gitlab.com/dvzrv/IEMPluginSuite)


[fucking sunvox, don't fotget about sunvox](https://warmplace.ru/) & bespokesynth ---> a neat little docker-stack



---
#linux-audio 


#pulseaudio
control audio devices

```shell
# get current audio output
pactl list sinks short | awk -F '\t' '{print $1,$2,$5}'
# set audio output
pactl set-default-sink <sink #>
# set specific volume level
pamixer --set-volume 50
# toggele mute
pamixer --toggle-mute
# set volume down
pamixer --increase 50
# set volume up
pamixer --descrease 50
```

#pipewire

control audio devices

```shell
# get current audio output
pactl list sinks short | awk -F '\t' '{print $1,$2,$5}'
# set audio output
pactl set-default-sink <sink #>
# set specific volume level
wpctl set-volume @DEFAULT_AUDIO_SINK@ 0.5
# mute default audio output
wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle
# set volume down
wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-
# set volume up
wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%+
```

#pipewire 

> **Note** Known issue: [https://bbs.archlinux.org/viewtopic.php?pid=2023940#p2023940](https://bbs.archlinux.org/viewtopic.php?pid=2023940#p2023940)

if video playback stops working after resuming from suspend state, then try killing the process or restarting the service

```shell
killall -9 pipewire
# alternatively
systemctl --user restart pipewire
```

Noticeable audio delay or audible pop/crack when starting playback with `pipewire-media-session`, try the following solution:

Reference: [https://wiki.archlinux.org/title/PipeWire](https://wiki.archlinux.org/title/PipeWire)

```shell
# /usr/share/pipewire/media-session.d/media-session.conf
table.insert (alsa_monitor.rules, {
  matches = {
    {
      -- Matches all sources.
      { "node.name", "matches", "alsa_input.*" },
    },
    {
      -- Matches all sinks.
      { "node.name", "matches", "alsa_output.*" },
    },
  },
  apply_properties = {
    ["session.suspend-timeout-seconds"] = 0,  -- 0 disables suspend
  },
})

systemctl --user restart pipewire
```




![](Pasted%20image%2020240118085727.png)![](Pasted%20image%2020240118085755.png)