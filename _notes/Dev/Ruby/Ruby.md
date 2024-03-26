---
layout: index
title: Ruby
category:
  - Dev
tags: 
permalink: /dev/ruby
---
## Index
- [[Ruby NLP Gems]]
- [[Ruby ReAct]]
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
