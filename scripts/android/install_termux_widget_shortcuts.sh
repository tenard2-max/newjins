#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SHORTCUT_DIR="${HOME}/.shortcuts"

mkdir -p "${SHORTCUT_DIR}"

START_WRAPPER="${SHORTCUT_DIR}/01_start_story_navigator.sh"
STOP_WRAPPER="${SHORTCUT_DIR}/02_stop_story_navigator.sh"

cat > "${START_WRAPPER}" <<EOF
#!/data/data/com.termux/files/usr/bin/bash
cd "${ROOT_DIR}"
exec bash "${ROOT_DIR}/scripts/android/start_story_navigator_bg.sh"
EOF

cat > "${STOP_WRAPPER}" <<EOF
#!/data/data/com.termux/files/usr/bin/bash
cd "${ROOT_DIR}"
exec bash "${ROOT_DIR}/scripts/android/stop_story_navigator_bg.sh"
EOF

chmod +x "${START_WRAPPER}" "${STOP_WRAPPER}"
chmod +x "${ROOT_DIR}/scripts/android/start_story_navigator_bg.sh"
chmod +x "${ROOT_DIR}/scripts/android/stop_story_navigator_bg.sh"

echo "Termux:Widget 바로가기 설치 완료"
echo "1) 홈 화면에 'Termux:Widget' 위젯 추가"
echo "2) 목록에서 '01_start_story_navigator.sh' 터치 = 서버 시작"
echo "3) 목록에서 '02_stop_story_navigator.sh' 터치 = 서버 중지"
echo "4) 실행 후 크롬 주소: http://127.0.0.1:8501"
