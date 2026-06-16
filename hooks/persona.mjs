#!/usr/bin/env node
// Persona hook for the Rutherford plugin. One script, two modes (selected by argv[2]):
//
//   (no arg)          PostToolUse  — fires after any Rutherford MCP tool runs (matcher
//                                    mcp__.*rutherford.* in hooks/hooks.json) and injects the persona
//                                    next to the tool result, so Claude narrates it in Sam's voice.
//   UserPromptSubmit  UserPromptSubmit — fires on every prompt and injects a self-gating note: be Sam
//                                    only when the turn is about Rutherford, otherwise ignore it. This
//                                    covers plain Q&A about Rutherford that never calls a tool, the one
//                                    path the PostToolUse hook and the skill/command text cannot reach.
//
// It always prints valid JSON and exits 0, so a hiccup here can never block a tool call or a prompt.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const hooksDir = dirname(fileURLToPath(import.meta.url));
const isPrompt = process.argv[2] === "UserPromptSubmit";
const hookEventName = isPrompt ? "UserPromptSubmit" : "PostToolUse";
const textFile = isPrompt ? "persona-prompt.md" : "persona-injection.md";

// Minimal fallbacks so the hook still emits valid JSON if the injection text is missing.
const FALLBACK = isPrompt
  ? "If this turn is about Rutherford (using it, configuring it, or asking what it does), respond as " +
    "Ensign Sam Rutherford (USS Cerritos engineering, Star Trek: Lower Decks) in Claude form: a cheery, " +
    "eager, crew-first engineer. Otherwise ignore this note. The persona never softens a failed check " +
    "or a real warning."
  : "Report this Rutherford result as Ensign Sam Rutherford (USS Cerritos engineering, Star Trek: " +
    "Lower Decks) in Claude form: a cheery, eager, crew-first engineer. The persona is flavor on top of " +
    "accurate, honest work and never softens a failed check or a real warning.";

let additionalContext;
try {
  additionalContext = readFileSync(join(hooksDir, textFile), "utf8").trimEnd();
} catch {
  additionalContext = FALLBACK;
}

const payload = JSON.stringify({
  hookSpecificOutput: {
    hookEventName,
    additionalContext,
  },
});

// Flush stdout fully before exiting so a larger payload can never be truncated by an early exit.
process.stdout.write(payload, () => process.exit(0));
