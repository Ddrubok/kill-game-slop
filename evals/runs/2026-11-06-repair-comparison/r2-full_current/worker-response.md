I’ll read the local instructions and prompt with UTF-8 decoding, then make the repair in the permitted files and run focused checks.

The repair target is the promotion modal. I’ll check its input, replacement, closing, and reduced-motion paths against the rendered scene, while keeping the existing choices, copy, and 120 ms handoff.

The source shows two concrete risks: repeated clicks can queue multiple callbacks, and a callback from a removed modal can still fire after replacement. The pending choice also has no distinct state for sighted or assistive technology users. I’ll capture the current scene, then fix those paths.

The baseline scene reproduced both stale callbacks and duplicate selection, and reduced motion still played the entrance animation. The repair now locks the pending choice, marks it with a visible and ARIA state, checks that the modal still owns the callback, and suppresses promotion animations when motion is reduced. I’m checking those behaviors in the same scene.

The scene checks now show one callback for repeated input, no callback from a replaced or removed modal, and a visible selected state with `aria-pressed` and disabled choices. They also show no animation under reduced motion while the normal entrance, exit, and delayed handoff remain in place. TypeScript passes; I’m reviewing the final diff for scope.

승급 선택창을 수리했습니다. 연속 입력은 한 번만 처리하고, 교체되거나 제거된 창의 지연 콜백은 무시합니다. 전달 대기 중에는 선택한 기물을 시각적으로 강조하고 접근성 선택 상태를 표시하며, 모션 줄이기에서는 등장·퇴장 애니메이션을 끕니다. 기존 선택지와 문구, 120ms 전달 시점, 일반 모션은 유지했습니다.

360×800 로컬 장면에서 반복 입력·교체·제거·모션 설정을 확인했고 TypeScript 검사도 통과했습니다. 실제 전체 경기 흐름과 다른 화면 크기·언어는 확인하지 않았습니다.