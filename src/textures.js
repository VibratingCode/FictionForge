/* ================= high-detail procedural substrate textures (seamless noise, 4K-ready) =================
   Rules: every tile is periodic in u and v (no seams), nothing paints highlights or glare into the
   albedo (lighting belongs to the renderer), and detail stays quiet enough to sit under a design. */
const TEXN = (() => {
  const cache = new Map();
  const lattice = (seed, P) => { const R = rng(seed), g = new Float32Array(P * P); for (let i = 0; i < g.length; i++) g[i] = R(); return g; };
  const sm = t => t * t * (3 - 2 * t);
  const sample = (g, P, x, y) => { const xi = Math.floor(x), yi = Math.floor(y), fx = sm(x - xi), fy = sm(y - yi), x0 = ((xi % P) + P) % P, y0 = ((yi % P) + P) % P, x1 = (x0 + 1) % P, y1 = (y0 + 1) % P; const a = g[y0 * P + x0], b = g[y0 * P + x1], c = g[y1 * P + x0], d = g[y1 * P + x1]; return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy; };
  /* seamless fBm over the unit square: `base` lattice cells across, octaves doubling (all periodic in 1) */
  const fbmF = (seed, base, oct, gain = .5) => { const L = []; for (let o = 0; o < oct; o++) L.push([lattice(seed + o * 101, base << o), base << o]); return (u, v) => { let s = 0, a = 1, n = 0; for (const [g, P] of L) { s += sample(g, P, u * P, v * P) * a; n += a; a *= gain; } return s / n; }; };
  /* build (once) a size×size canvas from f(u,v) -> [r,g,b] or a gray number */
  const tile = (key, size, f) => { if (cache.has(key)) return cache.get(key); const cv = document.createElement('canvas'); cv.width = cv.height = size; const x = cv.getContext('2d'), im = x.createImageData(size, size), d = im.data;
    for (let j = 0; j < size; j++) for (let i = 0; i < size; i++) { const v = f(i / size, j / size), p = (j * size + i) * 4; if (typeof v === 'number') { const q = Math.max(0, Math.min(255, v * 255)); d[p] = d[p + 1] = d[p + 2] = q; } else { d[p] = v[0]; d[p + 1] = v[1]; d[p + 2] = v[2]; } d[p + 3] = 255; }
    x.putImageData(im, 0, 0); cache.set(key, cv); return cv; };
  const hsl = (h, s, l) => { h = ((h % 1) + 1) % 1; const f = n => { const k = (n + h * 12) % 12; return 255 * (l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(k - 3, 9 - k, 1))); }; return [f(0), f(8), f(4)]; };
  const TAU = Math.PI * 2;
  return {
    /* soft large-scale variation */
    clouds: () => { const f = fbmF(11, 4, 6, .55); return tile('clouds', 512, (u, v) => f(u, v)); },
    /* fine isotropic grain */
    fine: () => { const f = fbmF(23, 32, 4, .6); return tile('fine', 512, (u, v) => .5 + (f(u, v) - .5) * 1.8); },
    /* marble: contour veins of a gently warped field, soft core with a faint halo (no hard black cracks) */
    marble: () => { const t1 = fbmF(31, 2, 6, .52), t2 = fbmF(37, 3, 5, .5), t3 = fbmF(43, 4, 5, .55);
      return tile('marble3', 1024, (u, v) => {   // two turbulent vein systems (integer slopes keep it seamless), cool grey
        const q1 = u * 2 + v + (t1(u, v) - .5) * 1.7, q2 = u - v * 2 + (t2(u, v) - .5) * 1.5, r1 = 1 - Math.abs(Math.sin(q1 * Math.PI)), r2 = 1 - Math.abs(Math.sin(q2 * Math.PI));
        const d = Math.min(1, Math.pow(r1, 14) * .55 + Math.pow(r1, 4) * .15 + Math.pow(r2, 24) * .28 + Math.pow(r2, 7) * .06 + (t3(u, v) - .5) * .05), g = 1 - d;
        return [g * 255, (g + d * .025) * 255, (g + d * .07) * 255]; }); },
    /* slate: cloudy charcoal with faint horizontal cleavage layers */
    slate: () => { const a = fbmF(51, 3, 5, .55), c = fbmF(53, 2, 4, .5), f = fbmF(57, 24, 3, .55);
      return tile('slate2', 1024, (u, v) => { const lay = Math.sin(TAU * (v * 7 + (c(u, v) - .5) * 1.4)); return .55 + (a(u, v) - .5) * .5 + lay * .045 + (f(u, v) - .5) * .12; }); },
    /* pearl: smooth pastel drift */
    nacre: () => { const a = fbmF(61, 2, 4, .5), b = fbmF(67, 3, 3, .5); return tile('nacre2', 512, (u, v) => hsl(.55 + a(u, v) * 1.3 + b(u, v) * .35, .42, .8)); },
    /* holographic foil: diffraction sweep */
    diffraction: () => { const a = fbmF(71, 2, 4, .5); return tile('diffraction', 512, (u, v) => hsl(u * 2 + v + a(u, v) * .6, .7, .62)); },
    /* anodised titanium: deep blue drifting toward violet and teal, very low frequency */
    anod: () => { const a = fbmF(91, 2, 4, .5), b = fbmF(97, 5, 3, .5); return tile('anod2', 512, (u, v) => hsl(.645 + (a(u, v) - .5) * .26 + (b(u, v) - .5) * .04, .5, .46)); },
    /* woven twill */
    twill: () => tile('twill', 128, (u, v) => { const t = ((u + v) * 8) % 1, warp = Math.sin(t * Math.PI), weft = .5 + .5 * Math.sin(((u - v) * 32) * TAU), fuzz = ((Math.sin(u * 912.1 + v * 77.3) * 43758.5453) % 1 + 1) % 1; return .3 + warp * .5 + weft * .1 + fuzz * .1; }),
  };
})();

const _subTex0 = subTex;
subTex = function (c, ch, k) {
  const C = P.card, S = sub(), W = C.w * k, Hh = C.h * k, tex = S.tex2 || S.tex;
  /* repeating pattern of a tile `mm` millimetres across, optionally rotated and stretched */
  const pt = (cv, mm, rot = 0, sx = 1, sy = 1) => { const s = mm * k / cv.width, p = c.createPattern(cv, 'repeat'); p.setTransform(new DOMMatrix([s * sx * Math.cos(rot), s * sx * Math.sin(rot), -s * sy * Math.sin(rot), s * sy * Math.cos(rot), 0, 0])); return p; };
  const layer = (fill, op, a) => { c.save(); c.imageSmoothingQuality = 'high'; c.globalCompositeOperation = op; c.globalAlpha = a; c.fillStyle = fill; c.fillRect(0, 0, W, Hh); c.restore(); };
  switch (tex) {
    case 'marble2': {   // soft grey veins over faint clouds, a second finer vein set for depth
      const M = TEXN.marble(), Cl = TEXN.clouds();
      if (ch === 'A') { layer(pt(Cl, 80, .3), 'multiply', .07); layer(pt(M, 125, .35), 'multiply', .72); layer(pt(M, 58, -1.1, 1, 1.3), 'multiply', .14); layer(pt(Cl, 30, 1.1), 'soft-light', .12); }
      return;
    }
    case 'slate': {
      const Sl = TEXN.slate();
      if (ch === 'A') { layer(pt(Sl, 70, .04), 'multiply', .42); layer(pt(TEXN.clouds(), 55, 1.3), 'soft-light', .22); }
      else if (ch === 'H') { layer(pt(Sl, 70, .04), 'source-over', .2); layer(pt(TEXN.fine(), 8), 'soft-light', .1); }
      return;
    }
    case 'twill': {
      const Tw = TEXN.twill();
      if (ch === 'A') { layer(pt(Tw, 1.8), 'multiply', .3); layer(pt(TEXN.clouds(), 60), 'soft-light', .12); }
      else if (ch === 'H') layer(pt(Tw, 1.8), 'source-over', .55);
      else layer(pt(Tw, 1.8), 'screen', .12);
      return;
    }
    case 'nacre': {   // white with a gentle pastel drift, no blotches
      if (ch === 'A') { const N = TEXN.nacre(); layer(pt(N, 150, .4), 'multiply', .1); layer(pt(N, 150, .4), 'soft-light', .3); layer(pt(TEXN.clouds(), 60), 'soft-light', .08); }
      return;
    }
    case 'diffraction': {   // silver foil with a faint rainbow grain; the live holo effect does the rest
      if (ch === 'A') { layer(pt(TEXN.diffraction(), 170, .5), 'soft-light', .22); layer(pt(TEXN.fine(), 4), 'soft-light', .06); }
      return;
    }
    case 'peel': {   // plastics and enamel: faint cloudiness and a fine orange-peel surface
      if (ch === 'A') layer(pt(TEXN.clouds(), 70, .2), 'soft-light', .1);
      else if (ch === 'H') { layer(pt(TEXN.fine(), 2.2), 'source-over', .1); layer(pt(TEXN.fine(), .9, .6), 'multiply', .06); }
      return;
    }
    case 'ivory': {   // warm cream, soft depth and a faint straight grain
      if (ch === 'A') { layer(pt(TEXN.clouds(), 60, .7), 'soft-light', .2); layer(pt(TEXN.fine(), 5, 0, 10, .6), 'multiply', .035); }
      return;
    }
    case 'glass': return;   // clean, polished sheet: no scratches
    case 'frost': {
      if (ch === 'H') { layer(pt(TEXN.fine(), 1.1), 'source-over', .45); layer(pt(TEXN.fine(), .45, .7), 'multiply', .25); }
      else if (ch === 'R') layer(pt(TEXN.fine(), 1.1), 'screen', .25);
      return;
    }
  }
  _subTex0(c, ch, k);
  /* refine the original families */
  if (tex === 'brushed') {
    if (ch === 'A' || ch === 'R') layer(pt(TEXN.fine(), 6, 0, 16, .35), 'soft-light', ch === 'A' ? .26 : .18);   // long brushing streaks
    if (ch === 'A' && (C.sub === 'iron' || C.sub === 'bronze')) layer(pt(TEXN.clouds(), 70, .2), 'soft-light', .2);   // forged / patinated variation
    if (ch === 'A' && S.anod) layer(pt(TEXN.anod(), 120, .35), 'color', .86);   // anodised colour, brushing kept in the luminance
  } else if (tex === 'wood') {
    const R = rng(C.seed * 29 + (ch === 'A' ? 1 : 2));
    if (ch === 'A') { layer(pt(TEXN.clouds(), 60, .05, 3, .6), 'soft-light', .35); c.save(); c.fillStyle = 'rgba(30,16,8,1)'; for (let i = 0, n = Math.round(C.w * C.h * 1.6); i < n; i++) { c.globalAlpha = .1 + R() * .16; const x = R() * W, y = R() * Hh; c.fillRect(x, y, k * (.15 + R() * .5), Math.max(.6, k * .03)); } c.restore(); }
    else if (ch === 'H') { c.save(); c.fillStyle = '#000'; for (let i = 0, n = Math.round(C.w * C.h * 1.2); i < n; i++) { c.globalAlpha = .18 + R() * .25; c.fillRect(R() * W, R() * Hh, k * (.15 + R() * .4), Math.max(.6, k * .03)); } c.restore(); }
  } else if (tex === 'paper') {
    if (ch === 'A') layer(pt(TEXN.clouds(), 24, .4), 'soft-light', .25);
  } else if (tex === 'carbon') {
    if (ch === 'A') layer(pt(TEXN.clouds(), 60), 'soft-light', .12);
  }
};
/* which substrates use which family */
Object.assign(SUBS.pvc, { tex2: 'peel' }); Object.assign(SUBS.poly, { tex2: 'peel' }); Object.assign(SUBS.enamel, { tex2: 'peel' }); Object.assign(SUBS.pearl, { tex2: 'nacre' }); Object.assign(SUBS.ivory, { tex2: 'ivory' }); Object.assign(SUBS.holopvc, { tex2: 'diffraction' });
Object.assign(SUBS.marble, { tex2: 'marble2' }); Object.assign(SUBS.stone, { tex2: 'slate' }); Object.assign(SUBS.felt, { tex2: 'twill' });
Object.assign(SUBS.titanium, { anod: true, color: '#66739c', irid: .35 });
for (const k of ['clearpvc', 'smoked', 'tinted', 'aurora', 'acr_green', 'acr_orange', 'acr_pink', 'acr_blue', 'acr_yellow']) if (SUBS[k] && !SUBS[k].tex) SUBS[k].tex2 = 'glass';
