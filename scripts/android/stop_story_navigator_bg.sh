#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
RUN_DIR="${ROOT_DIR}/.run"
PID_FILE="${RUN_DIR}/story_navigator.pid"

if [ ! -f "${PID_FILE}" ]; then
  MSG="실행 중인 서버 PID 파일이 없습니다."
  echo "${MSG}"
  if command -v termux-toast >/dev/null 2>&1; then
    termux-toast "${MSG}" || true
  fi
  exit 0
fi

PID="$(cat "${PID_FILE}" 2>/dev/null || true)"
if [ -z "${PID}" ]; then
  rm -f "${PID_FILE}"
  MSG="PID 파일이 비어 있어 정리했습니다."
  echo "${MSG}"
  if command -v termux-toast >/dev/null 2>&1; then
    termux-toast "${MSG}" || true
  fi
  exit 0
fi

if kill -0 "${PID}" 2>/dev/null; then
  kill "${PID}" || true
  sleep 1
  if kill -0 "${PID}" 2>/dev/null; then
    kill -9 "${PID}" || true
  fi
fi

rm -f "${PID_FILE}"

if command -v termux-wake-unlock >/dev/null 2>&1; then
  termux-wake-unlock || true
fi

MSG="웹소설 네비게이터 서버 중지 완료"
echo "${MSG}"
if command -v termux-toast >/dev/null 2>&1; then
  termux-toast "${MSG}" || true
fi
