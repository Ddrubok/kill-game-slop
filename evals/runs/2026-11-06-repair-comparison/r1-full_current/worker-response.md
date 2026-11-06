I’ll read the local repair prompt and project instructions, then make the requested repair in the allowed web files and run focused checks.

The target is the promotion choice modal. I’ll keep its options, translations, 120 ms handoff, and normal entry and exit motion intact while checking repeated clicks, replacement or closure, and reduced motion.

The baseline screen shows the intended four choices and layout. The source confirms two failure paths: repeated clicks can schedule multiple callbacks, and removing or replacing the modal leaves its 120 ms timer able to call an obsolete selection. I’ll lock the first choice, show its pending state, and make the callback check that it still owns the active modal.

The repair now keeps the chosen button focused and marked as selected while the 120 ms handoff is pending. I’m checking the real component in the local browser for repeated input, replacement, external removal, nine languages, and both motion settings.

승급 선택창을 수리했습니다. 연속 입력은 첫 선택만 받아들이고, 대기 중인 선택은 화면 강조와 접근성 상태로 표시합니다. 창이 교체되거나 닫히면 이전 선택의 콜백은 실행되지 않습니다. 120ms 전달 시점과 일반 모션은 유지하고, 모션 줄이기 설정에서는 모달 애니메이션을 끕니다.

로컬 브라우저에서 연속 입력·교체·닫힘·모션 줄이기·9개 언어를 확인했고, TypeScript 검사도 통과했습니다. 전체 경기 흐름과 실제 기기 입력은 확인하지 못했습니다.