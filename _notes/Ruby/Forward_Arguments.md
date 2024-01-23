---
---

#ruby 

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

