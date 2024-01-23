---
---

### Wednesday 25/01/2023 23:20

```sh
rvm pkg install openssl

export CFLAGS="-ffast-math -msse -msse2 -mfpmath=sse -fPIC"
export MAKEFLAGS="-ffast-math -msse -msse2 -mfpmath=sse -fPIC"


rvm install 2.6.10 --with-openssl-dir=$HOME/.rvm/usr
rvm install 3.2.0 --with-openssl-dir=$HOME/.rvm/usr

```

