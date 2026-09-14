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

## Finding format

For each actionable finding, record the scene/state and evidence, the player cost, the proposed or applied correction, what must remain, and the verification status. Prioritize blocked actions and false state messages before cosmetic consistency. If no cost is demonstrated, preserve the element and explain the uncertainty rather than manufacturing a finding.
