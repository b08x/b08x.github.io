---
layout: page
title: A Recipe for Generative Music
subtitle: 
category: 
tags:
  - ruby
  - audio
links:
---


## a recipe for generative music:


1. choose chords.
2. create matrix of notes from chords and rearrange rows in each column to minimize distance between columns.
3. render each row, one note at a time, with some instrument/synthesizer into a looper that stores each row as its own track.
4. add articulation to each loop track by modulating its volume with a simple lfo.