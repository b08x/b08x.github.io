---
title: Ruby
layout: folder
---

## 2023-11-28
Using Ruby in Jupyter Notebooks with [[Docker Stacks]]

## 2023-11-22
### using fd|fzf to select files

```ruby
Dir.chdir(ENV["MEDIA_ROOT"]) do
  outputFile = `fd -t f -a | fzf --preview "cat {}"`.strip
  return outputFile
end
```


