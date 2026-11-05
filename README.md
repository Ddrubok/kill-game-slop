# kill-game-slop

[한국어](README.ko.md)

**Remove the slop. Keep the game.**

An agent skill for cluttered HUDs, generic tutorial copy, misleading feedback, and effects that drown out play. It records the game's intent, distinguishes demonstrated defects from hypotheses and optional style proposals, and verifies changes without erasing the game's identity. A review with no confirmed problems is a valid outcome.

Use it with Unity, Unreal, Godot, Roblox, web games, or a custom engine. These are review workflows, not tested engine integrations. There is no scanner or AI detector to install.

| Before | After |
| --- | --- |
| “Locked!” before the server accepts a choice | “Sending choice…” while pending; “Choice received” only after acknowledgement; “Locked” only after an authoritative lock |
| Every panel glows as brightly as an enemy marker | Quieter panels; the enemy marker stays bright |
| Ornate pixel-art borders that already work | Leave them alone |

Examples are illustrative. See [the reasoning and checks](docs/examples.md).

## Decisions and evidence

| Decision | Response |
| --- | --- |
| Confirmed defect | Correct within the requested scope; verify an observable success condition |
| Hypothesis | Identify the missing evidence and the check that would distinguish causes |
| Optional identity proposal | Compare expected gains, losses and a bounded trial with the current version |
| Preserve | Keep purposeful elements; record the reviewed conditions |

The brief game-intent record covers the player's action, intended feeling, visual/audio identity, device/input and requested scope. It is inferred from available documents first, with questions only for material unknowns. Reports distinguish screenshots, recordings, runtime checks, source evidence and attributed user reports. Applied changes and verified outcomes are separate.

A technically working UI can still make necessary information hard to find, confuse controls with decoration, or route input somewhere other than the visible target. Separate observations, user reports, and hypotheses; appearance alone does not establish error rates or comprehension. [bettermakegame](https://github.com/Ddrubok/bettermakegame) covers new UI/HUD designs and broader layout or identity alternatives. The skills work independently, with no required order. Either can add, simplify, move, or remove elements within scope; local usability repairs do not require bettermakegame to be installed.

## Core Focus Areas

- **UI / HUD and controls**: Check information visibility, control recognition, actual hit regions, focus/back navigation, and unnecessary search. Preserve purposeful density and unfamiliar shapes when no cost is demonstrated.
- **Copy & Narrative**: Check whether repetition or vague copy obscures an action, rule or recovery step. Keep useful reminders and the game's voice; edit only within scope.
- **Visual Readability**: Check target and hazard visibility during actual combat or movement. Overlap and decoration remain valid when they preserve useful information.
- **Motion & Audio**: Investigate demonstrated masking or interruption while preserving meaningful impact and celebration. A still image cannot establish audio or repeated motion problems.
- **Integrity Preservation**: Never compromise intentional artistic vision, gameplay balances, accessibility compliance, or server-authoritative networking constraints.

For temporary or coinciding displays, record the starting state, trigger, and evidence, then recheck the affected moment and neighboring elements after a change. Distinguish reachable play from scripted input or injected states. A rectangle overlap may be intentional containment, and an AI reader's uncertainty does not establish human confusion. Use geometry warnings to find candidates, then inspect what is actually visible and operable; no new scanner is required.

## Installation

`kill-game-slop` is packaged as a portable Markdown skill definition located at `skills/kill-game-slop/SKILL.md`.

To install manually for Codex or compatible agent environments:

1. Copy the `skills/kill-game-slop` directory into your agent skills path:
   ```bash
   mkdir -p ~/.codex/skills
   cp -r skills/kill-game-slop ~/.codex/skills/
   ```
2. For other environments, preserve the whole folder and ask your agent to read `SKILL.md` and its linked references. Automatic discovery and invocation syntax depend on the host.

Run the copy command from this repository after downloading it. On Windows PowerShell:

```powershell
New-Item -ItemType Directory -Force "$HOME/.codex/skills" | Out-Null
Copy-Item -Recurse skills/kill-game-slop "$HOME/.codex/skills/"
```

If an older copy exists, compare it before replacing local customizations. `game-ui-craft` was the earlier Roblox-focused name; this package replaces that skill.

## Usage & Invocation

Invoke the skill using `$kill-game-slop` alongside context about your game, scene, UI layout, or design document.

### Example Prompts

- **HUD usability review**
  ```text
  $kill-game-slop Review this HUD for obscured information, control recognition,
  hit regions, and unnecessary search. Distinguish confirmed defects from hypotheses.
  Preserve distinctive, purposeful presentation. Report evidence and minimal repairs
  without editing files or redesigning the whole screen.
  ```

- **Arena Shooter**
  ```text
  $kill-game-slop Review our sci-fi arena HUD during firefights. Check whether hit markers or shake obscure targets, citing the observed conditions. Preserve purposeful impact and weapon balance. Report confirmed issues, hypotheses and what to keep; do not edit.
  ```

- **Cozy Mobile Farm**
  ```text
  $kill-game-slop Review our farming sim shop, tutorial and reward feedback. Check whether repetition interferes with the player task; preserve useful guidance, milestones and the pastel style. Do not claim sound masking without playback. Report findings without edits.
  ```

- **Pixel-Art Roguelike**
  ```text
  $kill-game-slop Review spell effects and enemy visibility in this pixel-art roguelike. Distinguish intentional overlap from demonstrated loss of information, keep the 1-bit style, and report evidence without edits. No confirmed problem is an acceptable result.
  ```

## Examples

For illustrative before-and-after design breakdowns and scenario walkthroughs, refer to [docs/examples.md](docs/examples.md).

For evaluation inputs, the separate judge key and three-condition protocol, see [evals/README.md](evals/README.md). The [first comparison](evals/runs/2026-10-14/report.md) uses 12 synthetic text cases and provisional AI scoring; it does not establish superiority over a short prompt. The [ChessAlkkkaegi application](evals/real/chess-selection-2026-10-14/report.md) records actual local runtime checks and their limits. Human comprehension and preference are not inferred from automation.

The [UI/HUD regression cases](evals/ui-hud/README.md) keep reviewer inputs and maintainer criteria separate. The original U cases are preserved; supplemental V cases cover the new checks. Both sets' before/after behavior evaluations are **NOT RUN**. The earlier comparisons and ChessAlkkkaegi record are not validation of either patch or of the whole game.

For an identity experiment, ask: `Review this card's intended feeling. Separate defects from optional proposals, compare a few small alternatives with the current version, and state what to preserve and how to check the trial.` An audit does not authorize edits, and an optional proposal is not a required fix.

The installed skill includes focused references, loaded when relevant:

- [Presentation checks](skills/kill-game-slop/references/presentation-checks.md): concrete symptoms, legitimate counterexamples and before/after capture checks.
- [Editor specifications](skills/kill-game-slop/references/editor-specs.md): identify exact targets, preserve references and distinguish proposed edits from verified changes.

Automatic discovery uses the skill description; invocation support depends on the host. The package does not rely on nonstandard `triggers` or `file_patterns` fields. See the [Agent Skills specification](https://agentskills.io/specification).

## This update

The 2026-11-05 update adds a [scoped handoff](skills/kill-game-slop/references/skill-handoff.md) to bettermakegame and game-vfx. It preserves the finding's judgment, provenance, review/edit scope and success condition, then reconciles returned evidence into that finding. It does not require another skill or a second audit. The [update record](evals/handoff-2026-11-05.md) separates document checks and synthetic fixture evidence from unrun model/human evaluations.


The [feedback repairs](evals/feedback-repair-2026-11-05.md) make review examples neutral, add Korean discovery phrases and optional Codex display metadata, move conditional runtime details out of the entrypoint, and remove the chess script's private `.orca` dependency. The changed chess launcher has only been syntax-checked, not rerun against the game. Shared fixture evidence now points to the repaired version; old hashes/results remain historical. New handoff behavior and U/V cases remain NOT RUN.

## License

This project is licensed under the [MIT License](LICENSE). Inspired by the cleanup philosophy of [yetone/kill-ai-slop](https://github.com/yetone/kill-ai-slop), but independently developed as a dedicated game design presentation workflow with no bundled upstream code.
