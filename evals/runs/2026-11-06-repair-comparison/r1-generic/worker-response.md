I’ll read the local instructions and `prompt.txt` as UTF-8, then repair the assigned web files and run relevant checks.

The modal currently accepts repeated clicks during the 120 ms delay, and an old timer can still call back after its overlay is replaced or removed. I’ll guard that lifecycle, show which choice is pending, and make the modal animations respect reduced motion.

The repair now locks the first choice immediately, keeps its pending state visible and accessible, and ignores callbacks from overlays that were replaced or removed. I’m checking those cases in the browser harness, along with normal and reduced motion.

승급 선택창을 수정했습니다. 첫 선택 즉시 다른 입력을 잠그고 선택 상태를 화면과 접근성 속성에 표시합니다. 교체되거나 제거된 창의 지연 콜백은 무시하며, 선택 결과를 전달하는 기존 120ms 시점과 일반 모드의 등장·퇴장 연출은 유지했습니다. 모션 줄이기 설정에서는 애니메이션을 끕니다.

브라우저 화면과 연속 입력·창 교체·제거 동작을 확인했고, TypeScript 검사와 9개 언어 검사가 통과했습니다. 전체 게임 플레이에서의 동작은 확인하지 못했습니다.