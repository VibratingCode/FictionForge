/* ================= geometric marks, tree of life, halftone field ================= */
const MARK_KINDS = [['spike', 'Concave starburst'], ['crescent', 'Crescent'], ['chevrons', 'Chevron stack'], ['grid', 'Diamond grid'], ['tri', 'Notched triangle'], ['horns', 'Horned mark'], ['shards', 'Flame shards'], ['blades', 'Radial blades']];
function markMask(el, iw, ih) {
  const M = _gly.M; M.width = iw; M.height = ih; const x = M.getContext('2d'), s = Math.min(iw, ih) / 100;
  x.save(); x.translate((iw - 100 * s) / 2, (ih - 100 * s) / 2); x.scale(s, s); if (el.flipX) { x.translate(100, 0); x.scale(-1, 1); }
  x.fillStyle = x.strokeStyle = '#fff'; const g = glyphHelper(x), n = Math.max(2, el.n | 0), R = rng((el.seed || 1) * 977 + 3), gap = el.gap ?? 4;
  switch (el.kind) {
    case 'spike': {   // concave star; variant sets which points run long
      const pts = []; for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + i * Math.PI * 2 / n, ax = Math.abs(Math.cos(a)), ay = Math.abs(Math.sin(a));
        let L = 1; if (el.variant === 'cross') L = (ax > .98 || ay > .98) ? 1 : .55; else if (el.variant === 'crown') L = Math.sin(a) > .98 ? 1.06 : ax > .98 ? .98 : Math.sin(a) < -.2 ? (i % 2 ? .62 : .86) : .34; else if (el.variant === 'alternate') L = i % 2 ? .62 : 1;
        pts.push([a, 47 * L]); }
      const ri = 47 * (el.inner ?? .3), cv = el.curve ?? .6; x.beginPath();
      pts.forEach(([a, L], i) => { const [a2] = pts[(i + 1) % n], am = a + Math.PI / n, P = [50 + Math.cos(a) * L, 50 + Math.sin(a) * L], V = [50 + Math.cos(am) * ri, 50 + Math.sin(am) * ri], L2 = pts[(i + 1) % n][1], Q = [50 + Math.cos(a2) * L2, 50 + Math.sin(a2) * L2];
        const c1 = [(P[0] + V[0]) / 2 + (50 - (P[0] + V[0]) / 2) * cv * .55, (P[1] + V[1]) / 2 + (50 - (P[1] + V[1]) / 2) * cv * .55], c2 = [(Q[0] + V[0]) / 2 + (50 - (Q[0] + V[0]) / 2) * cv * .55, (Q[1] + V[1]) / 2 + (50 - (Q[1] + V[1]) / 2) * cv * .55];
        if (!i) x.moveTo(...P); x.quadraticCurveTo(...c1, ...V); x.quadraticCurveTo(...c2, ...Q); });
      x.closePath(); x.fill();
      g.cut(() => { if (el.hole === 'dome') { x.beginPath(); x.arc(50, 54, ri * .9, Math.PI, 0); x.closePath(); x.fill(); g.rect(50 - ri * 1.25, 53, ri * 2.5, 2.2); } else if (el.hole === 'ring') g.circS(50, 50, ri * .6, 2.6); else if (el.hole === 'diamond') g.diamond(50, 50, ri * .45, ri * .7); else if (el.hole === 'dot') g.circ(50, 50, ri * .4); });
      break; }
    case 'crescent': { const th = 12 + (el.inner ?? .3) * 30; g.circ(50, 50, 44); g.cut(() => g.circ(50 + th * .9, 50 - th * .25, 44 - th * .35)); if (el.hole === 'ring' || el.hole === 'dome') g.circS(60, 48, 22, 2.6); if (el.hole === 'diamond') g.diamond(34, 50, 9, 5); if (el.hole === 'dot') g.circ(58, 48, 7); break; }
    case 'chevrons': { const h = 64 / n; for (let i = 0; i < n; i++) { const y = 6 + i * h; g.poly([[26, y], [50, y + h * .7], [74, y], [74, y + h - gap * .6], [50, y + h * 1.7 - gap * .6], [26, y + h - gap * .6]]); } g.poly([[12, 66], [50, 98], [88, 66], [76, 66], [50, 86], [24, 66]]); break; }
    case 'grid': { const c = Math.max(2, Math.min(5, n)), cs = (68 - gap * (c - 1)) / c; x.save(); x.translate(50, 50); x.rotate(Math.PI / 4); for (let i = 0; i < c; i++) for (let j = 0; j < c; j++) { const keep = el.variant === 'cross' ? (i === (c >> 1) || j === (c >> 1)) : el.variant === 'corner' ? (i === 0 || j === 0) : el.variant === 'alternate' ? ((i + j) % 2 === 0) : el.variant === 'crown' ? !(i > 0 && j > 0 && R() < .35) : true; if (keep) { const big = el.variant === 'corner' && i === 0 && j === 0; x.fillRect(-34 + i * (cs + gap), -34 + j * (cs + gap), big ? cs * 2 + gap : cs, big ? cs * 2 + gap : cs); } } x.restore(); break; }
    case 'tri': { g.poly([[50, 4], [96, 86], [4, 86]]); g.cut(() => { g.poly([[50, 34], [70, 70], [30, 70]].map(([a, b]) => [a, b])); const t = Math.max(1, n); for (let i = 1; i <= t; i++) { const f = i / (t + 1); g.poly([[50 - 46 * f - 2, 4 + 82 * f], [50 - 46 * f - 10, 4 + 82 * f + 2], [50 - 46 * f - 6, 4 + 82 * f - 6]]); g.poly([[50 + 46 * f + 2, 4 + 82 * f], [50 + 46 * f + 10, 4 + 82 * f + 2], [50 + 46 * f + 6, 4 + 82 * f - 6]]); } g.line([[50, 4], [50, 30]], gap * .8); g.line([[4, 86], [30, 72]], gap * .8); g.line([[96, 86], [70, 72]], gap * .8); }); break; }
    case 'horns': { const sp = 18 + (el.inner ?? .3) * 30; x.beginPath(); x.moveTo(50, 70); x.bezierCurveTo(50 - sp, 66, 50 - sp - 16, 40, 50 - sp + 2, 6); x.bezierCurveTo(50 - sp - 30, 26, 50 - sp - 34, 60, 14, 70); x.lineTo(50, 86); x.lineTo(86, 70); x.bezierCurveTo(50 + sp + 34, 60, 50 + sp + 30, 26, 50 + sp - 2, 6); x.bezierCurveTo(50 + sp + 16, 40, 50 + sp, 66, 50, 70); x.closePath(); x.fill(); g.cut(() => g.ell(50, 44, sp * .45, 20)); if (el.hole !== 'none') g.ell(50, 90, 5, 8); break; }
    case 'shards': { const k = Math.max(3, Math.min(7, n)); for (let i = 0; i < k; i++) { const t = k === 1 ? 0 : i / (k - 1) * 2 - 1, h = 90 - Math.abs(t) * 30, bx = 50 + t * 32, top = [50 + t * 24, 100 - h - 2], hw = Math.max(5.5, 30 / k) * (1 - Math.abs(t) * .25); g.poly([[bx - hw, 94], top, [bx + hw, 94], [bx, 94 - hw * 1.6]]); } if (el.hole === 'diamond') g.cut(() => g.diamond(50, 64, 6, 12)); break; }
    case 'blades': { for (let i = 0; i < n; i++) g.rot(50, 50, i * Math.PI * 2 / n, () => { x.beginPath(); x.moveTo(50, 50 - 47 * (el.inner ? .25 + el.inner : .5) * .6); x.quadraticCurveTo(50 + 22 * (el.curve ?? .6), 24, 50, 3); x.quadraticCurveTo(50 + 6, 26, 50 + 4, 50 - 12); x.closePath(); x.fill(); }); g.circ(50, 50, 9); if (el.hole !== 'none') g.cut(() => g.circ(50, 50, 4)); break; }
  }
  x.restore(); return M;
}
def('mark', 'Geometric mark', { w: 32, h: 32, kind: 'spike', n: 8, inner: .3, curve: .6, variant: 'uniform', hole: 'none', gap: 4, seed: 1, ...PAINT_DEF },
  [['kind', 'Mark', 'select', MARK_KINDS], ['n', 'Points / count', 'range', { min: 2, max: 14, step: 1 }], ['inner', 'Body', 'range', { min: .05, max: .9, step: .01 }], ['curve', 'Curve', 'range', { min: 0, max: 1, step: .01 }], ['variant', 'Variant', 'select', [['uniform', 'Uniform'], ['cross', 'Cross'], ['crown', 'Crown'], ['alternate', 'Alternate'], ['corner', 'Corner']]], ['hole', 'Cut-out', 'select', [['none', 'None'], ['dome', 'Dome'], ['ring', 'Ring'], ['diamond', 'Diamond'], ['dot', 'Dot']]], ['gap', 'Gap', 'range', { min: 0, max: 12, step: .1 }], ['seed', 'Seed', 'num', { min: 1, max: 9999, step: 1 }], ...PAINT_P],
  function (c, el, ov, k) { paintMask(c, el, ov, k, (iw, ih) => markMask(el, iw, ih)); }, 'M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z');

function treeMask(el, iw, ih) {
  const M = _gly.M; M.width = iw; M.height = ih; const x = M.getContext('2d'), s = Math.min(iw, ih) / 100;
  x.save(); x.translate((iw - 100 * s) / 2, (ih - 100 * s) / 2); x.scale(s, s); x.fillStyle = x.strokeStyle = '#fff'; x.lineCap = 'round'; x.lineJoin = 'round';
  const R = rng((el.seed || 1) * 7121 + 5), g = glyphHelper(x), depth = Math.max(2, Math.min(8, el.depth | 0)), sp = el.spread ?? .9, leaf = (el.leafSize ?? 1) * 3.2;
  if (el.ring) { x.lineWidth = 4; x.beginPath(); x.arc(50, 46, 40, 0, Math.PI * 2); x.stroke(); }
  const branch = (x0, y0, a, len, w, d) => {
    const x1 = x0 + Math.cos(a) * len, y1 = y0 + Math.sin(a) * len, mx = (x0 + x1) / 2 + Math.cos(a + 1.57) * len * .12 * (R() - .5), my = (y0 + y1) / 2 + Math.sin(a + 1.57) * len * .12 * (R() - .5);
    x.lineWidth = w; x.beginPath(); x.moveTo(x0, y0); x.quadraticCurveTo(mx, my, x1, y1); x.stroke();
    if (d <= 0) { if (el.leaves) for (let i = 0; i < 3; i++) { const la = a + (R() - .5) * 2.2, lx = x1 + Math.cos(la) * leaf * .8, ly = y1 + Math.sin(la) * leaf * .8; g.ell(lx, ly, leaf, leaf * .45, la); } return; }
    const kids = R() < .35 ? 3 : 2; for (let i = 0; i < kids; i++) { const t = kids === 2 ? (i ? 1 : -1) : i - 1; branch(x1, y1, a + t * (.32 + R() * .25) * sp + (R() - .5) * .2, len * (.68 + R() * .12), Math.max(.8, w * .66), d - 1); }
    if (el.leaves && d <= 2 && R() < .7) { const la = a + (R() - .5) * 1.6; g.ell(x1 + Math.cos(la) * leaf, y1 + Math.sin(la) * leaf, leaf * .9, leaf * .4, la); }
  };
  x.beginPath(); x.moveTo(42, 84); x.bezierCurveTo(46, 70, 44, 60, 47, 52); x.lineTo(53, 52); x.bezierCurveTo(56, 60, 54, 70, 58, 84); x.closePath(); x.fill();
  branch(50, 54, -Math.PI / 2 - .28 * sp, 14, 6, depth - 1); branch(50, 54, -Math.PI / 2 + .28 * sp, 14, 6, depth - 1); branch(50, 52, -Math.PI / 2, 12, 5, depth - 2);
  if (el.roots) { x.beginPath(); x.moveTo(42, 82); x.bezierCurveTo(34, 90, 20, 94, 6, 97); x.lineTo(94, 97); x.bezierCurveTo(80, 94, 66, 90, 58, 82); x.closePath(); x.fill(); for (const t of [-1, -.4, .4, 1]) { x.lineWidth = 1.6; x.beginPath(); x.moveTo(50 + t * 4, 86); x.quadraticCurveTo(50 + t * 16, 92, 50 + t * 34, 99); x.stroke(); } }
  if (el.gems) g.cut(() => { g.diamond(50, 64, 3, 6); g.diamond(50, 76, 2.2, 4); });
  x.restore(); return M;
}
def('tree', 'Tree of life', { w: 40, h: 40, seed: 3, depth: 6, spread: .9, leaves: true, leafSize: 1, roots: true, ring: true, gems: true, ...PAINT_DEF, color: '#3a2a8a', color2: '#2fb8ff', grad: true, gangle: 90 },
  [['seed', 'Seed', 'num', { min: 1, max: 9999, step: 1 }], ['depth', 'Branching', 'range', { min: 2, max: 8, step: 1 }], ['spread', 'Spread', 'range', { min: .3, max: 1.6, step: .01 }], ['leaves', 'Leaves', 'check'], ['leafSize', 'Leaf size', 'range', { min: .4, max: 2.5, step: .05 }, e => e.leaves], ['roots', 'Roots', 'check'], ['ring', 'Ring', 'check'], ['gems', 'Gem cut-outs', 'check'], ...PAINT_P],
  function (c, el, ov, k) { paintMask(c, el, ov, k, (iw, ih) => treeMask(el, iw, ih)); }, 'M12 3c4 0 7 3 7 6s-3 5-7 5-7-2-7-5 3-6 7-6zM12 14v7M8 21h8');

def('halftone', 'Halftone field', { w: 60, h: 40, cell: 1.1, scale: 16, contrast: 1.6, threshold: .3, seed: 5, dot: 'square', color: '#1a2cff' },
  [['cell', 'Cell (mm)', 'range', { min: .3, max: 4, step: .05 }], ['scale', 'Cloud size (mm)', 'range', { min: 3, max: 60, step: .5 }], ['contrast', 'Contrast', 'range', { min: .5, max: 4, step: .05 }], ['threshold', 'Threshold', 'range', { min: 0, max: .9, step: .01 }], ['dot', 'Dot', 'select', [['square', 'Square'], ['round', 'Round']]], ['seed', 'Seed', 'num', { min: 1, max: 9999, step: 1 }], ['color', 'Colour', 'color']],
  function (c, el, ov, k) {
    const R = rng(el.seed * 31 + 7), G = 24, grid = Array.from({ length: G * G }, () => R()), sm = t => t * t * (3 - 2 * t);
    const noise = (u, v) => { const i = Math.floor(u), j = Math.floor(v), fu = sm(u - i), fv = sm(v - j), at = (a, b) => grid[((a % G) + G) % G + (((b % G) + G) % G) * G]; return (at(i, j) * (1 - fu) + at(i + 1, j) * fu) * (1 - fv) + (at(i, j + 1) * (1 - fu) + at(i + 1, j + 1) * fu) * fv; };
    c.fillStyle = fillOf(ov, el.color); const cs = Math.max(.2, el.cell), nx = Math.ceil(el.w / cs), ny = Math.ceil(el.h / cs);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const px = i * cs, py = j * cs, v = (noise(px / el.scale, py / el.scale) * .7 + noise(px / el.scale * 2.3 + 9, py / el.scale * 2.3) * .3 - el.threshold) * el.contrast; if (v <= .04) continue; const d = Math.min(1, v) * cs * .92, X = -el.w / 2 + px + cs / 2, Y = -el.h / 2 + py + cs / 2; if (el.dot === 'round') { c.beginPath(); c.arc(X, Y, d / 2, 0, Math.PI * 2); c.fill(); } else c.fillRect(X - d / 2, Y - d / 2, d, d); }
  }, 'M4 4h3v3H4zM10 4h2v2h-2zM16 4h1v1h-1zM4 10h2v2H4zM10 10h3v3h-3zM4 16h1v1H4z');
def('rim', 'Shape border', { w: 60, h: 60, inset: 2.2, lw: .9, color: '#d6b25e', double: true, gap: 1.3, dash: 0, studs: 0 },
  [['inset', 'Inset (mm)', 'range', { min: 0, max: 15, step: .1 }], ['lw', 'Line (mm)', 'range', { min: .1, max: 4, step: .05 }], ['double', 'Double line', 'check'], ['gap', 'Gap (mm)', 'range', { min: .2, max: 6, step: .1 }, e => e.double], ['dash', 'Dash / stitch (mm)', 'range', { min: 0, max: 4, step: .05 }], ['studs', 'Studs', 'range', { min: 0, max: 48, step: 1 }], ['color', 'Colour', 'color']],
  function (c, el, ov, k) {
    const C = P.card, pts = C.shape && C.shape !== 'rect' ? cardOutline(C.shape, el.w, el.h) : null;
    const outline = (ins) => { if (!pts) return null; const kx = 1 - 2 * ins / el.w, ky = 1 - 2 * ins / el.h; return pts.map(([x, y]) => [(x - el.w / 2) * kx, (y - el.h / 2) * ky]); };
    const path = (ins) => { c.beginPath(); const p = outline(ins); if (p) { p.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); } else rr(c, -el.w / 2 + ins, -el.h / 2 + ins, el.w - 2 * ins, el.h - 2 * ins, Math.max(.1, (C.r || 2) - ins)); };
    c.strokeStyle = c.fillStyle = fillOf(ov, el.color); c.lineJoin = 'round'; c.lineCap = 'round'; c.setLineDash(el.dash > 0 ? [el.dash, el.dash * .7] : []);
    c.lineWidth = el.lw; path(el.inset + el.lw / 2); c.stroke();
    if (el.double) { c.lineWidth = el.lw * .45; path(el.inset + el.lw + el.gap); c.stroke(); }
    c.setLineDash([]);
    if (el.studs > 0) { const p = outline(el.inset + el.lw / 2) || (() => { const q = [], w = el.w / 2 - el.inset - el.lw / 2, h = el.h / 2 - el.inset - el.lw / 2; for (const [x, y] of [[-w, -h], [w, -h], [w, h], [-w, h]]) q.push([x, y]); return q; })();
      const seg = p.map((a, i) => { const b = p[(i + 1) % p.length]; return Math.hypot(b[0] - a[0], b[1] - a[1]); }), tot = seg.reduce((a, b) => a + b, 0), step = tot / el.studs;
      for (let n = 0; n < el.studs; n++) { let d = n * step, i = 0; while (d > seg[i]) { d -= seg[i]; i++; } const a = p[i], b = p[(i + 1) % p.length], t = d / seg[i]; c.beginPath(); c.arc(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, el.lw * .95, 0, Math.PI * 2); c.fill(); } }
  }, 'M4 4h16v16H4zM7 7h10v10H7z');
