---
---

```
To determine the optimal frames per period for achieving the lowest latency, you need to consider both the number of periods and the sample rate.

In this case, if the number of periods of playback latency is 2 and the sample rate is 48000, you can calculate the optimal frames per period using the following formula:

Optimal Frames Per Period = (Sample Rate / Number of Periods) / Playback Latency

Substituting in your values:

Optimal Frames Per Period = (48000 / 2) / 2
                         = 24000 / 2
                         = 12000

Therefore, setting a value of 12000 as frames per period should help achieve lower latency in this scenario. However, please note that actual optimal settings may vary depending on your specific system and hardware configuration. It's recommended to experiment with different values to find what works best for your setup.
```



```
To calculate the optimal frames per period for achieving the lowest latency, you need to consider the formula:

Latency (in seconds) = (Frames per Period - 1) * Number of Periods / Sample Rate

Given that the number of periods is 2 and the sample rate is 48000, we can substitute these values into the formula:

Latency = (Frames per Period - 1) * 2 / 48000

To achieve the lowest latency, you want to minimize the value of Frames per Period. However, it's important to note that setting a very low value may result in audio dropouts or other performance issues if your system cannot handle it.

A common approach is to start with a conservative value like 128 frames per period and gradually decrease it until you find a balance between low latency and stable performance. You can use trial and error to find an optimal value based on your specific hardware and software setup.
```