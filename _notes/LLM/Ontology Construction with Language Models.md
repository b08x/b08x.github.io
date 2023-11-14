---
layout: note
title: 
subtitle: 
category: 
tags: 
links:
  - https://arxiv.org/pdf/2309.09898.pdf
  - https://www.mdpi.com/2073-431X/12/1/14
---



![](/assets/img/screenshot/Pasted%20image%2020231112111232.png)




```ruby
# Algorithm 1: Concept Hierarchy Construction
Input: Seed concept 𝐶0 
𝐻 = concept hierarchy that only contains 𝐶0 

while there is an unexplored concept 𝐶 in 𝐻 do 
	ask LLM whether 𝐶 has subconcepts (“existence”) 
		if yes then 
			ask LLM to provide list 𝐿 of subconcepts of 𝐶 (“listing”) 
			ask LLM to provide descriptions of the concepts in 𝐿 (“description”) 
			forall 𝐷 ∈ 𝐿 do 
				ask LLM to verify that 𝐷 is a subconcept of 𝐶 (“verification”) 
					if successful then 
						insert 𝐷 into 𝐻 (“insertion”) 
return 𝐻 


```

```ruby
# Algorithm 1: Concept Hierarchy Construction
class ConceptHierarchyConstruction

  def initialize(seed_concept)
    @hierarchy = [seed_concept]
  end

  def construct_hierarchy
    unexplored_concepts = @hierarchy.clone

    while !unexplored_concepts.empty?
      current_concept = unexplored_concepts.pop
      existence = ask_llm_existence(current_concept)

      if existence
        subconcepts_list = ask_llm_listing(current_concept)
        descriptions = ask_llm_description(subconcepts_list)

        subconcepts_list.each do |subconcept|
          verification = ask_llm_verification(subconcept, current_concept)

          if verification
            @hierarchy << subconcept
            unexplored_concepts << subconcept
          end
        end
      end
    end

    @hierarchy
  end

  private

  def ask_llm_existence(concept)
    # Ask LLM whether concept has subconcepts (“existence”)
    # Implement logic to ask LLM
    # Subconcept existence: “Are there any generally accepted subcategories of 𝐶? Answer only with yes or no.” 
  end

  def ask_llm_listing(concept)
    # Ask LLM to provide list of subconcepts of concept (“listing”)
    # Implement logic to ask LLM
    # Subconcept listing: “List all of the most important subcategories of 𝐶. Skip explanations and use a comma-separated format like this: important subcategory, another important subcategory, another important subcategory, etc.” 
  end

  def ask_llm_description(concepts)
    # Ask LLM to provide descriptions of the concepts in the list
    # Implement logic to ask LLM
     # Subconcept existence: “Are there any generally accepted subcategories of 𝐶? Answer only with yes or no.” 
  end

  def ask_llm_verification(subconcept, concept)
    # Ask LLM to verify that subconcept is a subconcept of concept (“verification”)
    # Implement logic to ask LLM
  end
end
```

```
• Concept description: “Give a brief description of every term on the list, considered as a subcategory of 𝐶, without the use of examples, in the following form: List element 1: brief description for list element 1. List element 2: brief description for list element 2. . . . .”

```