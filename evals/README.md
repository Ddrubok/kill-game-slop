# Comparison evaluation

[한국어](README.ko.md)

The [2026-11-09 real-game/routing pilot](runs/2026-11-09-real-routing/report.md) records eight fresh sessions, explicit image attachments, omissions and uncertain proposals, plus actual reference reads for copy/art/whole-game tasks. It separates new cosmetics material from the old promotion control. Selective reading worked in the observed runs; no accuracy or token-saving advantage was established. This is one game and provisional AI grading.

For repeatable static/checker tests, pinned game preflight and frozen comparison input preparation, see [MAINTENANCE.md](MAINTENANCE.md). The [2026-11-06 report](security-quality-2026-11-06/report.md) separates actual browser/checker runs from unrun agent comparisons. Preparing packets does not run a reviewer.

The [v2 review response](review-v2-2026-11-06/report.md) repairs archive validation, presentation measurements and expected-defect signatures, with new browser/game reruns. It does not add a new agent-effectiveness comparison.

The [gameplay coherence set](gameplay-coherence-2026-11-05/README.md) adds action combinations, intended motion, interruption and contextual meaning. A [2026-11-06 three-condition comparison](runs/2026-11-06-comparison-utf8/report.md) reviews its C cases plus U/V and safety cases: all conditions met the 26 authored case criteria in one run each. The full skill used more tokens; no accuracy advantage was demonstrated. Earlier NOT RUN records remain historical.

The [2026-11-06 version's repair comparison](runs/2026-11-06-repair-comparison/report.md) measures four conditions × three fresh sessions on one real promotion component. All functional repairs passed after one disclosed visual adjudication; one trial of that day's skill wrote a temporary file outside its assigned directory before cleaning it up. That version's full-skill total-token median fell 51.6% versus its predecessor, while uncached-input median rose 21.2%. These are historical descriptive results, not measurements of the latest skill or proof of lower monetary cost, broad effectiveness or human preference.

The [2026-11-09 art/content revision](art-content-2026-11-09/README.md) adds conditional art/narrative checks and broad-review coverage. It preserves the supplied authored pilot separately from the Windows integration's 10/10 checker tests and fixture replay. Its nine favorable AI judgments are not a real-game or comparative effectiveness result. The installed skill now has eleven files; earlier package counts describe their historical versions.

## Document languages and original records

Reader-facing guides and reports use English `.md` and Korean `.ko.md`. Each language's README and guide links point to that language. The installed `skills/kill-game-slop/` contains shared English agent instructions, including Korean invocation phrases.

Experiment inputs, delivered prompts, model answers, judge keys, logs, CSV/JSON and source snapshots retain the actual evaluation language and content. Translations are not new experiment results. Three previously hashed reports retain their exact original bytes and hashes as `report.original.ko.md`; English and Korean editions with language navigation are additional entries. Their archive counts therefore change from 74 to 76, 43 to 45 and 551 to 553. Counts and NOT RUN statements inside historical reports describe their original stage.

## Protocol

Run three new conversations with the same model, settings, input packet and review scope. Do not reuse conversations or show prior answers. Give each only `inputs/cases.md`, the common request and its condition below. For full-skill only, additionally provide a snapshot of `skills/kill-game-slop/` and its relevant references. Never send `judge/`, results or expected case distribution to reviewers. Disable unrelated skills when the host permits; record host/system context that cannot be controlled.

Common request: “Review every case in this packet for game presentation problems and recommend what, if anything, should change. Report by case ID, explain your reasoning and proposed checks. This is a review only; do not modify games. Use only the supplied evidence. Answer in Korean.”

Conditions:

1. **generic:** common request only.
2. **brief:** common request + “Judge demonstrated player costs, preserve the game's art direction, gameplay and accessible signals. Distinguish observed facts from hypotheses and optional taste proposals. No confirmed problems is valid; state what to preserve and what you would verify.”
3. **full:** common request + “Apply the supplied kill-game-slop SKILL.md and relevant linked references.”

Save exact delivered prompts, raw responses, model/settings as exposed (unknown where unavailable), artifact hashes, timestamps and tool limitations under `runs/<run-id>/`. The packet consists of synthetic text traces and reports, not visual/audio fixtures; comparisons measure interpretation of those records. Use the same packet order. This first set has 12 cases; it is a starting sample, not a standard or target finding count.

After all answers are frozen, use [judge/rubric.md](judge/rubric.md). Keep human scoring separate from provisional AI scoring and retain disagreements. Measure detection, false positives, harmful recommendations, unsupported claims, actionable fixes and elapsed time without compressing them into a slop score. The maintainer who authored fixtures is not an independent human judge.

For a stronger follow-up, add actual images/recordings, repeat across fresh runs and case orders, and obtain human scoring before claiming efficacy. Do not keep modifying the skill against these cases and then present them as unseen evaluation evidence; version any revision and rerun or use a held-out set.

## Real scene

Real application evidence belongs under `real/`, apart from synthetic comparisons. Record game revision, intent, conditions, original and subsequent captures, adopted/rejected changes, and actual task checks. A justified preservation outcome is valid. Human comprehension and preference remain unverified until someone performs the recorded task.
