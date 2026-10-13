# frozen_string_literal: true

# Turns Obsidian-style callouts into real markup after Markdown rendering.
#
#   > [!warning] Title        -> <div class="callout" data-callout="warning">
#   > [!tip]- Title           -> <details class="callout"> (collapsed; "+" opens it)
#
# Kramdown renders the source as a plain <blockquote> whose first paragraph
# starts with the literal "[!type] Title". Styling lives in
# _includes/theme-tokens.html under "Callouts".
#
# The same hook wraps h2/h3 text in <span class="h-chip"> on post-layout pages,
# so the heading can be drawn as a tab sitting on a full-width rule.
module Callouts
  OPEN  = %r{<blockquote>\s*<p>\[!([A-Za-z]+)\]([+-]?)[ \t]*}
  TAGS  = %r{<blockquote>|</blockquote>}
  SPLIT = %r{\A(.*?)(<br\s*/?>\s*|</p>)(.*)\z}m
  LABELS = {
    'abstract' => 'Summary', 'btw' => 'Aside', 'fail' => 'Failure'
  }.freeze

  HEADING = %r{<h([23]) id="([^"]+)">(.*?)</h\1>}m

  module_function

  def chip_headings(html)
    html.gsub(HEADING) { %(<h#{$1} id="#{$2}"><span class="h-chip">#{$3}</span></h#{$1}>) }
  end

  def transform(html)
    out = +''
    pos = 0
    while (m = OPEN.match(html, pos))
      close = matching_close(html, m.begin(0))
      break unless close

      out << html[pos...m.begin(0)]
      out << render(m[1].downcase, m[2], html[m.end(0)...(close - '</blockquote>'.length)])
      pos = close
    end
    out << html[pos..]
  end

  # Index just past the </blockquote> that closes the one opening at +from+.
  def matching_close(html, from)
    depth = 0
    html.scan(TAGS) do
      i = Regexp.last_match.begin(0)
      next if i < from

      depth += Regexp.last_match[0] == '<blockquote>' ? 1 : -1
      return Regexp.last_match.end(0) if depth.zero?
    end
    nil
  end

  def render(type, fold, inner)
    title, body = split(inner)
    label = LABELS.fetch(type, type.capitalize)
    head = %(<span class="callout-label">#{label}</span>) +
           (title.empty? ? '' : %(<span class="callout-heading">#{title}</span>))
    return %(<div class="callout" data-callout="#{type}" role="note">\n<div class="callout-title">#{head}</div>\n<div class="callout-body">#{body}</div>\n</div>) if fold.empty?

    open_attr = fold == '+' ? ' open' : ''
    %(<details class="callout" data-callout="#{type}"#{open_attr}>\n<summary class="callout-title">#{head}</summary>\n<div class="callout-body">#{body}</div>\n</details>)
  end

  # The title is the first line; whatever follows is the body.
  def split(inner)
    m = SPLIT.match(inner)
    return [inner.strip.sub(%r{</p>\s*\z}, ''), ''] unless m

    body = m[2].start_with?('<br') ? "<p>#{m[3]}" : m[3]
    [m[1].strip, body.strip]
  end
end

Jekyll::Hooks.register %i[documents pages], :post_render do |doc|
  next unless doc.output_ext == '.html'

  doc.output = Callouts.transform(doc.output) if doc.output.include?('<blockquote>')
  doc.output = Callouts.chip_headings(doc.output) if doc.data['layout'] == 'post'
end
