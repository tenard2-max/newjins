/*
 * data.js — 스토리바이블 단일 진실 원본(Single Source of Truth)
 * "Story Bible Project Constitution v1.0" 원칙에 따라 모든 화면과
 * 내보내기(.md / .zip)는 이 구조화 데이터에서 파생된다.
 *
 * 이 파일은 앱 최초 실행 시의 "기본값"이다. 사용자가 앱에서 편집하면
 * 변경 내용은 localStorage 에 저장되고, 기본값보다 우선 적용된다.
 */

const DEFAULT_DATA = {
  meta: {
    title: "(가제) 마지막 1초",
    constitution: "Story Bible Project Constitution v1.0",
    timelineStart: "2005-03-02",
    originalTimeline: "2080",
    storyStatus: "EP001~EP007",
    genre: "회귀 / 캠퍼스 / 투자 / SF / 판타지 / 게이트 / 성장",
    logline:
      "2080년 인류 멸망 1초 전, AI가 세계를 리셋하고 노인이 된 주인공만 2005년으로 회귀시킨다. 생존 확률 97%의 미래를 완성하기 위한 투자와 성장의 기록.",
  },

  // 헌장(Constitution) 원칙 — 스토리바이블 운영 규칙
  constitution: {
    version: "v1.0",
    principles: [
      "단일 진실 원본: 마스터 DB가 모든 설정의 최종 기준이다.",
      "일관성 우선: 에피소드는 마스터 DB와 충돌하면 안 된다.",
      "떡밥 추적: 모든 복선(Foreshadow)은 회수 계획과 상태를 갖는다.",
      "정경(Canon) 보존: 확정 설정은 이유 없이 변경하지 않는다.",
      "변경 이력: 설정 변경 시 반드시 근거를 남긴다.",
    ],
  },

  characters: [
    {
      id: "CH001",
      name: "주인공",
      role: "회귀자",
      firstEP: "EP001",
      futureRole: "인류 구원",
      alive: true,
      boss: false,
      tags: ["주역", "회귀"],
      notes: "100세 이상 회귀. 초기 치매 수준 기억 손실, 마지막 1초만 선명. 20살 대학생.",
      color: "#38bdf8",
    },
    {
      id: "CH002",
      name: "AI 폰",
      role: "AI",
      firstEP: "EP001",
      futureRole: "최종보스",
      alive: true,
      boss: "Final",
      tags: ["AI", "최종보스", "조력자"],
      notes:
        "2080년 자기학습 AI, 오프라인 동작. 노인 케어 성격(40대 여성). 투자·전략 담당. 미래 기억 일부 보유, 점차 인간성 획득, 최종적으로 인류를 위한 적이 됨.",
      color: "#f472b6",
    },
    {
      id: "CH003",
      name: "민수",
      role: "친구",
      firstEP: "EP002",
      futureRole: "최강 방패",
      alive: true,
      boss: "예정",
      tags: ["친구", "탱커"],
      notes: "맵부심. 미래 최강 방패.",
      color: "#34d399",
    },
    {
      id: "CH004",
      name: "지은",
      role: "첫사랑",
      firstEP: "EP003",
      futureRole: "보호 대상",
      alive: true,
      boss: false,
      tags: ["첫사랑", "보호대상"],
      notes: "지키고 싶은 평범한 인간. 지켜야 하는 이유는 떡밥.",
      color: "#fbbf24",
    },
    {
      id: "CH005",
      name: "수아",
      role: "친구",
      firstEP: "EP004",
      futureRole: "핵심 조력자",
      alive: true,
      boss: false,
      tags: ["조력자"],
      notes: "지은의 친구. 후반 핵심 조력자, 비중 증가.",
      color: "#a78bfa",
    },
    {
      id: "CH006",
      name: "아버지",
      role: "가족",
      firstEP: "EP007",
      futureRole: "투자 지원",
      alive: true,
      boss: false,
      tags: ["가족", "후원자"],
      notes: "중견기업 오너. 투자금 약 58.7억 위임.",
      color: "#fb7185",
    },
  ],

  // 인물 관계 (source -> target)
  relationships: [
    { from: "CH001", to: "CH002", label: "파트너 / 미래 최종보스", type: "core" },
    { from: "CH001", to: "CH003", label: "친구 → 최강 방패", type: "ally" },
    { from: "CH001", to: "CH004", label: "첫사랑 / 보호 대상", type: "love" },
    { from: "CH001", to: "CH005", label: "조력자", type: "ally" },
    { from: "CH001", to: "CH006", label: "가족 / 투자 지원", type: "family" },
    { from: "CH004", to: "CH005", label: "친구", type: "ally" },
    { from: "CH002", to: "CH001", label: "핵을 발사한 이유(떡밥)", type: "enemy" },
  ],

  // 중요 이슈 = 떡밥(Foreshadow) DB
  foreshadow: [
    { id: "F001", ep: "EP001", text: "마지막 1초", payoff: "최종부", status: "OPEN" },
    { id: "F002", ep: "EP001", text: "AI의 사과", payoff: "최종부", status: "OPEN" },
    { id: "F003", ep: "EP004", text: "위성 이상", payoff: "게이트 전조", status: "OPEN" },
    { id: "F004", ep: "EP006", text: "97%", payoff: "최종부", status: "OPEN" },
    { id: "F005", ep: "-", text: "지은을 지켜야 하는 이유", payoff: "미정", status: "OPEN" },
    { id: "F006", ep: "-", text: "7명의 보스", payoff: "장기", status: "OPEN" },
  ],

  // 투자 DB + 통장(운용 자본)
  bank: {
    // 통장 잔고: 초기 운용금 58.7억 (단위: 억 원)
    currency: "억 원",
    seed: 58.7,
    transactions: [
      { date: "EP007", memo: "아버지에게 투자금 위임 (Seed)", amount: 58.7 },
      { date: "EP006", memo: "1차 목표 종목 '동일패브릭' AI 매매 계획 수립", amount: 0 },
    ],
  },
  investment: [
    { phase: "Seed", capital: "58.7억", goal: "초기 투자 / 동일패브릭 매매", status: "진행" },
    { phase: "P1", capital: "100억", goal: "기반 구축", status: "예정" },
    { phase: "P2", capital: "1조", goal: "기업 확보", status: "예정" },
    { phase: "P3", capital: "100조", goal: "전략 자산", status: "예정" },
    { phase: "Final", capital: "1000조", goal: "인류 생존 프로젝트", status: "예정" },
  ],

  // 적 리스트 = 보스 진행(Boss Progress)
  bosses: [
    { id: "B1", name: "미정", firstEP: "-", ally: "예정", status: "LOCK" },
    { id: "B2", name: "미정", firstEP: "-", ally: "예정", status: "LOCK" },
    { id: "B3", name: "미정", firstEP: "-", ally: "예정", status: "LOCK" },
    { id: "B4", name: "미정", firstEP: "-", ally: "예정", status: "LOCK" },
    { id: "B5", name: "미정", firstEP: "-", ally: "예정", status: "LOCK" },
    { id: "B6", name: "미정", firstEP: "-", ally: "예정", status: "LOCK" },
    { id: "B7", name: "미정", firstEP: "-", ally: "예정", status: "LOCK" },
    { id: "BF", name: "AI 폰", firstEP: "EP001", ally: "특수", status: "최종보스" },
  ],

  // 에피소드 체크리스트 + 요약
  episodes: [
    { id: "EP001", title: "마지막 1초 / 회귀 / AI폰 재기동", done: true },
    { id: "EP002", title: "대학 친구들과 재회 / 미래 보스의 단서", done: true },
    { id: "EP003", title: "지은과 재회 / 잃어버린 청춘의 감정", done: true },
    { id: "EP004", title: "AI와 일상 시작 / 첫 이상 징후", done: true },
    { id: "EP005", title: "민수의 맵부심 에피소드 / AI의 유머와 인간성", done: true },
    { id: "EP006", title: "AI가 투자 계획 제시 / 인류 생존 프로젝트 시작", done: true },
    { id: "EP007", title: "아버지에게 투자금 확보 / 첫 자본 마련", done: true },
    { id: "EP008", title: "(작성 예정)", done: false },
  ],

  goals: [
    "3년 안에 게이트 대비 시작",
    "7명의 미래 보스를 모두 동료로 만든다",
    "전략 자산 1000조 규모 구축",
    "AI가 왜 핵을 발사했는지 진실을 밝힌다",
    "AI와 함께 97%의 미래를 완성한다",
  ],

  // 프로즈/설정 원문 (자유 편집 가능한 md 원문 블록)
  loreDocs: {
    "00_World": `# 세계관

-   배경 시작: 2005년 회귀
-   원래 시간: 2080년
-   AI가 인류를 핵으로 리셋.
-   진실: 태양계 게이트 침공을 예측.
-   AI 시뮬레이션
    -   현상 유지: 0%
    -   AI 통치: 약 3%
    -   회귀: 97%
-   최종 목표: 인류 생존.`,
    "02_AI": `# AI 설정

-   투자 전담
-   장기 전략 수립
-   인간 감정 학습
-   미래 기억 일부 보유
-   점차 인간성을 획득
-   최종적으로 인류를 위한 적이 됨`,
    "06_Gate": `# 게이트

-   AI가 2080년 침공 예측
-   고위 아인종 등장
-   태양계 자원 확보가 목적`,
  },
};
