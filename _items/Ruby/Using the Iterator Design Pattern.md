---
layout: note
title: Using the Iterator Design Pattern
subtitle: 
category:
  - Praxis
tags:
  - ruby
links:
---

## using fd|fzf to select files

```ruby
Dir.chdir(ENV["MEDIA_ROOT"]) do
	ouputFile = `fd -t f -a | fzf --preview "cat {}"`.strip
	return outputFile
end
```

create a ruby function to traverse a list of files using the iterator design pattern
Sure! Here’s an example of a Ruby function that uses the iterator design pattern to traverse a list of files:

```ruby
class FileIterator
  def initialize(files)
    @files = files
    @index = 0
  end

  def has_next?
    @index < @files.length
  end

  def next
    file = @files[@index]
    @index += 1
    file
  end
end

# Example usage
files = ["file1.txt", "file2.txt", "file3.txt"]
iterator = FileIterator.new(files)

while iterator.has_next?
  file = iterator.next
  puts "Processing file: #{file}"
  # Do something with the file
end
```

This code defines a `FileIterator` class that takes a list of files as input. The `has_next?` method checks if there are more files to iterate over, and the `next` method returns the next file in the list. You can use this iterator to loop through the files and perform any desired operations on each file.

Let me know if you need any further assistance!

To use a hash with the iterator method, you can modify the `FileIterator` class to accept a hash instead of an array. Here’s an updated version of the code:

```ruby
class FileIterator
  def initialize(files)
    @files = files
    @keys = files.keys
    @index = 0
  end

  def has_next?
    @index < @keys.length
  end

  def next
    key = @keys[@index]
    file = @files[key]
    @index += 1
    { key: key, file: file }
  end
end

# Example usage
files = {
  file1: "file1.txt",
  file2: "file2.txt",
  file3: "file3.txt"
}
iterator = FileIterator.new(files)

while iterator.has_next?
  file_info = iterator.next
  key = file_info[:key]
  file = file_info[:file]
  puts "Processing file #{key}: #{file}"
  # Do something with the file
end
```

In this updated code, the `FileIterator` class now accepts a hash of files, where the keys represent identifiers for each file, and the values represent the file paths. The `@keys` instance variable is used to store the keys of the hash, and the `next` method returns a hash with both the key and the file path.

When using the iterator, you can access the key and file path using the `file_info` hash. In the example usage, the key is printed along with the file path for each file.

Feel free to modify the code according to your specific requirements. Let me know if you have any further questions!
Why would you do this instead of just using an array?
Using an iterator design pattern instead of directly using an array provides several benefits:

1. Encapsulation: The iterator encapsulates the logic for traversing the list of files. This separation of concerns allows you to modify the traversal logic without affecting the code that uses the iterator. It also promotes a cleaner and more modular code structure.
    
2. Abstraction: By using an iterator, you can abstract away the underlying data structure (in this case, an array) from the code that uses the iterator. This allows you to easily switch to a different data structure in the future without affecting the code that relies on the iterator.
    
3. Flexibility: The iterator design pattern allows you to define custom iteration behavior. For example, you can implement different types of iterators (e.g., forward, backward, filtered) without modifying the code that uses the iterator. This flexibility enables you to adapt the iteration process to different requirements or scenarios.
    
4. Simplified Client Code: By using an iterator, the client code that consumes the iterator becomes simpler and more readable. It can focus on the logic specific to processing each file, without the need to handle the iteration details manually.
    

Overall, using an iterator design pattern promotes code modularity, flexibility, and abstraction, making the code more maintainable and extensible in the long run.

Let me know if you have any more questions!

