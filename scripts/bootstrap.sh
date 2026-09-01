#!/usr/bin/env bash
# =============================================================================
# Workstation Bootstrap Orchestrator
# A wonderfully warm, colorful TUI for provisioning your development environment
# =============================================================================

set -euo pipefail

if [[ $EUID -ne 0 ]]; then
  echo "This script must be run as root (e.g., using sudo)." >&2
  exit 1
fi

# -----------------------------------------------------------------------------
# Configuration & State
# -----------------------------------------------------------------------------

SCRIPT_NAME="$(basename "$0")"
LOG_FILE="/tmp/${SCRIPT_NAME%.*}.log"
STATE_FILE="/tmp/${SCRIPT_NAME%.*}.state"

# Color palette - warm, inviting colors
declare -A COLORS=(
  [primary]="#FA8072"
  [secondary]="#FFD700"
  [success]="#90EE90"
  [error]="#FF6B6B"
  [warning]="#FFA07A"
  [info]="#87CEFA"
  [muted]="#D3D3D3"
  [border]="#FFE4B5"
)

# -----------------------------------------------------------------------------
# Trap Functions & Error Handling
# -----------------------------------------------------------------------------

cleanup() {
  local exit_code=$?
  local signal=$1

  [[ -f "$STATE_FILE" ]] && rm -f "$STATE_FILE"

  if [[ $exit_code -eq 0 ]]; then
    if command_exists gum; then
      echo "" | gum style --foreground "${COLORS[success]}" --border double --padding "1 2" --align center \
        "Bootstrap completed successfully"
    else
      echo "Bootstrap completed successfully"
    fi
  else
    if command_exists gum; then
      echo "" | gum style --foreground "${COLORS[error]}" --border double --padding "1 2" --align center \
        "Bootstrap exited with errors (code: $exit_code)"
      [[ -n "$signal" && "$signal" != "EXIT" ]] && \
        echo "" | gum style --foreground "${COLORS[warning]}" --padding "0 2" --align center \
          "Signal received: $signal"
    else
      echo "Bootstrap exited with errors (code: $exit_code)"
      [[ -n "$signal" && "$signal" != "EXIT" ]] && echo "Signal received: $signal"
    fi
  fi
  exit $exit_code
}

handle_interrupt() {
  local signal=$1
  echo "" | gum style --foreground "${COLORS[warning]}" --padding "1 2" --align center \
    "Operation interrupted by user (Ctrl+C)"
  if gum confirm --affirmative "Continue" --negative "Exit" \
    "Do you want to continue the bootstrap process?"; then
    echo "" | gum style --foreground "${COLORS[info]}" --padding "0 2" --align center "Resuming..."
    return 0
  else
    echo "" | gum style --foreground "${COLORS[muted]}" --padding "0 2" --align center "Cleaning up..."
    cleanup "$signal"
  fi
}

handle_error() {
  local cmd="$1"
  local line="$2"
  local exit_code="$3"
  if command_exists gum; then
    echo "" | gum style --foreground "${COLORS[error]}" --border double --padding "1 2" \
      "Error in command: ${cmd}" \
      "Line: ${line}" \
      "Exit code: ${exit_code}"
  else
    echo "ERROR: Command '${cmd}' failed at line ${line} with exit code ${exit_code}"
  fi

  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: Command '${cmd}' failed at line ${line} with exit code ${exit_code}" >> "$LOG_FILE"
  
  if command_exists gum; then
    if gum confirm --affirmative "Continue" --negative "Exit" \
      "Attempt to continue with next steps?"; then
      echo "" | gum style --foreground "${COLORS[warning]}" --padding "0 2" --align center \
        "Continuing with caution..."
      return 0
    else
      cleanup "ERR"
    fi
  else
    cleanup "ERR"
  fi
}

trap 'cleanup "EXIT"' EXIT
trap 'handle_interrupt INT' INT
trap 'handle_interrupt TERM' TERM
trap 'handle_error "$BASH_COMMAND" $LINENO $? ' ERR

# -----------------------------------------------------------------------------
# Utility Functions
# -----------------------------------------------------------------------------

log() {
  local level="$1"
  local message="$2"
  local timestamp="$(date '+%Y-%m-%d %H:%M:%S')"
  case "$level" in
    info)
      echo "[$timestamp] INFO: $message" >> "$LOG_FILE"
      echo "$message" | gum style --foreground "${COLORS[info]}" --padding "0 1"
      ;;
    success)
      echo "[$timestamp] SUCCESS: $message" >> "$LOG_FILE"
      echo "$message" | gum style --foreground "${COLORS[success]}" --padding "0 1"
      ;;
    warning)
      echo "[$timestamp] WARNING: $message" >> "$LOG_FILE"
      echo "$message" | gum style --foreground "${COLORS[warning]}" --padding "0 1"
      ;;
    error)
      echo "[$timestamp] ERROR: $message" >> "$LOG_FILE"
      echo "$message" | gum style --foreground "${COLORS[error]}" --padding "0 1"
      ;;
    *)
      echo "[$timestamp] $level: $message" >> "$LOG_FILE"
      echo "$message" | gum style --foreground "${COLORS[muted]}" --padding "0 1"
      ;;
  esac
}

section_header() {
  local title="$1"
  echo ""
  echo "$title" | gum style \
    --foreground "${COLORS[primary]}" \
    --border double \
    --border-foreground "${COLORS[border]}" \
    --padding "1 2" \
    --align center \
    --width 60 \
    --bold
}

step_indicator() {
  local step="$1"
  local total="$2"
  local description="$3"
  echo "Step ${step}/${total}: ${description}" | gum style \
    --foreground "${COLORS[secondary]}" \
    --padding "0 1" \
    --bold
}

with_spinner() {
  local description="$1"
  shift
  gum spin --spinner dot --title "$description" -- "$@"
}

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

ensure_gum() {
  if ! command_exists gum; then
    echo "============================================================"
    echo "Installing Gum (TUI Toolkit)"
    echo "============================================================"
    echo "Gum not found. Installing from official repository..."
    if dnf install -y https://github.com/charmbracelet/gum/releases/download/v2.0.0/gum-2.0.0-1.x86_64.rpm; then
      if command_exists gum; then
        log success "Gum installed successfully!"
        log info "Gum version: $(gum --version)"
      else
        echo "ERROR: Gum installation failed. Please install manually from https://github.com/charmbracelet/gum"
        exit 1
      fi
    else
      echo "ERROR: Failed to install Gum. This script requires Gum."
      exit 1
    fi
  else
    log info "Gum is already installed: $(gum --version)"
  fi
}

# -----------------------------------------------------------------------------
# Main Bootstrap Functions
# -----------------------------------------------------------------------------

install_dnf_setup() {
  section_header "Setting up DNF Package Manager"
  step_indicator 1 3 "Installing DNF plugins and GPG keys"
  log info "Installing epel-release and dependencies..."
  if dnf install -y epel-release distribution-gpg-keys dnf-plugins-core; then
    log success "DNF plugins installed"
  else
    log error "Failed to install DNF plugins"
    return 1
  fi

  step_indicator 2 3 "Enabling additional repositories"
  log info "Enabling CRB, HA, NFV, RT repositories..."
  if dnf config-manager --set-enabled crb highavailability nfv rt; then
    log success "Repositories enabled"
  else
    log error "Failed to enable repositories"
    return 1
  fi

  step_indicator 3 3 "Importing RPM Fusion GPG keys"
  local rhel_version
  rhel_version=$(rpm -E %rhel)
  log info "Importing RPM Fusion keys..."
  if rpmkeys --import /usr/share/distribution-gpg-keys/rpmfusion/RPM-GPG-KEY-rpmfusion-free-el-${rhel_version} \
    && rpmkeys --import /usr/share/distribution-gpg-keys/rpmfusion/RPM-GPG-KEY-rpmfusion-nonfree-el-${rhel_version}; then
    log success "GPG keys imported"
  else
    log error "Failed to import GPG keys"
    return 1
  fi

  log info "Installing RPM Fusion repositories..."
  if dnf --setopt=localpkg_gpgcheck=1 install -y \
      https://mirrors.rpmfusion.org/free/el/rpmfusion-free-release-${rhel_version}.noarch.rpm \
      https://mirrors.rpmfusion.org/nonfree/el/rpmfusion-nonfree-release-${rhel_version}.noarch.rpm; then
    log success "RPM Fusion repositories installed"
  else
    log error "Failed to install RPM Fusion repositories"
    return 1
  fi

  if gum confirm --affirmative "Yes" --negative "Skip" \
    "Do you want to clean the DNF cache and update it?"; then
    log info "Cleaning DNF cache and updating..."
    if dnf clean all && dnf makecache; then
      log success "DNF cache updated"
    else
      log warning "DNF cache update had issues, continuing anyway"
    fi
  else
    log info "Skipping DNF cache clean and update"
  fi
  return 0
}

install_core_packages() {
  section_header "Installing Core Development Packages"
  local packages=(
    "ansible-core"
    "ansible-collection-ansible-posix"
    "ansible-collection-ansible-utils"
    "curl"
    "git"
    "gcc"
    "make"
    "procps-ng-devel"
    "micro"
    "htop"
    "cargo"
    "pipx"
    "python3.14"
    "flatseal"
  )
  log info "The following packages will be installed:"
  printf '  %s\n' "${packages[@]}" | gum style --foreground "${COLORS[secondary]}"
  if gum confirm --affirmative "Install" --negative "Skip" \
    "Proceed with installing these packages?"; then
    log info "Installing core packages..."
    if dnf install -y "${packages[@]}"; then
      log success "Core packages installed"
    else
      log error "Failed to install core packages"
      return 1
    fi
  else
    log info "Skipping core package installation"
    return 0
  fi

  step_indicator 1 1 "Updating all installed packages"
  if gum confirm --affirmative "Update" --negative "Skip" \
    "Run system update (dnf update)?"; then
    log info "Updating system packages..."
    if dnf update -y; then
      log success "System updated"
      if [[ -f /var/run/reboot-required ]]; then
        log warning "A system reboot is required for some updates"
        if gum confirm --affirmative "Reboot" --negative "Later" \
          "Reboot now to apply all updates?"; then
          log info "Rebooting system..."
          reboot
        fi
      fi
    else
      log warning "System update skipped or failed"
    fi
  fi
  return 0
}

install_yadm() {
  section_header "Installing YADM (Dotfile Manager)"
  if command_exists yadm; then
    log info "YADM is already installed: $(yadm --version)"
    return 0
  fi
  if gum confirm --affirmative "Install" --negative "Skip" \
    "Install YADM for managing dotfiles?"; then
    if with_spinner "Downloading and installing YADM" \
      curl -fLo /usr/local/bin/yadm https://github.com/yadm-dev/yadm/raw/master/yadm \
      && chmod a+x /usr/local/bin/yadm; then
      log success "YADM installed to /usr/local/bin/yadm"
      log info "YADM version: $(/usr/local/bin/yadm --version)"
    else
      log error "Failed to install YADM"
      return 1
    fi
  else
    log info "Skipping YADM installation"
    return 0
  fi
  return 0
}


# -----------------------------------------------------------------------------
# Interactive Menu System
# -----------------------------------------------------------------------------

show_main_menu() {
  echo "" | gum style --foreground "${COLORS[primary]}" --border double --padding "1 2" --align center \
    "Workstation Bootstrap Orchestrator"
  echo "" | gum style --foreground "${COLORS[secondary]}" --padding "0 2" --align center \
    "Select components to install"
  echo "" | gum style --foreground "${COLORS[muted]}" --padding "0 2" \
    "Choose what to install (use space to select, enter to confirm):"
  local choices=(
    "DNF Setup (Plugins, Repos, GPG Keys)"
    "Core Development Packages (ansible, git, gcc, etc.)"
    "YADM (Dotfile Manager)"
    "All of the above (Full Bootstrap)"
    "Exit"
  )
  local selected
  selected=$(printf '%s\n' "${choices[@]}" | gum choose --no-limit --height 10)
  echo "$selected" > "$STATE_FILE"
  
  if [[ -z "$selected" ]]; then
    log info "No selection made. Exiting."
    exit 0
  fi

  if [[ "$selected" == *"Exit"* ]]; then
    log info "Exiting bootstrap script"
    exit 0
  fi

  if [[ "$selected" == *"All of the above"* ]]; then
    install_dnf_setup
    install_core_packages
    install_yadm
  else
    if [[ "$selected" == *"DNF Setup"* ]]; then install_dnf_setup; fi
    if [[ "$selected" == *"Core Development Packages"* ]]; then install_core_packages; fi
    if [[ "$selected" == *"YADM"* ]]; then install_yadm; fi
  fi
}

show_summary() {
  section_header "Bootstrap Complete"
  echo "" | gum style --foreground "${COLORS[success]}" --padding "0 1" \
    "Your workstation bootstrap has completed!"
  echo "" | gum style --foreground "${COLORS[info]}" --padding "0 1" \
    "Next steps you might want to take:"
  local next_steps=(
    "Run 'yadm clone' to set up your dotfiles"
    "Run 'dnf autoremove' to clean up unused packages"
    "Review the log file at: $LOG_FILE"
    "Restart your terminal to apply all PATH changes"
  )
  printf '  %s\n' "${next_steps[@]}" | gum style --foreground "${COLORS[secondary]}" --padding "0 1"
  echo "" | gum style --foreground "${COLORS[primary]}" --border double --padding "1 2" --align center \
    "Thank you for using Workstation Bootstrap Orchestrator!"
}

# -----------------------------------------------------------------------------
# Main Execution
# -----------------------------------------------------------------------------

main() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Bootstrap script started" > "$LOG_FILE"
  
  ensure_gum

  echo "" | gum style \
    --foreground "${COLORS[primary]}" \
    --border double \
    --border-foreground "${COLORS[border]}" \
    --padding "2 4" \
    --align center \
    "Welcome to Workstation Bootstrap Orchestrator"
  echo "" | gum style \
    --foreground "${COLORS[secondary]}" \
    --padding "0 2" \
    --align center \
    "A wonderfully warm, colorful TUI for provisioning your development environment"
  echo "" | gum style \
    --foreground "${COLORS[muted]}" \
    --padding "0 2" \
    --align center \
    "Press Ctrl+C at any time to interrupt the process"

  while true; do
    show_main_menu
    if gum confirm --affirmative "Yes" --negative "No" \
      "Do you want to install more components?"; then
      continue
    else
      break
    fi
  done
  show_summary
  cleanup "EXIT"
}

flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo

main "$@"






