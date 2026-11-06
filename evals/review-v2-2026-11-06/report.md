# Review v2 response — 2026-11-06

[한국어](report.ko.md)

Base commit: `41d1d8ae1ceaed515851143ffb66f312e550f6a4`. R1–R3 from the supplied follow-up review were repaired using the existing checkers and native Node/browser features, without new dependencies. The earlier comparison responses, score sheets, 74 file hashes and existing evidence were unchanged at this stage.

| Item | Change and verification | Status |
| --- | --- | --- |
| R1 Archive checks | Connected the 74 comparison hashes and 43 hashes for this record to the default checker. In separate copies, verified rejection of all eight cases that changed or deleted a response, result, JSONL log or CSV score sheet | Fixed and verified |
| R2 Presentation measurements | Recorded layout presence, CSS visibility, viewport intersection and intersection ratio after ancestor clipping separately. Browser cases covered normal, transparent, offscreen, transparent/hidden/no-layout ancestors, partial/full clipping and occlusion by another element | Fixed and verified |
| R3 Expected defects | Checked values and counts for duplicate Queen, stale Knight and current Rook callbacks separately at 360 and 960 px. Reduced motion has its own criterion. Rejected missing callbacks, different choices, failure at only one width, missing widths and altered reduced-motion behavior | Fixed and verified |
| R4 Actual repair effectiveness | Reran existing game checkers, but did not run new agent source-discovery/repair comparisons without the answer, adversarial tool-use tests, human evaluation or handoff evaluation | Still unmeasured at this stage |
| R5 Reading cost | Clarified reference selection for simple copy/layout versus action transitions, grouping independent reads and reusing instructions already read. Applied the same text to the installation | Instructions updated; cost not remeasured at this stage |

## Verification record

- Node `22.18.0`, Playwright `1.62.1`, Chromium `151.0.7922.34`, Windows. Used an isolated copy of the previously pinned game revision `974cb39…` and the existing repair patch.
- `npm test --prefix evals`: **9/9 passed**. [Run log](tests.tap).
- Promotion: both the [original](evidence/promotion-before/results.json) and [repaired version](evidence/promotion-after/results.json) passed **17/17 criteria**. For the original, passing means reproducing the known defects; for the repair, it means correct behavior. This is a modal-level run; promotion through a complete match remains unverified.
- Selection: [320, 360 and 1280 px all passed](evidence/selection/results.json), with touch/mouse selection, strike-point mode, return to aiming, reselection, clearing and menu re-entry; 21 captures. The [320 px selection](evidence/selection/320-selected.png), [360 px strike-point mode](evidence/selection/360-strike.png) and [promotion selection cue](evidence/promotion-after/360-selected-reduced.png) were opened for visual inspection.
- Presentation: [nine browser cases](evidence/presentation/results.json), each also checking two pixels in an actual capture. Confirmed that CSS/intersection measurements can pass while another element hides the target. These pixel checks apply only to the solid-color test fixture.
- At publication, `node evals/check.mjs` checked nine installed files, 34 existing evidence files, 71 historical artifacts, 74 comparison records and 43 records from this review. [Current skill snapshot](snapshot.json), [archive hashes](artifact-sha256.json).

Hashes detect accidental changes, corruption and loss; they do not authenticate an actor who can change both files and hashes. Hash generation and checking are separate. No new parser was added to establish semantic consistency between responses and JSONL traces.

The existing generic/brief/full **26/26 tie** is unchanged. This review does not claim improved actual repair success or token efficiency. Measuring R4 and R5 requires a separate real-source repair task and repeated comparisons.

This is a translation of the historical review. The Korean original is preserved byte-for-byte as [report.original.ko.md](report.original.ko.md); the archive now also includes English and Korean editions with language navigation. Later measurements are indexed in the [evaluation overview](../README.md).
