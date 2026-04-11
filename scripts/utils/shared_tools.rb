# frozen_string_literal: true

require 'kreuzberg'
require 'image_processing/vips'
require 'fileutils'
require 'shellwords'

module SharedTools
  module TUI
    def self.gum(command, args = [])
      # Properly escape arguments to prevent shell injection and handle spaces
      escaped_args = args.map { |a| Shellwords.escape(a.to_s) }.join(' ')
      `gum #{command} #{escaped_args}`.strip
    end

    def self.write(placeholder)
      `gum write --placeholder #{Shellwords.escape(placeholder)} --width 80 --height 10`.strip
    end

    def self.spin(title, &block)
      # Gum spin is tricky with Ruby blocks, so we'll just print a status
      puts "[TUI] #{title}..."
      yield if block_given?
    end
  end

  module Media
    def self.parse_pdf(path)
      return nil unless File.exist?(path) && File.extname(path).downcase == '.pdf'
      
      # Configure for high-fidelity extraction with OCR fallback for scanned docs
      config = Kreuzberg::Config::Extraction.new(
        use_cache: true,
        enable_quality_processing: true,
        ocr: Kreuzberg::Config::OCR.new(
          backend: "tesseract",
          language: "eng", # Default to English
          tesseract: Kreuzberg::Config::Tesseract.new(psm: 6)
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
