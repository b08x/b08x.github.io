---
title: "OSPF as a Planner"
tag: "planning"
category: "Generator"
instructions: "Model each subtask as a router advertising link-state costs. Route the plan by cheapest path, not by declared priority."
example: |
  Cost(A→B)=3, Cost(A→C→B)=2 → route via C.
  Recompute on task-cost change.
sfl:
  defaults: { tenor: 0.6, modality: 0.75, imagery: 0.75, abstraction: 0.7, novelty: 0.2 }
  ground:
    - id: cost
      gist: "Every subtask carries an advertised cost, and cost is what ordering is computed from."
      anchors: ["cost"]
    - id: recompute
      gist: "The plan is recomputed when a cost changes — it is not fixed at the start."
      anchors: ["recompute"]
    - id: priority
      gist: "Declared priority is an input to cost, never an override of the routing."
      anchors: ["priority"]
  clauses:
    - ground: cost
      subject: { low: "each subtask", mid: "each subtask" }
      modal:   { low: "can advertise", mid: "should advertise", high: "must advertise" }
      object:
        concrete: "a cost number covering effort, risk and how long it blocks other work"
        abstract: "a scalar cost composed of effort, risk and blocking weight"
      figure:
        concrete: "its cost the way a router floods a link-state advertisement to its neighbours"
        abstract: "its cost as link-state, flooded to every adjacent subtask"
    - ground: cost
      subject: { low: "the ordering", mid: "the ordering", high: "you" }
      modal:   { low: "can follow", mid: "should follow", high: "must follow" }
      object:
        concrete: "the cheapest total cost through the graph, even when that route looks indirect"
        abstract: "the minimum-cost path through the task graph, irrespective of apparent directness"
      figure:
        concrete: "the shortest path the way Dijkstra walks it — cheapest, not straightest"
        abstract: "shortest-path-first over the topology, not the line drawn on the map"
    - ground: priority
      subject: { low: "declared priority", mid: "declared priority", high: "you" }
      modal:   { low: "is better treated as", mid: "should be treated as", high: "must treat declared priority as" }
      object:
        concrete: "one term inside the cost, not a way to jump the queue"
        abstract: "a weighting input to cost rather than an override of the computed route"
      lock: "a stated priority never reorders the route on its own authority."
    - ground: recompute
      subject: { low: "the route", mid: "the route", high: "you" }
      modal:   { low: "can recompute", mid: "should recompute", high: "must recompute" }
      object:
        concrete: "whenever a subtask's cost changes — including when one finishes early"
        abstract: "on any cost change in the topology, converging before the plan is acted on further"
      figure:
        concrete: "the moment a link cost changes, the way a network reconverges after a flap"
        abstract: "on topology change, converging before the plan is acted on again"
      rider: "an unreachable subtask is reported as unreachable rather than routed around silently."
---
