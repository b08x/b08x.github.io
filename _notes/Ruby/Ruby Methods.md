----


## Ruby Methods

#ruby 

```ruby
def categorize(lines) do 
  Stream.concat([[""], lines, [""]])
  |> Enum.map(&type_of/1)
  |> merge_compound_lines
end
```

[source](https://pragdave.me/thoughts/active/2014-02-12-pattern-matching-and-parsing.html)

----

Ruby’s `detect` method to search a range of index values, not lines.

