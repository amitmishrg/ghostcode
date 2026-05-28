# GhostCode CLI

Provider-agnostic, terminal-native AI coding assistant.

GhostCode CLI runs fully local with your own API keys and supports both Anthropic and OpenAI models in one workflow.

## Install

```bash
npm install -g @ghostcode/cli
```

or

```bash
bun install -g @ghostcode/cli
```

## Run

From your project directory:

```bash
ghostcode
```

## Quick usage

```bash
# Open interactive TUI
ghostcode

# Set provider keys (one or both)
export ANTHROPIC_API_KEY=sk-ant-...
export OPENAI_API_KEY=sk-proj-...
```

Inside GhostCode:
- `tab` to toggle PLAN/BUILD mode
- `/models` to switch model
- `/theme` to switch UI profile
- `/sessions` to resume previous chats

## Screenshots

### Launch

![GhostCode launch screen](./screenshots/launch-screen.png)

### Session

![GhostCode session view](./screenshots/session-view.png)

### Theme Picker

![GhostCode theme picker](./screenshots/theme-picker.png)

### Command Palette

![GhostCode command palette](./screenshots/command-palette.png)

## Environment variables

- `ANTHROPIC_API_KEY` for Claude models
- `OPENAI_API_KEY` for GPT models
- `GHOSTCODE_CONFIG_DIR` to override default config path (`~/.ghostcode`)

## Highlights

- Full-screen terminal UI
- PLAN/BUILD modes
- Local file + shell tools
- Session persistence per project
- Project memory via `Ghost.md`

For full product documentation and screenshots, see the repository root `README.md`.
