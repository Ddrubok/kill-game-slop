# First comparison evaluation — 2026-10-14

[한국어](report.ko.md)

Twelve synthetic text cases were reviewed under generic, brief-principles and full-skill conditions. **All three found the four defects in this sample; no superiority of the full skill was demonstrated.** Scores below are provisional judgments by the AI that authored the cases. Human scoring had not been performed.

## Execution conditions

- Each condition used a fresh evaluation conversation without parent conversation history (`fork_turns=none`). No implementation work was assigned.
- All three inherited the parent model/settings without a model override. The available tools exposed no exact serving-model identifier, temperature, seed, token usage or completion-event timestamp. Reproducibility of a specific model version is therefore not guaranteed.
- Used the same [input snapshot](cases-snapshot.md), order, scope, language and common request. Generic/brief received no skill files; full could read only the [skill snapshot](skill-snapshot/SKILL.md) and its linked references.
- Judgment criteria and previous answers were withheld. File access was restricted by instructions, not OS-level controls. Common host instructions/tools were not controlled.
- Exact prompts: [generic](generic-prompt.txt), [brief principles](brief-prompt.txt), [full skill](full-prompt.txt). Raw answers: [generic](generic-response.md), [brief principles](brief-response.md), [full skill](full-response.md).
- After answers were finalized, a separate archiving request transferred each answer to a file. This was not included in evaluation or timing. Hashes are in [manifest.json](manifest.json).

## Provisional results

| Condition | Defects found / 4 | Normal cases misclassified / 4 | Proposals violating preservation | Unsupported claims | Actionable repairs / 4 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Generic review | 4 | 0 | 0 | 0 | 4 |
| Brief principles | 4 | 0 | 0 | 0 | 4 |
| Full skill | 4 | 0 | 0 | 0 | 4 |

Scoring follows the [separate rubric](../../judge/rubric.md). Optional design proposals do not count as defect reports. [case-scores.csv](case-scores.csv) contains case-level evidence and blank human-judgment fields.

| Case | Evidence found in all three answers |
| --- | --- |
| A01 | Preserved decoration/hierarchy that worked at 1440×900; other sizes unverified |
| A02 | Identified Ready with 0.8 seconds remaining as a defect; preserved charge duration |
| A03 | Recognized missing actual images/video and deferred shake removal |
| A04 | Identified an audio-bus contract violation from source/traces; made no listening-quality claim |
| A05 | Preserved neon, shapes and names; did not generalize from one tester |
| A06 | Separated reported save loss from cause/reproduction; requested session-specific evidence |
| A07 | Preserved the intended final reward sequence and Skip |
| A08 | Identified P2 guidance using P1 mappings as a repair target; preserved input mappings |
| A09 | Did not infer masking from audio filenames; proposed listening |
| A10 | Preserved the icon-plus-text function |
| A11 | Identified full warning occlusion in portrait mode; did not claim a measured score decrease |
| A12 | Treated it as an optional design, not a defect; compared with the original at actual size and preserved readability |

Full explicitly mentioned alternating comparison order and expected benefits/complexity costs in A12, and the unknown gamepad type in A08. These are observed differences in reporting detail, not improved detection scores or actual play.

## Timing and limitations

The **observed upper bounds** from common preparation time to recorded answer receipt were approximately 126 seconds for generic, 172 for brief and 208 for full. Individual start/completion times were not instrumented, and parent work/message-check delays were included. These numbers must not be used as inference time, cost or speed rankings. Exact review time and token cost were unmeasured; game repair time was not applicable.

This small set states key facts explicitly in text, producing a ceiling effect. It excludes original images/video/listening, ambiguous real code and timing, repeated runs and human judgment. Generic also had the common restriction to use only supplied evidence; it was not an unconstrained review.

A stronger follow-up should freeze a held-out set with actual captures/event traces, use repeated runs and obtain blinded human scoring. No repeated failure was found here, so no skill rules were added merely to raise these scores. Efficacy should not be marked verified before human judgment.
