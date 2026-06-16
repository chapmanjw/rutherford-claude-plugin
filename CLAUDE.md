# CLAUDE.md

Guidance for Claude Code working in this repository.

## Commands

```sh
node scripts/validate-plugin.mjs   # validate manifests, .mcp.json, and skill/agent/command frontmatter (Node 20+)
```

No build step — every file is plain markdown or JSON. Changes take effect the next time the plugin is
reloaded (restart Claude Code, or re-add the marketplace from a local checkout).

## Architecture

This is the Claude-facing piece of a two-repository system:

```
Claude Code
  | MCP over stdio
rutherford-mcp-server        <- the MCP server (separate repo, PyPI), the ACP client
  | ACP over stdio, one session per voice
the coding agents            <- claude-agent-acp, codex-acp, goose acp, cursor-agent acp, ...
```

The plugin adds four things on top of the server:

- A bundled [`.mcp.json`](.mcp.json) that auto-registers the server (`uvx rutherford-mcp-server`) when the
  plugin is enabled, so install is one step.
- Thirteen skills under `skills/<name>/SKILL.md` — seven for setup and configuration, six for driving the
  crew.
- A `rutherford-orchestrator` agent that routes a request to the right mode.
- Seven `/rutherford:*` slash commands as thin entry points.

### File structure

```
.claude-plugin/plugin.json        plugin manifest
.claude-plugin/marketplace.json   marketplace manifest (name: rutherford-claude)
.mcp.json                         auto-registers the Rutherford MCP server (uvx)
agents/rutherford-orchestrator.md mode-routing agent
commands/*.md                     slash commands (/rutherford:<name>)
skills/<name>/SKILL.md            skill playbooks (instructions to Claude)
reference/*.md                    ground-truth docs the skills cite (tools, safety, panels, config, permissions, persona)
docs/images/logo.png              project logo
examples/                         copyable panels.toon, a role, and config.toml
scripts/validate-plugin.mjs       CI validation
```

### Adding a skill

1. Create `skills/<kebab-name>/SKILL.md` with frontmatter `name` (identical to the folder) and
   `description`. Nothing else in the frontmatter.
2. Make the `description` a concrete trigger — it is what decides when Claude invokes the skill.
3. Run `node scripts/validate-plugin.mjs`.

### Conventions

- A skill body is an instruction set for Claude executing the skill, not documentation for a human.
- Refer to Rutherford's MCP tools by plain name (`delegate`, `consensus`, `doctor`, ...). Do not hardcode
  a fully-qualified `mcp__...` name and do not add an `allowed-tools` frontmatter key; the tool prefix
  varies by install.
- Every tool name and argument must match [`reference/tools.md`](reference/tools.md). The reference docs
  are the single source of truth the skills cite; update them when the server changes.
- Reference bundled files at runtime with `${CLAUDE_PLUGIN_ROOT}/...`.
- Follow the writing style: direct, concrete, no AI tropes (no "not X, it's Y", no bold-first bullets, no
  em-dash spam). Straight quotes and ASCII arrows.

## CI and releasing

`.github/workflows/ci.yml` runs `node scripts/validate-plugin.mjs` on every push and pull request — the
manifests, the bundled `.mcp.json`, skill/agent/command frontmatter, the marketplace↔plugin name match,
version lockstep, and that every `${CLAUDE_PLUGIN_ROOT}/...` reference resolves.

To release: bump `version` in `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json` together
(the validator enforces lockstep), add a dated `## [X.Y.Z]` section to [`CHANGELOG.md`](CHANGELOG.md),
commit to `main`, then `git tag vX.Y.Z && git push --tags`. The tag triggers
`.github/workflows/release.yml`, which re-validates, fails unless the tag matches the manifest version,
extracts the matching `CHANGELOG` section, and publishes a GitHub Release with those notes. There is no
package to publish — Claude reads `marketplace.json` straight from the repo.
