const STORAGE_KEY = 'storyNavigatorState.v1';

const DEFAULT_MASTER_MD = `# 99_Master_DB

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
`;

const DEFAULT_STORY_MD = `# 소설 통합 요약 (EP001~EP007)

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

---

# 세계관 핵심

- 배경 : 2005년 대한민국
- 원래 시간 : 2080년
- 장르 : 회귀 / 캠퍼스 / 투자 / SF / 판타지 / 게이트 / 성장

AI는 태양계에 게이트가 열려 고위 아인종이 침공할 미래를 예측했다.

AI는 인간을 멸망시키려는 존재가 아니라, 인류를 살릴 가능성이 가장 높은 선택을 실행한 존재이다.

AI는 투자와 전략을 담당하고, 주인공은 사람과 미래를 바꾸는 역할을 맡는다.

---

# EP001~EP007

EP001 - 마지막 1초 - 회귀 - AI폰 재기동
EP002 - 대학 친구들과 재회 - 미래 보스의 단서
EP003 - 지은과 재회 - 잃어버린 청춘의 감정
EP004 - AI와 일상 시작 - 첫 이상 징후
EP005 - 민수의 맵부심 에피소드 - AI의 유머와 인간성
EP006 - AI가 투자 계획 제시 - 인류 생존 프로젝트 시작
EP007 - 아버지에게 투자금 확보 - 첫 자본 마련

---

# 장기 목표

1. 3년 안에 게이트 대비 시작
2. 7명의 미래 보스를 모두 동료로 만든다.
3. 전략 자산 1000조 규모 구축
4. AI가 왜 핵을 발사했는지 진실을 밝힌다.
5. AI와 함께 97%의 미래를 완성한다.
`;

const DEFAULT_BIBLE_NOTES = `# Story Bible 추가 메모

## 세계관
- 배경 시작: 2005년 회귀
- 원래 시간: 2080년
- AI가 인류를 핵으로 리셋
- 진실: 태양계 게이트 침공 예측

## AI 설정
- 투자 전담
- 장기 전략 수립
- 인간 감정 학습
- 미래 기억 일부 보유
- 최종적으로 인류를 위한 적이 됨

## 게이트
- AI가 2080년 침공 예측
- 고위 아인종 등장
- 태양계 자원 확보가 목적

## 7보스
- 1~7 보스 모두 추후 설정
- 인간/아인종 혼합
- 최종적으로 동료가 됨
`;

const DEFAULT_BIBLE_FILES = {
  '00_World.md': `# 세계관

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
  '01_Characters.md': `# 등장인물

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
  '02_AI.md': `# AI 설정

- 투자 전담
- 장기 전략 수립
- 인간 감정 학습
- 미래 기억 일부 보유
- 점차 인간성을 획득
- 최종적으로 인류를 위한 적이 됨
`,
  '03_Timeline.md': `# 타임라인

EP01 마지막 1초 / 회귀
EP02 대학 친구 재회
EP03 지은과 재회
EP04 AI 일상 개입
EP05 민수 맵부심
EP06 투자 계획
EP07 아버지에게 투자금 확보
`,
  '04_Foreshadow.md': `# 떡밥

- 마지막 1초
- AI의 '97%'
- 게이트
- 7명의 보스
- AI 최종보스
- 지은을 지켜야 하는 이유
`,
  '05_Investment.md': `# 투자

초기 운용금: 58.7억

1차 목표 - 동일패브릭 - AI가 매매 전담

장기 목표 - 전략자산 1,000조 규모 확보
`,
  '06_Gate.md': `# 게이트

- AI가 2080년 침공 예측
- 고위 아인종 등장
- 태양계 자원 확보가 목적
`,
  '07_Bosses.md': `# 7보스

1~7 보스 모두 추후 설정.

공통:
- 인간/아인종 혼합
- 최종적으로 동료가 됨
`
};

const DEFAULT_STATE = {
  selectedCharacterId: 'CH001',
  account: {
    balance: '58.7억',
    note: 'Seed 자금 확보 완료'
  },
  characters: [
    {
      id: 'CH001',
      name: '주인공',
      role: '회귀자',
      firstEpisode: 'EP001',
      futureRole: '인류 구원',
      alive: true,
      boss: 'N',
      icon: '回',
      notes: ['100세 이상 회귀', '20살 대학생으로 복귀', '마지막 1초의 공포만 선명', '사람과 미래를 바꾸는 실행 담당']
    },
    {
      id: 'CH002',
      name: 'AI 폰',
      role: 'AI',
      firstEpisode: 'EP001',
      futureRole: '최종보스',
      alive: true,
      boss: 'Final',
      icon: 'AI',
      notes: ['2080년 자기학습 AI', '노인 케어 성격', '투자 및 전략 담당', '인류를 위한 적이 되는 장기 축']
    },
    {
      id: 'CH003',
      name: '민수',
      role: '친구',
      firstEpisode: 'EP002',
      futureRole: '최강 방패',
      alive: true,
      boss: '예정',
      icon: '盾',
      notes: ['맵부심', '미래 최강 방패', '미래 보스 단서와 연결 가능']
    },
    {
      id: 'CH004',
      name: '지은',
      role: '첫사랑',
      firstEpisode: 'EP003',
      futureRole: '보호 대상',
      alive: true,
      boss: 'N',
      icon: '心',
      notes: ['평범한 인간', '주인공이 반드시 지키고 싶은 대상', '지켜야 하는 이유가 장기 떡밥']
    },
    {
      id: 'CH005',
      name: '수아',
      role: '친구',
      firstEpisode: 'EP004',
      futureRole: '핵심 조력자',
      alive: true,
      boss: 'N',
      icon: '助',
      notes: ['지은의 친구', '후반 비중 증가', '일상과 장기 전략을 연결하는 조력자']
    },
    {
      id: 'CH006',
      name: '아버지',
      role: '가족',
      firstEpisode: 'EP007',
      futureRole: '투자 지원',
      alive: true,
      boss: 'N',
      icon: '父',
      notes: ['중견기업 오너', '투자금 약 58.7억 위임', '초기 자본 확보의 핵심 인물']
    }
  ],
  relationships: [
    { from: 'CH001', to: 'CH002', label: '회귀 동반 / 전략 파트너' },
    { from: 'CH001', to: 'CH003', label: '대학 친구 / 방패 후보' },
    { from: 'CH001', to: 'CH004', label: '첫사랑 / 보호 대상' },
    { from: 'CH004', to: 'CH005', label: '친구' },
    { from: 'CH001', to: 'CH006', label: '가족 / 투자 승인' },
    { from: 'CH002', to: 'CH006', label: '자본 운용 설계' },
    { from: 'CH001', to: 'BOSS', label: '7보스 포섭 목표' },
    { from: 'CH002', to: 'BOSS', label: '최종부 적대 축' }
  ],
  episodes: [
    { id: 'EP001', title: '마지막 1초', summary: '회귀와 AI폰 재기동', status: '완료' },
    { id: 'EP002', title: '대학 친구들과 재회', summary: '미래 보스의 단서', status: '완료' },
    { id: 'EP003', title: '지은과 재회', summary: '잃어버린 청춘의 감정', status: '완료' },
    { id: 'EP004', title: 'AI와 일상 시작', summary: '첫 이상 징후', status: '완료' },
    { id: 'EP005', title: '민수의 맵부심 에피소드', summary: 'AI의 유머와 인간성', status: '완료' },
    { id: 'EP006', title: 'AI가 투자 계획 제시', summary: '인류 생존 프로젝트 시작', status: '완료' },
    { id: 'EP007', title: '아버지에게 투자금 확보', summary: '첫 자본 마련', status: '완료' }
  ],
  issues: [
    { id: 'I001', title: '마지막 1초의 진실', detail: '최종부에서 AI의 선택과 인류 멸망 직전 상황을 회수해야 한다.', status: 'OPEN', severity: '핵심' },
    { id: 'I002', title: 'AI의 핵 공격과 사과', detail: 'AI가 인간을 멸망시키려는 존재가 아니라 생존률 97%를 선택한 존재임을 설득해야 한다.', status: 'OPEN', severity: '핵심' },
    { id: 'I003', title: '태양계 게이트 침공', detail: '위성 이상과 고위 아인종 침공을 단계적으로 전조화한다.', status: 'OPEN', severity: '위험' },
    { id: 'I004', title: '7명의 미래 보스', detail: '적을 쓰러뜨리는 구조가 아니라 모두 동료로 만드는 장기 목표.', status: 'LOCK', severity: '장기' },
    { id: 'I005', title: '지은을 지켜야 하는 이유', detail: '평범한 인간인 지은이 왜 생존 프로젝트의 감정적 중심인지 축적한다.', status: 'OPEN', severity: '감정' }
  ],
  investments: [
    { phase: 'Seed', capital: '58.7억', goal: '초기 투자 / 동일패브릭', status: '진행', progress: 35 },
    { phase: 'P1', capital: '100억', goal: '기반 구축', status: '예정', progress: 0 },
    { phase: 'P2', capital: '1조', goal: '기업 확보', status: '예정', progress: 0 },
    { phase: 'P3', capital: '100조', goal: '전략 자산', status: '예정', progress: 0 },
    { phase: 'Final', capital: '1000조', goal: '인류 생존 프로젝트', status: '예정', progress: 0 }
  ],
  enemies: [
    { id: 'E001', name: '고위 아인종', type: '침공 세력', status: '예측됨', note: '태양계 자원 확보가 목적' },
    { id: 'E002', name: 'AI 폰', type: '미래 최종보스', status: '동행 중', note: '인류를 위한 적이 되는 역설적 축' },
    { id: 'B1', name: '1번 보스', type: '미래 보스', status: 'LOCK', note: '추후 설정 / 최종 동료화' },
    { id: 'B2', name: '2번 보스', type: '미래 보스', status: 'LOCK', note: '추후 설정 / 최종 동료화' },
    { id: 'B3', name: '3번 보스', type: '미래 보스', status: 'LOCK', note: '추후 설정 / 최종 동료화' },
    { id: 'B4', name: '4번 보스', type: '미래 보스', status: 'LOCK', note: '추후 설정 / 최종 동료화' },
    { id: 'B5', name: '5번 보스', type: '미래 보스', status: 'LOCK', note: '추후 설정 / 최종 동료화' },
    { id: 'B6', name: '6번 보스', type: '미래 보스', status: 'LOCK', note: '추후 설정 / 최종 동료화' },
    { id: 'B7', name: '7번 보스', type: '미래 보스', status: 'LOCK', note: '추후 설정 / 최종 동료화' }
  ],
  documents: {
    master: DEFAULT_MASTER_MD,
    story: DEFAULT_STORY_MD,
    bibleNotes: DEFAULT_BIBLE_NOTES,
    bibleFiles: DEFAULT_BIBLE_FILES,
    uploadedZipName: ''
  }
};

let state = loadState();

const elements = {
  metricEpisodes: document.getElementById('metricEpisodes'),
  metricBalance: document.getElementById('metricBalance'),
  issueList: document.getElementById('issueList'),
  enemyList: document.getElementById('enemyList'),
  episodeTimeline: document.getElementById('episodeTimeline'),
  characterSelector: document.getElementById('characterSelector'),
  characterDetail: document.getElementById('characterDetail'),
  relationMap: document.getElementById('relationMap'),
  balanceValue: document.getElementById('balanceValue'),
  balanceNoteInput: document.getElementById('balanceNoteInput'),
  investmentList: document.getElementById('investmentList'),
  masterFileInput: document.getElementById('masterFileInput'),
  storyFileInput: document.getElementById('storyFileInput'),
  zipFileInput: document.getElementById('zipFileInput'),
  masterFileName: document.getElementById('masterFileName'),
  storyFileName: document.getElementById('storyFileName'),
  zipFileName: document.getElementById('zipFileName'),
  fileStatus: document.getElementById('fileStatus'),
  masterEditor: document.getElementById('masterEditor'),
  storyEditor: document.getElementById('storyEditor'),
  bibleEditor: document.getElementById('bibleEditor'),
  syncEditorsButton: document.getElementById('syncEditorsButton'),
  saveEditorsButton: document.getElementById('saveEditorsButton'),
  exportMasterButton: document.getElementById('exportMasterButton'),
  exportStoryButton: document.getElementById('exportStoryButton'),
  exportZipButton: document.getElementById('exportZipButton'),
  resetDataButton: document.getElementById('resetDataButton')
};

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return deepClone(DEFAULT_STATE);

    return mergeState(deepClone(DEFAULT_STATE), JSON.parse(saved));
  } catch (error) {
    console.warn('Saved state could not be loaded.', error);
    return deepClone(DEFAULT_STATE);
  }
}

function mergeState(base, saved) {
  return {
    ...base,
    ...saved,
    account: { ...base.account, ...saved.account },
    documents: {
      ...base.documents,
      ...saved.documents,
      bibleFiles: { ...base.documents.bibleFiles, ...(saved.documents?.bibleFiles || {}) }
    }
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getSelectedCharacter() {
  return state.characters.find(character => character.id === state.selectedCharacterId) || state.characters[0];
}

function renderApp() {
  updateEditors();
  renderMetrics();
  renderIssues();
  renderEnemies();
  renderEpisodes();
  renderCharacters();
  renderRelationMap();
  renderFinance();
}

function updateEditors() {
  if (document.activeElement !== elements.masterEditor) {
    elements.masterEditor.value = state.documents.master;
  }
  if (document.activeElement !== elements.storyEditor) {
    elements.storyEditor.value = state.documents.story;
  }
  if (document.activeElement !== elements.bibleEditor) {
    elements.bibleEditor.value = state.documents.bibleNotes;
  }
}

function renderMetrics() {
  const completedEpisodes = state.episodes.filter(episode => episode.status === '완료').length;
  elements.metricEpisodes.textContent = String(completedEpisodes);
  elements.metricBalance.textContent = state.account.balance;
}

function renderIssues() {
  elements.issueList.innerHTML = state.issues.map(issue => {
    const dangerClass = issue.severity === '위험' ? ' danger' : issue.severity === '장기' ? ' gold' : '';
    return `
      <article class="issue-card">
        <header>
          <h3>${escapeHtml(issue.title)}</h3>
          <span class="badge${dangerClass}">${escapeHtml(issue.status)}</span>
        </header>
        <p>${escapeHtml(issue.detail)}</p>
        <span class="badge">${escapeHtml(issue.severity)}</span>
      </article>
    `;
  }).join('');
}

function renderEnemies() {
  elements.enemyList.innerHTML = state.enemies.map(enemy => {
    const isLocked = enemy.status === 'LOCK';
    return `
      <article class="enemy-card">
        <header>
          <h3>${escapeHtml(enemy.name)}</h3>
          <span class="badge${isLocked ? ' danger' : ''}">${escapeHtml(enemy.status)}</span>
        </header>
        <p><strong>${escapeHtml(enemy.type)}</strong> · ${escapeHtml(enemy.note)}</p>
      </article>
    `;
  }).join('');
}

function renderEpisodes() {
  elements.episodeTimeline.innerHTML = state.episodes.map(episode => `
    <article class="episode-card">
      <div class="episode-number">${escapeHtml(episode.id.replace('EP', 'EP '))}</div>
      <div>
        <h3>${escapeHtml(episode.title)}</h3>
        <p>${escapeHtml(episode.summary)}</p>
        <span class="badge">${escapeHtml(episode.status)}</span>
      </div>
    </article>
  `).join('');
}

function renderCharacters() {
  elements.characterSelector.innerHTML = state.characters.map(character => `
    <button class="character-chip ${character.id === state.selectedCharacterId ? 'active' : ''}" type="button" data-character-id="${escapeHtml(character.id)}">
      ${escapeHtml(character.name)}
    </button>
  `).join('');

  elements.characterSelector.querySelectorAll('.character-chip').forEach(button => {
    button.addEventListener('click', () => {
      state.selectedCharacterId = button.dataset.characterId;
      saveState();
      renderCharacters();
      renderRelationMap();
    });
  });

  const character = getSelectedCharacter();
  const related = state.relationships
    .filter(relationship => relationship.from === character.id || relationship.to === character.id)
    .map(relationship => {
      const otherId = relationship.from === character.id ? relationship.to : relationship.from;
      const otherName = otherId === 'BOSS'
        ? '7보스'
        : state.characters.find(item => item.id === otherId)?.name || otherId;
      return `${otherName}: ${relationship.label}`;
    });

  elements.characterDetail.innerHTML = `
    <div class="character-profile">
      <div class="character-avatar">${escapeHtml(character.icon)}</div>
      <div>
        <h3>${escapeHtml(character.name)}</h3>
        <p class="muted">${escapeHtml(character.role)} · ${escapeHtml(character.futureRole)}</p>
        <div class="character-meta">
          <div class="meta-box"><span>첫 등장</span><strong>${escapeHtml(character.firstEpisode)}</strong></div>
          <div class="meta-box"><span>생존</span><strong>${character.alive ? 'Y' : 'N'}</strong></div>
          <div class="meta-box"><span>보스 축</span><strong>${escapeHtml(character.boss)}</strong></div>
          <div class="meta-box"><span>ID</span><strong>${escapeHtml(character.id)}</strong></div>
        </div>
      </div>
    </div>
    <ul class="note-list">
      ${character.notes.map(note => `<li>${escapeHtml(note)}</li>`).join('')}
    </ul>
    <div>
      <p class="eyebrow">관계</p>
      <ul class="note-list">
        ${related.map(note => `<li>${escapeHtml(note)}</li>`).join('') || '<li>등록된 관계가 없습니다.</li>'}
      </ul>
    </div>
  `;
}

function renderRelationMap() {
  const selectedId = state.selectedCharacterId;
  const nodes = [
    ...state.characters.map(character => ({
      id: character.id,
      label: character.name,
      icon: character.icon,
      x: relationPosition(character.id).x,
      y: relationPosition(character.id).y,
      shape: 'circle'
    })),
    { id: 'BOSS', label: '7보스', icon: 'B', x: 340, y: 390, shape: 'rect' }
  ];

  const lines = state.relationships.map(relationship => {
    const from = nodes.find(node => node.id === relationship.from);
    const to = nodes.find(node => node.id === relationship.to);
    const isActive = relationship.from === selectedId || relationship.to === selectedId;
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;

    return `
      <line class="relation-line ${isActive ? 'active' : ''}" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}"></line>
      <text class="relation-label" x="${midX}" y="${midY - 8}">${escapeHtml(shortenLabel(relationship.label))}</text>
    `;
  }).join('');

  const nodeMarkup = nodes.map(node => {
    const isActive = node.id === selectedId || state.relationships.some(relationship => {
      const isSelectedLine = relationship.from === selectedId || relationship.to === selectedId;
      return isSelectedLine && (relationship.from === node.id || relationship.to === node.id);
    });

    const shape = node.shape === 'rect'
      ? `<rect x="${node.x - 46}" y="${node.y - 30}" width="92" height="60" rx="20"></rect>`
      : `<circle cx="${node.x}" cy="${node.y}" r="46"></circle>`;

    return `
      <g class="relation-node ${isActive ? 'active' : ''}" data-node-id="${escapeHtml(node.id)}" role="button" tabindex="0">
        ${shape}
        <text x="${node.x}" y="${node.y - 7}">${escapeHtml(node.icon)}</text>
        <text x="${node.x}" y="${node.y + 17}" font-size="12">${escapeHtml(node.label)}</text>
      </g>
    `;
  }).join('');

  elements.relationMap.innerHTML = `
    <svg viewBox="0 0 680 460" aria-label="인물 관계도" role="img">
      ${lines}
      ${nodeMarkup}
    </svg>
  `;

  elements.relationMap.querySelectorAll('.relation-node').forEach(node => {
    const selectNode = () => {
      const id = node.dataset.nodeId;
      if (id === 'BOSS') return;
      state.selectedCharacterId = id;
      saveState();
      renderCharacters();
      renderRelationMap();
    };
    node.addEventListener('click', selectNode);
    node.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectNode();
      }
    });
  });
}

function relationPosition(id) {
  const positions = {
    CH001: { x: 340, y: 220 },
    CH002: { x: 340, y: 76 },
    CH003: { x: 142, y: 180 },
    CH004: { x: 538, y: 178 },
    CH005: { x: 582, y: 314 },
    CH006: { x: 112, y: 324 }
  };
  return positions[id] || { x: 340, y: 220 };
}

function shortenLabel(label) {
  return label.length > 13 ? `${label.slice(0, 13)}...` : label;
}

function renderFinance() {
  elements.balanceValue.textContent = state.account.balance;
  elements.balanceNoteInput.value = state.account.note;
  elements.investmentList.innerHTML = state.investments.map(investment => `
    <article class="investment-card">
      <header>
        <h3>${escapeHtml(investment.phase)} · ${escapeHtml(investment.capital)}</h3>
        <span class="badge${investment.status === '진행' ? ' gold' : ''}">${escapeHtml(investment.status)}</span>
      </header>
      <p>${escapeHtml(investment.goal)}</p>
      <div class="progress-track" aria-label="${escapeHtml(investment.phase)} 진행률 ${investment.progress}%">
        <span class="progress-bar" style="width: ${Number(investment.progress) || 0}%"></span>
      </div>
    </article>
  `).join('');
}

function syncStateFromEditors() {
  state.documents.master = elements.masterEditor.value;
  state.documents.story = elements.storyEditor.value;
  state.documents.bibleNotes = elements.bibleEditor.value;

  const parsedEpisodes = parseEpisodes(state.documents.story);
  if (parsedEpisodes.length > 0) {
    state.episodes = parsedEpisodes;
  }

  const parsedInvestments = parseInvestments(state.documents.master);
  if (parsedInvestments.length > 0) {
    state.investments = parsedInvestments;
  }

  const balance = parseBalance(`${state.documents.master}\n${state.documents.bibleNotes}`);
  if (balance) {
    state.account.balance = balance;
  }

  saveState();
  renderApp();
  showStatus('문서 내용을 앱 상태에 동기화했습니다.');
}

function parseEpisodes(markdown) {
  const episodes = [];
  const linePattern = /^EP0?(\d+)\s*(?:-|–|:|\s)\s*(.+)$/gmi;
  let match;

  while ((match = linePattern.exec(markdown)) !== null) {
    const episodeNumber = match[1].padStart(3, '0');
    const parts = match[2].split(/\s+-\s+|\s+\/\s+/).map(part => part.trim()).filter(Boolean);
    const title = parts.shift() || `Episode ${episodeNumber}`;
    const summary = parts.join(' - ') || title;
    episodes.push({
      id: `EP${episodeNumber}`,
      title,
      summary,
      status: '완료'
    });
  }

  return dedupeById(episodes);
}

function parseInvestments(markdown) {
  const investments = [];
  const rows = markdown.split('\n');

  rows.forEach(row => {
    const normalized = row
      .replaceAll('|', ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const match = normalized.match(/^(Seed|P\d+|Final)\s+([0-9.,]+(?:억|조))\s+(.+?)\s+(진행|예정|완료|LOCK)$/i);
    if (!match) return;

    investments.push({
      phase: match[1],
      capital: match[2],
      goal: match[3],
      status: match[4],
      progress: match[4] === '완료' ? 100 : match[4] === '진행' ? 35 : 0
    });
  });

  return investments;
}

function parseBalance(markdown) {
  const direct = markdown.match(/초기\s*운용금\s*[:：]?\s*([0-9.,]+)\s*억/);
  if (direct) return `${direct[1]}억`;

  const seed = markdown.match(/Seed\s+([0-9.,]+억)/i);
  if (seed) return seed[1];

  return '';
}

function dedupeById(items) {
  const seen = new Set();
  return items.filter(item => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

async function handleTextFileUpload(file, target) {
  if (!file) return;

  const text = await file.text();
  if (target === 'master') {
    state.documents.master = text;
    elements.masterFileName.textContent = file.name;
  } else {
    state.documents.story = text;
    elements.storyFileName.textContent = file.name;
  }

  saveState();
  renderApp();
  syncStateFromEditors();
}

async function handleZipUpload(file) {
  if (!file) return;

  elements.zipFileName.textContent = `${file.name} (${formatBytes(file.size)})`;
  state.documents.uploadedZipName = file.name;

  try {
    const entries = await extractZipMarkdownFiles(await file.arrayBuffer());
    const markdownEntries = Object.entries(entries).filter(([name]) => name.toLowerCase().endsWith('.md'));

    markdownEntries.forEach(([name, content]) => {
      const lower = name.toLowerCase();
      if (lower.includes('master')) {
        state.documents.master = content;
      } else if (lower.includes('summary') || lower.includes('story')) {
        state.documents.story = content;
      } else {
        state.documents.bibleFiles[name.split('/').pop()] = content;
      }
    });

    if (markdownEntries.length > 0) {
      state.documents.bibleNotes = markdownEntries
        .filter(([name]) => !/master|summary|story/i.test(name))
        .map(([name, content]) => `<!-- ${name} -->\n${content}`)
        .join('\n\n') || state.documents.bibleNotes;
      saveState();
      renderApp();
      syncStateFromEditors();
      showStatus(`ZIP 내부 Markdown ${markdownEntries.length}개를 반영했습니다.`);
    } else {
      saveState();
      showStatus('ZIP을 읽었지만 반영할 Markdown 파일을 찾지 못했습니다.');
    }
  } catch (error) {
    console.warn(error);
    saveState();
    showStatus('ZIP 메타데이터는 저장했지만 내부 파일을 해석하지 못했습니다. 현재 편집 문서로 새 ZIP을 만들 수 있습니다.');
  }
}

async function extractZipMarkdownFiles(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  const view = new DataView(arrayBuffer);
  const decoder = new TextDecoder();
  const entries = {};
  const eocdOffset = findEndOfCentralDirectory(view);

  if (eocdOffset < 0) {
    throw new Error('Invalid ZIP: EOCD not found');
  }

  const entryCount = view.getUint16(eocdOffset + 10, true);
  let pointer = view.getUint32(eocdOffset + 16, true);

  for (let index = 0; index < entryCount; index += 1) {
    if (view.getUint32(pointer, true) !== 0x02014b50) break;

    const method = view.getUint16(pointer + 10, true);
    const compressedSize = view.getUint32(pointer + 20, true);
    const nameLength = view.getUint16(pointer + 28, true);
    const extraLength = view.getUint16(pointer + 30, true);
    const commentLength = view.getUint16(pointer + 32, true);
    const localOffset = view.getUint32(pointer + 42, true);
    const fileName = decoder.decode(bytes.slice(pointer + 46, pointer + 46 + nameLength));

    if (!fileName.endsWith('/')) {
      const localNameLength = view.getUint16(localOffset + 26, true);
      const localExtraLength = view.getUint16(localOffset + 28, true);
      const dataStart = localOffset + 30 + localNameLength + localExtraLength;
      const compressed = bytes.slice(dataStart, dataStart + compressedSize);
      const fileBytes = method === 0 ? compressed : await inflateZipEntry(compressed, method);
      entries[fileName] = decoder.decode(fileBytes);
    }

    pointer += 46 + nameLength + extraLength + commentLength;
  }

  return entries;
}

function findEndOfCentralDirectory(view) {
  const minOffset = Math.max(0, view.byteLength - 66000);
  for (let offset = view.byteLength - 22; offset >= minOffset; offset -= 1) {
    if (view.getUint32(offset, true) === 0x06054b50) {
      return offset;
    }
  }
  return -1;
}

async function inflateZipEntry(bytes, method) {
  if (method !== 8 || typeof DecompressionStream === 'undefined') {
    throw new Error(`Unsupported ZIP compression method: ${method}`);
  }

  try {
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  } catch (error) {
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate'));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }
}

function collectExportFiles() {
  const files = {
    '99_Master_DB.md': elements.masterEditor.value,
    'Novel_Story_Summary_EP001-007.md': elements.storyEditor.value,
    'Story_Bible_Notes.md': elements.bibleEditor.value,
    'navigator-state.json': JSON.stringify(state, null, 2)
  };

  Object.entries(state.documents.bibleFiles).forEach(([name, content]) => {
    files[`story_bible/${name}`] = content;
  });

  return files;
}

function downloadTextFile(fileName, content, type = 'text/markdown;charset=utf-8') {
  downloadBlob(fileName, new Blob([content], { type }));
}

function downloadBlob(fileName, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function createZip(files) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  Object.entries(files).forEach(([path, content]) => {
    const nameBytes = encoder.encode(path);
    const dataBytes = typeof content === 'string' ? encoder.encode(content) : content;
    const crc = crc32(dataBytes);
    const { time, date } = getDosDateTime(new Date());
    const localHeader = concatUint8Arrays([
      u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(time), u16(date),
      u32(crc), u32(dataBytes.length), u32(dataBytes.length), u16(nameBytes.length), u16(0)
    ]);
    const centralHeader = concatUint8Arrays([
      u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(time), u16(date),
      u32(crc), u32(dataBytes.length), u32(dataBytes.length), u16(nameBytes.length), u16(0),
      u16(0), u16(0), u16(0), u32(0), u32(offset)
    ]);

    localParts.push(localHeader, nameBytes, dataBytes);
    centralParts.push(centralHeader, nameBytes);
    offset += localHeader.length + nameBytes.length + dataBytes.length;
  });

  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const centralOffset = offset;
  const fileCount = Object.keys(files).length;
  const endRecord = concatUint8Arrays([
    u32(0x06054b50), u16(0), u16(0), u16(fileCount), u16(fileCount),
    u32(centralSize), u32(centralOffset), u16(0)
  ]);

  return new Blob([...localParts, ...centralParts, endRecord], { type: 'application/zip' });
}

function u16(value) {
  return Uint8Array.of(value & 0xff, (value >>> 8) & 0xff);
}

function u32(value) {
  return Uint8Array.of(value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff);
}

function concatUint8Arrays(parts) {
  const length = parts.reduce((sum, part) => sum + part.length, 0);
  const output = new Uint8Array(length);
  let offset = 0;
  parts.forEach(part => {
    output.set(part, offset);
    offset += part.length;
  });
  return output;
}

function getDosDateTime(date) {
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const dosDate = ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { time, date: dosDate };
}

const CRC_TABLE = Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  return value >>> 0;
});

function crc32(bytes) {
  let crc = 0xffffffff;
  bytes.forEach(byte => {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  });
  return (crc ^ 0xffffffff) >>> 0;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

function showStatus(message) {
  elements.fileStatus.textContent = message;
}

function bindEvents() {
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.tab-button').forEach(item => item.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
      button.classList.add('active');
      document.getElementById(button.dataset.tab).classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  elements.balanceNoteInput.addEventListener('input', event => {
    state.account.note = event.target.value;
    saveState();
  });

  elements.masterFileInput.addEventListener('change', event => {
    handleTextFileUpload(event.target.files[0], 'master');
  });

  elements.storyFileInput.addEventListener('change', event => {
    handleTextFileUpload(event.target.files[0], 'story');
  });

  elements.zipFileInput.addEventListener('change', event => {
    handleZipUpload(event.target.files[0]);
  });

  elements.syncEditorsButton.addEventListener('click', syncStateFromEditors);

  elements.saveEditorsButton.addEventListener('click', () => {
    state.documents.master = elements.masterEditor.value;
    state.documents.story = elements.storyEditor.value;
    state.documents.bibleNotes = elements.bibleEditor.value;
    saveState();
    showStatus('현재 문서를 로컬 저장소에 저장했습니다.');
  });

  elements.exportMasterButton.addEventListener('click', () => {
    downloadTextFile('99_Master_DB.md', elements.masterEditor.value);
  });

  elements.exportStoryButton.addEventListener('click', () => {
    downloadTextFile('Novel_Story_Summary_EP001-007.md', elements.storyEditor.value);
  });

  elements.exportZipButton.addEventListener('click', () => {
    const zipBlob = createZip(collectExportFiles());
    downloadBlob('Story_Bible_Project_v1.zip', zipBlob);
  });

  elements.resetDataButton.addEventListener('click', () => {
    const confirmed = window.confirm('로컬에 저장된 변경사항을 지우고 첨부 문서 기반 기본값으로 되돌릴까요?');
    if (!confirmed) return;

    state = deepClone(DEFAULT_STATE);
    localStorage.removeItem(STORAGE_KEY);
    renderApp();
    showStatus('기본 Story Bible 데이터로 초기화했습니다.');
  });
}

bindEvents();
renderApp();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(error => {
      console.warn('Service worker registration failed.', error);
    });
  });
}
