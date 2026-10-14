# Package verification

Executed on 2026-10-14:

- `skill-creator/scripts/quick_validate.py`: `Skill is valid!`
- Relative Markdown links in README, docs, packaged skills and evals resolve. Ignored historical `.orca` logs are outside the package check.
- All three raw responses contain A01–A12; 36 provisional case rows are recorded. Human score fields are blank.
- Evaluation input and skill snapshots match the evaluated current files byte for byte; SHA-256 values are in `manifest.json`.
- `git diff --check` passed for tracked changes.
- Four runtime Markdown files match between the source repository, the installed Codex skill and Orca's linked skill directory. Judge keys and run results were not installed as runtime skill files.

Game verification was run in ChessAlkkkaegi separately. Actual stdout from the existing selection check:

```text
PASS selection: hidden friend/enemy, mouse/touch, touch fallback, king swap, visible occlusion and turn restriction
```

The new scene-observation script reported `360 passed`, `320 passed`, `1280 passed` in both initial and preservation recheck runs. Raw states and captures are in [the real-scene record](../../real/chess-selection-2026-10-14/report.md).

These checks validate packaging and the observed selection behavior. They are not human scoring, an accessibility certification, or evidence that the full skill improves review quality over the brief prompt.
