---
id: "card-convert-hindsightai-research-index-html-to-hinds-1qew911"
boardId: "default"
title: "Convert hindsightai/research/index.html to hindsight layout"
parentId: null
scope: {"kind":"project","ref":"global"}
trackId: "track-convert-static-site-to-jekyll-1uadg37"
column: "done"
rank: "j"
labels: []
assignee: null
fieldValues: {}
createdAt: "2026-06-14T01:19:33.050Z"
updatedAt: "2026-06-14T02:10:53.836Z"
createdBy: "agent_01KT5NHKJ8RYCC6HW5SF8RZ1JR"
updatedBy: "agent_01KT5NHKJ8RYCC6HW5SF8RZ1JR"
---
Add front matter (`layout: hindsight`, title, description, `nav_active: research`, `breadcrumbs: [{label: "syncopated notes", url: "/"}, {label: "hindsightai", url: "/hindsightai/"}]`, `breadcrumb_current: research`). Remove duplicated nav/breadcrumb/footer/base CSS now in layout/includes. Keep page-specific CSS (paper-card, abstract-panel, etc.) and content (page header, paper card with abstract toggle JS, empty-state).