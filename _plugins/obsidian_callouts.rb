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
  # Updated to capture everything until </blockquote>
  doc.output = doc.output.gsub(%r{<blockquote>\s*<p>\[!(\w+)\](.*?)</p>(.*?)\s*</blockquote>}m) do
    callout_type = Regexp.last_match(1).downcase
    title_line = Regexp.last_match(2).strip
    remaining_content = Regexp.last_match(3).strip

    # Split title and content from first paragraph if <br> exists
    if title_line =~ %r{^(.*?)<br\s*/?>(.*)$}m
      title_text = $1.strip
      extra_content = $2.strip
    else
      title_text = title_line
      extra_content = ""
    end

    # Use type as title if no custom title provided
    title = title_text.empty? ? callout_type.capitalize : title_text

    # Combine extra content from first paragraph with remaining blockquote content
    full_content = [extra_content, remaining_content].reject(&:empty?).join("\n")

    # Build callout HTML structure
    <<~HTML
      <div class="callout" data-callout="#{callout_type}">
        <div class="callout-title">
          <div class="callout-icon"></div>
          <div class="callout-title-inner">#{title}</div>
        </div>
        <div class="callout-content">
          #{full_content}
        </div>
      </div>
    HTML
  end
end
