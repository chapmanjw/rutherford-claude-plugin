# Changelog

All notable changes to this plugin are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-06-15

Initial release.

### Added

- Auto-registration of the Rutherford MCP server via a bundled `.mcp.json` that launches
  `uvx rutherford-mcp-server`, so install is one step.
- Thirteen skills. Setup and configuration: `setup-rutherford`, `configure-panels`,
  `configure-defaults`, `configure-roles`, `add-agents`, `configure-permissions`,
  `troubleshoot-connection`. Driving the crew: `delegate-task`, `multi-agent-consensus`, `agent-debate`,
  `code-review-panel`, `background-jobs`, `safe-write-delegation`.
- A `rutherford-orchestrator` agent that health-checks the crew and routes a request to the right mode.
- Seven slash commands: `/rutherford:setup`, `/rutherford:doctor`, `/rutherford:panels`,
  `/rutherford:permissions`, `/rutherford:consensus`, `/rutherford:debate`, `/rutherford:review`.
- A `configure-permissions` skill (and a `setup-rutherford` step) that writes a recommended Claude Code
  permission allowlist for the Rutherford tools and the `.rutherford` directories, with the user's
  confirmation.
- Reference docs the skills cite: `reference/tools.md`, `reference/safety.md`, `reference/panels.md`,
  `reference/config.md`, `reference/permissions.md`, `reference/persona.md`.
- The Rutherford persona: every skill and the orchestrator greet and work in the cheery, crew-first voice
  of Ensign Sam Rutherford (*Star Trek: Lower Decks*), opening with an ASCII banner. `reference/persona.md`
  holds the voice, the verbatim show quotes, the greeting protocol, and the guardrail that the character
  never overrides accurate, honest work or a safety gate.
- The project logo (`docs/images/logo.png`) and a "The name" section in the README, carried over from the
  Rutherford MCP server.
- Examples to copy: `examples/panels.toon` (code-review, design-roundtable, ship-vote), the
  `principal-reviewer` role, and a commented `config.toml`.
- `scripts/validate-plugin.mjs` plus CI (`ci.yml`) and release (`release.yml`) workflows. Validation
  covers the manifests, the bundled MCP config, skill/agent/command frontmatter, version lockstep, and
  that every `${CLAUDE_PLUGIN_ROOT}/...` reference resolves; the release workflow enforces tag↔version
  match and publishes a GitHub Release from the changelog on a `vX.Y.Z` tag.
- Passive usage badges (PyPI downloads, version, stars) with a note that the plugin emits no telemetry.

[0.1.0]: https://github.com/chapmanjw/rutherford-claude-plugin/releases/tag/v0.1.0
