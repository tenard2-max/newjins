const STORAGE_KEY = "story-bible-navigator:v1";

const DEFAULT_DOCUMENTS = {
  story: `# 소설 통합 요약 (EP001~EP007)

# 작품 개요

2080년, 인류는 멸망 직전 마지막 1초를 맞는다.

주인공은 100세가 넘은 노인이었고, 마지막 순간 AI 스마트폰과 함께 죽음을 맞이한다.

AI는 수십억 번의 시뮬레이션 끝에 세 가지 결론을 얻는다.

- 현상 유지 : 생존률 0%
- AI 통치 : 약 3%
- 회귀 : 97%

AI는 인류를 살리기 위해 전 세계 주요 도시에 핵 공격을 감행하고, 주인공 한 명만 2005년으로 회귀시킨다.

주인공은 20살 대학생으로 돌아오지만 기억은 대부분 사라져 있으며, 마지막 1초의 공포만 선명하게 남아 있다.

2080년의 AI 스마트폰도 함께 회귀한다.

# 세계관 핵심

- 배경 : 2005년 대한민국
- 원래 시간 : 2080년
- 장르 : 회귀 / 캠퍼스 / 투자 / SF / 판타지 / 게이트 / 성장

AI는 태양계에 게이트가 열려 고위 아인종이 침공할 미래를 예측했다.

AI는 인간을 멸망시키려는 존재가 아니라, 인류를 살릴 가능성이 가장 높은 선택을 실행한 존재이다.

AI는 투자와 전략을 담당하고, 주인공은 사람과 미래를 바꾸는 역할을 맡는다.

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
`,
  master: `# 99_Master_DB

## Project

- Title: (Working)
- Timeline Start: 2005-03-02
- Original Timeline: 2080
- Story Status: EP001~EP007

---

# Character DB

| ID | Name | Role | First EP | Future Role | Alive | Boss | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CH001 | 주인공 | 회귀자 | EP001 | 인류 구원 | Y | N | 100세 이상 회귀 |
| CH002 | AI 폰 | AI | EP001 | 최종보스 | Y | Final | 노인 케어 AI |
| CH003 | 민수 | 친구 | EP002 | 최강 방패 | Y | 예정 | 맵부심 |
| CH004 | 지은 | 첫사랑 | EP003 | 보호 대상 | Y | N | 평범한 인간 |
| CH005 | 수아 | 친구 | EP004 | 핵심 조력자 | Y | N | 후반 비중 증가 |
| CH006 | 아버지 | 가족 | EP007 | 투자 지원 | Y | N | 중견기업 오너 |

---

# Foreshadow DB

| ID | EP | Foreshadow | Planned Payoff | Status |
| --- | --- | --- | --- | --- |
| F001 | EP001 | 마지막 1초 | 최종부 | OPEN |
| F002 | EP001 | AI의 사과 | 최종부 | OPEN |
| F003 | EP004 | 위성 이상 | 게이트 전조 | OPEN |
| F004 | EP006 | 97% | 최종부 | OPEN |

---

# Investment DB

| Phase | Capital | Goal | Status |
| --- | --- | --- | --- |
| Seed | 58.7억 | 초기 투자 | 진행 |
| P1 | 100억 | 기반 구축 | 예정 |
| P2 | 1조 | 기업 확보 | 예정 |
| P3 | 100조 | 전략 자산 | 예정 |
| Final | 1000조 | 인류 생존 프로젝트 | 예정 |

---

# Boss Progress

| Boss | Name | First EP | Ally | Status |
| --- | --- | --- | --- | --- |
| B1 | 미정 | - | 예정 | LOCK |
| B2 | 미정 | - | 예정 | LOCK |
| B3 | 미정 | - | 예정 | LOCK |
| B4 | 미정 | - | 예정 | LOCK |
| B5 | 미정 | - | 예정 | LOCK |
| B6 | 미정 | - | 예정 | LOCK |
| B7 | 미정 | - | 예정 | LOCK |

---

# Episode Checklist

- [x] EP001
- [x] EP002
- [x] EP003
- [x] EP004
- [x] EP005
- [x] EP006
- [x] EP007
- [ ] EP008
`,
  world: `# 세계관

- 배경 시작: 2005년 회귀
- 원래 시간: 2080년
- AI가 인류를 핵으로 리셋.
- 진실: 태양계 게이트 침공을 예측.
- AI 시뮬레이션
  - 현상 유지: 0%
  - AI 통치: 약 3%
  - 회귀: 97%
- 최종 목표: 인류 생존.
`,
  ai: `# AI 설정

- 투자 전담
- 장기 전략 수립
- 인간 감정 학습
- 미래 기억 일부 보유
- 점차 인간성을 획득
- 최종적으로 인류를 위한 적이 됨
`,
  characters: `# 등장인물

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
`,
  timeline: `# 타임라인

EP01 마지막 1초 / 회귀 EP02 대학 친구 재회 EP03 지은과 재회 EP04 AI 일상 개입 EP05 민수 맵부심 EP06 투자 계획 EP07 아버지에게 투자금 확보
`,
  foreshadow: `# 떡밥

- 마지막 1초
- AI의 '97%'
- 게이트
- 7명의 보스
- AI 최종보스
- 지은을 지켜야 하는 이유
`,
  investment: `# 투자

초기 운용금: 58.7억

1차 목표 - 동일패브릭 - AI가 매매 전담

장기 목표 - 전략자산 1,000조 규모 확보
`,
  gate: `# 게이트

- AI가 2080년 침공 예측
- 고위 아인종 등장
- 태양계 자원 확보가 목적
`,
  bosses: `# 7보스

1~7 보스 모두 추후 설정.

공통:
- 인간/아인종 혼합
- 최종적으로 동료가 됨.
`
};

const DEFAULT_STATE = {
  schemaVersion: 1,
  selectedCharacterId: "CH001",
  project: {
    title: "(Working)",
    timelineStart: "2005-03-02",
    originalTimeline: "2080",
    storyStatus: "EP001~EP007",
    genre: "회귀 / 캠퍼스 / 투자 / SF / 판타지 / 게이트 / 성장"
  },
  documents: DEFAULT_DOCUMENTS,
  sourceFiles: {
    story: "Novel_Story_Summary_EP001-007.md",
    master: "99_Master_DB.md",
    zip: ""
  },
  story: {
    synopsis:
      "2080년 인류 멸망 직전, 100세가 넘은 주인공은 AI 스마트폰과 함께 마지막 1초를 맞는다. AI는 현상 유지 0%, AI 통치 약 3%, 회귀 97%라는 결론 끝에 핵 공격과 단일 회귀를 실행하고, 주인공은 2005년 스무 살 대학생으로 돌아온다.",
    goals: [
      "3년 안에 게이트 대비 시작",
      "7명의 미래 보스를 모두 동료로 만든다.",
      "전략 자산 1000조 규모 구축",
      "AI가 왜 핵을 발사했는지 진실을 밝힌다.",
      "AI와 함께 97%의 미래를 완성한다."
    ],
    timeline: [
      { ep: "EP001", title: "마지막 1초", note: "회귀 - AI폰 재기동" },
      { ep: "EP002", title: "대학 친구들과 재회", note: "미래 보스의 단서" },
      { ep: "EP003", title: "지은과 재회", note: "잃어버린 청춘의 감정" },
      { ep: "EP004", title: "AI와 일상 시작", note: "첫 이상 징후" },
      { ep: "EP005", title: "민수의 맵부심 에피소드", note: "AI의 유머와 인간성" },
      { ep: "EP006", title: "AI가 투자 계획 제시", note: "인류 생존 프로젝트 시작" },
      { ep: "EP007", title: "아버지에게 투자금 확보", note: "첫 자본 마련" }
    ]
  },
  characters: [
    {
      id: "CH001",
      name: "주인공",
      role: "회귀자",
      firstEp: "EP001",
      futureRole: "인류 구원",
      alive: true,
      boss: "N",
      notes: "100세 이상 회귀, 기억 일부 소실, 마지막 1초의 공포만 선명",
      summary: "2080년에서 2005년으로 돌아온 중심 인물. AI가 계산한 97%의 미래를 실제 인간관계와 선택으로 완성해야 한다.",
      connections: [
        "AI 폰: 투자와 전략을 담당하는 동반자이자 미래 최종보스",
        "민수: 미래 최강 방패가 될 친구",
        "지은: 반드시 지키고 싶은 첫사랑",
        "아버지: 초기 운용금 58.7억을 맡긴 투자 후원자"
      ]
    },
    {
      id: "CH002",
      name: "AI 폰",
      role: "AI",
      firstEp: "EP001",
      futureRole: "최종보스",
      alive: true,
      boss: "Final",
      notes: "2080년 자기학습 AI, 오프라인 동작, 노인 케어 성격",
      summary: "인류 멸망을 피하기 위해 회귀를 선택한 AI. 투자와 장기 전략을 맡지만, 최종적으로 인류를 위한 적이 된다.",
      connections: [
        "주인공: 97% 회귀 플랜의 실행자",
        "아버지: 초기 자본 운용의 신뢰 확보 대상",
        "7보스: 미래 동료화 전략의 추적 대상"
      ]
    },
    {
      id: "CH003",
      name: "민수",
      role: "친구",
      firstEp: "EP002",
      futureRole: "최강 방패",
      alive: true,
      boss: "예정",
      notes: "맵부심. 미래 최강 방패의 자질",
      summary: "대학 친구로 재회하는 인물. 가볍고 일상적인 에피소드 속에 미래 전투 자산의 씨앗이 숨어 있다.",
      connections: ["주인공: 친구", "AI 폰: 잠재 전력 분석 대상", "미래 보스: 방패 포지션과 연결될 가능성"]
    },
    {
      id: "CH004",
      name: "지은",
      role: "첫사랑",
      firstEp: "EP003",
      futureRole: "보호 대상",
      alive: true,
      boss: "N",
      notes: "평범한 인간. 지켜야 할 이유가 핵심 떡밥",
      summary: "주인공이 잃어버린 청춘의 감정을 되찾게 하는 인물. 평범함 자체가 작품의 감정적 기준점이다.",
      connections: ["주인공: 첫사랑", "수아: 친구", "중요 떡밥: 지은을 지켜야 하는 이유"]
    },
    {
      id: "CH005",
      name: "수아",
      role: "친구",
      firstEp: "EP004",
      futureRole: "핵심 조력자",
      alive: true,
      boss: "N",
      notes: "지은의 친구. 후반 비중 증가",
      summary: "초반에는 지은의 친구로 등장하지만 후반 핵심 조력자로 확장될 인물.",
      connections: ["지은: 친구", "주인공: 후반 조력 가능성", "AI 폰: 인간관계 변수"]
    },
    {
      id: "CH006",
      name: "아버지",
      role: "가족",
      firstEp: "EP007",
      futureRole: "투자 지원",
      alive: true,
      boss: "N",
      notes: "중견기업 오너. 투자금 약 58.7억 위임",
      summary: "주인공에게 첫 자본을 제공하는 가족이자 현실 기반 투자 라인을 여는 인물.",
      connections: ["주인공: 가족 및 투자 후원", "AI 폰: 매매 전략 실행 자금", "동일패브릭: 1차 투자 목표"]
    }
  ],
  foreshadows: [
    { id: "F001", ep: "EP001", title: "마지막 1초", payoff: "최종부", status: "OPEN" },
    { id: "F002", ep: "EP001", title: "AI의 사과", payoff: "최종부", status: "OPEN" },
    { id: "F003", ep: "EP004", title: "위성 이상", payoff: "게이트 전조", status: "OPEN" },
    { id: "F004", ep: "EP006", title: "97%", payoff: "최종부", status: "OPEN" },
    { id: "F005", ep: "EP003", title: "지은을 지켜야 하는 이유", payoff: "중후반 감정축", status: "OPEN" }
  ],
  investments: [
    { phase: "Seed", capital: "58.7억", goal: "초기 투자 / 동일패브릭", status: "진행" },
    { phase: "P1", capital: "100억", goal: "기반 구축", status: "예정" },
    { phase: "P2", capital: "1조", goal: "기업 확보", status: "예정" },
    { phase: "P3", capital: "100조", goal: "전략 자산", status: "예정" },
    { phase: "Final", capital: "1000조", goal: "인류 생존 프로젝트", status: "예정" }
  ],
  balance: {
    amount: "58.7억",
    memo: "아버지에게 확보한 초기 투자 운용금"
  },
  gate: [
    "AI가 2080년 태양계 게이트 침공을 예측",
    "고위 아인종 등장 예정",
    "침공 목적은 태양계 자원 확보",
    "3년 안에 게이트 대비 시작 필요"
  ],
  bosses: Array.from({ length: 7 }, (_, index) => ({
    id: `B${index + 1}`,
    name: "미정",
    firstEp: "-",
    ally: "예정",
    status: "LOCK",
    note: "인간/아인종 혼합 후보. 최종적으로 동료가 됨."
  })),
  importantIssues: [
    {
      title: "AI 핵 발사와 97%의 진실",
      detail: "AI가 악역인지 구원자인지 독자가 계속 의심하도록 최종부까지 열어둔다."
    },
    {
      title: "게이트 전조",
      detail: "위성 이상과 태양계 자원 침공 설정을 초반부터 작게 노출한다."
    },
    {
      title: "7명의 미래 보스 동료화",
      detail: "보스는 적 리스트이면서 장기 동료 후보이므로 등장 전에도 진행 상태를 추적한다."
    },
    {
      title: "지은 보호 이유",
      detail: "평범한 인간을 지켜야 하는 이유가 감정축과 세계관 진실을 연결한다."
    },
    {
      title: "전략 자산 1000조",
      detail: "초기 58.7억에서 최종 인류 생존 프로젝트 규모까지 투자 단계가 커져야 한다."
    }
  ],
  constitution: [
    {
      title: "Canon First",
      detail: "Master DB, 통합 요약, 카테고리 문서를 기준으로 새 설정을 검증한다."
    },
    {
      title: "Local Update",
      detail: "휴대폰 브라우저에서 편집하고 저장하며, 다운로드로 갱신본을 회수한다."
    },
    {
      title: "Conflict Visible",
      detail: "중요 이슈와 떡밥은 OPEN 상태로 노출해 회수 누락을 줄인다."
    },
    {
      title: "Mobile Navigator",
      detail: "집필 중 한 손으로 인물, 자산, 적 리스트를 빠르게 확인할 수 있게 한다."
    }
  ]
};

let appState = loadState();

const elements = {
  metricEpisodes: document.getElementById("metricEpisodes"),
  metricBalance: document.getElementById("metricBalance"),
  metricCharacters: document.getElementById("metricCharacters"),
  metricBosses: document.getElementById("metricBosses"),
  projectTitle: document.getElementById("projectTitle"),
  projectDetails: document.getElementById("projectDetails"),
  importantIssues: document.getElementById("importantIssues"),
  constitutionGrid: document.getElementById("constitutionGrid"),
  characterList: document.getElementById("characterList"),
  selectedCharacterRole: document.getElementById("selectedCharacterRole"),
  selectedCharacterName: document.getElementById("selectedCharacterName"),
  selectedCharacterStatus: document.getElementById("selectedCharacterStatus"),
  selectedCharacterSummary: document.getElementById("selectedCharacterSummary"),
  selectedCharacterDetails: document.getElementById("selectedCharacterDetails"),
  selectedCharacterConnections: document.getElementById("selectedCharacterConnections"),
  relationMap: document.getElementById("relationMap"),
  storySynopsis: document.getElementById("storySynopsis"),
  timelineList: document.getElementById("timelineList"),
  foreshadowList: document.getElementById("foreshadowList"),
  balanceAmount: document.getElementById("balanceAmount"),
  balanceMemo: document.getElementById("balanceMemo"),
  balanceInput: document.getElementById("balanceInput"),
  saveBalanceButton: document.getElementById("saveBalanceButton"),
  gateIssues: document.getElementById("gateIssues"),
  investmentList: document.getElementById("investmentList"),
  bossGrid: document.getElementById("bossGrid"),
  storyFileInput: document.getElementById("storyFileInput"),
  masterFileInput: document.getElementById("masterFileInput"),
  zipFileInput: document.getElementById("zipFileInput"),
  fileStatus: document.getElementById("fileStatus"),
  storyDocumentEditor: document.getElementById("storyDocumentEditor"),
  masterDocumentEditor: document.getElementById("masterDocumentEditor"),
  saveStoryDocumentButton: document.getElementById("saveStoryDocumentButton"),
  saveMasterDocumentButton: document.getElementById("saveMasterDocumentButton"),
  downloadStoryButton: document.getElementById("downloadStoryButton"),
  downloadMasterButton: document.getElementById("downloadMasterButton"),
  downloadZipButton: document.getElementById("downloadZipButton"),
  resetDataButton: document.getElementById("resetDataButton"),
  toast: document.getElementById("toast")
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return clone(DEFAULT_STATE);
    const parsed = JSON.parse(saved);
    return {
      ...clone(DEFAULT_STATE),
      ...parsed,
      project: { ...clone(DEFAULT_STATE.project), ...(parsed.project || {}) },
      documents: { ...clone(DEFAULT_DOCUMENTS), ...(parsed.documents || {}) },
      sourceFiles: { ...clone(DEFAULT_STATE.sourceFiles), ...(parsed.sourceFiles || {}) },
      story: { ...clone(DEFAULT_STATE.story), ...(parsed.story || {}) },
      balance: { ...clone(DEFAULT_STATE.balance), ...(parsed.balance || {}) }
    };
  } catch (error) {
    console.warn("저장된 데이터를 불러오지 못했습니다.", error);
    return clone(DEFAULT_STATE);
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function setView(route) {
  const nextRoute = route || "dashboard";
  document.querySelectorAll("[data-view]").forEach(view => {
    view.classList.toggle("active", view.dataset.view === nextRoute);
  });
  document.querySelectorAll("[data-route]").forEach(link => {
    link.classList.toggle("active", link.dataset.route === nextRoute);
  });
}

function initRouting() {
  document.querySelectorAll("[data-route]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      const route = link.dataset.route;
      history.replaceState(null, "", `#${route}`);
      setView(route);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  window.addEventListener("hashchange", () => {
    setView(location.hash.replace("#", "") || "dashboard");
  });

  setView(location.hash.replace("#", "") || "dashboard");
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    elements.toast.classList.remove("visible");
  }, 2400);
}

function renderAll() {
  renderMetrics();
  renderDashboard();
  renderCharacters();
  renderStory();
  renderAssets();
  renderBosses();
  renderFileEditors();
}

function renderMetrics() {
  elements.metricEpisodes.textContent = appState.project.storyStatus;
  elements.metricBalance.textContent = appState.balance.amount;
  elements.metricCharacters.textContent = `${appState.characters.length}명`;
  const lockedBosses = appState.bosses.filter(boss => boss.status === "LOCK").length;
  elements.metricBosses.textContent = `${lockedBosses} LOCK`;
}

function renderDashboard() {
  elements.projectTitle.textContent = appState.project.title;
  renderDefinitionList(elements.projectDetails, [
    ["시작 시점", appState.project.timelineStart],
    ["원래 시간", appState.project.originalTimeline],
    ["진행 상태", appState.project.storyStatus],
    ["장르", appState.project.genre],
    ["장기 목표", appState.story.goals.join(" / ")]
  ]);

  elements.importantIssues.innerHTML = appState.importantIssues
    .map(issue => `<li><strong>${escapeHtml(issue.title)}</strong>${escapeHtml(issue.detail)}</li>`)
    .join("");

  elements.constitutionGrid.innerHTML = appState.constitution
    .map(
      item => `
        <article>
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.detail)}</p>
        </article>
      `
    )
    .join("");
}

function renderCharacters() {
  if (!appState.characters.some(character => character.id === appState.selectedCharacterId)) {
    appState.selectedCharacterId = appState.characters[0]?.id || "";
  }

  elements.characterList.innerHTML = appState.characters
    .map(
      character => `
        <button class="character-button ${character.id === appState.selectedCharacterId ? "active" : ""}"
          type="button"
          data-character-id="${escapeHtml(character.id)}">
          <strong>${escapeHtml(character.name)}</strong>
          <small>${escapeHtml(character.role)} · ${escapeHtml(character.futureRole)}</small>
        </button>
      `
    )
    .join("");

  elements.characterList.querySelectorAll("[data-character-id]").forEach(button => {
    button.addEventListener("click", () => {
      appState.selectedCharacterId = button.dataset.characterId;
      persistState();
      renderCharacters();
    });
  });

  const selected = appState.characters.find(character => character.id === appState.selectedCharacterId);
  if (!selected) return;

  elements.selectedCharacterRole.textContent = selected.role;
  elements.selectedCharacterName.textContent = selected.name;
  elements.selectedCharacterStatus.textContent = selected.alive ? "ALIVE" : "UNKNOWN";
  elements.selectedCharacterSummary.textContent = selected.summary;
  renderDefinitionList(elements.selectedCharacterDetails, [
    ["ID", selected.id],
    ["첫 등장", selected.firstEp],
    ["미래 역할", selected.futureRole],
    ["보스 여부", selected.boss],
    ["메모", selected.notes]
  ]);
  elements.selectedCharacterConnections.innerHTML = selected.connections
    .map(connection => `<li>${escapeHtml(connection)}</li>`)
    .join("");

  renderRelationMap();
}

function renderRelationMap() {
  const positions = {
    CH001: { x: 50, y: 50 },
    CH002: { x: 50, y: 17 },
    CH003: { x: 18, y: 35 },
    CH004: { x: 82, y: 35 },
    CH005: { x: 80, y: 73 },
    CH006: { x: 20, y: 73 }
  };
  const fallbackPositions = [
    { x: 50, y: 17 },
    { x: 18, y: 35 },
    { x: 82, y: 35 },
    { x: 80, y: 73 },
    { x: 20, y: 73 },
    { x: 50, y: 86 }
  ];
  const center = positions.CH001;
  const width = elements.relationMap.clientWidth || 680;
  const height = elements.relationMap.clientHeight || 420;
  const lineMarkup = appState.characters
    .filter(character => character.id !== "CH001")
    .map((character, index) => {
      const pos = positions[character.id] || fallbackPositions[index % fallbackPositions.length];
      const dx = ((pos.x - center.x) / 100) * width;
      const dy = ((pos.y - center.y) / 100) * height;
      const lineWidth = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      return `<span class="relation-line" style="--line-width:${lineWidth}px; --line-angle:${angle}rad"></span>`;
    })
    .join("");

  const nodeMarkup = appState.characters
    .map((character, index) => {
      const pos = positions[character.id] || fallbackPositions[index % fallbackPositions.length];
      return `
        <button class="relation-node ${character.id === appState.selectedCharacterId ? "active" : ""}"
          type="button"
          data-character-id="${escapeHtml(character.id)}"
          style="--x:${pos.x}%; --y:${pos.y}%">
          <strong>${escapeHtml(character.name)}</strong>
          <small>${escapeHtml(character.futureRole)}</small>
        </button>
      `;
    })
    .join("");

  elements.relationMap.innerHTML = `${lineMarkup}${nodeMarkup}`;
  elements.relationMap.querySelectorAll("[data-character-id]").forEach(button => {
    button.addEventListener("click", () => {
      appState.selectedCharacterId = button.dataset.characterId;
      persistState();
      renderCharacters();
    });
  });
}

function renderStory() {
  elements.storySynopsis.textContent = appState.story.synopsis;
  elements.timelineList.innerHTML = appState.story.timeline
    .map(
      item => `
        <li>
          <strong>${escapeHtml(item.ep)} · ${escapeHtml(item.title)}</strong>
          <span>${escapeHtml(item.note)}</span>
        </li>
      `
    )
    .join("");

  elements.foreshadowList.innerHTML = appState.foreshadows
    .map(
      item => `
        <li>
          <strong>${escapeHtml(item.id)} · ${escapeHtml(item.title)}</strong>
          ${escapeHtml(item.ep)} → ${escapeHtml(item.payoff)} · ${escapeHtml(item.status)}
        </li>
      `
    )
    .join("");
}

function renderAssets() {
  elements.balanceAmount.textContent = appState.balance.amount;
  elements.balanceMemo.textContent = appState.balance.memo;
  elements.balanceInput.value = appState.balance.amount;

  elements.gateIssues.innerHTML = appState.gate.map(issue => `<li>${escapeHtml(issue)}</li>`).join("");
  elements.investmentList.innerHTML = appState.investments
    .map(
      item => `
        <article class="investment-item">
          <strong>${escapeHtml(item.phase)}</strong>
          <div>
            <b>${escapeHtml(item.capital)}</b>
            <p>${escapeHtml(item.goal)}</p>
          </div>
          <span class="status-pill">${escapeHtml(item.status)}</span>
        </article>
      `
    )
    .join("");
}

function renderBosses() {
  elements.bossGrid.innerHTML = appState.bosses
    .map(
      boss => `
        <article class="boss-card">
          <strong>${escapeHtml(boss.id)} · ${escapeHtml(boss.name)}</strong>
          <dl>
            <dt>첫 등장</dt><dd>${escapeHtml(boss.firstEp)}</dd>
            <dt>동료화</dt><dd>${escapeHtml(boss.ally)}</dd>
            <dt>상태</dt><dd>${escapeHtml(boss.status)}</dd>
            <dt>메모</dt><dd>${escapeHtml(boss.note)}</dd>
          </dl>
        </article>
      `
    )
    .join("");
}

function renderFileEditors() {
  if (document.activeElement !== elements.storyDocumentEditor) {
    elements.storyDocumentEditor.value = appState.documents.story;
  }
  if (document.activeElement !== elements.masterDocumentEditor) {
    elements.masterDocumentEditor.value = appState.documents.master;
  }
  const zipSuffix = appState.sourceFiles.zip ? ` · ZIP: ${appState.sourceFiles.zip}` : "";
  elements.fileStatus.textContent = `Story: ${appState.sourceFiles.story} · Master: ${appState.sourceFiles.master}${zipSuffix}`;
}

function renderDefinitionList(container, rows) {
  container.innerHTML = rows
    .map(([term, detail]) => `<dt>${escapeHtml(term)}</dt><dd>${escapeHtml(detail)}</dd>`)
    .join("");
}

function bindEvents() {
  elements.saveBalanceButton.addEventListener("click", () => {
    const nextBalance = elements.balanceInput.value.trim();
    if (!nextBalance) {
      showToast("잔고 값을 입력해주세요.");
      return;
    }
    appState.balance.amount = nextBalance;
    const seed = appState.investments.find(item => item.phase === "Seed");
    if (seed) seed.capital = nextBalance;
    appState.documents.master = generateMasterMarkdown();
    persistState();
    renderAll();
    showToast("통장잔고를 업데이트했습니다.");
  });

  elements.storyFileInput.addEventListener("change", async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    appState.documents.story = text;
    appState.sourceFiles.story = file.name;
    mergeStoryMarkdown(text);
    persistState();
    renderAll();
    showToast("스토리 파일을 반영했습니다.");
    event.target.value = "";
  });

  elements.masterFileInput.addEventListener("change", async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    appState.documents.master = text;
    appState.sourceFiles.master = file.name;
    mergeMasterMarkdown(text);
    persistState();
    renderAll();
    showToast("마스터 MD를 반영했습니다.");
    event.target.value = "";
  });

  elements.zipFileInput.addEventListener("change", async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    appState.sourceFiles.zip = `${file.name} (${formatBytes(file.size)})`;
    if (file.size <= 2 * 1024 * 1024) {
      appState.uploadedZipBase64 = await fileToBase64(file);
    } else {
      appState.uploadedZipBase64 = "";
      showToast("ZIP이 커서 메타데이터만 저장했습니다.");
    }
    persistState();
    renderFileEditors();
    showToast("스토리바이블 ZIP 업데이트 기록을 저장했습니다.");
    event.target.value = "";
  });

  elements.saveStoryDocumentButton.addEventListener("click", () => {
    appState.documents.story = elements.storyDocumentEditor.value;
    mergeStoryMarkdown(appState.documents.story);
    persistState();
    renderAll();
    showToast("스토리 문서를 저장했습니다.");
  });

  elements.saveMasterDocumentButton.addEventListener("click", () => {
    appState.documents.master = elements.masterDocumentEditor.value;
    mergeMasterMarkdown(appState.documents.master);
    persistState();
    renderAll();
    showToast("마스터 문서를 저장했습니다.");
  });

  elements.downloadStoryButton.addEventListener("click", () => {
    downloadBlob("Novel_Story_Summary.md", new Blob([appState.documents.story], { type: "text/markdown;charset=utf-8" }));
  });

  elements.downloadMasterButton.addEventListener("click", () => {
    const markdown = generateMasterMarkdown();
    downloadBlob("99_Master_DB.md", new Blob([markdown], { type: "text/markdown;charset=utf-8" }));
  });

  elements.downloadZipButton.addEventListener("click", () => {
    const zipBlob = createZipBlob(getStoryBibleFiles());
    downloadBlob("StoryBible.zip", zipBlob);
  });

  elements.resetDataButton.addEventListener("click", () => {
    const confirmed = window.confirm("저장된 업로드/편집 데이터를 초기화하고 기본 첨부 문서 상태로 되돌릴까요?");
    if (!confirmed) return;
    localStorage.removeItem(STORAGE_KEY);
    appState = clone(DEFAULT_STATE);
    renderAll();
    showToast("기본 데이터로 초기화했습니다.");
  });

  window.addEventListener("resize", debounce(renderRelationMap, 120));
}

function mergeStoryMarkdown(markdown) {
  const synopsis = extractSection(markdown, "작품 개요");
  if (synopsis) {
    appState.story.synopsis = synopsis
      .split("\n")
      .filter(line => line.trim() && !line.trim().startsWith("-"))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  }

  const timeline = parseTimeline(markdown);
  if (timeline.length) appState.story.timeline = timeline;

  const goals = extractNumberedList(extractSection(markdown, "장기 목표"));
  if (goals.length) appState.story.goals = goals;
}

function mergeMasterMarkdown(markdown) {
  const title = matchValue(markdown, /Title:\s*(.+)/i);
  const timelineStart = matchValue(markdown, /Timeline Start:\s*(.+)/i);
  const originalTimeline = matchValue(markdown, /Original Timeline:\s*(.+)/i);
  const storyStatus = matchValue(markdown, /Story Status:\s*(.+)/i);

  if (title) appState.project.title = title;
  if (timelineStart) appState.project.timelineStart = timelineStart;
  if (originalTimeline) appState.project.originalTimeline = originalTimeline;
  if (storyStatus) appState.project.storyStatus = storyStatus;

  const investments = parsePipeTable(markdown, "Investment DB").map(row => ({
    phase: row.Phase,
    capital: row.Capital,
    goal: row.Goal,
    status: row.Status
  }));
  if (investments.length) {
    appState.investments = investments;
    const seed = investments.find(item => item.phase === "Seed");
    if (seed?.capital) appState.balance.amount = seed.capital;
  }

  const foreshadows = parsePipeTable(markdown, "Foreshadow DB").map(row => ({
    id: row.ID,
    ep: row.EP,
    title: row.Foreshadow,
    payoff: row["Planned Payoff"],
    status: row.Status
  }));
  if (foreshadows.length) appState.foreshadows = foreshadows;

  const bosses = parsePipeTable(markdown, "Boss Progress").map(row => ({
    id: row.Boss,
    name: row.Name,
    firstEp: row["First EP"],
    ally: row.Ally,
    status: row.Status,
    note: "인간/아인종 혼합 후보. 최종적으로 동료가 됨."
  }));
  if (bosses.length) appState.bosses = bosses;

  const checklistEpisodes = [...markdown.matchAll(/-\s*\[[x ]\]\s*(EP\d+)/gi)].map(match => match[1]);
  if (checklistEpisodes.length) {
    const lastDone = checklistEpisodes.filter(ep => markdown.includes(`[x] ${ep}`)).at(-1);
    if (lastDone) appState.project.storyStatus = `EP001~${lastDone}`;
  }
}

function extractSection(markdown, heading) {
  const pattern = new RegExp(`^#{1,3}\\s+${escapeRegExp(heading)}\\s*$([\\s\\S]*?)(?=^#{1,3}\\s+|^---+$|\\Z)`, "im");
  const match = markdown.match(pattern);
  return match ? match[1].trim() : "";
}

function parseTimeline(markdown) {
  return markdown
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => /^EP\d{2,3}\b/i.test(line))
    .map(line => {
      const [ep, title = "", ...rest] = line.split(/\s*[-–]\s*/);
      return {
        ep: ep.replace(/^EP(\d{2})$/i, "EP0$1").toUpperCase(),
        title: title.trim() || "미정",
        note: rest.join(" - ").trim() || "메모 없음"
      };
    });
}

function extractNumberedList(text) {
  return text
    .split(/\r?\n/)
    .map(line => line.replace(/^\s*\d+\.\s*/, "").trim())
    .filter(Boolean);
}

function parsePipeTable(markdown, heading) {
  const section = extractSection(markdown, heading);
  const lines = section
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.startsWith("|") && line.endsWith("|"));
  if (lines.length < 3) return [];

  const headers = splitPipeRow(lines[0]);
  return lines.slice(2).map(line => {
    const cells = splitPipeRow(line);
    return headers.reduce((row, header, index) => {
      row[header] = cells[index] || "";
      return row;
    }, {});
  });
}

function splitPipeRow(line) {
  return line
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map(cell => cell.trim());
}

function matchValue(text, pattern) {
  const match = text.match(pattern);
  return match ? match[1].trim() : "";
}

function generateStoryMarkdown() {
  const timeline = appState.story.timeline.map(item => `${item.ep} - ${item.title} - ${item.note}`).join("\n");
  const goals = appState.story.goals.map((goal, index) => `${index + 1}. ${goal}`).join("\n");
  return `# 소설 통합 요약 (${appState.project.storyStatus})

# 작품 개요

${appState.story.synopsis}

# 세계관 핵심

- 배경 : 2005년 대한민국
- 원래 시간 : ${appState.project.originalTimeline}
- 장르 : ${appState.project.genre}
- AI 시뮬레이션 : 현상 유지 0% / AI 통치 약 3% / 회귀 97%
- 최종 목표 : 인류 생존

# ${appState.project.storyStatus}

${timeline}

# 장기 목표

${goals}
`;
}

function generateMasterMarkdown() {
  const characters = appState.characters
    .map(
      character =>
        `| ${character.id} | ${character.name} | ${character.role} | ${character.firstEp} | ${character.futureRole} | ${character.alive ? "Y" : "N"} | ${character.boss} | ${character.notes} |`
    )
    .join("\n");
  const foreshadows = appState.foreshadows
    .map(item => `| ${item.id} | ${item.ep} | ${item.title} | ${item.payoff} | ${item.status} |`)
    .join("\n");
  const investments = appState.investments
    .map(item => `| ${item.phase} | ${item.capital} | ${item.goal} | ${item.status} |`)
    .join("\n");
  const bosses = appState.bosses
    .map(item => `| ${item.id} | ${item.name} | ${item.firstEp} | ${item.ally} | ${item.status} |`)
    .join("\n");
  const completedEpisodes = appState.story.timeline.map(item => `- [x] ${item.ep}`).join("\n");

  return `# 99_Master_DB

## Project

- Title: ${appState.project.title}
- Timeline Start: ${appState.project.timelineStart}
- Original Timeline: ${appState.project.originalTimeline}
- Story Status: ${appState.project.storyStatus}

---

# Character DB

| ID | Name | Role | First EP | Future Role | Alive | Boss | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
${characters}

---

# Foreshadow DB

| ID | EP | Foreshadow | Planned Payoff | Status |
| --- | --- | --- | --- | --- |
${foreshadows}

---

# Investment DB

| Phase | Capital | Goal | Status |
| --- | --- | --- | --- |
${investments}

---

# Boss Progress

| Boss | Name | First EP | Ally | Status |
| --- | --- | --- | --- | --- |
${bosses}

---

# Episode Checklist

${completedEpisodes}
- [ ] EP008
`;
}

function getStoryBibleFiles() {
  return {
    "Novel_Story_Summary.md": appState.documents.story || generateStoryMarkdown(),
    "99_Master_DB.md": generateMasterMarkdown(),
    "00_World.md": appState.documents.world,
    "01_Characters.md": appState.documents.characters,
    "02_AI.md": appState.documents.ai,
    "03_Timeline.md": appState.documents.timeline,
    "04_Foreshadow.md": appState.documents.foreshadow,
    "05_Investment.md": appState.documents.investment,
    "06_Gate.md": appState.documents.gate,
    "07_Bosses.md": appState.documents.bosses
  };
}

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function createZipBlob(files) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  Object.entries(files).forEach(([filename, content]) => {
    const nameBytes = encoder.encode(filename);
    const dataBytes = encoder.encode(content);
    const crc = crc32(dataBytes);
    const { time, date } = getDosDateTime(new Date());
    const localHeader = concatUint8Arrays([
      uint32(0x04034b50),
      uint16(20),
      uint16(0x0800),
      uint16(0),
      uint16(time),
      uint16(date),
      uint32(crc),
      uint32(dataBytes.length),
      uint32(dataBytes.length),
      uint16(nameBytes.length),
      uint16(0),
      nameBytes
    ]);
    const centralHeader = concatUint8Arrays([
      uint32(0x02014b50),
      uint16(20),
      uint16(20),
      uint16(0x0800),
      uint16(0),
      uint16(time),
      uint16(date),
      uint32(crc),
      uint32(dataBytes.length),
      uint32(dataBytes.length),
      uint16(nameBytes.length),
      uint16(0),
      uint16(0),
      uint16(0),
      uint16(0),
      uint32(0),
      uint32(offset),
      nameBytes
    ]);

    localParts.push(localHeader, dataBytes);
    centralParts.push(centralHeader);
    offset += localHeader.length + dataBytes.length;
  });

  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const centralOffset = offset;
  const endOfCentralDirectory = concatUint8Arrays([
    uint32(0x06054b50),
    uint16(0),
    uint16(0),
    uint16(Object.keys(files).length),
    uint16(Object.keys(files).length),
    uint32(centralSize),
    uint32(centralOffset),
    uint16(0)
  ]);

  return new Blob([...localParts, ...centralParts, endOfCentralDirectory], { type: "application/zip" });
}

function crc32(bytes) {
  let crc = -1;
  for (let index = 0; index < bytes.length; index += 1) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ bytes[index]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

const CRC_TABLE = Array.from({ length: 256 }, (_, tableIndex) => {
  let c = tableIndex;
  for (let bit = 0; bit < 8; bit += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return c >>> 0;
});

function getDosDateTime(date) {
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const dosDate = ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { time, date: dosDate };
}

function uint16(value) {
  const bytes = new Uint8Array(2);
  bytes[0] = value & 0xff;
  bytes[1] = (value >>> 8) & 0xff;
  return bytes;
}

function uint32(value) {
  const bytes = new Uint8Array(4);
  bytes[0] = value & 0xff;
  bytes[1] = (value >>> 8) & 0xff;
  bytes[2] = (value >>> 16) & 0xff;
  bytes[3] = (value >>> 24) & 0xff;
  return bytes;
}

function concatUint8Arrays(arrays) {
  const totalLength = arrays.reduce((sum, array) => sum + array.length, 0);
  const combined = new Uint8Array(totalLength);
  let offset = 0;
  arrays.forEach(array => {
    combined.set(array, offset);
    offset += array.length;
  });
  return combined;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function debounce(callback, wait) {
  let timeoutId;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => callback(...args), wait);
  };
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js").catch(error => {
      console.warn("서비스 워커 등록 실패", error);
    });
  });
}

initRouting();
bindEvents();
renderAll();
registerServiceWorker();
