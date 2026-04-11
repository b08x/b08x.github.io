module Jekyll
  module IslandHelper
    # Create a hash with a single key-value pair
    def to_hash(value, key)
      { key => value }
    end

    # Add a key-value pair to an existing hash
    def hash_set(hash, key, value)
      return { key => value } unless hash.is_a?(Hash)
      hash.merge(key => value)
    end

    # Transform projects collection into data for ProjectsIsland
    def to_project_data(projects)
      return [] unless projects.respond_to?(:map)
      projects.map do |p|
        {
          "id" => (p.data['slug'] || p.basename_without_ext).to_s,
          "title" => p.data['title'],
          "url" => p.url,
          "thumbnail" => p.data['image'] || "/assets/img/placeholder-project.jpg",
          "summary" => p.content.to_s.gsub(/<[^>]*>/, '').split(/\s+/).take(30).join(' '),
          "tags" => p.data['tags'] || [],
          "field" => p.data['field'] || "N/A",
          "tenor" => p.data['tenor'] || "N/A",
          "mode" => p.data['mode'] || "N/A"
        }
      end
    end

    # Transform notebook sub-notes for NotesGrid
    def to_notebook_data(notes)
      return [] unless notes.respond_to?(:map)
      notes.map do |n|
        {
          "id" => (n.data['slug'] || n.basename_without_ext).to_s,
          "title" => n.data['title'],
          "description" => n.data['description'],
          "url" => n.url,
          "citations" => n.data['citations'] || 0,
          "content" => n.content # Raw content, or we can use markdownify in Liquid before passing
        }
      end
    end

    # Parse JSON string back into hash/array
    def from_json(input)
      return nil if input.nil? || input.empty?
      begin
        JSON.parse(input)
      rescue JSON::ParserError
        input
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::IslandHelper)
