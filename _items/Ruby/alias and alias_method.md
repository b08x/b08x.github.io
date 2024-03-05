---
layout: note
title: Alias & Alias Method
subtitle: 
category:
  - Ruby
tags:
  - ruby
links:
---

The use of aliases can improve the readability and maintainability of code. Compared to alias, the alias_method is considered more flexible, providing the ability to override methods and accommodate subclass behaviors.

```ruby
class AudioFile
  attr_accessor :path
  
  def initialize
	  
	  @path = "/home/stuff"
  
  end

  def full_path
	puts "#{@path}"
  end

  alias name full_path
end

AudioFile.new.name 
```




Here are some specific scenarios where using alias or alias_method can be beneficial:
- Avoiding Repetition: If you need to reference a method in multiple places within the code but with a different naming convention, using an alias allows you to define a new name for that method elsewhere in the codebase. This avoids redundant code and makes your code more concise.
- Subclasses Compatibility: When dealing with subclasses, alias_method can be particularly useful. It allows you to provide an alternative name for a method overridden in subclasses, thus promoting consistency and avoiding naming conflicts.
- Avoiding Naming Conflicts: If you have a method with a name already in use in a standard library or other libraries that you're using, alias or alias_method can help you circumvent naming conflicts by renaming the method.


---
###### sources

[alias-vs-alias-method](https://www.bigbinary.com/blog/alias-vs-alias-method)