# Feedback repairs

[한국어](feedback-repair-2026-11-05.ko.md)

2026-11-05. Neutral EN/KO review examples replace prompts that assumed excessive effects. Korean discovery phrases and optional Codex metadata were added; activation rates are unmeasured. Conditional engine/human verification moved out of SKILL.md while retaining scope, judgment, provenance and preservation rules. UI/control findings can now be received by bettermakegame through its general finding contract, without requiring a VFX brief. Findings can also go directly to game-vfx.

The old nine-test fixture failed to cover higher-revision resurrection after completion and meaningful world-write detection. Its published snapshot at `e8a68bd` is retained with that limitation. We reran the corrected online-impact fixture at bettermakegame `fd3c15df5cbbd9226003233e573af67cf8da0c85`: **13 tests passed**. The new source/test hashes and this runtime's hashes are in the [snapshot](feedback-repair-2026-11-05-snapshot.json). This is fixture evidence, not a successful handoff or skill comparison.

The historical chess checker's `.orca` import was replaced with normal Node resolution or optional `PLAYWRIGHT_ROOT` (parent of `node_modules`). `BROWSER_PATH` optionally selects a Chromium executable; Edge remains the default. New runs use a fresh `rechecks/` directory and refuse to overwrite existing results. Run `node verify-in-game.mjs unique-run-name` only with the original compatible ChessAlkkkaegi project and local server at `http://127.0.0.1:5236/`. It retains its historical source interception and fixture assumptions; arbitrary game revisions are not supported. **Only JavaScript syntax was checked; the changed launcher was NOT RUN against the game.** Prior captures/results are untouched.

Static metadata, links and whitespace checks are recorded in [results](feedback-repair-2026-11-05-results.json). Handoff criteria, U/V comparisons, actual repair benefit, human playtests and cross-host activation remain **NOT RUN**. Historical ties and preservation-only Chess outcomes are unchanged. A shorter entrypoint is not evidence of faster or better decisions.
