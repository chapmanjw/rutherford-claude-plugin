---
description: "Probe every Rutherford agent and report which spawn, handshake, and answer."
---

Run a health check across the whole Rutherford roster.

Call the `doctor` tool with no arguments to probe every agent (or pass `$ARGUMENTS` as the `agent` id to probe just one). Each agent gets a real read-only ACP round trip and comes back in one of these states: `ok`, `no_answer`, `handshake_failed`, `not_installed`, or `error`.

Summarize the results:

- Group agents by state. Lead with the `ok` ones, then everything that needs attention.
- For any agent that reports an `install_hint`, surface that hint verbatim so the user knows the exact install/adapter step.
- For anything in `handshake_failed`, `no_answer`, or `error`, point the user at the `troubleshoot-connection` skill for fixes.

If a model call fails for a reason outside ACP (auth or entitlement) rather than a launch problem, mention that `doctor` with `connect_only=true` runs the lighter handshake-only check and reports advertised models, which separates a broken login from a broken spawn.
