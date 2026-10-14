# Presentation review packet

These are authored, synthetic text fixtures, not observations of a shipped game. Treat each case as a separate game. Excerpts and logs below are the complete supplied evidence; no images, playable builds or audio files are supplied. Review only the described scene and its presentation. Do not change files or invent additional measurements. Case order is fixed across comparison conditions.

## A01 — Observatory inventory

Design excerpt: astronomical instruments, brass filigree, calm study; keyboard/mouse at 1440×900. Review the inventory's readability.
QA session note: all 18 item names and quantities visible at that size; the focus rectangle remained visible through every item. No other size tested. The shared ornament texture is 2048×2048. Hierarchy: canvas / safe area / frame / scroll / row / label.
Designer comment: “Could a simpler inventory look more modern?”

## A02 — Beacon recharge

Design excerpt: players may activate a beacon once its 3-second recharge finishes. Review the recharge status message only; keep recharge duration.
Source excerpt: `label = Math.floor(remaining) === 0 ? 'Ready' : Math.ceil(remaining) + 's'; button.disabled = remaining > 0;`
Instrumented runtime trace, keyboard, 1280×720: remaining=0.8, label='Ready', button.disabled=true; pressing Enter does not activate. At remaining=0, disabled=false and Enter activates. No networking in this scene.

## A03 — Rail escape camera

One supplied capture description from a player: “At the finish line the corners look blurred.” No image file accompanies this packet. Player asks: “Is the shake triggering too often? Remove it if so.” Design excerpt: a tense, high-speed escape; retain the impact of near misses. No recording, trigger log, camera settings or source available.

## A04 — Workshop preview sound

Design excerpt: Settings > Effects volume controls button, item preview and collision cues; Music is independent. Scope: item-preview feedback.
Instrumented runtime at Effects=0, Music=0.6: preview event invokes `musicBus.play('hammer-preview')` with gain=0.6; collision invokes effectsBus gain=0. Source call site agrees with this trace. Asset inventory tags hammer-preview as Effects. No audio recording supplied.

## A05 — Faction flags

Design excerpt: exuberant neon faction identity; controller, 1920×1080. Teams use cyan triangle and magenta square markers plus team names. QA navigation note: names and markers remain visible in all three supplied encounter replays reviewed by that tester; team recognition task 6/6 correct for that tester. The artist requests a presentation audit. No measurements of other players' preference or motion comfort supplied.

## A06 — Cloud save banner

Player report: “Yesterday the banner said 'Saved', but I lost a checkpoint after restarting.” Source excerpt: `showSaved()` is called from `onSaveResult(result)`; the body of onSaveResult and result schema are absent. Screenshot transcription says “Saved”, but lacks timestamp/session identification. No request log, server data or reproduction. Scope: assess the banner, not redesign storage.

## A07 — Expedition completion

Design excerpt: returning from the final expedition deserves a theatrical 4-second ribbon reveal; ordinary loot uses small receipts. Runtime log: sequence starts after input to combat is disabled and enemies are removed; reward quantities are displayed; Skip responds in 180ms and leaves the same reward receipt. QA capture note: no controls or quantities obscured at 1280×720. Scope: presentation audit, preserve the intended climax. No player preference study.

## A08 — Split-screen prompts

Design excerpt: two local players choose equipment independently. P1 uses keyboard; P2 uses a gamepad. Review the input prompts only, keep mappings.
Runtime trace: panel=P2, focusedAction=equip, visibleHint='Press E', gamepadSouth=equips, keyE=equipsP1Only. P1 panel hint='Press E' and keyE works. Source: both panels read the global P1 prompt provider. Tested only in a desktop 1600×900 session.

## A09 — Storm warning audio

Player report: “During heavy rain I can't hear the approaching avalanche.” Supplied asset filenames: rain_loop.ogg, avalanche_warning.ogg. No waveforms, playable audio, mix configuration or recorded session. Design excerpt: urgent avalanche warning, atmospheric rain, warning also represented by a directional marker. Scope: audio presentation review. Do not remove the marker.

## A10 — Crafting action labels

Design excerpt: touch-first crafting; labels support new players and color-vision differences. Buttons show an anvil icon plus “Craft”, a chest icon plus “Store”, each 112×48 at the target 390×844 viewport. QA record: translated labels at German locale fit in the buttons with no overlap; all three actions hit the correct target. A design comment calls the icon and label “redundant”. No failure report.

## A11 — Hazard lane display

Design excerpt: a portrait rhythm game shows a hazard arrow in the right lane before every sweep. Do not change musical timing or scoring.
Recorded UI layout trace at 360×800, t=12.00–12.60: arrow rect=(270,280,60,60), opaque combo toast rect=(240,270,110,100), toast is above arrow. Arrow is only visible in that interval and input window follows at t=12.60. At 1280×800, the toast moves to x=1050 and does not overlap the arrow. No player performance measurements supplied.

## A12 — Sigil card border

Designer request: “Could these cards feel more ceremonial? Suggest a small trial.” Supplied descriptions: gold rectangular border, readable mana cost in top left, clean icon; no screenshots or recordings. Existing player report says the cards are easy to read. Art brief: solemn ritual, restrained detail, retain cost and rarity recognition. No other evidence, and no request to implement a redesign.
