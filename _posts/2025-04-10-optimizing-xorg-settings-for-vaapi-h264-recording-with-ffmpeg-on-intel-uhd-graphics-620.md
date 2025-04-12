---
layout: post
title: "Optimizing Xorg Settings for Vaapi H264 Recording with Ffmpeg on Intel Uhd Graphics 620"
date: 2025-04-10 07:28:14 -0400
category:
tags:
  - Linux
  - Xorg
  - FFmpeg
  - Hardware-Acceleration
  - Intel-UHD-Graphics-620
  - VAAPI
  - Video-Encoding
description: "something"
toc:
  beginning: true
pretty_table: true
giscus_comments: true
---

# 1. Introduction: Leveraging GPU Acceleration for Video Encoding

The demand for efficient video recording on Linux systems has led to an increased focus on utilizing the power of dedicated graphics processing units (GPUs) for tasks traditionally handled by the central processing unit (CPU). This process, known as hardware acceleration, offers significant advantages, including reduced CPU utilization, faster encoding times, and potentially lower power consumption, resulting in a smoother and more responsive overall system experience, particularly during resource-intensive activities such as video recording[^1]

The Video Acceleration API (VAAPI) serves as a crucial open-source library and API specification that enables applications like FFmpeg to tap into the hardware-accelerated video encoding and decoding capabilities of the GPU[^4] By offloading these computationally intensive tasks to the specialized hardware on the graphics card, users can achieve substantial performance gains. This report focuses on configuring the Xorg display server environment to effectively utilize VAAPI for hardware-accelerated H264 video recording using FFmpeg on a system equipped with an Intel UHD Graphics 620 integrated GPU. While VAAPI operates at a lower level, the configuration of the Xorg server plays a vital role in ensuring the Intel graphics driver interacts optimally with the system and applications, thereby influencing the stability and performance of VAAPI.

# 2. Understanding VAAPI and Intel UHD Graphics 620: Driver Selection and Capabilities

To effectively leverage VAAPI for hardware acceleration on a system with Intel UHD Graphics 620, selecting and correctly installing the appropriate driver is paramount. Intel primarily provides two VAAPI drivers for Linux: `libva-intel-driver` (often referred to as i965) and `intel-media-driver` (known as ind)[^4] Determining which driver is best suited for the Intel UHD Graphics 620 is a critical first step.

Generally, for Intel GPUs based on the Broadwell architecture (5th generation Core processors) and newer, including the UHD Graphics 620, the `intel-media-driver` is the recommended choice[^6] Research indicates that Intel has strategically shifted towards the `intel-media-driver` for more contemporary hardware, suggesting potential improvements in encoding efficiency and broader support for modern video standards compared to the older `libva-intel-driver`[^6] While the `libva-intel-driver` might still function with the UHD Graphics 620, it is primarily intended for pre-Broadwell legacy GPUs 6 and GPUs up to the Coffee Lake generation[^8] Therefore, for optimal performance and access to the latest encoding features on the Intel UHD Graphics 620, the `intel-media-driver` (iHD) is the preferred option.

On an Arch Linux system, the presence of the `intel-media-driver` can be checked using the command `pacman -Q intel-media-driver`. If the driver is not installed, it can be installed using the command: `sudo pacman -S intel-media-driver`[^4]

Once the driver is installed, it is essential to verify that VAAPI is functioning correctly. The `libva-utils` package, which includes the `vainfo` tool, is invaluable for this purpose[^4] This package can be installed using the command: `sudo pacman -S libva-utils`[^4] After installation, running the `vainfo` command will provide information about the VAAPI implementation on the system. The output should confirm that the `iHD_drv_video.so` driver is loaded, indicating that the `intel-media-driver` is being used. Furthermore, the output should list the supported VAAPI profiles, and the presence of `VAEntrypointEncSlice` for H264 confirms that the GPU advertises hardware-accelerated H264 encoding capabilities[^4] In situations where the driver is not automatically detected, explicitly specifying the driver name using the environment variable `LIBVA_DRIVER_NAME=iHD vainfo` might be necessary[^4] The successful execution of `vainfo` with the correct driver and H264 encoding support signifies that the VAAPI stack is properly configured to utilize the Intel UHD Graphics 620 for hardware acceleration.

The Intel UHD Graphics 620 is categorized as a "Mainstream" integrated GPU and demonstrates the capability for HEVC 10-bit transcoding[^6] This suggests that H264 encoding, a less demanding task, should also be well-supported by this hardware. While specific details regarding the supported H264 profiles (such as Baseline, Main, or High) for the UHD Graphics 620 are not exhaustively detailed in the provided material, the general support for H264 encoding via VAAPI is evident[^15]

# 3. Configuring Xorg for Optimal Video Performance: Relevant `xorg.conf` Options for Intel Graphics

The Xorg display server, while not directly configuring VAAPI, plays a crucial role in how the Intel graphics driver interacts with the system. Creating or modifying the `xorg.conf` file, or using configuration snippets located in the `/etc/X11/xorg.conf.d/` directory, allows for customization of the X server's behavior[^18] Several options within the `Device` section of these configuration files can influence video performance and stability, which can indirectly impact the effectiveness of VAAPI.

The fundamental options within the `Device` section for Intel graphics include specifying the driver and an identifier. The line `Driver "intel"` is essential to instruct Xorg to use the Intel graphics driver[^18] Similarly, the `Identifier "Intel Graphics"` (or a comparable identifier) serves to name and reference this specific device configuration[^18]

The acceleration method used by the Intel driver can also impact performance. Two primary methods are available: `sna` (SandyBridge New Acceleration) and `uxa` (Unified Acceleration Architecture)[^18] For newer hardware like the UHD Graphics 620, `sna` is the default and generally recommended method[^20] However, in certain scenarios, particularly if visual artifacts such as pixelated graphics are encountered during video recording or playback, switching to the more mature `uxa` method might improve stability or compatibility[^18] The choice between these methods often represents a balance between modern optimizations and potential legacy compatibility.

The Direct Rendering Infrastructure (DRI) enables applications to directly access the graphics hardware for accelerated rendering[^2] For Intel GPUs starting from the Broadwell generation, including the UHD Graphics 620, it is recommended to use `Option "DRI" "iris"`[^18] This option ensures that the more modern `iris` Mesa driver is utilized, which is specifically designed for newer Intel architectures and can lead to improved performance and stability in graphics-intensive tasks like video recording. As a troubleshooting step, if issues arise with the default DRI3, using `Option "DRI" "2"` might resolve certain problems[^18]

Screen tearing, a visual artifact that can occur during video playback and potentially recording, can often be mitigated by enabling the `TearFree` option using `Option "TearFree" "true"`[^18] Notably, for Intel UHD 620 and 630 GPUs, research suggests that it might also be necessary to include `Option "TripleBuffer" "true"` for the `TearFree` functionality to operate correctly[^18] This likely relates to specific hardware or driver-level mechanisms for synchronizing rendering with the display.

Other options like `SwapbuffersWait` 18 and various power-related settings exist within the Xorg configuration; however, modifying these without a clear understanding of their implications is generally not advised.

To apply these configuration options, a file such as `/etc/X11/xorg.conf.d/20-intel.conf` can be created or edited. Within this file, a `Section "Device"` block should be added, containing the `Identifier`, `Driver`, and desired `Option` lines[^18]

# 4. Enabling VAAPI in the Xorg Environment: Driver Loading and Configuration

The process of enabling VAAPI within the Xorg environment primarily relies on the correct installation of the appropriate VAAPI driver for the Intel UHD Graphics 620. Typically, the VAAPI driver is loaded automatically by the Linux kernel and the Xorg server upon system startup, provided the necessary packages, such as `intel-media-driver`, are installed[^4]

It is important to note that there is no dedicated section within the `xorg.conf` file specifically for configuring VAAPI. Instead, VAAPI's functionality is largely managed through the installed drivers and, in some cases, environment variables[^4] As previously mentioned, if there are issues with the automatic detection of the `intel-media-driver`, the environment variable `LIBVA_DRIVER_NAME=iHD` can be used to explicitly specify the driver to be used[^4] This variable can be set either globally (e.g., in `~/.bashrc`) or specifically before running an application like FFmpeg. The fundamental requirement for VAAPI support within the Xorg environment remains the correct installation of the `intel-media-driver` package[^4]

# 5. Using FFmpeg with VAAPI for H264 Encoding: Command Syntax and Parameter Explanation

Before attempting to use VAAPI with FFmpeg, it is prudent to verify that the FFmpeg build on the system includes VAAPI support. This can be done by running the command `ffmpeg -hwaccels` in the terminal. The output should list `vaapi` among the supported hardware acceleration methods[^24]

The basic structure of an FFmpeg command for encoding video using VAAPI with the H264 codec typically follows this format 15:

```shell
ffmpeg -vaapi_device /dev/dri/renderD128 -i input.mp4 -vf 'format=nv12,hwupload' -c:v h264_vaapi output.mp4
```

Let's break down the key components of this command:

- `-vaapi_device /dev/dri/renderD128`: This option specifies the VAAPI device that FFmpeg should use for hardware acceleration. The path `/dev/dri/renderD128` is a common location for the DRM (Direct Rendering Manager) render node associated with the primary graphics device, but this path might vary depending on the system configuration[^15] This device node serves as the interface through which FFmpeg interacts with the VAAPI driver for the Intel GPU.
- `-i input.mp4`: This standard FFmpeg option indicates the input video file that needs to be encoded[^15]
- `-vf 'format=nv12,hwupload'`: This option applies a chain of video filters.
  - `format=nv12`: The `nv12` pixel format is a common YUV 4:2:0 semi-planar format that is often preferred by hardware encoders for its efficient representation of color information[^15] Converting the input to this format ensures compatibility with the VAAPI encoder and can optimize encoding efficiency.
  - `hwupload`: This filter is crucial for hardware acceleration as it uploads the video frames from the system's main memory (RAM) to the dedicated video memory of the GPU[^15] Hardware encoders operate on data residing within the GPU's memory, so this step is essential to leverage the Intel UHD Graphics 620's encoding capabilities.
- `-c:v h264_vaapi`: This option explicitly selects the hardware-accelerated H264 encoder provided by the VAAPI implementation[^15] This tells FFmpeg to utilize the GPU's dedicated hardware for encoding the video into the H264 format.
- `output.mp4`: This specifies the name of the output file where the encoded video will be saved[^15]

In addition to these fundamental options, several optional parameters can be used to control the encoding quality and performance:

- `-qp <value>`: The Constant Quantization Parameter (QP) controls the quality of the encoded video. Lower QP values result in higher quality but also larger file sizes. A suggested range for good quality is typically between 15 and 25.25 Using a constant QP allows for consistent quality throughout the video.
- `-b:v <bitrate>`: This option allows setting a target bitrate for the encoded video[^17]
- `-profile:v <profile>`: The H264 profile (e.g., baseline, main, high) can be specified using this option to ensure compatibility with various playback devices[^16]
- While less common for VAAPI encoders compared to software encoders like libx264, some VAAPI implementations might support presets to control the trade-off between encoding speed and quality.

Two-pass encoding, a technique used to potentially achieve better quality at a given bitrate, might also be supported by the `h264_vaapi` encoder in some implementations[^17]

# 6. Step-by-Step Guide for Arch Linux: Driver Installation and VAAPI Verification

For users on Arch Linux with an Intel UHD Graphics 620, the following steps provide a practical guide to setting up VAAPI for H264 encoding with FFmpeg:

1. **Install `intel-media-driver`:** Open a terminal and run: `sudo pacman -S intel-media-driver`[^4]
2. **Install `libva-utils`:** Install the `vainfo` utility: `sudo pacman -S libva-utils`[^4]
3. **Verify VAAPI:** Run the `vainfo` command: `vainfo`. Examine the output to confirm that `iHD_drv_video.so` is loaded and that `VAEntrypointEncSlice` is listed for H264.4 If the initial command fails, try explicitly specifying the driver: `LIBVA_DRIVER_NAME=iHD vainfo`[^4]
4. **Optional: Create Xorg Configuration Snippet:** For potentially improved video performance and to address potential issues like screen tearing, create a file named `20-intel.conf` in the `/etc/X11/xorg.conf.d/` directory: `sudo nano /etc/X11/xorg.conf.d/20-intel.conf`. Add the following content as a starting point. Users can experiment with these options to find the best configuration for their specific needs:

   ```shell
   Section "Device"
     Identifier "Intel Graphics"
     Driver "intel"
     Option "AccelMethod" "sna"
     Option "DRI" "iris"
     Option "TearFree" "true"
     Option "TripleBuffer" "true"
   EndSection
   ```

5. **Test FFmpeg Encoding:** Encode a sample video file using a basic FFmpeg command to verify that hardware acceleration is being utilized. Monitor the CPU usage during the encoding process; a significant reduction compared to software encoding would indicate that the GPU is being used[^1] A basic command to test could be:

   ```shell
   ffmpeg -vaapi_device /dev/dri/renderD128 -i input.mp4 -vf 'format=nv12,hwupload' -c:v h264_vaapi -qp 20 output.mp4
   ```

# 7. Troubleshooting Common Issues and Solutions: Addressing Potential Problems with VAAPI and Xorg

Setting up VAAPI for hardware acceleration can sometimes involve troubleshooting. Here are some common issues that might arise and their potential solutions:

- **VAAPI Initialization Errors (`vaInitialize failed`, `va_openDriver() returns -1`):** This often indicates that the correct VAAPI driver is not being loaded[^26] Ensure that the `intel-media-driver` package is installed. Try explicitly setting the `LIBVA_DRIVER_NAME` environment variable to `iHD` before running applications that use VAAPI or when using `vainfo`[^4] Also, verify that the user has the necessary permissions to access the `/dev/dri/renderD128` device node, typically by ensuring the user is a member of the `video` group[^2] In some cases, interference from the Wayland display server might cause issues, although this is less likely to affect `vainfo` directly.
- **Screen Tearing:** If screen tearing occurs during video playback or recording, ensure that the `Option "TearFree" "true"` is enabled in the Xorg configuration. For Intel UHD 620/630, also try adding `Option "TripleBuffer" "true"`[^18] Experimenting with different `AccelMethod` options (`sna` or `uxa`) might also help in some situations.
- **Poor Encoding Performance or Errors with FFmpeg:** If FFmpeg encoding performance is not as expected or errors occur, verify that the `-vf 'format=nv12,hwupload'` options are included in the command[^15] Ensure that the input video's H264 profile is supported by the hardware encoder; trying different `-profile:v` options or lowering the encoding quality might be necessary[^16] Issues with specific input video codecs or formats might also arise[^24] Testing with different input files can help isolate these problems. If the `-hwaccel vaapi` option is used with FFmpeg for decoding, ensure that the input video is indeed decodable with hardware acceleration.
- **Browser Issues with Hardware Acceleration:** While not the primary focus, users might encounter issues enabling VAAPI in web browsers like Firefox and Chromium. Various configuration flags and settings within the browser might need adjustment, as detailed in snippets.

# 8. Recommended Xorg Configuration and FFmpeg Command for Intel UHD Graphics 620: A Practical Guide

Based on the research and analysis, the following provides a practical starting point for configuring Xorg and using FFmpeg for hardware-accelerated H264 recording on a system with Intel UHD Graphics 620 running Arch Linux:

**Recommended `xorg.conf` Snippet (`/etc/X11/xorg.conf.d/20-intel.conf`):**

```shell
Section "Device"
  Identifier "Intel Graphics"
  Driver "intel"
  Option "AccelMethod" "sna"
  Option "DRI" "iris"
  Option "TearFree" "true"
  Option "TripleBuffer" "true"
EndSection
```

This configuration aims to provide a balance of performance and stability, addressing potential screen tearing issues. Users may need to adjust these options based on their specific experience and requirements.

**Recommended FFmpeg Command:**

```shell
ffmpeg -vaapi_device /dev/dri/renderD128 -i input.mp4 -vf 'format=nv12,hwupload' -c:v h264_vaapi -qp 20 output.mp4
```

This command provides a basic framework for encoding `input.mp4` to `output.mp4` using the hardware-accelerated H264 encoder with a constant quantization parameter of 20 for good quality. Users can experiment with the `-qp` value to adjust the quality and file size.

# 9. Conclusion: Benefits of Hardware Acceleration and Further Considerations

Utilizing VAAPI for H264 encoding with FFmpeg on Intel UHD Graphics 620 offers significant advantages in terms of reduced CPU load and faster processing, leading to a more efficient video recording workflow on Linux systems. Correctly installing the `intel-media-driver` and configuring Xorg with appropriate options are crucial steps in enabling this functionality.

It is advisable to keep the Intel graphics drivers and related packages updated to benefit from the latest performance improvements and bug fixes[^8] For more advanced VAAPI encoding options and filters within FFmpeg, users are encouraged to consult the official FFmpeg documentation[^15] While this report focused on VAAPI, users might also explore other hardware acceleration APIs like Intel Quick Sync Video (QSV) if they encounter limitations or seek alternative solutions[^6]

**Table 1: Intel VAAPI Driver Recommendations**

|                                     |                              |
| ----------------------------------- | ---------------------------- |
| **Intel GPU Series/Generation**     | **Recommended VAAPI Driver** |
| GMA 4500                            | `libva-intel-driver` (i965)  |
| HD Graphics up to Coffee Lake       | `libva-intel-driver` (i965)  |
| Broadwell and newer (e.g., UHD 620) | `intel-media-driver` (iHD)   |

**Table 2: Recommended `xorg.conf` Options for Intel UHD Graphics 620**

|                 |                       |                                                                                               |
| --------------- | --------------------- | --------------------------------------------------------------------------------------------- |
| **Option Name** | **Recommended Value** | **Explanation/Purpose**                                                                       |
| `Driver`        | `"intel"`             | Specifies the Intel graphics driver.                                                          |
| `Identifier`    | `"Intel Graphics"`    | Identifies this device configuration section.                                                 |
| `AccelMethod`   | `"sna"`               | Selects the SandyBridge New Acceleration method (generally recommended for newer Intel GPUs). |
| `DRI`           | `"iris"`              | Uses the modern `iris` Mesa driver for direct rendering.                                      |
| `TearFree`      | `"true"`              | Attempts to eliminate screen tearing.                                                         |
| `TripleBuffer`  | `"true"`              | May be necessary in conjunction with `TearFree` for UHD 620/630.                              |

**Table 3: Common FFmpeg VAAPI Encoding Options**

|                                     |                                                               |                                     |
| ----------------------------------- | ------------------------------------------------------------- | ----------------------------------- |
| **FFmpeg Option**                   | **Purpose**                                                   | **Example**                         |
| `-vaapi_device /dev/dri/renderD128` | Specifies the VAAPI device to use.                            | `-vaapi_device /dev/dri/renderD128` |
| `-i input.mp4`                      | Specifies the input video file.                               | `-i my_video.mp4`                   |
| `-vf format=nv12`                   | Converts the video to the `nv12` pixel format.                | `-vf format=nv12`                   |
| `-vf hwupload`                      | Uploads video frames to GPU memory.                           | `-vf hwupload`                      |
| `-c:v h264_vaapi`                   | Selects the hardware-accelerated H264 encoder.                | `-c:v h264_vaapi`                   |
| `-qp 20`                            | Sets the constant quantization parameter for quality control. | `-qp 18`                            |
| `-b:v 2M`                           | Sets the target bitrate to 2 Megabits per second.             | `-b:v 2M`                           |
| `-profile:v high`                   | Sets the H264 profile to High.                                | `-profile:v main`                   |

---

## Works Cited

[^1]: Need help to enable hardware acceleration on my laptop : r/archlinux - Reddit, accessed April 11, 2025, [https://www.reddit.com/r/archlinux/comments/1ao49kz/need_help_to_enable_hardware_acceleration_on_my/](https://www.reddit.com/r/archlinux/comments/1ao49kz/need_help_to_enable_hardware_acceleration_on_my/)
[^2]: Xorg/Hardware 3D acceleration guide - Gentoo Wiki, accessed April 11, 2025, [https://wiki.gentoo.org/wiki/Xorg/Hardware_3D_acceleration_guide](https://wiki.gentoo.org/wiki/Xorg/Hardware_3D_acceleration_guide)
[^3]: The Intel Media Driver for VAAPI... what is it for ? : r/Fedora - Reddit, accessed April 11, 2025, [https://www.reddit.com/r/Fedora/comments/1cgrubj/the_intel_media_driver_for_vaapi_what_is_it_for/](https://www.reddit.com/r/Fedora/comments/1cgrubj/the_intel_media_driver_for_vaapi_what_is_it_for/)
[^4]: Hardware video acceleration - ArchWiki, accessed April 11, 2025, [https://wiki.archlinux.org/title/Hardware_video_acceleration](https://wiki.archlinux.org/title/Hardware_video_acceleration)
[^5]: VAAPI (Video Acceleration API) - Intel, accessed April 11, 2025, [https://www.intel.com/content/www/us/en/developer/articles/technical/linuxmedia-vaapi.html](https://www.intel.com/content/www/us/en/developer/articles/technical/linuxmedia-vaapi.html)
[^6]: Intel GPU - Jellyfin, accessed April 11, 2025, [https://jellyfin.org/docs/general/administration/hardware-acceleration/intel/](https://jellyfin.org/docs/general/administration/hardware-acceleration/intel/)
[^7]: Intel UHD 620 - clarification needed - Kernel, boot, graphics & hardware - EndeavourOS, accessed April 11, 2025, [https://forum.endeavouros.com/t/intel-uhd-620-clarification-needed/20905](https://forum.endeavouros.com/t/intel-uhd-620-clarification-needed/20905)
[^8]: What VA-API driver for i3-7100? / Multimedia and Games / Arch Linux Forums, accessed April 11, 2025, [https://bbs.archlinux.org/viewtopic.php?id=281739](https://bbs.archlinux.org/viewtopic.php?id=281739)
[^9]: How to enable Hardware Acceleration for Intel drivers? : r/linux4noobs - Reddit, accessed April 11, 2025, [https://www.reddit.com/r/linux4noobs/comments/xhzwy8/how_to_enable_hardware_acceleration_for_intel/](https://www.reddit.com/r/linux4noobs/comments/xhzwy8/how_to_enable_hardware_acceleration_for_intel/)
[^10]: Intel Graphics - Best practices and settings for hardware acceleration? - Fedora Discussion, accessed April 11, 2025, [https://discussion.fedoraproject.org/t/intel-graphics-best-practices-and-settings-for-hardware-acceleration/69944](https://discussion.fedoraproject.org/t/intel-graphics-best-practices-and-settings-for-hardware-acceleration/69944)
[^11]: Firefox Hardware acceleration - Fedora Project Wiki, accessed April 11, 2025, [https://fedoraproject.org/wiki/Firefox_Hardware_acceleration](https://fedoraproject.org/wiki/Firefox_Hardware_acceleration)
[^12]: HardwareVideoAcceleration - Debian Wiki, accessed April 11, 2025, [https://wiki.debian.org/HardwareVideoAcceleration](https://wiki.debian.org/HardwareVideoAcceleration)
[^13]: elFarto/nvidia-vaapi-driver: A VA-API implemention using NVIDIA's NVDEC - GitHub, accessed April 11, 2025, [https://github.com/elFarto/nvidia-vaapi-driver](https://github.com/elFarto/nvidia-vaapi-driver)
[^14]: Hardware video acceleration in Web browsers - Linux Gaming wiki, accessed April 11, 2025, [https://linux-gaming.kwindu.eu/index.php?title=Hardware_video_acceleration_in_Web_browsers](https://linux-gaming.kwindu.eu/index.php?title=Hardware_video_acceleration_in_Web_browsers)
[^15]: Hardware/VAAPI – FFmpeg, accessed April 11, 2025, [https://trac.ffmpeg.org/wiki/Hardware/VAAPI](https://trac.ffmpeg.org/wiki/Hardware/VAAPI)
[^16]: ffmpeg: h264 hardware encoding : r/linuxquestions - Reddit, accessed April 11, 2025, [https://www.reddit.com/r/linuxquestions/comments/127ejym/ffmpeg_h264_hardware_encoding/](https://www.reddit.com/r/linuxquestions/comments/127ejym/ffmpeg_h264_hardware_encoding/)
[^17]: This gist contains instructions on setting up FFmpeg and Libav to use VAAPI-based hardware accelerated encoding (on supported platforms) for H[^264] (and H[^265] on supported hardware) video formats. · GitHub, accessed April 11, 2025, [https://gist.github.com/Brainiarc7/95c9338a737aa36d9bb2931bed379219](https://gist.github.com/Brainiarc7/95c9338a737aa36d9bb2931bed379219)
[^18]: Intel graphics - ArchWiki, accessed April 11, 2025, [https://wiki.archlinux.org/title/Intel_graphics](https://wiki.archlinux.org/title/Intel_graphics)
[^19]: Enabling Intel Video Acceleration On FreeBSD, accessed April 11, 2025, [https://forums.freebsd.org/threads/enabling-intel-video-acceleration-on-freebsd[^62120]/](https://forums.freebsd.org/threads/enabling-intel-video-acceleration-on-freebsd[^62120]/)
[^20]: How to fix video tearing in Linux (with Intel graphics) - Dedoimedo, accessed April 11, 2025, [https://www.dedoimedo.com/computers/linux-intel-graphics-video-tearing.html](https://www.dedoimedo.com/computers/linux-intel-graphics-video-tearing.html)
[^21]: Configure Xorg to use integrated Intel, not Nvidia - Ask Ubuntu, accessed April 11, 2025, [https://askubuntu.com/questions/1164654/configure-xorg-to-use-integrated-intel-not-nvidia](https://askubuntu.com/questions/1164654/configure-xorg-to-use-integrated-intel-not-nvidia)
[^22]: intel - X.Org, accessed April 11, 2025, [https://www.x.org/releases/X11R7.6-RC1/doc/man/man4/intel[^4].xhtml](https://www.x.org/releases/X11R7.6-RC1/doc/man/man4/intel[^4].xhtml)
[^23]: Intel - Poor graphics performance, frames dropped when playing videos, accessed April 11, 2025, [https://forum.manjaro.org/t/intel-poor-graphics-performance-frames-dropped-when-playing-videos/151652](https://forum.manjaro.org/t/intel-poor-graphics-performance-frames-dropped-when-playing-videos/151652)
[^24]: Getting FFMPEG to use VAAPI acceleration when decoding - Reddit, accessed April 11, 2025, [https://www.reddit.com/r/ffmpeg/comments/14fcmh5/getting_ffmpeg_to_use_vaapi_acceleration_when/](https://www.reddit.com/r/ffmpeg/comments/14fcmh5/getting_ffmpeg_to_use_vaapi_acceleration_when/)
[^25]: How to encode to HEVC using ffmpeg with VAAPI in order to get good video quality? (at reasonable bitrates) - Super User, accessed April 11, 2025, [https://superuser.com/questions/1684870/how-to-encode-to-hevc-using-ffmpeg-with-vaapi-in-order-to-get-good-video-quality](https://superuser.com/questions/1684870/how-to-encode-to-hevc-using-ffmpeg-with-vaapi-in-order-to-get-good-video-quality)
[^26]: Hardware video acceleration - ArchWiki, accessed April 11, 2025, [https://wiki.archlinux.org/title/Hardware_video_acceleration#Troubleshooting](https://wiki.archlinux.org/title/Hardware_video_acceleration#Troubleshooting)
[^27]: [SOLVED-ish] UHD 620 Xorg 30 FPS Video Issues / Multimedia and Games / Arch Linux Forums, accessed April 11, 2025, [https://bbs.archlinux.org/viewtopic.php?id=298983](https://bbs.archlinux.org/viewtopic.php?id=298983)
[^28]: [SOLVED] Firefox 99 breaks VAAPI / Applications & Desktop Environments / Arch Linux Forums, accessed April 11, 2025, [https://bbs.archlinux.org/viewtopic.php?id=275415](https://bbs.archlinux.org/viewtopic.php?id=275415)
[^29]: Tutorial: How to enable hardware video acceleration on Firefox and Chromium based browsers : r/linux - Reddit, accessed April 11, 2025, [https://www.reddit.com/r/linux/comments/xcikym/tutorial_how_to_enable_hardware_video/](https://www.reddit.com/r/linux/comments/xcikym/tutorial_how_to_enable_hardware_video/)
[^30]: chromium: hardware video acceleration with VA-API (Page 31) / Applications & Desktop Environments / Arch Linux Forums, accessed April 11, 2025, [https://bbs.archlinux.org/viewtopic.php?id=244031&p=31](https://bbs.archlinux.org/viewtopic.php?id=244031&p=31)
[^31]: VA-API HW Acceleartion not working on Firefox with Xorg : r/archlinux - Reddit, accessed April 11, 2025, [https://www.reddit.com/r/archlinux/comments/rsbm64/vaapi_hw_acceleartion_not_working_on_firefox_with/](https://www.reddit.com/r/archlinux/comments/rsbm64/vaapi_hw_acceleartion_not_working_on_firefox_with/)
[^32]: Intel discontinues VAAPI driver support for Haswell (2013) and older - antiX-forum, accessed April 11, 2025, [https://www.antixforum.com/forums/topic/intel-discontinues-vaapi-driver-support-for-haswell-2013-and-older/](https://www.antixforum.com/forums/topic/intel-discontinues-vaapi-driver-support-for-haswell-2013-and-older/)
[^33]: Encode/H[^264] – FFmpeg, accessed April 11, 2025, [https://trac.ffmpeg.org/wiki/Encode/H[^264]](https://trac.ffmpeg.org/wiki/Encode/H[^264])
[^34]: HWAccelIntro – FFmpeg, accessed April 11, 2025, [https://trac.ffmpeg.org/wiki/HWAccelIntro](https://trac.ffmpeg.org/wiki/HWAccelIntro)
