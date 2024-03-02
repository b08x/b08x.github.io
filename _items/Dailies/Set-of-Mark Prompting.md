---
layout: note
tags: 
links: 
title: Set-of-Mark Prompting
subtitle: Mocking Humans For Still Needing to Point at Things
image: /assets/img/generative/pixel_crow-02
category: LLM
---

# extracting live documentation

"! Well, the goal would be to record a stream, get the transcript, and chunk out the transcript, say at 040 I start talking about generating sample data with inference.! Take that chunk of eventual text, attach a screenshot, or a series of screenshots during that time frame of what I'm doing, or maybe even, what do you call it, a screen cast, and have the model analyze that, and I'll put the documentation from that.!"


https://drive.google.com/file/d/1D7ughhgrlbKNlecwN2gbxuorT2I-x8H5/view?usp=sharing, https://makersuite.google.com/app/prompts?state=%7B%22ids%22%3A%5B%221YltyGA8JfNnWGH-j8Xq_btPOG8sXfHfb%22%5D%2C%22action%22%3A%22open%22%2C%22userId%22%3A%22105870379594569653340%22%2C%22resourceKeys%22%3A%7B%7D%7D&usp=sharing


A crack team of data scientists at Microsoft have done something fantastically amazing. Not since Windows XP has there been a such breakthrough in computer operations, such as this recent milestone in  on-going struggle to improve the Human Condition.

[Set of Mark Prompting](http:#link) is a freshly baked classification given to what my Mom would call "utter non-sense" but in fact is just something neither of us would ever say, as typically it's much easier to just point at something with a curious expression. 

To address the problem of the models centering information such as it overlaps contexts and confuses the response, a less confusing set of symbols were constructed from our collective imagination to bother with this...

```r
# Find center for a region 
def Find_Center(r) 
  D = DT (r) # Run distance transform 
  c = arg max(D) # Find maxium location 
return c 

# The main function 
def Mark_Allocation(R): 
  R̂ = Sorted(R) # Sort regions in ascending order of areas 
  for k in range(K): do 
    rk = R̂[k] & ¬R̂[: k − 1].sum(0) # Exclude k − 1 regions 
    C[k] = Find_Center(rk ) 
  end 
return C
```


This function takes a region definition (r) as input and returns the center of the region as an output. It does this by first calculating a measure of the distance from each point in the region to the nearest background point, somehow. The function then finds the maximum distance value, somehow and returns the corresponding background point as the center of the region, somehow.

It basically tells the model "hey, iterate over everything and classify it in a neatly organized fashion so we then can provide further instruction based on something that makes sense", as simply asking the model "hey, what is this?" invites all sorts of confusion as models are for looking at, not for asking things of.


In the following video demonstration of this, I take advantage of Gemini Pro-Vision Model <insert basically an advert for the google cloud console, vertex ai> and ask it to describe a series of screen shots depicting an audio chain setup on a Linux Workstation. 




### notes

- Phrase Grounding: Slightly different from referring segmentation, phrase grounding uses a complete sentence consisting of multiple noun phrases. We ask GPT-4V to allocate the corresponding regions for all labeled phrases.

- Video Object Segmentation: It takes two images as input. The first image is the query image which contains a few objects of interest to identify in the second image. Given that GPT-4V supports multiple images as input, our prompting method can also be applied to ground visual objects across frames in a video.

#### a fourth heading

##### a fifth heading

###### a sixth heading



1. The subject is trying to link Mixxx with BitWig Studio on Linux but does not know javascript or c++ Solve the issue with javascript
* with all 10 screenshots

> ‘The image shows the connections between different software components in Mixcx, a DJ software. ‘The components are connected by lines, which represent the flow of audio or MIDI data. ‘The audio signal starts at the top o the image, where it is input from the sound card. It then passes through a series of effects, including an equalizer, a compressor, and a imiter. The effects are used to shape the sound of the audio signal. After the effects, the audio signal is sentto the output, where itis played back through the sound card. “The MIDI signal is also input from the sound card. It then passes through a series of MIDI effects, including a pitch shifter and a delay. The MIDI effects are used to change the sound of the MIDI signal After the MIDI effects, the MIDI signal s sent to the output, where it is played back through the sound card

```
// Get the current song BPM from Mixxx var bpm = Mixxx.getProperty('/song/bpm'); // Set the BPM in Bitwig Studio Bitwig.sendValue('/tempo', bpm);
```
---

2. Describe in illustrative detail the components displayed in this set of screenshots
3. 
```
The screenshots show the user interface of Mixxx, a free and open-source DJ software. The main window is divided into four sections: the library, the decks, the mixer, and the effects.

The library is where you can browse and select the music you want to play. The decks are where you can play and mix the music. The mixer is where you can control the volume, EQ, and other effects of the music. The effects section is where you can add effects to the music.

The screenshots also show the preferences window, where you can change the settings of Mixxx. The preferences window is divided into several sections, including the audio settings, the MIDI settings, and the skin settings.

The audio settings allow you to change the audio output device, the sample rate, and the buffer size. The MIDI settings allow you to change the MIDI input and output devices, and the skin settings allow you to change the appearance of Mixxx.

The screenshots also show the help window, which contains information about how to use Mixxx. The help window is divided into several sections, including the getting started guide, the user manual, and the FAQ.
```


---

3. Describe the process depicted in the following screen shots

```
The screenshots show the process of setting up and using MIDI Clock in Ableton Live.

The first step is to open the Preferences window and select the MIDI/Sync tab. In the MIDI Clock section, make sure that the "MIDI Clock" option is enabled. You can also set the MIDI Clock rate and the MIDI Clock source.

The next step is to create a MIDI track. To do this, click on the "Create" button and select "MIDI Track". In the MIDI track, you can select the MIDI input and output devices. You can also set the MIDI channel.

The final step is to start playing your MIDI device. The MIDI Clock will now be sent to the MIDI output device. You can use the MIDI Clock to synchronize other MIDI devices to your Ableton Live project.

Here are some additional tips for using MIDI Clock in Ableton Live:

- Make sure that the MIDI Clock rate is set to the same value on all of your MIDI devices.
- If you are using multiple MIDI devices, make sure that they are all connected to the same MIDI interface.
- If you are experiencing MIDI Clock jitter, try increasing the MIDI Clock rate.
- You can use the MIDI Clock to synchronize external hardware devices to your Ableton Live project.
```



// Find center for a region def Find_Center(r) D = DT (r) // Run distance transform c = arg max(D) // Find maxium location return c // The main function def Mark_Allocation(R): R̂ = Sorted(R) // Sort regions in ascending order of areas for k in range(K): do rk = R̂[k] & ¬R̂[: k − 1].sum(0) // Exclude k − 1 regions C[k] = Find_Center(rk ) end return C

  

  

Explain the chain of connections starting with Mixxx. Do not make up the answer if you do not know, instead ask for clarification by describing what is unclear