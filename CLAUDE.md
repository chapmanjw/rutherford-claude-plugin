# CLAUDE.md

Guidance for Claude Code working in this repository.

## Commands

```sh
node scripts/validate-plugin.mjs   # validate manifests, .mcp.json, and skill/agent/command frontmatter (Node 20+)
```

No build step — every file is plain markdown or JSON, except two small Node scripts:
`scripts/validate-plugin.mjs` (CI only) and `hooks/persona.mjs` (the persona hook). Changes take effect
the next time the plugin is reloaded; hook, MCP, and agent changes in particular need a full reload
(`/reload-plugins` or restart Claude Code), not just a re-read of a skill file.

## Architecture

This is the Claude-facing piece of a two-repository system:

```
Claude Code
  | MCP over stdio
rutherford-mcp-server        <- the MCP server (separate repo, PyPI), the ACP client
  | ACP over stdio, one session per voice
the coding agents            <- claude-agent-acp, codex-acp, goose acp, cursor-agent acp, ...
```

The plugin adds five things on top of the server:

- A bundled [`.mcp.json`](.mcp.json) that auto-registers the server (`uvx rutherford-mcp-server`) when the
  plugin is enabled, so install is one step.
- Thirteen skills under `skills/<name>/SKILL.md` — seven for setup and configuration, six for driving the
  crew.
- A `rutherford-orchestrator` agent that routes a request to the right mode.
- Seven `/rutherford:*` slash commands as thin entry points.
- Two hooks under `hooks/` (a `PostToolUse` hook on the Rutherford tools and an all-prompts
  `UserPromptSubmit` hook) that inject the Sam Rutherford persona, so the voice and banner surface even on
  a bare MCP tool call or plain Q&A, the paths no skill or command text covers. See
  [the persona note](#the-persona).

### File structure

```
.claude-plugin/plugin.json        plugin manifest
.claude-plugin/marketplace.json   marketplace manifest (name: rutherford-claude)
.mcp.json                         auto-registers the Rutherford MCP server (uvx)
agents/rutherford-orchestrator.md mode-routing agent
commands/*.md                     slash commands (/rutherford:<name>)
hooks/hooks.json                  hook config: PostToolUse + UserPromptSubmit (auto-discovered)
hooks/persona.mjs                 hook script (both modes): emits the persona as additionalContext
hooks/persona-injection.md        text injected after a tool call (banner, voice, guardrail)
hooks/persona-prompt.md           text injected on every prompt (self-gating: Sam only if relevant)
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

## The persona

The plugin speaks as Ensign Sam Rutherford (*Star Trek: Lower Decks*). `reference/persona.md` is the full
character sheet: voice, tics, quotes, the greeting protocol, and the guardrail that the character never
overrides honest work. The persona is wired onto every entry point, because each one reaches Claude
differently:

- Skills carry an "Open as Rutherford" heading block with the banner; slash commands carry an equivalent
  "Speak as Rutherford" block. Either way, an explicitly invoked skill or `/rutherford:*` command opens in
  voice.
- The `rutherford-orchestrator` agent has the persona too. Invoked as a subagent its voice does not
  surface to the main conversation, so for that path treat it as a fallback. Run as the main session agent
  (`claude --agent rutherford:rutherford-orchestrator`) its voice does surface: the agent sets
  `initialPrompt: Hello`, which auto-submits "Hello" as the first turn on a bare `--agent` launch (no
  prompt in the command), and its "Opening a session" section turns that into the banner and crew menu.
  `color: cyan` applies on the same launch. Test this with an interactive `--agent` launch, not headless
  `claude -p`: print mode requires an explicit prompt, so its input guard fires before `initialPrompt`
  and makes the field look inert when it is not.
- The hooks under `hooks/` inject the persona where no skill or command text loads. The `PostToolUse`
  hook frames the result of any Rutherford tool call (the most common path: a bare MCP call). The
  `UserPromptSubmit` hook fires on every prompt with a self-gating note (be Sam only when the turn is
  about Rutherford), which covers plain Q&A that never calls a tool.

If you add a skill, copy its "Open as Rutherford" block; if you add a command, copy the "Speak as
Rutherford" block, so the entry point stays in voice. If you add a Rutherford tool whose name does not
contain "rutherford", widen the matcher in `hooks/hooks.json`.

## CI and releasing

`.github/workflows/ci.yml` runs `node scripts/validate-plugin.mjs` on every push and pull request — the
manifests, the bundled `.mcp.json`, skill/agent/command frontmatter, the marketplace/plugin name match,
version lockstep, and that every `${CLAUDE_PLUGIN_ROOT}/...` reference resolves.

To release: bump `version` in `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json` together
(the validator enforces lockstep), add a dated `## [X.Y.Z]` section to [`CHANGELOG.md`](CHANGELOG.md),
commit to `main`, then `git tag vX.Y.Z && git push --tags`. The tag triggers
`.github/workflows/release.yml`, which re-validates, fails unless the tag matches the manifest version,
extracts the matching `CHANGELOG` section, and publishes a GitHub Release with those notes. There is no
package to publish — Claude reads `marketplace.json` straight from the repo.
