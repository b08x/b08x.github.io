# frozen_string_literal: true

source "https://rubygems.org"

git_source(:github) {|repo_name| "https://github.com/#{repo_name}" }

gem "jekyll", "~> 4.3"
gem "jekyll-last-modified-at", git: "https://github.com/maximevaillancourt/jekyll-last-modified-at", branch: "add-support-for-files-in-git-submodules"
gem "webrick", "~> 1.8"
gem "nokogiri"
gem "ruby-vips"
gem "ruby-lsp"
gem "rubocop"
gem "vips"

group :jekyll_plugins do
  gem 'jekyll-jupyter-notebook'
  gem 'jekyll-asciinema'
  gem 'jekyll-spaceship'
  gem 'jekyll_picture_tag'
  gem 'jekyll-target-blank'
  gem 'jekyll-toc'
end
