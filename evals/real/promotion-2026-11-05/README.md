# Real promotion-modal repair — 2026-11-05

The source is ChessAlkkkaegi commit `974cb39bcc716815aee79117f4f710b367454050`, `web/src/promotion-modal.ts` and its actual stylesheet. The original game checkout was **not edited**. The patch was applied only to an isolated copy. This is a real game component in a controlled browser harness, not a full match or a shipped release.

The existing code scheduled a 120 ms completion for every click. Opening a replacement removed the previous DOM but left its timer alive. The actual callers in `main.ts` use this modal for promotion; the harness invokes opening/replacement directly. It does not establish how often replacement occurs during natural play or prove duplicate rewards/server changes.

## Findings, decisions and results

| ID / judgment | Before, at 360 and 960 px | Focused change | After / retained behavior |
| --- | --- | --- | --- |
| PROMO-01 confirmed defect | One mouse double-click delivered `[Queen, Queen]` | Latch the first choice; disable choices immediately | `[Queen]`; four promotion options and labels preserved |
| PROMO-02 confirmed component-lifetime defect | Replacing the closing modal still delivered old `[Knight]`; choosing new Rook yielded `[Knight, Rook]` | Cleanup owned timer when the modal is replaced; reject disconnected completion | No stale callback; current choice yields `[Rook]` |
| PROMO-03 confirmed setting mismatch | Reduced-motion preference still used `promotionModalOut` | Reuse the game's existing motion helper; retain static selected outline | `animation:none`, Bishop visibly selected, four disabled buttons; one callback after the original 120 ms |
| Preserve | Existing four choices, descriptions, opening layout, response delay | No rule, reward, board, color scheme or physics change | Initial screenshots byte-identical at both widths; selected outline reuses the hover cyan |

This is a same-author application of three roles: **kill-game-slop** ties each finding to observations and a success condition; **bettermakegame** selects first-commit/owner cleanup instead of arbitrary debounce or redesign; **game-vfx** adapts the short closing cue and static reduced-motion state without adding particles. Returned checks close only these component conditions. It is not an independently observed handoff or proof that combining skills beats one skill.

## Evidence

- [Before results](before/results.json), [after results](after/results.json), [source hashes](source.json), [patch](repair.patch), [checker](verify.mjs).
- [Before opening](before/360-open.png) / [after opening](after/360-open.png); [before reduced closing](before/360-selected-reduced.png) / [after reduced closing](after/360-selected-reduced.png).
- Node 22.18.0, Playwright 1.62.1, Chrome 156.0.8078.80, Windows; viewports 360×800 and 960×800. Behavioral mouse double-click/replacement checks use real browser timing. The reduced closing screenshot alone freezes a synthetic browser clock to capture the 120 ms state; the recorded callback is checked after advancing that clock.
- The baseline Node checker produced its expected broken-condition record. Its Python wrapper subsequently failed while printing Korean/Unicode output under cp949; a `finally` block restored the repaired files. The baseline JSON has no browser errors. The final repaired checker exited 0. Do not present that wrapper failure as an application failure or a clean wrapper run.

## Reproduce

Use a separate compatible checkout at the source commit with the project's existing Vite dependencies. Follow the [maintainer preflight](../../MAINTENANCE.md) to install pinned test tooling and create a source manifest. Set `GAME_WEB_ROOT`, `GAME_SOURCE_MANIFEST` and optionally `BROWSER_PATH`. The checker starts its own loopback server and uses an output-local Vite cache. Its current network/output guards are covered by the [2026-11-06 rerun](../../security-quality-2026-11-06/report.md); the results above remain historical. From this skill repository:

```sh
node evals/real/promotion-2026-11-05/verify.mjs evals/real/promotion-2026-11-05/rechecks/new-before --expect-broken
```

In the isolated **game repository root**, first check and then apply this repository's `repair.patch` using `git apply --check /path/to/repair.patch` and `git apply /path/to/repair.patch`. Run the same checker to a new output folder without `--expect-broken`. No dependency installation or mutation of the original game is required by the checker. The source commit must be available to reproduce; the game source/dependencies are not vendored in this skill package.

Full pawn progression, server authority, natural match timing, touch hardware, complete keyboard/screen-reader modal behavior, human understanding/preference and mobile performance are **NOT RUN**. A component fix is not a claim that the whole game is fixed. The separate fresh-agent comparison uses a simplified dependency-free derivation, not this game's full runtime.
