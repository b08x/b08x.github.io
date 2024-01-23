---
---


## a recipe for generative music:

so after this little discovery i had a basic recipe for generative ambient music.:

1. choose chords.
2. create matrix of notes from chords and rearrange rows in each column to minimize distance between columns.
3. render each row, one note at a time, with some instrument/synthesizer into a looper that stores each row as its own track.
4. add articulation to each loop track by modulating its volume with a simple lfo.