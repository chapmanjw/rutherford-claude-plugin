---
description: "Run a multi-round debate between agents on a question."
argument-hint: "<question>"
---

Run a Rutherford `debate` on the user's question.

Treat $ARGUMENTS as the prompt. Call `debate` with at least two `targets` (a debate has no single-agent
form), or pass `panel="<name>"` for a saved crew. Default to `rounds=2` (raise to 3 for a harder
question; the cap is `max_debate_rounds`, default 4).

- Round one is each voice's independent take; later rounds show each voice the others' positions and ask
  it to revise.
- Name a `judge` to write the closing synthesis, or leave `synthesize=true` (the default) for a summary.
- Report how positions shifted across rounds, then the synthesis.

Two strong models over three rounds takes minutes, so prefer `mode="async"` and hand back the `job_id`
(poll with `job_status` / `job_result`). A debate is read-only. Lean on the `agent-debate` skill.
