---
layout: index
title: Issues
subtitle: 
excerpt: 
category: Audio
tags:
  - linux
  - audio
image:
---


# January 20th, 2024
#alsa #raysession #patchance #patchbay #fix




### raysession|patchance patchbay crashes when qsampler is running:

```bash
~ » patchance                                                                                       b08x@tinybot
Traceback (most recent call last):
  File "/usr/share/patchance/src/patchbay/patchbay_manager.py", line 961, in _delayed_orders_timeout
    group_id = oq.func(*oq.args, **oq.kwargs)
               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/share/patchance/src/patchbay/patchbay_manager.py", line 640, in add_port
    group.check_for_portgroup_on_last_port()
  File "/usr/share/patchance/src/patchbay/base_elements.py", line 1295, in check_for_portgroup_on_last_port
    other_port = self.stereo_detection(last_port)
                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/share/patchance/src/patchbay/base_elements.py", line 1195, in stereo_detection
    while base_port[-1].isdigit():
          ~~~~~~~~~^^^^
IndexError: string index out of range
[1]    1905587 IOT instruction  patchance
```

