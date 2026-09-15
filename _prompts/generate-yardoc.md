---
title: "Generate YARDoc Comments"
tag: "ruby"
category: "Generator"
source: "PromptLibrary/01-Frameworks/SFL/prompts"
instructions: |
  Analyze Ruby source to establish what each class, module and method is for, then emit YARDoc comments covering it.

  Read for the overall purpose of classes and modules, each method's role and behaviour, full signatures including parameter names and types, return types and descriptions, raisable exceptions, inter-component dependencies, and any documentation style already present in the file.

  Emit class and module docs describing purpose and responsibilities, and method docs carrying @param per argument with type and description, @return with type and description, @raise for each exception, @example blocks showing typical use, and @see, @note, @todo or @deprecated where warranted. Match the existing documentation style where one is established.
example: |
  # Resolves a clause's interpersonal payload from a Pass 2 annotation.
  #
  # @param clause_id [String] identifier of the clause under annotation
  # @param weight [Float] modality weight in 0.0..1.0
  # @return [InterpersonalPayload] the coerced payload
  # @raise [Dry::Struct::Error] if weight falls outside the constraint
  # @example
  #   resolve("c-17", 0.8) #=> #<InterpersonalPayload …>
sfl:
  defaults: { tenor: 0.5, modality: 0.75, imagery: 0.05, abstraction: 0.4, novelty: 0.1 }
  ground:
    - id: signature
      gist: "Every documented method's tags match its real signature."
      anchors: []
    - id: house
      gist: "Existing documentation style in the file wins over the default style."
      anchors: []
    - id: noinvention
      gist: "Behaviour is read from the code, never inferred from the method name."
      anchors: []
---
