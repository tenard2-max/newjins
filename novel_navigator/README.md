# 웹소설 네비게이터 (Story Bible Navigator)

**Story Bible Project Constitution v1.0** 기반의 모바일 우선 웹앱입니다.
회귀/AI/게이트 세계관의 스토리 바이블을 한 화면에서 열람·편집·백업할 수 있습니다.

## 주요 기능

| 화면 | 설명 |
|---|---|
| 🏠 대시보드 | 통장 잔고, 진행률, 중요 이슈, 오픈 떡밥, 장기 목표 요약 |
| 👥 인물 | 인물 선택 · 상세 정보 · 관계 · 인라인 편집 |
| 🕸️ 관계도 | Graphviz 기반 인물 관계 시각화, 중심 인물 필터 |
| 📚 스토리 | 에피소드 리스트/요약/편집/추가/삭제 |
| 💰 투자 | 5단계 Phase 진행률, 통장 잔고, 입출금 이력 등록 |
| ⚔️ 적 리스트 | 7보스 + 최종보스(AI폰) 진행 상태 |
| 🧩 이슈/떡밥 | OPEN/CLOSED 관리, 중요도, 등장/회수 EP |
| 🗂️ 파일 관리 | 스토리 md · 마스터 DB · `story_bible.json` · 스토리바이블 ZIP 업/다운로드 |

## 데이터 구조

모든 상태는 `data/story_bible.json` 하나에 저장됩니다.
- 저장은 임시 파일 → `os.replace` 로 원자적으로 이루어집니다.
- 저장 시 이전 파일이 `data/backups/` 로 타임스탬프 백업됩니다.
- 원본 md 파일들은 `data/bible_source/` 에서 관리됩니다.

## 실행 방법

```bash
cd novel_navigator
pip install -r requirements.txt
streamlit run app.py
```

기본 포트는 `8501` 입니다 (`.streamlit/config.toml`).

### 모바일에서 열기

같은 네트워크의 스마트폰에서 `http://<PC 로컬 IP>:8501` 로 접속하세요.
UI는 세로 화면에 최적화되어 있으며 상단 라디오 pill 메뉴로 페이지를 이동합니다.

## Graphviz 시스템 의존성

인물 관계도는 Python `graphviz` 패키지에 더해 **Graphviz 시스템 바이너리**가 필요합니다.

- Ubuntu/Debian: `sudo apt-get install -y graphviz`
- macOS: `brew install graphviz`
- Windows: [Graphviz 공식 다운로드](https://graphviz.org/download/)

바이너리가 없어도 다른 기능은 정상 동작하며, 관계도 화면에서만 오류 메시지가 표시됩니다.

## 폴더 구조

```
novel_navigator/
├── app.py                     # Streamlit 진입점
├── utils/
│   ├── data_store.py          # JSON 로드/저장/ZIP 유틸
│   └── formatting.py          # 원화 포맷 등
├── data/
│   ├── story_bible.json       # 단일 진실 원본
│   ├── bible_source/          # 원본 md 파일들
│   ├── uploads/               # (예비) 업로드 저장소
│   ├── exports/               # ZIP 내보내기 결과
│   └── backups/               # 저장 시 자동 백업
├── .streamlit/config.toml     # 다크 테마 설정
├── requirements.txt
└── README.md
```

## 파일 업데이트 흐름

1. **스토리 md 업로드** — 개별 파일들을 `data/bible_source/` 에 저장 (덮어쓰기 전 자동 백업).
2. **마스터 DB 업데이트** — `99_Master_DB.md` 로 고정 저장.
3. **`story_bible.json` 직접 교체** — 잘못된 JSON은 거부됩니다.
4. **스토리바이블 ZIP** — md들과 `story_bible.json` 을 한 번에 내보내기/가져오기.

## Constitution

이 앱의 모든 데이터 규칙과 스토리 규범은 **Story Bible Project Constitution v1.0** 에 기반합니다.
UI 하단에 항상 표기됩니다.
