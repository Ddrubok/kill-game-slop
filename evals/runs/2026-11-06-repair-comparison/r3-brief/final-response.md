승급 모달에서 **연속 입력의 중복 선택**과 **교체되거나 닫힌 창의 늦은 콜백**을 막았습니다. 선택 대기 중에는 고른 기물을 강조하고 다른 선택을 비활성화했으며, 대화상자와 선택 상태에 접근성 속성을 추가했습니다. 기존 120ms 전달 시점과 일반 모드 연출은 유지하고, 모션 줄이기 설정에서는 애니메이션을 끕니다.

수정 파일: [promotion-modal.ts](<C:/Users/DooBokWie/orca/projects/Default/skill-releases/github-sync-20261102/kill-game-slop/.orca/repair-comparison-20261106/r3-brief/web/src/promotion-modal.ts>), [style.css](<C:/Users/DooBokWie/orca/projects/Default/skill-releases/github-sync-20261102/kill-game-slop/.orca/repair-comparison-20261106/r3-brief/web/src/style.css>).

브라우저 장면에서 연속 선택, 창 교체·제거, 모션 줄이기, 대기 화면을 확인했고 TypeScript 검사도 통과했습니다. **실제 전체 경기 흐름은 확인하지 못했습니다.**