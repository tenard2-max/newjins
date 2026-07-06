/* ===== 웹소설 네비게이터 — 앱 로직 ===== */
"use strict";

const STORAGE_KEY = "webnovel-navigator:v1";

/* ---------- 상태 관리 ---------- */
function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      // 기본값과 병합하여 새 필드 누락 방지
      const saved = JSON.parse(raw);
      return Object.assign(deepClone(DEFAULT_DATA), saved);
    }
  } catch (e) {
    console.warn("상태 로드 실패, 기본값 사용", e);
  }
  return deepClone(DEFAULT_DATA);
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    toast("저장되었습니다");
  } catch (e) {
    toast("저장 실패: " + e.message);
  }
}

let state = loadState();
let currentView = "dashboard";
let selectedCharId = null;

/* ---------- 유틸 ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const el = (html) => {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
};
function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => (t.hidden = true), 2000);
}
function initials(name) {
  return name ? name.trim().slice(0, 2) : "?";
}

/* ---------- 통장 잔고 계산 ---------- */
function bankBalance() {
  const txs = state.bank.transactions || [];
  return txs.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
}

/* ================= 뷰 렌더러 ================= */
const views = {};

/* --- 홈 대시보드 --- */
views.dashboard = function () {
  const chars = state.characters.length;
  const openIssues = state.foreshadow.filter((f) => f.status === "OPEN").length;
  const doneEP = state.episodes.filter((e) => e.done).length;
  const totalEP = state.episodes.length;
  const enemies = state.bosses.length;
  const balance = bankBalance();
  const progress = Math.round((doneEP / totalEP) * 100);

  const root = el(`<div>
    <div class="view-header">
      <h1>${esc(state.meta.title)}</h1>
      <p>${esc(state.meta.logline)}</p>
    </div>

    <div class="bank-banner">
      <div class="label">통장 잔고 · 운용 자본</div>
      <div class="amount">${balance.toLocaleString()}<small> ${esc(state.bank.currency)}</small></div>
      <div class="muted" style="font-size:12px;margin-top:6px">
        Seed ${esc(state.bank.seed)}억 · 최종 목표 1000조
      </div>
    </div>

    <div class="stat-grid">
      <div class="stat"><div class="k">등장인물</div><div class="v">${chars}명</div></div>
      <div class="stat"><div class="k">열린 이슈(떡밥)</div><div class="v">${openIssues}건</div></div>
      <div class="stat"><div class="k">적(보스)</div><div class="v">${enemies}</div></div>
      <div class="stat"><div class="k">시작 시점</div><div class="v small">${esc(state.meta.timelineStart)}</div></div>
    </div>

    <div class="card mt">
      <h2>📖 집필 진행 <span class="sub">${doneEP}/${totalEP} 화</span></h2>
      <div class="progress"><i style="width:${progress}%"></i></div>
      <div class="timeline mt" id="dash-timeline"></div>
    </div>

    <div class="card">
      <h2>🎯 장기 목표</h2>
      <div class="list" id="dash-goals"></div>
    </div>

    <div class="card">
      <h2>⚖️ ${esc(state.meta.constitution)}</h2>
      <div class="notes muted" id="dash-constitution"></div>
    </div>
  </div>`);

  const tl = $("#dash-timeline", root);
  state.episodes.forEach((e) => {
    tl.appendChild(el(`<div class="tl-item ${e.done ? "done" : ""}">
      <div class="ep">${esc(e.id)}</div>
      <div class="t">${esc(e.title)}</div>
    </div>`));
  });

  const goals = $("#dash-goals", root);
  state.goals.forEach((g, i) => {
    goals.appendChild(el(`<div class="item"><div class="avatar" style="background:var(--accent)">${i + 1}</div>
      <div class="meta"><div class="name" style="font-size:14px;white-space:normal">${esc(g)}</div></div></div>`));
  });

  const con = $("#dash-constitution", root);
  con.innerHTML = "<ul style='margin:0;padding-left:18px;line-height:1.7'>" +
    state.constitution.principles.map((p) => `<li>${esc(p)}</li>`).join("") + "</ul>";

  return root;
};

/* --- 인물 목록 / 선택 --- */
views.characters = function () {
  if (selectedCharId) return renderCharacterDetail(selectedCharId);

  const root = el(`<div>
    <div class="view-header">
      <h1>👥 인물 선택</h1>
      <p>등장인물을 선택하면 상세 설정을 볼 수 있습니다.</p>
    </div>
    <div class="list" id="char-list"></div>
  </div>`);

  const list = $("#char-list", root);
  state.characters.forEach((c) => {
    const item = el(`<button class="item selectable">
      <div class="avatar" style="background:${esc(c.color)}">${esc(initials(c.name))}</div>
      <div class="meta">
        <div class="name">${esc(c.name)} <span class="muted" style="font-weight:400;font-size:12px">${esc(c.role)}</span></div>
        <div class="desc">${esc(c.futureRole)} · 첫 등장 ${esc(c.firstEP)}</div>
      </div>
      <div class="chev">›</div>
    </button>`);
    item.addEventListener("click", () => { selectedCharId = c.id; render(); });
    list.appendChild(item);
  });
  return root;
};

function renderCharacterDetail(id) {
  const c = state.characters.find((x) => x.id === id);
  if (!c) { selectedCharId = null; return views.characters(); }

  const rels = state.relationships
    .filter((r) => r.from === id || r.to === id)
    .map((r) => {
      const otherId = r.from === id ? r.to : r.from;
      const other = state.characters.find((x) => x.id === otherId);
      return { name: other ? other.name : otherId, label: r.label, type: r.type };
    });

  const root = el(`<div>
    <button class="back-btn" id="char-back">‹ 인물 목록</button>
    <div class="detail-hero">
      <div class="avatar" style="background:${esc(c.color)}">${esc(initials(c.name))}</div>
      <div>
        <h1>${esc(c.name)}</h1>
        <div class="role">${esc(c.role)} · ${esc(c.id)}</div>
      </div>
    </div>

    <div class="card">
      <div class="kv">
        <div class="key">첫 등장</div><div>${esc(c.firstEP)}</div>
        <div class="key">미래 역할</div><div>${esc(c.futureRole)}</div>
        <div class="key">생존</div><div>${c.alive ? "생존" : "사망"}</div>
        <div class="key">보스 여부</div><div>${c.boss ? esc(String(c.boss)) : "아님"}</div>
      </div>
    </div>

    <div class="card">
      <h2>🏷️ 태그</h2>
      <div class="badges">${(c.tags || []).map((t) => `<span class="badge accent">${esc(t)}</span>`).join("")}</div>
    </div>

    <div class="card">
      <h2>📝 설정 메모</h2>
      <div class="notes">${esc(c.notes)}</div>
    </div>

    <div class="card">
      <h2>🔗 관계</h2>
      <div class="list" id="char-rels"></div>
    </div>
  </div>`);

  $("#char-back", root).addEventListener("click", () => { selectedCharId = null; render(); });

  const rl = $("#char-rels", root);
  if (rels.length === 0) rl.appendChild(el(`<div class="muted">등록된 관계가 없습니다.</div>`));
  rels.forEach((r) => {
    rl.appendChild(el(`<div class="item">
      <div class="avatar" style="background:var(--card-2);color:var(--text);font-size:13px">${esc(initials(r.name))}</div>
      <div class="meta"><div class="name" style="font-size:14px">${esc(r.name)}</div>
      <div class="desc" style="white-space:normal">${esc(r.label)}</div></div>
    </div>`));
  });

  return root;
}

/* --- 인물 관계도 (SVG) --- */
views.relations = function () {
  const root = el(`<div>
    <div class="view-header">
      <h1>🕸️ 인물 관계도</h1>
      <p>주인공을 중심으로 한 관계 네트워크입니다. 노드를 누르면 상세로 이동합니다.</p>
    </div>
    <div class="graph-wrap" id="graph"></div>
    <div class="legend">
      <span><i style="background:#38bdf8"></i>핵심</span>
      <span><i style="background:#34d399"></i>동료</span>
      <span><i style="background:#fbbf24"></i>애정</span>
      <span><i style="background:#fb7185"></i>가족</span>
      <span><i style="background:#f472b6"></i>적대</span>
    </div>
  </div>`);

  root.querySelector("#graph").appendChild(buildRelationSVG());
  return root;
};

function buildRelationSVG() {
  const W = 360, H = 420, cx = W / 2, cy = H / 2;
  const center = state.characters.find((c) => c.id === "CH001") || state.characters[0];
  const others = state.characters.filter((c) => c.id !== center.id);

  // 원형 배치
  const positions = {};
  positions[center.id] = { x: cx, y: cy };
  const R = 140;
  others.forEach((c, i) => {
    const angle = (Math.PI * 2 * i) / others.length - Math.PI / 2;
    positions[c.id] = { x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle) };
  });

  const typeColor = { core: "#38bdf8", ally: "#34d399", love: "#fbbf24", family: "#fb7185", enemy: "#f472b6" };

  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("role", "img");

  // 간선
  state.relationships.forEach((r) => {
    const a = positions[r.from], b = positions[r.to];
    if (!a || !b) return;
    const line = document.createElementNS(NS, "line");
    line.setAttribute("x1", a.x); line.setAttribute("y1", a.y);
    line.setAttribute("x2", b.x); line.setAttribute("y2", b.y);
    line.setAttribute("stroke", typeColor[r.type] || "#26325c");
    line.setAttribute("stroke-width", r.type === "core" ? 2.5 : 1.6);
    line.setAttribute("stroke-opacity", "0.55");
    if (r.type === "enemy") line.setAttribute("stroke-dasharray", "5 4");
    svg.appendChild(line);

    // 관계 라벨
    const midx = (a.x + b.x) / 2, midy = (a.y + b.y) / 2;
    const label = document.createElementNS(NS, "text");
    label.setAttribute("x", midx); label.setAttribute("y", midy - 3);
    label.setAttribute("fill", "#93a0c9");
    label.setAttribute("font-size", "8");
    label.setAttribute("text-anchor", "middle");
    label.textContent = r.label.length > 12 ? r.label.slice(0, 11) + "…" : r.label;
    svg.appendChild(label);
  });

  // 노드
  state.characters.forEach((c) => {
    const p = positions[c.id];
    if (!p) return;
    const g = document.createElementNS(NS, "g");
    g.style.cursor = "pointer";
    const isCenter = c.id === center.id;
    const rad = isCenter ? 30 : 24;

    const circle = document.createElementNS(NS, "circle");
    circle.setAttribute("cx", p.x); circle.setAttribute("cy", p.y);
    circle.setAttribute("r", rad);
    circle.setAttribute("fill", c.color);
    circle.setAttribute("stroke", "#0b1020");
    circle.setAttribute("stroke-width", "3");
    g.appendChild(circle);

    const name = document.createElementNS(NS, "text");
    name.setAttribute("x", p.x); name.setAttribute("y", p.y + 4);
    name.setAttribute("fill", "#06132a");
    name.setAttribute("font-size", isCenter ? "13" : "11");
    name.setAttribute("font-weight", "800");
    name.setAttribute("text-anchor", "middle");
    name.textContent = c.name;
    g.appendChild(name);

    g.addEventListener("click", () => {
      selectedCharId = c.id;
      setView("characters");
    });
    svg.appendChild(g);
  });

  return svg;
}

/* --- 투자 & 통장 --- */
views.finance = function () {
  const balance = bankBalance();
  const root = el(`<div>
    <div class="view-header">
      <h1>💰 투자 & 통장</h1>
      <p>AI가 전담 운용하는 자본 계획과 현재 잔고입니다.</p>
    </div>

    <div class="bank-banner">
      <div class="label">현재 통장 잔고</div>
      <div class="amount">${balance.toLocaleString()}<small> ${esc(state.bank.currency)}</small></div>
    </div>

    <div class="card">
      <h2>📈 투자 단계 로드맵</h2>
      <table class="table">
        <thead><tr><th>단계</th><th>자본</th><th>목표</th><th>상태</th></tr></thead>
        <tbody id="inv-body"></tbody>
      </table>
    </div>

    <div class="card">
      <h2>🧾 통장 거래 내역</h2>
      <table class="table">
        <thead><tr><th>시점</th><th>내용</th><th class="num">금액</th></tr></thead>
        <tbody id="tx-body"></tbody>
      </table>
    </div>
  </div>`);

  const inv = $("#inv-body", root);
  state.investment.forEach((p) => {
    const cls = p.status === "진행" ? "ok" : "warn";
    inv.appendChild(el(`<tr>
      <td><strong>${esc(p.phase)}</strong></td>
      <td>${esc(p.capital)}</td>
      <td>${esc(p.goal)}</td>
      <td><span class="badge ${cls}">${esc(p.status)}</span></td>
    </tr>`));
  });

  const tx = $("#tx-body", root);
  state.bank.transactions.forEach((t) => {
    tx.appendChild(el(`<tr>
      <td>${esc(t.date)}</td>
      <td>${esc(t.memo)}</td>
      <td class="num">${Number(t.amount).toLocaleString()}</td>
    </tr>`));
  });

  return root;
};

/* --- 적 리스트 (보스) --- */
views.enemies = function () {
  const root = el(`<div>
    <div class="view-header">
      <h1>⚔️ 적 리스트</h1>
      <p>7명의 미래 보스와 최종보스. 모두 최종적으로 동료가 될 수 있습니다.</p>
    </div>
    <div class="list" id="boss-list"></div>
  </div>`);

  const list = $("#boss-list", root);
  state.bosses.forEach((b) => {
    let cls = "danger", text = b.status;
    if (b.status === "LOCK") cls = "";
    else if (b.status === "최종보스") cls = "danger";
    const isFinal = b.status === "최종보스";
    list.appendChild(el(`<div class="item">
      <div class="avatar" style="background:${isFinal ? "var(--danger)" : "var(--card-2)"};color:${isFinal ? "#06132a" : "var(--muted)"}">${esc(b.id)}</div>
      <div class="meta">
        <div class="name">${esc(b.name)}</div>
        <div class="desc">첫 등장 ${esc(b.firstEP)} · 동료화 ${esc(b.ally)}</div>
      </div>
      <span class="badge ${cls}">${esc(text)}</span>
    </div>`));
  });

  return root;
};

/* --- 중요 이슈 (떡밥) --- */
views.issues = function () {
  const open = state.foreshadow.filter((f) => f.status === "OPEN");
  const closed = state.foreshadow.filter((f) => f.status !== "OPEN");
  const root = el(`<div>
    <div class="view-header">
      <h1>🧩 중요 이슈 · 떡밥</h1>
      <p>회수해야 할 복선 목록입니다. (${open.length}건 진행 중)</p>
    </div>
    <div class="list" id="issue-list"></div>
  </div>`);

  const list = $("#issue-list", root);
  const render1 = (f) => {
    const cls = f.status === "OPEN" ? "warn" : "ok";
    list.appendChild(el(`<div class="item">
      <div class="avatar" style="background:var(--warn);color:#06132a;font-size:12px">${esc(f.id)}</div>
      <div class="meta">
        <div class="name" style="white-space:normal">${esc(f.text)}</div>
        <div class="desc">등장 ${esc(f.ep)} · 회수 예정: ${esc(f.payoff)}</div>
      </div>
      <span class="badge ${cls}">${esc(f.status)}</span>
    </div>`));
  };
  open.forEach(render1);
  closed.forEach(render1);
  return root;
};

/* --- 편집 & 내보내기 --- */
views.edit = function () {
  const root = el(`<div>
    <div class="view-header">
      <h1>✏️ 편집 & 내보내기</h1>
      <p>스토리 파일과 마스터 DB를 수정하고 스토리바이블.zip으로 내보냅니다.</p>
    </div>

    <div class="card">
      <button class="btn primary" id="btn-export-zip">📦 스토리바이블.zip 다운로드</button>
      <div class="btn-row">
        <button class="btn ghost" id="btn-export-master">📄 마스터 md</button>
        <button class="btn ghost" id="btn-export-summary">📄 통합요약 md</button>
      </div>
    </div>

    <details class="accordion">
      <summary>기본 정보 <span class="muted">meta</span></summary>
      <div class="body" id="edit-meta"></div>
    </details>

    <details class="accordion">
      <summary>인물 편집 <span class="muted">${state.characters.length}명</span></summary>
      <div class="body" id="edit-chars"></div>
    </details>

    <details class="accordion">
      <summary>통장 & 투자</summary>
      <div class="body" id="edit-bank"></div>
    </details>

    <details class="accordion">
      <summary>중요 이슈(떡밥) 편집</summary>
      <div class="body" id="edit-issues"></div>
    </details>

    <details class="accordion">
      <summary>설정 원문(프로즈) md 편집</summary>
      <div class="body" id="edit-lore"></div>
    </details>

    <div class="card mt">
      <button class="btn" id="btn-save-all">💾 모든 변경사항 저장</button>
      <button class="btn danger mt" id="btn-reset">↺ 기본값으로 초기화</button>
    </div>
  </div>`);

  buildMetaEditor($("#edit-meta", root));
  buildCharEditor($("#edit-chars", root));
  buildBankEditor($("#edit-bank", root));
  buildIssueEditor($("#edit-issues", root));
  buildLoreEditor($("#edit-lore", root));

  $("#btn-export-zip", root).addEventListener("click", exportZip);
  $("#btn-export-master", root).addEventListener("click", () =>
    downloadText("99_Master_DB.md", buildMasterMD()));
  $("#btn-export-summary", root).addEventListener("click", () =>
    downloadText("Novel_Story_Summary.md", buildSummaryMD()));
  $("#btn-save-all", root).addEventListener("click", saveState);
  $("#btn-reset", root).addEventListener("click", () => {
    if (confirm("모든 변경을 버리고 기본값으로 되돌릴까요?")) {
      localStorage.removeItem(STORAGE_KEY);
      state = deepClone(DEFAULT_DATA);
      selectedCharId = null;
      render();
      toast("기본값으로 초기화되었습니다");
    }
  });

  return root;
};

/* 편집기 빌더들 */
function textField(label, value, onInput, multiline) {
  const f = el(`<div class="field"><label>${esc(label)}</label>${
    multiline ? `<textarea></textarea>` : `<input type="text">`
  }</div>`);
  const input = f.querySelector(multiline ? "textarea" : "input");
  input.value = value == null ? "" : value;
  input.addEventListener("input", () => onInput(input.value));
  return f;
}

function buildMetaEditor(container) {
  container.appendChild(textField("작품 제목", state.meta.title, (v) => (state.meta.title = v)));
  container.appendChild(textField("로그라인", state.meta.logline, (v) => (state.meta.logline = v), true));
  container.appendChild(textField("장르", state.meta.genre, (v) => (state.meta.genre = v)));
  container.appendChild(textField("시작 시점", state.meta.timelineStart, (v) => (state.meta.timelineStart = v)));
}

function buildCharEditor(container) {
  state.characters.forEach((c) => {
    const box = el(`<div style="border:1px solid var(--line);border-radius:12px;padding:12px;margin-bottom:12px">
      <div style="font-weight:700;margin-bottom:8px">${esc(c.id)} · ${esc(c.name)}</div>
    </div>`);
    box.appendChild(textField("이름", c.name, (v) => (c.name = v)));
    box.appendChild(textField("역할", c.role, (v) => (c.role = v)));
    box.appendChild(textField("미래 역할", c.futureRole, (v) => (c.futureRole = v)));
    box.appendChild(textField("첫 등장", c.firstEP, (v) => (c.firstEP = v)));
    box.appendChild(textField("설정 메모", c.notes, (v) => (c.notes = v), true));
    container.appendChild(box);
  });
}

function buildBankEditor(container) {
  container.appendChild(el(`<div class="muted" style="font-size:12px;margin-bottom:8px">거래 내역 금액(억)을 수정하면 통장 잔고가 자동 계산됩니다.</div>`));
  state.bank.transactions.forEach((t, i) => {
    const box = el(`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px"></div>`);
    box.appendChild(textField("시점", t.date, (v) => (t.date = v)));
    const amtF = el(`<div class="field"><label>금액(억)</label><input type="number" step="0.1"></div>`);
    const amtInput = amtF.querySelector("input");
    amtInput.value = t.amount;
    amtInput.addEventListener("input", () => (t.amount = Number(amtInput.value) || 0));
    box.appendChild(amtF);
    container.appendChild(box);
    container.appendChild(textField("내용", t.memo, (v) => (t.memo = v)));
    container.appendChild(el(`<hr class="divider">`));
  });
  const addBtn = el(`<button class="btn ghost">+ 거래 추가</button>`);
  addBtn.addEventListener("click", () => {
    state.bank.transactions.push({ date: "EP???", memo: "새 거래", amount: 0 });
    render();
  });
  container.appendChild(addBtn);
}

function buildIssueEditor(container) {
  state.foreshadow.forEach((f) => {
    const box = el(`<div style="border:1px solid var(--line);border-radius:12px;padding:12px;margin-bottom:10px">
      <div style="font-weight:700;margin-bottom:6px">${esc(f.id)}</div></div>`);
    box.appendChild(textField("내용", f.text, (v) => (f.text = v)));
    box.appendChild(textField("회수 예정", f.payoff, (v) => (f.payoff = v)));
    const statusF = el(`<div class="field"><label>상태</label>
      <select><option value="OPEN">OPEN</option><option value="CLOSED">CLOSED</option></select></div>`);
    statusF.querySelector("select").value = f.status === "OPEN" ? "OPEN" : "CLOSED";
    statusF.querySelector("select").addEventListener("change", (e) => (f.status = e.target.value));
    box.appendChild(statusF);
    container.appendChild(box);
  });
}

function buildLoreEditor(container) {
  Object.keys(state.loreDocs).forEach((key) => {
    container.appendChild(textField(key + ".md", state.loreDocs[key], (v) => (state.loreDocs[key] = v), true));
  });
}

/* ================= 마크다운 생성 ================= */
function buildMasterMD() {
  const s = state;
  let md = `# 99_Master_DB\n\n## Project\n\n`;
  md += `- Title: ${s.meta.title}\n- Constitution: ${s.meta.constitution}\n`;
  md += `- Timeline Start: ${s.meta.timelineStart}\n- Original Timeline: ${s.meta.originalTimeline}\n`;
  md += `- Story Status: ${s.meta.storyStatus}\n\n---\n\n`;

  md += `# Character DB\n\n| ID | Name | Role | First EP | Future Role | Alive | Boss | Notes |\n`;
  md += `|----|------|------|----------|-------------|-------|------|-------|\n`;
  s.characters.forEach((c) => {
    md += `| ${c.id} | ${c.name} | ${c.role} | ${c.firstEP} | ${c.futureRole} | ${c.alive ? "Y" : "N"} | ${c.boss || "N"} | ${c.notes} |\n`;
  });

  md += `\n---\n\n# Foreshadow DB\n\n| ID | EP | Foreshadow | Planned Payoff | Status |\n|----|----|-----------|----------------|--------|\n`;
  s.foreshadow.forEach((f) => {
    md += `| ${f.id} | ${f.ep} | ${f.text} | ${f.payoff} | ${f.status} |\n`;
  });

  md += `\n---\n\n# Investment DB (통장 잔고: ${bankBalance().toLocaleString()} ${s.bank.currency})\n\n`;
  md += `| Phase | Capital | Goal | Status |\n|-------|---------|------|--------|\n`;
  s.investment.forEach((p) => {
    md += `| ${p.phase} | ${p.capital} | ${p.goal} | ${p.status} |\n`;
  });

  md += `\n---\n\n# Boss Progress\n\n| Boss | Name | First EP | Ally | Status |\n|------|------|----------|------|--------|\n`;
  s.bosses.forEach((b) => {
    md += `| ${b.id} | ${b.name} | ${b.firstEP} | ${b.ally} | ${b.status} |\n`;
  });

  md += `\n---\n\n# Episode Checklist\n\n`;
  s.episodes.forEach((e) => {
    md += `- [${e.done ? "x" : " "}] ${e.id} - ${e.title}\n`;
  });

  return md;
}

function buildSummaryMD() {
  const s = state;
  let md = `# 소설 통합 요약\n\n# 작품 개요\n\n${s.meta.logline}\n\n`;
  md += `- 장르: ${s.meta.genre}\n- 시작: ${s.meta.timelineStart} / 원래 시간: ${s.meta.originalTimeline}\n\n`;
  md += `---\n\n# 주요 인물\n\n`;
  s.characters.forEach((c) => {
    md += `## ${c.name} (${c.role})\n\n- 미래 역할: ${c.futureRole}\n- ${c.notes}\n\n`;
  });
  md += `---\n\n# 에피소드\n\n`;
  s.episodes.forEach((e) => { md += `${e.id} - ${e.title}\n\n`; });
  md += `---\n\n# 장기 목표\n\n`;
  s.goals.forEach((g, i) => { md += `${i + 1}. ${g}\n`; });
  return md;
}

function buildConstitutionMD() {
  const c = state.constitution;
  let md = `# Story Bible Project Constitution ${c.version}\n\n`;
  md += state.constitution.principles.map((p, i) => `${i + 1}. ${p}`).join("\n");
  return md + "\n";
}

function buildBibleFiles() {
  const files = [
    { name: "99_Master_DB.md", content: buildMasterMD() },
    { name: "Novel_Story_Summary.md", content: buildSummaryMD() },
    { name: "Constitution.md", content: buildConstitutionMD() },
  ];
  Object.keys(state.loreDocs).forEach((key) => {
    files.push({ name: key + ".md", content: state.loreDocs[key] });
  });
  // 원본 데이터도 백업으로 포함(JSON)
  files.push({ name: "story-bible.json", content: JSON.stringify(state, null, 2) });
  return files;
}

/* ================= 다운로드 ================= */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function downloadText(filename, text) {
  downloadBlob(new Blob([text], { type: "text/markdown;charset=utf-8" }), filename);
  toast(filename + " 다운로드");
}
function exportZip() {
  try {
    const blob = SimpleZip.createZip(buildBibleFiles());
    downloadBlob(blob, "스토리바이블.zip");
    toast("스토리바이블.zip 다운로드");
  } catch (e) {
    toast("ZIP 생성 실패: " + e.message);
  }
}

/* ================= 라우팅 ================= */
function setView(name) {
  currentView = name;
  if (name !== "characters") selectedCharId = null;
  render();
}
function render() {
  const container = $("#view");
  container.innerHTML = "";
  const builder = views[currentView] || views.dashboard;
  container.appendChild(builder());
  container.scrollTop = 0;
  window.scrollTo(0, 0);
  document.querySelectorAll(".tab").forEach((t) => {
    t.classList.toggle("active", t.dataset.view === currentView);
  });
}

/* ================= 초기화 ================= */
function init() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => setView(tab.dataset.view));
  });
  $("#btn-save-state").addEventListener("click", saveState);
  $("#app-title").textContent = "웹소설 네비게이터";
  $("#app-subtitle").textContent = state.meta.constitution;
  render();

  // 서비스 워커 등록 (오프라인 지원)
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
}

document.addEventListener("DOMContentLoaded", init);
