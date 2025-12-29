# frozen_string_literal: true

require 'jekyll'
require 'fileutils'

module Jekyll
  class WikiPageGenerator < Generator
    safe true
    priority :low

    # Configuration constants
    ITEMS_PER_PAGE = 12
    RESERVED_SLUGS = ['page'].freeze

    def generate(site)
      return unless site.data['wikis']

      site.data['wikis'].each do |wiki_id, wiki_data|
        next unless wiki_data['pages']

        # Generate individual wiki pages (existing functionality)
        wiki_data['pages'].each do |page_data|
          generate_page(site, wiki_id, page_data)
        end

        # Generate paginated index pages (new functionality)
        generate_paginated_index(site, wiki_id, wiki_data)
      end
    end

    private

    # ========================================
    # INDIVIDUAL PAGE GENERATION (UNCHANGED)
    # ========================================

    def generate_page(site, wiki_id, page_data)
      page_id = page_data['id']
      title = page_data['title']
      content_body = page_data['content'] || ""

      # Transformations for jekyll-spaceship
      content_body = content_body.gsub(/```mermaid\b/, '```mermaid!')
      content_body = content_body.gsub(/```plantuml\b/, '```plantuml!')

      # Use Jekyll's Utils.slugify to ensure consistent slug generation
      slug = validate_slug(Jekyll::Utils.slugify(page_id))

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

    # ========================================
    # PAGINATED INDEX GENERATION (NEW)
    # ========================================

    def generate_paginated_index(site, wiki_id, wiki_data)
      pages = wiki_data['pages']
      metadata = wiki_data['metadata'] || {}

      Jekyll.logger.info "WikiPageGenerator:", "Generating paginated index for '#{wiki_id}' (#{pages.length} pages)"

      segments = calculate_pagination_segments(pages, ITEMS_PER_PAGE)
      total_pages = segments.length

      Jekyll.logger.debug "WikiPageGenerator:", "Created #{total_pages} pagination segment(s)"

      segments.each_with_index do |segment, index|
        page_num = index + 1
        write_paginated_page(site, wiki_id, segment, page_num, total_pages, metadata)
        Jekyll.logger.debug "WikiPageGenerator:", "Generated page #{page_num}/#{total_pages} for '#{wiki_id}'"
      end

      Jekyll.logger.info "WikiPageGenerator:", "Completed index generation for '#{wiki_id}'"
    end

    def calculate_pagination_segments(pages, per_page)
      return [] if pages.nil? || pages.empty?
      pages.each_slice(per_page).to_a
    end

    def write_paginated_page(site, wiki_id, segment, page_num, total_pages, wiki_metadata)
      # Determine directory path
      if page_num == 1
        dir = File.join('wikis', wiki_id)
        permalink = "/wikis/#{wiki_id}/"
      else
        dir = File.join('wikis', wiki_id, 'page', page_num.to_s)
        permalink = "/wikis/#{wiki_id}/page/#{page_num}/"
      end

      filename = 'index.md'
      path = File.join(site.source, dir, filename)

      # Ensure the directory exists
      FileUtils.mkdir_p(File.join(site.source, dir))

      # Build pagination metadata
      pagination_meta = build_pagination_metadata(page_num, total_pages, wiki_id)

      # Build page items with enriched data
      page_items = segment.map do |page_data|
        page_id = page_data['id']
        slug = validate_slug(Jekyll::Utils.slugify(page_id))

        {
          'id' => page_id,
          'title' => page_data['title'],
          'slug' => slug,
          'importance' => page_data['importance'] || 'medium',
          'excerpt' => extract_excerpt(page_data['content']),
          'url' => "/wikis/#{wiki_id}/#{slug}/"
        }
      end

      # Build complete front matter
      front_matter = {
        'layout' => 'wiki',
        'title' => "#{wiki_id.split('-').map(&:capitalize).join(' ')} Wiki",
        'wiki_id' => wiki_id,
        'permalink' => permalink,
        'pagination' => pagination_meta,
        'repository' => wiki_metadata['repository'],
        'generated_at' => wiki_metadata['generated_at'],
        'total_wiki_pages' => wiki_metadata['page_count'],
        'pages' => page_items
      }

      # Generate content (minimal for index pages)
      content_body = "<!-- Paginated wiki index: page #{page_num} of #{total_pages} -->\n"

      # Combine front matter and content
      file_content = "#{front_matter.to_yaml}---\n\n#{content_body}"

      # Write the file
      File.write(path, file_content)
    end

    def build_pagination_metadata(page_num, total_pages, wiki_id)
      has_previous = page_num > 1
      has_next = page_num < total_pages

      previous_page_url = if has_previous
        page_num == 2 ? "/wikis/#{wiki_id}/" : "/wikis/#{wiki_id}/page/#{page_num - 1}/"
      else
        nil
      end

      next_page_url = if has_next
        "/wikis/#{wiki_id}/page/#{page_num + 1}/"
      else
        nil
      end

      {
        'enabled' => true,
        'current_page' => page_num,
        'total_pages' => total_pages,
        'per_page' => ITEMS_PER_PAGE,
        'has_previous' => has_previous,
        'has_next' => has_next,
        'previous_page_url' => previous_page_url,
        'next_page_url' => next_page_url
      }
    end

    def extract_excerpt(content, length = 200)
      return "" if content.nil? || content.empty?

      # Strip HTML tags
      stripped = content.gsub(/<\/?[^>]*>/, "")

      # Remove markdown syntax
      stripped = stripped.gsub(/```[a-z]*!?\n.*?\n```/m, "") # Code blocks
      stripped = stripped.gsub(/[*_`#\[\]()]/, "")           # Inline formatting
      stripped = stripped.gsub(/^\s*[-+*]\s+/, "")           # List markers
      stripped = stripped.gsub(/^\s*\d+\.\s+/, "")           # Numbered lists

      # Collapse whitespace
      stripped = stripped.gsub(/\s+/, " ").strip

      # Truncate to length
      if stripped.length > length
        stripped[0...length].gsub(/\s+\S*$/, "") + "..."
      else
        stripped
      end
    end

    def validate_slug(slug)
      if RESERVED_SLUGS.include?(slug)
        Jekyll.logger.warn "WikiPageGenerator:", "Page slug '#{slug}' conflicts with reserved keyword. Using '#{slug}-content' instead."
        return "#{slug}-content"
      end
      slug
    end
  end
end
