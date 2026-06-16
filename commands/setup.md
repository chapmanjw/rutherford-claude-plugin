---
description: "Set up and verify Rutherford: check the connection, run doctor, and scaffold config."
---

Run the Rutherford setup flow. Invoke the `setup-rutherford` skill and follow its
steps in order.

If the user passed anything, treat $ARGUMENTS as scope or intent hints (for
example "global", or "install adapters") and carry them into the relevant step.

Walk the skill's steps:

1. Confirm Rutherford is connected by calling `capabilities`.
2. Run `doctor` to probe each agent with a real read-only round trip.
3. Scaffold config with `setup` (start with `write=false` to preview the path and
   starter `config.toml`, then `write=true` once the user agrees).
4. Use `discover` to find installed ACP agents and `setup` with
   `install_adapters=true` for any agent whose CLI is present but whose npm shim
   is missing.

If the Rutherford tools are not available at all (the calls above fail because no
Rutherford tool is registered), stop the setup steps and switch to the
`troubleshoot-connection` skill to diagnose the MCP connection first.
