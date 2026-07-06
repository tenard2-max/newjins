# 스토리 네비게이터

웹소설 **스토리 바이블**을 휴대폰에서 탐색·편집하는 PWA 앱입니다.  
**Story Bible Project Constitution v1.0** 규칙을 따릅니다.

## 기능

- **인물 선택** 및 상세 정보
- **인물 관계도** (SVG 네트워크)
- **중요 이슈** (떡밥 DB)
- **투자 목록** 및 **통장 잔고**
- **적 리스트** (게이트·7보스·AI)
- **스토리 파일 편집** (bible/*.md)
- **story_bible.zip** 보내기 / 가져오기
- **Master DB 동기화**

## 실행

```bash
cd novel-navigator
pip install -r requirements.txt
python app.py
```

브라우저에서 `http://localhost:5000` 접속  
모바일: 같은 Wi-Fi에서 PC IP로 접속 후 **홈 화면에 추가**하면 앱처럼 사용 가능

## 파일 구조

```
novel-navigator/
├── app.py              # Flask API
├── constitution.json   # Constitution v1.0
├── bible/              # 스토리 바이블 MD
├── static/             # PWA 정적 파일
└── templates/
```

## Constitution v1.0 요약

| ID | 규칙 |
|----|------|
| SOT | 99_Master_DB.md가 집계 원본 |
| PREFIX | 00~99 파일 접두 |
| CHAR_ID | CH001 형식 인물 ID |
| FORE_ID | F001 떡밥 추적 |
| BOSS_ID | B1~B7 보스 구조 |
| BALANCE | Seed 58.7억 기본 잔고 |
| EXPORT | bible 전체 ZIP 패키징 |
