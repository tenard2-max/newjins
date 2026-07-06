"""웹소설 네비게이터 (Story Bible Navigator).

Story Bible Project Constitution v1.0 을 따르는 설정 관리 앱.
휴대폰 브라우저에서 사용하는 것을 기본 시나리오로 설계했다.

실행: streamlit run app.py
"""

from __future__ import annotations

import pandas as pd
import streamlit as st

from lib import store
from lib.graph import build_relationship_dot

st.set_page_config(
    page_title="웹소설 네비게이터",
    page_icon="📖",
    layout="centered",
    initial_sidebar_state="collapsed",
)

# 휴대폰 화면 최적화: 여백 축소, 탭 가로 스크롤, 지표 카드 축소
st.markdown(
    """
    <style>
      .block-container { padding-top: 2.4rem; padding-bottom: 3rem;
                         padding-left: 0.9rem; padding-right: 0.9rem; }
      div[data-baseweb="tab-list"] { overflow-x: auto; flex-wrap: nowrap; }
      div[data-baseweb="tab-list"] button { min-width: fit-content; }
      div[data-testid="stMetricValue"] { font-size: 1.35rem; }
      div[data-testid="stMetricLabel"] { font-size: 0.8rem; }
    </style>
    """,
    unsafe_allow_html=True,
)


# ---------------------------------------------------------------------------
# 데이터 로드
# ---------------------------------------------------------------------------

if "data" not in st.session_state:
    st.session_state.data = store.load_data()

data: dict = st.session_state.data


def persist_and_refresh() -> None:
    """변경분을 저장하고 파생 문서(마스터 DB)를 갱신한 뒤 화면을 새로 그린다."""
    store.save_data(data)
    store.update_master_db(data)
    st.rerun()


project = data["project"]
st.title("📖 웹소설 네비게이터")
st.caption(
    f"{project['title']} · {project['story_status']} · "
    f"Constitution v{project['constitution_version']}"
)

(
    tab_dashboard,
    tab_characters,
    tab_issues,
    tab_money,
    tab_enemies,
    tab_files,
) = st.tabs(["🏠 대시보드", "👥 인물", "❗ 이슈·떡밥", "💰 투자·잔고", "⚔️ 적", "📂 문서"])


# ---------------------------------------------------------------------------
# 🏠 대시보드
# ---------------------------------------------------------------------------

with tab_dashboard:
    balance = store.calc_balance(data)
    open_foreshadows = [f for f in data["foreshadows"] if f["status"] == "OPEN"]
    active_issues = [i for i in data["issues"] if i["status"] != "완료"]
    done_eps = [e for e in data["episodes"] if e["done"]]

    col1, col2 = st.columns(2)
    col1.metric("통장 잔고", store.format_krw_billion(balance))
    col2.metric("집필 완료", f"{len(done_eps)}화")
    col3, col4 = st.columns(2)
    col3.metric("미회수 떡밥", f"{len(open_foreshadows)}건")
    col4.metric("진행·대기 이슈", f"{len(active_issues)}건")

    st.subheader("세계관 한눈에")
    st.markdown(
        "- **배경**: 2005년 대한민국 (원래 시간 2080년)\n"
        "- **핵심**: AI가 인류 생존을 위해 핵 리셋 후 주인공만 회귀\n"
        "- **시뮬레이션**: 현상 유지 0% / AI 통치 3% / 회귀 **97%**\n"
        "- **진실**: 태양계 게이트로 고위 아인종 침공 예측"
    )

    st.subheader("에피소드 진행")
    for ep in data["episodes"]:
        icon = "✅" if ep["done"] else "⬜"
        st.markdown(f"{icon} **{ep['ep']}** — {ep['title']}")

    st.subheader("우선순위 높은 이슈")
    for issue in data["issues"]:
        if issue["priority"] == "높음" and issue["status"] != "완료":
            st.markdown(f"- 🔴 **{issue['title']}** ({issue['status']})")


# ---------------------------------------------------------------------------
# 👥 인물 (선택 + 상세 + 관계도)
# ---------------------------------------------------------------------------

with tab_characters:
    characters = data["characters"]
    name_of = {c["id"]: c["name"] for c in characters}

    selected_name = st.selectbox(
        "인물 선택",
        [f"{c['name']} · {c['role']}" for c in characters],
        key="character_select",
    )
    selected = characters[
        [f"{c['name']} · {c['role']}" for c in characters].index(selected_name)
    ]

    with st.container(border=True):
        boss_badge = ""
        if selected["boss"] == "Final":
            boss_badge = " · 🔥 최종보스 예정"
        elif selected["boss"] == "예정":
            boss_badge = " · ⚔️ 보스 예정"
        st.markdown(
            f"### {selected['name']} `{selected['id']}`\n"
            f"**{selected['role']}** · 첫 등장 {selected['first_ep']} · "
            f"미래 역할 **{selected['future_role']}** · "
            f"{'생존' if selected['alive'] else '사망'}{boss_badge}"
        )
        for trait in selected.get("traits", []):
            st.markdown(f"- {trait}")
        if selected.get("notes"):
            st.info(selected["notes"])

    related = [
        r for r in data["relationships"]
        if r["source"] == selected["id"] or r["target"] == selected["id"]
    ]
    if related:
        st.subheader(f"{selected['name']}의 관계")
        for r in related:
            other_id = r["target"] if r["source"] == selected["id"] else r["source"]
            direction = "→" if r["source"] == selected["id"] else "←"
            st.markdown(
                f"- {direction} **{name_of[other_id]}** · {r['type']} · {r['label']}"
            )

    st.subheader("인물 관계도")
    focus_only = st.toggle("선택 인물 중심으로 보기", value=False)
    dot = build_relationship_dot(
        characters,
        data["relationships"],
        focus_id=selected["id"] if focus_only else None,
    )
    st.graphviz_chart(dot, width="stretch")
    st.caption("🟨 주인공 · 🟥 보스(예정 포함) · 화살표 색: 가족/우정/애정/조력/위협")

    with st.expander("✏️ 인물 정보 수정 (헌법 제5조)"):
        with st.form(f"edit_character_{selected['id']}"):
            new_role = st.text_input("역할", value=selected["role"])
            new_future = st.text_input("미래 역할", value=selected["future_role"])
            new_alive = st.checkbox("생존", value=selected["alive"])
            new_notes = st.text_area("비고", value=selected["notes"])
            if st.form_submit_button("저장", width="stretch"):
                selected.update(
                    role=new_role, future_role=new_future,
                    alive=new_alive, notes=new_notes,
                )
                persist_and_refresh()

    with st.expander("➕ 새 인물 추가"):
        with st.form("add_character", clear_on_submit=True):
            next_id = f"CH{max(int(c['id'][2:]) for c in characters) + 1:03d}"
            st.caption(f"부여될 ID: {next_id} (ID는 재사용하지 않는다)")
            add_name = st.text_input("이름")
            add_role = st.text_input("역할")
            add_first_ep = st.text_input("첫 등장 EP", value="EP008")
            add_future = st.text_input("미래 역할")
            add_notes = st.text_area("비고")
            if st.form_submit_button("추가", width="stretch"):
                if add_name.strip():
                    characters.append({
                        "id": next_id, "name": add_name.strip(), "role": add_role,
                        "first_ep": add_first_ep, "future_role": add_future,
                        "alive": True, "boss": "N", "canon": "DRAFT",
                        "notes": add_notes, "traits": [],
                    })
                    persist_and_refresh()
                else:
                    st.warning("이름을 입력해 주세요.")


# ---------------------------------------------------------------------------
# ❗ 중요 이슈 · 떡밥
# ---------------------------------------------------------------------------

with tab_issues:
    st.subheader("중요 이슈")
    priority_icon = {"높음": "🔴", "중간": "🟡", "낮음": "🟢"}
    for issue in data["issues"]:
        icon = priority_icon.get(issue["priority"], "⚪")
        with st.container(border=True):
            st.markdown(f"{icon} **{issue['title']}**  `{issue['status']}`")
            st.caption(issue["note"])
            status_options = ["진행", "대기", "완료"]
            new_status = st.radio(
                "상태 변경", status_options, horizontal=True,
                index=status_options.index(issue["status"]),
                key=f"issue_status_{issue['id']}", label_visibility="collapsed",
            )
            if new_status != issue["status"]:
                issue["status"] = new_status
                persist_and_refresh()

    with st.expander("➕ 새 이슈 추가"):
        with st.form("add_issue", clear_on_submit=True):
            issue_title = st.text_input("이슈 제목")
            issue_priority = st.select_slider("우선순위", ["낮음", "중간", "높음"], value="중간")
            issue_note = st.text_area("메모")
            if st.form_submit_button("추가", width="stretch"):
                if issue_title.strip():
                    next_num = max(int(i["id"][1:]) for i in data["issues"]) + 1
                    data["issues"].append({
                        "id": f"I{next_num:03d}", "title": issue_title.strip(),
                        "priority": issue_priority, "status": "대기",
                        "note": issue_note,
                    })
                    persist_and_refresh()
                else:
                    st.warning("제목을 입력해 주세요.")

    st.divider()
    st.subheader("떡밥 추적 (헌법 제6조)")
    for f in data["foreshadows"]:
        status_icon = "🟠 OPEN" if f["status"] == "OPEN" else "✅ CLOSED"
        with st.container(border=True):
            st.markdown(
                f"**{f['content']}** `{f['id']}`\n\n"
                f"{status_icon} · 투척 {f['ep']} · 회수 예정 {f['payoff']}"
            )
            if f["status"] == "OPEN":
                if st.button("회수 처리", key=f"close_{f['id']}"):
                    f["status"] = "CLOSED"
                    persist_and_refresh()


# ---------------------------------------------------------------------------
# 💰 투자 목록 · 통장 잔고
# ---------------------------------------------------------------------------

with tab_money:
    balance = store.calc_balance(data)
    st.metric("현재 통장 잔고", store.format_krw_billion(balance))
    st.caption("잔고는 거래 내역의 합으로 계산됩니다. (헌법 제7조)")

    st.subheader("투자 로드맵")
    invest_df = pd.DataFrame(data["investments"])[["phase", "capital", "goal", "status"]]
    invest_df.columns = ["단계", "목표 자본", "목표", "상태"]
    st.dataframe(invest_df, hide_index=True, width="stretch")

    # 현재 잔고가 로드맵의 어느 단계까지 도달했는지 표시
    reached = [v for v in data["investments"] if balance >= v["capital_billion"]]
    if reached:
        st.success(f"현재 자본으로 **{reached[-1]['phase']}** 단계 요건을 충족했습니다.")

    st.subheader("거래 내역")
    tx_df = pd.DataFrame(data["transactions"])
    tx_df = tx_df.rename(columns={
        "date": "일자", "ep": "EP", "desc": "내용", "amount_billion": "금액(억)",
    })
    st.dataframe(tx_df, hide_index=True, width="stretch")

    with st.expander("➕ 입출금 기록 추가"):
        with st.form("add_transaction", clear_on_submit=True):
            tx_date = st.date_input("일자")
            tx_ep = st.text_input("관련 EP", value="EP008")
            tx_desc = st.text_input("내용")
            tx_amount = st.number_input(
                "금액(억 원, 출금은 음수)", value=0.0, step=0.1, format="%.2f",
            )
            if st.form_submit_button("기록", width="stretch"):
                if tx_desc.strip() and tx_amount != 0:
                    data["transactions"].append({
                        "date": tx_date.isoformat(), "ep": tx_ep,
                        "desc": tx_desc.strip(), "amount_billion": tx_amount,
                    })
                    persist_and_refresh()
                else:
                    st.warning("내용과 0이 아닌 금액을 입력해 주세요.")


# ---------------------------------------------------------------------------
# ⚔️ 적 리스트
# ---------------------------------------------------------------------------

with tab_enemies:
    st.subheader("적 리스트")
    st.caption("7보스는 LOCK 등급 — 공개 전까지 상세 설정 금지 (헌법 제8조)")

    for enemy in data["enemies"]:
        if enemy["status"] == "LOCK":
            icon = "🔒"
        elif enemy["id"] == "FINAL":
            icon = "🔥"
        elif enemy["id"] == "GATE":
            icon = "🌌"
        else:
            icon = "⚔️"
        with st.container(border=True):
            st.markdown(
                f"{icon} **{enemy['name']}** `{enemy['id']}`\n\n"
                f"첫 등장 {enemy['first_ep']} · 동료화 {enemy['ally']} · "
                f"상태 {enemy['status']} · 위협도 {enemy['threat']}"
            )
            st.caption(enemy["note"])

    st.info(
        "대원칙: 7보스는 모두 인간/아인종 혼합이며 **최종적으로 동료가 된다.** "
        "AI 폰은 현재 조력자이지만 예정된 최종보스다."
    )


# ---------------------------------------------------------------------------
# 📂 문서 (스토리 파일 · 마스터 DB · 스토리바이블.zip)
# ---------------------------------------------------------------------------

with tab_files:
    st.subheader("스토리 파일 열람·수정")
    story_files = store.list_story_files()
    file_names = [p.name for p in story_files]
    picked_name = st.selectbox("문서 선택", file_names)
    picked_path = story_files[file_names.index(picked_name)]

    is_master_db = picked_path.name == "99_Master_DB.md"
    content = store.read_story_file(picked_path)

    if is_master_db:
        st.warning("99_Master_DB.md 는 자동 생성 문서라 직접 수정할 수 없습니다. (헌법 제2조)")
        st.markdown(content)
    else:
        edited = st.text_area("내용 편집", value=content, height=320, key=f"edit_{picked_name}")
        if st.button("💾 이 문서 저장", width="stretch"):
            store.write_story_file(picked_path, edited)
            st.success(f"{picked_name} 저장 완료")
        with st.expander("미리보기"):
            st.markdown(edited)

    st.divider()
    st.subheader("마스터 DB · 스토리바이블.zip")
    col_a, col_b = st.columns(2)
    with col_a:
        if st.button("🔄 99_Master_DB.md 재생성", width="stretch"):
            path = store.update_master_db(data)
            st.success(f"재생성 완료: {path.name}")
    with col_b:
        if st.button("📦 스토리바이블.zip 발행", width="stretch"):
            path = store.publish_story_bible_zip(data)
            st.success(f"발행 완료: {path}")

    st.download_button(
        "⬇️ 스토리바이블.zip 다운로드",
        data=store.build_story_bible_zip(data),
        file_name="스토리바이블.zip",
        mime="application/zip",
        width="stretch",
    )
    st.caption(
        "zip 에는 story_bible 문서 전체(최신 마스터 DB 포함)와 "
        "story_data.json 이 담깁니다. (헌법 제9조)"
    )
