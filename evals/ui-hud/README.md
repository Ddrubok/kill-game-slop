# UI/HUD regression evaluation

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
