# Maintainer checks

The installed `skills/kill-game-slop/` remains nine text/metadata/license files. Node dependencies, TLS test fixtures and browser automation live only in `evals/`. Run commands from the repository root with Node 22 or later.

```sh
node evals/check.mjs
npm ci --prefix evals --ignore-scripts
npm exec --prefix evals -- playwright install chromium
npm test --prefix evals
node evals/preflight.mjs tools
```

The first command checks local Markdown targets (not external URLs or anchors), JSON, JavaScript syntax, the current runtime snapshot, historical evidence and the frozen comparison/review-v2/repair-comparison archive hashes. Raw worker answers keep session-local links, so their bytes are checked by hashes instead of resolving those paths as maintained documentation. It never rewrites hashes; create a new record for a new run. Hashes detect accidental changes or loss, not an attacker who can rewrite both the evidence and manifest. Browser tests exercise exact origins, HTTP/HTTPS redirects, popup requests, WS/WSS, Service Worker registration, dummy-data exclusion, exclusive artifact writes, source/version drift and presentation measurements. These are checker tests, not skill-effectiveness measurements. The localhost TLS certificate/private key under `tests/fixtures/` is a public test credential with no external use.

The common policy creates fresh contexts, blocks Service Workers and all WebSockets, fetches only the exact HTTP(S) origin with redirects disabled, and rejects every redirect. That intentionally disables Vite HMR. Denied records contain origins only; raw URL paths/queries, headers, bodies and exception messages are omitted. Playwright routing does not isolate Node, Vite, WebRTC, DNS, speculative TCP connections or the host. Use host isolation for untrusted executables. A browser can open a speculative TCP connection even if its HTTP request is subsequently blocked; do not label results `externalNetwork: blocked`.

## Real game reruns

Supply a reviewed isolated game `web/` tree and its existing dependencies. A whole-game check needs the complete tracked `public/` assets and entry scripts; the older promotion-only export is insufficient. Checkers bypass project Vite configuration and package scripts. They still execute the game client and Vite, so inspect the source before running. Never use a production login or a pre-existing browser profile.

Before each source variant, create a new manifest outside the game web directory:

```sh
node evals/preflight.mjs snapshot /isolated/game/web /new/source-manifest.json
node evals/preflight.mjs check /isolated/game/web /new/source-manifest.json
```

Set `GAME_WEB_ROOT` and `GAME_SOURCE_MANIFEST` to those paths. `BROWSER_PATH` optionally selects an existing Chromium executable; otherwise use the installed Playwright Chromium. The result records its actual browser version. Playwright must match the pinned maintainer package; Vite, source bytes, tracked lockfiles and Git/export identity must match the reviewed manifest at startup. A manifest pins the supplied files; it does not authenticate export claims or validate every installed game dependency against its lockfile. Never refresh a manifest merely to hide unexpected drift.

```sh
node evals/real/promotion-2026-11-05/verify.mjs evals/real/promotion-2026-11-05/rechecks/new-before --expect-broken
node evals/real/promotion-2026-11-05/verify.mjs evals/real/promotion-2026-11-05/rechecks/new-after
node evals/real/chess-selection-2026-10-14/verify-in-game.mjs new-selection-run
```

Promotion additionally checks its two historical fixture hashes against `source.json`; use the original source for `--expect-broken` and the supplied repair patch for the after variant. Selection starts its own loopback server; it no longer connects to an assumed port 5236. A missing getter/selector, changed fixture or startup failure is a failed/blocked rerun, not a new game diagnosis. New output directories are mandatory and both JSON/captures use exclusive writes. Keep failed runs for diagnosis. The selection collector retains state/button fields, uses a dummy guest and masks known account/chat regions; adapting it to a different scene requires reviewing its selectors and capture scope.

`--expect-broken` now requires the exact duplicate/stale callback signature at both widths and the separate reduced-motion signature. Missing callbacks or unexpected choices fail. Selection records `hasLayoutBox`, `cssVisible` (including ancestor opacity/visibility), bounding-box `intersectsViewport`, and native `clippedViewportRatio` separately. These fields do not prove readability, occlusion or operability; review captures and the actual pointer/touch results. See the [v2 response and reruns](review-v2-2026-11-06/report.md).

## Agent comparison

```sh
node evals/prepare-comparison.mjs coherence /new/comparison-directory
```

Choose `coherence`, `ui`, `supplemental` or `safety`. The command freezes generic/brief/full inputs, gives the runtime only to full, excludes judge keys and past results, and records hashes plus empty measurement fields. It does not start agents. Follow [the comparison protocol](README.md), the host/project's delegation permissions and any existing authorization. Feed each fresh session only its own directory. Preserve raw responses and tool traces before scoring. Do not guess unavailable model IDs, tokens, elapsed time or repair success; leave them null and explain why.

Measure harmful changes, missed defects, unnecessary questions/reads, actual task success, tokens and time separately. Text-only packets cannot prove an implementation succeeded. Keep authored calibration separate from unseen source/video tasks and human review. Preparing or rereading these packets is not a completed comparison; [the current report](security-quality-2026-11-06/report.md) records exactly what ran.

The later [repair experiment](runs/2026-11-06-repair-comparison/report.md) includes actual edits, frozen browser grading, raw usage and a separate visual adjudication. `repair-comparison/` contains that experiment's scripts, not commands run by `npm test`. The preparation/runner reference dated directories; a new experiment needs fresh private/public paths and newly frozen inputs, not overwriting this record. Worker patches and check scripts are evidence, not automatically approved changes to the game.
