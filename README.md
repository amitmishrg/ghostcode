# GhostCode

GhostCode is an AI pair programmer for your terminal. Chat in a full-screen TUI, plan changes read-only or switch to build mode to edit files and run commands in your current project — with persisted sessions and your choice of Claude or GPT models.

Runs entirely locally: no server, database, or auth required. Bring your own API keys via `export` or a project `.env` file.

## Features

- **Terminal UI** — Full-screen chat experience in the terminal with session history
- **PLAN / BUILD modes** — Read-only planning vs. full implementation with file edits and shell commands
- **Local tool execution** — Tools run in your project directory (`readFile`, `writeFile`, `editFile`, `glob`, `grep`, `bash`)
- **Multiple models** — Claude Sonnet, Haiku, Opus, and GPT-5.4
- **Project memory** — Load instructions from `Ghost.md` files
- **Session persistence** — JSONL transcripts stored per project under `~/.ghostcode/projects/`

## Monorepo structure

| Package             | Description                                               |
| ------------------- | --------------------------------------------------------- |
| `@ghostcode/cli`    | Terminal client (`ghostcode` binary)                      |
| `@ghostcode/shared` | Shared Zod schemas, tool contracts, and model definitions |

## Prerequisites

- [Bun](https://bun.sh)
- Anthropic and/or OpenAI API key

## Getting started

### 1. Install dependencies

```bash
bun install
```

### 2. Configure API keys

Export keys in your shell:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
export OPENAI_API_KEY=sk-proj-...
```

Or copy [`.env.example`](.env.example) to `.env` in the project where you run `ghostcode`.

You can also set keys in `~/.ghostcode/settings.json`:

```json
{
  "env": {
    "ANTHROPIC_API_KEY": "sk-ant-..."
  },
  "defaultModel": "claude-opus-4-6"
}
```

Shell exports take precedence over settings files.

### 3. Run GhostCode

From any project directory:

```bash
bun run dev:cli
```

Or build and link globally:

```bash
bun run link:cli
ghostcode
```

## Storage layout

Sessions are stored outside your repo, keyed by the directory you run from:

```
~/.ghostcode/
  settings.json              # global defaults
  Ghost.md                   # optional global project memory
  projects/
    Users-me-my-app/         # encoded path of process.cwd()
      <session-id>.jsonl       # append-only session transcript
```

Project-specific config in your repo:

```
my-app/
  Ghost.md                   # project instructions for the agent
  Ghost.local.md             # personal overrides (gitignore this)
  .ghostcode/
    settings.json            # shared project settings (defaultModel, themeName)
    settings.local.json      # machine-specific overrides (gitignore)
    preferences.json         # shared project theme (alternative to themeName in settings)
```

Theme precedence (highest wins): `settings.local.json` → `.ghostcode/preferences.json` → `settings.json` → `~/.ghostcode/preferences.json` → `~/.ghostcode/settings.json`.

Available identity profiles (Tab → `/theme`): **Spectre**, **Haunt**, **Poltergeist**, **Wraith**, **Phantasm**, **Glitch**.

Add to your project `.gitignore`:

```
Ghost.local.md
.ghostcode/settings.local.json
```

## Scripts

| Script              | Description                                    |
| ------------------- | ---------------------------------------------- |
| `bun run dev:cli`   | Run the CLI with file watching                 |
| `bun run build:cli` | Build the CLI to `packages/cli/dist`           |
| `bun run link:cli`  | Build and globally link the `ghostcode` binary |

## Modes

| Mode      | Tools available                                     |
| --------- | --------------------------------------------------- |
| **PLAN**  | `readFile`, `listDirectory`, `glob`, `grep`         |
| **BUILD** | All PLAN tools plus `writeFile`, `editFile`, `bash` |

## Environment variables

| Variable               | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `ANTHROPIC_API_KEY`    | Required for Claude models                       |
| `OPENAI_API_KEY`       | Required for GPT models                          |
| `GHOSTCODE_CONFIG_DIR` | Override default `~/.ghostcode` config directory |
