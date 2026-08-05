---
id: "card-convert-root-index-html-to-notes-layout-syncopat-0156lyr"
boardId: "default"
title: "Convert root index.html to notes layout (Syncopated Notes)"
parentId: null
scope: {"kind":"project","ref":"global"}
trackId: "track-convert-static-site-to-jekyll-1uadg37"
column: "done"
rank: "j"
labels: []
assignee: null
fieldValues: {}
createdAt: "2026-06-14T01:19:28.402Z"
updatedAt: "2026-06-14T02:10:52.901Z"
createdBy: "agent_01KT5NHKJ8RYCC6HW5SF8RZ1JR"
updatedBy: "agent_01KT5NHKJ8RYCC6HW5SF8RZ1JR"
---
Create `_layouts/notes.html` from the light-theme boilerplate currently in `/index.html` (CSS vars, fonts, container/header/notes/footer styles). Reduce `/index.html` to front matter (`layout: notes`, title/description) plus just the notes-list content (rhythm mark + article list + footer).