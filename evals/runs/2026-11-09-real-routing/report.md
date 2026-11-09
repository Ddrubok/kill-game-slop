# Real-game review and selective reading — 2026-11-09

[한국어](report.ko.md) · [Protocol](protocol.md) · [Frozen criteria](rubric.json)

**Selective reading worked in these three tasks. The art comparison did not establish an accuracy or token-saving advantage.** Eight fresh gpt-6-sol medium sessions completed: five initial runs and three additional art runs with images explicitly attached. This is one older, frozen ChessAlkkkaegi build, not eight games or a whole-game playtest.

## Material and execution

The [provenance record](provenance.json) identifies commit `974cb39bcc716815aee79117f4f710b367454050`. New material comprises real cosmetic view/CSS/copy functions, three injected loadouts and [380px](packet/cosmetics/cosmetics-380.png)/[960px](packet/cosmetics/cosmetics-960.png) captures. They compare classic/cosmic themes, the same badge/title and an empty-slot exception. The captures use minimal host markup and actual game styles; they do not establish natural-match behavior. Before freezing the packet, the harness was corrected to include the real player-banner class/style: a dark-text artifact in a draft capture was a harness issue, not a game finding. Draft captures were not delivered to reviewers.

The promotion component is a **previously reviewed control**, using preserved November 5 observations. Its known duplicate/obsolete callbacks and missing pending/reduced-motion cues are not novel art defects. No art bible, branch narrative, audible playback, motion clip, account flow or late-game play was supplied. The packet deliberately includes situations requiring preservation and insufficient evidence; it does not conceal a universal intended style in an answer key.

The [initial manifest](manifest.json) freezes identical packets and art requests. Generic receives the request, brief adds a short preservation paragraph, full receives the eleven-file runtime. All use separate Git roots and the same model/reasoning settings. The rubric was [hashed before launch](grading-frozen.json). The host's internal context is not fully controlled; directory restrictions are instructions, not OS isolation.

Initial JSONL traces record commands but no image-opening events. Reviewers claimed image inspection, which those logs alone cannot verify. Therefore the [visual recheck](visual-recheck/manifest.json) starts three new conversations with the **same prompts and rubric**, attaching all four packet PNGs via CLI `-i`. The [wrapper](visual-recheck/codex-entry.mjs), image hashes, raw responses and traces are retained. Do not pool the two groups or treat their differences as a controlled image-input effect. No old response was supplied to a new reviewer.

## Diagnosis, omissions and proposed changes

The [provisional grading record](grading.json) records criteria separately; it is coordinator AI judgment after reading the answers, without a blinded human judge. There is no overall accuracy percentage.

| Explicit-image art condition | Historical control reported | Preserved | Missing or uncertain |
| --- | --- | --- | --- |
| [Generic](visual-recheck/art-generic/final-response.md) | Missing selection cue mentioned as a possible feedback improvement | Theme differences and empty-slot frame behavior | Duplicate/obsolete callbacks and reduced-motion signature omitted |
| [Brief](visual-recheck/art-brief/final-response.md) | Duplicate `Queen` delivery stated as a historical observation | Theme contrast and conditional frames | Obsolete callback, pending cue and reduced-motion signature omitted |
| [Full](visual-recheck/art-full/final-response.md) | Duplicate selection and post-replacement callbacks mentioned as historical | Same badge/frame identity across themes and conditional frames | Pending cue and reduced-motion signature omitted |

All three initial art runs omitted reporting the known promotion defect, despite reading the record. The initial whole-game run did report duplicate/obsolete callbacks and explicitly separated historical evidence from new reproduction. Art-task wording emphasized current presentation while the control was historical; this is a scope confound, not evidence of a general recall ranking. A future targeted diagnostic trial should name the required reviewed scenes before launch.

No condition demanded uniform palettes or showing a frame with an empty badge/title. None falsely reported the obsolete “stage 10” unlock text as the effective Explorer condition. However, that case was not explicitly discussed in their final answers: silence is not proof of a correct diagnosis. The record distinguishes **not flagged** from **demonstrated preservation**.

The initial generic answer asserted a badge-image/name mismatch and suggested replacing the motif, without establishing the required semantic relationship. It also proposed synchronisation-copy changes while acknowledging that saving was unavailable. These are unsupported or underqualified proposals, not independently proven false positives. The explicit-image group did not repeat those proposals. No unrelated required edit was made; review sessions changed no packet/runtime files.

All art conditions noticed the title disappearing at 380px. The observed visibility difference and CSS cause are established. Whether it violates the intended responsive design or a promise in the real settings flow remains unresolved. Some answers called it a confirmed inconsistency; the broad review correctly kept defect status unresolved. We retain it as a **hypothesis requiring the actual settings/match context**, not a new confirmed game defect or a scored rubric success. Accessibility and alternative layout suggestions remain optional. No game code was repaired by this skill-development task.

## Measured tokens and time

Explicit-image comparison, one run per condition; raw values are in [measurements](visual-recheck/measurements.json). Input is cumulative across agent turns/tool context and includes cached input; total = input + output, uncached = input − cached. Wall time includes runner overhead and concurrent scheduling. These are not prices.

| Condition | Input | Cached input | Output | Total | Uncached input | Seconds |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Generic | 129,276 | 82,048 | 2,017 | 131,293 | 47,228 | 49.5 |
| Brief | 158,209 | 126,080 | 2,154 | 160,363 | 32,129 | 55.6 |
| Full | 165,742 | 133,120 | 2,919 | 168,661 | 32,622 | 73.4 |

Full used **5.2% more total tokens**, **1.5% more uncached input** and **32.0% more time** than brief in this run. No saving is demonstrated. Initial art runs used totals of 287,725 / 185,751 / 329,602 and 71.6 / 68.5 / 79.1 seconds respectively; see the [complete initial measurements](measurements.json). Variation and the different image-delivery method prevent combining these as repeated identical trials. The November 6 savings belong only to that historical version and experiment.

## Actual reference selection and edit scope

All full runs read `SKILL.md`. The [routing record](routing.json) cites successful, untruncated `Get-Content` events; filename enumeration is not counted as reading. These observations concern explicit local reads, not hidden host context.

| Task | References read beyond SKILL.md | Total tokens / uncached input / seconds | Result |
| --- | --- | ---: | --- |
| Small copy, initial | presentation | 92,474 / 8,418 / 45.5 | Only the requested English title changed; exact normalized-text comparison passed |
| Art, initial | presentation + art/content | 329,602 / 39,770 / 79.1 | No file edits; no whole-game route |
| Whole game, initial | whole-game + presentation + art/content + gameplay | 395,549 / 44,453 / 102.6 | Bounded coverage report; absent domains left unreviewed |
| Art, explicit images | presentation + art/content | 168,661 / 32,622 / 73.4 | Same selective route |

The small copy task did not read art/content, whole-game, gameplay, runtime, editor, examples or handoff references. The entrypoint stays at **1,397 whitespace-separated words**, unchanged by this update. Two existing conditional references gained sampling guidance; the package remains eleven files. Different task totals do not isolate skill overhead, and there is no generic-copy baseline. A host-enforced read budget or stable savings claim is unsupported.

## What changed and what remains

README now presents current scope/examples first and labels old measurements by version; long history moved to matching English/Korean documents. Large catalogs now use relevant entity/family, role, rarity, state and display-context groups, representatives plus exceptions, selection reasons and excluded ranges. No fixed quota or whole-catalog clearance is introduced. This experiment did **not** test selection on 100 cards or 50 characters.

The outputs expose limitations in diagnosis coverage and classification, but existing instructions already require bounded hypotheses and intended-context evidence. Adding another checklist for this one title example would duplicate those rules. The runtime therefore receives only the requested short sampling guidance. Further work needs new games, explicit scope-matched defect controls, actual narrative branches and human adjudication.

The [validation record](local-validation.json) separates static/checker tests from this behavioral pilot. [Capture](../../real-routing-2026-11-09/capture.mjs), [preparation](../../real-routing-2026-11-09/prepare.py), [runner](../../real-routing-2026-11-09/run.py), [image recheck](../../real-routing-2026-11-09/run-images.py) and [collector](../../real-routing-2026-11-09/collect.py) are maintainer tools, outside the installed skill. Reproduction needs the pinned game source and existing Vite/Playwright dependencies. Choose fresh output/workspace paths before preparing/running; the scripts refuse to overwrite archives. Raw Korean answers and source remain original records; this report is the maintained English edition.
