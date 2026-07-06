"""
웹소설 네비게이터 - Story Bible Project Constitution v1.0
모바일 최적화 Streamlit 앱
"""

import streamlit as st
import json
import os
import io
import base64
import zipfile
import tempfile
from pathlib import Path
from datetime import datetime

# ─── 페이지 설정 ────────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="웹소설 네비게이터",
    page_icon="📖",
    layout="wide",
    initial_sidebar_state="collapsed",
    menu_items={
        "About": "Story Bible Navigator v1.0 | Story Bible Project Constitution"
    }
)

# ─── 전역 CSS (모바일 최적화) ────────────────────────────────────────────────────
st.markdown("""
<style>
    /* 전체 배경 */
    .stApp {
        background-color: #0d1117;
    }
    
    /* 메인 컨테이너 패딩 줄이기 */
    .main .block-container {
        padding-top: 0.5rem;
        padding-left: 0.75rem;
        padding-right: 0.75rem;
        padding-bottom: 2rem;
        max-width: 100%;
    }
    
    /* 버튼 모바일 친화적 */
    .stButton > button {
        border-radius: 8px;
        font-size: 0.85rem;
        padding: 0.4rem 0.5rem;
        border: none;
        transition: all 0.2s;
    }
    
    /* 네비게이션 버튼 */
    .nav-btn > button {
        background: #1a1a2e !important;
        color: #aaa !important;
        border: 1px solid #2a2a4e !important;
        width: 100%;
        font-size: 0.8rem !important;
    }
    .nav-btn > button:hover, .nav-btn > button:focus {
        background: #e94560 !important;
        color: white !important;
        border-color: #e94560 !important;
    }
    
    /* 활성 네비게이션 버튼 */
    .nav-btn-active > button {
        background: #e94560 !important;
        color: white !important;
        border: 1px solid #e94560 !important;
        width: 100%;
        font-size: 0.8rem !important;
    }
    
    /* 인물 카드 */
    .char-card {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border-radius: 12px;
        padding: 14px;
        margin: 6px 0;
        border: 1px solid #2a2a4e;
    }
    
    /* 메트릭 커스텀 */
    [data-testid="metric-container"] {
        background: #1a1a2e;
        border: 1px solid #2a2a4e;
        border-radius: 10px;
        padding: 10px !important;
    }
    
    /* 탭 스타일 */
    .stTabs [data-baseweb="tab-list"] {
        gap: 4px;
        background: #1a1a2e;
        border-radius: 8px;
        padding: 4px;
    }
    .stTabs [data-baseweb="tab"] {
        border-radius: 6px;
        color: #aaa;
        font-size: 0.85rem;
    }
    .stTabs [aria-selected="true"] {
        background: #e94560 !important;
        color: white !important;
    }
    
    /* 익스팬더 */
    .streamlit-expanderHeader {
        background: #1a1a2e;
        border-radius: 8px;
        font-size: 0.9rem;
    }
    
    /* 입력 필드 */
    .stTextInput input, .stTextArea textarea, .stSelectbox select {
        background: #1a1a2e;
        border: 1px solid #2a2a4e;
        color: #fff;
        border-radius: 8px;
    }
    
    /* 구분선 */
    hr {
        border-color: #2a2a4e;
        margin: 0.5rem 0;
    }
    
    /* 숨기기 */
    #MainMenu { visibility: hidden; }
    footer { visibility: hidden; }
    .stDeployButton { display: none; }
    
    /* 스크롤바 */
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: #0d1117; }
    ::-webkit-scrollbar-thumb { background: #2a2a4e; border-radius: 2px; }
    
    /* 배지 스타일 */
    .badge {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: bold;
    }
    .badge-open { background: #e94560; color: white; }
    .badge-closed { background: #2dc653; color: white; }
    .badge-pending { background: #555; color: #aaa; }
    .badge-progress { background: #0078d4; color: white; }
    
    /* 투자 단계 카드 */
    .phase-card {
        background: #1a1a2e;
        border-radius: 10px;
        padding: 12px;
        margin: 6px 0;
        border-left: 4px solid;
    }
    
    /* 거래 내역 아이템 */
    .tx-item {
        background: #1a1a2e;
        border-radius: 8px;
        padding: 10px 12px;
        margin: 4px 0;
        border-left: 3px solid;
    }
</style>
""", unsafe_allow_html=True)

# ─── 경로 설정 ───────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
UPLOADS_DIR = BASE_DIR / "uploads"
DATA_DIR.mkdir(exist_ok=True)
UPLOADS_DIR.mkdir(exist_ok=True)

# ─── 기본 데이터 정의 ────────────────────────────────────────────────────────────

DEFAULT_CHARACTERS = {
    "characters": [
        {"id": "CH001", "name": "주인공", "role": "회귀자", "first_ep": "EP001",
         "future_role": "인류 구원", "alive": True, "boss": False, "boss_level": "",
         "notes": "100세 이상 회귀", "color": "#e94560", "emoji": "🧑‍🎓",
         "description": "100세가 넘은 노인이었으나 2005년으로 회귀. 기억 대부분 소실. 마지막 1초만 선명."},
        {"id": "CH002", "name": "AI 폰", "role": "AI", "first_ep": "EP001",
         "future_role": "최종보스", "alive": True, "boss": True, "boss_level": "Final",
         "notes": "노인 케어 AI, 40대 여성 성격", "color": "#00b4d8", "emoji": "🤖",
         "description": "2080년 최신 자기학습 AI. 오프라인 동작. 투자 및 전략 담당. 점차 인간성 획득."},
        {"id": "CH003", "name": "민수", "role": "친구", "first_ep": "EP002",
         "future_role": "최강 방패", "alive": True, "boss": True, "boss_level": "예정",
         "notes": "맵부심", "color": "#7b2d8b", "emoji": "🛡️",
         "description": "주인공의 대학 친구. 맵부심이 강함. 미래에는 최강의 방패가 됨."},
        {"id": "CH004", "name": "지은", "role": "첫사랑", "first_ep": "EP003",
         "future_role": "보호 대상", "alive": True, "boss": False, "boss_level": "",
         "notes": "평범한 인간", "color": "#ff6b9d", "emoji": "💗",
         "description": "주인공의 첫사랑. 반드시 지키고 싶은 평범한 인간."},
        {"id": "CH005", "name": "수아", "role": "친구", "first_ep": "EP004",
         "future_role": "핵심 조력자", "alive": True, "boss": False, "boss_level": "",
         "notes": "후반 비중 증가", "color": "#a8dadc", "emoji": "⭐",
         "description": "지은의 친구. 후반부 핵심 조력자로 성장."},
        {"id": "CH006", "name": "아버지", "role": "가족", "first_ep": "EP007",
         "future_role": "투자 지원", "alive": True, "boss": False, "boss_level": "",
         "notes": "중견기업 오너", "color": "#2dc653", "emoji": "👔",
         "description": "중견기업 오너. 58.7억 투자금 운용 권한 부여."},
    ]
}

DEFAULT_RELATIONSHIPS = {
    "relationships": [
        {"from": "CH001", "to": "CH002", "type": "파트너",
         "description": "인류 구원 핵심 파트너", "color": "#e94560", "width": 4},
        {"from": "CH001", "to": "CH003", "type": "친구",
         "description": "대학 친구, 미래 최강 방패", "color": "#7b2d8b", "width": 2},
        {"from": "CH001", "to": "CH004", "type": "첫사랑",
         "description": "반드시 지켜야 할 사람", "color": "#ff6b9d", "width": 3},
        {"from": "CH001", "to": "CH005", "type": "동료",
         "description": "후반 핵심 조력자", "color": "#a8dadc", "width": 2},
        {"from": "CH001", "to": "CH006", "type": "가족",
         "description": "아버지, 초기 자금 지원", "color": "#2dc653", "width": 2},
        {"from": "CH004", "to": "CH005", "type": "친구",
         "description": "지은과 수아는 친구", "color": "#a8dadc", "width": 1},
        {"from": "CH002", "to": "CH006", "type": "투자협력",
         "description": "AI가 아버지 자금 운용", "color": "#00b4d8", "width": 2},
    ]
}

DEFAULT_EPISODES = {
    "episodes": [
        {"id": "EP001", "title": "마지막 1초", "subtitle": "회귀 / AI폰 재기동",
         "status": "완료", "date": "2005-03-02",
         "summary": "인류 멸망 직전. AI의 선택으로 주인공 혼자 2005년으로 회귀. AI폰도 함께 회귀."},
        {"id": "EP002", "title": "대학 친구 재회", "subtitle": "미래 보스의 단서",
         "status": "완료", "date": "2005-03-03",
         "summary": "민수와 재회. 미래 보스의 첫 단서 발견."},
        {"id": "EP003", "title": "지은과 재회", "subtitle": "잃어버린 청춘의 감정",
         "status": "완료", "date": "2005-03-04",
         "summary": "첫사랑 지은과 재회. 반드시 지켜야 한다는 다짐."},
        {"id": "EP004", "title": "AI와 일상 시작", "subtitle": "첫 이상 징후",
         "status": "완료", "date": "2005-03-05",
         "summary": "AI와 일상 개입 시작. 위성 이상 신호 포착 - 게이트 전조."},
        {"id": "EP005", "title": "민수의 맵부심", "subtitle": "AI의 유머와 인간성",
         "status": "완료", "date": "2005-03-06",
         "summary": "민수의 맵부심 에피소드. AI가 유머와 인간성을 보여줌."},
        {"id": "EP006", "title": "투자 계획 제시", "subtitle": "인류 생존 프로젝트 시작",
         "status": "완료", "date": "2005-03-07",
         "summary": "AI가 97% 근거와 투자 계획 제시. 인류 생존 프로젝트 공식 시작."},
        {"id": "EP007", "title": "첫 자본 마련", "subtitle": "아버지에게 투자금 확보",
         "status": "완료", "date": "2005-03-08",
         "summary": "아버지 설득, 58.7억 확보. 시드 투자 시작."},
        {"id": "EP008", "title": "미정", "subtitle": "-",
         "status": "예정", "date": "", "summary": ""},
    ]
}

DEFAULT_INVESTMENT = {
    "phases": [
        {"phase": "Seed", "capital_display": "58.7억", "capital_krw": 5870000000,
         "goal": "초기 투자 / 동일패브릭 AI 매매", "status": "진행", "progress": 100},
        {"phase": "P1", "capital_display": "100억", "capital_krw": 10000000000,
         "goal": "기반 구축", "status": "예정", "progress": 0},
        {"phase": "P2", "capital_display": "1조", "capital_krw": 1000000000000,
         "goal": "기업 확보", "status": "예정", "progress": 0},
        {"phase": "P3", "capital_display": "100조", "capital_krw": 100000000000000,
         "goal": "전략 자산", "status": "예정", "progress": 0},
        {"phase": "Final", "capital_display": "1000조", "capital_krw": 1000000000000000,
         "goal": "인류 생존 프로젝트", "status": "예정", "progress": 0},
    ],
    "account": {
        "initial_krw": 5870000000,
        "current_krw": 5870000000,
        "last_updated": "2005-03-08",
        "history": [
            {"date": "2005-03-08", "amount_krw": 5870000000,
             "description": "아버지로부터 초기 투자금 확보", "type": "입금",
             "balance_after": 5870000000},
        ]
    }
}

DEFAULT_BOSSES = {
    "bosses": [
        {"id": "B1", "name": "미정", "first_ep": "-", "ally_ep": "예정",
         "status": "LOCK", "description": "인간/아인종 혼합. 최종적으로 동료가 됨."},
        {"id": "B2", "name": "미정", "first_ep": "-", "ally_ep": "예정",
         "status": "LOCK", "description": "인간/아인종 혼합. 최종적으로 동료가 됨."},
        {"id": "B3", "name": "미정", "first_ep": "-", "ally_ep": "예정",
         "status": "LOCK", "description": "인간/아인종 혼합. 최종적으로 동료가 됨."},
        {"id": "B4", "name": "미정", "first_ep": "-", "ally_ep": "예정",
         "status": "LOCK", "description": "인간/아인종 혼합. 최종적으로 동료가 됨."},
        {"id": "B5", "name": "미정", "first_ep": "-", "ally_ep": "예정",
         "status": "LOCK", "description": "인간/아인종 혼합. 최종적으로 동료가 됨."},
        {"id": "B6", "name": "미정", "first_ep": "-", "ally_ep": "예정",
         "status": "LOCK", "description": "인간/아인종 혼합. 최종적으로 동료가 됨."},
        {"id": "B7", "name": "민수 (예정)", "first_ep": "EP002", "ally_ep": "미정",
         "status": "잠재적", "description": "미래 최강 방패. 인간/아인종 혼합 보스 후보."},
    ]
}

DEFAULT_FORESHADOW = {
    "items": [
        {"id": "F001", "ep": "EP001", "content": "마지막 1초", "payoff": "최종부",
         "status": "OPEN", "priority": "최고",
         "notes": "인류 멸망 직전 마지막 1초의 공포. 왜 정확히 그 1초인가."},
        {"id": "F002", "ep": "EP001", "content": "AI의 사과", "payoff": "최종부",
         "status": "OPEN", "priority": "최고",
         "notes": "회귀 직전 AI가 주인공에게 한 사과. 무엇에 대한 사과인가."},
        {"id": "F003", "ep": "EP004", "content": "위성 이상 신호", "payoff": "게이트 전조",
         "status": "OPEN", "priority": "높음",
         "notes": "태양계에서 감지된 이상 신호. 고위 아인종 침공 전조."},
        {"id": "F004", "ep": "EP006", "content": "97%의 비밀", "payoff": "최종부",
         "status": "OPEN", "priority": "최고",
         "notes": "AI 시뮬레이션 97% 생존 확률의 진실. 나머지 3%는 무엇인가."},
    ]
}

# ─── 데이터 I/O ──────────────────────────────────────────────────────────────────

def load_data(filename: str, default: dict) -> dict:
    filepath = DATA_DIR / filename
    if filepath.exists():
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    save_data(filename, default)
    return default


def save_data(filename: str, data: dict) -> None:
    filepath = DATA_DIR / filename
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


# ─── 유틸리티 함수 ───────────────────────────────────────────────────────────────

def fmt_krw(amount: int) -> str:
    """원화 금액을 읽기 쉽게 포맷"""
    if amount >= 1_000_000_000_000_000:
        return f"{amount / 1_000_000_000_000_000:.0f}천조"
    elif amount >= 1_000_000_000_000:
        return f"{amount / 1_000_000_000_000:.0f}조"
    elif amount >= 100_000_000:
        return f"{amount / 100_000_000:.1f}억"
    elif amount >= 10_000:
        return f"{amount / 10_000:.0f}만"
    return f"{amount:,}원"


def get_char_by_id(chars: list, cid: str) -> dict | None:
    return next((c for c in chars if c["id"] == cid), None)


def next_foreshadow_id(items: list) -> str:
    if not items:
        return "F001"
    max_num = max(int(f["id"][1:]) for f in items if f["id"][1:].isdigit())
    return f"F{max_num + 1:03d}"


def get_download_link(content: str | bytes, filename: str, mime: str, label: str) -> str:
    if isinstance(content, str):
        content = content.encode("utf-8")
    b64 = base64.b64encode(content).decode()
    return f'<a href="data:{mime};base64,{b64}" download="{filename}" style="color:#e94560">{label}</a>'


# ─── 관계도 렌더링 (pyvis) ───────────────────────────────────────────────────────

def render_graph(characters_data: dict, relationships_data: dict) -> None:
    try:
        from pyvis.network import Network
        import streamlit.components.v1 as components

        net = Network(
            height="420px",
            width="100%",
            bgcolor="#0d1117",
            font_color="#ffffff",
            directed=False,
        )
        net.set_options("""
        {
          "nodes": {
            "font": {"size": 13, "color": "#ffffff"},
            "borderWidth": 2,
            "shadow": {"enabled": true}
          },
          "edges": {
            "font": {"size": 10, "color": "#888888", "align": "middle"},
            "smooth": {"type": "curvedCW", "roundness": 0.25},
            "shadow": {"enabled": true}
          },
          "physics": {
            "enabled": true,
            "stabilization": {"iterations": 120},
            "barnesHut": {
              "gravitationalConstant": -3500,
              "springConstant": 0.04,
              "springLength": 130
            }
          },
          "interaction": {
            "hover": true,
            "tooltipDelay": 150,
            "navigationButtons": false,
            "keyboard": false,
            "zoomView": true,
            "dragView": true
          }
        }
        """)

        for char in characters_data["characters"]:
            color = char.get("color", "#e94560")
            is_mc = char["id"] == "CH001"
            shape = "star" if is_mc else ("diamond" if char.get("boss") else "dot")
            size = 35 if is_mc else (25 if char.get("boss") else 18)
            label = f"{char.get('emoji', '')} {char['name']}"
            tooltip = (
                f"<b>{char['name']}</b><br>"
                f"역할: {char['role']}<br>"
                f"미래: {char['future_role']}<br>"
                f"{char.get('notes', '')}"
            )
            net.add_node(
                char["id"], label=label, color=color,
                size=size, shape=shape, title=tooltip
            )

        rel_colors = {
            "파트너": "#e94560", "친구": "#7b2d8b", "첫사랑": "#ff6b9d",
            "동료": "#a8dadc", "가족": "#2dc653", "투자협력": "#00b4d8"
        }
        for rel in relationships_data["relationships"]:
            ec = rel_colors.get(rel["type"], rel.get("color", "#aaaaaa"))
            net.add_edge(
                rel["from"], rel["to"],
                label=rel["type"],
                color=ec,
                title=rel["description"],
                width=rel.get("width", 2),
            )

        with tempfile.NamedTemporaryFile(delete=False, suffix=".html", mode="w", encoding="utf-8") as f:
            net.save_graph(f.name)
            html = open(f.name, "r", encoding="utf-8").read()

        components.html(html, height=430, scrolling=False)

    except ImportError:
        st.info("pyvis 미설치. 텍스트 관계도를 표시합니다.")
        chars = characters_data["characters"]
        for rel in relationships_data["relationships"]:
            a = get_char_by_id(chars, rel["from"])
            b = get_char_by_id(chars, rel["to"])
            if a and b:
                st.markdown(
                    f"**{a.get('emoji','')} {a['name']}** ↔ "
                    f"**{b.get('emoji','')} {b['name']}**  `{rel['type']}`  "
                    f"— {rel['description']}"
                )


# ─── 마스터 DB 마크다운 생성 ─────────────────────────────────────────────────────

def generate_master_db() -> str:
    chars = load_data("characters.json", DEFAULT_CHARACTERS)
    inv = load_data("investment.json", DEFAULT_INVESTMENT)
    boss = load_data("bosses.json", DEFAULT_BOSSES)
    fsh = load_data("foreshadow.json", DEFAULT_FORESHADOW)
    eps = load_data("episodes.json", DEFAULT_EPISODES)

    now = datetime.now().strftime("%Y-%m-%d")
    completed = [e["id"] for e in eps["episodes"] if e["status"] == "완료"]
    ep_range = f"{completed[0]}~{completed[-1]}" if completed else "-"

    md = f"# 99_Master_DB\n\n"
    md += f"## Project\n\n"
    md += f"- Title: (Working)\n"
    md += f"- Timeline Start: 2005-03-02\n"
    md += f"- Original Timeline: 2080\n"
    md += f"- Story Status: {ep_range}\n"
    md += f"- Last Updated: {now}\n\n---\n\n"

    md += "# Character DB\n\n"
    md += "| ID | Name | Role | First EP | Future Role | Alive | Boss | Notes |\n"
    md += "|---|---|---|---|---|---|---|---|\n"
    for c in chars["characters"]:
        alive = "Y" if c["alive"] else "N"
        boss_val = c.get("boss_level", "N") if c.get("boss") else "N"
        md += f"| {c['id']} | {c['name']} | {c['role']} | {c['first_ep']} | {c['future_role']} | {alive} | {boss_val} | {c.get('notes','')} |\n"

    md += "\n---\n\n# Foreshadow DB\n\n"
    md += "| ID | EP | Foreshadow | Planned Payoff | Status |\n"
    md += "|---|---|---|---|---|\n"
    for f in fsh["items"]:
        md += f"| {f['id']} | {f['ep']} | {f['content']} | {f['payoff']} | {f['status']} |\n"

    md += "\n---\n\n# Investment DB\n\n"
    md += "| Phase | Capital | Goal | Status |\n"
    md += "|---|---|---|---|\n"
    for p in inv["phases"]:
        md += f"| {p['phase']} | {p['capital_display']} | {p['goal']} | {p['status']} |\n"

    md += "\n---\n\n# Boss Progress\n\n"
    md += "| Boss | Name | First EP | Ally EP | Status |\n"
    md += "|---|---|---|---|---|\n"
    for b in boss["bosses"]:
        md += f"| {b['id']} | {b['name']} | {b['first_ep']} | {b['ally_ep']} | {b['status']} |\n"

    md += "\n---\n\n# Episode Checklist\n\n"
    for e in eps["episodes"]:
        chk = "x" if e["status"] == "완료" else " "
        md += f"- [{chk}] {e['id']} - {e['title']}\n"

    return md


def generate_story_bible_zip() -> bytes:
    chars = load_data("characters.json", DEFAULT_CHARACTERS)
    eps = load_data("episodes.json", DEFAULT_EPISODES)
    inv = load_data("investment.json", DEFAULT_INVESTMENT)
    boss = load_data("bosses.json", DEFAULT_BOSSES)
    fsh = load_data("foreshadow.json", DEFAULT_FORESHADOW)

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("99_Master_DB.md", generate_master_db())

        chars_md = "# 등장인물\n\n"
        for c in chars["characters"]:
            chars_md += f"## {c.get('emoji','')} {c['name']}\n\n"
            chars_md += f"- **역할**: {c['role']}\n"
            chars_md += f"- **미래 역할**: {c['future_role']}\n"
            chars_md += f"- **첫 등장**: {c['first_ep']}\n"
            chars_md += f"- **메모**: {c.get('notes','')}\n\n"
            if c.get("description"):
                chars_md += f"{c['description']}\n\n"
        zf.writestr("01_Characters.md", chars_md)

        world_md = """# 세계관

- 배경 시작: 2005년 회귀
- 원래 시간: 2080년
- AI가 인류를 핵으로 리셋.
- 진실: 태양계 게이트 침공을 예측.
- AI 시뮬레이션
  - 현상 유지: 0%
  - AI 통치: 약 3%
  - 회귀: 97%
- 최종 목표: 인류 생존.
"""
        zf.writestr("00_World.md", world_md)

        eps_md = "# 타임라인\n\n"
        for e in eps["episodes"]:
            eps_md += f"## {e['id']} - {e['title']}\n\n"
            eps_md += f"**부제**: {e['subtitle']}  |  **날짜**: {e.get('date','-')}\n\n"
            if e.get("summary"):
                eps_md += f"{e['summary']}\n\n"
        zf.writestr("03_Timeline.md", eps_md)

        inv_md = "# 투자 계획\n\n"
        inv_md += f"초기 운용금: {fmt_krw(inv['account']['initial_krw'])}\n\n"
        for p in inv["phases"]:
            inv_md += f"## {p['phase']} - {p['capital_display']}\n\n"
            inv_md += f"- **목표**: {p['goal']}\n"
            inv_md += f"- **상태**: {p['status']}\n\n"
        zf.writestr("05_Investment.md", inv_md)

        boss_md = "# 7보스\n\n1~7 보스 모두 추후 설정.\n\n공통:\n- 인간/아인종 혼합\n- 최종적으로 동료가 됨.\n\n"
        for b in boss["bosses"]:
            boss_md += f"## {b['id']}\n\n"
            boss_md += f"- **이름**: {b['name']}\n"
            boss_md += f"- **상태**: {b['status']}\n"
            boss_md += f"- **설명**: {b['description']}\n\n"
        zf.writestr("07_Bosses.md", boss_md)

        all_json = {
            "characters": chars, "episodes": eps,
            "investment": inv, "bosses": boss, "foreshadow": fsh
        }
        zf.writestr("data/story_bible_data.json",
                    json.dumps(all_json, ensure_ascii=False, indent=2))

    buf.seek(0)
    return buf.read()


# ═══════════════════════════════════════════════════════════════════════════════
# ─── 페이지 함수들 ───────────────────────────────────────────────────────────────
# ═══════════════════════════════════════════════════════════════════════════════

def page_home() -> None:
    st.markdown("# 📖 웹소설 네비게이터")
    st.caption("Story Bible Project Constitution v1.0  |  배경: 2005년 (원래: 2080년)")

    eps_data = load_data("episodes.json", DEFAULT_EPISODES)
    inv_data = load_data("investment.json", DEFAULT_INVESTMENT)
    fsh_data = load_data("foreshadow.json", DEFAULT_FORESHADOW)
    boss_data = load_data("bosses.json", DEFAULT_BOSSES)

    completed_cnt = sum(1 for e in eps_data["episodes"] if e["status"] == "완료")
    total_cnt = len(eps_data["episodes"])
    open_fsh = sum(1 for f in fsh_data["items"] if f["status"] == "OPEN")
    ally_cnt = sum(1 for b in boss_data["bosses"] if b["status"] == "동료")
    balance = inv_data["account"]["current_krw"]

    c1, c2, c3, c4 = st.columns(4)
    c1.metric("에피소드", f"{completed_cnt}/{total_cnt}", "완료")
    c2.metric("잔고", fmt_krw(balance))
    c3.metric("미해결 복선", f"{open_fsh}개", "OPEN")
    c4.metric("보스 동료", f"{ally_cnt}/7")

    st.divider()

    # 세계관 요약
    with st.expander("🌍 세계관 핵심", expanded=False):
        st.markdown("""
**배경** : 2005년 대한민국 (원래 시간선: 2080년)

**장르** : 회귀 / 캠퍼스 / 투자 / SF / 게이트 / 성장

| 시뮬레이션 | 생존률 |
|---|---|
| 현상 유지 | **0%** |
| AI 통치 | **약 3%** |
| 회귀 | **97%** ← AI의 선택 |

AI는 태양계에 게이트가 열려 고위 아인종이 침공할 미래를 예측. 인류를 살릴 가능성이 가장 높은 선택으로 주인공의 회귀를 실행.
        """)

    # 최근 에피소드
    st.subheader("📺 에피소드 현황")
    done_eps = [e for e in eps_data["episodes"] if e["status"] == "완료"]
    for ep in done_eps[-3:][::-1]:
        st.markdown(
            f"""<div style="background:#1a1a2e;border-radius:8px;padding:10px 14px;margin:4px 0;
            border-left:3px solid #e94560;">
            <b style="color:#e94560">{ep['id']}</b>
            <span style="color:#fff;margin-left:8px">{ep['title']}</span>
            <span style="color:#888;margin-left:6px;font-size:0.85rem">— {ep['subtitle']}</span>
            {'<p style="color:#bbb;font-size:0.85rem;margin:4px 0 0 0">' + ep['summary'][:90] + ('...' if len(ep['summary'])>90 else '') + '</p>' if ep.get('summary') else ''}
            </div>""",
            unsafe_allow_html=True
        )

    st.divider()

    # 미해결 복선
    st.subheader("🔮 미해결 복선")
    open_items = [f for f in fsh_data["items"] if f["status"] == "OPEN"]
    if open_items:
        for f in open_items:
            priority_color = "#e94560" if f.get("priority") == "최고" else "#ffaa00"
            st.markdown(
                f"""<div style="background:#1a1a2e;border-radius:8px;padding:8px 12px;margin:3px 0;
                border-left:3px solid {priority_color};">
                <b style="color:{priority_color}">[{f['ep']}]</b>
                <span style="color:#fff;margin-left:6px">{f['content']}</span>
                <span style="color:#888;margin-left:6px;font-size:0.8rem">→ {f['payoff']}</span>
                </div>""",
                unsafe_allow_html=True
            )
    else:
        st.success("모든 복선이 해결되었습니다!")

    st.divider()

    # 장기 목표
    st.subheader("🎯 장기 목표")
    goals = [
        ("3년 안에 게이트 대비 시작", False),
        ("7명의 미래 보스를 모두 동료로", False),
        ("전략 자산 1000조 규모 구축", False),
        ("AI가 왜 핵을 발사했는지 진실", False),
        ("AI와 함께 97%의 미래 완성", False),
    ]
    for i, (g, done) in enumerate(goals, 1):
        icon = "✅" if done else "⬜"
        st.markdown(f"{icon} **{i}.** {g}")


# ───────────────────────────────────────────────────────────────────────────────

def page_characters() -> None:
    st.markdown("# 👥 인물")

    chars_data = load_data("characters.json", DEFAULT_CHARACTERS)
    rels_data = load_data("relationships.json", DEFAULT_RELATIONSHIPS)

    tab_list, tab_graph, tab_edit = st.tabs(["인물 목록", "관계도", "추가/편집"])

    # ── 인물 목록 ──────────────────────────────────────────
    with tab_list:
        char_names = ["전체 보기"] + [c["name"] for c in chars_data["characters"]]
        sel = st.selectbox("인물 선택", char_names, key="char_sel")

        display = (
            chars_data["characters"]
            if sel == "전체 보기"
            else [c for c in chars_data["characters"] if c["name"] == sel]
        )

        for c in display:
            alive_dot = "🟢" if c["alive"] else "🔴"
            boss_tag = (
                f' <span style="background:#e94560;color:white;padding:1px 6px;'
                f'border-radius:10px;font-size:0.75rem">BOSS {c.get("boss_level","")}</span>'
                if c.get("boss") else ""
            )
            st.markdown(
                f"""<div style="background:linear-gradient(135deg,#1a1a2e,#16213e);
                border-left:4px solid {c.get('color','#e94560')};
                border-radius:10px;padding:14px;margin:6px 0;">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                  <span style="font-size:1.5rem">{c.get('emoji','👤')}</span>
                  <span style="color:{c.get('color','#e94560')};font-size:1.1rem;font-weight:bold">{alive_dot} {c['name']}</span>
                  {boss_tag}
                </div>
                <p style="color:#aaa;margin:3px 0"><b>역할:</b> {c['role']}
                  <span style="color:#888"> → {c['future_role']}</span></p>
                <p style="color:#aaa;margin:3px 0"><b>첫 등장:</b> {c['first_ep']}</p>
                <p style="color:#ccc;margin:5px 0;font-size:0.9rem">{c.get('description','')}</p>
                <p style="color:#888;font-size:0.8rem">📝 {c.get('notes','')}</p>
                </div>""",
                unsafe_allow_html=True,
            )

    # ── 관계도 ─────────────────────────────────────────────
    with tab_graph:
        st.caption("노드를 드래그하거나 핀치-줌으로 확대할 수 있습니다.")
        render_graph(chars_data, rels_data)

        # 범례
        st.markdown("**범례**")
        legend_cols = st.columns(4)
        legend = [("⭐ 주인공", "#e94560"), ("🤖 AI/보스", "#00b4d8"),
                  ("🛡️ 보스예정", "#7b2d8b"), ("💗 보호대상", "#ff6b9d")]
        for col, (label, color) in zip(legend_cols, legend):
            col.markdown(
                f'<span style="color:{color};font-size:0.85rem">{label}</span>',
                unsafe_allow_html=True
            )

    # ── 추가/편집 ──────────────────────────────────────────
    with tab_edit:
        edit_mode = st.radio("모드", ["기존 인물 편집", "새 인물 추가"], horizontal=True)

        if edit_mode == "기존 인물 편집":
            target_name = st.selectbox("편집할 인물", [c["name"] for c in chars_data["characters"]])
            char = next(c for c in chars_data["characters"] if c["name"] == target_name)

            with st.form("edit_char_form"):
                col1, col2 = st.columns(2)
                with col1:
                    new_name = st.text_input("이름", value=char["name"])
                    new_role = st.text_input("현재 역할", value=char["role"])
                    new_future = st.text_input("미래 역할", value=char["future_role"])
                with col2:
                    new_ep = st.text_input("첫 등장", value=char["first_ep"])
                    new_alive = st.checkbox("생존", value=char["alive"])
                    new_boss = st.checkbox("보스 여부", value=char.get("boss", False))

                new_notes = st.text_input("메모", value=char.get("notes", ""))
                new_desc = st.text_area("설명", value=char.get("description", ""), height=100)
                new_emoji = st.text_input("이모지", value=char.get("emoji", "👤"))

                if st.form_submit_button("💾 저장", use_container_width=True):
                    for c in chars_data["characters"]:
                        if c["name"] == target_name:
                            c.update({
                                "name": new_name, "role": new_role,
                                "future_role": new_future, "first_ep": new_ep,
                                "alive": new_alive, "boss": new_boss,
                                "notes": new_notes, "description": new_desc,
                                "emoji": new_emoji,
                            })
                    save_data("characters.json", chars_data)
                    st.success("저장되었습니다!")
                    st.rerun()

        else:  # 새 인물 추가
            with st.form("add_char_form"):
                existing_ids = [c["id"] for c in chars_data["characters"]]
                max_num = max(int(cid[2:]) for cid in existing_ids if cid[2:].isdigit())
                suggested_id = f"CH{max_num + 1:03d}"

                col1, col2 = st.columns(2)
                with col1:
                    new_id = st.text_input("ID", value=suggested_id)
                    new_name = st.text_input("이름")
                    new_role = st.text_input("역할")
                with col2:
                    new_future = st.text_input("미래 역할")
                    new_ep = st.text_input("첫 등장 EP")
                    new_emoji = st.text_input("이모지", value="👤")

                new_notes = st.text_input("메모")
                new_desc = st.text_area("설명", height=80)
                new_alive = st.checkbox("생존", value=True)
                new_boss = st.checkbox("보스 여부", value=False)

                if st.form_submit_button("➕ 추가", use_container_width=True):
                    if new_id and new_name:
                        if any(c["id"] == new_id for c in chars_data["characters"]):
                            st.error(f"ID '{new_id}'가 이미 존재합니다.")
                        else:
                            chars_data["characters"].append({
                                "id": new_id, "name": new_name, "role": new_role,
                                "first_ep": new_ep, "future_role": new_future,
                                "alive": new_alive, "boss": new_boss, "boss_level": "",
                                "notes": new_notes, "description": new_desc,
                                "color": "#e94560", "emoji": new_emoji,
                            })
                            save_data("characters.json", chars_data)
                            st.success(f"'{new_name}' 추가 완료!")
                            st.rerun()
                    else:
                        st.error("ID와 이름은 필수입니다.")


# ───────────────────────────────────────────────────────────────────────────────

def page_story() -> None:
    st.markdown("# 📚 스토리")

    eps_data = load_data("episodes.json", DEFAULT_EPISODES)

    tab_list, tab_edit = st.tabs(["에피소드 목록", "추가/편집"])

    with tab_list:
        completed = [e for e in eps_data["episodes"] if e["status"] == "완료"]
        total = len(eps_data["episodes"])

        st.progress(len(completed) / total,
                    text=f"진행률  {len(completed)}/{total}  ({len(completed)/total*100:.0f}%)")
        st.divider()

        for ep in eps_data["episodes"]:
            status_colors = {"완료": "#2dc653", "진행": "#0078d4", "예정": "#555"}
            icons = {"완료": "✅", "진행": "🔄", "예정": "🔒"}
            sc = status_colors.get(ep["status"], "#555")
            icon = icons.get(ep["status"], "❓")

            with st.expander(
                f"{icon} **{ep['id']}** — {ep['title']}",
                expanded=(ep["status"] == "진행")
            ):
                cols = st.columns([2, 1])
                with cols[0]:
                    st.caption(f"부제: {ep['subtitle']}")
                    if ep.get("date"):
                        st.caption(f"날짜: {ep['date']}")
                with cols[1]:
                    st.markdown(
                        f'<span class="badge" style="background:{sc};color:white">{ep["status"]}</span>',
                        unsafe_allow_html=True
                    )

                if ep.get("summary"):
                    st.write(ep["summary"])
                else:
                    st.caption("요약 없음")

    with tab_edit:
        edit_mode = st.radio("모드", ["기존 에피 편집", "새 에피 추가"], horizontal=True, key="ep_mode")

        if edit_mode == "기존 에피 편집":
            ep_ids = [e["id"] for e in eps_data["episodes"]]
            sel_id = st.selectbox("에피소드 선택", ep_ids, key="ep_sel_edit")
            ep = next(e for e in eps_data["episodes"] if e["id"] == sel_id)

            with st.form("edit_ep_form"):
                new_title = st.text_input("제목", value=ep["title"])
                new_sub = st.text_input("부제", value=ep["subtitle"])
                new_status = st.selectbox(
                    "상태", ["완료", "진행", "예정"],
                    index=["완료", "진행", "예정"].index(ep["status"])
                )
                new_date = st.text_input("날짜 (YYYY-MM-DD)", value=ep.get("date", ""))
                new_summary = st.text_area("요약", value=ep.get("summary", ""), height=120)

                if st.form_submit_button("💾 저장", use_container_width=True):
                    for e in eps_data["episodes"]:
                        if e["id"] == sel_id:
                            e.update({
                                "title": new_title, "subtitle": new_sub,
                                "status": new_status, "date": new_date,
                                "summary": new_summary,
                            })
                    save_data("episodes.json", eps_data)
                    st.success("저장 완료!")
                    st.rerun()

        else:
            existing_ids = [e["id"] for e in eps_data["episodes"]]
            max_num = max(int(eid[2:]) for eid in existing_ids if eid[2:].isdigit())

            with st.form("add_ep_form"):
                new_id = st.text_input("에피소드 ID", value=f"EP{max_num + 1:03d}")
                new_title = st.text_input("제목")
                new_sub = st.text_input("부제")
                new_date = st.text_input("날짜 (YYYY-MM-DD)")
                new_summary = st.text_area("요약", height=80)

                if st.form_submit_button("➕ 추가", use_container_width=True):
                    if new_id and new_title:
                        eps_data["episodes"].append({
                            "id": new_id, "title": new_title, "subtitle": new_sub,
                            "status": "예정", "date": new_date, "summary": new_summary,
                        })
                        save_data("episodes.json", eps_data)
                        st.success(f"{new_id} 추가 완료!")
                        st.rerun()
                    else:
                        st.error("ID와 제목은 필수입니다.")


# ───────────────────────────────────────────────────────────────────────────────

def page_investment() -> None:
    st.markdown("# 💰 투자 / 자금")

    inv_data = load_data("investment.json", DEFAULT_INVESTMENT)

    tab_phase, tab_account, tab_history = st.tabs(["투자 단계", "통장 잔고", "거래 내역"])

    # ── 투자 단계 ──────────────────────────────────────────
    with tab_phase:
        phase_colors = {
            "진행": "#0078d4",
            "완료": "#2dc653",
            "예정": "#555"
        }
        for p in inv_data["phases"]:
            sc = phase_colors.get(p["status"], "#555")
            border = f"4px solid {sc}"
            st.markdown(
                f"""<div style="background:#1a1a2e;border-left:{border};
                border-radius:8px;padding:12px;margin:6px 0;">
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <span style="color:white;font-weight:bold;font-size:1rem">{p['phase']}</span>
                  <span style="color:{sc};font-size:0.85rem">{p['status']}</span>
                </div>
                <div style="color:#e94560;font-size:1.4rem;font-weight:bold;margin:4px 0">{p['capital_display']}</div>
                <div style="color:#aaa;font-size:0.85rem">{p['goal']}</div>
                </div>""",
                unsafe_allow_html=True
            )
            st.progress(p["progress"] / 100)

        # 단계 진행률 업데이트
        with st.expander("단계 진행률 업데이트"):
            sel_phase = st.selectbox("단계 선택", [p["phase"] for p in inv_data["phases"]])
            p_obj = next(p for p in inv_data["phases"] if p["phase"] == sel_phase)
            new_prog = st.slider("진행률 (%)", 0, 100, p_obj["progress"])
            new_pstatus = st.selectbox("상태", ["예정", "진행", "완료"],
                                       index=["예정", "진행", "완료"].index(p_obj["status"]))
            if st.button("업데이트", key="phase_update"):
                for p in inv_data["phases"]:
                    if p["phase"] == sel_phase:
                        p["progress"] = new_prog
                        p["status"] = new_pstatus
                save_data("investment.json", inv_data)
                st.success("업데이트 완료!")
                st.rerun()

    # ── 통장 잔고 ──────────────────────────────────────────
    with tab_account:
        acct = inv_data["account"]
        current = acct["current_krw"]
        initial = acct["initial_krw"]

        st.markdown(
            f"""<div style="background:linear-gradient(135deg,#1a1a2e,#0f3460);
            border-radius:14px;padding:22px;text-align:center;margin:8px 0;">
            <p style="color:#aaa;margin:0;font-size:0.9rem">현재 잔고</p>
            <h1 style="color:#e94560;margin:6px 0;font-size:2.4rem;font-weight:bold">{fmt_krw(current)}</h1>
            <p style="color:#888;margin:0;font-size:0.8rem">최종 업데이트: {acct['last_updated']}</p>
            </div>""",
            unsafe_allow_html=True
        )

        profit = current - initial
        profit_pct = (profit / initial * 100) if initial > 0 else 0
        cols = st.columns(2)
        cols[0].metric("초기 자본", fmt_krw(initial))
        cols[1].metric(
            "손익",
            fmt_krw(abs(profit)),
            f"{profit_pct:+.1f}%",
            delta_color="normal" if profit >= 0 else "inverse"
        )

        st.divider()
        st.subheader("잔고 업데이트")
        with st.form("balance_form"):
            col1, col2 = st.columns(2)
            with col1:
                tx_type = st.selectbox("유형", ["입금", "출금", "수익", "손실"])
            with col2:
                amount_input = st.number_input("금액 (원)", min_value=0, step=1000000, value=0)
            tx_desc = st.text_input("설명")

            if st.form_submit_button("💸 업데이트", use_container_width=True):
                if amount_input > 0:
                    delta = amount_input if tx_type in ["입금", "수익"] else -amount_input
                    acct["current_krw"] += delta
                    acct["last_updated"] = datetime.now().strftime("%Y-%m-%d")
                    acct["history"].append({
                        "date": acct["last_updated"],
                        "amount_krw": delta,
                        "description": tx_desc or tx_type,
                        "type": tx_type,
                        "balance_after": acct["current_krw"],
                    })
                    save_data("investment.json", inv_data)
                    st.success("잔고 업데이트 완료!")
                    st.rerun()
                else:
                    st.warning("금액을 입력해 주세요.")

    # ── 거래 내역 ──────────────────────────────────────────
    with tab_history:
        history = inv_data["account"]["history"]
        if not history:
            st.info("거래 내역이 없습니다.")
            return

        for h in reversed(history):
            amt = h["amount_krw"]
            color = "#2dc653" if amt > 0 else "#e94560"
            sign = "+" if amt > 0 else ""
            bal = h.get("balance_after", 0)
            st.markdown(
                f"""<div style="background:#1a1a2e;border-left:3px solid {color};
                border-radius:8px;padding:10px 12px;margin:4px 0;">
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <span style="color:#ccc">{h.get('description','-')}</span>
                  <span style="color:{color};font-weight:bold">{sign}{fmt_krw(abs(amt))}</span>
                </div>
                <div style="color:#888;font-size:0.78rem;margin-top:3px">
                  {h['date']}  ·  {h['type']}  ·  잔고 {fmt_krw(bal)}
                </div>
                </div>""",
                unsafe_allow_html=True
            )


# ───────────────────────────────────────────────────────────────────────────────

def page_bosses() -> None:
    st.markdown("# ⚔️ 적 목록")
    st.caption("7명의 미래 보스. 공통: 인간/아인종 혼합. 최종적으로 동료가 됨.")

    boss_data = load_data("bosses.json", DEFAULT_BOSSES)

    tab_list, tab_edit = st.tabs(["보스 목록", "편집"])

    with tab_list:
        ally_cnt = sum(1 for b in boss_data["bosses"] if b["status"] == "동료")
        enemy_cnt = sum(1 for b in boss_data["bosses"] if b["status"] == "적")
        lock_cnt = sum(1 for b in boss_data["bosses"] if b["status"] == "LOCK")

        cols = st.columns(3)
        cols[0].metric("동료화", f"{ally_cnt}/7", "🤝")
        cols[1].metric("적 활성", f"{enemy_cnt}명", "⚔️")
        cols[2].metric("미공개", f"{lock_cnt}명", "🔒")

        st.progress(ally_cnt / 7, text=f"보스 동료화 진행률  {ally_cnt}/7")
        st.divider()

        status_cfg = {
            "LOCK":  {"icon": "🔒", "color": "#555",    "bg": "#111"},
            "잠재적": {"icon": "👁️", "color": "#ffaa00", "bg": "#1a1500"},
            "적":    {"icon": "⚔️", "color": "#e94560", "bg": "#1a0d12"},
            "동료":  {"icon": "🤝", "color": "#2dc653", "bg": "#0d1a10"},
        }

        for boss in boss_data["bosses"]:
            cfg = status_cfg.get(boss["status"], status_cfg["LOCK"])
            st.markdown(
                f"""<div style="background:{cfg['bg']};border:1px solid {cfg['color']};
                border-radius:10px;padding:12px 14px;margin:5px 0;">
                <div style="display:flex;align-items:center;gap:10px">
                  <span style="font-size:1.8rem">{cfg['icon']}</span>
                  <div>
                    <span style="color:{cfg['color']};font-weight:bold">{boss['id']}</span>
                    <span style="color:#fff;font-size:1rem;margin-left:8px">{boss['name']}</span>
                  </div>
                </div>
                <p style="color:#aaa;margin:6px 0 2px;font-size:0.85rem">
                  첫 등장: {boss['first_ep']}  |  동료화: {boss['ally_ep']}
                </p>
                <p style="color:#888;font-size:0.82rem;margin:0">{boss.get('description','')}</p>
                </div>""",
                unsafe_allow_html=True
            )

    with tab_edit:
        boss_ids = [b["id"] for b in boss_data["bosses"]]
        sel_bid = st.selectbox("보스 선택", boss_ids)
        boss = next(b for b in boss_data["bosses"] if b["id"] == sel_bid)

        with st.form("edit_boss_form"):
            b_name = st.text_input("이름", value=boss["name"])
            b_first = st.text_input("첫 등장", value=boss["first_ep"])
            b_ally = st.text_input("동료화 예정 EP", value=boss["ally_ep"])
            b_status = st.selectbox(
                "상태", ["LOCK", "잠재적", "적", "동료"],
                index=["LOCK", "잠재적", "적", "동료"].index(boss["status"])
                if boss["status"] in ["LOCK", "잠재적", "적", "동료"] else 0
            )
            b_desc = st.text_area("설명", value=boss.get("description", ""), height=80)

            if st.form_submit_button("💾 저장", use_container_width=True):
                for b in boss_data["bosses"]:
                    if b["id"] == sel_bid:
                        b.update({
                            "name": b_name, "first_ep": b_first,
                            "ally_ep": b_ally, "status": b_status,
                            "description": b_desc,
                        })
                save_data("bosses.json", boss_data)
                st.success("저장 완료!")
                st.rerun()


# ───────────────────────────────────────────────────────────────────────────────

def page_issues() -> None:
    st.markdown("# 🔮 이슈 / 복선")

    fsh_data = load_data("foreshadow.json", DEFAULT_FORESHADOW)

    tab_list, tab_edit = st.tabs(["복선 목록", "추가/편집"])

    with tab_list:
        open_cnt = sum(1 for f in fsh_data["items"] if f["status"] == "OPEN")
        closed_cnt = sum(1 for f in fsh_data["items"] if f["status"] == "CLOSED")

        cols = st.columns(2)
        cols[0].metric("미해결 (OPEN)", open_cnt)
        cols[1].metric("해결됨 (CLOSED)", closed_cnt)

        st.divider()

        filter_st = st.radio("필터", ["전체", "OPEN", "CLOSED"], horizontal=True)
        items = fsh_data["items"]
        if filter_st != "전체":
            items = [f for f in items if f["status"] == filter_st]

        priority_colors = {"최고": "#e94560", "높음": "#ffaa00", "보통": "#0078d4"}

        for f in items:
            sc = "#e94560" if f["status"] == "OPEN" else "#2dc653"
            pc = priority_colors.get(f.get("priority", "보통"), "#aaa")
            st.markdown(
                f"""<div style="background:#1a1a2e;border-radius:10px;padding:12px 14px;
                margin:5px 0;border-top:2px solid {sc}">
                <div style="display:flex;justify-content:space-between;align-items:flex-start">
                  <div>
                    <span style="color:#888;font-size:0.8rem">{f['id']}  [{f['ep']}]</span>
                    <br>
                    <span style="color:#fff;font-weight:bold;font-size:1rem">{f['content']}</span>
                  </div>
                  <span style="background:{sc};color:white;padding:2px 8px;
                  border-radius:10px;font-size:0.75rem;white-space:nowrap">{f['status']}</span>
                </div>
                <p style="color:#aaa;font-size:0.85rem;margin:5px 0 2px">
                  → 페이오프: <b>{f['payoff']}</b>
                  &nbsp;&nbsp;
                  <span style="color:{pc}">● {f.get('priority','보통')}</span>
                </p>
                {f'<p style="color:#888;font-size:0.82rem;margin:0">{f["notes"]}</p>' if f.get("notes") else ""}
                </div>""",
                unsafe_allow_html=True
            )

    with tab_edit:
        edit_mode = st.radio("모드", ["기존 복선 편집", "새 복선 추가"], horizontal=True, key="fsh_mode")

        if edit_mode == "기존 복선 편집":
            ids = [f["id"] for f in fsh_data["items"]]
            sel_id = st.selectbox("복선 선택", ids, key="fsh_sel")
            item = next(f for f in fsh_data["items"] if f["id"] == sel_id)

            with st.form("edit_fsh_form"):
                f_ep = st.text_input("등장 EP", value=item["ep"])
                f_content = st.text_input("복선 내용", value=item["content"])
                f_payoff = st.text_input("예정 페이오프", value=item["payoff"])
                f_priority = st.selectbox(
                    "우선순위", ["최고", "높음", "보통"],
                    index=["최고", "높음", "보통"].index(item.get("priority", "보통"))
                )
                f_status = st.selectbox(
                    "상태", ["OPEN", "CLOSED"],
                    index=0 if item["status"] == "OPEN" else 1
                )
                f_notes = st.text_area("메모", value=item.get("notes", ""), height=80)

                if st.form_submit_button("💾 저장", use_container_width=True):
                    for f in fsh_data["items"]:
                        if f["id"] == sel_id:
                            f.update({
                                "ep": f_ep, "content": f_content, "payoff": f_payoff,
                                "priority": f_priority, "status": f_status, "notes": f_notes,
                            })
                    save_data("foreshadow.json", fsh_data)
                    st.success("저장 완료!")
                    st.rerun()

        else:
            with st.form("add_fsh_form"):
                new_id = st.text_input("ID", value=next_foreshadow_id(fsh_data["items"]))
                new_ep = st.text_input("등장 EP")
                new_content = st.text_input("복선 내용")
                new_payoff = st.text_input("예정 페이오프")
                new_priority = st.selectbox("우선순위", ["보통", "높음", "최고"])
                new_notes = st.text_area("메모", height=80)

                if st.form_submit_button("➕ 추가", use_container_width=True):
                    if new_content:
                        fsh_data["items"].append({
                            "id": new_id, "ep": new_ep, "content": new_content,
                            "payoff": new_payoff, "status": "OPEN",
                            "priority": new_priority, "notes": new_notes,
                        })
                        save_data("foreshadow.json", fsh_data)
                        st.success("추가 완료!")
                        st.rerun()
                    else:
                        st.error("복선 내용은 필수입니다.")


# ───────────────────────────────────────────────────────────────────────────────

def page_files() -> None:
    st.markdown("# 📁 파일 관리")

    tab_upload, tab_download, tab_viewer = st.tabs(["업로드", "내보내기", "파일 뷰어"])

    # ── 업로드 ─────────────────────────────────────────────
    with tab_upload:
        st.subheader("파일 업로드")
        st.caption("스토리 파일(.md/.txt), Master DB(.md), Story Bible(.zip) 업로드 가능")

        uploaded = st.file_uploader(
            "파일 선택",
            type=["md", "txt", "zip", "json"],
            accept_multiple_files=False,
        )

        if uploaded is not None:
            col1, col2 = st.columns([3, 1])
            col1.info(f"선택된 파일: **{uploaded.name}** ({uploaded.size / 1024:.1f} KB)")

            if col2.button("업로드", use_container_width=True):
                save_path = UPLOADS_DIR / uploaded.name
                with open(save_path, "wb") as f:
                    f.write(uploaded.getbuffer())

                if uploaded.name.endswith(".zip"):
                    extract_dir = UPLOADS_DIR / uploaded.name.replace(".zip", "")
                    extract_dir.mkdir(exist_ok=True)
                    with zipfile.ZipFile(save_path, "r") as zf:
                        zf.extractall(extract_dir)
                    st.success(f"ZIP 압축 해제 완료: {extract_dir.name}/")

                    # Story Bible JSON 자동 반영
                    json_path = extract_dir / "data" / "story_bible_data.json"
                    if json_path.exists():
                        with open(json_path, "r", encoding="utf-8") as jf:
                            sb = json.load(jf)
                        for key in ["characters", "episodes", "investment", "bosses", "foreshadow"]:
                            if key in sb:
                                save_data(f"{key}.json", sb[key])
                        st.success("Story Bible 데이터 자동 반영 완료!")
                else:
                    st.success(f"업로드 완료: {save_path.name}")

        # 업로드 파일 목록
        uploaded_files = list(UPLOADS_DIR.iterdir())
        if uploaded_files:
            st.divider()
            st.subheader("업로드된 파일 목록")
            for f in uploaded_files:
                if f.is_file():
                    cols = st.columns([4, 1])
                    cols[0].markdown(f"📄 `{f.name}` ({f.stat().st_size / 1024:.1f} KB)")
                    if cols[1].button("삭제", key=f"del_{f.name}"):
                        f.unlink()
                        st.rerun()

    # ── 내보내기 ───────────────────────────────────────────
    with tab_download:
        st.subheader("데이터 내보내기")

        col1, col2 = st.columns(2)

        with col1:
            if st.button("📄 Master DB (.md)", use_container_width=True):
                md_content = generate_master_db()
                st.markdown(
                    get_download_link(md_content, "99_Master_DB.md", "text/markdown",
                                      "💾 99_Master_DB.md 다운로드"),
                    unsafe_allow_html=True
                )
                with st.expander("미리보기"):
                    st.code(md_content[:1000] + "...", language="markdown")

        with col2:
            if st.button("🗜️ Story Bible (.zip)", use_container_width=True):
                zip_bytes = generate_story_bible_zip()
                st.markdown(
                    get_download_link(zip_bytes, "Story_Bible.zip",
                                      "application/zip", "💾 Story_Bible.zip 다운로드"),
                    unsafe_allow_html=True
                )
                st.success(f"ZIP 생성 완료 ({len(zip_bytes) / 1024:.1f} KB)")

        st.divider()

        if st.button("📦 전체 JSON 내보내기", use_container_width=True):
            all_data = {
                "characters": load_data("characters.json", DEFAULT_CHARACTERS),
                "relationships": load_data("relationships.json", DEFAULT_RELATIONSHIPS),
                "episodes": load_data("episodes.json", DEFAULT_EPISODES),
                "investment": load_data("investment.json", DEFAULT_INVESTMENT),
                "bosses": load_data("bosses.json", DEFAULT_BOSSES),
                "foreshadow": load_data("foreshadow.json", DEFAULT_FORESHADOW),
            }
            json_str = json.dumps(all_data, ensure_ascii=False, indent=2)
            st.markdown(
                get_download_link(json_str, "story_bible_all.json",
                                  "application/json", "💾 story_bible_all.json 다운로드"),
                unsafe_allow_html=True
            )

    # ── 파일 뷰어 ──────────────────────────────────────────
    with tab_viewer:
        st.subheader("업로드 파일 뷰어")

        md_files = list(UPLOADS_DIR.glob("*.md")) + list(UPLOADS_DIR.glob("*.txt"))
        if not md_files:
            st.info("업로드된 텍스트 파일이 없습니다.")
        else:
            sel_file = st.selectbox("파일 선택", [f.name for f in md_files])
            sel_path = UPLOADS_DIR / sel_file
            content = sel_path.read_text(encoding="utf-8")
            st.markdown(content)


# ═══════════════════════════════════════════════════════════════════════════════
# ─── 네비게이션 & 메인 ────────────────────────────────────────────────────────────
# ═══════════════════════════════════════════════════════════════════════════════

PAGES = {
    "home":       ("🏠", "홈"),
    "characters": ("👥", "인물"),
    "story":      ("📚", "스토리"),
    "investment": ("💰", "자금"),
    "bosses":     ("⚔️", "적"),
    "issues":     ("🔮", "이슈"),
    "files":      ("📁", "파일"),
}


def render_nav() -> None:
    current = st.session_state.get("page", "home")
    cols = st.columns(len(PAGES))
    for col, (pid, (emoji, label)) in zip(cols, PAGES.items()):
        is_active = pid == current
        btn_class = "nav-btn-active" if is_active else "nav-btn"
        with col:
            # CSS 클래스를 버튼에 직접 적용하는 Streamlit 우회 방법
            if st.button(
                f"{emoji}\n{label}",
                key=f"nav_{pid}",
                use_container_width=True,
                type="primary" if is_active else "secondary",
            ):
                st.session_state.page = pid
                st.rerun()


def main() -> None:
    if "page" not in st.session_state:
        st.session_state.page = "home"

    render_nav()
    st.divider()

    page = st.session_state.page
    dispatch = {
        "home":       page_home,
        "characters": page_characters,
        "story":      page_story,
        "investment": page_investment,
        "bosses":     page_bosses,
        "issues":     page_issues,
        "files":      page_files,
    }
    dispatch.get(page, page_home)()


if __name__ == "__main__":
    main()
