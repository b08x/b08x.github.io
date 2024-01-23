---
---


#ruby 

```ruby
def lines_after(lines,target)
  lines.drop_while { |line| !line.include?(target) }
end	
```
