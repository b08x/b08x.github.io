# frozen_string_literal: true

require 'jekyll'
require 'fileutils'

module Jekyll
  class WikiPageGenerator < Generator
    safe true
    priority :low

    def generate(site)
      return unless site.data['wikis']

      site.data['wikis'].each do |wiki_id, wiki_data|
        next unless wiki_data['pages']

        wiki_data['pages'].each do |page_data|
          generate_page(site, wiki_id, page_data)
        end
      end
    end

    private

    def generate_page(site, wiki_id, page_data)
      page_id = page_data['id']
      title = page_data['title']
      content_body = page_data['content'] || ""
      
      # Transformations for jekyll-spaceship
      content_body = content_body.gsub(/```mermaid\b/, '```mermaid!')
      content_body = content_body.gsub(/```plantuml\b/, '```plantuml!')
      
      # Use Jekyll's Utils.slugify to ensure consistent slug generation
      slug = Jekyll::Utils.slugify(page_id)
      
      dir = File.join('wikis', wiki_id, slug)
      filename = 'index.md'
      path = File.join(site.source, dir, filename)

      # Ensure the directory exists
      FileUtils.mkdir_p(File.join(site.source, dir))

      # Metadata
      related_pages = page_data['relatedPages'] || []
      file_paths = page_data['filePaths'] || []

      # Front matter content
      front_matter = {
        'layout' => 'wiki-page',
        'title' => title,
        'wiki_id' => wiki_id,
        'page_id' => page_id,
        'permalink' => "/wikis/#{wiki_id}/#{slug}/",
        'left_sidebar' => 'wiki-nav',
        'right_sidebar' => 'toc',
        'right_sidebar_xl_only' => true,
        'show_metadata' => false,
        'show_graph' => false,
        'related_pages' => related_pages,
        'file_paths' => file_paths
      }

      # Combine front matter and content
      file_content = "#{front_matter.to_yaml}---\n\n#{content_body}"

      # Write the file
      File.write(path, file_content)
    end
  end
end
