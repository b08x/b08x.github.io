---
title: notebook
---

```ruby
require "ohm"
require "ohm/contrib"
require 'securerandom'
```

    false

```ruby
require 'tty-config'
```

    true


```ruby
# APP_ROOT = File.expand_path(__dir__)

lib_dir = File.expand_path(File.join(__dir__, 'lib'))
$LOAD_PATH.unshift lib_dir unless $LOAD_PATH.include?(lib_dir)

require "db/ohm_objects"
```

    true


```ruby
$config = TTY::Config.new
$config.append_path(APP_ROOT)
$config.read
```


    {"document"=>{"root"=>"/home/jovyan/Documents"}, "db"=>{"chromadb"=>"http://ninjabot.syncopated.net:8000", "redis"=>"redis://ninjabot.syncopated.net:6379/1"}}


```ruby
begin
  Ohm.redis = Redic.new($config.fetch(:db)["redis"])
rescue Ohm::Error => fault
  puts "#{fault}"
  logger.fatal "#{fault}"
  exit
end
```


    #<Redic:0x00007f73185be9c8 @url="redis://ninjabot.syncopated.net:6379/1", @client=#<Redic::Client:0x00007f73185be9a0 @semaphore=#<Thread::Mutex:0x00007f73185be978>, @connection=false, @uri=#<URI::Generic redis://ninjabot.syncopated.net:6379/1>, @timeout=10000000>, @buffer={}>


```ruby

```
