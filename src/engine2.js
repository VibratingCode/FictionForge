/* ================= ID Forge — more element types ================= */
const SHAPE_KINDS = [['polygon', 'Polygon'], ['star', 'Star'], ['burst', 'Seal burst'], ['shield', 'Shield'], ['ribbon', 'Ribbon banner'], ['chevron', 'Chevron'], ['diamond', 'Diamond'], ['crescent', 'Crescent'], ['heart', 'Heart'], ['cross', 'Cross'], ['arrow', 'Arrow'], ['tag', 'Luggage tag']];
function shapeKind(c, el) {
  const w = el.w, h = el.h, a = w / 2, b = h / 2, TAU = Math.PI * 2, poly = (pts) => { pts.forEach((p, i) => i ? c.lineTo(p[0] * a, p[1] * b) : c.moveTo(p[0] * a, p[1] * b)); c.closePath(); };
  c.beginPath();
  switch (el.kind) {
    case 'polygon': { const n = Math.max(3, el.sides | 0); for (let i = 0; i < n; i++) { const t = -Math.PI / 2 + i * TAU / n; i ? c.lineTo(Math.cos(t) * a, Math.sin(t) * b) : c.moveTo(Math.cos(t) * a, Math.sin(t) * b); } c.closePath(); return 'nonzero'; }
    case 'star': case 'burst': { const n = Math.max(3, el.points | 0), ri = el.kind === 'burst' ? Math.max(.6, el.inner) : el.inner; for (let i = 0; i < n * 2; i++) { const t = -Math.PI / 2 + i * Math.PI / n, r = i % 2 ? ri : 1; i ? c.lineTo(Math.cos(t) * a * r, Math.sin(t) * b * r) : c.moveTo(Math.cos(t) * a * r, Math.sin(t) * b * r); } c.closePath(); return 'nonzero'; }
    case 'shield': shapePath(c, 'shield', w, h); return 'nonzero';
    case 'ribbon': poly([[-1, -.62], [1, -.62], [.8, 0], [1, .62], [-1, .62], [-.8, 0]]); return 'nonzero';
    case 'chevron': poly([[-1, 1], [0, -1], [1, 1], [.5, 1], [0, -.05], [-.5, 1]]); return 'nonzero';
    case 'diamond': poly([[0, -1], [1, 0], [0, 1], [-1, 0]]); return 'nonzero';
    case 'crescent': { const R = Math.min(a, b); c.arc(0, 0, R, 0, TAU); c.moveTo(R * (1 - el.inner * .6) + R * .86, 0); c.arc(R * (1 - el.inner * .6), 0, R * .86, 0, TAU); return 'evenodd'; }
    case 'heart': c.moveTo(0, b * .95); c.bezierCurveTo(-a * 1.25, b * .05, -a * .65, -b * 1.15, 0, -b * .45); c.bezierCurveTo(a * .65, -b * 1.15, a * 1.25, b * .05, 0, b * .95); c.closePath(); return 'nonzero';
    case 'cross': { const t = .34; poly([[-t, -1], [t, -1], [t, -t], [1, -t], [1, t], [t, t], [t, 1], [-t, 1], [-t, t], [-1, t], [-1, -t], [-t, -t]]); return 'nonzero'; }
    case 'arrow': poly([[-1, -.3], [.2, -.3], [.2, -1], [1, 0], [.2, 1], [.2, .3], [-1, .3]]); return 'nonzero';
    case 'tag': { poly([[-1, -.45], [-.62, -1], [1, -1], [1, 1], [-.62, 1], [-1, .45]]); const r = Math.min(a, b) * .16; c.moveTo(-a * .62 + r, 0); c.arc(-a * .62, 0, r, 0, TAU); return 'evenodd'; }
  }
  rr(c, -a, -b, w, h, 0); return 'nonzero';
}
function shapeFillRule(c, el, ov, rule) {
  if (el.fillOn) {
    if (ov.color != null) c.fillStyle = ov.color;
    else if (el.grad) { const an = (el.angle || 0) * Math.PI / 180, dx = Math.cos(an) * el.w / 2, dy = Math.sin(an) * el.h / 2; const g = c.createLinearGradient(-dx, -dy, dx, dy); g.addColorStop(0, el.fill); g.addColorStop(1, el.fill2); c.fillStyle = g; }
    else c.fillStyle = el.fill; c.fill(rule);
  }
  if (el.strokeW > 0) { c.lineWidth = el.strokeW; c.strokeStyle = fillOf(ov, el.stroke); if (el.dash > 0) c.setLineDash([el.dash, el.dash * .7]); c.stroke(); c.setLineDash([]); }
}
def('shape', 'Shape', { w: 16, h: 16, kind: 'star', sides: 6, points: 5, inner: .45, fillOn: true, fill: '#c9302c', fill2: '#7a1a17', grad: false, angle: 90, stroke: '#000000', strokeW: 0, dash: 0 },
  [['kind', 'Shape', 'select', SHAPE_KINDS], ['sides', 'Sides', 'range', { min: 3, max: 12, step: 1 }, e => e.kind === 'polygon'], ['points', 'Points', 'range', { min: 3, max: 32, step: 1 }, e => e.kind === 'star' || e.kind === 'burst'], ['inner', 'Inner radius', 'range', { min: .1, max: .97, step: .01 }, e => ['star', 'burst', 'crescent'].includes(e.kind)], ...SHAPE_P],
  function (c, el, ov) { const rule = shapeKind(c, el); shapeFillRule(c, el, ov, rule); }, 'M12 3l2.5 6h6.5l-5 4 2 7-6-4-6 4 2-7-5-4h6.5z');

/* flag (fictional geometric flags) */
def('flag', 'Flag', { w: 18, h: 12, kind: 'tri-v', c1: '#1d4f8a', c2: '#f3efe4', c3: '#b8322a', emblem: 'star', ecolor: '#e7c35a', wave: .35, border: true },
  [['kind', 'Design', 'select', [['tri-v', 'Vertical tricolour'], ['tri-h', 'Horizontal tricolour'], ['bicolor', 'Bicolour'], ['cross', 'Nordic cross'], ['canton', 'Canton & stripes'], ['diagonal', 'Diagonal split'], ['saltire', 'Saltire'], ['disc', 'Disc'], ['chevron', 'Hoist chevron'], ['quarter', 'Quartered']]], ['c1', 'Colour 1', 'color'], ['c2', 'Colour 2', 'color'], ['c3', 'Colour 3', 'color'], ['emblem', 'Emblem', 'select', [['none', 'None'], ['star', 'Star'], ['sun', 'Sun'], ['circle', 'Ring'], ['crescent', 'Crescent & star']]], ['ecolor', 'Emblem colour', 'color', null, e => e.emblem !== 'none'], ['wave', 'Cloth wave', 'range', { min: 0, max: 1, step: .01 }], ['border', 'Hairline border', 'check']],
  function (c, el, ov) {
    const w = el.w, h = el.h, x0 = -w / 2, y0 = -h / 2;
    if (ov.color != null) { c.fillStyle = ov.color; c.fillRect(x0, y0, w, h); return; }
    c.save(); c.beginPath(); c.rect(x0, y0, w, h); c.clip();
    const R = (x, y, ww, hh, col) => { c.fillStyle = col; c.fillRect(x, y, ww, hh); }, P2 = (pts, col) => { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); c.fillStyle = col; c.fill(); };
    let ex = 0, ey = 0, es = h * .32;
    switch (el.kind) {
      case 'tri-v': R(x0, y0, w / 3, h, el.c1); R(x0 + w / 3, y0, w / 3 + .01, h, el.c2); R(x0 + w * 2 / 3, y0, w / 3, h, el.c3); break;
      case 'tri-h': R(x0, y0, w, h / 3, el.c1); R(x0, y0 + h / 3, w, h / 3 + .01, el.c2); R(x0, y0 + h * 2 / 3, w, h / 3, el.c3); break;
      case 'bicolor': R(x0, y0, w, h / 2, el.c1); R(x0, 0, w, h / 2, el.c2); break;
      case 'cross': { R(x0, y0, w, h, el.c1); const t = h * .22, cx = x0 + w * .36; R(cx - t / 2 - t * .25, y0, t * 1.5, h, el.c2); R(x0, -t * .75, w, t * 1.5, el.c2); R(cx - t / 2, y0, t, h, el.c3); R(x0, -t / 2, w, t, el.c3); ex = 1e9; break; }
      case 'canton': { for (let i = 0; i < 7; i++) R(x0, y0 + i * h / 7, w, h / 7 + .01, i % 2 ? el.c2 : el.c3); R(x0, y0, w * .42, h * 4 / 7, el.c1); ex = x0 + w * .21; ey = y0 + h * 2 / 7; es = h * .2; break; }
      case 'diagonal': P2([[x0, y0], [x0 + w, y0], [x0, y0 + h]], el.c1); P2([[x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]], el.c3); c.strokeStyle = el.c2; c.lineWidth = h * .14; c.beginPath(); c.moveTo(x0 + w, y0); c.lineTo(x0, y0 + h); c.stroke(); ex = 1e9; break;
      case 'saltire': R(x0, y0, w, h, el.c1); c.strokeStyle = el.c2; c.lineWidth = h * .18; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0 + w, y0 + h); c.moveTo(x0 + w, y0); c.lineTo(x0, y0 + h); c.stroke(); es = h * .26; break;
      case 'disc': R(x0, y0, w, h, el.c2); c.fillStyle = el.c3; c.beginPath(); c.arc(-w * .04, 0, h * .3, 0, Math.PI * 2); c.fill(); ex = -w * .04; es = h * .2; break;
      case 'chevron': R(x0, y0, w, h / 2, el.c2); R(x0, 0, w, h / 2, el.c3); P2([[x0, y0], [x0 + w * .42, 0], [x0, y0 + h]], el.c1); ex = x0 + w * .14; es = h * .2; break;
      case 'quarter': R(x0, y0, w / 2, h / 2, el.c1); R(0, y0, w / 2, h / 2, el.c2); R(x0, 0, w / 2, h / 2, el.c2); R(0, 0, w / 2, h / 2, el.c3); es = h * .26; break;
    }
    if (el.emblem !== 'none' && ex < 1e8) {
      c.save(); c.translate(ex, ey); c.fillStyle = el.ecolor; c.strokeStyle = el.ecolor; c.lineWidth = es * .14;
      if (el.emblem === 'star') { c.beginPath(); starPoly(c, 5, es * .55, es * .22); c.fill(); }
      else if (el.emblem === 'sun') { c.beginPath(); c.arc(0, 0, es * .24, 0, Math.PI * 2); c.fill(); for (let i = 0; i < 12; i++) { const t = i * Math.PI / 6; c.beginPath(); c.moveTo(Math.cos(t) * es * .32, Math.sin(t) * es * .32); c.lineTo(Math.cos(t) * es * .55, Math.sin(t) * es * .55); c.stroke(); } }
      else if (el.emblem === 'circle') { c.beginPath(); c.arc(0, 0, es * .42, 0, Math.PI * 2); c.stroke(); }
      else { c.beginPath(); c.arc(-es * .08, 0, es * .45, 0, Math.PI * 2); c.arc(es * .08, -es * .02, es * .37, 0, Math.PI * 2, true); c.fill('evenodd'); c.beginPath(); c.translate(es * .3, 0); starPoly(c, 5, es * .18, es * .07); c.fill(); }
      c.restore();
    }
    if (el.wave > 0) { const g = c.createLinearGradient(x0, 0, x0 + w, 0); for (let i = 0; i <= 6; i++) g.addColorStop(i / 6, i % 2 ? `rgba(0,0,0,${.22 * el.wave})` : `rgba(255,255,255,${.2 * el.wave})`); c.fillStyle = g; c.fillRect(x0, y0, w, h); }
    c.restore();
    if (el.border) { c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = .08; c.strokeRect(x0, y0, w, h); }
  }, 'M5 3v18M5 4h13l-3 4 3 4H5');

/* frame */
def('frame', 'Frame', { w: 80, h: 48, style: 'deco', color: '#b8892b', lw: .3, size: 8, radius: 2, text: 'SPECIMEN · FICTIONAL · ', tsize: .42, font: 'Inter' },
  [['style', 'Style', 'select', [['double', 'Double rule'], ['deco', 'Art deco corners'], ['filigree', 'Filigree corners'], ['brackets', 'Corner brackets'], ['rope', 'Guilloche rope'], ['beads', 'Beaded border'], ['dashed', 'Ticket dashes'], ['perforated', 'Perforation holes'], ['micro', 'Microtext border']]], ['color', 'Colour', 'color'], ['lw', 'Line (mm)', 'range', { min: .03, max: 2, step: .01 }], ['size', 'Ornament size', 'range', { min: 1, max: 30, step: .1 }], ['radius', 'Corner radius', 'range', { min: 0, max: 15, step: .1 }, e => ['double', 'dashed'].includes(e.style)], ['text', 'Border text', 'text', null, e => e.style === 'micro'], ['tsize', 'Text size', 'range', { min: .2, max: 3, step: .01 }, e => e.style === 'micro'], ['font', 'Font', 'font', null, e => e.style === 'micro']],
  function (c, el, ov, k) {
    const w = el.w, h = el.h, a = w / 2, b = h / 2, col = fillOf(ov, el.color), s = el.size, lw = el.lw, TAU = Math.PI * 2;
    c.strokeStyle = col; c.fillStyle = col; c.lineWidth = lw; c.lineCap = 'round'; c.lineJoin = 'round';
    const corners = (fn) => { for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { c.save(); c.translate(sx * a, sy * b); c.scale(-sx, -sy); fn(); c.restore(); } };
    const perim = (step, fn) => { const segs = [[-a, -b, a, -b], [a, -b, a, b], [a, b, -a, b], [-a, b, -a, -b]]; for (const [x1, y1, x2, y2] of segs) { const L = Math.hypot(x2 - x1, y2 - y1), n = Math.max(1, Math.round(L / step)); for (let i = 0; i < n; i++) fn(x1 + (x2 - x1) * i / n, y1 + (y2 - y1) * i / n, Math.atan2(y2 - y1, x2 - x1)); } };
    switch (el.style) {
      case 'double': c.beginPath(); rr(c, -a + lw / 2, -b + lw / 2, w - lw, h - lw, el.radius); c.stroke(); c.lineWidth = lw * .5; c.beginPath(); rr(c, -a + lw * 3, -b + lw * 3, w - lw * 6, h - lw * 6, Math.max(0, el.radius - lw * 2.5)); c.stroke(); break;
      case 'brackets': corners(() => { c.beginPath(); c.moveTo(0, s); c.lineTo(0, 0); c.lineTo(s, 0); c.stroke(); }); break;
      case 'deco': c.lineWidth = lw * .5; c.strokeRect(-a + s * .18, -b + s * .18, w - s * .36, h - s * .36); c.lineWidth = lw; corners(() => { c.beginPath(); for (let i = 0; i < 3; i++) { const o = i * s * .14, L = s * (1 - i * .22); c.moveTo(o, L); c.lineTo(o, o); c.lineTo(L, o); } c.stroke(); c.beginPath(); c.moveTo(s * .52, s * .38); c.lineTo(s * .6, s * .52); c.lineTo(s * .52, s * .66); c.lineTo(s * .44, s * .52); c.closePath(); c.fill(); c.beginPath(); for (let i = 0; i < 5; i++) { const t = i / 4 * Math.PI / 2; c.moveTo(s * .3, s * .3); c.lineTo(s * .3 + Math.cos(t) * s * .32, s * .3 + Math.sin(t) * s * .32); } c.stroke(); }); break;
      case 'filigree': corners(() => { c.beginPath(); c.moveTo(0, s); c.bezierCurveTo(0, s * .3, s * .3, 0, s, 0); c.moveTo(s * .15, s * .9); c.bezierCurveTo(s * .2, s * .45, s * .45, s * .2, s * .9, s * .15); c.stroke(); c.beginPath(); for (let t = 0; t < 4.5 * Math.PI; t += .2) { const r = s * .2 * (1 - t / (4.6 * Math.PI)); const x = s * .32 + Math.cos(t) * r, y = s * .32 + Math.sin(t) * r; t ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); for (const [x, y, r2] of [[s * .62, s * .12, .3], [s * .12, s * .62, -.3 + Math.PI / 2]]) { c.save(); c.translate(x, y); c.rotate(r2); c.beginPath(); c.ellipse(0, 0, s * .09, s * .035, 0, 0, TAU); c.fill(); c.restore(); } }); break;
      case 'rope': { const t = s * .14; for (let ph = 0; ph < 2; ph++) { c.beginPath(); const segs = [[-a + t, -b + t, a - t, -b + t], [a - t, -b + t, a - t, b - t], [a - t, b - t, -a + t, b - t], [-a + t, b - t, -a + t, -b + t]]; let first = true; for (const [x1, y1, x2, y2] of segs) { const L = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / L, ny = (x2 - x1) / L, n = Math.round(L * 4); for (let i = 0; i <= n; i++) { const u = i / n, d = Math.sin(u * L / (t * 2.2) * Math.PI + ph * Math.PI) * t * .8, x = x1 + (x2 - x1) * u + nx * d, y = y1 + (y2 - y1) * u + ny * d; first ? (c.moveTo(x, y), first = false) : c.lineTo(x, y); } } c.stroke(); } break; }
      case 'beads': c.beginPath(); perim(s * .35, (x, y) => { c.moveTo(x + lw, y); c.arc(x, y, lw, 0, TAU); }); c.fill(); break;
      case 'dashed': c.setLineDash([s * .35, s * .22]); c.beginPath(); rr(c, -a + lw / 2, -b + lw / 2, w - lw, h - lw, el.radius); c.stroke(); c.setLineDash([]); break;
      case 'perforated': c.beginPath(); perim(s * .3, (x, y) => { c.moveTo(x + lw * 1.5, y); c.arc(x, y, lw * 1.5, 0, TAU); }); c.fill(); break;
      case 'micro': { c.save(); c.scale(1 / k, 1 / k); const px = el.tsize * k; setFont(c, el.font || 'Inter', 600, px, false); setSp(c, 0); c.fillStyle = col; c.textBaseline = 'middle'; const unit = String(el.text || ' '), tw = c.measureText(unit).width || 1; const edge = (x, y, L, rot) => { c.save(); c.translate(x * k, y * k); c.rotate(rot); c.beginPath(); c.rect(0, -px, L * k, px * 2); c.clip(); for (let p = 0, g = 0; p < L * k && g < 2000; p += tw, g++) c.fillText(unit, p, 0); c.restore(); }; const o = el.tsize * .6; edge(-a, -b + o, w, 0); edge(a - o, -b, h, Math.PI / 2); edge(a, b - o, w, Math.PI); edge(-a + o, b, h, -Math.PI / 2); c.restore(); break; }
    }
  }, 'M3 3h18v18H3zM7 7h10v10H7z');

/* real QR */
const qrMemo = new Map();
function qrGet(data, ecl) { const key = ecl + '|' + data; if (!qrMemo.has(key)) { if (qrMemo.size > 50) qrMemo.clear(); qrMemo.set(key, qrEncode(data, ecl)); } return qrMemo.get(key); }
def('qr', 'QR code', { w: 14, h: 14, data: 'https://example.com', ecl: 'M', color: '#111111', bgOn: true, bg: '#ffffff', quiet: 2, dots: false },
  [['data', 'Link or text', 'text'], ['ecl', 'Error correction', 'select', [['L', 'L · 7%'], ['M', 'M · 15%'], ['Q', 'Q · 25%'], ['H', 'H · 30%']]], ['color', 'Colour', 'color'], ['dots', 'Round dots', 'check'], ['bgOn', 'Background', 'check'], ['bg', 'Background colour', 'color', null, e => e.bgOn], ['quiet', 'Quiet zone', 'range', { min: 0, max: 4, step: 1 }]],
  function (c, el, ov) {
    const q = qrGet(el.data, el.ecl), sz = Math.min(el.w, el.h);
    if (el.bgOn) { c.fillStyle = fillOf(ov, el.bg); c.fillRect(-sz / 2, -sz / 2, sz, sz); }
    c.fillStyle = fillOf(ov, el.color);
    if (!q) { c.lineWidth = sz * .04; c.strokeStyle = c.fillStyle; c.beginPath(); c.moveTo(-sz / 3, -sz / 3); c.lineTo(sz / 3, sz / 3); c.moveTo(sz / 3, -sz / 3); c.lineTo(-sz / 3, sz / 3); c.stroke(); return; }
    const n = q.size, qz = el.quiet | 0, m = sz / (n + qz * 2), o = -sz / 2 + qz * m;
    c.beginPath();
    for (let y = 0; y < n; y++) {
      if (el.dots) { for (let x = 0; x < n; x++) if (q.modules[y][x]) { const fin = (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7); if (fin) c.rect(o + x * m, o + y * m, m * 1.01, m * 1.01); else { c.moveTo(o + (x + .5) * m + m * .45, o + (y + .5) * m); c.arc(o + (x + .5) * m, o + (y + .5) * m, m * .45, 0, Math.PI * 2); } } }
      else { let x = 0; while (x < n) { if (!q.modules[y][x]) { x++; continue; } let e = x; while (e < n && q.modules[y][e]) e++; c.rect(o + x * m, o + y * m, (e - x) * m + .002, m + .002); x = e; } }
    }
    c.fill();
  }, 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h6v2h-6z');

/* ---------- thumbnails ---------- */
function renderThumb(proj, w) {
  const saved = P;
  try {
    P = normalize(proj); const S = sub(); const r = renderSide('front', 't', { res: w, albedoOnly: true });
    const c = document.createElement('canvas'); c.width = r.pw; c.height = r.ph; const x = c.getContext('2d'), k = r.pw / P.card.w;
    x.save(); cardPath(x, k); x.clip('evenodd');
    if (S.clear && r.E) { x.fillStyle = S.disp || '#333'; x.fillRect(0, 0, c.width, c.height); x.drawImage(r.E, 0, 0); } else x.drawImage(r.A, 0, 0);
    x.restore(); return c;
  } catch (e) { console.warn('thumb failed', e); const c = document.createElement('canvas'); c.width = w; c.height = Math.round(w * .63); return c; }
  finally { P = saved; }
}
function thumbEls(els, W, H, card) {
  const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  if (card) {   // full-card layout: frame the whole card, paint its base colour and clip to it
    const pad = 8, k = Math.min((W - pad * 2) / card.w, (H - pad * 2) / card.h), ox = (W - card.w * k) / 2, oy = (H - card.h * k) / 2;
    x.fillStyle = '#e4e2dc'; x.fillRect(0, 0, W, H); x.save(); x.translate(ox, oy);
    const rr = new Path2D(); rr.roundRect(0, 0, card.w * k, card.h * k, (card.r || 3) * k);
    x.shadowColor = 'rgba(0,0,0,.25)'; x.shadowBlur = 6; x.shadowOffsetY = 2; x.fillStyle = card.fill || '#f6f6f3'; x.fill(rr); x.shadowColor = 'transparent'; x.clip(rr);
    for (const el of els) { const f = el.finish; x.save(); x.globalAlpha = el.opacity ?? 1; x.globalCompositeOperation = el.blend || 'source-over'; const ov = f === 'foil' ? { ch: 'A', color: el.foil } : f === 'holo' ? { ch: 'A', color: '#b9c0cc' } : f === 'blind' ? { ch: 'A', color: 'rgba(0,0,0,.12)' } : f === 'window' ? { ch: 'A', color: 'rgba(120,170,200,.35)' } : f === 'uv' ? null : { ch: 'A', color: null }; if (ov) drawEl(x, el, k, ov); x.restore(); }
    x.restore(); return c;
  }
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const e of els) { const r = Math.hypot(e.w, e.h) / 2 * (e.rot ? 1 : 0); const hw = e.rot ? r : e.w / 2, hh = e.rot ? r : e.h / 2; x0 = Math.min(x0, e.x - hw); y0 = Math.min(y0, e.y - hh); x1 = Math.max(x1, e.x + hw); y1 = Math.max(y1, e.y + hh); }
  const allUV = els.every(e => e.finish === 'uv'), pad = 10, k = Math.min((W - pad * 2) / Math.max(.5, x1 - x0), (H - pad * 2) / Math.max(.5, y1 - y0));
  x.fillStyle = allUV ? '#130b22' : '#f2f0ea'; x.fillRect(0, 0, W, H);
  x.save(); x.translate((W - (x1 - x0) * k) / 2 - x0 * k, (H - (y1 - y0) * k) / 2 - y0 * k);
  for (const el of els) {
    const f = el.finish; x.save(); x.globalAlpha = el.opacity ?? 1; x.globalCompositeOperation = el.blend || 'source-over';
    const ov = f === 'foil' ? { ch: 'A', color: el.foil } : f === 'holo' ? { ch: 'A', color: '#b9c0cc' } : f === 'laser' ? { ch: 'A', color: '#2b2b2b', laser: true } : f === 'uv' ? { ch: 'X', color: el.uvColor, uv: true } : f === 'blind' ? { ch: 'A', color: 'rgba(0,0,0,.14)' } : f === 'window' ? { ch: 'A', color: 'rgba(120,170,200,.35)' } : { ch: 'A', color: null };
    drawEl(x, el, k, ov); x.restore();
  }
  x.restore(); return c;
}

/* ---------- recolour ---------- */
const COLOR_KEYS = ['color', 'color2', 'color3', 'c1', 'c2', 'c3', 'fill', 'fill2', 'stroke', 'lcolor', 'borderColor', 'bg', 'fg', 'tint', 'ecolor', 'foil'];
function rgb2hsl([r, g, b]) { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; let h = 0, s = 0; if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; } return [h, s, l]; }
function hsl2hex(h, s, l) { const f = (n) => { const k2 = (n + h * 12) % 12, a = s * Math.min(l, 1 - l); return l - a * Math.max(-1, Math.min(k2 - 3, 9 - k2, 1)); }; return rgb2hex(f(0) * 255, f(8) * 255, f(4) * 255); }
function shiftColor(hex, dh, sm, dl) { if (typeof hex !== 'string' || hex[0] !== '#') return hex; const [h, s, l] = rgb2hsl(hex2rgb(hex)); return hsl2hex(((h + dh / 360) % 1 + 1) % 1, clamp(s * sm, 0, 1), clamp(l + dl, 0, 1)); }
