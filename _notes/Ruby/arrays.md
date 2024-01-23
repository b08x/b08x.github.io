---
---

#ruby 
unshift; add an element to the beginning of an array
```ruby
a = [1,2,3,4]
=> [1, 2, 3, 4]

a.unshift(3)
=> [3, 1, 2, 3, 4]

a
=> [3, 1, 2, 3, 4]
```


select vs find
--------------

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


----
[ruby pattern matvim ching](https://speakerdeck.com/bkuhlmann/ruby-pattern-matching?slide=38)

