# kill-game-slop

[한국어](README.ko.md)

**Remove the slop. Keep the game.**

An agent skill for cluttered HUDs, generic tutorial copy, misleading feedback, and effects that drown out play. It asks what gets in the player's way, then fixes that without erasing the game's style.

Use it with Unity, Unreal, Godot, Roblox, web games, or a custom engine. These are review workflows, not tested engine integrations. There is no scanner or AI detector to install.

| Before | After |
| --- | --- |
| “Locked!” before the server accepts a choice | “Choice received · change it before the timer ends” |
| Every panel glows as brightly as an enemy marker | Quieter panels; the enemy marker stays bright |
| Ornate pixel-art borders that already work | Leave them alone |

Examples are illustrative. See [the reasoning and checks](docs/examples.md).

## Core Focus Areas

- **UI / HUD Hierarchy**: Reduce screen clutter, streamline micro-badges, and prioritize essential gameplay information over decorative noise.
- **Copy & Narrative**: Trim repetitive tutorial prompts, generic placeholders, and verbose system dialogs into crisp, tone-appropriate text.
- **Visual Readability**: Clarify background-foreground separation, mitigate particle stacking, and maintain silhouette readability during combat or movement.
- **Motion & Audio Restraint**: Tune down disorienting camera shakes, aggressive post-processing blooms, and repetitive high-frequency audio cues.
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

## License

This project is licensed under the [MIT License](LICENSE). Inspired by the cleanup philosophy of [yetone/kill-ai-slop](https://github.com/yetone/kill-ai-slop), but independently developed as a dedicated game design presentation workflow with no bundled upstream code.
