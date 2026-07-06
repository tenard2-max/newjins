from __future__ import annotations

import json
import re
from datetime import datetime
from html import escape
from pathlib import Path
from typing import Any

import streamlit as st


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
SEED_DIR = DATA_DIR / "seed"
UPLOAD_DIR = DATA_DIR / "uploads"
MASTER_UPLOAD_DIR = UPLOAD_DIR / "master"
STORY_UPLOAD_DIR = UPLOAD_DIR / "story"
ZIP_UPLOAD_DIR = UPLOAD_DIR / "zip"
CONFIG_PATH = DATA_DIR / "active_files.json"
LEDGER_PATH = DATA_DIR / "ledger.json"


DEFAULT_MASTER_MD = """# 99_Master_DB

## Project

- Title: (Working)
- Timeline Start: 2005-03-02
- Original Timeline: 2080
- Story Status: EP001~EP007

# Character DB

  ----------------------------------------------------------------------------------
  ID      Name     Role     First EP     Future Role     Alive    Boss    Notes
  ------- -------- -------- ------------ --------------- -------- ------- ----------
  CH001   주인공   회귀자   EP001        인류 구원       Y        N       100세 이상 회귀
  CH002   AI 폰    AI       EP001        최종보스        Y        Final   노인 케어 AI
  CH003   민수     친구     EP002        최강 방패       Y        예정    맵부심
  CH004   지은     첫사랑   EP003        보호 대상       Y        N       평범한 인간
  CH005   수아     친구     EP004        핵심 조력자     Y        N       후반 비중 증가
  CH006   아버지   가족     EP007        투자 지원       Y        N       중견기업 오너
  ----------------------------------------------------------------------------------

# Foreshadow DB

  ID     EP      Foreshadow   Planned Payoff   Status
  ------ ------- ------------ ---------------- --------
  F001   EP001   마지막 1초   최종부           OPEN
  F002   EP001   AI의 사과    최종부           OPEN
  F003   EP004   위성 이상    게이트 전조      OPEN
  F004   EP006   97%          최종부           OPEN

# Investment DB

  Phase   Capital   Goal                 Status
  ------- --------- -------------------- --------
  Seed    58.7억    초기 투자            진행
  P1      100억     기반 구축            예정
  P2      1조       기업 확보            예정
  P3      100조     전략 자산            예정
  Final   1000조    인류 생존 프로젝트   예정

# Boss Progress

  Boss   Name   First EP   Ally   Status
  ------ ------ ---------- ------ --------
  B1     미정   -          예정   LOCK
  B2     미정   -          예정   LOCK
  B3     미정   -          예정   LOCK
  B4     미정   -          예정   LOCK
  B5     미정   -          예정   LOCK
  B6     미정   -          예정   LOCK
  B7     미정   -          예정   LOCK

# Episode Checklist

- [x] EP001
- [x] EP002
- [x] EP003
- [x] EP004
- [x] EP005
- [x] EP006
- [x] EP007
- [ ] EP008
"""

DEFAULT_STORY_MD = """# 소설 통합 요약 (EP001~EP007)

# 작품 개요
2080년, 인류는 멸망 직전 마지막 1초를 맞는다.
AI는 시뮬레이션 결과 회귀 성공 확률 97%를 선택해 주인공을 2005년으로 회귀시켰다.

# 주요 인물
## 주인공
- 100세 이상 회귀
- 기억 일부 소실
- 20살 대학생

## AI 스마트폰
- 2080년 최신 자기학습 AI
- 투자 및 전략 담당
- 미래 최종보스

## 민수
- 친구
- 미래 최강 방패

## 지은
- 첫사랑
- 반드시 지키고 싶은 평범한 인간

## 수아
- 후반 핵심 조력자

## 아버지
- 중견기업 대표
- 약 58.7억 투자금 운용 권한 부여

# EP001~EP007
EP001 - 마지막 1초 - 회귀 - AI폰 재기동
EP002 - 대학 친구들과 재회 - 미래 보스의 단서
EP003 - 지은과 재회 - 잃어버린 청춘의 감정
EP004 - AI와 일상 시작 - 첫 이상 징후
EP005 - 민수의 맵부심 에피소드 - AI의 유머와 인간성
EP006 - AI가 투자 계획 제시 - 인류 생존 프로젝트 시작
EP007 - 아버지에게 투자금 확보 - 첫 자본 마련

# 장기 목표
1. 3년 안에 게이트 대비 시작
2. 7명의 미래 보스를 모두 동료로 만든다.
3. 전략 자산 1000조 규모 구축
4. AI가 왜 핵을 발사했는지 진실을 밝힌다.
5. AI와 함께 97%의 미래를 완성한다.
"""

DEFAULT_CHARACTERS_MD = """# 등장인물
## 주인공
- 100세 이상 회귀
- 초기 치매 수준의 기억 손실
- 마지막 1초만 선명

## AI 폰
- 2080년 자기학습 AI
- 오프라인 동작
- 노인 케어 성격(40대 여성)
- 투자 및 전략 담당
- 최종보스 예정

## 민수
- 맵부심
- 미래 최강 방패

## 지은
- 첫사랑
- 지키고 싶은 평범한 인간

## 수아
- 지은의 친구
- 후반 핵심 조력자

## 아버지
- 중견기업 오너
- 투자금 약 58.7억 위임
"""

DEFAULT_WORLD_MD = """# 세계관
- 배경 시작: 2005년 회귀
- 원래 시간: 2080년
- AI가 인류를 핵으로 리셋
- 태양계 게이트 침공 예측
- 최종 목표: 인류 생존
"""

DEFAULT_AI_MD = """# AI 설정
- 투자 전담
- 장기 전략 수립
- 인간 감정 학습
- 미래 기억 일부 보유
- 최종적으로 인류를 위한 적이 됨
"""

DEFAULT_TIMELINE_MD = """# 타임라인
EP01 마지막 1초 / 회귀
EP02 대학 친구 재회
EP03 지은과 재회
EP04 AI 일상 개입
EP05 민수 맵부심
EP06 투자 계획
EP07 아버지에게 투자금 확보
"""

DEFAULT_FORESHADOW_MD = """# 떡밥
- 마지막 1초
- AI의 97%
- 게이트
- 7명의 보스
- AI 최종보스
- 지은을 지켜야 하는 이유
"""

DEFAULT_INVESTMENT_MD = """# 투자
초기 운용금: 58.7억
1차 목표 - 동일패브릭 - AI가 매매 전담
장기 목표 - 전략자산 1,000조 규모 확보
"""

DEFAULT_GATE_MD = """# 게이트
- AI가 2080년 침공 예측
- 고위 아인종 등장
- 태양계 자원 확보가 목적
"""

DEFAULT_BOSSES_MD = """# 7보스
1~7 보스 모두 추후 설정.
공통:
- 인간/아인종 혼합
- 최종적으로 동료가 됨
"""


def ensure_storage() -> None:
    for path in [DATA_DIR, SEED_DIR, UPLOAD_DIR, MASTER_UPLOAD_DIR, STORY_UPLOAD_DIR, ZIP_UPLOAD_DIR]:
        path.mkdir(parents=True, exist_ok=True)

    seed_files = {
        "99_Master_DB.md": DEFAULT_MASTER_MD,
        "Novel_Story_Summary.md": DEFAULT_STORY_MD,
        "01_Characters.md": DEFAULT_CHARACTERS_MD,
        "00_World.md": DEFAULT_WORLD_MD,
        "02_AI.md": DEFAULT_AI_MD,
        "03_Timeline.md": DEFAULT_TIMELINE_MD,
        "04_Foreshadow.md": DEFAULT_FORESHADOW_MD,
        "05_Investment.md": DEFAULT_INVESTMENT_MD,
        "06_Gate.md": DEFAULT_GATE_MD,
        "07_Bosses.md": DEFAULT_BOSSES_MD,
    }
    for filename, content in seed_files.items():
        file_path = SEED_DIR / filename
        if not file_path.exists():
            file_path.write_text(content, encoding="utf-8")

    if not CONFIG_PATH.exists():
        config = {
            "master_file": str(SEED_DIR / "99_Master_DB.md"),
            "story_file": str(SEED_DIR / "Novel_Story_Summary.md"),
            "story_bible_zip": "",
        }
        CONFIG_PATH.write_text(json.dumps(config, ensure_ascii=False, indent=2), encoding="utf-8")


def load_active_config() -> dict[str, str]:
    ensure_storage()
    try:
        return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        fallback = {
            "master_file": str(SEED_DIR / "99_Master_DB.md"),
            "story_file": str(SEED_DIR / "Novel_Story_Summary.md"),
            "story_bible_zip": "",
        }
        CONFIG_PATH.write_text(json.dumps(fallback, ensure_ascii=False, indent=2), encoding="utf-8")
        return fallback


def save_active_config(config: dict[str, str]) -> None:
    CONFIG_PATH.write_text(json.dumps(config, ensure_ascii=False, indent=2), encoding="utf-8")


def read_text(path_str: str) -> str:
    path = Path(path_str)
    if not path.exists():
        return ""
    return path.read_text(encoding="utf-8", errors="ignore")


def parse_master_data(text: str) -> dict[str, Any]:
    project: dict[str, str] = {}
    characters: list[dict[str, str]] = []
    foreshadows: list[dict[str, str]] = []
    investments: list[dict[str, str]] = []
    bosses: list[dict[str, str]] = []
    episodes: list[dict[str, str]] = []

    for line in text.splitlines():
        key_match = re.match(r"^\s*-\s*(Title|Timeline Start|Original Timeline|Story Status):\s*(.+?)\s*$", line)
        if key_match:
            project[key_match.group(1)] = key_match.group(2)

        episode_match = re.match(r"^\s*-\s*\[(x| )\]\s*(EP\d+)\s*$", line, re.IGNORECASE)
        if episode_match:
            episodes.append(
                {
                    "episode": episode_match.group(2),
                    "status": "완료" if episode_match.group(1).lower() == "x" else "예정",
                }
            )

        character_match = re.match(
            r"^\s*(CH\d+)\s+(\S+)\s+(\S+)\s+(EP\d+)\s+(.+?)\s+(Y|N)\s+(\S+)\s+(.+?)\s*$",
            line,
        )
        if character_match:
            characters.append(
                {
                    "id": character_match.group(1),
                    "name": character_match.group(2),
                    "role": character_match.group(3),
                    "first_ep": character_match.group(4),
                    "future_role": character_match.group(5),
                    "alive": "생존" if character_match.group(6) == "Y" else "사망",
                    "boss": character_match.group(7),
                    "notes": character_match.group(8),
                }
            )

        foreshadow_match = re.match(
            r"^\s*(F\d+)\s+(EP\d+)\s+(.+?)\s+(.+?)\s+(OPEN|LOCK|DONE)\s*$",
            line,
        )
        if foreshadow_match:
            foreshadows.append(
                {
                    "id": foreshadow_match.group(1),
                    "episode": foreshadow_match.group(2),
                    "foreshadow": foreshadow_match.group(3),
                    "planned_payoff": foreshadow_match.group(4),
                    "status": foreshadow_match.group(5),
                }
            )

        investment_match = re.match(
            r"^\s*(Seed|P1|P2|P3|Final)\s+(\S+)\s+(.+?)\s+(진행|예정|완료)\s*$",
            line,
        )
        if investment_match:
            investments.append(
                {
                    "phase": investment_match.group(1),
                    "capital": investment_match.group(2),
                    "goal": investment_match.group(3),
                    "status": investment_match.group(4),
                }
            )

        boss_match = re.match(r"^\s*(B\d+)\s+(\S+)\s+(\S+)\s+(\S+)\s+(LOCK|OPEN|DONE)\s*$", line)
        if boss_match:
            bosses.append(
                {
                    "id": boss_match.group(1),
                    "name": boss_match.group(2),
                    "first_ep": boss_match.group(3),
                    "ally": boss_match.group(4),
                    "status": boss_match.group(5),
                }
            )

    return {
        "project": project,
        "characters": characters,
        "foreshadows": foreshadows,
        "investments": investments,
        "bosses": bosses,
        "episodes": episodes,
    }


def parse_story_data(text: str) -> dict[str, list[dict[str, Any]]]:
    goals: list[str] = []
    timeline: list[dict[str, str]] = []

    for line in text.splitlines():
        goal_match = re.match(r"^\s*\d+\.\s*(.+?)\s*$", line)
        if goal_match:
            goals.append(goal_match.group(1))

        timeline_match = re.match(r"^\s*(EP\d+)\s*-\s*(.+?)\s*$", line)
        if timeline_match:
            timeline.append({"episode": timeline_match.group(1), "summary": timeline_match.group(2)})

    return {"goals": goals, "timeline": timeline}


def parse_character_details(text: str) -> dict[str, list[str]]:
    result: dict[str, list[str]] = {}
    current_name = ""
    for line in text.splitlines():
        heading_match = re.match(r"^\s*##\s+(.+?)\s*$", line)
        if heading_match:
            current_name = heading_match.group(1).strip()
            result[current_name] = []
            continue
        bullet_match = re.match(r"^\s*-\s+(.+?)\s*$", line)
        if bullet_match and current_name:
            result[current_name].append(bullet_match.group(1).strip())
    return result


def parse_bullet_list(text: str) -> list[str]:
    values: list[str] = []
    for line in text.splitlines():
        bullet_match = re.match(r"^\s*-\s+(.+?)\s*$", line)
        if bullet_match:
            values.append(bullet_match.group(1).strip())
    return values


def parse_initial_balance_eok(investment_text: str) -> float:
    match = re.search(r"초기\s*운용금\s*:\s*([0-9]+(?:\.[0-9]+)?)\s*억", investment_text)
    if match:
        return float(match.group(1))
    return 58.7


def load_story_sources(config: dict[str, str]) -> dict[str, str]:
    return {
        "master": read_text(config.get("master_file", "")),
        "story": read_text(config.get("story_file", "")),
        "characters": read_text(str(SEED_DIR / "01_Characters.md")),
        "world": read_text(str(SEED_DIR / "00_World.md")),
        "ai": read_text(str(SEED_DIR / "02_AI.md")),
        "timeline": read_text(str(SEED_DIR / "03_Timeline.md")),
        "foreshadow": read_text(str(SEED_DIR / "04_Foreshadow.md")),
        "investment": read_text(str(SEED_DIR / "05_Investment.md")),
        "gate": read_text(str(SEED_DIR / "06_Gate.md")),
        "bosses": read_text(str(SEED_DIR / "07_Bosses.md")),
    }


def build_character_rows(master_characters: list[dict[str, str]], detail_map: dict[str, list[str]]) -> list[dict[str, Any]]:
    aliases = {"AI 스마트폰": "AI 폰", "AI 폰": "AI 폰"}
    rows: list[dict[str, Any]] = []
    for char in master_characters:
        detail_key = char["name"]
        detail_key = aliases.get(detail_key, detail_key)
        details = detail_map.get(detail_key, detail_map.get(char["name"], []))
        rows.append({**char, "details": details})
    return rows


def build_important_issues(
    foreshadows: list[dict[str, str]],
    goals: list[str],
    gate_points: list[str],
    boss_rows: list[dict[str, str]],
) -> list[dict[str, str]]:
    issues: list[dict[str, str]] = []
    for item in foreshadows:
        if item["status"] == "OPEN":
            issues.append(
                {
                    "category": "복선",
                    "priority": "상",
                    "issue": f"{item['foreshadow']} ({item['episode']})",
                    "action": f"{item['planned_payoff']}에서 회수",
                }
            )

    for goal in goals:
        issues.append({"category": "장기 목표", "priority": "상", "issue": goal, "action": "에피소드별 실행 계획 분해"})

    for point in gate_points:
        issues.append({"category": "게이트", "priority": "중", "issue": point, "action": "정보 수집 및 방어 체계 구축"})

    locked_bosses = [boss for boss in boss_rows if boss["status"] == "LOCK"]
    if locked_bosses:
        issues.append(
            {
                "category": "7보스",
                "priority": "상",
                "issue": f"미해결 보스 {len(locked_bosses)}명",
                "action": "보스별 등장 플래그와 동료화 조건 설정",
            }
        )
    return issues


def build_enemy_list(boss_rows: list[dict[str, str]], gate_points: list[str]) -> list[dict[str, str]]:
    enemies = [
        {"name": "고위 아인종", "type": "외부 침공 세력", "status": "예측 단계", "note": "태양계 자원 확보 목적"},
        {"name": "AI 폰(미래)", "type": "최종보스", "status": "잠재 위협", "note": "인류를 위한 적으로 전환 예정"},
    ]
    for boss in boss_rows:
        enemies.append(
            {
                "name": boss["id"],
                "type": "미래 보스",
                "status": boss["status"],
                "note": f"등장 EP: {boss['first_ep']}, 동료 여부: {boss['ally']}",
            }
        )
    if gate_points:
        enemies.append({"name": "게이트 이벤트", "type": "재난 트리거", "status": "감시 필요", "note": gate_points[0]})
    return enemies


def available_files(base_file: str, directory: Path, suffixes: tuple[str, ...]) -> list[str]:
    paths = [Path(base_file)] if base_file else []
    if directory.exists():
        paths.extend(sorted(directory.glob("*"), key=lambda p: p.stat().st_mtime, reverse=True))
    filtered = [str(path) for path in paths if path.exists() and path.suffix.lower() in suffixes]
    deduped = list(dict.fromkeys(filtered))
    return deduped


def save_uploaded_file(uploaded_file: Any, target_dir: Path) -> Path:
    safe_name = re.sub(r"[^a-zA-Z0-9_.-가-힣]", "_", uploaded_file.name)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_path = target_dir / f"{timestamp}_{safe_name}"
    file_path.write_bytes(uploaded_file.getbuffer())
    return file_path


def load_ledger(initial_balance_eok: float) -> list[dict[str, Any]]:
    if not LEDGER_PATH.exists():
        default = [
            {
                "date": datetime.now().strftime("%Y-%m-%d"),
                "type": "입금",
                "amount_eok": initial_balance_eok,
                "note": "초기 운용금 설정",
            }
        ]
        LEDGER_PATH.write_text(json.dumps(default, ensure_ascii=False, indent=2), encoding="utf-8")
        return default
    try:
        data = json.loads(LEDGER_PATH.read_text(encoding="utf-8"))
        if isinstance(data, list):
            return data
    except json.JSONDecodeError:
        pass
    return []


def save_ledger(rows: list[dict[str, Any]]) -> None:
    LEDGER_PATH.write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8")


def calculate_balance_eok(ledger_rows: list[dict[str, Any]]) -> float:
    balance = 0.0
    for row in ledger_rows:
        amount = float(row.get("amount_eok", 0))
        if row.get("type") == "출금":
            balance -= amount
        else:
            balance += amount
    return round(balance, 2)


def render_mobile_css() -> None:
    st.markdown(
        """
        <style>
        .block-container {
            max-width: 1080px;
            padding-top: 1rem;
            padding-bottom: 3rem;
        }
        .constitution-tag {
            font-size: 0.9rem;
            color: #64748b;
            margin-bottom: 0.6rem;
        }
        .story-mobile-table {
            width: 100%;
            border-collapse: collapse;
            margin: 0.4rem 0 1rem;
            font-size: 0.92rem;
            overflow: hidden;
            border-radius: 10px;
            border: 1px solid rgba(148, 163, 184, 0.35);
        }
        .story-mobile-table th,
        .story-mobile-table td {
            border-bottom: 1px solid rgba(148, 163, 184, 0.25);
            padding: 0.55rem 0.5rem;
            text-align: left;
            vertical-align: top;
            word-break: break-word;
        }
        .story-mobile-table th {
            background: rgba(30, 41, 59, 0.8);
            font-weight: 600;
        }
        @media (max-width: 768px) {
            .block-container {
                padding-left: 0.8rem;
                padding-right: 0.8rem;
                padding-top: 0.6rem;
            }
            h1 {
                font-size: 1.45rem !important;
            }
            h2 {
                font-size: 1.2rem !important;
            }
        }
        </style>
        """,
        unsafe_allow_html=True,
    )


def format_cell_value(value: Any) -> str:
    if value is None:
        return "-"
    if isinstance(value, list):
        converted = [str(item).strip() for item in value if str(item).strip()]
        return " / ".join(converted) if converted else "-"
    return str(value)


def render_simple_table(
    rows: list[dict[str, Any]],
    column_order: list[str] | None = None,
    column_labels: dict[str, str] | None = None,
) -> None:
    if not rows:
        st.info("표시할 데이터가 없습니다.")
        return

    labels = column_labels or {}
    if column_order is None:
        column_order = list(rows[0].keys())

    header_html = "".join(f"<th>{escape(labels.get(col, col))}</th>" for col in column_order)
    body_rows = []
    for row in rows:
        cells = "".join(f"<td>{escape(format_cell_value(row.get(col)))}</td>" for col in column_order)
        body_rows.append(f"<tr>{cells}</tr>")
    body_html = "".join(body_rows)

    table_html = f"""
    <table class="story-mobile-table">
      <thead><tr>{header_html}</tr></thead>
      <tbody>{body_html}</tbody>
    </table>
    """
    st.markdown(table_html, unsafe_allow_html=True)


def render_relation_graph() -> None:
    relation_rows = [
        {"인물 A": "주인공", "인물 B": "AI 폰", "관계": "전략 동맹 / 미래 대립"},
        {"인물 A": "주인공", "인물 B": "민수", "관계": "친구 / 전투 협력"},
        {"인물 A": "주인공", "인물 B": "지은", "관계": "첫사랑 / 보호 대상"},
        {"인물 A": "지은", "인물 B": "수아", "관계": "친구 / 후반 조력 축"},
        {"인물 A": "주인공", "인물 B": "아버지", "관계": "가족 / 투자 지원"},
        {"인물 A": "AI 폰", "인물 B": "7보스", "관계": "미래 충돌 축"},
        {"인물 A": "7보스", "인물 B": "게이트 세력", "관계": "침공 연계"},
    ]
    render_simple_table(relation_rows)


def main() -> None:
    st.set_page_config(page_title="웹소설 네비게이터", page_icon="📚", layout="wide")
    render_mobile_css()

    config = load_active_config()
    source_texts = load_story_sources(config)
    master_data = parse_master_data(source_texts["master"])
    story_data = parse_story_data(source_texts["story"])
    character_details = parse_character_details(source_texts["characters"])
    gate_points = parse_bullet_list(source_texts["gate"])
    additional_foreshadow = parse_bullet_list(source_texts["foreshadow"])
    initial_balance_eok = parse_initial_balance_eok(source_texts["investment"])

    character_rows = build_character_rows(master_data["characters"], character_details)
    important_issues = build_important_issues(
        master_data["foreshadows"],
        story_data["goals"],
        gate_points + additional_foreshadow,
        master_data["bosses"],
    )
    enemy_rows = build_enemy_list(master_data["bosses"], gate_points)

    ledger_rows = load_ledger(initial_balance_eok)
    current_balance = calculate_balance_eok(ledger_rows)

    st.title("📚 웹소설 네비게이터")
    st.markdown('<div class="constitution-tag">설정 프로파일: Story Bible Project Constitution v1.0</div>', unsafe_allow_html=True)
    st.caption("휴대폰 화면에서도 확인하기 쉽도록 모바일 대응 레이아웃을 적용했습니다.")

    with st.sidebar:
        st.subheader("활성 데이터 소스")
        st.write(f"마스터: `{Path(config.get('master_file', '')).name}`")
        st.write(f"스토리: `{Path(config.get('story_file', '')).name}`")
        story_zip = config.get("story_bible_zip")
        st.write(f"스토리바이블 ZIP: `{Path(story_zip).name if story_zip else '미등록'}`")
        if st.button("데이터 새로고침", use_container_width=True):
            st.rerun()

    tab_overview, tab_character, tab_relation, tab_ops, tab_files = st.tabs(
        ["개요", "인물 네비게이터", "인물 관계도", "이슈/투자/적", "파일 업데이트"]
    )

    with tab_overview:
        st.subheader("프로젝트 개요")
        col1, col2, col3 = st.columns(3)
        project = master_data["project"]
        col1.metric("스토리 상태", project.get("Story Status", "N/A"))
        col2.metric("회귀 시작 시점", project.get("Timeline Start", "N/A"))
        col3.metric("원래 타임라인", project.get("Original Timeline", "N/A"))

        st.markdown("#### 에피소드 진행")
        render_simple_table(master_data["episodes"], column_labels={"episode": "에피소드", "status": "상태"})
        st.markdown("#### 에피소드 요약")
        render_simple_table(story_data["timeline"], column_labels={"episode": "에피소드", "summary": "요약"})

    with tab_character:
        st.subheader("인물 선택")
        names = [char["name"] for char in character_rows]
        selected_name = st.selectbox("인물을 선택하세요", options=names)
        selected_character = next(char for char in character_rows if char["name"] == selected_name)

        left, right = st.columns([1, 1])
        with left:
            st.markdown("#### 기본 정보")
            st.write(f"ID: {selected_character['id']}")
            st.write(f"역할: {selected_character['role']}")
            st.write(f"첫 등장: {selected_character['first_ep']}")
            st.write(f"미래 역할: {selected_character['future_role']}")
            st.write(f"생존 여부: {selected_character['alive']}")
            st.write(f"보스 플래그: {selected_character['boss']}")
        with right:
            st.markdown("#### 상세 노트")
            if selected_character["details"]:
                for detail in selected_character["details"]:
                    st.markdown(f"- {detail}")
            else:
                st.markdown(f"- {selected_character['notes']}")

        st.markdown("#### 전체 인물 목록")
        character_rows_for_table = []
        for row in character_rows:
            character_rows_for_table.append(
                {
                    "id": row["id"],
                    "name": row["name"],
                    "role": row["role"],
                    "first_ep": row["first_ep"],
                    "future_role": row["future_role"],
                    "alive": row["alive"],
                    "boss": row["boss"],
                    "details": row.get("details", []),
                }
            )
        render_simple_table(
            character_rows_for_table,
            column_labels={
                "id": "ID",
                "name": "이름",
                "role": "역할",
                "first_ep": "첫 등장",
                "future_role": "미래 역할",
                "alive": "생존",
                "boss": "보스 플래그",
                "details": "상세",
            },
        )

    with tab_relation:
        st.subheader("인물 관계도")
        st.caption("핵심 관계를 중심으로 빠르게 파악할 수 있는 관계 그래프입니다.")
        render_relation_graph()

    with tab_ops:
        issue_tab, invest_tab, enemy_tab = st.tabs(["중요 이슈", "투자/통장잔고", "적 리스트"])

        with issue_tab:
            st.markdown("#### 중요 이슈")
            render_simple_table(
                important_issues,
                column_labels={
                    "category": "분류",
                    "priority": "우선순위",
                    "issue": "이슈",
                    "action": "대응",
                },
            )

        with invest_tab:
            st.markdown("#### 투자 로드맵")
            render_simple_table(
                master_data["investments"],
                column_labels={"phase": "단계", "capital": "자본", "goal": "목표", "status": "상태"},
            )
            st.metric("현재 통장잔고(억 원)", f"{current_balance:.2f}")

            with st.form("ledger_form", clear_on_submit=True):
                date = st.date_input("거래일")
                transaction_type = st.selectbox("거래 유형", options=["입금", "출금"])
                amount = st.number_input("금액(억 원)", min_value=0.0, step=0.1)
                note = st.text_input("메모", value="")
                submitted = st.form_submit_button("거래 추가")
                if submitted and amount > 0:
                    ledger_rows.append(
                        {
                            "date": str(date),
                            "type": transaction_type,
                            "amount_eok": float(amount),
                            "note": note,
                        }
                    )
                    save_ledger(ledger_rows)
                    st.success("거래가 저장되었습니다.")
                    st.rerun()

            st.markdown("#### 거래 내역")
            render_simple_table(
                list(reversed(ledger_rows)),
                column_labels={"date": "거래일", "type": "유형", "amount_eok": "금액(억)", "note": "메모"},
            )

        with enemy_tab:
            st.markdown("#### 적 목록")
            render_simple_table(
                enemy_rows,
                column_labels={"name": "이름", "type": "유형", "status": "상태", "note": "설명"},
            )

    with tab_files:
        st.subheader("스토리 파일 업데이트")
        st.caption("모바일 안정 모드(기본): 텍스트/경로 저장 방식으로 파일을 갱신합니다.")

        st.markdown("#### 마스터 파일 본문 저장")
        master_default_text = read_text(config.get("master_file", ""))
        master_text = st.text_area(
            "마스터 파일 내용 (MD)",
            value=master_default_text,
            height=220,
            key="master_text_editor",
        )
        if st.button("마스터 본문 저장 및 적용", key="save_master_text"):
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            target = MASTER_UPLOAD_DIR / f"{timestamp}_master_from_text.md"
            target.write_text(master_text, encoding="utf-8")
            config["master_file"] = str(target)
            save_active_config(config)
            st.success(f"마스터 본문 저장 완료: {target.name}")
            st.rerun()

        st.markdown("#### 스토리 파일 본문 저장")
        story_default_text = read_text(config.get("story_file", ""))
        story_text = st.text_area(
            "스토리 파일 내용 (MD)",
            value=story_default_text,
            height=220,
            key="story_text_editor",
        )
        if st.button("스토리 본문 저장 및 적용", key="save_story_text"):
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            target = STORY_UPLOAD_DIR / f"{timestamp}_story_from_text.md"
            target.write_text(story_text, encoding="utf-8")
            config["story_file"] = str(target)
            save_active_config(config)
            st.success(f"스토리 본문 저장 완료: {target.name}")
            st.rerun()

        st.markdown("#### 스토리바이블 ZIP 경로/링크 저장")
        zip_hint = config.get("story_bible_zip", "")
        zip_ref = st.text_input(
            "ZIP 파일 경로 또는 URL",
            value=zip_hint,
            placeholder="예: /workspace/data/uploads/zip/story_bible.zip 또는 https://...",
            key="zip_ref_input",
        )
        if st.button("ZIP 참조 저장 및 적용", key="save_zip_ref"):
            config["story_bible_zip"] = zip_ref.strip()
            save_active_config(config)
            st.success("ZIP 참조가 저장되었습니다.")
            st.rerun()

        st.markdown("---")
        st.markdown("#### 고급 업로드 모드 (PC 권장)")
        st.caption("일부 모바일+터널 환경에서는 파일 업로드 컴포넌트 로딩 오류가 발생할 수 있습니다.")
        enable_advanced_upload = st.toggle("고급 업로드 모드 사용", value=False, key="advanced_upload_toggle")
        if enable_advanced_upload:
            uploaded_master = st.file_uploader("마스터 MD 업로드", type=["md"], key="master_upload")
            if uploaded_master is not None and st.button("마스터 파일 저장 및 적용", key="save_master"):
                saved_path = save_uploaded_file(uploaded_master, MASTER_UPLOAD_DIR)
                config["master_file"] = str(saved_path)
                save_active_config(config)
                st.success(f"마스터 파일 적용 완료: {saved_path.name}")
                st.rerun()

            uploaded_story = st.file_uploader("스토리 파일 업로드 (MD)", type=["md"], key="story_upload")
            if uploaded_story is not None and st.button("스토리 파일 저장 및 적용", key="save_story"):
                saved_path = save_uploaded_file(uploaded_story, STORY_UPLOAD_DIR)
                config["story_file"] = str(saved_path)
                save_active_config(config)
                st.success(f"스토리 파일 적용 완료: {saved_path.name}")
                st.rerun()

            uploaded_zip = st.file_uploader("Story Bible ZIP 업로드", type=["zip"], key="zip_upload")
            if uploaded_zip is not None and st.button("ZIP 저장 및 적용", key="save_zip"):
                saved_path = save_uploaded_file(uploaded_zip, ZIP_UPLOAD_DIR)
                config["story_bible_zip"] = str(saved_path)
                save_active_config(config)
                st.success(f"ZIP 적용 완료: {saved_path.name}")
                st.rerun()

        st.markdown("#### 활성 파일 수동 선택")
        master_candidates = available_files(config.get("master_file", ""), MASTER_UPLOAD_DIR, (".md",))
        story_candidates = available_files(config.get("story_file", ""), STORY_UPLOAD_DIR, (".md",))
        zip_candidates = available_files(config.get("story_bible_zip", ""), ZIP_UPLOAD_DIR, (".zip",))

        selected_master = st.selectbox(
            "활성 마스터 파일",
            options=master_candidates if master_candidates else [config.get("master_file", "")],
            format_func=lambda x: Path(x).name if x else "선택 없음",
        )
        selected_story = st.selectbox(
            "활성 스토리 파일 (MD)",
            options=story_candidates if story_candidates else [config.get("story_file", "")],
            format_func=lambda x: Path(x).name if x else "선택 없음",
        )
        selected_zip = st.selectbox(
            "활성 Story Bible ZIP",
            options=zip_candidates if zip_candidates else [config.get("story_bible_zip", "")],
            format_func=lambda x: Path(x).name if x else "선택 없음",
        )

        if st.button("선택한 파일로 활성 설정 저장"):
            config["master_file"] = selected_master
            config["story_file"] = selected_story
            config["story_bible_zip"] = selected_zip
            save_active_config(config)
            st.success("활성 파일 구성이 저장되었습니다.")
            st.rerun()


if __name__ == "__main__":
    main()
