---
---





## LMFLOW

### [Instruction Tuning](https://optimalscale.github.io/LMFlow/#instruction-tuning "Permalink to this heading")




Instruction Tuning is a technique used to improve the performance of language models by training them to follow natural language commands or instructions. This includes positive or negative examples, prompts, constraints, and other elements that are commonly found in human language. The main goal of instruction-tuning is to improve the model’s ability to perform well on multiple tasks and to generalize more effectively to new or unseen tasks. This is achieved by teaching the model to understand and incorporate various language cues and constraints that are relevant to the task at hand. Instruction-tuning is a powerful technique that is widely used in natural language processing, machine learning, and related areas. By improving the ability of language models to understand and follow natural language commands, this approach can help to unlock new levels of performance and productivity in a wide range of applications.

### fine tuning

https://georgesung.github.io/ai/qlora-ift/



[An open platform for training, serving, and evaluating large language models. Release repo for Vicuna and Chatbot Arena.](https://github.com/lm-sys/FastChat/)


### deduplication


# training laudgpt



```bash
curl https://api-inference.huggingface.co/models/meta-llama/Llama-2-70b-chat-hf \
    -X POST \
    -d '{"inputs": "There is no sound coming from the speakers. I am running ubuntu with jack2-dbus,  ", "parameters": {"temperature": 0.7, "max_new_tokens": 400}}' \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $HUGGINGFACE_API_KEY"
    
[{"generated_text":"There is no sound coming from the speakers. I am running ubuntu with jack2-dbus,  \n\nI have tried restarting the jack server, and I have also tried connecting a pair of headphones to the audio output and still no sound.\n\nHere is the output of the `jack_check` command:\n```\nJack server is running.\nJack server is ready.\nJack server is using the following audio device:\n  Device #0: hw:1,0: Audio device (hw:1,0)\nJack server is using the following MIDI device:\n  Device #0: hw:1,0: MIDI device (hw:1,0)\nNo MIDI devices are currently connected.\nNo audio devices are currently connected.\n```\nAnd here is the output of the `aplay -l` command:\n```\n**** List of PLAYBACK Hardware Devices ****\n\ncard 0: HDAudio [HDAudio], device 0: ALC892 Analog [ALC892 Analog]\n  Subdevices: 0/1\n  Subdevice #0: subdevice #0\ncard 0: HDAudio [HDAudio], device 1: ALC892 Digital [ALC892 Digital]\n  Subdevices: 1/1\n  Subdevice #0: subdevice #0\ncard 1: USB [USB], device 0: USB Audio [USB Audio]\n  Subdevices: 0/1\n  Subdevice #0: subdevice #0\n```\nI have also tried using aplay to play a file and it works fine.\n\nI have no idea what is going on, any help would be greatly appreciated.\n\nEdit:\nI have also tried using `jack_ Audio_Route_Add` to add a route for the system audio and it does not work."}]%  
```


```bash
curl https://api-inference.huggingface.co/models/meta-llama/Llama-2-70b-chat-hf \                          
    -X POST \
    -d '{"inputs": "To resolve a conflict with pulseaudio and jack2-dbus,  ", "parameters": {"temperature": 0.7, "max_new_tokens": 400}}' \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $HUGGINGFACE_API_KEY"

[{"generated_text":"To resolve a conflict with pulseaudio and jack2-dbus,  \n\n1. Disable the jack2-dbus service:\n```sudo systemctl disable jack2-dbus.service```\n2. Disable pulseaudio's jack support:\n```sudo sed -i '/jack/ s/^/#/g' /etc/pulse/default.pa```\n3. Restart the pulseaudio service:\n```sudo systemctl restart pulseaudio.service```\n\nThis should prevent the conflict between pulseaudio and jack2-dbus."}]
```


```
curl https://api-inference.huggingface.co/models/meta-llama/Llama-2-70b-chat-hf \
   -X POST \
   -d '{"inputs": "To resolve a conflict with pulseaudio and jack2-dbus,  ", "parameters": {"temperature": 0.7, "max_new_tokens": 400}}' \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer $HUGGINGFACE_API_KEY"
```
## regex for sentences...


```bash
#include <sched",
 "h>#include <sys/nice",
 "h>//


should be:
#include <sched.h>
#include <sys/nice.h>




```

## so

when splitting texts, the regex should split if it doesn't match this pattern:

/`\.\w|\d`/


Which matches either a file extension or misplaced character somewhere...


sysctl<mark style="background: #BBFABBA6;">.h</mark>  
something<mark style="background: #BBFABBA6;">.5</mark>
This is a sentence. Followed by another sentence about things, and what have you.
This is a sentence<mark style="background: #BBFABBA6;">.T</mark>his is another sentence.

\.\w{1,}|\d{1,}




sysctl.h
something.5
This is a sentence. This is another one.
This is a sentence.This is another sentence.

So, we're training denuplication for generated text.

