---
---



installing self signed crt
--------------------------

# first we generate a self signed certificate for domain foo

```openssl req -new -newkey rsa:4096 -x509 -sha256 -days 365 -nodes \
-out foo.crt -keyout foo.key -subj "/CN=foo.com"
```
# then add it to the system wide ca store
[description](https://wiki.archlinux.org/index.php/User:Grawity/Adding_a_trusted_CA_certificate)
```sudo trust anchor --store foo.crt```

```sudo update-ca-trust```


using darkhttpd and socat to serve https to a given directory on bender
-----------------------------------------------------------------------
[description](https://ixday.github.io/post/simple_https/)


# start a simple http server, here darkhttpd to serve some directory
darkhttpd Library/ --port 8080 --daemon

# now start your socat proxy
sudo socat "ssl-l:443,cert=foo.crt,key=foo.key,verify=0,fork,reuseaddr" \
'tcp4:0.0.0.0:8080'



