#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"
VENV_DIR="${ROOT_DIR}/.venv"

PYTHON_BIN="$(command -v python3 || command -v python || true)"
if [ -z "${PYTHON_BIN}" ]; then
  echo "[오류] python이 설치되어 있지 않습니다."
  echo "Termux에서 다음을 먼저 실행하세요: pkg install -y python"
  exit 1
fi

if command -v termux-wake-lock >/dev/null 2>&1; then
  termux-wake-lock || true
fi

echo "[1/3] 가상환경 준비"
if [ ! -x "${VENV_DIR}/bin/python" ]; then
  "${PYTHON_BIN}" -m venv "${VENV_DIR}"
fi

VENV_PY="${VENV_DIR}/bin/python"
VENV_PIP="${VENV_DIR}/bin/pip"

echo "[2/3] 의존성 설치(.venv)"
"${VENV_PIP}" install -r requirements.txt

echo "[3/3] Streamlit 실행"
echo "같은 폰 브라우저 접속: http://127.0.0.1:8501"
echo "같은 Wi-Fi 다른 기기 접속: http://0.0.0.0:8501 (필요 시 방화벽/네트워크 정책 확인)"
echo "종료: Ctrl+C"

exec "${VENV_PY}" -m streamlit run app.py \
  --server.address 0.0.0.0 \
  --server.port 8501 \
  --server.headless true \
  --server.enableCORS false \
  --server.enableXsrfProtection false \
  --browser.gatherUsageStats false
