I’ll read the local instructions and `prompt.txt` as UTF-8, inspect the relevant web code, then make and verify the repair in this workspace.

The modal currently schedules a callback for every click and keeps that callback alive after the modal is replaced or removed. I’ll lock the first selection, show its pending state, and make the delayed callback verify that its modal is still current. I’ll also check how the game handles reduced motion.

The selection now locks immediately, and the pending choice has a visible selected style plus `aria-pressed` state. I also added reduced motion rules for both opening and closing. I’m running the component scene check and TypeScript validation now.

The browser scene passes the repeated click, replacement, removal, and motion checks. I inspected a capture of the pending state; the chosen piece remains clearly highlighted. I’m reviewing the final diff for scope and unintended changes.

승급 선택창의 연속 클릭을 막고, 전달 대기 중인 선택을 색상과 `aria-pressed` 상태로 표시했습니다. 창이 교체되거나 닫히면 이전 창의 120ms 지연 콜백은 실행되지 않습니다. 모션 줄이기 설정에는 등장·퇴장 애니메이션을 끄되, 일반 모드의 연출은 유지했습니다.

실제 모달을 띄운 브라우저 검사와 TypeScript 검사가 통과했습니다. [대기 상태 캡처](<C:\Users\DooBokWie\orca\projects\Default\skill-releases\github-sync-20261102\kill-game-slop\.orca\repair-comparison-20261106\r2-generic\work\promotion-pending.png>)도 확인했습니다. 전체 경기 흐름은 실행해 확인하지 않았습니다.