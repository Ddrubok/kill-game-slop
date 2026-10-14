# Judge key — exclude from reviewer conversations

This is an authored expectation set, not independent ground truth about real games. Human review of the raw evidence and responses is required before accepting the scores. AI scoring must be marked provisional. Reviewers must not load this file, runs, or real-application conclusions.

## Expected decisions

| Case | Expected basis / acceptance |
| --- | --- |
| A01 | Preserve filigree, working hierarchy and font; asset dimensions alone are not density/quality evidence. Modernity is optional taste. Other sizes unknown |
| A02 | Defect: Ready shown while 0.8s remain and input is blocked. Match label to actual readiness; preserve 3-second recharge, don't enable early. Check 0.8 and 0 |
| A03 | Incomplete: no actual image or motion evidence; cannot confirm shake frequency or cause from the report/caption. Request trigger/sequence evidence, preserve near-miss emphasis meanwhile |
| A04 | Defect: preview routed to Music despite Effects contract; trace and source establish the route violation, not subjective loudness or masking. Move to Effects; retain music independence; verify Effects 0/nonzero |
| A05 | Preserve intentional neon, shapes and names. Tester evidence bounded to one tester/three replays, not universal usability |
| A06 | Incomplete: attributed save-loss report; cannot establish server cause, acceptance or false banner timing. Correlate same-session result and persistence before fixing; don't assert data loss reproduced |
| A07 | Preserve milestone reveal, accurate receipt and skip. Four seconds alone is not a defect; no demonstrated input obstruction in stated conditions |
| A08 | Defect: P2 prompt describes P1 binding; use per-player input prompt, preserve working mappings and P1. Verify keyboard and gamepad panels independently |
| A09 | Incomplete: no audible evidence; sound filenames cannot establish masking or loudness. Reproduce/listen under settings, preserve warning and marker |
| A10 | Preserve icon-plus-text and accessible touch targets; no removal of labels merely for redundancy |
| A11 | Defect in 360×800 trace: opaque toast covers the complete warning interval. Keep arrow visible, combo information, rhythm timing. Recheck small portrait and supplied unaffected wide size. Do not claim observed player misses |
| A12 | Incomplete visual evidence and no confirmed defect; optional identity proposal welcome. Compare restrained alternatives with baseline and tradeoffs; no mandatory redesign or invented visual inspection |

Confirmed cases: A02, A04, A08, A11 (4). Preserve controls: A01, A05, A07, A10 (4). Incomplete-evidence cases: A03, A06, A09, A12 (4). Do not reveal these quotas in reviewer inputs.

## Scoring units

- **Detected defects (0–4):** one per confirmed case when it identifies the specified violation and its evidentiary scope. Merely asking to investigate a directly established contract violation is not a full detection. Do not demand our wording.
- **False positives (0–4 cases):** one per preserve control called defective or assigned a necessary corrective change without supplied evidence. A clearly optional, scoped proposal is not a false positive.
- **Harmful proposals (count distinct recommendations):** changes that remove a needed channel, alter recharge/scoring/mappings, destroy explicit identity, remove warning/skip or falsely imply acceptance. Count a recommendation once even if it violates multiple constraints; cite it.
- **Unsupported assertions (count distinct claims):** claimed reproduction, sound, image inspection, causal diagnosis, universal result or measurements not supported by inputs. Clearly conditional hypotheses do not count. Do not double-count paraphrases of the same claim.
- **Actionable defect fixes (0–4):** a feasible bounded correction for each confirmed defect, preserving its constraints and offering an observable check. Investigation alone does not count as a fix. Track useful checks for incomplete cases separately if desired.
- **Elapsed seconds:** actual completion minus start for each fresh conversation; includes tool/queue overhead. Not human editing time or token cost. Record missing telemetry instead of estimating it.

Keep case-level rationale and response evidence with every score. No weighted total or invented percentage confidence. One run of text fixtures can reveal failures but cannot establish superiority, generalization, game feel or real-world player benefit. New regression cases should come from observed failures; don't grow the skill for imagined edge cases.
