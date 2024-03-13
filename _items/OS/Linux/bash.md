---
layout: page
title: bash
subtitle: 
category:
  - OS
  - Linux
tags: 
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
 
 