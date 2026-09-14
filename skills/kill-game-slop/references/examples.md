# Calibration cases

These are illustrative design cases, not measured project results or engine compatibility tests.

## Competitive arena: keep the signal

**Request:** “Clean up this shooter HUD. Keep our neon team identity.”

**Before:** Every frame has a cyan glow, low health triggers continuous camera shake, and a neon outline identifies the opposing team.

**Decision:** Preserve the team outline. Reduce decorative panel glow that competes with it. Bound the health effect and honor motion settings; keep a persistent readable health indicator.

**Check:** Recognize friend/enemy and low health in the same combat scene, including with reduced motion enabled. Do not reduce the enemy outline simply because it is neon.

## Cozy mobile game: keep the voice

**Request:** “Make the harvest screen less generic without losing its warmth.”

**Before:** “INCREDIBLE! YOU'VE UNLOCKED UNLIMITED POSSIBILITIES!” appears for every carrot, and three animated panels interrupt planting.

**After:** “6 carrots harvested” next to the existing carrot illustration. Keep the character's small celebratory animation for the first harvest if it supports the intended tone. Reuse the ordinary receipt for repeat harvests.

**Check:** The real count appears once, the next planting action remains reachable, and localized text fits. Do not replace the illustrated world with a monochrome dashboard.

## Pixel-art roguelike: do less

**Request:** “Remove slop from my deliberately ornate inventory.”

**Evidence:** The ornate borders match the game, items remain readable, and controller focus is clear. Only two item descriptions contain placeholder text.

**Decision:** Fix those descriptions. Leave the borders and pixel font alone. If the evidence does not support a visual change, say so.

**Check:** Descriptions match actual item behavior, and wrapping preserves the comparison layout. No new UI system is needed.

## Multiplayer card game: make state honest

**Before:** Clicking a card immediately displays “Locked!” even though the server has not accepted it and the rules allow changes until the deadline.

**After:** Distinguish selected, sending, accepted, and locked. “Choice received · change it before the timer ends” describes the accepted-but-editable state.

**Check:** Delayed acceptance, rejection, disconnect, and a late response from the previous round do not display a false lock. Do not expose the opponent's private card to make the screen more informative.

## Engine unavailable: do not pretend

**Request:** “Fix this Unreal menu,” with screenshots and a binary asset but no working editor.

**Decision:** Identify the exact widget/layout edits supported by the screenshots. Edit accessible source only if the change can be made reliably. List the editor steps still needed; do not hex-edit the asset or claim a successful playtest.
