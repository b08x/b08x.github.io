#!/usr/bin/env bash
# =============================================================================
# ws-install.sh - Fresh Fedora Workstation Bootstrap Initializer
#
# Enables b08x/syncopated copr repo, installs yadm, prompts for dotfiles repo,
# clones dotfiles with yadm, checks and installs system updates, and handoffs
# to yadm bootstrap.
#
# Supports:
#   - Standard Fedora Workstation / Spins / Server (DNF / DNF5)
#   - Fedora Atomic / Silverblue / Kinoite (rpm-ostree)
#
# Execution:
#   curl -fsSL https://b08x.github.io/ws-install.sh | sh
#   or
#   DOTS_REPO="https://github.com/b08x/dots.git" ./ws-install.sh
# =============================================================================

# If invoked via a non-bash shell (e.g. sh ws-install.sh or curl ... | sh where sh is not bash)
if [ -z "${BASH_VERSION:-}" ]; then
  if command -v bash >/dev/null 2>&1; then
    exec bash "$0" "$@"
  else
    echo "Error: bash is required to run ws-install.sh" >&2
    exit 1
  fi
fi

set -euo pipefail

# -----------------------------------------------------------------------------
# Color & Styling Helpers
# -----------------------------------------------------------------------------
if [ -t 1 ] || [ -c /dev/tty ]; then
  C_RESET='\033[0m'
  C_BOLD='\033[1m'
  C_BLUE='\033[0;34m'
  C_GREEN='\033[0;32m'
  C_YELLOW='\033[0;33m'
  C_RED='\033[0;31m'
else
  C_RESET=''
  C_BOLD=''
  C_BLUE=''
  C_GREEN=''
  C_YELLOW=''
  C_RED=''
fi

info() { printf "%b==>%b %b%s%b\n" "$C_BLUE" "$C_RESET" "$C_BOLD" "$*" "$C_RESET"; }
ok()   { printf "%b==>%b %s\n" "$C_GREEN" "$C_RESET" "$*"; }
warn() { printf "%b==>%b %s\n" "$C_YELLOW" "$C_RESET" "$*"; }
err()  { printf "%bError:%b %s\n" "$C_RED" "$C_RESET" "$*" >&2; }

# -----------------------------------------------------------------------------
# Interactive Input Helpers (reads from /dev/tty to support curl ... | sh)
# -----------------------------------------------------------------------------
prompt_read() {
  local prompt_msg="$1"
  local default_val="$2"
  local response=""

  if [ -n "${DOTS_REPO:-}" ]; then
    echo "$DOTS_REPO"
    return 0
  fi

  if [ -c /dev/tty ]; then
    printf "%b%s%b [%s]: " "$C_BOLD" "$prompt_msg" "$C_RESET" "$default_val" > /dev/tty
    read -r response < /dev/tty || true
  elif [ -t 0 ]; then
    printf "%b%s%b [%s]: " "$C_BOLD" "$prompt_msg" "$C_RESET" "$default_val"
    read -r response || true
  fi

  if [ -z "$response" ]; then
    response="$default_val"
  fi
  echo "$response"
}

prompt_confirm() {
  local prompt_msg="$1"
  local default_choice="${2:-Y}" # Y or N
  local response=""

  if [ -n "${ASSUME_YES:-}" ]; then
    return 0
  fi

  local hint="[Y/n]"
  [ "$default_choice" = "N" ] && hint="[y/N]"

  if [ -c /dev/tty ]; then
    printf "%b%s%b %s " "$C_BOLD" "$prompt_msg" "$C_RESET" "$hint" > /dev/tty
    read -r response < /dev/tty || true
  elif [ -t 0 ]; then
    printf "%b%s%b %s " "$C_BOLD" "$prompt_msg" "$C_RESET" "$hint"
    read -r response || true
  else
    response="$default_choice"
  fi

  response="${response:-$default_choice}"
  case "$response" in
    [yY]|[yY][eE][sS]) return 0 ;;
    *) return 1 ;;
  esac
}

# -----------------------------------------------------------------------------
# Main Setup Routine
# -----------------------------------------------------------------------------
main() {
  info "Starting Fedora workstation installation bootstrap..."

  # 1. OS Verification
  local os_release_file="${SYNCOPATED_OS_RELEASE:-/etc/os-release}"
  if [ -f "$os_release_file" ]; then
    # shellcheck disable=SC1090
    . "$os_release_file"
  else
    err "Cannot find $os_release_file; unable to detect operating system."
    exit 1
  fi

  if [ "${ID:-}" != "fedora" ] && [[ "${ID_LIKE:-}" != *"fedora"* ]]; then
    err "This installer is intended for Fedora variants (detected ID=${ID:-unknown})."
    exit 1
  fi

  # 2. Distro Variant Detection (rpm-ostree vs traditional DNF/DNF5)
  local is_ostree=0
  if [ -d /sys/fs/ostree ] || [ -f /run/ostree-booted ] || { command -v rpm-ostree >/dev/null 2>&1 && rpm-ostree status >/dev/null 2>&1; }; then
    is_ostree=1
    info "Detected Fedora Atomic / rpm-ostree variant (${VARIANT:-unknown})"
  else
    info "Detected Fedora package-managed variant (${VARIANT:-Workstation})"
  fi

  # 3. Privilege Escalation Setup
  local sudo_cmd=""
  if [ "$(id -u)" -ne 0 ]; then
    if command -v sudo >/dev/null 2>&1; then
      sudo_cmd="sudo"
      info "Validating sudo credentials..."
      sudo -v || { err "Failed to acquire sudo credentials."; exit 1; }
    else
      err "Must be run as root or have sudo installed."
      exit 1
    fi
  else
    if [ -z "${SUDO_USER:-}" ]; then
      warn "Running directly as root. Dotfiles will be cloned into /root."
    fi
  fi

  # 4. Enable Copr Repository & Install yadm
  local copr_name="b08x/syncopated"
  if [ "$is_ostree" -eq 1 ]; then
    local fedora_ver="${VERSION_ID:-}"
    if [ -z "$fedora_ver" ] && command -v rpm >/dev/null 2>&1; then
      fedora_ver="$(rpm -E %fedora 2>/dev/null || echo "")"
    fi
    fedora_ver="${fedora_ver:-41}"
    local repo_url="https://copr.fedorainfracloud.org/coprs/${copr_name}/repo/fedora-${fedora_ver}/b08x-syncopated-fedora-${fedora_ver}.repo"
    local repo_dest="/etc/yum.repos.d/_copr:copr.fedorainfracloud.org:b08x:syncopated.repo"

    info "Configuring ${copr_name} Copr repo for rpm-ostree..."
    $sudo_cmd curl -fsSL "$repo_url" -o "$repo_dest"
    ok "Copr repo configured at $repo_dest"

    if ! command -v yadm >/dev/null 2>&1; then
      info "Installing yadm via rpm-ostree..."
      $sudo_cmd rpm-ostree install --idempotent --apply-live yadm || $sudo_cmd rpm-ostree install --idempotent yadm
      ok "yadm installed successfully"
    else
      ok "yadm is already installed"
    fi
  else
    local dnf_cmd="dnf"
    if command -v dnf5 >/dev/null 2>&1; then
      dnf_cmd="dnf5"
    fi

    info "Enabling ${copr_name} Copr repo via $dnf_cmd..."
    if ! $sudo_cmd "$dnf_cmd" copr enable -y "$copr_name"; then
      warn "copr plugin unavailable; attempting to install dnf-plugins-core..."
      $sudo_cmd "$dnf_cmd" install -y dnf-plugins-core || true
      $sudo_cmd "$dnf_cmd" copr enable -y "$copr_name"
    fi
    ok "Copr repo enabled"

    if ! command -v yadm >/dev/null 2>&1; then
      info "Installing yadm via $dnf_cmd..."
      $sudo_cmd "$dnf_cmd" install -y yadm
      ok "yadm installed successfully"
    else
      ok "yadm is already installed"
    fi
  fi

  # 5. Prompt for Dotfiles Repository & Clone
  local default_dots_repo="https://github.com/b08x/dots.git"
  local target_dots_repo
  target_dots_repo=$(prompt_read "Enter dotfiles git repository URL" "$default_dots_repo")

  if [ -d "$HOME/.local/share/yadm/repo.git" ]; then
    warn "Yadm dotfiles repo already initialized in $HOME/.local/share/yadm/repo.git. Skipping clone."
  else
    info "Cloning dotfiles repository from $target_dots_repo..."
    yadm clone --no-bootstrap "$target_dots_repo"
    ok "Dotfiles cloned successfully"
  fi

  # 6. Check for System Updates
  local updates_available=0
  if [ "$is_ostree" -eq 1 ]; then
    info "Checking for rpm-ostree system updates..."
    if rpm-ostree upgrade --check 2>&1 | grep -qE "AvailableUpdate|upgrade available"; then
      updates_available=1
    fi

    if [ "$updates_available" -eq 1 ]; then
      info "Updates found. Staging rpm-ostree upgrade..."
      $sudo_cmd rpm-ostree upgrade
      ok "System upgrade staged successfully."
      echo
      if prompt_confirm "Updates were staged. A system reboot is required. Reboot now?" "Y"; then
        info "Rebooting system... Run 'yadm bootstrap' after logging back in."
        $sudo_cmd systemctl reboot || $sudo_cmd reboot || true
        exit 0
      else
        warn "Reboot postponed. Please reboot your machine before long, then run 'yadm bootstrap'."
        if prompt_confirm "Would you like to execute 'yadm bootstrap' now anyway?" "N"; then
          yadm bootstrap
        fi
      fi
    else
      ok "No system updates available."
      echo
      if prompt_confirm "Would you like to execute 'yadm bootstrap' now?" "Y"; then
        yadm bootstrap
      else
        info "Bootstrap deferred. You can execute 'yadm bootstrap' at any time."
      fi
    fi
  else
    local dnf_cmd="dnf"
    if command -v dnf5 >/dev/null 2>&1; then
      dnf_cmd="dnf5"
    fi

    info "Checking for package updates via $dnf_cmd..."
    set +e
    $sudo_cmd "$dnf_cmd" check-update >/dev/null 2>&1
    local check_rc=$?
    set -e

    if [ "$check_rc" -eq 100 ]; then
      updates_available=1
    fi

    if [ "$updates_available" -eq 1 ]; then
      info "Updates available. Installing updates via $dnf_cmd update -y..."
      $sudo_cmd "$dnf_cmd" update -y
      ok "System updates installed."
      echo
      if prompt_confirm "System updates were installed. Reboot now?" "Y"; then
        info "Rebooting system... Run 'yadm bootstrap' after logging back in."
        $sudo_cmd systemctl reboot || $sudo_cmd reboot || true
        exit 0
      else
        warn "Reboot postponed. Please reboot your machine before long, then run 'yadm bootstrap'."
        if prompt_confirm "Would you like to execute 'yadm bootstrap' now anyway?" "N"; then
          yadm bootstrap
        fi
      fi
    else
      ok "No system updates available."
      echo
      if prompt_confirm "Would you like to execute 'yadm bootstrap' now?" "Y"; then
        yadm bootstrap
      else
        info "Bootstrap deferred. You can execute 'yadm bootstrap' at any time."
      fi
    fi
  fi
}

main "$@"
