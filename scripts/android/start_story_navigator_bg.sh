#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
RUN_DIR="${ROOT_DIR}/.run"
PID_FILE="${RUN_DIR}/story_navigator.pid"
LOG_FILE="${RUN_DIR}/story_navigator.log"

mkdir -p "${RUN_DIR}"
cd "${ROOT_DIR}"

PYTHON_BIN="$(command -v python3 || command -v python || true)"
if [ -z "${PYTHON_BIN}" ]; then
  echo "[오류] python이 설치되어 있지 않습니다. Termux에서 'pkg install -y python' 실행 필요."
  exit 1
fi

if [ -f "${PID_FILE}" ]; then
  OLD_PID="$(cat "${PID_FILE}" 2>/dev/null || true)"
  if [ -n "${OLD_PID}" ] && kill -0 "${OLD_PID}" 2>/dev/null; then
    MSG="이미 실행 중입니다: http://127.0.0.1:8501"
    echo "${MSG}"
    if command -v termux-toast >/dev/null 2>&1; then
      termux-toast "${MSG}" || true
    fi
    if command -v termux-open-url >/dev/null 2>&1; then
      termux-open-url "http://127.0.0.1:8501" || true
    fi
    exit 0
  fi
fi

if command -v termux-wake-lock >/dev/null 2>&1; then
  termux-wake-lock || true
fi

python_deps_stamp="${RUN_DIR}/deps_ok.stamp"
if [ ! -f "${python_deps_stamp}" ]; then
  "${PYTHON_BIN}" -m pip install --upgrade pip
  "${PYTHON_BIN}" -m pip install -r requirements.txt
  date -u +"%Y-%m-%dT%H:%M:%SZ" > "${python_deps_stamp}"
fi

nohup "${PYTHON_BIN}" -m streamlit run app.py \
  --server.address 0.0.0.0 \
  --server.port 8501 \
  --server.headless true \
  --server.enableCORS false \
  --server.enableXsrfProtection false \
  --browser.gatherUsageStats false \
  > "${LOG_FILE}" 2>&1 &

NEW_PID=$!
echo "${NEW_PID}" > "${PID_FILE}"
sleep 1

if kill -0 "${NEW_PID}" 2>/dev/null; then
  MSG="웹소설 네비게이터 시작 완료: http://127.0.0.1:8501"
else
  MSG="시작 실패. 로그 확인: ${LOG_FILE}"
fi

echo "${MSG}"
if command -v termux-toast >/dev/null 2>&1; then
  termux-toast "${MSG}" || true
fi
if command -v termux-open-url >/dev/null 2>&1; then
  termux-open-url "http://127.0.0.1:8501" || true
fi
