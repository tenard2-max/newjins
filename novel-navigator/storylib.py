"""웹소설 네비게이터 데이터 계층.

story_db.json(구조화 데이터)과 story-bible/*.md(원본 문서)를 읽고 쓰며,
마스터 MD 재생성과 스토리바이블 zip 내보내기/가져오기를 담당한다.
"""

from __future__ import annotations

import io
import json
import zipfile
from datetime import datetime, timezone, timedelta
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "data" / "story_db.json"
BIBLE_DIR = BASE_DIR / "story-bible"
MASTER_MD_NAME = "99_Master_DB.md"

KST = timezone(timedelta(hours=9))


# ---------------------------------------------------------------------------
# DB 로드/저장
# ---------------------------------------------------------------------------

def load_db() -> dict:
    with DB_PATH.open(encoding="utf-8") as f:
        return json.load(f)


def save_db(db: dict) -> None:
    DB_PATH.write_text(
        json.dumps(db, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


# ---------------------------------------------------------------------------
# 통장 잔고
# ---------------------------------------------------------------------------

def account_balance(db: dict) -> float:
    """거래 내역 합산으로 현재 통장 잔고(억 원)를 계산한다."""
    return sum(tx["amount"] for tx in db["account"]["transactions"])


# ---------------------------------------------------------------------------
# 스토리 파일 (story-bible/*.md)
# ---------------------------------------------------------------------------

def list_story_files() -> list[Path]:
    return sorted(BIBLE_DIR.glob("*.md"))


def read_story_file(name: str) -> str:
    return (BIBLE_DIR / name).read_text(encoding="utf-8")


def write_story_file(name: str, content: str) -> None:
    # 디렉터리 탈출 방지: 파일명만 사용
    safe_name = Path(name).name
    (BIBLE_DIR / safe_name).write_text(content, encoding="utf-8")


# ---------------------------------------------------------------------------
# 마스터 MD 재생성
# ---------------------------------------------------------------------------

def _md_table(headers: list[str], rows: list[list[str]]) -> str:
    lines = [
        "| " + " | ".join(headers) + " |",
        "| " + " | ".join("---" for _ in headers) + " |",
    ]
    for row in rows:
        lines.append("| " + " | ".join(str(c) for c in row) + " |")
    return "\n".join(lines)


def build_master_md(db: dict) -> str:
    """story_db.json 내용으로 99_Master_DB.md 전문을 생성한다."""
    p = db["project"]
    updated_at = datetime.now(KST).strftime("%Y-%m-%d %H:%M KST")

    char_rows = [
        [c["id"], c["name"], c["role"], c["first_ep"], c["future_role"],
         "Y" if c["alive"] else "N", c["boss"], c["notes"]]
        for c in db["characters"]
    ]
    foreshadow_rows = [
        [f["id"], f["ep"], f["title"], f["payoff"], f["status"]]
        for f in db["foreshadows"]
    ]
    invest_rows = [
        [i["phase"], i["capital_label"], i["goal"], i["status"]]
        for i in db["investments"]
    ]
    boss_rows = [
        [e["id"], e["name"], e["first_ep"], e["ally_planned"], e["status"]]
        for e in db["enemies"]
        if e["id"].startswith("B") or e["id"] == "FINAL"
    ]
    episode_lines = [
        f"-   [{'x' if ep['done'] else ' '}] {ep['ep']}" for ep in db["episodes"]
    ]
    balance = account_balance(db)

    sections = [
        "# 99_Master_DB",
        f"> 자동 생성: 웹소설 네비게이터 · {updated_at} · {p['constitution_version']}",
        "## Project",
        "\n".join([
            f"-   Title: {p['title']}",
            f"-   Timeline Start: {p['timeline_start']}",
            f"-   Original Timeline: {p['original_timeline']}",
            f"-   Story Status: {p['story_status']}",
            f"-   통장 잔고: {balance:,.1f}억 원",
        ]),
        "---",
        "# Character DB",
        _md_table(
            ["ID", "Name", "Role", "First EP", "Future Role", "Alive", "Boss", "Notes"],
            char_rows,
        ),
        "---",
        "# Foreshadow DB",
        _md_table(["ID", "EP", "Foreshadow", "Planned Payoff", "Status"], foreshadow_rows),
        "---",
        "# Investment DB",
        _md_table(["Phase", "Capital", "Goal", "Status"], invest_rows),
        "---",
        "# Boss Progress",
        _md_table(["Boss", "Name", "First EP", "Ally", "Status"], boss_rows),
        "---",
        "# Episode Checklist",
        "\n".join(episode_lines),
    ]
    return "\n\n".join(sections) + "\n"


def regenerate_master_md(db: dict) -> str:
    content = build_master_md(db)
    write_story_file(MASTER_MD_NAME, content)
    return content


# ---------------------------------------------------------------------------
# 스토리바이블 zip 내보내기/가져오기
# ---------------------------------------------------------------------------

def export_bible_zip(db: dict) -> bytes:
    """story-bible의 모든 md와 story_db.json을 zip 바이트로 묶는다."""
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        for md in list_story_files():
            zf.write(md, arcname=f"story-bible/{md.name}")
        zf.writestr(
            "data/story_db.json",
            json.dumps(db, ensure_ascii=False, indent=2),
        )
    return buf.getvalue()


def import_bible_zip(data: bytes) -> list[str]:
    """zip에서 md 문서와 story_db.json을 추출해 갱신한다. 갱신 파일 목록 반환."""
    updated: list[str] = []
    with zipfile.ZipFile(io.BytesIO(data)) as zf:
        for info in zf.infolist():
            if info.is_dir():
                continue
            name = Path(info.filename).name  # 경로 무시, 파일명만 사용
            if name.endswith(".md"):
                content = zf.read(info).decode("utf-8")
                write_story_file(name, content)
                updated.append(f"story-bible/{name}")
            elif name == "story_db.json":
                db = json.loads(zf.read(info).decode("utf-8"))
                save_db(db)
                updated.append("data/story_db.json")
    return updated
