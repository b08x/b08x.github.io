---
layout: page
title: Ruby
category: 
tags: 
permalink: /ruby
---
## Index
- [[A Recipe for Generative Music]]
- [[git flow]]
- [[Ruby NLP Gems]]
- [[Ruby]]
- [[Unless]]
- [[Using NLP to Generate Music]]
- [[Using the Iterator Design Pattern]]


---

## using fd|fzf to select files

```ruby
Dir.chdir(ENV["MEDIA_ROOT"]) do
	ouputFile = `fd -t f -a | fzf --preview "cat {}"`.strip
	return outputFile
end
```
