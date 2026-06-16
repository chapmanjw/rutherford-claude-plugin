---
description: "Allowlist the Rutherford tools and .rutherford directories so they stop prompting."
---

Set up Claude Code permissions for Rutherford so the config and inspection flows stop prompting.

Invoke the `configure-permissions` skill. Walk its steps:

1. Find the real Rutherford MCP tool prefix from the available tool names (or have the user run `/mcp`).
2. Ask which settings file to write — default to `.claude/settings.local.json` for the project rules and
   the home `~/.rutherford/**` rules to `~/.claude/settings.json`.
3. Show the exact allowlist block (read/write on the `.rutherford` directories plus the safe config and
   inspection tools), then merge it into `permissions.allow` without overwriting the file.
4. Confirm a previously-prompting call (like `reload_panels` or `doctor`) now runs without a prompt.

If $ARGUMENTS asks for zero prompts, offer the all-tools form (`mcp__<prefix>`) and note that Rutherford's
own write gate still applies. Do not auto-approve the agent-spawning tools by default.
