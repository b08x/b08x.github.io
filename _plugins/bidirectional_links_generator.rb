# frozen_string_literal: true
class BidirectionalLinksGenerator < Jekyll::Generator
  def generate(site)
    graph_nodes = []
    graph_edges = []

    all_items = site.collections['items'].docs
    all_pages = site.pages

    all_docs = all_items + all_pages

    link_extension = !!site.config["use_html_extension"] ? '.html' : ''

    # Convert all Wiki/Roam-style double-bracket link syntax to plain HTML
    # anchor tag elements (<a>) with "internal-link" CSS class
    all_docs.each do |current_item|
      all_docs.each do |item_potentially_linked_to|
        item_title_regexp_pattern = Regexp.escape(
          File.basename(
            item_potentially_linked_to.basename,
            File.extname(item_potentially_linked_to.basename)
          )
        ).gsub('\_', '[ _]').gsub('\-', '[ -]').capitalize
        title_from_data = item_potentially_linked_to.data['title']
        if title_from_data
          title_from_data = Regexp.escape(title_from_data)
        end
        new_href = "#{site.baseurl}#{item_potentially_linked_to.url}#{link_extension}"
        anchor_tag = "<a class='internal-link' href='#{new_href}'>\\1</a>"

        # Replace double-bracketed links with label using item title
        # [[A item about cats|this is a link to the item about cats]]
        current_item.content.gsub!(
          /\[\[#{item_title_regexp_pattern}\|(.+?)(?=\])\]\]/i,
          anchor_tag
        )

        # Replace double-bracketed links with label using item filename
        # [[cats|this is a link to the item about cats]]
        current_item.content.gsub!(
          /\[\[#{title_from_data}\|(.+?)(?=\])\]\]/i,
          anchor_tag
        )

        # Replace double-bracketed links using item title
        # [[a item about cats]]
        current_item.content.gsub!(
          /\[\[(#{title_from_data})\]\]/i,
          anchor_tag
        )

        # Replace double-bracketed links using item filename
        # [[cats]]
        current_item.content.gsub!(
          /\[\[(#{item_title_regexp_pattern})\]\]/i,
          anchor_tag
        )
      end

      #TODO: account for links to images and/or other media

      # At this point, all remaining double-bracket-wrapped words are
      # pointing to non-existing pages, so let's turn them into disabled
      # links by greying them out and changing the cursor
      current_item.content = current_item.content.gsub(
        /\[\[([^\]]+)\]\]/i, # match on the remaining double-bracket links
        <<~HTML.delete("\n") # replace with this HTML (\\1 is what was inside the brackets)
          <span title='There is no item that matches this link.' class='invalid-link'>
            <span class='invalid-link-brackets'>[[</span>
            \\1
            <span class='invalid-link-brackets'>]]</span></span>
        HTML
      )
    end

    # Identify item backlinks and add them to each item
    all_items.each do |current_item|
      # Nodes: Jekyll
      items_linking_to_current_item = all_items.filter do |e|
        e.content.include?(current_item.url)
      end

      # Nodes: Graph
      graph_nodes << {
        id: item_id_from_item(current_item),
        path: "#{site.baseurl}#{current_item.url}#{link_extension}",
        label: current_item.data['title'],
      } unless current_item.path.include?('_items/index.html')

      # Edges: Jekyll
      current_item.data['backlinks'] = items_linking_to_current_item

      # Edges: Graph
      items_linking_to_current_item.each do |n|
        graph_edges << {
          source: item_id_from_item(n),
          target: item_id_from_item(current_item),
        }
      end
    end

    File.write('_includes/items_graph.json', JSON.dump({
      edges: graph_edges,
      nodes: graph_nodes,
    }))
  end

  def item_id_from_item(item)
    item.data['title'].bytes.join
  end
end
