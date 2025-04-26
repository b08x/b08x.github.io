---
layout: post
title: "Ruby CLI Interaction: Gum || TTY::Prompt"
date: 2025-04-25 08:04:31 -0400
category:
author:
tags: []
description: ""
related_posts: true
giscus_comments: true
tabs: true
---


This article analyzes the architectural choices and trade-offs between using the `gum` CLI utility and the `tty-prompt` Ruby gem for handling user interactions within the RubyRAG command-line interface.

## 1. Mapping the Technical Domain

The primary goal is to facilitate user input, selections, and configuration within the RubyRAG CLI application. The two main contenders offer different approaches:

- **`gum`**: Leverages an external, general-purpose CLI utility for rich terminal interactions.

- **`TTY::Prompt`**: Utilizes a dedicated Ruby gem specifically designed for building interactive command-line prompts.

## 2. Analyzing the Implementation

### `gum`

- **Dependency**: Requires the `gum` binary to be installed on the host system.

- **Integration**: Interacts with Ruby via shell execution (` `` ` or `system()`).

- **Example**:

  ```shell
  # In Ruby code:
  user_input = `gum input --placeholder "Enter text..."`.strip
  confirmation = system("gum confirm 'Proceed?'") # Returns true/false based on exit code
  ```

- **Features**: Supports various modes (input, write, choose, confirm, filter, etc.) configured via command-line flags.

### `TTY::Prompt`

- **Dependency**: Requires the `tty-prompt` gem added to the project's `Gemfile` and managed by Bundler.

- **Integration**: Uses native Ruby objects and method calls within the application code.

- **Example**:

  ```ruby
  require 'tty-prompt'

  prompt = TTY::Prompt.new
  user_input = prompt.ask("Enter text:")
  confirmation = prompt.yes?('Proceed?') # Returns true/false
  ```

- **Features**: Offers Ruby-native features like block-based input collection (`collect`), sliders (`slider`), keypress events, extensive customization options, and tighter integration with Ruby logic.

### Feature Comparison

| Feature          | `gum`                         | `TTY::Prompt`                 | Notes                                          |
| :--------------- | :---------------------------- | :---------------------------- | :--------------------------------------------- |
| Dependency       | External Binary               | Ruby Gem                      | System-level vs. Project-level dependency      |
| Integration      | Shell out (` `` `)            | Native Ruby Objects           | Loose vs. Tight coupling with Ruby code        |
| Basic Input      | Yes (`gum input`)             | Yes (`prompt.ask`)            | Equivalent basic functionality                 |
| Multi-select     | Yes (`gum choose --no-limit`) | Yes (`prompt.multi_select`)   | Both support                                   |
| Masking/Password | Yes (`gum input --password`)  | Yes (`prompt.mask`)           | Both support                                   |
| Yes/No           | Yes (`gum confirm`)           | Yes (`prompt.yes?`)           | Both support                                   |
| Complex Flows    | Scripting multiple calls      | `collect` block, Ruby methods | TTY offers more structured Ruby approach       |
| Sliders          | No                            | Yes (`prompt.slider`)         | Useful for numerical ranges (e.g., LLM params) |
| Keypress Events  | Limited (via shell)           | Yes                           | TTY has richer event handling                  |
| Learning Curve   | Low for basic use             | Low for basic use             | Similar initially                              |

## 3. Evaluating the Architecture

- **`gum`**:

  - **Pros**: Lightweight for the Ruby app itself; leverages a potentially familiar external tool.

  - **Cons**: Introduces external system dependency; potential fragility/overhead of shell execution (quoting, error handling, environment variables); limits complex interactions to sequences of separate `gum` calls.

  - **Architectural Style**: Composition of external tools.

- **`TTY::Prompt`**:

  - **Pros**: Keeps interaction logic within the Ruby ecosystem; tighter integration; better Ruby-native error handling; enables complex, stateful interactions (like `collect`, `slider`) more naturally; dependencies managed via Bundler.

  - **Cons**: Increases the Ruby project's dependency footprint (adds a gem).
  
  - **Architectural Style**: Integrated library-based solution.

## 4. Applying Domain Wit (Complexity, Evolution, Implications & Parallels)

- **Complexity**:

- `gum`: Shifts complexity outward to the system environment and managing inter-process communication (shelling out).

  - `TTY::Prompt`: Internalizes complexity within the Ruby application's dependencies and code structure.
  
  - _Insight_: The choice reflects where complexity is preferred: external environment vs. internal application code.

- **Evolution**:

- Simple CLIs might start effectively with `gum`.

  - As features demand more sophisticated interactions (sliders for LLM params, multi-step conditional inputs), `TTY::Prompt` becomes increasingly advantageous. Relying on `gum` long-term could lead to complex, brittle shell scripting _within_ Ruby.
  
  - _Insight_: This mirrors system evolution from simple scripts to integrated libraries as requirements grow. `TTY::Prompt` offers a smoother evolutionary path for rich CLI features.

- **Implications**:

- `gum`: Requires users to install `gum`, impacting portability and setup.

  - `TTY::Prompt`: Bundles the dependency, ensuring it's present after `bundle install`, leading to more self-contained deployment.
  
  - _Insight_: Dependency management strategy differs significantly, affecting user experience and deployment ease.

- **Technical Parallel**:

- Choosing `gum` vs. `TTY::Prompt` is like choosing between using `system('curl ...')` vs. using a Ruby HTTP client gem (`Faraday`, `HTTParty`). The external tool is fine for simple cases, but the integrated library offers better control, error handling, and features for complex scenarios within the application's native language.

## 5. Recommendation

For RubyRAG, which is likely to benefit from more advanced user interactions like configuring LLM parameters (e.g., using sliders for temperature or max tokens) or potentially complex setup flows, **`TTY::Prompt` is the recommended architectural choice.**

It provides:

- Better integration with Ruby code.

- A clearer path for evolving UI sophistication.

- More robust error handling within the application.

- Self-contained dependency management via Bundler.

## 6. Sources and Documentation

- **`gum`**: [https://github.com/charmbracelet/gum](https://github.com/charmbracelet/gum)

- **`TTY::Prompt`**: [https://github.com/piotrmurach/tty-prompt](https://github.com/piotrmurach/tty-prompt)
