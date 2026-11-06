# Runtime and human checks

Read for the actual renderer, input or playback checks needed by a repair.

Use an isolated scene and a fresh test session for interaction checks. Inspect unfamiliar launch/build scripts and their hooks before execution. If a check would change live payments, public content, rewards or user data beyond existing authorization, use a local substitute or leave that check pending while continuing feasible work.

For browser checks, use a new context with Service Workers blocked, exact scheme/host/port request allowlists and an explicit WebSocket policy. Apply routing before creating pages, including popups. Inspect redirect handling as well as direct requests. Log denied origins without URL credentials, paths, query strings or bodies. Browser routing is a limited traffic policy, not Node/process or host network isolation; untrusted executable projects require host isolation too. Do not promise complete containment from these browser settings.

Capture only the scene and state fields needed for the finding. Use dummy identities; omit or mask account/chat overlays, credentials and unrelated logs before writing artifacts. Recheck saved evidence for the dummy values when validating a collector. Never overwrite baseline captures or previous results; create a distinct run directory and record actual source hashes and tool/browser versions.

Engine-specific checks are conditional, not mandatory dependencies:

- Unity: inspect prefab overrides, serialized references, Canvas layout and the project's actual UI/input stack.
- Unreal: inspect widget/Blueprint references, focus/navigation, anchors and safe zones with available editor tools.
- Godot: inspect Control containers, size flags, theme overrides, signals and the project's input actions.
- Roblox: inspect full client initialization, GUI bounds and remotes; compile Luau at O0 as well as the project's normal optimization when a compiler is available.
- Web/custom engines: inspect DOM or canvas scaling, device pixels, focus/input routing and scene cleanup in the actual runtime.

For action/motion findings, follow [gameplay coherence](gameplay-coherence.md) and inspect the actual controller/animation/physics boundary: Unity Animator layers/masks and movement ownership; Unreal Anim Blueprint/Montage and movement component; Godot AnimationTree/AnimationPlayer and body motion; Roblox animation priority and character movement; or the custom renderer's event/transform owners. These are inspection routes, not required APIs or certified engine adapters. Compare visible motion with relevant state traces; a passing state test does not validate animation quality, and a rendered pose does not prove the authoritative hit result.

For human checks, give a concrete task (identify the selected piece, find the next action, recognize an attack cue), not only “Is this better?”. Where feasible, alternate before/after order or use different first viewers to reduce learning effects. Record observations and their limited sample; automated checks establish behavior, not human comprehension or fun.
