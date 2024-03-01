---
layout: note
title: 
subtitle: 
category: OS
tags:
  - linux
links:
---


while loop example
```sh
#!/bin/bash
let i=0 # define counting variable
W=() # define working array
while read -r line; do # process file by file
    let i=$i+1
    W+=($i "$line")
done < <( ls -1 /home/b08x)


```

bash select
```sh
select fname in *;
do
	echo you picked $fname \($REPLY\)
	break;
done
```
 produces:

```sh
1) ambix-o1                      14) fmit                         27) linuxsampler-svn             40) pkgdesc                      53) sooperlooper-git             
2) ambix-o3                      15) gitflow-avh                  28) lsp-plugins-git              41) platformfolders              54) sparta-plugins               
3) ambix-o5                      16) hydrogen-git                 29) lv2-c++-tools                42) qmidiarp-git                 55) swh-lv2-git                  
4) antimicrox                    17) iempluginsuite-git           30) mcfx-o1                      43) radiotray-ng                 56) tap-plugins-lv2-git          
5) autofs                        18) ingen-git                    31) mcfx-o3                      44) raul                         57) timemachine                  
6) baudline-bin                  19) input-remapper-git           32) mcfx-o5                      45) raysession-git               58) timeshift                    
7) bipscript                     20) intersect.lv2-git            33) mpv-plugin-excerpt-git       46) reproc                       59) tonespace                    
8) bipscript-ide                 21) jack-keyboard                34) nitrogen-git                 47) scala-music                  60) ttf-devicons                 
9) bluetooth-autoconnect         22) jack_link                    35) njconnect                    48) scala-music-scales           61) tuned                        
10) caps-lv2-git                 23) jack_snapshot                36) non-mixer-lv2-git            49) sendmidi                     62) vital-synth-git              
11) catch2-3.0.1                 24) jalv-select-git              37) ocenaudio-bin                50) sonic-pi-git                 63) vst2sdk                      
12) crossguid                    25) kissfft                      38) paru-bin                     51) sonic-visualiser-git         
13) epson-inkjet-printer-escpr2  26) libgig-svn                   39) PKGBUILD.proto               52) sononym                      
?# 


```



