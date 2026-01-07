---
layout: wiki-page
title: TUI Components & UX
wiki_id: omega-13
page_id: tui-and-ux
permalink: "/wikis/omega-13/09-tui-and-ux/"
repository: https://github.com/b08x/omega-13
left_sidebar: wiki-nav
right_sidebar: toc
right_sidebar_xl_only: true
show_metadata: false
related_pages:
- id: configuration-and-hotkeys
  url: "/wikis/omega-13/11-configuration-and-hotkeys/"
  title: Configuration And Hotkeys
file_paths:
- path: src/omega13/ui.py
  url: https://github.com/b08x/omega-13/blob/main/src/omega13/ui.py
- path: src/omega13/app.py
  url: https://github.com/b08x/omega-13/blob/main/src/omega13/app.py
pagination:
  previous:
    title: '08-transcription-service'
    url: "/wikis/omega-13/08-transcription-service/"
  next:
    title: 10-session-management
    url: "/wikis/omega-13/10-session-management/"
---

<details>
<summary>Relevant source files</summary>

The following files were used as context for generating this wiki page:
- [src/omega13/ui.py](https://github.com/b08x/omega-13/blob/main/src/omega13/ui.py)
- [src/omega13/app.py](https://github.com/b08x/omega-13/blob/main/src/omega13/app.py)
- [src/omega13/config.py](https://github.com/b08x/omega-13/blob/main/src/omega13/config.py)
- [src/omega13/session.py](https://github.com/b08x/omega-13/blob/main/src/omega13/session.py)
- [README.md](https://github.com/b08x/omega-13/blob/main/README.md)
- [CHANGELOG.md](https://github.com/b08x/omega-13/blob/main/CHANGELOG.md)
</details>

# TUI Components & UX

### 1. Introduction

The OMEGA-13 Terminal User Interface (TUI) is built using the `Textual` framework to provide a real-time control center for retroactive audio capture and transcription. It functions as a state-driven dashboard that coordinates between the `AudioEngine` (JACK/PipeWire), the `SessionManager` (file I/O), and the `TranscriptionService` (HTTP API). The interface is structurally divided into a monitoring pane for audio levels and a log-based display for transcription results, relying on a global hotkey mechanism to bridge the gap between background operation and foreground feedback.

### 2. Layout Architecture and Data Flow

The application uses a `Horizontal` layout split into a 40% control pane and a 60% transcription pane. The structural hierarchy is defined in `Omega13App.compose`, which yields a standard `Header`, `Footer`, and a main `Container` for the panes.

#### Component Hierarchy

- **Left Pane (`#left-pane`)**: Contains `#audio-controls` (status, session info, VU meters) and `#transcription-controls` (status label and clipboard toggle).
- **Right Pane (`#transcription-pane`)**: Dedicated to the `TranscriptionDisplay` widget for viewing output.

Sources: [src/omega13/app.py:#L36-L65](https://github.com/b08x/omega-13/blob/main/src/omega13/app.py#L36-L65), [src/omega13/app.py:#L130-L150](https://github.com/b08x/omega-13/blob/main/src/omega13/app.py#L130-L150)

#### Information Flow Mechanism

The TUI does not directly process audio; instead, it queries the `AudioEngine` state at regular intervals to update reactive widgets.

graph TD
    AE[AudioEngine] -->|Peaks/dB| APP[Omega13App]
    APP -->|Reactive Update| VU[VUMeter]
    TS[TranscriptionService] -->|Status/Text| APP
    APP -->|Update| TD[TranscriptionDisplay]
    CM[ConfigManager] -->|Settings| APP
    APP -->|Mount/Init| TD

Sources: [src/omega13/app.py:#L179-L195](https://github.com/b08x/omega-13/blob/main/src/omega13/app.py#L179-L195), [src/omega13/ui.py:#L16-L40](https://github.com/b08x/omega-13/blob/main/src/omega13/ui.py#L16-L40)

### 3. Core UI Components

#### VUMeter

A custom widget that visualizes audio input levels. It uses `Textual` reactive properties (`level`, `db_level`) to trigger UI updates. The bar color shifts from green to yellow to red based on the percentage of the signal, which is a fucking standard but necessary visual cue for preventing clipping.

| Property | Type | Description |
| :--- | :--- | :--- |
| `level` | `reactive(float)` | Linear amplitude (0.0 to 1.0) |
| `db_level` | `reactive(float)` | Logarithmic level in decibels |

Sources: [src/omega13/ui.py:#L16-L40](https://github.com/b08x/omega-13/blob/main/src/omega13/ui.py#L16-L40)

#### TranscriptionDisplay

This component manages the `RichLog` where text results appear. It is tightly coupled with the app's transcription status. While it claims to be a display widget, it also holds a reference to the `clipboard-toggle` checkbox, creating a somewhat messy dependency where the UI state directly influences whether the `SessionManager` or `TranscriptionService` triggers a system clipboard event.

Sources: [src/omega13/ui.py:#L42-L96](https://github.com/b08x/omega-13/blob/main/src/omega13/ui.py#L42-L96), [src/omega13/app.py:#L144-L148](https://github.com/b08x/omega-13/blob/main/src/omega13/app.py#L144-L148)

### 4. User Interaction & Modal Screens

The UX relies on `ModalScreen` instances for configuration tasks, ensuring that the main audio processing loop is not interrupted by blocking UI calls.

#### Input Selection Flow

The `InputSelectionScreen` allows users to toggle between Mono and Stereo modes and select JACK ports. This is a multi-step state machine within a modal.

sequenceDiagram
    participant U as User
    participant APP as Omega13App
    participant ISS as InputSelectionScreen
    participant AE as AudioEngine

    U->>APP: Press 'I'
    APP->>ISS: Push Screen (available_ports)
    ISS->>U: Show Mode Selection (Mono/Stereo)
    U->>ISS: Select Mode
    ISS->>U: Show Port List
    U->>ISS: Select Port(s)
    ISS->>APP: Dismiss with (port_tuple)
    APP->>AE: Update Input Connections

Sources: [src/omega13/ui.py:#L123-L157](https://github.com/b08x/omega-13/blob/main/src/omega13/ui.py#L123-L157), [src/omega13/app.py:#L80-L85](https://github.com/b08x/omega-13/blob/main/src/omega13/app.py#L80-L85)

### 5. Interaction Hotkeys and Bindings

The TUI maps specific keys to system actions, which are mirrored in the footer and help text.

| Key | Action | Method |
| :--- | :--- | :--- |
| `i` | Select Inputs | `action_open_input_selector` |
| `s` | Save Session | `action_save_session` |
| `t` | Manual Transcribe | `action_manual_transcribe` |
| `q` | Quit | `action_quit` |

Sources: [src/omega13/app.py:#L80-L85](https://github.com/b08x/omega-13/blob/main/src/omega13/app.py#L80-L85), [README.md:TUI Shortcuts]()

### 6. Observed Structural Inconsistencies

The system exhibits a "cooperative" but potentially fragile relationship between the TUI and the background engine. For instance, the `VUMeter` visibility is toggled based on the number of channels detected in the `AudioEngine` during `_update_meter_visibility`, but the UI layout itself (`#meters` container) has a fixed height of 5 in the CSS, which may lead to layout overflow or empty space if the channel count changes dynamically.

Furthermore, the `TranscriptionDisplay` queries the `status_label` and `clipboard_checkbox` from the global `app` instance during `on_mount`, rather than having them passed as parameters or managed via a formal provider pattern. This creates a hard structural link between the widget and the specific ID naming convention used in `app.py`.

Sources: [src/omega13/app.py:#L51-L55](https://github.com/b08x/omega-13/blob/main/src/omega13/app.py#L51-L55), [src/omega13/ui.py:#L60-L65](https://github.com/b08x/omega-13/blob/main/src/omega13/ui.py#L60-L65)

### 7. Conclusion

The TUI Components & UX of OMEGA-13 serve as a real-time visualization layer for a complex audio-to-text pipeline. By utilizing reactive widgets for level monitoring and modal screens for hardware configuration, the system maintains a responsive interface. However, the structural integrity relies heavily on string-based ID lookups across modules and a manual synchronization between the `AudioEngine` state and UI visibility.

Sources: [src/omega13/app.py](https://github.com/b08x/omega-13/blob/main/src/omega13/app.py), [src/omega13/ui.py](https://github.com/b08x/omega-13/blob/main/src/omega13/ui.py)