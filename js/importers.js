// 파일 → 상태 변환기.
// 지원 형식
//  - .json  : exportJson / story_bible.json 이 그대로 되돌아옴 → 전체 상태 교체.
//  - .zip   : StoryBible.zip. 내부 story_bible.json 이 있으면 그것을 우선 사용,
//             없으면 99_Master_DB.md 를 파싱해 부분 복원.
//  - .md    : 99_Master_DB.md 스타일의 단일 마크다운 → 표를 파싱해 부분 병합.
// 파싱은 관대(lenient)하게 처리하고, 파싱 실패 필드는 기존 값 유지한다.

import { store } from "./store.js";

function splitTable(block) {
  const lines = block.split(/\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];
  const rows = [];
  for (const line of lines) {
    if (!line.startsWith("|")) continue;
    if (/^\|\s*-+/.test(line)) continue;
    const cells = line.split("|").slice(1, -1).map(c => c.trim());
    rows.push(cells);
  }
  if (rows.length < 2) return [];
  const headers = rows[0];
  return rows.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, i) => (obj[h] = r[i] ?? ""));
    return obj;
  });
}

function parseMasterMd(md) {
  const result = {};
  // 섹션 분할
  const sections = md.split(/^# /m).map(s => s.trim()).filter(Boolean);
  for (const sec of sections) {
    const firstLine = sec.split("\n", 1)[0].trim();
    const body = sec.slice(firstLine.length).trim();
    if (/^Character DB/i.test(firstLine)) {
      const rows = splitTable(body);
      if (rows.length) {
        result.characters = rows.map(r => ({
          id: r.ID || "",
          name: r.Name || "",
          role: r.Role || "",
          firstEp: r["First EP"] || "",
          futureRole: r["Future Role"] || "",
          alive: r.Alive || "Y",
          boss: r.Boss || "N",
          notes: r.Notes || ""
        }));
      }
    } else if (/^Foreshadow DB/i.test(firstLine)) {
      const rows = splitTable(body);
      if (rows.length) {
        result.foreshadows = rows.map(r => ({
          id: r.ID || "",
          ep: r.EP || "",
          text: r.Foreshadow || "",
          payoff: r["Planned Payoff"] || "",
          status: r.Status || "OPEN"
        }));
      }
    } else if (/^Investment DB/i.test(firstLine)) {
      const rows = splitTable(body);
      if (rows.length) {
        result.investments = rows.map(r => ({
          phase: r.Phase || "",
          capital: r.Capital || "",
          goal: r.Goal || "",
          status: r.Status || "예정"
        }));
      }
    } else if (/^Boss Progress/i.test(firstLine)) {
      const rows = splitTable(body);
      if (rows.length) {
        result.bosses = rows.map(r => ({
          id: r.Boss || "",
          name: r.Name || "미정",
          firstEp: r["First EP"] || "-",
          ally: r.Ally || "예정",
          status: r.Status || "LOCK"
        }));
      }
    } else if (/^Episode Checklist/i.test(firstLine)) {
      const items = body.split(/\n/).map(l => l.trim()).filter(l => /^-\s*\[/.test(l));
      result.episodes = items.map(l => {
        const done = /\[x\]/i.test(l);
        const rest = l.replace(/^-\s*\[.\]\s*/, "");
        const [id, ...title] = rest.split(/[—-]/);
        return {
          id: (id || "").trim(),
          title: title.join("-").trim() || "(제목 미상)",
          done,
          summary: ""
        };
      });
    } else if (/^Project/i.test(firstLine)) {
      const lines = body.split(/\n/);
      const meta = {};
      for (const l of lines) {
        const m = l.match(/^-\s*([^:]+):\s*(.+)$/);
        if (!m) continue;
        const key = m[1].trim();
        const val = m[2].trim();
        if (/^Title/i.test(key)) meta.title = val;
        if (/^Timeline Start/i.test(key)) meta.timelineStart = val;
        if (/^Original Timeline/i.test(key)) meta.originalTimeline = val;
        if (/^Story Status/i.test(key)) meta.storyStatus = val;
        if (/^통장/.test(key)) {
          const capital = parseFloat(val);
          const epMatch = val.match(/EP\d+/);
          result._balance = {
            currentCapital: isNaN(capital) ? undefined : capital,
            lastUpdatedEp: epMatch ? epMatch[0] : undefined
          };
        }
      }
      result.meta = meta;
    }
  }
  return result;
}

function mergeParsed(current, parsed) {
  const next = JSON.parse(JSON.stringify(current));
  if (parsed.meta) Object.assign(next.meta, parsed.meta);
  if (parsed._balance) {
    if (parsed._balance.currentCapital !== undefined) next.balance.currentCapital = parsed._balance.currentCapital;
    if (parsed._balance.lastUpdatedEp) next.balance.lastUpdatedEp = parsed._balance.lastUpdatedEp;
  }
  if (parsed.characters?.length) {
    // 기존 characters 를 id 기준으로 업데이트하며 미제공 필드(image/gallery/color/side)는 유지
    const byId = Object.fromEntries(next.characters.map(c => [c.id, c]));
    parsed.characters.forEach(pc => {
      if (byId[pc.id]) Object.assign(byId[pc.id], pc);
      else next.characters.push({ image: "", gallery: [], color: "#66b3ff", side: "", ...pc });
    });
  }
  if (parsed.foreshadows?.length) next.foreshadows = parsed.foreshadows.map(f => ({ note: "", ...f }));
  if (parsed.investments?.length) next.investments = parsed.investments.map(i => ({ note: "", ...i }));
  if (parsed.bosses?.length) next.bosses = parsed.bosses.map(b => ({ note: "", ...b }));
  if (parsed.episodes?.length) {
    const byId = Object.fromEntries(next.episodes.map(e => [e.id, e]));
    parsed.episodes.forEach(pe => {
      if (byId[pe.id]) Object.assign(byId[pe.id], pe);
      else next.episodes.push(pe);
    });
  }
  return next;
}

async function readFileAsText(file) {
  return await file.text();
}

async function readFileAsArrayBuffer(file) {
  return await file.arrayBuffer();
}

export async function importFile(file) {
  const name = (file.name || "").toLowerCase();

  if (name.endsWith(".json")) {
    const text = await readFileAsText(file);
    const obj = JSON.parse(text);
    store.replace(obj);
    return { ok: true, mode: "json-replace" };
  }

  if (name.endsWith(".zip")) {
    if (typeof JSZip === "undefined") throw new Error("JSZip 미로드");
    const buf = await readFileAsArrayBuffer(file);
    const zip = await JSZip.loadAsync(buf);

    // 완전 복원용 story_bible.json 우선
    let jsonEntry = null;
    zip.forEach((path, entry) => {
      if (/story_bible\.json$/i.test(path) && !entry.dir) jsonEntry = entry;
    });
    if (jsonEntry) {
      const text = await jsonEntry.async("string");
      store.replace(JSON.parse(text));
      return { ok: true, mode: "zip-json" };
    }

    // 대체: master 마크다운 파싱
    let mdEntry = null;
    zip.forEach((path, entry) => {
      if (/master.*\.md$/i.test(path) && !entry.dir) mdEntry = entry;
    });
    if (mdEntry) {
      const text = await mdEntry.async("string");
      const parsed = parseMasterMd(text);
      const merged = mergeParsed(store.getState(), parsed);
      store.replace(merged);
      return { ok: true, mode: "zip-md" };
    }
    throw new Error("zip 안에서 story_bible.json 또는 99_Master_DB*.md 를 찾지 못했습니다.");
  }

  if (name.endsWith(".md")) {
    const text = await readFileAsText(file);
    const parsed = parseMasterMd(text);
    const merged = mergeParsed(store.getState(), parsed);
    store.replace(merged);
    return { ok: true, mode: "md-merge" };
  }

  throw new Error("지원하지 않는 파일 형식입니다. .md / .zip / .json 만 가능합니다.");
}
