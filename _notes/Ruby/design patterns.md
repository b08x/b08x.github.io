---
---


https://refactoring.guru/design-patterns/facade

## Facade

**Facade** is a structural design pattern that provides a simplified interface to a library, a framework, or any other complex set of classes.

TextProcessor

class document
class extract

- A [Facade](https://refactoring.guru/design-patterns/facade) class can often be transformed into a [Singleton](https://refactoring.guru/design-patterns/singleton) since a single facade object is sufficient in most cases.

*might be good for the Pipeline class*

load doc --> create Document redis object --> Pipeline.new().start --> chunk text --> create Chunk redis object --> segment the chunks --> update redis object --> tokenize each in the chunk -->
## Singleton

**Singleton** is a creational design pattern that lets you ensure that a class has only one instance, while providing a global access point to this instance.

Singleton has almost the same pros and cons as global variables. Although they’re super-handy, they break the modularity of your code.

*this might be good a the database connection class*

## Composite

**Composite** is a structural design pattern that lets you compose objects into tree structures and then work with these structures as 
if they were individual objects

The Composite pattern provides you with two basic element types that share a common interface: simple leaves and complex containers. *a Document could be consider a 'complex container' while chunks, words and/or topics could be considered leaves*

A container can be composed of both leaves and other containers. This lets you construct a nested recursive object structure that resembles a tree.

*this might be good for interfacing with the Redis Ohm Objects as well as pgvector queries*

*iterators can be used to traverse composite trees*


## Iterator

**Iterator** is a behavioral design pattern that lets you traverse elements of a collection without exposing its underlying representation (list, stack, tree, etc.).

## Vistor

**Visitor** is a behavioral design pattern that lets you separate algorithms from the objects on which they operate.

Use the Visitor when you need to perform an operation on all elements of a complex object structure (for example, an object tree).

The Visitor pattern lets you execute an operation over a set of objects with different classes...

Use the pattern when a behavior makes sense only in some classes of a class hierarchy, but not in others.

##### Relations with Other Patterns

- You can treat [Visitor](https://refactoring.guru/design-patterns/visitor) as a powerful version of the [Command](https://refactoring.guru/design-patterns/command) pattern. Its objects can execute operations over various objects of different classes.
    
- You can use [Visitor](https://refactoring.guru/design-patterns/visitor) to execute an operation over an entire [Composite](https://refactoring.guru/design-patterns/composite) tree.
    
**- You can use [Visitor](https://refactoring.guru/design-patterns/visitor) along with [Iterator](https://refactoring.guru/design-patterns/iterator) to traverse a complex data structure and execute some operation over its elements, even if they all have different classes.**




## command

**Command** is a behavioral design pattern that turns a request into a stand-alone object that contains all information about the request. This transformation lets you pass requests as a method arguments, delay or queue a request’s execution, and support undoable operations.


## Adapter

**Adapter** is a structural design pattern that allows objects with incompatible interfaces to collaborate.

Adapters can not only convert data into various formats but can also help objects with different interfaces collaborate. Here’s how it works:

1. The adapter gets an interface, compatible with one of the existing objects.
2. Using this interface, the existing object can safely call the adapter’s methods.
3. Upon receiving a call, the adapter passes the request to the second object, but in a format and order that the second object expects.

Sometimes it’s even possible to create a two-way adapter that can convert the calls in both directions.


![](Pasted%20image%2020231005015434.png)


## chain of responsibility 

**Chain of Responsibility** is a behavioral design pattern that lets you pass requests along a chain of handlers. Upon receiving a request, each handler decides either to process the request or to pass it to the next handler in the chain.


## Template Method

**Template Method** is a behavioral design pattern that defines the skeleton of an algorithm in the superclass but lets subclasses override specific steps of the algorithm without changing its structure.


> ##  Problem
> Imagine that you’re creating a data mining application that analyzes corporate documents. Users feed the app documents in various formats (PDF, DOC, CSV), and it tries to extract meaningful data from these docs in a uniform format. 
> The first version of the app could work only with DOC files. In the following version, it was able to support CSV files. A month later, you “taught” it to extract data from PDF files.

![](Pasted%20image%2020231005015604.png)

The Template Method pattern suggests that you break down an algorithm into a series of steps, turn these steps into methods, and put a series of calls to these methods inside a single _template method._

Use the pattern when you have several classes that contain almost identical algorithms with some minor differences. As a result, you might need to modify all classes when the algorithm changes.

 When you turn such an algorithm into a template method, you can also pull up the steps with similar implementations into a superclass, eliminating code duplication. Code that varies between subclasses can remain in subclasses.