# kill-game-slop

[한국어](README.ko.md)

**Review how game actions, rules and presentation work together.**

An agent skill for awkward action combinations, broken transitions, motion/hit/feedback mismatches, cluttered HUDs and misleading presentation. It records the game's intent, distinguishes demonstrated defects from hypotheses and optional style proposals, and verifies changes without erasing the game's identity. A review with no confirmed problems is a valid outcome.

Use it with Unity, Unreal, Godot, Roblox, web games, or a custom engine. These are review workflows, not tested engine integrations. There is no scanner or AI detector to install.

| Before | After |
| --- | --- |
| “Locked!” before the server accepts a choice | “Sending choice…” while pending; “Choice received” only after acknowledgement; “Locked” only after an authoritative lock |
| Every panel glows as brightly as an enemy marker | Quieter panels; the enemy marker stays bright |
| Ornate pixel-art borders that already work | Leave them alone |

Examples are illustrative. See [the reasoning and checks](docs/examples.md).

## What game slop means here

For this skill, slop means unfinished or contradictory connections between actions, rules, motion, feedback and content relative to the game's intent. This is an operational review definition, not a claim that AI made the game. Individual functions can work while their combination is visibly or functionally inconsistent.

| Criterion | Question |
| --- | --- |
| Combined actions | Do permitted actions work together, such as moving while attacking? |
| Transition and recovery | Do entry, interruption, cancellation and return preserve the intended control and state? |
| Spatial agreement | Do visible movement/contact and actual position/collision agree with the intended abstraction? |
| Timing and causality | Do input, meaningful events, sound and visual feedback follow the intended order and clocks? |
| State and control | Does the displayed action availability agree with what input can actually do? |
| Context and identity | Do text, art and cues communicate the actual event in the game's own vocabulary? |
| Repetition and closure | Do repeated actions preserve a usable flow, accurate outcomes and meaningful emphasis? |

Walking while attacking is not inherently a defect. A grounded moving attack whose planted foot drifts can violate its intended expression; deliberate skating or floating can be correct. Do not force the actor to stop to hide a motion problem. Do not remove an already released projectile merely because its caster was interrupted: its lifetime follows the actual rules.

A pose discontinuity can be an expression defect even when input works. Record the visible mismatch and its rule/reference basis; an observed symptom does not prove its implementation cause or human dislike. When intent or temporal evidence is missing, use a bounded hypothesis. No realism requirement, universal timing tolerance or slop score is introduced.

The detailed [gameplay coherence guide](skills/kill-game-slop/references/gameplay-coherence.md) is loaded only for relevant action/transition work. It supplements existing UI and readability checks; a small text fix does not require a combat audit or a new report template.

```text
$kill-game-slop Review this character's movement and attack combination.
Check entry, contact feedback, interruption and return to movement.
Preserve permitted moving attacks, hit timing and the game's stylized motion.
Separate observed mismatches from suspected causes; report without editing.
```

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

- **Action coherence**: Check how movement, attacks, interaction, interruption and recovery combine. Align visible motion, actual position/contact and meaningful events with the intended rules; preserve valid moving attacks and deliberate abstraction.

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

The requested [2026-11-06 comparison](evals/runs/2026-11-06-comparison-utf8/report.md) ran generic, brief and full-skill review on the same 26 synthetic C/U/V/safety cases. All three met the criteria; the full skill used 2.42× the brief condition's cumulative input tokens. This one-run AI-scored result does not establish real repair effectiveness or a stable performance ranking.

The 2026-11-06 security/quality follow-up adds review-data trust boundaries, scoped evidence collection, shared browser request policies, exclusive evidence writes and repeatable maintainer commands. See the [results and remaining gaps](evals/security-quality-2026-11-06/report.md) and [rerun guide](evals/MAINTENANCE.md). Checker tests do not establish an accuracy advantage for the skill; the installed package still has no executable dependencies.

The 2026-11-05 update adds a [scoped handoff](skills/kill-game-slop/references/skill-handoff.md) to bettermakegame and game-vfx. It preserves the finding's judgment, provenance, review/edit scope and success condition, then reconciles returned evidence into that finding. It does not require another skill or a second audit. The [update record](evals/handoff-2026-11-05.md) separates document checks and synthetic fixture evidence from unrun model/human evaluations.


The [feedback repairs](evals/feedback-repair-2026-11-05.md) make review examples neutral, add Korean discovery phrases and optional Codex display metadata, move conditional runtime details out of the entrypoint, and remove the chess script's private `.orca` dependency. The changed chess launcher has only been syntax-checked, not rerun against the game. Shared fixture evidence now points to the repaired version; old hashes/results remain historical. New handoff behavior and U/V cases remain NOT RUN.

## License

This project is licensed under the [MIT License](LICENSE). Inspired by the cleanup philosophy of [yetone/kill-ai-slop](https://github.com/yetone/kill-ai-slop), but independently developed as a dedicated game design presentation workflow with no bundled upstream code.

## Practical follow-up — 2026-11-05

See the [earlier repair and evidence record](evals/practical-validation-2026-11-05.md). That pass fixed the shared fixture's stale completion callback, preserved historical results, and published a real game-component repair plus a fresh four-session comparison. Both short and full-skill conditions repaired the selection task and preserved the normal celebration; no added accuracy advantage was demonstrated. Those results predate the gameplay-coherence instruction revision. The original game project was not edited. Human/device/network tests and the dedicated U/V/handoff sets remain unrun.

The installable folder now includes the same MIT LICENSE as the repository root.

## Gameplay-coherence instruction revision

The current revision adds the criteria above, a conditional reference, calibration examples and an [evaluation packet of twelve cases](evals/gameplay-coherence-2026-11-05/README.md) with a separate maintainer key. Scope and evidence principles remain: audit requests do not authorize edits; intended rules stay intact; an implementation that violates an established rule is not protected merely because it already exists. Broader rule changes remain design proposals unless authorized.

Static package checks are recorded separately from behavior. The [2026-11-06 synthetic case comparison](evals/runs/2026-11-06-comparison-utf8/report.md) is complete; **before/after instruction-version comparisons and human evaluation remain NOT RUN**. No improved accuracy, player preference, native engine compatibility or speed gain is claimed. Earlier comparisons and actual-game records remain historical. The installed runtime contains no evaluation answers or mandatory engine/scanner dependency.
