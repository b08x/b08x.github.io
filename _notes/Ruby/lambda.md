---
---

# lambda

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

