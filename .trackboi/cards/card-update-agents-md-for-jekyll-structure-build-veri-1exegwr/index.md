---
id: "card-update-agents-md-for-jekyll-structure-build-veri-1exegwr"
boardId: "default"
title: "Update AGENTS.md for Jekyll structure; build & verify site"
parentId: null
scope: {"kind":"project","ref":"global"}
trackId: "track-convert-static-site-to-jekyll-1uadg37"
column: "done"
rank: "j"
labels: []
assignee: null
fieldValues: {}
createdAt: "2026-06-14T01:19:41.120Z"
updatedAt: "2026-06-14T02:10:54.812Z"
createdBy: "agent_01KT5NHKJ8RYCC6HW5SF8RZ1JR"
updatedBy: "agent_01KT5NHKJ8RYCC6HW5SF8RZ1JR"
---
Update AGENTS.md to describe the new `_config.yml`/`Gemfile`/`_layouts`/`_includes` structure, how to edit (bundle exec jekyll serve), and the shared layout/include pattern (replacing the old "no shared CSS/JS, edit every file" gotcha).

Run `bundle exec jekyll build` (or `jekyll build`) and visually verify every page renders identically to before: `/`, `/hindsightai/`, `/hindsightai/research/`, the 3 scraps pages, and `/skiing-smokers-game.html`.