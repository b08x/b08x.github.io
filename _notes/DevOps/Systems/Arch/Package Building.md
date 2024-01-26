---
---
#archlinux #ansible #syncopatedIaC 

[archwiki building in a clean chroot](https://wiki.archlinux.org/title/DeveloperWiki:Building_in_a_clean_chroot)

what is the difference...

```diff
-CFLAGS="-march=x86-64-v3 -O3 -pipe -fno-plt -fexceptions \
+CFLAGS="-march=native -O3 -pipe -fno-plt -fexceptions \
```


# Prerequisites

1. **Install `devtools` and `repoctl`**
   - Use the following command to install both tools using `pacman`:
     ```bash
paru -S devtools repoctl
     ```

2. **Configuration Setup**
   - Navigate to the folder containing the `PKGBUILD`.
   - Adjust the configuration files:
     - Modify `/usr/share/devtools/pacman.conf` by adding necessary repositories.
     - Edit `/usr/share/devtools/makepkg.conf` to include additional flags, define locations for package output, logs, and GPG key signing options.

3. **Create tmpfs Mount**
   - Set up a temporary filesystem mount for the build process (command details to be provided).
	   
	   `export $CHROOT="/mnt/chroots/arch"`
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


## when faced with the error the package already exists in the repoistory

https://wiki.archlinux.org/title/Arch_build_system#Preserve_modified_packages

