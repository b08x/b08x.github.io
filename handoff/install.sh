#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# SRL install.sh
# Run from the ROOT of your b08x.github.io repo:
#   bash handoff/install.sh
# ─────────────────────────────────────────────────────────────────────────────

set -e

REPO_ROOT="$(pwd)"
HANDOFF_DIR="$(dirname "$0")"

echo ""
echo "SRL Installer — Syncopated Research Ledger"
echo "────────────────────────────────────────────"
echo "Repo root: $REPO_ROOT"
echo ""

# ── 1. Copy TSX components ────────────────────────────────────────────────
echo "→ Copying src/components..."
cp "$HANDOFF_DIR/SRLLeftSidebar.tsx"  "$REPO_ROOT/src/components/SRLLeftSidebar.tsx"
cp "$HANDOFF_DIR/SRLCenterStage.tsx"  "$REPO_ROOT/src/components/SRLCenterStage.tsx"
cp "$HANDOFF_DIR/SRLRightPane.tsx"    "$REPO_ROOT/src/components/SRLRightPane.tsx"
cp "$HANDOFF_DIR/SRLLayout.tsx"       "$REPO_ROOT/src/components/SRLLayout.tsx"
cp "$HANDOFF_DIR/HermesDSPYDeck.tsx"  "$REPO_ROOT/src/components/HermesDSPYDeck.tsx"
echo "   ✓ 5 components copied"

# ── 2. Copy Jekyll layouts ────────────────────────────────────────────────
echo "→ Copying _layouts..."
cp "$HANDOFF_DIR/srl-layout.html"  "$REPO_ROOT/_layouts/srl-layout.html"
cp "$HANDOFF_DIR/note.html"        "$REPO_ROOT/_layouts/note.html"
echo "   ✓ srl-layout.html + note.html copied"

# ── 3. Patch src/main.tsx ─────────────────────────────────────────────────
echo "→ Patching src/main.tsx..."

MAIN="$REPO_ROOT/src/main.tsx"

# Check if already patched
if grep -q "SRLLayout" "$MAIN"; then
  echo "   ⚠  SRLLayout already in main.tsx — skipping patch"
else
  # Insert lazy imports after LiminalDeckIsland import
  sed -i "s|const LiminalDeckIsland = React.lazy(() => import('./components/LiminalDeckIsland'));|const LiminalDeckIsland = React.lazy(() => import('./components/LiminalDeckIsland'));\nconst SRLLayout      = React.lazy(() => import('./components/SRLLayout'));\nconst HermesDSPYDeck = React.lazy(() => import('./components/HermesDSPYDeck'));|" "$MAIN"

  # Insert component entries after LiminalDeckIsland entry in the record
  sed -i "s|  LiminalDeckIsland,|  LiminalDeckIsland,\n  SRLLayout,\n  HermesDSPYDeck,|" "$MAIN"

  echo "   ✓ main.tsx patched"
fi

# ── 4. Add CSS variables to _theme-variables.scss ─────────────────────────
echo "→ Adding CSS vars to _theme-variables.scss..."

SCSS="$REPO_ROOT/_sass/_theme-variables.scss"

if grep -q "srl-cyan" "$SCSS"; then
  echo "   ⚠  SRL vars already in _theme-variables.scss — skipping"
else
  # Append inside the :root block — insert before closing brace of first :root
  # We do this by appending to the file after the last var() in :root
  cat >> "$SCSS" << 'EOF'

/* ── SRL accent tokens (Syncopated Research Ledger) ─────────────────────── */
:root {
  --srl-cyan:       #38bdf8;
  --srl-rose:       #fb7185;
  --srl-emerald:    #34d399;
  --srl-bg-deep:    #0d0d0d;
  --srl-border2:    #161616;
  --srl-rose-muted: rgba(251, 113, 133, 0.12);
}
EOF
  echo "   ✓ CSS vars added"
fi

# ── 5. Rebuild JS bundle ───────────────────────────────────────────────────
echo ""
echo "→ Rebuilding JS bundle..."
cd "$REPO_ROOT"
npm run build:js
echo "   ✓ assets/js/dist/garden-widgets-v2.js rebuilt"

# ── Done ──────────────────────────────────────────────────────────────────
echo ""
echo "────────────────────────────────────────────"
echo "Done. Start the dev server with:"
echo ""
echo "  npm run dev"
echo ""
echo "Then open any _notes page — it will render the SRL island."
echo "Check the browser console for:"
echo "  [Garden] Successfully rendered island: SRLLayout"
echo ""
