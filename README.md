# kill-game-slop

[한국어](README.ko.md)

**Review how a game's actions, art, content and presentation work together.**

An agent skill for demonstrated inconsistencies, bounded design hypotheses and small repairs that preserve the game's identity. Repeated wording, equal numbers, mixed art styles and cosmetic choices are not defects by themselves. A review with no confirmed problems is valid.

| Current scope | Examples |
| --- | --- |
| Actions and transitions | Moving attacks, interruption, contact, feedback and return to control |
| UI / HUD and copy | Obscured information, misleading state, hit regions, focus and recovery instructions |
| Art and entity continuity | The same character across views, equipment attachment, intentional variants and target-size readability |
| Content and narrative | Names/descriptions versus actual effects; speaker knowledge, world state and branch consequences |
| Requested whole-game review | Coverage of choices, progression, repetition, feature purpose and closure, with unreviewed areas stated |

Use it with Unity, Unreal, Godot, Roblox, web games or a custom engine. These are review workflows, not tested engine integrations. No scanner, AI detector or executable dependency is installed. The eleven-file package reads relevant references on demand; a local wording task does not call for a whole-game audit.

## Use

Invoke `$kill-game-slop` with the game, evidence and requested scope. Audits report without editing; an explicit repair request permits scoped changes. Reports distinguish confirmed defects, hypotheses, optional proposals and elements to preserve. Screenshots do not establish motion/audio behavior or human preference.

**Small copy repair**

```text
$kill-game-slop Change only this pending-state message to match the actual
server acknowledgement. Preserve the other languages and game rules.
```

**Art consistency**

```text
$kill-game-slop Review these character portraits, equipped variants and gameplay
views for identity and form consistency at their display size. Preserve deliberate
style differences. State the sampled and excluded groups; report without editing.
```

**Narrative continuity**

```text
$kill-game-slop Compare these dialogue branches with their triggers and world
flags. Separate contradictions from intentional repetition or unreliable speech.
Identify missing evidence; do not invent lore or rewrite the story.
```

**Whole-game review**

```text
$kill-game-slop Review the available build broadly: art, controls, action feedback,
choices, progression, narrative and recovery. Sample representatives and exceptions.
Record reviewed, partial, not-reviewed and inapplicable domains separately from
findings. Do not infer identical play from equal damage or certify unseen content.
```

**Action review**

```text
$kill-game-slop Review movement and attack together: entry, contact, interruption
and return. Preserve permitted moving attacks, hit timing and stylized motion.
Separate observed mismatches from suspected causes; report without editing.
```

[Examples](docs/examples.md) explain before/after decisions. [bettermakegame](https://github.com/Ddrubok/bettermakegame) supports broader UI and identity alternatives; it is optional. Either skill can make authorized local repairs without requiring the other.

## Install

Copy the complete `skills/kill-game-slop` folder into your agent's skill directory. From this downloaded repository:

```bash
mkdir -p ~/.codex/skills
cp -r skills/kill-game-slop ~/.codex/skills/
```

Windows PowerShell:

```powershell
New-Item -ItemType Directory -Force "$HOME/.codex/skills" | Out-Null
Copy-Item -Recurse skills/kill-game-slop "$HOME/.codex/skills/"
```

Compare an existing copy before replacing local customizations. Other hosts can read `SKILL.md` and its linked references; automatic discovery and invocation depend on the host. `game-ui-craft` was the earlier Roblox-focused name.

## Evidence and limits

- [2026-11-09 real-game and routing pilot](evals/runs/2026-11-09-real-routing/report.md): eight fresh sessions on one frozen game, separating new cosmetics samples from the previously reviewed promotion control. Copy/art/whole-game tasks read 1/2/4 references. In the explicit-image comparison, full used 5.2% more total tokens than brief; no accuracy or savings advantage was established.
- [2026-11-09 art/content calibration](evals/art-content-2026-11-09/README.md): authored images/data and one provisional AI assessment. Nine rubric criteria are not nine games. The published Windows record passes all ten checker tests, including three browser tests; checker integrity is separate from diagnosis accuracy.
- [2026-11-06 version: repair comparison](evals/runs/2026-11-06-repair-comparison/report.md): one previously examined game component, four conditions, three runs each. Results belong to the **2026-11-06 version**, before the art/content extension; they are not measurements of the latest skill.
- [2026-11-06 version: synthetic comparison](evals/runs/2026-11-06-comparison-utf8/report.md): generic, brief and full conditions all met 26 criteria in one AI-scored run each. No general accuracy advantage was established.

See [dated development history](docs/history.md) for older results and limitations, [evaluation protocols](evals/README.md) for inputs and grading, and [maintenance commands](evals/MAINTENANCE.md) for reruns. A small sample cannot establish human preference, fun, native-engine compatibility or stable token/time savings.

## Reference routes

Start at [SKILL.md](skills/kill-game-slop/SKILL.md). Read only what the task needs: [presentation](skills/kill-game-slop/references/presentation-checks.md), [gameplay coherence](skills/kill-game-slop/references/gameplay-coherence.md), [art/content](skills/kill-game-slop/references/art-content-coherence.md), [whole-game coverage](skills/kill-game-slop/references/whole-game-review.md), [editor changes](skills/kill-game-slop/references/editor-specs.md), [runtime evidence](skills/kill-game-slop/references/runtime-checks.md) or [optional handoff](skills/kill-game-slop/references/skill-handoff.md).

Reader-facing guides/reports have English `.md` and Korean `.ko.md` editions with matching-language links. Installed agent instructions remain shared English references. Raw experiment records retain their original language under the [document language policy](evals/README.md#document-languages-and-original-records).

## License

[MIT](LICENSE). Inspired by the cleanup philosophy of [yetone/kill-ai-slop](https://github.com/yetone/kill-ai-slop), independently developed with no bundled upstream code.
