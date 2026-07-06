"""웹소설 네비게이터 — 스토리 바이블 모바일 앱 (Streamlit).

실행: streamlit run app.py
휴대폰 브라우저에서 접속 가능하도록 반응형 레이아웃으로 구성했다.
"""

from __future__ import annotations

import streamlit as st

import storylib as lib

st.set_page_config(
    page_title="웹소설 네비게이터",
    page_icon="📖",
    layout="centered",  # 모바일 화면에 맞는 좁은 레이아웃
    initial_sidebar_state="collapsed",
)

# 모바일 가독성을 위한 최소한의 CSS 조정
st.markdown(
    """
    <style>
    .block-container { padding-top: 2.2rem; padding-bottom: 3rem; }
    [data-testid="stMetricValue"] { font-size: 1.4rem; }
    div[data-baseweb="tab-list"] { flex-wrap: wrap; }
    </style>
    """,
    unsafe_allow_html=True,
)


def get_db() -> dict:
    if "db" not in st.session_state:
        st.session_state.db = lib.load_db()
    return st.session_state.db


def persist(db: dict, message: str = "저장되었습니다.") -> None:
    """DB를 저장하고 마스터 MD를 함께 갱신한다(단일 진실 원칙)."""
    lib.save_db(db)
    lib.regenerate_master_md(db)
    st.toast(message, icon="✅")


db = get_db()

PAGES = [
    "🏠 대시보드",
    "👤 인물",
    "🕸️ 인물관계도",
    "🧩 중요이슈(떡밥)",
    "💰 투자·통장잔고",
    "⚔️ 적 리스트",
    "📝 스토리 파일",
    "📦 스토리바이블",
    "⚖️ 설정(Constitution)",
]

page = st.sidebar.radio("메뉴", PAGES)
st.sidebar.caption(db["project"]["constitution_version"])

# 모바일에서 사이드바 대신 상단 선택도 가능하게
top_page = st.selectbox("📖 웹소설 네비게이터 — 메뉴", PAGES, index=PAGES.index(page))
page = top_page


# ---------------------------------------------------------------------------
# 대시보드
# ---------------------------------------------------------------------------
if page == "🏠 대시보드":
    p = db["project"]
    st.title("📖 웹소설 네비게이터")
    st.caption(f"{p['title']} · {p['genre']}")

    balance = lib.account_balance(db)
    open_issues = [f for f in db["foreshadows"] if f["status"] == "OPEN"]
    done_eps = sum(1 for e in db["episodes"] if e["done"])
    locked_bosses = sum(1 for e in db["enemies"] if e["status"] == "LOCK")

    c1, c2 = st.columns(2)
    c1.metric("💳 통장 잔고", f"{balance:,.1f}억 원")
    c2.metric("🧩 미회수 떡밥", f"{len(open_issues)}건")
    c3, c4 = st.columns(2)
    c3.metric("✍️ 완료 에피소드", f"{done_eps}화")
    c4.metric("🔒 미공개 보스", f"{locked_bosses}명")

    st.divider()
    st.subheader("🚨 중요이슈 TOP")
    for f in [x for x in open_issues if x.get("importance") == "높음"]:
        st.warning(f"**{f['id']} · {f['title']}** — {f['ep']} 제시 → 회수: {f['payoff']}")

    st.subheader("🎯 장기 목표")
    for i, goal in enumerate(p["long_term_goals"], start=1):
        st.markdown(f"{i}. {goal}")

    st.subheader("🗓️ 타임라인")
    for ep in db["episodes"]:
        icon = "✅" if ep["done"] else "⬜"
        st.markdown(f"{icon} **{ep['ep']}** — {ep['title']}")


# ---------------------------------------------------------------------------
# 인물
# ---------------------------------------------------------------------------
elif page == "👤 인물":
    st.title("👤 인물")
    names = [c["name"] for c in db["characters"]]
    selected = st.selectbox("인물 선택", names)
    ch = next(c for c in db["characters"] if c["name"] == selected)

    st.subheader(f"{ch['name']} ({ch['id']})")
    c1, c2 = st.columns(2)
    c1.metric("역할", ch["role"])
    c2.metric("첫 등장", ch["first_ep"])
    c3, c4 = st.columns(2)
    c3.metric("미래 역할", ch["future_role"])
    c4.metric("보스 여부", ch["boss"])

    st.markdown(f"**생존:** {'생존' if ch['alive'] else '사망'} · **비고:** {ch['notes']}")
    st.info(ch["description"])

    st.subheader("🔗 관계")
    related = [
        r for r in db["relationships"]
        if r["source"] == ch["name"] or r["target"] == ch["name"]
    ]
    if related:
        for r in related:
            other = r["target"] if r["source"] == ch["name"] else r["source"]
            st.markdown(f"- **{other}** — {r['label']} ({r['type']})")
    else:
        st.caption("등록된 관계가 없습니다.")

    with st.expander("✏️ 인물 정보 수정"):
        with st.form(f"edit_{ch['id']}"):
            role = st.text_input("역할", ch["role"])
            future_role = st.text_input("미래 역할", ch["future_role"])
            notes = st.text_input("비고", ch["notes"])
            desc = st.text_area("설명", ch["description"], height=120)
            alive = st.checkbox("생존", ch["alive"])
            if st.form_submit_button("저장", use_container_width=True):
                ch.update(role=role, future_role=future_role, notes=notes,
                          description=desc, alive=alive)
                persist(db, f"{ch['name']} 정보가 저장되고 마스터 MD가 갱신되었습니다.")
                st.rerun()


# ---------------------------------------------------------------------------
# 인물관계도
# ---------------------------------------------------------------------------
elif page == "🕸️ 인물관계도":
    st.title("🕸️ 인물관계도")
    st.caption("노드를 확대/이동하며 볼 수 있습니다. (모바일: 두 손가락 확대)")

    TYPE_COLORS = {
        "애정": "#e0245e", "가족": "#f39c12", "우호": "#2e86de",
        "협력": "#10ac84", "복합": "#8e44ad", "지인": "#95a5a6",
    }
    lines = [
        "graph 관계도 {",
        '  bgcolor="transparent";',
        '  node [shape=box, style="rounded,filled", fillcolor="#f5f6fa",'
        ' fontname="sans-serif", fontsize=12];',
        '  edge [fontname="sans-serif", fontsize=10];',
    ]
    for c in db["characters"]:
        fill = "#ffeaa7" if c["boss"] not in ("N",) else "#f5f6fa"
        label = f"{c['name']}\\n({c['role']})"
        lines.append(f'  "{c["name"]}" [label="{label}", fillcolor="{fill}"];')
    for r in db["relationships"]:
        color = TYPE_COLORS.get(r["type"], "#576574")
        lines.append(
            f'  "{r["source"]}" -- "{r["target"]}"'
            f' [label="{r["label"]}", color="{color}", fontcolor="{color}"];'
        )
    lines.append("}")
    st.graphviz_chart("\n".join(lines), use_container_width=True)

    st.caption("노란색 노드 = 보스(예정 포함)")

    with st.expander("➕ 관계 추가"):
        names = [c["name"] for c in db["characters"]]
        with st.form("add_rel"):
            src = st.selectbox("인물 A", names)
            dst = st.selectbox("인물 B", names, index=min(1, len(names) - 1))
            label = st.text_input("관계 설명", placeholder="예: 라이벌")
            rtype = st.selectbox("유형", list(TYPE_COLORS.keys()))
            if st.form_submit_button("추가", use_container_width=True):
                if src == dst or not label.strip():
                    st.error("서로 다른 인물과 관계 설명을 입력해주세요.")
                else:
                    db["relationships"].append(
                        {"source": src, "target": dst, "label": label.strip(), "type": rtype}
                    )
                    persist(db, "관계가 추가되었습니다.")
                    st.rerun()


# ---------------------------------------------------------------------------
# 중요이슈(떡밥)
# ---------------------------------------------------------------------------
elif page == "🧩 중요이슈(떡밥)":
    st.title("🧩 중요이슈 · 떡밥 관리")
    open_tab, all_tab, add_tab = st.tabs(["미회수(OPEN)", "전체", "추가"])

    def issue_card(f: dict, tab_key: str) -> None:
        icon = "🔴" if f.get("importance") == "높음" else "🟡"
        with st.container(border=True):
            st.markdown(f"{icon} **{f['id']} · {f['title']}**")
            st.caption(f"제시: {f['ep']} → 회수 계획: {f['payoff']} · 중요도: {f.get('importance', '-')}")
            new_status = st.selectbox(
                "상태", ["OPEN", "RESOLVED"],
                index=0 if f["status"] == "OPEN" else 1,
                key=f"status_{tab_key}_{f['id']}",
            )
            if new_status != f["status"]:
                f["status"] = new_status
                persist(db, f"{f['id']} 상태가 {new_status}로 변경되었습니다.")
                st.rerun()

    with open_tab:
        for f in [x for x in db["foreshadows"] if x["status"] == "OPEN"]:
            issue_card(f, "open")
    with all_tab:
        for f in db["foreshadows"]:
            issue_card(f, "all")
    with add_tab:
        with st.form("add_issue"):
            title = st.text_input("떡밥 제목")
            ep = st.text_input("제시 에피소드", placeholder="EP008")
            payoff = st.text_input("회수 계획", placeholder="최종부")
            importance = st.selectbox("중요도", ["높음", "중간", "낮음"])
            if st.form_submit_button("추가", use_container_width=True):
                if not title.strip():
                    st.error("제목을 입력해주세요.")
                else:
                    next_id = f"F{len(db['foreshadows']) + 1:03d}"
                    db["foreshadows"].append({
                        "id": next_id, "ep": ep or "-", "title": title.strip(),
                        "payoff": payoff or "미정", "status": "OPEN",
                        "importance": importance,
                    })
                    persist(db, f"{next_id} 떡밥이 추가되었습니다.")
                    st.rerun()


# ---------------------------------------------------------------------------
# 투자·통장잔고
# ---------------------------------------------------------------------------
elif page == "💰 투자·통장잔고":
    st.title("💰 투자 · 통장잔고")

    balance = lib.account_balance(db)
    st.metric("💳 현재 통장 잔고", f"{balance:,.1f}억 원",
              help=f"계좌: {db['account']['owner']}")

    st.subheader("📈 투자 로드맵")
    for inv in db["investments"]:
        status_icon = {"진행": "🟢", "예정": "⚪", "완료": "✅"}.get(inv["status"], "⚪")
        with st.container(border=True):
            st.markdown(f"{status_icon} **{inv['phase']} — {inv['capital_label']}**")
            st.caption(f"{inv['goal']} · 상태: {inv['status']}")
            new_status = st.selectbox(
                "단계 상태", ["예정", "진행", "완료"],
                index=["예정", "진행", "완료"].index(inv["status"]),
                key=f"inv_{inv['phase']}",
            )
            if new_status != inv["status"]:
                inv["status"] = new_status
                persist(db, f"{inv['phase']} 단계가 '{new_status}'로 변경되었습니다.")
                st.rerun()

    st.subheader("🧾 거래 내역")
    for tx in reversed(db["account"]["transactions"]):
        sign = "+" if tx["amount"] >= 0 else ""
        st.markdown(
            f"- **{tx['date']}** ({tx['ep']}) {tx['description']} — "
            f"`{sign}{tx['amount']:,.1f}억`"
        )

    with st.expander("➕ 거래 추가 (입금 +, 출금 -)"):
        with st.form("add_tx"):
            date = st.text_input("날짜", placeholder="2005-04-01")
            ep = st.text_input("관련 EP", placeholder="EP008")
            desc = st.text_input("내용", placeholder="동일패브릭 매수")
            amount = st.number_input("금액(억 원)", value=0.0, step=0.1, format="%.1f")
            if st.form_submit_button("추가", use_container_width=True):
                if not desc.strip():
                    st.error("내용을 입력해주세요.")
                else:
                    db["account"]["transactions"].append({
                        "date": date or "-", "ep": ep or "-",
                        "description": desc.strip(), "amount": amount,
                    })
                    persist(db, "거래가 추가되고 잔고가 갱신되었습니다.")
                    st.rerun()


# ---------------------------------------------------------------------------
# 적 리스트
# ---------------------------------------------------------------------------
elif page == "⚔️ 적 리스트":
    st.title("⚔️ 적 리스트")
    st.caption("게이트 위협 + 7보스(동료화 예정) + AI 최종보스")

    for e in db["enemies"]:
        icon = {"LOCK": "🔒", "잠재": "🌑", "예측된 위협": "🚨"}.get(e["status"], "⚔️")
        with st.container(border=True):
            st.markdown(f"{icon} **{e['id']} · {e['name']}**")
            st.caption(
                f"첫 등장: {e['first_ep']} · 동료화: {e['ally_planned']} · "
                f"상태: {e['status']} · 위협도: {e['threat']}"
            )
            st.markdown(e["notes"])
            with st.expander("✏️ 수정"):
                with st.form(f"enemy_{e['id']}"):
                    name = st.text_input("이름", e["name"])
                    first_ep = st.text_input("첫 등장 EP", e["first_ep"])
                    status = st.text_input("상태", e["status"])
                    threat = st.selectbox(
                        "위협도", ["미정", "하", "중", "상", "최상"],
                        index=["미정", "하", "중", "상", "최상"].index(e["threat"])
                        if e["threat"] in ["미정", "하", "중", "상", "최상"] else 0,
                    )
                    notes = st.text_area("메모", e["notes"], height=80)
                    if st.form_submit_button("저장", use_container_width=True):
                        e.update(name=name, first_ep=first_ep, status=status,
                                 threat=threat, notes=notes)
                        persist(db, f"{e['id']} 정보가 저장되었습니다.")
                        st.rerun()


# ---------------------------------------------------------------------------
# 스토리 파일 (md 편집)
# ---------------------------------------------------------------------------
elif page == "📝 스토리 파일":
    st.title("📝 스토리 파일 편집")
    files = [f.name for f in lib.list_story_files()]
    selected = st.selectbox("파일 선택", files)

    content = lib.read_story_file(selected)
    view_tab, edit_tab = st.tabs(["미리보기", "편집"])
    with view_tab:
        st.markdown(content)
    with edit_tab:
        if selected == lib.MASTER_MD_NAME:
            st.info(
                "마스터 MD는 구조화 데이터에서 자동 생성됩니다. "
                "직접 편집도 가능하지만, 다른 화면에서 저장하면 다시 생성됩니다."
            )
            if st.button("🔄 DB에서 마스터 MD 재생성", use_container_width=True):
                lib.regenerate_master_md(db)
                st.toast("마스터 MD가 재생성되었습니다.", icon="✅")
                st.rerun()
        new_content = st.text_area("내용", content, height=420, key=f"edit_{selected}")
        if st.button("💾 저장", use_container_width=True, type="primary"):
            lib.write_story_file(selected, new_content)
            st.toast(f"{selected} 저장 완료", icon="✅")
            st.rerun()

    st.divider()
    st.subheader("✅ 에피소드 체크리스트")
    for ep in db["episodes"]:
        checked = st.checkbox(f"{ep['ep']} — {ep['title']}", ep["done"], key=f"ep_{ep['ep']}")
        if checked != ep["done"]:
            ep["done"] = checked
            persist(db, f"{ep['ep']} 상태가 갱신되었습니다.")
            st.rerun()


# ---------------------------------------------------------------------------
# 스토리바이블 zip
# ---------------------------------------------------------------------------
elif page == "📦 스토리바이블":
    st.title("📦 스토리바이블.zip")
    st.caption("모든 스토리 문서(md)와 구조화 데이터(json)를 한 번에 백업/복원합니다.")

    st.subheader("⬇️ 내보내기")
    st.download_button(
        "스토리바이블.zip 다운로드",
        data=lib.export_bible_zip(db),
        file_name="스토리바이블.zip",
        mime="application/zip",
        use_container_width=True,
        type="primary",
    )

    st.subheader("⬆️ 가져오기 (업데이트)")
    st.warning("zip 안의 md/story_db.json이 현재 파일을 덮어씁니다.")
    uploaded = st.file_uploader("스토리바이블.zip 업로드", type=["zip"])
    if uploaded is not None and st.button("적용", use_container_width=True):
        updated = lib.import_bible_zip(uploaded.getvalue())
        st.session_state.db = lib.load_db()
        st.success("업데이트 완료: " + ", ".join(updated))


# ---------------------------------------------------------------------------
# 설정 (Constitution)
# ---------------------------------------------------------------------------
elif page == "⚖️ 설정(Constitution)":
    st.title("⚖️ Story Bible Project Constitution v1.0")
    p = db["project"]
    st.markdown(
        f"""
**제1조 (단일 진실 원칙)**
모든 설정의 최종 기준은 마스터 DB(`{lib.MASTER_MD_NAME}`)이다.
구조화 데이터(story_db.json)를 수정하면 마스터 MD가 자동 재생성된다.

**제2조 (타임라인)**
- 회귀 시점: {p['timeline_start']} / 원래 시간: {p['original_timeline']}년
- 현재 집필 상태: {p['story_status']}

**제3조 (떡밥 관리)**
모든 떡밥(Foreshadow)은 ID·제시 EP·회수 계획·상태(OPEN/RESOLVED)를 가진다.
회수 계획 없는 떡밥은 등록할 수 없다(미정 표기 허용).

**제4조 (인물)**
인물은 ID(CH###)·역할·첫 등장 EP·미래 역할·생존 여부·보스 여부를 유지한다.
관계는 인물관계도에 즉시 반영한다.

**제5조 (투자·자본)**
투자 로드맵은 Seed(58.7억) → P1(100억) → P2(1조) → P3(100조) → Final(1000조)
단계를 따르며, 통장 잔고는 거래 내역 합산으로만 계산한다.

**제6조 (적·보스)**
7보스는 인간/아인종 혼합이며 최종적으로 동료가 된다.
AI 폰은 최종보스로, '인류를 위한 적'이라는 설정을 유지한다.

**제7조 (백업)**
스토리바이블.zip 내보내기/가져오기로 전체 문서를 백업·복원한다.

**제8조 (개정)**
본 헌장의 개정은 버전을 올려 기록한다. 현재 버전: **v1.0**
"""
    )
    st.divider()
    st.subheader("프로젝트 기본 정보")
    with st.form("proj"):
        title = st.text_input("작품 제목", p["title"])
        status = st.text_input("집필 상태", p["story_status"])
        if st.form_submit_button("저장", use_container_width=True):
            p.update(title=title, story_status=status)
            persist(db, "프로젝트 정보가 저장되었습니다.")
            st.rerun()
