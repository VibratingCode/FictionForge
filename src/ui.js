/* ================= UI ================= */
const ui = Forge.ui = {};
let side = 'front', selId = null, selIds = [], viewMode = '3d', uvOn = false, torchOn = false, formSeq = 0, clip = null;
let docMeta = { id: null, name: '', savedAt: 0, savedSnap: null };
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const ICON = {
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  eyeOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 3.9M6.6 6.6C3.8 8.4 2 12 2 12s4 7 10 7a9.6 9.6 0 0 0 4.4-1"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  unlock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" opacity=".35"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/></svg>'
};
const FIN_TAG = { foil: 'foil', holo: 'holo', laser: 'laser', uv: 'UV', gloss: 'gloss', blind: 'emboss', window: 'window' };
const findEl = (id) => P.front.find(e => e.id === id) || P.back.find(e => e.id === id);
const selEl = () => selId ? findEl(selId) : null;
const selEls = () => selIds.map(findEl).filter(Boolean);
const sideOf = (id) => P.front.some(e => e.id === id) ? 'front' : P.back.some(e => e.id === id) ? 'back' : null;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2800); }
ui.toast = toast;

/* ---------- history & autosave ---------- */
const hist = { stack: [], i: -1 };
const snapState = () => JSON.stringify({ card: P.card, scene: P.scene, front: P.front, back: P.back });
function pushHist() { const s = snapState(); if (hist.stack[hist.i] === s) return; hist.stack.splice(hist.i + 1); hist.stack.push(s); if (hist.stack.length > 120) hist.stack.shift(); hist.i = hist.stack.length - 1; updUndo(); autosave(); updStatus(); }
let commitT = null; function commit(ms) { clearTimeout(commitT); commitT = setTimeout(pushHist, ms ?? 250); }
function undo() { if (hist.i <= 0) return; hist.i--; restoreState(hist.stack[hist.i]); }
function redo() { if (hist.i >= hist.stack.length - 1) return; hist.i++; restoreState(hist.stack[hist.i]); }
function restoreState(s) { const o = JSON.parse(s); P.card = o.card; P.scene = o.scene; P.front = o.front; P.back = o.back; setSel(selIds.filter(id => sideOf(id))); refreshAll(); updUndo(); autosave(); updStatus(); }
function updUndo() { $('#undo').disabled = hist.i <= 0; $('#redo').disabled = hist.i >= hist.stack.length - 1; }
let saveT = null, draftT = null;
function autosave() {
  clearTimeout(saveT); saveT = setTimeout(() => { const pack = { P, meta: { id: docMeta.id, name: docMeta.name, savedSnap: docMeta.savedSnap }, ts: Date.now() }; try { localStorage.setItem(saveKey(), JSON.stringify(pack)); localStorage.setItem('idforge.mode', appMode); } catch (e) { try { localStorage.setItem('idforge.v2', JSON.stringify({ ...pack, P: { ...P, assets: {} } })); } catch (e2) { } } }, 1000);
  clearTimeout(draftT); draftT = setTimeout(() => Lib.saveDraft(), 4000);
}
let appMode = 'card';
const MODES = {
  card: { key: 'idforge.v2', tpl: 'aurelian', noun: 'card', tab: 'Card', sub: 'a studio for fictional identity cards', hello: 'ID card designer' },
  logo: { key: 'idforge.logo', tpl: 'lg_lion', noun: 'emblem', tab: 'Emblem', sub: 'a studio for fictional faction emblems', hello: 'Faction emblem maker' },
  poster: { key: 'idforge.poster', tpl: 'ps_propaganda', noun: 'poster', tab: 'Poster', sub: 'a studio for fictional posters and signs', hello: 'Poster and sign maker' },
};
const modeOfFmt = v => v.logo ? 'logo' : v.poster ? 'poster' : 'card';
const saveKey = (m = appMode) => (MODES[m] || MODES.card).key;
function loadSaved() {
  try { const sm = localStorage.getItem('idforge.mode'); appMode = MODES[sm] ? sm : 'card'; const s = localStorage.getItem(saveKey()); if (!s) return 0; const o = JSON.parse(s); if (!o || !o.P || !o.P.card) return 0; P = normalize(o.P); if (o.meta) docMeta = { id: o.meta.id || null, name: o.meta.name || '', savedAt: 0, savedSnap: o.meta.savedSnap || null }; return o.ts || 1; } catch (e) { return 0; }
}

/* ---------- storage: account library (db + assets) or this browser (IndexedDB) ---------- */
const Lib = { mode: 'pending', db: null, uid: null, assets: null, idb: null, chain: Promise.resolve(), localTs: 0 };
function idbOpen() { return new Promise((res, rej) => { if (!window.indexedDB) return rej(new Error('IndexedDB unavailable')); const r = indexedDB.open('idforge', 1); r.onupgradeneeded = () => r.result.createObjectStore('designs', { keyPath: 'id' }); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); }
function idbRun(mode, fn) { return new Promise((res, rej) => { try { const tx = Lib.idb.transaction('designs', mode), rq = fn(tx.objectStore('designs')); tx.oncomplete = () => res(rq ? rq.result : undefined); tx.onerror = () => rej(tx.error); } catch (e) { rej(e); } }); }
Lib.init = async function () {
  try {
    const cl = window.claude;
    if (cl && cl.use) {
      const [db, user] = await Promise.all([cl.use('db'), cl.use('user')]);
      const uid = user ? await user.id() : null;
      if (db && uid) { Lib.db = db; Lib.uid = uid; Lib.mode = 'cloud'; try { Lib.assets = await cl.use('assets'); } catch (e) { Lib.assets = null; } }
    }
  } catch (e) { }
  if (Lib.mode !== 'cloud') { try { Lib.idb = await idbOpen(); Lib.mode = 'local'; } catch (e) { Lib.mode = 'none'; } }
  updStatus(); Lib.restoreDraft(); userPresets = null; if (presetsOpen() && presetCat === 'My presets') renderPresetGrid();
};
Lib.col = () => Lib.db.collection('data/users/' + Lib.uid);
Lib.list = async function () {
  if (Lib.mode === 'cloud') { const snap = await Lib.col().get(); return snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(r => r.kind === 'design').sort((a, b) => (b.updated || 0) - (a.updated || 0)); }
  if (Lib.mode === 'local') { const all = await idbRun('readonly', st => st.getAll()); return (all || []).filter(r => r.kind === 'design').sort((a, b) => (b.updated || 0) - (a.updated || 0)); }
  return [];
};
Lib.get = async function (id) { if (Lib.mode === 'cloud') { const d = await Lib.col().doc(id).get(); return d.exists ? { id: d.id, ...d.data() } : null; } if (Lib.mode === 'local') return (await idbRun('readonly', st => st.get(id))) || null; return null; };
Lib.put = function (rec) { const run = () => Lib.mode === 'cloud' ? Lib.col().doc(rec.id).set(rec) : Lib.mode === 'local' ? idbRun('readwrite', st => st.put(rec)) : Promise.reject(new Error('Saving is not available here')); Lib.chain = Lib.chain.catch(() => { }).then(run); return Lib.chain; };
Lib.del = function (id) { const run = () => Lib.mode === 'cloud' ? Lib.col().doc(id).delete() : idbRun('readwrite', st => st.delete(id)); Lib.chain = Lib.chain.catch(() => { }).then(run); return Lib.chain; };
function dataURLtoBlob(u) { const [h, b] = u.split(','), mime = (h.match(/data:([^;]+)/) || [])[1] || 'image/png', bin = atob(b), arr = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i); return new Blob([arr], { type: mime }); }
async function packAssets(proj) {
  const used = new Set(); for (const s of ['front', 'back']) for (const e of proj[s]) if (e.asset) used.add(e.asset);
  const out = {};
  for (const aid of used) {
    let src = P.assets[aid]; if (!src) continue;
    if (Lib.mode === 'cloud' && src.startsWith('data:') && Lib.assets) { try { const r = await Lib.assets.upload(dataURLtoBlob(src)); src = '/_blob/' + r.id; P.assets[aid] = src; } catch (e) { console.warn('asset upload failed', e); } }
    out[aid] = src;
  }
  return out;
}
function thumbURL() { try { const c = renderThumb({ card: P.card, scene: P.scene, front: P.front, back: P.back, assets: P.assets }, 300); return c.toDataURL('image/jpeg', .8); } catch (e) { return ''; } }
async function buildRecord(kind, id, name) {
  const project = JSON.parse(snapState()); const assets = await packAssets(project);
  const rec = { id, kind, name, updated: Date.now(), v: 2, thumb: kind === 'design' ? thumbURL() : '', project, assets, designId: docMeta.id || null };
  if (Lib.mode === 'cloud' && JSON.stringify(rec).length > 250000) { rec.thumb = ''; if (JSON.stringify(rec).length > 250000) throw Object.assign(new Error('This card is too large for your library (embedded images). Use Export file instead.'), { code: 'too_big' }); }
  return rec;
}
Lib.saveDraft = async function () { if (Lib.mode !== 'cloud' && Lib.mode !== 'local') return; try { const rec = await buildRecord('draft', '_draft', docMeta.name || ''); await Lib.put(rec); } catch (e) { } };
Lib.restoreDraft = async function () {
  if (Lib.mode !== 'cloud' && Lib.mode !== 'local') return;
  try { const d = await Lib.get('_draft'); if (!d || !d.project || !(d.updated > Lib.localTs + 2000) || hist.i > 0) return; P = normalize({ ...d.project, assets: d.assets || {} }); docMeta = { id: d.designId || null, name: d.name || '', savedAt: 0, savedSnap: null }; imgs.clear(); setSel([]); hist.stack = [snapState()]; hist.i = 0; refreshAll(); updUndo(); updStatus(); toast('Picked up where you left off.'); } catch (e) { }
};
function isDirty() { return docMeta.savedSnap !== snapState(); }
function updStatus(state) {
  const n = $('#docName'), s = $('#docState'); if (!n) return;
  n.textContent = docMeta.name || 'Untitled ' + MODES[appMode].noun;
  const where = Lib.mode === 'cloud' ? 'your account' : Lib.mode === 'local' ? 'this browser' : Lib.mode === 'pending' ? '' : 'files only';
  s.textContent = state || (Lib.mode === 'pending' ? 'Connecting storage…' : !docMeta.id ? 'Not saved yet' : isDirty() ? 'Unsaved changes' : 'Saved to ' + where);
  $('#status').title = Lib.mode === 'cloud' ? 'Saved privately to your account library' : Lib.mode === 'local' ? 'Saved in this browser only' : Lib.mode === 'none' ? 'Library storage is not available in this view; use Export file' : '';
  $('#status').classList.toggle('dirty', !!docMeta.id && isDirty());
}
function suggestName() { const t = P.front.find(e => e.type === 'text' && e.text && e.text.length > 2); return t ? String(t.text).split('\n')[0].slice(0, 40) : 'My card'; }
async function saveDesign(asNew) {
  if (Lib.mode === 'none' || Lib.mode === 'pending') { if (Lib.mode === 'pending') return toast('Storage is still connecting; try again in a moment.'); toast('Library storage isn’t available here, so the project is saved as a file.'); return saveFile(`${slug()}.idforge.json`, JSON.stringify({ app: 'ID Forge', v: 2, ...P })); }
  if (!docMeta.id || asNew) return askName(asNew ? (docMeta.name ? docMeta.name + ' copy' : suggestName()) : suggestName(), asNew ? 'Save as a new card' : 'Save to your library', (name) => doSave(name, uid()));
  return doSave(docMeta.name || suggestName(), docMeta.id);
}
async function doSave(name, id) {
  updStatus('Saving…');
  try { const rec = await buildRecord('design', id, name); await Lib.put(rec); docMeta = { id, name, savedAt: rec.updated, savedSnap: snapState() }; updStatus(); autosave(); toast(`Saved “${name}”`); return true; }
  catch (e) { updStatus(); toast(e.code === 'too_big' ? e.message : e.code === 'quota_exceeded' ? 'Your library is full. Delete a few cards and try again.' : 'Couldn’t save: ' + (e.message || e.code || 'unknown error')); return false; }
}
function askName(def, title, cb, desc) {
  showModal(`<h2>${esc(title)}</h2><p>${esc(desc || (Lib.mode === 'cloud' ? 'Cards are saved privately to your account and follow you to other devices.' : 'Cards are saved in this browser.'))}</p><div class="row"><label for="nameIn">Name</label><input type="text" id="nameIn" maxlength="80"></div><div class="mrow"><button class="btn" data-x="close">Cancel</button><button class="btn acc" data-x="ok">Save</button></div>`, (a) => { if (a === 'close') closeModal(); if (a === 'ok') { const v = $('#nameIn').value.trim() || def; closeModal(); cb(v); } });
  const i = $('#nameIn'); i.value = def; setTimeout(() => { i.focus(); i.select(); }, 30); i.onkeydown = (e) => { if (e.key === 'Enter') { const v = i.value.trim() || def; closeModal(); cb(v); } };
}
function loadProject(o, meta, msg) { const lm = (o && o.card && o.card.mode) || 'card'; if (lm !== appMode) setModeUI(lm); P = normalize(o); imgs.clear(); setSel([]); side = 'front'; docMeta = meta || { id: null, name: '', savedAt: 0, savedSnap: null }; refreshAll(); pushHist(); updStatus(); if (msg) toast(msg); }
function openLibrary() {
  const where = Lib.mode === 'cloud' ? 'Saved privately to your account, so they follow you to other devices.' : Lib.mode === 'local' ? 'Saved in this browser. Export a file to move a card elsewhere.' : Lib.mode === 'pending' ? 'Connecting to storage…' : 'Library storage isn’t available in this view. Export and import files instead.';
  showModal(`<h2>Your cards</h2><p>${where}</p><div class="libbar"><button class="btn acc" data-x="save">Save</button><button class="btn" data-x="saveas">Save as new…</button><button class="btn" data-x="new">New from template…</button><button class="btn" data-x="import">Import file…</button><button class="btn" data-x="export">Export file</button></div><div class="libgrid" id="libGrid"><div class="empty">Loading…</div></div>`, async (a, btn) => {
    const card = btn.closest('[data-id]'), id = card && card.dataset.id;
    if (a === 'save') { await saveDesign(false); refreshLib(); }
    if (a === 'saveas') saveDesign(true);
    if (a === 'new') openGallery();
    if (a === 'import') importFile();
    if (a === 'export') saveFile(`${slug()}.idforge.json`, JSON.stringify({ app: 'ID Forge', v: 2, ...P }));
    if (a === 'open' && id) { const r = await Lib.get(id); if (!r) return toast('That card couldn’t be found.'); closeModal(); loadProject({ ...r.project, assets: r.assets || {} }, { id: r.id, name: r.name, savedAt: r.updated, savedSnap: null }, `Opened “${r.name}”. Undo returns to your previous card.`); docMeta.savedSnap = snapState(); updStatus(); }
    if (a === 'dup' && id) { const r = await Lib.get(id); if (!r) return; const c = { ...r, id: uid(), name: r.name + ' copy', updated: Date.now() }; try { await Lib.put(c); toast('Duplicated'); refreshLib(); } catch (e) { toast('Couldn’t duplicate: ' + (e.message || e.code)); } }
    if (a === 'ren' && id) { const nm = card.querySelector('.ln b'), old = nm.textContent, inp = document.createElement('input'); inp.type = 'text'; inp.value = old; inp.className = 'renin'; nm.replaceWith(inp); inp.focus(); inp.select(); const done = async (ok) => { if (inp._d) return; inp._d = 1; const v = inp.value.trim(); if (ok && v && v !== old) { const r = await Lib.get(id); if (r) { r.name = v; r.updated = Date.now(); try { await Lib.put(r); if (docMeta.id === id) { docMeta.name = v; updStatus(); } } catch (e) { toast('Couldn’t rename.'); } } } refreshLib(); }; inp.onkeydown = (e) => { if (e.key === 'Enter') done(true); if (e.key === 'Escape') done(false); }; inp.onblur = () => done(true); }
    if (a === 'del' && id) { if (!btn.classList.contains('confirm')) { btn.classList.add('confirm'); btn.textContent = 'Confirm delete'; setTimeout(() => { if (btn.isConnected) { btn.classList.remove('confirm'); btn.textContent = 'Delete'; } }, 3500); return; } try { await Lib.del(id); if (docMeta.id === id) { docMeta.id = null; updStatus(); } toast('Deleted'); refreshLib(); } catch (e) { toast('Couldn’t delete.'); } }
    if (a === 'close') closeModal();
  });
  refreshLib();
}
async function refreshLib() {
  const g = $('#libGrid'); if (!g) return;
  if (Lib.mode === 'none' || Lib.mode === 'pending') { g.innerHTML = `<div class="empty">${Lib.mode === 'pending' ? 'Still connecting… reopen this in a moment.' : 'Use <b>Export file</b> to save this card, and <b>Import file</b> to open one.'}</div>`; return; }
  try {
    const list = (await Lib.list()).filter(r => ((r.project && r.project.card && r.project.card.mode) || 'card') === appMode); if (!$('#libGrid')) return;
    g.innerHTML = list.length ? list.map(r => `<div class="libcard${r.id === docMeta.id ? ' cur' : ''}" data-id="${esc(r.id)}">${r.thumb ? `<img src="${esc(r.thumb)}" alt="">` : '<div class="nothumb"></div>'}<div class="ln"><b>${esc(r.name || 'Untitled')}</b><small>${new Date(r.updated || 0).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</small></div><div class="la"><button class="btn" data-x="open">Open</button><button class="btn" data-x="dup">Duplicate</button><button class="btn" data-x="ren">Rename</button><button class="btn" data-x="del">Delete</button></div></div>`).join('') : '<div class="empty">No saved cards yet. Press <b>Save</b> to keep this one.</div>';
  } catch (e) { g.innerHTML = `<div class="empty">The library couldn’t be read right now (${esc(e.message || e.code || 'error')}).</div>`; }
}
function importFile() { const f = $('#fileProj'); f.value = ''; f.onchange = () => { const file = f.files && f.files[0]; if (file) readProjectFile(file); }; f.click(); }
function readProjectFile(file) { file.text().then(t => { try { const o = JSON.parse(t); if (!o.card) throw new Error('not a project'); closeModal(); loadProject(o, { id: null, name: (file.name || '').replace(/\.idforge\.json$|\.json$/i, ''), savedAt: 0, savedSnap: null }, 'Project opened. Save it to add it to your library.'); } catch (e) { toast('That file isn’t an ID Forge project.'); } }); }

/* ---------- template gallery ---------- */
const thumbCache = new Map();
function openGallery() {
  const TL = TEMPLATES.filter(t => (t.mode || 'card') === appMode), noun = MODES[appMode].noun;
  showModal(`<h2>Start a new ${noun}</h2><p>${TL.length} fictional templates. Pick one; Undo brings your current ${noun} back.</p><div class="tgrid">${TL.map(t => { const [a, b] = t.name.split(' · '); return `<button class="tcard" data-x="tpl" data-id="${t.id}"><span class="tth" data-th="${t.id}"></span><b>${esc(a)}</b><small>${esc(b || '')}</small></button>`; }).join('')}</div><div class="mrow"><button class="btn" data-x="close">Close</button></div>`, (a, btn) => {
    if (a === 'close') closeModal();
    if (a === 'tpl') { const id = btn.dataset.id, t = TEMPLATES.find(x => x.id === id); closeModal(); applyTemplate(id); imgs.clear(); docMeta = { id: null, name: '', savedAt: 0, savedSnap: null }; refreshAll(); pushHist(); updStatus(); if (P.scene.pose === 'lanyard' || P.scene.pose === 'stand') setTimeout(() => view && view.camPreset('hero'), 60); toast(`Loaded ${t.name.split(' ·')[0]}. Undo brings your previous card back.`); }
  });
  const slots = $$('[data-th]'); let i = 0;
  const step = () => { if (!$('#modal') || $('#modal').hidden || i >= slots.length) return; const s = slots[i++]; if (!s.isConnected) return; const id = s.dataset.th; let c = thumbCache.get(id); if (!c) { const t = TEMPLATES.find(x => x.id === id); c = renderThumb(t.build(), 300); thumbCache.set(id, c); } const cl = document.createElement('canvas'); cl.width = c.width; cl.height = c.height; cl.getContext('2d').drawImage(c, 0, 0); s.appendChild(cl); requestAnimationFrame(step); };
  requestAnimationFrame(step);
}

/* ---------- change plumbing ---------- */
function elChanged(live, sides) { const el = selEl(); invalidate(sides || (live && !(el && el.finish === 'window') ? [sideOf(selId) || side] : ['front', 'back']), live); if (!live) { commit(); renderLayers(); } }
ui.changed = (final) => { elChanged(!final); if (final) renderInspector(); };
function liveEdit() { invalidate([sideOf(selId) || side], true); syncInputs(); ui.drawFlat(); }
function fmtOpts() { return Object.entries(FORMATS).filter(([k, v]) => k === 'custom' || modeOfFmt(v) === appMode).map(([k, v]) => [k, v.label]); }
function subOpts() { return (appMode === 'poster' ? POSTER_SUBS : Object.keys(SUBS).filter(k => !SUBS[k].poster)).map(k => [k, SUBS[k].label]); }
const ADD_ORDER = { card: ['text', 'field', 'photo', 'shape', 'rect', 'ellipse', 'line', 'frame', 'guilloche', 'pattern', 'seal', 'holo', 'flag', 'micro', 'qr', 'barcode', 'matrix', 'mrz', 'sign', 'chip', 'stamp'], poster: ['text', 'safety', 'picto', 'stripes', 'rays', 'nfpa', 'glyph', 'photo', 'rect', 'ellipse', 'shape', 'line', 'frame', 'pattern', 'halftone', 'stamp', 'seal', 'flag', 'qr', 'barcode'] };
function renderAddGrid() { const grid = $('#addGrid'); if (!grid) return; const order = (ADD_ORDER[appMode] || ADD_ORDER.card).filter(t => T[t]); grid.innerHTML = order.map(t => `<button type="button" data-t="${t}" title="Add ${T[t].label.toLowerCase()}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${T[t].icon}"/></svg>${T[t].label}</button>`).join(''); }
/* sizes that grow with the canvas when a poster changes format or takes a card-sized component */
const SIZE_KEYS = ['w', 'h', 'size', 'strokeW', 'lw', 'outlineW', 'lineW', 'shadow', 'glow', 'radius', 'dash', 'cell', 'tsize', 'band', 'bw'];
const RANGE_BASE = new Map(), POSTER_NATIVE = new Set(['safety', 'picto', 'stripes', 'rays', 'nfpa']);
function setRangeScale(f) {   // size sliders reach ten times further on posters
  for (const t of Object.values(T)) { if (POSTER_NATIVE.has(t.type)) continue; for (const p of t.props || []) { if (p[2] !== 'range' || !p[3] || !SIZE_KEYS.includes(p[0]) || (p[0] === 'lw' && (t.type === 'sigil' || t.type === 'pattern'))) continue; if (!RANGE_BASE.has(p)) RANGE_BASE.set(p, p[3].max); p[3].max = RANGE_BASE.get(p) * f; } }
  const r = CARD_P.find(p => p[0] === 'r'); if (r) r[3].max = f > 1 ? 60 : 15;
}
function scaleEl(e, s) { for (const key of SIZE_KEYS) { if (key === 'lw' && (e.type === 'sigil' || e.type === 'pattern')) continue; if (typeof e[key] === 'number') e[key] *= s; } }
function setModeUI(m) {
  if (!MODES[m]) m = 'card'; appMode = m; document.body.dataset.mode = m;
  $$('#modeSeg button').forEach(b => b.classList.toggle('on', b.dataset.m === m));
  const sub = $('.brand > span:last-child'); if (sub) sub.textContent = MODES[m].sub;
  const f = CARD_P.find(p => p[0] === 'fmt'); if (f) f[3] = fmtOpts();
  const sr = CARD_P.find(p => p[0] === 'sub'); if (sr) sr[3] = subOpts();
  for (const key of ['w', 'h']) { const r = CARD_P.find(p => p[0] === key); if (r) r[3].max = m === 'poster' ? 1500 : 220; }
  const rs = CARD_P.find(p => p[0] === 'res'); if (rs) rs[1] = m === 'poster' ? 'Texture size (long edge)' : 'Texture width';
  const tb = $('#tabs [data-t="card"]'); if (tb) tb.textContent = MODES[m].tab;
  renderAddGrid(); setRangeScale(m === 'poster' ? 10 : 1);
  presetThumbs.clear(); if (presetsOpen()) { renderPresetCats(); renderPresetGrid(); }
  try { localStorage.setItem('idforge.mode', m); } catch (e) { }
}
function switchMode(m) {
  if (m === appMode) return;
  try { localStorage.setItem(saveKey(), JSON.stringify({ P, meta: { id: docMeta.id, name: docMeta.name, savedSnap: docMeta.savedSnap }, ts: Date.now() })); } catch (e) { }
  let o = null; try { o = JSON.parse(localStorage.getItem(saveKey(m)) || 'null'); } catch (e) { }
  setModeUI(m); imgs.clear(); setSel([]); side = 'front';
  if (o && o.P && o.P.card) { P = normalize(o.P); P.card.mode = m; docMeta = { id: o.meta?.id || null, name: o.meta?.name || '', savedAt: 0, savedSnap: o.meta?.savedSnap || null }; }
  else { applyTemplate(MODES[m].tpl); docMeta = { id: null, name: '', savedAt: 0, savedSnap: null }; }
  refreshAll(); pushHist(); updStatus(); if (view) setTimeout(() => view.camPreset(P.scene.pose === 'stand' || P.scene.pose === 'lanyard' ? 'hero' : 'front'), 60);
  toast(`${MODES[m].hello} · your other designs are kept for when you switch back`);
}
function refreshAll() { renderSideSeg(); renderLayers(); renderInspector(); renderCardPane(); renderScenePane(); if (view) { view.setCard(); view.setScene(); view.flipTo(side, true); } invalidate(); flatLayout(); }
function renderSideSeg() { $$('#sideSeg button').forEach(b => b.classList.toggle('on', b.dataset.s === side)); }
function setSide(sd, flip) { if (sd === side) { if (flip && view) view.flipTo(sd); return; } side = sd; renderSideSeg(); renderLayers(); ui.drawFlat(); ui.hud(); if (flip && view) view.flipTo(sd); if (presetsOpen()) renderPresetGrid(); }
Forge.viewSide = (sd) => setSide(sd, false);
function setSel(ids) { selIds = ids.filter((v, i, a) => a.indexOf(v) === i); selId = selIds.length ? selIds[selIds.length - 1] : null; }
function select(id, additive) {
  if (additive && id) { const sd = sideOf(id); if (selIds.length && sideOf(selIds[0]) !== sd) setSel([id]); else setSel(selIds.includes(id) ? selIds.filter(x => x !== id) : [...selIds, id]); }
  else setSel(id ? [id] : []);
  const sd = selId ? sideOf(selId) : null; if (sd && sd !== side) setSide(sd, true);
  renderLayers(); renderInspector(); if (selId) showTab('el'); ui.drawFlat();
}

/* ---------- form builder ---------- */
function normHex(c) { const [r, g, b] = hex2rgb(c); return rgb2hex(r, g, b); }
function fmtNum(v, step) { const d = step && step < 1 ? Math.min(3, String(step).split('.')[1]?.length || 2) : 0; return (+v || 0).toFixed(d); }
function buildForm(host, obj, props, onChange) {
  for (const p of props) {
    const [key, label, kind, opt, show] = p;
    if (show && !show(obj)) continue;
    if (key === '§') { const d = document.createElement('div'); d.className = 'sec'; d.textContent = label; host.appendChild(d); continue; }
    const row = document.createElement('div'); row.className = 'row'; row.dataset.key = key;
    const id = 'f' + (++formSeq) + '-' + key; const lab = document.createElement('label'); lab.textContent = label; lab.htmlFor = id; row.appendChild(lab);
    const fire = (v, fin) => onChange(key, v, fin);
    const mk = (t) => { const i = document.createElement('input'); i.type = t; return i; };
    let ctl;
    switch (kind) {
      case 'text': case 'area': { ctl = kind === 'text' ? mk('text') : document.createElement('textarea'); ctl.value = obj[key] ?? ''; if (kind === 'area') ctl.rows = Math.min(7, String(obj[key] || '').split('\n').length + 1); ctl.oninput = () => fire(ctl.value, false); ctl.onchange = () => fire(ctl.value, true); ctl.id = id; break; }
      case 'num': { ctl = mk('number'); if (opt) { ctl.min = opt.min ?? ''; ctl.max = opt.max ?? ''; ctl.step = opt.step; } ctl.step = ctl.step || .1; ctl.value = (+obj[key] || 0).toFixed(2); ctl.id = id; ctl.oninput = () => { const v = parseFloat(ctl.value); if (!isNaN(v)) fire(v, false); }; ctl.onchange = () => { const v = parseFloat(ctl.value); if (!isNaN(v)) fire(v, true); }; break; }
      case 'range': { ctl = document.createElement('div'); ctl.className = 'rng'; const r = mk('range'), n = mk('number'); r.id = id; for (const e of [r, n]) { e.min = opt.min; e.max = opt.max; e.step = opt.step; } r.value = n.value = fmtNum(obj[key], opt.step); r.oninput = () => { n.value = r.value; fire(parseFloat(r.value), false); }; r.onchange = () => fire(parseFloat(r.value), true); n.oninput = () => { const v = parseFloat(n.value); if (!isNaN(v)) { r.value = v; fire(v, false); } }; n.onchange = () => { const v = parseFloat(n.value); if (!isNaN(v)) fire(v, true); }; n.setAttribute('aria-label', label); ctl.append(r, n); break; }
      case 'color': { ctl = mk('color'); ctl.value = normHex(obj[key]); ctl.id = id; ctl.oninput = () => fire(ctl.value, false); ctl.onchange = () => fire(ctl.value, true); break; }
      case 'foil': { ctl = document.createElement('div'); ctl.className = 'colrow'; const c = mk('color'); c.id = id; c.value = normHex(obj[key]); c.oninput = () => fire(c.value, false); c.onchange = () => fire(c.value, true); const sw = document.createElement('div'); sw.className = 'sw'; for (const [hex, nm] of FOILS) { const b = document.createElement('button'); b.type = 'button'; b.title = nm; b.setAttribute('aria-label', nm + ' foil'); b.style.background = `linear-gradient(135deg, ${shade(hex, .35)}, ${hex} 55%, ${shade(hex, -.3)})`; b.onclick = () => { c.value = hex; fire(hex, true); }; sw.appendChild(b); } ctl.append(c, sw); break; }
      case 'select': case 'font': { ctl = document.createElement('select'); ctl.id = id; const list = kind === 'font' ? Object.keys(FONTS).map(f => [f, f]) : opt; for (const [v, l] of list) { const o = document.createElement('option'); o.value = v; o.textContent = l; if (kind === 'font') o.style.fontFamily = fstack(v); ctl.appendChild(o); } ctl.value = obj[key]; if (kind === 'font') ctl.style.fontFamily = fstack(obj[key]); ctl.onchange = () => { const v = typeof list[0][0] === 'number' ? +ctl.value : ctl.value; fire(v, true); }; break; }
      case 'check': { ctl = document.createElement('div'); ctl.className = 'chk'; const c = mk('checkbox'); c.id = id; c.checked = !!obj[key]; c.onchange = () => fire(c.checked, true); ctl.append(c); break; }
      case 'image': { ctl = document.createElement('div'); ctl.className = 'chk'; const b = document.createElement('button'); b.type = 'button'; b.className = 'btn'; b.id = id; b.textContent = obj[key] ? 'Replace image…' : 'Upload image…'; b.onclick = () => pickImage(aid => fire(aid, true)); ctl.append(b); if (obj[key]) { const x = document.createElement('button'); x.type = 'button'; x.className = 'btn'; x.textContent = 'Remove'; x.onclick = () => fire(null, true); ctl.append(x); } break; }
      case 'action': { lab.textContent = ''; ctl = document.createElement('button'); ctl.type = 'button'; ctl.className = 'btn'; ctl.id = id; ctl.textContent = label; ctl.onclick = () => opt(obj); break; }
    }
    row.appendChild(ctl); host.appendChild(row);
  }
}
function syncInputs() {
  const el = selEl(); if (!el) return;
  for (const k of ['x', 'y', 'w', 'h', 'rot', 'size']) { const row = $(`#pane-el .row[data-key="${k}"]`); if (!row) continue; for (const i of row.querySelectorAll('input')) { if (document.activeElement === i) continue; i.value = i.type === 'range' ? el[k] : (+el[k]).toFixed(k === 'rot' ? 1 : 2); } }
}

/* ---------- inspector ---------- */
const FIN_P = [['§', 'Finish'], ['finish', 'Finish', 'select', FINISHES], ['foil', 'Foil colour', 'foil', null, e => e.finish === 'foil'], ['holoPat', 'Holo pattern', 'select', HOLOPATS, e => e.finish === 'holo'], ['holoInt', 'Holo strength', 'range', { min: 0, max: 1, step: .01 }, e => e.finish === 'holo'], ['uvColor', 'Glow colour', 'color', null, e => e.finish === 'uv'], ['relief', 'Relief', 'range', { min: -1, max: 1, step: .01 }]];
const XFORM_P = [['§', 'Placement'], ['x', 'X (mm)', 'num', { step: .1 }], ['y', 'Y (mm)', 'num', { step: .1 }], ['w', 'Width (mm)', 'num', { min: .1, step: .1 }], ['h', 'Height (mm)', 'num', { min: .1, step: .1 }], ['rot', 'Rotation (°)', 'range', { min: -180, max: 180, step: .5 }], ['opacity', 'Opacity', 'range', { min: 0, max: 1, step: .01 }], ['blend', 'Blend', 'select', BLENDS], ['locked', 'Locked on canvas', 'check'], ['visible', 'Visible', 'check']];
const REFORM = new Set(['look', 'ph', 'colorLaser', 'finish', 'strokeW', 'fillOn', 'grad', 'duo', 'border', 'mode', 'kind', 'iris', 'showText', 'asset', 'style', 'bgOn', 'emblem']);
const EXTRA_ACTIONS = {
  mrz: [['mrzgen', 'Rebuild from fields', 'action', () => { applyIdentity(true); }]],
  photo: [['ghost', 'Add ghost copy', 'action', (el) => { const sd = sideOf(el.id), c = { ...JSON.parse(JSON.stringify(el)), id: uid(), name: 'Ghost image', w: el.w * .45, h: el.h * .45, x: Math.min(P.card.w - el.w * .25, el.x + P.card.w * .55), opacity: .3, grayscale: true, finish: 'ink', relief: 0, border: 0 }; P[sd].push(c); select(c.id); elChanged(false, [sd]); toast('Ghost image added'); }]]
};
function renderInspector() {
  const host = $('#pane-el'); host.innerHTML = '';
  if (selIds.length > 1) return renderMulti(host);
  const el = selEl();
  if (!el) {
    host.innerHTML = `<div class="empty"><b>Nothing selected.</b><br>Click an element on the card or in Layers; Shift-click or drag a box in Flat view to select several. On the 3D card, click to select, then drag to slide it across the surface. Double-click to fly in close.<br><br><span class="kbd">Ctrl S</span> save &nbsp; <span class="kbd">Ctrl O</span> library &nbsp; <span class="kbd">?</span> all shortcuts</div>`;
    return;
  }
  const t = T[el.type], head = document.createElement('div'); head.className = 'elhead';
  head.innerHTML = `<strong>${esc(el.name)}</strong><span class="tg" style="color:var(--mute);font-size:11px">${t.label} · ${sideOf(el.id)}</span>`; host.appendChild(head);
  host.appendChild(actsRow(el));
  const sp = document.createElement('button'); sp.type = 'button'; sp.className = 'btn wideb'; sp.textContent = 'Save as preset'; sp.title = 'Keep this element in My presets'; sp.onclick = savePresetFromSel; host.appendChild(sp);
  const fin = el.type === 'holo' ? [['§', 'Finish'], ['relief', 'Relief', 'range', { min: -1, max: 1, step: .01 }]] : el.type === 'chip' ? [['§', 'Finish'], ['foil', 'Metal colour', 'foil'], ['relief', 'Relief', 'range', { min: -1, max: 1, step: .01 }]] : FIN_P;
  buildForm(host, el, [['name', 'Name', 'text'], ['§', t.label], ...t.props, ...(EXTRA_ACTIONS[el.type] || []), ...fin, ...XFORM_P], (k, v, f) => {
    const e = selEl(); if (!e) return; if (k === 'finish') e.relief = FIN_RELIEF[v] ?? 0; if (k === 'look') { e.grayscale = false; e.duo = v === 'duo'; if (v !== 'sepia') e.sepia = 0; } e[k] = v;
    if (k === 'name') { renderLayers(); if (f) head.querySelector('strong').textContent = v; return commit(); }
    if (k === 'locked' || k === 'visible') renderLayers();
    elChanged(!f); if (f && REFORM.has(k)) renderInspector();
  });
}
function actsRow(el) {
  const acts = document.createElement('div'); acts.className = 'acts';
  const A = [['Copy', 'Duplicate (Ctrl D)', () => duplicateSel()], ['Delete', 'Delete (Del)', () => removeSel()], ['Up', 'Bring forward (])', () => reorder(el, 1)], ['Down', 'Send backward ([)', () => reorder(el, -1)], ['↔ Mid', 'Centre on card horizontally', () => alignSel('c')], ['↕ Mid', 'Centre on card vertically', () => alignSel('m')]];
  for (const [l, tt, fn] of A) { const b = document.createElement('button'); b.type = 'button'; b.textContent = l; b.title = tt; b.onclick = fn; acts.appendChild(b); }
  return acts;
}
function renderMulti(host) {
  const els = selEls();
  host.innerHTML = `<div class="elhead"><strong>${els.length} elements</strong><span class="tg" style="color:var(--mute);font-size:11px">${side}</span></div>
  <div class="sec">Align</div><div class="acts al"><button data-al="l" title="Align left edges">Left</button><button data-al="c" title="Align centres horizontally">Centre</button><button data-al="r" title="Align right edges">Right</button><button data-al="t" title="Align top edges">Top</button><button data-al="m" title="Align middles">Middle</button><button data-al="b" title="Align bottom edges">Bottom</button></div>
  <div class="acts al" style="grid-template-columns:1fr 1fr"><button data-al="dh" title="Even horizontal spacing (3+)">Distribute ↔</button><button data-al="dv" title="Even vertical spacing (3+)">Distribute ↕</button></div>
  <div class="sec">Selection</div><div class="acts al" style="grid-template-columns:repeat(3,1fr)"><button data-al="dup">Duplicate</button><button data-al="del">Delete</button><button data-al="copy">Copy</button></div><button type="button" class="btn wideb" data-al="preset">Save as preset</button>
  <div class="row"><label for="mfin">Finish for all</label><select id="mfin"><option value="">Choose…</option>${FINISHES.map(([v, l]) => `<option value="${v}">${l}</option>`).join('')}</select></div>
  <div class="row"><label for="mop">Opacity for all</label><div class="rng"><input type="range" id="mop" min="0" max="1" step=".01" value="1"><span></span></div></div>
  <p class="note">Drag any of them in Flat view to move the group. Arrow keys nudge all, Shift for 2 mm.</p>`;
  host.querySelectorAll('[data-al]').forEach(b => b.onclick = () => { const a = b.dataset.al; if (a === 'preset') savePresetFromSel(); else if (a === 'dup') duplicateSel(); else if (a === 'del') removeSel(); else if (a === 'copy') copySel(); else if (a === 'dh' || a === 'dv') distribute(a === 'dh' ? 'x' : 'y'); else alignSel(a); });
  $('#mfin').onchange = (e) => { const v = e.target.value; if (!v) return; for (const el of selEls()) { if (el.type === 'holo' || el.type === 'chip') continue; el.finish = v; el.relief = FIN_RELIEF[v] ?? 0; } elChanged(false, ['front', 'back']); renderLayers(); };
  $('#mop').oninput = (e) => { for (const el of selEls()) el.opacity = +e.target.value; invalidate([side], true); };
  $('#mop').onchange = () => elChanged(false);
}
function bboxOf(els) { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const e of els) { x0 = Math.min(x0, e.x - e.w / 2); y0 = Math.min(y0, e.y - e.h / 2); x1 = Math.max(x1, e.x + e.w / 2); y1 = Math.max(y1, e.y + e.h / 2); } return { x0, y0, x1, y1 }; }
function alignSel(m) {
  const els = selEls().filter(e => !e.locked); if (!els.length) return; const C = P.card, bb = els.length > 1 ? bboxOf(els) : { x0: 0, y0: 0, x1: C.w, y1: C.h };
  for (const e of els) { if (m === 'l') e.x = bb.x0 + e.w / 2; if (m === 'c') e.x = (bb.x0 + bb.x1) / 2; if (m === 'r') e.x = bb.x1 - e.w / 2; if (m === 't') e.y = bb.y0 + e.h / 2; if (m === 'm') e.y = (bb.y0 + bb.y1) / 2; if (m === 'b') e.y = bb.y1 - e.h / 2; }
  liveEdit(); elChanged(false);
}
function distribute(ax) { const els = selEls().filter(e => !e.locked).sort((a, b) => a[ax] - b[ax]); if (els.length < 3) return toast('Select three or more to distribute.'); const a = els[0][ax], b = els[els.length - 1][ax]; els.forEach((e, i) => e[ax] = a + (b - a) * i / (els.length - 1)); liveEdit(); elChanged(false); }
function duplicateSel() { const els = selEls(); if (!els.length) return; const sd = sideOf(els[0].id), list = P[sd], ids = []; for (const el of els) { const c = { ...JSON.parse(JSON.stringify(el)), id: uid(), name: el.name + (els.length > 1 ? '' : ' copy'), x: el.x + 2, y: el.y + 2 }; list.splice(list.indexOf(el) + 1, 0, c); ids.push(c.id); } setSel(ids); renderLayers(); renderInspector(); elChanged(false, [sd]); }
function removeSel() { const els = selEls(); if (!els.length) return; for (const el of els) { const sd = sideOf(el.id); P[sd] = P[sd].filter(e => e !== el); } setSel([]); renderInspector(); elChanged(false, ['front', 'back']); renderLayers(); ui.drawFlat(); }
function copySel() { const els = selEls(); if (!els.length) return; clip = JSON.parse(JSON.stringify(els)); try { localStorage.setItem('idforge.clip', JSON.stringify(clip)); } catch (e) { } toast(`Copied ${els.length} element${els.length > 1 ? 's' : ''}`); }
function pasteClip() { let c = clip; if (!c) { try { c = JSON.parse(localStorage.getItem('idforge.clip') || 'null'); } catch (e) { } } if (!c || !c.length) return toast('Nothing to paste yet.'); const ids = []; for (const o of c) { const el = normEl({ ...o, id: uid(), x: o.x + 1.5, y: o.y + 1.5 }); if (!el) continue; P[side].push(el); ids.push(el.id); } clip = c.map(o => ({ ...o, x: o.x + 1.5, y: o.y + 1.5 })); setSel(ids); renderLayers(); renderInspector(); elChanged(false, [side]); toast(`Pasted onto the ${side}`); }
function reorder(el, dir) { const sd = sideOf(el.id), list = P[sd], i = list.indexOf(el), j = clamp(i + dir, 0, list.length - 1); if (i === j) return; list.splice(i, 1); list.splice(j, 0, el); elChanged(false, [sd]); }
function addEl(type) {
  const C = P.card, el = makeEl(type, {});
  if (appMode === 'poster') {
    const q = Math.min(C.w, C.h) / 54;
    if (['rays', 'pattern', 'halftone'].includes(type)) { el.w = C.w; el.h = C.h; if (type === 'halftone') el.cell *= q; }
    else if (type === 'frame') { scaleEl(el, q); el.w = C.w - 8 * q; el.h = C.h - 8 * q; }
    else if (type === 'safety') { el.w = C.w * .9; el.h = Math.min(C.w * .16, C.h * .2); }
    else if (type === 'stripes') { el.w = C.w * .9; el.h = Math.min(C.w, C.h) * .07; el.band = el.h * .55; }
    else { scaleEl(el, q); const s = Math.min(1, C.w * .8 / el.w, C.h * .8 / el.h); if (s < 1) scaleEl(el, s); }
  }
  else if (type === 'pattern' || (type === 'guilloche' && el.mode === 'field')) { el.w = C.w; el.h = C.h; }
  else if (type === 'frame') { el.w = C.w - 6; el.h = C.h - 6; }
  else { const s = Math.min(1, C.w * .8 / el.w, C.h * .8 / el.h); el.w *= s; el.h *= s; if (el.size) el.size *= Math.max(.5, s); }
  el.x = C.w / 2; el.y = C.h / 2; if (appMode === 'poster' && ['rays', 'pattern', 'halftone'].includes(type)) P[side].unshift(el); else P[side].push(el); select(el.id); elChanged(false, [side]);
  if (type === 'photo') setTimeout(() => pickImage(aid => { el.asset = aid; renderInspector(); elChanged(false, [side]); }), 50);
}

/* ---------- user presets ---------- */
let userPresets = null;
async function loadUserPresets() {
  try {
    if (Lib.mode === 'cloud') { const snap = await Lib.col().get(); userPresets = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(r => r.kind === 'preset'); }
    else if (Lib.mode === 'local') { const all = await idbRun('readonly', st => st.getAll()); userPresets = (all || []).filter(r => r.kind === 'preset'); }
    else userPresets = JSON.parse(localStorage.getItem('idforge.presets') || '[]');
  } catch (e) { userPresets = userPresets || []; }
  userPresets.sort((a, b) => (b.updated || 0) - (a.updated || 0)); return userPresets;
}
async function storeUserPreset(rec) { if (Lib.mode === 'cloud' || Lib.mode === 'local') return Lib.put(rec); const list = JSON.parse(localStorage.getItem('idforge.presets') || '[]').filter(r => r.id !== rec.id); list.unshift(rec); localStorage.setItem('idforge.presets', JSON.stringify(list)); }
async function dropUserPreset(id) { if (Lib.mode === 'cloud' || Lib.mode === 'local') return Lib.del(id); localStorage.setItem('idforge.presets', JSON.stringify(JSON.parse(localStorage.getItem('idforge.presets') || '[]').filter(r => r.id !== id))); }
function savePresetFromSel() {
  const els = selEls(); if (!els.length) return toast('Select one or more elements first.');
  askName(els.length === 1 ? els[0].name : `${els.length}-piece preset`, 'Save as a preset', async (name) => {
    const clean = JSON.parse(JSON.stringify(els)).map(e => { delete e.id; e.locked = false; return e; });
    const rec = { id: 'p' + uid(), kind: 'preset', name, updated: Date.now(), card: { w: P.card.w, h: P.card.h }, els: clean, assets: {}, thumb: '' };
    try { rec.thumb = thumbEls(els, 220, 132).toDataURL('image/jpeg', .85); } catch (e) { }
    try { rec.assets = await packAssets({ front: clean, back: [] }); } catch (e) { }
    if (JSON.stringify(rec).length > 250000) rec.thumb = '';
    try { await storeUserPreset(rec); userPresets = null; toast(`Saved “${name}” to My presets`); if (presetsOpen() && presetCat === 'My presets') renderPresetGrid(); }
    catch (e) { toast(e.code === 'quota_exceeded' ? 'Your library is full. Delete some presets or cards first.' : 'Couldn’t save the preset: ' + (e.message || e.code || 'unknown error')); }
  }, 'A preset keeps the selected elements with their finishes and positions, ready to drop onto any card. It’s stored with your library.');
}

/* ---------- presets panel ---------- */
const presetThumbs = new Map(); let presetCat = 'Security';
const presetsOpen = () => !$('#leftPresets').hidden;
const POSTER_SHARED = ['Seals & stamps', 'Office stamps', 'Genre stamps', 'Stickers & labels', 'Ribbons & insignia', 'Text styles', 'Decoration', 'Geometric marks', 'Emblems', 'Neon emblems', 'Emblem parts', 'Sigils'];
const modeOK = c => { const cm = c.mode || 'card'; if (appMode === 'logo') return cm === 'logo' || LOGO_SHARED.includes(c.cat); if (appMode === 'poster') return cm === 'poster' || (c.cat || '').startsWith('Icons · ') || POSTER_SHARED.includes(c.cat); return cm === 'card'; };
function renderPresetCats() { const have = new Set(COMPONENTS.filter(modeOK).map(c => c.cat)), cats = ['My presets', ...(appMode === 'logo' ? [...LOGO_CATS, ...LOGO_SHARED].filter(c => have.has(c)) : appMode === 'poster' ? [...POSTER_CATS, ...LOGO_CATS.filter(c => c.startsWith('Icons · ')), ...POSTER_SHARED].filter(c => have.has(c)) : [...have])]; if (!cats.includes(presetCat)) presetCat = cats[1]; $('#presetCats').innerHTML = cats.map(c => `<button class="${c === presetCat ? 'on' : ''}" data-c="${esc(c)}">${esc(c)}</button>`).join(''); }
async function renderPresetGrid() {
  if (presetCat === 'My presets') {
    const g = $('#presetGrid'); g.innerHTML = '<div class="empty" style="grid-column:1/-1">Loading your presets…</div>';
    const list = userPresets || await loadUserPresets(); if (presetCat !== 'My presets') return;
    g.innerHTML = (list.length ? list.map(r => `<div class="pcard user" role="button" tabindex="0" data-u="${esc(r.id)}" title="Add ${esc(r.name)} to the ${side}"><span class="pth">${r.thumb ? `<img src="${esc(r.thumb)}" alt="">` : ''}</span><span>${esc(r.name)}</span><button class="pdel" data-del="${esc(r.id)}" aria-label="Delete preset ${esc(r.name)}" title="Delete">×</button></div>`).join('') : '') + `<div class="empty" style="grid-column:1/-1">${list.length ? '' : '<b>No presets of your own yet.</b><br>'}Select one or more elements, then choose <b>Save as preset</b> in the inspector.</div>`;
    return;
  }
  const C = P.card, isLay = COMPONENTS.some(c => c.cat === presetCat && c.layout), base = cardBase(), key = (c) => c.name + '|' + C.w + 'x' + C.h + (c.layout ? '|' + base : ''), list = COMPONENTS.filter(c => c.cat === presetCat), g = $('#presetGrid');
  g.innerHTML = (isLay ? `<label class="layrep"><input type="checkbox" id="layRep" ${layReplace ? 'checked' : ''}> Replace what’s on the ${side} <span>(keeps full-card backgrounds)</span></label>` : '') + list.map((c, i) => `<button class="pcard" data-i="${COMPONENTS.indexOf(c)}" title="Add ${esc(c.name)} to the ${side}"><span class="pth" data-pi="${COMPONENTS.indexOf(c)}"></span><span>${esc(c.name)}</span></button>`).join('');
  const slots = $$('[data-pi]', g); let i = 0;
  const step = () => { if (i >= slots.length) return; const s = slots[i++]; if (!s.isConnected) return; const comp = COMPONENTS[+s.dataset.pi]; let cnv = presetThumbs.get(key(comp)); if (!cnv) { try { cnv = comp.layout ? thumbEls(instantiateComponent(comp, C), 220, 132, { w: C.w, h: C.h, r: C.r, fill: base }) : thumbEls(instantiateComponent(comp, C), 220, 132); } catch (e) { cnv = document.createElement('canvas'); } presetThumbs.set(key(comp), cnv); } const cl = document.createElement('canvas'); cl.width = cnv.width || 1; cl.height = cnv.height || 1; if (cnv.width) cl.getContext('2d').drawImage(cnv, 0, 0); s.appendChild(cl); requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
let layReplace = true;
function fitToPoster(comp) {   // card- and emblem-sized components, laid out on a card-shaped area and scaled up to the poster
  const C = P.card, cw = 85.6, ch = 53.98, s = Math.min(C.w / cw, C.h / ch) * .9, els = instantiateComponent(comp, { ...C, w: cw, h: ch, r: 3.18, mode: 'card' });
  for (const e of els) { e.x = C.w / 2 + (e.x - cw / 2) * s; e.y = C.h / 2 + (e.y - ch / 2) * s; scaleEl(e, s); }
  return els;
}
function insertComponent(i) {
  const comp = COMPONENTS[i], C = P.card, els = appMode === 'poster' && (comp.mode || 'card') !== 'poster' && !comp.user ? fitToPoster(comp) : instantiateComponent(comp, P.card);
  if (comp.layout && layReplace) {
    const full = e => Math.abs(e.w - C.w) < 1 && Math.abs(e.h - C.h) < 1, ownBg = els.some(full), keep = P[side].filter(e => !ownBg && full(e) && !e.rot);
    P[side].length = 0; P[side].push(...keep);
  }
  if (comp.under) P[side].unshift(...els); else for (const e of els) P[side].push(e);
  if (comp.layout) setSel([]); else setSel(els.map(e => e.id));
  renderLayers(); renderInspector(); if (!comp.layout) showTab('el'); elChanged(false, ['front', 'back']);
  toast(comp.layout ? `Applied the “${comp.name}” layout to the ${side}${layReplace ? ' · Ctrl+Z to undo' : ''}` : `Added ${comp.name.toLowerCase()} to the ${side}`);
}

/* ---------- layers ---------- */
function renderLayers() {
  const ol = $('#layers'), list = P[side]; $('#layerCount').textContent = list.length ? String(list.length) : '';
  ol.innerHTML = list.length ? list.slice().reverse().map(e => `<li data-id="${e.id}" draggable="true" class="${selIds.includes(e.id) ? 'sel' : ''} ${e.visible === false ? 'hid' : ''}"><button class="ico" data-a="vis" title="${e.visible === false ? 'Show' : 'Hide'}" aria-label="Toggle visibility">${e.visible === false ? ICON.eyeOff : ICON.eye}</button><span class="nm">${esc(e.name)}</span><span class="tg">${FIN_TAG[e.finish] || ''}</span><button class="ico" data-a="lock" title="${e.locked ? 'Unlock' : 'Lock on canvas'}" aria-label="Toggle lock">${e.locked ? ICON.lock : ICON.unlock}</button></li>`).join('') : '<li class="empty" style="cursor:default;display:block">No layers on this side yet. Add an element or a preset above, or drop an image on the stage.</li>';
}
function bindLayers() {
  const ol = $('#layers'); let dragId = null;
  ol.addEventListener('click', e => { const li = e.target.closest('li[data-id]'); if (!li) return; const el = P[side].find(x => x.id === li.dataset.id); if (!el) return; const a = e.target.closest('[data-a]'); if (a) { if (a.dataset.a === 'vis') el.visible = el.visible === false; else el.locked = !el.locked; renderLayers(); elChanged(false); if (selIds.includes(el.id)) renderInspector(); return; } select(el.id, e.shiftKey || e.metaKey || e.ctrlKey); });
  ol.addEventListener('dblclick', e => { const li = e.target.closest('li[data-id]'); if (!li || e.target.closest('[data-a]')) return; const el = P[side].find(x => x.id === li.dataset.id); if (!el) return; const nm = li.querySelector('.nm'), inp = document.createElement('input'); inp.type = 'text'; inp.value = el.name; inp.className = 'renin'; nm.replaceWith(inp); inp.focus(); inp.select(); const done = (ok) => { if (inp._d) return; inp._d = 1; if (ok && inp.value.trim()) { el.name = inp.value.trim(); commit(); } renderLayers(); renderInspector(); }; inp.onkeydown = (ev) => { ev.stopPropagation(); if (ev.key === 'Enter') done(true); if (ev.key === 'Escape') done(false); }; inp.onblur = () => done(true); });
  ol.addEventListener('dragstart', e => { const li = e.target.closest('li[data-id]'); if (!li) return; dragId = li.dataset.id; e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', dragId); } catch (x) { } });
  ol.addEventListener('dragover', e => { const li = e.target.closest('li[data-id]'); if (!li || !dragId) return; e.preventDefault(); $$('#layers li.drop').forEach(x => x.classList.remove('drop')); li.classList.add('drop'); });
  ol.addEventListener('dragleave', e => { const li = e.target.closest('li'); if (li) li.classList.remove('drop'); });
  ol.addEventListener('drop', e => { e.preventDefault(); const li = e.target.closest('li[data-id]'); $$('#layers li.drop').forEach(x => x.classList.remove('drop')); if (!li || !dragId || li.dataset.id === dragId) return; const list = P[side], a = list.findIndex(x => x.id === dragId); if (a < 0) return; const [m] = list.splice(a, 1); const b = list.findIndex(x => x.id === li.dataset.id); list.splice(b + 1, 0, m); dragId = null; elChanged(false, [side]); renderLayers(); });
  ol.addEventListener('dragend', () => { dragId = null; $$('#layers li.drop').forEach(x => x.classList.remove('drop')); });
}

/* ---------- identity generator ---------- */
const titleCase = (s) => s.toLowerCase().replace(/(^|[\s-])(\S)/g, (m, a, b) => a + b.toUpperCase());
function applyIdentity(mrzOnly) {
  const fromFields = () => { const get = (re) => { for (const sd of ['front', 'back']) for (const e of P[sd]) if (e.type === 'field' && re.test(String(e.label).toLowerCase())) return String(e.value); return null; }; return get; };
  let p;
  if (mrzOnly) { const g = fromFields(); p = randPerson(hashStr(snapState())); const sur = g(/surname|last name|family/), giv = g(/given|first name|forename/); if (sur) p.sur = sur.toUpperCase(); if (giv) p.given = giv.toUpperCase(); const pd = (s) => { const m = /(\d{1,2})\s+([A-Z]{3})\s+(\d{4})/.exec(String(s || '').toUpperCase()); return m ? `${m[3].slice(2)}${String(MONTHS.indexOf(m[2]) + 1).padStart(2, '0')}${m[1].padStart(2, '0')}` : null; }; const db = pd(g(/birth|born/)), ex = pd(g(/expir/)); if (db) p.dob.mrz = db; if (ex) p.exp.mrz = ex; const idv = g(/(card|passport|document|student) ?no|number/); if (idv) p.id = idv.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 9); const sx = g(/^sex/); if (sx) p.sex = sx[0]; }
  else p = randPerson((Math.random() * 1e9) | 0);
  let code = 'FOR'; for (const sd of ['front', 'back']) for (const e of P[sd]) { if (e.type === 'field' && /code/i.test(e.label) && /^[A-Z]{3}$/.test(e.value)) code = e.value; if (e.type === 'mrz') { const m = /^[A-Z<]{2}([A-Z]{3})/.exec(String(e.text)); if (m) code = m[1]; } }
  const full = p.first + ' ' + p.surTitle, face = Math.random() * 100 | 0;
  if (!mrzOnly) for (const sd of ['front', 'back']) for (const e of P[sd]) if (e.type === 'photo' && !e.asset) e.phSeed = face;
  for (const sd of ['front', 'back']) for (const e of P[sd]) {
    if (e.type === 'mrz') { e.text = mrzFor(p, code, e.cols || 30); continue; }
    if (mrzOnly) continue;
    if (e.type === 'field') {
      const L = String(e.label).toLowerCase(); let v = null;
      if (/surname|last name|family|\bnom\b/.test(L)) v = p.sur;
      else if (/given|first name|pr[ée]nom|forename/.test(L)) v = p.given;
      else if (/place of birth|birthplace/.test(L)) v = p.place;
      else if (/birth|born|dob/.test(L)) v = p.dob.str;
      else if (/expir|valid (to|until|thru)/.test(L)) v = p.exp.str;
      else if (/issue/.test(L) && !/office|authority/.test(L)) v = p.iss.str;
      else if (/^sex|gender/.test(L)) v = p.sex;
      else if (/height/.test(L)) v = p.height + ' CM';
      else if (/(card|passport|document|student|licen[cs]e|badge) ?no|number|^no\.?$/.test(L)) v = p.id;
      else if (/^(name|bearer|holder|member|pilot|driver|resident|student|crew|captain)/.test(L)) v = e.upper ? full.toUpperCase() : full;
      if (v != null) e.value = v;
    } else if (e.type === 'text') {
      if (/^(name|member|crew name|holder|bearer|pilot|driver)$/i.test(e.name)) e.text = e.text === e.text.toUpperCase() ? full.toUpperCase() : full;
      else if (/^serial$/i.test(e.name)) e.text = p.id;
      else if (/^NAME\s*\.+/m.test(e.text)) e.text = e.text.replace(/^(NAME\s*\.+\s*).*$/m, '$1' + full.toUpperCase());
    } else if (e.type === 'sign' && !(e.strokes && e.strokes.length)) e.text = p.first[0] + '. ' + p.surTitle;
    else if (e.type === 'barcode' || e.type === 'matrix') e.data = p.id;
  }
  invalidate(['front', 'back']); renderInspector(); commit(); toast(mrzOnly ? 'Machine strip rebuilt from the fields' : `Card now issued to ${full}, a fictional person`);
}

/* ---------- card + scene panes ---------- */
const flexOnly = () => sub().flex;
const CARD_P = [
  ['§', 'Format'], ['fmt', 'Size preset', 'select', fmtOpts()], ['shape', 'Outline', 'select', CARD_SHAPES], ['w', 'Width (mm)', 'num', { min: 20, max: 220, step: .1 }], ['h', 'Height (mm)', 'num', { min: 20, max: 220, step: .1 }], ['r', 'Corner radius', 'range', { min: 0, max: 15, step: .05 }], ['thick', 'Thickness (mm)', 'range', { min: .08, max: 8, step: .01 }], ['slot', 'Punch', 'select', [['none', 'None'], ['slot', 'Lanyard slot'], ['hole', 'Round hole'], ['slot2', 'Slot + corner holes'], ['corners', 'Two corner holes'], ['corners4', 'Four corner holes']]],
  ['§', 'Material'], ['sub', 'Substrate', 'select', Object.entries(SUBS).map(([k, v]) => [k, v.label])], ['glowInt', 'Glow strength', 'range', { min: 0, max: 3, step: .05 }, C => !!SUBS[C.sub]?.glow], ['tintOn', 'Custom tint', 'check', null, () => !sub().clear || sub().tintable], ['tint', 'Tint colour', 'color', null, c => c.tintOn], ['edgeFin', 'Card edge', 'select', [['core', 'Core material'], ['gold', 'Gilded gold'], ['silver', 'Silver leaf'], ['black', 'Black painted'], ['glow', 'Neon glow']], () => !flexOnly()], ['edgeOn', 'Coloured core', 'check', null, c => !flexOnly() && c.edgeFin === 'core'], ['edge', 'Core colour', 'color', null, c => c.edgeOn && !flexOnly() && c.edgeFin === 'core'], ['ink', 'Ink finish', 'select', [['matte', 'Matte'], ['satin', 'Satin'], ['gloss', 'Gloss']]], ['lam', 'Overlay', 'select', [['none', 'None'], ['gloss', 'Gloss laminate'], ['matte', 'Matte laminate']]],
  ['§', 'Security layers'], ['holoLam', 'Holo laminate', 'select', [['none', 'None'], ['stars', 'Star field'], ['waves', 'Waves'], ['rings', 'Rings'], ['hex', 'Hex cells'], ['sunburst', 'Sunburst'], ['guilloche', 'Guilloche'], ['diamond', 'Diamond grid']]], ['holoLamInt', 'Laminate strength', 'range', { min: 0, max: 1, step: .01 }, c => c.holoLam !== 'none'], ['holoLamBack', 'Laminate the back too', 'check', null, c => c.holoLam !== 'none'], ['uvFibers', 'UV fibres', 'range', { min: 0, max: 400, step: 5 }], ['fluor', 'Optical brighteners', 'select', [['auto', 'Substrate default'], ['on', 'Glows under UV'], ['off', 'UV-dull']]],
  ['§', 'Wear and age'], ['age', 'Age / yellowing', 'range', { min: 0, max: 1, step: .01 }], ['stains', 'Stains', 'range', { min: 0, max: 1, step: .01 }], ['wear', 'Edge wear', 'range', { min: 0, max: 1, step: .01 }], ['fade', 'Ink fade', 'range', { min: 0, max: 1, step: .01 }], ['creases', 'Creases', 'range', { min: 0, max: 1, step: .01 }], ['foldV', 'Centre fold', 'range', { min: 0, max: 1, step: .01 }], ['foldH', 'Cross fold', 'range', { min: 0, max: 1, step: .01 }],
  ['§', 'Paper flex', null, null, flexOnly], ['curl', 'Curl', 'range', { min: -1, max: 1, step: .01 }, flexOnly], ['crumple', 'Crumple', 'range', { min: 0, max: 1, step: .01 }, flexOnly],
  ['§', 'Output'], ['res', 'Texture width', 'select', [[1024, '1K · quick'], [2048, '2K · default'], [4096, '4K · detailed'], [5120, '5K · absurd']]], ['relief', 'Relief depth', 'range', { min: 0, max: 6, step: .05 }], ['seed', 'Wear seed', 'range', { min: 1, max: 99, step: 1 }]
];
const CARD_REFORM = new Set(['fmt', 'shape', 'sub', 'tintOn', 'edgeOn', 'holoLam', 'edgeFin']);
let rcBase = null; const rc = { h: 0, s: 1, l: 0 };
function recolorApply(live) {
  if (!rcBase) { rcBase = new Map(); for (const sd of ['front', 'back']) for (const e of P[sd]) { const o = {}; for (const k of COLOR_KEYS) if (typeof e[k] === 'string' && e[k][0] === '#') o[k] = e[k]; rcBase.set(e.id, o); } }
  for (const sd of ['front', 'back']) for (const e of P[sd]) { const o = rcBase.get(e.id); if (o) for (const k in o) e[k] = shiftColor(o[k], rc.h, rc.s, rc.l); }
  invalidate(['front', 'back'], live); if (!live) commit();
}
let subStepT = null;
function stepSub(d) {   // move through the substrate list; the pane re-renders, so always find the live select
  const s = $('#pane-card .row[data-key="sub"] select'); if (!s) return; const n = s.options.length; s.selectedIndex = (s.selectedIndex + d + n) % n;
  s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true }));
}
function addSubSteppers() {
  const s = $('#pane-card .row[data-key="sub"] select'); if (!s || s.parentElement.classList.contains('stepwrap')) return;
  const w = document.createElement('span'); w.className = 'stepwrap'; s.parentElement.insertBefore(w, s); w.appendChild(s);
  const b = document.createElement('span'); b.className = 'step2'; b.innerHTML = '<button type="button" data-d="-1" aria-label="Previous substrate" title="Previous substrate ( [ )">▲</button><button type="button" data-d="1" aria-label="Next substrate" title="Next substrate ( ] )">▼</button>'; w.appendChild(b);
  b.addEventListener('pointerdown', e => { const t = e.target.closest('button[data-d]'); if (!t) return; e.preventDefault(); const d = +t.dataset.d; subStepT = { d, last: performance.now(), n: 0 }; stepSub(d); requestAnimationFrame(subHoldLoop); });
}
function subHoldLoop() { const h = subStepT; if (!h) return; const t = performance.now(); if (t - h.last > (h.n ? 150 : 400)) { h.n++; Forge.quick = true; stepSub(h.d); h.last = performance.now(); } requestAnimationFrame(subHoldLoop); }
function subHoldEnd() { const h = subStepT; subStepT = null; if (h && h.n) { Forge.quick = false; invalidate(null, true); } }
['pointerup', 'pointercancel', 'blur'].forEach(ev => window.addEventListener(ev, subHoldEnd));
window.addEventListener('keydown', e => { if ((e.key === '[' || e.key === ']') && !e.ctrlKey && !e.metaKey && !e.altKey && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || '') && !document.activeElement?.isContentEditable) { if (!$('#pane-card .row[data-key="sub"] select')) { showTab('card'); } stepSub(e.key === ']' ? 1 : -1); e.preventDefault(); } });
function renderCardPane() { renderCardPane0(); addSubSteppers(); }
function newWords(kind) {   // swap the largest headline on this side for a generated line
  const txt = P[side].filter(e => e.type === 'text' && e.visible !== false); if (!txt.length) return toast('Add a text element first.');
  const el = txt.reduce((a, b) => (b.size * (b.text || '').length > a.size * (a.text || '').length ? b : a)), line = POSTER_WORDS[kind]();
  el.text = el.upper === false && /[a-z]/.test(el.text) ? line : line.toUpperCase(); elChanged(false, [side]); toast(`“${el.text}” · click again for another`);
}
function renderCardPane0() {
  const host = $('#pane-card'); host.innerHTML = ''; rcBase = null; rc.h = 0; rc.s = 1; rc.l = 0;
  const top = document.createElement('div');
  if (appMode === 'poster') { top.innerHTML = `<div class="sec">Words</div><div class="acts al" style="grid-template-columns:1fr 1fr"><button id="cSlogan" title="Put a new fictional slogan in the biggest headline">New slogan</button><button id="cWarn" title="Put a new fictional hazard warning in the biggest headline">New warning</button></div>`; host.appendChild(top); $('#cSlogan').onclick = () => newWords('slogan'); $('#cWarn').onclick = () => newWords('warning'); }
  else { top.innerHTML = `<div class="sec">Identity</div><div class="acts al" style="grid-template-columns:1fr 1fr"><button id="cIdent" title="Fill names, dates and numbers with a random fictional person">New fictional identity</button><button id="cMrz" title="Rebuild every machine strip from the fields">Rebuild machine strips</button></div>`; host.appendChild(top); $('#cIdent').onclick = () => applyIdentity(false); $('#cMrz').onclick = () => applyIdentity(true); }
  const POSTER_HIDE = new Set(['holoLam', 'holoLamInt', 'holoLamBack', 'uvFibers', 'edgeFin', 'edgeOn', 'edge']), rows = appMode === 'poster' ? CARD_P.filter(p => !POSTER_HIDE.has(p[0]) && !(p[0] === '§' && p[1] === 'Security layers')) : CARD_P;
  buildForm(host, P.card, rows, (k, v, f) => {
    const C = P.card, S0 = sub(); const ow = C.w, oh = C.h; C[k] = v;
    if (k === 'fmt' && FORMATS[v] && FORMATS[v].w) { const fm = FORMATS[v]; C.w = fm.w; C.h = fm.h; C.r = fm.r; C.shape = fm.shape || 'rect'; if (fm.thick) C.thick = fm.thick; if (fm.slot) C.slot = fm.slot; appMode === 'poster' ? rescalePoster(ow, oh) : rescale(ow, oh); }
    if ((k === 'w' || k === 'h') && f) { C.fmt = 'custom'; appMode === 'poster' ? rescalePoster(ow, oh) : rescale(ow, oh); }
    if (k === 'sub') { const S = SUBS[v]; C.thick = S.thick; if (!C.tintOn) C.tint = S.clear ? (S.atten || '#ffffff') : S.color; if (S.flex !== S0.flex && !S.flex) { C.curl = 0; C.crumple = 0; } }
    if (view) view.setCard(); invalidate(['front', 'back'], !f);
    if (f) { commit(); if (CARD_REFORM.has(k)) renderCardPane(); if (k === 'fmt' || k === 'w' || k === 'h' || k === 'shape') { flatLayout(); renderInspector(); presetThumbs.clear(); } ui.hud(); }
  });
  const rcw = document.createElement('div'); rcw.innerHTML = `<div class="sec">Recolour every ink</div><div class="chips" id="palChips">${PALETTES.map(([n], i) => `<button data-p="${i}">${esc(n)}</button>`).join('')}</div>`; host.appendChild(rcw);
  rcw.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { const [, h, s, l] = PALETTES[+b.dataset.p]; rc.h = h; rc.s = s; rc.l = l; recolorApply(false); renderRcSliders(); });
  const sl = document.createElement('div'); sl.id = 'rcSl'; host.appendChild(sl);
  const renderRcSliders = () => { sl.innerHTML = ''; buildForm(sl, rc, [['h', 'Hue shift', 'range', { min: -180, max: 180, step: 1 }], ['s', 'Saturation', 'range', { min: 0, max: 2, step: .01 }], ['l', 'Lightness', 'range', { min: -.4, max: .4, step: .01 }]], (k, v, f) => { rc[k] = v; recolorApply(!f); }); };
  renderRcSliders();
  const n = document.createElement('p'); n.className = 'note'; n.textContent = 'Everything here is fictional. Barcodes are Code 128 or decorative; QR codes are real and scannable; machine strips are styled text without valid check digits.'; host.appendChild(n);
}
function rescalePoster(ow, oh) { const C = P.card, sx = C.w / ow, sy = C.h / oh, s = Math.min(sx, sy); if (sx === 1 && sy === 1) return; for (const sd of ['front', 'back']) for (const e of P[sd]) { const full = Math.abs(e.w - ow) < 1 && Math.abs(e.h - oh) < 1; e.x *= sx; e.y *= sy; scaleEl(e, s); if (full) { e.w = C.w; e.h = C.h; } } }
function rescale(ow, oh) { const C = P.card, sx = C.w / ow, sy = C.h / oh; if (sx === 1 && sy === 1) return; for (const s of ['front', 'back']) for (const e of P[s]) { e.x *= sx; e.y *= sy; if ((e.type === 'pattern' || e.type === 'guilloche') && Math.abs(e.w - ow) < .5) { e.w = C.w; e.h = C.h; } if (e.type === 'frame' && Math.abs(e.w - ow) < 10) { e.w += C.w - ow; e.h += C.h - oh; } } }
const ENV_OPTS = [['softbox', 'Softbox studio'], ['white', 'Catalogue white'], ['golden', 'Golden hour'], ['sunset', 'Sunset'], ['neon', 'Neon noir'], ['gallery', 'Gallery spots'], ['lab', 'Clean lab'], ['candle', 'Candlelight'], ['interrogation', 'Single hard lamp'], ['aqua', 'Deep water'], ['prism', 'Prism lights']];
const BD_OPTS = [['slate', 'Slate'], ['walnut', 'Walnut desk'], ['marble', 'White marble'], ['concrete', 'Concrete'], ['velvet', 'Velvet'], ['leather', 'Leather blotter'], ['felt', 'Card-table felt'], ['cork', 'Cork board'], ['mat', 'Cutting mat'], ['steel', 'Steel bench'], ['linen', 'Linen'], ['paper', 'Seamless paper'], ['blackglass', 'Black glass'], ['void', 'Void']];
const SCENE_P = [
  ['§', 'Light'], ['env', 'Studio', 'select', ENV_OPTS], ['envInt', 'Ambient', 'range', { min: 0, max: 3, step: .01 }], ['keyInt', 'Key light', 'range', { min: 0, max: 3, step: .01 }], ['azim', 'Light direction', 'range', { min: -180, max: 180, step: 1 }], ['elev', 'Light height', 'range', { min: 4, max: 89, step: 1 }], ['refl', 'Reflections / glare', 'range', { min: 0, max: 1.5, step: .01 }], ['exposure', 'Exposure', 'range', { min: .2, max: 3, step: .01 }], ['tone', 'Tone mapping', 'select', [['agx', 'AgX (filmic)'], ['aces', 'ACES'], ['neutral', 'Neutral'], ['none', 'Linear']]],
  ['§', 'Set'], ['backdrop', 'Surface', 'select', BD_OPTS], ['pose', 'Card pose', 'select', [['hover', 'Floating'], ['desk', 'Lying on the surface'], ['stand', 'Standing up'], ['lanyard', 'On a lanyard']]], ['float', 'Gentle float', 'check', null, s => s.pose === 'hover'], ['lanyardStyle', 'Lanyard', 'select', [['strap', 'Printed strap'], ['clip', 'Cord & badge clip'], ['holes', 'Cord through corner holes']], s => s.pose === 'lanyard'], ['lanyardColor', 'Lanyard colour', 'color', null, s => s.pose === 'lanyard'], ['lanyardText', 'Strap text', 'text', null, s => s.pose === 'lanyard' && (s.lanyardStyle || 'strap') === 'strap'], ['dust', 'Dust in the light', 'check'],
  ['§', 'Lens'], ['bloom', 'Bloom', 'range', { min: 0, max: 2, step: .01 }], ['dof', 'Depth of field', 'range', { min: 0, max: 1, step: .01 }], ['vignette', 'Vignette', 'range', { min: 0, max: 1, step: .01 }], ['grain', 'Film grain', 'range', { min: 0, max: 1, step: .01 }], ['ca', 'Chromatic fringe', 'range', { min: 0, max: 1, step: .01 }], ['quality', 'Render quality', 'select', [['draft', 'Draft · fastest'], ['high', 'High'], ['ultra', 'Ultra · retina']]]
];
function renderScenePane() {
  const host = $('#pane-scene'); host.innerHTML = '';
  const lk = document.createElement('div'); lk.innerHTML = `<div class="sec">Looks</div><div class="chips looks">${LOOKS.map((l, i) => `<button data-l="${i}">${esc(l.name)}</button>`).join('')}</div>`; host.appendChild(lk);
  lk.querySelectorAll('[data-l]').forEach(b => b.onclick = () => { const L = LOOKS[+b.dataset.l]; Object.assign(P.scene, L.s); toggleUV(!!L.uv); if (view) { view.setScene(); if (L.cam) setTimeout(() => view.camPreset(L.cam), 80); } renderScenePane(); commit(); toast(`Look: ${L.name}`); });
  buildForm(host, P.scene, SCENE_P, (k, v, f) => { P.scene[k] = v; if (view) view.setScene(); if (f) { commit(); if (k === 'pose') { renderScenePane(); if (view) setTimeout(() => view.camPreset('hero'), 60); } } });
}
function showTab(t) { $$('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.t === t)); for (const p of ['el', 'card', 'scene']) $('#pane-' + p).hidden = p !== t; }

/* ---------- flat editor ---------- */
const flat = $('#flat'), fx = flat.getContext('2d'), fv = { s: 1, ox: 0, oy: 0, d: 1, w: 0, h: 0, zoom: 1, px: 0, py: 0, grid: false, safe: false, snap: true };
let drag = null, hoverId = null, guides = [], spaceDown = false;
const HANDLES = [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]];
const gStep = () => fv.s < 1.6 ? 10 : fv.s < 5 ? 5 : 1, gMaj = () => fv.s < 1.6 ? 50 : 5;
function cardPathAt(c, X, Y, s) { const C = P.card, pts = C.shape && C.shape !== 'rect' ? cardOutline(C.shape, C.w, C.h) : null; if (pts) { pts.forEach(([x, y], i) => i ? c.lineTo(X + x * s, Y + y * s) : c.moveTo(X + x * s, Y + y * s)); c.closePath(); } else rr(c, X, Y, C.w * s, C.h * s, C.r * s); }
function flatLayout() {
  const r = flat.getBoundingClientRect(); if (!r.width || !r.height) return; const d = Math.min(2, devicePixelRatio || 1);
  if (flat.width !== Math.round(r.width * d) || flat.height !== Math.round(r.height * d)) { flat.width = Math.round(r.width * d); flat.height = Math.round(r.height * d); }
  fv.d = d; fv.w = r.width; fv.h = r.height; const C = P.card, pad = Math.max(28, Math.min(72, r.width * .08));
  fv.s = Math.min((r.width - pad * 2) / C.w, (r.height - pad * 2) / C.h) * fv.zoom; fv.ox = (r.width - C.w * fv.s) / 2 + fv.px; fv.oy = (r.height - C.h * fv.s) / 2 + fv.py;
  const zl = $('#zoomLbl'); if (zl) zl.textContent = Math.round(fv.zoom * 100) + '%';
  ui.drawFlat();
}
function zoomAt(f, px, py) { const C = P.card, nz = clamp(fv.zoom * f, .35, 14); if (px == null) { px = fv.w / 2; py = fv.h / 2; } const mx = (px - fv.ox) / fv.s, my = (py - fv.oy) / fv.s; fv.zoom = nz; const pad = Math.max(28, Math.min(72, fv.w * .08)), s = Math.min((fv.w - pad * 2) / C.w, (fv.h - pad * 2) / C.h) * nz; fv.px = px - mx * s - (fv.w - C.w * s) / 2; fv.py = py - my * s - (fv.h - C.h * s) / 2; flatLayout(); }
function checker(x, X, Y, W, Hh) { const s = 8; for (let j = 0; j * s < Hh; j++) for (let i = 0; i * s < W; i++) { x.fillStyle = (i + j) % 2 ? '#2b2d31' : '#1c1e21'; x.fillRect(X + i * s, Y + j * s, s, s); } }
const _litT = document.createElement('canvas');
function litLayers(r) {   // soft-light relief + metal map, and a screen map of highlights and holographic rainbow
  if (r._lit) return r._lit;
  const W = Math.min(1100, r.A.width), H = Math.max(2, Math.round(W * r.A.height / r.A.width)); _litT.width = W; _litT.height = H; const x = _litT.getContext('2d', { willReadFrequently: true });
  const read = cv => { if (!cv) return null; x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high'; x.clearRect(0, 0, W, H); x.drawImage(cv, 0, 0, W, H); return x.getImageData(0, 0, W, H).data; };
  const h = read(r.H), m = read(r.M), o = read(r.O), sd = new ImageData(W, H), hd = new ImageData(W, H), gain = 1.5 * Math.min(2.5, P.card.relief || 1.5);
  const hue2 = (hh) => { const f = n => { const k = (n + hh * 12) % 12; return 255 * (.62 - .53 * Math.max(-1, Math.min(k - 3, 9 - k, 1))); }; return [f(0), f(8), f(4)]; };
  for (let y = 0; y < H; y++) { const ya = Math.max(0, y - 1), yb = Math.min(H - 1, y + 1); for (let xx = 0; xx < W; xx++) {
    const i = (y * W + xx) * 4; let v = 128;
    if (h) v += (h[(ya * W + Math.max(0, xx - 1)) * 4] - h[(yb * W + Math.min(W - 1, xx + 1)) * 4]) * gain;
    const met = m ? m[i] / 255 : 0, t = xx / W * .62 + y / H * .38, env = .12 + .88 * Math.exp(-(((t - .3) / .34) ** 2));   // one broad, soft reflection
    if (met > .02) v += (env - .55) * 84 * met;
    sd.data[i] = sd.data[i + 1] = sd.data[i + 2] = v < 0 ? 0 : v > 255 ? 255 : v; sd.data[i + 3] = 255;
    let a = 0, cr = 255, cg = 255, cb = 255;
    if (met > .02 && env > .7) a = (env - .7) / .3 * met * .15;
    if (o && o[i] > 8) { const k = o[i] / 255 * .32; if (k > a) { [cr, cg, cb] = hue2(((xx / W) * 1.1 + (y / H) * .8 + o[i + 1] / 255 * .5) % 1); a = k; } }
    hd.data[i] = cr; hd.data[i + 1] = cg; hd.data[i + 2] = cb; hd.data[i + 3] = a * 255;
  } }
  const soft = document.createElement('canvas'), scr = document.createElement('canvas'); soft.width = scr.width = W; soft.height = scr.height = H; soft.getContext('2d').putImageData(sd, 0, 0); scr.getContext('2d').putImageData(hd, 0, 0);
  return (r._lit = { soft, scr });
}
/* the lit card face, shared by the flat view and the substrate sheet: substrate, relief and sheen, glow, rim */
ui.paintCard = function (g, r, X, Y, CW, CH, path, o = {}) {
  const C = P.card, S = sub(), lit = o.lit !== false, uv = !!o.uv, s = o.s || CW / C.w;
  g.save(); path(); g.clip(); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
  if (S.clear && r.E) { if (!lit) checker(g, X, Y, CW, CH); g.fillStyle = S.disp || 'rgba(30,30,30,.5)'; g.fillRect(X, Y, CW, CH); g.drawImage(r.E, X, Y, CW, CH); }
  else g.drawImage(r.A, X, Y, CW, CH);
  if (lit && !uv) {
    const L = litLayers(r); g.save(); g.globalCompositeOperation = 'soft-light'; g.drawImage(L.soft, X, Y, CW, CH); g.globalCompositeOperation = 'screen'; g.drawImage(L.scr, X, Y, CW, CH);
    const gl = C.lam === 'gloss' ? .07 : C.lam === 'matte' ? .02 : Math.min(.07, (S.cc || 0) * .05 + (S.metal ? .02 : 0) + (S.clear ? .05 : 0));
    if (gl > 0) { const q = g.createLinearGradient(X, Y, X + CW * .7, Y + CH); q.addColorStop(0, `rgba(255,255,255,${gl})`); q.addColorStop(.45, `rgba(255,255,255,${gl * .35})`); q.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = q; g.fillRect(X, Y, CW, CH); }
    const lf = g.createLinearGradient(X, Y, X + CW * .55, Y + CH); lf.addColorStop(0, 'rgba(255,255,255,.05)'); lf.addColorStop(1, 'rgba(0,0,0,.12)'); g.globalCompositeOperation = 'source-over'; g.fillStyle = lf; g.fillRect(X, Y, CW, CH); g.restore();
  }
  if (!uv && r.G) { g.save(); g.globalCompositeOperation = 'screen'; g.globalAlpha = .9; g.drawImage(r.G, X, Y, CW, CH); g.restore(); }
  if (uv) { g.fillStyle = 'rgba(14,6,30,.88)'; g.fillRect(X, Y, CW, CH); if (r.X) { g.globalCompositeOperation = 'lighter'; g.drawImage(r.X, X, Y, CW, CH); g.globalCompositeOperation = 'source-over'; } }
  if (o.after) o.after();
  g.restore();
  if (lit) { g.save(); path(); const lw = Math.max(1, Math.min(6, C.thick * s * .3));
    if (S.glow) { g.shadowColor = S.glow; g.shadowBlur = 14; g.strokeStyle = S.glow; g.lineWidth = lw * 1.2; g.stroke(); }
    else { const q = g.createLinearGradient(X, Y, X + CW, Y + CH); q.addColorStop(0, `rgba(255,255,255,${S.clear ? .55 : .38})`); q.addColorStop(.5, 'rgba(255,255,255,.05)'); q.addColorStop(1, 'rgba(0,0,0,.45)'); g.strokeStyle = q; g.lineWidth = lw; g.stroke(); }
    g.restore(); }
};
ui.drawFlat = function () {
  if (viewMode === '3d' || !fv.w) return; const C = P.card, S = sub(), r = last[side];
  fx.setTransform(fv.d, 0, 0, fv.d, 0, 0);
  if (appMode === 'logo') {   // studio presentation: lit sweep, soft pool of light, vignette
    const cx = fv.ox + C.w * fv.s / 2, cy = fv.oy + C.h * fv.s / 2, R = Math.max(fv.w, fv.h), g = fx.createRadialGradient(cx, cy - C.h * fv.s * .15, 0, cx, cy, R * .75);
    g.addColorStop(0, '#363c4c'); g.addColorStop(.35, '#1c2029'); g.addColorStop(1, '#07080b'); fx.fillStyle = g; fx.fillRect(0, 0, fv.w, fv.h);
    const fl = fx.createRadialGradient(cx, cy + C.h * fv.s * .58, 0, cx, cy + C.h * fv.s * .58, C.w * fv.s * .7); fl.addColorStop(0, 'rgba(0,0,0,.55)'); fl.addColorStop(1, 'rgba(0,0,0,0)'); fx.fillStyle = fl; fx.fillRect(0, 0, fv.w, fv.h);
  } else if (appMode === 'poster') {   // a dim wall with light falling from above
    const cx = fv.ox + C.w * fv.s / 2, g = fx.createRadialGradient(cx, fv.oy - C.h * fv.s * .25, 0, cx, fv.oy + C.h * fv.s * .4, Math.max(fv.w, fv.h) * .95); g.addColorStop(0, '#45464b'); g.addColorStop(.45, '#232428'); g.addColorStop(1, '#0c0c0e'); fx.fillStyle = g; fx.fillRect(0, 0, fv.w, fv.h);
  } else { const cx = fv.ox + C.w * fv.s / 2, cy = fv.oy + C.h * fv.s / 2, g = fx.createRadialGradient(cx, cy - C.h * fv.s * .2, 0, cx, cy, Math.max(fv.w, fv.h) * .8); g.addColorStop(0, '#2c303a'); g.addColorStop(.4, '#181a20'); g.addColorStop(1, '#08090b'); fx.fillStyle = g; fx.fillRect(0, 0, fv.w, fv.h); fx.fillStyle = 'rgba(255,255,255,.035)'; for (let y = 10; y < fv.h; y += 20) for (let x = 10; x < fv.w; x += 20) fx.fillRect(x, y, 1, 1); }
  const lit = fv.lit !== false;
  const X = fv.ox, Y = fv.oy, CW = C.w * fv.s, CH = C.h * fv.s;
  for (const [bl, oy, al] of S.clear ? [[30, 14, .35]] : [[54, 26, .55], [16, 6, .5], [4, 1.5, .45]]) { fx.save(); fx.beginPath(); cardPathAt(fx, X, Y, fv.s); fx.shadowColor = `rgba(0,0,0,${al})`; fx.shadowBlur = bl; fx.shadowOffsetY = oy; fx.fillStyle = S.clear ? 'rgba(0,0,0,.01)' : '#18191c'; fx.fill(); fx.restore(); }
  if (r) ui.paintCard(fx, r, X, Y, CW, CH, () => { fx.beginPath(); cardPathAt(fx, X, Y, fv.s); }, { lit, uv: uvOn, s: fv.s, after: fv.grid ? () => { fx.lineWidth = 1; for (let m = 0; m <= C.w; m++) { if (m % gStep()) continue; fx.strokeStyle = m % gMaj() ? 'rgba(80,160,255,.12)' : 'rgba(80,160,255,.3)'; fx.beginPath(); fx.moveTo(X + m * fv.s + .5, Y); fx.lineTo(X + m * fv.s + .5, Y + CH); fx.stroke(); } for (let m = 0; m <= C.h; m++) { if (m % gStep()) continue; fx.strokeStyle = m % gMaj() ? 'rgba(80,160,255,.12)' : 'rgba(80,160,255,.3)'; fx.beginPath(); fx.moveTo(X, Y + m * fv.s + .5); fx.lineTo(X + CW, Y + m * fv.s + .5); fx.stroke(); } } : null });
  if (fv.safe) { fx.save(); fx.strokeStyle = 'rgba(255,220,90,.75)'; fx.setLineDash([5, 4]); fx.lineWidth = 1; fx.beginPath(); rr(fx, X + 3 * fv.s, Y + 3 * fv.s, CW - 6 * fv.s, CH - 6 * fv.s, Math.max(0, C.r - 3) * fv.s); fx.stroke(); fx.setLineDash([]); fx.strokeStyle = 'rgba(255,220,90,.4)'; fx.beginPath(); fx.moveTo(X + CW / 2, Y); fx.lineTo(X + CW / 2, Y + CH); fx.moveTo(X, Y + CH / 2); fx.lineTo(X + CW, Y + CH / 2); fx.stroke(); fx.restore(); }
  const hv = hoverId && !selIds.includes(hoverId) ? P[side].find(e => e.id === hoverId) : null; if (hv) outline(hv, 'rgba(255,255,255,.55)', false);
  const sels = selEls().filter(e => sideOf(e.id) === side); for (const el of sels) outline(el, '#ff5a3c', sels.length === 1);
  if (sels.length > 1) { const b = bboxOf(sels); fx.save(); fx.setLineDash([4, 3]); fx.strokeStyle = 'rgba(255,90,60,.7)'; fx.strokeRect(X + b.x0 * fv.s, Y + b.y0 * fv.s, (b.x1 - b.x0) * fv.s, (b.y1 - b.y0) * fv.s); fx.restore(); }
  for (const g of guides) { fx.strokeStyle = '#ff3df0'; fx.lineWidth = 1; fx.setLineDash([4, 3]); fx.beginPath(); if (g.x != null) { fx.moveTo(X + g.x * fv.s, 0); fx.lineTo(X + g.x * fv.s, fv.h); } else { fx.moveTo(0, Y + g.y * fv.s); fx.lineTo(fv.w, Y + g.y * fv.s); } fx.stroke(); fx.setLineDash([]); }
  if (drag && drag.mode === 'marquee') { const x0 = Math.min(drag.px, drag.cx), y0 = Math.min(drag.py, drag.cy); fx.fillStyle = 'rgba(255,90,60,.08)'; fx.strokeStyle = 'rgba(255,90,60,.8)'; fx.fillRect(x0, y0, Math.abs(drag.cx - drag.px), Math.abs(drag.cy - drag.py)); fx.strokeRect(x0 + .5, y0 + .5, Math.abs(drag.cx - drag.px), Math.abs(drag.cy - drag.py)); }
  fx.fillStyle = 'rgba(236,233,226,.5)'; fx.font = '11px "Inter Tight", sans-serif'; fx.textAlign = 'left'; fx.fillText(`${side === 'front' ? 'Front' : 'Back'} · ${C.w.toFixed(1)} × ${C.h.toFixed(1)} mm`, X, Y - 10);
};
const scr = (el) => ({ cx: fv.ox + el.x * fv.s, cy: fv.oy + el.y * fv.s, w: el.w * fv.s, h: Math.max(el.h * fv.s, 2), a: (el.rot || 0) * Math.PI / 180 });
function outline(el, col, handles) {
  const q = scr(el); fx.save(); fx.translate(q.cx, q.cy); fx.rotate(q.a); fx.strokeStyle = col; fx.lineWidth = 1.25; fx.strokeRect(-q.w / 2, -q.h / 2, q.w, q.h);
  if (handles && !el.locked) { fx.beginPath(); fx.moveTo(0, -q.h / 2); fx.lineTo(0, -q.h / 2 - 17); fx.stroke(); fx.fillStyle = '#fff'; fx.beginPath(); fx.arc(0, -q.h / 2 - 22, 5, 0, Math.PI * 2); fx.fill(); fx.stroke(); for (const [hx, hy] of HANDLES) { fx.fillStyle = '#fff'; fx.fillRect(hx * q.w / 2 - 4, hy * q.h / 2 - 4, 8, 8); fx.strokeRect(hx * q.w / 2 - 4, hy * q.h / 2 - 4, 8, 8); } }
  fx.restore();
  if (handles) { fx.fillStyle = '#ff7d62'; fx.font = '11px "Inter Tight", sans-serif'; fx.textAlign = 'center'; const ext = Math.abs(q.h / 2 * Math.cos(q.a)) + Math.abs(q.w / 2 * Math.sin(q.a)); fx.fillText(`${el.w.toFixed(1)} × ${el.h.toFixed(1)} mm`, q.cx, q.cy + ext + 17); }
}
function toLocal(el, px, py) { const q = scr(el), dx = px - q.cx, dy = py - q.cy, c = Math.cos(-q.a), s = Math.sin(-q.a); return { x: dx * c - dy * s, y: dx * s + dy * c, q }; }
function hitHandle(el, px, py) { const { x, y, q } = toLocal(el, px, py); if (Math.hypot(x, y + q.h / 2 + 22) < 9) return 'rot'; for (const h of HANDLES) if (Math.abs(x - h[0] * q.w / 2) < 7 && Math.abs(y - h[1] * q.h / 2) < 7) return h; return null; }
function hitTest(sd, mx, my) { const list = P[sd]; for (let i = list.length - 1; i >= 0; i--) { const e = list[i]; if (e.visible === false || e.locked) continue; const a = -(e.rot || 0) * Math.PI / 180, dx = mx - e.x, dy = my - e.y, lx = dx * Math.cos(a) - dy * Math.sin(a), ly = dx * Math.sin(a) + dy * Math.cos(a); if (Math.abs(lx) <= e.w / 2 + .6 && Math.abs(ly) <= Math.max(e.h, 1.2) / 2 + .6) return e; } return null; }
function snapTo(el, nx, ny, others) {
  const C = P.card, th = 6 / fv.s, g = [], xs = [C.w / 2, 3, C.w - 3], ys = [C.h / 2, 3, C.h - 3], ofx = el.rot ? [0] : [0, -el.w / 2, el.w / 2], ofy = el.rot ? [0] : [0, -el.h / 2, el.h / 2];
  for (const o of P[side]) { if (others.includes(o.id) || o.visible === false || (o.w >= C.w - .5 && o.h >= C.h - .5)) continue; xs.push(o.x, o.x - o.w / 2, o.x + o.w / 2); ys.push(o.y, o.y - o.h / 2, o.y + o.h / 2); }
  let b = { d: th, v: null, l: 0 }; for (const t of xs) for (const of of ofx) { const d = Math.abs(nx + of - t); if (d < b.d) b = { d, v: t - of, l: t }; } if (b.v != null) { nx = b.v; g.push({ x: b.l }); } else if (fv.grid) nx = Math.round(nx * 2) / 2;
  b = { d: th, v: null, l: 0 }; for (const t of ys) for (const of of ofy) { const d = Math.abs(ny + of - t); if (d < b.d) b = { d, v: t - of, l: t }; } if (b.v != null) { ny = b.v; g.push({ y: b.l }); } else if (fv.grid) ny = Math.round(ny * 2) / 2;
  return { x: nx, y: ny, g };
}
function bindFlat() {
  const pt = (e) => { const r = flat.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  flat.addEventListener('wheel', e => { e.preventDefault(); const [px, py] = pt(e); if (e.ctrlKey || e.metaKey || !e.shiftKey) zoomAt(Math.exp(-e.deltaY * .0016), px, py); else { fv.px -= e.deltaY; flatLayout(); } }, { passive: false });
  flat.addEventListener('pointerdown', e => {
    const [px, py] = pt(e);
    if (e.button === 1 || spaceDown) { drag = { mode: 'pan', px, py, sx: fv.px, sy: fv.py }; flat.setPointerCapture(e.pointerId); e.preventDefault(); return; }
    const el = selEl();
    if (selIds.length === 1 && el && sideOf(el.id) === side && !el.locked) { const h = hitHandle(el, px, py); if (h) { drag = { mode: h === 'rot' ? 'rot' : 'size', h, el, st: { ...el }, px, py }; flat.setPointerCapture(e.pointerId); return; } }
    const hit = hitTest(side, (px - fv.ox) / fv.s, (py - fv.oy) / fv.s);
    if (hit) {
      if (e.shiftKey || e.metaKey || e.ctrlKey) { select(hit.id, true); if (!selIds.includes(hit.id)) return; }
      else if (!selIds.includes(hit.id)) select(hit.id);
      const group = selEls().filter(x => sideOf(x.id) === side && !x.locked);
      drag = { mode: 'move', el: hit, st: { ...hit }, starts: group.map(g => [g, g.x, g.y]), px, py }; flat.setPointerCapture(e.pointerId);
    } else { drag = { mode: 'marquee', px, py, cx: px, cy: py, add: e.shiftKey, base: e.shiftKey ? [...selIds] : [] }; flat.setPointerCapture(e.pointerId); if (!e.shiftKey && selIds.length) { setSel([]); renderLayers(); renderInspector(); } }
  });
  flat.addEventListener('pointermove', e => {
    const [px, py] = pt(e);
    if (!drag) {
      const el = selEl(); let cur = spaceDown ? 'grab' : 'default';
      if (selIds.length === 1 && el && sideOf(el.id) === side && !el.locked) { const h = hitHandle(el, px, py); if (h === 'rot') cur = 'grab'; else if (h) cur = h[0] * h[1] === 0 ? (h[0] ? 'ew-resize' : 'ns-resize') : (h[0] * h[1] > 0 ? 'nwse-resize' : 'nesw-resize'); }
      const hit = hitTest(side, (px - fv.ox) / fv.s, (py - fv.oy) / fv.s); if (cur === 'default' && hit) cur = 'move'; flat.style.cursor = cur;
      const hid = hit ? hit.id : null; if (hid !== hoverId) { hoverId = hid; ui.drawFlat(); } return;
    }
    if (drag.mode === 'pan') { fv.px = drag.sx + px - drag.px; fv.py = drag.sy + py - drag.py; flatLayout(); return; }
    if (drag.mode === 'marquee') { drag.cx = px; drag.cy = py; const x0 = (Math.min(drag.px, px) - fv.ox) / fv.s, x1 = (Math.max(drag.px, px) - fv.ox) / fv.s, y0 = (Math.min(drag.py, py) - fv.oy) / fv.s, y1 = (Math.max(drag.py, py) - fv.oy) / fv.s; const inside = P[side].filter(o => o.visible !== false && !o.locked && o.x >= x0 && o.x <= x1 && o.y >= y0 && o.y <= y1).map(o => o.id); setSel([...drag.base, ...inside]); ui.drawFlat(); return; }
    const el = drag.el, st = drag.st;
    if (drag.mode === 'move') {
      let dx = (px - drag.px) / fv.s, dy = (py - drag.py) / fv.s; guides = [];
      if (!e.altKey && fv.snap) { const s = snapTo(el, st.x + dx, st.y + dy, drag.starts.map(a => a[0].id)); dx = s.x - st.x; dy = s.y - st.y; guides = s.g; }
      for (const [g, x0, y0] of drag.starts) { g.x = x0 + dx; g.y = y0 + dy; }
    }
    else if (drag.mode === 'rot') { const q = scr(st); let a = Math.atan2(py - q.cy, px - q.cx) * 180 / Math.PI + 90; if (e.shiftKey) a = Math.round(a / 15) * 15; if (a > 180) a -= 360; el.rot = Math.round(a * 10) / 10; }
    else {
      const a = (st.rot || 0) * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), dxs = (px - (fv.ox + st.x * fv.s)) / fv.s, dys = (py - (fv.oy + st.y * fv.s)) / fv.s, lx = dxs * ca + dys * sa, ly = -dxs * sa + dys * ca, [hx, hy] = drag.h;
      let w = st.w, h = st.h, cx = 0, cy = 0;
      if (hx) { const f0 = -hx * st.w / 2; w = Math.max(.3, hx * (lx - f0)); cx = f0 + hx * w / 2; }
      if (hy) { const f0 = -hy * st.h / 2; h = Math.max(.3, hy * (ly - f0)); cy = f0 + hy * h / 2; }
      if ((e.shiftKey || ['seal', 'holo', 'qr', 'matrix'].includes(el.type)) && hx && hy) { const s = Math.max(w / st.w, h / st.h); w = st.w * s; h = st.h * s; cx = -hx * st.w / 2 + hx * w / 2; cy = -hy * st.h / 2 + hy * h / 2; if (e.shiftKey) { if (st.size) el.size = st.size * s; if (st.vsize) { el.vsize = st.vsize * s; el.lsize = st.lsize * s; } } }
      el.w = w; el.h = h; el.x = st.x + cx * ca - cy * sa; el.y = st.y + cx * sa + cy * ca;
    }
    liveEdit();
  });
  const end = () => { if (!drag) return; const m = drag.mode; drag = null; guides = []; if (m === 'pan') return; if (m === 'marquee') { renderLayers(); renderInspector(); ui.drawFlat(); return; } elChanged(false); renderInspector(); ui.drawFlat(); };
  flat.addEventListener('pointerup', end); flat.addEventListener('pointercancel', end);
  flat.addEventListener('pointerleave', () => { if (!drag && hoverId) { hoverId = null; ui.drawFlat(); } });
  flat.addEventListener('dblclick', e => { const [px, py] = pt(e); if (!hitTest(side, (px - fv.ox) / fv.s, (py - fv.oy) / fv.s)) { fv.zoom = 1; fv.px = fv.py = 0; flatLayout(); } });
  $('#flatbar').addEventListener('click', e => { const b = e.target.closest('button[data-f]'); if (!b) return; const f = b.dataset.f; if (f === 'lit') { fv.lit = fv.lit === false; b.classList.toggle('on', fv.lit !== false); ui.drawFlat(); return; } if (f === 'fit') { fv.zoom = 1; fv.px = fv.py = 0; flatLayout(); } if (f === 'in') zoomAt(1.25); if (f === 'out') zoomAt(.8); if (f === 'grid' || f === 'safe' || f === 'snap') { fv[f] = !fv[f]; b.classList.toggle('on', fv[f]); ui.drawFlat(); } });
}

/* ---------- 3D bridge ---------- */
let drag3 = null;
Forge.pick3D = function (sd, mx, my, phase) {
  if (phase === 'down') { const el = selEl(); if (!el || el.locked || sideOf(el.id) !== sd) return false; const hit = hitTest(sd, mx, my); if (!hit || !selIds.includes(hit.id)) return false; drag3 = { mx, my, starts: selEls().filter(x => sideOf(x.id) === sd && !x.locked).map(g => [g, g.x, g.y]) }; return true; }
  if (phase === 'move') { if (!drag3) return false; for (const [g, x0, y0] of drag3.starts) { g.x = x0 + mx - drag3.mx; g.y = y0 + my - drag3.my; } liveEdit(); return true; }
  if (phase === 'up') { if (drag3) { drag3 = null; elChanged(false); renderInspector(); } return true; }
  if (phase === 'click') { if (!sd) { select(null); return true; } const hit = hitTest(sd, mx, my); if (hit) select(hit.id); else select(null); return true; }
  return false;
};
let autoFlat = false;
Forge.attachView = function (v) {
  view = v; if (autoFlat) { autoFlat = false; setView('3d'); } v.setCard(); v.setScene(); v.flipTo(side, true); for (const s of ['front', 'back']) if (last[s]) v.setMaps(last[s]); v.setUV(uvOn);
  $('#loading').classList.add('gone'); ui.hud();
  if (P.scene.pose === 'lanyard' || P.scene.pose === 'stand') setTimeout(() => v.camPreset('hero'), 50);
};
Forge.viewFailed = function (msg) {
  if (view) return; autoFlat = true;
  $('#loading').innerHTML = `<div>The 3D studio couldn’t start here<small>${esc(msg)}. The flat editor, saving and flat exports still work.</small></div>`;
  setView('flat'); setTimeout(() => $('#loading').classList.add('gone'), 4500);
};
ui.hud = function () { const r = last[side], S = sub(); $('#hud').innerHTML = `${side === 'front' ? 'Front' : 'Back'} · ${esc(S.label)}${r ? `<br>${r.pw} × ${r.ph} px${r.tier === 'p' ? ' preview' : ''} · ${Math.round(r.ms || 0)} ms` : ''}${uvOn ? '<br>UV blacklight' + (torchOn ? ' · torch' : '') : ''}`; };
function setView(m) { viewMode = m; const st = $('#stage'); st.classList.toggle('split', m === 'split'); st.classList.toggle('flat', m === 'flat'); $$('#viewSeg button').forEach(b => b.classList.toggle('on', b.dataset.v === m)); requestAnimationFrame(() => { flatLayout(); if (view) { view.resize(); view.setActive(m !== 'flat'); } }); }
function toggleUV(force) { uvOn = force ?? !uvOn; $('#uvBtn').classList.toggle('on', uvOn); if (!uvOn && torchOn) { torchOn = false; $('#dock [data-a=torch]').classList.remove('on'); if (view) view.setTorch(false); } if (view) view.setUV(uvOn); ui.drawFlat(); ui.hud(); }

/* ---------- images ---------- */
function pickImage(cb) { const f = $('#fileImg'); f.value = ''; f.onchange = () => { const file = f.files && f.files[0]; if (file) readImage(file, cb); }; f.click(); }
function readImage(file, cb) {
  const fr = new FileReader(); fr.onload = () => { const img = new Image(); img.onload = () => { const max = 2000, s = Math.min(1, max / Math.max(img.width, img.height)); let url = fr.result; if (s < 1 || file.size > 1.2e6) { const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); const png = /png|webp|gif/.test(file.type); url = c.toDataURL(png ? 'image/png' : 'image/jpeg', .9); } const id = 'a' + uid(); P.assets[id] = url; cb(id); }; img.onerror = () => toast('That image couldn’t be read.'); img.src = fr.result; }; fr.readAsDataURL(file);
}

/* ---------- modal + exports ---------- */
let modalFn = null;
function showModal(html, fn, wide) { $('#sheet').innerHTML = html; $('#sheet').classList.toggle('wide', !!wide || /tgrid|libgrid/.test(html)); $('#modal').hidden = false; modalFn = fn || null; }
function closeModal() { $('#modal').hidden = true; $('#sheet').innerHTML = ''; modalFn = null; }
async function saveFile(name, data) {
  try {
    const cl = window.claude, d = cl && cl.use ? await cl.use('downloads') : null;
    if (!d) {
      const blob = data instanceof Blob ? data : new Blob([data], { type: /\.json$/.test(name) ? 'application/json' : 'text/plain' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.style.display = 'none';
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 10000);
      toast('Downloaded ' + name); return true;
    }
    await d.save({ filename: name, data }); toast('Saved ' + name); return true;
  } catch (e) { const c = e && e.code; toast(c === 'declined' ? 'Save cancelled.' : c === 'too_large' ? 'That file is too large for this destination; try a smaller size.' : c === 'rate_limited' ? 'Another save is waiting; try again in a moment.' : 'Couldn’t save: ' + ((e && e.message) || c || 'unknown error')); return false; }
}
const toBlob = (c, type, q) => new Promise(r => c.toBlob(r, type || 'image/png', q));
const slug = () => ((docMeta.name || P.front.find(e => e.type === 'text')?.text || 'card') + '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 32) || 'card';
function cloneCanvas(A, E, clear) { const c = document.createElement('canvas'); c.width = A.width; c.height = A.height; const x = c.getContext('2d'); if (clear && E) { x.fillStyle = sub().disp || '#333'; x.fillRect(0, 0, c.width, c.height); x.drawImage(E, 0, 0); } else x.drawImage(A, 0, 0); return c; }
function flatSide(sd) { const r = renderSide(sd, 'f'); last[sd] = r; const c = cloneCanvas(r.A, r.E, sub().clear), out = document.createElement('canvas'); out.width = c.width; out.height = c.height; const x = out.getContext('2d'); x.save(); cardPath(x, c.width / P.card.w); x.clip('evenodd'); x.drawImage(c, 0, 0); x.restore(); return out; }
async function proofSheet() {
  const C = P.card, fA = flatSide('front'), bA = flatSide('back'), pw = fA.width, ph = fA.height, m = Math.round(pw * .12), gap = Math.round(pw * .1), W = m * 2 + pw * 2 + gap, H = m * 2 + ph + Math.round(m * .5);
  const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); x.fillStyle = '#ffffff'; x.fillRect(0, 0, W, H);
  for (const [img, ox, lab] of [[fA, m, 'FRONT'], [bA, m + pw + gap, 'BACK']]) {
    x.drawImage(img, ox, m); x.strokeStyle = '#000'; x.lineWidth = Math.max(1, pw / 1500); const L = m * .45, o = m * .12;
    for (const [cx, cy] of [[0, 0], [pw, 0], [0, ph], [pw, ph]]) { const sx = cx ? 1 : -1, sy = cy ? 1 : -1; x.beginPath(); x.moveTo(ox + cx + sx * o, m + cy); x.lineTo(ox + cx + sx * (o + L), m + cy); x.moveTo(ox + cx, m + cy + sy * o); x.lineTo(ox + cx, m + cy + sy * (o + L)); x.stroke(); }
    x.fillStyle = '#333'; x.font = `600 ${Math.round(m * .18)}px "Inter Tight", sans-serif`; x.fillText(lab, ox, m + ph + m * .42);
  }
  x.fillStyle = '#777'; x.font = `${Math.round(m * .13)}px "Inter Tight", sans-serif`; x.textAlign = 'right'; x.fillText(`ID Forge proof · ${C.w} × ${C.h} mm · ${pw} px wide · fictional design`, W - m, m + ph + m * .42);
  return toBlob(c);
}
function openExport() {
  const no3d = view ? '' : ' disabled';
  showModal(`<h2>Render &amp; export</h2><p>Everything renders on your machine. Each save asks you to confirm first.</p>
  <div class="opts">
   <div class="opt"><b>Beauty shot</b><small>The current 3D view at high resolution, with every light and lens effect.</small><div class="ctl"><select id="xShot" class="btn" aria-label="Resolution"><option value="2">2× screen</option><option value="3840" selected>3840 wide</option><option value="7680">7680 wide</option></select><button class="btn acc" data-x="shot"${no3d}>PNG</button></div></div>
   <div class="opt"><b>Front + back shot</b><small>Two renders side by side, the card flipped between them.</small><div class="ctl"><button class="btn" data-x="pair"${no3d}>PNG</button></div></div>
   <div class="opt"><b>Turntable film</b><small>A slow orbit with light raking across foil and holograms.</small><div class="ctl"><select id="xSec" class="btn" aria-label="Length"><option value="6">6 s</option><option value="10">10 s</option></select><button class="btn" data-x="film"${no3d}>Record</button></div></div>
   ${appMode === 'poster' ? '<div class="opt"><b>Print file</b><small>The poster flat, sized for printing at the chosen resolution (big posters are capped at 8000 px on the long edge).</small><div class="ctl"><select id="xDpi" class="btn" aria-label="Print resolution"><option value="150">150 dpi</option><option value="300" selected>300 dpi</option></select><button class="btn acc" data-x="pprint">PNG</button></div></div>' : ''}
   ${appMode === 'logo' ? '<div class="opt"><b>Logo artwork</b><small>Just the design on a transparent background at 4096 px, with no material behind it. Ready for the web, print or a game.</small><div class="ctl"><button class="btn" data-x="logoart">Transparent PNG</button></div></div>' : ''}
   <div class="opt"><b>Flat artwork</b><small>Each side at full texture resolution, transparent outside the card.</small><div class="ctl"><button class="btn" data-x="ffront">Front</button><button class="btn" data-x="fback">Back</button></div></div>
   <div class="opt"><b>Print proof sheet</b><small>Front and back flat, with crop marks.</small><div class="ctl"><button class="btn" data-x="proof">PNG</button></div></div>
   <div class="opt"><b>Project file</b><small>The whole design, images included, as JSON to reopen anywhere.</small><div class="ctl"><button class="btn" data-x="save">Export</button><button class="btn" data-x="open">Import…</button><button class="btn" data-x="copy">Copy</button></div></div>
  </div><div class="prog" id="xProg" hidden><i></i></div><div class="mrow"><button class="btn" data-x="close">Close</button></div>`, async (a, btn) => {
    const prog = (v) => { const p = $('#xProg'); if (!p) return; p.hidden = v == null; if (v != null) p.firstChild.style.width = Math.round(v * 100) + '%'; };
    const busy = async (fn) => { btn.disabled = true; prog(.3); await new Promise(r => setTimeout(r, 30)); try { await fn(); } catch (e) { toast('Export failed: ' + e.message); } prog(null); btn.disabled = false; };
    if (a === 'shot' && view) await busy(async () => saveFile(`${slug()}-shot.png`, await view.snapshot(+$('#xShot').value)));
    if (a === 'pair' && view) await busy(async () => saveFile(`${slug()}-front-back.png`, await view.snapshotPair(2)));
    if (a === 'film' && view) { if (typeof MediaRecorder === 'undefined') return toast('Recording isn’t supported in this browser.'); btn.disabled = true; try { const r = await view.record(+$('#xSec').value, p => prog(p)); await saveFile(`${slug()}-turntable.${r.ext}`, r.blob); } catch (e) { toast('Recording failed: ' + e.message); } prog(null); btn.disabled = false; }
    if (a === 'pprint') await busy(async () => {
      const C = P.card, dpi = +$('#xDpi').value, want = Math.round(Math.max(C.w, C.h) / 25.4 * dpi), res = Math.min(8000, want), r = renderSide(side, 'f', { res, albedoOnly: true }), S = sub();
      const c = document.createElement('canvas'); c.width = r.A.width; c.height = r.A.height; const x = c.getContext('2d'); x.save(); cardPath(x, r.A.width / C.w); x.clip('evenodd'); if (S.clear && r.E) { x.fillStyle = S.disp || '#333'; x.fillRect(0, 0, c.width, c.height); x.drawImage(r.E, 0, 0); } else x.drawImage(r.A, 0, 0); x.restore();
      await saveFile(`${slug()}-print-${dpi}dpi.png`, await toBlob(c)); invalidate(); if (res < want) toast(`Capped at 8000 px, about ${Math.round(8000 / (Math.max(C.w, C.h) / 25.4))} dpi at this size.`);
    });
    if (a === 'logoart') await busy(async () => { const r = renderSide('front', 'art', { res: 4096, art: true, albedoOnly: true }); await saveFile(`${slug()}-logo.png`, await toBlob(r.A)); invalidate(); });
    if (a === 'ffront' || a === 'fback') await busy(async () => { const sd = a === 'ffront' ? 'front' : 'back'; await saveFile(`${slug()}-${sd}.png`, await toBlob(flatSide(sd))); invalidate(); });
    if (a === 'proof') await busy(async () => { await saveFile(`${slug()}-proof.png`, await proofSheet()); invalidate(); });
    if (a === 'save') await saveFile(`${slug()}.idforge.json`, JSON.stringify({ app: 'ID Forge', v: 2, ...P }));
    if (a === 'open') importFile();
    if (a === 'copy') { try { await navigator.clipboard.writeText(JSON.stringify({ app: 'ID Forge', v: 2, ...P })); toast('Project JSON copied'); } catch (e) { toast('Copy was blocked by the browser.'); } }
    if (a === 'close') closeModal();
  });
}
function openHelp() {
  const K = [['Ctrl S', 'Save to your library'], ['Ctrl Shift S', 'Save as a new card'], ['Ctrl O', 'Open your library'], ['Ctrl Z / Ctrl Shift Z', 'Undo / redo'], ['Ctrl C / Ctrl V', 'Copy / paste elements (works across sides and cards)'], ['Ctrl D', 'Duplicate selection'], ['Ctrl A', 'Select everything on this side'], ['Delete', 'Delete selection'], ['Arrows', 'Nudge 0.25 mm (Shift: 2 mm)'], ['[ and ]', 'Send backward / bring forward'], ['Shift-click, drag a box', 'Select several (Flat view)'], ['Shift while resizing', 'Keep proportions, scale text'], ['Alt while dragging', 'Turn snapping off'], ['Wheel / Space-drag', 'Zoom / pan the flat view'], ['0', 'Fit the flat view'], ['G', 'Toggle the millimetre grid'], ['F', 'Flip the card'], ['U', 'UV blacklight'], ['Double-click the 3D card', 'Fly in close'], ['Esc', 'Deselect / close']];
  showModal(`<h2>Shortcuts</h2><p>Ctrl means Cmd on a Mac.</p><table class="keys">${K.map(([k, d]) => `<tr><td><span class="kbd">${esc(k)}</span></td><td>${esc(d)}</td></tr>`).join('')}</table><div class="mrow"><button class="btn" data-x="close">Close</button></div>`, (a) => { if (a === 'close') closeModal(); });
}
ui.signPad = function (el) {
  showModal(`<h2>Sign here</h2><p>Draw with a mouse, finger or stylus. Faster strokes come out thinner, like a real pen.</p><canvas class="sigpad" id="sigpad"></canvas><div class="mrow"><button class="btn" data-x="clear">Clear</button><button class="btn" data-x="close">Cancel</button><button class="btn acc" data-x="use">Use signature</button></div>`, (a) => {
    if (a === 'clear') { strokes = []; x.clearRect(0, 0, cv.width, cv.height); }
    if (a === 'close') closeModal();
    if (a === 'use') {
      const pts = strokes.flat(); if (pts.length < 3) return toast('Draw something first.');
      let x0 = 1, y0 = 1, x1 = 0, y1 = 0; for (const p of pts) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }
      const bw = Math.max(.01, x1 - x0), bh = Math.max(.01, y1 - y0), r = cv.getBoundingClientRect(), asp = (bw * r.width) / (bh * r.height);
      el.strokes = strokes.filter(s => s.length > 1).map(s => s.map(p => [+((p[0] - x0) / bw * .92 + .04).toFixed(4), +((p[1] - y0) / bh * .92 + .04).toFixed(4), +p[2].toFixed(2)]));
      el.h = clamp(el.w / asp, 2, 40); closeModal(); renderInspector(); elChanged(false);
    }
  });
  const cv = $('#sigpad'), b0 = cv.getBoundingClientRect(), d = devicePixelRatio || 1; cv.width = b0.width * d; cv.height = b0.height * d; const x = cv.getContext('2d'); x.scale(d, d); x.lineCap = 'round'; x.strokeStyle = '#1f2b5c';
  let strokes = [], cur = null, lt = 0;
  const add = (e) => { const b = cv.getBoundingClientRect(), px = e.clientX - b.left, py = e.clientY - b.top, p = cur[cur.length - 1]; let w = 1; if (p) { const v = Math.hypot(px - p[3], py - p[4]) / Math.max(1, e.timeStamp - lt); w = clamp(1.55 - v * .9, .4, 1.6); if (e.pointerType === 'pen' && e.pressure) w = .35 + e.pressure * 1.4; w = p[2] * .6 + w * .4; x.lineWidth = 2.6 * w; x.beginPath(); x.moveTo(p[3], p[4]); x.lineTo(px, py); x.stroke(); } lt = e.timeStamp; cur.push([px / b.width, py / b.height, w, px, py]); };
  cv.onpointerdown = e => { cv.setPointerCapture(e.pointerId); cur = []; strokes.push(cur); add(e); };
  cv.onpointermove = e => { if (cur) add(e); };
  cv.onpointerup = cv.onpointercancel = () => { cur = null; };
};

/* ---------- main menu ---------- */
const MENU_TPL = { card: 'aurelian', logo: 'lg_lion', poster: 'ps_propaganda' };
function openMenu(first) {
  const mm = $('#mainMenu'); mm.hidden = false; mm.classList.toggle('first', !!first); $('#menuClose').hidden = !!first && !localStorage.getItem(saveKey());
  for (const b of $$('#mainMenu .mtile')) {
    const m = b.dataset.m, saved = (() => { try { const o = JSON.parse(localStorage.getItem(saveKey(m)) || 'null'); return o && o.P ? (o.meta?.name || 'Untitled ' + MODES[m].noun) : ''; } catch (e) { return ''; } })();
    b.classList.toggle('cur', m === appMode); const st = b.querySelector('.mst'); if (st) st.textContent = m === appMode ? 'Open now · ' + (docMeta.name || 'Untitled ' + MODES[m].noun) : saved ? 'Continue · ' + saved : 'Start from a template';
    const th = b.querySelector('.mth'); if (th && !th.firstChild) setTimeout(() => { try { const t = TEMPLATES.find(x => x.id === MENU_TPL[m]); if (!t) return; let c = thumbCache.get('menu:' + m); if (!c) { c = renderThumb(t.build(), 520); thumbCache.set('menu:' + m, c); invalidate(); } const cl = document.createElement('canvas'); cl.width = c.width; cl.height = c.height; cl.getContext('2d').drawImage(c, 0, 0); th.appendChild(cl); } catch (e) { } }, 30);
  }
  setTimeout(() => ($('#mainMenu .mtile.cur') || $('#mainMenu .mtile')).focus(), 30);
}
function closeMenu() { $('#mainMenu').hidden = true; }

/* ---------- init ---------- */
function init() {
  const grid = $('#addGrid'); renderAddGrid();
  grid.addEventListener('click', e => { const b = e.target.closest('button[data-t]'); if (b) addEl(b.dataset.t); });
  $('#leftTabs').onclick = e => { const b = e.target.closest('button[data-l]'); if (!b) return; $$('#leftTabs button').forEach(x => x.classList.toggle('on', x === b)); const pr = b.dataset.l === 'presets'; $('#leftAdd').hidden = pr; $('#leftPresets').hidden = !pr; if (pr) { renderPresetCats(); renderPresetGrid(); } };
  $('#presetCats').onclick = e => { const b = e.target.closest('button[data-c]'); if (!b) return; presetCat = b.dataset.c; renderPresetCats(); renderPresetGrid(); };
  $('#presetGrid').onclick = async e => {
    const del = e.target.closest('[data-del]');
    if (del) { e.stopPropagation(); if (!del.classList.contains('confirm')) { del.classList.add('confirm'); del.textContent = 'Delete?'; setTimeout(() => { if (del.isConnected) { del.classList.remove('confirm'); del.textContent = '×'; } }, 3000); return; } try { await dropUserPreset(del.dataset.del); userPresets = null; renderPresetGrid(); toast('Preset deleted'); } catch (x) { toast('Couldn’t delete that preset.'); } return; }
    const u = e.target.closest('[data-u]'); if (u) { const rec = (userPresets || []).find(r => r.id === u.dataset.u); if (!rec) return; const els = instantiateComponent({ ...rec, user: true }, P.card); for (const el of els) P[side].push(el); setSel(els.map(x => x.id)); renderLayers(); renderInspector(); showTab('el'); elChanged(false, ['front', 'back']); toast(`Added “${rec.name}” to the ${side}`); return; }
    const b = e.target.closest('button[data-i]'); if (b) insertComponent(+b.dataset.i);
  };
  $('#presetGrid').addEventListener('change', e => { if (e.target.id === 'layRep') layReplace = e.target.checked; });
  $('#presetGrid').addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-u]')) { e.preventDefault(); e.target.click(); } });
  $$('#modeSeg button').forEach(b => b.onclick = () => switchMode(b.dataset.m));
  $('#menuBtn').onclick = openMenu; $('#menuClose').onclick = closeMenu; $('#mainMenu').addEventListener('click', e => { const t = e.target.closest('[data-m]'); if (t) { closeMenu(); switchMode(t.dataset.m); } else if (e.target.id === 'mainMenu') closeMenu(); });
  $('#newBtn').onclick = openGallery; $('#libBtn').onclick = openLibrary; $('#saveBtn').onclick = () => saveDesign(false); $('#status').onclick = openLibrary; $('#helpBtn').onclick = openHelp;
  $('#undo').onclick = undo; $('#redo').onclick = redo;
  $('#viewSeg').onclick = e => { const b = e.target.closest('button[data-v]'); if (b) setView(b.dataset.v); };
  $('#sideSeg').onclick = e => { const b = e.target.closest('button[data-s]'); if (b) setSide(b.dataset.s, true); };
  $('#tabs').onclick = e => { const b = e.target.closest('button[data-t]'); if (b) showTab(b.dataset.t); };
  $('#uvBtn').onclick = () => toggleUV();
  $('#exportBtn').onclick = openExport;
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal') return closeModal(); const b = e.target.closest('[data-x]'); if (b && modalFn) modalFn(b.dataset.x, b); });
  $('#dock').addEventListener('click', e => {
    const b = e.target.closest('button[data-a]'); if (!b) return; const a = b.dataset.a;
    if (a === 'flip') return setSide(side === 'front' ? 'back' : 'front', true);
    if (!view) return toast('The 3D studio isn’t running.');
    if (a === 'torch') { torchOn = !torchOn; b.classList.toggle('on', torchOn); if (torchOn && !uvOn) toggleUV(true); view.setTorch(torchOn); ui.hud(); return; }
    if (a === 'sweep') return view.sweep();
    b.classList.toggle('on', view.toggle(a));
  });
  $('#dock select').onchange = e => { if (view && e.target.value) view.camPreset(e.target.value); e.target.value = ''; };
  const stage = $('#stage');
  stage.addEventListener('dragover', e => { if ([...(e.dataTransfer?.items || [])].some(i => i.kind === 'file')) e.preventDefault(); });
  stage.addEventListener('drop', e => {
    const files = [...(e.dataTransfer?.files || [])]; const proj = files.find(f => /\.json$/i.test(f.name) || f.type === 'application/json'); if (proj) { e.preventDefault(); return readProjectFile(proj); }
    const file = files.find(f => /^image\//.test(f.type)); if (!file) return; e.preventDefault();
    readImage(file, id => { const el = makeEl('photo', { asset: id, name: file.name.replace(/\.[^.]+$/, '').slice(0, 30) || 'Image', fit: 'contain', radius: 0 }); const C = P.card, img = new Image(); img.onload = () => { const s = Math.min(C.w * .5 / img.width, C.h * .6 / img.height); el.w = img.width * s; el.h = img.height * s; el.x = C.w / 2; el.y = C.h / 2; P[side].push(el); select(el.id); elChanged(false, [side]); }; img.src = P.assets[id]; });
  });
  window.addEventListener('keyup', e => { if (e.code === 'Space') { spaceDown = false; flat.style.cursor = ''; } });
  window.addEventListener('keydown', e => {
    const tag = (e.target && e.target.tagName) || ''; const mod = e.metaKey || e.ctrlKey, k = e.key.toLowerCase();
    if (mod && k === 's') { e.preventDefault(); saveDesign(e.shiftKey); return; }
    if (/INPUT|TEXTAREA|SELECT/.test(tag)) { if (e.key === 'Escape') e.target.blur(); return; }
    if (!$('#mainMenu').hidden) { if (e.key === 'Escape') closeMenu(); return; }
    if (!$('#modal').hidden) { if (e.key === 'Escape') closeModal(); return; }
    if (mod && k === 'o') { e.preventDefault(); openLibrary(); return; }
    if (mod && k === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
    if (mod && k === 'y') { e.preventDefault(); redo(); return; }
    if (mod && k === 'd') { e.preventDefault(); duplicateSel(); return; }
    if (mod && k === 'c') { if (selIds.length) { e.preventDefault(); copySel(); } return; }
    if (mod && k === 'v') { e.preventDefault(); pasteClip(); return; }
    if (mod && k === 'a') { e.preventDefault(); setSel(P[side].filter(x => !x.locked && x.visible !== false).map(x => x.id)); renderLayers(); renderInspector(); ui.drawFlat(); return; }
    if (mod) return;
    if (e.code === 'Space' && viewMode !== '3d') { spaceDown = true; flat.style.cursor = 'grab'; e.preventDefault(); return; }
    const el = selEl();
    if (e.key === 'Delete' || e.key === 'Backspace') { if (selIds.length) { e.preventDefault(); removeSel(); } return; }
    if (e.key === 'Escape') return select(null);
    if (e.key === '?') return openHelp();
    if (k === 'f') return setSide(side === 'front' ? 'back' : 'front', true);
    if (k === 'u') return toggleUV();
    if (k === 'g') { fv.grid = !fv.grid; $('#flatbar [data-f=grid]').classList.toggle('on', fv.grid); return ui.drawFlat(); }
    if (k === '0') { fv.zoom = 1; fv.px = fv.py = 0; return flatLayout(); }
    if (e.key === ']' && el) return reorder(el, 1);
    if (e.key === '[' && el) return reorder(el, -1);
    if (e.key.startsWith('Arrow') && selIds.length) { e.preventDefault(); const st = e.shiftKey ? 2 : .25; for (const s of selEls()) { if (s.locked) continue; if (e.key === 'ArrowLeft') s.x -= st; if (e.key === 'ArrowRight') s.x += st; if (e.key === 'ArrowUp') s.y -= st; if (e.key === 'ArrowDown') s.y += st; } liveEdit(); commit(500); }
  });
  window.addEventListener('beforeunload', () => { try { localStorage.setItem(saveKey(), JSON.stringify({ P, meta: { id: docMeta.id, name: docMeta.name, savedSnap: docMeta.savedSnap }, ts: Date.now() })); } catch (e) { } });
  bindLayers(); bindFlat();
  Lib.localTs = loadSaved(); if (!Lib.localTs) applyTemplate(MODES[appMode].tpl); setModeUI((P.card && P.card.mode) || appMode);
  hist.stack = [snapState()]; hist.i = 0; updUndo();
  refreshAll(); updStatus();
  new ResizeObserver(() => flatLayout()).observe(stage);
  window.addEventListener('load', () => { fontAsked.clear(); invalidate(); });
  if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', () => invalidate());
  setTimeout(() => { if (document.fonts) Promise.allSettled(Object.keys(FONTS).filter(f => !SYS_FONTS.has(f)).flatMap(f => [400, 700].map(w => document.fonts.load(`${w} 24px "${f}"`)))).then(() => { fontAsked.clear(); thumbCache.clear(); presetThumbs.clear(); invalidate(); }); }, 2500);
  setTimeout(() => Lib.init(), 0);
  if (!/[?&#]nomenu/.test(location.href)) openMenu(true);
  setTimeout(() => { if (!view && !$('#loading').classList.contains('gone')) Forge.viewFailed('The 3D engine took too long to load'); }, 20000);
}
init();
