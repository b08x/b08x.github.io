# frozen_string_literal: true

# Jekyll plugin to handle environment variables
module Jekyll
  class EnvironmentVariablesGenerator < Generator
    priority :highest

    def generate(site)
      # Set API key from environment
      site.config['gemini_api_key'] = ENV['GEMINI_API_KEY'] || ''

      # Log for debugging (remove in production)
      Jekyll.logger.info 'Environment',
                         "Gemini API Key configured: #{site.config['gemini_api_key'].empty? ? 'No' : 'Yes'}"
    end
  end
end
