---
---

# ruby shell execution
@ruby


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

