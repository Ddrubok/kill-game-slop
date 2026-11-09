# Art/content and broad-review revision — 2026-11-09

[한국어](README.ko.md)

Baseline: `4420609f33ec1bcc567e6f5c8561c60e7977a976`. This revision adds two conditional references and broad-review coverage, while keeping local repairs local. It does not add a scanner, automatic redesign or a slop score. The installed package has eleven text/metadata/license files; its current hashes live in [runtime-snapshot.json](runtime-snapshot.json). Historical snapshots and results are unchanged.

## Evaluation materials

The [input request](inputs/brief.md), authored [contact sheet source](inputs/contact-sheet.svg), [rendered PNG](inputs/contact-sheet.png), dialogue source and defense data provide a small visual/source/data calibration task. It is not a released game, a playable build, a hidden real-world benchmark or evidence of broad efficacy. The PNG is a rasterization of the authored SVG, not a runtime game capture. Re-render with an available SVG renderer at 960×400; record its version if comparing bytes.

The supplied pilot record states that the [maintainer rubric](judge/rubric.md) was frozen before a fresh review session. [Pilot input hashes](pilot-inputs.json) identify the supplied skill and artifacts. Its stated protocol supplied only the input and skill folders, without prior discussion, answers or rubric. Filesystem isolation was instruction-scoped, not a security boundary. Full execution traces were not supplied, so this integration cannot independently establish those historical session conditions.

## Status

The supplied patch's [validation record](validation.json) reports skill-format/static checks passing and seven of ten checker tests passing, with three browser tests blocked before assertions by missing-browser/host-socket restrictions. Its authoring assistant scored nine calibration criteria as met in one reported fresh-session review. The [raw Korean response](pilot-response.ko.md) and [criterion record](pilot-result.json) remain unchanged. Their tool-use claims are reviewer-reported; the full historical trace is unavailable.

The Windows integration reran the checks: **10/10 tests passed, including all three browser tests**, using Node 22.18.0, Playwright 1.62.1 and Chromium 151.0.7922.34. See [local validation](local-validation.json) and the [test log](local-tests.tap), whose temporary capture path is redacted. This includes changed/deleted pilot-image/answer/result rejection and drift checks for both new skill references.

The coordinator opened the supplied PNG and compared its SVG: portrait/album show amber diamonds, while the board shows a blue triangle. A separate [fixture replay](fixture-replay.json) reproduced four attack outputs and three dialogue outputs with the [replay script](replay-fixtures.mjs). This verifies the supplied function results now; it does not authenticate the earlier reviewer's execution or constitute a new independent skill evaluation. The intentionally faulty dialogue remains a calibration input.

Real-game transfer, motion/audio/haptics, human comprehension/preference, generic-versus-full comparisons and repeated-run effectiveness remain **NOT RUN**. Earlier 26-case and promotion results are historical and do not validate this revision. The entrypoint changes from 1,312 to 1,397 whitespace-delimited words; this is not a measured token or execution-time change.

The [archive manifest](artifact-sha256.json) protects 16 supplied/local evidence files through `node evals/check.mjs`; these two README editions remain maintained documentation. Existing archives retain their hashes. Rerun fixture output with `node evals/art-content-2026-11-09/replay-fixtures.mjs`; keep new results outside this frozen record.

## Next evaluation

Use genuinely new game artifacts with unknown defect locations, deliberate style counterexamples, and full/brief/generic conditions under the same host/model/tools. Freeze criteria and inputs before collecting answers; keep independent human assessment separate from AI calibration. Measure supported findings, missed issues, harmful changes and evidence overclaims separately. Do not infer advantage from this authored pilot.
