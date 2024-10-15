#!/usr/bin/env ruby
# frozen_string_literal: true

lib_dir = File.expand_path(File.join(__dir__))
$LOAD_PATH.unshift lib_dir unless $LOAD_PATH.include?(lib_dir)

require 'jekyll'
require 'mp3info'
require 'json-schema'

require_relative 'version'

module Jekyll
  module Podcast
    class Error < StandardError; end
  end
end

require 'utils'
require 'episode_data'
require 'podcast_episode_drop'
require 'file_exists'
require 'feed_generator'
require 'tag_page_generator'
require 'liquid_tag_filters' # depends on tag_page_generator
require 'contributor_page_generator'
require 'podcast_data'
require 'validate_yaml_frontmatter'
require 'page_title_liquid_tag'
