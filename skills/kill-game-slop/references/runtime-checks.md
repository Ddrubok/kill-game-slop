# Runtime and human checks

Read for the actual renderer, input or playback checks needed by a repair.

Engine-specific checks are conditional, not mandatory dependencies:

- Unity: inspect prefab overrides, serialized references, Canvas layout and the project's actual UI/input stack.
- Unreal: inspect widget/Blueprint references, focus/navigation, anchors and safe zones with available editor tools.
- Godot: inspect Control containers, size flags, theme overrides, signals and the project's input actions.
- Roblox: inspect full client initialization, GUI bounds and remotes; compile Luau at O0 as well as the project's normal optimization when a compiler is available.
- Web/custom engines: inspect DOM or canvas scaling, device pixels, focus/input routing and scene cleanup in the actual runtime.

For human checks, give a concrete task (identify the selected piece, find the next action, recognize an attack cue), not only “Is this better?”. Where feasible, alternate before/after order or use different first viewers to reduce learning effects. Record observations and their limited sample; automated checks establish behavior, not human comprehension or fun.
