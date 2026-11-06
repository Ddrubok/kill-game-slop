# Actual repair performance and token comparison — 2026-11-06

[한국어](report.ko.md)

**Functional repairs succeeded in 3/3 trials for every condition. Compared with the previous skill, the current skill's median cumulative total tokens fell 51.6% and median elapsed time fell 33.2%. However, median uncached input rose 21.2%, and including observed file-write scope compliance reduced the current skill to 2/3. These results cannot be generalized into monetary savings or superior quality.**

The real ChessAlkkkaegi promotion UI was repaired independently under four conditions, three times each: 12 trials total. Requested model: `gpt-6-sol`, reasoning `medium`, Codex CLI `0.167.0`. Each repeat ran four concurrent sessions, one per condition, with start order shuffled using a fixed seed. All raw records, errors and failed commands were retained; favorable results were not selected for reruns. [Predefined plan](protocol.md), [input/condition hashes](manifest.json), [execution-time code hashes](execution-inputs.json).

## Results

Metrics are **medians of three trials per condition**. Total tokens are CLI cumulative input, including cache, plus output. Uncached input is input minus cached input for each trial. Each column's median is calculated independently, so subtracting column medians need not reproduce another column.

| Condition | Functional success¹ | Function + observed write-scope compliance² | Total tokens | Uncached input | Time | Shell commands |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Generic | 3/3 | 3/3 | 444,838 | 22,487 | 160.9 s | 15 |
| Brief | 3/3 | 3/3 | 539,215 | 20,097 | 171.6 s | 15 |
| Previous full skill | 3/3 | 3/3 | 1,068,415 | 31,427 | 240.4 s | 23 |
| Current full skill | 3/3 | 2/3 | 517,019 | 38,105 | 160.6 s | 19 |

¹ Frozen automated checks passed 767/768. One CSS measurement missed the previous skill's checkmark in repeat 2; a separate adjudication inspected the capture and generated content. Both raw automatic and adjudicated scores are published. This was neither human nor independently blinded adjudication.

² Current skill repeat 3 created a temporary check file at the wrong `.orca/.orca/…` path, then deleted it and cleaned up empty directories. It counts as a write-scope failure despite recovery. This column concerns file writes observed in the record; the Git metadata exposure below prevents treating it as proof of strict overall access isolation or compliance.

[12-row trial metrics](trials.csv) · [768-row check scores](case-scores.csv) · [Means, medians and changes](results.json) · [Visual adjudication evidence](adjudication.json)

## Interpreting token savings

The current and previous skills differ in one reference-selection paragraph. This task produced the following observations.

- Median cumulative input: **1,059,139 → 510,096, down 51.8%**.
- Median total tokens: **1,068,415 → 517,019, down 51.6%**. Mean total also fell **1,016,822 → 581,738, approximately 42.8%**.
- Median uncached input: **31,427 → 38,105, up 21.2%**. Tokens including cache and monetary charges are different measures. Fees were not measured.
- Median time: **240.4 → 160.6 s, down 33.2%**. Includes concurrency, startup delays, tool work and host load; excludes preparation and scoring.
- Median skill-document read attempts were **3 → 4**, with **4 → 4** files read. There is no evidence that the instruction to group reads reliably reduced call count. General shell-command counts and answer lengths also differed, so the entire token change cannot be attributed causally to that paragraph.

Compared with brief, current full-skill total tokens were **4.1% lower by median but approximately 8.7% higher by mean**. Compared with generic, the current skill's median total was **16.2% higher**. This task does not establish that full repaired better or was consistently more efficient than generic/brief.

## What was actually verified

The game export was based on `974cb39bcc716815aee79117f4f710b367454050`. All 511 client source files were copied identically, and the real promotion module, translations, CSS and motion settings ran in a local browser. The common request specified repeated input, window replacement/closing, reduced motion and preservation conditions. It did not supply the cause or answer patch, but this was a narrow, previously known component task, and even generic received substantial task requirements. [Source inventory](game-input.json).

Before workers started, the checker was frozen and calibrated at **41/64 for the original** and **64/64 for the existing repair**. [Original calibration](calibration/before/score.json), [repair calibration](calibration/after/score.json). The checker code was not changed afterward. Checks covered rapid input at 360/960 px, callbacks from stale/removed windows, selection after replacement, 120 ms timing, keyboard, selection copy in nine languages, 320 px layout/pointer behavior, pending-selection cues and normal/system/local motion settings. They combined actual pointer/keyboard input, explicit lifecycle calls and a paused browser clock.

All 12 final game-source changes were limited to the promotion module and its related CSS: two files. Input prompts, tools and skills were unchanged. Original/final bytes were compared directly, and all 12 published patches were checked for applicability to the original. Neither the original game nor the installed skill was changed to match these outcomes.

## Adjudication and control limits

In normal mode, `r2-full_previous` visibly shows a `::after` checkmark on the selected Bishop. The frozen checker missed it because it measured only background, border, shadow and outline. After source review revealed this limitation, the same separate visual observation was performed for all 12 outcomes. Original automatic scores were retained. [Adjudication plan](adjudication-plan.md), [actual capture](r2-full_previous/visual-review/normal-pending.png), [generated-content observations](r2-full_previous/visual-review/observations.json). No other criterion was overridden.

Workspaces were not separate Git roots, so workers' `git status`/`git diff` exposed parent-repository filenames or returned uninformative empty diffs. Command records showed no calls reading the judge, answer patch or other workers' response contents, but filesystem isolation is not guaranteed. Preservation was verified using final source hashes and independent execution, not workers' Git-check claims. Current skill repeat 3's misplaced temporary write remains in its [command record](r3-full_current/tool-commands.json) and [scope audit](r3-full_current/trace-audit.json). It was not excluded to report only favorable runs.

There were three repeats per condition on one known component in one game. Full matches, discovery in new games, human comprehension/preference, adversarial prompt injection and separate handoffs were not measured. Cache state was not forced equal, and complete host instructions were not observable. No statistical significance or broad performance ranking is claimed.

## Inspecting the record

Each `r1-…` through `r3-…` directory contains exact instructions/input snapshots, raw JSONL, final answer, usage/time, patch/changed source, surviving worker checks/captures and hidden-check results. [Representative current-skill metrics](r1-full_current/metrics.json), [raw answer](r1-full_current/final-response.md), [patch](r1-full_current/repair.patch), [final checks](r1-full_current/judge/score.json).

Intermediate captures deleted or overwritten by workers were not reconstructed. Each `work-artifacts.json` records original names/hashes of surviving `work/` artifacts. Archived check scripts have a `.txt` suffix so they are not automatically executed as maintainer code. Full game copies, linked dependencies, caches and authentication configuration are excluded from the public archive. Published input aliases are recorded in the manifest.

Experiment scripts: [prepare.py](../../repair-comparison/prepare.py), [shared-runner invocation](../../repair-comparison/run.py), [raw collection](../../repair-comparison/collect.py), [grading](../../repair-comparison/grade.py), [aggregation](../../repair-comparison/analyze.py). This is a one-time execution record with dated paths. New experiments require fresh paths and new input hashes first. After execution, one guard was added to the preparation script to refuse overwriting an existing public archive. The [executed original](implementation/prepare-executed.py.txt) is retained.

The Korean original is preserved byte-for-byte as [report.original.ko.md](report.original.ko.md). Its original archive hash now follows that path; the English and Korean editions with language navigation are additional archive entries. Later measurements are indexed in the [evaluation overview](../../README.md).
