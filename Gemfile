source "https://rubygems.org"
git_source(:github) { |repo_name| "https://github.com/#{repo_name}" }

gem 'jekyll'
gem 'jekyll-last-modified-at', git: 'https://github.com/maximevaillancourt/jekyll-last-modified-at',
                               branch: 'add-support-for-files-in-git-submodules'
gem 'json-schema'
gem 'nokogiri'
gem 'pry'
gem 'ruby-vips'

gem "uglifier", "~> 3.2.0"
gem "sass", "~> 3.4.0"
gem "therubyracer", "~> 0.12.3"

group :jekyll_plugins do
  gem 'jekyll-asciinema'
  gem 'jekyll-feed'
  gem 'jekyll-jupyter-notebook'
  gem 'jekyll-paginate-v2'
  gem 'jekyll_picture_tag'
  gem 'jekyll-spaceship'
  gem 'jekyll-toc'
  gem 'jekyll-pandoc'
  gem 'jekyll-react-player'
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
