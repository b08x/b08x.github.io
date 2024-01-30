---
---


#sonic-pi  #composition



```ruby

live_loop :left do
  cue :left
  use_synth :piano
  
  
  play [32,38,42,51,58,60].tick, attack: 0.0125, amp: 1, pan: 0
  sleep 0.5
  
  
end

```



speakers: when panned to the middle (0) the tone sounds "less full" than when panned to either the left or right speaker. 
headphones: not as noticable, the tone seems muddy when panned in the middle



```ruby
live_loop :one do
with_fx: sound_out, output: 1, amp: 0, pan: -0.1
with_fx: sound_out, output: 2, amp: 0, pan: 0.1

end
```





setting "force mono" almost seems to have the opposite effect, with the earbud (the ones I use most often) headphones...
	

* this does not seem consistent when switching to the wireless headphones, the tone seems uniform..
	* on second listen, when panned 0, the tone does get loud but it doesn't sound good. 




reaper stuff
============
#reaper


#### peak display settings

![](./18/screenshot_2020-10-18-145131.png)


![](./18/pasted_image002.png)


With these settings, the darker parts you'll hear the tamborines, bell, assuming the tapping parts of whatever acoustic drum they're using...


