---
layout: note
title: few shot questions using langchain
subtitle: 
category: LLM
tags:
  - ruby
  - data-set
links: 
permalink:
---

```ruby
#!/usr/bin/env ruby
require 'ruby/openai'
require 'logging'
require 'langchain'

def something(var, var*)
  
end

LANGCHAIN = Langchain::LLM::OpenAI.new(api_key: ENV["OPENAI_API_KEY"])

# Here are some questions an "agent" might ask itself while responding to a troubleshooting query:
questions = <<~TEXT
Is the buffer size set too small, resulting in too frequent interrupts and high CPU usage that could cause audio glitches?
Is the interrupt period too long, resulting in delays processing audio data that could cause distortions?
Are interrupts being missed or taking too long to process, failing to fill audio buffers smoothly?
Is the output buffer not being filled fast enough leading to intermittent empty buffers?
Is the capture buffer overflowing because it can't be emptied quickly enough?
Is the sample rate mismatch between capture and output causing buffer overflows or underflows?
Are incompatible audio formats resulting in distorted samples in the buffers?
Is simultaneous input and output causing buffer conflicts?
Are interrupts or threads being preempted leading to audio discontinuities?
Are buffers experiencing underruns or overruns due to CPU overload?
Is buffer processing code containing bugs that corrupt the audio samples?
Are audio samples getting clipped or wrapped due to improper buffer management?
Are buffers picking up noise or interference that gets played out?
Are there memory issues like leaks or fragmentation related to the audio buffers?
Is speaker or headphone wiring causing distorted output?
Is the gain set improperly at any point in the audio circuitry?
TEXT

example_query = <<~TEXT
There is no sound coming from the speakers. I am running ubuntu with jack2-dbus,
I have tried restarting the jack server, and I have also tried connecting a pair of headphones to the audio output and still no sound.
Here is the output of the jack_check command:

Jack server is running.
Jack server is ready.
Jack server is using the following audio device:
Device #0: hw:1,0: Audio device (hw:1,0)
Jack server is using the following MIDI device:
Device #0: hw:1,0: MIDI device (hw:1,0)
No MIDI devices are currently connected.
No audio devices are currently connected.

And here is the output of the aplay -l command:

**** List of PLAYBACK Hardware Devices ****
card 0: HDAudio [HDAudio], device 0: ALC892 Analog [ALC892 Analog]
Subdevices: 0/1
Subdevice #0: subdevice #0
card 0: HDAudio [HDAudio], device 1: ALC892 Digital [ALC892 Digital]
Subdevices: 1/1
Subdevice #0: subdevice #0
card 1: USB [USB], device 0: USB Audio [USB Audio]
Subdevices: 0/1
Subdevice #0: subdevice #0

I have also tried using aplay to play a file and it works fine.
I have no idea what is going on, any help would be greatly appreciated.
Edit:
I have also tried using jack_ Audio_Route_Add to add a route for the system audio and it does not work.
TEXT

example_response = <<~TEXT
What audio interface/hardware are you using in your setup?
Did sound work previously and this is a new issue, or is this a fresh setup that has never worked? If it worked before, what changed since then?
Are you trying to get sound from Jack applications only, or system-wide audio?
Can you provide the exact jackd command you are using to start the Jack server?
Does the application you're trying to use audio with show levels metering as if sound is playing?
If you run fuser -v /dev/snd/*, do you see any processes listed as accessing the sound card? A listing would confirm something is using the device.
TEXT

example_query02 = <<~TEXT
I've just installed AVlinux. After about 30 seconds of recording some midi tracks reaper, the sound starts crackling. The hardware should be sufficient and reaper doesn't show any particularly high usage.
TEXT

example_response02 = <<~TEXT
The Buffer size is the size of both the Capture buffer and the Output buffer. Hence, it is also the size of the block of audio data that will be processed at every interrupt.

The Interrupt period is the average time duration between two successive interrupts from the audio hardware device. The Interrupt period is dependent on the Buffer size. If larger buffer sizes are used then a large chunk is processed at each interrupt. Thus, lesser number of interrupts are needed in a given period of time.

In order to optimize the performance of the audio system, a smaller buffer size is generally preferred. This is because smaller buffer sizes result in less CPU usage. However, there is a trade-off between buffer size and CPU usage. If the buffer size is too small, there will be more frequent interrupts resulting in higher CPU usage. This is because, for every interrupt, the CPU has to stop its current task and process the interrupt.
TEXT


prompt = Langchain::Prompt::FewShotPromptTemplate.new(
  prefix: "Troubleshoot the given query. When figuring out the solution, ask yourself these questions: {questions} Then formulate questions most relevant to the query.",
  suffix: "Input: {query}\nOutput:",
  example_prompt: Langchain::Prompt::PromptTemplate.new(
    input_variables: ["input", "output"],
    template: "Input: {input}\nOutput: {output}"
  ),
  examples: [
    { "input": example_query, "output": example_response },
    { "input": example_query02, "output": example_response02 }
  ],
   input_variables: ["questions", "query"]
)

res = LANGCHAIN.complete(prompt: prompt.format(questions: questions, query: "The audio is cracking when it wasn't yesterday, what period and buffer settings would you recommend for this system?"))

```

Here are some thoughtful troubleshooting questions based on the information provided:



Hopefully these give you some new angles to explore in troubleshooting your no audio issue. Let me know if you have any other details I can use to speculate further.