# frozen_string_literal: true

require 'json_canvas'
require 'json'

module Jekyll
  class JsonCanvasConverter < Converter
    safe true
    priority :low

    def matches(ext)
      ext.downcase == '.canvas'
    end

    def output_ext(_ext)
      '.json'
    end

    def convert(content)
      begin
        # Extract front matter if present (Jekyll might have already done this)
        # but Converter receives the content after front matter is stripped.
        
        # Parse using ongaeshi/json_canvas gem
        canvas = JsonCanvas.parse(content)
        
        # Access Jekyll site for rendering
        site = Jekyll.sites.first
        
        # Process nodes for Liquid and Markdown
        canvas.nodes.each do |node|
          if node.type == 'text' && node.text
            # 1. Render Liquid
            rendered_liquid = Liquid::Template.parse(node.text).render(site.site_payload, {registers: {site: site}})
            
            # 2. Render Markdown (optional, but good for pre-rendering)
            # We'll keep it as Markdown for the React component to handle for now, 
            # but we could convert to HTML here.
            node.text = rendered_liquid
          end
        end
        
        # The gem's to_json already produces a valid JSON Canvas string
        canvas.to_json
      rescue => e
        Jekyll.logger.error "JsonCanvasConverter Error:", e.message
        Jekyll.logger.error e.backtrace.join("\n")
        content
      end
    end
  end
end
