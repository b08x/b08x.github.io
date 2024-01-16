---
layout: note
title: plantuml
subtitle: 
category: 
tags: 
links:
---

https://plantuml.com/sequence-diagram

# Hybrid HTML with Markdown is a not bad choice ^\_^

## Table Usage

| :          Fruits \|\|            Food :|||
|:-------------------|:------------|:------------|
|  Apple             |  : Apple :  |             |
|  Banana            |  Banana     |             |
|  Orange            |  Orange     |  Orange     |
|  : Rowspan is 4 :  |             |  How's it?  |
| ^^ A. Peach        |             |   1. Fine : |
| ^^ B. Orange       |             | ^^ 2. Bad   |
| ^^ C. Banana       |             |  It's OK!   |  

## mermaid


## PlantUML Usage

@startuml
start
:version: '';
if (Has Extra Variable?) then (True)
  :version: 'latest';
  stop
else (False)
  if (Has Group Variable?) then (True)
	:version: 'development';
	stop
  else (False)
	:Has Playbook Variable?;
  endif
endif
if (Has Role Variable?);
	:something;

@enduml

@startuml
start
:Extra Vars (Command Line);
:Task Vars (Specific Task);
:Block Vars (Within Block);
:Role and Include Vars;
:Set_fact Vars;
:Register Vars;
:Playbook VarsFiles;
:Playbook VarsPrompt;
:Playbook Vars;
:Host Facts;
:HostVars;
:GroupVars;
:Inventory Host Vars;
:Inventory Group Vars;
:Inventory Vars;
:Role Defaults;
stop
@enduml


## ansible

@startuml
!define HOSTVARS_PATH host_vars/server1.yml

object Playbook {
  vars: my_variable = playbook_value
}
object HostVars {
  vars: my_variable = host_value
}
object Host1 {
  include HOSTVARS_PATH
}
Playbook -- Host1 : hosts: server1
@enduml


## soundbot

@startuml
lapbot -> soundbot :  1. start jacktrip
lapbot --> soundbot: sending midi
soundbot -> tinybot : 2. hello, start jacktrip
lapbot -> tinybot : sending osc
tinybot --> soundbot : 3. heres some audio
soundbot --> bigbot : 4. hey, start jacktrip
bigbot --> soundbot : 5. right, heres some audio
soundbot ~> lapbot : 6. heres the grouped audio

@enduml

### threee

@startuml
participant Participant as Foo
actor       Actor       as Foo1
boundary    Boundary    as Foo2
control     Control     as Foo3
entity      Entity      as Foo4
database    Database    as Foo5
collections Collections as Foo6
queue       Queue       as Foo7
Foo \\- Foo1 : To actor 
Foo -> Foo2 : To boundary
Foo -> Foo3 : To control
Foo -> Foo4 : To entity
Foo -> Foo5 : To database
Foo -> Foo6 : To collections
Foo -> Foo7: To queue
@enduml


@startuml
Alice -> Bob: Authentication Request

alt successful case

    Bob -> Alice: Authentication Accepted

else some kind of failure

    Bob -> Alice: Authentication Failure
    group My own label
    Alice -> Log : Log attack start
        loop 1000 times
            Alice -> Bob: DNS Attack
        end
    Alice -> Log : Log attack end
    end

else Another type of failure

   Bob -> Alice: Please repeat

end
@enduml

@startuml
Alice->Bob : hello
note left: this is a first note

Bob->Alice : ok
note right: this is another note

Bob->Bob : I am thinking
note left
a note
can also be defined
on several lines
end note
@enduml

```

@startuml
participant Alice
participant Bob
note left of Alice #aqua
This is displayed
left of Alice.
end note

note right of Alice: This is displayed right of Alice.

note over Alice: This is displayed over Alice.

note over Alice, Bob #FFAAAA: This is displayed\n over Bob and Alice.

note over Bob, Alice
This is yet another
example of
a long note.
end note
@enduml

@startuml

!pragma teoz true
box "Internal Service" #LightBlue
participant Bob
box "Subteam"
participant Alice
participant John
end box

end box
participant Other

Bob -> Alice : hello
Alice -> John : hello
John -> Other: Hello

@enduml

```