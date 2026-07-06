"""웹소설 네비게이터 — Story Bible Project Constitution v1.0"""
from __future__ import annotations

import io
import json
import re
import zipfile
from datetime import datetime, timezone
from pathlib import Path

from flask import Flask, jsonify, render_template, request, send_file
from flask_cors import CORS

BASE_DIR = Path(__file__).resolve().parent
BIBLE_DIR = BASE_DIR / "bible"
STATE_FILE = BASE_DIR / "state.json"
CONSTITUTION_FILE = BASE_DIR / "constitution.json"

BIBLE_FILES = [
    "00_World.md",
    "01_Characters.md",
    "02_AI.md",
    "03_Timeline.md",
    "04_Foreshadow.md",
    "05_Investment.md",
    "06_Gate.md",
    "07_Bosses.md",
    "99_Master_DB.md",
    "Novel_Story_Summary.md",
]

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)


def load_constitution() -> dict:
    with open(CONSTITUTION_FILE, encoding="utf-8") as f:
        return json.load(f)


def load_state() -> dict:
    if STATE_FILE.exists():
        with open(STATE_FILE, encoding="utf-8") as f:
            return json.load(f)
    constitution = load_constitution()
    return {
        "balance": constitution["defaults"]["balance"],
        "selectedCharacter": "CH001",
        "lastExport": None,
    }


def save_state(state: dict) -> None:
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, ensure_ascii=False, indent=2)


def read_bible_file(name: str) -> str:
    path = BIBLE_DIR / name
    if not path.exists():
        raise FileNotFoundError(name)
    return path.read_text(encoding="utf-8")


def write_bible_file(name: str, content: str) -> None:
    if name not in BIBLE_FILES:
        raise ValueError(f"허용되지 않은 파일: {name}")
    path = BIBLE_DIR / name
    path.write_text(content, encoding="utf-8")


def parse_characters(master_md: str) -> list[dict]:
    rows = []
    in_section = False
    for line in master_md.splitlines():
        if "# Character DB" in line:
            in_section = True
            continue
        if in_section and line.startswith("# "):
            break
        if not in_section or not line.strip().startswith("CH"):
            continue
        parts = [p.strip() for p in re.split(r"\s{2,}", line.strip()) if p.strip()]
        if len(parts) >= 7:
            rows.append({
                "id": parts[0],
                "name": parts[1],
                "role": parts[2],
                "firstEp": parts[3],
                "futureRole": parts[4],
                "alive": parts[5],
                "boss": parts[6],
                "notes": " ".join(parts[7:]) if len(parts) > 7 else "",
            })
    return rows


def parse_foreshadow(master_md: str) -> list[dict]:
    rows = []
    in_section = False
    for line in master_md.splitlines():
        if "# Foreshadow DB" in line:
            in_section = True
            continue
        if in_section and line.startswith("# "):
            break
        if not in_section or not line.strip().startswith("F"):
            continue
        parts = [p.strip() for p in re.split(r"\s{2,}", line.strip()) if p.strip()]
        if len(parts) >= 5:
            rows.append({
                "id": parts[0],
                "ep": parts[1],
                "foreshadow": parts[2],
                "payoff": parts[3],
                "status": parts[4],
            })
    return rows


def parse_investment(master_md: str) -> list[dict]:
    rows = []
    in_section = False
    for line in master_md.splitlines():
        if "# Investment DB" in line:
            in_section = True
            continue
        if in_section and line.startswith("# "):
            break
        if not in_section:
            continue
        m = re.match(
            r"^(\S+)\s+(\S+)\s+(.+?)\s+(진행|예정|완료)\s*$",
            line.strip(),
        )
        if m:
            rows.append({
                "phase": m.group(1),
                "capital": m.group(2),
                "goal": m.group(3).strip(),
                "status": m.group(4),
            })
    return rows


def parse_bosses(master_md: str) -> list[dict]:
    rows = []
    in_section = False
    for line in master_md.splitlines():
        if "# Boss Progress" in line:
            in_section = True
            continue
        if in_section and line.startswith("# "):
            break
        if not in_section or not line.strip().startswith("B"):
            continue
        parts = [p.strip() for p in re.split(r"\s{2,}", line.strip()) if p.strip()]
        if len(parts) >= 5:
            rows.append({
                "id": parts[0],
                "name": parts[1],
                "firstEp": parts[2],
                "ally": parts[3],
                "status": parts[4],
            })
    return rows


def parse_episodes(master_md: str) -> list[dict]:
    episodes = []
    in_section = False
    for line in master_md.splitlines():
        if "# Episode Checklist" in line:
            in_section = True
            continue
        if not in_section:
            continue
        m = re.match(r"-\s+\[([ x])\]\s+(EP\d+)", line.strip())
        if m:
            episodes.append({"id": m.group(2), "done": m.group(1) == "x"})
    return episodes


def parse_character_details(characters_md: str) -> dict[str, list[str]]:
    details: dict[str, list[str]] = {}
    current = None
    for line in characters_md.splitlines():
        if line.startswith("## "):
            current = line[3:].strip()
            details[current] = []
        elif current and line.strip().startswith("- "):
            details[current].append(line.strip()[2:])
    return details


RELATIONSHIPS = [
    {"from": "CH001", "to": "CH002", "type": "동반자", "weight": 3},
    {"from": "CH001", "to": "CH003", "type": "친구", "weight": 2},
    {"from": "CH001", "to": "CH004", "type": "첫사랑", "weight": 3},
    {"from": "CH001", "to": "CH005", "type": "지인", "weight": 1},
    {"from": "CH001", "to": "CH006", "type": "가족·투자", "weight": 2},
    {"from": "CH004", "to": "CH005", "type": "친구", "weight": 2},
    {"from": "CH002", "to": "CH001", "type": "전략·투자", "weight": 3},
]

ENEMIES = [
    {"id": "E-GATE", "name": "태양계 게이트", "type": "위협", "source": "06_Gate.md", "status": "예측됨"},
    {"id": "E-ALIEN", "name": "고위 아인종", "type": "침공", "source": "06_Gate.md", "status": "미래"},
    {"id": "E-AI", "name": "AI 폰 (최종보스)", "type": "숨은 적", "source": "02_AI.md", "status": "동반 중"},
]


def build_snapshot() -> dict:
    master_md = read_bible_file("99_Master_DB.md")
    characters_md = read_bible_file("01_Characters.md")
    gate_md = read_bible_file("06_Gate.md")
    foreshadow_md = read_bible_file("04_Foreshadow.md")
    state = load_state()
    constitution = load_constitution()

    characters = parse_characters(master_md)
    char_details = parse_character_details(characters_md)
    for ch in characters:
        ch["traits"] = char_details.get(ch["name"], [])

    bosses = parse_bosses(master_md)
    enemies = ENEMIES + [
        {
            "id": b["id"],
            "name": b["name"] if b["name"] != "미정" else f"{b['id']} 보스",
            "type": "7보스",
            "source": "07_Bosses.md",
            "status": b["status"],
        }
        for b in bosses
    ]

    issues = parse_foreshadow(master_md)
    extra_issues = [
        line.strip()[2:]
        for line in foreshadow_md.splitlines()
        if line.strip().startswith("- ")
    ]

    return {
        "constitution": constitution,
        "state": state,
        "project": {
            "title": "(Working)",
            "timelineStart": constitution["defaults"]["timelineStart"],
            "originalTimeline": constitution["defaults"]["originalTimeline"],
            "storyStatus": constitution["defaults"]["storyStatus"],
        },
        "characters": characters,
        "relationships": RELATIONSHIPS,
        "issues": issues,
        "extraIssues": extra_issues,
        "investment": parse_investment(master_md),
        "balance": {
            "amount": state["balance"],
            "unit": constitution["defaults"]["balanceUnit"],
            "label": "통장 잔고",
        },
        "enemies": enemies,
        "bosses": bosses,
        "episodes": parse_episodes(master_md),
        "gate": [line.strip()[2:] for line in gate_md.splitlines() if line.strip().startswith("- ")],
        "files": BIBLE_FILES,
        "updatedAt": datetime.now(timezone.utc).isoformat(),
    }


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/snapshot")
def api_snapshot():
    return jsonify(build_snapshot())


@app.route("/api/files")
def api_files():
    files = []
    for name in BIBLE_FILES:
        path = BIBLE_DIR / name
        files.append({
            "name": name,
            "size": path.stat().st_size if path.exists() else 0,
            "exists": path.exists(),
        })
    return jsonify(files)


@app.route("/api/files/<path:name>", methods=["GET", "PUT"])
def api_file(name: str):
    if name not in BIBLE_FILES:
        return jsonify({"error": "파일을 찾을 수 없습니다."}), 404
    if request.method == "GET":
        try:
            return jsonify({"name": name, "content": read_bible_file(name)})
        except FileNotFoundError:
            return jsonify({"error": "파일이 없습니다."}), 404
    data = request.get_json(force=True)
    content = data.get("content", "")
    write_bible_file(name, content)
    return jsonify({"ok": True, "name": name})


@app.route("/api/state", methods=["GET", "PATCH"])
def api_state():
    state = load_state()
    if request.method == "PATCH":
        data = request.get_json(force=True)
        if "balance" in data:
            state["balance"] = float(data["balance"])
        if "selectedCharacter" in data:
            state["selectedCharacter"] = data["selectedCharacter"]
        save_state(state)
    return jsonify(state)


@app.route("/api/export/zip")
def api_export_zip():
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        for name in BIBLE_FILES:
            path = BIBLE_DIR / name
            if path.exists():
                zf.write(path, arcname=f"story_bible/{name}")
        zf.writestr(
            "story_bible/constitution.json",
            json.dumps(load_constitution(), ensure_ascii=False, indent=2),
        )
        zf.writestr(
            "story_bible/state.json",
            json.dumps(load_state(), ensure_ascii=False, indent=2),
        )
    buffer.seek(0)
    state = load_state()
    state["lastExport"] = datetime.now(timezone.utc).isoformat()
    save_state(state)
    return send_file(
        buffer,
        mimetype="application/zip",
        as_attachment=True,
        download_name="story_bible.zip",
    )


@app.route("/api/import/zip", methods=["POST"])
def api_import_zip():
    if "file" not in request.files:
        return jsonify({"error": "ZIP 파일이 필요합니다."}), 400
    upload = request.files["file"]
    with zipfile.ZipFile(upload.stream) as zf:
        for name in zf.namelist():
            base = Path(name).name
            if base in BIBLE_FILES:
                write_bible_file(base, zf.read(name).decode("utf-8"))
            elif base == "state.json":
                save_state(json.loads(zf.read(name).decode("utf-8")))
    return jsonify({"ok": True})


@app.route("/api/regenerate/master", methods=["POST"])
def api_regenerate_master():
    """개별 바이블 파일 메타를 반영해 Master DB 헤더·체크리스트를 갱신."""
    master = read_bible_file("99_Master_DB.md")
    state = load_state()
    balance_str = f"{state['balance']:.1f}억"
    master = re.sub(
        r"(Seed\s+)\S+",
        rf"\g<1>{balance_str.replace('억', '')}    ",
        master,
        count=1,
    )
    write_bible_file("99_Master_DB.md", master)
    return jsonify({"ok": True, "balance": state["balance"]})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
