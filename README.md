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

## Core Focus Areas

- **UI / HUD Hierarchy**: Reduce screen clutter, streamline micro-badges, and prioritize essential gameplay information over decorative noise.
- **Copy & Narrative**: Trim repetitive tutorial prompts, generic placeholders, and verbose system dialogs into crisp, tone-appropriate text.
- **Visual Readability**: Clarify background-foreground separation, mitigate particle stacking, and maintain silhouette readability during combat or movement.
- **Motion & Audio**: Investigate demonstrated masking or interruption while preserving meaningful impact and celebration. A still image cannot establish audio or repeated motion problems.
- **Integrity Preservation**: Never compromise intentional artistic vision, gameplay balances, accessibility compliance, or server-authoritative networking constraints.

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

- **Arena Shooter**
  ```text
  $kill-game-slop Review our fast-paced sci-fi arena shooter HUD. Reduce screen clutter, tone down excessive hit markers and screen shake, and ensure target silhouettes remain readable during multi-player firefights without touching weapon balancing.
  ```

- **Cozy Mobile Farm**
  ```text
  $kill-game-slop Audit the UI and tutorial dialogue for our cozy farming sim. Trim repetitive prompt copy, simplify cluttered shop menus, and soften reward fanfare sounds while keeping the warm, pastel aesthetic intact.
  ```

- **Pixel-Art Roguelike**
  ```text
  $kill-game-slop Polish the dungeon presentation for a 2D pixel-art roguelike. Clean up particle overlap on spell casts, improve tile readability against enemy sprites, and maintain 1-bit / retro visual constraints.
  ```

## Examples

For illustrative before-and-after design breakdowns and scenario walkthroughs, refer to [docs/examples.md](docs/examples.md).

For evaluation inputs, the separate judge key and three-condition protocol, see [evals/README.md](evals/README.md). The [first comparison](evals/runs/2026-10-14/report.md) uses 12 synthetic text cases and provisional AI scoring; it does not establish superiority over a short prompt. The [ChessAlkkkaegi application](evals/real/chess-selection-2026-10-14/report.md) records actual local runtime checks and their limits. Human comprehension and preference are not inferred from automation.

For an identity experiment, ask: `Review this card's intended feeling. Separate defects from optional proposals, compare a few small alternatives with the current version, and state what to preserve and how to check the trial.` An audit does not authorize edits, and an optional proposal is not a required fix.

The installed skill includes focused references, loaded when relevant:

- [Presentation checks](skills/kill-game-slop/references/presentation-checks.md): concrete symptoms, legitimate counterexamples and before/after capture checks.
- [Editor specifications](skills/kill-game-slop/references/editor-specs.md): identify exact targets, preserve references and distinguish proposed edits from verified changes.

Automatic discovery uses the skill description; invocation support depends on the host. The package does not rely on nonstandard `triggers` or `file_patterns` fields. See the [Agent Skills specification](https://agentskills.io/specification).

## License

This project is licensed under the [MIT License](LICENSE). Inspired by the cleanup philosophy of [yetone/kill-ai-slop](https://github.com/yetone/kill-ai-slop), but independently developed as a dedicated game design presentation workflow with no bundled upstream code.
