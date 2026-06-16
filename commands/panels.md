---
description: "Create, edit, or list saved Rutherford panels, then reload them."
argument-hint: "[panel name or change]"
---

Manage saved Rutherford panels (the named crews that back `consensus`, `debate`, and `review`).

Invoke the `configure-panels` skill for the panel schema, file locations, and editing steps.

Argument: $ARGUMENTS

- If $ARGUMENTS is empty: call `reload_panels` to pick up any on-disk edits, then list the
  available panels by name with their description, strategy, and target count.
- Otherwise: treat $ARGUMENTS as the panel to author or edit (or the change to make). Follow the
  skill to write the seat list and strategy into the right `panels.toon`, then call `reload_panels`
  to apply and validate it. Report any validation error it returns (file, panel, seat) and fix it.
