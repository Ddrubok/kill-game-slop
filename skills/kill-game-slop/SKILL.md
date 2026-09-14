---
name: kill-game-slop
description: Remove generic, noisy, or misleading presentation from games while preserving their art direction and gameplay. Use when asked to deslop a game, clean up a HUD, audit game presentation, reduce distracting screen shake, improve menus, tutorial copy, visual effects or audio feedback, or make presentation feel less AI-generated. Works as an engine-agnostic review and editing workflow, not an AI detector or a general gameplay optimizer.
license: MIT
---

# Kill Game Slop

Make the game feel authored. Remove presentation that distracts from play, repeats information without purpose, or promises behavior the game does not deliver. Judge the shipped experience, not whether a human or AI produced it.

## Start from this game

Read the requested feature, its real state transitions, and the relevant shared UI, localization, art, or audio resources. Identify the player's immediate action, what informs that action, and how the game acknowledges it. Inspect a running scene or supplied capture when available; source inspection alone cannot establish visual quality.

Establish what to preserve: genre, audience, authored references, player/team colors, signature silhouettes, expressive language, and deliberate extravagance. Neon can belong in a cyberpunk arena; elaborate borders can belong in a fantasy inventory. Neither is a defect by itself.

Distinguish observed behavior from inference. A still image can establish overlap at that captured size, but not animation timing, audio masking, input behavior, or the cause of a state mismatch. If art direction is unclear, use consistent existing scenes as provisional references and preserve ambiguous stylistic choices while fixing demonstrated functional costs.

Follow the user's scope. For an audit, report findings without editing. For a fix, apply the smallest coherent change to the requested flow. Do not turn a HUD cleanup into a new combat system, economy, engine migration, or asset pipeline.

## Find a concrete cost before removing anything

| Area | Evidence worth acting on | Smallest useful correction |
| --- | --- | --- |
| HUD and menus | Competing emphasis obscures the next action; fixed children overflow a scaled panel | Restore hierarchy and layout at the actual input size |
| Copy | Generic hype replaces a rule, result, or recovery instruction | State the action, consequence, and next step in the player's language |
| Feedback | Selected, sent, accepted, and locked look identical | Show the actual state without implying a guarantee the game cannot make |
| Art and world dressing | Detail competes with enemy silhouettes, hazards, navigation, or interaction cues | Reduce the competing detail while preserving the world's visual identity |
| Motion and VFX | Ambient shake, flashing, or effects conceal meaningful changes | Reserve emphasis for relevant events; respect existing motion settings |
| Audio | Repeated cues mask an important sound; settings omit sounds in the same category | Reduce repetition or route existing cues through the appropriate mix controls |
| Rewards and progression | Fake activity, inflated achievement text, or invented scarcity obscures the actual reward | Show the real reward and condition; leave balance changes outside this task |

Treat these as hypotheses, not a blacklist. Keep redundant channels when they improve accessibility: an icon plus text may be essential. Do not remove labels because icons look cleaner, or remove texture because a flat surface looks more fashionable.

Compare routine events with meaningful milestones before reducing effects. Preserve intentional impact, anticipation and celebration; reduce repeated cues only when they mask information or interrupt play. Do not impose universal particle counts, shake amplitudes, hierarchy depths, font bans or a fixed reading pattern across games. For concrete symptoms, counterexamples and capture checks, read [presentation-checks.md](references/presentation-checks.md).

## Change the source of the problem

- Trace shared styles, prefabs, widgets, scenes, localization keys, and callers. Change a shared resource only when the behavior should change for all its users.
- Prefer the engine's existing layout, input, animation, audio, and accessibility systems. Do not add a framework, scanner, dependency, or asset generator just to perform this review.
- Write short, natural copy in the project's supported languages. Preserve terminology, pluralization, dynamic values, and localized text expansion. A literal translation is not always the right tone.
- Preserve readable contrast, non-color state cues, focus order, controller navigation, touch targets, subtitles, and reduced-motion paths. Respect the project's target platforms and accessibility constraints.
- Preserve gameplay rules, timing windows, hidden information, server validation, ownership, persistence, and purchase semantics. A cosmetic edit must not reveal a secret choice or turn a pending purchase into a success message.
- Keep effects scoped to their scene, round, or entity. Re-entry, cancellation, and disconnects must not leave obsolete UI, sounds, subscriptions, or delayed callbacks active.
- Avoid editing generated exports or opaque binary assets as text. Use the available editor/import workflow; if unavailable, provide a precise edit specification and disclose that it was not applied.

For editor-only changes or serialized scene resources, read [editor-specs.md](references/editor-specs.md). Use its target, property, scope and verification template instead of inventing asset paths or shipping untested bulk-edit scripts.

## Verify the result, not a slop score

Compare the same scene and state before and after where possible. Exercise the complete relevant flow: initialization, input, acknowledgement, result, exit, and re-entry. Partial HUD creation or compilation does not prove the rest of the interface works.

Check the intended viewport and input method. Parent scaling alone does not prove children fit. Inspect overlays, long localized text, safe areas, focus, and back/close controls. Use the project's normal checks for changed code; do not replace runtime verification with keyword matching.

Engine-specific checks are conditional, not mandatory dependencies:

- Unity: inspect prefab overrides, serialized references, Canvas layout and the project's actual UI/input stack.
- Unreal: inspect widget/Blueprint references, focus/navigation, anchors and safe zones with available editor tools.
- Godot: inspect Control containers, size flags, theme overrides, signals and the project's input actions.
- Roblox: inspect full client initialization, GUI bounds and remotes; compile Luau at O0 as well as the project's normal optimization when a compiler is available.
- Web/custom engines: inspect DOM or canvas scaling, device pixels, focus/input routing and scene cleanup in the actual runtime.

Report the observed issue, what changed, what identity or behavior was preserved, and what was actually checked. Separate unresolved editor/device limitations from completed work. Never claim human authorship, detector evasion, improved retention, or player preference from a style edit alone.

For calibration cases and examples where restraint is the wrong answer, read [examples.md](references/examples.md).

Independent game-focused work inspired by [yetone/kill-ai-slop](https://github.com/yetone/kill-ai-slop). No upstream scanner or source code is bundled.
