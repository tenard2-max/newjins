"""
웹소설 네비게이터 — Streamlit 기반 웹소설 작업 관리 도구

실행 방법:
    cd novel_navigator
    pip install -r requirements.txt
    streamlit run app.py
"""

import os
import zipfile
from pathlib import Path
from io import BytesIO

import streamlit as st

# ── 상수 ─────────────────────────────────────────────────────────────────────
STORAGE_DIR = Path("storage")
MASTER_DIR = STORAGE_DIR / "master"
STORY_DIR = STORAGE_DIR / "story"      # 구: 업무 파일 디렉터리
BIBLE_DIR = STORAGE_DIR / "story_bible"

for d in (MASTER_DIR, STORY_DIR, BIBLE_DIR):
    d.mkdir(parents=True, exist_ok=True)


# ── 유틸리티 함수 ─────────────────────────────────────────────────────────────
def list_md_files(directory: Path) -> list[str]:
    """지정 디렉터리 내 .md 파일 목록 반환"""
    return sorted(f.name for f in directory.glob("*.md"))


def list_zip_files(directory: Path) -> list[str]:
    """지정 디렉터리 내 .zip 파일 목록 반환"""
    return sorted(f.name for f in directory.glob("*.zip"))


def save_uploaded_file(uploaded_file, dest_dir: Path) -> Path:
    """업로드된 파일을 dest_dir 에 저장하고 저장 경로 반환"""
    dest = dest_dir / uploaded_file.name
    dest.write_bytes(uploaded_file.read())
    return dest


# ── 페이지 설정 ────────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="웹소설 네비게이터",
    page_icon="📖",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── 세션 상태 초기화 ────────────────────────────────────────────────────────────
if "active_master" not in st.session_state:
    st.session_state.active_master = None
if "active_story" not in st.session_state:
    st.session_state.active_story = None        # 구: active_sports → active_story
if "active_bible_zip" not in st.session_state:
    st.session_state.active_bible_zip = None


# ── 사이드바 ──────────────────────────────────────────────────────────────────
with st.sidebar:
    st.title("📖 웹소설 네비게이터")

    # 마스터 파일 저장 및 적용
    if st.button("마스터 파일 저장 및 적용", use_container_width=True):
        st.success("마스터 파일이 적용되었습니다.")

    st.divider()

    # ── 스토리 파일(MD) 업로드 ──────────────────────────────────────────────────
    # 변경 전: "업무 파일(MD) 업로드"
    # 변경 후: "스토리 파일(MD) 업로드"
    st.subheader("스토리 파일(MD) 업로드")
    story_files = st.file_uploader(
        label="스토리 파일 선택",
        type=["md"],
        accept_multiple_files=True,
        key="story_file_uploader",
        label_visibility="collapsed",
    )

    if st.button("파일 저장 및 적용", use_container_width=True, key="save_story"):
        if story_files:
            for f in story_files:
                saved = save_uploaded_file(f, STORY_DIR)
                st.success(f"저장 완료: {saved.name}")
        else:
            st.warning("업로드할 파일을 선택하세요.")

    st.divider()

    # ── 스토리성경 ZIP 업로드 ───────────────────────────────────────────────────
    st.subheader("스토리성경 ZIP 업로드")
    bible_zip = st.file_uploader(
        label="Story Bible ZIP 선택",
        type=["zip"],
        key="bible_zip_uploader",
        label_visibility="collapsed",
    )

    if st.button("ZIP 저장 및 적용", use_container_width=True, key="save_zip"):
        if bible_zip:
            saved = save_uploaded_file(bible_zip, BIBLE_DIR)
            st.success(f"ZIP 저장 완료: {saved.name}")
        else:
            st.warning("업로드할 ZIP 파일을 선택하세요.")

    st.divider()

    # ── 특수 파일 매뉴얼 선택 ──────────────────────────────────────────────────
    st.subheader("특수 파일 매뉴얼 선택")

    master_list = list_md_files(MASTER_DIR)
    active_master = st.selectbox(
        label="활성 마스터 파일",
        options=["(없음)"] + master_list,
        key="select_master",
    )
    st.session_state.active_master = None if active_master == "(없음)" else active_master

    # 변경 전: "활성 스포츠 파일"
    # 변경 후: "활성 스토리 파일"
    story_list = list_md_files(STORY_DIR)
    active_story = st.selectbox(
        label="활성 스토리 파일",
        options=["(없음)"] + story_list,
        key="select_story",
    )
    st.session_state.active_story = None if active_story == "(없음)" else active_story

    bible_list = list_zip_files(BIBLE_DIR)
    active_bible = st.selectbox(
        label="활성 Story Bible ZIP",
        options=["(없음)"] + bible_list,
        key="select_bible",
    )
    st.session_state.active_bible_zip = None if active_bible == "(없음)" else active_bible


# ── 메인 콘텐츠 ───────────────────────────────────────────────────────────────
st.title("📖 웹소설 네비게이터")
st.caption("스토리 파일, 마스터 DB, Story Bible을 통합 관리하는 웹소설 창작 도우미")

col1, col2, col3 = st.columns(3)

with col1:
    st.metric(
        label="활성 마스터 파일",
        value=st.session_state.active_master or "미선택",
    )

with col2:
    st.metric(
        label="활성 스토리 파일",       # 구: "활성 스포츠 파일"
        value=st.session_state.active_story or "미선택",
    )

with col3:
    st.metric(
        label="활성 Story Bible",
        value=st.session_state.active_bible_zip or "미선택",
    )

st.divider()

st.info(
    "사이드바에서 파일을 업로드하고 활성 파일을 선택하면 여기에 내용이 표시됩니다.",
    icon="ℹ️",
)

# 활성 스토리 파일 내용 미리보기
if st.session_state.active_story:
    story_path = STORY_DIR / st.session_state.active_story
    if story_path.exists():
        st.subheader(f"📄 {st.session_state.active_story}")
        st.markdown(story_path.read_text(encoding="utf-8"))
