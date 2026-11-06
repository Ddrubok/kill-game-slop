# UI/HUD regression evaluation

Follow-up: the [2026-11-06 generic/brief/full comparison](../runs/2026-11-06-comparison-utf8/report.md) includes these U and V cases as synthetic-record reviews. All conditions met the criteria. This is a current-version comparison across prompt conditions; the historical before/after-version and runtime/human columns below remain NOT RUN.

Prepared on 2026-10-28 from the user's UI/HUD patch guide v1.0. This is maintainer material, not an ordinary skill reference. The companion bettermakegame repository contains U01, U04, U05, and U07; neither skill requires the other to run. Existing evaluation inputs and results remain unchanged.

## Comparison protocol

Use [cases.md](cases.md) and the selected skill snapshot only. Run before and after in fresh conversations with the same model, settings, inputs, tools, and scope. Do not send this protocol, [judge-key.md](judge-key.md), patch explanations, or earlier responses to reviewers. Disable unrelated skills where possible and record unavoidable host instructions. Provide only `skills/kill-game-slop/` and its relevant references, not the whole repository.

The before version is commit `7baafa084f09686d02a01d2669f4557fee1db05d`. Identify the after version by commit or an exact snapshot and file hashes; do not label the unchanged base commit as the patched version. Save delivered prompts, raw responses, tool traces, and artifacts before judging. This set tests interpretation of synthetic records; it does not supply the captures those records describe.

After freezing answers, use the separate key. These cases informed the patch, so do not describe them as unseen tests. For U08 implementation, supply an executable small project with the reported focus defect, snapshot it before each run, and inspect both the diff and keyboard behavior afterward. A text response can assess a proposed repair, not prove implementation success.

For actual interaction and comprehension checks, supply small touch and keyboard/controller fixtures and ask first-time users to locate the next action, distinguish states, and return. Record errors, assistance, sample limits, and measured times only when collected. Vary comparison order when feasible. Do not reuse historical synthetic scores or the ChessAlkkkaegi preservation case as evidence for this patch or the whole game.

## Current status

| Case | Before response | After response | Runtime / human checks |
| --- | --- | --- | --- |
| U02 | NOT RUN | NOT RUN | NOT RUN |
| U03 | NOT RUN | NOT RUN | NOT RUN |
| U06 | NOT RUN | NOT RUN | NOT RUN |
| U08 | NOT RUN | NOT RUN | NOT RUN |

No fresh model comparisons or player trials were run for this patch. The editing session followed the workspace's solo-agent preference; the author has already seen the key, so self-review is not a blinded comparison. Runtime fixtures and human observations are not included. Document and package validation must be reported separately from behavior or effectiveness.

## Run record

| Case | Skill commit / snapshot hashes | Host / model / settings | Exact input / starting project | Conditions / tools | Actual behavior | Result | Evidence | Limits / scorer |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Case ID | Before or after version | Unknown fields stay unknown | Prompt and fixture paths | Device, viewport, input, language, access | Observed actions only | NOT RUN / PASS / FAIL / MIXED / BLOCKED | Raw response and trace paths | Untested scope; human or AI |

## Supplemental evaluation v2

The supplemental guide v2.0 adds V05–V08 here; bettermakegame contains V01–V04. Preserve the U inputs, key, and status above as the first patch's separate record. Guide version 2.0 is not a skill release version.

For this comparison, the **before** commit is `7b79f19dfd103dff9d29b5bf601f9c159522e82b`. Pin the after commit or exact snapshot hashes. Provide [supplemental-cases.md](supplemental-cases.md) and the selected skill runtime files only in fresh independent conversations with the same model, settings, tools, and inputs. Exclude both judge keys, previous responses, and patch explanations. Save raw prompts, responses, tool traces, changes, and captures before using [supplemental-judge-key.md](supplemental-judge-key.md). Reuse the run record above, distinguishing NOT RUN from an attempted check blocked by a documented constraint.

These synthetic inputs test judgment, not the described captures or actual game behavior. V05–V07 need a small executable notification/lifecycle fixture, including normal and injected conditions. Reset starting state between runs and inspect delayed callbacks and re-entry without assuming reachability. Record device, language, settings, and actual observations. Human checks use concrete tasks, record assistance/errors/time only when observed, and disclose sample limits. These cases informed the patch; they are not unseen tests.

| Case | Before response | After response | Runtime / human checks |
| --- | --- | --- | --- |
| V05 | NOT RUN | NOT RUN | NOT RUN |
| V06 | NOT RUN | NOT RUN | NOT RUN |
| V07 | NOT RUN | NOT RUN | NOT RUN |
| V08 | NOT RUN | NOT RUN | NOT RUN |

No independent model comparison, executable fixture run, or human observation was performed for the supplemental patch. This editing session remains solo, and its author has seen the key. Fixtures are not included. Static package checks and maintainer review are separate from these unrun evaluations and cannot establish improved usability or preference. Historical comparison results remain unchanged.
