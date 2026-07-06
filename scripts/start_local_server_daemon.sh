#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v docker >/dev/null 2>&1; then
  echo "[오류] docker가 설치되어 있지 않습니다."
  exit 1
fi

if docker compose version >/dev/null 2>&1; then
  COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_CMD="docker-compose"
else
  echo "[오류] docker compose(또는 docker-compose)를 찾을 수 없습니다."
  exit 1
fi

echo "[1/2] 컨테이너 빌드/실행 중 (백그라운드)..."
$COMPOSE_CMD up -d

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

echo "[2/2] 완료"
echo "같은 Wi-Fi에서 안드로이드 접속 주소: http://${LOCAL_IP}:8501"
echo "재부팅 후에도 Docker가 자동 시작이면 앱은 계속 살아있습니다."
