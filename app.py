from __future__ import annotations

import re
import shutil
import zipfile
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional

import streamlit as st


st.set_page_config(
    page_title="웹소설 네비게이터",
    page_icon="📚",
    layout="centered",
)


APP_ROOT = Path(__file__).resolve().parent
DATA_DIR = APP_ROOT / "data"
STORY_BIBLE_DIR = DATA_DIR / "story_bible"
STORY_BIBLE_ZIP = DATA_DIR / "story_bible.zip"
UPLOADS_DIR = Path("/home/ubuntu/.cursor/projects/workspace/uploads")


@dataclass
class AppFiles:
    master: Path = DATA_DIR / "99_Master_DB.md"
    story: Path = DATA_DIR / "Novel_Story_Summary.md"
    characters: Path = DATA_DIR / "01_Characters.md"
    world: Path = DATA_DIR / "00_World.md"
    timeline: Path = DATA_DIR / "03_Timeline.md"
    ai: Path = DATA_DIR / "02_AI.md"
    foreshadow: Path = DATA_DIR / "04_Foreshadow.md"
    investment: Path = DATA_DIR / "05_Investment.md"
    gate: Path = DATA_DIR / "06_Gate.md"
    bosses: Path = DATA_DIR / "07_Bosses.md"


FILES = AppFiles()

BOOTSTRAP_PATTERNS: Dict[Path, str] = {
    FILES.master: "99_Master_DB_*.md",
    FILES.story: "Novel_Story_Summary*.md",
    FILES.characters: "01_Characters_*.md",
    FILES.world: "00_World_*.md",
    FILES.timeline: "03_Timeline_*.md",
    FILES.ai: "02_AI_*.md",
    FILES.foreshadow: "04_Foreshadow_*.md",
    FILES.investment: "05_Investment_*.md",
    FILES.gate: "06_Gate_*.md",
    FILES.bosses: "07_Bosses_*.md",
}


def read_text(path: Path) -> str:
    if not path.exists():
        return ""
    return path.read_text(encoding="utf-8")


def write_uploaded_file(path: Path, uploaded_file) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(uploaded_file.getvalue())


def newest_match(directory: Path, pattern: str) -> Optional[Path]:
    matches = list(directory.glob(pattern))
    if not matches:
        return None
    return sorted(matches, key=lambda p: p.stat().st_mtime, reverse=True)[0]


def bootstrap_local_data() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    for target_path, pattern in BOOTSTRAP_PATTERNS.items():
        if target_path.exists():
            continue
        source_path = newest_match(UPLOADS_DIR, pattern)
        if source_path:
            shutil.copy2(source_path, target_path)

    if not STORY_BIBLE_ZIP.exists():
        zip_source = newest_match(UPLOADS_DIR, "*story*bible*.zip")
        if zip_source:
            shutil.copy2(zip_source, STORY_BIBLE_ZIP)

    if STORY_BIBLE_ZIP.exists() and not STORY_BIBLE_DIR.exists():
        extract_story_bible_zip(STORY_BIBLE_ZIP)


def extract_story_bible_zip(zip_path: Path) -> None:
    STORY_BIBLE_DIR.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(zip_path, "r") as zipped:
        zipped.extractall(STORY_BIBLE_DIR)


def parse_sections_with_bullets(markdown_text: str) -> Dict[str, List[str]]:
    sections: Dict[str, List[str]] = {}
    current_title: Optional[str] = None

    for raw_line in markdown_text.splitlines():
        line = raw_line.strip()
        if line.startswith("## "):
            current_title = line[3:].strip()
            sections[current_title] = []
            continue
        if line.startswith("-") and current_title:
            sections[current_title].append(line.lstrip("- ").strip())

    return sections


def parse_bullets(markdown_text: str) -> List[str]:
    results: List[str] = []
    for raw_line in markdown_text.splitlines():
        line = raw_line.strip()
        if line.startswith("-"):
            results.append(line.lstrip("- ").strip())
    return results


def parse_important_issues(master_text: str, foreshadow_text: str) -> List[str]:
    issues = parse_bullets(foreshadow_text)

    for raw_line in master_text.splitlines():
        line = raw_line.strip()
        if re.match(r"^F\d{3}\s+", line):
            parts = re.split(r"\s{2,}", line)
            if len(parts) >= 4:
                issue_id, ep, foreshadow, payoff = parts[:4]
                issues.append(f"{issue_id} ({ep}) - {foreshadow} → {payoff}")

    # 중복 제거 + 순서 유지
    deduped: List[str] = []
    seen = set()
    for item in issues:
        if item not in seen:
            seen.add(item)
            deduped.append(item)
    return deduped


def parse_investment_table(master_text: str, investment_text: str) -> List[Dict[str, str]]:
    rows: List[Dict[str, str]] = []

    for raw_line in master_text.splitlines():
        line = raw_line.rstrip()
        if re.match(r"^\s*(Seed|P1|P2|P3|Final)\s+", line):
            parts = re.split(r"\s{2,}", line.strip())
            if len(parts) >= 4:
                rows.append(
                    {
                        "단계": parts[0],
                        "자본": parts[1],
                        "목표": parts[2],
                        "상태": parts[3],
                    }
                )

    if rows:
        return rows

    # 마스터 테이블이 없거나 파싱 실패하면 투자 문서에서 최소 데이터 구성
    capital_match = re.search(r"([0-9]+(?:\.[0-9]+)?\s*[억조])", investment_text)
    capital = capital_match.group(1).replace(" ", "") if capital_match else "미확인"
    return [
        {
            "단계": "Seed",
            "자본": capital,
            "목표": "초기 투자 운용",
            "상태": "진행",
        }
    ]


def parse_balance(investment_text: str, master_text: str) -> str:
    target_text = "\n".join([investment_text, master_text])
    match = re.search(r"([0-9]+(?:\.[0-9]+)?\s*[억조])", target_text)
    if not match:
        return "잔고 정보 미확인"
    return f"{match.group(1).replace(' ', '')} (기준: 초기 운용금)"


def parse_enemy_list(ai_text: str, bosses_text: str) -> List[str]:
    enemies: List[str] = []

    for raw_line in bosses_text.splitlines():
        line = raw_line.strip()
        if re.match(r"^\d+\s*~\s*\d+", line):
            enemies.append("1~7 보스 (세부 미정)")
        elif line.startswith("-"):
            enemies.append(line.lstrip("- ").strip())

    if "최종" in ai_text and "적" in ai_text:
        enemies.append("AI 폰 (최종보스 후보)")

    if not enemies:
        enemies = ["1~7 보스 (정보 업데이트 필요)"]

    deduped: List[str] = []
    seen = set()
    for enemy in enemies:
        if enemy not in seen:
            seen.add(enemy)
            deduped.append(enemy)
    return deduped


def parse_episode_timeline(timeline_text: str, story_text: str) -> List[str]:
    source_text = timeline_text if timeline_text.strip() else story_text
    matches = re.findall(r"(EP\d{2})\s*[-/]?\s*([^E\n]+?)(?=\s+EP\d{2}|\n|$)", source_text)
    if matches:
        return [f"{ep} - {title.strip()}" for ep, title in matches]

    fallback = []
    for raw_line in source_text.splitlines():
        line = raw_line.strip()
        if line.startswith("EP"):
            fallback.append(line)
    return fallback


def build_relationship_dot(character_names: List[str]) -> str:
    # 문서 맥락상 핵심 관계는 고정이므로, 존재하는 인물만 연결한다.
    names = set(character_names)

    def has(name: str) -> bool:
        return name in names

    edges = []
    if has("주인공") and has("AI 폰"):
        edges.append('"주인공" -> "AI 폰" [label="동행/전략", color="#3b82f6"];')
        edges.append('"AI 폰" -> "주인공" [label="보조/감시", color="#6366f1"];')
    if has("주인공") and has("민수"):
        edges.append('"주인공" -> "민수" [label="친구", color="#10b981"];')
    if has("주인공") and has("지은"):
        edges.append('"주인공" -> "지은" [label="첫사랑/보호", color="#f97316"];')
    if has("지은") and has("수아"):
        edges.append('"지은" -> "수아" [label="친구", color="#ec4899"];')
    if has("주인공") and has("아버지"):
        edges.append('"아버지" -> "주인공" [label="투자 지원", color="#22c55e"];')
    if has("AI 폰"):
        edges.append('"AI 폰" -> "7보스" [label="미래 변수", style=dashed, color="#ef4444"];')
    if has("주인공"):
        edges.append('"주인공" -> "7보스" [label="동료화 목표", style=dashed, color="#ef4444"];')

    if not edges:
        edges.append('"인물 데이터" -> "업데이트 필요";')

    return "\n".join(
        [
            "digraph G {",
            'rankdir=LR;',
            'graph [bgcolor="transparent"];',
            'node [shape=box, style="rounded,filled", fillcolor="#f8fafc", color="#1f2937", fontname="Pretendard"];',
            'edge [fontname="Pretendard"];',
            *edges,
            "}",
        ]
    )


def file_badge(path: Path) -> str:
    if not path.exists():
        return f"❌ `{path.name}` 없음"
    modified = datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc).strftime(
        "%Y-%m-%d %H:%M:%S"
    )
    return f"✅ `{path.name}` / 수정 시각(UTC): `{modified}`"


def render_sidebar() -> None:
    st.sidebar.title("데이터 관리")
    st.sidebar.caption("스토리/마스터/스토리바이블 파일을 즉시 갱신합니다.")

    story_upload = st.sidebar.file_uploader(
        "스토리 파일 업로드 (.md)",
        type=["md", "txt"],
        key="story_upload",
    )
    if story_upload:
        write_uploaded_file(FILES.story, story_upload)
        st.sidebar.success("스토리 파일이 업데이트되었습니다.")

    master_upload = st.sidebar.file_uploader(
        "마스터 MD 업로드 (.md)",
        type=["md", "txt"],
        key="master_upload",
    )
    if master_upload:
        write_uploaded_file(FILES.master, master_upload)
        st.sidebar.success("마스터 파일이 업데이트되었습니다.")

    zip_upload = st.sidebar.file_uploader(
        "스토리바이블 ZIP 업로드 (.zip)",
        type=["zip"],
        key="zip_upload",
    )
    if zip_upload:
        write_uploaded_file(STORY_BIBLE_ZIP, zip_upload)
        extract_story_bible_zip(STORY_BIBLE_ZIP)
        st.sidebar.success("스토리바이블 ZIP이 반영되었습니다.")

    with st.sidebar.expander("인라인 편집(빠른 수정)"):
        story_content = read_text(FILES.story)
        master_content = read_text(FILES.master)

        edited_story = st.text_area(
            "스토리 요약 직접 수정",
            value=story_content,
            height=180,
        )
        if st.button("스토리 요약 저장", use_container_width=True):
            FILES.story.write_text(edited_story, encoding="utf-8")
            st.success("스토리 요약을 저장했습니다.")

        edited_master = st.text_area(
            "마스터 MD 직접 수정",
            value=master_content,
            height=180,
        )
        if st.button("마스터 MD 저장", use_container_width=True):
            FILES.master.write_text(edited_master, encoding="utf-8")
            st.success("마스터 MD를 저장했습니다.")


def apply_mobile_css() -> None:
    st.markdown(
        """
        <style>
        .block-container {
            padding-top: 1.2rem;
            padding-bottom: 2rem;
            max-width: 760px;
        }
        .metric-card {
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 14px;
            margin-bottom: 12px;
            background: #ffffff;
        }
        @media (max-width: 480px) {
            h1 { font-size: 1.5rem !important; }
            h2 { font-size: 1.2rem !important; }
            .block-container { padding-left: 0.8rem; padding-right: 0.8rem; }
        }
        </style>
        """,
        unsafe_allow_html=True,
    )


def main() -> None:
    bootstrap_local_data()
    apply_mobile_css()
    render_sidebar()

    master_text = read_text(FILES.master)
    story_text = read_text(FILES.story)
    characters_text = read_text(FILES.characters)
    world_text = read_text(FILES.world)
    timeline_text = read_text(FILES.timeline)
    ai_text = read_text(FILES.ai)
    foreshadow_text = read_text(FILES.foreshadow)
    investment_text = read_text(FILES.investment)
    bosses_text = read_text(FILES.bosses)

    character_sections = parse_sections_with_bullets(characters_text)
    timeline_items = parse_episode_timeline(timeline_text, story_text)
    important_issues = parse_important_issues(master_text, foreshadow_text)
    investments = parse_investment_table(master_text, investment_text)
    balance = parse_balance(investment_text, master_text)
    enemy_list = parse_enemy_list(ai_text, bosses_text)

    st.title("📚 웹소설 네비게이터")
    st.caption("Story Bible Project Constitution v1.0 기반 대시보드")

    tab_dashboard, tab_character, tab_relation, tab_issue, tab_source = st.tabs(
        ["대시보드", "인물 선택", "인물 관계도", "중요 이슈/재무", "원본 데이터"]
    )

    with tab_dashboard:
        st.subheader("프로젝트 개요")
        if world_text.strip():
            st.markdown(world_text)
        else:
            st.info("세계관 문서가 없어서 스토리 요약을 대신 표시합니다.")
            st.markdown(story_text[:1200] if story_text else "스토리 요약 없음")

        st.subheader("에피소드 진행")
        if timeline_items:
            for item in timeline_items:
                st.markdown(f"- {item}")
        else:
            st.warning("타임라인 데이터가 없습니다.")

    with tab_character:
        st.subheader("인물 네비게이션")
        names = list(character_sections.keys())
        if not names:
            st.warning("인물 데이터가 없습니다. 01_Characters.md를 업데이트해 주세요.")
        else:
            selected_name = st.selectbox("인물을 선택하세요", options=names)
            st.markdown(f"### {selected_name}")
            details = character_sections.get(selected_name, [])
            if details:
                for detail in details:
                    st.markdown(f"- {detail}")
            else:
                st.caption("해당 인물 상세 정보가 없습니다.")

            st.markdown("#### 관련 인물")
            related_map = {
                "주인공": ["AI 폰", "민수", "지은", "수아", "아버지"],
                "AI 폰": ["주인공", "7보스"],
                "민수": ["주인공"],
                "지은": ["주인공", "수아"],
                "수아": ["지은", "주인공"],
                "아버지": ["주인공"],
            }
            related = related_map.get(selected_name, [])
            if related:
                st.write(", ".join(related))
            else:
                st.caption("관계 정보가 아직 없습니다.")

    with tab_relation:
        st.subheader("인물 관계도")
        relation_dot = build_relationship_dot(list(character_sections.keys()))
        st.graphviz_chart(relation_dot, use_container_width=True)
        st.caption("관계도는 스토리 진행에 맞춰 sidebar에서 파일 업데이트 시 자동 반영됩니다.")

    with tab_issue:
        col_left, col_right = st.columns(2)

        with col_left:
            st.markdown("### 중요 이슈")
            if important_issues:
                for issue in important_issues:
                    st.markdown(f"- {issue}")
            else:
                st.caption("중요 이슈 데이터가 없습니다.")

            st.markdown("### 적 리스트")
            for enemy in enemy_list:
                st.markdown(f"- {enemy}")

        with col_right:
            st.markdown("### 투자 목록")
            if investments:
                st.dataframe(investments, use_container_width=True, hide_index=True)
            else:
                st.caption("투자 데이터가 없습니다.")

            st.markdown("### 통장 잔고")
            st.markdown(
                f"""
                <div class="metric-card">
                    <strong>{balance}</strong><br/>
                    <span style="font-size: 0.9em; color: #6b7280;">
                    ※ 문서에 거래내역이 없으므로 현재는 운용 시작 금액 기준으로 표시합니다.
                    </span>
                </div>
                """,
                unsafe_allow_html=True,
            )

    with tab_source:
        st.subheader("파일 상태")
        st.markdown(file_badge(FILES.story))
        st.markdown(file_badge(FILES.master))
        st.markdown(file_badge(STORY_BIBLE_ZIP))

        if STORY_BIBLE_DIR.exists():
            extracted_files = sorted(
                [
                    str(path.relative_to(STORY_BIBLE_DIR))
                    for path in STORY_BIBLE_DIR.rglob("*")
                    if path.is_file()
                ]
            )
            st.markdown(f"**ZIP 해제 파일 수:** {len(extracted_files)}")
            if extracted_files:
                st.code("\n".join(extracted_files[:120]))
        else:
            st.info("스토리바이블 ZIP이 아직 업로드되지 않았습니다.")

        with st.expander("스토리 요약 원문 미리보기"):
            story_preview = read_text(FILES.story)
            st.text(story_preview[:5000] if story_preview else "스토리 파일 없음")

        with st.expander("마스터 원문 미리보기"):
            master_preview = read_text(FILES.master)
            st.text(master_preview[:5000] if master_preview else "마스터 파일 없음")


if __name__ == "__main__":
    main()
