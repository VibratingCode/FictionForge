/* ================= ID Forge — print engine ================= */
const Forge = window.Forge = {};
const $ = (s, r = document) => r.querySelector(s);
const clamp = (v, a, b) => v < a ? a : v > b ? b : v, lerp = (a, b, t) => a + (b - a) * t;
const uid = () => 'e' + Math.random().toString(36).slice(2, 10);
function rng(seed) { let a = (seed >>> 0) || 1; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function hashStr(s) { s = String(s); let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
const NP = (() => { const r = rng(1337), p = new Float32Array(65536); for (let i = 0; i < 65536; i++) p[i] = r(); return p; })();
function pnoise(x, y, per) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const w = per ? (i) => ((i % per) + per) % per : (i) => i;
  const g = (i, j) => NP[((w(j) & 255) << 8) | (w(i) & 255)];
  const a = g(xi, yi), b = g(xi + 1, yi), c = g(xi, yi + 1), d = g(xi + 1, yi + 1);
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, y, o) { o = o || 4; let s = 0, a = .5, f = 1, n = 0; for (let i = 0; i < o; i++) { s += a * pnoise(x * f + i * 31.7, y * f - i * 17.3); n += a; f *= 2; a *= .5; } return s / n; }
function pfbm(x, y, base, o) { let s = 0, a = .5, f = 1, n = 0; for (let i = 0; i < o; i++) { s += a * pnoise(x * base * f, y * base * f, base * f); n += a; f *= 2; a *= .5; } return s / n; }
Forge.fbm = fbm; Forge.rng = rng;
function hex2rgb(h) { h = String(h || '#000').replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h.slice(0, 6), 16) || 0; return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
function rgb2hex(r, g, b) { return '#' + [r, g, b].map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join(''); }
function mix(a, b, t) { const A = hex2rgb(a), B = hex2rgb(b); return rgb2hex(lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t)); }
function mix3(a, b, c, t) { return t < .5 ? mix(a, b, t * 2) : mix(b, c, t * 2 - 1); }
function shade(c, t) { return t < 0 ? mix(c, '#000000', -t) : mix(c, '#ffffff', t); }
function hexA(c, a) { const [r, g, b] = hex2rgb(c); return `rgba(${r},${g},${b},${clamp(a, 0, 1)})`; }
function gray(v) { v = clamp(Math.round(v * 255), 0, 255); return `rgb(${v},${v},${v})`; }
function lum(c) { const [r, g, b] = hex2rgb(c); return (r * .299 + g * .587 + b * .114) / 255; }
const BLUR_OK = (() => { try { const c = document.createElement('canvas').getContext('2d'); c.filter = 'blur(2px)'; return c.filter === 'blur(2px)'; } catch (e) { return false; } })();
const SP_OK = (() => { try { return 'letterSpacing' in document.createElement('canvas').getContext('2d'); } catch (e) { return false; } })();

/* ---------- fonts ---------- */
const FONTS = { 'Inter': 'system-ui, sans-serif', 'Space Grotesk': 'system-ui, sans-serif', 'IBM Plex Mono': 'ui-monospace, monospace', 'Share Tech Mono': 'ui-monospace, monospace', 'Courier Prime': '"Courier New", monospace', 'Special Elite': '"Courier New", monospace', 'Cinzel': 'Georgia, serif', 'Cormorant Garamond': 'Georgia, serif', 'Playfair Display': 'Georgia, serif', 'Instrument Serif': 'Georgia, serif', 'Orbitron': 'system-ui, sans-serif', 'Rajdhani': 'system-ui, sans-serif', 'Bebas Neue': 'Impact, sans-serif', 'Oswald': 'Impact, sans-serif', 'Archivo Black': 'Impact, sans-serif', 'UnifrakturMaguntia': 'Georgia, serif', 'Homemade Apple': 'cursive', 'Caveat': 'cursive', 'Georgia': 'serif', 'Arial': 'sans-serif' };
const SYS_FONTS = new Set(['Georgia', 'Arial']);
const fontAsked = new Set();
function fstack(n) { return `"${n}", ${FONTS[n] || 'sans-serif'}`; }
function wantFont(n, w, it) {
  if (!document.fonts || SYS_FONTS.has(n)) return;
  const spec = `${it ? 'italic ' : ''}${w || 400} 40px "${n}"`;
  if (fontAsked.has(spec)) return; fontAsked.add(spec);
  try { if (document.fonts.check(spec)) return; } catch (e) { }
  document.fonts.load(spec).then(f => { if (f && f.length) invalidate(['front', 'back']); }).catch(() => { });
}
function setFont(c, n, w, px, it) { wantFont(n, w, it); c.font = `${it ? 'italic ' : ''}${w || 400} ${Math.max(.5, px)}px ${fstack(n)}`; }
function setSp(c, px) { if (SP_OK) c.letterSpacing = (px || 0) + 'px'; }

/* ---------- catalogues ---------- */
const FORMATS = {
  id1: { label: 'ID-1 card · 85.6 × 54', w: 85.6, h: 53.98, r: 3.18 },
  id1p: { label: 'ID-1 portrait badge', w: 53.98, h: 85.6, r: 3.18 },
  id2: { label: 'ID-2 · 105 × 74', w: 105, h: 74, r: 3.18 },
  id3: { label: 'ID-3 passport page · 125 × 88', w: 125, h: 88, r: 3.18 },
  slip: { label: 'Paper slip · 92 × 60', w: 92, h: 60, r: .8 },
  tall: { label: 'Event badge · 70 × 110', w: 70, h: 110, r: 4 },
  square: { label: 'Square · 64 × 64', w: 64, h: 64, r: 6 },
  em_round: { label: 'Emblem · round medallion 60', w: 60, h: 60, r: 0, shape: 'circle', thick: 3, logo: true },
  em_coin: { label: 'Emblem · challenge coin 40', w: 40, h: 40, r: 0, shape: 'circle', thick: 3.2, logo: true },
  em_heater: { label: 'Emblem · heater shield 56 × 66', w: 56, h: 66, r: 0, shape: 'heater', thick: 3, logo: true },
  em_french: { label: 'Emblem · round-bottom shield 56 × 66', w: 56, h: 66, r: 0, shape: 'french', thick: 3, logo: true },
  em_hex: { label: 'Emblem · hex badge 64', w: 64, h: 55.4, r: 0, shape: 'hex', thick: 3, logo: true },
  em_oct: { label: 'Emblem · octagon plate 60', w: 60, h: 60, r: 0, shape: 'octagon', thick: 3, logo: true },
  em_diamond: { label: 'Emblem · diamond 56 × 72', w: 56, h: 72, r: 0, shape: 'diamond', thick: 3, logo: true },
  em_banner: { label: 'Emblem · hanging banner 50 × 80', w: 50, h: 80, r: 0, shape: 'banner', thick: 1.2, logo: true },
  em_cog: { label: 'Emblem · cog plate 64', w: 64, h: 64, r: 0, shape: 'cog', thick: 3.5, logo: true },
  em_burst: { label: 'Emblem · star burst 64', w: 64, h: 64, r: 0, shape: 'burst', thick: 3, logo: true },
  em_square: { label: 'Emblem · square tile 60', w: 60, h: 60, r: 6, shape: 'rect', thick: 3, logo: true },
  em_patch: { label: 'Emblem · oval patch 76 × 56', w: 76, h: 56, r: 0, shape: 'circle', thick: 1.6, logo: true },
  em_flag: { label: 'Flag · 3:2 90 × 60', w: 90, h: 60, r: .4, shape: 'rect', thick: .5, logo: true },
  em_flag2: { label: 'Flag · 2:1 100 × 50', w: 100, h: 50, r: .4, shape: 'rect', thick: .5, logo: true },
  custom: { label: 'Custom size' }
};
const CARD_SHAPES = [['rect', 'Rounded rectangle'], ['circle', 'Circle / oval'], ['heater', 'Heater shield'], ['french', 'Round-bottom shield'], ['hex', 'Hexagon'], ['octagon', 'Octagon'], ['diamond', 'Diamond'], ['banner', 'Swallowtail banner'], ['cog', 'Cog'], ['burst', 'Star burst']];
function cardOutline(shape, w, h) {   // outline points in mm, canvas orientation (origin top-left, y down)
  const P = [], cx = w / 2, cy = h / 2, q = (a, b, c, n = 22) => { for (let i = 1; i <= n; i++) { const t = i / n, u = 1 - t; P.push([u * u * a[0] + 2 * u * t * b[0] + t * t * c[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c[1]]); } };
  const radial = (n, f) => { for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + i / n * Math.PI * 2, r = f(i); P.push([cx + Math.cos(a) * cx * r, cy + Math.sin(a) * cy * r]); } };
  switch (shape) {
    case 'circle': radial(128, () => 1); break;
    case 'heater': P.push([0, 0], [w, 0], [w, h * .4]); q([w, h * .4], [w, h * .8], [cx, h]); q([cx, h], [0, h * .8], [0, h * .4]); break;
    case 'french': P.push([0, 0], [w, 0], [w, h * .58]); for (let i = 1; i <= 40; i++) { const a = i / 40 * Math.PI; P.push([cx + Math.cos(a) * cx, h * .58 + Math.sin(a) * h * .42]); } break;
    case 'hex': P.push([w * .25, 0], [w * .75, 0], [w, cy], [w * .75, h], [w * .25, h], [0, cy]); break;
    case 'octagon': { const c = .2929; P.push([w * c, 0], [w * (1 - c), 0], [w, h * c], [w, h * (1 - c)], [w * (1 - c), h], [w * c, h], [0, h * (1 - c)], [0, h * c]); break; }
    case 'diamond': P.push([cx, 0], [w, cy], [cx, h], [0, cy]); break;
    case 'banner': P.push([0, 0], [w, 0], [w, h], [cx, h * .8], [0, h]); break;
    case 'cog': for (let t = 0; t < 12; t++) { const b = -Math.PI / 2 + t * Math.PI / 6, d = Math.PI / 180; for (const [a, r] of [[b - 11 * d, .84], [b - 6 * d, 1], [b + 6 * d, 1], [b + 11 * d, .84]]) P.push([cx + Math.cos(a) * cx * r, cy + Math.sin(a) * cy * r]); } break;
    case 'burst': radial(32, i => i % 2 ? .84 : 1); break;
    default: return null;
  }
  return P;
}
Forge.cardOutline = cardOutline;
const SUBS = {
  paper: { label: 'Plain paper (flexible)', color: '#f2ede1', rough: .93, metal: 0, clear: 0, thick: .18, tex: 'paper', flex: true, fluor: '#6d7dff', laser: '#4b2e19', edge: '#e8e1d0' },
  kraft: { label: 'Kraft card (flexible)', color: '#b48a5c', rough: .95, metal: 0, clear: 0, thick: .3, tex: 'paper', flex: true, fluor: null, laser: '#2c1a0e' },
  cardstock: { label: 'Heavy cardstock', color: '#f4f0e6', rough: .86, metal: 0, clear: 0, thick: .45, tex: 'paper', fluor: '#6d7dff', laser: '#4b2e19', edge: '#ece6d8' },
  laminated: { label: 'Laminated paper', color: '#f2eee4', rough: .85, metal: 0, clear: 0, thick: .6, tex: 'paper', cc: 1, ccr: .05, fluor: '#6d7dff', laser: '#3a2a1c', edge: '#d9e4e6', edgeClear: .85 },
  pvc: { label: 'White PVC', color: '#f6f6f3', rough: .38, metal: 0, clear: 0, thick: .76, cc: .5, ccr: .18, laser: '#2a2a2a', edge: '#efefec' },
  poly: { label: 'Polycarbonate', color: '#f3f3ef', rough: .25, metal: 0, clear: 0, thick: .76, cc: .9, ccr: .06, laser: '#1f2021', edge: '#e3ebe7', edgeClear: .55 },
  clearpvc: { label: 'Clear PVC', color: '#ffffff', rough: .04, metal: 0, clear: 1, ior: 1.54, thick: .76, atten: '#eef8ff', attenD: 60, laser: '#f2f4f5', disp: 'rgba(220,235,245,.22)', disper: .15 },
  smoked: { label: 'Smoked glass', color: '#ffffff', rough: .035, metal: 0, clear: 1, ior: 1.52, thick: 1.2, atten: '#5f646c', attenD: 1.6, laser: '#eef1f3', disp: 'rgba(28,30,34,.8)', disper: .3, tintable: true },
  frosted: { label: 'Frosted glass', color: '#ffffff', rough: .4, metal: 0, clear: 1, ior: 1.5, thick: 1.1, atten: '#e9f3f1', attenD: 8, laser: '#ffffff', disp: 'rgba(225,235,233,.6)', tex: 'frost', tintable: true },
  tinted: { label: 'Tinted glass', color: '#ffffff', rough: .03, metal: 0, clear: 1, ior: 1.52, thick: 1.1, atten: '#2f8c98', attenD: 2.2, laser: '#eef6f7', disp: 'rgba(40,130,145,.55)', disper: .25, tintable: true },
  aurora: { label: 'Dichroic glass', color: '#ffffff', rough: .05, metal: 0, clear: 1, ior: 1.5, thick: 1, atten: '#dfe6ff', attenD: 6, irid: 1, laser: '#ffffff', disp: 'rgba(170,190,255,.35)', disper: .4, tintable: true },
  steel: { label: 'Brushed steel', color: '#c8ccd1', rough: .34, metal: 1, clear: 0, thick: .8, tex: 'brushed', aniso: .75, laser: '#2a2c30' },
  blackmetal: { label: 'Black anodised metal', color: '#1c1d20', rough: .42, metal: 1, clear: 0, thick: .8, tex: 'brushed', aniso: .5, laser: '#b4b9c1' },
  gold: { label: 'Gold metal', color: '#e5c27a', rough: .24, metal: 1, clear: 0, thick: .8, tex: 'brushed', aniso: .4, laser: '#55400f' },
  carbon: { label: 'Carbon fibre', color: '#1e1f22', rough: .4, metal: 0, clear: 0, thick: .9, tex: 'carbon', cc: 1, ccr: .03, laser: '#c9cdd3' },
  wood: { label: 'Walnut veneer', color: '#6a4730', rough: .62, metal: 0, clear: 0, thick: .9, tex: 'wood', laser: '#24130a', edge: '#5a3b26' },
  pearl: { label: 'Pearlescent PVC', color: '#f5f1ec', rough: .3, metal: 0, clear: 0, thick: .76, cc: .8, ccr: .08, irid: .85, laser: '#2a2a2a', edge: '#efece8' },
  holopvc: { label: 'Holographic PVC', color: '#cfd5de', rough: .16, metal: .9, clear: 0, thick: .76, cc: .6, ccr: .04, irid: 1, holoBase: true, laser: '#1d1e22', edge: '#c9ced6' },
  frostpvc: { label: 'Frosted clear PVC', color: '#ffffff', rough: .45, metal: 0, clear: .85, ior: 1.5, thick: .76, atten: '#f4f8fa', attenD: 12, laser: '#ffffff', disp: 'rgba(230,236,240,.55)', tex: 'frost', tintable: true },
  vellum: { label: 'Vellum (translucent paper)', color: '#ffffff', rough: .72, metal: 0, clear: .55, ior: 1.45, thick: .22, atten: '#f1ebdc', attenD: 1.6, tex: 'paper', laser: '#4b2e19', disp: 'rgba(242,236,222,.72)', tintable: true },
  copper: { label: 'Copper metal', color: '#d58c5c', rough: .28, metal: 1, clear: 0, thick: .8, tex: 'brushed', laser: '#3a1d0d' },
  rosegold: { label: 'Rose-gold metal', color: '#eab7a3', rough: .22, metal: 1, clear: 0, thick: .8, tex: 'brushed', laser: '#5a2f22' },
  titanium: { label: 'Anodised titanium', color: '#7d8ea8', rough: .3, metal: 1, clear: 0, thick: .8, tex: 'brushed', irid: .6, laser: '#e6e9ee' },
  marble: { label: 'White marble', color: '#efedea', rough: .26, metal: 0, clear: 0, thick: 1, cc: .8, ccr: .05, tex: 'marble', laser: '#3b3a38' },
  brass: { label: 'Polished brass', color: '#d4b45a', rough: .2, metal: 1, clear: 0, thick: 3, tex: 'brushed', aniso: .3, laser: '#4a3a10' },
  bronze: { label: 'Antique bronze', color: '#9a6a3a', rough: .38, metal: 1, clear: 0, thick: 3, tex: 'brushed', aniso: .2, laser: '#2a1808' },
  iron: { label: 'Forged iron', color: '#55585e', rough: .58, metal: 1, clear: 0, thick: 3.5, tex: 'brushed', aniso: .15, laser: '#c9ccd1' },
  enamel: { label: 'Glossy enamel', color: '#1d3f6e', rough: .12, metal: 0, clear: 0, thick: 2.5, cc: 1, ccr: .02, laser: '#e9edf2' },
  leather: { label: 'Tooled leather', color: '#6b3f22', rough: .74, metal: 0, clear: 0, thick: 2.2, tex: 'paper', laser: '#2a160a', edge: '#4a2a14' },
  felt: { label: 'Embroidered twill (patch)', color: '#2a3a2a', rough: .95, metal: 0, clear: 0, thick: 1.6, tex: 'paper', laser: '#151d15', edge: '#1d281d' },
  stone: { label: 'Carved slate', color: '#4a4e54', rough: .8, metal: 0, clear: 0, thick: 5, tex: 'marble', laser: '#c9ccd1' },
  acr_green: { label: 'Fluorescent acrylic · green', color: '#ffffff', rough: .03, metal: 0, clear: 1, ior: 1.49, thick: 3, atten: '#39ff7a', attenD: 1.4, laser: '#d4ffe0', disp: 'rgba(40,220,100,.5)', glow: '#3dff74' },
  acr_orange: { label: 'Fluorescent acrylic · orange', color: '#ffffff', rough: .03, metal: 0, clear: 1, ior: 1.49, thick: 3, atten: '#ff8a2a', attenD: 1.4, laser: '#ffe6cf', disp: 'rgba(255,130,40,.5)', glow: '#ff8a1f' },
  acr_pink: { label: 'Fluorescent acrylic · pink', color: '#ffffff', rough: .03, metal: 0, clear: 1, ior: 1.49, thick: 3, atten: '#ff3aa0', attenD: 1.4, laser: '#ffd6ec', disp: 'rgba(255,60,160,.5)', glow: '#ff3d9e' },
  acr_blue: { label: 'Fluorescent acrylic · blue', color: '#ffffff', rough: .03, metal: 0, clear: 1, ior: 1.49, thick: 3, atten: '#3ad8ff', attenD: 1.4, laser: '#d6f6ff', disp: 'rgba(50,200,255,.5)', glow: '#38dcff' },
  acr_yellow: { label: 'Fluorescent acrylic · yellow', color: '#ffffff', rough: .03, metal: 0, clear: 1, ior: 1.49, thick: 3, atten: '#e8ff3a', attenD: 1.4, laser: '#f8ffd6', disp: 'rgba(225,255,50,.5)', glow: '#e9ff36' },
  ivory: { label: 'Ivory resin', color: '#efe6d1', rough: .42, metal: 0, clear: 0, thick: .8, cc: .35, ccr: .2, tex: 'frost', laser: '#4a3a28' }
};
const FINISHES = [['ink', 'Ink'], ['foil', 'Foil'], ['holo', 'Holo foil'], ['laser', 'Laser engrave'], ['uv', 'UV ink (invisible)'], ['gloss', 'Spot gloss'], ['blind', 'Blind emboss'], ['window', 'Clear window']];
const FIN_RELIEF = { ink: 0, foil: .15, holo: .06, laser: -.3, uv: 0, gloss: .08, blind: .85, window: 0 };
const HOLOPATS = [[0, 'Rainbow grating'], [1, 'Kinegram rings'], [2, 'Glitter'], [3, 'Pixel mosaic'], [4, 'Fine lines'], [5, 'Radial sweep'], [6, 'Starburst'], [7, 'Liquid']];
const FOILS = [['#d6b25e', 'Gold'], ['#dfe3e8', 'Silver'], ['#c97c4f', 'Copper'], ['#e3aaa0', 'Rose'], ['#6c7179', 'Gunmetal'], ['#5fae8f', 'Jade']];
const BLENDS = [['source-over', 'Normal'], ['multiply', 'Multiply'], ['screen', 'Screen'], ['overlay', 'Overlay'], ['darken', 'Darken'], ['lighten', 'Lighten'], ['color-burn', 'Colour burn']];
const CARD_DEF = { shape: 'rect', glowInt: 1, fmt: 'id1', w: 85.6, h: 53.98, r: 3.18, thick: .76, slot: 'none', sub: 'poly', tint: '#f3f3ef', tintOn: false, edge: '#d23c2a', edgeOn: false, ink: 'satin', lam: 'gloss', holoLam: 'none', holoLamInt: .35, holoLamBack: false, uvFibers: 0, fluor: 'auto', age: 0, creases: 0, foldV: 0, foldH: 0, stains: 0, wear: 0, fade: 0, curl: 0, crumple: 0, res: 2048, relief: 1.5, seed: 1, edgeFin: 'core' };
const SCENE_DEF = { env: 'softbox', backdrop: 'slate', pose: 'hover', azim: -38, elev: 50, keyInt: 1, envInt: 1, exposure: 1, tone: 'agx', refl: .55, bloom: .35, dof: 0, vignette: .35, grain: .2, ca: .25, dust: true, float: true, quality: 'high', lanyardColor: '#1f2a44', lanyardText: 'ID FORGE · FICTIONAL · ' };

/* ---------- project state ---------- */
let P = { card: { ...CARD_DEF }, scene: { ...SCENE_DEF }, front: [], back: [], assets: {} };
Object.defineProperty(Forge, 'P', { get: () => P });
const sub = () => SUBS[P.card.sub] || SUBS.pvc;
Forge.sub = sub; Forge.SUBS = SUBS;
function baseColor() { const C = P.card, S = sub(); return (C.tintOn && !S.clear) ? C.tint : S.color; }
function fluorOf() { const C = P.card, S = sub(); return C.fluor === 'on' ? '#6a78ff' : C.fluor === 'off' ? null : (S.fluor || null); }

/* ---------- images ---------- */
const imgs = new Map();
function getImg(id) {
  if (!id) return null; const src = P.assets[id]; if (!src) return null;
  let r = imgs.get(id);
  if (!r) { r = { img: new Image(), ok: false }; r.img.onload = () => { r.ok = true; invalidate(['front', 'back']); }; r.img.src = src; imgs.set(id, r); }
  return r.ok ? r.img : null;
}

/* ---------- noise tiles ---------- */
const tiles = {};
function tile(kind) {
  if (tiles[kind]) return tiles[kind];
  const N = 256, c = document.createElement('canvas'); c.width = c.height = N;
  const x = c.getContext('2d'), id = x.createImageData(N, N), d = id.data, R = rng(hashStr(kind));
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const u = i / N, v = j / N; let val;
    if (kind === 'grain') val = .35 + .4 * pfbm(u, v, 32, 2) + .25 * R();
    else if (kind === 'mottle') val = pfbm(u, v, 4, 5);
    else { const f = pfbm(u, v, 6, 4); val = clamp((f - .42) / .3, 0, 1); val = val * val; }
    const o = (j * N + i) * 4;
    if (kind === 'alpha') { d[o] = d[o + 1] = d[o + 2] = 0; d[o + 3] = val * 255; }
    else { d[o] = d[o + 1] = d[o + 2] = clamp(val, 0, 1) * 255; d[o + 3] = 255; }
  }
  x.putImageData(id, 0, 0); return tiles[kind] = c;
}
function pat(c, kind, sizePx) { const p = c.createPattern(tile(kind), 'repeat'); try { p.setTransform(new DOMMatrix().scale(sizePx / 256)); } catch (e) { } return p; }

/* ---------- path helpers ---------- */
function rr(c, x, y, w, h, r) {
  r = Math.max(0, Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2));
  c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.arcTo(x + w, y, x + w, y + r, r); c.lineTo(x + w, y + h - r);
  c.arcTo(x + w, y + h, x + w - r, y + h, r); c.lineTo(x + r, y + h); c.arcTo(x, y + h, x, y + h - r, r);
  c.lineTo(x, y + r); c.arcTo(x, y, x + r, y, r); c.closePath();
}
const SLOT = { slot: { w: 12.7, h: 3.2, cy: 4.6 }, hole: { r: 2.5, cy: 5 }, corner: { r: 1.6, dx: 5, cy: 5 } };
function cardPath(c, k) {
  const C = P.card, pts = C.shape && C.shape !== 'rect' ? cardOutline(C.shape, C.w, C.h) : null; c.beginPath();
  if (pts) { pts.forEach(([x, y], i) => i ? c.lineTo(x * k, y * k) : c.moveTo(x * k, y * k)); c.closePath(); } else rr(c, 0, 0, C.w * k, C.h * k, Math.min(C.r, C.w / 2, C.h / 2) * k);
  if (C.slot === 'slot2' || C.slot === 'corners') { const s = SLOT.corner; for (const x of [s.dx, C.w - s.dx]) { c.moveTo((x + s.r) * k, s.cy * k); c.arc(x * k, s.cy * k, s.r * k, 0, Math.PI * 2); } }
  if (C.slot === 'slot' || C.slot === 'slot2') { const s = SLOT.slot; rr(c, (C.w / 2 - s.w / 2) * k, (s.cy - s.h / 2) * k, s.w * k, s.h * k, s.h / 2 * k); }
  else if (C.slot === 'hole') { const s = SLOT.hole; c.moveTo((C.w / 2 + s.r) * k, s.cy * k); c.arc(C.w / 2 * k, s.cy * k, s.r * k, 0, Math.PI * 2); }
}
Forge.SLOT = SLOT;
function shapePath(c, shape, w, h) {
  c.beginPath(); const a = w / 2, b = h / 2;
  if (shape === 'rect') rr(c, -a, -b, w, h, Math.min(a, b) * .25);
  else if (shape === 'hex') { for (let i = 0; i < 6; i++) { const t = Math.PI / 3 * i + Math.PI / 6, x = Math.cos(t) * a, y = Math.sin(t) * b; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.closePath(); }
  else if (shape === 'star') { for (let i = 0; i < 10; i++) { const t = -Math.PI / 2 + Math.PI / 5 * i, r = i % 2 ? .45 : 1; const x = Math.cos(t) * a * r, y = Math.sin(t) * b * r; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.closePath(); }
  else if (shape === 'shield') { c.moveTo(-a, -b); c.lineTo(a, -b); c.lineTo(a, -b * .1); c.quadraticCurveTo(a * .95, b * .65, 0, b); c.quadraticCurveTo(-a * .95, b * .65, -a, -b * .1); c.closePath(); }
  else c.ellipse(0, 0, a, b, 0, 0, Math.PI * 2);
}
function starPoly(c, n, ro, ri, rot) { for (let i = 0; i < n * 2; i++) { const t = (rot || -Math.PI / 2) + Math.PI / n * i, r = i % 2 ? ri : ro; i ? c.lineTo(Math.cos(t) * r, Math.sin(t) * r) : c.moveTo(Math.cos(t) * r, Math.sin(t) * r); } c.closePath(); }
function emblem(c, kind, R) {
  c.beginPath();
  if (kind === 'ring') { for (let i = 1; i <= 5; i++) { c.moveTo(R * i / 5, 0); c.arc(0, 0, R * i / 5, 0, Math.PI * 2); } }
  else if (kind === 'orbit') { for (let i = 0; i < 3; i++) { const t = i * Math.PI / 3; c.moveTo(R * .9 * Math.cos(t), R * .9 * Math.sin(t)); c.ellipse(0, 0, R * .9, R * .32, t, 0, Math.PI * 2); } c.moveTo(R * .16, 0); c.arc(0, 0, R * .16, 0, Math.PI * 2); }
  else if (kind === 'wave') { for (let i = -3; i <= 3; i++) { const y0 = i * R * .25; c.moveTo(-R, y0); for (let x = -R; x <= R + .001; x += R / 16) c.lineTo(x, y0 + Math.sin(x / R * Math.PI * 2) * R * .09); } }
  else if (kind === 'sun') { c.moveTo(R * .3, 0); c.arc(0, 0, R * .3, 0, Math.PI * 2); for (let i = 0; i < 16; i++) { const t = i * Math.PI / 8; c.moveTo(Math.cos(t) * R * .42, Math.sin(t) * R * .42); c.lineTo(Math.cos(t) * R * (i % 2 ? .7 : .95), Math.sin(t) * R * (i % 2 ? .7 : .95)); } }
  else { starPoly(c, 5, R * .78, R * .32); c.moveTo(R * .95, 0); c.arc(0, 0, R * .95, 0, Math.PI * 2); }
  c.stroke();
}
function arcText(c, str, cx, cy, R, mid, sp, bottom) {
  const ch = [...str]; const ws = ch.map(t => c.measureText(t).width);
  const tot = ws.reduce((a, b) => a + b, 0) + sp * (ch.length - 1); const dir = bottom ? -1 : 1;
  let a = mid - dir * tot / R / 2; c.textAlign = 'center'; c.textBaseline = 'middle';
  for (let i = 0; i < ch.length; i++) {
    const half = ws[i] / 2; a += dir * half / R;
    c.save(); c.translate(cx + R * Math.cos(a), cy + R * Math.sin(a)); c.rotate(a + dir * Math.PI / 2); c.fillText(ch[i], 0, 0); c.restore();
    a += dir * (half + sp) / R;
  }
}
function ringText(c, str, R) { const ch = [...str], n = ch.length; c.textAlign = 'center'; c.textBaseline = 'middle'; for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / n; c.save(); c.translate(R * Math.cos(a), R * Math.sin(a)); c.rotate(a + Math.PI / 2); c.fillText(ch[i], 0, 0); c.restore(); } }
let _tmp = null;
function tmpCanvas(w, h) { if (!_tmp) _tmp = document.createElement('canvas'); if (_tmp.width !== w || _tmp.height !== h) { _tmp.width = w; _tmp.height = h; } return _tmp; }

/* ---------- Code 128 (B) ---------- */
const C128 = '212222 222122 222221 121223 121322 131222 122213 122312 132212 221213 221312 231212 112232 122132 122231 113222 123122 123221 223211 221132 221231 213212 223112 312131 311222 321122 321221 312212 322112 322211 212123 212321 232121 111323 131123 131321 112313 132113 132311 211313 231113 231311 112133 112331 132131 113123 113321 133121 313121 211331 231131 213113 213311 213131 311123 311321 331121 312113 312311 332111 314111 221411 431111 111224 111422 121124 121421 141122 141221 112214 112412 122114 122411 142112 142211 241211 221114 413111 241112 134111 111242 121142 121241 114212 124112 124211 411212 421112 421211 212141 214121 412121 111143 111341 131141 114113 114311 411113 411311 113141 114131 311141 411131 211412 211214 211232 2331112'.split(' ');
function code128(data) {
  const codes = [104]; for (const ch of String(data)) { let v = ch.charCodeAt(0) - 32; if (v < 0 || v > 94) v = 31; codes.push(v); }
  let sum = 104; for (let i = 1; i < codes.length; i++) sum += codes[i] * i; codes.push(sum % 103); codes.push(106);
  const out = []; for (const c of codes) for (const d of C128[c]) out.push(+d); return out;
}

/* ================= element types ================= */
const T = {};
const COMMON_DEF = { x: 42.8, y: 27, w: 30, h: 10, rot: 0, opacity: 1, blend: 'source-over', finish: 'ink', relief: 0, foil: '#d6b25e', holoPat: 0, holoInt: 1, uvColor: '#7cf7ff', visible: true, locked: false };
const fillOf = (ov, c) => ov && ov.color != null ? ov.color : c;
function def(type, label, d, props, draw, icon) { T[type] = { type, label, d, props, draw, icon }; }
const WEIGHTS = [[300, 'Light'], [400, 'Regular'], [500, 'Medium'], [600, 'Semibold'], [700, 'Bold'], [800, 'Heavy'], [900, 'Black']];
const ALIGNS = [['left', 'Left'], ['center', 'Centre'], ['right', 'Right']];

/* text */
def('text', 'Text', { w: 40, h: 6, text: 'Text', font: 'Inter', weight: 600, size: 3, color: '#1a1a1a', align: 'left', valign: 'middle', spacing: 0, lineH: 1.2, upper: false, italic: false, fit: true, stroke: '#ffffff', strokeW: 0, arc: 0, grad: false, color2: '#b8892b', gangle: 0 },
  [['text', 'Text', 'area'], ['font', 'Font', 'font'], ['weight', 'Weight', 'select', WEIGHTS], ['size', 'Size (mm)', 'range', { min: .3, max: 20, step: .05 }], ['color', 'Colour', 'color'], ['align', 'Align', 'select', ALIGNS], ['valign', 'Vertical', 'select', [['top', 'Top'], ['middle', 'Middle'], ['bottom', 'Bottom']]], ['spacing', 'Tracking (em)', 'range', { min: -.2, max: 1.5, step: .01 }], ['lineH', 'Line height', 'range', { min: .7, max: 2.5, step: .01 }], ['upper', 'Uppercase', 'check'], ['italic', 'Italic', 'check'], ['fit', 'Condense to fit', 'check'], ['arc', 'Arc (°)', 'range', { min: -300, max: 300, step: 1 }], ['strokeW', 'Outline (mm)', 'range', { min: 0, max: 1, step: .01 }], ['stroke', 'Outline colour', 'color', null, e => e.strokeW > 0], ['grad', 'Gradient fill', 'check'], ['color2', 'Gradient to', 'color', null, e => e.grad], ['gangle', 'Gradient angle', 'range', { min: 0, max: 360, step: 1 }, e => e.grad]],
  function (c, el, ov, k) {
    let fill = fillOf(ov, el.color); if (ov.color == null && el.grad) { const a = (el.gangle || 0) * Math.PI / 180, dx = Math.cos(a) * el.w * k / 2, dy = Math.sin(a) * el.h * k / 2, g = c.createLinearGradient(-dx, -dy, dx, dy); g.addColorStop(0, el.color); g.addColorStop(1, el.color2 || el.color); fill = g; }
    const raw = el.upper ? String(el.text).toUpperCase() : String(el.text);
    const lines = raw.split('\n'), px = el.size * k, W = el.w * k, Hh = el.h * k, sp = (el.spacing || 0) * px;
    c.save(); c.scale(1 / k, 1 / k); setFont(c, el.font, el.weight, px, el.italic); c.textBaseline = 'middle';
    if (el.arc) {
      setSp(c, 0); c.fillStyle = fill; const R = Math.abs(W / (el.arc * Math.PI / 180)), up = el.arc > 0;
      arcText(c, lines[0], 0, up ? R : -R, R, up ? -Math.PI / 2 : Math.PI / 2, sp, !up); c.restore(); return;
    }
    setSp(c, sp);
    const lh = px * (el.lineH || 1.2), total = lh * lines.length;
    const y0 = el.valign === 'top' ? -Hh / 2 + lh / 2 : el.valign === 'bottom' ? Hh / 2 - total + lh / 2 : -total / 2 + lh / 2;
    const al = el.align || 'left'; let x0 = al === 'left' ? -W / 2 : al === 'right' ? W / 2 : 0; if (SP_OK) x0 += al === 'center' ? sp / 2 : al === 'right' ? sp : 0;
    lines.forEach((ln, i) => {
      let sx = 1; if (el.fit) { const tw = c.measureText(ln).width; if (tw > W && tw > 0) sx = W / tw; }
      c.save(); c.translate(al === 'left' ? -W / 2 : al === 'right' ? W / 2 : 0, y0 + i * lh); c.scale(sx, 1); c.translate(x0 - (al === 'left' ? -W / 2 : al === 'right' ? W / 2 : 0), 0); c.textAlign = al;
      if (el.strokeW > 0) { c.lineWidth = el.strokeW * k * 2; c.lineJoin = 'round'; c.strokeStyle = fillOf(ov, el.stroke); c.strokeText(ln, 0, 0); }
      c.fillStyle = fill; c.fillText(ln, 0, 0); c.restore();
    });
    c.restore();
  }, 'M4 5h16M12 5v14');

/* field */
def('field', 'Field', { w: 34, h: 6.4, label: 'Label', value: 'VALUE', lfont: 'Inter', lweight: 500, lsize: 1.3, lcolor: '#5d6b68', lspacing: .06, lupper: false, font: 'Inter', weight: 600, vsize: 2.4, color: '#141414', spacing: .02, upper: true, italic: false, align: 'left', fit: true },
  [['label', 'Label', 'text'], ['value', 'Value', 'text'], ['align', 'Align', 'select', ALIGNS], ['§', 'Label style'], ['lfont', 'Font', 'font'], ['lweight', 'Weight', 'select', WEIGHTS], ['lsize', 'Size (mm)', 'range', { min: .3, max: 6, step: .05 }], ['lcolor', 'Colour', 'color'], ['lspacing', 'Tracking', 'range', { min: -.1, max: 1, step: .01 }], ['lupper', 'Uppercase', 'check'], ['§', 'Value style'], ['font', 'Font', 'font'], ['weight', 'Weight', 'select', WEIGHTS], ['vsize', 'Size (mm)', 'range', { min: .3, max: 10, step: .05 }], ['color', 'Colour', 'color'], ['spacing', 'Tracking', 'range', { min: -.1, max: 1, step: .01 }], ['upper', 'Uppercase', 'check'], ['italic', 'Italic', 'check'], ['fit', 'Condense to fit', 'check']],
  function (c, el, ov, k) {
    const W = el.w * k, Hh = el.h * k, lpx = el.lsize * k, vpx = el.vsize * k, al = el.align || 'left';
    const x = al === 'left' ? -W / 2 : al === 'right' ? W / 2 : 0, top = -Hh / 2;
    c.save(); c.scale(1 / k, 1 / k); c.textBaseline = 'alphabetic'; c.textAlign = al;
    setFont(c, el.lfont, el.lweight, lpx, false); setSp(c, (el.lspacing || 0) * lpx); c.fillStyle = fillOf(ov, el.lcolor);
    c.fillText(el.lupper ? String(el.label).toUpperCase() : String(el.label), x, top + lpx * .86);
    setFont(c, el.font, el.weight, vpx, el.italic); setSp(c, (el.spacing || 0) * vpx); c.fillStyle = fillOf(ov, el.color);
    const v = el.upper ? String(el.value).toUpperCase() : String(el.value); const tw = c.measureText(v).width; const sx = (el.fit && tw > W && tw > 0) ? W / tw : 1;
    c.translate(x, top + lpx * 1.2 + vpx * .8); c.scale(sx, 1); c.fillText(v, 0, 0); c.restore();
  }, 'M4 8h7M4 15h16');

/* photo / image */
def('photo', 'Photo', { w: 22, h: 28, asset: null, fit: 'cover', zoom: 1, offX: 0, offY: 0, radius: 1, look: 'color', saturate: 1, grayscale: false, sepia: 0, contrast: 1, brightness: 1, halftone: 0, lines: 0, duo: false, tint: '#2b4a7a', colorLaser: false, border: 0, borderColor: '#ffffff', ph: 'portrait', phSeed: 7, bg: '#cfd8d6', fg: '#87938f' },
  [['asset', 'Image', 'image'], ['ph', 'Placeholder', 'select', [['portrait', 'Illustrated colour portrait'], ['silhouette', 'Grey silhouette']], e => !e.asset], ['phSeed', 'Placeholder face', 'range', { min: 0, max: 99, step: 1 }, e => !e.asset && e.ph !== 'silhouette'], ['§', 'Colour'], ['look', 'Colour mode', 'select', [['color', 'Full colour'], ['bw', 'Black & white'], ['sepia', 'Sepia'], ['duo', 'Duotone']]], ['tint', 'Duotone ink', 'color', null, e => e.look === 'duo'], ['saturate', 'Saturation', 'range', { min: 0, max: 2.5, step: .01 }, e => e.look === 'color'], ['contrast', 'Contrast', 'range', { min: .3, max: 2.5, step: .01 }], ['brightness', 'Brightness', 'range', { min: .3, max: 2, step: .01 }], ['colorLaser', 'Colour laser (keep colours)', 'check', null, e => e.finish === 'laser'], ['§', 'Framing'], ['fit', 'Fit', 'select', [['cover', 'Fill box'], ['contain', 'Fit inside']]], ['zoom', 'Zoom', 'range', { min: .5, max: 4, step: .01 }], ['offX', 'Pan X', 'range', { min: -1, max: 1, step: .01 }], ['offY', 'Pan Y', 'range', { min: -1, max: 1, step: .01 }], ['radius', 'Corner (mm)', 'range', { min: 0, max: 30, step: .1 }], ['border', 'Border (mm)', 'range', { min: 0, max: 3, step: .05 }], ['borderColor', 'Border colour', 'color', null, e => e.border > 0], ['§', 'Screens'], ['halftone', 'Halftone dots', 'range', { min: 0, max: 1, step: .01 }], ['lines', 'Engraved line screen', 'range', { min: 0, max: 1, step: .01 }], ['§', 'Silhouette placeholder', null, null, e => !e.asset && e.ph === 'silhouette'], ['bg', 'Backdrop', 'color', null, e => !e.asset && e.ph === 'silhouette'], ['fg', 'Silhouette', 'color', null, e => !e.asset && e.ph === 'silhouette']],
  function (c, el, ov, k) {
    const w = el.w, h = el.h; c.save(); c.beginPath(); rr(c, -w / 2, -h / 2, w, h, el.radius || 0);
    const img = getImg(el.asset);
    const special = ov.ch === 'A' && (ov.color == null || ov.laser) || (ov.ch === 'H' && img) || (ov.ch === 'X' && ov.uv);
    if (!special) { c.fillStyle = ov.color; c.fill(); c.restore(); if (el.border > 0) border(); return; }
    c.clip();
    if (ov.ch === 'H') { c.globalCompositeOperation = ov.rel < 0 ? 'multiply' : 'screen'; if (BLUR_OK) c.filter = 'grayscale(1) contrast(1.2)'; drawFit(c, img, el); c.filter = 'none'; c.restore(); return; }
    const look = el.look || (el.duo ? 'duo' : el.grayscale ? 'bw' : 'color'), mono = (ov.laser && !el.colorLaser) || ov.uv;
    let f = '';
    if (look === 'bw' || look === 'duo' || mono) f += 'grayscale(1) ';
    if (look === 'sepia' && !mono) f += 'sepia(.88) '; else if (el.sepia > 0 && !mono) f += `sepia(${el.sepia}) `;
    if (look === 'color' && !mono && el.saturate !== 1) f += `saturate(${el.saturate ?? 1}) `;
    if (el.contrast !== 1 || ov.laser) f += `contrast(${(el.contrast || 1) * (ov.laser ? 1.12 : 1)}) `; if (el.brightness !== 1) f += `brightness(${el.brightness}) `;
    if (mono && ov.laser && lum(ov.color) > .5) f += 'invert(1) ';
    if (img) {
      if (el.lines > 0 && !ov.uv) lineScreen(c, img, el, mono ? ov.color : (look === 'duo' ? el.tint : '#141414'));
      else if (el.halftone > 0 && !ov.uv) halftone(c, img, el, mono ? ov.color : (look === 'duo' ? el.tint : '#141414'), look === 'color' && !mono);
      else { if (BLUR_OK && f) c.filter = f; drawFit(c, img, el); c.filter = 'none'; }
    } else { if (BLUR_OK && f) c.filter = f; if (el.ph === 'silhouette') placeholder(c, el, mono); else portrait(c, el); c.filter = 'none'; }
    if (look === 'duo' && !mono) { c.globalCompositeOperation = 'screen'; c.fillStyle = hexA(el.tint, .55); c.fillRect(-w / 2, -h / 2, w, h); c.globalCompositeOperation = 'multiply'; c.fillStyle = el.tint; c.fillRect(-w / 2, -h / 2, w, h); }
    if (ov.uv) { c.globalCompositeOperation = 'multiply'; c.fillStyle = ov.color; c.fillRect(-w / 2, -h / 2, w, h); }
    if (ov.laser && mono && !img) { c.globalCompositeOperation = lum(ov.color) > .5 ? 'screen' : 'multiply'; c.fillStyle = ov.color; c.globalAlpha = .45; c.fillRect(-w / 2, -h / 2, w, h); }
    c.restore(); if (el.border > 0 && ov.ch === 'A') border();
    function border() { c.save(); c.beginPath(); rr(c, -w / 2, -h / 2, w, h, el.radius || 0); c.lineWidth = el.border * 2; c.strokeStyle = fillOf(ov, el.borderColor); c.clip(); c.stroke(); c.restore(); }
  }, 'M4 5h16v14H4zM8 15l3-3 3 3 2-2 3 3');
function portrait(c, el) {
  const R = rng(hashStr('face' + (el.phSeed ?? 0))), pick = (a) => a[R() * a.length | 0], w = el.w, h = el.h, TAU = Math.PI * 2;
  const skin = pick(['#f3d1b5', '#e8b896', '#d6a079', '#bd8158', '#9a6344', '#734932', '#4f3122']), hair = pick(['#16110e', '#2e1d14', '#523420', '#7a4e2b', '#a87443', '#d6b06a', '#e6d7b4', '#8e8e8e', '#9c3a1e', '#3b2a4f']);
  const shirt = pick(['#2d4a7a', '#7a2d3b', '#2d6a55', '#353a42', '#c9a227', '#5a3d7a', '#d9d4c7', '#2a6f8f', '#8f5a2a', '#1f1f24', '#b8483a', '#3f7d3a']);
  const bg = pick([['#cfe0ea', '#94b0c4'], ['#ece4d4', '#c4b79c'], ['#d8e7dc', '#9fbfac'], ['#e8d8e5', '#bea2b8'], ['#dfe3ea', '#aeb8c9'], ['#f2dcc8', '#cfae92'], ['#d4dbe0', '#8d99a3']]);
  const style = R() * 6 | 0, glasses = R() < .25, beard = R() < .22, smile = .2 + R() * .5, iris = pick(['#3a2a1e', '#2a4a6a', '#3d5a2a', '#55402a', '#1e1e1e']);
  const s = Math.min(w, h * .82), hx = 0, hy = -h * .06, hw = s * .2, hh = s * .255;
  let g = c.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, bg[0]); g.addColorStop(1, bg[1]); c.fillStyle = g; c.fillRect(-w / 2, -h / 2, w, h);
  g = c.createRadialGradient(hx, hy, hw * .5, hx, hy, Math.max(w, h) * .7); g.addColorStop(0, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(-w / 2, -h / 2, w, h);
  if (style === 1 || style === 4) { c.fillStyle = shade(hair, -.08); c.beginPath(); c.ellipse(hx, hy + hh * .45, hw * 1.32, hh * 1.25, 0, 0, TAU); c.fill(); }
  c.fillStyle = shade(skin, -.14); c.fillRect(-s * .072, hy + hh * .6, s * .144, h * .2);
  c.fillStyle = shirt; c.beginPath(); c.moveTo(-w * .62, h / 2 + 1); c.bezierCurveTo(-w * .56, h * .2, -s * .34, h * .16, -s * .11, h * .14); c.lineTo(s * .11, h * .14); c.bezierCurveTo(s * .34, h * .16, w * .56, h * .2, w * .62, h / 2 + 1); c.closePath(); c.fill();
  g = c.createLinearGradient(-w / 2, 0, w / 2, 0); g.addColorStop(0, 'rgba(0,0,0,.18)'); g.addColorStop(.5, 'rgba(255,255,255,.06)'); g.addColorStop(1, 'rgba(0,0,0,.22)'); c.fillStyle = g; c.fill();
  c.fillStyle = shade(skin, -.08); c.beginPath(); c.moveTo(-s * .11, h * .14); c.lineTo(0, h * .245); c.lineTo(s * .11, h * .14); c.closePath(); c.fill();
  c.strokeStyle = shade(shirt, -.3); c.lineWidth = s * .012; c.beginPath(); c.moveTo(-s * .13, h * .135); c.lineTo(0, h * .27); c.lineTo(s * .13, h * .135); c.stroke();
  c.fillStyle = shade(skin, -.06); for (const sx of [-1, 1]) { c.beginPath(); c.ellipse(sx * hw * .98, hy + hh * .06, hw * .15, hh * .19, 0, 0, TAU); c.fill(); }
  g = c.createRadialGradient(hx - hw * .35, hy - hh * .35, hw * .1, hx, hy, hh * 1.15); g.addColorStop(0, shade(skin, .14)); g.addColorStop(1, shade(skin, -.14)); c.fillStyle = g; c.beginPath(); c.ellipse(hx, hy, hw, hh, 0, 0, TAU); c.fill();
  c.fillStyle = 'rgba(220,90,90,.12)'; for (const sx of [-1, 1]) { c.beginPath(); c.ellipse(sx * hw * .5, hy + hh * .3, hw * .2, hh * .12, 0, 0, TAU); c.fill(); }
  if (beard) { c.fillStyle = hexA(hair, .9); c.beginPath(); c.moveTo(-hw * .95, hy + hh * .1); c.quadraticCurveTo(-hw * .9, hy + hh * 1.12, 0, hy + hh * 1.12); c.quadraticCurveTo(hw * .9, hy + hh * 1.12, hw * .95, hy + hh * .1); c.quadraticCurveTo(hw * .5, hy + hh * .7, 0, hy + hh * .62); c.quadraticCurveTo(-hw * .5, hy + hh * .7, -hw * .95, hy + hh * .1); c.fill(); }
  const cap = (fore) => { c.beginPath(); c.moveTo(-hw * 1.03, hy - hh * .02); c.bezierCurveTo(-hw * 1.12, hy - hh * 1.28, hw * 1.12, hy - hh * 1.28, hw * 1.03, hy - hh * .02); c.quadraticCurveTo(hw * .55, hy - hh * fore, 0, hy - hh * (fore - .04)); c.quadraticCurveTo(-hw * .55, hy - hh * fore, -hw * 1.03, hy - hh * .02); c.fill(); };
  c.fillStyle = hair;
  if (style === 0) cap(.62);
  else if (style === 1) { c.beginPath(); c.moveTo(-hw * 1.05, hy + hh * .55); c.bezierCurveTo(-hw * 1.25, hy - hh * 1.32, hw * 1.25, hy - hh * 1.32, hw * 1.05, hy + hh * .55); c.lineTo(hw * .86, hy + hh * .1); c.quadraticCurveTo(hw * .25, hy - hh * .78, -hw * .62, hy - hh * .42); c.quadraticCurveTo(-hw * .86, hy - hh * .1, -hw * .86, hy + hh * .55); c.closePath(); c.fill(); }
  else if (style === 2) { for (let i = 0; i <= 10; i++) { const a = Math.PI * (1.02 + i * .096), r = hw * (.3 + R() * .06); c.beginPath(); c.arc(Math.cos(a) * hw * .92, hy - hh * .1 + Math.sin(a) * hh * .9, r, 0, TAU); c.fill(); } }
  else if (style === 3) { c.fillStyle = hexA(hair, .4); cap(.7); }
  else if (style === 4) cap(.34);
  else { cap(.6); c.beginPath(); c.arc(0, hy - hh * 1.08, hw * .38, 0, TAU); c.fill(); }
  const ey = hy + hh * .06;
  for (const sx of [-1, 1]) { c.fillStyle = '#fbf8f4'; c.beginPath(); c.ellipse(sx * hw * .38, ey, hw * .14, hh * .07, 0, 0, TAU); c.fill(); c.fillStyle = iris; c.beginPath(); c.arc(sx * hw * .38, ey, hh * .06, 0, TAU); c.fill(); c.fillStyle = '#111'; c.beginPath(); c.arc(sx * hw * .38, ey, hh * .03, 0, TAU); c.fill(); c.fillStyle = 'rgba(255,255,255,.8)'; c.beginPath(); c.arc(sx * hw * .38 - hh * .02, ey - hh * .02, hh * .012, 0, TAU); c.fill(); }
  c.strokeStyle = shade(hair, -.1); c.lineWidth = s * .02; c.lineCap = 'round'; for (const sx of [-1, 1]) { c.beginPath(); c.moveTo(sx * hw * .22, ey - hh * .2); c.quadraticCurveTo(sx * hw * .4, ey - hh * .27, sx * hw * .58, ey - hh * .19); c.stroke(); }
  c.strokeStyle = shade(skin, -.3); c.lineWidth = s * .012; c.beginPath(); c.moveTo(hw * .02, ey + hh * .08); c.quadraticCurveTo(-hw * .12, ey + hh * .32, hw * .07, ey + hh * .36); c.stroke();
  c.strokeStyle = '#8a3f36'; c.lineWidth = s * .017; c.beginPath(); c.arc(0, ey + hh * .3, hw * .3, Math.PI * (.5 - smile * .5), Math.PI * (.5 + smile * .5)); c.stroke();
  if (glasses) { c.strokeStyle = '#1e1e22'; c.lineWidth = s * .014; for (const sx of [-1, 1]) { c.beginPath(); c.ellipse(sx * hw * .38, ey, hw * .25, hh * .15, 0, 0, TAU); c.stroke(); } c.beginPath(); c.moveTo(-hw * .13, ey); c.quadraticCurveTo(0, ey - hh * .05, hw * .13, ey); c.stroke(); }
}
function drawFit(c, img, el) {
  if (!img) return; const w = el.w, h = el.h, ir = img.width / img.height, br = w / h; let dw, dh;
  if ((el.fit !== 'contain') === (ir > br)) { dh = h; dw = h * ir; } else { dw = w; dh = w / ir; }
  dw *= el.zoom || 1; dh *= el.zoom || 1; c.drawImage(img, -dw / 2 + (el.offX || 0) * w / 2, -dh / 2 + (el.offY || 0) * h / 2, dw, dh);
}
function halftone(c, img, el, col, colorful) {
  const cell = .32 + (1 - el.halftone) * .5, nx = Math.max(2, Math.round(el.w / cell)), ny = Math.max(2, Math.round(el.h / cell));
  const t = document.createElement('canvas'); t.width = nx; t.height = ny; const x = t.getContext('2d');
  x.save(); x.scale(nx / el.w, ny / el.h); x.translate(el.w / 2, el.h / 2); if (BLUR_OK) x.filter = `${colorful ? `saturate(${(el.saturate ?? 1) * 1.3})` : 'grayscale(1)'} contrast(${el.contrast || 1}) brightness(${el.brightness || 1})`; drawFit(x, img, el); x.restore();
  const d = x.getImageData(0, 0, nx, ny).data; c.fillStyle = col; if (!colorful) c.beginPath();
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const o = (j * nx + i) * 4, dark = 1 - (d[o] * .3 + d[o + 1] * .59 + d[o + 2] * .11) / 255 * (d[o + 3] / 255); const r = Math.sqrt(colorful ? Math.max(.25, dark) : dark) * cell * .62;
    if (r > .01) { const px = -el.w / 2 + (i + .5) * el.w / nx + (j % 2 ? cell * .25 : 0), py = -el.h / 2 + (j + .5) * el.h / ny; if (colorful) { c.fillStyle = `rgb(${d[o]},${d[o + 1]},${d[o + 2]})`; c.beginPath(); c.arc(px, py, r * 1.12, 0, Math.PI * 2); c.fill(); } else { c.moveTo(px + r, py); c.arc(px, py, r, 0, Math.PI * 2); } }
  }
  if (!colorful) c.fill();
}
function lineScreen(c, img, el, col) {
  const sp = .22 + (1 - el.lines) * .45, rows = Math.max(4, Math.round(el.h / sp)), cols = Math.max(8, Math.round(el.w / .12));
  const t = document.createElement('canvas'); t.width = cols; t.height = rows; const x = t.getContext('2d');
  x.save(); x.scale(cols / el.w, rows / el.h); x.translate(el.w / 2, el.h / 2); if (BLUR_OK) x.filter = `grayscale(1) contrast(${(el.contrast || 1) * 1.1}) brightness(${el.brightness || 1})`; drawFit(x, img, el); x.restore();
  const d = x.getImageData(0, 0, cols, rows).data; c.fillStyle = col; c.beginPath();
  for (let j = 0; j < rows; j++) {
    const y0 = -el.h / 2 + (j + .5) * el.h / rows, top = [], bot = [];
    for (let i = 0; i < cols; i++) { const o = (j * cols + i) * 4, dark = 1 - (d[o] * .3 + d[o + 1] * .59 + d[o + 2] * .11) / 255 * (d[o + 3] / 255), th = Math.max(.012, dark * sp * .92), px = -el.w / 2 + (i + .5) * el.w / cols, wv = Math.sin(px * 1.6 + j * .35) * sp * .18; top.push([px, y0 + wv - th / 2]); bot.push([px, y0 + wv + th / 2]); }
    c.moveTo(top[0][0], top[0][1]); for (const p of top) c.lineTo(p[0], p[1]); for (let i = bot.length - 1; i >= 0; i--) c.lineTo(bot[i][0], bot[i][1]); c.closePath();
  }
  c.fill();
}
function placeholder(c, el, mono) {
  const w = el.w, h = el.h, bg = mono ? '#d8d8d8' : el.bg, fg = mono ? '#6a6a6a' : el.fg;
  const g = c.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, shade(bg, .12)); g.addColorStop(1, shade(bg, -.12)); c.fillStyle = g; c.fillRect(-w / 2, -h / 2, w, h);
  const s = Math.min(w, h * .82); const hy = -h * .06;
  const g2 = c.createRadialGradient(-s * .08, hy - s * .1, s * .02, 0, hy, s * .32); g2.addColorStop(0, shade(fg, .18)); g2.addColorStop(1, shade(fg, -.1));
  c.fillStyle = g2; c.beginPath(); c.moveTo(-w * .55, h / 2); c.bezierCurveTo(-w * .5, h * .22, -s * .3, h * .2, -s * .12, h * .15); c.lineTo(-s * .1, hy + s * .2); c.lineTo(s * .1, hy + s * .2); c.lineTo(s * .12, h * .15); c.bezierCurveTo(s * .3, h * .2, w * .5, h * .22, w * .55, h / 2); c.closePath(); c.fill();
  c.beginPath(); c.ellipse(0, hy, s * .2, s * .255, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = shade(fg, -.25); c.beginPath(); c.ellipse(0, hy - s * .1, s * .215, s * .17, 0, Math.PI, Math.PI * 2); c.fill();
}

/* shapes */
const SHAPE_P = [['fillOn', 'Fill', 'check'], ['fill', 'Fill colour', 'color', null, e => e.fillOn], ['grad', 'Gradient', 'check', null, e => e.fillOn], ['fill2', 'Gradient to', 'color', null, e => e.fillOn && e.grad], ['angle', 'Gradient angle', 'range', { min: 0, max: 360, step: 1 }, e => e.fillOn && e.grad], ['strokeW', 'Stroke (mm)', 'range', { min: 0, max: 3, step: .01 }], ['stroke', 'Stroke colour', 'color', null, e => e.strokeW > 0], ['dash', 'Dash (mm)', 'range', { min: 0, max: 4, step: .05 }, e => e.strokeW > 0]];
function shapeFill(c, el, ov) {
  if (el.fillOn) {
    if (ov.color != null) c.fillStyle = ov.color;
    else if (el.grad) { const a = (el.angle || 0) * Math.PI / 180, dx = Math.cos(a) * el.w / 2, dy = Math.sin(a) * el.h / 2; const g = c.createLinearGradient(-dx, -dy, dx, dy); g.addColorStop(0, el.fill); g.addColorStop(1, el.fill2); c.fillStyle = g; }
    else c.fillStyle = el.fill; c.fill();
  }
  if (el.strokeW > 0) { c.lineWidth = el.strokeW; c.strokeStyle = fillOf(ov, el.stroke); if (el.dash > 0) c.setLineDash([el.dash, el.dash * .7]); c.stroke(); c.setLineDash([]); }
}
def('rect', 'Rectangle', { w: 30, h: 10, fillOn: true, fill: '#1d4f4a', fill2: '#3a8f84', grad: false, angle: 0, radius: 0, stroke: '#000000', strokeW: 0, dash: 0 },
  [['radius', 'Corner (mm)', 'range', { min: 0, max: 40, step: .1 }], ...SHAPE_P],
  function (c, el, ov) { c.beginPath(); rr(c, -el.w / 2, -el.h / 2, el.w, el.h, el.radius || 0); shapeFill(c, el, ov); }, 'M4 6h16v12H4z');
def('ellipse', 'Ellipse', { w: 14, h: 14, fillOn: true, fill: '#1d4f4a', fill2: '#3a8f84', grad: false, angle: 0, stroke: '#000000', strokeW: 0, dash: 0 }, SHAPE_P,
  function (c, el, ov) { c.beginPath(); c.ellipse(0, 0, el.w / 2, el.h / 2, 0, 0, Math.PI * 2); shapeFill(c, el, ov); }, 'M12 4a8 8 0 1 0 .01 0z');
def('line', 'Line', { w: 40, h: 1, color: '#222222', lw: .25, dash: 0 },
  [['color', 'Colour', 'color'], ['lw', 'Weight (mm)', 'range', { min: .02, max: 3, step: .01 }], ['dash', 'Dash (mm)', 'range', { min: 0, max: 4, step: .05 }]],
  function (c, el, ov) { c.beginPath(); c.moveTo(-el.w / 2, 0); c.lineTo(el.w / 2, 0); c.lineWidth = el.lw; c.lineCap = 'butt'; c.strokeStyle = fillOf(ov, el.color); if (el.dash > 0) c.setLineDash([el.dash, el.dash * .8]); c.stroke(); c.setLineDash([]); }, 'M4 12h16');

/* guilloche */
def('guilloche', 'Guilloche', { w: 40, h: 40, mode: 'rosette', lines: 40, f1: 12, f2: 5, amp: .5, inner: .35, lw: .06, c1: '#2a7a70', c2: '#9b5fa0', c3: '#d39a3c', iris: false },
  [['mode', 'Figure', 'select', [['rosette', 'Rosette'], ['ring', 'Wreath ring'], ['band', 'Rope band'], ['field', 'Wave field'], ['spiro', 'Spirograph']]], ['lines', 'Lines', 'range', { min: 1, max: 160, step: 1 }], ['f1', 'Petals / waves', 'range', { min: 1, max: 48, step: 1 }], ['f2', 'Modulation', 'range', { min: 0, max: 24, step: 1 }], ['amp', 'Amplitude', 'range', { min: 0, max: 1.5, step: .01 }], ['inner', 'Inner radius', 'range', { min: 0, max: .95, step: .01 }, e => e.mode === 'rosette' || e.mode === 'ring'], ['lw', 'Line (mm)', 'range', { min: .01, max: .5, step: .005 }], ['c1', 'Colour A', 'color'], ['c2', 'Colour B', 'color'], ['c3', 'Colour C', 'color', null, e => e.iris], ['iris', 'Rainbow (iris) print', 'check']],
  function (c, el, ov) {
    const w = el.w, h = el.h, n = Math.max(1, el.lines | 0), R0 = Math.min(w, h) / 2, TAU = Math.PI * 2;
    c.lineWidth = el.lw; c.lineJoin = 'round'; c.lineCap = 'round';
    let grad = null; if (ov.color == null && el.iris) { grad = c.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); grad.addColorStop(0, el.c1); grad.addColorStop(.5, el.c2); grad.addColorStop(1, el.c3); }
    for (let i = 0; i < n; i++) {
      const t = n > 1 ? i / (n - 1) : 0; c.strokeStyle = ov.color != null ? ov.color : (grad || mix(el.c1, el.c2, t)); c.beginPath();
      if (el.mode === 'rosette' || el.mode === 'ring') {
        const steps = Math.round(300 + el.f1 * 40), Rin = R0 * el.inner;
        for (let j = 0; j <= steps; j++) {
          const th = j / steps * TAU; let rho;
          if (el.mode === 'rosette') rho = Rin + (R0 - Rin) * (.5 + .5 * Math.sin(el.f1 * (th + i * TAU / (n * el.f1)))) * (1 - el.amp * .3 * (1 + Math.cos(el.f2 * th)));
          else { const mid = (R0 + Rin) / 2, half = (R0 - Rin) / 2; rho = mid + half * Math.sin(el.f1 * th + i * TAU / n) * (1 - el.amp * .45 * (1 + Math.cos(el.f2 * th))); }
          const x = Math.cos(th) * rho, y = Math.sin(th) * rho; j ? c.lineTo(x, y) : c.moveTo(x, y);
        }
      } else if (el.mode === 'band') {
        const steps = Math.round(w * 10 + 60);
        for (let j = 0; j <= steps; j++) { const x = -w / 2 + w * j / steps; const y = (h / 2) * Math.sin(TAU * el.f1 * (x + w / 2) / w + i * TAU / n) * (1 - el.amp * .5 * (1 - Math.cos(TAU * el.f2 * (x + w / 2) / w))); j ? c.lineTo(x, y) : c.moveTo(x, y); }
      } else if (el.mode === 'field') {
        const steps = Math.round(w * 6 + 60), y0 = -h / 2 + h * (i + .5) / n, A = (h / n) * el.amp * 3;
        for (let j = 0; j <= steps; j++) { const u = j / steps, x = -w / 2 + w * u; const y = y0 + A * (Math.sin(TAU * el.f1 * u + i * .45) * .6 + Math.sin(TAU * el.f2 * u - i * .27) * .4); j ? c.lineTo(x, y) : c.moveTo(x, y); }
      } else {
        const R = Math.max(2, el.f1 | 0), r = Math.max(1, Math.min(R - 1, (el.f2 | 0) || 1)), d = el.amp * r * 1.2;
        const gcd = (a, b) => b ? gcd(b, a % b) : a; const per = TAU * r / gcd(R, r), steps = Math.round(per * 60), sc = R0 / (R - r + d), rot = i * TAU / (n * R);
        for (let j = 0; j <= steps; j++) { const tt = j / steps * per; let x = (R - r) * Math.cos(tt) + d * Math.cos((R - r) / r * tt), y = (R - r) * Math.sin(tt) - d * Math.sin((R - r) / r * tt); const xr = x * Math.cos(rot) - y * Math.sin(rot), yr = x * Math.sin(rot) + y * Math.cos(rot); j ? c.lineTo(xr * sc, yr * sc) : c.moveTo(xr * sc, yr * sc); }
      }
      c.stroke();
    }
  }, 'M12 4c4 4 4 12 0 16c-4-4-4-12 0-16zM4 12c4-4 12-4 16 0c-4 4-12 4-16 0z');

/* pattern */
def('pattern', 'Pattern', { w: 85.6, h: 54, kind: 'waves', color: '#8fb5ad', color2: '#c4a3c4', color3: '#e7d29a', density: 40, lw: .07, amp: 1, seed: 1, text: 'SPECIMEN', font: 'Inter' },
  [['kind', 'Pattern', 'select', [['waves', 'Wave lines'], ['topo', 'Topographic contours'], ['mesh', 'Banknote lattice'], ['hex', 'Hex grid'], ['dots', 'Dot screen'], ['cross', 'Crosshatch'], ['circuit', 'Circuit traces'], ['rays', 'Sunburst'], ['stars', 'Star field'], ['iris', 'Rainbow (iris) fill'], ['thumb', 'Fingerprint'], ['aurora', 'Aurora gradient'], ['stripes', 'Diagonal stripes'], ['chevron', 'Chevrons'], ['scales', 'Fish scales'], ['checker', 'Checkerboard'], ['texttile', 'Text watermark']]], ['text', 'Watermark text', 'text', null, e => e.kind === 'texttile'], ['font', 'Font', 'font', null, e => e.kind === 'texttile'], ['color', 'Colour', 'color'], ['color2', 'Colour 2', 'color', null, e => ['iris', 'waves', 'mesh', 'topo', 'aurora', 'checker', 'stripes'].includes(e.kind)], ['color3', 'Colour 3', 'color', null, e => e.kind === 'iris' || e.kind === 'aurora'], ['density', 'Density', 'range', { min: 2, max: 160, step: 1 }], ['lw', 'Line (mm)', 'range', { min: .01, max: 1, step: .005 }], ['amp', 'Amplitude', 'range', { min: 0, max: 3, step: .01 }], ['seed', 'Seed', 'range', { min: 1, max: 99, step: 1 }]],
  function (c, el, ov) {
    const w = el.w, h = el.h, n = Math.max(2, el.density | 0), col = fillOf(ov, el.color), TAU = Math.PI * 2, R = rng(el.seed * 7919 + 13);
    c.save(); c.beginPath(); if (el.kind === 'thumb') c.ellipse(0, 0, w / 2, h / 2, 0, 0, TAU); else c.rect(-w / 2, -h / 2, w, h); c.clip();
    c.lineWidth = el.lw; c.strokeStyle = col; c.fillStyle = col; c.lineCap = 'round'; c.lineJoin = 'round';
    const two = (t) => ov.color != null ? ov.color : mix(el.color, el.color2, t);
    switch (el.kind) {
      case 'iris': { if (ov.color != null) c.fillStyle = ov.color; else { const g = c.createLinearGradient(-w / 2, 0, w / 2, 0); g.addColorStop(0, el.color); g.addColorStop(.5, el.color2); g.addColorStop(1, el.color3); c.fillStyle = g; } c.fillRect(-w / 2, -h / 2, w, h); break; }
      case 'waves': { for (let i = 0; i < n; i++) { c.strokeStyle = two(i / (n - 1)); c.beginPath(); const y0 = -h / 2 + h * (i + .5) / n; for (let x = -w / 2; x <= w / 2 + .5; x += .5) { const y = y0 + el.amp * (h / n) * 1.6 * Math.sin(x * .22 + i * .3) * Math.cos(x * .05 - i * .11); x === -w / 2 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke(); } break; }
      case 'mesh': { const D = Math.hypot(w, h); for (const f of [-1, 1]) { c.save(); c.rotate(f * .52); for (let i = 0; i < n * 1.6; i++) { c.strokeStyle = two(f < 0 ? 0 : 1); c.beginPath(); const y0 = -D / 2 + D * i / (n * 1.6); for (let x = -D / 2; x <= D / 2; x += .6) { const y = y0 + el.amp * .9 * Math.sin(x * .35 + i * .4); x === -D / 2 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke(); } c.restore(); } break; }
      case 'topo': { topo(c, el, w, h, ov); break; }
      case 'hex': { const s = w / n; const hh = s * Math.sqrt(3) / 2; c.beginPath(); for (let j = -1; j * hh * 2 < h + hh * 4; j++) for (let i = -1; i * s * 1.5 < w + s * 3; i++) { const cx = -w / 2 + i * s * 1.5, cy = -h / 2 + j * hh * 2 + (i % 2 ? hh : 0); for (let q = 0; q <= 6; q++) { const a = q * Math.PI / 3, x = cx + Math.cos(a) * s * .96, y = cy + Math.sin(a) * s * .96; q ? c.lineTo(x, y) : c.moveTo(x, y); } } c.stroke(); break; }
      case 'dots': { const s = w / n, md = Math.hypot(w, h) / 2; c.beginPath(); for (let y = -h / 2 + s / 2; y < h / 2; y += s) for (let x = -w / 2 + s / 2; x < w / 2; x += s) { const r = s * .46 * (1 - Math.hypot(x, y) / md * .85) * el.amp; if (r > .01) { c.moveTo(x + r, y); c.arc(x, y, r, 0, TAU); } } c.fill(); break; }
      case 'cross': { const s = w / n, D = Math.hypot(w, h); c.beginPath(); for (let i = -D; i < D; i += s) { c.moveTo(i, -D); c.lineTo(i + D, D); c.moveTo(i, D); c.lineTo(i + D, -D); } c.stroke(); break; }
      case 'circuit': { const g = w / n, cols = Math.ceil(w / g), rows = Math.ceil(h / g); const m = Math.round(n * 1.5); const dirs = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]]; for (let t = 0; t < m; t++) { let gx = R() * cols | 0, gy = R() * rows | 0, d = R() * 8 | 0; const pts = [[gx, gy]]; const segs = 2 + (R() * 5 | 0); for (let s = 0; s < segs; s++) { if (R() < .5) d = (d + (R() < .5 ? 1 : 7)) % 8; const L = 1 + (R() * 4 | 0); gx += dirs[d][0] * L; gy += dirs[d][1] * L; pts.push([gx, gy]); } c.beginPath(); pts.forEach((p, i) => { const x = -w / 2 + p[0] * g, y = -h / 2 + p[1] * g; i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke(); const e = pts[pts.length - 1], s0 = pts[0]; c.beginPath(); c.arc(-w / 2 + e[0] * g, -h / 2 + e[1] * g, g * .28, 0, TAU); c.fill(); c.fillRect(-w / 2 + s0[0] * g - g * .2, -h / 2 + s0[1] * g - g * .2, g * .4, g * .4); } break; }
      case 'rays': { const D = Math.hypot(w, h); c.beginPath(); for (let i = 0; i < n; i++) { const a0 = i * TAU / n, a1 = a0 + TAU / n * .5 * Math.min(1, el.amp); c.moveTo(0, 0); c.lineTo(Math.cos(a0) * D, Math.sin(a0) * D); c.lineTo(Math.cos(a1) * D, Math.sin(a1) * D); c.closePath(); } c.fill(); break; }
      case 'stars': { c.beginPath(); for (let i = 0; i < n * 5; i++) { const x = (R() - .5) * w, y = (R() - .5) * h, s = (.08 + R() * R() * .55) * el.amp; c.save(); c.translate(x, y); if (R() < .3) { starPoly(c, 4, s * 1.6, s * .35, 0); } else { c.moveTo(s * .45, 0); c.arc(0, 0, s * .45, 0, TAU); } c.restore(); } c.fill(); break; }
      case 'aurora': { if (ov.color != null) { c.globalAlpha *= .5; c.fillRect(-w / 2, -h / 2, w, h); break; } c.fillStyle = el.color; c.fillRect(-w / 2, -h / 2, w, h); const cols = [el.color2, el.color3, el.color2, el.color3]; for (let i = 0; i < 7; i++) { const x = (R() - .5) * w, y = (R() - .5) * h, r = (.25 + R() * .45) * Math.max(w, h) * el.amp; const g = c.createRadialGradient(x, y, 0, x, y, r), col = cols[i % 4]; g.addColorStop(0, hexA(col, .85)); g.addColorStop(1, hexA(col, 0)); c.fillStyle = g; c.fillRect(-w / 2, -h / 2, w, h); } break; }
      case 'stripes': { const s = w / n * 2; c.save(); c.rotate(-Math.PI / 4); const D = Math.hypot(w, h); for (let i = -D; i < D; i += s) { c.fillStyle = two(((i / s) | 0) % 2 ? 1 : 0); c.fillRect(i, -D, s * .5 * Math.min(1.9, el.amp), D * 2); } c.restore(); break; }
      case 'chevron': { const s = w / n * 2.4; c.beginPath(); for (let y = -h / 2 - s; y < h / 2 + s; y += s * .7) { c.moveTo(-w / 2, y); for (let x = -w / 2; x <= w / 2 + s; x += s) { c.lineTo(x + s / 2, y - s * .35 * el.amp); c.lineTo(x + s, y); } } c.stroke(); break; }
      case 'scales': { const s = w / n * 2; c.beginPath(); for (let j = 0, y = -h / 2; y < h / 2 + s; y += s * .5, j++) for (let x = -w / 2 - s + (j % 2) * s / 2; x < w / 2 + s; x += s) { c.moveTo(x + s / 2, y); c.arc(x, y, s / 2, 0, Math.PI); } c.stroke(); break; }
      case 'checker': { const s = w / n * 2; for (let j = 0, y = -h / 2; y < h / 2; y += s, j++) for (let i = 0, x = -w / 2; x < w / 2; x += s, i++) { c.fillStyle = (i + j) % 2 ? two(1) : col; c.fillRect(x, y, s + .01, s + .01); } break; }
      case 'texttile': { c.save(); c.rotate(-.35); const k2 = 8, px = Math.max(.6, w / n * 3.2); c.scale(1 / k2, 1 / k2); setFont(c, el.font || 'Inter', 800, px * k2, false); setSp(c, px * k2 * .15); c.fillStyle = col; c.textBaseline = 'middle'; const unit = String(el.text || ' ') + '   ', tw = c.measureText(unit).width || 1, D = Math.hypot(w, h) * k2; let r2 = 0; for (let y = -D / 2; y < D / 2; y += px * k2 * 2.2, r2++) for (let x = -D / 2 - (r2 % 2) * tw / 2; x < D / 2; x += tw) c.fillText(unit, x, y); c.restore(); break; }
      case 'thumb': { const sp = Math.min(w, h) / n * 2.2; c.lineWidth = Math.max(el.lw, sp * .42); for (let i = 1; i < n; i++) { const r = i * sp * .5; c.beginPath(); for (let j = 0; j <= 160; j++) { const t = j / 160 * TAU; const x = Math.cos(t) * r * .78 + Math.sin(3 * t + i * .3) * sp * .12, y = Math.sin(t) * r + (t > Math.PI ? Math.sin(t) * r * .25 : 0) - r * .15; j ? c.lineTo(x, y) : c.moveTo(x, y); } c.setLineDash([2 + R() * 9, .25 + R() * .6]); c.lineDashOffset = R() * 10; c.stroke(); } c.setLineDash([]); break; }
    }
    c.restore();
  }, 'M4 8c3-3 5 3 8 0s5 3 8 0M4 16c3-3 5 3 8 0s5 3 8 0');
function topo(c, el, w, h, ov) {
  const cs = Math.max(.45, Math.min(w, h) / 70), nx = Math.ceil(w / cs) + 1, ny = Math.ceil(h / cs) + 1, sc = .05 / Math.max(.2, el.amp), sd = el.seed * 13.7;
  const v = new Float32Array(nx * ny); let mn = 1, mx = 0;
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const val = fbm(i * cs * sc + sd, j * cs * sc - sd, 4); v[j * nx + i] = val; if (val < mn) mn = val; if (val > mx) mx = val; }
  const L = Math.max(2, el.density | 0);
  for (let l = 1; l <= L; l++) {
    const iso = mn + (mx - mn) * l / (L + 1); c.beginPath(); c.lineWidth = el.lw * (l % 5 === 0 ? 2.2 : 1); c.strokeStyle = ov.color != null ? ov.color : mix(el.color, el.color2, l / L);
    for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
      const a = v[j * nx + i], b = v[j * nx + i + 1], d2 = v[(j + 1) * nx + i], cc = v[(j + 1) * nx + i + 1];
      const idx = (a > iso ? 8 : 0) | (b > iso ? 4 : 0) | (cc > iso ? 2 : 0) | (d2 > iso ? 1 : 0); if (idx === 0 || idx === 15) continue;
      const x0 = -w / 2 + i * cs, y0 = -h / 2 + j * cs, it = (p, q) => (iso - p) / ((q - p) || 1e-6);
      const Tp = [x0 + cs * it(a, b), y0], Rp = [x0 + cs, y0 + cs * it(b, cc)], Bp = [x0 + cs * it(d2, cc), y0 + cs], Lp = [x0, y0 + cs * it(a, d2)];
      const seg = (p, q) => { c.moveTo(p[0], p[1]); c.lineTo(q[0], q[1]); };
      switch (idx) { case 1: case 14: seg(Lp, Bp); break; case 2: case 13: seg(Bp, Rp); break; case 3: case 12: seg(Lp, Rp); break; case 4: case 11: seg(Tp, Rp); break; case 5: seg(Tp, Lp); seg(Bp, Rp); break; case 6: case 9: seg(Tp, Bp); break; case 7: case 8: seg(Tp, Lp); break; case 10: seg(Tp, Rp); seg(Lp, Bp); break; }
    }
    c.stroke();
  }
}

/* seal */
def('seal', 'Seal', { w: 16, h: 16, style: 'star', text: 'AURELIAN COMMONWEALTH ·', center: '', points: 12, color: '#13403b', color2: '', font: 'Cinzel', lw: 0 },
  [['style', 'Emblem', 'select', [['star', 'Star'], ['sun', 'Sun'], ['compass', 'Compass rose'], ['laurel', 'Laurel'], ['shield', 'Shield'], ['rosette', 'Rosette']]], ['text', 'Ring legend', 'text'], ['center', 'Centre text', 'text'], ['font', 'Font', 'font'], ['points', 'Points / rays', 'range', { min: 3, max: 36, step: 1 }], ['color', 'Colour', 'color'], ['color2', 'Emblem colour', 'color'], ['lw', 'Ring weight', 'range', { min: 0, max: 1, step: .01 }]],
  function (c, el, ov, k) {
    const R = Math.min(el.w, el.h) / 2, col = fillOf(ov, el.color), col2 = fillOf(ov, el.color2 || el.color), lw = el.lw || R * .035, TAU = Math.PI * 2;
    c.strokeStyle = col; c.fillStyle = col; c.lineWidth = lw;
    c.beginPath(); c.arc(0, 0, R - lw / 2, 0, TAU); c.stroke();
    const hasRing = !!String(el.text).trim(); const ri = hasRing ? R * .72 : R * .9;
    if (hasRing) {
      c.lineWidth = lw * .7; c.beginPath(); c.arc(0, 0, R * .76, 0, TAU); c.stroke();
      c.save(); c.scale(1 / k, 1 / k); const str = String(el.text); const band = R * .2, circ = TAU * R * .88; const px = Math.min(band * .8, circ / Math.max(1, str.length) * 1.3) * k;
      setFont(c, el.font, 700, px, false); setSp(c, 0); c.fillStyle = col; ringText(c, str, R * .88 * k); c.restore();
    }
    c.strokeStyle = col2; c.fillStyle = col2; const n = Math.max(3, el.points | 0);
    switch (el.style) {
      case 'sun': c.beginPath(); c.arc(0, 0, ri * .34, 0, TAU); c.fill(); c.beginPath(); for (let i = 0; i < n * 2; i++) { const a = i * Math.PI / n, r1 = ri * .42, r2 = ri * (i % 2 ? .7 : .95), wd = Math.PI / n * .45; c.moveTo(Math.cos(a - wd) * r1, Math.sin(a - wd) * r1); c.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); c.lineTo(Math.cos(a + wd) * r1, Math.sin(a + wd) * r1); c.closePath(); } c.fill(); break;
      case 'compass': { c.lineWidth = lw * .6; c.beginPath(); c.arc(0, 0, ri * .55, 0, TAU); c.stroke(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 - Math.PI / 2, L = i % 2 ? ri * .62 : ri * .98, wdt = ri * (i % 2 ? .09 : .14); const ca = Math.cos(a), sa = Math.sin(a), px = -sa, py = ca; c.beginPath(); c.moveTo(0, 0); c.lineTo(ca * L, sa * L); c.lineTo(px * wdt, py * wdt); c.closePath(); c.fill(); c.beginPath(); c.moveTo(0, 0); c.lineTo(ca * L, sa * L); c.lineTo(-px * wdt, -py * wdt); c.closePath(); c.stroke(); } break; }
      case 'laurel': { for (const s of [-1, 1]) { for (let i = 0; i < 9; i++) { const a = Math.PI / 2 + s * (.25 + i * .28), r = ri * .78; const x = Math.cos(a) * r, y = Math.sin(a) * r; c.save(); c.translate(x, y); c.rotate(a + s * Math.PI / 2 + s * .5); c.beginPath(); c.ellipse(0, 0, ri * .09, ri * .2, 0, 0, TAU); c.fill(); c.restore(); } c.lineWidth = lw * .6; c.beginPath(); c.arc(0, 0, ri * .7, Math.PI / 2 + s * .15, Math.PI / 2 + s * 2.6, s < 0); c.stroke(); } c.beginPath(); starPoly(c, 5, ri * .3, ri * .12); c.fill(); break; }
      case 'shield': { c.save(); c.scale(ri * 1.15, ri * 1.15); shapePath(c, 'shield', 1, 1.15); c.restore(); c.lineWidth = lw; c.stroke(); c.beginPath(); c.moveTo(-ri * .45, ri * .05); c.lineTo(0, -ri * .25); c.lineTo(ri * .45, ri * .05); c.lineWidth = lw * 1.4; c.stroke(); for (const [x, y] of [[-ri * .25, ri * .3], [ri * .25, ri * .3], [0, ri * .5]]) { c.save(); c.translate(x, y); c.beginPath(); starPoly(c, 5, ri * .1, ri * .04); c.fill(); c.restore(); } break; }
      case 'rosette': { c.lineWidth = Math.max(.03, lw * .35); for (let i = 0; i < 28; i++) { c.beginPath(); for (let j = 0; j <= 240; j++) { const th = j / 240 * TAU, rho = ri * (.25 + .7 * (.5 + .5 * Math.sin(n * (th + i * TAU / (28 * n))))); j ? c.lineTo(Math.cos(th) * rho, Math.sin(th) * rho) : c.moveTo(Math.cos(th) * rho, Math.sin(th) * rho); } c.stroke(); } break; }
      default: c.beginPath(); starPoly(c, n, ri * .9, ri * .42); c.fill();
    }
    if (el.center) { c.save(); c.scale(1 / k, 1 / k); setFont(c, el.font, 700, R * .2 * k, false); setSp(c, 0); c.fillStyle = fillOf(ov, el.color); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(el.center, 0, 0); c.restore(); }
  }, 'M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.2l5.9-.9z');

/* microtext */
def('micro', 'Microtext', { w: 80, h: .6, text: 'MICROTEXT · ', size: .42, color: '#5d7a74', mode: 'line', font: 'Inter' },
  [['text', 'Repeat text', 'text'], ['mode', 'Layout', 'select', [['line', 'Single line'], ['fill', 'Fill box'], ['ring', 'Ring']]], ['size', 'Size (mm)', 'range', { min: .15, max: 2, step: .01 }], ['font', 'Font', 'font'], ['color', 'Colour', 'color']],
  function (c, el, ov, k) {
    const px = el.size * k, W = el.w * k, Hh = el.h * k, unit = String(el.text || ' ');
    c.save(); c.scale(1 / k, 1 / k); setFont(c, el.font || 'Inter', 600, px, false); setSp(c, 0); c.fillStyle = fillOf(ov, el.color); c.textBaseline = 'middle';
    if (el.mode === 'ring') { const R = Math.min(W, Hh) / 2 - px * .6, cw = c.measureText(unit).width || 1, reps = Math.max(1, Math.floor(2 * Math.PI * R / cw)); ringText(c, unit.repeat(reps), R); }
    else {
      c.beginPath(); c.rect(-W / 2, -Hh / 2, W, Hh); c.clip(); const tw = c.measureText(unit).width || 1;
      const rows = el.mode === 'fill' ? Math.max(1, Math.floor(Hh / (px * 1.15))) : 1; c.textAlign = 'left';
      for (let r = 0; r < rows; r++) { const y = el.mode === 'fill' ? -Hh / 2 + px * 1.15 * (r + .5) : 0; let x = -W / 2 - (r * tw * .37) % tw; let guard = 0; while (x < W / 2 && guard++ < 4000) { c.fillText(unit, x, y); x += tw; } }
    }
    c.restore();
  }, 'M4 9h16M4 12h16M4 15h16');

/* barcode */
def('barcode', 'Barcode', { w: 40, h: 8, data: 'ID-0042-1187', kind: 'code128', color: '#111111', showText: true, font: 'IBM Plex Mono' },
  [['data', 'Data', 'text'], ['kind', 'Symbology', 'select', [['code128', 'Code 128 (scannable)'], ['stack', 'Stacked (decorative)']]], ['color', 'Colour', 'color'], ['showText', 'Human-readable text', 'check'], ['font', 'Font', 'font', null, e => e.showText]],
  function (c, el, ov, k) {
    const col = fillOf(ov, el.color), w = el.w, h = el.h, txtH = el.showText && el.kind !== 'stack' ? Math.min(h * .28, 2.2) : 0, bh = h - txtH; c.fillStyle = col;
    if (el.kind === 'stack') {
      const R = rng(hashStr(el.data)), rows = Math.max(3, Math.round(h / 1.1)), rh = h / rows;
      for (let r = 0; r < rows; r++) { const y = -h / 2 + r * rh; const mods = [8, 1, 1, 1, 1, 1, 1, 3]; for (let q = 0; q < 26; q++) mods.push(1 + (R() * 4 | 0)); mods.push(7, 1, 1, 3, 1, 1, 1, 2, 1); const tot = mods.reduce((a, b) => a + b, 0), mw = w / tot; let x = -w / 2, bar = true; for (const m of mods) { if (bar) c.fillRect(x, y, m * mw + .01, rh * .98); x += m * mw; bar = !bar; } }
    } else {
      const mods = code128(el.data), tot = mods.reduce((a, b) => a + b, 0), mw = w / tot; let x = -w / 2, bar = true;
      for (const m of mods) { if (bar) c.fillRect(x, -h / 2, m * mw, bh); x += m * mw; bar = !bar; }
    }
    if (txtH) { c.save(); c.scale(1 / k, 1 / k); setFont(c, el.font || 'IBM Plex Mono', 500, txtH * .82 * k, false); setSp(c, txtH * .2 * k); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = col; c.fillText(el.data, txtH * .1 * k, (h / 2 - txtH / 2) * k); c.restore(); }
  }, 'M5 5v14M8 5v14M10 5v14M13 5v14M16 5v14M19 5v14');

/* 2D code (decorative) */
def('matrix', '2D code', { w: 12, h: 12, data: 'forge', color: '#111111', cells: 22 },
  [['data', 'Seed text', 'text'], ['cells', 'Cells', 'range', { min: 10, max: 48, step: 1 }], ['color', 'Colour', 'color']],
  function (c, el, ov) {
    const n = Math.max(8, el.cells | 0), s = Math.min(el.w, el.h) / n, R = rng(hashStr(el.data)), o = -n * s / 2; c.fillStyle = fillOf(ov, el.color);
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { let on; if (i === 0 || j === n - 1) on = true; else if (j === 0) on = i % 2 === 0; else if (i === n - 1) on = j % 2 === 1; else on = R() < .47; if (on) c.fillRect(o + i * s, o + j * s, s * 1.02, s * 1.02); }
  }, 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2z');

/* MRZ-style strip */
def('mrz', 'Machine strip', { w: 80, h: 11, text: 'I<FOR0000000000<<<<<<<<<<<<<<<\n0000000F0000000FOR<<<<<<<<<<<0\nSURNAME<<GIVEN<NAMES<<<<<<<<<<', cols: 30, color: '#141414', font: 'IBM Plex Mono' },
  [['text', 'Lines', 'area'], ['cols', 'Characters per line', 'range', { min: 10, max: 50, step: 1 }], ['font', 'Font', 'font'], ['color', 'Colour', 'color']],
  function (c, el, ov, k) {
    const lines = String(el.text).toUpperCase().split('\n').map(s => s.replace(/[^A-Z0-9<]/g, '<')), L = Math.max(1, lines.length), cols = el.cols | 0 || 30, lh = el.h / L, cw = el.w / cols;
    c.save(); c.scale(1 / k, 1 / k); setFont(c, el.font, 500, Math.min(lh * .8, cw * 1.6) * k, false); setSp(c, 0); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = fillOf(ov, el.color);
    lines.forEach((ln, li) => { const s = (ln + '<'.repeat(cols)).slice(0, cols), y = (-el.h / 2 + lh * (li + .5)) * k; for (let i = 0; i < cols; i++) c.fillText(s[i], (-el.w / 2 + cw * (i + .5)) * k, y); });
    c.restore();
  }, 'M4 8h16M4 12h16M4 16h11');

/* signature */
def('sign', 'Signature', { w: 26, h: 7, strokes: null, text: 'J. Doe', font: 'Homemade Apple', color: '#1f2b5c', lw: .32 },
  [['draw', 'Draw by hand…', 'action', (el) => Forge.ui.signPad(el)], ['clearSig', 'Clear drawing', 'action', (el) => { el.strokes = null; Forge.ui.changed(true); }, e => e.strokes && e.strokes.length], ['text', 'Typed signature', 'text', null, e => !(e.strokes && e.strokes.length)], ['font', 'Hand', 'font', null, e => !(e.strokes && e.strokes.length)], ['color', 'Ink', 'color'], ['lw', 'Pen (mm)', 'range', { min: .05, max: 1.2, step: .01 }, e => e.strokes && e.strokes.length]],
  function (c, el, ov, k) {
    const col = fillOf(ov, el.color);
    if (el.strokes && el.strokes.length) {
      c.strokeStyle = col; c.lineCap = 'round'; c.lineJoin = 'round';
      for (const s of el.strokes) for (let i = 1; i < s.length; i++) { const p0 = s[i - 1], p1 = s[i]; c.lineWidth = el.lw * (p1[2] || 1); c.beginPath(); c.moveTo((p0[0] - .5) * el.w, (p0[1] - .5) * el.h); c.lineTo((p1[0] - .5) * el.w, (p1[1] - .5) * el.h); c.stroke(); }
    } else {
      c.save(); c.scale(1 / k, 1 / k); setFont(c, el.font, 400, el.h * .6 * k, false); setSp(c, 0); const tw = c.measureText(el.text).width || 1, s = Math.min(1, el.w * k / tw);
      c.fillStyle = col; c.textAlign = 'center'; c.textBaseline = 'middle'; c.scale(s, s); c.fillText(el.text, 0, 0); c.restore();
    }
  }, 'M3 17c3-8 5-10 6-6s-2 7 1 5 4-8 6-6-1 5 5 4');

/* contact chip */
def('chip', 'Contact chip', { w: 11.6, h: 9, style: 'classic', finish: 'foil', foil: '#d9bd6a', relief: .15 },
  [['style', 'Contacts', 'select', [['classic', 'Classic 8-pad'], ['ornate', 'Ornate']]]],
  function (c, el, ov) {
    const w = el.w, h = el.h; c.beginPath(); rr(c, -w / 2, -h / 2, w, h, Math.min(w, h) * .17);
    if (ov.ch === 'A') { const base = ov.color || el.foil; const g = c.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); g.addColorStop(0, shade(base, .28)); g.addColorStop(.5, base); g.addColorStop(1, shade(base, -.2)); c.fillStyle = g; c.fill(); c.strokeStyle = shade(base, -.4); c.lineWidth = .16; chipLines(c, el); }
    else { c.fillStyle = ov.color; c.fill(); if (ov.ch === 'H') { c.globalAlpha = .95; c.strokeStyle = '#000'; c.lineWidth = .22; chipLines(c, el); } }
  }, 'M6 7h12v10H6zM10 7v10M14 7v10M6 12h4M14 12h4');
function chipLines(c, el) {
  const w = el.w, h = el.h, a = w * .18, b = h * .23; c.beginPath();
  if (el.style === 'ornate') { c.moveTo(a * 1.1, 0); c.arc(0, 0, a * 1.1, 0, Math.PI * 2); for (const s of [-1, 1]) { c.moveTo(s * w / 2, -h * .2); c.bezierCurveTo(s * a * 1.6, -h * .2, s * a * 1.4, -b * 1.4, s * a * .4, -h / 2); c.moveTo(s * w / 2, h * .2); c.bezierCurveTo(s * a * 1.6, h * .2, s * a * 1.4, b * 1.4, s * a * .4, h / 2); c.moveTo(s * a * 1.1, 0); c.lineTo(s * w / 2, 0); } }
  else { rr(c, -a, -b, 2 * a, 2 * b, Math.min(a, b) * .35); for (const s of [-1, 1]) { c.moveTo(s * a, -h / 2); c.lineTo(s * a, -b); c.moveTo(s * a, b); c.lineTo(s * a, h / 2); c.moveTo(s * w / 2, -h / 6); c.lineTo(s * a, -h / 6); c.moveTo(s * w / 2, h / 6); c.lineTo(s * a, h / 6); } }
  c.stroke();
}

/* rubber stamp */
const STAMP_STYLES = [['round', 'Round'], ['rect', 'Rectangular'], ['oval', 'Oval'], ['box', 'Bold box'], ['date', 'Date band'], ['hex', 'Hexagon'], ['octagon', 'Octagon'], ['shield', 'Shield'], ['burst', 'Starburst'], ['triangle', 'Triangle'], ['entry', 'Entry stamp (icon)'], ['postmark', 'Postmark'], ['ticket', 'Notched ticket'], ['gear', 'Notary gear'], ['banner', 'Banner']];
const STAMP_ICONS = [['none', 'None'], ['star', 'Star'], ['check', 'Tick'], ['cross', 'Cross'], ['arrowIn', 'Arrow in'], ['arrowOut', 'Arrow out'], ['plane', 'Aeroplane'], ['ship', 'Ship'], ['train', 'Train'], ['airship', 'Airship'], ['crown', 'Crown'], ['anchor', 'Anchor'], ['skull', 'Skull'], ['eye', 'Eye'], ['planet', 'Planet'], ['rocket', 'Rocket'], ['key', 'Key'], ['feather', 'Quill'], ['sun', 'Sun'], ['hazard', 'Hazard'], ['cog', 'Cog'], ['tower', 'Tower'], ['tree', 'Pine'], ['mountain', 'Mountain'], ['heart', 'Heart'], ['hand', 'Pointing hand']];
function stampIcon(x, kind, s) {   // centred at 0,0, roughly s mm across, ink = current fill/stroke
  const L = s * .09; x.lineWidth = L; x.lineCap = 'round'; x.lineJoin = 'round';
  const P = (pts, close = true, fill = true) => { x.beginPath(); pts.forEach(([a, b], i) => i ? x.lineTo(a * s, b * s) : x.moveTo(a * s, b * s)); if (close) x.closePath(); fill ? x.fill() : x.stroke(); };
  const C = (cx, cy, r, fill = true) => { x.beginPath(); x.arc(cx * s, cy * s, r * s, 0, Math.PI * 2); fill ? x.fill() : x.stroke(); };
  const hole = (f) => { x.save(); x.globalCompositeOperation = 'destination-out'; f(); x.restore(); };
  switch (kind) {
    case 'star': x.beginPath(); starPoly(x, 5, s * .5, s * .21); x.fill(); break;
    case 'check': P([[-.38, .02], [-.12, .3], [.4, -.3]], false, false); break;
    case 'cross': P([[-.32, -.32], [.32, .32]], false, false); P([[.32, -.32], [-.32, .32]], false, false); break;
    case 'arrowIn': P([[-.45, 0], [.12, 0]], false, false); P([[-.06, -.2], [.14, 0], [-.06, .2]], false, false); P([[.36, -.4], [.36, .4]], false, false); break;
    case 'arrowOut': P([[-.36, -.4], [-.36, .4]], false, false); P([[-.18, 0], [.42, 0]], false, false); P([[.22, -.2], [.44, 0], [.22, .2]], false, false); break;
    case 'plane': P([[.5, 0], [.36, -.06], [.06, -.06], [-.16, -.46], [-.26, -.46], [-.12, -.06], [-.36, -.06], [-.46, -.2], [-.52, -.2], [-.46, 0], [-.52, .2], [-.46, .2], [-.36, .06], [-.12, .06], [-.26, .46], [-.16, .46], [.06, .06], [.36, .06]]); break;
    case 'ship': P([[-.5, .1], [.5, .1], [.36, .34], [-.38, .34]]); P([[-.02, .06], [-.02, -.46]], false, false); P([[.04, -.42], [.04, .02], [.34, .02]]); P([[-.08, -.32], [-.08, .02], [-.32, .02]]); break;
    case 'train': x.beginPath(); rr(x, -.44 * s, -.36 * s, .88 * s, .6 * s, .14 * s); x.fill(); hole(() => { x.beginPath(); rr(x, -.32 * s, -.26 * s, .26 * s, .2 * s, .04 * s); rr(x, .06 * s, -.26 * s, .26 * s, .2 * s, .04 * s); x.fill(); }); C(-.24, .34, .1); C(.24, .34, .1); P([[-.5, .48], [.5, .48]], false, false); break;
    case 'airship': x.beginPath(); x.ellipse(0, -.1 * s, .44 * s, .2 * s, 0, 0, Math.PI * 2); x.fill(); P([[.34, -.1], [.52, -.3], [.52, .1]]); x.fillRect(-.14 * s, .14 * s, .24 * s, .12 * s); P([[-.1, .1], [-.1, .14]], false, false); P([[.06, .1], [.06, .14]], false, false); break;
    case 'crown': P([[-.46, .3], [-.46, -.24], [-.24, .02], [0, -.36], [.24, .02], [.46, -.24], [.46, .3]]); C(-.46, -.3, .07); C(0, -.42, .07); C(.46, -.3, .07); break;
    case 'anchor': C(0, -.38, .09, false); P([[0, -.29], [0, .44]], false, false); P([[-.2, -.16], [.2, -.16]], false, false); x.beginPath(); x.arc(0, .06 * s, .38 * s, Math.PI * .15, Math.PI * .85); x.stroke(); P([[-.42, .14], [-.32, .28], [-.24, .16]], false, false); P([[.42, .14], [.32, .28], [.24, .16]], false, false); break;
    case 'skull': C(0, -.08, .36); x.fillRect(-.2 * s, .18 * s, .4 * s, .2 * s); hole(() => { C(-.14, -.06, .1); C(.14, -.06, .1); P([[0, .06], [-.05, .16], [.05, .16]]); x.fillRect(-.07 * s, .3 * s, .04 * s, .1 * s); x.fillRect(.03 * s, .3 * s, .04 * s, .1 * s); }); break;
    case 'eye': x.beginPath(); x.moveTo(-.5 * s, 0); x.quadraticCurveTo(0, -.46 * s, .5 * s, 0); x.quadraticCurveTo(0, .46 * s, -.5 * s, 0); x.stroke(); C(0, 0, .15); break;
    case 'planet': C(0, 0, .27); x.save(); x.rotate(-.35); x.beginPath(); x.ellipse(0, 0, .5 * s, .14 * s, 0, 0, Math.PI * 2); x.lineWidth = L * .8; x.stroke(); x.restore(); break;
    case 'rocket': x.beginPath(); x.moveTo(0, -.5 * s); x.quadraticCurveTo(.24 * s, -.2 * s, .16 * s, .26 * s); x.lineTo(-.16 * s, .26 * s); x.quadraticCurveTo(-.24 * s, -.2 * s, 0, -.5 * s); x.fill(); P([[-.16, .06], [-.32, .34], [-.14, .26]]); P([[.16, .06], [.32, .34], [.14, .26]]); hole(() => C(0, -.12, .07)); P([[-.06, .34], [0, .5], [.06, .34]]); break;
    case 'key': C(-.28, 0, .17, false); P([[-.11, 0], [.48, 0]], false, false); P([[.3, 0], [.3, .16]], false, false); P([[.42, 0], [.42, .13]], false, false); break;
    case 'feather': x.beginPath(); x.moveTo(.4 * s, -.46 * s); x.quadraticCurveTo(-.36 * s, -.3 * s, -.3 * s, .3 * s); x.quadraticCurveTo(.2 * s, .1 * s, .4 * s, -.46 * s); x.fill(); P([[.3, -.32], [-.46, .48]], false, false); break;
    case 'sun': C(0, 0, .2); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; P([[Math.cos(a) * .3, Math.sin(a) * .3], [Math.cos(a) * .48, Math.sin(a) * .48]], false, false); } break;
    case 'hazard': x.lineWidth = L * 1.1; P([[0, -.44], [.48, .38], [-.48, .38]], true, false); P([[0, -.14], [0, .12]], false, false); C(0, .24, .05); break;
    case 'cog': x.beginPath(); for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, r = (i % 2 ? .34 : .46) * s; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath(); x.fill(); hole(() => C(0, 0, .16)); break;
    case 'tower': P([[-.3, .48], [-.3, -.3], [-.3, -.46], [-.18, -.46], [-.18, -.36], [-.06, -.36], [-.06, -.46], [.06, -.46], [.06, -.36], [.18, -.36], [.18, -.46], [.3, -.46], [.3, .48]]); hole(() => { x.beginPath(); x.moveTo(-.1 * s, .48 * s); x.lineTo(-.1 * s, .26 * s); x.arc(0, .26 * s, .1 * s, Math.PI, 0); x.lineTo(.1 * s, .48 * s); x.fill(); }); break;
    case 'tree': P([[0, -.5], [.24, -.14], [.12, -.14], [.34, .18], [.16, .18], [.4, .4], [-.4, .4], [-.16, .18], [-.34, .18], [-.12, -.14], [-.24, -.14]]); x.fillRect(-.05 * s, .4 * s, .1 * s, .1 * s); break;
    case 'mountain': P([[-.5, .36], [-.14, -.28], [.04, 0], [.2, -.4], [.5, .36]]); hole(() => P([[.2, -.4], [.08, -.18], [.15, -.22], [.2, -.14], [.25, -.22], [.32, -.18]])); break;
    case 'heart': x.beginPath(); x.moveTo(0, .42 * s); x.bezierCurveTo(-.56 * s, 0, -.36 * s, -.5 * s, 0, -.18 * s); x.bezierCurveTo(.36 * s, -.5 * s, .56 * s, 0, 0, .42 * s); x.fill(); break;
    case 'hand': x.beginPath(); rr(x, -.46 * s, -.12 * s, .4 * s, .4 * s, .08 * s); x.fill(); x.beginPath(); rr(x, -.12 * s, -.12 * s, .62 * s, .12 * s, .06 * s); x.fill(); x.fillRect(-.46 * s, -.04 * s, .08 * s, .3 * s); break;
  }
}
def('stamp', 'Rubber stamp', { w: 22, h: 22, style: 'round', text: 'DISTRICT CLERK', text2: 'NINTH RAIL', center: 'APPROVED', icon: 'none', color: '#b3302a', distress: .5, uneven: 0, ghost: 0, font: 'Courier Prime', blend: 'multiply', opacity: .85 },
  [['style', 'Shape', 'select', STAMP_STYLES], ['icon', 'Icon', 'select', STAMP_ICONS], ['text', 'Top text', 'text'], ['center', 'Centre text', 'text'], ['text2', 'Bottom text', 'text'], ['font', 'Font', 'font'], ['color', 'Ink', 'color'], ['distress', 'Wear', 'range', { min: 0, max: 1, step: .01 }], ['uneven', 'Uneven ink', 'range', { min: 0, max: 1, step: .01 }], ['ghost', 'Double strike', 'range', { min: 0, max: 1, step: .01 }]],
  function (c, el, ov, k) {
    const w = el.w, h = el.h, pw = Math.max(8, Math.ceil(w * k)), ph = Math.max(8, Math.ceil(h * k)), kk = pw / w; const t = tmpCanvas(pw, ph), x = t.getContext('2d');
    x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, pw, ph); x.translate(pw / 2, ph / 2); x.scale(kk, kk);
    const col = fillOf(ov, el.color); x.strokeStyle = col; x.fillStyle = col; x.textAlign = 'center'; x.textBaseline = 'middle'; setSp(x, 0);
    const T1 = String(el.text || ''), T2 = String(el.text2 || ''), CT = String(el.center || ''), ic = el.icon && el.icon !== 'none' ? el.icon : null, m = Math.min(w, h);
    const txt = (s, X, Y, sz, mx, wgt) => { if (!s) return; setFont(x, el.font, wgt || 700, sz, false); const lines = s.split('\n'), lh = sz * 1.05; lines.forEach((ln, i) => { const tw = x.measureText(ln).width; x.save(); x.translate(X, Y + (i - (lines.length - 1) / 2) * lh); if (tw > mx) x.scale(mx / tw, 1); x.fillText(ln, 0, 0); x.restore(); }); };
    const poly = (n, R, rot = -Math.PI / 2, sx = 1) => { x.beginPath(); for (let i = 0; i < n; i++) { const a = rot + i * Math.PI * 2 / n; x.lineTo(Math.cos(a) * R * sx, Math.sin(a) * R); } x.closePath(); };
    const ring = (R, lw) => { x.lineWidth = lw; x.beginPath(); x.arc(0, 0, R, 0, Math.PI * 2); x.stroke(); };
    const arcs = (R, sz) => { setFont(x, el.font, 700, sz, false); if (T1) arcText(x, T1, 0, 0, R, -Math.PI / 2, sz * .1, false); if (T2) arcText(x, T2, 0, 0, R, Math.PI / 2, sz * .1, true); };
    const stack = (W, H) => { // three straight lines inside a W×H area, with an optional icon above the centre line
      if (ic) { txt(T1, 0, -H * .37, H * .12, W * .68); x.save(); x.translate(0, -H * .11); stampIcon(x, ic, H * .22); x.restore(); txt(CT, 0, H * .14, H * .15, W * .86, 800); txt(T2, 0, H * .35, H * .1, W * .64); }
      else { txt(T1, 0, -H * .28, H * .14, W * .78); txt(CT, 0, H * .02, H * .24, W * .92, 800); txt(T2, 0, H * .3, H * .12, W * .78); } };
    const st = el.style;
    if (st === 'rect' || st === 'box' || st === 'date') {
      const lw = m * (st === 'box' ? .085 : .06); x.lineWidth = lw; x.beginPath(); rr(x, -w / 2 + lw, -h / 2 + lw, w - 2 * lw, h - 2 * lw, lw * 1.5); x.stroke();
      if (st === 'rect') { x.lineWidth = lw * .45; x.beginPath(); rr(x, -w / 2 + lw * 2.3, -h / 2 + lw * 2.3, w - 4.6 * lw, h - 4.6 * lw, lw); x.stroke(); }
      if (st === 'rect') { const nl = CT.split('\n').length; txt(T1, 0, -h * .26, h * .13, w * .8); txt(CT, 0, h * .02, h * .26 / (nl > 1 ? nl * 1.05 : 1), w * .8); txt(T2, 0, h * .27, h * .12, w * .8); if (ic) { x.save(); x.translate(-w * .36, h * .02); stampIcon(x, ic, h * .26); x.restore(); } }
      else if (st === 'box') { const big = !T1 && !T2; if (ic) { x.save(); x.translate(-w / 2 + h * .5, 0); stampIcon(x, ic, h * .5); x.restore(); } const cx = ic ? h * .38 : 0, mw = (w - (ic ? h * .9 : 0)) * .84; txt(T1, cx, -h * .27, h * .13, mw); const nl = CT.split('\n').length; txt(CT, cx, h * .02, h * (big ? .5 : .32) / (nl > 1 ? nl * .92 : 1), mw, 800); txt(T2, cx, h * .29, h * .12, mw); }
      else { txt(T1, 0, -h * .3, h * .15, w * .84); x.lineWidth = lw * .5; x.beginPath(); x.moveTo(-w / 2 + lw * 2.5, -h * .14); x.lineTo(w / 2 - lw * 2.5, -h * .14); x.moveTo(-w / 2 + lw * 2.5, h * .16); x.lineTo(w / 2 - lw * 2.5, h * .16); x.stroke(); txt(CT, 0, h * .01, h * .21, w * .84, 800); txt(T2, 0, h * .31, h * .13, w * .84); }
    } else if (st === 'oval') {
      const R = h / 2, sx = w / h; x.save(); x.scale(sx, 1); ring(R - m * .04, m * .07 / sx); ring(R * .64, m * .035 / sx); arcs(R * .8, R * .19); x.restore();
      if (ic) { x.save(); x.translate(0, -R * .2); stampIcon(x, ic, R * .38); x.restore(); txt(CT, 0, R * .22, R * .22, w * .5); } else txt(CT, 0, 0, R * .26, w * .55);
    } else if (st === 'hex' || st === 'octagon') {
      const n = st === 'hex' ? 6 : 8, R = m / 2, rot = st === 'hex' ? 0 : Math.PI / 8, sx = w / h; x.lineWidth = m * .065; poly(n, R - m * .04, rot, sx); x.stroke(); x.lineWidth = m * .03; poly(n, R * .82, rot, sx); x.stroke();
      stack(w * .66, h * .74);
    } else if (st === 'shield') {
      const sh = (s) => { x.beginPath(); x.moveTo(-w / 2 * s, -h / 2 * s); x.lineTo(w / 2 * s, -h / 2 * s); x.lineTo(w / 2 * s, h * .02 * s); x.quadraticCurveTo(w * .45 * s, h * .36 * s, 0, h / 2 * s); x.quadraticCurveTo(-w * .45 * s, h * .36 * s, -w / 2 * s, h * .02 * s); x.closePath(); };
      x.lineWidth = m * .06; sh(.94); x.stroke(); x.lineWidth = m * .025; sh(.8); x.stroke();
      txt(T1, 0, -h * .28, h * .11, w * .7); if (ic) { x.save(); x.translate(0, -h * .08); stampIcon(x, ic, h * .22); x.restore(); txt(CT, 0, h * .13, h * .12, w * .6, 800); txt(T2, 0, h * .29, h * .075, w * .36); } else { txt(CT, 0, -h * .02, h * .2, w * .7, 800); txt(T2, 0, h * .28, h * .1, w * .4); }
    } else if (st === 'burst') {
      const R = m / 2; x.lineWidth = m * .045; x.beginPath(); starPoly(x, 22, R * .97, R * .84); x.stroke(); ring(R * .72, m * .03);
      txt(T1, 0, -R * .4, R * .15, R * 1.1); if (ic) { x.save(); x.translate(0, -R * .05); stampIcon(x, ic, R * .5); x.restore(); txt(CT, 0, R * .36, R * .2, R * 1.2); } else txt(CT, 0, 0, R * .34, R * 1.25, 800); txt(T2, 0, R * .42, R * .14, R * 1.1);
    } else if (st === 'triangle') {
      x.lineWidth = m * .06; x.beginPath(); x.moveTo(0, -h / 2 + m * .06); x.lineTo(w / 2 - m * .05, h / 2 - m * .05); x.lineTo(-w / 2 + m * .05, h / 2 - m * .05); x.closePath(); x.stroke();
      if (ic) { x.save(); x.translate(0, -h * .02); stampIcon(x, ic, h * .26); x.restore(); } txt(CT, 0, h * .22, h * .14, w * .5, 800); txt(T1 || T2, 0, h * .37, h * .08, w * .72);
    } else if (st === 'entry') {
      const lw = m * .06; x.lineWidth = lw; x.beginPath(); rr(x, -w / 2 + lw, -h / 2 + lw, w - 2 * lw, h - 2 * lw, h * .16); x.stroke();
      const iw = h * .82, dx = -w / 2 + lw + iw; x.lineWidth = lw * .5; x.beginPath(); x.moveTo(dx, -h / 2 + lw * 2); x.lineTo(dx, h / 2 - lw * 2); x.stroke();
      x.save(); x.translate(-w / 2 + lw + iw / 2, 0); stampIcon(x, ic || 'arrowIn', h * .48); x.restore();
      const cx = (dx + w / 2 - lw) / 2, mw = (w / 2 - lw - dx) * .86; txt(T1, cx, -h * .26, h * .15, mw); txt(CT, cx, h * .02, h * .22, mw, 800); txt(T2, cx, h * .29, h * .13, mw);
    } else if (st === 'postmark') {
      const R = h / 2 - m * .03, ox = -w / 2 + R + m * .03; x.save(); x.translate(ox, 0); ring(R, m * .045); ring(R * .62, m * .025); arcs(R * .8, R * .19); txt(CT, 0, 0, R * .2, R * 1.1, 800); x.restore();
      x.lineWidth = m * .035; for (let i = 0; i < 5; i++) { const y = (i - 2) * h * .14; x.beginPath(); for (let X = ox + R + m * .06; X <= w / 2 - m * .02; X += .2) x.lineTo(X, y + Math.sin(X * 1.25) * h * .035); x.stroke(); }
      if (ic) { x.save(); x.translate((ox + R + w / 2) / 2, 0); x.globalCompositeOperation = 'destination-out'; x.fillRect(-h * .24, -h * .24, h * .48, h * .48); x.restore(); x.save(); x.translate((ox + R + w / 2) / 2, 0); x.globalCompositeOperation = 'source-over'; stampIcon(x, ic, h * .38); x.restore(); }
    } else if (st === 'ticket') {
      const lw = m * .055, r = m * .16, X0 = -w / 2 + lw, Y0 = -h / 2 + lw, X1 = w / 2 - lw, Y1 = h / 2 - lw; x.lineWidth = lw; x.beginPath(); x.moveTo(X0 + r, Y0); x.lineTo(X1 - r, Y0); x.arc(X1, Y0, r, Math.PI, Math.PI / 2, true); x.lineTo(X1, Y1 - r); x.arc(X1, Y1, r, -Math.PI / 2, Math.PI, true); x.lineTo(X0 + r, Y1); x.arc(X0, Y1, r, 0, -Math.PI / 2, true); x.lineTo(X0, Y0 + r); x.arc(X0, Y0, r, Math.PI / 2, 0, true); x.closePath(); x.stroke();
      x.setLineDash([m * .05, m * .05]); x.lineWidth = lw * .45; x.beginPath(); rr(x, X0 + r * .9, Y0 + lw * 1.6, X1 - X0 - r * 1.8, Y1 - Y0 - lw * 3.2, 0); x.stroke(); x.setLineDash([]);
      stack(w * .7, h * .8);
    } else if (st === 'gear') {
      const R = m / 2; x.beginPath(); for (let i = 0; i < 72; i++) { const a = i * Math.PI / 36, r = (i % 2 ? .9 : 1) * R * .98; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath(); x.lineWidth = m * .03; x.stroke(); ring(R * .84, m * .025); ring(R * .56, m * .02); arcs(R * .7, R * .15);
      if (ic) { stampIcon(x, ic, R * .5); } else txt(CT, 0, 0, R * .2, R * .9, 800);
    } else if (st === 'banner') {
      const bh = h * .36, bw = w * .9, notch = bh * .45; x.lineWidth = m * .05; x.beginPath(); x.moveTo(-bw / 2, -bh / 2); x.lineTo(bw / 2, -bh / 2); x.lineTo(bw / 2 - notch, 0); x.lineTo(bw / 2, bh / 2); x.lineTo(-bw / 2, bh / 2); x.lineTo(-bw / 2 + notch, 0); x.closePath(); x.stroke();
      txt(CT, 0, 0, bh * .58, bw - notch * 2.2, 800); if (ic) { x.save(); x.translate(0, -h * .34); stampIcon(x, ic, h * .26); x.restore(); txt(T1, 0, h * .35, h * .12, w * .82); } else { txt(T1, 0, -h * .34, h * .14, w * .82); txt(T2, 0, h * .35, h * .12, w * .82); }
    } else {
      const R = m / 2, lw = R * .07; ring(R - lw / 2, lw); ring(R * .64, lw * .55); arcs(R * .8, R * .19);
      for (const s of [-1, 1]) { x.save(); x.translate(s * R * .8, 0); x.beginPath(); starPoly(x, 5, R * .07, R * .03); x.fill(); x.restore(); }
      if (ic) { x.save(); x.translate(0, -R * .14); stampIcon(x, ic, R * .5); x.restore(); txt(CT, 0, R * .32, R * .17, R * 1.05); }
      else { x.lineWidth = lw * .45; x.beginPath(); x.moveTo(-R * .6, -R * .17); x.lineTo(R * .6, -R * .17); x.moveTo(-R * .6, R * .17); x.lineTo(R * .6, R * .17); x.stroke(); txt(CT, 0, 0, R * .22, R * 1.15); }
    }
    x.setTransform(1, 0, 0, 1, 0, 0);
    const Rg = rng(hashStr(el.id || el.name || 'stamp'));
    if (el.uneven > 0) { const a = Rg() * Math.PI * 2, gx = Math.cos(a) * pw / 2, gy = Math.sin(a) * ph / 2, g = x.createLinearGradient(pw / 2 - gx, ph / 2 - gy, pw / 2 + gx, ph / 2 + gy); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${Math.min(.9, el.uneven * .85)})`); x.globalCompositeOperation = 'destination-out'; x.fillStyle = g; x.fillRect(0, 0, pw, ph); x.globalCompositeOperation = 'source-over'; }
    if (el.distress > 0) {
      x.globalCompositeOperation = 'destination-out';
      const n = Math.round(pw * ph / 90 * el.distress); for (let i = 0; i < n; i++) { x.globalAlpha = Rg() * .9; const r = Rg() * Rg() * Math.max(1, pw / 70); x.beginPath(); x.arc(Rg() * pw, Rg() * ph, r, 0, Math.PI * 2); x.fill(); }
      x.globalAlpha = Math.min(1, el.distress * 1.1); x.fillStyle = pat(x, 'alpha', pw * .45); x.fillRect(0, 0, pw, ph); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    }
    c.drawImage(t, -w / 2, -h / 2, w, h);
    if (el.ghost > 0) { c.save(); c.globalAlpha *= Math.min(.6, el.ghost * .5); c.drawImage(t, -w / 2 + w * .025, -h / 2 + h * .02, w, h); c.restore(); }
  }, 'M8 4h8v5l3 3v3H5v-3l3-3zM5 19h14');

/* hologram patch */
def('holo', 'Hologram', { w: 12, h: 12, shape: 'circle', finish: 'holo', holoPat: 1, holoInt: 1, emblem: 'star', holoPat2: 6, holoInt2: .85, relief: .06 },
  [['shape', 'Shape', 'select', [['circle', 'Circle'], ['oval', 'Oval'], ['rect', 'Rounded rect'], ['hex', 'Hexagon'], ['star', 'Star'], ['shield', 'Shield']]], ['holoPat', 'Field pattern', 'select', HOLOPATS], ['holoInt', 'Field strength', 'range', { min: 0, max: 1, step: .01 }], ['emblem', 'Engraving', 'select', [['star', 'Star'], ['ring', 'Rings'], ['orbit', 'Orbits'], ['wave', 'Waves'], ['sun', 'Sun']]], ['holoPat2', 'Engraving pattern', 'select', HOLOPATS], ['holoInt2', 'Engraving strength', 'range', { min: 0, max: 1, step: .01 }]],
  function (c, el, ov) {
    const w = el.w, h = el.h, R = Math.min(w, h) / 2; shapePath(c, el.shape, w, h);
    if (ov.ch === 'O') {
      const i1 = Math.round(clamp(el.holoInt, 0, 1) * (el.opacity ?? 1) * 255), p1 = Math.round(el.holoPat * 255 / 7); c.fillStyle = `rgb(${i1},${p1},255)`; c.fill();
      c.save(); c.clip(); const i2 = Math.round(clamp(el.holoInt2, 0, 1) * 255), p2 = Math.round(el.holoPat2 * 255 / 7); c.strokeStyle = `rgb(${i2},${p2},255)`; c.lineWidth = R * .08; emblem(c, el.emblem, R * .8); c.restore(); return;
    }
    if (ov.ch === 'A') { const g = c.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2); g.addColorStop(0, '#e6e9ee'); g.addColorStop(.5, '#a7adb8'); g.addColorStop(1, '#d7dbe2'); c.fillStyle = g; c.fill(); c.save(); c.clip(); c.strokeStyle = 'rgba(255,255,255,.6)'; c.lineWidth = R * .05; emblem(c, el.emblem, R * .8); c.restore(); return; }
    c.fillStyle = ov.color; c.fill();
    if (ov.ch === 'H') { c.save(); c.clip(); c.globalAlpha = .6; c.strokeStyle = '#fff'; c.lineWidth = R * .06; emblem(c, el.emblem, R * .8); c.restore(); }
  }, 'M12 3l8 4.5v9L12 21l-8-4.5v-9z');

/* ================= channel renderer ================= */
const chans = {};
function cv(side, tier, key, w, h) {
  const s = chans[side] || (chans[side] = {}), t = s[tier] || (s[tier] = {});
  let c = t[key]; if (!c) { c = t[key] = document.createElement('canvas'); }
  if (c.width !== w || c.height !== h) { c.width = w; c.height = h; c._gen = (c._gen || 0) + 1; }
  return c;
}
function prep(c, fill) { const x = c.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.filter = 'none'; x.clearRect(0, 0, c.width, c.height); if (fill) { x.fillStyle = fill; x.fillRect(0, 0, c.width, c.height); } return x; }
function clipCard(x, k) { x.save(); cardPath(x, k); x.clip('evenodd'); }
function drawEl(c, el, k, ov) {
  const t = T[el.type]; if (!t) return;
  c.save(); c.translate(el.x * k, el.y * k); if (el.rot) c.rotate(el.rot * Math.PI / 180); if (el._mirror) c.scale(-1, 1); c.scale(k, k);
  try { t.draw(c, el, ov || { ch: 'A', color: null }, k); } catch (e) { console.warn('draw failed', el.type, e); }
  c.restore();
}
/* Full-card background artwork (underprints, tint panels) is printed as transparent process ink: it multiplies onto the
   material and only partly hides its metal, gloss and clarity, so changing the material visibly changes the card. */
const TINT_TYPES = new Set(['pattern', 'guilloche', 'rect', 'ellipse', 'shape']);
function tintLayer(el) { return (el.finish || 'ink') === 'ink' && (!el.blend || el.blend === 'source-over') && TINT_TYPES.has(el.type) && el.w * el.h >= P.card.w * P.card.h * .55; }
function coverage(el) { const f = el.finish; if (f === 'ink' || f === 'foil' || f === 'holo') return 1; if (f === 'laser') return sub().clear ? .6 : 1; return 0; }
function roughFor(f) { const S = sub(); switch (f) { case 'ink': return ({ matte: .8, satin: .5, gloss: .2 })[P.card.ink] ?? .5; case 'foil': return .2; case 'holo': return .1; case 'laser': return S.clear ? .55 : S.metal ? .5 : .74; case 'gloss': return .04; case 'window': return .02; default: return null; } }
function metalFor(f) { const S = sub(); if (f === 'foil' || f === 'holo') return 1; if (f === 'window') return 0; if (f === 'ink') return S.metal > 0 ? 0 : null; return null; }

function renderSide(side, tier, opts) {
  const C = P.card, S = sub(), Wm = C.w, Hm = C.h;
  const res = (opts && opts.res) || (tier === 'p' ? Math.min(1024, C.res) : C.res);
  const pw = Math.round(res), ph = Math.max(2, Math.round(res * Hm / Wm)), k = pw / Wm;
  const hw = Math.max(512, Math.round(res / 2)), hh = Math.max(2, Math.round(hw * Hm / Wm)), kh = hw / Wm;
  const els = P[side].filter(e => e.visible !== false), other = side === 'front' ? 'back' : 'front';
  const wins = els.filter(e => e.finish === 'window').concat(P[other].filter(e => e.visible !== false && e.finish === 'window').map(e => ({ ...e, x: Wm - e.x, rot: -(e.rot || 0), _mirror: true })));
  const clear = S.clear > 0, fl = fluorOf(), lamOn = C.holoLam !== 'none' && (side === 'front' || C.holoLamBack);
  const elGlow = els.some(e => e.glow > 0), need = { T: clear || wins.length > 0, X: elGlow || !!S.glow || !!fl || C.uvFibers > 0 || els.some(e => e.finish === 'uv'), O: lamOn || !!S.holoBase || els.some(e => e.finish === 'holo'), M: S.metal > 0 || els.some(e => e.finish === 'foil' || e.finish === 'holo' || e.finish === 'window') };
  const out = { side, tier, pw, ph, need };

  /* albedo */
  const A = cv(side, tier, 'A', pw, ph), a = prep(A); clipCard(a, k);
  a.fillStyle = clear ? '#ffffff' : baseColor(); a.fillRect(0, 0, pw, ph); subTex(a, 'A', k);
  let tgt = a, E = null;
  if (clear) { E = cv(side, tier, 'E', pw, ph); tgt = prep(E); clipCard(tgt, k); }
  const owin = wins.filter(w => w._mirror);
  if (!clear) for (const w of owin) drawEl(a, w, k, { ch: 'A', color: '#ffffff' });
  for (const el of els) {
    const f = el.finish; if (f === 'window') { if (!clear) drawEl(tgt, el, k, { ch: 'A', color: '#ffffff' }); continue; }
    if (f === 'uv' || f === 'blind' || f === 'gloss') continue;
    tgt.save(); tgt.globalAlpha = (el.opacity ?? 1) * (clear && tintLayer(el) ? .45 : 1); tgt.globalCompositeOperation = !clear && tintLayer(el) ? 'multiply' : el.blend || 'source-over';
    const ov = f === 'foil' ? { ch: 'A', color: el.foil, foil: true } : f === 'holo' ? { ch: 'A', color: '#c6cad2', holo: true } : f === 'laser' ? { ch: 'A', color: S.laser || '#2a2a2a', laser: true } : { ch: 'A', color: null };
    drawEl(tgt, el, k, ov); tgt.restore();
  }
  if (clear) { tgt.restore(); a.drawImage(E, 0, 0); out.E = E; }
  age(a, 'A', k, side);
  a.restore(); out.A = A;
  if (opts && opts.albedoOnly) return out;

  /* height */
  const Hc = cv(side, tier, 'H', hw, hh), h = prep(Hc, '#808080'); clipCard(h, kh); subTex(h, 'H', kh);
  for (const el of els) {
    const r = el.relief || 0; if (!r) continue;
    h.save(); h.globalAlpha = Math.min(1, Math.abs(r)) * (el.opacity ?? 1); if (BLUR_OK) h.filter = `blur(${Math.max(.6, .07 * kh).toFixed(2)}px)`;
    drawEl(h, el, kh, { ch: 'H', color: r > 0 ? '#ffffff' : '#000000', rel: r }); h.restore();
  }
  age(h, 'H', kh, side); h.restore(); out.H = Hc;

  /* roughness */
  const Rc = cv(side, tier, 'R', hw, hh), r = prep(Rc, gray(S.rough)); clipCard(r, kh); subTex(r, 'R', kh);
  for (const w of owin) drawEl(r, w, kh, { ch: 'R', color: gray(.02) });
  for (const el of els) { const v = roughFor(el.finish); if (v == null) continue; r.save(); r.globalAlpha = el.finish === 'window' ? 1 : (el.opacity ?? 1) * (tintLayer(el) ? .3 : 1); drawEl(r, el, kh, { ch: 'R', color: gray(v) }); r.restore(); }
  r.restore(); out.R = Rc;

  /* metalness */
  if (need.M) {
    const Mc = cv(side, tier, 'M', hw, hh), m = prep(Mc, gray(S.metal)); clipCard(m, kh);
    for (const w of owin) drawEl(m, w, kh, { ch: 'M', color: '#000' });
    for (const el of els) { const v = metalFor(el.finish); if (v == null) continue; m.save(); m.globalAlpha = el.finish === 'window' ? 1 : (el.opacity ?? 1) * (tintLayer(el) ? .3 : 1); drawEl(m, el, kh, { ch: 'M', color: gray(v) }); m.restore(); }
    m.restore(); out.M = Mc;
  }
  /* transmission */
  if (need.T) {
    const Tc = cv(side, tier, 'T', hw, hh), t = prep(Tc, '#000'); clipCard(t, kh); t.fillStyle = gray(S.clear); t.fillRect(0, 0, hw, hh);
    for (const w of owin) drawEl(t, w, kh, { ch: 'T', color: '#fff' });
    for (const el of els) { if (el.finish === 'window') { drawEl(t, el, kh, { ch: 'T', color: '#fff' }); continue; } const cvg = coverage(el); if (!cvg) continue; t.save(); t.globalAlpha = cvg * (el.opacity ?? 1) * (tintLayer(el) ? .4 : 1); drawEl(t, el, kh, { ch: 'T', color: '#000' }); t.restore(); }
    t.restore(); out.T = Tc;
  }
  /* UV emission */
  if (need.X) {
    const Xc = cv(side, tier, 'X', hw, hh), x = prep(Xc, '#000'); clipCard(x, kh);
    if (fl && !elGlow) { x.globalAlpha = .5; x.fillStyle = fl; x.fillRect(0, 0, hw, hh); x.globalAlpha = 1; for (const el of els) { const cvg = coverage(el); if (!cvg) continue; x.save(); x.globalAlpha = cvg * (el.opacity ?? 1); drawEl(x, el, kh, { ch: 'X', color: '#000' }); x.restore(); } for (const w of wins) drawEl(x, w, kh, { ch: 'X', color: '#000' }); }
    for (const el of els) { if (el.finish !== 'uv') continue; x.save(); x.globalAlpha = el.opacity ?? 1; drawEl(x, el, kh, { ch: 'X', color: el.uvColor, uv: true }); x.restore(); }
    for (const el of els) { if (!(el.glow > 0)) continue; x.save(); x.globalAlpha = el.opacity ?? 1; drawEl(x, el, kh, { ch: 'X', color: el.glowColor || '#6ab0ff', uv: true }); x.restore(); }
    if (S.glow) { x.save(); x.globalAlpha = .1; x.fillStyle = S.glow; x.fillRect(0, 0, hw, hh); x.restore(); for (const el of els) { if (el.finish !== 'laser') continue; x.save(); x.globalAlpha = el.opacity ?? 1; drawEl(x, el, kh, { ch: 'X', color: S.glow, uv: true }); x.restore(); } }
    if (C.uvFibers > 0) { const R = rng(C.seed * 4111 + (side === 'back' ? 9 : 2)), cols = ['#ff3b6b', '#38d6ff', '#ffe14d', '#7dff6a', '#ff7af0']; x.lineCap = 'round'; for (let i = 0; i < C.uvFibers; i++) { const px = R() * C.w, py = R() * C.h, an = R() * Math.PI * 2, L = .9 + R() * 2.6, b = (R() - .5) * 2; x.strokeStyle = cols[R() * cols.length | 0]; x.lineWidth = (.06 + R() * .05) * kh; const dx = Math.cos(an) * L / 2, dy = Math.sin(an) * L / 2; x.beginPath(); x.moveTo((px - dx) * kh, (py - dy) * kh); x.quadraticCurveTo((px + b * dy) * kh, (py - b * dx) * kh, (px + dx) * kh, (py + dy) * kh); x.stroke(); } }
    x.restore(); out.X = Xc;
  }
  /* holo mask */
  if (need.O) {
    const Oc = cv(side, tier, 'O', hw, hh), o = prep(Oc, '#000'); clipCard(o, kh); o.fillStyle = S.holoBase ? 'rgb(150,0,255)' : 'rgb(0,0,255)'; o.fillRect(0, 0, hw, hh);
    for (const el of els) { if (S.holoBase && el.finish !== 'holo' && coverage(el)) { o.save(); o.globalAlpha = (el.opacity ?? 1) * .9 * (tintLayer(el) ? .4 : 1); drawEl(o, el, kh, { ch: 'O', color: 'rgb(0,0,255)' }); o.restore(); continue; } if (el.finish !== 'holo') continue; const i = Math.round(clamp(el.holoInt ?? 1, 0, 1) * (el.opacity ?? 1) * 255), p = Math.round((el.holoPat | 0) * 255 / 7); drawEl(o, el, kh, { ch: 'O', color: `rgb(${i},${p},255)` }); }
    o.restore(); out.O = Oc;
  }
  return out;
}
Forge.renderSide = renderSide;

/* ---------- substrate textures ---------- */
function subTex(c, ch, k) {
  const C = P.card, S = sub(), W = C.w * k, Hh = C.h * k, R = rng(C.seed * 13 + (ch === 'A' ? 1 : ch === 'H' ? 2 : 3));
  if (S.tex === 'paper') {
    if (ch === 'A') { c.save(); c.globalAlpha = .1; c.globalCompositeOperation = 'multiply'; c.fillStyle = pat(c, 'mottle', 22 * k); c.fillRect(0, 0, W, Hh); c.restore(); fibers(c, k, baseColor(), R, 'A'); }
    else if (ch === 'H') { c.save(); c.globalAlpha = .6; c.fillStyle = pat(c, 'grain', 5 * k); c.fillRect(0, 0, W, Hh); c.globalAlpha = .35; c.fillStyle = pat(c, 'mottle', 9 * k); c.fillRect(0, 0, W, Hh); c.restore(); fibers(c, k, '#808080', R, 'H'); }
  } else if (S.tex === 'brushed') {
    if (ch === 'A' || ch === 'R') { const n = Math.round(C.h / .035); c.save(); for (let i = 0; i < n; i++) { const y = (i * .035 + R() * .03) * k, v = R(); c.fillStyle = v < .5 ? `rgba(0,0,0,${.04 + R() * .07})` : `rgba(255,255,255,${.04 + R() * .08})`; const x0 = R() * W * .3; c.fillRect(-x0, y, W * (.7 + R() * .6) + x0, Math.max(1, .022 * k)); } c.restore(); }
  } else if (S.tex === 'carbon') {
    if (ch === 'A' || ch === 'H') { const t = carbonTile(2.1 * k, ch); c.save(); c.fillStyle = c.createPattern(t, 'repeat'); c.fillRect(0, 0, W, Hh); c.restore(); }
  } else if (S.tex === 'wood') {
    if (ch === 'A' || ch === 'H') { const n = Math.round(C.h * 2.4); c.save(); for (let i = 0; i < n; i++) { const y0 = R() * C.h, amp = .6 + R() * 1.8, f = .02 + R() * .04, ph = R() * 10; c.beginPath(); for (let x = -2; x <= C.w + 2; x += 1.2) { const y = y0 + Math.sin(x * f + ph) * amp + (fbm(x * .03, y0 * .2) - .5) * 4; x === -2 ? c.moveTo(x * k, y * k) : c.lineTo(x * k, y * k); } c.strokeStyle = ch === 'A' ? hexA(shade(baseColor(), R() < .7 ? -.15 - R() * .25 : .12), .18 + R() * .25) : `rgba(0,0,0,${.15 + R() * .25})`; c.lineWidth = (.08 + R() * .5) * k; c.stroke(); } c.restore(); }
  } else if (S.tex === 'marble') {
    if (ch === 'A' || ch === 'H' || ch === 'R') { c.save(); if (ch === 'A') { c.globalAlpha = .18; c.globalCompositeOperation = 'multiply'; c.fillStyle = pat(c, 'mottle', 40 * k); c.fillRect(0, 0, W, Hh); c.globalAlpha = 1; } const n = 9; for (let i = 0; i < n; i++) { let x = R() * C.w, y = R() * C.h, a = R() * Math.PI * 2; const L = 40 + R() * 70, wd = (.08 + R() * .5) * k; c.beginPath(); c.moveTo(x * k, y * k); for (let s = 0; s < L; s += 1.5) { a += (fbm(x * .08 + i, y * .08) - .5) * .9; x += Math.cos(a) * 1.5; y += Math.sin(a) * 1.5; c.lineTo(x * k, y * k); } if (BLUR_OK) c.filter = `blur(${(.25 * k).toFixed(1)}px)`; c.strokeStyle = ch === 'A' ? `rgba(${R() < .6 ? '120,118,115' : '176,150,110'},${.25 + R() * .4})` : ch === 'H' ? 'rgba(0,0,0,.25)' : 'rgba(255,255,255,.12)'; c.lineWidth = wd; c.stroke(); c.filter = 'none'; } c.restore(); }
  } else if (S.tex === 'frost') {
    if (ch === 'H') { c.save(); c.globalAlpha = .45; c.fillStyle = pat(c, 'grain', 2.5 * k); c.fillRect(0, 0, W, Hh); c.restore(); }
  }
}
function fibers(c, k, base, R, ch) {
  const C = P.card, n = Math.round(C.w * C.h * .32); c.save(); c.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const x = R() * C.w, y = R() * C.h, an = R() * Math.PI * 2, L = .4 + R() * R() * 2.6, bend = (R() - .5) * 1.2, dark = R() < .6;
    c.strokeStyle = ch === 'H' ? (dark ? 'rgba(140,140,140,.5)' : 'rgba(175,175,175,.45)') : (dark ? hexA(shade(base, -.18), .22) : hexA(shade(base, .35), .3));
    c.lineWidth = (.025 + R() * .05) * k; const dx = Math.cos(an) * L / 2, dy = Math.sin(an) * L / 2;
    c.beginPath(); c.moveTo((x - dx) * k, (y - dy) * k); c.quadraticCurveTo((x + bend * dy) * k, (y - bend * dx) * k, (x + dx) * k, (y + dy) * k); c.stroke();
  }
  if (ch === 'A') { const m = Math.round(n * .25); for (let i = 0; i < m; i++) { c.fillStyle = hexA(shade(base, -.3 - R() * .3), .25 + R() * .3); c.beginPath(); c.arc(R() * C.w * k, R() * C.h * k, (.03 + R() * .08) * k, 0, Math.PI * 2); c.fill(); } }
  c.restore();
}
function carbonTile(cellPx, ch) {
  const t = document.createElement('canvas'), n = 4; t.width = t.height = Math.max(8, Math.round(cellPx * n)); const x = t.getContext('2d'), s = t.width / n;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const horiz = ((i - j + 8) % 4) < 2; const g = horiz ? x.createLinearGradient(i * s, j * s, i * s, (j + 1) * s) : x.createLinearGradient(i * s, j * s, (i + 1) * s, j * s);
    if (ch === 'A') { g.addColorStop(0, '#111215'); g.addColorStop(.5, horiz ? '#3b3e44' : '#2a2c31'); g.addColorStop(1, '#111215'); } else { g.addColorStop(0, '#5a5a5a'); g.addColorStop(.5, '#a8a8a8'); g.addColorStop(1, '#5a5a5a'); }
    x.fillStyle = g; x.fillRect(i * s, j * s, s + .5, s + .5);
  }
  return t;
}

/* ---------- wear & age ---------- */
function creaseList() { const C = P.card, R = rng(C.seed * 977 + 3), out = [], n = Math.round((C.creases || 0) * 12); for (let i = 0; i < n; i++) out.push({ x: R() * C.w, y: R() * C.h, a: R() * Math.PI, L: 8 + R() * 40, b: (R() - .5) * .3, s: .4 + R() * .6 }); return out; }
function strokeCrease(c, cr, k, mir) {
  const C = P.card, a = mir ? Math.PI - cr.a : cr.a, x = mir ? C.w - cr.x : cr.x, dx = Math.cos(a) * cr.L / 2, dy = Math.sin(a) * cr.L / 2;
  c.beginPath(); c.moveTo((x - dx) * k, (cr.y - dy) * k); c.quadraticCurveTo((x + cr.b * cr.L * Math.sin(a)) * k, (cr.y - cr.b * cr.L * Math.cos(a)) * k, (x + dx) * k, (cr.y + dy) * k); c.stroke();
}
function foldLines(c, k, styles) { const C = P.card, segs = []; if (C.foldV > 0) segs.push([C.w / 2, 0, C.w / 2, C.h, C.foldV]); if (C.foldH > 0) segs.push([0, C.h / 2, C.w, C.h / 2, C.foldH]); for (const [x0, y0, x1, y1, s] of segs) for (const st of styles) { c.save(); st(c); c.globalAlpha *= s; c.beginPath(); c.moveTo(x0 * k, y0 * k); c.lineTo(x1 * k, y1 * k); c.stroke(); c.restore(); } }
function age(c, ch, k, side) {
  const C = P.card; if (!(C.age > 0 || C.creases > 0 || C.foldV > 0 || C.foldH > 0 || C.stains > 0 || C.wear > 0 || C.fade > 0 || C.crumple > 0)) return;
  const W = C.w * k, Hh = C.h * k, mir = side === 'back', R = rng(C.seed * 31 + (mir ? 7 : 1)), cl = creaseList();
  c.save();
  if (ch === 'A') {
    if (C.fade > 0) { c.globalCompositeOperation = 'screen'; c.fillStyle = hexA(baseColor(), C.fade * .5); c.fillRect(0, 0, W, Hh); }
    if (C.age > 0) { c.globalCompositeOperation = 'multiply'; c.fillStyle = `rgba(232,208,150,${.5 * C.age})`; c.fillRect(0, 0, W, Hh); c.globalAlpha = .45 * C.age; c.fillStyle = pat(c, 'mottle', 30 * k); c.fillRect(0, 0, W, Hh); c.globalAlpha = 1; }
    if (C.stains > 0) {
      c.globalCompositeOperation = 'multiply'; const n = 1 + Math.round(C.stains * 4), s = C.stains;
      for (let i = 0; i < n; i++) {
        const x = R() * W, y = R() * Hh, rad = (5 + R() * 13) * k; let g;
        if (R() < .55) { g = c.createRadialGradient(x, y, rad * .55, x, y, rad); g.addColorStop(0, 'rgba(170,120,60,0)'); g.addColorStop(.8, `rgba(160,110,55,${.12 * s})`); g.addColorStop(.95, `rgba(120,75,35,${.42 * s})`); g.addColorStop(1, 'rgba(120,75,35,0)'); }
        else { g = c.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, `rgba(150,105,60,${.28 * s})`); g.addColorStop(.7, `rgba(160,115,65,${.14 * s})`); g.addColorStop(1, 'rgba(160,115,65,0)'); }
        c.fillStyle = g; c.beginPath(); c.arc(x, y, rad, 0, Math.PI * 2); c.fill();
      }
    }
    if (C.wear > 0) {
      c.globalCompositeOperation = 'multiply'; c.lineWidth = 4 * k * C.wear; if (BLUR_OK) c.filter = `blur(${(2.5 * k).toFixed(1)}px)`; c.strokeStyle = `rgba(110,85,55,${.55 * C.wear})`; cardPath(c, k); c.stroke(); c.filter = 'none';
      c.globalCompositeOperation = 'source-over'; c.fillStyle = hexA(baseColor(), .92); const n = Math.round(260 * C.wear);
      for (let i = 0; i < n; i++) { const e = R() * 4 | 0, t = R(), d = Math.pow(R(), 3) * 2.2; let x, y; if (e === 0) { x = t * C.w; y = d; } else if (e === 1) { x = t * C.w; y = C.h - d; } else if (e === 2) { x = d; y = t * C.h; } else { x = C.w - d; y = t * C.h; } c.globalAlpha = .15 + R() * .5; c.beginPath(); c.arc(x * k, y * k, (.04 + R() * .2) * k, 0, Math.PI * 2); c.fill(); }
      c.globalAlpha = 1;
    }
    c.globalCompositeOperation = 'multiply'; c.lineWidth = .18 * k; for (const cr of cl) { c.strokeStyle = `rgba(90,75,60,${.24 * cr.s})`; strokeCrease(c, cr, k, mir); }
    c.globalCompositeOperation = 'screen'; c.lineWidth = .12 * k; for (const cr of cl) { c.strokeStyle = `rgba(255,255,255,${.28 * cr.s})`; c.save(); c.translate(.15 * k, .15 * k); strokeCrease(c, cr, k, mir); c.restore(); }
    foldLines(c, k, [x => { x.globalCompositeOperation = 'multiply'; if (BLUR_OK) x.filter = `blur(${(1.2 * k).toFixed(1)}px)`; x.strokeStyle = 'rgba(120,100,80,.38)'; x.lineWidth = 1.6 * k; }, x => { x.globalCompositeOperation = 'multiply'; x.filter = 'none'; x.strokeStyle = 'rgba(80,65,50,.55)'; x.lineWidth = .14 * k; }]);
  } else if (ch === 'H') {
    const cm = Math.max(C.crumple, C.age * .5); if (cm > 0) { c.globalAlpha = .5 * cm; c.fillStyle = pat(c, 'mottle', 12 * k); c.fillRect(0, 0, W, Hh); c.globalAlpha = 1; }
    if (BLUR_OK) c.filter = `blur(${(.5 * k).toFixed(1)}px)`; for (const cr of cl) { c.lineWidth = .35 * k; c.strokeStyle = `rgba(0,0,0,${.55 * cr.s})`; strokeCrease(c, cr, k, mir); } c.filter = 'none';
    foldLines(c, k, [x => { if (BLUR_OK) x.filter = `blur(${(.8 * k).toFixed(1)}px)`; x.strokeStyle = 'rgba(255,255,255,.45)'; x.lineWidth = 1.4 * k; }, x => { x.filter = 'none'; x.strokeStyle = 'rgba(0,0,0,.85)'; x.lineWidth = .35 * k; }]);
  }
  c.restore();
}

/* ---------- backdrop textures for the 3D studio ---------- */
Forge.backdrop = function (kind) {
  const N = 1024, mk = () => { const c = document.createElement('canvas'); c.width = c.height = N; return c; }, R = rng(hashStr(kind));
  const o = { map: null, bump: null, rough: .8, metal: 0, tile: 400, bumpScale: 1, sheen: 0, sheenColor: '#000000', aniso: 0 };
  const fillPat = (x, kind2, size, alpha, op) => { x.save(); x.globalAlpha = alpha; if (op) x.globalCompositeOperation = op; x.fillStyle = pat(x, kind2, size); x.fillRect(0, 0, N, N); x.restore(); };
  const base = (col) => { const c = mk(), x = c.getContext('2d'); x.fillStyle = col; x.fillRect(0, 0, N, N); return [c, x]; };
  const bumpBase = () => base('#808080');
  switch (kind) {
    case 'walnut': {
      const [m, x] = base('#4b3020'), [b, y] = bumpBase(); o.tile = 560; o.rough = .5;
      for (let i = 0; i < 420; i++) { const y0 = R() * N, amp = 3 + R() * 14, f = 1 + (R() * 3 | 0), ph = R() * 6.28, lw = .6 + R() * 3.5, dk = R() < .7; const col = dk ? `rgba(30,16,8,${.12 + R() * .3})` : `rgba(140,95,60,${.08 + R() * .18})`; for (const off of [-N, 0, N]) { x.beginPath(); y.beginPath(); for (let xx = 0; xx <= N; xx += 8) { const yy = y0 + off + Math.sin(xx / N * 6.2832 * f + ph) * amp + Math.sin(xx / N * 6.2832 * (f + 3) + ph * 2) * amp * .3; xx ? (x.lineTo(xx, yy), y.lineTo(xx, yy)) : (x.moveTo(xx, yy), y.moveTo(xx, yy)); } x.strokeStyle = col; x.lineWidth = lw; x.stroke(); y.strokeStyle = dk ? 'rgba(0,0,0,.35)' : 'rgba(255,255,255,.2)'; y.lineWidth = lw; y.stroke(); } }
      x.fillStyle = 'rgba(15,8,4,.6)'; y.fillStyle = 'rgba(0,0,0,.9)'; for (const yy of [0, N / 4, N / 2, 3 * N / 4]) { x.fillRect(0, yy, N, 2); y.fillRect(0, yy, N, 3); }
      fillPat(x, 'mottle', 256, .25, 'multiply'); o.map = m; o.bump = b; o.bumpScale = 1.4; break;
    }
    case 'concrete': { const [m, x] = base('#7a7872'), [b, y] = bumpBase(); fillPat(x, 'mottle', 512, .55, 'multiply'); fillPat(x, 'grain', 64, .35, 'overlay'); for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(40,38,35,${.2 + R() * .4})`; const px = R() * N, py = R() * N, r = R() * R() * 3.5; x.beginPath(); x.arc(px, py, r, 0, 7); x.fill(); y.fillStyle = 'rgba(0,0,0,.8)'; y.beginPath(); y.arc(px, py, r, 0, 7); y.fill(); } fillPat(y, 'grain', 64, .7); o.map = m; o.bump = b; o.rough = .92; o.tile = 650; o.bumpScale = 2; break; }
    case 'slate': { const [m, x] = base('#2b2e33'), [b, y] = bumpBase(); fillPat(x, 'mottle', 1024, .35, 'overlay'); fillPat(x, 'grain', 96, .25, 'overlay'); fillPat(y, 'mottle', 256, .6); fillPat(y, 'grain', 96, .4); o.map = m; o.bump = b; o.rough = .7; o.tile = 520; o.bumpScale = 1.2; break; }
    case 'velvet': { const [m, x] = base('#2a1520'), [b, y] = bumpBase(); fillPat(x, 'mottle', 512, .35, 'overlay'); fillPat(y, 'grain', 32, .5); o.map = m; o.bump = b; o.rough = .9; o.sheen = 1; o.sheenColor = '#c08aa6'; o.tile = 300; o.bumpScale = .5; break; }
    case 'leather': { const [m, x] = base('#5c3a27'), [b, y] = bumpBase(); for (let i = 0; i < 2600; i++) { const px = R() * N, py = R() * N, r = 4 + R() * 9; for (const [ox, oy] of [[0, 0], [N, 0], [-N, 0], [0, N], [0, -N]]) { const g = y.createRadialGradient(px + ox, py + oy, 0, px + ox, py + oy, r); g.addColorStop(0, 'rgba(255,255,255,.22)'); g.addColorStop(1, 'rgba(0,0,0,0)'); y.fillStyle = g; y.fillRect(px + ox - r, py + oy - r, r * 2, r * 2); } } fillPat(x, 'mottle', 512, .45, 'multiply'); x.globalCompositeOperation = 'multiply'; x.globalAlpha = .5; x.drawImage(b, 0, 0); o.map = m; o.bump = b; o.rough = .58; o.tile = 260; o.bumpScale = 2; break; }
    case 'mat': { const [m, x] = base('#1f4237'), [b, y] = bumpBase(); fillPat(x, 'mottle', 512, .2, 'overlay'); const step = N / 30; for (let i = 0; i <= 30; i++) { const big = i % 5 === 0; x.fillStyle = big ? 'rgba(220,240,230,.55)' : 'rgba(220,240,230,.25)'; const lw = big ? 3 : 1.5; x.fillRect(i * step - lw / 2, 0, lw, N); x.fillRect(0, i * step - lw / 2, N, lw); } o.map = m; o.bump = b; o.rough = .85; o.tile = 300; break; }
    case 'steel': { const [m, x] = base('#9da2a8'), [b, y] = bumpBase(); for (let i = 0; i < 3000; i++) { const yy = R() * N; x.fillStyle = R() < .5 ? `rgba(0,0,0,${R() * .12})` : `rgba(255,255,255,${R() * .14})`; x.fillRect(0, yy, N, 1 + R()); y.fillStyle = x.fillStyle; y.fillRect(0, yy, N, 1); } o.map = m; o.bump = b; o.rough = .32; o.metal = 1; o.tile = 380; o.aniso = .8; o.bumpScale = .4; break; }
    case 'linen': { const [m, x] = base('#d8d2c3'), [b, y] = bumpBase(); for (let i = 0; i < N; i += 4) { const a = .05 + R() * .08; x.fillStyle = `rgba(90,80,60,${a})`; x.fillRect(0, i, N, 2); x.fillRect(i, 0, 2, N); y.fillStyle = 'rgba(255,255,255,.3)'; y.fillRect(0, i, N, 2); y.fillRect(i, 0, 2, N); } fillPat(x, 'mottle', 512, .2, 'multiply'); o.map = m; o.bump = b; o.rough = .9; o.tile = 140; o.bumpScale = 1.2; break; }
    case 'marble': { const [m, x] = base('#ebe8e3'), [b, y] = bumpBase(); fillPat(x, 'mottle', 1024, .25, 'multiply'); for (let i = 0; i < 26; i++) { let px = R() * N, py = R() * N, a = R() * 6.28; x.beginPath(); x.moveTo(px, py); for (let s = 0; s < 260; s++) { a += (pnoise(px * .01 + i, py * .01) - .5) * .6; px += Math.cos(a) * 4; py += Math.sin(a) * 4; x.lineTo(px, py); } x.strokeStyle = `rgba(${R() < .5 ? '110,108,104' : '160,140,105'},${.15 + R() * .35})`; x.lineWidth = .6 + R() * 3; x.stroke(); } o.map = m; o.bump = b; o.rough = .22; o.tile = 900; break; }
    case 'cork': { const [m, x] = base('#b58a5a'), [b, y] = bumpBase(); for (let i = 0; i < 9000; i++) { const px = R() * N, py = R() * N, r = .6 + R() * 2.6, v = R(); x.fillStyle = v < .5 ? `rgba(90,55,25,${.2 + R() * .4})` : `rgba(220,180,130,${.15 + R() * .3})`; x.beginPath(); x.arc(px, py, r, 0, 7); x.fill(); y.fillStyle = v < .5 ? 'rgba(0,0,0,.4)' : 'rgba(255,255,255,.3)'; y.beginPath(); y.arc(px, py, r, 0, 7); y.fill(); } o.map = m; o.bump = b; o.rough = .95; o.tile = 260; o.bumpScale = 2.5; break; }
    case 'felt': { const [m, x] = base('#1d5a3c'), [b, y] = bumpBase(); fillPat(x, 'mottle', 512, .25, 'overlay'); fillPat(x, 'grain', 48, .3, 'overlay'); fillPat(y, 'grain', 48, .8); o.map = m; o.bump = b; o.rough = .98; o.sheen = .8; o.sheenColor = '#6fbf94'; o.tile = 260; o.bumpScale = .8; break; }
    case 'paper': { const [m, x] = base('#f1efea'), [b, y] = bumpBase(); fillPat(x, 'mottle', 1024, .08, 'multiply'); fillPat(y, 'grain', 64, .5); o.map = m; o.bump = b; o.rough = .92; o.tile = 500; o.bumpScale = .6; break; }
    case 'blackglass': { const [m] = base('#060607'); o.map = m; o.rough = .06; o.tile = 400; o.cc = 1; break; }
    default: return null;
  }
  return o;
};

/* ---------- scheduler ---------- */
const last = { front: null, back: null }, stale = { front: false, back: false }, dirty = { front: false, back: false };
let rafQ = false, liveQ = false, hiT = null, view = null;
function invalidate(sides, live) {
  for (const s of sides || ['front', 'back']) dirty[s] = true;
  liveQ = liveQ || !!live; if (!rafQ) { rafQ = true; requestAnimationFrame(flush); }
}
function flush() {
  rafQ = false; const pre = liveQ && P.card.res > 1024; liveQ = false;
  for (const s of ['front', 'back']) {
    if (!dirty[s]) continue; dirty[s] = false;
    const t0 = performance.now(); const r = renderSide(s, pre ? 'p' : 'f'); r.ms = performance.now() - t0; last[s] = r; stale[s] = pre;
    if (view) view.setMaps(r);
  }
  Forge.ui && Forge.ui.drawFlat(); Forge.ui && Forge.ui.hud();
  clearTimeout(hiT); if (stale.front || stale.back) hiT = setTimeout(hiPass, 380);
}
function hiPass() {
  if (rafQ) { hiT = setTimeout(hiPass, 200); return; }
  for (const s of ['front', 'back']) { if (!stale[s]) continue; stale[s] = false; const r = renderSide(s, 'f'); last[s] = r; if (view) view.setMaps(r); }
  Forge.ui && Forge.ui.drawFlat(); Forge.ui && Forge.ui.hud();
}
Forge.invalidate = invalidate; Forge.last = last;
