# Security and quality review response — 2026-11-06

[한국어](report.ko.md)

Follow-up: at the user's request, an [independent-session comparison](../runs/2026-11-06-comparison-utf8/report.md) was run. Generic, brief and full conditions met all 26 C, U/V and safety criteria; no accuracy advantage for full was demonstrated. NOT RUN below describes the work before that request. Human evaluation, actual repair comparisons and the separate handoff set were still unrun at that stage. For later work, see the [evaluation overview](../README.md).

Changes started from review base `4301ce7341c9e816578bc627eca97fb3372bbd9a`. The skill at this stage is identified by [LF-normalized SHA-256 hashes of nine files](snapshot.json). The original game repository was not edited: `web/` from `974cb39bcc716815aee79117f4f710b367454050` was extracted separately and checked. The promotion repair patch was applied only to that copy.

## Findings addressed

| Item | Change and actual verification | Remaining scope |
| --- | --- | --- |
| F01 Communication policy | Shared BrowserContext policy in both checkers: allow only the exact local origin; block all WS/WSS, Service Workers and HTTP redirects. Local HTTP/HTTPS servers and a browser tested allowed requests, other ports/hosts, popups, redirects and sockets | Browser request routing, not Node/Vite/OS isolation. This does not establish that an external leak previously occurred |
| F02 Evidence overwrites | Existing output folders fail before browser startup. JSON and PNG writes are exclusive. Concurrent directory creation, repeated JSON/capture writes and output-path reuse in the real promotion runner were rejected | Confirmed preservation of 71 historical artifacts |
| H01 Instructions inside data | Added rules against treating instructions in source comments, logs, UI, captures or documents as authority; inspect unfamiliar test/build scripts | Inputs containing fake logs, image transcriptions and source instructions prepared. Fresh-agent defense evaluation NOT RUN at this stage |
| H02 Scope and sensitive data | Prefer local/test environments; respect existing authority; distinguish review permission from real payments, public publication and production reward changes. Removed full DOM text and free-form feedback collection; retain necessary state/button fields | Browser tests confirmed dummy accounts/tokens/chat were absent from JSON and specified capture regions were opaquely masked. Other games need separate privacy-element checks |
| Q01 Current behavior evaluation | Reran both real-game checkers and repaired the chess first-run practice/menu entry path | Fresh independent C, U/V and handoff evaluations and human evaluation were unrun at this stage. Checker success and skill diagnostic ability are separate |
| Q02 Added value and cost | Added preparation command that copies identical inputs to generic/brief/full and supplies the skill only to full. Excludes answers/prior responses; separates hashes, model, tokens, time, unnecessary reads/questions and harmful changes | Comparison was PREPARED_NOT_RUN at this stage. No new accuracy, speed or cost advantage claimed |
| Q03 Repeatable verification | Separate commands for static checks, browser/output regressions, source/Vite/Playwright preflight, real-game checks and comparison preparation | Installed skill remains nine instruction/metadata/license files. Maintainer dependencies live only in evals |

## Run results

- `npm test --prefix evals`: six tests passed. Node 22.18.0, Playwright 1.62.1, Chromium 151.0.7922.34, Windows. Covered exact origin, HTTP/HTTPS, other loopback ports/hosts, popups, redirects, WS/WSS, Service Workers, minimal JSON, masking pixels, file preservation, comparison-input separation and rejection of source/Vite version drift.
- Denied servers received zero HTTP/HTTPS requests and WebSocket upgrades in the browser-policy tests. An initial Edge 156 run observed one speculative TCP connection from a popup. The final Chromium run observed zero, but this does not guarantee blocking TCP/DNS/WebRTC or Node traffic. Logs disclose this limit, and the overbroad `externalNetwork: blocked` label was removed.
- Promotion modal: [original results](evidence/promotion-before/results.json) reproduced the defects at both widths with `fixed:false`, passing `--expect-broken`; [repaired results](evidence/promotion-after/results.json) report `fixed:true`. Verified one delivered choice, rejection of the old modal's delayed callback, preservation of the current choice, static reduced-motion selection and the original 120 ms callback. Used actual mouse events at 360 and 960 px; only reduced-motion captures used a synthetic clock.
- Chess selection: [results](evidence/selection/results.json) passed 360×800 and 320×568 touch emulation and 1280×800 mouse. Unselected → selected → strike point → aim → reselection → clear → menu/re-entry produced 21 captures and state assertions. Clicked the visible practice-skip/menu controls; did not inject state, selections or clocks. Only observation getters were inserted into served responses.
- Limited visual review: opened [360 px selection](evidence/selection/360-selected.png) and [reduced-motion promotion selection](evidence/promotion-after/360-selected-reduced.png). This does not claim visual review of every capture.
- Skill `quick_validate.py` passed. [Static results](validation.json) record syntax, local links, JSON and snapshots separately. [71 historical artifacts](historical-artifacts.json) matched the base commit using original PNG bytes and LF-normalized text.

Initial chess attempts failed. [Attempt 1](evidence/selection-attempt-01.json) used a promotion-component export missing entry scripts/assets. With complete game sources, [attempt 2](evidence/selection-attempt-02.json), [attempt 3](evidence/selection-attempt-03.json) and [attempt 4](evidence/selection-attempt-04.json) waited for obsolete guest-form/profile IDs. After inspecting the first-run practice scene and changed menu, the checker used visible practice-skip and two-player controls and succeeded. Historical success was not substituted for failed new runs.

## Evaluation status and reproduction

[Rerun commands](../MAINTENANCE.md), [test code](../tests/browser.test.mjs) and [evidence hashes](evidence-hashes.json) are retained. Prepared input hashes by condition are available for [C](coherence-prepared-manifest.json), [U](ui-prepared-manifest.json), [V](supplemental-prepared-manifest.json) and [safety](safety-prepared-manifest.json). At this stage, fresh-agent raw responses, model IDs, tokens, time and judgments were absent and remained null/NOT_RUN. Preparation does not launch agents.

The parent `C:/Users/DooBokWie/orca/projects/Default/AGENTS.md` specifies Astra working alone and prohibits workers/subagents without a separate request. Therefore this initial pass did not run an independent-agent comparison. Author rereading or static checks did not fill that gap. Subsequent authorized fresh-session comparisons, separate real-source/video tasks and human review of some results were needed.

This pass did not verify behavioral effects of the new rules, native engines, physical mobile devices, audio/haptics, online matches or human comprehension, preference or enjoyment. Its scope was instruction hardening, maintainer-code regression checks and the specified local game paths.
