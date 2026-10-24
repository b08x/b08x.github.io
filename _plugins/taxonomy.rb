# frozen_string_literal: true

# Generates the tag and category groupings:
#
#   /tags/<slug>/         one page per tag
#   /tags/                index of every tag with counts
#   /categories/<slug>/   one page per category
#   /categories/          index of every category with counts
#
# Tags and categories are read from front matter across the four content
# collections (posts, notes, projects, personas). Slugs come from
# Jekyll::Utils.slugify — the exact function the Liquid `slugify` filter
# runs, so hrefs built in layouts always match the generated dirs.
#
# Pages render through _layouts/taxonomy.html, which reads:
#   page.taxonomy_index     true on the /tags/ and /categories/ indexes
#   page.taxonomy_type      "tag" | "category"
#   page.taxonomy_key       the raw tag/category name (non-index pages)
#   page.taxonomy_count     document count (non-index pages)
#   page.taxonomy_groups    [{ "label" => "Writing", "docs" => [...] }, ...]
#   page.taxonomy_entries   [{ "key" =>, "slug" =>, "count" => }, ...] (index pages)
module Taxonomy
  # collection label => group heading, in display order
  GROUPS = {
    "posts"    => "Writing",
    "notes"    => "Notes",
    "projects" => "Projects",
    "personas" => "Personas",
  }.freeze

  class Generator < Jekyll::Generator
    safe true
    priority :low

    def generate(site)
      by_tag  = Hash.new { |h, k| h[k] = [] }
      by_cat  = Hash.new { |h, k| h[k] = [] }

      GROUPS.each_key do |label|
        collection = site.collections[label]
        next unless collection

        collection.docs.each do |doc|
          Array(doc.data["tags"]).each       { |tag| by_tag[tag] << doc }
          Array(doc.data["categories"]).each { |cat| by_cat[cat] << doc }
        end
      end

      build_pages(site, "tags", "tag", by_tag)
      build_pages(site, "categories", "category", by_cat)
      build_index(site, "tags", "tag", by_tag)
      build_index(site, "categories", "category", by_cat)
    end

    private

    def build_pages(site, base, type, hash)
      hash.each do |key, docs|
        slug = slugify(key)
        next unless slug

        page = new_page(site, "#{base}/#{slug}")
        page.data.merge!(
          "layout"          => "taxonomy",
          "title"           => type == "tag" ? "##{key}" : key.to_s,
          "taxonomy_type"   => type,
          "taxonomy_key"    => key,
          "taxonomy_slug"   => slug,
          "taxonomy_count"  => docs.size,
          "taxonomy_groups" => groups_for(docs),
          "description"     => "#{docs.size} #{docs.size == 1 ? 'entry' : 'entries'} #{type == 'tag' ? "tagged ##{key}" : "in category #{key}"}."
        )
        site.pages << page
      end
    end

    def build_index(site, base, type, hash)
      entries = hash
                .map { |key, docs| { "key" => key.to_s, "slug" => slugify(key), "count" => docs.size } }
                .select { |e| e["slug"] }
                .sort_by { |e| [e["key"].downcase, -e["count"]] }

      page = new_page(site, base)
      page.data.merge!(
        "layout"            => "taxonomy",
        "title"             => type == "tag" ? "Tags" : "Categories",
        "taxonomy_index"    => true,
        "taxonomy_type"     => type,
        "taxonomy_entries"  => entries,
        "description"       => "Every #{type} used across the site, with counts."
      )
      site.pages << page
    end

    # One entry per non-empty collection, in GROUPS order, each sorted:
    # writing newest-first, everything else A–Z.
    def groups_for(docs)
      GROUPS.filter_map do |label, heading|
        group = docs.select { |d| d.collection.label == label }
        next if group.empty?

        { "label" => heading, "docs" => sort_docs(label, group) }
      end
    end

    def sort_docs(label, docs)
      if label == "posts"
        docs.sort_by { |d| d.data["date"] || Time.at(0) }.reverse
      else
        docs.sort_by { |d| (d.data["title"] || d.relative_path).to_s.downcase }
      end
    end

    def slugify(key)
      slug = Jekyll::Utils.slugify(key.to_s)
      slug unless slug.nil? || slug.empty?
    end

    def new_page(site, dir)
      page = Jekyll::PageWithoutAFile.new(site, site.source, dir, "index.html")
      page.content = ""
      # jekyll-last-modified-at attaches a Determinator at :pages, :post_init
      # that stats page.path on disk when the sitemap template evaluates it; a
      # generated page has no source file, so drop it (nil renders as absent).
      page.data["last_modified_at"] = nil
      page
    end
  end
end
