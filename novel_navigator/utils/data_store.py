"""Story Bible 데이터 로드/저장 유틸리티.

- data/story_bible.json 파일을 단일 진실 원본(single source of truth)으로 사용한다.
- 저장 시 원자적 쓰기(atomic write)를 통해 파일 손상을 방지한다.
- Streamlit 세션 상태와 파일 시스템을 함께 동기화한다.
"""

from __future__ import annotations

import json
import os
import shutil
import tempfile
from datetime import datetime
from pathlib import Path
from typing import Any

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
STORY_BIBLE_PATH = DATA_DIR / "story_bible.json"
BIBLE_SOURCE_DIR = DATA_DIR / "bible_source"
UPLOAD_DIR = DATA_DIR / "uploads"
EXPORT_DIR = DATA_DIR / "exports"
BACKUP_DIR = DATA_DIR / "backups"


def ensure_dirs() -> None:
    for d in (DATA_DIR, BIBLE_SOURCE_DIR, UPLOAD_DIR, EXPORT_DIR, BACKUP_DIR):
        d.mkdir(parents=True, exist_ok=True)


def load_bible() -> dict[str, Any]:
    """story_bible.json 을 로드한다. 파일이 없으면 빈 dict 반환."""
    ensure_dirs()
    if not STORY_BIBLE_PATH.exists():
        return {}
    with STORY_BIBLE_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)


def save_bible(data: dict[str, Any]) -> None:
    """원자적으로 story_bible.json 을 저장한다.

    - tempfile에 먼저 쓰고 os.replace로 원자적으로 교체하여
      쓰기 중 앱이 죽어도 파일이 손상되지 않도록 한다.
    - 저장 전 기존 파일을 타임스탬프 백업으로 보관한다.
    """
    ensure_dirs()
    if STORY_BIBLE_PATH.exists():
        backup_name = f"story_bible_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        shutil.copy2(STORY_BIBLE_PATH, BACKUP_DIR / backup_name)

    fd, tmp_path = tempfile.mkstemp(prefix=".story_bible_", suffix=".json", dir=str(DATA_DIR))
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        os.replace(tmp_path, STORY_BIBLE_PATH)
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


def list_bible_sources() -> list[Path]:
    ensure_dirs()
    return sorted(p for p in BIBLE_SOURCE_DIR.iterdir() if p.is_file() and p.suffix.lower() == ".md")


def save_bible_source(filename: str, content: bytes) -> Path:
    ensure_dirs()
    # 파일명 정제: 경로 구분자와 상위 경로 이동 제거
    safe_name = os.path.basename(filename)
    dest = BIBLE_SOURCE_DIR / safe_name
    dest.write_bytes(content)
    return dest


def save_master_db(content: bytes) -> Path:
    """마스터 DB 파일을 특정 파일명으로 저장. 기존 파일이 있으면 백업."""
    ensure_dirs()
    dest = BIBLE_SOURCE_DIR / "99_Master_DB.md"
    if dest.exists():
        stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        shutil.copy2(dest, BACKUP_DIR / f"99_Master_DB_{stamp}.md")
    dest.write_bytes(content)
    return dest


def export_bible_zip() -> Path:
    """스토리 바이블 md들과 최신 story_bible.json을 하나의 zip으로 묶는다."""
    ensure_dirs()
    stamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    stage = EXPORT_DIR / f"story_bible_export_{stamp}"
    stage.mkdir(parents=True, exist_ok=True)

    for md_file in list_bible_sources():
        shutil.copy2(md_file, stage / md_file.name)
    if STORY_BIBLE_PATH.exists():
        shutil.copy2(STORY_BIBLE_PATH, stage / "story_bible.json")

    archive_base = EXPORT_DIR / f"story_bible_{stamp}"
    archive_path_str = shutil.make_archive(str(archive_base), "zip", root_dir=stage)
    shutil.rmtree(stage, ignore_errors=True)
    return Path(archive_path_str)
