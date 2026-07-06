const STORAGE_KEY = 'story-bible-navigator-v1';
const ZIP_CDN_URL = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js';

const DOCS = [
  { key: 'world', label: '세계관', fileName: '00_World.md' },
  { key: 'characters', label: '등장인물', fileName: '01_Characters.md' },
  { key: 'ai', label: 'AI 설정', fileName: '02_AI.md' },
  { key: 'timeline', label: '타임라인', fileName: '03_Timeline.md' },
  { key: 'foreshadow', label: '떡밥', fileName: '04_Foreshadow.md' },
  { key: 'investment', label: '투자', fileName: '05_Investment.md' },
  { key: 'gate', label: '게이트', fileName: '06_Gate.md' },
  { key: 'bosses', label: '7보스', fileName: '07_Bosses.md' },
  { key: 'master', label: 'Master DB', fileName: '99_Master_DB.md' },
  { key: 'summary', label: 'Story Summary', fileName: 'Novel_Story_Summary_EP001-007.md' }
];

const DEFAULT_DOCUMENTS = {
  world: `# 세계관

-   배경 시작: 2005년 회귀
-   원래 시간: 2080년
-   AI가 인류를 핵으로 리셋.
-   진실: 태양계 게이트 침공을 예측.
-   AI 시뮬레이션
    -   현상 유지: 0%
    -   AI 통치: 약 3%
    -   회귀: 97%
-   최종 목표: 인류 생존.
`,
  characters: `# 등장인물

## 주인공

-   100세 이상 회귀
-   초기 치매 수준의 기억 손실
-   마지막 1초만 선명

## AI 폰

-   2080년 자기학습 AI
-   오프라인 동작
-   노인 케어 성격(40대 여성)
-   투자 및 전략 담당
-   최종보스 예정

## 민수

-   맵부심
-   미래 최강 방패

## 지은

-   첫사랑
-   지키고 싶은 평범한 인간

## 수아

-   지은의 친구
-   후반 핵심 조력자

## 아버지

-   중견기업 오너
-   투자금 약 58.7억 위임
`,
  ai: `# AI 설정

-   투자 전담
-   장기 전략 수립
-   인간 감정 학습
-   미래 기억 일부 보유
-   점차 인간성을 획득
-   최종적으로 인류를 위한 적이 됨
`,
  timeline: `# 타임라인

EP01 마지막 1초 / 회귀 EP02 대학 친구 재회 EP03 지은과 재회 EP04 AI 일상
개입 EP05 민수 맵부심 EP06 투자 계획 EP07 아버지에게 투자금 확보
`,
  foreshadow: `# 떡밥

-   마지막 1초
-   AI의 '97%'
-   게이트
-   7명의 보스
-   AI 최종보스
-   지은을 지켜야 하는 이유
`,
  investment: `# 투자

초기 운용금: 58.7억

1차 목표 - 동일패브릭 - AI가 매매 전담

장기 목표 - 전략자산 1,000조 규모 확보
`,
  gate: `# 게이트

-   AI가 2080년 침공 예측
-   고위 아인종 등장
-   태양계 자원 확보가 목적
`,
  bosses: `# 7보스

1~7 보스 모두 추후 설정.

공통: - 인간/아인종 혼합 - 최종적으로 동료가 됨.
`,
  master: `# 99_Master_DB

## Project

-   Title: (Working)
-   Timeline Start: 2005-03-02
-   Original Timeline: 2080
-   Story Status: EP001~EP007

------------------------------------------------------------------------

# Character DB

  ----------------------------------------------------------------------------------
  ID      Name     Role     First EP     Future Role     Alive    Boss    Notes
  ------- -------- -------- ------------ --------------- -------- ------- ----------
  CH001   주인공   회귀자   EP001        인류 구원       Y        N       100세 이상
                                                                         회귀

  CH002   AI 폰    AI       EP001        최종보스        Y        Final   노인 케어
                                                                         AI

  CH003   민수     친구     EP002        최강 방패       Y        예정    맵부심

  CH004   지은     첫사랑   EP003        보호 대상       Y        N       평범한
                                                                         인간

  CH005   수아     친구     EP004        핵심 조력자     Y        N       후반 비중
                                                                         증가

  CH006   아버지   가족     EP007        투자 지원       Y        N       중견기업
                                                                         오너
  ----------------------------------------------------------------------------------

------------------------------------------------------------------------

# Foreshadow DB

  ID     EP      Foreshadow   Planned Payoff   Status
  ------ ------- ------------ ---------------- --------
  F001   EP001   마지막 1초   최종부           OPEN
  F002   EP001   AI의 사과    최종부           OPEN
  F003   EP004   위성 이상    게이트 전조      OPEN
  F004   EP006   97%          최종부           OPEN

------------------------------------------------------------------------

# Investment DB

  Phase   Capital   Goal                 Status
  ------- --------- -------------------- --------
  Seed    58.7억    초기 투자            진행
  P1      100억     기반 구축            예정
  P2      1조       기업 확보            예정
  P3      100조     전략 자산            예정
  Final   1000조    인류 생존 프로젝트   예정

------------------------------------------------------------------------

# Boss Progress

  Boss   Name   First EP   Ally   Status
  ------ ------ ---------- ------ --------
  B1     미정   -         예정   LOCK
  B2     미정   -         예정   LOCK
  B3     미정   -         예정   LOCK
  B4     미정   -         예정   LOCK
  B5     미정   -         예정   LOCK
  B6     미정   -         예정   LOCK
  B7     미정   -         예정   LOCK

------------------------------------------------------------------------

# Episode Checklist

-   [x] EP001
-   [x] EP002
-   [x] EP003
-   [x] EP004
-   [x] EP005
-   [x] EP006
-   [x] EP007
-   [ ] EP008
`,
  summary: `# 소설 통합 요약 (EP001~EP007)

# 작품 개요

2080년, 인류는 멸망 직전 마지막 1초를 맞는다.

주인공은 100세가 넘은 노인이었고, 마지막 순간 AI 스마트폰과 함께 죽음을 맞이한다.

AI는 수십억 번의 시뮬레이션 끝에 세 가지 결론을 얻는다.

-   현상 유지 : 생존률 0%
-   AI 통치 : 약 3%
-   회귀 : 97%

AI는 인류를 살리기 위해 전 세계 주요 도시에 핵 공격을 감행하고, 주인공 한 명만 2005년으로 회귀시킨다.

주인공은 20살 대학생으로 돌아오지만 기억은 대부분 사라져 있으며, 마지막 1초의 공포만 선명하게 남아 있다.

2080년의 AI 스마트폰도 함께 회귀한다.

------------------------------------------------------------------------

# 세계관 핵심

-   배경 : 2005년 대한민국
-   원래 시간 : 2080년
-   장르 : 회귀 / 캠퍼스 / 투자 / SF / 판타지 / 게이트 / 성장

AI는 태양계에 게이트가 열려 고위 아인종이 침공할 미래를 예측했다.

AI는 인간을 멸망시키려는 존재가 아니라, 인류를 살릴 가능성이 가장 높은 선택을 실행한 존재이다.

AI는 투자와 전략을 담당하고, 주인공은 사람과 미래를 바꾸는 역할을 맡는다.

------------------------------------------------------------------------

# 주요 인물

## 주인공

-   100세 이상 회귀
-   기억 일부 소실
-   20살 대학생

## AI 스마트폰

-   2080년 최신 자기학습 AI
-   노인 케어 AI
-   투자 및 전략 담당
-   미래 최종보스

## 민수

-   친구
-   맵부심
-   미래 최강 방패

## 지은

-   첫사랑
-   반드시 지키고 싶은 평범한 인간

## 수아

-   지은의 친구
-   후반 핵심 조력자

## 아버지

-   중견기업 대표
-   약 58.7억 투자금 운용 권한 부여

------------------------------------------------------------------------

# EP001~EP007

EP001 - 마지막 1초 - 회귀 - AI폰 재기동

EP002 - 대학 친구들과 재회 - 미래 보스의 단서

EP003 - 지은과 재회 - 잃어버린 청춘의 감정

EP004 - AI와 일상 시작 - 첫 이상 징후

EP005 - 민수의 맵부심 에피소드 - AI의 유머와 인간성

EP006 - AI가 투자 계획 제시 - 인류 생존 프로젝트 시작

EP007 - 아버지에게 투자금 확보 - 첫 자본 마련

------------------------------------------------------------------------

# 장기 목표

1.  3년 안에 게이트 대비 시작
2.  7명의 미래 보스를 모두 동료로 만든다.
3.  전략 자산 1000조 규모 구축
4.  AI가 왜 핵을 발사했는지 진실을 밝힌다.
5.  AI와 함께 97%의 미래를 완성한다.
`
};

const DEFAULT_SOURCE_META = Object.fromEntries(
  DOCS.map(doc => [doc.key, { source: 'default', fileName: doc.fileName, updatedAt: null }])
);

const state = {
  rawDocuments: clone(DEFAULT_DOCUMENTS),
  sourceMeta: clone(DEFAULT_SOURCE_META),
  data: null,
  parseIssues: [],
  selectedCharacterId: 'CH001',
  activeSection: 'home',
  zipStatus: '아직 ZIP을 불러오지 않았습니다.'
};

const dom = {
  heroMetrics: document.getElementById('heroMetrics'),
  liveClock: document.getElementById('liveClock'),
  overviewContent: document.getElementById('overviewContent'),
  goalList: document.getElementById('goalList'),
  issueHighlights: document.getElementById('issueHighlights'),
  storySummaryCards: document.getElementById('storySummaryCards'),
  worldHighlights: document.getElementById('worldHighlights'),
  episodeTimeline: document.getElementById('episodeTimeline'),
  characterSelector: document.getElementById('characterSelector'),
  characterDetail: document.getElementById('characterDetail'),
  relationshipGraph: document.getElementById('relationshipGraph'),
  issueList: document.getElementById('issueList'),
  investmentList: document.getElementById('investmentList'),
  balanceCards: document.getElementById('balanceCards'),
  enemyList: document.getElementById('enemyList'),
  loreCards: document.getElementById('loreCards'),
  storySummaryInput: document.getElementById('storySummaryInput'),
  masterInput: document.getElementById('masterInput'),
  zipStatus: document.getElementById('zipStatus'),
  documentStatus: document.getElementById('documentStatus'),
  parseIssues: document.getElementById('parseIssues'),
  projectMeta: document.getElementById('projectMeta'),
  characterTable: document.getElementById('characterTable'),
  foreshadowTable: document.getElementById('foreshadowTable'),
  investmentTable: document.getElementById('investmentTable'),
  bossTable: document.getElementById('bossTable'),
  toast: document.getElementById('toast'),
  scrollTopButton: document.getElementById('scrollTopButton')
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeText(text) {
  return String(text || '').replace(/\r\n?/g, '\n');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function nowStamp() {
  return new Date().toLocaleString('ko-KR');
}

function setSourceMeta(key, source, fileName) {
  state.sourceMeta[key] = {
    source,
    fileName: fileName || DOCS.find(doc => doc.key === key)?.fileName || `${key}.md`,
    updatedAt: nowStamp()
  };
}

function showToast(message) {
  dom.toast.textContent = message;
  dom.toast.classList.add('visible');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    dom.toast.classList.remove('visible');
  }, 2200);
}

function saveState() {
  const payload = {
    rawDocuments: state.rawDocuments,
    sourceMeta: state.sourceMeta,
    selectedCharacterId: state.selectedCharacterId,
    zipStatus: state.zipStatus
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }
    const parsed = JSON.parse(raw);
    if (parsed.rawDocuments) {
      state.rawDocuments = { ...clone(DEFAULT_DOCUMENTS), ...parsed.rawDocuments };
    }
    if (parsed.sourceMeta) {
      state.sourceMeta = { ...clone(DEFAULT_SOURCE_META), ...parsed.sourceMeta };
    }
    if (parsed.selectedCharacterId) {
      state.selectedCharacterId = parsed.selectedCharacterId;
    }
    if (parsed.zipStatus) {
      state.zipStatus = parsed.zipStatus;
    }
  } catch (error) {
    console.error(error);
  }
}

function getSectionLines(text, heading) {
  const lines = normalizeText(text).split('\n');
  const startIndex = lines.findIndex(line => line.trim() === heading);
  if (startIndex === -1) {
    return [];
  }
  const collected = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (index > startIndex + 1 && line.trim().startsWith('#')) {
      break;
    }
    collected.push(line);
  }
  return collected;
}

function parseSimpleBullets(text) {
  return normalizeText(text)
    .split('\n')
    .map(line => line.replace(/^\s*-\s*/, '').trim())
    .filter(Boolean);
}

function parseCharacterSections(text) {
  const lines = normalizeText(text).split('\n');
  const result = {};
  let currentName = '';
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## ')) {
      currentName = trimmed.replace(/^##\s+/, '').trim();
      result[currentName] = [];
      continue;
    }
    if (!currentName) {
      continue;
    }
    const bullet = trimmed.replace(/^\-\s*/, '').trim();
    if (trimmed.startsWith('-') && bullet) {
      result[currentName].push(bullet);
    }
  }
  return result;
}

function parseProject(text) {
  const section = getSectionLines(text, '## Project');
  const project = {};
  for (const line of section) {
    const match = line.match(/^\-\s+([^:]+):\s*(.+)$/);
    if (!match) {
      continue;
    }
    const key = match[1].trim();
    const value = match[2].trim();
    project[key] = value;
  }
  return project;
}

function parseFixedWidthRows(text, heading, rowPattern, minColumns) {
  const lines = getSectionLines(text, heading);
  const rows = [];
  for (const rawLine of lines) {
    const line = rawLine.replace(/\t/g, '    ').replace(/\u00a0/g, ' ').trimEnd();
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }
    if (/^-{5,}$/.test(trimmed.replace(/\s/g, ''))) {
      continue;
    }
    if (trimmed.includes('ID') && heading.includes('Character')) {
      continue;
    }
    if (trimmed.includes('Foreshadow') && heading.includes('Foreshadow')) {
      continue;
    }
    if (trimmed.includes('Capital') && heading.includes('Investment')) {
      continue;
    }
    if (trimmed.includes('First EP') && heading.includes('Boss')) {
      continue;
    }
    if (rowPattern.test(trimmed)) {
      const parts = trimmed.split(/\s{2,}/).filter(Boolean);
      if (parts.length >= minColumns) {
        rows.push(parts);
      }
      continue;
    }
    if (rows.length) {
      rows[rows.length - 1][rows[rows.length - 1].length - 1] += ` ${trimmed}`;
    }
  }
  return rows;
}

function parseMasterDoc(text) {
  const project = parseProject(text);
  const characterRows = parseFixedWidthRows(text, '# Character DB', /^CH\d+/, 8).map(parts => ({
    id: parts[0],
    name: parts[1],
    role: parts[2],
    firstEpisode: parts[3],
    futureRole: parts[4],
    alive: parts[5],
    boss: parts[6],
    notes: parts.slice(7).join(' ')
  }));
  const foreshadowRows = parseFixedWidthRows(text, '# Foreshadow DB', /^F\d+/, 5).map(parts => ({
    id: parts[0],
    episode: parts[1],
    title: parts[2],
    payoff: parts[3],
    status: parts[4]
  }));
  const investmentRows = parseFixedWidthRows(text, '# Investment DB', /^(Seed|P\d+|Final)/, 4).map(parts => ({
    phase: parts[0],
    capital: parts[1],
    goal: parts[2],
    status: parts[3]
  }));
  const bossRows = parseFixedWidthRows(text, '# Boss Progress', /^B\d+/, 5).map(parts => ({
    id: parts[0],
    name: parts[1],
    firstEpisode: parts[2],
    ally: parts[3],
    status: parts[4]
  }));
  const checklist = getSectionLines(text, '# Episode Checklist')
    .map(line => line.match(/\[\s*(x| )\s*\]\s*(EP\d+)/i))
    .filter(Boolean)
    .map(match => ({
      id: match[2],
      done: match[1].toLowerCase() === 'x'
    }));

  return {
    project,
    characterRows,
    foreshadowRows,
    investmentRows,
    bossRows,
    checklist
  };
}

function parseSummaryDoc(text) {
  const overview = getSectionLines(text, '# 작품 개요')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('-') && !/^[-]{10,}$/.test(line))
    .slice(0, 6);

  const worldCore = getSectionLines(text, '# 세계관 핵심')
    .map(line => line.replace(/^\-\s*/, '').trim())
    .filter(line => line && !/^[-]{10,}$/.test(line));

  const goals = getSectionLines(text, '# 장기 목표')
    .map(line => line.match(/^\d+\.\s+(.+)$/))
    .filter(Boolean)
    .map(match => match[1].trim());

  const episodes = normalizeText(text)
    .split('\n')
    .map(line => line.trim())
    .map(line => line.match(/^(EP\d{3})\s*-\s*(.+)$/))
    .filter(Boolean)
    .map(match => {
      const parts = match[2].split(/\s*-\s*/).filter(Boolean);
      return {
        id: match[1],
        title: parts[0] || match[2],
        beats: parts.slice(1)
      };
    });

  return {
    overview,
    worldCore,
    goals,
    episodes
  };
}

function buildRelationships(characters) {
  const byName = Object.fromEntries(characters.map(character => [character.name, character]));
  const edges = [];
  const candidates = [
    ['주인공', 'AI 폰', '회귀 동반 · 전략 파트너'],
    ['주인공', '민수', '대학 친구 · 미래 최강 방패'],
    ['주인공', '지은', '첫사랑 · 보호 대상'],
    ['주인공', '수아', '핵심 조력자'],
    ['주인공', '아버지', '가족 · 투자 지원'],
    ['지은', '수아', '친구'],
    ['AI 폰', '아버지', '자금 운용 전략']
  ];
  for (const [fromName, toName, label] of candidates) {
    const from = byName[fromName];
    const to = byName[toName];
    if (from && to) {
      edges.push({ from: from.id, to: to.id, label });
    }
  }
  return edges;
}

function buildStoryBible(rawDocuments) {
  const issues = [];
  const master = parseMasterDoc(rawDocuments.master);
  const summary = parseSummaryDoc(rawDocuments.summary);
  const characterDetails = parseCharacterSections(rawDocuments.characters);
  const worldBullets = parseSimpleBullets(rawDocuments.world);
  const aiBullets = parseSimpleBullets(rawDocuments.ai);
  const gateBullets = parseSimpleBullets(rawDocuments.gate);
  const foreshadowBullets = parseSimpleBullets(rawDocuments.foreshadow);
  const investmentBullets = normalizeText(rawDocuments.investment)
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .filter(line => !line.startsWith('#'));

  if (!master.characterRows.length) {
    issues.push('Character DB를 파싱하지 못했습니다.');
  }
  if (!master.foreshadowRows.length) {
    issues.push('Foreshadow DB를 파싱하지 못했습니다.');
  }
  if (!summary.episodes.length) {
    issues.push('스토리 요약에서 에피소드 목록을 찾지 못했습니다.');
  }

  const currentCapital = investmentBullets.find(line => line.includes('초기 운용금'))?.split(':')[1]?.trim()
    || master.investmentRows[0]?.capital
    || '미확인';

  const nextPhase = master.investmentRows.find(item => item.status === '예정') || master.investmentRows[1];
  const openIssues = master.foreshadowRows.map(item => ({
    title: item.title,
    episode: item.episode,
    payoff: item.payoff,
    status: item.status
  }));

  const enemies = [
    ...master.bossRows.map(item => ({
      name: item.name === '미정' ? `${item.id} (미정)` : item.name,
      label: item.status,
      note: `첫 등장 ${item.firstEpisode}`
    })),
    {
      name: 'AI 폰',
      label: 'FINAL',
      note: '현재는 조력자이지만 미래 최종보스 예정'
    },
    {
      name: '고위 아인종',
      label: 'THREAT',
      note: '태양계 게이트 침공 세력'
    }
  ];

  const characters = master.characterRows.map(character => ({
    ...character,
    details: characterDetails[character.name] || []
  }));

  const relationshipEdges = buildRelationships(characters);

  return {
    project: master.project,
    characters,
    foreshadows: master.foreshadowRows,
    investments: master.investmentRows,
    bosses: master.bossRows,
    checklist: master.checklist,
    summary,
    characterDetails,
    worldBullets,
    aiBullets,
    gateBullets,
    foreshadowBullets,
    investmentBullets,
    openIssues,
    enemies,
    relationshipEdges,
    currentCapital,
    nextPhase,
    totalCompletedEpisodes: master.checklist.filter(item => item.done).length,
    parseIssues: issues
  };
}

function rebuild() {
  state.data = buildStoryBible(state.rawDocuments);
  render();
  saveState();
}

function getSelectedCharacter() {
  const fallback = state.data.characters[0];
  return state.data.characters.find(character => character.id === state.selectedCharacterId) || fallback;
}

function renderMetrics() {
  const totalCharacters = state.data.characters.length;
  const totalOpenIssues = state.data.openIssues.filter(item => item.status === 'OPEN').length;
  const lockedBosses = state.data.bosses.filter(item => item.status === 'LOCK').length;
  const metrics = [
    { label: '현재 자금', value: state.data.currentCapital, note: 'Seed Capital' },
    { label: '등장 인물', value: String(totalCharacters), note: 'Character DB' },
    { label: '오픈 이슈', value: String(totalOpenIssues), note: 'Foreshadow OPEN' },
    { label: '잠금 보스', value: String(lockedBosses), note: 'Boss Progress' }
  ];
  dom.heroMetrics.innerHTML = metrics
    .map(metric => `
      <article class="metric-card">
        <span>${escapeHtml(metric.label)}</span>
        <strong>${escapeHtml(metric.value)}</strong>
        <small>${escapeHtml(metric.note)}</small>
      </article>
    `)
    .join('');
}

function renderOverview() {
  dom.overviewContent.innerHTML = state.data.summary.overview
    .map(text => `<article class="text-card"><p>${escapeHtml(text)}</p></article>`)
    .join('');

  dom.goalList.innerHTML = state.data.summary.goals
    .map(goal => `<li>${escapeHtml(goal)}</li>`)
    .join('');

  dom.issueHighlights.innerHTML = state.data.openIssues.slice(0, 4)
    .map(issue => `
      <article class="list-card">
        <div>
          <strong>${escapeHtml(issue.title)}</strong>
          <div class="meta-inline">${escapeHtml(issue.episode)} · ${escapeHtml(issue.status)}</div>
        </div>
        <span>${escapeHtml(issue.payoff)}</span>
      </article>
    `)
    .join('');
}

function renderStory() {
  dom.storySummaryCards.innerHTML = [
    ...state.data.summary.overview.slice(0, 4),
    ...state.data.summary.worldCore.slice(0, 2)
  ]
    .map(text => `<article class="summary-card"><p>${escapeHtml(text)}</p></article>`)
    .join('');

  dom.worldHighlights.innerHTML = state.data.worldBullets
    .map(item => `
      <article class="list-card">
        <strong>${escapeHtml(item.split(':')[0])}</strong>
        <span>${escapeHtml(item.includes(':') ? item.split(':').slice(1).join(':').trim() : item)}</span>
      </article>
    `)
    .join('');

  const episodeState = Object.fromEntries(state.data.checklist.map(item => [item.id, item.done]));
  dom.episodeTimeline.innerHTML = state.data.summary.episodes
    .map(episode => `
      <article class="timeline-card">
        <div class="timeline-code">${escapeHtml(episode.id)}</div>
        <div class="timeline-body">
          <h4>${escapeHtml(episode.title)}</h4>
          <p>${escapeHtml(episode.beats.join(' · ') || '세부 비트 없음')}</p>
          <span class="status-pill ${episodeState[episode.id] ? '' : 'pending'}">${episodeState[episode.id] ? '완료' : '예정'}</span>
        </div>
      </article>
    `)
    .join('');
}

function renderCharacters() {
  const selectedCharacter = getSelectedCharacter();
  if (!selectedCharacter) {
    dom.characterSelector.innerHTML = '';
    dom.characterDetail.innerHTML = '<article class="error-card">표시할 인물 데이터가 없습니다.</article>';
    dom.relationshipGraph.innerHTML = '';
    return;
  }
  dom.characterSelector.innerHTML = state.data.characters
    .map(character => `
      <button type="button" class="character-chip ${character.id === selectedCharacter.id ? 'active' : ''}" data-character-id="${escapeHtml(character.id)}">
        <strong>${escapeHtml(character.name)}</strong>
        <span>${escapeHtml(character.role)} · ${escapeHtml(character.futureRole)}</span>
      </button>
    `)
    .join('');

  const relations = state.data.relationshipEdges
    .filter(edge => edge.from === selectedCharacter.id || edge.to === selectedCharacter.id)
    .map(edge => {
      const otherId = edge.from === selectedCharacter.id ? edge.to : edge.from;
      const other = state.data.characters.find(character => character.id === otherId);
      return `${other?.name || otherId} · ${edge.label}`;
    });

  dom.characterDetail.innerHTML = `
    <div class="character-header">
      <div class="character-title">
        <h3>${escapeHtml(selectedCharacter.name)}</h3>
        <p>${escapeHtml(selectedCharacter.role)} / 첫 등장 ${escapeHtml(selectedCharacter.firstEpisode)} / 미래 역할 ${escapeHtml(selectedCharacter.futureRole)}</p>
      </div>
      <span class="badge ${selectedCharacter.boss === 'Final' ? 'badge-danger' : ''}">${escapeHtml(selectedCharacter.boss)}</span>
    </div>
    <div class="detail-grid">
      <article class="detail-card">
        <span>생존 여부</span>
        <strong>${escapeHtml(selectedCharacter.alive === 'Y' ? '생존' : '사망/미정')}</strong>
      </article>
      <article class="detail-card">
        <span>비고</span>
        <strong>${escapeHtml(selectedCharacter.notes || '없음')}</strong>
      </article>
      <article class="detail-card">
        <span>주요 메모</span>
        <strong>${escapeHtml((selectedCharacter.details[0] || selectedCharacter.notes || '').trim() || '없음')}</strong>
      </article>
      <article class="detail-card">
        <span>관계 수</span>
        <strong>${relations.length}개</strong>
      </article>
    </div>
    <div class="relation-tags">
      <strong>세부 설정</strong>
      <ul class="bullet-list">
        ${(selectedCharacter.details.length ? selectedCharacter.details : ['추가 설정 없음']).map(item => `<li>${escapeHtml(item)}</li>`).join('')}
      </ul>
    </div>
    <div class="relation-tags">
      <strong>연결 관계</strong>
      <div class="tag-list">
        ${(relations.length ? relations : ['직접 정의된 관계 없음']).map(item => `<span class="tag">${escapeHtml(item)}</span>`).join('')}
      </div>
    </div>
  `;

  renderRelationshipGraph(selectedCharacter.id);
}

function renderRelationshipGraph(selectedCharacterId) {
  const positions = {
    CH001: { x: 320, y: 180 },
    CH002: { x: 320, y: 68 },
    CH003: { x: 120, y: 118 },
    CH004: { x: 518, y: 118 },
    CH005: { x: 518, y: 264 },
    CH006: { x: 120, y: 264 }
  };
  const nodes = state.data.characters
    .filter(character => positions[character.id])
    .map(character => ({ ...character, ...positions[character.id] }));

  const lines = state.data.relationshipEdges
    .filter(edge => positions[edge.from] && positions[edge.to])
    .map(edge => {
      const from = positions[edge.from];
      const to = positions[edge.to];
      return `
        <line class="graph-line" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}"></line>
        <text class="graph-label" x="${(from.x + to.x) / 2}" y="${(from.y + to.y) / 2 - 8}">${escapeHtml(edge.label)}</text>
      `;
    })
    .join('');

  const circles = nodes
    .map(node => `
      <g class="graph-node ${node.id === selectedCharacterId ? 'active' : ''}" data-character-id="${escapeHtml(node.id)}">
        <circle cx="${node.x}" cy="${node.y}" r="${node.id === selectedCharacterId ? 48 : 42}"></circle>
        <text x="${node.x}" y="${node.y - 4}">${escapeHtml(node.name)}</text>
        <text x="${node.x}" y="${node.y + 14}" font-size="11" fill="#95a8bd">${escapeHtml(node.role)}</text>
      </g>
    `)
    .join('');

  dom.relationshipGraph.innerHTML = lines + circles;
}

function renderSystems() {
  dom.issueList.innerHTML = state.data.openIssues
    .map(issue => `
      <article class="issue-card">
        <h4>${escapeHtml(issue.title)}</h4>
        <p>${escapeHtml(issue.payoff)}</p>
        <div class="issue-meta">
          <span>${escapeHtml(issue.episode)}</span>
          <span>${escapeHtml(issue.status)}</span>
        </div>
      </article>
    `)
    .join('');

  dom.investmentList.innerHTML = state.data.investments
    .map(item => `
      <article class="investment-card">
        <strong>${escapeHtml(item.phase)} · ${escapeHtml(item.capital)}</strong>
        <span>${escapeHtml(item.goal)}</span>
        <span>${escapeHtml(item.status)}</span>
      </article>
    `)
    .join('');

  const balanceItems = [
    {
      title: '현재 확보 자금',
      value: state.data.currentCapital,
      note: '아버지에게 투자 운용 권한을 확보한 시점 기준'
    },
    {
      title: '다음 투자 단계',
      value: state.data.nextPhase ? `${state.data.nextPhase.phase} · ${state.data.nextPhase.capital}` : '미정',
      note: state.data.nextPhase?.goal || '추가 계획 미정'
    },
    {
      title: '최종 자산 목표',
      value: state.data.investments[state.data.investments.length - 1]?.capital || '1000조',
      note: state.data.investments[state.data.investments.length - 1]?.goal || '인류 생존 프로젝트'
    }
  ];

  dom.balanceCards.innerHTML = balanceItems
    .map(item => `
      <article class="balance-card">
        <strong>${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.value)}</span>
        <span>${escapeHtml(item.note)}</span>
      </article>
    `)
    .join('');

  dom.enemyList.innerHTML = state.data.enemies
    .map(item => `
      <article class="enemy-card">
        <strong>${escapeHtml(item.name)}</strong>
        <span>${escapeHtml(item.label)}</span>
        <span>${escapeHtml(item.note)}</span>
      </article>
    `)
    .join('');

  const loreCards = [
    { title: '세계관', items: state.data.worldBullets },
    { title: 'AI', items: state.data.aiBullets },
    { title: '게이트', items: state.data.gateBullets }
  ];

  dom.loreCards.innerHTML = loreCards
    .map(card => `
      <article class="lore-card">
        <h4>${escapeHtml(card.title)}</h4>
        <ul class="bullet-list">
          ${card.items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      </article>
    `)
    .join('');
}

function renderStudio() {
  if (document.activeElement !== dom.storySummaryInput) {
    dom.storySummaryInput.value = state.rawDocuments.summary;
  }
  if (document.activeElement !== dom.masterInput) {
    dom.masterInput.value = state.rawDocuments.master;
  }
  dom.zipStatus.textContent = state.zipStatus;

  dom.documentStatus.innerHTML = DOCS
    .map(doc => {
      const meta = state.sourceMeta[doc.key] || {};
      return `
        <article class="doc-status-card">
          <strong>${escapeHtml(doc.label)}</strong>
          <p>${escapeHtml(meta.fileName || doc.fileName)}</p>
          <span>출처: ${escapeHtml(meta.source || 'default')} ${meta.updatedAt ? `· ${escapeHtml(meta.updatedAt)}` : ''}</span>
        </article>
      `;
    })
    .join('');

  dom.parseIssues.innerHTML = state.parseIssues.length
    ? state.parseIssues.map(issue => `<article class="error-card">${escapeHtml(issue)}</article>`).join('')
    : '<article class="doc-status-card"><strong>파싱 상태 정상</strong><p>모든 주요 섹션을 읽어 화면에 반영했습니다.</p></article>';
}

function renderProjectMeta() {
  const metaItems = [
    ['타임라인 시작', state.data.project['Timeline Start'] || '미정'],
    ['원래 시간', state.data.project['Original Timeline'] || '미정'],
    ['스토리 상태', state.data.project['Story Status'] || '미정'],
    ['완료 에피소드', `${state.data.totalCompletedEpisodes}개`]
  ];
  dom.projectMeta.innerHTML = metaItems
    .map(([label, value]) => `
      <article class="meta-card">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
      </article>
    `)
    .join('');
}

function renderTable(target, columns, rows) {
  target.innerHTML = `
    <thead>
      <tr>${columns.map(column => `<th>${escapeHtml(column.label)}</th>`).join('')}</tr>
    </thead>
    <tbody>
      ${rows.map(row => `
        <tr>
          ${columns.map(column => `<td>${escapeHtml(row[column.key] ?? '')}</td>`).join('')}
        </tr>
      `).join('')}
    </tbody>
  `;
}

function render() {
  state.parseIssues = buildValidationIssues(state.data);
  renderMetrics();
  renderOverview();
  renderStory();
  renderCharacters();
  renderSystems();
  renderStudio();
  renderProjectMeta();
  renderTable(dom.characterTable, [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'firstEpisode', label: 'First EP' },
    { key: 'futureRole', label: 'Future Role' },
    { key: 'boss', label: 'Boss' }
  ], state.data.characters);
  renderTable(dom.foreshadowTable, [
    { key: 'id', label: 'ID' },
    { key: 'episode', label: 'EP' },
    { key: 'title', label: 'Foreshadow' },
    { key: 'payoff', label: 'Payoff' },
    { key: 'status', label: 'Status' }
  ], state.data.foreshadows);
  renderTable(dom.investmentTable, [
    { key: 'phase', label: 'Phase' },
    { key: 'capital', label: 'Capital' },
    { key: 'goal', label: 'Goal' },
    { key: 'status', label: 'Status' }
  ], state.data.investments);
  renderTable(dom.bossTable, [
    { key: 'id', label: 'Boss' },
    { key: 'name', label: 'Name' },
    { key: 'firstEpisode', label: 'First EP' },
    { key: 'ally', label: 'Ally' },
    { key: 'status', label: 'Status' }
  ], state.data.bosses);
}

function buildValidationIssues(data) {
  const issues = [...(data.parseIssues || [])];
  if (!data.characters.length) {
    issues.push('Character DB가 비어 있습니다.');
  }
  if (!data.summary.episodes.length) {
    issues.push('에피소드 타임라인을 생성하지 못했습니다.');
  }
  if (!data.investments.length) {
    issues.push('Investment DB가 비어 있습니다.');
  }
  if (!data.foreshadows.length) {
    issues.push('Foreshadow DB가 비어 있습니다.');
  }
  return issues;
}

function updateClock() {
  dom.liveClock.textContent = new Date().toLocaleTimeString('ko-KR', { hour12: false });
}

function resolveDocKeyFromFileName(name) {
  const normalized = name.toLowerCase().split('/').pop() || '';
  if (normalized.includes('99_master') || normalized.includes('master_db') || normalized.includes('master')) return 'master';
  if (normalized.includes('summary') || normalized.includes('story_summary') || normalized.includes('novel_story')) return 'summary';
  if (normalized.includes('00_world') || normalized.includes('world')) return 'world';
  if (normalized.includes('01_characters') || normalized.includes('characters')) return 'characters';
  if (normalized.includes('02_ai') || normalized === 'ai.md' || normalized.includes('_ai')) return 'ai';
  if (normalized.includes('03_timeline') || normalized.includes('timeline')) return 'timeline';
  if (normalized.includes('04_foreshadow') || normalized.includes('foreshadow')) return 'foreshadow';
  if (normalized.includes('05_investment') || normalized.includes('investment')) return 'investment';
  if (normalized.includes('06_gate') || normalized.includes('gate')) return 'gate';
  if (normalized.includes('07_bosses') || normalized.includes('boss')) return 'bosses';
  return '';
}

async function readFileAsText(file) {
  return normalizeText(await file.text());
}

async function importMarkdownFile(file, key) {
  const content = await readFileAsText(file);
  state.rawDocuments[key] = content;
  setSourceMeta(key, 'file', file.name);
  state.zipStatus = `${DOCS.find(doc => doc.key === key)?.label || key} 파일을 반영했습니다.`;
  rebuild();
  showToast(`${file.name} 반영 완료`);
}

function applyEditors() {
  state.rawDocuments.summary = normalizeText(dom.storySummaryInput.value);
  state.rawDocuments.master = normalizeText(dom.masterInput.value);
  setSourceMeta('summary', 'manual', 'editor-summary.md');
  setSourceMeta('master', 'manual', 'editor-master.md');
  state.zipStatus = '에디터의 내용을 현재 데이터로 반영했습니다.';
  rebuild();
  showToast('에디터 내용 반영 완료');
}

function resetDefaults() {
  state.rawDocuments = clone(DEFAULT_DOCUMENTS);
  state.sourceMeta = clone(DEFAULT_SOURCE_META);
  state.selectedCharacterId = 'CH001';
  state.zipStatus = '기본 문서 세트로 복원했습니다.';
  rebuild();
  showToast('기본 문서 복원 완료');
}

function clearSavedState() {
  localStorage.removeItem(STORAGE_KEY);
  state.zipStatus = '로컬 저장만 초기화했습니다. 현재 화면 데이터는 유지됩니다.';
  renderStudio();
  showToast('로컬 저장 초기화 완료');
}

function ensureJSZip() {
  if (window.JSZip) {
    return Promise.resolve(window.JSZip);
  }
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-jszip="true"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.JSZip), { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = ZIP_CDN_URL;
    script.async = true;
    script.dataset.jszip = 'true';
    script.onload = () => resolve(window.JSZip);
    script.onerror = () => reject(new Error('JSZip 라이브러리를 불러오지 못했습니다.'));
    document.head.appendChild(script);
  });
}

async function importZipBundle(file) {
  const JSZip = await ensureJSZip();
  const zip = await JSZip.loadAsync(file);
  let updatedCount = 0;
  const updates = [];

  for (const [entryName, entry] of Object.entries(zip.files)) {
    if (entry.dir || !entryName.toLowerCase().endsWith('.md')) {
      continue;
    }
    const key = resolveDocKeyFromFileName(entryName);
    if (!key) {
      continue;
    }
    const content = normalizeText(await entry.async('string'));
    updates.push([key, content, entryName.split('/').pop()]);
  }

  for (const [key, content, fileName] of updates) {
    state.rawDocuments[key] = content;
    setSourceMeta(key, 'zip', fileName);
    updatedCount += 1;
  }

  if (!updatedCount) {
    throw new Error('ZIP 안에서 인식 가능한 Markdown 문서를 찾지 못했습니다.');
  }

  state.zipStatus = `${file.name}에서 ${updatedCount}개 문서를 반영했습니다.`;
  rebuild();
  showToast('ZIP 반영 완료');
}

async function exportZipBundle() {
  const JSZip = await ensureJSZip();
  const zip = new JSZip();
  DOCS.forEach(doc => {
    zip.file(doc.fileName, state.rawDocuments[doc.key] || '');
  });
  const blob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(blob, 'story-bible-updated.zip');
  showToast('ZIP 다운로드 시작');
}

function downloadCurrentJson() {
  const blob = new Blob([JSON.stringify(state.data, null, 2)], { type: 'application/json' });
  downloadBlob(blob, 'story-bible-data.json');
  showToast('JSON 다운로드 시작');
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function scrollToSection(sectionId) {
  const targetId = sectionId === 'home' ? 'home' : sectionId;
  const element = document.getElementById(targetId);
  if (!element) {
    return;
  }
  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateActiveNav(sectionId) {
  state.activeSection = sectionId;
  document.querySelectorAll('.nav-link').forEach(button => {
    button.classList.toggle('active', button.dataset.target === sectionId);
  });
}

function observeSections() {
  const sections = ['home', 'story', 'characters', 'systems', 'studio']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const observer = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) {
      updateActiveNav(visible.target.id);
    }
  }, {
    threshold: [0.2, 0.45, 0.65],
    rootMargin: '-10% 0px -35% 0px'
  });

  sections.forEach(section => observer.observe(section));
}

function bindEvents() {
  document.addEventListener('click', event => {
    const targetButton = event.target.closest('[data-target]');
    if (targetButton) {
      scrollToSection(targetButton.dataset.target);
    }

    const characterButton = event.target.closest('[data-character-id]');
    if (characterButton) {
      state.selectedCharacterId = characterButton.dataset.characterId;
      renderCharacters();
      saveState();
    }
  });

  document.getElementById('storyFileInput').addEventListener('change', async event => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    await importMarkdownFile(file, 'summary');
    event.target.value = '';
  });

  document.getElementById('masterFileInput').addEventListener('change', async event => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    await importMarkdownFile(file, 'master');
    event.target.value = '';
  });

  document.getElementById('zipFileInput').addEventListener('change', async event => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    try {
      await importZipBundle(file);
    } catch (error) {
      state.zipStatus = error.message;
      renderStudio();
      showToast('ZIP 반영 실패');
    } finally {
      event.target.value = '';
    }
  });

  document.getElementById('applyEditorsButton').addEventListener('click', applyEditors);
  document.getElementById('resetDefaultsButton').addEventListener('click', resetDefaults);
  document.getElementById('clearStorageButton').addEventListener('click', clearSavedState);
  document.getElementById('exportZipButton').addEventListener('click', async () => {
    try {
      await exportZipBundle();
    } catch (error) {
      showToast(error.message);
    }
  });
  document.getElementById('downloadJsonButton').addEventListener('click', downloadCurrentJson);

  window.addEventListener('scroll', () => {
    dom.scrollTopButton.classList.toggle('visible', window.scrollY > 500);
  });

  dom.scrollTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function init() {
  loadState();
  updateClock();
  window.setInterval(updateClock, 1000);
  bindEvents();
  observeSections();
  rebuild();
}

init();