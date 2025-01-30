# frozen_string_literal: true

require 'fileutils'
require 'pathname'
require 'jekyll-last-modified-at'

module Recents
  # Generate change information for all markdown pages
  class Generator < Jekyll::Generator
    def generate(site)
      all_notes = site.collections['notes'].docs
      project_docs = site.collections['docs'].docs
      casts = site.collections['casts'].docs
      prompts = site.collections['prompts'].docs
      items = all_notes + project_docs + casts + prompts
      items.each do |page|
        timestamp = Jekyll::LastModifiedAt::Determinator.new(site.source, page.path, '%FT%T%:z').to_s
        page.data['last_modified_at_timestamp'] = timestamp
      end
    end
  end
end
