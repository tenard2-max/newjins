const API = '';

let snapshot = null;
let currentFile = null;
let fileCache = {};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

async function api(path, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json', ...opts.headers },
    ...opts,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || res.statusText);
  }
  if (res.headers.get('content-type')?.includes('application/json')) {
    return res.json();
  }
  return res;
}

async function loadSnapshot() {
  snapshot = await api('/api/snapshot');
  renderAll();
}

function renderAll() {
  if (!snapshot) return;
  renderHome();
  renderCharacters();
  renderIntel();
  renderSettings();
  renderFileTabs();
}

function renderHome() {
  const { balance, characters, issues, enemies, episodes } = snapshot;
  $('#balanceAmount').textContent = `${balance.amount}${balance.unit}`;
  $('#charCount').textContent = characters.length;
  $('#issueCount').textContent = issues.length;
  $('#enemyCount').textContent = enemies.length;
  const done = episodes.filter((e) => e.done).length;
  $('#epDone').textContent = `${done}/${episodes.length}`;
  $('#storyStatus').textContent = snapshot.project.storyStatus;

  $('#episodeList').innerHTML = episodes
    .map(
      (ep) =>
        `<span class="ep-badge ${ep.done ? 'done' : 'pending'}">${ep.id}${ep.done ? ' ✓' : ''}</span>`
    )
    .join('');

  const worldLines = [
    `시작: ${snapshot.project.timelineStart} 회귀`,
    `원래 시간: ${snapshot.project.originalTimeline}년`,
    'AI가 인류를 핵으로 리셋 → 97% 회귀 선택',
    '최종 목표: 인류 생존 · 게이트 대비',
  ];
  $('#worldSummary').innerHTML = `<ul>${worldLines.map((l) => `<li>${l}</li>`).join('')}</ul>`;
}

function renderCharacters() {
  const { characters, state, relationships } = snapshot;
  const selected = state.selectedCharacter || characters[0]?.id;

  $('#charChips').innerHTML = characters
    .map(
      (ch) =>
        `<button type="button" class="char-chip ${ch.id === selected ? 'active' : ''}" data-id="${ch.id}">${ch.name}</button>`
    )
    .join('');

  $$('.char-chip').forEach((btn) => {
    btn.addEventListener('click', async () => {
      await api('/api/state', {
        method: 'PATCH',
        body: JSON.stringify({ selectedCharacter: btn.dataset.id }),
      });
      snapshot.state.selectedCharacter = btn.dataset.id;
      renderCharacters();
    });
  });

  const ch = characters.find((c) => c.id === selected) || characters[0];
  if (!ch) return;

  const traits = (ch.traits || [])
    .map((t) => `<li>${t}</li>`)
    .join('');
  const bossBadge = ch.boss !== 'N' ? `<span class="status-tag status-threat">Boss: ${ch.boss}</span>` : '';

  $('#charDetail').innerHTML = `
    <h3>${ch.name} <small style="color:var(--text-dim);font-size:0.75rem">${ch.id}</small></h3>
    <div class="meta">${ch.role} · ${ch.firstEp} · ${ch.futureRole}</div>
    ${bossBadge}
    <ul class="traits">${traits || '<li>상세 정보 없음</li>'}</ul>
    ${ch.notes ? `<p style="margin-top:10px;font-size:0.8rem;color:var(--text-dim)">${ch.notes}</p>` : ''}
  `;

  drawRelationGraph(characters, relationships, selected);
}

function drawRelationGraph(characters, relationships, highlightId) {
  const svg = $('#relationGraph');
  const w = 360;
  const h = 320;
  const cx = w / 2;
  const cy = h / 2;
  const r = 110;

  const positions = {};
  characters.forEach((ch, i) => {
    const angle = (i / characters.length) * Math.PI * 2 - Math.PI / 2;
    positions[ch.id] = {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
      name: ch.name,
    };
  });

  let edges = '';
  relationships.forEach((rel) => {
    const a = positions[rel.from];
    const b = positions[rel.to];
    if (!a || !b) return;
    const highlighted =
      rel.from === highlightId || rel.to === highlightId;
    edges += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"
      stroke="${highlighted ? '#00ccff' : 'rgba(0,204,255,0.2)'}"
      stroke-width="${highlighted ? 2 : 1}" />`;
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    edges += `<text x="${mx}" y="${my}" fill="rgba(138,155,176,0.8)" font-size="8" text-anchor="middle">${rel.type}</text>`;
  });

  let nodes = '';
  characters.forEach((ch) => {
    const p = positions[ch.id];
    const active = ch.id === highlightId;
    nodes += `<circle cx="${p.x}" cy="${p.y}" r="${active ? 22 : 18}"
      fill="${active ? 'rgba(0,204,255,0.25)' : 'rgba(10,22,40,0.9)'}"
      stroke="${active ? '#00ccff' : 'rgba(0,204,255,0.4)'}" stroke-width="2" />`;
    nodes += `<text x="${p.x}" y="${p.y + 4}" fill="#e8f0f8" font-size="10" font-weight="600" text-anchor="middle">${p.name}</text>`;
  });

  svg.innerHTML = edges + nodes;

  const types = [...new Set(relationships.map((r) => r.type))];
  $('#relationLegend').innerHTML = types
    .map((t) => `<span class="legend-item">${t}</span>`)
    .join('');
}

function renderIntel() {
  const { issues, extraIssues, investment, enemies, gate } = snapshot;

  $('#issueList').innerHTML = issues
    .map(
      (item) => `
    <div class="issue-card glass">
      <div class="id">${item.id} · ${item.ep}</div>
      <h4>${item.foreshadow}</h4>
      <p>회수: ${item.payoff}</p>
      <span class="status-tag status-open">${item.status}</span>
    </div>`
    )
    .join('');

  if (extraIssues.length) {
    $('#issueList').innerHTML += extraIssues
      .map(
        (t) => `
      <div class="issue-card glass">
        <div class="id">떡밥</div>
        <h4>${t}</h4>
      </div>`
      )
      .join('');
  }

  $('#investList').innerHTML = investment
    .map(
      (inv) => `
    <div class="invest-card glass">
      <span class="phase">${inv.phase}</span>
      <div>
        <div class="capital">${inv.capital}</div>
        <p>${inv.goal}</p>
      </div>
      <span class="status-tag ${inv.status === '진행' ? 'status-progress' : 'status-lock'}">${inv.status}</span>
    </div>`
    )
    .join('');

  $('#enemyList').innerHTML = enemies
    .map((e) => {
      const cls =
        e.status === 'LOCK' || e.status === '미래'
          ? 'status-lock'
          : e.status === '동반 중'
            ? 'status-open'
            : 'status-threat';
      return `
    <div class="enemy-card glass">
      <div class="id">${e.id} · ${e.type}</div>
      <h4>${e.name}</h4>
      <p>${e.source}</p>
      <span class="status-tag ${cls}">${e.status}</span>
    </div>`;
    })
    .join('');

  $('#gateInfo').innerHTML = `<ul>${gate.map((g) => `<li>${g}</li>`).join('')}</ul>`;
}

function renderSettings() {
  const { constitution, state, updatedAt } = snapshot;
  $('#constitutionList').innerHTML = constitution.rules
    .map(
      (r) => `
    <div class="rule-card glass">
      <div class="rule-id">${r.id}</div>
      <h4>${r.name}</h4>
      <p>${r.description}</p>
    </div>`
    )
    .join('');

  $('#balanceInput').value = state.balance;
  $('#metaInfo').innerHTML = `
    Constitution: v${constitution.version}<br>
    마지막 동기화: ${new Date(updatedAt).toLocaleString('ko-KR')}<br>
    마지막 보내기: ${state.lastExport ? new Date(state.lastExport).toLocaleString('ko-KR') : '없음'}
  `;
}

function renderFileTabs() {
  $('#fileTabs').innerHTML = snapshot.files
    .map(
      (f) =>
        `<button type="button" class="file-tab ${f === currentFile ? 'active' : ''}" data-file="${f}">${f.replace('.md', '')}</button>`
    )
    .join('');

  $$('.file-tab').forEach((tab) => {
    tab.addEventListener('click', () => loadFile(tab.dataset.file));
  });
}

async function loadFile(name) {
  currentFile = name;
  renderFileTabs();
  if (fileCache[name]) {
    $('#fileEditor').value = fileCache[name];
    return;
  }
  const data = await api(`/api/files/${encodeURIComponent(name)}`);
  fileCache[name] = data.content;
  $('#fileEditor').value = data.content;
}

async function saveFile() {
  if (!currentFile) {
    toast('파일을 선택하세요');
    return;
  }
  const content = $('#fileEditor').value;
  await api(`/api/files/${encodeURIComponent(currentFile)}`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
  });
  fileCache[currentFile] = content;
  toast(`${currentFile} 저장됨`);
  await loadSnapshot();
}

function reloadFile() {
  if (!currentFile) return;
  delete fileCache[currentFile];
  loadFile(currentFile);
  toast('되돌렸습니다');
}

async function exportZip() {
  const res = await fetch('/api/export/zip');
  const blob = await res.blob();
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'story_bible.zip';
  a.click();
  URL.revokeObjectURL(a.href);
  toast('story_bible.zip 보내기 완료');
  await loadSnapshot();
}

async function importZip(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/import/zip', { method: 'POST', body: fd });
  if (!res.ok) throw new Error('가져오기 실패');
  fileCache = {};
  toast('ZIP 가져오기 완료');
  await loadSnapshot();
}

async function regenMaster() {
  await api('/api/regenerate/master', { method: 'POST' });
  delete fileCache['99_Master_DB.md'];
  toast('Master DB 동기화 완료');
  await loadSnapshot();
}

async function saveBalance() {
  const balance = parseFloat($('#balanceInput').value);
  await api('/api/state', {
    method: 'PATCH',
    body: JSON.stringify({ balance }),
  });
  await api('/api/regenerate/master', { method: 'POST' });
  toast('잔고 저장 및 Master DB 반영');
  await loadSnapshot();
}

function initNav() {
  $$('.nav-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      $$('.nav-item').forEach((b) => b.classList.remove('active'));
      $$('.panel').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      $(`#panel-${target}`).classList.add('active');
    });
  });
}

function initEditor() {
  $('#btnSaveFile').addEventListener('click', saveFile);
  $('#btnReloadFile').addEventListener('click', reloadFile);
  $('#btnExportZip').addEventListener('click', exportZip);
  $('#btnRegenMaster').addEventListener('click', regenMaster);
  $('#btnSaveBalance').addEventListener('click', saveBalance);
  $('#importZip').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) importZip(file).catch(() => toast('가져오기 실패'));
    e.target.value = '';
  });
}

function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/static/sw.js').catch(() => {});
  }
}

initNav();
initEditor();
registerSW();
loadSnapshot().then(() => {
  if (snapshot.files.length) loadFile(snapshot.files[0]);
});
