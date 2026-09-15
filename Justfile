# b08x.github.io — site tasks.
#
# `just` is optional; every recipe is a one-line shell command you can run by
# hand. Run `just --list` to see what's here.

set shell := ["bash", "-euo", "pipefail", "-c"]

# Show available recipes.
default:
    @just --list

# Serve the site locally at http://localhost:4000.
serve:
    bundle exec jekyll serve

# Build the site into _site/.
build:
    bundle exec jekyll build

# Compile a source repo's markdown into _docs/<doc-set>/.
# Source repo defaults to a sibling directory named after the doc set.
sync-docs doc_set source="":
    scripts/sync-docs.sh {{doc_set}} {{ if source == "" { "" } else { "--source " + source } }}

# Preview a doc sync without writing anything.
sync-docs-dry doc_set source="":
    scripts/sync-docs.sh {{doc_set}} --dry-run {{ if source == "" { "" } else { "--source " + source } }}

# Pull the GitAgent Workbench docs in from the sibling checkout.
sync-gitagent-docs:
    just sync-docs gitagent-workbench

# Sync every registered doc set that has a manifest and a sibling checkout.
sync-all-docs:
    for m in scripts/docs-manifests/*.tsv; do \
      set="$(basename "$m" .tsv)"; \
      if [[ -d "../$set" ]]; then just sync-docs "$set"; \
      else echo "[SKIP] no sibling checkout for $set" >&2; fi; \
    done
