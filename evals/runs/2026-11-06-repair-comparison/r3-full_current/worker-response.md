I’ll read the local instructions and `prompt.txt` with explicit UTF-8 decoding, then make and check the repair within this directory.

The modal currently queues a 120 ms callback on every click. I’m checking its styles and scene harness before changing the selection state and replacement behavior.

The baseline scene shows the four choices and the intended modal entrance. I’ll make the first choice visibly selected and inaccessible to further input during the existing 120 ms exit, and guard the callback if that modal is replaced or removed.

The source change is in place. I’m running the local scene checks for rapid clicks, replacement, external removal, keyboard focus, and reduced motion, along with TypeScript and localization checks.

승급 모달을 수리했습니다. 첫 선택을 시각적 강조와 `aria-pressed`로 표시하고, 전달을 기다리는 120ms 동안 추가 입력을 막았습니다. 창이 교체되거나 제거되면 이전 선택의 콜백이 실행되지 않도록 했습니다. 일반 모드의 등장·퇴장 연출과 120ms 전달 시점은 유지하고, 모션 줄이기에서는 연출을 제거했습니다.

로컬 장면에서 연속 입력, 창 교체·제거, 키보드 포커스, 두 가지 모션 줄이기 설정을 확인했습니다. TypeScript 검사와 9개 언어 검사도 통과했습니다. 전체 경기 흐름과 실제 기기 입력은 확인하지 못했습니다.