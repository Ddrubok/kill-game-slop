# Editor changes and serialized resources

Use this when a change involves editor-managed assets or cannot be safely applied with the available tools. It is an edit specification, not a tested engine integration.

## Choose the editable source

- Identify the engine/version, the source asset and the project's existing editing workflow. A screenshot label is not an asset identifier.
- For an opaque binary asset or generated export, use supported editor/import tools. If they are unavailable, prepare the specification below and mark the change unapplied. Do not fabricate a runnable script from guessed API names or properties.
- A text-serialized scene is not automatically unsafe or automatically safe. Make a targeted source edit only when its structure and references are understood and the change can be checked. Preserve identifiers, resource links, event connections and unrelated overrides; avoid broad regex rewrites or mass reserialization.
- If editor automation is useful, check the APIs against the installed engine/version first. Limit it to explicit asset targets, inspect current values before applying, and use the project's undo/version-control workflow. Reopen and test the result. Do not describe an unexecuted script as a completed edit.

## Precise edit specification

| Field | Required information |
| --- | --- |
| Target | Verified asset path and object/component/widget identifier; label unknown values as unresolved |
| Evidence | Scene/state or capture and the observed player cost |
| Change | Verified property and old/new value, or an explicit layout intent if property/value is not yet known |
| Scope | Instance, prefab variant, shared asset or theme; identify other affected users before changing a shared resource |
| Preserve | References, callbacks, input behavior, gameplay timing and accessibility channels that must remain |
| Verification | Editor reopen/import check and the relevant runtime scenario, including rollback conditions |
| Status | Proposed, applied but runtime-unverified, or applied and verified; list remaining editor/device checks |

Unknown targets can still yield a useful proposal. They must be resolved before an automated write. Do not report a speculative value as one observed in the project.

## Conditional engine checks

These are inspection prompts; use only the engine and UI stack in the project.

- **Unity:** Determine whether the target is an instance, prefab/variant or shared UI resource. Preserve serialized references and event bindings. Check changes on affected instances in the editor and the actual UI/input stack; do not assume all projects use Canvas or TextMeshPro.
- **Unreal:** Resolve the widget/Blueprint asset and any bound layout properties or animations. Use supported editor tools for binary assets. Verify compilation, focus/navigation and the changed state in the editor; a blanket Python rewrite is not a substitute for validating the available API.
- **Godot:** Follow node paths, resource IDs, theme inheritance and signal connections in text scenes/resources. Reopen the scene and exercise the relevant input actions after an edit. Do not assume changing a child offset overrides its container's runtime layout.
- **Roblox:** Locate the source script or instance that creates the UI and the owning client/server boundary. Check initialization, bounds and remotes; a generated place/export may not be the editable source.
- **Web/custom:** Locate the scene/component or shared style that owns the presentation. Verify dynamic mounting, focus/input routing and cleanup in the runtime.

If the editor is unavailable, apply independently verifiable source changes only. Report the editor specification separately from completed work.
