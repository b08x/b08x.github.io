# Plan: Notebook / Projects IA restructure

## Solution approach

Two changes, kept independent so each can be verified on its own:

1. **Nav + home page split.** Rename the "Notes" nav label to "Notebook" (URL stays `/`), and split the home feed into two grouped sections — Notes and Posts — instead of one interleaved list. Drop the standalone "Prompts" nav link entirely; the Projects grid (already rendered on home) is the only place Prompt Library is discoverable going forward.
2. **Prompt Library re-permalinked as a project.** Move the `_prompts` collection and its index page from `/prompts/...` to `/projects/prompt-library/...`, and add a `Prompt Library` card to `_data/projects.yml` in the same shape as the other cards. No redirect from the old URL (fact-8, accepted with a note that an alias may be added later — out of scope now).

Better-layout principles (grouping, reading order, progressive disclosure) get applied at three touch points: the nav itself, the Notebook/Projects landing pages, and the prompt-bench UI — not a full site redesign.

## Steps

### 1. Nav: rename label, drop Prompts link
**Files:** `_includes/nav.html`
- Change the first link's label from "Notes" to "Notebook" (href stays `/`; active-state condition stays as-is since it already covers `page.layout == 'post'`).
- Delete the third `<a>` (Prompts link) entirely.
- Better-layout pass: with only two links, tighten `gap` in `.site-nav` (theme-tokens.html:307-312) if two items look sparse at the current 20px gap — visual check during manual verification, not a hard rule.

**Verification:** manual — load `/`, confirm nav shows only "Notebook" and "Projects", confirm "Notebook" is styled active on `/`, on a `/notes/...` page, and on a `/2026-...` post page.

### 2. Home page: split Notes and Posts into separate grouped sections
**Files:** `_layouts/home.html`
- Replace the single `"Latest Notes & Posts"` section-label + blended `row-list` (lines ~9-73) with two sequential sections, each with its own `section-label` ("Posts", "Notes") and its own `row-list`, each looping only its own collection (`posts`/`site.posts` and `notes`/`site.notes`).
- Keep the existing "featured" treatment for the most recent post (first block) inside the Posts section, since that's blog-post-specific (has `.image`, `.date`) and doesn't fit notes.
- Keep pagination scoped to posts only (it already is — `paginator.posts`); notes render in full underneath, unpaginated, as today.
- Progressive disclosure: if `notes.size` is large, consider a `limit` with a "browse all notes" link once a `/notes/` index exists — no such index exists yet, so for this goal just render the full list (matches today's behavior, just visually separated).
- Remove the standalone "Prompts" teaser block at the bottom of `home.html` (the `{% if site.prompts.size > 0 %}` section) — Prompt Library is now discoverable purely via the Projects teaser above it, once its card is added in Step 4.

**Verification:** manual — load `/`, confirm two visually distinct sections (Posts, then Notes), confirm no separate "Prompts" section remains, confirm existing post/note links still resolve.

### 3. Re-permalink the Prompt Library
**Files:** `_config.yml`, `prompts.html`, `_layouts/prompt.html`, any `_prompts/*.md` with an explicit `permalink:` override (checked: none found — they inherit the collection default)
- `_config.yml`: change the `prompts` collection's `permalink` from `/prompts/:path/` to `/projects/prompt-library/:path/`.
- `prompts.html`: change `permalink: /prompts/` to `permalink: /projects/prompt-library/`.
- `_layouts/prompt.html`: update the "back to prompts" link from `/prompts/` to `/projects/prompt-library/`.
- Search for any other hardcoded `/prompts/` references site-wide (`home.html`'s teaser, already removed in Step 2) and fix any left over, e.g. in `_data/docs_nav.yml` or other includes — grep confirmed only `home.html`, `prompts.html`, `_layouts/prompt.html` reference it today.

**Verification:**
```bash
bundle exec jekyll build
grep -rl 'permalink: /prompts' _config.yml prompts.html   # should return nothing
grep -rn '/prompts/' _includes _layouts *.html            # should return nothing (except this plan/goal files)
ls _site/projects/prompt-library/index.html               # exists
```
Manual: load `/projects/prompt-library/`, confirm the bench UI renders in library mode; open one prompt's permalink page and confirm single mode + "back to prompts" link both resolve under `/projects/prompt-library/...`.

### 4. Add the Prompt Library project card
**Files:** `_data/projects.yml`
- Add a new entry following the existing shape (see the "SFL Engine" entry as the template):
  ```yaml
  - title: "Prompt Library"
    description: "An interactive bench for prompt and context engineering — instructions, example runs, and SFL-driven dials to watch the same ground get realized differently."
    url: "/projects/prompt-library/"
    external: false
    badge: "tool · prompt engineering"
    badge_class: "badge-blue"
    year: "2026"
    tags: [prompts, context-engineering, llm]
    card: true
  ```
- `card: true` so it appears in the home page's Projects teaser (Step 2 relies on this to replace the old dedicated Prompts teaser).

**Verification:** manual — load `/projects/`, confirm the Prompt Library row/card appears and links to `/projects/prompt-library/`; load `/`, confirm it appears in the Projects teaser section.

### 5. Better-layout pass on Notebook + Projects landing pages
**Files:** `_layouts/home.html` (styling only, no new markup structure beyond Step 2), `projects.html`
- Notebook (`/`): confirm the two new sections (Posts, Notes) read top-to-bottom with a clear grouping boundary (section-label already gives this); no structural change needed beyond Step 2 unless visual review during manual testing turns up crowding.
- Projects (`projects.html`): review whether the flat `project-list` (all non-featured projects in one undifferentiated list, `projects.html:66-82`) still reads well now that it's the sole home for Prompt Library alongside SFL Engine and Skiing Smokers. Given only 3 project cards total, no restructuring into sub-groups is warranted yet — flag as a non-blocking observation, not a required change.

**Verification:** manual visual review of both pages at desktop and the existing 700px breakpoint.

### 6. Better-layout pass on the prompt-bench UI
**Files:** `_includes/prompt-bench.html`
- Review the bench's existing grouping (masthead → dials → output → export, per the file's own comments) against better-layout heuristics: is the reading order still masthead-first, is progressive disclosure used for advanced dial options, is the SFL "ground" block visually distinguished from generated text (per its own doc comment, this already matters functionally).
- Apply targeted CSS/markup tweaks only where the review finds a concrete issue — this is a 1015-line file already recently overhauled (commit `ca460cc`), so the expectation is small, specific fixes rather than a rewrite.

**Verification:** manual — exercise both library mode (`/projects/prompt-library/`) and single mode (any individual prompt page) after Step 3's URL move, confirm dials still work and the SFL ground-anchor check (described in the file's header comment) still fires correctly.

## Risks / open questions

- **No redirect for `/prompts/*`** (fact-8): accepted as a known gap. If this site has external backlinks or is indexed, old URLs will 404. Revisit with a Jekyll `redirect_from` alias if it becomes a problem — explicitly deferred, not part of this goal.
- **Empty `/notes/` index**: splitting Notes out on the home page doesn't create a dedicated `/notes/` index page (only individual note permalinks exist today). If the notes list grows long, pagination/truncation will eventually be needed — out of scope per fact-13's spirit (no new features beyond the split itself).
- **`site.notes | sort: "title"`** in the current code has no visible date-based ordering — confirm this is intentional before Step 2, since splitting the section makes note ordering more visible to readers.
