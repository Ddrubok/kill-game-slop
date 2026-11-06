# kill-game-slop update guide

[한국어](update-guide-2026-10-14.ko.md)

Based on the 2026-10-14 update · Explained for ages 15–18

**This update helps an agent decide more clearly what is wrong with a game screen and why it needs fixing.** It strengthens the process for repairing evidenced problems while preserving elements that already serve the game's intent.

`kill-game-slop` is an AI skill that reviews whether a game's screens, guidance, sound and effects interfere with play. A skill is a set of instructions and references the AI reads while working. This update changed those instructions and evaluation materials; it did not train a new AI model.

For example, showing “Ready” while a button is still unavailable is misleading. Bright neon that supports the game's atmosphere and team recognition has a reason to stay. The review asks what players can understand and do, rather than guessing whether AI made the game.

The existing skill already asked reviewers to preserve identity and separate observations from guesses. This update makes that concrete through **four decision types, evidence records, success conditions and comparison evaluations**, so later readers can see why a decision was made and what was actually checked.

The following situations illustrate the decision method; they are fictional.

| Decision | Plain meaning | Example | Response |
| --- | --- | --- | --- |
| Confirmed defect | Something is demonstrably wrong | “Received” appears while a request is still being sent | Repair within scope and verify the outcome |
| Hypothesis needing evidence | There may be a problem, but evidence is insufficient | A user reports a reward sound masking a warning, without a recording | Decide how to inspect that situation and sound |
| Optional identity proposal | It works already, but the expression could develop | A small world-appropriate motif on a readable card | Compare potential gains and losses |
| Preserve | It serves the intent and no problem was found under reviewed conditions | A major reward sequence does not hide quantity or the next button | Keep it and record why |

**“No confirmed problem” is a valid outcome.** A review does not require changing a screen. Equally, a pass on one screen does not cover every device and situation.

Before judging, briefly record **game intent**: what the player should do and feel in this scene. Include the visual/audio identity to preserve, device/input and the requested edit scope.

In a fast action game, a strong impact effect may feel satisfying. If it hides an enemy's attack warning, the aim is to make the warning visible while preserving impact. Merely reducing the effect does not prove success.

Find this information first in design documents, existing screens, code and the user's request. Ask only about unknowns that could materially change the judgment. Mark inferred intent as an inference.

The workflow is:

1. **Choose the scene and scope.** For example, review aiming guidance after piece selection rather than the whole game. Report for review-only requests; make needed changes when repairs are requested.
2. **Inspect evidence and classify decisions.** Separate defects, hypotheses, optional proposals and preservation.
3. **Define success before editing.** Prefer a checkable condition such as “attack warning and reward quantity are both identifiable” over “looks cleaner.”
4. **Change what is needed within scope.** Preserve rules, input timing, meaningful effects and accessibility features, which support people with different color perception or input needs.
5. **Recheck under matching conditions.** Match screen size, language and state, then check related selection, cancellation and menu-return paths.
6. **Record what was actually verified.** Distinguish a proposal, an applied edit and a runtime-verified result.

The update also records **where evidence came from**. Seeing a problem in a screenshot and hearing about it from a user support different claims.

A screenshot can show clipped text or overlapping buttons at one moment. Repeated shaking requires video or runtime observation; sound masking requires listening. Source code can show which volume setting controls a sound, but reading it cannot justify “I listened and it was loud.”

User experience is valuable evidence. Still, “the user reported repetition” and “repetition occurred in this run” should be separate. A symptom can be confirmed while its cause remains unknown: a clipped button may be visible before the responsible layout setting is identified.

State copy especially needs this distinction. The following **fictional online card game** sends a choice to a server, the computer managing requests and game state. It does not describe a feature added to ChessAlkkkaegi.

| Actual state | Appropriate example copy |
| --- | --- |
| A card was selected on this device | “Card selected” |
| The choice is being sent; awaiting a response | “Sending choice…” |
| The server acknowledged it and changes remain allowed | “Choice received · change it before the timer ends” |
| The server authoritatively disallows further changes | “Choice locked” |

Calling a pending request received may make a player believe the server has it. Alongside concise wording, verify that **the words describe the actual state**. Do not invent all four stages in every game; represent the states that really exist.

A repair record should say more than “fixed.” If a reward notification hides an attack warning, record the affected screen, potentially lost information, proposed position, preservation conditions and verification method.

The **success condition** could be “both the attack warning and reward quantity can be identified in the same combat situation.” If code changed but that scene has not run, record “applied; runtime verification not performed.” Separating an edit from a verified solution tells the next contributor what remains.

Optional identity proposals are also supported. To give a readable card a handmade feel, compare material-specific outlines with small stamped textures. Outlines might improve material recognition but consume space; textures might support atmosphere but impede small text.

Keep the current version as a comparison and trial a small scope, such as one card. Present this separately from defect repair. “It might look more original” does not authorize automatically changing the whole screen.

An **evaluation set** is a collection of cases prepared for comparison under the same criteria. This update adds 12: four clear defects, four normal cases and four cases with insufficient evidence. It tests interpretation of authored descriptions, source excerpts and traces, not reading actual game captures.

Three fresh conversations received the same material and review scope. Separate conversations reduce influence from other answers; the judgment key was stored separately from reviewer inputs.

| Condition | Defects found out of 4 | Normal cases incorrectly flagged out of 4 |
| --- | ---: | ---: |
| Generic review request | 4 | 0 |
| Request plus brief core principles | 4 | 0 |
| Request plus full kill-game-slop skill | 4 | 0 |

These are **provisional AI scores**. There was no human scoring, and all conditions tied. The evidence therefore cannot establish that the full skill is more accurate. What was added is material and a record format for testing such claims. See the [first comparison report](../evals/runs/2026-10-14/report.md) for conditions and limits.

For actual game application, the user selected **ChessAlkkkaegi selection-state guidance**: local guest two-player play on the web version, default board and billiard controls. Checks used:

- 320×568 and 360×800 with browser touch emulation.
- 1280×800 with mouse input.

Checks covered selection markers/aiming UI, strike-point/aim mode changes, selecting another piece, clearing selection with empty-space input, and stale guidance after leaving and re-entering the menu. UI means the visible elements people use, such as buttons and guidance.

Those checks passed, and no guidance defect was found under the tested conditions, so **game code was preserved**. Initial observation and a later recheck were recorded; the before/after captures do not demonstrate repair effects. See the [application record and captures](../evals/real/chess-selection-2026-10-14/report.md).

Reselection was checked after camera transitions finished. Initial exploration also recorded selection not changing immediately after a transition began, so input experience during transitions remains a separate question. These results do not cover online matches or physical phones.

Internal selection agreeing with the display and people understanding the display quickly are different checks. Asking a person “Which piece is selected?” or “Where would you press to change the strike point?” had not been performed.

To use the skill, enter `$kill-game-slop` with the scene and requested scope. The following prompts can be copied.

For a review report only:

```text
$kill-game-slop
Review this game's reward notifications during combat.
Separate confirmed defects, hypotheses, optional proposals and elements to preserve.
State the evidence for each judgment and the conditions you could not check.
Write a report only for this task.
```

For review and repair, specify edit scope and preservation conditions:

```text
$kill-game-slop
Check whether reward notifications hide enemy attack warnings.
Repair confirmed problems within the notification's position and size.
Preserve reward quantity, important reward sequences and attack timing.
Check the outcome at the same screen size and in the same combat situation.
```

For identity proposals, distinguish them from defect repair:

```text
$kill-game-slop
I want this card screen to feel handmade.
Compare the current version with two small alternatives.
State each option's expected benefits, possible losses, preserved information and checks.
Make proposals only for now.
```

Supply evidence appropriate to the question. Text clipping benefits from a capture with known screen size; repeated effects need video or an executable scene; audio issues need playable material and volume settings. Review what the supplied evidence supports, leaving the rest unverified rather than waiting for every possible artifact.

The installed `SKILL.md` and `references/` are shared English agent instructions. The reader-facing evaluation guide links to the matching language edition.

| File | Contents |
| --- | --- |
| [SKILL.md](../skills/kill-game-slop/SKILL.md) | Agent decision principles and workflow |
| [presentation-checks.md](../skills/kill-game-slop/references/presentation-checks.md) | Evidence types, finding format, success conditions and verification |
| [examples.md](../skills/kill-game-slop/references/examples.md) | Repair, preservation, uncertainty and optional identity examples |
| [Evaluation guide](../evals/README.md) | Inputs, separate scoring criteria and result management |

More explicit developer intent and actual play evidence support more concrete decisions. State what the player should do in the scene and what must remain intact to help avoid unnecessary edits and identify needed repairs.
