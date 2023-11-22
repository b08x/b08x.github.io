---
layout: note
title: ohm tagging
subtitle: 
category: 
tags: 
links:
---



https://github.com/soveran/ohm/blob/master/examples/tagging.rb

```ruby
# Let's first require ohm.
require 'ohm'

# We then declare our class, inheriting from `Ohm::Model` in the process.
class Document < Ohm::Model

  # The structure, fields, and other associations are defined in a declarative
  # manner. Ohm allows us to declare *attributes*, *sets*, *lists* and
  # *counters*. For our usecase here, only two *attributes* will get the job
  # done. The `body` will just
  # be a plain string, and the `tags` will contain our comma-separated list of
  # words, i.e. "ruby, redis, ohm". 
  
  # We then declare an `index` 
  # (which can be an `attribute` or a method)
  # that we point to our method `tag`
  attribute :content
  attribute :topics
  index :topic

  # One very interesting thing about Ohm indexes is that it can either be a
  # *String* or an *Enumerable* data structure. When we declare it as an
  # *Enumerable*, `Ohm` will create an index for every element. So if `tag`
  # returned `[ruby, redis, ohm]` then we can search it using any of the
  # following:
  #
  # 1. ruby
  # 2. redis
  # 3. ohm
  # 4. ruby, redis
  # 5. ruby, ohm
  # 6. redis, ohm
  # 7. ruby, redis, ohm
  #
  # Pretty neat ain't it?
  def topic
    topic.to_s.split(/\s*,\s*/).uniq
  end
end
```


```ruby
# For our purposes in this example, we'll use cutest.
require "cutest"

# Cutest allows us to define callbacks which are guaranteed to be executed
# every time a new `test` begins. Here, we just make sure that the Redis
# instance of `Ohm` is empty everytime.
prepare { Ohm.flush }

# Next, let's create a simple `Document` instance. The return value of the `setup`
# block will be passed to every `test` block, so we don't actually have to
# assign it to an instance variable.
setup do
  Document.create(:title => "Ohm Tagging", :topics => "tagging, ohm, redis")
end

# For our first run, let's verify the fact that we can find a `Document`
# using any of the tags we gave.
test "find using a single tag" do |p|
  assert Document.find(topic: "tagging").include?(p)
  assert Document.find(topic: "ohm").include?(p)
  assert Document.find(topic: "redis").include?(p)
end

# Now we verify our claim earlier, that it is possible to find a tag
# using any one of the combinations for the given set of tags.
#
# We also verify that if we pass in a non-existent tag name that
# we'll fail to find the `Document` we just created.
test "find using an intersection of multiple tag names" do |p|
  assert Document.find(topic: ["tagging", "ohm"]).include?(p)
  assert Document.find(topic: ["tagging", "redis"]).include?(p)
  assert Document.find(topic: ["ohm", "redis"]).include?(p)
  assert Document.find(topic: ["tagging", "ohm", "redis"]).include?(p)

  assert ! Document.find(topic: ["tagging", "foo"]).include?(p)
end
```



