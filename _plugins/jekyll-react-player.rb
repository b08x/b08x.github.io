# frozen_string_literal: true

module Jekyll
  module ReactPlayer
    VERSION = '0.21.2'
  end
end

require 'jekyll'
require 'uri'
require 'base64'
require 'json'

module Jekyll
  module ReactPlayer
    # Implements a Liquid tag for embedding react-player.
    class ReactPlayerTag < Liquid::Tag
      def render(_context)
        if (tag_contents = parse_tag(@markup.strip))
          url = tag_contents
          uri = URI.parse(url)
          id = uri.path.gsub("/","_")
          render_tag(id, url)
        else
          raise ArgumentError, <<-ERR_MSG.gsub(/^ {12}/, '')
            Syntax error in tag 'reactplayer' while parsing the following markup:

              #{@markup}

            Valid syntax:
              {% reactplayer https://example.com/asset %}
          ERR_MSG
        end
      end

      private

      def parse_tag(input)
        matched = input.match(/\s*?(https?:\/\/[\S]+)?\s*/)
        return matched[1].strip if matched.length >= 2
      end

      def render_tag(id, url)
        props = {
          url: url,
          playing: false,
          controls: true
        }
        encoded_props = Base64.strict_encode64(props.to_json)
        %(<div id="#{id}" data-island="ReactPlayerIsland" data-props="#{encoded_props}"></div>)
      end
    end
  end
end

Liquid::Template.register_tag('reactplayer', Jekyll::ReactPlayer::ReactPlayerTag)

module Jekyll
  # Provides functionality for embedding react-player in Jekyll docs.
  module ReactPlayer
  end
end
