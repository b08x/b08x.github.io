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

# Syncopated Notes - Liminal Deck Wizard (Collection Edition)
# Generates macro-typographic slide decks as Jekyll Collections
# Powered by SharedTools, Kreuzberg, and ImageProcessing.

# Load environment variables
begin
  require 'dotenv'
  Dotenv.load
rescue LoadError
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
    priority = ["deepseek/deepseek-r1", "openai/o3-mini", "openai/gpt-4o", "anthropic/claude-3.5-sonnet"]
    (priority & models) + (models - priority).first(50)
  rescue => e
    ["deepseek/deepseek-r1", "openai/gpt-4o", "anthropic/claude-3.5-sonnet"]
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
  puts "─── LIMINAL DECK WIZARD (COLLECTION) ───"
  
  title = SharedTools::TUI.input(placeholder: "Presentation Title")
  exit if title.nil? || title.empty?
  
  deck_id = title.downcase.gsub(/[^a-z0-9]+/, '-')
  
  media_path = SharedTools::TUI.input(placeholder: "Optional: Path to PDF or Image")
  media_path ||= ""
  
  extracted_context = ""
  processed_media = nil

  if !media_path.empty? && File.exist?(media_path)
    ext = File.extname(media_path).downcase
    if ext == ".pdf"
      extracted_context = SharedTools::TUI.spin("Parsing PDF via Kreuzberg (OCR Enabled)") do
        SharedTools::Media.parse_pdf(media_path)
      end
      puts "[SYSTEM] Extracted #{extracted_context&.length || 0} characters from PDF."
    elsif [".jpg", ".jpeg", ".png", ".webp"].include?(ext)
      processed_media = SharedTools::TUI.spin("Optimizing image for vision") do
        SharedTools::Media.optimize_image(media_path)
      end
      puts "[SYSTEM] Image ready for multimodal analysis."
    end
  end

  context_prompt = SharedTools::TUI.write("Refine presentation context...")
  context = "#{extracted_context}\n\n#{context_prompt}".strip
  exit 1 if context.empty?
  
  slide_count_input = SharedTools::TUI.input(placeholder: "Number of slides", value: "5")
  slide_count = slide_count_input.to_i > 0 ? slide_count_input.to_i : 5
  
  provider = SharedTools::TUI.choose_provider
  model = if provider == "OpenRouter"
    # Fallback to direct CLI for filter as it's not in gum-ruby docs
    `echo "#{fetch_openrouter_models.join("\n")}" | gum filter --placeholder "Select Model"`.strip
  else
    SharedTools::TUI.choose(["mistral-large-latest", "pixtral-large-latest"], header: "Select Mistral Model")
  end

  puts "\n[SYSTEM] Generating slides via #{model}..."
  
  begin
    chat = RubyLLM.chat(model: model)
    query = chat.with_schema(SlideDeckSchema)
    
    prompt_payload = [
      { role: 'system', content: "Generate exactly #{slide_count} slides for a macro-typographic deck. Use HTML fragments for content." },
      { role: 'user', content: "Title: #{title}\nContext: #{context}" }
    ]

    response = processed_media ? query.ask(prompt_payload, with: processed_media) : query.ask(prompt_payload)
    result = response.content
    
    if result && result['slides']
      # 1. Create Deck Folder
      deck_dir = "_slides/#{deck_id}"
      FileUtils.mkdir_p(deck_dir)
      
      # 2. Generate Individual Slide Files
      result['slides'].each_with_index do |slide, index|
        order = (index + 1).to_s.rjust(2, '0')
        file_name = "#{order}_#{slide['title'].to_s.downcase.gsub(/[^a-z0-9]+/, '_')[0..30]}.md"
        file_path = File.join(deck_dir, file_name)
        
        # Defensive metadata normalization
        # AI models often return "" for optional fields; Jekyll collections require valid values or omission.
        clean_author = slide['author'].to_s.strip
        clean_author = "B08X_SYSTEMS" if clean_author.empty?

        clean_date = slide['date'].to_s.strip
        clean_date = Time.now.strftime("%Y-%m-%d") if clean_date.empty?

        clean_tags = slide['tags']
        clean_tags = [] if clean_tags.nil? || !clean_tags.is_a?(Array)
        clean_tags = clean_tags.map(&:to_s).reject(&:empty?)

        slide_meta = {
          "layout" => nil,
          "deck_id" => deck_id,
          "order" => index + 1,
          "title" => slide['title'].to_s,
          "subtitle" => slide['subtitle'].to_s,
          "author" => clean_author,
          "date" => clean_date,
          "tags" => clean_tags
        }
        
        File.write(file_path, "#{slide_meta.to_yaml}---\n#{slide['content']}")
      end
      
      # 3. Create Main Page
      page_path = "pages/#{deck_id}.md"
      page_meta = {
        "layout" => "liminal-deck",
        "title" => title,
        "deck_id" => deck_id,
        "permalink" => "/#{deck_id}/"
      }
      File.write(page_path, "#{page_meta.to_yaml}---")
      
      puts "\n✅ SUCCESS: #{slide_count} slides generated in #{deck_dir}"
      puts "🔗 URL: /#{deck_id}/"
      
      system("code #{deck_dir}") if SharedTools::TUI.confirm("Open folder?")
    end
  rescue => e
    puts "\n❌ ERROR: #{e.message}"
  end
end

main if __FILE__ == $0
