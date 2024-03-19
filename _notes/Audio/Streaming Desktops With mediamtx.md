---
layout: page
title: Streaming Desktops With mediamtx
category:
  - Audio
tags:
  - obs-studio
links:
---

# stream desktop from one host to another to split up the load for a data heavy presentation


```
+-------------+                                
|             |                                
|   tinybot   |                                
|             |                                
+------+------+                                
       |                                       
       |                                       
       |                                       
       |                                       
       |                                       
       |                       +--------------+
       |                       |              |
       +---------------------->|   soundbot   |
                               |              |
                               +--------------+
```



## On sending host (tinybot)
Install and run mediamtx:
```shell
~ » mediamtx
2023/11/21 23:37:37 INF MediaMTX v1.3.0
2023/11/21 23:37:37 INF configuration loaded from /etc/mediamtx/mediamtx.yml
2023/11/21 23:37:37 INF [RTSP] listener opened on :8554 (TCP), :8000 (UDP/RTP), :8001 (UDP/RTCP)
2023/11/21 23:37:37 INF [RTMP] listener opened on :1935
2023/11/21 23:37:37 INF [HLS] listener opened on :8888
2023/11/21 23:37:37 INF [WebRTC] listener opened on :8889 (HTTP), :8189 (ICE/UDP)
2023/11/21 23:37:37 INF [SRT] listener opened on :8890 (UDP)
```

Configure stream parameters to use the local server:

![](/assets/img/screenshot/Pasted%20image%2020231121235054.png)


## On receiving host (soundbot)
Add `media source` to scene:

![](/assets/img/screenshot/Pasted%20image%2020231121235159.png)

rtmp stream from tinybot should now be visible as a scene source:

![](/assets/img/screenshot/Pasted%20image%2020231122001230.png)




[source](https://github.com/bluenviron/mediamtx#obs-studio)


