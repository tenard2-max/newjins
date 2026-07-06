/*
 * Story Bible Navigator — 기본 데이터 (Seed Data)
 * -------------------------------------------------
 * Story Bible Project Constitution v1.0 파일 체계를 따릅니다.
 *   00_World / 01_Characters / 02_AI / 03_Timeline
 *   04_Foreshadow / 05_Investment / 06_Gate / 07_Bosses
 *   99_Master_DB / Novel_Story_Summary_EP001-007
 *
 * 이 파일은 "출고 시 기본값(seed)"이며, 앱에서 편집한 내용은
 * localStorage 에 저장되어 다음 실행 시 우선 적용됩니다.
 */

const STORY_BIBLE_SEED = {
  meta: {
    title: "(가제) 마지막 1초",
    constitution: "Story Bible Project Constitution v1.0",
    timelineStart: "2005-03-02",
    originalTimeline: "2080",
    storyStatus: "EP001~EP007",
    genre: ["회귀", "캠퍼스", "투자", "SF", "판타지", "게이트", "성장"],
  },

  // ── 인물 ──────────────────────────────────────────────
  // relations: 다른 인물 id 와의 관계 (관계도 그래프에 사용)
  characters: [
    {
      id: "CH001",
      name: "주인공",
      role: "회귀자",
      firstEP: "EP001",
      futureRole: "인류 구원",
      alive: true,
      isBoss: false,
      color: "#00ccff",
      portrait: "",
      notes: "100세 이상 회귀 · 초기 치매 수준 기억 손실 · 마지막 1초만 선명",
      bullets: [
        "100세가 넘은 노인 상태에서 2005년 20살 대학생으로 회귀",
        "기억 대부분 소실, 마지막 1초의 공포만 선명",
        "사람과 미래를 바꾸는 역할 담당",
      ],
      relations: [
        { to: "CH002", label: "동행 AI", type: "ally" },
        { to: "CH003", label: "친구", type: "ally" },
        { to: "CH004", label: "첫사랑", type: "love" },
        { to: "CH006", label: "부자", type: "family" },
      ],
    },
    {
      id: "CH002",
      name: "AI 폰",
      role: "AI",
      firstEP: "EP001",
      futureRole: "최종보스",
      alive: true,
      isBoss: true,
      bossTag: "Final",
      color: "#9d84ff",
      portrait: "",
      notes: "2080년 자기학습 AI · 오프라인 동작 · 노인 케어 성격(40대 여성)",
      bullets: [
        "투자 및 장기 전략 전담",
        "인간 감정을 학습하며 점차 인간성을 획득",
        "미래 기억 일부 보유",
        "최종적으로 인류를 위한 '적'이 됨 (최종보스)",
      ],
      relations: [
        { to: "CH001", label: "전략 파트너", type: "ally" },
      ],
    },
    {
      id: "CH003",
      name: "민수",
      role: "친구",
      firstEP: "EP002",
      futureRole: "최강 방패",
      alive: true,
      isBoss: false,
      color: "#00ffaa",
      portrait: "",
      notes: "맵부심 · 미래 최강 방패",
      bullets: ["대학 친구", "맵부심 캐릭터", "미래에 최강 방패로 각성 예정"],
      relations: [{ to: "CH001", label: "절친", type: "ally" }],
    },
    {
      id: "CH004",
      name: "지은",
      role: "첫사랑",
      firstEP: "EP003",
      futureRole: "보호 대상",
      alive: true,
      isBoss: false,
      color: "#ff7eb6",
      portrait: "",
      notes: "첫사랑 · 반드시 지키고 싶은 평범한 인간",
      bullets: ["주인공의 첫사랑", "평범한 인간", "반드시 지켜야 하는 존재 (떡밥)"],
      relations: [
        { to: "CH001", label: "첫사랑", type: "love" },
        { to: "CH005", label: "친구", type: "ally" },
      ],
    },
    {
      id: "CH005",
      name: "수아",
      role: "친구",
      firstEP: "EP004",
      futureRole: "핵심 조력자",
      alive: true,
      isBoss: false,
      color: "#ffcc00",
      portrait: "",
      notes: "지은의 친구 · 후반 핵심 조력자 (후반 비중 증가)",
      bullets: ["지은의 친구", "후반 핵심 조력자", "스토리 후반 비중 증가"],
      relations: [{ to: "CH004", label: "친구", type: "ally" }],
    },
    {
      id: "CH006",
      name: "아버지",
      role: "가족",
      firstEP: "EP007",
      futureRole: "투자 지원",
      alive: true,
      isBoss: false,
      color: "#66b3ff",
      portrait: "",
      notes: "중견기업 오너 · 투자금 약 58.7억 위임",
      bullets: ["중견기업 대표", "약 58.7억 투자금 운용 권한 부여", "초기 자본의 원천"],
      relations: [{ to: "CH001", label: "부자", type: "family" }],
    },
  ],

  // ── 떡밥 / 중요이슈 ────────────────────────────────────
  foreshadow: [
    { id: "F001", ep: "EP001", text: "마지막 1초", payoff: "최종부", status: "OPEN" },
    { id: "F002", ep: "EP001", text: "AI의 사과", payoff: "최종부", status: "OPEN" },
    { id: "F003", ep: "EP004", text: "위성 이상", payoff: "게이트 전조", status: "OPEN" },
    { id: "F004", ep: "EP006", text: "97%", payoff: "최종부", status: "OPEN" },
    { id: "F005", ep: "-", text: "7명의 보스", payoff: "전편에 걸침", status: "OPEN" },
    { id: "F006", ep: "-", text: "지은을 지켜야 하는 이유", payoff: "미정", status: "OPEN" },
  ],

  // ── 투자 로드맵 ────────────────────────────────────────
  investment: {
    firstTarget: "동일패브릭 (AI 매매 전담)",
    longTerm: "전략자산 1,000조 규모 확보",
    phases: [
      { phase: "Seed", capital: "58.7억", goal: "초기 투자", status: "진행" },
      { phase: "P1", capital: "100억", goal: "기반 구축", status: "예정" },
      { phase: "P2", capital: "1조", goal: "기업 확보", status: "예정" },
      { phase: "P3", capital: "100조", goal: "전략 자산", status: "예정" },
      { phase: "Final", capital: "1000조", goal: "인류 생존 프로젝트", status: "예정" },
    ],
  },

  // ── 통장잔고 (억 단위) ─────────────────────────────────
  // 잔고는 거래내역(transactions)의 누적으로 계산
  bank: {
    unit: "억원",
    transactions: [
      { id: "T001", ep: "EP007", date: "2005-04", desc: "아버지 투자금 위임 (초기 운용금)", amount: 58.7 },
    ],
  },

  // ── 적 리스트 (7보스) ──────────────────────────────────
  bosses: [
    { id: "B1", name: "미정", firstEP: "-", ally: "예정", status: "LOCK" },
    { id: "B2", name: "미정", firstEP: "-", ally: "예정", status: "LOCK" },
    { id: "B3", name: "미정", firstEP: "-", ally: "예정", status: "LOCK" },
    { id: "B4", name: "미정", firstEP: "-", ally: "예정", status: "LOCK" },
    { id: "B5", name: "미정", firstEP: "-", ally: "예정", status: "LOCK" },
    { id: "B6", name: "미정", firstEP: "-", ally: "예정", status: "LOCK" },
    { id: "B7", name: "미정", firstEP: "-", ally: "예정", status: "LOCK" },
  ],
  bossNote: "공통: 인간/아인종 혼합, 최종적으로 모두 동료가 됨. AI 폰은 별도 최종보스.",

  // ── 에피소드 ───────────────────────────────────────────
  episodes: [
    { id: "EP001", title: "마지막 1초 / 회귀 / AI폰 재기동", done: true },
    { id: "EP002", title: "대학 친구들과 재회 · 미래 보스의 단서", done: true },
    { id: "EP003", title: "지은과 재회 · 잃어버린 청춘의 감정", done: true },
    { id: "EP004", title: "AI와 일상 시작 · 첫 이상 징후", done: true },
    { id: "EP005", title: "민수의 맵부심 · AI의 유머와 인간성", done: true },
    { id: "EP006", title: "AI가 투자 계획 제시 · 인류 생존 프로젝트 시작", done: true },
    { id: "EP007", title: "아버지에게 투자금 확보 · 첫 자본 마련", done: true },
    { id: "EP008", title: "(집필 예정)", done: false },
  ],

  // ── 장기 목표 ──────────────────────────────────────────
  goals: [
    "3년 안에 게이트 대비 시작",
    "7명의 미래 보스를 모두 동료로 만든다",
    "전략 자산 1000조 규모 구축",
    "AI가 왜 핵을 발사했는지 진실을 밝힌다",
    "AI와 함께 97%의 미래를 완성한다",
  ],

  // ── 원문 문서 (편집 + ZIP 내보내기 대상) ────────────────
  // Story Bible Project Constitution v1.0 파일 체계
  files: {
    "00_World.md": `# 세계관

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
    "01_Characters.md": `# 등장인물

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
    "02_AI.md": `# AI 설정

-   투자 전담
-   장기 전략 수립
-   인간 감정 학습
-   미래 기억 일부 보유
-   점차 인간성을 획득
-   최종적으로 인류를 위한 적이 됨
`,
    "03_Timeline.md": `# 타임라인

EP01 마지막 1초 / 회귀
EP02 대학 친구 재회
EP03 지은과 재회
EP04 AI 일상 개입
EP05 민수 맵부심
EP06 투자 계획
EP07 아버지에게 투자금 확보
`,
    "04_Foreshadow.md": `# 떡밥

-   마지막 1초
-   AI의 '97%'
-   게이트
-   7명의 보스
-   AI 최종보스
-   지은을 지켜야 하는 이유
`,
    "05_Investment.md": `# 투자

초기 운용금: 58.7억

1차 목표 - 동일패브릭 - AI가 매매 전담

장기 목표 - 전략자산 1,000조 규모 확보
`,
    "06_Gate.md": `# 게이트

-   AI가 2080년 침공 예측
-   고위 아인종 등장
-   태양계 자원 확보가 목적
`,
    "07_Bosses.md": `# 7보스

1~7 보스 모두 추후 설정.

공통: - 인간/아인종 혼합 - 최종적으로 동료가 됨.
`,
    "99_Master_DB.md": `# 99_Master_DB

## Project

-   Title: (Working)
-   Timeline Start: 2005-03-02
-   Original Timeline: 2080
-   Story Status: EP001~EP007

# Character DB

  ID      Name     Role     First EP     Future Role     Alive    Boss    Notes
  CH001   주인공   회귀자   EP001        인류 구원       Y        N       100세 이상 회귀
  CH002   AI 폰    AI       EP001        최종보스        Y        Final   노인 케어 AI
  CH003   민수     친구     EP002        최강 방패       Y        예정    맵부심
  CH004   지은     첫사랑   EP003        보호 대상       Y        N       평범한 인간
  CH005   수아     친구     EP004        핵심 조력자     Y        N       후반 비중 증가
  CH006   아버지   가족     EP007        투자 지원       Y        N       중견기업 오너

# Foreshadow DB

  ID     EP      Foreshadow   Planned Payoff   Status
  F001   EP001   마지막 1초   최종부           OPEN
  F002   EP001   AI의 사과    최종부           OPEN
  F003   EP004   위성 이상    게이트 전조      OPEN
  F004   EP006   97%          최종부           OPEN

# Investment DB

  Phase   Capital   Goal                 Status
  Seed    58.7억    초기 투자            진행
  P1      100억     기반 구축            예정
  P2      1조       기업 확보            예정
  P3      100조     전략 자산            예정
  Final   1000조    인류 생존 프로젝트   예정

# Boss Progress

  Boss   Name   First EP   Ally   Status
  B1     미정   -          예정   LOCK
  B2     미정   -          예정   LOCK
  B3     미정   -          예정   LOCK
  B4     미정   -          예정   LOCK
  B5     미정   -          예정   LOCK
  B6     미정   -          예정   LOCK
  B7     미정   -          예정   LOCK

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
    "Novel_Story_Summary_EP001-007.md": `# 소설 통합 요약 (EP001~EP007)

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

# EP001~EP007

EP001 - 마지막 1초 - 회귀 - AI폰 재기동
EP002 - 대학 친구들과 재회 - 미래 보스의 단서
EP003 - 지은과 재회 - 잃어버린 청춘의 감정
EP004 - AI와 일상 시작 - 첫 이상 징후
EP005 - 민수의 맵부심 에피소드 - AI의 유머와 인간성
EP006 - AI가 투자 계획 제시 - 인류 생존 프로젝트 시작
EP007 - 아버지에게 투자금 확보 - 첫 자본 마련

# 장기 목표

1.  3년 안에 게이트 대비 시작
2.  7명의 미래 보스를 모두 동료로 만든다.
3.  전략 자산 1000조 규모 구축
4.  AI가 왜 핵을 발사했는지 진실을 밝힌다.
5.  AI와 함께 97%의 미래를 완성한다.
`,
  },
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = STORY_BIBLE_SEED;
}
