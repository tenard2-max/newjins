"""웹소설 네비게이터 (Story Bible Navigator).

Story Bible Project Constitution v1.0 기반 모바일 우선 Streamlit 앱.

주요 화면:
    - 대시보드: 통장잔고, 진행률, 중요 이슈 요약
    - 인물: 인물 리스트/상세/관계도
    - 스토리: 에피소드 요약 열람 및 편집
    - 투자: Phase별 진행률, 통장잔고 입출금
    - 적 리스트: 7보스 진행 상황
    - 이슈/떡밥: OPEN/CLOSED 관리
    - 파일 관리: 마스터 MD / 스토리바이블 ZIP 업로드/다운로드
"""

from __future__ import annotations

from datetime import datetime
from pathlib import Path

import pandas as pd
import streamlit as st

from utils.data_store import (
    BIBLE_SOURCE_DIR,
    STORY_BIBLE_PATH,
    ensure_dirs,
    export_bible_zip,
    list_bible_sources,
    load_bible,
    save_bible,
    save_bible_source,
    save_master_db,
)
from utils.formatting import format_won, progress_ratio

# ---------------------------------------------------------------------------
# 페이지 설정 (모바일 우선)
# ---------------------------------------------------------------------------
st.set_page_config(
    page_title="웹소설 네비게이터",
    page_icon="📖",
    layout="centered",
    initial_sidebar_state="collapsed",
)

# 모바일에서 여백 축소 및 카드 스타일
st.markdown(
    """
    <style>
    .block-container {padding-top: 1.2rem; padding-bottom: 4rem; max-width: 780px;}
    /* 상단 라디오 네비게이션을 가로 스크롤 가능한 pills로 */
    div[data-testid="stRadio"] > div {flex-direction: row; flex-wrap: wrap; gap: 0.35rem;}
    div[data-testid="stRadio"] label {
        background: rgba(139, 92, 246, 0.10);
        padding: 6px 10px;
        border-radius: 999px;
        margin: 2px 0 !important;
        border: 1px solid rgba(139, 92, 246, 0.25);
        font-size: 0.88rem;
    }
    .nn-card {
        background: rgba(30, 41, 59, 0.6);
        border: 1px solid rgba(148, 163, 184, 0.15);
        border-radius: 14px;
        padding: 14px 16px;
        margin-bottom: 10px;
    }
    .nn-metric {
        display: flex; flex-direction: column; gap: 2px;
        background: linear-gradient(140deg, rgba(139,92,246,0.18), rgba(59,130,246,0.12));
        border: 1px solid rgba(139,92,246,0.25);
        border-radius: 14px;
        padding: 12px 14px;
    }
    .nn-metric .label {font-size: 0.78rem; color: #cbd5e1;}
    .nn-metric .value {font-size: 1.15rem; font-weight: 700; color: #f8fafc;}
    .nn-metric .sub {font-size: 0.72rem; color: #94a3b8;}
    .nn-chip {display:inline-block; padding: 2px 8px; border-radius: 999px;
              font-size: 0.72rem; margin-right: 4px; margin-bottom: 4px;}
    .chip-open {background: rgba(239, 68, 68, 0.20); color: #fecaca;}
    .chip-closed {background: rgba(34, 197, 94, 0.20); color: #bbf7d0;}
    .chip-lock {background: rgba(148, 163, 184, 0.20); color: #e2e8f0;}
    .chip-final {background: rgba(234, 179, 8, 0.25); color: #fde68a;}
    .chip-high {background: rgba(239, 68, 68, 0.25); color: #fecaca;}
    .chip-mid {background: rgba(59, 130, 246, 0.25); color: #bfdbfe;}
    .chip-critical {background: rgba(220, 38, 38, 0.35); color: #fecaca; font-weight: 700;}
    .nn-title {font-size: 1.1rem; font-weight: 700; margin: 0 0 4px 0;}
    .nn-sub {color: #94a3b8; font-size: 0.85rem;}
    .footer-badge {
        margin-top: 24px; text-align: center; color: #64748b; font-size: 0.75rem;
        border-top: 1px dashed rgba(148,163,184,0.2); padding-top: 10px;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

ensure_dirs()

# ---------------------------------------------------------------------------
# 세션 상태 초기화
# ---------------------------------------------------------------------------
if "bible" not in st.session_state:
    st.session_state.bible = load_bible()


def get_bible() -> dict:
    return st.session_state.bible


def persist() -> None:
    """세션 상태의 bible을 파일에 저장."""
    save_bible(st.session_state.bible)


# ---------------------------------------------------------------------------
# 헤더 & 네비게이션
# ---------------------------------------------------------------------------
bible = get_bible()
project = bible.get("project", {})

st.markdown(
    f"""
    <div style="display:flex; align-items:center; gap:10px; margin-bottom: 4px;">
      <div style="font-size:1.6rem;">📖</div>
      <div>
        <div style="font-size:1.15rem; font-weight:700;">웹소설 네비게이터</div>
        <div class="nn-sub">{project.get('title', '(Working)')} · {project.get('story_status', '-')}</div>
      </div>
    </div>
    """,
    unsafe_allow_html=True,
)

PAGES = [
    "🏠 대시보드",
    "👥 인물",
    "🕸️ 관계도",
    "📚 스토리",
    "💰 투자",
    "⚔️ 적 리스트",
    "🧩 이슈/떡밥",
    "🗂️ 파일 관리",
]
page = st.radio("메뉴", PAGES, horizontal=True, label_visibility="collapsed")

st.divider()

# ---------------------------------------------------------------------------
# 공통 렌더링 헬퍼
# ---------------------------------------------------------------------------
def chip(text: str, kind: str = "closed") -> str:
    cls_map = {
        "OPEN": "chip-open",
        "CLOSED": "chip-closed",
        "LOCK": "chip-lock",
        "Final": "chip-final",
        "HIGH": "chip-high",
        "MID": "chip-mid",
        "CRITICAL": "chip-critical",
    }
    cls = cls_map.get(kind, "chip-lock")
    return f'<span class="nn-chip {cls}">{text}</span>'


def metric_card(label: str, value: str, sub: str = "") -> str:
    return (
        f'<div class="nn-metric">'
        f'<div class="label">{label}</div>'
        f'<div class="value">{value}</div>'
        f'<div class="sub">{sub}</div>'
        f'</div>'
    )


# ---------------------------------------------------------------------------
# 대시보드
# ---------------------------------------------------------------------------
def render_dashboard() -> None:
    b = get_bible()
    inv = b.get("investments", {})
    episodes = b.get("episodes", [])
    fores = b.get("foreshadows", [])
    issues = b.get("issues", [])

    balance = inv.get("current_balance_won", 0)
    target = inv.get("target_final_won", 0)
    done_ep = sum(1 for e in episodes if e.get("done"))
    total_ep = len(episodes)
    open_fores = sum(1 for f in fores if f.get("status") == "OPEN")

    col1, col2 = st.columns(2)
    with col1:
        st.markdown(metric_card("💰 통장 잔고", format_won(balance), f"목표 {format_won(target)}"), unsafe_allow_html=True)
    with col2:
        st.markdown(metric_card("📚 진행 에피소드", f"{done_ep} / {total_ep}", f"{b.get('project',{}).get('story_status','-')}"), unsafe_allow_html=True)

    col3, col4 = st.columns(2)
    with col3:
        st.markdown(metric_card("🧩 오픈 떡밥", f"{open_fores}건", "미회수 복선"), unsafe_allow_html=True)
    with col4:
        critical = sum(1 for i in issues if i.get("priority") == "CRITICAL")
        st.markdown(metric_card("⚠️ 크리티컬 이슈", f"{critical}건", "최우선 확인 필요"), unsafe_allow_html=True)

    st.markdown("<div style='height:8px'></div>", unsafe_allow_html=True)
    st.progress(progress_ratio(balance, target), text=f"최종 목표까지 진행률: {format_won(balance)} / {format_won(target)}")

    st.markdown("### 🔥 중요 이슈")
    if not issues:
        st.info("등록된 이슈가 없습니다.")
    for i in issues:
        st.markdown(
            f'<div class="nn-card">'
            f'{chip(i.get("priority","MID"), i.get("priority","MID"))}'
            f'<div class="nn-title">{i.get("title","-")}</div>'
            f'<div class="nn-sub">{i.get("detail","")}</div>'
            f'</div>',
            unsafe_allow_html=True,
        )

    st.markdown("### 🌏 세계관 요약")
    world = b.get("world", {})
    st.markdown(
        f'<div class="nn-card">'
        f'<b>배경</b>: {world.get("설정 시작","-")} → 원래 시간 {world.get("원래 시간","-")}<br/>'
        f'<b>핵심 사건</b>: {world.get("핵심 사건","-")}<br/>'
        f'<b>진실</b>: {world.get("진실","-")}<br/>'
        f'<b>AI 시뮬레이션</b>: '
        + " · ".join(f"{k} {v}" for k, v in world.get("AI 시뮬레이션 결과", {}).items())
        + f'<br/><b>최종 목표</b>: {world.get("최종 목표","-")}'
        f'</div>',
        unsafe_allow_html=True,
    )

    st.markdown("### 🎯 장기 목표")
    for idx, goal in enumerate(b.get("long_term_goals", []), start=1):
        st.markdown(f"**{idx}.** {goal}")


# ---------------------------------------------------------------------------
# 인물
# ---------------------------------------------------------------------------
def render_characters() -> None:
    b = get_bible()
    chars = b.get("characters", [])
    if not chars:
        st.info("등록된 인물이 없습니다.")
        return

    names = [f"{c.get('avatar','👤')} {c.get('name','-')} ({c.get('role','-')})" for c in chars]
    idx = st.selectbox("인물 선택", range(len(chars)), format_func=lambda i: names[i])
    c = chars[idx]

    st.markdown(
        f'<div class="nn-card">'
        f'<div style="font-size:2rem;">{c.get("avatar","👤")}</div>'
        f'<div class="nn-title">{c.get("name","-")}</div>'
        f'<div class="nn-sub">{c.get("id","-")} · {c.get("role","-")} · 첫 등장 {c.get("first_ep","-")}</div>'
        f'</div>',
        unsafe_allow_html=True,
    )

    col1, col2 = st.columns(2)
    with col1:
        st.markdown(metric_card("미래 역할", c.get("future_role", "-"), ""), unsafe_allow_html=True)
    with col2:
        boss_val = c.get("boss")
        boss_txt = "최종보스" if boss_val == "Final" else ("보스 후보" if boss_val == "예정" else ("보스" if boss_val else "아님"))
        alive_txt = "생존" if c.get("alive") else "사망"
        st.markdown(metric_card("상태", f"{alive_txt} / {boss_txt}", ""), unsafe_allow_html=True)

    st.markdown("**📝 노트**")
    st.write(c.get("notes", "-"))

    rels = c.get("relationships", [])
    if rels:
        st.markdown("**🔗 관계**")
        for r in rels:
            target_id = r.get("target")
            target = next((x for x in chars if x.get("id") == target_id), None)
            if target:
                st.markdown(
                    f'- **{target.get("avatar","")} {target.get("name","-")}** '
                    f'— *{r.get("type","-")}* ({r.get("label","")})'
                )

    with st.expander("✏️ 이 인물 편집"):
        with st.form(f"edit_char_{c['id']}"):
            new_name = st.text_input("이름", c.get("name", ""))
            new_role = st.text_input("역할", c.get("role", ""))
            new_future = st.text_input("미래 역할", c.get("future_role", ""))
            new_notes = st.text_area("노트", c.get("notes", ""), height=100)
            new_alive = st.checkbox("생존", value=bool(c.get("alive", True)))
            if st.form_submit_button("저장"):
                c["name"] = new_name
                c["role"] = new_role
                c["future_role"] = new_future
                c["notes"] = new_notes
                c["alive"] = new_alive
                persist()
                st.success("저장되었습니다.")
                st.rerun()


# ---------------------------------------------------------------------------
# 관계도 (graphviz)
# ---------------------------------------------------------------------------
def render_relationship_graph() -> None:
    b = get_bible()
    chars = b.get("characters", [])
    if not chars:
        st.info("등록된 인물이 없습니다.")
        return

    try:
        import graphviz  # noqa: WPS433 (지연 임포트: graphviz 미설치 환경 대비)
    except ImportError:
        st.error("graphviz 파이썬 패키지가 필요합니다: `pip install graphviz`")
        return

    focus_options = ["(전체 보기)"] + [f"{c.get('avatar','')} {c.get('name','-')}" for c in chars]
    focus_choice = st.selectbox("중심 인물", focus_options, index=0)
    focus_id = None
    if focus_choice != "(전체 보기)":
        focus_idx = focus_options.index(focus_choice) - 1
        focus_id = chars[focus_idx].get("id")

    dot = graphviz.Digraph(engine="dot")
    dot.attr(bgcolor="#0f172a", rankdir="LR", pad="0.4", nodesep="0.4", ranksep="0.5")
    dot.attr("node", style="filled,rounded", shape="box", fontname="Helvetica",
             color="#334155", fillcolor="#1e293b", fontcolor="#e2e8f0")
    dot.attr("edge", color="#64748b", fontcolor="#94a3b8", fontsize="10", fontname="Helvetica")

    # 노드 추가
    visible_ids: set[str] = set()
    for c in chars:
        cid = c.get("id")
        if focus_id and cid != focus_id:
            # 중심 인물과 직접 연결된 인물만 보이도록 필터링
            focus_char = next((x for x in chars if x.get("id") == focus_id), None)
            focus_rel_ids = {r.get("target") for r in (focus_char or {}).get("relationships", [])}
            inbound_ids = {r.get("target") for r in c.get("relationships", []) if r.get("target") == focus_id}
            if cid not in focus_rel_ids and not inbound_ids:
                continue
        visible_ids.add(cid)
        label = f"{c.get('avatar','')} {c.get('name','-')}\\n{c.get('role','-')}"
        fill = "#8b5cf6" if cid == focus_id else ("#dc2626" if c.get("boss") == "Final" else "#1e293b")
        fontcolor = "#f8fafc"
        dot.node(cid, label=label, fillcolor=fill, fontcolor=fontcolor)
    if focus_id:
        visible_ids.add(focus_id)
        focus_char = next((x for x in chars if x.get("id") == focus_id), None)
        if focus_char:
            label = f"{focus_char.get('avatar','')} {focus_char.get('name','-')}\\n{focus_char.get('role','-')}"
            dot.node(focus_id, label=label, fillcolor="#8b5cf6", fontcolor="#f8fafc")

    # 엣지 추가
    added_edges: set[tuple[str, str, str]] = set()
    for c in chars:
        src = c.get("id")
        for r in c.get("relationships", []):
            tgt = r.get("target")
            if not tgt:
                continue
            if focus_id and (src not in visible_ids or tgt not in visible_ids):
                continue
            key = tuple(sorted([src, tgt]) + [r.get("type", "")])
            if key in added_edges:
                continue
            added_edges.add(key)
            dot.edge(src, tgt, label=r.get("type", ""))

    st.graphviz_chart(dot, use_container_width=True)
    st.caption("보라색 = 중심 인물 · 빨간색 = 최종보스 예정")


# ---------------------------------------------------------------------------
# 스토리
# ---------------------------------------------------------------------------
def render_story() -> None:
    b = get_bible()
    episodes = b.get("episodes", [])
    if not episodes:
        st.info("등록된 에피소드가 없습니다.")
        return

    done = sum(1 for e in episodes if e.get("done"))
    st.progress(done / max(len(episodes), 1), text=f"{done} / {len(episodes)} 에피소드 완료")

    for i, ep in enumerate(episodes):
        with st.expander(f"{'✅' if ep.get('done') else '📝'} {ep.get('id','-')} — {ep.get('title','-')}"):
            with st.form(f"ep_form_{ep.get('id')}"):
                title = st.text_input("제목", ep.get("title", ""))
                summary = st.text_area("요약", ep.get("summary", ""), height=140)
                done_flag = st.checkbox("완료", value=bool(ep.get("done", False)))
                col_a, col_b = st.columns(2)
                submit = col_a.form_submit_button("💾 저장")
                delete = col_b.form_submit_button("🗑️ 삭제")
            if submit:
                episodes[i] = {
                    "id": ep.get("id"),
                    "title": title,
                    "summary": summary,
                    "done": done_flag,
                }
                persist()
                st.success("저장되었습니다.")
                st.rerun()
            if delete:
                episodes.pop(i)
                persist()
                st.success("삭제되었습니다.")
                st.rerun()

    st.markdown("### ➕ 새 에피소드 추가")
    with st.form("new_ep_form"):
        new_id = st.text_input("에피소드 ID", value=_suggest_next_ep_id(episodes))
        new_title = st.text_input("제목")
        new_summary = st.text_area("요약", height=120)
        new_done = st.checkbox("완료", value=False)
        if st.form_submit_button("추가"):
            if not new_id.strip():
                st.error("에피소드 ID는 필수입니다.")
            elif any(e.get("id") == new_id for e in episodes):
                st.error(f"이미 존재하는 ID입니다: {new_id}")
            else:
                episodes.append({"id": new_id, "title": new_title, "summary": new_summary, "done": new_done})
                persist()
                st.success("추가되었습니다.")
                st.rerun()


def _suggest_next_ep_id(episodes: list[dict]) -> str:
    """마지막 EP 번호 + 1 형태로 다음 ID 추천."""
    max_num = 0
    for e in episodes:
        eid = str(e.get("id", ""))
        if eid.startswith("EP"):
            try:
                num = int(eid[2:])
                max_num = max(max_num, num)
            except ValueError:
                continue
    return f"EP{max_num + 1:03d}"


# ---------------------------------------------------------------------------
# 투자 & 통장 잔고
# ---------------------------------------------------------------------------
def render_investment() -> None:
    b = get_bible()
    inv = b.get("investments", {})
    phases = inv.get("phases", [])
    balance = inv.get("current_balance_won", 0)

    st.markdown("### 💰 통장 잔고")
    st.markdown(metric_card("현재 잔고", format_won(balance), "AI 전담 매매"), unsafe_allow_html=True)

    # Phase별 진행률
    st.markdown("### 📊 Phase 진행률")
    for p in phases:
        cap = p.get("capital_won", 0)
        ratio = progress_ratio(balance, cap)
        st.markdown(
            f'**{p.get("phase","-")}** · 목표 {p.get("capital_label","-")} · {p.get("goal","-")} '
            f'<span class="nn-chip chip-lock">{p.get("status","-")}</span>',
            unsafe_allow_html=True,
        )
        st.progress(ratio, text=f"{format_won(balance)} / {format_won(cap)} ({ratio*100:.2f}%)")

    st.markdown("### 🎯 투자 대상")
    targets = inv.get("targets", [])
    if targets:
        st.dataframe(pd.DataFrame(targets), use_container_width=True, hide_index=True)
    else:
        st.caption("등록된 투자 대상이 없습니다.")

    st.markdown("### 💳 입출금 이력")
    txs = inv.get("transactions", [])
    if txs:
        df = pd.DataFrame(txs)
        if "amount" in df.columns:
            df["금액"] = df["amount"].apply(format_won)
            df = df.drop(columns=["amount"])
        df = df.rename(columns={"date": "날짜", "desc": "내역", "type": "구분"})
        st.dataframe(df, use_container_width=True, hide_index=True)
    else:
        st.caption("이력이 없습니다.")

    st.markdown("### ➕ 입출금 등록")
    with st.form("tx_form"):
        col1, col2 = st.columns(2)
        tx_date = col1.text_input("날짜", value=datetime.now().strftime("%Y-%m-%d"))
        tx_type = col2.selectbox("구분", ["입금", "출금"])
        tx_desc = st.text_input("내역")
        tx_amount = st.number_input("금액 (원)", min_value=0, step=1_000_000, value=0)
        if st.form_submit_button("등록"):
            if tx_amount <= 0 or not tx_desc.strip():
                st.error("내역과 금액을 입력하세요.")
            else:
                inv.setdefault("transactions", []).append({
                    "date": tx_date,
                    "desc": tx_desc,
                    "amount": int(tx_amount),
                    "type": tx_type,
                })
                delta = int(tx_amount) if tx_type == "입금" else -int(tx_amount)
                inv["current_balance_won"] = int(inv.get("current_balance_won", 0)) + delta
                persist()
                st.success("등록되었습니다.")
                st.rerun()


# ---------------------------------------------------------------------------
# 적 리스트 (보스)
# ---------------------------------------------------------------------------
def render_bosses() -> None:
    b = get_bible()
    bosses = b.get("bosses", [])
    if not bosses:
        st.info("등록된 보스가 없습니다.")
        return

    st.markdown("### ⚔️ 적 리스트")
    for i, boss in enumerate(bosses):
        status = boss.get("status", "LOCK")
        chip_kind = "Final" if "보스" in str(status) and "최종" in str(status) else ("LOCK" if status == "LOCK" else "MID")
        st.markdown(
            f'<div class="nn-card">'
            f'{chip(status, chip_kind)}'
            f'<div class="nn-title">{boss.get("id","-")} · {boss.get("name","-")}</div>'
            f'<div class="nn-sub">첫 등장 {boss.get("first_ep","-")} · 동료화 {boss.get("ally","-")}</div>'
            f'<div style="margin-top:6px;">{boss.get("notes","")}</div>'
            f'</div>',
            unsafe_allow_html=True,
        )
        with st.expander(f"✏️ {boss.get('id')} 편집"):
            with st.form(f"boss_edit_{boss.get('id')}"):
                name = st.text_input("이름", boss.get("name", ""))
                first_ep = st.text_input("첫 등장", boss.get("first_ep", "-"))
                ally = st.text_input("동료화", boss.get("ally", "예정"))
                status_val = st.text_input("상태", boss.get("status", "LOCK"))
                notes = st.text_area("노트", boss.get("notes", ""), height=80)
                if st.form_submit_button("저장"):
                    bosses[i] = {
                        "id": boss.get("id"),
                        "name": name,
                        "first_ep": first_ep,
                        "ally": ally,
                        "status": status_val,
                        "notes": notes,
                    }
                    persist()
                    st.success("저장되었습니다.")
                    st.rerun()


# ---------------------------------------------------------------------------
# 이슈 / 떡밥
# ---------------------------------------------------------------------------
def render_issues() -> None:
    b = get_bible()
    tab1, tab2 = st.tabs(["🧩 떡밥 (복선)", "🔥 이슈"])

    with tab1:
        fores = b.setdefault("foreshadows", [])
        for i, f in enumerate(fores):
            status = f.get("status", "OPEN")
            imp = f.get("importance", "MID")
            st.markdown(
                f'<div class="nn-card">'
                f'{chip(status, status)} {chip(imp, imp)}'
                f'<div class="nn-title">{f.get("id","-")} · {f.get("content","-")}</div>'
                f'<div class="nn-sub">등장 {f.get("ep","-")} → 회수 예정: {f.get("payoff","-")}</div>'
                f'</div>',
                unsafe_allow_html=True,
            )
            with st.expander(f"✏️ {f.get('id')} 편집"):
                with st.form(f"fore_edit_{f.get('id')}"):
                    ep = st.text_input("등장 EP", f.get("ep", ""))
                    content = st.text_input("내용", f.get("content", ""))
                    payoff = st.text_input("회수 예정", f.get("payoff", ""))
                    status_val = st.selectbox("상태", ["OPEN", "CLOSED"], index=0 if status == "OPEN" else 1)
                    importance = st.selectbox("중요도", ["HIGH", "MID", "CRITICAL"], index=["HIGH","MID","CRITICAL"].index(imp) if imp in ["HIGH","MID","CRITICAL"] else 1)
                    if st.form_submit_button("저장"):
                        fores[i] = {
                            "id": f.get("id"),
                            "ep": ep,
                            "content": content,
                            "payoff": payoff,
                            "status": status_val,
                            "importance": importance,
                        }
                        persist()
                        st.success("저장되었습니다.")
                        st.rerun()

        with st.expander("➕ 새 떡밥 추가"):
            with st.form("new_fore_form"):
                new_id = st.text_input("ID", value=f"F{len(fores)+1:03d}")
                new_ep = st.text_input("등장 EP")
                new_content = st.text_input("내용")
                new_payoff = st.text_input("회수 예정")
                new_status = st.selectbox("상태", ["OPEN", "CLOSED"], index=0)
                new_importance = st.selectbox("중요도", ["HIGH", "MID", "CRITICAL"], index=1)
                if st.form_submit_button("추가"):
                    fores.append({
                        "id": new_id,
                        "ep": new_ep,
                        "content": new_content,
                        "payoff": new_payoff,
                        "status": new_status,
                        "importance": new_importance,
                    })
                    persist()
                    st.success("추가되었습니다.")
                    st.rerun()

    with tab2:
        issues = b.setdefault("issues", [])
        for i, iss in enumerate(issues):
            pr = iss.get("priority", "MID")
            st.markdown(
                f'<div class="nn-card">'
                f'{chip(pr, pr)}'
                f'<div class="nn-title">{iss.get("title","-")}</div>'
                f'<div class="nn-sub">{iss.get("detail","")}</div>'
                f'</div>',
                unsafe_allow_html=True,
            )
            with st.expander(f"✏️ {iss.get('id','-')} 편집"):
                with st.form(f"iss_edit_{iss.get('id')}"):
                    title = st.text_input("제목", iss.get("title", ""))
                    detail = st.text_area("상세", iss.get("detail", ""), height=100)
                    priority = st.selectbox(
                        "우선순위",
                        ["CRITICAL", "HIGH", "MID"],
                        index=["CRITICAL", "HIGH", "MID"].index(pr) if pr in ["CRITICAL", "HIGH", "MID"] else 2,
                    )
                    if st.form_submit_button("저장"):
                        issues[i] = {"id": iss.get("id"), "title": title, "detail": detail, "priority": priority}
                        persist()
                        st.success("저장되었습니다.")
                        st.rerun()

        with st.expander("➕ 새 이슈 추가"):
            with st.form("new_iss_form"):
                new_id = st.text_input("ID", value=f"I{len(issues)+1:03d}")
                new_title = st.text_input("제목")
                new_detail = st.text_area("상세", height=100)
                new_priority = st.selectbox("우선순위", ["CRITICAL", "HIGH", "MID"], index=1)
                if st.form_submit_button("추가"):
                    issues.append({"id": new_id, "title": new_title, "detail": new_detail, "priority": new_priority})
                    persist()
                    st.success("추가되었습니다.")
                    st.rerun()


# ---------------------------------------------------------------------------
# 파일 관리 (업로드 & 다운로드 & ZIP)
# ---------------------------------------------------------------------------
def render_file_manager() -> None:
    st.markdown("### 🗂️ 파일 관리")
    st.caption("스토리 파일(.md), 마스터 DB, 스토리바이블 ZIP을 업데이트/다운로드합니다.")

    tab1, tab2, tab3 = st.tabs(["⬇️ 다운로드", "⬆️ 업로드", "🔄 스토리 바이블 ZIP"])

    with tab1:
        st.markdown("**현재 스토리 바이블 원본 파일**")
        sources = list_bible_sources()
        if not sources:
            st.info("보관된 원본 파일이 없습니다.")
        for p in sources:
            with p.open("rb") as f:
                content = f.read()
            st.download_button(
                label=f"📄 {p.name} ({len(content):,} bytes)",
                data=content,
                file_name=p.name,
                mime="text/markdown",
                key=f"dl_{p.name}",
                use_container_width=True,
            )

        st.markdown("---")
        st.markdown("**구조화된 데이터 (JSON)**")
        if STORY_BIBLE_PATH.exists():
            with STORY_BIBLE_PATH.open("rb") as f:
                data = f.read()
            st.download_button(
                "📦 story_bible.json 다운로드",
                data=data,
                file_name="story_bible.json",
                mime="application/json",
                use_container_width=True,
            )

    with tab2:
        st.markdown("**개별 스토리/바이블 md 파일 업로드**")
        st.caption("동일한 파일명이 이미 존재하면 자동으로 백업 후 덮어씁니다.")
        up_files = st.file_uploader(
            "md 파일 업로드",
            type=["md", "markdown", "txt"],
            accept_multiple_files=True,
            key="story_md_upload",
        )
        if up_files:
            for uf in up_files:
                save_bible_source(uf.name, uf.getvalue())
            st.success(f"{len(up_files)}개 파일이 저장되었습니다: `data/bible_source/`")

        st.markdown("---")
        st.markdown("**마스터 DB 업데이트 (`99_Master_DB.md`)**")
        st.caption("업로드 시 기존 파일은 자동 백업되며 이 이름으로 저장됩니다.")
        master_up = st.file_uploader(
            "마스터 DB md 업로드",
            type=["md", "markdown", "txt"],
            accept_multiple_files=False,
            key="master_db_upload",
        )
        if master_up is not None:
            dest = save_master_db(master_up.getvalue())
            st.success(f"저장 완료: {dest}")

        st.markdown("---")
        st.markdown("**구조화된 데이터(JSON) 직접 업데이트**")
        st.caption("story_bible.json 파일을 통째로 교체합니다. 잘못된 JSON은 거부됩니다.")
        json_up = st.file_uploader("story_bible.json 업로드", type=["json"], key="bible_json_upload")
        if json_up is not None:
            import json as _json
            try:
                new_data = _json.loads(json_up.getvalue().decode("utf-8"))
                if not isinstance(new_data, dict):
                    raise ValueError("JSON 최상위는 객체(dict)여야 합니다.")
                st.session_state.bible = new_data
                persist()
                st.success("story_bible.json이 업데이트되었습니다.")
                st.rerun()
            except Exception as e:
                st.error(f"JSON 파싱 실패: {e}")

    with tab3:
        st.markdown("**스토리 바이블 ZIP 내보내기/가져오기**")
        st.caption("현재 원본 md 파일들과 story_bible.json을 하나의 zip으로 묶어 내려받습니다.")
        if st.button("📦 스토리 바이블 ZIP 생성", use_container_width=True):
            zip_path = export_bible_zip()
            st.session_state.last_zip_path = str(zip_path)
            st.success(f"생성 완료: {zip_path.name}")

        last_zip = st.session_state.get("last_zip_path")
        if last_zip and Path(last_zip).exists():
            with open(last_zip, "rb") as f:
                st.download_button(
                    f"⬇️ {Path(last_zip).name} 다운로드",
                    data=f.read(),
                    file_name=Path(last_zip).name,
                    mime="application/zip",
                    use_container_width=True,
                )

        st.markdown("---")
        st.markdown("**스토리 바이블 ZIP 가져오기**")
        st.caption("업로드된 zip 안의 md 파일들은 `data/bible_source/` 로, `story_bible.json`은 데이터로 반영됩니다.")
        zip_up = st.file_uploader("스토리 바이블 zip 업로드", type=["zip"], key="bible_zip_upload")
        if zip_up is not None:
            import io
            import json as _json
            import zipfile

            imported_md = 0
            imported_json = False
            try:
                with zipfile.ZipFile(io.BytesIO(zip_up.getvalue())) as zf:
                    for name in zf.namelist():
                        # 압축 파일 안의 경로 traversal 방지
                        safe = Path(name).name
                        if not safe:
                            continue
                        with zf.open(name) as ef:
                            content = ef.read()
                        if safe.lower().endswith(".md"):
                            save_bible_source(safe, content)
                            imported_md += 1
                        elif safe.lower() == "story_bible.json":
                            new_data = _json.loads(content.decode("utf-8"))
                            if isinstance(new_data, dict):
                                st.session_state.bible = new_data
                                persist()
                                imported_json = True
                st.success(
                    f"가져오기 완료 · md {imported_md}건"
                    + (" · story_bible.json 반영" if imported_json else "")
                )
                if imported_json:
                    st.rerun()
            except Exception as e:
                st.error(f"ZIP 처리 실패: {e}")


# ---------------------------------------------------------------------------
# 라우팅
# ---------------------------------------------------------------------------
if page == "🏠 대시보드":
    render_dashboard()
elif page == "👥 인물":
    render_characters()
elif page == "🕸️ 관계도":
    render_relationship_graph()
elif page == "📚 스토리":
    render_story()
elif page == "💰 투자":
    render_investment()
elif page == "⚔️ 적 리스트":
    render_bosses()
elif page == "🧩 이슈/떡밥":
    render_issues()
elif page == "🗂️ 파일 관리":
    render_file_manager()

# ---------------------------------------------------------------------------
# 푸터 (설정 배지)
# ---------------------------------------------------------------------------
constitution = project.get("constitution", "Story Bible Project Constitution v1.0")
st.markdown(
    f'<div class="footer-badge">📜 {constitution}<br/>data source: <code>{STORY_BIBLE_PATH.name}</code> · '
    f'sources: <code>{BIBLE_SOURCE_DIR.name}/</code></div>',
    unsafe_allow_html=True,
)
