#!/usr/bin/env ruby
# frozen_string_literal: true

require 'ruby_llm'
require 'ruby_llm/schema'
require 'json'
require 'net/http'
require 'uri'
require 'fileutils'
require 'yaml'
require_relative 'utils/shared_tools'

# Syncopated Notes - Liminal Deck Wizard (SharedTools Edition)
# Generates macro-typographic slide decks via OpenRouter/Mistral
# Powered by SharedTools, Kreuzberg, and ImageProcessing.

# Load environment variables if available
begin
  require 'dotenv'
  Dotenv.load
rescue LoadError
  # Dotenv not installed, assuming ENV is already populated
end

# Configure RubyLLM
RubyLLM.configure do |config|
  config.openrouter_api_key = ENV['OPENROUTER_API_KEY']
  config.mistral_api_key = ENV['MISTRAL_API_KEY']
end

def fetch_openrouter_models
  uri = URI("https://openrouter.ai/api/v1/models")
  begin
    response = Net::HTTP.get(uri)
    data = JSON.parse(response)
    models = data['data'].map { |m| m['id'] }
    
    priority = [
      "deepseek/deepseek-r1",
      "openai/o3-mini",
      "openai/gpt-4o",
      "anthropic/claude-3.5-sonnet",
      "google/gemini-pro-1.5",
      "mistralai/mistral-large-2411"
    ]
    
    (priority & models) + (models - priority).first(50)
  rescue => e
    puts "Warning: Could not fetch models from OpenRouter (#{e.message}). Using defaults."
    ["deepseek/deepseek-r1", "openai/gpt-4o", "anthropic/claude-3.5-sonnet", "google/gemini-pro-1.5"]
  end
end

class SlideDeckSchema < RubyLLM::Schema
  array :slides do
    object do
      string :title
      string :subtitle, required: false
      string :author, required: false
      string :date, required: false
      array :tags, of: :string, required: false
      string :content # HTML fragments
    end
  end
end

def main
  puts "─── LIMINAL DECK WIZARD (ELITE) ───"
  
  title = SharedTools::TUI.gum(:input, ["--placeholder 'Presentation Title'"])
  exit if title.empty?
  
  media_path = SharedTools::TUI.gum(:input, ["--placeholder 'Optional: Path to PDF (Text) or Image (Vision) source'"])
  
  extracted_context = ""
  processed_media = nil

  if !media_path.empty? && File.exist?(media_path)
    ext = File.extname(media_path).downcase
    
    if ext == ".pdf"
      SharedTools::TUI.spin("Parsing PDF via Kreuzberg") do
        extracted_context = SharedTools::Media.parse_pdf(media_path)
        puts "[SYSTEM] Extracted #{extracted_context&.length || 0} characters from PDF."
      end
    elsif [".jpg", ".jpeg", ".png", ".webp"].include?(ext)
      SharedTools::TUI.spin("Optimizing image for vision") do
        processed_media = SharedTools::Media.optimize_image(media_path)
        puts "[SYSTEM] Image ready for multimodal analysis."
      end
    end
  end

  context_prompt = SharedTools::TUI.write("Refine presentation context or paste source text...")
  context = "#{extracted_context}\n\n#{context_prompt}".strip
  
  if context.empty?
    puts "[ERROR] No context provided. Exit."
    exit 1
  end
  
  slide_count_input = SharedTools::TUI.gum(:input, ["--placeholder 'Number of slides (default: 5)'", "--value 5"])
  slide_count = slide_count_input.to_i > 0 ? slide_count_input.to_i : 5
  
  provider_choice = SharedTools::TUI.gum(:choose, ["OpenRouter", "Mistral"])
  
  model = ""
  
  if provider_choice == "OpenRouter"
    puts "Fetching latest models from OpenRouter..."
    models = fetch_openrouter_models
    model = `echo "#{models.join("\n")}" | gum filter --placeholder "Select Model"`.strip
  else
    model = SharedTools::TUI.gum(:choose, ["mistral-large-latest", "mistral-small-latest", "pixtral-large-latest"])
  end

  chat = RubyLLM.chat(model: model)
  
  system_prompt = <<~PROMPT
    You are a professional presentation architect specializing in macro-typographic design.
    Generate a slide deck based on the provided context.
    
    DESIGN RULES:
    1. Titles must be bold, high-impact statements (uppercase preferred).
    2. Subtitles should provide clear context in sans-serif style.
    3. Content must be HTML fragments (<ul>, <li>, <p>) using Tailwind classes.
    4. Keep content minimal and high-contrast.
    5. Tags should be 1-3 uppercase keywords.
    6. Author should be "B08X_SYSTEMS".
    
    Output exactly #{slide_count} slides.
  PROMPT

  full_prompt = "Title: #{title}\nContext: #{context}"
  
  puts "\n[SYSTEM] Generating slides via #{model}..."
  
  begin
    query = chat.with_schema(SlideDeckSchema)
    
    if processed_media && model =~ /vl|gpt-4o|claude|gemini|pixtral/i
      response = query.ask([
        { role: 'system', content: system_prompt },
        { role: 'user', content: full_prompt }
      ], with: processed_media)
    else
      response = query.ask([
        { role: 'system', content: system_prompt },
        { role: 'user', content: full_prompt }
      ])
    end
    
    result = response.content
    
    if result && result['slides']
      slug = title.downcase.gsub(/[^a-z0-9]+/, '-')
      file_path = "pages/#{slug}.md"
      
      yaml_data = {
        "layout" => "liminal-deck",
        "title" => title,
        "permalink" => "/#{slug}/",
        "slides" => result['slides']
      }
      
      File.write(file_path, "#{yaml_data.to_yaml}---\n")
      
      puts "\n✅ SUCCESS: Deck generated at #{file_path}"
      puts "🔗 URL: /#{slug}/"
      
      if SharedTools::TUI.gum(:confirm, ["Open the file for review?"]) == "true"
        system("code #{file_path}") || system("vim #{file_path}")
      end
    else
      puts "\n❌ ERROR: Failed to generate structured slide data."
      p result
    end
  rescue => e
    puts "\n❌ CRITICAL ERROR: #{e.message}"
    puts e.backtrace.first(5)
  end
end

main if __FILE__ == $0
