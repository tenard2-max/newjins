# 웹소설 네비게이터 · Story Bible Navigator

Story Bible Project Constitution **v1.0** 을 기반으로 한 웹소설 스토리 바이블 관리 앱입니다.
휴대폰에서 **홈 화면에 추가**하면 네이티브 앱처럼 동작하는 **PWA** 로 제작되었습니다.

## 주요 기능

- **홈 대시보드** — 작품 메타, 통장 잔고, 현재/다음 에피소드, 장기 목표 요약
- **인물** — 카드 그리드, 상세(프로필·미래역할·관계) 모달
- **인물 관계도** — SVG 노드-엣지, 관계 유형별 색상 범례
- **중요 이슈(떡밥)** — OPEN/CLOSED 상태 토글
- **투자** — 5단계 로드맵(Seed→Final)과 통장 잔고
- **적 · 7보스** — LOCK/OPEN/ALLY 상태 관리, AI 폰(Final Boss) 별도 강조
- **스토리** — 에피소드 체크리스트 + 요약 편집(자동 저장)
- **설정** — Project Constitution 열람, 메타 편집, 파일 Import/Export
  - Import: `master.md` · `StoryBible.zip` · `story_bible.json`
  - Export: `99_Master_DB.md` · `StoryBible.zip` · JSON 백업
- **오프라인 지원** — Service Worker + 앱 셸 캐시
- **로컬 저장** — 모든 편집은 `localStorage` 에 즉시 저장 (서버 전송 없음)

## 실행 방법

정적 파일이라 별도 빌드가 필요 없습니다. 아무 정적 서버로 열면 됩니다.

```bash
# Python 3 사용 시
python3 -m http.server 8080

# Node 사용 시
npx serve .
```

브라우저에서 `http://localhost:8080` 접속.

### 휴대폰에서 앱처럼 사용

1. GitHub Pages / Netlify / Vercel / 아무 정적 호스팅에 배포합니다.
2. 폰 브라우저(Chrome / Safari)로 열고 **"홈 화면에 추가"** 를 선택합니다.
3. 홈 화면 아이콘을 눌러 전체 화면 PWA 로 실행됩니다. 오프라인에서도 동작합니다.

## 데이터 흐름 (Constitution 제1조·제8조)

```
    [ default (첨부 문서 파싱) ]
                │
                ▼
    ┌───────────────────────────┐
    │  localStorage 상태 저장소  │◀── Import (.md / .zip / .json)
    └───────────────────────────┘
                │
                ├── UI 렌더링
                │
                └── Export → 99_Master_DB.md  또는  StoryBible.zip
```

`StoryBible.zip` 내부 구조:

```
StoryBible/
  00_World.md
  01_Characters.md
  02_AI.md
  03_Timeline.md
  04_Foreshadow.md
  05_Investment.md
  06_Gate.md
  07_Bosses.md
  99_Master_DB.md
  Novel_Story_Summary.md
  story_bible.json     # 완전 복원용 원본 JSON
```

## Story Bible Project Constitution v1.0 (요지)

- **제1조** 마스터 DB = 단일 진실 원본 (Single Source of Truth)
- **제2조** 회귀자 관점 유지 (100세 · 마지막 1초 잔상)
- **제3조** 떡밥 OPEN/CLOSED 관리, 회수 계획 필수
- **제4조** AI 시뮬레이션 값 불변: 0% / 3% / **97%**
- **제5조** 투자 단계 Seed → P1 → P2 → P3 → Final, 목표 1,000조
- **제6조** 7보스 원칙: 모두 최종적으로 동료가 된다
- **제7조** 생존 필드는 회수/발생 EP 근거로만 갱신
- **제8조** 언제든 master.md / StoryBible.zip 으로 이관 가능

전문은 앱 → **설정 → Project Constitution** 에서 열람 가능합니다.

## 파일 구조

```
index.html            # PWA 셸
manifest.json         # PWA 매니페스트
sw.js                 # 서비스 워커 (오프라인 캐시)
css/app.css           # 다크 SF 테마
js/
  app.js              # 라우터 + 뷰 렌더러
  store.js            # 상태 저장소 (localStorage)
  defaultData.js      # 첨부 문서 파싱 결과 (초기 상태)
  exporters.js        # master.md / StoryBible.zip 생성
  importers.js        # 파일 → 상태 파싱
assets/
  characters/         # 캐릭터 프로필 이미지
  icons/              # PWA 아이콘 (SVG)
```

## 기술 선택 사유

기본 원칙은 Python/Streamlit 이지만 다음 이유로 **정적 PWA (HTML/CSS/JS)** 로 구현했습니다.

1. "휴대폰에서 앱처럼 작동" 요구 → PWA 는 서버 없이도 홈화면 설치·오프라인 지원 가능.
2. 파일 업로드/다운로드는 브라우저 File API + JSZip 만으로 완전한 클라이언트 처리 가능.
3. 개인 스토리 데이터가 서버에 올라가지 않아 프라이버시가 안전.
4. GitHub Pages 등에 무료 배포 → URL 하나로 어디서든 접근.

Streamlit 병용이 필요하면 별도 브랜치로 추가 가능합니다.
