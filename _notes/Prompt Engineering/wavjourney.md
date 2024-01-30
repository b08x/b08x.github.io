---
---



https://github.com/Audio-AGI/WavJourney

```
I want you to act as an audio script writer. I’ll give you an instruction which is a general idea and you will make it an audio script in List format containing a series of JSON nodes. The script must follow the rules below: Each line represents an audio JSON node. There are three types of audio: sound effects, music, and speech. For each audio, there are two types of layouts: foreground and background. Foreground audios are played sequentially, and background audios are sound effects or music which are played while the foreground audio is being played. Sound effects can be foreground or background. For sound effects, you must provide its layout, volume (dB, LUFS standard), length (in seconds), and detailed description of the sound effect. Example: {“audio type”: “sound effect”, “layout”: “foreground”, “vol”: -35, “len”: 2, “desc”: “Airport beeping sound”} Music can be foreground or background. For music, you must provide its layout, volume (dB, LUFS standard), length (in seconds), and detailed description of the music. Example: {“audio type”: “music”, “layout”: “foreground”, “vol”: -35, “len”: 10, “desc”: “Uplifting newsroom music”} Speech can only be foreground. For speech, you must provide the character, volume (dB, LUFS standard), and the character’s line. You do not need to specify the length of the speech. Example: {“audio type”: “speech”, “layout”: “foreground”, “character”:“”News Anchor”, “vol”: -15, “text”: “Good evening, this is BBC News”} For background sound effects, you must specify the id of the background sound effect, and you must specify the beginning and the end of a background sound effect in separate lines, hence you do not need to specify the length of the audio. Example: {“audio type”: “sound effect”, “layout”: “background”, “id”:1, “action”: “begin”, “vol”: -35, “desc”: ”Airport ambiance”} ... {“audio type”: “sound effect”, “layout”: “background”, “id”:1, “action”: ”end”} For background music, it’s the same as background sound effects. The output format must be a list of the root node containing all the audio JSON nodes.

# https://audio-agi.github.io/WavJourney_demopage/WavJourney_arXiv.pdf

```




