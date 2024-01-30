---
---



#### creating usb iso with dd
for optimal imaging of a drive with an iso:
check the I/O size with fdisk and use that as the byte size
```sh
sudo dd if=path_to.iso of=/dev/drive bs=$ status=progress && sync

```


```sh
for vid in *.mkv; do ffmpeg -i "$vid" -vn -acodec copy "${vid%.mkv}.wav"; done
```

```sh
for flac in *.flac; do bs1770gain --codec=flac --suffix=flac "$flac" --overwrite
```

```sh
unzip -p NOOBS_v3_2_0.zip | sudo dd of=/dev/mmcblk0 bs=4M status=progress conv=fsync
```


for i in *; do echo $i && sox $i -n --norm -R gain 0.1 2>&1; done 

@sed
```sh
# remove spaces at the beginning of a line
sed -e 's/^[[:space:]]*//'
```


