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

/* ---------- tree of life ----------
   Branch tips are spread over a rounded crown first, then the tree grows towards them: each fork splits its tips in two
   and every limb is a tapered curve whose width follows the number of tips it feeds (so the crown is always full and
   balanced, and the limbs thin out naturally). Roots grow the same way downwards. It is mirrored into a symmetric emblem
   unless Symmetric is off; with the ring on, the outer branches and roots run into the ring. */
function treeMask(el, iw, ih) {
  const M = _gly.M; M.width = iw; M.height = ih; const x = M.getContext('2d'), s = Math.min(iw, ih) / 100;
  x.save(); x.translate((iw - 100 * s) / 2, (ih - 100 * s) / 2); x.scale(s, s); x.fillStyle = x.strokeStyle = '#fff'; x.lineCap = 'round'; x.lineJoin = 'round';
  const R = rng((el.seed || 1) * 7121 + 5), depth = Math.max(2, Math.min(8, el.depth | 0)), sp = Math.max(.3, Math.min(1.6, el.spread ?? .9)), TAU = Math.PI * 2;
  const sym = el.sym !== false, ring = !!el.ring, roots = el.roots !== false, leafOn = el.leaves !== false, shape = el.leafShape || 'leaf';
  const RC = 45.2, RW = Math.max(1, Math.min(9, el.ringW ?? 3.4)), n = 2 ** (depth - 1), trunkW = ring ? 8.6 : 10.5, wTip = trunkW / Math.sqrt(n);
  const leafL = (ring ? 4.9 : 5.2) * Math.max(.3, el.leafSize ?? 1) * Math.pow(16 / n, .22), droop = .1 + .45 * (sp - .3) / 1.3;
  const P = (px, py) => ({ x: px, y: py }), sub = (a, b) => P(a.x - b.x, a.y - b.y), len = v => Math.hypot(v.x, v.y) || 1e-6, nrm = v => { const l = len(v); return P(v.x / l, v.y / l); };
  const cen = g => P(g.reduce((t, p) => t + p.x, 0) / g.length, g.reduce((t, p) => t + p.y, 0) / g.length);
  /* layout: where the crown's tips go, where the trunk forks into limbs (yC) and into roots (yR) */
  let crown, yC, yR, rootE;
  if (ring) { crown = { cx: 50, cy: 50, rx: RC, ry: RC, icx: 50, icy: 46, ir: 37 }; yC = 56; yR = roots ? 71 : 90; rootE = { cx: 50, cy: 50, rx: RC, ry: RC }; }
  else {
    const ry = roots ? 28 : 31, cy = 3 + leafL * 1.05 + ry, rx = Math.min(45, (roots ? 31 : 34) + 14 * (sp - .9));
    crown = { cx: 50, cy, rx, ry, icx: 50, icy: cy, ir: 1 }; yC = cy + ry * (roots ? .6 : .7); yR = roots ? 76 : 95; rootE = { cx: 50, cy: yR, rx: Math.min(46, 38 + 10 * (sp - .9)), ry: Math.max(6, 95.5 - yR) };
  }
  const onE = (E, a, r) => P(E.cx + Math.cos(a) * E.rx * r, E.cy + Math.sin(a) * E.ry * r);
  /* tips: three fifths on the crown's rim, the rest inside it; only the left half when the tree is mirrored */
  const crownTips = count => {
    const out = [], a0 = -Math.PI / 2, a1 = ring ? -Math.PI + .2 - droop * .5 : -Math.PI - droop, nO = Math.max(1, Math.min(ring ? 7 : 12, Math.round(count * (ring ? .38 : .5)))), nI = count - nO;
    const ang = t => sym ? a0 + (a1 - a0) * t : a1 + (-Math.PI - 2 * a1) * t;   // the right half mirrors a1 to -π - a1
    for (let i = 0; i < nO; i++) { const p = onE(crown, ang(Math.min(1, Math.max(0, (i + .5 + (R() - .5) * .45) / nO))), 1); p.rim = ring; out.push(p); }
    for (let i = 0; i < nI; i++) {   // stratified, in two bands, so the inside of the crown fills evenly
      const a = ang(Math.min(.97, (i + .15 + R() * .7) / nI) * (ring ? .86 : 1)), r = i % 2 ? .44 + R() * .2 : .68 + R() * .2;
      out.push(ring ? P(crown.icx + Math.cos(a) * crown.ir * r * 1.06, crown.icy + Math.sin(a) * crown.ir * r) : onE(crown, a, r));
    }
    return out;
  };
  const rootTips = count => {
    const out = [], lo = Math.PI / 2 + .08, hi = ring ? Math.PI / 2 + .8 : Math.PI - .14, ang = t => sym ? lo + (hi - lo) * t : (Math.PI - hi) + (hi - (Math.PI - hi)) * t;
    for (let i = 0; i < count; i++) { const p = onE(rootE, ang((i + .5 + (R() - .5) * .4) / count), ring ? 1 : .86 + R() * .14); p.rim = ring; out.push(p); }
    return out;
  };
  /* growth: split the tips left/right as seen from each fork, step part-way towards each half, repeat */
  const segs = [], tips = [];
  const grow = (node, dir, targets, w, up, wt) => {
    if (targets.length === 1) {
      const t = targets[0], d = sub(t, node), L = len(d), u = nrm(d);
      const b = (R() - .5) * .34 * L;
      const s0 = [node, P(node.x + dir.x * L * .36 - u.y * b, node.y + dir.y * L * .36 - up * L * .16 + u.x * b), P(t.x - u.x * L * .22 - u.y * b * .5, t.y - u.y * L * .22 - up * L * .08 + u.x * b * .5), t, w, Math.max(.5, w * .5), 1, up];
      segs.push(s0); tips.push({ seg: s0, rim: !!t.rim, up }); return;
    }
    const key = p => Math.atan2(p.x - node.x, up * (node.y - p.y));
    targets.sort((a, b) => key(a) - key(b));
    let k = targets.length >> 1; if (targets.length > 5) k = Math.max(1, Math.min(targets.length - 1, k + Math.round((R() - .5) * 2)));
    for (const g of [targets.slice(0, k), targets.slice(k)]) {
      const cg = cen(g), f = Math.min(.66, .25 + .56 / Math.sqrt(g.length)), ch = P(node.x + (cg.x - node.x) * f, node.y + (cg.y - node.y) * f);
      const wc = Math.max(.55, wt * Math.sqrt(g.length)), L = len(sub(ch, node)), on = nrm(sub(cg, ch)), q = nrm(sub(ch, node)), b = (R() - .5) * .26 * L;
      segs.push([node, P(node.x + dir.x * L * .4 - q.y * b, node.y + dir.y * L * .4 - up * L * .14 + q.x * b), P(ch.x - on.x * L * .3, ch.y - on.y * L * .3 - up * L * .06), ch, Math.min(w, wc * 1.3), wc, g.length, up]);
      grow(ch, on, g, wc, up, wt);
    }
  };
  /* mirrored trees fork in two (a main limb each side, then the splitting starts); otherwise the trunk carries straight on */
  const start = (from, dir0, targets, w, up, wt) => {
    if (!sym) return grow(from, dir0, targets, w, up, wt);
    const c0 = cen(targets), n1 = P(from.x + (c0.x - from.x) * .3, from.y + (c0.y - from.y) * .3), L = len(sub(n1, from)), d1 = nrm(sub(c0, n1));
    segs.push([from, P(from.x + dir0.x * L * .45, from.y + dir0.y * L * .45), P(n1.x - d1.x * L * .35, n1.y - d1.y * L * .35), n1, w * 1.05, w * .94, targets.length, up]);
    grow(n1, d1, targets, w * .94, up, wt);
  };
  const half = sym ? n / 2 : n;
  start(P(50, yC), P(0, -1), crownTips(half), wTip * Math.sqrt(half), 1, wTip);
  const nRoots = roots ? Math.max(sym ? 2 : 3, Math.round(n / (sym ? 8 : 4))) : 0, rTip = trunkW * .95 / Math.sqrt(nRoots * (sym ? 2 : 1) || 1);
  if (roots) start(P(50, yR), P(0, 1), rootTips(nRoots), rTip * Math.sqrt(nRoots), -1, rTip);
  /* drawing */
  const at = (sg, t) => { const [a, b, c, d] = sg, m = 1 - t; return P(m * m * m * a.x + 3 * m * m * t * b.x + 3 * m * t * t * c.x + t * t * t * d.x, m * m * m * a.y + 3 * m * m * t * b.y + 3 * m * t * t * c.y + t * t * t * d.y); };
  const tan = (sg, t) => { const [a, b, c, d] = sg, m = 1 - t; return nrm(P(3 * m * m * (b.x - a.x) + 6 * m * t * (c.x - b.x) + 3 * t * t * (d.x - c.x), 3 * m * m * (b.y - a.y) + 6 * m * t * (c.y - b.y) + 3 * t * t * (d.y - c.y))); };
  const limb = sg => {
    const [a, , , d, w0, w1] = sg, N = Math.max(6, Math.min(18, Math.round(len(sub(d, a)) / 1.5))), L = [], Rr = [];
    for (let i = 0; i <= N; i++) { const t = i / N, p = at(sg, t), u = tan(sg, t), w = (w0 + (w1 - w0) * t) / 2; L.push([p.x - u.y * w, p.y + u.x * w]); Rr.push([p.x + u.y * w, p.y - u.x * w]); }
    x.beginPath(); L.forEach(([px, py], i) => i ? x.lineTo(px, py) : x.moveTo(px, py)); for (let i = Rr.length - 1; i >= 0; i--) x.lineTo(Rr[i][0], Rr[i][1]); x.closePath(); x.fill();
    x.beginPath(); x.arc(a.x, a.y, w0 / 2, 0, TAU); x.fill(); x.beginPath(); x.arc(d.x, d.y, w1 / 2, 0, TAU); x.fill();
  };
  const leaf = (p, a, L) => {
    x.save(); x.translate(p.x, p.y); x.rotate(a); x.beginPath();
    if (shape === 'round') { x.arc(L * .5, 0, L * .36, 0, TAU); }
    else if (shape === 'heart') { const h = L * .55; x.moveTo(0, 0); x.bezierCurveTo(h * .5, -h * .2, h * .55, -h * .95, h * 1.1, -h * .7); x.bezierCurveTo(h * 1.6, -h * .45, h * 1.75, -h * .05, h * 1.45, 0); x.bezierCurveTo(h * 1.75, h * .05, h * 1.6, h * .45, h * 1.1, h * .7); x.bezierCurveTo(h * .55, h * .95, h * .5, h * .2, 0, 0); }
    else if (shape === 'canopy') { x.arc(0, 0, L * 1.35, 0, TAU); }
    else { x.moveTo(0, 0); x.bezierCurveTo(L * .22, -L * .3, L * .62, -L * .32, L, 0); x.bezierCurveTo(L * .62, L * .32, L * .22, L * .3, 0, 0); }
    x.fill(); x.restore();
  };
  const foliage = () => {
    if (!leafOn) return;
    const spread = n > 32 ? [-.75, 0, .75] : [-1.1, -.55, 0, .55, 1.1];
    for (const tp of tips) {
      if (tp.up < 0) continue; const sg = tp.seg, d = tan(sg, 1), a = Math.atan2(d.y, d.x);
      if (shape === 'canopy') { leaf(sg[3], a, leafL * 1.45); leaf(at(sg, .45), a, leafL * 1.2); continue; }
      if (tp.rim) {   // a branch that runs into the ring: leaves along it instead of at its end
        for (const t of [.36, .56, .76]) { const p = at(sg, t), u = tan(sg, t), b = Math.atan2(u.y, u.x); for (const sd of [-1, 1]) leaf(p, b + sd * (.7 + R() * .3), leafL * (.75 + R() * .25)); }
        continue;
      }
      for (const o of spread) leaf(sg[3], a + o + (R() - .5) * .25, leafL * (.85 + R() * .3));
      const p = at(sg, .55), u = tan(sg, .55), b = Math.atan2(u.y, u.x); leaf(p, b + (R() < .5 ? -1 : 1) * .85, leafL * .8);
    }
    if (shape === 'canopy') for (const sg of segs) { if (sg[7] > 0 && sg[6] >= 2 && sg[6] <= 6) leaf(sg[3], 0, leafL * 1.3); }
    else for (const sg of segs) { const sz = sg[6]; if (sg[7] < 0 || sz < 2 || sz > 4) continue; for (const [t, sd] of sz === 2 ? [[.45, -1], [.78, 1]] : [[.62, R() < .5 ? -1 : 1]]) { const p = at(sg, t), u = tan(sg, t), b = Math.atan2(u.y, u.x); leaf(p, b + sd * .85, leafL * (sz === 2 ? .8 : .72)); } }
  };
  if (ring) { x.save(); x.beginPath(); x.arc(50, 50, RC + RW / 2, 0, TAU); x.clip(); x.lineWidth = RW; x.beginPath(); x.arc(50, 50, RC, 0, TAU); x.stroke(); }
  /* the trunk: waisted, flaring into the limbs above and the roots (or a small mound) below */
  const tw = trunkW, top = yC - 3.2, bot = roots ? yR + 2.6 : yR, hgt = bot - top, bw = roots ? .48 : .6;   // runs a little past both forks, so limbs and roots grow out of it
  x.beginPath(); x.moveTo(50 - tw * bw, bot); x.bezierCurveTo(50 - tw * .36, bot - hgt * .36, 50 - tw * .36, top + hgt * .34, 50 - tw * .4, top);
  x.quadraticCurveTo(50, top - tw * .25, 50 + tw * .4, top); x.bezierCurveTo(50 + tw * .36, top + hgt * .34, 50 + tw * .36, bot - hgt * .36, 50 + tw * bw, bot);
  if (roots) x.quadraticCurveTo(50, bot + tw * .25, 50 - tw * bw, bot); x.closePath(); x.fill();
  if (!roots) { x.beginPath(); x.moveTo(50 - tw * 1.45, bot); x.quadraticCurveTo(50 - tw * .62, bot - .4, 50 - tw * .48, bot - hgt * .26); x.lineTo(50 + tw * .48, bot - hgt * .26); x.quadraticCurveTo(50 + tw * .62, bot - .4, 50 + tw * 1.45, bot); x.closePath(); x.fill(); }
  const drawHalf = () => { for (const sg of segs) limb(sg); foliage(); };
  drawHalf(); if (sym) { x.save(); x.translate(100, 0); x.scale(-1, 1); drawHalf(); x.restore(); }
  if (el.gems) {   // a faceted gem set in the trunk
    const gy = roots ? (yC + yR) / 2 + .5 : yC + 10, gw = tw * .34, gh = tw * .62;
    x.save(); x.globalCompositeOperation = 'destination-out'; x.beginPath(); x.moveTo(50, gy - gh); x.lineTo(50 + gw, gy - gh * .25); x.lineTo(50, gy + gh); x.lineTo(50 - gw, gy - gh * .25); x.closePath(); x.fill(); x.restore();
    x.beginPath(); x.moveTo(50, gy - gh * .62); x.lineTo(50 + gw * .55, gy - gh * .2); x.lineTo(50, gy + gh * .6); x.lineTo(50 - gw * .55, gy - gh * .2); x.closePath(); x.fill();
  }
  if (ring) x.restore();
  x.restore(); return M;
}
def('tree', 'Tree of life', { w: 40, h: 40, seed: 3, depth: 6, spread: .9, sym: true, leaves: true, leafShape: 'leaf', leafSize: 1, roots: true, ring: true, ringW: 3.4, gems: true, ...PAINT_DEF, color: '#3a2a8a', color2: '#2fb8ff', grad: true, gangle: 90 },
  [['seed', 'Seed', 'num', { min: 1, max: 9999, step: 1 }], ['depth', 'Branching', 'range', { min: 2, max: 8, step: 1 }], ['spread', 'Spread', 'range', { min: .3, max: 1.6, step: .01 }], ['sym', 'Symmetric', 'check'],
   ['leaves', 'Leaves', 'check'], ['leafShape', 'Leaf shape', 'select', [['leaf', 'Leaves'], ['round', 'Blossoms'], ['heart', 'Hearts'], ['canopy', 'Full canopy']], e => e.leaves], ['leafSize', 'Leaf size', 'range', { min: .4, max: 2.5, step: .05 }, e => e.leaves],
   ['roots', 'Roots', 'check'], ['ring', 'Ring', 'check'], ['ringW', 'Ring weight', 'range', { min: 1, max: 9, step: .1 }, e => e.ring], ['gems', 'Gem in the trunk', 'check'], ...PAINT_P],
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
