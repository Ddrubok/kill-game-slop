# Evidence and presentation checks

Use the cases relevant to the requested flow. These are hypotheses and illustrative examples, not measured thresholds or a list to clear in every game.

## From symptom to a justified change

| Candidate symptom | Evidence needed | Small correction | Reason to keep it |
| --- | --- | --- | --- |
| Mixed pixel or icon density | Compare assets at their intended display scale and filtering; inspect import settings before attributing the cause | Match the outlier's scale or sampling to its peers | Mixed resolution may deliberately separate UI from world art |
| Font that looks like an engine default | Show a mismatch with the game's established typography, missing glyphs or unreadable text | Reuse a suitable existing type style while retaining language coverage | A default font can be an intentional, readable choice |
| Bloom around text | Compare the same label over representative bright and dark backgrounds in the runtime | Adjust the source of the glow that obscures the label | Emissive signage may be part of navigation or identity |
| Celebration for every ordinary pickup | Observe repeated pickups and whether the cue blocks input or masks a higher-priority event | Shorten, combine or lower the repeated cue; retain an accurate receipt | A milestone or rhythm-game action may warrant strong feedback |
| Progress without a matching state change | Trace what the indicator claims and which actual operation drives it | Show the confirmed state or label an estimate/indeterminate wait honestly | Background work can legitimately progress without player input |
| Particles cover a telegraph | Observe a dense encounter and check whether the attack cue remains recognizable | Reduce the conflicting layer or repetition | Raw particle count alone says nothing about visibility or cost |
| Recurring screen shake | Observe its trigger, duration, stacking and reduced-motion path | Bound or adjust the distracting camera effect | Do not change gameplay hit-stop or timing windows as a cosmetic fix |
| Repeated sounds hide an alert | Listen to the relevant events together under the game's mix settings | Reuse category controls or reduce repeated cues | Audio can be the primary accessible information channel |
| Deep UI hierarchy | Identify actual clipping, incorrect focus, scaling problems or measured layout cost | Fix the responsible container or input route | Nesting depth is not a defect by itself |
| “Tap to continue” or enthusiastic copy | Check input method, context and whether the instruction is accurate | Correct a wrong input label or replace hype that hides the reward | A clear touch prompt or authored character voice needs no rewrite |

Search relevant text resources with existing repository tools to locate candidates. Search matches do not establish player-visible defects. A dedicated scanner is justified only by repeated work on a known format with examples of true and false positives; do not create one merely to assign a slop score.

## Capture, inspect, verify

1. **Record the conditions.** Identify scene/state, viewport or device, UI scale, language, input method and accessibility mode when known. Mark missing facts instead of inferring them from a cropped image. Keep the before capture if available.
2. **Describe observable interference.** Name the element and what it overlaps, competes with or misrepresents. Connect that evidence to a player action. Separate visible symptoms from source-code hypotheses; visual prominence alone is not a defect.
3. **Revisit the same conditions.** Compare before/after in the same state, then check the relevant stress case: long text, a dense encounter, safe-area limits, controller focus or repeated notifications. State which conditions were actually exercised.

A still capture supports static layout observations only. Use a sequence or runtime for transitions and repeated motion, listening for audio claims, and source/state evidence for networking claims. Do not claim frame rate, latency, texel density or a contrast ratio from appearance alone. Measure when the task and tools support it; use the project's platform targets rather than invented universal numbers. Never claim an accessibility audit passed from a screenshot alone.

## UI usability checks

Select checks relevant to the scene and input. Familiar appearance, minimalism and compliance with a named psychology law are not verdicts. Connect each concern to a task, evidence, preservation needs and a discriminating check.

- Placement and hierarchy: inspect whether required information competes with decoration, obscures play, or requires avoidable search. A screenshot can establish captured occlusion, not a player's search time. Preserve deliberate off-center or dense layouts when they support the task. Check finding the next action at the target size.
- Shape and hit regions: compare interactive and decorative elements, actual hit geometry, target spacing and focus/press states. Separate a demonstrated overlap or blocked target from an untested prediction of mistaps. Preserve distinctive shapes and useful icon-plus-text labels. Check activation, cancellation and neighboring targets with the relevant input.
- Navigation and grouping: inspect consistent meanings, focus movement, back/close paths and the cost of hiding related information. Fewer visible options are not automatically better. Check the complete requested task and return path; preserve necessary expert information and accessibility cues.
- Contrast and identity: inspect relevant backgrounds and actual display scale. Compare outliers with documented or provisional authored references. Do not mandate a backplate, shadow, font replacement, material or genre palette. If a visual alternative lacks a demonstrated cost, label it optional and compare its gains and losses.
- Device and evidence limits: record viewport, UI scale, input, language and accessibility settings. Mobile emulation can check layout and event routing, not prove thumb reach or comfort. Without runtime or user evidence, keep claims about repeated errors, reaction time and comprehension unverified.

Repair the smallest supported problem while preserving accurate state, control availability, non-color signals and identity. For requested UI construction or broader layout/style alternatives, explain the relevant bettermakegame scope without requiring its installation or an automatic second pass. Do not drop independently supported local repairs merely because that skill is unavailable.

## Finding format

Use one record per decision, scaled to the evidence. Do not create separate reports for each field or invent findings to fill a template.

| Field | Record |
| --- | --- |
| ID / scene / judgment | Stable ID, state, and confirmed defect / hypothesis / optional proposal / preserve |
| Evidence / provenance | Screenshot path + frame; video + time interval; runtime + steps; source + symbol/revision; or attributed user report. List multiple sources separately |
| Observed scope / unknowns | Viewport, language, input, accessibility mode, relevant state and exactly what was observed; missing conditions and uncertain causes |
| Player impact | Action or information affected. Separate an observed loss from its inferred consequence; for proposals, state expected benefit |
| Correction / disposition | Proposed or applied smallest change, or preserved/deferred/rejected with reason |
| Preserve / tradeoff | Identity, accessible channels, state truth, timing and meaningful effects that must remain; expected losses if a proposal is adopted |
| Success condition | Observable task outcome under specified conditions, plus the preservation check; name the next check if evidence is missing |
| Verification | Not run / blocked / passed / failed / mixed, actual method and conditions, artifact links, and remaining limits. Applied is not verified |

Evidence limits:

- **Screenshot:** establishes the captured layout; it cannot establish repeated interruption, animation timing, sound, input behavior or server acceptance.
- **Video:** establishes the recorded interval, with audible evidence only when the track was actually available and inspected. Do not infer all sessions from one interval.
- **Runtime:** state the steps/environment you actually exercised; synthetic events, test instrumentation and mocks must be disclosed.
- **Source:** can establish a code path or a violated contract with sufficient context. It does not establish a rendered defect, timing in production or that the path ran for the user.
- **User report:** preserve the attribution and reported scope. Do not relabel it as your own reproduction. Lack of reproduction does not disprove the report.

Example record (illustrative): `F01 / combat / confirmed static overlap`: supplied `fight.png` at 1280×720 shows a reward banner over the wind-up marker. Repetition is separately user-reported; animation and other resolutions are unverified. Player may lose the cue needed to dodge. Propose moving the banner outside that region; preserve reward count and milestone emphasis. Success: both cue and count visible during the same encounter and repeated pickups. Verification: not run; runtime required for the repeated sequence.

Prioritize blocked actions and false state messages before optional cosmetics. If no cost is demonstrated, say **no confirmed problems in the reviewed conditions**, preserve the element and list only material uncertainties. An optional proposal does not become a failed QA check merely because it was not adopted.

## Real application record

Keep the intent, before capture and conditions, decisions (including preserved elements), adopted/rejected changes, comparable after capture, and success-check results together. For an unchanged scene, explicitly record a preservation outcome and why no patch was justified; do not manufacture a modification to complete a case study. Clearly label historical captures, synthetic fixtures and current live captures. When collecting human feedback, record task, order, sample and observations separately from automated assertions.
