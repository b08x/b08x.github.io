---
id: "card-build-shared-hindsight-layout-nav-breadcrumb-foo-0k9y6b6"
boardId: "default"
title: "Build shared hindsight layout + nav/breadcrumb/footer includes"
parentId: null
scope: {"kind":"project","ref":"global"}
trackId: "track-convert-static-site-to-jekyll-1uadg37"
column: "done"
rank: "j"
labels: []
assignee: null
fieldValues: {}
createdAt: "2026-06-14T01:19:27.792Z"
updatedAt: "2026-06-14T02:10:53.207Z"
createdBy: "agent_01KT5NHKJ8RYCC6HW5SF8RZ1JR"
updatedBy: "agent_01KT5NHKJ8RYCC6HW5SF8RZ1JR"
---
Create `_layouts/hindsight.html` with the shared dark-theme `<head>` (fonts, CSS vars, body::before grid bg, base nav/breadcrumb/footer CSS) and `{{ content }}` slot.

Create includes:
- `_includes/hindsight-nav.html` — sticky nav (logo, Platform/Research/Enterprise/Blog links, Get Access CTA), `.active` class driven by a `nav_active` front-matter variable.
- `_includes/hindsight-breadcrumb.html` — breadcrumb trail driven by a `breadcrumbs` front-matter array (label+url pairs) plus a `breadcrumb_current` string for the final unlinked segment. Omit entirely on pages with no front-matter `breadcrumbs`.
- `_includes/hindsight-footer.html` — footer with `footer_left`/`footer_right` front-matter vars, defaulting to the standard "© 2026 HindsightAI, Inc..." / "research@hindsightai.com" text.

Base this on the duplicated markup/CSS currently in `hindsightai/index.html`, `hindsightai/research/index.html`, and the 3 scraps pages under `hindsightai/research/scraps/`.