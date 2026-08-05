---
id: "card-convert-research-scraps-pages-to-hindsight-layou-18365uf"
boardId: "default"
title: "Convert research/scraps/* pages to hindsight layout"
parentId: null
scope: {"kind":"project","ref":"global"}
trackId: "track-convert-static-site-to-jekyll-1uadg37"
column: "done"
rank: "j"
labels: []
assignee: null
fieldValues: {}
createdAt: "2026-06-14T01:19:36.204Z"
updatedAt: "2026-06-14T02:10:54.165Z"
createdBy: "agent_01KT5NHKJ8RYCC6HW5SF8RZ1JR"
updatedBy: "agent_01KT5NHKJ8RYCC6HW5SF8RZ1JR"
---
For each of `scraps-acronym.html`, `whitepaper-abstract.html`, `latent-manifold.html`: add front matter (`layout: hindsight`, title, `nav_active: research`, `breadcrumbs` for syncopated notes/hindsightai/research, `breadcrumb_current` matching the page e.g. "scraps · nomenclature" / "scraps · full paper" / "scraps · latent manifold"). Remove duplicated nav/breadcrumb/footer/base CSS now in layout/includes, keep page-specific fragment CSS (`.wrap`, `.wp`, `.mw`, etc.) and content/JS (latent-manifold's canvas animation script stays inline).