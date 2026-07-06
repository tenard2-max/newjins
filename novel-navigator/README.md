# 📖 웹소설 네비게이터 (Story Bible Navigator)

회귀/투자/게이트 웹소설의 스토리 바이블을 휴대폰에서 관리하는 Streamlit 앱입니다.
**Story Bible Project Constitution v1.0**을 따릅니다.

## 주요 기능

- **대시보드** — 통장 잔고, 미회수 떡밥, 에피소드 진행률, 장기 목표, 타임라인 요약
- **인물** — 인물 선택 → 프로필·관계 조회, 인물 정보 수정
- **인물관계도** — 관계 그래프 시각화(확대/이동 가능), 관계 추가
- **중요이슈(떡밥)** — OPEN/RESOLVED 상태 관리, 신규 떡밥 등록
- **투자·통장잔고** — 투자 로드맵(Seed→Final) 단계 관리, 거래 내역 기반 잔고 계산
- **적 리스트** — 게이트 위협 + 7보스 + AI 최종보스 관리
- **스토리 파일** — `story-bible/*.md` 미리보기·편집, 에피소드 체크리스트
- **마스터 MD** — 구조화 데이터에서 `99_Master_DB.md` 자동 재생성
- **스토리바이블.zip** — 전체 문서+데이터 내보내기/가져오기(백업·복원)

## 실행 방법

```bash
cd novel-navigator
pip install -r requirements.txt
streamlit run app.py
```

휴대폰에서 사용하려면 같은 네트워크에서 아래처럼 실행한 뒤,
휴대폰 브라우저로 `http://<PC IP>:8501`에 접속하세요.

```bash
streamlit run app.py --server.address 0.0.0.0
```

> Streamlit Community Cloud 등에 배포하면 어디서든 휴대폰으로 접속할 수 있습니다.

## 데이터 구조

| 경로 | 설명 |
| --- | --- |
| `data/story_db.json` | 인물·관계·떡밥·투자·거래·적·에피소드 구조화 데이터 (단일 진실) |
| `story-bible/*.md` | 스토리 바이블 원본 문서 (편집 가능) |
| `story-bible/99_Master_DB.md` | 마스터 DB — 저장 시 자동 재생성 |

구조화 데이터를 수정하면 마스터 MD가 자동으로 다시 생성되어
문서와 데이터가 항상 일치하도록 유지됩니다 (Constitution 제1조).
