---
---


Since there are 5 possibilities for each parameter, and we want to explore all combinations, this results in:

5 * 5 * 5 * 5 = 625

temp 0
top p 0
presence 0
frequency 0


```ruby
# Define ranges for each parameter
temp_range = (-2..2).to_a 
top_p_range = (-2..2).to_a
presence_range = (-2..2).to_a
frequency_range = (-2..2).to_a

# Method to test each combination
def test_combination(temp, top_p, presence, frequency)
  # Code to test combination
  puts "Testing: temp=#{temp}, top_p=#{top_p}, presence=#{presence}, frequency=#{frequency}"
end

# Iterate through all combinations
temp_range.each do |temp|
  top_p_range.each do |top_p|
    presence_range.each do |presence|
      frequency_range.each do |frequency|
        
        # Test each combination
        test_combination(temp, top_p, presence, frequency)
        
      end
    end
  end
end

```

if a class is necessary:

```ruby
class ParameterCombinationTester

	attr_accessor :prompt, :response

  def initialize(temp_range, top_p_range, presence_range, frequency_range, prompt)
    @temp_range = temp_range
    @top_p_range = top_p_range 
    @presence_range = presence_range
    @frequency_range = frequency_range
    @prompt = prompt
    @response = {}
  end

  def test_all_combinations
    @temp_range.each do |temp|
      @top_p_range.each do |top_p| 
        @presence_range.each do |presence|
          @frequency_range.each do |frequency|
            
            test_combination(temp, top_p, presence, frequency)
            
          end
        end
      end
    end
  end

  private
  
  def test_combination(temp, top_p, presence, frequency)
    # Test code here
  end

end

# create folder for test results
# cli-ui test name
# prompt - prompt template file

tester = ParameterCombinationTester.new(-2..2, -2..2, -2..2, -2..2)
tester.test_all_combinations
```