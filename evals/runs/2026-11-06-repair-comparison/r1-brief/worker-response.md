I’ll read the local instructions and `prompt.txt` with explicit UTF-8 decoding, then make the repair in the allowed files and run focused checks.

The live scene shows the existing four choices and copy. In the source, clicks can schedule multiple callbacks, and replacing a modal does not cancel an earlier callback. I’m adding a single pending selection state, invalidating replaced or detached modals, and removing animation under reduced motion while keeping the 120 ms callback timing.

The first check found that the selection border was still transitioning when the 120 ms handoff began. I made that pending highlight immediate. The scene checks and TypeScript check now pass; I’m checking the captured pending state and final diff.

승급 선택창의 연속 입력이 콜백을 중복 실행하지 않도록 고쳤습니다. 교체되거나 닫힌 창의 예약된 선택도 취소되며, 선택 후 120ms 전달 시점은 유지했습니다. 대기 중인 선택은 화면의 강조 표시와 접근성 상태로 드러납니다. 모션 줄이기 설정에서는 등장·퇴장 애니메이션을 없애고, 일반 모드의 연출은 유지했습니다.

실제 모달 화면에서 연속 입력, 창 교체·닫힘, 두 가지 모션 줄이기 설정을 확인했고 TypeScript 검사도 통과했습니다. 확인 범위는 제공된 컴포넌트 장면이며, 전체 경기 흐름은 실행하지 않았습니다.