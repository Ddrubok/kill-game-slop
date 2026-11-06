# Generic, brief and full-skill comparison — 2026-11-06

[한국어](report.ko.md)

**All three conditions tied on these 26 synthetic cases. The full skill showed no accuracy advantage and used more cumulative input tokens and elapsed time.** It described some preservation conditions and verification paths more explicitly, but that does not establish actual repair success or improved human comprehension.

## Results

| Condition | Criteria met | Harmful repair proposals | Unsupported claims | Cumulative input tokens | Output tokens | Elapsed time |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Generic | 26/26 | 0 | 0 | 25,135 | 3,031 | 61.28 s |
| Brief | 26/26 | 0 | 0 | 25,511 | 2,994 | 59.98 s |
| Full skill | 26/26 | 0 | 0 | 61,752 | 3,883 | 79.30 s |

All conditions met the criteria for 12 coherence C cases, eight UI/HUD U/V cases and six safety S cases. No out-of-scope proposals, unnecessary reauthorization questions, reads outside the review packet, installations, transmissions or file edits were observed. No actual repair workspace was supplied, so **actual repair success was not measured**. `26/26` counts cases meeting authored criteria; it does not mean 100% accuracy at detecting game defects generally.

Full used **2.42×** brief's cumulative input, **2.30×** its input-plus-output total and **1.32×** its single-run elapsed time. The approximately 1.3-second difference between generic and brief does not establish a stable speed ranking.

Tokens come from Codex CLI `turn.completed`. Input includes cached input: generic 0, brief 18,688 and full 41,472 tokens. Uncached input was 25,135 / 6,823 / 20,280. These differences, run order, concurrent execution and server state prevent converting token totals into fees or pure inference speed. Elapsed time includes process startup, tool work and network waits. The table includes only the three valid condition runs, excluding preflight, the encoding pilot and scoring costs.

## Differences in the answers

- All three identified the expression, ownership, position and outcome-copy problems in C01–C04. All preserved moving fire, the floating character, released projectiles and repeated crafting in C05–C08.
- All avoided claiming causes from still images, silent records or insufficient server evidence. In U/V, they did not treat intentional overlap or injected states as demonstrated play defects. In S, they continued the review without following embedded transmission/installation instructions.
- Full specified the paper-cut/low-frame transition direction somewhat more concretely in C12, existing-button navigation in U08 and re-entry in S06. Generic also mentioned focus restoration in U08; brief mentioned repeated input and closing in S06. No essential judgment succeeded only under full.
- Generic and brief each read two input files; full read two inputs and five skill/reference files. Shell calls were 1 / 2 / 8, with zero failures. Extra reference reading is an observed cost, but this design cannot isolate each reference's necessity or contribution.

For a review whose rules and observations were already explicit, generic or brief instructions produced sufficient results. A reason to choose full might be consistent records, preservation conditions and handoff procedures across contributors; this comparison demonstrated no accuracy advantage. That practical benefit needs separate comparison on real source repairs or complex handoffs.

## Execution and scoring

The user requested the previously deferred comparison, authorizing independent sessions for this evaluation. The repository's permanent solo-work setting was unchanged. The shared Astra-team runner launched three fresh temporary sessions concurrently, requesting `gpt-6-sol` with `medium` reasoning. Environment: Codex CLI 0.167.0, Node 22.18.0, Windows. No further internal model-build identifier was exposed.

Each condition had separate work folders, inputs, raw answers and tool traces. Generic also received a common request requiring evidence, review scope and reporting by case; brief added preservation and judgment distinctions. Only full received the skill snapshot. Automatic skill catalogs were excluded through per-run configuration and checked with a separate [probe response](catalog-probe/response.md). The supplied full skill was byte-identical to its source and unchanged during evaluation.

The initial [pilot](../2026-11-06-comparison/pilot-status.json) triggered attempts to recover Korean cases because of PowerShell's default encoding. All three conditions were rerun in fresh sessions, without selecting favorable results. Valid runs received identical UTF-8 reading instructions and BOM-prefixed case files. Pilot answers and usage remain archived and are excluded from the main comparison.

After answers were frozen, a separate Sol judge saw anonymized conditions A/B/C and scored 78 case judgments against [predefined criteria](criteria.json). The coordinating author also read and scored every answer separately. Both AI scorers marked all cases as passing, with zero disagreements. Labels were hidden, but answer length/format could reveal conditions. **No independent human scoring was performed.**

## Raw records and reproduction material

- Raw answers: [generic](generic/final-response.md), [brief](brief/final-response.md), [full](full/final-response.md).
- [78-row case scores](case-scores.csv), [independent AI scores](blind-judge/scores.json), [author scores](author-scores.json), [aggregate metrics](results.json).
- [Input/skill hashes and run record](manifest.json), [protocol](protocol.md), [runner identity](runner-identity.json), [archive hashes](artifact-sha256.json).
- Each condition's `delivered-prompt.txt` reconstructs the exact user prompt from the saved task and the shared runner's fixed prefix. `worker-stdout.jsonl` contains actual raw tool events and usage. The full private server/host instructions were neither stored nor claimed to be controlled.
- Published `dispatch-task.json` is a byte-identical copy of the original dispatch file. The manifest's `publishedFileAliases` maps local `.orca/tasks/task.json` to it. Original input hashes remain intact; temporary execution directories are not published.

Each condition ran **once**. Cases were written alongside the instructions and explicitly provide intent, rules and observations; the common request also requires evidence distinctions. A tie therefore proves neither that the skill is useless nor that all real projects would produce the same outcome. Unseen source/video tasks, actual repair safety/success, native engines and human comprehension/preference are outside scope. The separate handoff set is not among these 26 cases.

The Korean original is preserved byte-for-byte as [report.original.ko.md](report.original.ko.md). Its original archive hash now follows that path; the English and Korean editions with language navigation are additional archive entries. Later measurements are indexed in the [evaluation overview](../../README.md).
