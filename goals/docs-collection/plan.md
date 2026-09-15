# Plan: GitAgent Workbench Docs Collection

## Solution Approach
We will configure a new `docs` collection in the `b08x.github.io` Jekyll site. This collection will use the existing `doc.html` layout to provide a sidebar navigation structure defined in `_data/docs_nav.yml`. We will also create a top-level `/docs/` index page. To populate the actual documentation for GitAgent Workbench, we will create a script (e.g., a `Justfile` task) that pulls the markdown files from the `gitagent-workbench` repository into `b08x.github.io/_docs/gitagent-workbench/`.

## Steps

### 1. Configure the `docs` Collection
- **Action**: Edit `_config.yml` in `b08x.github.io` to add the `docs` collection. Set `output: true` and `permalink: /docs/:path/`.
- **Verification**: `grep -A 3 "docs:" _config.yml` shows the correct configuration.

### 2. Create the Central `/docs/` Index Page
- **Action**: Create a `docs.md` file at the root of `b08x.github.io` with a `permalink: /docs/` and a layout suitable for listing the available documentation sets.
- **Verification**: `cat docs.md` confirms the file exists with the correct frontmatter.

### 3. Define the Navigation Structure
- **Action**: Create or update `_data/docs_nav.yml` to include a `gitagent-workbench` section. This will define the sidebar items for the `doc.html` layout.
- **Verification**: `cat _data/docs_nav.yml` shows the `gitagent-workbench` key and its navigation items.

### 4. Create the Sync Script
- **Action**: Add a sync script (e.g., a `sync-gitagent-docs` task in `Justfile` or a standalone bash script) that copies the documentation markdown files from `../gitagent-workbench/docs/` (or wherever they are stored) into `_docs/gitagent-workbench/`.
- **Verification**: Run `just --summary` or `ls -l` on the script to verify its presence, and run it to verify it copies files successfully.

## Risks & Open Questions
- **Doc layout styling**: Ensure `doc.html` handles the `docs_nav.yml` structure correctly.
- **Sync mechanism**: The exact source path of the docs in `gitagent-workbench` needs to be defined when writing the sync script.
