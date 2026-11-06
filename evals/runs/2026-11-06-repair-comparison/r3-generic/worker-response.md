I’ll read the local instructions and prompt, then inspect the web app, make the repair, and run focused checks.

The modal currently accepts repeated clicks, and an earlier modal’s timer can still call its callback after replacement or removal. I’ll lock the first choice, guard delivery against stale overlays, add a visible and accessible pending state, and disable animation when motion reduction is active.

The scene checks pass for repeated input, replacement, removal, callback timing, and reduced motion. I’m checking a capture of the pending state and reviewing the diff before I hand this back.

승급 모달을 수리했습니다. 첫 선택을 즉시 잠그고 선택 상태를 화면과 접근성 속성에 표시했습니다. 닫히거나 교체된 모달의 지연 콜백은 무시하며, 기존 120ms 전달 시점과 일반 모드의 등장·퇴장 연출은 유지했습니다. 모션 줄이기 설정에서는 해당 애니메이션을 끕니다.

실제 모달을 띄운 로컬 화면에서 연속 입력, 창 교체·제거, 120ms 시점, 모션 줄이기를 확인했고 TypeScript 검사도 통과했습니다. 전체 경기 흐름은 확인하지 않았습니다.