# frozen_string_literal: true

require 'gum'
require 'kreuzberg'
require 'image_processing/vips'
require 'fileutils'

module SharedTools
  module TUI
    def self.input(placeholder:, value: nil)
      Gum.input(placeholder: placeholder, value: value)
    end

    def self.confirm(text)
      Gum.confirm(text)
    end

    def self.choose(options, header: nil)
      Gum.choose(options, header: header)
    end

    def self.write(placeholder)
      # gum-ruby doesn't seem to have a direct .write method in the snippets
      # but it's usually just a thin wrapper. If it's missing, we fall back to CLI.
      if Gum.respond_to?(:write)
        Gum.write(placeholder: placeholder)
      else
        `gum write --placeholder "#{placeholder}" --width 80 --height 10`.strip
      end
    end

    def self.spin(title, &block)
      if Gum.respond_to?(:spin)
        # Ensure the block result is returned through the spin call
        result = nil
        Gum.spin(title) do
          result = yield if block_given?
        end
        result
      else
        puts "[TUI] #{title}..."
        yield if block_given?
      end
    end

    def self.choose_provider
      choose(["OpenRouter", "Mistral"], header: "Select Provider")
    end
  end

  module Media
    def self.parse_pdf(path)
      return nil unless File.exist?(path) && File.extname(path).downcase == '.pdf'
      
      config = Kreuzberg::Config::Extraction.new(
        use_cache: true,
        enable_quality_processing: true,
        ocr: Kreuzberg::Config::OCR.new(
          backend: "tesseract",
          language: "eng",
          tesseract_config: Kreuzberg::Config::Tesseract.new(psm: 6)
        )
      )
      
      begin
        result = Kreuzberg.extract_file_sync(path: path, config: config)
        result.content
      rescue => e
        puts "[ERROR] PDF parsing failed: #{e.message}"
        ""
      end
    end

    def self.optimize_image(path, width = 1024, height = 1024)
      return nil unless File.exist?(path)
      
      ImageProcessing::Vips
        .source(path)
        .resize_to_limit(width, height)
        .convert("jpg")
        .call
    end
  end
end
