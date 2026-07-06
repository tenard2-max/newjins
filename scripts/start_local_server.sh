#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v python3 >/dev/null 2>&1; then
  echo "[오류] python3가 설치되어 있지 않습니다."
  exit 1
fi

echo "[1/3] 의존성 설치 중..."
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt

echo "[2/3] 로컬 접속 주소 계산 중..."
LOCAL_IP="$(python3 - <<'PY'
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
try:
    s.connect(("8.8.8.8", 80))
    print(s.getsockname()[0])
finally:
    s.close()
PY
)"

echo "[3/3] Streamlit 서버 시작"
echo "같은 Wi-Fi에서 안드로이드 접속 주소: http://${LOCAL_IP}:8501"
echo "종료하려면 Ctrl+C"

exec streamlit run app.py \
  --server.address 0.0.0.0 \
  --server.port 8501 \
  --server.headless true \
  --server.enableCORS false \
  --server.enableXsrfProtection false \
  --browser.gatherUsageStats false
