---
---

# include extend
f.e:
```ruby
module SoxStuff
	def get_levels(file)
		sox stuff
	end
end

class FileObeject
	include SoxStuff # can only access SoxStuff methods with an instance of the class
	
	attr_accessor :fullpath, :name, :extension
	
	def initialize(path)
	end
end

class Library
	extend SoxStuff # can only access SoxStuff with the class definition
end

FileObject.new.get_levels

Library.get_levels
```

[a source](https://www.geeksforgeeks.org/include-v-s-extend-in-ruby/)


