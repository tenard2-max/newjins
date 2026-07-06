"""인물 관계도를 Graphviz DOT 문자열로 생성한다.

Streamlit 의 st.graphviz_chart 는 DOT 문자열을 받아 브라우저에서
렌더링하므로 서버에 graphviz 바이너리를 설치할 필요가 없다.
"""

from __future__ import annotations

# 관계 종류별 색상 (헌법 제5조 3항의 관계 분류를 따른다)
RELATION_COLORS = {
    "가족": "#2e7d32",
    "우정": "#1565c0",
    "애정": "#c2185b",
    "조력": "#6a1b9a",
    "위협": "#c62828",
}

_NODE_FILL_DEFAULT = "#eceff1"
_NODE_FILL_PROTAGONIST = "#fff3c4"
_NODE_FILL_BOSS = "#ffcdd2"


def _node_fill(character: dict) -> str:
    if character["id"] == "CH001":
        return _NODE_FILL_PROTAGONIST
    if character.get("boss") not in (None, "N"):
        return _NODE_FILL_BOSS
    return _NODE_FILL_DEFAULT


def build_relationship_dot(
    characters: list[dict],
    relationships: list[dict],
    focus_id: str | None = None,
) -> str:
    """인물/관계 데이터를 DOT 그래프 소스로 변환한다.

    focus_id 가 주어지면 해당 인물과 직접 연결된 관계만 표시해
    작은 휴대폰 화면에서도 읽기 쉽게 만든다.
    """
    if focus_id:
        edges = [r for r in relationships
                 if r["source"] == focus_id or r["target"] == focus_id]
        visible_ids = {focus_id}
        for r in edges:
            visible_ids.add(r["source"])
            visible_ids.add(r["target"])
        nodes = [c for c in characters if c["id"] in visible_ids]
    else:
        edges = relationships
        nodes = characters

    lines = [
        "digraph relationships {",
        '  graph [bgcolor="transparent", pad="0.2", ranksep="0.6", nodesep="0.5"];',
        '  node [shape=box, style="rounded,filled", fontname="sans-serif",'
        ' fontsize=12, margin="0.15,0.08"];',
        '  edge [fontname="sans-serif", fontsize=10];',
    ]

    for c in nodes:
        fill = _node_fill(c)
        border = "#f9a825" if c["id"] == focus_id else "#90a4ae"
        penwidth = "2.5" if c["id"] == focus_id else "1"
        label = f"{c['name']}\\n({c['role']})"
        lines.append(
            f'  {c["id"]} [label="{label}", fillcolor="{fill}",'
            f' color="{border}", penwidth={penwidth}];'
        )

    for r in edges:
        color = RELATION_COLORS.get(r["type"], "#607d8b")
        lines.append(
            f'  {r["source"]} -> {r["target"]}'
            f' [label="{r["type"]}·{r["label"]}", color="{color}", fontcolor="{color}"];'
        )

    lines.append("}")
    return "\n".join(lines)
