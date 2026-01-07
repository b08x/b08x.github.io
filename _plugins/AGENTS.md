# _plugins/ - Custom Jekyll Plugins

11 Ruby plugins extending Jekyll functionality for digital garden features.

## STRUCTURE

```
_plugins/
├── wiki_page_generator.rb           # Wiki pagination system (352 LOC)
├── bidirectional_links_generator.rb # [[wikilink]] conversion (114 LOC)
├── obsidian_callouts.rb             # Obsidian callout syntax
├── empty_front_matter_note_injector.rb # Auto front matter
├── last_modified_at_generator.rb    # File mod dates
├── markdown-highlighter.rb          # Enhanced highlighting
├── open_external_links_in_new_tab.rb # External link handling
├── embed_tweets.rb                  # Twitter embeds
├── render_liquid.rb                 # Liquid in content
├── base64_filter.rb                 # Base64 encoding filter
└── jekyll-react-player.rb           # React player integration
└── jekyll/react-player/             # Plugin submodule
```

## WHERE TO LOOK

| Task | File | Notes |
|------|------|-------|
| Wiki pagination | `wiki_page_generator.rb` | ITEMS_PER_PAGE=12, generates `/wikis/{id}/page/{n}/` |
| Add reserved slug | `wiki_page_generator.rb:13` | RESERVED_SLUGS array |
| Change items/page | `wiki_page_generator.rb:12` | ITEMS_PER_PAGE constant |
| Bidirectional links | `bidirectional_links_generator.rb` | Outputs `_includes/notes_graph.json` |
| Obsidian syntax | `obsidian_callouts.rb` | `> [!type]` blocks |

## CONVENTIONS

**Plugin Types:**
- `Generator` - Creates pages/files during build
- `Converter` - Transforms content markup
- `Filter` - Liquid template filters

**Generator Pattern:**
```ruby
module Jekyll
  class MyGenerator < Generator
    safe true
    priority :low  # or :normal, :high

    def generate(site)
      # Access site.data, site.collections, site.pages
    end
  end
end
```

**Config Access:** `site.config['my_plugin_key']` - define in `_config.yml`

## ANTI-PATTERNS

- **NEVER** modify files in `_wikis/` manually - generator overwrites
- **NEVER** use slugs matching `RESERVED_SLUGS` for wiki pages
- **AVOID** expensive operations in converters (runs per-file)
- **AVOID** direct file I/O outside designated directories

## KEY BEHAVIORS

**wiki_page_generator.rb:**
- Reads `_data/wikis/{id}.json`
- Generates individual pages: `/wikis/{id}/{num}-{slug}/`
- Generates index pages: `/wikis/{id}/`, `/wikis/{id}/page/{n}/`
- Transforms ````mermaid` → ````mermaid!` for jekyll-spaceship
- Prepends repo URLs to source file links

**bidirectional_links_generator.rb:**
- Converts `[[Note Title]]` → `<a class="internal-link">` 
- Creates backlinks array in note data
- Outputs graph JSON for `GraphView` component

## ENABLE/DISABLE

Wiki generator controlled via `_config.yml`:
```yaml
wiki_page_generator:
  enabled: false  # Set true to regenerate
```
