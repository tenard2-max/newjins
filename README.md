# 웹소설 네비게이터

첨부받은 Story Bible 문서를 기반으로 만든 Streamlit 앱입니다.

## 제공 기능

- 인물 선택 네비게이터
- 인물 관계도 시각화
- 중요 이슈 목록
- 투자 로드맵 + 통장잔고(거래 기록 기반)
- 적 리스트
- 마스터 MD / 스토리 MD / Story Bible ZIP 업로드 및 활성 파일 교체
- 모바일 화면 대응 UI

## 실행 방법

```bash
pip install -r requirements.txt
streamlit run app.py
```

## 데이터 저장 위치

- 기본 시드 문서: `data/seed/`
- 업로드 문서: `data/uploads/`
- 활성 파일 설정: `data/active_files.json`
- 통장 거래 내역: `data/ledger.json`
