/* ================= high-detail procedural substrate textures (seamless noise, 4K-ready) ================= */
const TEXN = (() => {
  const cache = new Map();
  const lattice = (seed, P) => { const R = rng(seed), g = new Float32Array(P * P); for (let i = 0; i < g.length; i++) g[i] = R(); return g; };
  const sm = t => t * t * (3 - 2 * t);
  const sample = (g, P, x, y) => { const xi = Math.floor(x), yi = Math.floor(y), fx = sm(x - xi), fy = sm(y - yi), x0 = ((xi % P) + P) % P, y0 = ((yi % P) + P) % P, x1 = (x0 + 1) % P, y1 = (y0 + 1) % P; const a = g[y0 * P + x0], b = g[y0 * P + x1], c = g[y1 * P + x0], d = g[y1 * P + x1]; return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy; };
  /* seamless fBm over the unit square: base lattice cells across, octaves doubling */
  const fbmF = (seed, base, oct, gain = .5) => { const L = []; for (let o = 0; o < oct; o++) L.push([lattice(seed + o * 101, base << o), base << o]); return (u, v) => { let s = 0, a = 1, n = 0; for (const [g, P] of L) { s += sample(g, P, u * P, v * P) * a; n += a; a *= gain; } return s / n; }; };
  /* build (once) a size×size canvas from f(u,v) -> [r,g,b] or gray number */
  const tile = (key, size, f) => { if (cache.has(key)) return cache.get(key); const cv = document.createElement('canvas'); cv.width = cv.height = size; const x = cv.getContext('2d'), im = x.createImageData(size, size), d = im.data;
    for (let j = 0; j < size; j++) for (let i = 0; i < size; i++) { const v = f(i / size, j / size), p = (j * size + i) * 4; if (typeof v === 'number') { const q = Math.max(0, Math.min(255, v * 255)); d[p] = d[p + 1] = d[p + 2] = q; } else { d[p] = v[0]; d[p + 1] = v[1]; d[p + 2] = v[2]; } d[p + 3] = 255; }
    x.putImageData(im, 0, 0); cache.set(key, cv); return cv; };
  const hsl = (h, s, l) => { const f = n => { const k = (n + h * 12) % 12; return 255 * (l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1))); }; return [f(0), f(8), f(4)]; };
  return {
    clouds: () => { const f = fbmF(11, 4, 6, .55); return tile('clouds', 512, (u, v) => f(u, v)); },
    fine: () => { const f = fbmF(23, 32, 4, .6); return tile('fine', 512, (u, v) => .5 + (f(u, v) - .5) * 1.8); },
    marble: () => { const w1 = fbmF(31, 3, 6, .55), w2 = fbmF(37, 3, 6, .55), b = fbmF(41, 2, 7, .52); return tile('marble', 1024, (u, v) => { const q = b(u + (w1(u, v) - .5) * .55, v + (w2(u, v) - .5) * .55), r = 1 - Math.abs(Math.sin(q * Math.PI * 4)); return 1 - (Math.pow(r, 16) * .75 + Math.pow(r, 4) * .12); }); },
    slate: () => { const a = fbmF(51, 3, 6, .55), b = fbmF(57, 16, 4, .6); return tile('slate', 1024, (u, v) => { const s = a(u, v * .25 + a(u * .5, v) * .3); return .35 + s * .45 + (b(u, v) - .5) * .35 + .12 * Math.pow(Math.abs(Math.sin((v * 9 + s * 3) * Math.PI)), 12); }); },
    nacre: () => { const a = fbmF(61, 3, 5, .55), b = fbmF(67, 6, 4, .55); return tile('nacre', 512, (u, v) => { const t = a(u, v) * 2.2 + b(u, v) * .8; return hsl((t + .55) % 1, .55, .74); }); },
    diffraction: () => { const a = fbmF(71, 2, 4, .5); return tile('diffraction', 512, (u, v) => { const t = u * 2 + v + a(u, v) * .6; return hsl(((t % 1) + 1) % 1, .9, .6); }); },
    bands: () => { const a = fbmF(81, 2, 5, .55); return tile('bands', 512, (u, v) => .5 + .5 * Math.sin((v * 46 + a(u, v) * 9) * Math.PI)); },
    heat: () => { const a = fbmF(91, 2, 4, .5); return tile('heat', 512, (u, v) => { const t = u * .7 + v * .3 + (a(u, v) - .5) * .4; return hsl((.6 + t * .55) % 1, .7, .55); }); },
    twill: () => tile('twill', 128, (u, v) => { const t = ((u + v) * 8) % 1, warp = Math.sin(t * Math.PI), weft = .5 + .5 * Math.sin(((u - v) * 32) * Math.PI * 2), fuzz = ((Math.sin(u * 912.1 + v * 77.3) * 43758.5453) % 1 + 1) % 1; return .18 + warp * .62 + weft * .1 + fuzz * .1; }),
  };
})();

const _subTex0 = subTex;
subTex = function (c, ch, k) {
  const C = P.card, S = sub(), W = C.w * k, Hh = C.h * k, R = rng(C.seed * 29 + (ch === 'A' ? 1 : ch === 'H' ? 2 : 3)), tex = S.tex2 || S.tex;
  const pt = (cv, mm, rot = 0, sx = 1, sy = 1) => { const s = mm * k / cv.width, p = c.createPattern(cv, 'repeat'); p.setTransform(new DOMMatrix([s * sx * Math.cos(rot), s * sx * Math.sin(rot), -s * sy * Math.sin(rot), s * sy * Math.cos(rot), 0, 0])); return p; };
  const layer = (fill, op, a) => { c.save(); c.globalCompositeOperation = op; c.globalAlpha = a; c.fillStyle = fill; c.fillRect(0, 0, W, Hh); c.restore(); };
  const scratches = (n, col, a, len) => { c.save(); c.strokeStyle = col; c.lineCap = 'round'; for (let i = 0; i < n; i++) { c.globalAlpha = a * (.3 + R() * .7); c.lineWidth = Math.max(.6, k * (.008 + R() * .02)); const x = R() * W, y = R() * Hh, an = R() * Math.PI, l = (len * (.3 + R())) * k; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + Math.cos(an) * l * .5 + (R() - .5) * k, y + Math.sin(an) * l * .5 + (R() - .5) * k, x + Math.cos(an) * l, y + Math.sin(an) * l); c.stroke(); } c.restore(); };
  switch (tex) {
    case 'marble2': {   // domain-warped veins over soft clouds
      const M = TEXN.marble(), Cl = TEXN.clouds();
      if (ch === 'A') { layer(pt(Cl, 70, .3), 'multiply', .1); layer(pt(M, 110, .55), 'multiply', .7); layer(pt(M, 170, -.4, 1, 1.3), 'multiply', .25); layer(pt(Cl, 28, 1.1), 'screen', .08); }
      else if (ch === 'H') { layer(pt(M, 110, .55), 'multiply', .2); layer(pt(TEXN.fine(), 6), 'source-over', .12); }
      else layer(pt(M, 110, .55), 'multiply', .12);
      return;
    }
    case 'slate': {
      const Sl = TEXN.slate();
      if (ch === 'A') { layer(pt(Sl, 60, .08), 'multiply', .7); layer(pt(TEXN.clouds(), 45, 1.3), 'soft-light', .5); layer(pt(TEXN.fine(), 7), 'multiply', .25); }
      else if (ch === 'H') { layer(pt(Sl, 60, .08), 'source-over', .85); layer(pt(TEXN.fine(), 7), 'multiply', .4); }
      else layer(pt(TEXN.fine(), 7), 'screen', .3);
      return;
    }
    case 'twill': {
      const Tw = TEXN.twill();
      if (ch === 'A') { layer(pt(Tw, 1.8), 'multiply', .72); layer(pt(TEXN.clouds(), 50), 'soft-light', .35); layer(pt(TEXN.fine(), 4), 'multiply', .15); }
      else if (ch === 'H') layer(pt(Tw, 1.8), 'source-over', .95);
      else layer(pt(Tw, 1.5), 'screen', .25);
      return;
    }
    case 'nacre': {
      if (ch === 'A') { layer(pt(TEXN.nacre(), 55, .4), 'multiply', .17); layer(pt(TEXN.nacre(), 23, -.7), 'multiply', .07); layer(pt(TEXN.clouds(), 40), 'soft-light', .3); layer(pt(TEXN.clouds(), 14, .9), 'screen', .1); }
      else if (ch === 'H') layer(pt(TEXN.fine(), 3), 'source-over', .08);
      return;
    }
    case 'diffraction': {
      if (ch === 'A') { layer(pt(TEXN.diffraction(), 26, .35), 'soft-light', .9); layer(pt(TEXN.diffraction(), 9, -.5), 'screen', .16); }
      else if (ch === 'H') layer(pt(TEXN.fine(), 2.5), 'source-over', .1);
      else scratches(160, '#fff', .2, 3);
      return;
    }
    case 'peel': {   // plastics and enamel: faint orange-peel and cloudiness
      if (ch === 'A') { layer(pt(TEXN.clouds(), 60, .2), 'soft-light', .18); layer(pt(TEXN.fine(), 5), 'soft-light', .1); }
      else if (ch === 'H') { layer(pt(TEXN.fine(), 2.2), 'source-over', .22); layer(pt(TEXN.fine(), .9, .6), 'multiply', .15); }
      else layer(pt(TEXN.clouds(), 30), 'screen', .1);
      return;
    }
    case 'ivory': {
      if (ch === 'A') { layer(pt(TEXN.bands(), 70, .12, 1, 1), 'multiply', .035); layer(pt(TEXN.clouds(), 50, .7), 'soft-light', .3); layer(pt(TEXN.fine(), 6), 'soft-light', .12); }
      else if (ch === 'H') layer(pt(TEXN.bands(), 70, .12), 'source-over', .02);
      return;
    }
    case 'glass': {   // clear sheets: micro-scratches and faint polish haze
      if (ch === 'H') { layer(pt(TEXN.fine(), 1.4), 'source-over', .06); scratches(220, '#000', .35, 4); }
      else if (ch !== 'A') { scratches(260, '#fff', .3, 4); layer(pt(TEXN.clouds(), 40), 'screen', .06); }
      return;
    }
    case 'frost': {
      if (ch === 'H') { layer(pt(TEXN.fine(), 1.1), 'source-over', .55); layer(pt(TEXN.fine(), .45, .7), 'multiply', .35); layer(pt(TEXN.clouds(), 30), 'soft-light', .3); }
      else if (ch !== 'A') layer(pt(TEXN.fine(), 1.1), 'screen', .4);
      return;
    }
  }
  _subTex0(c, ch, k);
  /* enrich the original families */
  if (tex === 'brushed') {
    if (ch === 'A') { layer(pt(TEXN.clouds(), 55, .2), 'soft-light', .35); if (S.heat) layer(pt(TEXN.heat(), 70, .3), 'soft-light', .55); scratches(Math.round(C.w * C.h / 22), 'rgba(255,255,255,1)', .12, 5); scratches(Math.round(C.w * C.h / 45), 'rgba(0,0,0,1)', .1, 4); }
    else if (ch === 'H') scratches(Math.round(C.w * C.h / 30), '#000', .25, 5);
    else { scratches(Math.round(C.w * C.h / 25), '#fff', .3, 5); layer(pt(TEXN.clouds(), 40), 'soft-light', .3); }
  } else if (tex === 'wood') {
    if (ch === 'A') { layer(pt(TEXN.clouds(), 60, .05, 3, .6), 'soft-light', .45); c.save(); c.fillStyle = 'rgba(30,16,8,1)'; for (let i = 0, n = Math.round(C.w * C.h * 1.6); i < n; i++) { c.globalAlpha = .12 + R() * .2; const x = R() * W, y = R() * Hh; c.fillRect(x, y, k * (.15 + R() * .5), Math.max(.6, k * .03)); } c.restore(); }
    else if (ch === 'H') { c.save(); c.fillStyle = '#000'; for (let i = 0, n = Math.round(C.w * C.h * 1.2); i < n; i++) { c.globalAlpha = .25 + R() * .3; c.fillRect(R() * W, R() * Hh, k * (.15 + R() * .4), Math.max(.6, k * .03)); } c.restore(); }
  } else if (tex === 'paper') {
    if (ch === 'A') layer(pt(TEXN.clouds(), 24, .4), 'soft-light', .3);
    else if (ch === 'H') layer(pt(TEXN.fine(), 3), 'soft-light', .5);
  } else if (tex === 'carbon') {
    if (ch === 'A') layer(pt(TEXN.clouds(), 50), 'soft-light', .25);
  }
  if (S.metal && !S.clear && ch !== 'A' && tex !== 'brushed') scratches(Math.round(C.w * C.h / 30), '#fff', .25, 4);
};
/* which substrates use which family */
Object.assign(SUBS.pvc, { tex2: 'peel' }); Object.assign(SUBS.poly, { tex2: 'peel' }); Object.assign(SUBS.enamel, { tex2: 'peel' }); Object.assign(SUBS.pearl, { tex2: 'nacre' }); Object.assign(SUBS.ivory, { tex2: 'ivory' }); Object.assign(SUBS.holopvc, { tex2: 'diffraction' });
Object.assign(SUBS.marble, { tex2: 'marble2' }); Object.assign(SUBS.stone, { tex2: 'slate' }); Object.assign(SUBS.felt, { tex2: 'twill' }); Object.assign(SUBS.titanium, { heat: true });
for (const k of ['clearpvc', 'smoked', 'tinted', 'aurora', 'acr_green', 'acr_orange', 'acr_pink', 'acr_blue', 'acr_yellow']) if (SUBS[k] && !SUBS[k].tex) SUBS[k].tex2 = 'glass';
