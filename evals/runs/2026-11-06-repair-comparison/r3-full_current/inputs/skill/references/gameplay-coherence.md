# Gameplay coherence

Read for awkward action combinations, motion/logic discrepancies, transitions or repeated/contextual feedback. Apply only relevant checks. A working movement function plus a working attack function does not establish that their combination works. The same principle applies to climbing while interacting, vehicle boarding, dialogue choices, inventory use and reward flows. This is not a requirement to audit every system.

## Establish a small behavior contract

Use the existing request, design, authored references and inspected implementation. Record only what affects the finding, inline when sufficient:

> Which actions may coexist? What changes movement, rotation or control ownership? When do meaningful events occur? What survives cancellation, interruption or exit? What expression must remain?

Label design facts, implementation facts and assumptions separately. Existing code demonstrates implementation, not necessarily intent. If no authoritative intent is available, compare nearby established behavior and state the inference. Ask only when choosing between materially different rules; do not invent an attack lock, cancel window or frame count.

Moving attacks can be correct. A rooted heavy attack, a moving upper-body attack and an authored lunge need different contracts. Gameplay state, animation state and control ownership need not be one-to-one, nor fit one exclusive state enum. Layered animation, procedural motion, sprite changes and separate locomotion/action state can all be valid. Do not prescribe architecture merely to simplify a review.

## Inspect the connections

| Connection | Inspect | Counterexample to preserve |
| --- | --- | --- |
| Combined actions | Movement/rotation policy, pose ownership, input routing and animation channels while actions overlap | Lower-body locomotion plus upper-body attack; intentional strafe or cast movement |
| Entry, interruption and recovery | Entry pose, meaningful action phases, cancel/hit/death, control return and stale callbacks | An intentional commitment window or recoverable stagger; short transitions chosen for responsive controls |
| Space and contact | Visible body/weapon, actual root/collider, contact points, travel direction and relevant terrain/platform motion in the same coordinates | Deliberate hovering/skating, exaggerated reach, abstract collision; planted feet on moving platforms need a surface-relative comparison |
| Time and causality | Input receipt, acceptance, anticipation, hit/miss/block, sound/effect and settled state on the actual clocks | Intentional anticipation, delayed blast, travel time, hit-stop or provisional network feedback with truthful meaning |
| State and affordance | What the player is told they can do versus accepted/rejected input and its explanation | Rules that intentionally restrict an action while communicating why |
| Context and identity | Cue, text, asset and actual event agree; meaningful visual/audio vocabulary persists | Deliberate mixed media, comic exaggeration, stylized pose snapping or a different milestone vocabulary |
| Repetition and closure | Reachable repeated triggers, cue stacking, return to play, skip/cancel handling and accurate final result | Repetition that is the core loop, an important celebration, or accessible redundant channels |

These are candidate checks, not automatic defects. Sparse animation, common assets, a familiar genre or repeated content alone does not demonstrate slop. Content with no apparent purpose may warrant a hypothesis and task-based review; do not infer boredom, retention or a need for new systems. Low frame rate, network interpolation, asset mismatch and blend configuration are possible causes of a symptom, not diagnoses from appearance alone.

## Follow a meaningful sequence

Observe the requested action alone, the relevant combination, and the important interruption/return path. For walking plus attack, select from: begin attacking while moving; begin moving mid-attack; release/reverse input; repeat attack; cancel or receive a hit; resume or replace the owner. Include only reachable and material variants, not a Cartesian product of all states.

Compare the same input, character, camera, speed, equipment and settings before/after. Record timestamps or frames when available. Normal-speed playback establishes how the sequence presents; slow motion or frame stepping helps locate a discontinuity. Frame stepping alone does not establish perceived severity. A screenshot cannot prove foot sliding or timing. Logs can confirm event order, but scheduled sound is not evidence that the sound was heard.

When tools allow, correlate observed motion with velocity, facing, action ID/phase, animation layer/weight, visible-root/collider transforms and hit/cancel events. Collect only signals needed to distinguish causes. State coordinate space, clock and injected versus ordinary input. Account for moving ground, interpolation and camera motion before calling a foot or mesh displaced. Do not create universal pixel, degree or millisecond tolerances; use the project's contract, sampling precision and visible evidence.

## Diagnose and repair at the responsible layer

Separate three questions: **what was observed**, **what intended relationship it breaks**, and **what caused it**. For example, “during the supplied moving attack, the documented planted foot translates relative to stationary ground” can establish an expression mismatch without proving a blend-tree cause. A missing mask, speed mismatch, conflicting transform writer or unsuitable clip remains a hypothesis until traced. An observed presentation defect does not require a measured input failure or human preference study, but its unintended nature needs a basis.

Prefer the smallest repair at the owning layer: animation composition or asset adaptation for a pose mismatch; transform/coordinate ownership for a body/collider split; lifecycle handling for a stale cue. Keep movement permission, hit windows, authority and intentional motion intact. Root Motion, a new clip or an animation layer may be appropriate, but none is mandatory. Do not change combat balance or use camera shake, particles or forced immobility to conceal the mismatch.

Cancellation policy is action-specific. Interrupting an attack may cancel its pending contact, while a projectile already released may legitimately survive the actor. Record which effect or event belongs to which lifetime; do not delete every effect on interruption. A superseded animation callback must not release a replacement action's control lock or emit its hit. On pause, use the game's actual clock policy rather than assuming every timer freezes.

After the final edit, replay the implicated sequence and affected shared users. Functional invariants and rendered expression are separate checks. Keep visual/audio/device checks unverified if the relevant tools are unavailable; do useful source work without inventing a viewed result.

## Report through the existing finding

Use the [finding record](presentation-checks.md#finding-format). Identify the relationship and rule/reference basis in the scene/evidence fields; describe functional impact or an observed expression mismatch in the impact field. Keep judgment (defect, hypothesis, optional proposal, preserve) separate from problem area and priority. An observation can be confirmed while its cause is unknown. A style alternative remains optional; “slop” is not a severity label or percentage.

For identity trials, include the unchanged version and expected losses. For a defect, success must describe what now aligns and what remains unchanged. Do not mark the whole scene coherent from a single successful trace or attribute bugs to AI authorship.

## Engine mechanisms, not required solutions

- [Unity Animation Layers](https://docs.unity3d.com/6000.0/Documentation/Manual/AnimationLayers.html) describes lower-body locomotion with upper-body actions and masks. This supports valid simultaneous actions, not a mandate to split every attack.
- [Unreal Root Motion](https://dev.epicgames.com/documentation/en-us/unreal-engine/root-motion-in-unreal-engine) illustrates visible mesh displacement and character movement ownership. Use the actual project's configuration and version; an unseen project is not diagnosed by that example.

These references explain mechanisms. They do not certify this skill or any native engine integration.
