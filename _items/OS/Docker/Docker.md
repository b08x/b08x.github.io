---
tags: []
---
## Index
- [[Reducing Docker Image Size]]



[using extension fields to reuse variables](https://docs.docker.com/compose/compose-file/compose-file-v3/#extension-fields)

[dockerfile multi-stage build](https://docs.docker.com/build/building/multi-stage/)

### configuring a macvlan0
For the purposes of settig up a container that functionality acts the same as if a kvm virtual machine was configured to use a bridged networked interface. 

```bash

docker network create -d macvlan \
    --subnet=192.168.41.0./24 --gateway=192.168.41.1 \
    --ip-range 192.168.41.37/28 \
    -o parent=eth0 \
    --aux-address="myserver=" \
    macvlan0

```


## create macvlan connection
#linux #networking #networkmanager

Create the macvlan connection using `nmcli`

```bash
sudo nmcli connection edit
```

```
nmcli> set macvlan.parent eno1
nmcli> set macvlan.mode bridge
nmcli> set ipv4.addresses 192.168.41.40/28
nmcli> set connection.interface-name shim
nmcli> save
nmcli> activate
```

## open up the required ports
#linux #firewalld

```bash
sudo firewall-cmd --add-service=dns --permenant
sudo firewall-cmd --add-service=dhcp --permenant
sudo firewall-cmd --add-service=http --permenant
sudo firewall-cmd --add-service=https --permenant
sudo firewall-cmd --reload
```

## create docker network
#docker #networking 

```bash
docker network create -d macvlan -o parent=eno1 \
--subnet 192.168.41.0/24 --gateway 192.168.41.1 \
--ip-range 192.168.41.40/28 \
--aux-address 'host=192.168.41.40' \
macvlan0
```

## create docker-compose file
#docker

```yaml
---
version: '3.8'

services:
  pihole:
    container_name: pihole-container
    image: pihole/pihole:latest # check the latest version on docker hub.
    hostname: pihole # set an easy hostname to remember
    domainname: syncopated.net # your local domain name
    mac_address: de:ad:be:ef:ff:01 # can change or leave this??
    cap_add:
      - NET_ADMIN
    networks:
      macvlan0: # same as network specified below
        ipv4_address: 192.168.41.41 # the IP of the pihole container
    dns:
      - 127.0.0.1 # use local DNS, since the pihole
      - 8.8.8.8 # optional fallback DNS
    volumes: # mount our data volumes.
       - './etc-pihole/:/etc/pihole/'
       - './etc-dnsmasq.d/:/etc/dnsmasq.d/'
       - './backups/:/backups/' # backups explained later
    environment: # set variables for pihole configuration.
      ServerIP: 192.168.41.41 # must match ipv4_address above
      VIRTUAL_HOST: pihole.syncopated.net  # Must be hostname + domainname from above
      WEBPASSWORD: "randompassword"
      TZ: 'America/New_York' # pick your timezone
    restart: unless-stopped

networks:
  macvlan0:
    external: true

```




---
