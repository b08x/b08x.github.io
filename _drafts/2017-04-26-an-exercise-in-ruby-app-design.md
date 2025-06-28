---
layout: post
title: An Exercise in Ruby App Design
excerpt: "An exercise in using the command line pattern in Ruby"
categories: ["development"]
tags: ["Ruby", "madeleine"]
---

# Table of Contents
  * [ocdtag](#ocdtag)
  * [Refactoring with a plan](#refactoringwithaplan)
  * [Mapping out classes](#mappingoutclasses)
  * [Learning as we go](#learningaswego)
  * [Getting serial](#getting serial)
  * [Finding the balance between scability and efficent functionality](#balance)


---


# ocdtag <a id="ocdtag"></a>

Usually I'm terrible at coming up with names for things. I have a nasty habit of labeling my folders "something1" and "something2".
But this name seems appropriate. It's quite literally an obsession to have all files and folders neatly labeled. Something of a paradox too as we never do this. 

Anywho. While a bit overkill for what the task actually is, this is an excerise in improving coding habits, amongst other things. We started learning Ruby a few years ago, then got sucked back in to the world of Operations were we didn't spend a lot time writing code. I say "improving habits" as while I consider myself not too terrible at this, in the sense of what I write is functional, things like testing, pattern development, documentation, workflow, and most importantly planning are things we need to work on. For someone like me, ideas sometimes come fast and furious. Without proper methods for organizing ideas, things quickly get out of hand and we end up with what could be potentially [useful code left unfinished][10]{:target="_blank" rel="noopener noreferrer"} after getting frustrated when we drop all the spinning plates we keep in our head. 

# Refactoring With a Plan <a id="refactoringwithaplan"></a>

This started out as a script[insert link to script] to clean up a directory full of movies. There are duplicate files, duplicate versions, terrible naming of folders/files (some called 43hjhkhx32234h.mkv even) so much so that even metadata scrapers from apps like Couchpotato and Kodi couldn't find what the files were. 

After "finishing" v1.0, meaning it worked for my specific intended purpose. I stumbled across a chapter in this book "Design Patterns for Ruby" written by Russ Olsen, called "Getting Things Done with Commands". Specifically going over what is refered to as the ["Command Pattern"][4]. Which, in a nutshell, using the Command Pattern you will create a series of command class and/or methods that do very specific things. I want this file. I want to update this thing. So on and so forth. 

- [ ] _show difference between methods in movie_tagger.rb that do all sort of this, then in ocdtag where those same tasks are broken up in commands_

The particular thing in this chapter that piqued my interest was the use of [Madeleine][3]{:target="_blank" rel="noopener noreferrer"}. As the book describes: "Madeleine is a transactional, high-performance, object-persistence framework that does not need any object relational mapping for the simple reason it does not use a database..." or more a bit more succinct [as this blog post][2]{:target="_blank" rel="noopener noreferrer"} puts it "With Madeleine you can basically make a Ruby object persistent so that you won’t have to manually load it the next time again." It is an implementation of the [Prevalent System design pattern][8]{:target="_blank" rel="noopener noreferrer"}, in which objects are kept live in memory and transactions are journaled for system recovery. For such a small application, with really only a few hundred "objects" to worry about, it would seem that keeping live data in memory might be a better way to go as opposed to creating a whole database. Another alternative might be to store "good" information in a csv or json file and just load that on startup. But thats not as fun. Plus, this has the potential for added features like "undo". For example, we rename a bunch of files but then decided we didn't like how that turned out, there can be a rollback feature simply by replaying the transaction logs and applying proper methods to "reverse" then transactions we deemed invalid.

# Mapping out classes <a id="mappingoutclasses"></a>

Before getting all excited and diving right in, I decided to use XMind to create a rough map of classes and their functions. While in the end things will look different, spending a bit of time with this gives us a good idea where to start. This is a rather simple application, but there are still a number of spinning plates to keep track of. 

<p align="center">
  <img src="https://b08x.github.io/siteimages/ocdtag/ocdtag_mindmap.jpg">
</p>

Here we are just breaking up functions and grouping them in logical classes. Names will most likely be altered as we go to make more syntactical sense. Again, this is just a starting off point. 

<p align="center">
  <img src="https://b08x.github.io/siteimages/ocdtag/ocdtag_mindmap2.jpg">
</p>

Now we are attempting to map out the basic path this application will take from when it's first run to when the user exits. The premise is simple. Load some files, try to look up the file metadata, then rename or move the file based on the metadata. 

As we go on, we'll refine this...over and over. Personally I find doing this helps a lot in organizing thoughts.

# Learning as we go <a id="learningaswego"></a>

Using `attr_accessor` and `attr_reader` we save a lot of time creating reader and writer methods. 

Instead of writing

{% highlight ruby %}

class VideoFile
  def file_info(fileinfo)
    @file_info = fileinfo
  end

  def file_info
    @file_info
  end
end

{% endhighlight %}


We can just do;

{% highlight ruby %}

class VideoFile
  attr_accessor :file_info
end

{% endhighlight %}

As we can see `attr_accessor` is a nice little shortcut. 

Here are few better explanations found on StackOverflow; 

[overview of attr_accessor & reader][5]{:target="_blank" rel="noopener noreferrer"}

[another overview of attr_accessor & reader][6]{:target="_blank" rel="noopener noreferrer"}

[using attr accessor & initialize][7]{:target="_blank" rel="noopener noreferrer"}


# Getting serial <a id="gettingserial"></a>

In consideration of the optimal way to go about this, we did some research in to what "Marshaling" actually _does_. The term "serializing objects" comes up. Which, at this point we take to mean, the objects created in an app can be converted in a serialized version using a few different methods. What we've been focusing on so far is the use of Madeleine which uses Marshaling. We could also use YAML or JSON. [This article explains it well][9]{:target="_blank" rel="noopener noreferrer"}. While there are other factors to consider, for this case the decision would be if we really want and/or need persisted data to be human readable at some point. If so, use YAML or JSON. Otherwise, use Marshal and we gain a bit performance.

In this case, we're going with Marshal and Madeleine. Mostly because we'd like to get a bit more familiar with how Madeleine works for possible use cases.

# Finding the balance between scability and efficent functionality <a id="balance"></a>

Personally, I get wrapped up in details in features to a point where it actually slows my thought process. I find myself attempting to include every feature I can think of on the first run ( "oh! In five months we may want to do this, let's rewrite everything to accommodate that possibility!") and before I know it, I'm lost in an ocean of logic and convoluted conditionals. So just a reminder, let's stay in scope for version one. Get the core functions running, and build from there. This is why methodologies like Agile were created. Small, deliverable increments. 





[1]: https://github.com/b08x/ocdtag
[2]: https://zerokspot.com/weblog/2005/07/29/getting-to-know-madeleine/
[3]: https://github.com/ghostganz/madeleine
[4]: https://en.wikipedia.org/wiki/Command_pattern

[5]: http://stackoverflow.com/a/4371458
[6]: http://stackoverflow.com/questions/5046831/why-use-rubys-attr-accessor-attr-reader-and-attr-writer
[7]: http://stackoverflow.com/questions/16655915/intermingling-attr-accessor-and-an-initialize-method-in-one-class
[8]: http://hillside.net/sugarloafplop/papers/5.pdf

[9]: http://www.skorks.com/2010/04/serializing-and-deserializing-objects-with-ruby/

[10]: https://b08x.github.io/vgopher/