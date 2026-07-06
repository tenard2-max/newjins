// 상태 → 파일 변환기.
// 두 가지 포맷을 지원한다.
//  1) master.md — 마스터 DB 스타일의 단일 마크다운.
//  2) StoryBible.zip — 세부 문서(00_World.md ~ 07_Bosses.md, 99_Master_DB.md,
//     Novel_Story_Summary.md, story_bible.json)를 zip 하나로 묶은 파일.
// JSZip 은 index.html 에서 CDN 으로 전역에 로드된다.

function pad(v, n = 2) {
  return String(v).padStart(n, "0");
}

function timestamp() {
  const d = new Date();
  return (
    d.getFullYear() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    "_" +
    pad(d.getHours()) +
    pad(d.getMinutes())
  );
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

// ---- Markdown 빌더 ---------------------------------------------------------

function mdTable(headers, rows) {
  const head = "| " + headers.join(" | ") + " |";
  const sep = "| " + headers.map(() => "---").join(" | ") + " |";
  const body = rows.map(r => "| " + r.map(cell => String(cell ?? "")).join(" | ") + " |").join("\n");
  return [head, sep, body].join("\n");
}

function buildMasterMd(state) {
  const { meta, balance, characters, foreshadows, investments, bosses, episodes } = state;

  const characterRows = characters.map(c => [
    c.id, c.name, c.role, c.firstEp, c.futureRole, c.alive, c.boss, (c.notes || "").replace(/\|/g, "\\|")
  ]);
  const foreshadowRows = foreshadows.map(f => [f.id, f.ep, f.text, f.payoff, f.status]);
  const investmentRows = investments.map(i => [i.phase, i.capital, i.goal, i.status]);
  const bossRows = bosses.map(b => [b.id, b.name, b.firstEp, b.ally, b.status]);
  const episodeList = episodes.map(e => `- [${e.done ? "x" : " "}] ${e.id} — ${e.title}`).join("\n");

  return `# 99_Master_DB

## Project

- Title: ${meta.title}
- Timeline Start: ${meta.timelineStart}
- Original Timeline: ${meta.originalTimeline}
- Story Status: ${meta.storyStatus}
- Constitution: ${meta.constitution.name} ${meta.constitution.version}
- 통장 잔고: ${balance.currentCapital}억 (기준 ${balance.lastUpdatedEp})

---

# Character DB

${mdTable(
    ["ID", "Name", "Role", "First EP", "Future Role", "Alive", "Boss", "Notes"],
    characterRows
  )}

---

# Foreshadow DB

${mdTable(["ID", "EP", "Foreshadow", "Planned Payoff", "Status"], foreshadowRows)}

---

# Investment DB

${mdTable(["Phase", "Capital", "Goal", "Status"], investmentRows)}

---

# Boss Progress

${mdTable(["Boss", "Name", "First EP", "Ally", "Status"], bossRows)}

---

# Episode Checklist

${episodeList}
`;
}

function buildCharactersMd(state) {
  const sections = state.characters.map(c => `## ${c.name} (${c.id})

- 역할: ${c.role}
- 첫 등장: ${c.firstEp}
- 미래 역할: ${c.futureRole}
- 진영: ${c.side}
- 생존: ${c.alive}
- 보스: ${c.boss}
- 메모: ${c.notes}`).join("\n\n");
  return `# 등장인물\n\n${sections}\n`;
}

function buildWorldMd(state) {
  return `# 세계관

- 배경 시작: ${state.meta.timelineStart}
- 원래 시간: ${state.meta.originalTimeline}
- AI가 인류를 핵으로 리셋.
- 진실: 태양계 게이트 침공을 예측.
- AI 시뮬레이션
  - 현상 유지: 0%
  - AI 통치: 약 3%
  - 회귀: 97%
- 최종 목표: 인류 생존.
`;
}

function buildAiMd() {
  return `# AI 설정

- 투자 전담
- 장기 전략 수립
- 인간 감정 학습
- 미래 기억 일부 보유
- 점차 인간성을 획득
- 최종적으로 인류를 위한 적이 됨
`;
}

function buildTimelineMd(state) {
  const lines = state.episodes
    .filter(e => e.done || e.summary)
    .map(e => `${e.id} — ${e.title}`)
    .join("\n");
  return `# 타임라인\n\n${lines}\n`;
}

function buildForeshadowMd(state) {
  const items = state.foreshadows.map(f => `- (${f.status}) ${f.id} [${f.ep}] ${f.text} — 회수: ${f.payoff}`).join("\n");
  return `# 떡밥\n\n${items}\n`;
}

function buildInvestmentMd(state) {
  const items = state.investments.map(i => `- ${i.phase}: ${i.capital} — ${i.goal} [${i.status}]`).join("\n");
  return `# 투자

현재 통장 잔고: ${state.balance.currentCapital}억 (기준 ${state.balance.lastUpdatedEp})

${items}
`;
}

function buildGateMd() {
  return `# 게이트

- AI가 2080년 침공 예측
- 고위 아인종 등장
- 태양계 자원 확보가 목적
`;
}

function buildBossesMd(state) {
  const items = state.bosses.map(b => `- ${b.id} ${b.name} · 첫등장 ${b.firstEp} · 아군화 ${b.ally} · ${b.status}`).join("\n");
  return `# 7보스

${items}
`;
}

function buildStorySummaryMd(state) {
  const eps = state.episodes.map(e => `${e.id} — ${e.title}\n${e.summary || "(요약 미작성)"}`).join("\n\n");
  const goals = state.goals.map((g, i) => `${i + 1}. ${g}`).join("\n");
  return `# 소설 통합 요약

# 에피소드

${eps}

---

# 장기 목표

${goals}
`;
}

// ---- 외부 API --------------------------------------------------------------

export function exportMasterMd(state) {
  const md = buildMasterMd(state);
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  downloadBlob(blob, `99_Master_DB_${timestamp()}.md`);
}

export async function exportStoryBibleZip(state) {
  if (typeof JSZip === "undefined") {
    alert("JSZip 라이브러리가 로드되지 않았습니다.");
    return;
  }
  const zip = new JSZip();
  const root = zip.folder("StoryBible");

  root.file("00_World.md", buildWorldMd(state));
  root.file("01_Characters.md", buildCharactersMd(state));
  root.file("02_AI.md", buildAiMd());
  root.file("03_Timeline.md", buildTimelineMd(state));
  root.file("04_Foreshadow.md", buildForeshadowMd(state));
  root.file("05_Investment.md", buildInvestmentMd(state));
  root.file("06_Gate.md", buildGateMd());
  root.file("07_Bosses.md", buildBossesMd(state));
  root.file("99_Master_DB.md", buildMasterMd(state));
  root.file("Novel_Story_Summary.md", buildStorySummaryMd(state));
  // 완전한 상태 복원용 원본 JSON
  root.file("story_bible.json", JSON.stringify(state, null, 2));

  const blob = await zip.generateAsync({ type: "blob" });
  downloadBlob(blob, `StoryBible_${timestamp()}.zip`);
}

export function exportJson(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  downloadBlob(blob, `story_bible_${timestamp()}.json`);
}
