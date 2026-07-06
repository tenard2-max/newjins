"""스토리 바이블 데이터 저장소.

Story Bible Project Constitution v1.0 제2조에 따라
data/story_data.json 을 단일 진실 원천으로 사용하고,
99_Master_DB.md 와 스토리바이블.zip 은 여기서 파생 생성한다.
"""

from __future__ import annotations

import io
import json
import zipfile
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = BASE_DIR / "data" / "story_data.json"
STORY_BIBLE_DIR = BASE_DIR / "story_bible"
MASTER_DB_PATH = STORY_BIBLE_DIR / "99_Master_DB.md"
ZIP_PATH = BASE_DIR / "data" / "스토리바이블.zip"


# ---------------------------------------------------------------------------
# 기본 입출력
# ---------------------------------------------------------------------------

def load_data() -> dict:
    """story_data.json 전체를 읽어 dict 로 반환한다."""
    with open(DATA_PATH, encoding="utf-8") as f:
        return json.load(f)


def save_data(data: dict) -> None:
    """story_data.json 에 저장한다. (헌법 제9조: 변경은 이 경로로만 수행)"""
    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def list_story_files() -> list[Path]:
    """story_bible 폴더의 md 문서 목록을 정렬해 반환한다."""
    return sorted(STORY_BIBLE_DIR.glob("*.md"))


def read_story_file(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write_story_file(path: Path, content: str) -> None:
    path.write_text(content, encoding="utf-8")


# ---------------------------------------------------------------------------
# 통장 잔고 (헌법 제7조: 잔고 = 거래 내역의 합)
# ---------------------------------------------------------------------------

def calc_balance(data: dict) -> float:
    """거래 내역 합산으로 잔고(억 원)를 계산한다."""
    return round(sum(t["amount_billion"] for t in data.get("transactions", [])), 2)


def format_krw_billion(amount: float) -> str:
    """억 원 단위 금액을 읽기 좋은 문자열로 변환한다. (1만 억 이상은 조 표기)"""
    if abs(amount) >= 10000:
        trillion = amount / 10000
        text = f"{trillion:,.1f}".rstrip("0").rstrip(".")
        return f"{text}조 원"
    text = f"{amount:,.2f}".rstrip("0").rstrip(".")
    return f"{text}억 원"


# ---------------------------------------------------------------------------
# 99_Master_DB.md 자동 생성 (헌법 제2조 2항)
# ---------------------------------------------------------------------------

def _md_table(headers: list[str], rows: list[list[str]]) -> str:
    lines = [
        "| " + " | ".join(headers) + " |",
        "| " + " | ".join("---" for _ in headers) + " |",
    ]
    for row in rows:
        lines.append("| " + " | ".join(str(cell) for cell in row) + " |")
    return "\n".join(lines)


def render_master_db(data: dict) -> str:
    """story_data.json 내용으로 99_Master_DB.md 본문을 생성한다."""
    p = data["project"]
    parts: list[str] = []

    parts.append("# 99_Master_DB")
    parts.append(
        f"> 본 문서는 story_data.json 에서 자동 생성됩니다. 직접 수정 금지 "
        f"(Constitution v{p['constitution_version']} 제2조)\n"
        f"> 생성 시각: {datetime.now().strftime('%Y-%m-%d %H:%M')}"
    )

    parts.append("## Project\n")
    parts.append(
        f"- Title: {p['title']}\n"
        f"- Timeline Start: {p['timeline_start']}\n"
        f"- Original Timeline: {p['original_timeline']}\n"
        f"- Story Status: {p['story_status']}"
    )

    parts.append("## Character DB\n")
    parts.append(_md_table(
        ["ID", "Name", "Role", "First EP", "Future Role", "Alive", "Boss", "Notes"],
        [
            [c["id"], c["name"], c["role"], c["first_ep"], c["future_role"],
             "Y" if c["alive"] else "N", c["boss"], c["notes"]]
            for c in data["characters"]
        ],
    ))

    parts.append("## Relationship DB\n")
    name_of = {c["id"]: c["name"] for c in data["characters"]}
    parts.append(_md_table(
        ["Source", "Target", "Type", "Label"],
        [
            [name_of.get(r["source"], r["source"]), name_of.get(r["target"], r["target"]),
             r["type"], r["label"]]
            for r in data["relationships"]
        ],
    ))

    parts.append("## Foreshadow DB\n")
    parts.append(_md_table(
        ["ID", "EP", "Foreshadow", "Planned Payoff", "Status"],
        [[f["id"], f["ep"], f["content"], f["payoff"], f["status"]]
         for f in data["foreshadows"]],
    ))

    parts.append("## Issue DB\n")
    parts.append(_md_table(
        ["ID", "Issue", "Priority", "Status", "Note"],
        [[i["id"], i["title"], i["priority"], i["status"], i["note"]]
         for i in data["issues"]],
    ))

    parts.append("## Investment DB\n")
    parts.append(_md_table(
        ["Phase", "Capital", "Goal", "Status"],
        [[v["phase"], v["capital"], v["goal"], v["status"]]
         for v in data["investments"]],
    ))

    balance = calc_balance(data)
    parts.append("## Account Ledger\n")
    parts.append(f"현재 통장 잔고: **{format_krw_billion(balance)}**\n")
    parts.append(_md_table(
        ["Date", "EP", "Description", "Amount(억)"],
        [[t["date"], t["ep"], t["desc"], f"{t['amount_billion']:+,.2f}"]
         for t in data["transactions"]],
    ))

    parts.append("## Enemy / Boss Progress\n")
    parts.append(_md_table(
        ["ID", "Name", "First EP", "Ally", "Status", "Threat", "Note"],
        [[e["id"], e["name"], e["first_ep"], e["ally"], e["status"], e["threat"], e["note"]]
         for e in data["enemies"]],
    ))

    parts.append("## Episode Checklist\n")
    parts.append("\n".join(
        f"- [{'x' if ep['done'] else ' '}] {ep['ep']} {ep['title']}"
        for ep in data["episodes"]
    ))

    return "\n\n".join(parts) + "\n"


def update_master_db(data: dict) -> Path:
    """99_Master_DB.md 를 재생성해 저장한다."""
    MASTER_DB_PATH.write_text(render_master_db(data), encoding="utf-8")
    return MASTER_DB_PATH


# ---------------------------------------------------------------------------
# 스토리바이블.zip 발행 (헌법 제3조 3항, 제9조 2항)
# ---------------------------------------------------------------------------

def build_story_bible_zip(data: dict) -> bytes:
    """story_bible 문서 전체 + story_data.json 을 zip 바이트로 만든다.

    마스터 DB를 먼저 재생성해 zip 안의 내용이 항상 최신이 되도록 한다.
    """
    update_master_db(data)
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        for md_file in list_story_files():
            zf.write(md_file, arcname=f"story_bible/{md_file.name}")
        zf.write(DATA_PATH, arcname="data/story_data.json")
    return buffer.getvalue()


def publish_story_bible_zip(data: dict) -> Path:
    """스토리바이블.zip 을 저장소에 발행(저장)한다."""
    ZIP_PATH.write_bytes(build_story_bible_zip(data))
    return ZIP_PATH
