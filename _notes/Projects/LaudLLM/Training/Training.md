---
title: Training Phase
layout: note
image: /assets/headers/img-2023-06-08.png
excerpt: Ok, I'll look off you
---

# What does this look like?

> "In the training phase, a developer feeds their model a curated dataset so that it can “learn” everything it needs to about the type of data it will analyze. Then, in the inference phase, the model can make predictions based on live data to produce actionable results."


<div class="headingobject">
	<div class="col-xs-12 col-sm-8 col-md-6 col-lg-4">
		<p>
			{{ page.excerpt }}
		</p>
	</div>
	
	<div class="col-xs-12 col-sm-8 col-md-6 col-lg-4">
		<img id="page-cover" src="{{ site.baseurl }}{{ page.image }}"/>
	</div>
</div>

## second header
I suppose I would argue it would take just as much effort to maintain a project that conforms to package updates. 

### third header

Instead of marking `package==0.25.2` just mark `package` and if there is an update to the package that "breaks the code", then update the code. Because some years later when package 0.25.2 is no longer easily available on a active mirror, then whomever picks up the project has the task of resolving dependencies for code they didn't write. 

#### fourth header

There are too many libraries and too many versions to keep track of long term. The reliance on the various package managers like conda or pyenv or...or rbenv or rvm (or recently asdf) is making the tasks of deployment and maintenance rather tedious. 

##### fifth header
