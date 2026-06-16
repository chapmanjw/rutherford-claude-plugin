---
description: "Review a diff or changed files across multiple agents."
argument-hint: "[paths or diff]"
---

Run a multi-agent code review.

Invoke the `code-review-panel` skill. Call the `review` tool across the user's agents (or
`panel="code-review"`) under the `principal-reviewer` persona. It returns every voice plus a combined
verdict.

- If $ARGUMENTS names paths, pass them as `paths`. If the user supplies a unified diff, pass it as
  `diff`. With neither, review the current working changes (set `working_dir` and let the agents read the
  tree).
- `synthesize` defaults on (the merged verdict); pass `false` for the raw per-voice reviews.

A `review` is always read-only. For a deeper review that cross-reviews and debates to consensus, use the
full flow in the `code-review-panel` skill (a `debate` over the `code-review` panel).
