---
---

# hash

@ruby

```ruby
class PackageCat
  def initialize(attrs)
		@x = attrs[:x]
		@y = attrs[:y]
	end
	def hash
		[@x, @y].Hash
	end
end

```



# replace a string with an empty string by default
```ruby
class String
  alias original_sub sub
  alias original_sub! sub!

  def sub(pattern, replacement = "", &block)
    original_sub(pattern, replacement, &block)
  end

  def sub!(pattern, replacement = "", &block)
    original_sub!(pattern, replacement, &block)
  end
end

puts "hello".sub("l")
puts "hello".sub!("l")

```


