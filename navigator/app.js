/* ============================================================
   스토리 네비게이터 — 앱 로직
   - 상태(state)는 localStorage 에 저장 (오프라인/재방문 유지)
   - 인물 선택, 관계도(SVG), 떡밥/투자/통장/보스, 문서편집, ZIP 내보내기
   ============================================================ */
(function () {
  "use strict";

  const STORAGE_KEY = "storyBible.v1";
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ── 상태 로드/저장 ─────────────────────────────────────
  function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

  let state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { console.warn("상태 로드 실패, 기본값 사용", e); }
    return deepClone(STORY_BIBLE_SEED);
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      toast("저장 공간이 부족합니다. 이미지를 줄여보세요.");
    }
  }

  function resetState() {
    state = deepClone(STORY_BIBLE_SEED);
    saveState();
  }

  // ── 유틸 ───────────────────────────────────────────────
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function nextId(list, prefix, pad) {
    let max = 0;
    list.forEach((it) => {
      const m = String(it.id || "").match(/(\d+)$/);
      if (m) max = Math.max(max, parseInt(m[1], 10));
    });
    return prefix + String(max + 1).padStart(pad, "0");
  }
  function fmtNum(n) {
    const v = Number(n) || 0;
    return v.toLocaleString("ko-KR", { maximumFractionDigits: 2 });
  }
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { el.hidden = true; }, 2200);
  }
  function bankBalance() {
    return (state.bank.transactions || []).reduce((s, t) => s + (Number(t.amount) || 0), 0);
  }

  // ── 렌더: 개요(Home) ──────────────────────────────────
  function renderHome() {
    const m = state.meta;
    $("#appTitle").textContent = m.title || "스토리 네비게이터";
    $("#appSub").textContent = m.storyStatus || "";
    $("#constText").textContent = m.constitution || "Story Bible Constitution v1.0";
    $("#heroTitle").textContent = m.title || "무제";
    const first = state.episodes.find((e) => e.done);
    $("#heroDesc").textContent =
      `${m.originalTimeline || "?"}년 → ${m.timelineStart || "?"} 회귀. ` +
      `AI와 함께 인류 생존 확률 97%의 미래를 완성한다.`;

    $("#genreChips").innerHTML = (m.genre || [])
      .map((g) => `<span class="chip">${esc(g)}</span>`).join("");

    $("#mCharCount").textContent = state.characters.length;
    $("#mEpCount").textContent = state.episodes.filter((e) => e.done).length;
    $("#mForeCount").textContent = state.foreshadow.filter((f) => f.status === "OPEN").length;
    $("#mBalance").textContent = fmtNum(bankBalance());

    $("#episodeList").innerHTML = state.episodes.map((e) => `
      <div class="ep-item">
        <span class="ep-badge ${e.done ? "done" : "todo"}">${esc(e.id)}</span>
        <span class="ep-title">${esc(e.title)}</span>
      </div>`).join("");

    $("#goalList").innerHTML = state.goals.map((g) => `<li>${esc(g)}</li>`).join("");
  }

  // ── 렌더: 인물 ─────────────────────────────────────────
  function avatarHtml(c, cls) {
    if (c.portrait) return `<img src="${esc(c.portrait)}" alt="${esc(c.name)}" />`;
    return esc((c.name || "?").slice(0, 2));
  }
  function charStyle(c) {
    const color = c.color || "#00ccff";
    return `--cc:${color};--cc-soft:${hexToSoft(color)}`;
  }
  function hexToSoft(hex) {
    const h = hex.replace("#", "");
    if (h.length !== 6) return "rgba(0,204,255,0.15)";
    const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r},${g},${b},0.16)`;
  }

  function renderChars() {
    $("#charGrid").innerHTML = state.characters.map((c) => `
      <article class="char-card" style="${charStyle(c)}" data-char="${esc(c.id)}">
        <div class="char-avatar">${avatarHtml(c)}</div>
        <div class="char-name">${esc(c.name)}</div>
        <div class="char-role">${esc(c.role)}</div>
        <p class="char-note">${esc(c.notes)}</p>
        <div class="char-tags">
          <span class="tag">${esc(c.firstEP)}</span>
          <span class="tag">${esc(c.futureRole)}</span>
          ${c.isBoss ? `<span class="tag boss">${esc(c.bossTag || "BOSS")}</span>` : ""}
        </div>
      </article>`).join("");
    $$("#charGrid .char-card").forEach((el) =>
      el.addEventListener("click", () => openCharModal(el.dataset.char)));
  }

  // ── 인물 상세 모달 ─────────────────────────────────────
  function openCharModal(id) {
    const c = state.characters.find((x) => x.id === id);
    if (!c) return;
    const relHtml = (c.relations || []).map((r) => {
      const t = state.characters.find((x) => x.id === r.to);
      return `<button class="rel-pill" data-goto="${esc(r.to)}"><b>${esc(t ? t.name : r.to)}</b> · <span>${esc(r.label)}</span></button>`;
    }).join("") || `<span class="hint" style="text-align:left">등록된 관계 없음</span>`;

    $("#charModalBody").innerHTML = `
      <div class="cm-head" style="${charStyle(c)}">
        <div class="cm-avatar">${avatarHtml(c)}</div>
        <div>
          <div class="cm-name">${esc(c.name)}</div>
          <div class="cm-role">${esc(c.role)} · ${esc(c.id)}</div>
        </div>
      </div>
      <div class="cm-grid">
        <div class="cm-field"><div class="k">첫 등장</div><div class="v">${esc(c.firstEP)}</div></div>
        <div class="cm-field"><div class="k">미래 역할</div><div class="v">${esc(c.futureRole)}</div></div>
        <div class="cm-field"><div class="k">생존</div><div class="v">${c.alive ? "생존" : "사망"}</div></div>
        <div class="cm-field"><div class="k">보스</div><div class="v">${c.isBoss ? (c.bossTag || "예") : "아니오"}</div></div>
      </div>
      <ul class="cm-bullets">${(c.bullets || []).map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
      <div class="cm-rel-title">관계</div>
      <div class="cm-rel">${relHtml}</div>
      <div class="cm-actions">
        <button class="mini-btn" id="cmEdit">인물 편집</button>
        <button class="mini-btn danger" id="cmDelete">삭제</button>
      </div>`;

    openModal("#charModal");
    $$("#charModalBody [data-goto]").forEach((el) =>
      el.addEventListener("click", () => { closeModal("#charModal"); openCharModal(el.dataset.goto); }));
    $("#cmEdit").addEventListener("click", () => { closeModal("#charModal"); editChar(c.id); });
    $("#cmDelete").addEventListener("click", () => {
      if (confirm(`'${c.name}' 인물을 삭제할까요?`)) {
        state.characters = state.characters.filter((x) => x.id !== c.id);
        state.characters.forEach((x) => { x.relations = (x.relations || []).filter((r) => r.to !== c.id); });
        saveState(); closeModal("#charModal"); renderAll(); toast("삭제되었습니다.");
      }
    });
  }

  // ── 관계도 SVG ─────────────────────────────────────────
  function renderMap() {
    const svg = $("#relSvg");
    const chars = state.characters;
    const n = chars.length;
    const W = 360, H = 360, cx = W / 2, cy = H / 2;
    const R = Math.min(W, H) / 2 - 52;
    const pos = {};
    chars.forEach((c, i) => {
      const ang = (Math.PI * 2 * i) / Math.max(n, 1) - Math.PI / 2;
      pos[c.id] = { x: cx + R * Math.cos(ang), y: cy + R * Math.sin(ang) };
    });

    const relColor = { love: "#ff7eb6", ally: "#00ffaa", family: "#66b3ff" };
    const seen = new Set();
    let edges = "";
    chars.forEach((c) => {
      (c.relations || []).forEach((r) => {
        if (!pos[r.to]) return;
        const key = [c.id, r.to].sort().join("|") + "|" + r.type;
        if (seen.has(key)) return; seen.add(key);
        const a = pos[c.id], b = pos[r.to];
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        const col = relColor[r.type] || "#7896dc";
        edges += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${col}" stroke-width="1.6" opacity="0.6"/>`;
        edges += `<text class="edge-label" x="${mx}" y="${my - 2}" text-anchor="middle">${esc(r.label)}</text>`;
      });
    });

    let nodes = "";
    chars.forEach((c) => {
      const p = pos[c.id];
      const col = c.color || "#00ccff";
      const label = (c.name || "").slice(0, 2);
      nodes += `<g class="rel-node" data-char="${esc(c.id)}">
        <circle cx="${p.x}" cy="${p.y}" r="22" fill="${hexToSoft(col)}" stroke="${col}" stroke-width="2"/>
        <text x="${p.x}" y="${p.y + 4}" text-anchor="middle" class="node-label" fill="${col}" style="font-weight:700">${esc(label)}</text>
        <text x="${p.x}" y="${p.y + 38}" text-anchor="middle" class="node-label">${esc(c.name)}</text>
      </g>`;
    });

    svg.innerHTML = edges + nodes;
    $$("#relSvg .rel-node").forEach((el) =>
      el.addEventListener("click", () => openCharModal(el.dataset.char)));
  }

  // ── 렌더: 떡밥 ─────────────────────────────────────────
  function renderFore() {
    $("#foreList").innerHTML = state.foreshadow.map((f) => `
      <div class="issue-card" data-fore="${esc(f.id)}">
        <div class="issue-top">
          <span class="issue-id">${esc(f.id)}</span>
          <span class="issue-ep">${esc(f.ep)}</span>
          <span class="issue-status status-${esc(f.status)}">${esc(f.status)}</span>
        </div>
        <div class="issue-text">${esc(f.text)}</div>
        <div class="issue-payoff">회수 예정: ${esc(f.payoff)}</div>
      </div>`).join("");
    $$("#foreList .issue-card").forEach((el) =>
      el.addEventListener("click", () => editFore(el.dataset.fore)));
  }

  // ── 렌더: 투자 ─────────────────────────────────────────
  function renderInvest() {
    $("#investList").innerHTML = state.investment.phases.map((p) => `
      <div class="invest-card">
        <span class="invest-phase">${esc(p.phase)}</span>
        <div class="invest-mid">
          <div class="invest-cap">${esc(p.capital)}</div>
          <div class="invest-goal">${esc(p.goal)}</div>
        </div>
        <span class="invest-status st-${esc(p.status)}">${esc(p.status)}</span>
      </div>`).join("");
    $("#investFirst").textContent = state.investment.firstTarget || "";
    $("#investLong").textContent = state.investment.longTerm || "";
  }

  // ── 렌더: 통장 ─────────────────────────────────────────
  function renderBank() {
    $("#bankBalance").textContent = fmtNum(bankBalance());
    $("#bankUnit").textContent = state.bank.unit || "억원";
    const txs = deepClone(state.bank.transactions).reverse();
    $("#txList").innerHTML = txs.map((t) => {
      const plus = (Number(t.amount) || 0) >= 0;
      return `<div class="tx-card" data-tx="${esc(t.id)}">
        <div class="tx-icon ${plus ? "tx-in" : "tx-out"}">${plus ? "▲" : "▼"}</div>
        <div class="tx-mid">
          <div class="tx-desc">${esc(t.desc)}</div>
          <div class="tx-meta">${esc(t.ep || "")} · ${esc(t.date || "")}</div>
        </div>
        <div class="tx-amount ${plus ? "plus" : "minus"}">${plus ? "+" : ""}${fmtNum(t.amount)}</div>
      </div>`;
    }).join("");
    $$("#txList .tx-card").forEach((el) =>
      el.addEventListener("click", () => editTx(el.dataset.tx)));
  }

  // ── 렌더: 보스 ─────────────────────────────────────────
  function renderBoss() {
    $("#bossNote").textContent = state.bossNote || "";
    $("#bossList").innerHTML = state.bosses.map((b) => `
      <div class="boss-card" data-boss="${esc(b.id)}">
        <span class="boss-badge">${esc(b.id)}</span>
        <div class="boss-mid">
          <div class="boss-name">${esc(b.name)}</div>
          <div class="boss-meta">첫 등장 ${esc(b.firstEP)} · 동료화 ${esc(b.ally)}</div>
        </div>
        <span class="boss-status st-${esc(b.status)}">${esc(b.status)}</span>
      </div>`).join("");
    $$("#bossList .boss-card").forEach((el) =>
      el.addEventListener("click", () => editBoss(el.dataset.boss)));
  }

  // ── 렌더: 문서 ─────────────────────────────────────────
  let currentFile = null;
  function renderFiles() {
    const names = Object.keys(state.files);
    const sel = $("#fileSelect");
    sel.innerHTML = names.map((n) => `<option value="${esc(n)}">${esc(n)}</option>`).join("");
    if (!currentFile || !state.files[currentFile]) currentFile = names[0];
    sel.value = currentFile;
    $("#fileEditor").value = state.files[currentFile] || "";
  }

  function renderAll() {
    renderHome(); renderChars(); renderMap();
    renderFore(); renderInvest(); renderBank(); renderBoss();
    renderFiles();
  }

  // ── 공용 모달 ──────────────────────────────────────────
  function openModal(sel) { $(sel).hidden = false; document.body.style.overflow = "hidden"; }
  function closeModal(sel) { $(sel).hidden = true; document.body.style.overflow = ""; }
  $$("[data-close]").forEach((el) =>
    el.addEventListener("click", () => { el.closest(".modal").hidden = true; document.body.style.overflow = ""; }));

  // ── 편집 폼 빌더 ───────────────────────────────────────
  function field(label, id, value, type) {
    if (type === "textarea") {
      return `<div class="row"><label>${esc(label)}</label><textarea id="${id}" rows="3">${esc(value)}</textarea></div>`;
    }
    return `<div class="row"><label>${esc(label)}</label><input class="input" id="${id}" value="${esc(value)}" /></div>`;
  }
  function selectField(label, id, value, options) {
    return `<div class="row"><label>${esc(label)}</label><select class="select" id="${id}">` +
      options.map((o) => `<option value="${esc(o)}" ${o === value ? "selected" : ""}>${esc(o)}</option>`).join("") +
      `</select></div>`;
  }
  function checkField(label, id, checked) {
    return `<div class="row checkbox-row"><input type="checkbox" id="${id}" ${checked ? "checked" : ""}/><label for="${id}" style="margin:0">${esc(label)}</label></div>`;
  }
  function openEdit(title, bodyHtml, onSave, onDelete) {
    $("#editTitle").textContent = title;
    $("#editBody").innerHTML = bodyHtml;
    const saveBtn = $("#editSave"), delBtn = $("#editDelete");
    saveBtn.onclick = () => { if (onSave() !== false) { closeModal("#editModal"); } };
    if (onDelete) { delBtn.hidden = false; delBtn.onclick = onDelete; }
    else delBtn.hidden = true;
    openModal("#editModal");
  }

  // 인물 편집/추가
  function editChar(id) {
    const isNew = !id;
    const c = isNew
      ? { id: nextId(state.characters, "CH", 3), name: "", role: "", firstEP: "", futureRole: "", alive: true, isBoss: false, color: "#00ccff", portrait: "", notes: "", bullets: [], relations: [] }
      : deepClone(state.characters.find((x) => x.id === id));
    const body =
      field("이름", "ef_name", c.name) +
      `<div class="two">${field("역할", "ef_role", c.role)}${field("첫 등장 EP", "ef_ep", c.firstEP)}</div>` +
      `<div class="two">${field("미래 역할", "ef_future", c.futureRole)}${field("대표 색상(hex)", "ef_color", c.color)}</div>` +
      field("한줄 소개", "ef_notes", c.notes, "textarea") +
      field("상세(줄바꿈으로 구분)", "ef_bullets", (c.bullets || []).join("\n"), "textarea") +
      field("초상화 URL(선택)", "ef_portrait", c.portrait) +
      `<div class="two">${checkField("생존", "ef_alive", c.alive)}${checkField("보스", "ef_boss", c.isBoss)}</div>`;
    openEdit(isNew ? "인물 추가" : "인물 편집", body, () => {
      c.name = $("#ef_name").value.trim();
      if (!c.name) { toast("이름을 입력하세요."); return false; }
      c.role = $("#ef_role").value.trim();
      c.firstEP = $("#ef_ep").value.trim();
      c.futureRole = $("#ef_future").value.trim();
      c.color = $("#ef_color").value.trim() || "#00ccff";
      c.notes = $("#ef_notes").value.trim();
      c.bullets = $("#ef_bullets").value.split("\n").map((s) => s.trim()).filter(Boolean);
      c.portrait = $("#ef_portrait").value.trim();
      c.alive = $("#ef_alive").checked;
      c.isBoss = $("#ef_boss").checked;
      if (isNew) state.characters.push(c);
      else { const idx = state.characters.findIndex((x) => x.id === id); state.characters[idx] = c; }
      saveState(); renderAll(); toast("저장되었습니다.");
    }, isNew ? null : () => {
      if (confirm(`'${c.name}' 삭제?`)) {
        state.characters = state.characters.filter((x) => x.id !== id);
        saveState(); closeModal("#editModal"); renderAll(); toast("삭제됨");
      }
    });
  }

  // 떡밥 편집/추가
  function editFore(id) {
    const isNew = !id;
    const f = isNew
      ? { id: nextId(state.foreshadow, "F", 3), ep: "", text: "", payoff: "", status: "OPEN" }
      : deepClone(state.foreshadow.find((x) => x.id === id));
    const body =
      field("내용", "ff_text", f.text) +
      `<div class="two">${field("등장 EP", "ff_ep", f.ep)}${field("회수 예정", "ff_payoff", f.payoff)}</div>` +
      selectField("상태", "ff_status", f.status, ["OPEN", "CLOSED"]);
    openEdit(isNew ? "이슈 추가" : "이슈 편집", body, () => {
      f.text = $("#ff_text").value.trim();
      if (!f.text) { toast("내용을 입력하세요."); return false; }
      f.ep = $("#ff_ep").value.trim(); f.payoff = $("#ff_payoff").value.trim(); f.status = $("#ff_status").value;
      if (isNew) state.foreshadow.push(f);
      else { const i = state.foreshadow.findIndex((x) => x.id === id); state.foreshadow[i] = f; }
      saveState(); renderAll(); toast("저장됨");
    }, isNew ? null : () => {
      state.foreshadow = state.foreshadow.filter((x) => x.id !== id);
      saveState(); closeModal("#editModal"); renderAll(); toast("삭제됨");
    });
  }

  // 거래(통장) 편집/추가
  function editTx(id) {
    const isNew = !id;
    const t = isNew
      ? { id: nextId(state.bank.transactions, "T", 3), ep: "", date: "", desc: "", amount: 0 }
      : deepClone(state.bank.transactions.find((x) => x.id === id));
    const body =
      field("내용", "tf_desc", t.desc) +
      `<div class="two">${field("EP", "tf_ep", t.ep)}${field("시점", "tf_date", t.date)}</div>` +
      field("금액(입금 +, 출금 -)", "tf_amount", t.amount) +
      `<p class="hint" style="text-align:left">단위: ${esc(state.bank.unit)}. 예) 입금 58.7 / 출금 -10</p>`;
    openEdit(isNew ? "입출금 추가" : "거래 편집", body, () => {
      t.desc = $("#tf_desc").value.trim();
      if (!t.desc) { toast("내용을 입력하세요."); return false; }
      t.ep = $("#tf_ep").value.trim(); t.date = $("#tf_date").value.trim();
      t.amount = parseFloat($("#tf_amount").value) || 0;
      if (isNew) state.bank.transactions.push(t);
      else { const i = state.bank.transactions.findIndex((x) => x.id === id); state.bank.transactions[i] = t; }
      saveState(); renderAll(); toast("저장됨");
    }, isNew ? null : () => {
      state.bank.transactions = state.bank.transactions.filter((x) => x.id !== id);
      saveState(); closeModal("#editModal"); renderAll(); toast("삭제됨");
    });
  }

  // 보스 편집
  function editBoss(id) {
    const b = deepClone(state.bosses.find((x) => x.id === id));
    const body =
      field("이름", "bf_name", b.name) +
      `<div class="two">${field("첫 등장 EP", "bf_ep", b.firstEP)}${field("동료화", "bf_ally", b.ally)}</div>` +
      selectField("상태", "bf_status", b.status, ["LOCK", "OPEN", "ALLY"]);
    openEdit(`적 ${b.id} 편집`, body, () => {
      b.name = $("#bf_name").value.trim() || "미정";
      b.firstEP = $("#bf_ep").value.trim() || "-";
      b.ally = $("#bf_ally").value.trim() || "예정";
      b.status = $("#bf_status").value;
      const i = state.bosses.findIndex((x) => x.id === id); state.bosses[i] = b;
      saveState(); renderAll(); toast("저장됨");
    });
  }

  // ── 마스터 DB 재생성 (데이터 → Markdown) ────────────────
  function buildMasterMd() {
    const m = state.meta;
    let out = `# 99_Master_DB\n\n## Project\n\n`;
    out += `-   Title: ${m.title}\n-   Constitution: ${m.constitution}\n`;
    out += `-   Timeline Start: ${m.timelineStart}\n-   Original Timeline: ${m.originalTimeline}\n`;
    out += `-   Story Status: ${m.storyStatus}\n\n`;

    out += `# Character DB\n\n`;
    out += `  ID      Name     Role     First EP     Future Role     Alive    Boss    Notes\n`;
    state.characters.forEach((c) => {
      out += `  ${c.id}   ${c.name}   ${c.role}   ${c.firstEP}   ${c.futureRole}   ${c.alive ? "Y" : "N"}   ${c.isBoss ? (c.bossTag || "Y") : "N"}   ${c.notes}\n`;
    });

    out += `\n# Foreshadow DB\n\n  ID     EP      Foreshadow   Planned Payoff   Status\n`;
    state.foreshadow.forEach((f) => { out += `  ${f.id}   ${f.ep}   ${f.text}   ${f.payoff}   ${f.status}\n`; });

    out += `\n# Investment DB\n\n  Phase   Capital   Goal                 Status\n`;
    state.investment.phases.forEach((p) => { out += `  ${p.phase}   ${p.capital}   ${p.goal}   ${p.status}\n`; });

    out += `\n# Bank (통장)\n\n  잔고: ${fmtNum(bankBalance())} ${state.bank.unit}\n\n  ID     EP      Date      Desc                         Amount\n`;
    state.bank.transactions.forEach((t) => { out += `  ${t.id}   ${t.ep}   ${t.date}   ${t.desc}   ${fmtNum(t.amount)}\n`; });

    out += `\n# Boss Progress\n\n  Boss   Name   First EP   Ally   Status\n`;
    state.bosses.forEach((b) => { out += `  ${b.id}   ${b.name}   ${b.firstEP}   ${b.ally}   ${b.status}\n`; });

    out += `\n# Episode Checklist\n\n`;
    state.episodes.forEach((e) => { out += `-   [${e.done ? "x" : " "}] ${e.id} ${e.title}\n`; });

    return out;
  }

  function regenerateMaster() {
    state.files["99_Master_DB.md"] = buildMasterMd();
    saveState();
    if (currentFile === "99_Master_DB.md") $("#fileEditor").value = state.files[currentFile];
    toast("99_Master_DB.md 를 최신 데이터로 재생성했습니다.");
  }

  // ── ZIP 내보내기 ───────────────────────────────────────
  async function exportZip() {
    if (typeof JSZip === "undefined") { toast("ZIP 라이브러리 로드 실패(오프라인 최초 실행)"); return; }
    // 마스터 문서를 최신 데이터로 동기화한 뒤 내보내기
    state.files["99_Master_DB.md"] = buildMasterMd();
    saveState();
    const zip = new JSZip();
    const root = zip.folder("StoryBible");
    Object.keys(state.files).forEach((name) => root.file(name, state.files[name]));
    root.file("_data.json", JSON.stringify(state, null, 2));
    const blob = await zip.generateAsync({ type: "blob" });
    downloadBlob(blob, "스토리바이블.zip");
    toast("스토리바이블.zip 을 내보냈습니다.");
    if (currentFile === "99_Master_DB.md") renderFiles();
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    downloadBlob(blob, "storybible_data.json");
    toast("데이터 백업(JSON) 완료");
  }

  function importJson(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const obj = JSON.parse(reader.result);
        if (!obj.characters || !obj.files) throw new Error("형식 불일치");
        state = obj; saveState(); currentFile = null; renderAll();
        toast("데이터를 가져왔습니다.");
      } catch (e) { toast("가져오기 실패: 올바른 JSON이 아닙니다."); }
    };
    reader.readAsText(file);
  }

  // ── 탭 전환 ────────────────────────────────────────────
  function switchTab(name) {
    $$(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === name));
    $$(".tab-panel").forEach((p) => { p.hidden = p.dataset.panel !== name; });
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }
  $$(".tab").forEach((t) => t.addEventListener("click", () => switchTab(t.dataset.tab)));

  // 서브탭(이슈)
  $$(".subtab").forEach((st) => st.addEventListener("click", () => {
    $$(".subtab").forEach((x) => x.classList.toggle("active", x === st));
    $$(".subpanel").forEach((p) => { p.hidden = p.dataset.subpanel !== st.dataset.sub; });
  }));

  // ── 이벤트 바인딩 ──────────────────────────────────────
  function bindEvents() {
    $("#btnAddChar").addEventListener("click", () => editChar(null));
    $("#btnAddFore").addEventListener("click", () => editFore(null));
    $("#btnAddTx").addEventListener("click", () => editTx(null));
    $("#btnEditBoss").addEventListener("click", () => switchTab("issues"));

    $("#fileSelect").addEventListener("change", (e) => {
      currentFile = e.target.value;
      $("#fileEditor").value = state.files[currentFile] || "";
      $("#saveState").textContent = "";
    });
    $("#btnSaveFile").addEventListener("click", () => {
      state.files[currentFile] = $("#fileEditor").value;
      saveState();
      $("#saveState").textContent = "저장됨 ✓";
      toast(`${currentFile} 저장 완료`);
    });

    $("#btnExportZip").addEventListener("click", exportZip);
    $("#btnExportMaster").addEventListener("click", regenerateMaster);
    $("#btnExportJson").addEventListener("click", exportJson);
    $("#importInput").addEventListener("change", (e) => { if (e.target.files[0]) importJson(e.target.files[0]); e.target.value = ""; });
    $("#btnResetData").addEventListener("click", () => {
      if (confirm("모든 편집 내용을 지우고 기본값으로 되돌릴까요?")) {
        resetState(); currentFile = null; renderAll(); toast("기본값으로 초기화했습니다.");
      }
    });

    // 상단 ⋯ 메뉴 → 문서 탭으로
    $("#btnMenu").addEventListener("click", () => switchTab("files"));
  }

  // ── PWA: 설치 프롬프트 + 서비스워커 ────────────────────
  let deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); deferredPrompt = e; $("#btnInstall").hidden = false;
  });
  function initInstall() {
    $("#btnInstall").addEventListener("click", async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null; $("#btnInstall").hidden = true;
    });
    window.addEventListener("appinstalled", () => { $("#btnInstall").hidden = true; });
  }
  function registerSW() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch((e) => console.warn("SW 등록 실패", e));
      });
    }
  }

  // ── 초기화 ─────────────────────────────────────────────
  function init() {
    renderAll();
    bindEvents();
    initInstall();
    registerSW();
  }
  document.addEventListener("DOMContentLoaded", init);
})();
