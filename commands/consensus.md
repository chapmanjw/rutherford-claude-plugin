---
description: "Ask several agents the same question and compare their answers or take a vote."
argument-hint: "<question>"
---

Run a Rutherford `consensus` over the user's question.

Treat $ARGUMENTS as the prompt. Call `consensus` with it. Omit `targets` (or pass `"all"`) to fan out to
every registered agent at its default model; name `targets` for a specific crew, or pass `panel="<name>"`
to reuse a saved one.

- Default `strategy` is `all-voices`: show every voice side by side, and note any that failed.
- If the user is asking for a decision rather than a discussion, pick an aggregating `strategy`
  (`majority`, `unanimous`, `plurality`, `weighted`, or `rank`) and report the single verdict plus the
  split.
- Add `synthesize=true` for a combined answer across the voices.

Consensus is read-only: it never edits files. Lean on the `multi-agent-consensus` skill for the full
argument surface. For a long run, add `mode="async"` and hand back the `job_id`.
