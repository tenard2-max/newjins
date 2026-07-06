// 앱 진입점.
// - 뷰 라우팅 (하단 탭)
// - 각 뷰 렌더러
// - 인물 상세 모달
// - 파일 import / export 바인딩
// 뷰가 많지 않으므로 단일 파일로 유지해 로드 라운드트립을 줄인다.

import { store } from "./store.js";
import { exportMasterMd, exportStoryBibleZip, exportJson } from "./exporters.js";
import { importFile } from "./importers.js";

// ---- 유틸 ----------------------------------------------------------------

const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k === "html") el.innerHTML = v;
    else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === "style" && typeof v === "object") Object.assign(el.style, v);
    else if (v === true) el.setAttribute(k, "");
    else el.setAttribute(k, v);
  }
  const kids = Array.isArray(children) ? children : [children];
  for (const c of kids) {
    if (c == null || c === false) continue;
    el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  }
  return el;
}

function escapeHtml(str) {
  return (str ?? "").toString()
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 1900);
}

function initialAvatar(name, color) {
  const initial = (name || "?").trim().charAt(0);
  const c = color || "#66b3ff";
  return h("span", {
    class: "avatar",
    style: { background: `linear-gradient(135deg, ${c}, #ffffff33)`, color: "#04121e" }
  }, initial);
}

function characterImage(ch, big = false) {
  if (ch.image) {
    return h("img", { src: ch.image, alt: ch.name });
  }
  const el = h("div", { class: "initial", style: { color: ch.color || "#66b3ff" } }, (ch.name || "?").charAt(0));
  return el;
}

// ---- 라우터 --------------------------------------------------------------

const VIEWS = {
  home: renderHome,
  characters: renderCharacters,
  relations: renderRelations,
  issues: renderIssues,
  investment: renderInvestment,
  enemies: renderEnemies,
  story: renderStory,
  settings: renderSettings
};

let currentView = "home";

function navigate(view) {
  if (!VIEWS[view]) return;
  currentView = view;
  $$(".tabbar button").forEach(b => b.classList.toggle("active", b.dataset.view === view));
  const root = $("#view");
  root.innerHTML = "";
  root.appendChild(VIEWS[view](store.getState()));
  window.scrollTo({ top: 0, behavior: "instant" });
}

// ---- 홈 ------------------------------------------------------------------

function renderHome(state) {
  const currentEp = state.episodes.filter(e => e.done).slice(-1)[0];
  const nextEp = state.episodes.find(e => !e.done);

  const view = h("div", { class: "view" });

  const hero = h("div", { class: "hero-card" }, [
    h("div", { class: "row-between" }, [
      h("div", {}, [
        h("div", { class: "title" }, state.meta.title),
        h("div", { class: "subtitle" }, state.meta.subtitle)
      ]),
      h("span", { class: "badge wip" }, state.meta.storyStatus)
    ]),
    h("div", { class: "hero-stats" }, [
      h("div", { class: "stat" }, [
        h("span", { class: "num" }, state.meta.timelineStart),
        h("span", { class: "label" }, "TIMELINE START")
      ]),
      h("div", { class: "stat" }, [
        h("span", { class: "num" }, state.meta.originalTimeline),
        h("span", { class: "label" }, "ORIGIN YEAR")
      ]),
      h("div", { class: "stat" }, [
        h("span", { class: "num" }, "97%"),
        h("span", { class: "label" }, "AI SIM")
      ])
    ])
  ]);

  const balance = h("div", { class: "balance-card" }, [
    h("div", { class: "label" }, "통장 잔고 · TREASURY"),
    h("div", { class: "amount" }, [
      String(state.balance.currentCapital),
      h("small", {}, "억 원")
    ]),
    h("div", { class: "meta" }, `기준 에피소드: ${state.balance.lastUpdatedEp} · ${state.balance.note || ""}`),
    h("div", { class: "actions" }, [
      h("input", { id: "balance-input", type: "number", step: "0.1", value: state.balance.currentCapital }),
      h("button", { onclick: () => {
        const v = parseFloat($("#balance-input").value);
        if (isNaN(v)) return toast("숫자를 입력하세요");
        store.setBalance(v, state.balance.lastUpdatedEp);
        toast("잔고 업데이트");
        navigate("home");
      }}, "저장")
    ])
  ]);

  const currentCard = h("div", { class: "card" }, [
    h("div", { class: "muted" }, "CURRENT EP"),
    h("h3", {}, currentEp ? `${currentEp.id} — ${currentEp.title}` : "미정"),
    currentEp?.summary ? h("div", { class: "muted", style: { marginTop: "6px" } }, currentEp.summary) : null
  ]);

  const nextCard = h("div", { class: "card" }, [
    h("div", { class: "muted" }, "NEXT EP"),
    h("h3", {}, nextEp ? `${nextEp.id} — ${nextEp.title}` : "완결"),
    nextEp?.summary ? h("div", { class: "muted", style: { marginTop: "6px" } }, nextEp.summary) : null
  ]);

  const openForeshadows = state.foreshadows.filter(f => f.status === "OPEN").length;
  const totalForeshadows = state.foreshadows.length;
  const allyBosses = state.bosses.filter(b => b.status === "ALLY").length;

  const statsRow = h("div", { class: "grid-2" }, [
    h("div", { class: "card", onclick: () => navigate("issues") }, [
      h("div", { class: "muted" }, "OPEN 떡밥"),
      h("h3", { style: { fontSize: "22px", color: "var(--accent-warn)" } }, `${openForeshadows} / ${totalForeshadows}`)
    ]),
    h("div", { class: "card", onclick: () => navigate("enemies") }, [
      h("div", { class: "muted" }, "동료화된 보스"),
      h("h3", { style: { fontSize: "22px", color: "var(--accent-good)" } }, `${allyBosses} / ${state.bosses.length}`)
    ])
  ]);

  const goals = h("div", { class: "card" }, [
    h("h3", {}, "장기 목표"),
    h("ul", { class: "goals-list" },
      state.goals.map((g, i) => h("li", {}, [
        h("span", { class: "num" }, String(i + 1).padStart(2, "0")),
        h("span", {}, g)
      ]))
    )
  ]);

  view.appendChild(hero);
  view.appendChild(h("div", { style: { height: "12px" } }));
  view.appendChild(balance);
  view.appendChild(h("div", { style: { height: "12px" } }));
  view.appendChild(currentCard);
  view.appendChild(nextCard);
  view.appendChild(h("div", { style: { height: "12px" } }));
  view.appendChild(statsRow);
  view.appendChild(h("div", { style: { height: "12px" } }));
  view.appendChild(goals);

  return view;
}

// ---- 인물 목록 -----------------------------------------------------------

function renderCharacters(state) {
  const view = h("div", { class: "view" });
  view.appendChild(h("h2", { class: "section-title" }, "인물"));
  view.appendChild(h("div", { class: "section-sub" }, "카드를 눌러 상세 · 관계 · 미래 역할 확인"));

  const grid = h("div", { class: "char-grid" });
  state.characters.forEach(ch => {
    const card = h("article", { class: "char-card", onclick: () => openCharacterModal(ch.id) }, [
      h("div", { class: "img", style: { "--color": ch.color } }, [
        characterImage(ch),
        h("span", { class: "side-tag" }, ch.side || ch.role || ""),
        ch.boss && ch.boss !== "N" ? h("span", { class: "boss-tag" }, ch.boss === "Final" ? "FINAL" : "BOSS") : null
      ]),
      h("div", { class: "info" }, [
        h("div", { class: "name" }, `${ch.name} (${ch.id})`),
        h("div", { class: "role" }, `${ch.role} · 첫등장 ${ch.firstEp}`)
      ])
    ]);
    grid.appendChild(card);
  });
  view.appendChild(grid);
  return view;
}

function openCharacterModal(id) {
  const state = store.getState();
  const ch = state.characters.find(c => c.id === id);
  if (!ch) return;
  const modal = $("#modal");
  const body = $("#modal-body");
  body.innerHTML = "";

  const gallery = h("div", { class: "char-detail-gallery" });
  const imgs = (ch.gallery && ch.gallery.length ? ch.gallery : (ch.image ? [ch.image] : []));
  if (imgs.length) {
    imgs.forEach(src => gallery.appendChild(h("img", { src, alt: ch.name, loading: "lazy" })));
  } else {
    gallery.appendChild(h("div", { class: "avatar", style: { width: "160px", height: "160px", fontSize: "60px", background: ch.color || "#66b3ff" } }, ch.name.charAt(0)));
  }

  const rels = state.relationships
    .filter(r => r.from === id || r.to === id)
    .map(r => {
      const otherId = r.from === id ? r.to : r.from;
      const other = state.characters.find(c => c.id === otherId);
      return h("div", { class: "rel", onclick: () => { closeModal(); openCharacterModal(otherId); } }, [
        h("div", {}, [h("span", { class: "who" }, other ? other.name : otherId), h("span", { class: "muted" }, ` · ${r.type}`)]),
        h("div", { class: "muted" }, r.label)
      ]);
    });

  body.appendChild(h("div", { class: "char-detail" }, [
    gallery,
    h("h2", {}, `${ch.name}`),
    h("div", { class: "sub" }, `${ch.id} · ${ch.role}`),
    h("div", { class: "kv" }, [
      h("div", { class: "k" }, "첫 등장"), h("div", {}, ch.firstEp),
      h("div", { class: "k" }, "미래 역할"), h("div", {}, ch.futureRole),
      h("div", { class: "k" }, "진영"), h("div", {}, ch.side || "-"),
      h("div", { class: "k" }, "생존"), h("div", {}, ch.alive === "Y" ? "생존" : "사망"),
      h("div", { class: "k" }, "보스"), h("div", {}, ch.boss === "N" ? "-" : ch.boss),
      h("div", { class: "k" }, "메모"), h("div", {}, ch.notes || "-")
    ]),
    rels.length ? h("div", { class: "relations" }, [
      h("h3", { style: { margin: "0 0 6px", fontSize: "13px", color: "var(--text-2)", letterSpacing: "0.15em" } }, "관계"),
      ...rels
    ]) : null
  ]));

  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  $("#modal").classList.remove("open");
  document.body.style.overflow = "";
}

// ---- 관계도 --------------------------------------------------------------

function renderRelations(state) {
  const view = h("div", { class: "view" });
  view.appendChild(h("h2", { class: "section-title" }, "인물 관계도"));
  view.appendChild(h("div", { class: "section-sub" }, "원형 배치. 노드를 눌러 상세로 이동."));

  const wrap = h("div", { class: "relations-wrap" });
  const chars = state.characters;
  const N = chars.length;
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.36;
  const nodeR = 30;

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.style.aspectRatio = "1 / 1";

  // 배경 링
  const bgRing = document.createElementNS(svgNS, "circle");
  bgRing.setAttribute("cx", cx); bgRing.setAttribute("cy", cy);
  bgRing.setAttribute("r", r);
  bgRing.setAttribute("fill", "none");
  bgRing.setAttribute("stroke", "rgba(0, 204, 255, 0.15)");
  bgRing.setAttribute("stroke-dasharray", "3 5");
  svg.appendChild(bgRing);

  const positions = {};
  chars.forEach((c, i) => {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2;
    positions[c.id] = { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });

  const typeColor = {
    core: "#9d84ff",
    love: "#ff5c5c",
    ally: "#00ff99",
    family: "#ffcc00",
    info: "#00ccff"
  };

  // 엣지
  state.relationships.forEach(rel => {
    const a = positions[rel.from];
    const b = positions[rel.to];
    if (!a || !b) return;
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", a.x); line.setAttribute("y1", a.y);
    line.setAttribute("x2", b.x); line.setAttribute("y2", b.y);
    line.setAttribute("stroke", typeColor[rel.type] || "#66b3ff");
    line.setAttribute("stroke-opacity", "0.55");
    line.setAttribute("stroke-width", "1.4");
    svg.appendChild(line);
  });

  // 노드
  chars.forEach(c => {
    const p = positions[c.id];
    const g = document.createElementNS(svgNS, "g");
    g.style.cursor = "pointer";
    g.addEventListener("click", () => openCharacterModal(c.id));

    const halo = document.createElementNS(svgNS, "circle");
    halo.setAttribute("cx", p.x); halo.setAttribute("cy", p.y);
    halo.setAttribute("r", nodeR + 4);
    halo.setAttribute("fill", "none");
    halo.setAttribute("stroke", c.color || "#66b3ff");
    halo.setAttribute("stroke-opacity", "0.35");
    halo.setAttribute("stroke-width", "1");
    g.appendChild(halo);

    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", p.x); circle.setAttribute("cy", p.y);
    circle.setAttribute("r", nodeR);
    circle.setAttribute("fill", "#0a1730");
    circle.setAttribute("stroke", c.color || "#66b3ff");
    circle.setAttribute("stroke-width", "1.5");
    g.appendChild(circle);

    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", p.x); text.setAttribute("y", p.y + 4);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "#eaf2ff");
    text.setAttribute("font-size", "11");
    text.setAttribute("font-family", "Inter, sans-serif");
    text.textContent = c.name;
    g.appendChild(text);

    const sub = document.createElementNS(svgNS, "text");
    sub.setAttribute("x", p.x); sub.setAttribute("y", p.y + nodeR + 14);
    sub.setAttribute("text-anchor", "middle");
    sub.setAttribute("fill", "#7a8aa6");
    sub.setAttribute("font-size", "9");
    sub.setAttribute("font-family", "Inter, sans-serif");
    sub.textContent = c.role;
    g.appendChild(sub);

    if (c.boss && c.boss !== "N") {
      const bossDot = document.createElementNS(svgNS, "circle");
      bossDot.setAttribute("cx", p.x + nodeR - 4);
      bossDot.setAttribute("cy", p.y - nodeR + 4);
      bossDot.setAttribute("r", "5");
      bossDot.setAttribute("fill", "#ff5c5c");
      g.appendChild(bossDot);
    }

    svg.appendChild(g);
  });

  wrap.appendChild(svg);
  view.appendChild(wrap);

  const legend = h("div", { class: "relations-legend" }, [
    h("span", {}, [h("i", { style: { background: typeColor.core } }), "핵심 (회귀 동반)"]),
    h("span", {}, [h("i", { style: { background: typeColor.love } }), "연인/애정"]),
    h("span", {}, [h("i", { style: { background: typeColor.ally } }), "동료/친구"]),
    h("span", {}, [h("i", { style: { background: typeColor.family } }), "가족"]),
    h("span", {}, [h("i", { style: { background: typeColor.info } }), "정보/전략"])
  ]);
  view.appendChild(legend);
  return view;
}

// ---- 떡밥/이슈 -----------------------------------------------------------

function renderIssues(state) {
  const view = h("div", { class: "view" });
  view.appendChild(h("h2", { class: "section-title" }, "중요 이슈 · 떡밥"));
  view.appendChild(h("div", { class: "section-sub" }, "OPEN = 회수 예정, CLOSED = 회수 완료. 우측 버튼으로 상태 전환."));

  const list = h("div", { class: "item-list" });
  state.foreshadows.forEach(f => {
    list.appendChild(h("div", { class: "item" }, [
      h("div", { class: "head" }, [
        h("div", {}, [
          h("span", { class: "id" }, `${f.id} · ${f.ep} `),
          h("span", { class: "title" }, f.text)
        ]),
        h("span", { class: `badge ${f.status === "OPEN" ? "open" : "closed"}` }, f.status)
      ]),
      h("div", { class: "body" }, `회수 예정: ${f.payoff}${f.note ? " · " + f.note : ""}`),
      h("div", { class: "meta" }, [
        h("button", { class: "toggle", onclick: () => { store.toggleForeshadow(f.id); navigate("issues"); } },
          f.status === "OPEN" ? "CLOSED 로 표시" : "OPEN 으로 되돌리기")
      ])
    ]));
  });
  view.appendChild(list);
  return view;
}

// ---- 투자 ----------------------------------------------------------------

function renderInvestment(state) {
  const view = h("div", { class: "view" });
  view.appendChild(h("h2", { class: "section-title" }, "투자 · 통장"));
  view.appendChild(h("div", { class: "section-sub" }, "AI 폰이 매매 전담. 최종 목표 전략자산 1,000조."));

  const bal = h("div", { class: "balance-card" }, [
    h("div", { class: "label" }, "TREASURY"),
    h("div", { class: "amount" }, [String(state.balance.currentCapital), h("small", {}, "억 원")]),
    h("div", { class: "meta" }, `기준 ${state.balance.lastUpdatedEp} · ${state.balance.note || ""}`)
  ]);
  view.appendChild(bal);
  view.appendChild(h("div", { style: { height: "12px" } }));

  const card = h("div", { class: "card" }, [h("h3", {}, "투자 단계 (Roadmap)")]);
  state.investments.forEach((it, i) => {
    const row = h("div", { class: "investment-grid" }, [
      h("div", { class: "phase" }, it.phase),
      h("div", { class: "capital" }, it.capital),
      h("div", { class: "goal" }, [
        it.goal,
        it.note ? h("div", { class: "muted", style: { fontSize: "11px" } }, it.note) : null
      ]),
      h("span", { class: `badge ${it.status === "진행" ? "wip" : it.status === "완료" ? "closed" : "open"}` }, it.status)
    ]);
    if (i > 0) row.style.borderTop = "1px dashed var(--border)";
    if (i > 0) row.style.paddingTop = "10px";
    if (i > 0) row.style.marginTop = "10px";
    card.appendChild(row);
  });
  view.appendChild(card);
  return view;
}

// ---- 적 (7보스) ---------------------------------------------------------

function renderEnemies(state) {
  const view = h("div", { class: "view" });
  view.appendChild(h("h2", { class: "section-title" }, "적 · 7보스"));
  view.appendChild(h("div", { class: "section-sub" }, "모두 최종적으로 동료가 된다 (원칙 A6). LOCK → OPEN → ALLY."));

  // AI 폰(Final Boss) 카드
  const ai = state.characters.find(c => c.boss === "Final");
  if (ai) {
    view.appendChild(h("div", { class: "card" }, [
      h("div", { class: "row-between" }, [
        h("div", {}, [
          h("h3", { style: { color: "var(--accent-hot)" } }, `FINAL — ${ai.name}`),
          h("div", { class: "muted" }, ai.futureRole)
        ]),
        h("span", { class: "badge final" }, "FINAL")
      ]),
      h("div", { class: "body", style: { color: "var(--text-1)", fontSize: "13px", marginTop: "8px" } }, ai.notes || "")
    ]));
    view.appendChild(h("div", { style: { height: "12px" } }));
  }

  const list = h("div", { class: "item-list" });
  state.bosses.forEach(b => {
    const badgeClass = b.status === "ALLY" ? "ally" : b.status === "OPEN" ? "wip" : "lock";
    list.appendChild(h("div", { class: "item" }, [
      h("div", { class: "head" }, [
        h("div", {}, [
          h("span", { class: "id" }, `${b.id} · 첫등장 ${b.firstEp} `),
          h("span", { class: "title" }, b.name)
        ]),
        h("span", { class: `badge ${badgeClass}` }, b.status)
      ]),
      h("div", { class: "meta" }, [
        h("span", {}, `아군화: ${b.ally}`),
        b.note ? h("span", {}, b.note) : null
      ])
    ]));
  });
  view.appendChild(list);
  return view;
}

// ---- 스토리 -------------------------------------------------------------

function renderStory(state) {
  const view = h("div", { class: "view" });
  view.appendChild(h("h2", { class: "section-title" }, "스토리 · 에피소드"));
  view.appendChild(h("div", { class: "section-sub" }, "체크박스로 진행 상태를 토글, 요약 편집 후 저장."));

  const list = h("div", { class: "item-list" });
  state.episodes.forEach(ep => {
    const textarea = h("textarea", {
      placeholder: "에피소드 요약",
      oninput: e => { store.update(s => { const t = s.episodes.find(x => x.id === ep.id); if (t) t.summary = e.target.value; }); }
    }, ep.summary || "");

    const checkbox = h("input", {
      type: "checkbox",
      onchange: () => { store.toggleEpisodeDone(ep.id); navigate("story"); }
    });
    if (ep.done) checkbox.setAttribute("checked", "");

    list.appendChild(h("div", { class: "item ep-item" }, [
      h("div", { class: "head" }, [
        h("div", { class: "title" }, [
          checkbox,
          h("span", {}, `${ep.id} — ${ep.title}`)
        ]),
        h("span", { class: `badge ${ep.done ? "closed" : "open"}` }, ep.done ? "완료" : "예정")
      ]),
      textarea
    ]));
  });
  view.appendChild(list);
  return view;
}

// ---- 설정 (Constitution + import/export) --------------------------------

function renderSettings(state) {
  const view = h("div", { class: "view" });
  view.appendChild(h("h2", { class: "section-title" }, "설정"));
  view.appendChild(h("div", { class: "section-sub" }, `${state.meta.constitution.name} ${state.meta.constitution.version}`));

  // Constitution
  const cSec = h("div", { class: "settings-section" }, [
    h("h3", {}, "Project Constitution"),
    h("div", { class: "card" },
      state.meta.constitution.articles.map(a =>
        h("div", { class: "constitution-article" }, [
          h("div", { class: "t" }, a.title),
          h("div", { class: "b" }, a.body)
        ])
      )
    )
  ]);
  view.appendChild(cSec);

  // 프로젝트 메타 편집
  const metaSec = h("div", { class: "settings-section" }, [
    h("h3", {}, "프로젝트 메타"),
    h("div", { class: "card" }, [
      metaInput("작품 제목", "title", state.meta.title),
      metaInput("서브 타이틀", "subtitle", state.meta.subtitle),
      metaInput("Timeline Start", "timelineStart", state.meta.timelineStart),
      metaInput("Original Timeline", "originalTimeline", state.meta.originalTimeline),
      metaInput("Story Status", "storyStatus", state.meta.storyStatus)
    ])
  ]);
  view.appendChild(metaSec);

  // 파일 Import
  const importSec = h("div", { class: "settings-section" }, [
    h("h3", {}, "불러오기 (Import)"),
    h("label", { class: "file-drop", id: "file-drop" }, [
      h("div", { html: "<strong>파일을 탭 또는 드롭</strong>" }),
      h("div", { class: "hint" }, "지원: master.md · StoryBible.zip · story_bible.json"),
      h("input", { type: "file", accept: ".md,.zip,.json", onchange: e => onImport(e.target.files[0]) })
    ])
  ]);
  view.appendChild(importSec);

  // 파일 Export
  const exportSec = h("div", { class: "settings-section" }, [
    h("h3", {}, "내보내기 (Export)"),
    h("div", { class: "btn-group" }, [
      h("button", { class: "btn primary", onclick: () => { exportMasterMd(store.getState()); toast("master.md 다운로드"); } }, "📄 99_Master_DB.md"),
      h("button", { class: "btn", onclick: () => { exportStoryBibleZip(store.getState()).then(() => toast("StoryBible.zip 다운로드")); } }, "🗂 StoryBible.zip"),
      h("button", { class: "btn", onclick: () => { exportJson(store.getState()); toast("JSON 백업 다운로드"); } }, "💾 JSON 백업")
    ])
  ]);
  view.appendChild(exportSec);

  // 위험 구역
  const dangerSec = h("div", { class: "settings-section" }, [
    h("h3", {}, "위험 구역"),
    h("div", { class: "card" }, [
      h("div", { class: "muted", style: { marginBottom: "10px" } }, "브라우저 저장소의 스토리 데이터를 기본값으로 되돌립니다. 되돌리기 전 반드시 Export 하세요."),
      h("button", { class: "btn danger", onclick: () => {
        if (confirm("정말 기본값으로 초기화합니까? 저장되지 않은 변경사항은 사라집니다.")) {
          store.reset(); toast("초기화 완료"); navigate("home");
        }
      }}, "기본값으로 초기화")
    ])
  ]);
  view.appendChild(dangerSec);

  // 드래그 앤 드롭 바인딩
  setTimeout(() => {
    const drop = $("#file-drop");
    if (!drop) return;
    ["dragenter", "dragover"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add("drag"); }));
    ["dragleave", "drop"].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove("drag"); }));
    drop.addEventListener("drop", e => {
      const f = e.dataTransfer?.files?.[0];
      if (f) onImport(f);
    });
  }, 0);

  return view;
}

function metaInput(label, key, value) {
  const wrap = h("label", { style: { display: "block", marginBottom: "10px", fontSize: "12px", color: "var(--text-2)" } }, [
    h("span", { style: { display: "block", marginBottom: "4px", letterSpacing: "0.08em" } }, label),
    h("input", {
      value: value || "",
      style: {
        width: "100%", background: "rgba(0,0,0,0.35)", border: "1px solid var(--border)",
        color: "var(--text-0)", borderRadius: "10px", padding: "8px 10px", fontFamily: "var(--font-sans)"
      },
      onchange: e => { store.update(s => { s.meta[key] = e.target.value; }); toast("저장됨"); }
    })
  ]);
  return wrap;
}

async function onImport(file) {
  if (!file) return;
  try {
    const res = await importFile(file);
    toast(`불러오기 성공 (${res.mode})`);
    navigate(currentView);
  } catch (err) {
    console.error(err);
    alert("불러오기 실패: " + (err?.message || err));
  }
}

// ---- 초기화 -------------------------------------------------------------

function bindTabbar() {
  $$("[data-view]").forEach(btn => {
    btn.addEventListener("click", () => navigate(btn.dataset.view));
  });
  $("#modal-close").addEventListener("click", closeModal);
  $("#modal-back").addEventListener("click", closeModal);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && $("#modal").classList.contains("open")) closeModal();
  });
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("./sw.js").catch(() => { /* 오프라인 캐시는 선택 사항 */ });
  }
}

// 스토어 변화 시 상단 잔고 갱신 등 필요한 최소 갱신은 view 재렌더로 처리
store.subscribe(() => {
  const badge = $("#topbar-balance");
  if (badge) badge.textContent = `${store.getState().balance.currentCapital}억`;
});

window.addEventListener("DOMContentLoaded", () => {
  bindTabbar();
  navigate("home");
  const badge = $("#topbar-balance");
  if (badge) badge.textContent = `${store.getState().balance.currentCapital}억`;
  registerServiceWorker();
});
