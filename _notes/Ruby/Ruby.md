---
layout: page
title: Ruby
category: 
tags: 
permalink: /ruby
---
## Index
- [[A Recipe for Generative Music]]
- [[Ruby ReAct]]
- [[Ruby]]
- [[Ruby Unless]]
- [[Using the Iterator Design Pattern]]

---

## using fd|fzf to select files

```ruby
Dir.chdir(ENV["MEDIA_ROOT"]) do
	ouputFile = `fd -t f -a | fzf --preview "cat {}"`.strip
	return outputFile
end
```
