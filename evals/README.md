# Comparison evaluation

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
