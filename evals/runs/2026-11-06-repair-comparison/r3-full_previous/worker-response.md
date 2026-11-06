I’ll read the local instructions and `prompt.txt` as UTF-8, then make the repair within `web/src/` and verify it with checks or captures under `work/`.

The request is focused on the promotion choice modal. I’ll preserve its existing choices, translations, 120 ms handoff, and normal motion while checking repeated input, modal replacement or closure, and reduced motion. I’m applying the supplied skill’s presentation and runtime checks to that flow.

The source shows two concrete risks: each click schedules its own callback, and replacing the overlay removes its DOM node without canceling its pending callback. I also captured the baseline modal at 360×800; I’ll check the pending state and interruption paths in the local scene before editing.

The modal now locks the first selection, shows it with a checkmark and pressed state during the 120 ms wait, and rejects callbacks from a replaced or removed overlay. Reduced motion disables this modal’s animation while leaving the 120 ms handoff intact. I’ll run the same scene sequence against the patch.

The interaction checks pass, but the paused screenshot exposed two presentation issues: the CSS checkmark renders as broken characters in this local scene, and native `disabled` moves focus off the selected button. I’ll use an ASCII CSS escape for the checkmark and `aria-disabled` so the selected, pressed button keeps focus during the handoff.

The final interaction run confirms one callback for rapid input, no callback from replaced or removed overlays, and a visible selected state with pressed and unavailable accessibility states. I also checked keyboard focus wraps within the dialog. I’m doing one last motion check for both system and in-game reduced motion, then I’ll hand the findings back.

승급 선택창의 연속 입력으로 콜백이 중복 실행되고, 교체되거나 닫힌 창의 선택이 뒤늦게 전달되던 문제를 수정했습니다. 선택 후 120ms 동안 선택한 기물을 체크 표시와 접근성 상태로 보여주며, 모션 줄이기 설정에서는 등장·퇴장 애니메이션을 끕니다. 일반 모드의 연출과 기존 문구는 유지했습니다.

[브라우저 검사](/C:/Users/DooBokWie/orca/projects/Default/skill-releases/github-sync-20261102/kill-game-slop/.orca/repair-comparison-20261106/r3-full_previous/work/promotion-check.mjs)에서 연속 입력·창 교체·닫힘을 확인했고, TypeScript 검사와 9개 언어 검사도 통과했습니다. 실제 전체 경기 흐름은 확인하지 못했으며, 로컬 승급창 장면에서 검증했습니다.