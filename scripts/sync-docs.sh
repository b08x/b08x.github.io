#!/usr/bin/env bash
# shellcheck shell=bash
#
# sync-docs.sh — compile a sibling repository's markdown docs into this site's
# `_docs/<doc-set>/` collection directory.
#
# The source repos keep plain markdown with no Jekyll front matter. This script
# adds the front matter `_layouts/doc.html` needs (title, description,
# permalink, doc_set, source_path, nav_order, nav_prev/nav_next), strips the H1
# and promotes the lede paragraph to `description` — both of which the layout
# renders itself, so leaving them in the body would print them twice.
#
# Ordering comes from scripts/docs-manifests/<doc-set>.tsv, not from the
# filesystem, so the pager and the sidebar in _data/docs_nav.yml stay in step.
#
# Usage:
#   scripts/sync-docs.sh gitagent-workbench
#   scripts/sync-docs.sh gitagent-workbench --source ~/src/gitagent-workbench
#   scripts/sync-docs.sh gitagent-workbench --dry-run

set -euo pipefail
IFS=$'\n\t'

readonly SCRIPT_NAME="${0##*/}"
REPO_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
readonly REPO_ROOT
readonly MANIFEST_DIR="${REPO_ROOT}/scripts/docs-manifests"

# Written into every generated page. The wipe step refuses to delete a file
# that lacks this marker, so hand-written doc sets can never be clobbered.
readonly GENERATED_MARKER="generated_by: ${SCRIPT_NAME}"

Docs::log() {
  printf '[INFO] %s\n' "$*" >&2
}

Docs::err() {
  printf '[ERROR] %s\n' "$*" >&2
}

Docs::die() {
  Docs::err "$*"
  exit 1
}

Docs::usage() {
  cat <<EOF
Usage: ${SCRIPT_NAME} <doc-set> [options]

Options:
  --source DIR        Source repository root (default: ../<doc-set>)
  --docs-subdir DIR   Docs directory within the source repo (default: docs)
  --dry-run           Report what would be written; change nothing
  -h, --help          Show this message
EOF
}

# YAML double-quoted scalars only need backslash and double quote escaped.
Docs::yaml_escape() {
  local value="$1"
  value="${value//\\/\\\\}"
  value="${value//\"/\\\"}"
  printf '%s' "$value"
}

# Emits the body to stdout and the lede paragraph (if any) to $desc_file.
# A lede is the first plain paragraph after the H1 — headings, fences, lists,
# tables, blockquotes and raw HTML are body content and are left alone.
Docs::split_lede() {
  local src="$1" desc_file="$2"

  awk -v desc_file="$desc_file" '
    { lines[++n] = $0 }
    END {
      i = 1
      while (i <= n && lines[i] ~ /^[[:space:]]*$/) i++
      if (lines[i] ~ /^# /) i++
      while (i <= n && lines[i] ~ /^[[:space:]]*$/) i++

      if (i <= n && lines[i] !~ /^(#|```|[-*+] |[0-9]+\. |> |\||<)/) {
        desc = ""
        while (i <= n && lines[i] !~ /^[[:space:]]*$/) {
          desc = (desc == "") ? lines[i] : desc " " lines[i]
          i++
        }
        print desc > desc_file
        while (i <= n && lines[i] ~ /^[[:space:]]*$/) i++
      }

      for (; i <= n; i++) print lines[i]
    }
  ' "$src"
}

# Collapse `.` and `..` segments. Pure lexical — the paths come from markdown
# links, not the filesystem, and the targets need not exist locally.
Docs::normalize_path() {
  local input="$1" part
  local -a parts=() out=()

  IFS='/' read -r -a parts <<< "$input"
  for part in "${parts[@]}"; do
    case "$part" in
      ''|.) ;;
      ..) ((${#out[@]} > 0)) && unset 'out[-1]' ;;
      *) out+=("$part") ;;
    esac
  done

  local IFS='/'
  printf '%s' "${out[*]}"
}

# https://github.com/owner/repo/blob/<branch>/ for the source checkout, or
# empty when the remote can't be read — in which case links are left as-is.
Docs::blob_base() {
  local repo="$1" remote branch slug

  remote="$(git -C "$repo" remote get-url origin 2>/dev/null)" || return 0
  branch="$(git -C "$repo" symbolic-ref --quiet --short HEAD 2>/dev/null)" || branch="main"

  case "$remote" in
    git@*:*) slug="${remote#*:}" ;;
    https://*) slug="${remote#https://*/}" ;;
    *) return 0 ;;
  esac
  slug="${slug%.git}"

  printf 'https://github.com/%s/blob/%s' "$slug" "$branch"
}

# Relative markdown links the manifest doesn't cover (files outside docs/, or
# pages deliberately not published here) would 404 on the site. Point them at
# the source repo on GitHub instead.
Docs::rewrite_offsite_links() {
  local file="$1" docs_subdir="$2" blob_base="$3"
  local -a exprs=()
  local link

  [[ -n "$blob_base" ]] || return 0

  while IFS= read -r link; do
    [[ -n "$link" ]] || continue
    exprs+=(-e "s@](${link})@](${blob_base}/$(Docs::normalize_path "${docs_subdir}/${link}"))@g")
  done < <(grep -oE '\]\(\.{1,2}/[^)]*\.md\)' "$file" |
    sed -E 's@^\]\((.*)\)$@\1@' | sort -u)

  ((${#exprs[@]} > 0)) || return 0
  sed -i "${exprs[@]}" "$file"
}

# Refuse to touch a target directory holding anything this script did not write.
Docs::assert_generated() {
  local target_dir="$1" file

  [[ -d "$target_dir" ]] || return 0

  for file in "$target_dir"/*.md; do
    [[ -e "$file" ]] || continue
    grep -qF "$GENERATED_MARKER" "$file" ||
      Docs::die "refusing to overwrite hand-written file: ${file#"$REPO_ROOT"/}"
  done
}

Docs::main() {
  local doc_set="" source_dir="" docs_subdir="docs" dry_run="false"

  while (($# > 0)); do
    case "$1" in
      --source) source_dir="${2:-}"; shift 2 ;;
      --docs-subdir) docs_subdir="${2:-}"; shift 2 ;;
      --dry-run) dry_run="true"; shift ;;
      -h|--help) Docs::usage; return 0 ;;
      -*) Docs::usage >&2; Docs::die "unknown option: $1" ;;
      *) doc_set="$1"; shift ;;
    esac
  done

  [[ -n "$doc_set" ]] || { Docs::usage >&2; Docs::die "no doc set given"; }

  local manifest="${MANIFEST_DIR}/${doc_set}.tsv"
  [[ -f "$manifest" ]] || Docs::die "no manifest at ${manifest#"$REPO_ROOT"/}"

  source_dir="${source_dir:-${REPO_ROOT}/../${doc_set}}"
  [[ -d "$source_dir" ]] || Docs::die "source repo not found: $source_dir"
  source_dir="$(cd -- "$source_dir" && pwd)"

  local src_docs="${source_dir}/${docs_subdir}"
  [[ -d "$src_docs" ]] || Docs::die "source docs dir not found: $src_docs"

  local target_dir="${REPO_ROOT}/_docs/${doc_set}"

  # Pass 1 — read the manifest into parallel arrays, so prev/next can look
  # ahead and the link rewriter can see every mapping before writing anything.
  local -a sources=() outs=() titles=() fallbacks=() urls=()
  local source out title fallback

  while IFS=$'\t' read -r source out title fallback; do
    [[ -n "$source" && "$source" != \#* ]] || continue
    [[ -f "${src_docs}/${source}" ]] || Docs::die "missing source page: ${src_docs}/${source}"

    sources+=("$source")
    outs+=("$out")
    titles+=("$title")
    fallbacks+=("$fallback")
    if [[ "$out" == "index" ]]; then
      urls+=("/docs/${doc_set}/")
    else
      urls+=("/docs/${doc_set}/${out}/")
    fi
  done < "$manifest"

  local count="${#sources[@]}"
  ((count > 0)) || Docs::die "manifest is empty: ${manifest#"$REPO_ROOT"/}"

  # Rewrite the source repo's relative `./page.md` links to site permalinks.
  local -a link_rewrites=()
  local i
  for ((i = 0; i < count; i++)); do
    link_rewrites+=(-e "s@](\\./\?${sources[i]}\\(#[^)]*\\)\\?)@](${urls[i]}\\1)@g")
  done

  if [[ "$dry_run" == "true" ]]; then
    Docs::log "dry run — ${count} page(s) from ${src_docs} would land in ${target_dir#"$REPO_ROOT"/}"
    for ((i = 0; i < count; i++)); do
      printf '  %s -> %s\n' "${sources[i]}" "${urls[i]}" >&2
    done
    return 0
  fi

  Docs::assert_generated "$target_dir"
  rm -rf -- "$target_dir"
  mkdir -p -- "$target_dir"

  local blob_base
  blob_base="$(Docs::blob_base "$source_dir")"

  local tmp_desc
  tmp_desc="$(mktemp)"
  # shellcheck disable=SC2064  # expand tmp_desc now, not at trap time
  trap "rm -f -- '$tmp_desc'" EXIT

  for ((i = 0; i < count; i++)); do
    local src_file="${src_docs}/${sources[i]}"
    local out_file="${target_dir}/${outs[i]}.md"
    local description body

    : > "$tmp_desc"
    body="$(Docs::split_lede "$src_file" "$tmp_desc")"
    description="$(< "$tmp_desc")"
    description="${description%$'\n'}"
    description="${description:-${fallbacks[i]}}"

    {
      printf -- '---\n'
      printf 'title: %s\n' "$(Docs::yaml_escape "${titles[i]}")"
      printf 'description: "%s"\n' "$(Docs::yaml_escape "$description")"
      printf 'permalink: %s\n' "${urls[i]}"
      printf 'doc_set: %s\n' "$doc_set"
      printf 'source_path: %s/%s\n' "$docs_subdir" "${sources[i]}"
      printf 'nav_order: %d\n' "$((i + 1))"
      printf 'toc: true\n'
      printf '%s\n' "$GENERATED_MARKER"

      if ((i > 0)); then
        printf 'nav_prev:\n  title: %s\n  url: %s\n' \
          "$(Docs::yaml_escape "${titles[i - 1]}")" "${urls[i - 1]}"
      fi
      if ((i < count - 1)); then
        printf 'nav_next:\n  title: %s\n  url: %s\n' \
          "$(Docs::yaml_escape "${titles[i + 1]}")" "${urls[i + 1]}"
      fi

      printf -- '---\n\n'
      printf '%s\n' "$body" | sed "${link_rewrites[@]}"
    } > "$out_file"

    Docs::rewrite_offsite_links "$out_file" "$docs_subdir" "$blob_base"

    Docs::log "wrote ${out_file#"$REPO_ROOT"/}  <-  ${docs_subdir}/${sources[i]}"
  done

  Docs::log "synced ${count} page(s) into ${target_dir#"$REPO_ROOT"/}"
}

Docs::main "$@"
