---
layout: note
title: Package Building
subtitle: 
category:
  - OS
  - Linux
tags:
  - archlinux
links:
---


#archlinux #ansible #syncopatedIaC 


```bash

git clone https://github.com/b08x/syncopatedRepo.git

export GPG="<gpgkey>"
export MIRRORS=('host1.domain.net', 'host2.domain.net')

#TODO: create .env file for directory locations...

```

[archwiki building in a clean chroot](https://wiki.archlinux.org/title/DeveloperWiki:Building_in_a_clean_chroot)

[makepkg.conf gist](https://gist.github.com/lazerl0rd/60ba5b662d3d7afe1e279d6c599f28f2)

[arch native compiling](https://github.com/SoongVilda/archilinux_native_compiling)

q: what is the difference...

```diff
-CFLAGS="-march=x86-64-v3 -mtune=generic -O3 -pipe -fno-plt -fexceptions \
+CFLAGS="-march=native -O3 -pipe -fno-plt -fexceptions \
```

a: > GCC can automatically detect and enable safe architecture-specific optimizations. To use this feature, first remove any `-march` and `-mtune` flags, then add `-march=native`. 


# Prerequisites

1. **Install `devtools` and `repoctl`**
   - Use the following command to install both tools using `pacman`:
     ```bash
paru -S devtools repoctl
     ```

2. **Configuration Setup**
   - Navigate to the folder containing the `PKGBUILD`.
   - Adjust the configuration files:
     - Modify `/usr/share/devtools/pacman.conf.d/$pacman.conf` by adding necessary repositories.
     - Edit `/usr/share/devtools/makepkg.conf.d/$makepkg.conf` to include additional flags, define locations for package output, logs, and GPG key signing options.

3. **Create tmpfs Mount**
   - Set up a temporary filesystem mount for the build process (command details to be provided).
	   
	   `export CHROOT="/mnt/chroots/arch"`
	   `sudo mount --mkdir -t tmpfs -o defaults,size=8G tmpfs $CHROOT`

# Build Steps

4. **Building the Package**
   - Execute commands for building the package within the configured environment.
	
		`extra-x86_64-build -c -r $CHROOT`

5. **Creating a Repository**

	https://github.com/cassava/repoctl?tab=readme-ov-file

   - Utilize `repoctl` for repository management:
     1. In the repository folder, initialize it with:
        ```
        repoctl conf new ~/Workspace/syncopatedOS/repository/archlinux/x86_64/syncopated.db.tar.zst
        ```

     2. Reset repository settings using:
        ```
        repoctl reset
        ```

6. **Adding Packages to Repository**
   - To add a package to the repository, use:
     ```
     repoctl add <package_name>
     ```

These steps outline the prerequisites and build process involved in generating packages and managing repositories.

## when faced with the error the package already exists in the repository

https://wiki.archlinux.org/title/Arch_build_system#Preserve_modified_packages


> [!ai]+ AI
>
> Title: Constructing Packages: A Comprehensive Guide
> Embark on a journey into the realm of package building, where we'll explore the intricacies of crafting software packages for Arch Linux.
> # Prerequisites
> 1. **Installing Essential Tools:**
> - Summon the `devtools` and `repoctl` packages using `pacman`:
> ```bash
> paru -S devtools repoctl
> ```
> - These tools are the gatekeepers to the world of package building.
> 2. **Configuring the Environment:**
> - Venture into the folder housing the `PKGBUILD` file.
> - Modify configuration files to suit your needs:
> - Adjust `/usr/share/devtools/pacman.conf.d/$pacman.conf` to embrace necessary repositories.
> - Craft `/usr/share/devtools/makepkg.conf.d/$makepkg.conf` to include additional flags, define package output locations, log destinations, and GPG key signing options.
> 3. **Creating a Temporary Filesystem Mount:**
> - Establish a temporary filesystem mount for the build process (command details forthcoming).
> - This mount serves as the sandbox for your package-building endeavors.
> # Building Steps
> 4. **Constructing the Package:**
> - Execute commands to build the package within the configured environment.
> - Witness the transformation of source code into a distributable package.
> 5. **Establishing a Repository:**
> - Harness the power of `repoctl` for repository management:
> 1. In the repository folder, initialize it with:
> ```
> repoctl conf new ~/Workspace/syncopatedOS/repository/archlinux/x86_64/syncopated.db.tar.zst
> ```
> 2. Reset repository settings using:
> ```
> repoctl reset
> ```
> - Consider this repository as your personal software vault.
> 6. **Enriching the Repository with Packages:**
> - To bestow a package upon the repository, invoke:
> ```
> repoctl add <package_name>
> ```
> - Each package added is a valuable contribution to your software collection.
> These steps provide a comprehensive guide to package building and repository management, empowering you to create and share your software creations with the world.
