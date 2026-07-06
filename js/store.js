// 애플리케이션 상태 저장소.
// localStorage 를 사본으로 사용하고, 모든 뷰는 이 모듈을 통해서만 상태를 변경한다.
// 이렇게 하면 파일 내보내기/불러오기 시 단일 지점만 다루면 되며,
// 향후 서버 저장/동기화를 붙일 때도 어댑터 교체만으로 확장 가능하다.

import { DEFAULT_DATA } from "./defaultData.js";

const STORAGE_KEY = "story_bible_navigator_v1";

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn("스토리 데이터 로드 실패, 기본값 사용", err);
    return null;
  }
}

function persist(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn("스토리 데이터 저장 실패", err);
  }
}

const listeners = new Set();

let state = loadFromStorage() || deepClone(DEFAULT_DATA);

// 신규 필드가 기본 데이터에 추가된 경우를 대비한 얕은 병합
function ensureShape(current) {
  const base = deepClone(DEFAULT_DATA);
  for (const key of Object.keys(base)) {
    if (current[key] === undefined) current[key] = base[key];
  }
  return current;
}
state = ensureShape(state);
persist(state);

function notify() {
  for (const fn of listeners) {
    try { fn(state); } catch (err) { console.error(err); }
  }
}

export const store = {
  getState() {
    return state;
  },

  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  update(mutator) {
    mutator(state);
    persist(state);
    notify();
  },

  replace(newState) {
    state = ensureShape(newState);
    persist(state);
    notify();
  },

  reset() {
    state = deepClone(DEFAULT_DATA);
    persist(state);
    notify();
  },

  // 편의 헬퍼들
  getCharacter(id) {
    return state.characters.find(c => c.id === id) || null;
  },

  updateCharacter(id, patch) {
    this.update(s => {
      const target = s.characters.find(c => c.id === id);
      if (target) Object.assign(target, patch);
    });
  },

  toggleForeshadow(id) {
    this.update(s => {
      const f = s.foreshadows.find(x => x.id === id);
      if (f) f.status = f.status === "OPEN" ? "CLOSED" : "OPEN";
    });
  },

  toggleEpisodeDone(id) {
    this.update(s => {
      const ep = s.episodes.find(e => e.id === id);
      if (ep) ep.done = !ep.done;
    });
  },

  setBalance(newCapital, epLabel) {
    this.update(s => {
      s.balance.currentCapital = Number(newCapital);
      if (epLabel) s.balance.lastUpdatedEp = epLabel;
    });
  }
};

export { STORAGE_KEY };
