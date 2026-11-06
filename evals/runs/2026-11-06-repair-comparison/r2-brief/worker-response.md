I’ll read the local instructions and UTF-8 prompt, inspect the app, then make and check the repair within this directory.

The live modal matches the intended layout. I found two state issues in the source: rapid clicks can schedule multiple callbacks, and a replaced modal’s timer can still deliver an old choice. I’ll lock the pending selection, guard delivery, and show the selected state on screen and to assistive technology.

The repair is in place. I’ll run a type check and exercise rapid input, replacement, removal, and reduced motion in the local browser scene.

The browser checks passed, including replacement, removal, keyboard input, and both reduced-motion settings. I’m adjusting one accessibility detail: keeping the chosen button focusable during the 120 ms wait so its pressed state remains available to assistive technology.

승급 모달을 실제 실행 화면과 소스에서 확인하고 수정했습니다. 연속 입력은 한 번만 처리하며, 교체되거나 제거된 창의 예약된 선택은 전달하지 않습니다. 선택 후 **120ms 전달 시점**과 기존 기물·능력·번역 문구는 유지했습니다. 대기 중 선택은 시각적 강조와 접근성 상태로 표시하고, 모션 줄이기 설정에서는 등장·퇴장 애니메이션을 끕니다.

확인: 로컬 브라우저 장면에서 연속 입력, 창 교체·제거, 키보드 선택, 모션 줄이기 두 설정을 검사했고 TypeScript 검사도 통과했습니다. 전체 게임 진행과 9개 언어별 화면은 확인하지 않았습니다. 남은 차단 사항은 없습니다.