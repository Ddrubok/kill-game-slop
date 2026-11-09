I’ll read the local prompt and project instructions, then run the requested checks within this Git root. I’ll keep the session read-only unless the prompt assigns the permitted copy file.

The packet provides fresh cosmetics captures at 380 and 960 pixels and older promotion captures as a control. I’ll compare what the images show with the rendering code and recorded copy, and keep the findings within that coverage.

The clearest issue is at 380 pixels: both loaded titles disappear, although the same titles are visible at 960 pixels and the copy presents six independent slots. The empty badge and title case hides its retained frames as expected. I’m checking the remaining copy and state evidence before I report priorities.

## 제한 검토 결과

1. **모바일에서 칭호가 사라집니다.** 960px 캡처에는 두 배너의 “Explorer” 칭호가 보이지만, 380px 캡처에는 보이지 않습니다. [CSS](C:/Users/DooBokWie/orca/projects/Default/skill-releases/github-sync-20261102/kill-game-slop/.orca/real-routing-20261109/art-generic/packet/source/cosmetics-view.css:336)가 화면 폭 380px 이하에서 칭호를 숨깁니다. “6가지 독립 슬롯”이라는 안내와 실제 모바일 표시가 어긋나므로, 작은 화면에서도 칭호를 표시할 공간을 마련하거나 숨김을 설정 화면에 명시하는 편이 좋습니다.

2. **배지의 그림과 이름이 서로 다른 대상을 가리킵니다.** 두 캡처의 배지는 나이트 문양처럼 보이지만, 실제 한국어 이름은 “여섯 가지 손맛”이고 획득 조건은 여섯 종류의 기물 발사입니다. 여섯 기물을 암시하는 문양으로 바꾸거나 이름과 문양의 관계를 설명하면 의미가 선명해집니다.

3. **저장 안내 문구를 상태 흐름에 맞출 필요가 있습니다.** 한국어 문구는 “회원 계정에 즉시 동기화”라고 하지만, 같은 카피에는 “미적용 변경사항”과 “적용하기”가 있습니다. 적용 전 선택과 저장 후 동기화를 구분해 설명하는 문구가 적절합니다. 실제 저장 동작은 이 자료만으로 확인할 수 없습니다.

빈 배지·칭호 사례에서는 프레임 ID가 남아 있어도 해당 프레임이 표시되지 않았습니다. 이는 [표시 코드](C:/Users/DooBokWie/orca/projects/Default/skill-releases/github-sync-20261102/kill-game-slop/.orca/real-routing-20261109/art-generic/packet/source/cosmetics-view.ts:224)의 조건과 일치합니다. 프로모션 자료는 11월 5일의 과거 관측이므로 새로운 재현 결과로 판단하지 않았습니다.

**확인:** 제공된 이미지 4장, UTF-8 소스와 관측 JSON을 읽고 비교했습니다. 게임 실행·외부 조회·파일 수정은 하지 않았습니다.