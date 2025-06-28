# frozen_string_literal: true

source 'https://rubygems.org'
git_source(:github) { |repo_name| "https://github.com/#{repo_name}" }

gem 'jekyll'
gem 'jekyll-last-modified-at', git: 'https://github.com/maximevaillancourt/jekyll-last-modified-at',
                               branch: 'add-support-for-files-in-git-submodules'
gem 'json-schema'
gem 'nokogiri'
gem 'pry'
gem 'ruby-vips'

gem 'sass', '~> 3.7.4'
gem 'therubyracer', '~> 0.12.3'
gem 'uglifier', '~> 4.2.1'

group :jekyll_plugins do
  gem 'jekyll-feed'
  gem 'jekyll-figure'
  gem 'jekyll-include-cache'
  gem 'jekyll-jupyter-notebook'
  gem 'jekyll-link-attributes'
  gem 'jekyll-paginate-v2'
  gem 'jekyll-pandoc'
  gem 'jekyll_picture_tag' # Using local version in _plugins/
  gem 'jekyll-react-player'
  gem 'jekyll-sass-converter'
  gem 'jekyll-sitemap'
  gem 'jekyll-spaceship'
  gem 'jekyll-tabs'
  gem 'jekyll-tagging-related_posts'
  gem 'jekyll-toc'
end

group :development do
  # Add your development-only gems here
  gem 'bundler'
  gem 'lint_roller'
  gem 'listen', require: false
  gem 'rake'
  gem 'rdoc'
  gem 'regexp_parser'
  gem 'rspec'
  gem 'rubocop', require: false
  gem 'rubocop-minitest'
  gem 'rubocop-packaging'
  gem 'rubocop-performance'
  gem 'rubocop-rake'
  gem 'rubocop-rspec'
  gem 'rubocop-shopify'
  gem 'rubocop-thread_safety'
  gem 'ruby-lsp'
  gem 'solargraph'
  gem 'webrick'
  gem 'yard'
end
