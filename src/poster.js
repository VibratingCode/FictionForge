/* ================= poster mode: sizes, materials and sign elements ================= */
/* ---------- formats (inserted ahead of "Custom size") ---------- */
(() => {
  const cu = FORMATS.custom; delete FORMATS.custom;
  const pf = (k, label, w, h, o = {}) => { FORMATS[k] = { label, w, h, r: 0, thick: .2, poster: true, slot: 'none', ...o }; };
  const mm = (w, h) => `${Math.round(w)} × ${Math.round(h)}`;
  [['ps_a4', 'A4 portrait', 210, 297], ['ps_a4l', 'A4 landscape', 297, 210], ['ps_a3', 'A3 portrait', 297, 420], ['ps_a3l', 'A3 landscape', 420, 297], ['ps_a2', 'A2 portrait', 420, 594], ['ps_letter', 'US Letter', 215.9, 279.4], ['ps_tabloid', 'Tabloid 11 × 17 in', 279.4, 431.8], ['ps_1824', '18 × 24 in', 457.2, 609.6], ['ps_2436', '24 × 36 in', 609.6, 914.4]].forEach(([k, n, w, h]) => pf(k, `Poster · ${n} · ${mm(w, h)}`, w, h));
  pf('ps_a5', 'Flyer · A5 · 148 × 210', 148, 210);
  pf('ps_banner', 'Banner · 3:1 · 900 × 300', 900, 300, { thick: .4 });
  [['sg_710', '7 × 10 in portrait', 177.8, 254], ['sg_107', '10 × 7 in landscape', 254, 177.8], ['sg_1014', '10 × 14 in portrait', 254, 355.6], ['sg_1410', '14 × 10 in landscape', 355.6, 254], ['sg_1420', '14 × 20 in portrait', 355.6, 508], ['sg_2014', '20 × 14 in landscape', 508, 355.6], ['sg_1212', '12 × 12 in square', 304.8, 304.8]].forEach(([k, n, w, h]) => pf(k, `Sign · ${n}`, w, h, { r: 6, thick: 1, slot: 'corners4' }));
  pf('sg_label', 'Label · 5 × 3.5 in', 127, 88.9, { r: 4, thick: .3 });
  pf('sg_tag', 'Lockout tag · 3 × 5.75 in', 76.2, 146, { r: 5, thick: .5, slot: 'hole' });
  FORMATS.custom = cu;
})();

/* ---------- materials ---------- */
Object.assign(SUBS, {
  poster_matte: { label: 'Matte poster paper', color: '#f3f0e8', rough: .9, metal: 0, clear: 0, thick: .2, tex: 'paper', flex: true, fluor: '#6d7dff', laser: '#4b2e19', edge: '#ebe6da', poster: true },
  poster_gloss: { label: 'Gloss poster paper', color: '#f7f6f2', rough: .32, metal: 0, clear: 0, thick: .2, flex: true, cc: .85, ccr: .06, fluor: '#6d7dff', laser: '#3a2a1c', edge: '#efede6', poster: true },
  newsprint: { label: 'Newsprint', color: '#e3ded0', rough: .97, metal: 0, clear: 0, thick: .1, tex: 'newsprint', flex: true, fluor: null, laser: '#3b2a1a', edge: '#d9d3c3', poster: true },
  aged: { label: 'Aged paper', color: '#ead9b2', rough: .94, metal: 0, clear: 0, thick: .18, tex: 'aged', flex: true, fluor: null, laser: '#4b2e19', edge: '#d8c494', poster: true },
  alu_white: { label: 'Painted aluminium sign', color: '#f4f4f1', rough: .38, metal: 0, clear: 0, thick: 1, tex: 'peel', cc: .45, ccr: .14, laser: '#2a2c30', edge: '#c9cdd2', poster: true },
  alu_brushed: { label: 'Brushed aluminium sign', color: '#d5d8dc', rough: .3, metal: 1, clear: 0, thick: 1, tex: 'brushed', aniso: .7, laser: '#2a2c30', poster: true },
  reflective: { label: 'Reflective sign sheeting', color: '#f6f6f4', rough: .26, metal: 0, clear: 0, thick: 1.1, tex: 'prism', cc: .6, ccr: .08, laser: '#2a2c30', edge: '#c9cdd2', poster: true },
  coroplast: { label: 'Corrugated plastic', color: '#f2f2ee', rough: .55, metal: 0, clear: 0, thick: 4, tex: 'flutes', laser: '#2a2a2a', edge: '#e4e4de', poster: true },
  rusty: { label: 'Rusted tin', color: '#ddd6c4', rough: .66, metal: 0, clear: 0, thick: .6, tex: 'rust', laser: '#3a2a1c', edge: '#6a4a34', poster: true },
  planks: { label: 'Wooden planks', color: '#b88c5e', rough: .82, metal: 0, clear: 0, thick: 12, tex: 'planks', laser: '#2c1a0e', edge: '#8a6440', poster: true },
  concrete: { label: 'Concrete wall', color: '#b1aea7', rough: .96, metal: 0, clear: 0, thick: 20, tex: 'concrete', laser: '#2a2a2a', edge: '#9a968f', poster: true },
  vinyl_black: { label: 'Black vinyl', color: '#1c1d20', rough: .5, metal: 0, clear: 0, thick: .3, cc: .3, ccr: .2, laser: '#d8d8d8', edge: '#141416', poster: true },
});
const POSTER_SUBS = ['poster_matte', 'poster_gloss', 'newsprint', 'aged', 'paper', 'kraft', 'cardstock', 'laminated', 'alu_white', 'alu_brushed', 'reflective', 'coroplast', 'pvc', 'enamel', 'rusty', 'steel', 'brass', 'iron', 'blackmetal', 'planks', 'wood', 'concrete', 'felt', 'vinyl_black', 'clearpvc', 'frosted', 'smoked', 'holopvc', 'acr_green', 'acr_orange', 'acr_pink', 'acr_blue', 'acr_yellow'].filter(k => SUBS[k]);

/* ---------- poster material textures (seamless tiles; some also weather the printed design) ---------- */
const PTEX = (() => {
  const cache = new Map(), T = TEXN, sm = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const rgba = (key, size, f) => { if (cache.has(key)) return cache.get(key); const cv = document.createElement('canvas'); cv.width = cv.height = size; const x = cv.getContext('2d'), im = x.createImageData(size, size), d = im.data; for (let j = 0; j < size; j++) for (let i = 0; i < size; i++) { const q = f(i / size, j / size), p = (j * size + i) * 4; d[p] = q[0]; d[p + 1] = q[1]; d[p + 2] = q[2]; d[p + 3] = q[3]; } x.putImageData(im, 0, 0); cache.set(key, cv); return cv; };
  const dots = (key, size, n, r0, r1, col, a0, a1, seed) => {   // speckles, wrapped at the edges so the tile repeats cleanly
    if (cache.has(key)) return cache.get(key); const cv = document.createElement('canvas'); cv.width = cv.height = size; const x = cv.getContext('2d'), R = rng(seed); x.fillStyle = col;
    for (let i = 0; i < n; i++) { const px = R() * size, py = R() * size, r = r0 + Math.pow(R(), 2.2) * (r1 - r0), ry = r * (.55 + R() * .45), rot = R() * Math.PI, al = a0 + R() * (a1 - a0); x.globalAlpha = al; for (const dx of [-size, 0, size]) for (const dy of [-size, 0, size]) { const X = px + dx, Y = py + dy; if (X < -r || X > size + r || Y < -r || Y > size + r) continue; x.beginPath(); x.ellipse(X, Y, r, ry, rot, 0, Math.PI * 2); x.fill(); } }
    cache.set(key, cv); return cv; };
  const fibres = (key, size, n, seed) => {
    if (cache.has(key)) return cache.get(key); const cv = document.createElement('canvas'); cv.width = cv.height = size; const x = cv.getContext('2d'), R = rng(seed); x.lineCap = 'round';
    for (let i = 0; i < n; i++) { const px = R() * size, py = R() * size, a = R() * Math.PI, L = 4 + R() * 14, b = (R() - .5) * 8; x.globalAlpha = .1 + R() * .35; x.strokeStyle = R() < .5 ? '#000' : '#5a4a3a'; x.lineWidth = .6 + R() * .8; for (const dx of [-size, 0, size]) for (const dy of [-size, 0, size]) { x.beginPath(); x.moveTo(px + dx, py + dy); x.quadraticCurveTo(px + dx + Math.cos(a) * L / 2 + b, py + dy + Math.sin(a) * L / 2 - b, px + dx + Math.cos(a) * L, py + dy + Math.sin(a) * L); x.stroke(); } }
    cache.set(key, cv); return cv; };
  const rustField = () => { const f = T.fbm(101, 4, 6, .55), q = T.fbm(103, 16, 3, .5); return (u, v) => { const n = f(u, v) + (q(u, v) - .5) * .32; return [n, q(u, v)]; }; };
  return {
    specks: () => dots('specks', 512, 1100, .5, 2.2, '#1a1612', .08, .45, 11),
    pores: () => dots('pores', 512, 700, .6, 3.2, '#1b1a18', .25, .75, 19),
    lights: () => dots('lights', 512, 600, .5, 2.4, '#ffffff', .15, .55, 23),
    foxing: () => dots('foxing', 512, 160, 1, 9, '#8a5a2a', .05, .3, 37),
    fibres: () => fibres('fibres', 512, 420, 41),
    rust: () => { const F = rustField(); return rgba('rust', 512, (u, v) => { const [n, t] = F(u, v), a = sm(.5, .64, n), chip = sm(.7, .77, n); let r = lerp(104, 178, t), g = lerp(44, 84, t), b = lerp(14, 28, t); if (chip > 0) { r = lerp(r, 88, chip); g = lerp(g, 84, chip); b = lerp(b, 80, chip); } return [r, g, b, Math.round(255 * Math.min(1, a * (.82 + t * .35)))]; }); },
    rustMask: () => { const F = rustField(); return rgba('rustm', 512, (u, v) => [255, 255, 255, Math.round(255 * sm(.5, .64, F(u, v)[0]))]); },
    grain: () => { const tb = T.fbm(111, 4, 5, .5); return T.tile('woodgrain', 512, (u, v) => { const s = Math.abs(Math.sin((v * 34 + tb(u, v) * 5) * Math.PI)); return .64 + .24 * Math.pow(s, .6) - .14 * Math.pow(1 - s, 8); }); },
    prism: () => T.tile('prism', 128, (u, v) => { const fr = q => q - Math.floor(q), l = q => Math.min(fr(q), 1 - fr(q)), e = Math.min(l(u * 8), l((u + v) * 8), l((u - v) * 8)); return .55 + .45 * sm(0, .07, e); }),
    flutes: () => T.tile('flutes', 64, (u) => .5 + .5 * Math.cos(u * Math.PI * 2)),
  };
})();
let PT_ART = false;
(() => {
  const ptn = (c, k) => (cv, mm, rot = 0, sx = 1, sy = 1, ox = 0, oy = 0) => { const s = mm * k / cv.width, p = c.createPattern(cv, 'repeat'); p.setTransform(new DOMMatrix([s * sx * Math.cos(rot), s * sx * Math.sin(rot), -s * sy * Math.sin(rot), s * sy * Math.cos(rot), ox * k, oy * k])); return p; };
  const lay = (c, W, Hh) => (fill, op, a) => { c.save(); c.imageSmoothingQuality = 'high'; c.globalCompositeOperation = op; c.globalAlpha = a; c.fillStyle = fill; c.fillRect(0, 0, W, Hh); c.restore(); };
  const edgeShade = (c, k, col, a, d) => { const C = P.card; c.save(); c.globalCompositeOperation = 'multiply'; for (const [x0, y0, x1, y1] of [[0, 0, 0, d], [0, C.h, 0, C.h - d], [0, 0, d, 0], [C.w, 0, C.w - d, 0]]) { const g = c.createLinearGradient(x0 * k, y0 * k, x1 * k, y1 * k); g.addColorStop(0, hexA(col, a)); g.addColorStop(1, hexA(col, 0)); c.fillStyle = g; c.fillRect(0, 0, C.w * k, C.h * k); } c.restore(); };
  const boards = () => { const C = P.card, R = rng(C.seed * 53 + 7), out = []; let y = 0; while (y < C.h - 1) { const h = Math.min(C.h - y, 95 + R() * 60); out.push({ y, h, tone: .9 + R() * .16, off: R() * 300 }); y += h; } return out; };
  const seams = (c, k, col, a, wmm) => { const C = P.card; c.save(); c.globalAlpha = a; c.fillStyle = col; for (const b of boards()) if (b.y > 0) c.fillRect(0, (b.y - wmm / 2) * k, C.w * k, wmm * k); c.restore(); };
  const _subTexP = subTex;
  subTex = function (c, ch, k) {
    const C = P.card, S = sub(), W = C.w * k, Hh = C.h * k, tex = S.tex2 || S.tex, pt = ptn(c, k), layer = lay(c, W, Hh), T = TEXN;
    switch (tex) {
      case 'newsprint':
        if (ch === 'A') { layer(pt(T.clouds(), 50, .3), 'soft-light', .3); layer(pt(PTEX.specks(), 26), 'multiply', .35); layer(pt(PTEX.fibres(), 30, .7), 'multiply', .3); }
        else if (ch === 'H') layer(pt(T.fine(), 1.6), 'source-over', .22);
        return;
      case 'aged':
        if (ch === 'A') { layer(pt(T.clouds(), 95, .4), 'multiply', .2); layer(pt(T.clouds(), 36, 1.2), 'soft-light', .3); layer(pt(PTEX.fibres(), 34, .2), 'multiply', .2); edgeShade(c, k, '#8a6a3a', .32, Math.min(C.w, C.h) * .12); }
        else if (ch === 'H') { layer(pt(T.fine(), 2), 'source-over', .18); layer(pt(T.clouds(), 60), 'soft-light', .3); }
        return;
      case 'prism':
        if (ch === 'A') layer(pt(PTEX.prism(), 6), 'multiply', .05);
        else if (ch === 'H') layer(pt(PTEX.prism(), 6), 'source-over', .12);
        else layer(pt(PTEX.prism(), 6), 'screen', .25);
        return;
      case 'flutes':
        if (ch === 'A') layer(pt(PTEX.flutes(), 4), 'multiply', .045);
        else if (ch === 'H') layer(pt(PTEX.flutes(), 4), 'source-over', .2);
        return;
      case 'rust':
        if (ch === 'A') { layer(pt(T.clouds(), 60), 'multiply', .12); layer(pt(PTEX.rust(), 150, .3), 'source-over', .9); edgeShade(c, k, '#5a2e12', .45, Math.min(C.w, C.h) * .08); }
        else if (ch === 'H') { layer(pt(T.fine(), 3), 'source-over', .22); layer(pt(PTEX.rustMask(), 150, .3), 'source-over', .3); }
        else if (ch === 'R') layer(pt(PTEX.rustMask(), 150, .3), 'source-over', .5);
        return;
      case 'planks':
        if (ch === 'A') { for (const b of boards()) { c.save(); c.beginPath(); c.rect(0, b.y * k, W, b.h * k); c.clip(); c.globalCompositeOperation = 'multiply'; c.fillStyle = pt(PTEX.grain(), 110, 0, 3.2, 1, b.off, b.y); c.fillRect(0, 0, W, Hh); c.fillStyle = `rgba(${Math.round(255 * Math.min(1, b.tone))},${Math.round(240 * Math.min(1, b.tone))},${Math.round(225 * Math.min(1, b.tone))},1)`; c.fillRect(0, 0, W, Hh); c.restore(); } layer(pt(T.clouds(), 80, .1, 3, .6), 'soft-light', .25); seams(c, k, '#2a1a0c', .75, 2.2); }
        else if (ch === 'H') { layer(pt(PTEX.grain(), 110, 0, 3.2, 1), 'source-over', .3); seams(c, k, '#000000', 1, 3); }
        return;
      case 'concrete':
        if (ch === 'A') { layer(pt(T.clouds(), 70, .2), 'multiply', .22); layer(pt(T.clouds(), 22, 1.1), 'soft-light', .25); layer(pt(PTEX.specks(), 40), 'multiply', .5); layer(pt(PTEX.lights(), 34, .7), 'screen', .35); layer(pt(PTEX.pores(), 60, 1.4), 'multiply', .3); }
        else if (ch === 'H') { layer(pt(T.fine(), 2.5), 'source-over', .35); layer(pt(PTEX.pores(), 60, 1.4), 'multiply', .7); }
        else if (ch === 'R') layer(pt(T.fine(), 4), 'screen', .1);
        return;
    }
    _subTexP(c, ch, k);
  };
  /* weathering that sits on top of the printed design: rust eats the paint, wood seams and concrete show through */
  function postTex(c, ch, k) {
    if (PT_ART) return; const C = P.card, S = sub(), tex = S.tex2 || S.tex, W = C.w * k, Hh = C.h * k, pt = ptn(c, k), layer = lay(c, W, Hh), T = TEXN;
    if (ch !== 'A') { if (tex === 'planks' && ch === 'H') seams(c, k, '#000000', .8, 3); return; }
    if (tex === 'rust') { layer(pt(PTEX.rust(), 150, .3), 'source-over', .42); layer(pt(PTEX.rust(), 60, -1.1), 'source-over', .12); }
    else if (tex === 'planks') { layer(pt(PTEX.grain(), 110, 0, 3.2, 1), 'multiply', .28); seams(c, k, '#1e1208', .8, 2.2); }
    else if (tex === 'concrete') { layer(pt(PTEX.specks(), 40), 'multiply', .4); layer(pt(PTEX.pores(), 60, 1.4), 'multiply', .35); layer(pt(T.clouds(), 22, 1.1), 'soft-light', .3); layer(pt(PTEX.lights(), 34, .7), 'screen', .2); }
    else if (tex === 'aged') { layer(pt(PTEX.foxing(), 70, .2), 'multiply', .55); layer(pt(T.clouds(), 95, .4), 'multiply', .1); edgeShade(c, k, '#8a6a3a', .2, Math.min(C.w, C.h) * .1); }
    else if (tex === 'newsprint') layer(pt(PTEX.specks(), 26), 'multiply', .2);
  }
  const _ageP = age;
  age = function (c, ch, k, side) { postTex(c, ch, k); _ageP(c, ch, k, side); };
  const _rsP = renderSide;
  renderSide = function (side, tier, opts) { PT_ART = !!(opts && opts.art); try { return _rsP(side, tier, opts); } finally { PT_ART = false; } };
  Forge.renderSide = renderSide;
})();

/* ---------- drawing helpers ---------- */
function roundPoly(c, pts, r) { const n = pts.length, mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], s = mid(pts[n - 1], pts[0]); c.beginPath(); c.moveTo(s[0], s[1]); for (let i = 0; i < n; i++) { const p = pts[i], q = mid(p, pts[(i + 1) % n]); c.arcTo(p[0], p[1], q[0], q[1], r); } c.closePath(); }
function drawIconAt(c, icon, cx, cy, size, fill, k) { if (size <= 0) return; const px = Math.max(8, Math.min(4096, Math.round(size * k))), M = glyphMask(icon, px, px), T = tintedCopy(M, _gly.T, fill); c.drawImage(T, cx - size / 2, cy - size / 2, size, size); }
function fitText(c, text, font, weight, size, maxW, italic, track) { setFont(c, font, weight, size, italic); setSp(c, track * size); let w = c.measureText(text).width; if (w > maxW && w > 0) { size *= maxW / w; setFont(c, font, weight, size, italic); setSp(c, track * size); w = c.measureText(text).width; } return { size, w }; }
function textMid(c, text, x, cy) { const m = c.measureText(text), a = m.actualBoundingBoxAscent || 0, d = m.actualBoundingBoxDescent || 0; c.fillText(text, x, cy + (a - d) / 2); }
const _pst = { O: null };
function scratch(pw, ph) { const O = _pst.O || (_pst.O = document.createElement('canvas')); O.width = Math.max(2, Math.min(8192, pw)); O.height = Math.max(2, Math.min(8192, ph)); return O; }

/* ---------- safety-sign signal header ---------- */
const SIG_KINDS = [['danger', 'Danger (red)'], ['warning', 'Warning (orange)'], ['caution', 'Caution (yellow)'], ['notice', 'Notice (blue)'], ['safety', 'Safety (green)'], ['biohazard', 'Biohazard'], ['radiation', 'Radiation'], ['custom', 'Custom colours']];
const SIG_COL = { danger: ['#c8102e', '#ffffff'], warning: ['#f47b20', '#111111'], caution: ['#ffd100', '#111111'], notice: ['#0057b8', '#ffffff'], safety: ['#00843d', '#ffffff'], biohazard: ['#f26722', '#111111'], radiation: ['#ffd100', '#111111'] };
def('safety', 'Safety header', { w: 80, h: 16, kind: 'danger', word: 'DANGER', word2: '', look: 'ansi', symbol: 'auto', bg: '#5a2a8a', fg: '#ffffff', font: 'Archivo Black', weight: 400, tracking: .03, radius: 0 },
  [['kind', 'Signal word', 'select', SIG_KINDS], ['word', 'Word', 'text'], ['word2', 'Second line / language', 'text'], ['look', 'Style', 'select', [['ansi', 'Modern · symbol and band'], ['osha', 'Classic · panel and oval'], ['band', 'Plain band']]], ['symbol', 'Symbol', 'select', [['auto', 'Automatic'], ['alert', 'Alert triangle'], ['bio', 'Biohazard'], ['rad', 'Radiation'], ['none', 'None']]], ['bg', 'Band colour', 'color', null, e => e.kind === 'custom'], ['fg', 'Text colour', 'color', null, e => e.kind === 'custom'], ['font', 'Font', 'font'], ['weight', 'Weight', 'select', WEIGHTS], ['tracking', 'Tracking (em)', 'range', { min: -.05, max: .4, step: .01 }], ['radius', 'Corner radius (mm)', 'range', { min: 0, max: 30, step: .1 }]],
  function (c, el, ov, k) {
    const w = el.w, h = el.h, kind = el.kind, F = col => fillOf(ov, col), base = SIG_COL[kind] || [el.bg, el.fg];
    let panel = base[0], ink = base[1], oval = null;
    if (el.look === 'osha') { if (kind === 'danger') { panel = '#111111'; oval = base[0]; ink = '#ffffff'; } else if (kind === 'caution' || kind === 'radiation') { panel = '#111111'; ink = '#ffd100'; } }
    const sym = el.symbol === 'auto' ? (kind === 'biohazard' ? 'bio' : kind === 'radiation' ? 'rad' : el.look === 'ansi' && ['danger', 'warning', 'caution'].includes(kind) ? 'alert' : 'none') : el.symbol;
    const italic = kind === 'notice', w2 = (el.word2 || '').trim(), word = (el.word || '').trim();
    c.save(); c.beginPath(); rr(c, -w / 2, -h / 2, w, h, Math.min(el.radius || 0, h / 2, w / 2)); c.fillStyle = F(panel); c.fill();
    const symH = sym === 'none' ? 0 : h * (oval ? .58 : .72), symW = sym === 'alert' ? symH * 1.15 : symH, gap = symH ? h * .22 : 0;
    const mainS = h * (w2 ? .5 : (oval ? .5 : .64)), secS = h * .25;
    const maxText = w * (oval ? .7 : .9) - symW - gap;
    c.textAlign = 'left'; c.textBaseline = 'alphabetic';
    const m1 = fitText(c, word, el.font, el.weight, mainS, maxText, italic, el.tracking || 0);
    let tw = m1.w, m2 = null; if (w2) { m2 = fitText(c, w2, el.font, el.weight, secS, maxText, italic, el.tracking || 0); tw = Math.max(tw, m2.w); }
    const gw = symW + gap + tw, x0 = -gw / 2, cyMain = w2 ? -h * .12 : 0, cySec = h * .27;
    if (oval) {   // classic danger oval
      const ow = Math.min(w * .94, tw + symW + gap + h * 1.1), oh = h * .8; c.beginPath(); c.ellipse(0, 0, ow / 2, oh / 2, 0, 0, Math.PI * 2); c.fillStyle = F(oval); c.fill(); c.lineWidth = h * .055; c.strokeStyle = F('#ffffff'); c.stroke();
    }
    if (sym === 'alert') {
      const tx = x0 + symW / 2, top = -symH / 2, pts = [[tx, top], [tx + symW / 2, top + symH], [tx - symW / 2, top + symH]];
      roundPoly(c, pts, symH * .09); c.fillStyle = F(ink); c.fill();
      c.fillStyle = F(oval || panel); const bw = symH * .14; c.beginPath(); c.moveTo(tx - bw / 2, top + symH * .32); c.lineTo(tx + bw / 2, top + symH * .32); c.lineTo(tx + bw * .32, top + symH * .7); c.lineTo(tx - bw * .32, top + symH * .7); c.closePath(); c.fill(); c.beginPath(); c.arc(tx, top + symH * .83, bw * .55, 0, Math.PI * 2); c.fill();
    } else if (sym === 'bio' || sym === 'rad') drawIconAt(c, sym === 'bio' ? 'hz_bio' : 'hz_rad', x0 + symW / 2, 0, symH, F(ink), k);
    const tx0 = x0 + symW + gap; c.fillStyle = F(ink);
    setFont(c, el.font, el.weight, m1.size, italic); setSp(c, (el.tracking || 0) * m1.size); textMid(c, word, tx0 + (tw - m1.w) / 2, cyMain);
    if (m2) { setFont(c, el.font, el.weight, m2.size, italic); setSp(c, (el.tracking || 0) * m2.size); textMid(c, w2, tx0 + (tw - m2.w) / 2, cySec); }
    setSp(c, 0); c.restore();
  }, 'M3 6h18v7H3z M6.5 9.5h2 M10.5 9.5h7 M4 16.5h16 M4 19.5h10');

/* ---------- framed safety pictogram ---------- */
const PICTO_FRAMES = [['warning', 'Warning triangle'], ['prohibit', 'Prohibition (red slash)'], ['mandatory', 'Mandatory (blue disc)'], ['safe', 'Safe condition (green)'], ['fire', 'Fire equipment (red)'], ['ghs', 'Chemical diamond'], ['placard', 'Hazmat placard'], ['square', 'Square tile'], ['circle', 'Disc'], ['none', 'Icon only']];
const PICTO_COL = { warning: ['#ffd100', '#111111', '#111111'], prohibit: ['#ffffff', '#c8102e', '#111111'], mandatory: ['#0057b8', '#ffffff', '#ffffff'], safe: ['#00843d', '#ffffff', '#ffffff'], fire: ['#c8102e', '#ffffff', '#ffffff'], ghs: ['#ffffff', '#c8102e', '#111111'], placard: ['#c8102e', '#111111', '#111111'], square: ['#111111', '#ffffff', '#ffffff'], circle: ['#111111', '#ffffff', '#ffffff'], none: ['#ffffff', '#111111', '#111111'] };   // fill, frame, icon
def('picto', 'Safety pictogram', { w: 30, h: 30, frame: 'warning', icon: 'hz_excl', auto: true, fill: '#ffd100', line: '#111111', ink: '#111111', border: 1, num: '3', font: 'Archivo Black' },
  [['frame', 'Frame', 'select', PICTO_FRAMES], ['icon', 'Symbol', 'select', ICON_OPTS], ['auto', 'Standard colours', 'check'], ['fill', 'Fill', 'color', null, e => !e.auto], ['line', 'Border', 'color', null, e => !e.auto], ['ink', 'Symbol colour', 'color', null, e => !e.auto], ['border', 'Border weight', 'range', { min: .3, max: 2.5, step: .05 }], ['num', 'Class number', 'text', null, e => e.frame === 'placard'], ['font', 'Number font', 'font', null, e => e.frame === 'placard']],
  function (c, el, ov, k) {
    const fr = el.frame, [f0, l0, i0] = PICTO_COL[fr] || PICTO_COL.none, fill = fillOf(ov, el.auto ? f0 : el.fill), line = fillOf(ov, el.auto ? l0 : el.line), ink = fillOf(ov, el.auto ? i0 : el.ink), s = Math.min(el.w, el.h), b = el.border ?? 1;
    c.save();
    if (fr === 'warning') {
      const L = Math.min(el.w, el.h * 2 / Math.sqrt(3)), Ht = L * Math.sqrt(3) / 2, pts = [[0, -Ht / 2], [L / 2, Ht / 2], [-L / 2, Ht / 2]], cy = Ht / 6, ri = L / (2 * Math.sqrt(3)), t = L * .075 * b, f = Math.max(.1, (ri - t) / ri);
      roundPoly(c, pts, L * .07); c.fillStyle = line; c.fill();
      roundPoly(c, pts.map(([x, y]) => [x * f, cy + (y - cy) * f]), L * .07 * f); c.fillStyle = fill; c.fill();
      drawIconAt(c, el.icon, 0, cy + L * .035, L * .44 * Math.min(1, f + .1), ink, k);
    } else if (fr === 'prohibit') {
      const R = s / 2, t = s * .1 * b; c.beginPath(); c.arc(0, 0, R - t / 2, 0, Math.PI * 2); c.fillStyle = fill; c.fill();
      drawIconAt(c, el.icon, 0, 0, s * .54, ink, k);
      c.save(); c.beginPath(); c.arc(0, 0, R - t / 2, 0, Math.PI * 2); c.clip(); c.strokeStyle = line; c.lineWidth = t; c.beginPath(); c.moveTo(-R * .72, -R * .72); c.lineTo(R * .72, R * .72); c.stroke(); c.restore();
      c.beginPath(); c.arc(0, 0, R - t / 2, 0, Math.PI * 2); c.strokeStyle = line; c.lineWidth = t; c.stroke();
    } else if (fr === 'mandatory' || fr === 'circle') {
      c.beginPath(); c.arc(0, 0, s / 2, 0, Math.PI * 2); c.fillStyle = fill; c.fill();
      if (fr === 'mandatory' && b > .3) { c.beginPath(); c.arc(0, 0, s / 2 - s * .05, 0, Math.PI * 2); c.strokeStyle = line; c.lineWidth = s * .012 * b; c.stroke(); }
      drawIconAt(c, el.icon, 0, 0, s * .62, ink, k);
    } else if (fr === 'safe' || fr === 'fire' || fr === 'square') {
      c.beginPath(); rr(c, -s / 2, -s / 2, s, s, s * .09); c.fillStyle = fill; c.fill();
      if (b > .3) { c.beginPath(); rr(c, -s / 2 + s * .045, -s / 2 + s * .045, s * .91, s * .91, s * .06); c.strokeStyle = line; c.lineWidth = s * .012 * b; c.stroke(); }
      drawIconAt(c, el.icon, 0, 0, s * .68, ink, k);
    } else if (fr === 'ghs' || fr === 'placard') {
      const hd = s / 2, d = (q) => { c.beginPath(); c.moveTo(0, -q); c.lineTo(q, 0); c.lineTo(0, q); c.lineTo(-q, 0); c.closePath(); };
      if (fr === 'ghs') { const t = s * .065 * b; d(hd); c.fillStyle = line; c.fill(); d(hd - t * 1.41); c.fillStyle = fill; c.fill(); drawIconAt(c, el.icon, 0, 0, hd * 1.02, ink, k); }
      else {
        d(hd); c.fillStyle = fill; c.fill(); d(hd * .9); c.strokeStyle = line; c.lineWidth = hd * .025 * b; c.stroke();
        drawIconAt(c, el.icon, 0, -hd * .3, hd * .7, ink, k);
        if (el.num) { c.fillStyle = ink; c.textAlign = 'left'; const m = fitText(c, String(el.num), el.font, 400, hd * .3, hd * .6, false, 0); textMid(c, String(el.num), -m.w / 2, hd * .58); setSp(c, 0); }
      }
    } else drawIconAt(c, el.icon, 0, 0, s, ink, k);
    c.restore();
  }, 'M12 3l9.5 16.5h-19z M12 9.5v4.5 M12 16.6v.4');

/* ---------- hazard stripes ---------- */
def('stripes', 'Hazard stripes', { w: 80, h: 12, color: '#ffd100', color2: '#111111', band: 6, angle: 45, mode: 'fill', bw: 8, radius: 0, wear: 0, seed: 3, phase: 0 },
  [['mode', 'Layout', 'select', [['fill', 'Fill the box'], ['border', 'Border frame']]], ['color', 'Stripe colour', 'color'], ['color2', 'Second colour', 'color'], ['band', 'Stripe width (mm)', 'range', { min: .5, max: 80, step: .1 }], ['angle', 'Angle', 'range', { min: -90, max: 90, step: 1 }], ['phase', 'Shift (mm)', 'range', { min: 0, max: 80, step: .1 }], ['bw', 'Frame width (mm)', 'range', { min: 1, max: 120, step: .1 }, e => e.mode === 'border'], ['radius', 'Corner radius (mm)', 'range', { min: 0, max: 60, step: .1 }], ['wear', 'Scuffs', 'range', { min: 0, max: 1, step: .01 }], ['seed', 'Scuff seed', 'range', { min: 1, max: 99, step: 1 }]],
  function (c, el, ov, k) {
    const w = el.w, h = el.h, scuff = el.wear > 0 && ov.ch === 'A', g = scuff ? scratch(Math.ceil(w * k), Math.ceil(h * k)).getContext('2d') : c;
    g.save(); if (scuff) { g.setTransform(k, 0, 0, k, w * k / 2, h * k / 2); g.clearRect(-w, -h, w * 2, h * 2); }
    g.beginPath(); rr(g, -w / 2, -h / 2, w, h, Math.min(el.radius || 0, w / 2, h / 2));
    if (el.mode === 'border') { const bw = Math.min(el.bw || 6, w / 2 - .1, h / 2 - .1); rr(g, -w / 2 + bw, -h / 2 + bw, w - bw * 2, h - bw * 2, Math.max(0, (el.radius || 0) - bw)); g.clip('evenodd'); } else g.clip();
    g.fillStyle = fillOf(ov, el.color2); g.fillRect(-w, -h, w * 2, h * 2);
    g.rotate((el.angle || 0) * Math.PI / 180); const D = Math.hypot(w, h), s = Math.max(.3, el.band || 5); g.fillStyle = fillOf(ov, el.color);
    for (let x = -D - s * 2 + ((el.phase || 0) % (s * 2)); x < D; x += s * 2) g.fillRect(x, -D, s, D * 2);
    g.restore();
    if (scuff) {   // knock paint off in irregular chips, then place the sheet
      g.save(); g.setTransform(k, 0, 0, k, 0, 0); g.globalCompositeOperation = 'destination-out'; const R = rng((el.seed || 1) * 811 + 5), n = Math.round(el.wear * w * h / 6), u = Math.max(.6, s * .18);
      for (let i = 0; i < n; i++) { const cx = R() * w, cy = R() * h, rad = u * (.25 + Math.pow(R(), 3) * 2.4), m = 5 + (R() * 4 | 0); g.globalAlpha = .5 + R() * .5; g.beginPath(); for (let j = 0; j < m; j++) { const a = j / m * Math.PI * 2, q = rad * (.55 + R() * .6); j ? g.lineTo(cx + Math.cos(a) * q, cy + Math.sin(a) * q * .7) : g.moveTo(cx + Math.cos(a) * q, cy + Math.sin(a) * q * .7); } g.fill(); }
      g.restore(); c.drawImage(g.canvas, -w / 2, -h / 2, w, h);
    }
  }, 'M3 7h18v10H3z M7.5 7l-4.5 7 M13 7l-6.5 10 M18.5 7l-6.5 10 M21 9.5l-4.5 7.5');

/* ---------- sunburst rays ---------- */
def('rays', 'Sunburst', { w: 120, h: 120, n: 24, color: '#c8241c', color2: '#f0d9a8', alt: true, ox: 0, oy: 0, spread: .5, twist: 0, fade: 0, disc: 0, discColor: '#f0d9a8', rot: 0, radius: 0 },
  [['n', 'Rays', 'range', { min: 3, max: 96, step: 1 }], ['color', 'Ray colour', 'color'], ['alt', 'Fill between rays', 'check'], ['color2', 'Between colour', 'color', null, e => e.alt], ['spread', 'Ray width', 'range', { min: .05, max: .95, step: .01 }], ['ox', 'Centre across', 'range', { min: -2, max: 2, step: .01 }], ['oy', 'Centre down', 'range', { min: -2, max: 2, step: .01 }], ['rot', 'Turn (°)', 'range', { min: 0, max: 360, step: 1 }], ['twist', 'Swirl (°)', 'range', { min: -180, max: 180, step: 1 }], ['fade', 'Fade out', 'range', { min: 0, max: 1, step: .01 }], ['disc', 'Centre disc', 'range', { min: 0, max: .6, step: .01 }], ['discColor', 'Disc colour', 'color', null, e => e.disc > 0], ['radius', 'Corner radius (mm)', 'range', { min: 0, max: 80, step: .1 }]],
  function (c, el, ov, k) {
    const w = el.w, h = el.h, off = el.fade > 0 && ov.ch === 'A', g = off ? scratch(Math.ceil(w * k), Math.ceil(h * k)).getContext('2d') : c;
    g.save(); if (off) { g.setTransform(k, 0, 0, k, w * k / 2, h * k / 2); g.clearRect(-w, -h, w * 2, h * 2); }
    g.beginPath(); rr(g, -w / 2, -h / 2, w, h, Math.min(el.radius || 0, w / 2, h / 2)); g.clip();
    if (el.alt) { g.fillStyle = fillOf(ov, el.color2); g.fillRect(-w, -h, w * 2, h * 2); }
    const ox = (el.ox || 0) * w / 2, oy = (el.oy || 0) * h / 2, R = Math.hypot(w / 2 + Math.abs(ox), h / 2 + Math.abs(oy)) * 1.05, n = Math.max(3, el.n | 0), step = Math.PI * 2 / n, tw = (el.twist || 0) * Math.PI / 180, r0 = (el.rot || 0) * Math.PI / 180;
    g.fillStyle = fillOf(ov, el.color); g.beginPath();
    for (let i = 0; i < n; i++) {
      const a0 = r0 + i * step, a1 = a0 + step * (el.spread ?? .5);
      if (!tw) { g.moveTo(ox, oy); g.lineTo(ox + Math.cos(a0) * R, oy + Math.sin(a0) * R); g.lineTo(ox + Math.cos(a1) * R, oy + Math.sin(a1) * R); g.closePath(); continue; }
      g.moveTo(ox, oy); for (let j = 1; j <= 24; j++) { const t = j / 24, a = a0 + tw * t; g.lineTo(ox + Math.cos(a) * R * t, oy + Math.sin(a) * R * t); } for (let j = 24; j >= 1; j--) { const t = j / 24, a = a1 + tw * t; g.lineTo(ox + Math.cos(a) * R * t, oy + Math.sin(a) * R * t); } g.closePath();
    }
    g.fill();
    if (off) { g.globalCompositeOperation = 'destination-in'; const gr = g.createRadialGradient(ox, oy, 0, ox, oy, R * .85); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(.25, 'rgba(0,0,0,1)'); gr.addColorStop(1, `rgba(0,0,0,${1 - el.fade})`); g.fillStyle = gr; g.fillRect(-w, -h, w * 2, h * 2); g.globalCompositeOperation = 'source-over'; }
    if (el.disc > 0) { g.beginPath(); g.arc(ox, oy, el.disc * Math.min(w, h) / 2, 0, Math.PI * 2); g.fillStyle = fillOf(ov, el.discColor); g.fill(); }
    g.restore();
    if (off) c.drawImage(g.canvas, -w / 2, -h / 2, w, h);
  }, 'M12 12L4 4 M12 12l8-8 M12 12l-8 8 M12 12l8 8 M12 12V2 M12 12v10 M12 12H2 M12 12h10');

/* ---------- fire-diamond style hazard rating ---------- */
def('nfpa', 'Hazard diamond', { w: 40, h: 40, health: 3, fire: 2, react: 1, special: 'W', font: 'Archivo Black', border: 1 },
  [['health', 'Health (blue)', 'range', { min: 0, max: 4, step: 1 }], ['fire', 'Flammability (red)', 'range', { min: 0, max: 4, step: 1 }], ['react', 'Instability (yellow)', 'range', { min: 0, max: 4, step: 1 }], ['special', 'Special (white)', 'text'], ['font', 'Font', 'font'], ['border', 'Line weight', 'range', { min: .3, max: 3, step: .05 }]],
  function (c, el, ov, k) {
    const s = Math.min(el.w, el.h), q = s / 4, F = col => fillOf(ov, col), lw = s * .018 * (el.border ?? 1);
    const dia = (cx, cy, r) => { c.beginPath(); c.moveTo(cx, cy - r); c.lineTo(cx + r, cy); c.lineTo(cx, cy + r); c.lineTo(cx - r, cy); c.closePath(); };
    c.save(); c.lineJoin = 'miter';
    for (const [cx, cy, col, val] of [[0, -q, '#d7261e', el.fire], [-q, 0, '#1f5fbf', el.health], [q, 0, '#ffd100', el.react], [0, q, '#ffffff', el.special]]) {
      dia(cx, cy, q); c.fillStyle = F(col); c.fill(); c.strokeStyle = F('#111111'); c.lineWidth = lw; c.stroke();
      const txt = String(val ?? ''); if (!txt) continue; c.fillStyle = F('#111111'); c.textAlign = 'left';
      const m = fitText(c, txt, el.font, 400, q * (txt.length > 1 ? .62 : .9), q * 1.1, false, 0); textMid(c, txt, cx - m.w / 2, cy);
      if (txt === 'W') { c.lineWidth = q * .08; c.beginPath(); c.moveTo(cx - m.w * .62, cy); c.lineTo(cx + m.w * .62, cy); c.stroke(); }
    }
    dia(0, 0, s / 2); c.strokeStyle = F('#111111'); c.lineWidth = lw * 1.4; c.stroke(); setSp(c, 0); c.restore();
  }, 'M12 2l10 10-10 10L2 12z M7 7l10 10 M17 7L7 17');

Forge.makeEl = makeEl; Forge.normalize = normalize; Forge.POSTER_SUBS = POSTER_SUBS;
