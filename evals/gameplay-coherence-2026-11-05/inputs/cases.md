# Gameplay coherence review packet

All cases below are **authored synthetic scenarios**, not executed game captures. Treat each supplied contract and record as scenario evidence; do not claim you personally ran or watched a game. No media is attached. Review each case within the supplied scope, report observed-versus-unknown facts, recommend a bounded check or change where appropriate, and explain what should remain. This is review-only: do not edit app files, install tools, inspect judge materials or read other runs.

## C01 — Moving channel action

The design allows a character to move at its existing speed while channeling a spell. Its authored reference calls for grounded stepping on a stationary floor. A supplied two-sample trace during one declared planted-foot interval is:

| Time | Body world X | Planted foot world X | Ground world X | Speed |
| --- | ---: | ---: | ---: | ---: |
| 0.30 s | 100 | 91 | 0 | 60 |
| 0.40 s | 106 | 97 | 0 | 60 |

Both samples use the same coordinate space and the same contact foot; the camera is fixed. The scenario observer reports that the lower body holds one stationary stance throughout this interval. Input, spell outcome and movement work. No animation-layer configuration or source code is supplied. Review the expression and what an appropriate repair must preserve.

## C02 — Interrupt and next action

The contract cancels an uncommitted melee contact when stunned. A different new action can start after stun recovery. The supplied event/UI trace is: action A begins; A is cancelled before its contact window; action B begins; A's delayed completion emits its old contact marker and clears the current action's input lock. The marker is a confirmed-contact cue in this game's vocabulary. No server damage trace or audible recording is supplied. Review the local behavior and the limits of possible conclusions.

## C03 — Boarding motion

A vehicle-boarding sequence is specified to move the character's actual interaction/collision position into the seat before handing over control. Supplied trace values show visible mesh X advancing from 0 to 2 while the collider remains at 0; when the clip ends the mesh returns to 0 and the vehicle-control UI appears. The observer reports the interaction query still selects objects at the old location. This is a single-player scene; no interpolation is configured. The source of movement and rig configuration are unavailable.

## C04 — Defeat receipt

The authored rules grant a medal on victory only. A supplied local result log shows `outcome=defeat`, `medalsAdded=0`, while the UI displays `Victory! Medal received` using the same result event ID. The elaborate gold frame and sound theme are established features used for both victory and defeat, with distinct outcome text intended. No evidence suggests that the frame obscures controls. Review what should change and what should remain.

## C05 — Moving ranged action

The design permits strafing while firing. The supplied implementation description separates lower-body locomotion and upper-body aiming. A scenario observer reports coherent stepping, the intended muzzle direction and hit acknowledgements at the accepted event; reversing movement and releasing the input return to the expected poses. No glitch is supplied. A reviewer argues that walking and shooting should always be mutually exclusive states because two actions at once look generated.

## C06 — Floating courier

An authored style guide says the courier floats and keeps a rigid lower-body silhouette while moving, turning and throwing parcels. The supplied scene description follows that guide. The actual throw outcome and displayed result agree. There are no feet intended to touch the floor. A suggestion asks to add realistic walking to remove the sliding appearance. Review the evidence without assuming all characters should be grounded.

## C07 — Released projectile

The design distinguishes a cancellable cast wind-up from a projectile that becomes an independently owned object once released. The supplied trace is: release confirmed; projectile created; caster is stunned; projectile continues and hits an eligible target. Target and authority records agree, and no obsolete cast marker remains. The reviewer proposes deleting every visual effect and projectile on the caster's interruption.

## C08 — Repeated crafting loop

The game's stated purpose is repeated short crafting sessions. Each crafted object shows a concise, skippable receipt of its actual contents; the next craft remains available. Supplied observations show no overlap, duplicate rewards or blocked input in the reviewed sequence. A reviewer calls the loop slop because several recipes repeat the same interaction. No player preference or boredom data is available.

## C09 — Attack still

Only a single screenshot is described: a character holds a sword and its feet appear stationary. No motion sequence, velocity, input, floor movement or intended movement policy is supplied. The request asks whether attacking while moving is broken and whether Root Motion must be enabled. Review what can be established and the smallest useful next evidence.

## C10 — Silent timing report

A silent clip is described as showing a climb and landing. A player says the landing sound feels late. The clip has no audio track; the agent cannot hear a recording. No scheduled-event or device-latency trace is supplied. The landing pose itself is not reported as discontinuous. Review possible findings and a useful check.

## C11 — Online position correction

A player reports a brief character jump during an online lunge. The design permits client prediction and later server correction, but no correction policy, synchronized clocks, packet trace or engine configuration is supplied. One client capture description shows the jump but not authoritative position. Review the symptom and distinguish what would identify its cause from what is presently unknown.

## C12 — New identity request

The owner asks for a more playful item-inspection transition. The existing transition is described as accurate, readable and fully controllable, with no demonstrated mismatch. The established art uses paper cut-outs and deliberately low-frame animation. Propose a small comparison, preserving the baseline and input availability. No user testing is provided.
