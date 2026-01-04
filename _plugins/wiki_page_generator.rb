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
      
      config = site.config['wiki_page_generator'] || {}
      enabled = config['enabled'] != false

      site.data['wikis'].each do |wiki_id, wiki_data|
        next unless wiki_data['pages']

        # Pre-calculate permalinks for all pages in this wiki
        pages = wiki_data['pages']
        permalink_map = {}
        pages.each_with_index do |page_data, index|
          page_id = page_data['id']
          slug = validate_slug(Jekyll::Utils.slugify(page_id))
          num = (index + 1).to_s.rjust(2, '0')
          permalink_info = {
            'slug' => slug,
            'number' => num,
            'permalink' => "/wikis/#{wiki_id}/#{num}-#{slug}/"
          }
          permalink_map[page_id] = permalink_info
          
          # Enrich the original data for use in layouts (ALWAYS DO THIS)
          page_data['number'] = num
          page_data['slug'] = slug
          page_data['generated_permalink'] = permalink_info['permalink']
        end

        # Skip actual file generation if disabled
        unless enabled
          Jekyll.logger.info "WikiPageGenerator:", "Skipping file generation for '#{wiki_id}' as it is disabled in _config.yml"
          next
        end

        # Metadata for the wiki
        repo_url = wiki_data.dig('metadata', 'repository')

        # Generate individual wiki pages
        pages.each_with_index do |page_data, index|
          prev_page = index > 0 ? pages[index - 1] : nil
          next_page = index < pages.length - 1 ? pages[index + 1] : nil
          
          generate_page(site, wiki_id, page_data, prev_page, next_page, permalink_map, repo_url)
        end

        # Generate paginated index pages
        generate_paginated_index(site, wiki_id, wiki_data, permalink_map)

        # Cleanup old structure if it exists
        cleanup_old_directories(site, wiki_id, permalink_map.values.map { |v| v['slug'] })
      end
    end

    private

    # ========================================
    # INDIVIDUAL PAGE GENERATION
    # ========================================

    def generate_page(site, wiki_id, page_data, prev_page, next_page, permalink_map, repo_url)
      page_info = permalink_map[page_data['id']]
      slug = page_info['slug']
      num = page_info['number']
      permalink = page_info['permalink']
      
      title = page_data['title']
      content_body = page_data['content'] || ""

      # Transformations for jekyll-spaceship
      content_body = content_body.gsub(/```mermaid\b/, '```mermaid!')
      content_body = content_body.gsub(/```plantuml\b/, '```plantuml!')

      # Prepend repository address to inline source links like [path.py:L10-L20]()
      if repo_url
        clean_repo_url = repo_url.chomp('/')
        content_body = content_body.gsub(/\[([^\]]+\.(?:py|md|sh|rb|js|ts|tsx|json|html|yml)(?::#?L[^\]]*)?)\]\(\)/) do |_match|
          path_and_line = Regexp.last_match(1)
          # Split path and line if present (e.g., path.py:#L10-L20 or path.py:L10-L20)
          path, line = path_and_line.split(':', 2)
          
          if line
            # GitHub uses #L1-L2 format. Ensure it starts with #L
            clean_line = line.gsub(/^#?L?/, '#L')
            full_path = "#{path}#{clean_line}"
          else
            full_path = path
          end
          
          "[#{path_and_line}](#{clean_repo_url}/blob/main/#{full_path})"
        end
      end

      # Ensure blank lines before and after headers if missing
      content_body = content_body.gsub(/^(#+ .*)(\n)([^#\n])/, "\\1\n\n\\3")
      
      # Ensure blank lines before tables only if not already part of a table
      content_body = content_body.gsub(/([^\n|])\n\|/, "\\1\n\n|")

      dir = File.join('wikis', wiki_id)
      filename = "#{num}_#{slug}.md"
      path = File.join(site.source, dir, filename)

      # Ensure the directory exists
      FileUtils.mkdir_p(File.join(site.source, dir))

      # Metadata
      related_pages_raw = page_data['relatedPages'] || []
      related_pages = related_pages_raw.map do |rp_id|
        info = permalink_map[rp_id]
        if info
          { 'id' => rp_id, 'url' => info['permalink'], 'title' => rp_id.split('-').map(&:capitalize).join(' ') }
        else
          { 'id' => rp_id }
        end
      end

      # Prepend repository address to source file links
      file_paths_raw = page_data['filePaths'] || []
      file_paths = file_paths_raw.map do |fp|
        if repo_url && !fp.empty?
          # Assuming GitHub format for now: repo_url/blob/main/path
          # We check if it's already a full URL just in case
          if fp.start_with?('http')
            { 'path' => fp, 'url' => fp }
          else
            clean_repo_url = repo_url.chomp('/')
            full_url = "#{clean_repo_url}/blob/main/#{fp}"
            { 'path' => fp, 'url' => full_url }
          end
        else
          { 'path' => fp }
        end
      end

      # Pagination metadata for individual page
      pagination_data = {}
      if prev_page
        prev_info = permalink_map[prev_page['id']]
        pagination_data['previous'] = {
          'title' => "#{prev_info['number']}-#{prev_info['slug']}",
          'url' => prev_info['permalink']
        }
      end
      if next_page
        next_info = permalink_map[next_page['id']]
        pagination_data['next'] = {
          'title' => "#{next_info['number']}-#{next_info['slug']}",
          'url' => next_info['permalink']
        }
      end

      # Front matter content
      front_matter = {
        'layout' => 'wiki-page',
        'title' => title,
        'wiki_id' => wiki_id,
        'page_id' => page_data['id'],
        'permalink' => permalink,
        'repository' => repo_url,
        'left_sidebar' => 'wiki-nav',
        'right_sidebar' => 'toc',
        'right_sidebar_xl_only' => true,
        'show_metadata' => false,
        'show_graph' => false,
        'related_pages' => related_pages,
        'file_paths' => file_paths,
        'pagination' => pagination_data
      }

      # Combine front matter and content
      file_content = "#{front_matter.to_yaml}---\n\n#{content_body}"

      # Write the file
      File.write(path, file_content)
    end

    # ========================================
    # PAGINATED INDEX GENERATION (NEW)
    # ========================================

    def generate_paginated_index(site, wiki_id, wiki_data, permalink_map)
      pages = wiki_data['pages']
      metadata = wiki_data['metadata'] || {}

      Jekyll.logger.info "WikiPageGenerator:", "Generating paginated index for '#{wiki_id}' (#{pages.length} pages)"

      segments = calculate_pagination_segments(pages, ITEMS_PER_PAGE)
      total_pages = segments.length

      Jekyll.logger.debug "WikiPageGenerator:", "Created #{total_pages} pagination segment(s)"

      segments.each_with_index do |segment, index|
        page_num = index + 1
        write_paginated_page(site, wiki_id, segment, page_num, total_pages, metadata, permalink_map)
        Jekyll.logger.debug "WikiPageGenerator:", "Generated page #{page_num}/#{total_pages} for '#{wiki_id}'"
      end

      Jekyll.logger.info "WikiPageGenerator:", "Completed index generation for '#{wiki_id}'"
    end

    def calculate_pagination_segments(pages, per_page)
      return [] if pages.nil? || pages.empty?
      pages.each_slice(per_page).to_a
    end

    def write_paginated_page(site, wiki_id, segment, page_num, total_pages, wiki_metadata, permalink_map)
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

      page_items = segment.map do |page_data|
        page_id = page_data['id']
        page_info = permalink_map[page_id]

        {
          'id' => page_id,
          'title' => page_data['title'],
          'number' => page_info['number'],
          'slug' => page_info['slug'],
          'importance' => page_data['importance'] || 'medium',
          'excerpt' => extract_excerpt(page_data['content']),
          'url' => page_info['permalink']
        }
      end

      # Build complete front matter
      front_matter = {
        'layout' => 'wiki',
        'title' => "#{wiki_id.split('-').map(&:capitalize).join(' ')} Wiki",
        'wiki_id' => wiki_id,
        'permalink' => permalink,
        'pagination' => pagination_meta,
        'show_graph' => false,
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

    def cleanup_old_directories(site, wiki_id, slugs)
      wiki_dir = File.join(site.source, 'wikis', wiki_id)
      return unless Dir.exist?(wiki_dir)

      slugs.each do |slug|
        slug_dir = File.join(wiki_dir, slug)
        if Dir.exist?(slug_dir)
          Jekyll.logger.info "WikiPageGenerator:", "Cleaning up old directory: #{slug_dir}"
          FileUtils.rm_rf(slug_dir)
        end
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
