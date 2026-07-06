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

## 안드로이드 휴대폰 단독 실행 (Termux)

휴대폰만으로 상시 사용하려면, 터널 주소 대신 폰 안에서 서버를 직접 띄우는 방식이 가장 안정적입니다.

### 1) Termux 설치 후 1회 초기화

```bash
pkg update -y && pkg upgrade -y
pkg install -y git python
```

### 2) 프로젝트 내려받기

```bash
git clone https://github.com/tenard2-max/newjins.git
cd newjins
```

이미 clone 했다면:

```bash
cd newjins
git pull
```

### 3) 서버 실행 (안드로이드 전용 스크립트)

```bash
chmod +x scripts/start_android_termux.sh
./scripts/start_android_termux.sh
```

### 4) 휴대폰 브라우저에서 열기

- 같은 폰에서 접속: `http://127.0.0.1:8501`
- 실행이 확인되면 크롬 메뉴에서 **홈 화면에 추가**하면 앱처럼 사용 가능합니다.

### 5) 끊김 방지 권장

- 안드로이드 배터리 최적화에서 Termux를 예외로 설정
- 화면이 꺼져도 유지하려면 `termux-wake-lock` 권장(가능한 환경에서 자동 호출됨)

## 상시 접속(로컬 서버) 권장 방법

터널 주소(trycloudflare, loca.lt)는 시간이 지나면 바뀌거나 끊길 수 있습니다.  
안정적으로 쓰려면 같은 Wi-Fi에서 접근 가능한 **로컬 고정 주소**를 사용하세요.

### 방법 A) 일반 실행 (포그라운드)

```bash
./scripts/start_local_server.sh
```

- 실행 후 콘솔에 `http://<내PC_IP>:8501` 주소가 표시됩니다.
- 안드로이드에서 같은 Wi-Fi 연결 상태로 위 주소 접속 후 홈 화면 바로가기를 만드세요.

### 방법 B) 상시 실행 (Docker, 백그라운드)

```bash
./scripts/start_local_server_daemon.sh
```

- Docker 컨테이너로 백그라운드 실행됩니다.
- `docker`의 restart 정책(`unless-stopped`)으로 재시작에 강합니다.
- 중지:
  ```bash
  docker compose down
  ```

## Cursor Cloud Agent 환경 설정

- 기본 이미지/시작 스크립트 설정 파일: `.cursor/environment.json`
- 베이스 이미지 정의: `.cursor/Dockerfile`
- 적용 내용:
  - python3/pip/streamlit 기본 포함
  - 시작 시 `data/` 및 하위 폴더 생성
  - `data/` 쓰기 권한 보정
  - Streamlit 서버(8501) 자동 실행

## 핸드폰 바로가기(PWA) 사용법

`mobile-shortcut/` 폴더에 모바일 홈 화면 바로가기용 페이지를 추가했습니다.

- `mobile-shortcut/index.html`
- `mobile-shortcut/manifest.webmanifest`
- `mobile-shortcut/sw.js`
- `mobile-shortcut/icon.svg`

사용 순서:

1. `mobile-shortcut/index.html` 페이지를 휴대폰에서 연다.
2. Streamlit 앱 주소를 입력하고 **주소 저장**을 누른다.
3. 브라우저 메뉴에서 **홈 화면에 추가**를 선택한다.
4. 생성된 아이콘을 누르면 저장된 앱 주소가 바로 열린다.

팁:
- 최초 접속 URL에 `?url=https://YOUR-APP-URL`을 붙이면 주소가 자동 입력됩니다.
  - 예: `https://<도메인>/mobile-shortcut/index.html?url=https://<streamlit-url>`

## 데이터 저장 위치

- 기본 시드 문서: `data/seed/`
- 업로드 문서: `data/uploads/`
- 활성 파일 설정: `data/active_files.json`
- 통장 거래 내역: `data/ledger.json`
