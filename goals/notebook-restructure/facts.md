# Facts

- The top nav shows exactly two links: "Projects" and "Notebook" (the old standalone "Prompts" link is gone).
- The "Notebook" nav link points at `/` and is marked active on the home page and on individual note/post pages.
- The home page at `/` shows two clearly separated sections — Notes and Posts — each listing only entries from its own collection, instead of one blended feed.
- Existing individual note permalinks (e.g. `/notes/sentience-appearance/`, `/notes/fedora-to-pop/`) and post permalinks are unchanged by the restructure.
- The Prompt Library's index page is served at `/projects/prompt-library/` instead of `/prompts/`.
- Individual prompt pages are served under `/projects/prompt-library/<slug>/` instead of `/prompts/<slug>/`.
- `_data/projects.yml` includes a "Prompt Library" card linking to `/projects/prompt-library/`, in the same style as the other project cards.
- Visiting the old `/prompts/` URL is not guaranteed to work after the move (no redirect is being built); this is a known, accepted gap rather than an oversight. Note: may become an alias later, but not now.
- The nav component's markup/styling reflects better-layout thinking (clear grouping and reading order for two links) rather than being left exactly as-is with a label swap.
- The Notebook landing page (Notes/Posts split) and the Projects landing page both apply better-layout principles: clear grouping, sensible reading order, and progressive disclosure rather than one long flat list.
- The prompt-bench slider UI (library and single-prompt modes) is revisited with better-layout principles applied, at its new `/projects/prompt-library/` location.
- No markdown content is deleted — all existing notes, posts, and prompt files remain intact; only nav, landing-page layout, and the prompt collection's permalink/URL structure change.
- Expanding the interactive pedagogical sliders themselves (new slider types/features) is explicitly out of scope for this goal.
