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

**After:** Distinguish selected, sending, accepted, and locked. While waiting, use “Sending choice…”; only after server acknowledgement use “Choice received · change it before the timer ends”, and only if the rules still permit changes. Use a locked message only after the authoritative lock. Preserve retry/rejection states; never replace a premature lock with premature acceptance.

**Check:** Delayed acceptance, rejection, disconnect, and a late response from the previous round do not display a false lock. Do not expose the opponent's private card to make the screen more informative.

## Engine unavailable: do not pretend

**Request:** “Fix this Unreal menu,” with screenshots and a binary asset but no working editor.

**Decision:** Identify the exact widget/layout edits supported by the screenshots. Edit accessible source only if the change can be made reliably. List the editor steps still needed; do not hex-edit the asset or claim a successful playtest.

**Check:** The edit specification identifies known targets and unresolved properties, the intended scope and runtime checks. A screenshot cannot establish whether a Blueprint compiles or whether controller focus reaches the button.

## Normal signals: reject the false positive

**Request:** “Find slop in this mobile game's loading screen.”

**Evidence:** A progress bar advances during an actual background download. “Tap to continue” appears after completion on a touch device. A nested UI hierarchy supports safe-area layout without demonstrated clipping or input problems.

**Decision:** Keep these elements. Neither an idle player, a familiar phrase nor node depth establishes a defect. Investigate only if the displayed progress misrepresents the actual operation or the instruction is wrong for the active input device.

**Check:** Verify the operation driving progress and the completion/input state. Do not replace an accurate indicator with a fake percentage or remove a useful instruction to avoid a keyword.

## Combat celebration: preserve the peak

**Request:** “Reduce distracting combat effects while keeping our boss-finisher impact.”

**Evidence:** The player reports that routine pickup notifications repeatedly cover attack telegraphs and identifies the finisher celebration as deliberate. Only a still image showing one overlap is available; repetition is reported, not independently verified.

**Decision:** Report the visible overlap and trace the notification layout. Preserve the finisher and gameplay hit-stop. Request or use available runtime evidence before asserting repeated shake duration or audio masking; proceed with independently supported layout work when fixes are requested.

**Check:** Compare the same encounter and inspect the pickup sequence and reduced-motion path when runtime access becomes available. Mark those dynamic checks unverified until exercised.

## Ornate menu: no confirmed problems

**Intent/evidence:** A supplied capture shows a theatrical fantasy collection screen. The request identifies the gilded frame as a signature; labels and focus in the supplied navigation recording remain visible.

**Judgment:** Preserve the frame and icon-plus-text labels. No confirmed problems in those conditions. No need to replace the palette, font or layout to make the review look productive. Other languages remain untested, not failed.

## Missing sound: bound the conclusion

**Evidence:** A silent recording shows three reward animations; a player reports that a warning is difficult to hear.

**Judgment:** Hypothesis: reward audio may mask the warning. No independent audio verification and no established mixing cause. Inspect the audible sequence and category settings before a sound change. Visible animations alone neither confirm nor refute the player's report.

**Success check:** In the reported sequence, the warning remains identifiable with the relevant settings while the reward cue retains its role. Until that sequence is heard, report the check as not run.

## Crafting cards: optional identity proposal

**Request/intent:** “Explore a more handmade feel.” Existing cards are readable and accurate; there is no confirmed defect.

**Proposal:** Compare the current card with (A) a material-specific silhouette, improving recognition but consuming space, or (B) a restrained stamped texture, supporting the crafting theme but potentially reducing small-text contrast. Preserve rarity labels, values and controller focus. Neither option is a required repair.

**Trial:** Use one card at its target size, compare recognition and the intended handmade feeling, including a plain baseline. Record the actual feedback and any readability loss. Do not claim improved retention or player preference without that evidence.
