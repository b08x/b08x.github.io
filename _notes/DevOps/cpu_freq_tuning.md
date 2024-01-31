---
---

﻿Speaker #1: Right.
Speaker #1: Was the turbine boost enabled?
Speaker #1: The reported frequency fluctuates somewhere between 400 and 4200, I
Speaker #1: guess soon being from megahertz to gigahertz.
Speaker #1: So then with that disabled and the governor is set
Speaker #1: to performance and does it, it hovers around 1900 that
Speaker #1: that, that did something.
Speaker #1: OK.
Speaker #1: Oh, yeah.
Speaker #1: Really.
Speaker #1: Oh yeah.
Speaker #1: There it is.
Speaker #1: All right.
Speaker #1: So with turbine disabled, frequency range between 401.9 hardware limits
Speaker #1: enable turbo.
Speaker #1: Via the X86 energy performance policy, the turbo was enabled,
Speaker #1: I said and the governor to performance and we can
Speaker #1: see here.
Speaker #1: So the action, the frequencies reported aren't fluctuating back and
Speaker #1: forth.
Speaker #1: I think that has something to do.
Speaker #1: Was this setting here?
Speaker #1: Why that and why that is I'm not sure.
Speaker #1: Anyone.
Speaker #1: So that's from a different so that is a bit
Speaker #1: odd.
Speaker #1: So setting does, yeah, I guess enabling no turbo versus
Speaker #1: just disabling turbo.
Speaker #1: See, it's intended to allow for the user space to
Speaker #1: specify desired power performance.
Speaker #1: Trade off the EPB register is another layer of performance
Speaker #1: management.
Speaker #1: Functioning independently from frequency scaling influences how aggressive P state
Speaker #1: and C state selection will be.
Speaker #1: Yeah yeah OK well the the desired functionality here is
Speaker #1: to keep a steady frequency clock.
Speaker #1: I find with the boosting enabled with with that frequency
Speaker #1: fluctuating on demand, I notice more cracks and pops in
Speaker #1: the audio.
Speaker #1: Let's see, set the minimum and set the Max.
Speaker #1: Oh, OK, all right, so setting the maximum frequency using
Speaker #1: CPU power?
Speaker #1: Then fuck.
Speaker #1: This is it's these little things that that vex me.
Speaker #1: So if I disabled turbo or if I disabled no
Speaker #1: Turbo, you know who knows?
Speaker #1: Yeah.
Speaker #1: See you.
Speaker #1: And now I'm just trying to think of a way
Speaker #1: to put this so it's memorable and most likely is
Speaker #1: well, yeah, all right, so there's CPU power on one
Speaker #1: of the hosts.
Speaker #1: This one in particular, Power Profiles Demon, is running.
Speaker #1: That's not the case for all of the hosts in
Speaker #1: this environment.
Speaker #1: So with this service enabled, that's another point to save
Speaker #1: list.
Speaker #1: I said power saver bound to communicate with the daemon
Speaker #1: resource, or busy.
Speaker #1: Huh.
Speaker #1: OK, so one of these changes makes it so the
Speaker #1: power profile demon the setting is somehow blocked from being
Speaker #1: applied due to its potential status as the dependency.
Speaker #1: I don't think this is the case.
Speaker #1: This is the only host that the daemon is installed
Speaker #1: on.
Speaker #1: This one happens to be Endeavour OS for example, on
Speaker #1: this other host here, this is running a variant of
Speaker #1: Arch Linux called Arch Labs, an unfortunately defunct project as
Speaker #1: it's to get into a slight tangent here to, from
Speaker #1: my observations and usage, it's the cleanest variant of Arch.
Speaker #1: It's been the most stable.
Speaker #1: It's been the most intuitive to configure.
Speaker #1: Minimal footprint.
Speaker #1: Yeah, it's a shame.
Speaker #1: So anyways, yeah, I'll have to archive that project.
Speaker #1: There's no offense to the other distributions.
Speaker #1: Garuda, Manjiro Endeavor.
Speaker #1: What else was there?
Speaker #1: Well, I guess, yeah, the major ones.
Speaker #1: Garuda and Diver.
Speaker #1: Manjiro Yeah, as far as stability and and then there's
Speaker #1: Cashie OS they'll suffer from.
Speaker #1: How do I say it's usually, and this is in
Speaker #1: terms of audio production by the way.
Speaker #1: I shouldn't, I shouldn't definitely preface with that.
Speaker #1: But yeah, they all suffer from some sort of overload
Speaker #1: or some sort of misconfiguration with the graphical user interface
Speaker #1: either.
Speaker #1: Gnome, KDXSC, I I don't know.
Speaker #1: I've struggled with all of all all of those distributions
Speaker #1: in terms of tuning it for to use with with
Speaker #1: the.
Speaker #1: Anyways, I'm not going to bother finishing that thought because
Speaker #1: it's it's sort of a moot point.
Speaker #1: So yeah, back to this.
Speaker #1: SO Power profile name and is enabled by default on
Speaker #1: Endeavour OS.
Speaker #1: According to the Arch wiki.
Speaker #1: There may be some dependencies involved here.
Speaker #1: I'm not sure about TLP or system 76 power, but
Speaker #1: tuned does not require this service.
Speaker #1: So yeah, just saying you're an able able.
Speaker #1: What?
Speaker #1: Yeah, you know to be fair, I might be just,
Speaker #1: I might be a little, a little stoned.
Speaker #1: But so the goal is to disable the turbo boosting,
Speaker #1: that is, keep the frequency at a set steady rate,
Speaker #1: ideally not at the maximum.
Speaker #1: As the machines get warmer the the higher the frequency.
Speaker #1: OK, so X86 energy Performance Policy turbo enable.
Speaker #1: Set that to one right Intel P state.
Speaker #1: No Turbo that is saying to disable turbo and don't
Speaker #1: mind me.
Speaker #1: It's just super damn frustrating when when the concepts like
Speaker #1: this conflict and I I've been doing this for 15
Speaker #1: years now.
Speaker #1: Anyways, I'm just now getting around to this, which is
Speaker #1: just funny to me.
Speaker #1: Anyways, lunchtime Yeah, so setting no turbo to one, That
Speaker #1: is to say, maybe not because this whole report.
Speaker #1: Otherwise, see it says Turbo enabled PEACE STATE NO Turbo.
Speaker #1: So setting Intel P STATE NO TURBO to 1 overrides
Speaker #1: the setting set here.
Speaker #1: I can.
Speaker #1: So now I'll set the governor to actually what is
Speaker #1: it?
Speaker #1: What is it now?
Speaker #1: OK, so the current governor's performance, OK, so that's why
Speaker #1: it's hard.
Speaker #1: Like added Max here.
Speaker #1: So power save.
Speaker #1: And that goes down to the expected minimum.
Speaker #1: All right, so now through X86 Energy Performance Policy Turbo
Speaker #1: has been disabled.
Speaker #1: All right, right now the governor reported in my CPU
Speaker #1: power set the power save.
Speaker #1: So set that to performance and now it is at
Speaker #1: maximum frequency.
Speaker #1: I'm not sure exactly what is limited limiting this to
Speaker #1: 1900.
Speaker #1: I can try setting in through CPU power again, but
Speaker #1: I don't think that'll have an effect.
Speaker #1: But I'm also a pessimist, so we'll see.
Speaker #1: OK, so I guess the says limit 4.20.
Speaker #1: I guess that doesn't necessarily mean that that's the default
Speaker #1: state if left UN unchecked.
Speaker #1: Anyway, so now we'll try setting no turbo.
Speaker #1: Let's see, to enable turbo or perhaps yes.
Speaker #1: Yeah, reword that at some point.
Speaker #1: Let's see if maybe if one of the models can
Speaker #1: do can help out there, right?
Speaker #1: Error not permitted.
Speaker #1: Oh OK, why not?
Speaker #1: Is it?
Speaker #1: Is it because I've disabled the turbo?
Speaker #1: Yes, OK.
Speaker #1: So if you're interested in like, I guess this would
Speaker #1: be like psychology or philosophical neurology.
Speaker #1: I don't know something in that area where my my
Speaker #1: brain is at currently.
Speaker #1: If you were to ask me what I'm doing or
Speaker #1: what is it I'm doing, I would struggle to tell
Speaker #1: you.
Speaker #1: I know I'm working on configuring the host machine to
Speaker #1: keep a steady clock rate, CPU clock rate, that's that's
Speaker #1: my goal.
Speaker #1: So that's why I'm trying to figure out how to
Speaker #1: configure the host machine to keep a steady frequency as
Speaker #1: opposed to an on demand or fluctuating policy.
Speaker #1: And this is for the purposes of tuning a host
Speaker #1: for audio production.