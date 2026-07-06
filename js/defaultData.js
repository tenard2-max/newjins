// 웹소설 네비게이터 기본 데이터
// 업로드된 마스터 DB / 스토리 바이블 문서를 파싱하여 구조화한 초기 상태.
// 이 값은 localStorage에 사본이 없을 때만 사용되며, 사용자가 앱에서 편집하면
// 브라우저에 저장되고 필요 시 master.md / StoryBible.zip 으로 내보낼 수 있다.

export const DEFAULT_DATA = {
  meta: {
    title: "회귀자의 마지막 1초 (Working)",
    subtitle: "AI · 게이트 · 투자 · 회귀",
    timelineStart: "2005-03-02",
    originalTimeline: "2080",
    storyStatus: "EP001~EP007",
    constitution: {
      version: "v1.0",
      name: "Story Bible Project Constitution",
      articles: [
        {
          id: "A1",
          title: "제1조 — 단일 진실 원본 (Single Source of Truth)",
          body: "마스터 DB(99_Master_DB.md)는 세계관·인물·떡밥·투자·보스 상태에 관한 유일한 최종 원본이다. 각 세부 문서와 앱 내 상태는 언제나 마스터 DB와 동기화되어야 한다."
        },
        {
          id: "A2",
          title: "제2조 — 회귀자 관점 유지",
          body: "모든 서술은 100세 이상 삶을 살고 회귀한 주인공의 1인칭 인식을 기본으로 한다. 기억이 소실된 상태와 '마지막 1초'의 잔상은 상시 유지된다."
        },
        {
          id: "A3",
          title: "제3조 — 떡밥 관리 원칙",
          body: "새로 회수되지 않은 떡밥은 OPEN 상태를 유지한다. 회수 시 회수 에피소드와 요약을 기록하고 CLOSED 로 전환한다. 신규 떡밥은 회수 계획을 함께 등재한다."
        },
        {
          id: "A4",
          title: "제4조 — AI의 3가지 시뮬레이션 값 불변",
          body: "현상 유지 0% / AI 통치 3% / 회귀 97% 는 서사 근간이며 임의 변경 금지. 관련 수치는 오직 회수 시점의 진실 공개에서만 조정될 수 있다."
        },
        {
          id: "A5",
          title: "제5조 — 투자·자본 단위 표기",
          body: "투자 단계는 Seed / P1 / P2 / P3 / Final 로 표기하며, 자본 단위는 억·조 원 기준으로 유지한다. 최종 목표는 전략자산 1,000조 원."
        },
        {
          id: "A6",
          title: "제6조 — 7보스 원칙",
          body: "총 7명의 미래 보스는 모두 최종적으로 동료가 된다. 각 보스는 첫 등장 에피소드·아군 편입 조건·현재 상태(LOCK/OPEN/ALLY)를 반드시 기록한다."
        },
        {
          id: "A7",
          title: "제7조 — 캐릭터 생존 표기",
          body: "모든 등장인물은 Alive(Y/N) 필드를 유지한다. 사망은 회수·발생 에피소드를 근거로만 갱신할 수 있다."
        },
        {
          id: "A8",
          title: "제8조 — 데이터 이관",
          body: "본 앱의 상태는 언제든지 master.md 단일 파일 또는 StoryBible.zip(세부 파일 묶음)으로 내보낼 수 있어야 하며, 동일 형식을 다시 불러올 수 있어야 한다."
        }
      ]
    }
  },

  balance: {
    // 통장 잔고 (억 원 단위)
    currentCapital: 58.7,
    lastUpdatedEp: "EP007",
    note: "아버지에게서 위임받은 초기 운용금"
  },

  characters: [
    {
      id: "CH001",
      name: "주인공",
      role: "회귀자",
      firstEp: "EP001",
      futureRole: "인류 구원",
      alive: "Y",
      boss: "N",
      notes: "100세 이상 회귀. 초기 치매 수준 기억 손실. 마지막 1초만 선명.",
      image: "assets/characters/hero.avif",
      gallery: [
        "assets/characters/hero.avif",
        "assets/characters/hero_2.png",
        "assets/characters/hero_3.png"
      ],
      color: "#66b3ff",
      side: "주역"
    },
    {
      id: "CH002",
      name: "AI 폰",
      role: "AI · 노인케어",
      firstEp: "EP001",
      futureRole: "최종 보스",
      alive: "Y",
      boss: "Final",
      notes: "2080년 자기학습 AI. 오프라인 동작. 40대 여성 성격. 투자·전략 담당. 최종적으로 인류를 위한 적이 됨.",
      image: "assets/characters/ai.webp",
      gallery: [
        "assets/characters/ai.webp",
        "assets/characters/ai_2.png"
      ],
      color: "#9d84ff",
      side: "주역/최종보스"
    },
    {
      id: "CH003",
      name: "민수",
      role: "친구 · 맵부심",
      firstEp: "EP002",
      futureRole: "최강 방패",
      alive: "Y",
      boss: "예정",
      notes: "동기 친구. 맵부심. 미래 최강 방패로 성장 예정.",
      image: "assets/characters/minsu.webp",
      gallery: [
        "assets/characters/minsu.webp",
        "assets/characters/minsu_2.png"
      ],
      color: "#00ffaa",
      side: "동료"
    },
    {
      id: "CH004",
      name: "지은",
      role: "첫사랑",
      firstEp: "EP003",
      futureRole: "보호 대상",
      alive: "Y",
      boss: "N",
      notes: "반드시 지키고 싶은 평범한 인간. 회귀 전 감정의 앵커.",
      image: "assets/characters/jieun.jfif",
      gallery: [
        "assets/characters/jieun.jfif",
        "assets/characters/jieun_2.png"
      ],
      color: "#ffcc00",
      side: "히로인"
    },
    {
      id: "CH005",
      name: "수아",
      role: "지은의 친구",
      firstEp: "EP004",
      futureRole: "핵심 조력자",
      alive: "Y",
      boss: "N",
      notes: "후반 비중 증가. 정보·인맥 조력자로 성장.",
      image: "assets/characters/sua.png",
      gallery: [
        "assets/characters/sua.png",
        "assets/characters/sua_2.png"
      ],
      color: "#00ccff",
      side: "조력자"
    },
    {
      id: "CH006",
      name: "아버지",
      role: "중견기업 오너",
      firstEp: "EP007",
      futureRole: "투자 지원",
      alive: "Y",
      boss: "N",
      notes: "약 58.7억 투자금 운용 권한 위임. 자본 파이프라인.",
      image: "",
      gallery: [],
      color: "#ff7a7a",
      side: "가족"
    }
  ],

  relationships: [
    { from: "CH001", to: "CH002", label: "회귀 동반 · 신뢰/의심", type: "core" },
    { from: "CH001", to: "CH003", label: "대학 친구", type: "ally" },
    { from: "CH001", to: "CH004", label: "첫사랑 · 보호 대상", type: "love" },
    { from: "CH001", to: "CH005", label: "지은을 통해 알게 됨", type: "ally" },
    { from: "CH001", to: "CH006", label: "부자 · 투자 위임", type: "family" },
    { from: "CH004", to: "CH005", label: "절친", type: "ally" },
    { from: "CH002", to: "CH006", label: "투자 전략 실행", type: "info" }
  ],

  foreshadows: [
    { id: "F001", ep: "EP001", text: "마지막 1초의 잔상", payoff: "최종부", status: "OPEN", note: "회귀 트리거의 원인" },
    { id: "F002", ep: "EP001", text: "AI의 사과 — '미안하다'", payoff: "최종부", status: "OPEN", note: "최종보스화의 복선" },
    { id: "F003", ep: "EP004", text: "위성 이상 신호", payoff: "게이트 전조", status: "OPEN", note: "태양계 게이트 개방 예고" },
    { id: "F004", ep: "EP006", text: "97% 라는 수치", payoff: "최종부", status: "OPEN", note: "회귀 선택의 진짜 의미" },
    { id: "F005", ep: "EP003", text: "지은을 지켜야 하는 이유", payoff: "중반", status: "OPEN", note: "회귀 전 사건과 연결" }
  ],

  investments: [
    { phase: "Seed", capital: "58.7억", goal: "초기 투자 (동일패브릭 등)", status: "진행", note: "AI가 매매 전담" },
    { phase: "P1", capital: "100억", goal: "기반 구축", status: "예정", note: "" },
    { phase: "P2", capital: "1조", goal: "기업 확보", status: "예정", note: "" },
    { phase: "P3", capital: "100조", goal: "전략 자산", status: "예정", note: "" },
    { phase: "Final", capital: "1000조", goal: "인류 생존 프로젝트", status: "예정", note: "게이트 대응 자원" }
  ],

  bosses: [
    { id: "B1", name: "미정", firstEp: "-", ally: "예정", status: "LOCK", note: "" },
    { id: "B2", name: "미정", firstEp: "-", ally: "예정", status: "LOCK", note: "" },
    { id: "B3", name: "미정", firstEp: "-", ally: "예정", status: "LOCK", note: "" },
    { id: "B4", name: "미정", firstEp: "-", ally: "예정", status: "LOCK", note: "" },
    { id: "B5", name: "미정", firstEp: "-", ally: "예정", status: "LOCK", note: "" },
    { id: "B6", name: "미정", firstEp: "-", ally: "예정", status: "LOCK", note: "" },
    { id: "B7", name: "미정", firstEp: "-", ally: "예정", status: "LOCK", note: "" }
  ],

  episodes: [
    { id: "EP001", title: "마지막 1초 — 회귀 · AI폰 재기동", done: true, summary: "2080년 멸망 직전, 100세 노인이 된 주인공은 AI 폰과 함께 죽음을 맞고, 회귀. 2005년 20살 대학생으로 눈뜬다. AI 폰도 함께 회귀." },
    { id: "EP002", title: "대학 친구들과 재회 — 미래 보스의 단서", done: true, summary: "민수 등 옛 친구들과의 재회. 사소한 대화 속에서 미래 보스로 이어질 인물의 단서가 스친다." },
    { id: "EP003", title: "지은과 재회 — 잃어버린 청춘의 감정", done: true, summary: "첫사랑 지은과 재회. 회귀 전 감정과 지켜야 할 이유가 형체를 얻는다." },
    { id: "EP004", title: "AI와 일상 시작 — 첫 이상 징후", done: true, summary: "AI 폰과의 일상. 위성 이상 신호(F003) 첫 감지 — 게이트의 전조." },
    { id: "EP005", title: "민수의 맵부심 에피소드 — AI의 유머와 인간성", done: true, summary: "민수 서브 에피소드. AI가 인간 감정을 학습하며 유머를 획득." },
    { id: "EP006", title: "AI가 투자 계획 제시 — 인류 생존 프로젝트 시작", done: true, summary: "AI가 5단계 투자 로드맵을 브리핑. 97% 언급(F004). 최종 목표 1000조." },
    { id: "EP007", title: "아버지에게 투자금 확보 — 첫 자본 마련", done: true, summary: "아버지 설득 → 58.7억 운용 위임. Seed 단계 진입." },
    { id: "EP008", title: "(집필 예정)", done: false, summary: "" }
  ],

  goals: [
    "3년 안에 게이트 대비 시작",
    "7명의 미래 보스를 모두 동료로 만든다",
    "전략 자산 1,000조 규모 구축",
    "AI가 왜 핵을 발사했는지 진실을 밝힌다",
    "AI와 함께 97%의 미래를 완성한다"
  ]
};
