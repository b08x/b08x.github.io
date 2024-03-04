---
layout: note
title: Refreshing System Ruby
subtitle: 
category:
  - OS
  - Linux
tags:
  - ruby
links:
---


```sh
#!/usr/bin/env bash
# remove ruby system packages
rubies=$(paru -Q | grep ruby | awk '{print $1}')

for gem in ${rubies[@]}; do 
	paru -Rdd --noconfirm "$gem" || continue
done

# clean up directories not managed by system
sudo rm -rf /usr/lib/ruby
sudo rm -rf /root/.local/share/gem
sudo rm -rf /root/.bundle/
rm -rf ~/.local/share/gem/
rm -rf ~/.bundle/
rm -rf ~/.rvm/
```

