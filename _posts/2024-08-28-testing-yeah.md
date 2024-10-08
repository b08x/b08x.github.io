---
layout: "post"
title: "Testing yeah"
date: "2024-08-28 11:57"
---


```bash
│Oct 10 17:01:56.162978 tinybot qpdfview.desktop[72746]: libGL error: glx: failed to create dri3 screen                                                                                                            │
│Oct 10 17:01:56.162978 tinybot qpdfview.desktop[72746]: libGL error: failed to load driver: i915                                                                                                                  │
│Oct 10 17:01:56.167109 tinybot qpdfview.desktop[72746]: libGL error: glx: failed to create dri2 screen                                                                                                            │
│Oct 10 17:01:56.167109 tinybot qpdfview.desktop[72746]: libGL error: failed to load driver: i915
```

[fix for: intel(0): Failed to submit rendering commands (Invalid argument), disabling acceleration.](https://forums.gentoo.org/viewtopic-t-1145306-start-0.html)

xorg.conf four displays
-----------------------

libGL error: MESA-LOADER: failed to open i965: /usr/lib/dri/i965_dri.so: cannot open shared object file: No such file or directory (search paths /usr/lib/dri, suffix _dri)

sudo pacman -F /usr/lib/dri/i965_dri.so
usr/lib/dri/i965_dri.so is owned by extra/mesa-amber 21.3.9-1

[description](https://access.redhat.com/discussions/1144733)
[description](https://wiki.archlinux.org/title/multihead)

---

[description](https://unix.stackexchange.com/a/569807/483352)

```sh
Section "Device"
    Identifier "intel0"
    Driver "intel"
    Option "ZaphodHeads" "VGA1,HDMI1,DP1"
    Screen 0
EndSection

Section "Device"
    Identifier "intel1"
    Driver "intel"
    Option "ZaphodHeads" "HDMI3"
    Screen 1
EndSection
```


## Troubleshooting Multi-Display Issues with Intel Graphics on Linux

This appears to be a classic case of multi-display configuration issues with Intel graphics drivers on Linux. The errors you're encountering point to problems with driver loading and screen creation, particularly in the context of using multiple displays.

Let's break down the problem and formulate a solution:

**Understanding the Errors:**

* **"libGL error: glx: failed to create dri3/dri2 screen" & "libGL error: failed to load driver: i915"**: These errors indicate that the system is having trouble initializing the OpenGL library and loading the appropriate Intel graphics driver (i915). This is often caused by incorrect driver installation, conflicting driver versions, or misconfigured Xorg settings.
* **"MESA-LOADER: failed to open i965: /usr/lib/dri/i965_dri.so: cannot open shared object file: No such file or directory"**: This error explicitly states that the required driver file (i965_dri.so) is missing. While your system might be using a different Intel GPU model, this error still points to a potential mismatch between installed drivers and the required ones.

**Solution Approach:**

1. **Driver Verification & Installation:**
    * **Identify Your GPU:** Run `lspci | grep VGA` to determine the exact model of your Intel GPU.
    * **Install Correct Drivers:** Ensure you have the correct drivers installed for your specific GPU model. Use your distribution's package manager (e.g., `apt`, `dnf`, `pacman`) to install the appropriate `xf86-video-intel` package and any additional mesa packages related to your GPU.
    * **Update Drivers (If Necessary):** Outdated drivers can also cause issues. Update your system and graphics drivers to the latest available versions.

2. **Xorg Configuration:**
    * **Analyze Existing Configuration:** Examine your existing `/etc/X11/xorg.conf` file (if it exists). Look for any misconfigurations related to your displays, particularly the "Screen" and "Device" sections.
    * **ZaphodHeads Configuration:** The provided snippet using `ZaphodHeads` is one approach to configure multiple displays. However, it's crucial to ensure the identifiers (e.g., "VGA1", "HDMI1") and screen numbers correctly match your hardware setup.
    * **Alternative Configuration:** Consider using a display manager like xrandr for more dynamic configuration. You can use `xrandr --listproviders` to identify available display outputs and `xrandr` with various options to configure resolutions, orientations, and positions of your displays.

3. **Troubleshooting & Optimization:**
    * **Log Analysis:** Review system logs (e.g., `/var/log/Xorg.0.log`) for more detailed error messages that can pinpoint the issue.
    * **Single Display Test:** Try booting with only one display connected to isolate if the issue is specific to multi-display setups.
    * **Hardware Acceleration:** In some cases, disabling hardware acceleration might temporarily resolve the issue. However, this is not ideal for long-term use.

**Code Snippet Example (xrandr):**

```bash
# Identify display outputs
xrandr --listproviders

# Example configuration (adjust based on your outputs)
xrandr --output HDMI-1 --mode 1920x1080 --pos 0x0 --primary
xrandr --output DP-1 --mode 1920x1080 --pos 1920x0 --right-of HDMI-1
```

**Remember:**

* Back up your `/etc/X11/xorg.conf` file before making any changes.
* Reboot your system after making driver or configuration changes.
* Consult the Arch Linux and Gentoo wikis for detailed information on multihead setups and Intel graphics configuration.

By systematically addressing these points, you should be able to resolve the multi-display issues and achieve a stable configuration.
