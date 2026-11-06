# ChessAlkkkaegi selection-state guidance — real application

[한국어](report.ko.md)

On 2026-10-14, the revised kill-game-slop was applied to the scene specified by the user. **No selection-guidance defect was found under the checked conditions, so the existing UI was preserved.** No visual change was adopted merely to produce a change. “Before/after” below means initial observation and rechecking after the preservation decision, not before/after a repair; no improvement effect is claimed.

## Game intent and scope

- Target: web local guest → two-player match → default chessboard → billiard controls. Select a piece on the current turn, choose aiming/strike point and prepare to shoot.
- Intent evidence: actual menus, input code and selection cues. Clarity for precise aiming was the provisional criterion. The game's overall emotional goal was not separately confirmed with the user and is not presented as an official design specification.
- Preserve: pieces/board, yellow selection ring/direction arrow, aim/strike-point buttons, power/pitch/elevation, turn display, camera transitions and turn rules.
- Execution base: game Git HEAD `5829cd9f8096383a6a3aee834c408a113b82ca45`, using a local tree with existing work. App code and existing modifications were unchanged. Only QA captures/check scripts were added.
- Conditions: browser touch emulation at 360×800 and 320×568; mouse at 1280×800; Korean; DPR 1. See result JSON for Edge version and timestamps. This is not physical-mobile verification.
- Local Vite execution with remote traffic blocked. Playwright inserted observation getters **only into responses delivered to the browser**. It did not force game state, timers or selection outcomes; actual pointer/touch paths were used and screens captured.

## Judgment record

| ID / decision | Evidence and checked scope | Action / preservation | Success condition and result |
| --- | --- | --- | --- |
| S01 Preserve | Runtime: aiming values/action bar hidden when unselected; selecting the c2 pawn shows selected ID, red dot, aiming values and action bar together. Captures show ring/direction arrow | Retain ring, arrow, values and buttons. Add no copy implying an authoritative lock or server receipt | Selection ID and display agree; passed all three conditions in both observations |
| S02 Preserve | Runtime: strike-point button has aria-pressed=true and shows its panel; returning to aim restores state and panel together | Retain button text, color emphasis and pressed state | Both buttons/panel match the actual mode; all passed |
| S03 Preserve | Runtime: after camera transition completes, clicking/tapping f2 changes selected ID to f2. Empty-space input clears ID, markers, preview and action bar | Retain existing selection/clearing behavior | No old-piece UI remains; all passed |
| S04 Preserve | Runtime: returning to the menu and starting another two-player match begins unselected, with aiming values/action bar hidden | Retain scene lifecycle and initial state | No stale selection guidance on re-entry; all passed |
| S05 Hypothesis / unverified | Ring is visible in small-screen captures, but human speed at identifying the selected piece was not measured | No new name label adopted; insufficiency of existing cues was not established | Ask actual users to identify the selected piece and next button |

An initial [exploration](exploration.json) recorded an f2 tap immediately after switching strike point → aim that did not replace the c2 selection. That exploration did not wait for the transition to finish. The pointer handler in source `input.ts` ignores input while `cameraTransition !== null`. Because transition state was not instrumented during that attempt, the cause is not confirmed. The main verification waited for completion and passed reselection under that condition. Whether transition-time input should be accepted, and whether users are confused, remains a separate evaluation.

## Before/after evidence

| Condition | Initial observation | Recheck after preservation decision |
| --- | --- | --- |
| 360×800 selection | [Capture](before/360-selected.png) | [Capture](after-preserve/360-selected.png) |
| 320×568 selection | [Capture](before/320-selected.png) | [Capture](after-preserve/320-selected.png) |
| 1280×800 selection | [Capture](before/1280-selected.png) | [Capture](after-preserve/1280-selected.png) |
| 360×800 strike point | [Capture](before/360-strike.png) | [Capture](after-preserve/360-strike.png) |
| 360×800 cleared | [Capture](before/360-cleared.png) | [Capture](after-preserve/360-cleared.png) |

Each directory contains seven states × three sizes: unselected, selected, strike point, return to aim, another piece selected, cleared and re-entered, totaling 21 captures. Input sequence, viewport, language and game code were the same, but real timers/physics were not paused. These compare matching states/conditions, not pixel-identical frames. Not every capture was reviewed by a human. AI visually inspected selection at three sizes, the 360 px strike-point screen and representative rechecks; other states have runtime assertions and capture records.

Raw results: [initial observation](before/results.json), [recheck](after-preserve/results.json). All three conditions passed in each run with zero pageerrors. Button viewport boundaries and visibility were checked; this alone does not establish complete readability/accessibility compliance.

The game's existing `node src/tools/selection-check.mjs` also passed. It checks hidden-piece occlusion, mouse/touch, touch proximity selection, king-swap targets, visible-piece occlusion and selection restrictions during moving turns. Audio, online server state, post-shot physics, classic mode and other languages were outside this application.

## Reproduction and human checks

Paths and ports below are historical records from 2026-10-14. The current checker uses its own local server, source hashes and shared communication policy; follow the [current rerun guide](../../MAINTENANCE.md). The [2026-11-06 record](../../security-quality-2026-11-06/report.md) separates new execution from historical results.

The [checker](verify-in-game.mjs) is a copy of the script run as `qa/selection-presentation-2026-10-14/verify.mjs` in the game repository. At that time it used existing `.orca/ui-check/node_modules/playwright` and installed Edge; those were not standalone skill dependencies.

1. In game `web/`, run `node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5236 --strictPort`.
2. From the game root, run `node qa/selection-presentation-2026-10-14/verify.mjs before`. Use a different output name for rechecks to avoid overwriting evidence.
3. Show a person only the selection screen and ask “Which piece is selected?” and “Where would you press to change the strike point?” On the cleared screen, ask “Is anything still selected?” Record answers, elapsed time and presentation order.

Human comprehension checks were **not performed**. This is one preservation case with automated behavior checks and limited visual review, not evidence of repair effectiveness, whole-game quality, enjoyment or retention gains.
