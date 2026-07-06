# 📖 웹소설 네비게이터 (Story Bible Navigator)

회귀 웹소설 프로젝트의 설정을 관리하는 모바일 친화 웹앱입니다.
**Story Bible Project Constitution v1.0** (`story_bible/STORY_BIBLE_CONSTITUTION.md`)을 따릅니다.

## 주요 기능

| 탭 | 기능 |
| --- | --- |
| 🏠 대시보드 | 통장 잔고·떡밥·이슈·에피소드 진행 요약 |
| 👥 인물 | 인물 선택/상세 보기, 인물 관계도, 인물 수정·추가 |
| ❗ 이슈·떡밥 | 중요 이슈 관리(우선순위/상태), 떡밥 추적·회수 처리 |
| 💰 투자·잔고 | 투자 로드맵(Seed→Final), 거래 내역 기반 통장 잔고 |
| ⚔️ 적 | 7보스(B1~B7)·최종보스(AI)·게이트 침공 세력 리스트 |
| 📂 문서 | 스토리 md 파일 열람·수정, 99_Master_DB.md 재생성, 스토리바이블.zip 발행·다운로드 |

## 실행 방법

```bash
cd webnovel-navigator
pip install -r requirements.txt
streamlit run app.py
```

브라우저에서 `http://localhost:8501` 로 접속합니다.

### 휴대폰에서 사용하기

같은 Wi-Fi 에 연결된 휴대폰에서 접속하려면:

```bash
streamlit run app.py --server.address 0.0.0.0
```

휴대폰 브라우저에서 `http://<PC의 IP>:8501` 로 접속하세요.
화면은 모바일 기준으로 최적화되어 있으며, 브라우저의 "홈 화면에 추가"로
앱처럼 설치해 사용할 수 있습니다.

외부에서도 쓰고 싶다면 [Streamlit Community Cloud](https://streamlit.io/cloud)에
이 저장소를 연결해 무료로 배포할 수 있습니다.

## 폴더 구조

```
webnovel-navigator/
├── app.py                  # Streamlit 앱 본체
├── requirements.txt
├── lib/
│   ├── store.py            # 데이터 입출력, 잔고 계산, 마스터 DB/zip 생성
│   └── graph.py            # 인물 관계도(Graphviz DOT) 생성
├── data/
│   ├── story_data.json     # ★ 단일 진실 원천 (헌법 제2조)
│   └── 스토리바이블.zip     # 발행된 배포본 (자동 생성)
└── story_bible/
    ├── STORY_BIBLE_CONSTITUTION.md   # 헌법 v1.0
    ├── 00_World.md ... 07_Bosses.md  # 설정 문서
    ├── 99_Master_DB.md               # 자동 생성 (직접 수정 금지)
    └── Novel_Story_Summary_EP001-007.md
```

## 데이터 규칙 요약 (헌법 발췌)

- 구조화 데이터의 원본은 `data/story_data.json` 하나입니다.
- `99_Master_DB.md` 는 앱에서 자동 재생성되며 직접 수정하지 않습니다.
- 통장 잔고는 거래 내역의 합으로만 계산합니다.
- 떡밥은 회수(CLOSED) 전까지 삭제하지 않습니다.
- 7보스는 LOCK 등급으로, 공개 전까지 이름을 "미정"으로 유지합니다.
