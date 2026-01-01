# frozen_string_literal: true

# Converts Obsidian-style callouts to custom HTML
# Processes HTML blockquotes that contain [!type] syntax after rendering
# Example HTML input: <blockquote><p>[!info]<br>Content here</p></blockquote>

Jekyll::Hooks.register [:notes], :post_render do |doc|
  process_callouts(doc)
end

Jekyll::Hooks.register [:pages], :post_render do |doc|
  # Skip pages that aren't in _pages directory
  next unless doc.path.start_with?('_pages/')

  process_callouts(doc)
end

def process_callouts(doc)
  return unless doc.output

  # Match blockquotes containing callout syntax: <blockquote><p>[!type]...
  # Pattern handles various HTML formatting from markdown conversion
  doc.output = doc.output.gsub(%r{<blockquote>\s*<p>\[!(\w+)\](.*?)</p>\s*</blockquote>}m) do
    callout_type = Regexp.last_match(1).downcase
    inner_html = Regexp.last_match(2).strip

    # Split title and content based on <br> or newline
    if inner_html =~ %r{^(.*?)<br\s*/?>(.*)$}m
      title_text = $1.strip
      content_html = $2.strip
    elsif inner_html =~ %r{^(.*?)\n(.*)$}m
      title_text = $1.strip
      content_html = $2.strip
    else
      title_text = inner_html
      content_html = ""
    end

    # Use type as title if no custom title provided
    title = title_text.empty? ? callout_type.capitalize : title_text

    # Clean up the content HTML - remove extra whitespace
    content_html = content_html.gsub(/\s+/, ' ').strip

    # Build callout HTML structure
    <<~HTML
      <div class="callout" data-callout="#{callout_type}">
        <div class="callout-title">
          <div class="callout-icon"></div>
          <div class="callout-title-inner">#{title}</div>
        </div>
        <div class="callout-content">
          <p>#{content_html}</p>
        </div>
      </div>
    HTML
  end
end
