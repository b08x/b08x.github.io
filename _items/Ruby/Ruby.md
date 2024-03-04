---
layout: page
title: Ruby
subtitle: Things Related to the Ruby Programming Language
excerpt: 
category: 
tags: 
image: 
permalink: /ruby/
---


## [[Unless]]

 ![[Pasted image 20240221155415.png]]

## find all the files with the timestamped suffix, then rename those files to their original name without the suffix.

```ruby
# so, find all the files with the timestamped suffix, then renaming those files to their original name without the suffix.
# @-----%----->---[description](
#
files = `fdfind --full-path -t d -t f -a -L #{Dir.pwd}`

files = fix_encoding(files)

files = files.split("\n")

files.each do |file|
  begin
    matches = file.match(/(.+)(_2021-10-13_1254)/)
    unless matches.nil?
      p matches
      nf = file.gsub("_2021-10-13_1254","")
      if File.symlink?
        FileUtils.rm(file)
      else
        File.rename(file,nf)
      end
    end
    puts "nothing"
  rescue StandardError =) e
    puts "#{e.message}"
  end
end

```

---

## drop_while
```ruby
def lines_after(lines,target)
  lines.drop_while { |line| !line.include?(target) }
end	
```

---


## CodeTrans model for code documentation generation ruby
#llm #gpt 

[Pretrained model on programming language ruby using the t5 small model architecture](https://huggingface.co/SEBIS/code_trans_t5_small_code_documentation_generation_ruby_multitask?text=class+PunctuationCommand+%3C+Command%0A++def+initialize%28option%29%0A++++super%28%22punctuation%22%29%0A++++%40option+%3D+option%0A++end%0A%0A++def+execute%28text%29%0A++++Text.new%28text%29.punctuation%28%40option%29.tokenize%0A++end%0Aend)
* This model is trained on tokenized ruby code functions: it works best with tokenized ruby functions.

---

### todo: try using this with live loops in sonic-pi
#sonic-pi 


```ruby
def shutdown
  return if @stopped
	@mutex.synchronize do 
	@stopped = true
	@executors.clear
	@coordinators.reset
	@client.stop
  end
end
```

---

## Nested Modules


<div class="row">
<iframe src="https://www.writesoftwarewell.com/nested-modules-in-ruby/" allow="fullscreen" allowfullscreen="" style="height: 5%; width: 60%; aspect-ratio: 16 / 9;"></iframe>
</div>
---

## unshift

unshift; add an element to the beginning of an array
```ruby
a = [1,2,3,4]
=> [1, 2, 3, 4]

a.unshift(3)
=> [3, 1, 2, 3, 4]

a
=> [3, 1, 2, 3, 4]
```


## select vs find

find will return the first value it finds that matches a condition whereas select will return all values that match a condition. 

I assume if it is known the first result will be the ony result, using find would be more efficent as select would keep looking for something it wont find..

```ruby
array = [1, 2, 3, 4, 5, 6]
hash = {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6}

array.select{|x| x.even?}       # => [2, 4, 6]
array.find_all{|x| x.even?}     # => [2, 4, 6]

hash.select{|k,v| v.even?}     # => {:b=>2, :d=>4, :f=>6}
hash.find_all{|k,v| v.even?}   # => :b, 2], [:d, 4], [:f, 6
```

In the example above, you can observe that .find_all gives an array even though you are iterating on an Array or a Hash. .select instead gives us an Array or a Hash.

[ruby pattern matvim ching](https://speakerdeck.com/bkuhlmann/ruby-pattern-matching?slide=38)

## hash
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


## replace a string with an empty string by default
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


----
## chaining methods
```ruby
def string_manipulation(string)
string
.chars
.reverse
.drop(1)
end
```


---
## forward arguments
[Arguments forwarding (...) supports leading arguments](https://rubyreferences.github.io/rubychanges/3.0.html#arguments-forwarding--supports-leading-arguments)

```ruby
def request(method, url, headers: {})
  puts "#{method.upcase} #{url} (headers=#{headers})"
end

def get(...)
  request(:get, ...)
end

get('https://example.com', headers: {content_type: 'json'})
# GET https://example.com (headers={:content_type=>"json"})

# Leading arguments may be present both in the call and in the definition:
def logged_get(message, ...)
  puts message
  get(...)
end

logged_get('Logging', 'https://example.com', headers: {content_type: 'json'})

```


---
## glimmer
https://github.com/AndyObtiva/glimmer-dsl-libui#glimmer-gui-dsl-concepts

---


## include extend
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

# [source](https://www.geeksforgeeks.org/include-v-s-extend-in-ruby/)
```


---
## interactive charts for ruby

[dataframes like pandas](https://github.com/ankane/polars-ruby) --> [interactive charts for ruby](https://github.com/ankane/vega-ruby#ot)

## lambda

Here’s an example of returning a lambda.
```ruby


1. def calculate_tax subtotal
2.   tax =  (subtotal * 0.0825).round(2)
3.   return lambda { puts tax }
4. end
5. first_tax = calculate_tax(10)
6. second_tax = calculate_tax(100)
7. first_tax.call
8. second_tax.call
=> 0.83
=> 8.25

```

This is really helpful if you want to abstract out some functionality and store it to be used at a later point in the execution of your program.

[source](https://medium.com/nerd-for-tech/what-are-ruby-lambda-functions-6cb6bfe9b20c)

---

[jekyll picture tag documentation](https://rbuchberger.github.io/jekyll_picture_tag/users/liquid_tag/examples.html)

If you want to serve multiple images in multiple formats and resolutions, you have a litany of markup to write and a big pile of images to generate and organize. Jekyll Picture Tag is your responsive images minion - give it simple instructions and it'll handle the rest.

[flexboxgrid documentation](http://sassflexboxgrid.com/views/documentation.html)

A responsive grid system based on flexbox-grid and the flex property, re-written in Sass, edited and expanded upon.

---
## Ruby chain tool to work with LLMs

https://mariochavez.io/desarrollo/2023/07/12/building-ai-applications-with-ruby/

https://github.com/mariochavez/aoororachain

https://github.com/ggerganov/llama.cpp --> https://github.com/mariochavez/llm_server

---

```ruby
def categorize(lines) do 
  Stream.concat([[""], lines, [""]])
  |> Enum.map(&type_of/1)
  |> merge_compound_lines
end
```

[source](https://pragdave.me/thoughts/active/2014-02-12-pattern-matching-and-parsing.html)

Ruby’s `detect` method to search a range of index values, not lines.

---

## shell execution


```sh
# Ways to execute a shell script in Ruby
# Example Script - Joseph Pecoraro

cmd = "echo 'hi'" # Sample string that can be used

# 1. Kernel#` - commonly called backticks - `cmd` 
# This is like many other languages, including bash, PHP, and Perl
#   Synchronous (blocking)
#   Returns the output of the shell command
#   Docs: http://ruby-doc.org/core/classes/Kernel.html#M001111

value = `echo 'hi'` # or uglier but valid => Kernel.`("echo 'hi'")
value = `#{cmd}`    # or uglier but valid => Kernel.`("#{cmd}")


# 2. Built-in syntax, %x( cmd )
# Following the ``x'' character is a delimiter, which can be any character.
# If the delimiter is one of the characters ``('', ``['', ``{'', or ``[description]('',
# the literal consists of the characters up to the matching closing delimiter,
# taking account of nested delimiter pairs. For all other delimiters, the
# literal comprises the characters up to the next occurrence of the
# delimiter character.  String interpolation #{ ... } is allowed.
#   Synchronous (blocking)
#   Returns the output of the shell command, just like the backticks
#   Docs: http://www.ruby-doc.org/docs/ProgrammingRuby/html/language.html

value = %x( echo 'hi' )
value = %x[ #{cmd} ]


# 3. Kernel#system
# Executes the given command in a subshell
#   Synchronous (blocking)
#   Return: true if the command was found and ran successfully, false otherwise
#   Docs: http://ruby-doc.org/core/classes/Kernel.html#M002992

wasGood = system( "echo 'hi'" )
wasGood = system( cmd )


# 4. Kernel#exec
# Replaces the current process by running the given external command.
#   Synchronous (never returns)
#   Return: none, the current process is replaced and never continues
#   Docs: http://ruby-doc.org/core/classes/Kernel.html#M002992

exec( "echo 'hi'" )
exec( cmd ) # Note: this will never be reached beacuse of the line above


# 5. IO.popen
# Runs the specified command as a subprocess; the subprocess's standard
# input and output will be connected to the returned IO object. This
# allows you to provide STDIN input and get STDOUT output easily.
#   Asynchronous (IO objects)
#   Return: IO object, (IO#pid, IO#read)
#   Docs: https://www.rubydoc.info/stdlib/core/IO.popen

io = IO.popen("echo 'hi'") # Or IO.popen(["echo", "hi"])
io = IO.popen(cmd)

IO.popen(["echo", "'hi'"]) do |io|
  # ...
end


# 6. open3
# Runs the specified command as a subprocess; the subprocess's standard
# input, stdout, and stderr IO objects are available. There is also
# an "open4" gem to more easily get the PID of the child process.
#   Synchronous (get strings) or Asynchronous (IO objects)
#   Return: Strings (capture*) or IO objects (popen*)
#   Docs: https://docs.ruby-lang.org/en/2.5.0/Open3.html#method-c-popen3

require 'open3'
stdin_io, stdout_io, stderr_io, process_waiter = Open3::popen3(cmd)
stdout_str, stderr_str, process_info = Open3::capture3(cmd)

require 'open4'
pid, stdin, stdout, stderr = Open4::popen4(cmd);


# Extra Advice - Exit Code
# $? which is the same as $CHILD_STATUS (if you require 'english')
# Accesses the status of the last system executed command if
# you use the backticks, system() or %x{}.
# You can then access the ``exitstatus'' and ``pid'' properties
#   Docs: https://ruby-doc.org/core-2.7.1/Process/Status.html#method-i-exitstatus

$?.exitstatus


# Extra Advice - Escaping
# When running shell commands, it is often important to escape
# characters that would have special meanings (quotes, $, spaces, etc).
# Ruby makes this simple with the Shellwords module.
#   Docs: https://ruby-doc.org/stdlib-2.5.3/libdoc/shellwords/rdoc/Shellwords.html#method-c-shellescape

require 'shellwords'
path = "/path/to a/file" # This has a space that should be escaped properly.
%x{ cat #{Shellwords.escape(path)} }


# Extra Advice - String#chomp
# Shell commands typically end with a newline which you will often want
# to get rid of. Ruby makes this simple with `chomp`.
#   Docs: https://ruby-doc.org/core-2.7.2/String.html#method-i-chomp

str = `echo 42`       # =) "42\n"
str = `echo 42`.chomp # => "42"


# More Reading
# https://stackoverflow.com/questions/2232/how-to-call-shell-commands-from-ruby/2280#2280
# http://www.elctech.com/blog/i-m-in-ur-commandline-executin-ma-commands
# http://blog.jayfields.com/2006/06/ruby-kernel-system-exec-and-x.html
# http://tech.natemurray.com/2007/03/ruby-shell-commands.html
```

---
## unless

**Common use cases for `unless`:**

- **Guard clauses:** Checking conditions at the beginning of methods to return early if they aren't met.
- **Conditional assignments:** Assigning values only if a condition is false.
- **Conditional execution:** Performing actions only when certain conditions aren't true.

**When to use `unless` vs. `if`:**

- Choose `unless` when the code to be executed is more naturally expressed in terms of the condition being false.
- Choose `if` when the code to be executed is more naturally expressed in terms of the condition being true.

### Using `unless` for NLP Document Chunking:

`unless` can be a helpful tool in this process by selectively excluding unwanted chunks based on specific criteria. Here are some examples:

**1. Ignoring punctuation boundaries:**

- **Task:** Chunk a document into noun phrases, but keep prepositions attached unless they appear at the end of the phrase.

```ruby
# - Explanation: `unless` removes trailing periods from chunks to keep prepositions like "of" within the noun phrase.

chunks = text.scan(/((?:[^\s,.]+|[^,.]+[,.][^,.]+)+)/)
chunks.map! { |chunk| chunk unless chunk.match(/\.+$/) }

```
---

## rvm
### Wednesday 25/01/2023 23:20

```sh
rvm pkg install openssl

export CFLAGS="-ffast-math -msse -msse2 -mfpmath=sse -fPIC"
export MAKEFLAGS="-ffast-math -msse -msse2 -mfpmath=sse -fPIC"


rvm install 2.6.10 --with-openssl-dir=$HOME/.rvm/usr
rvm install 3.2.0 --with-openssl-dir=$HOME/.rvm/usr

```

---

## set bundle to use local system gem location instead of user gem location

```sh
bundle config set --local system 'true'
```

---

## creates arrays of booleans

https://www.alchemists.io/screencasts/ruby_truth_tables/

---

[Breadth First Search](https://www.sitepoint.com/graph-algorithms-ruby/)

