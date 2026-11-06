I’ll read the local instructions and repair prompt, then make the requested changes in this workspace and run focused checks.

The prompt calls for a focused repair of the promotion dialog: keep its pieces, text, 120 ms handoff, and normal animation, while fixing repeated input, dialog replacement, and reduced motion. I’ll trace those state transitions first.

The current click handler schedules a new callback on every click. A timer can also fire after its dialog has been replaced or removed, and the 120 ms wait has no clear selected state. I’ll make selection single use, tie the callback to the live dialog, and show the locked choice during the wait.

The repair is in place. I’m checking repeated clicks, replacement and removal during the 120 ms wait, reduced motion, and all nine languages in the local component scene. I’ll also run TypeScript’s no emit check.

The component checks and TypeScript check pass. I found one accessibility detail while verifying: disabling the selected button moved keyboard focus away, so I kept focus on the selected choice and marked all choices unavailable during the wait. I’m checking the rendered pending state and system reduced motion once more.

승급 선택창을 수정했습니다. 연속 입력은 한 번만 처리하고, 닫히거나 교체된 창의 선택과 예약된 콜백은 무시합니다. 120ms 전달 시점과 일반 모드 등장·퇴장 연출은 유지하면서, 대기 중 선택 표시와 접근성 상태를 추가하고 모션 줄이기 설정에서는 연출을 끕니다.

로컬 실행 화면에서 일반·모션 줄이기 상태를 확인했습니다. 반복 입력, 창 교체·제거, 종료된 창의 입력, 9개 언어 검사가 통과했고 TypeScript 검사도 통과했습니다. 전체 경기 흐름에서는 확인하지 못했습니다.