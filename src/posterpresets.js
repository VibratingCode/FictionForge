/* ================= poster mode: fictional safety signs, propaganda, notices and their parts ================= */
const POSTER_CATS = ['Safety headers', 'Warning pictograms', 'Prohibition pictograms', 'Mandatory pictograms', 'Safe & fire pictograms', 'Chemical & hazmat', 'Hazard stripes', 'Sunbursts & backdrops', 'Headlines & slogans', 'Propaganda motifs', 'Notices & tags'];

/* slogan and warning generator (all invented groups and places) */
const POSTER_WORDS = (() => {
  const pick = a => a[Math.floor(Math.random() * a.length)], cap = s => s[0].toUpperCase() + s.slice(1), three = a => { const b = a.slice().sort(() => Math.random() - .5); return b.slice(0, 3); };
  const G = ['Directorate', 'Assembly', 'Vanguard', 'Collective', 'Council', 'Republic', 'Colony', 'Union', 'Charter', 'Concord', 'Ministry', 'Wardens'], V = ['Unity', 'Order', 'Progress', 'Labour', 'Duty', 'Vigilance', 'Sacrifice', 'Strength', 'Loyalty', 'Harmony', 'Purpose', 'Industry', 'Discipline'];
  const N = ['future', 'harvest', 'frontier', 'homeland', 'homeworld', 'cause', 'colony', 'sector', 'dawn', 'great work', 'reclamation'], A = ['Build', 'Fight', 'Work', 'Watch', 'Serve', 'Toil', 'March', 'Rebuild'], X = ['dissent', 'saboteurs', 'idle hands', 'unlicensed signals', 'hoarders', 'strangers', 'rumours', 'deserters', 'doubt'];
  const H = ['anomalous activity', 'hostile fauna', 'unstable reality', 'live ordnance', 'high voltage', 'toxic spores', 'a nanite swarm', 'radiation', 'psychic interference', 'temporal distortion', 'airborne pathogens', 'automated defences', 'unexploded munitions', 'a cryogenic leak', 'a gravity anomaly'];
  const slogan = () => pick([
    () => `${pick(A)} for the ${pick(N)}`, () => `The ${pick(G)} provides`, () => `${pick(V)} is ${pick(['victory', 'freedom', 'survival', 'tomorrow', 'strength'])}`, () => three(V).join(' · '), () => `Work today, ${pick(['feast', 'rest', 'rise', 'shine'])} tomorrow`,
    () => `Report ${pick(X)}`, () => `Serve the ${pick(G)}`, () => `Your ${pick(N)} needs you`, () => `Stand with the ${pick(G)}`, () => `Every ${pick(['ration', 'bolt', 'round', 'hour', 'voice', 'seed'])} counts`, () => `The ${pick(G)} is watching`, () => `${pick(A)} together, ${pick(['rise', 'win', 'endure', 'prosper'])} together`])();
  const warning = () => pick([
    () => `${cap(pick(H))} beyond this point`, () => `Danger: ${pick(H)}`, () => `${cap(pick(H))} may be present`, () => `Do not ${pick(['feed the specimens', 'touch the artefact', 'look directly at the core', 'open this hatch', 'remove this tag', 'enter without an escort', 'run in the vault'])}`,
    () => 'Authorised personnel only', () => `Keep ${pick(['blast doors', 'containment hatches', 'airlocks', 'cell doors'])} sealed at all times`, () => `${pick(['Hard hats', 'Respirators', 'Hazmat suits', 'Faraday hoods', 'Lead aprons'])} required beyond this point`, () => `Report ${pick(['breaches', 'leaks', 'sightings', 'anomalies', 'missing staff'])} immediately`])();
  return { slogan, warning };
})();

(() => {
  const add = (cat, name, make, o = {}) => COMPONENTS.push({ cat, name, mode: 'poster', make, ...o });
  const U = C => Math.min(C.w, C.h), lab = id => (ICONS[id] || {}).label || id;
  const hdrH = C => Math.min(C.w * .16, C.h * .2);

  /* ---------- safety headers ---------- */
  [['Danger', { kind: 'danger', word: 'DANGER' }], ['Warning', { kind: 'warning', word: 'WARNING' }], ['Caution', { kind: 'caution', word: 'CAUTION' }], ['Notice', { kind: 'notice', word: 'NOTICE' }], ['Safety first', { kind: 'safety', word: 'SAFETY FIRST' }], ['Biohazard', { kind: 'biohazard', word: 'BIOHAZARD' }], ['Radiation', { kind: 'radiation', word: 'CAUTION', word2: 'RADIATION AREA' }],
   ['Danger · classic oval', { kind: 'danger', word: 'DANGER', look: 'osha' }], ['Caution · classic panel', { kind: 'caution', word: 'CAUTION', look: 'osha' }], ['Notice · classic', { kind: 'notice', word: 'NOTICE', look: 'osha' }], ['Danger · bilingual', { kind: 'danger', word: 'DANGER', word2: 'PELIGRO' }], ['Warning · bilingual', { kind: 'warning', word: 'WARNING', word2: 'ADVERTENCIA' }],
   ['Restricted (purple)', { kind: 'custom', word: 'RESTRICTED', bg: '#5a2a8a', fg: '#ffffff', symbol: 'alert' }], ['Containment (black)', { kind: 'custom', word: 'CONTAINMENT', bg: '#111111', fg: '#ffd100', symbol: 'alert' }], ['Quarantine (green)', { kind: 'custom', word: 'QUARANTINE', bg: '#2f6b3a', fg: '#ffffff', symbol: 'bio' }], ['Authorised only (blue)', { kind: 'custom', word: 'AUTHORISED ONLY', bg: '#1f3a6a', fg: '#ffffff', symbol: 'none' }], ['Lethal force (red band)', { kind: 'danger', word: 'LETHAL FORCE AUTHORISED', look: 'band' }]
  ].forEach(([n, o]) => add('Safety headers', n, C => [{ type: 'safety', name: n + ' header', x: C.w / 2, y: hdrH(C) / 2 + C.h * .035, w: C.w * .92, h: hdrH(C), ...o }]));

  /* ---------- pictograms ---------- */
  const PG = (cat, frame, icons) => icons.forEach(id => add(cat, lab(id), C => [{ type: 'picto', name: lab(id), x: C.w / 2, y: C.h / 2, w: U(C) * .42, h: U(C) * .42, frame, icon: id }]));
  PG('Warning pictograms', 'warning', ['hz_excl', 'hz_volt', 'hz_flame', 'hz_explode', 'hz_toxic', 'hz_corrode', 'hz_rad', 'hz_bio', 'hz_laser', 'hz_magnet', 'hz_hot', 'hz_cold', 'hz_slip', 'hz_fall', 'hz_crush', 'hz_overhead', 'hz_forklift', 'hz_anomaly', 'hz_claw', 'hz_eye', 'hz_virus', 'hz_gas', 'hz_oxid', 'drone', 'robot', 'skull']);
  PG('Prohibition pictograms', 'prohibit', ['sg_smoke', 'hz_flame', 'sg_phone', 'sg_camera', 'sg_walk', 'sg_noentry', 'hz_eye', 'hz_claw', 'sg_badge', 'pp_megaphone', 'pp_rifle', 'pp_mic']);
  PG('Mandatory pictograms', 'mandatory', ['sg_hardhat', 'sg_goggles', 'sg_ear', 'sg_glove', 'sg_mask', 'sg_boot', 'sg_lock', 'sg_badge', 'sg_walk', 'hz_excl']);
  PG('Safe & fire pictograms', 'safe', ['sg_aid', 'sg_wash', 'sg_exit', 'sg_walk']);
  PG('Safe & fire pictograms', 'fire', ['sg_extinguisher', 'hz_flame', 'pp_megaphone', 'sg_phone']);

  /* ---------- chemical and hazmat ---------- */
  ['hz_flame', 'hz_oxid', 'hz_explode', 'hz_gas', 'hz_corrode', 'hz_toxic', 'hz_excl', 'hz_virus'].forEach(id => add('Chemical & hazmat', 'Diamond · ' + lab(id), C => [{ type: 'picto', name: 'Chemical diamond · ' + lab(id), x: C.w / 2, y: C.h / 2, w: U(C) * .36, h: U(C) * .36, frame: 'ghs', icon: id }]));
  [['Placard · flammable 3', 'hz_flame', '3', '#c8102e', '#111111'], ['Placard · toxic 6', 'hz_toxic', '6', '#ffffff', '#111111'], ['Placard · infectious 6.2', 'hz_bio', '6.2', '#ffffff', '#111111'], ['Placard · radioactive 7', 'hz_rad', '7', '#ffd100', '#111111'], ['Placard · corrosive 8', 'hz_corrode', '8', '#ffffff', '#111111'], ['Placard · explosive 1', 'hz_explode', '1', '#f47b20', '#111111'], ['Placard · oxidiser 5.1', 'hz_oxid', '5.1', '#ffd100', '#111111'], ['Placard · anomalous 13', 'hz_anomaly', '13', '#5a2a8a', '#ffffff']]
    .forEach(([n, id, num, fill, ink]) => add('Chemical & hazmat', n, C => [{ type: 'picto', name: n, x: C.w / 2, y: C.h / 2, w: U(C) * .4, h: U(C) * .4, frame: 'placard', icon: id, num, auto: false, fill, ink, line: ink }]));
  [['Hazard diamond · solvent', 2, 3, 0, ''], ['Hazard diamond · reactive', 3, 1, 3, 'W'], ['Hazard diamond · oxidiser', 1, 0, 2, 'OX'], ['Hazard diamond · extreme', 4, 4, 4, '☢']]
    .forEach(([n, health, fire, react, special]) => add('Chemical & hazmat', n, C => [{ type: 'nfpa', name: n, x: C.w / 2, y: C.h / 2, w: U(C) * .4, h: U(C) * .4, health, fire, react, special }]));

  /* ---------- hazard stripes ---------- */
  const SB = (n, o) => add('Hazard stripes', n, C => [{ type: 'stripes', name: n, x: C.w / 2, y: C.h * .9, w: C.w * .92, h: U(C) * .07, band: U(C) * .04, ...o(C) }]);
  SB('Yellow and black band', () => ({}));
  SB('Red and white band', () => ({ color: '#c8102e', color2: '#ffffff' }));
  SB('Black and white band', () => ({ color: '#111111', color2: '#ffffff', angle: -45 }));
  SB('Orange and black band', () => ({ color: '#f47b20', color2: '#111111' }));
  SB('Green and white band', () => ({ color: '#00843d', color2: '#ffffff' }));
  SB('Worn yellow band', () => ({ wear: .3 }));
  const BF = (n, o) => add('Hazard stripes', n, C => [{ type: 'stripes', name: n, x: C.w / 2, y: C.h / 2, w: C.w, h: C.h, mode: 'border', bw: U(C) * .055, band: U(C) * .04, locked: true, ...o }]);
  BF('Yellow and black border', {}); BF('Red and white border', { color: '#c8102e', color2: '#ffffff' }); BF('Worn black and yellow border', { wear: .25 }); BF('Black and white border', { color: '#111111', color2: '#ffffff' });

  /* ---------- sunbursts and backdrops ---------- */
  const RB = (n, o, extra = []) => add('Sunbursts & backdrops', n, C => [{ type: 'rays', name: n, x: C.w / 2, y: C.h / 2, w: C.w, h: C.h, locked: true, ...o }, ...extra.map(f => f(C))], { under: true });
  RB('Red and cream rays', { n: 24, color: '#b8231b', color2: '#e9d4a2' });
  RB('Rays from the corner', { n: 20, color: '#b8231b', color2: '#e9d4a2', ox: -.95, oy: .9 });
  RB('Horizon rays', { n: 22, color: '#e9b44c', color2: '#1c2233', oy: 1.1, spread: .4 });
  RB('Swirl', { n: 28, color: '#1f3a6a', color2: '#e8dfc8', twist: 45 });
  RB('Black and red rays', { n: 16, color: '#111111', color2: '#d72a1f' });
  RB('Golden rays, fading', { n: 40, color: '#c9a646', alt: false, spread: .2, fade: .7 });
  RB('Sun disc with rays', { n: 32, color: '#d9541e', color2: '#f2dcae', oy: -.2, disc: .22, discColor: '#f2dcae' });
  add('Sunbursts & backdrops', 'Dark wash', C => [{ type: 'rect', name: 'Dark wash', x: C.w / 2, y: C.h / 2, w: C.w, h: C.h, fill: '#16161a', fill2: '#2a2c33', grad: true, angle: 90, locked: true }], { under: true });
  add('Sunbursts & backdrops', 'Sunset wash', C => [{ type: 'rect', name: 'Sunset wash', x: C.w / 2, y: C.h / 2, w: C.w, h: C.h, fill: '#f0d8a0', fill2: '#d98a3c', grad: true, angle: 90, locked: true }], { under: true });
  add('Sunbursts & backdrops', 'Night sky', C => [{ type: 'rect', name: 'Night sky', x: C.w / 2, y: C.h / 2, w: C.w, h: C.h, fill: '#0f1d3a', fill2: '#2a1a4a', grad: true, angle: 90, locked: true }, { type: 'pattern', name: 'Stars', x: C.w / 2, y: C.h / 2, w: C.w, h: C.h, kind: 'stars', color: '#ffffff', density: 70, locked: true }], { under: true });
  add('Sunbursts & backdrops', 'Halftone shadow', C => [{ type: 'halftone', name: 'Halftone', x: C.w / 2, y: C.h / 2, w: C.w, h: C.h, cell: U(C) * .02, color: '#111111', threshold: .45, locked: true }], { under: true });
  add('Sunbursts & backdrops', 'Constructivist wedge', C => [{ type: 'rect', name: 'Red wedge', x: C.w * .55, y: C.h * .4, w: Math.hypot(C.w, C.h) * 1.1, h: U(C) * .3, fill: '#c8241c', rot: -28, locked: true }], { under: true });

  /* ---------- headlines and slogans ---------- */
  const HL = (n, text, o) => add('Headlines & slogans', n, C => [{ type: 'text', name: n, text, x: C.w / 2, y: C.h * .3, w: C.w * .9, h: U(C) * .2, size: U(C) * .15, align: 'center', color: '#111111', lineH: 1, fit: true, ...o }]);
  HL('Poster headline', 'YOUR SECTOR NEEDS YOU', { font: 'Anton', weight: 400 });
  HL('Stencil headline', 'RISE UP', { font: 'Stardos Stencil', weight: 700 });
  HL('Military stencil', 'RESTRICTED ZONE', { font: 'Saira Stencil One', weight: 400 });
  HL('Slab headline', 'NOTICE', { font: 'Alfa Slab One', weight: 400 });
  HL('Deco headline', 'BUILD THE FUTURE', { font: 'Big Shoulders Display', weight: 900 });
  HL('Frontier headline', 'WANTED', { font: 'Rye', weight: 400, color: '#2a1a10' });
  HL('Fat-face headline', 'VICTORY', { font: 'Abril Fatface', weight: 400 });
  HL('Futurist headline', 'COMPLY', { font: 'Russo One', weight: 400, color: '#ff2d95', glow: 1, glowColor: '#ff2d95' });
  HL('Three virtues', 'WORK · UNITY · PROGRESS', { font: 'Anton', weight: 400 });
  add('Headlines & slogans', 'Typewriter notice', C => [{ type: 'text', name: 'Notice text', text: 'All residents must carry a movement permit.\nPatrols are authorised to detain anyone\nfound outside after curfew.', x: C.w / 2, y: C.h * .62, w: C.w * .8, h: U(C) * .2, size: U(C) * .035, font: 'Special Elite', weight: 400, align: 'left', lineH: 1.4, color: '#1a1a1a', fit: true }]);
  add('Headlines & slogans', 'Slogan ribbon', C => [{ type: 'shape', name: 'Ribbon', kind: 'ribbon', x: C.w / 2, y: C.h * .72, w: C.w * .86, h: U(C) * .13, fill: '#b8231b' }, { type: 'text', name: 'Ribbon text', text: 'FOR THE FRONTIER', x: C.w / 2, y: C.h * .72, w: C.w * .6, h: U(C) * .08, size: U(C) * .065, font: 'Anton', weight: 400, align: 'center', color: '#f2e8cc', fit: true }]);
  add('Headlines & slogans', 'Issuer line', C => [{ type: 'text', name: 'Issuer', text: 'ISSUED BY THE OFFICE OF PUBLIC HARMONY', x: C.w / 2, y: C.h * .95, w: C.w * .8, h: U(C) * .03, size: U(C) * .022, font: 'Oswald', weight: 600, spacing: .12, align: 'center', color: '#333333', fit: true }]);

  /* ---------- propaganda motifs ---------- */
  const MO = (n, icon, o = {}) => add('Propaganda motifs', n, C => [{ type: 'glyph', name: n, icon, x: C.w / 2, y: C.h * .42, w: U(C) * .55, h: U(C) * .55, color: '#141414', ...o }]);
  MO('Raised fist', 'pp_fist'); MO('Worker', 'pp_worker'); MO('Watching eye', 'pp_eye'); MO('Megaphone', 'pp_megaphone'); MO('Pointing hand', 'pp_point'); MO('Dove', 'pp_dove'); MO('Laurel wreath', 'pp_wreath', { paint: 'gold' }); MO('City skyline', 'pp_city'); MO('Radio tower', 'pp_tower'); MO('Aircraft', 'pp_plane');
  MO('Helmet', 'pp_helmet'); MO('Globe', 'pp_globe'); MO('Broken chain', 'pp_chain'); MO('Banner flag', 'pp_flag'); MO('Hammer & wrench', 'pp_hw'); MO('Ration tin', 'pp_can'); MO('Microphone', 'pp_mic'); MO('Thunder strike', 'pp_bolts', { color: '#c8241c' }); MO('Rocket', 'rocket'); MO('Eagle', 'eagle'); MO('Star', 'star', { color: '#c8241c' }); MO('Torch', 'torch');
  add('Propaganda motifs', 'Fist on a disc', C => [{ type: 'ellipse', name: 'Disc', x: C.w / 2, y: C.h * .42, w: U(C) * .62, h: U(C) * .62, fill: '#efe6d2' }, { type: 'glyph', name: 'Raised fist', icon: 'pp_fist', x: C.w / 2, y: C.h * .42, w: U(C) * .46, h: U(C) * .46, color: '#141414' }]);
  add('Propaganda motifs', 'Laurel and star', C => [{ type: 'glyph', name: 'Laurel', icon: 'pp_wreath', x: C.w / 2, y: C.h * .42, w: U(C) * .6, h: U(C) * .6, color: '#c9a646', paint: 'gold' }, { type: 'glyph', name: 'Star', icon: 'star', x: C.w / 2, y: C.h * .41, w: U(C) * .3, h: U(C) * .3, color: '#c8241c' }]);
  add('Propaganda motifs', 'Eye over rays', C => [{ type: 'rays', name: 'Rays', x: C.w / 2, y: C.h * .42, w: U(C) * .8, h: U(C) * .8, n: 30, color: '#c8241c', alt: false, spread: .35, fade: .8, radius: U(C) * .4 }, { type: 'glyph', name: 'Watching eye', icon: 'pp_eye', x: C.w / 2, y: C.h * .42, w: U(C) * .5, h: U(C) * .5, color: '#141414' }]);
  add('Propaganda motifs', 'Approved seal', C => [{ type: 'stamp', name: 'Approved seal', style: 'round', text: 'MINISTRY OF TRUTHFUL NEWS', center: 'APPROVED', text2: 'FOR PUBLIC DISPLAY', x: C.w * .78, y: C.h * .86, w: U(C) * .22, h: U(C) * .22, color: '#b3302a', rot: -12, distress: .45 }]);

  /* ---------- notices and tags ---------- */
  add('Notices & tags', 'Authorised personnel block', C => [{ type: 'rect', name: 'Block', x: C.w / 2, y: C.h * .6, w: C.w * .86, h: U(C) * .2, fill: '#111111', radius: U(C) * .015 }, { type: 'text', name: 'Block text', text: 'AUTHORISED PERSONNEL ONLY', x: C.w / 2, y: C.h * .6, w: C.w * .8, h: U(C) * .1, size: U(C) * .08, font: 'Archivo Black', weight: 400, align: 'center', color: '#ffffff', fit: true }]);
  add('Notices & tags', 'Days-without-incident board', C => [{ type: 'text', name: 'Board top', text: 'THIS FACILITY HAS GONE', x: C.w / 2, y: C.h * .3, w: C.w * .8, h: U(C) * .07, size: U(C) * .055, font: 'Archivo Black', weight: 400, align: 'center', color: '#111111', fit: true }, { type: 'rect', name: 'Counter', x: C.w / 2, y: C.h * .48, w: U(C) * .5, h: U(C) * .32, fill: '#111111', radius: U(C) * .02 }, { type: 'text', name: 'Counter digits', text: '0', x: C.w / 2, y: C.h * .48, w: U(C) * .44, h: U(C) * .28, size: U(C) * .26, font: 'Share Tech Mono', weight: 400, align: 'center', color: '#ff3b2f', fit: true, glow: .8, glowColor: '#ff3b2f' }, { type: 'text', name: 'Board bottom', text: 'DAYS WITHOUT AN INCIDENT', x: C.w / 2, y: C.h * .66, w: C.w * .8, h: U(C) * .07, size: U(C) * .055, font: 'Archivo Black', weight: 400, align: 'center', color: '#111111', fit: true }]);
  add('Notices & tags', 'Inspection lines', C => [{ type: 'text', name: 'Inspection lines', text: 'INSPECTED BY ____________\nDATE ____________________\nNEXT DUE ________________', x: C.w / 2, y: C.h * .78, w: C.w * .8, h: U(C) * .18, size: U(C) * .04, font: 'Courier Prime', weight: 700, align: 'left', lineH: 1.6, color: '#111111', fit: true }]);
  add('Notices & tags', 'Reward box', C => [{ type: 'rect', name: 'Reward frame', x: C.w / 2, y: C.h * .82, w: C.w * .8, h: U(C) * .14, fillOn: false, stroke: '#2a1a10', strokeW: U(C) * .006 }, { type: 'text', name: 'Reward', text: 'REWARD  5,000 CREDITS', x: C.w / 2, y: C.h * .82, w: C.w * .74, h: U(C) * .09, size: U(C) * .075, font: 'Alfa Slab One', weight: 400, align: 'center', color: '#8a1a10', fit: true }]);
  add('Notices & tags', 'Wanted portrait', C => [{ type: 'photo', name: 'Portrait', x: C.w / 2, y: C.h * .45, w: U(C) * .5, h: U(C) * .55, look: 'bw', sepia: .5, ph: 'portrait', phSeed: 13, border: U(C) * .006, borderColor: '#2a1a10', radius: 0 }]);
  add('Notices & tags', 'Official seal', C => [{ type: 'stamp', name: 'Official seal', style: 'round', text: 'CIVIL CONTINGENCY OFFICE', center: 'SEALED', text2: 'SECTOR 7', x: C.w * .76, y: C.h * .85, w: U(C) * .2, h: U(C) * .2, color: '#2d4a8a', rot: -8, distress: .4 }]);
  add('Notices & tags', 'Sign code footer', C => [{ type: 'text', name: 'Sign code', text: 'FF-SAFE-101 · FICTIONAL FACILITY SIGNAGE', x: C.w / 2, y: C.h * .965, w: C.w * .8, h: U(C) * .025, size: U(C) * .02, font: 'IBM Plex Mono', weight: 500, align: 'center', color: '#555555', fit: true }]);
  add('Notices & tags', 'Scan-for-briefing QR', C => [{ type: 'qr', name: 'Briefing QR', x: C.w * .84, y: C.h * .86, w: U(C) * .16, h: U(C) * .16 }, { type: 'text', name: 'QR caption', text: 'SCAN FOR BRIEFING', x: C.w * .84, y: C.h * .86 + U(C) * .1, w: U(C) * .22, h: U(C) * .025, size: U(C) * .02, font: 'IBM Plex Mono', weight: 600, align: 'center', color: '#111111', fit: true }]);

  /* ================= templates ================= */
  const TP = (id, name, fmt, card, scene, front) => TEMPLATES.push({ id, name, mode: 'poster', build: () => { const f = FORMATS[fmt]; return { card: { mode: 'poster', fmt, w: f.w, h: f.h, r: f.r, shape: 'rect', thick: f.thick, slot: f.slot || 'none', lam: 'none', ink: 'matte', res: 4096, ...card }, scene: { env: 'softbox', backdrop: 'concrete', pose: 'stand', ...scene }, front: front(f.w, f.h).map(o => { const { type, ...rest } = o; return E(type, rest); }), back: [] }; } });
  const tx = (text, x, y, w, h, o = {}) => ({ type: 'text', name: o.name || text.split('\n')[0].slice(0, 28), text, x, y, w, h, font: 'Archivo Black', weight: 400, size: h * .78, align: 'center', color: '#111111', fit: true, lineH: 1.04, ...o });
  const sh = (o) => ({ type: 'safety', name: (o.word || 'Header') + ' header', ...o });
  const pic = (frame, icon, x, y, s, o = {}) => ({ type: 'picto', name: lab(icon), frame, icon, x, y, w: s, h: s, ...o });
  const gl = (icon, x, y, s, o = {}) => ({ type: 'glyph', name: lab(icon), icon, x, y, w: s, h: s, color: '#111111', ...o });
  const box = (x, y, w, h, fill, o = {}) => ({ type: 'rect', name: o.name || 'Panel', x, y, w, h, fill, ...o });
  const bg = (W, H, fill, o = {}) => box(W / 2, H / 2, W, H, fill, { name: 'Background', locked: true, ...o });
  const stripe = (x, y, w, h, o = {}) => ({ type: 'stripes', name: 'Hazard stripes', x, y, w, h, band: h * .55, ...o });
  const rays = (W, H, o = {}) => ({ type: 'rays', name: 'Sunburst', x: W / 2, y: H / 2, w: W, h: H, locked: true, ...o });
  const mono = (text, x, y, w, o = {}) => tx(text, x, y, w, 7, { font: 'IBM Plex Mono', weight: 500, size: 5, color: '#555555', ...o });

  /* ----- workplace safety signs ----- */
  TP('ps_volt', 'High Voltage · danger sign', 'sg_1410', { sub: 'alu_white', wear: .08 }, { env: 'lab' }, (W, H) => [
    sh({ x: W / 2, y: 36, w: W - 26, h: 50, kind: 'danger', word: 'DANGER' }), pic('warning', 'hz_volt', 84, 150, 112),
    tx('HIGH\nVOLTAGE', 246, 130, 196, 86, { size: 40, lineH: 1 }), tx('KEEP OUT · AUTHORISED PERSONNEL ONLY', 246, 194, 196, 12, { font: 'Inter', weight: 800, size: 9 }),
    mono('HALDEN GRID AUTHORITY · SUBSTATION 4 · FF-ELEC-404', W / 2, 236, 300)]);
  TP('ps_anomaly', 'Anomalous Zone · warning sign', 'sg_1014', { sub: 'reflective' }, { env: 'lab' }, (W, H) => [
    sh({ x: W / 2, y: 40, w: W - 24, h: 54, kind: 'warning', word: 'WARNING' }), pic('warning', 'hz_anomaly', W / 2, 152, 150),
    tx('ANOMALOUS ACTIVITY\nBEYOND THIS POINT', W / 2, 262, 222, 50, { size: 21 }), tx('Do not proceed without a Class-4 escort.\nReport perceptual disturbances to Site Theta control.', W / 2, 302, 214, 20, { font: 'Inter', weight: 600, size: 7.2, lineH: 1.3 }),
    stripe(W / 2, 334, W - 24, 18, { color: '#f47b20' })]);
  TP('ps_bio', 'Containment Level 4 · biohazard sign', 'sg_1014', { sub: 'alu_white' }, { env: 'lab' }, (W, H) => [
    sh({ x: W / 2, y: 40, w: W - 24, h: 54, kind: 'biohazard', word: 'BIOHAZARD' }), pic('warning', 'hz_bio', W / 2, 150, 146),
    tx('CONTAINMENT LEVEL 4', W / 2, 246, 222, 26, { size: 20 }), tx('AUTHORISED STAFF ONLY · DECONTAMINATE ON EXIT', W / 2, 270, 222, 10, { font: 'Inter', weight: 800, size: 7.4 }),
    pic('mandatory', 'sg_mask', W / 2 - 72, 314, 54), pic('mandatory', 'sg_glove', W / 2, 314, 54), pic('mandatory', 'sg_goggles', W / 2 + 72, 314, 54)]);
  TP('ps_rad', 'Radiation Area · classic caution sign', 'sg_1410', { sub: 'alu_white' }, { env: 'lab' }, (W, H) => [
    bg(W, H, '#ffd100'), sh({ x: W / 2, y: 36, w: W - 26, h: 50, kind: 'caution', word: 'CAUTION', look: 'osha' }), gl('hz_rad', 82, 150, 108, { color: '#9b1b7a' }),
    tx('RADIATION\nAREA', 250, 138, 190, 86, { size: 40, lineH: 1 }), tx('Dosimeters must be worn · limit time near the core', 250, 200, 190, 10, { font: 'Inter', weight: 700, size: 7.2 }),
    mono('FF-RAD-07 · VESPER ISLAND REACTOR', W / 2, 236, 300, { color: '#333333' })]);
  TP('ps_ppe', 'Protective Equipment · safety sign', 'sg_1014', { sub: 'alu_white' }, { env: 'lab' }, (W, H) => [
    sh({ x: W / 2, y: 40, w: W - 24, h: 54, kind: 'safety', word: 'SAFETY FIRST' }), tx('PROTECTIVE EQUIPMENT\nREQUIRED BEYOND THIS POINT', W / 2, 100, 222, 34, { size: 14 }),
    ...[['sg_hardhat', 'HEAD'], ['sg_goggles', 'EYES'], ['sg_ear', 'EARS'], ['sg_glove', 'HANDS'], ['sg_boot', 'FEET'], ['sg_mask', 'LUNGS']].flatMap(([id, t], i) => { const x = W / 2 + ((i % 3) - 1) * 76, y = 168 + Math.floor(i / 3) * 96; return [pic('mandatory', id, x, y, 62), tx(t, x, y + 42, 70, 9, { font: 'Inter', weight: 800, size: 6.6 })]; }),
    mono('FF-PPE-12 · CALDERA FOUNDRY', W / 2, 344, 200)]);
  TP('ps_noentry', 'Restricted Area · notice sign', 'sg_107', { sub: 'alu_white' }, { env: 'lab' }, (W, H) => [
    sh({ x: W / 2, y: 27, w: W - 22, h: 38, kind: 'notice', word: 'NOTICE' }), pic('prohibit', 'sg_walk', 62, 106, 84),
    tx('RESTRICTED\nAREA', 174, 92, 146, 52, { size: 24, lineH: 1 }), tx('Authorised personnel only.\nViolators will be reassigned.', 174, 134, 146, 18, { font: 'Inter', weight: 600, size: 6.8, lineH: 1.3 }),
    mono('FACILITY 9 · DEPARTMENT OF CONTINUITY', W / 2, 165, 200, { size: 4.4 })]);
  TP('ps_creature', 'Hostile Fauna · rusted danger sign', 'sg_1014', { sub: 'rusty', wear: .3, stains: .3 }, { env: 'interrogation' }, (W, H) => [
    sh({ x: W / 2, y: 40, w: W - 24, h: 54, kind: 'danger', word: 'DANGER' }), pic('warning', 'hz_claw', W / 2, 150, 150),
    tx('HOSTILE FAUNA', W / 2, 246, 222, 30, { size: 25 }), tx('DO NOT FEED THE SPECIMENS', W / 2, 272, 222, 12, { font: 'Inter', weight: 800, size: 9 }),
    tx('Keep enclosure doors sealed at all times.\nReport breaches on channel 9.', W / 2, 300, 214, 18, { font: 'Inter', weight: 600, size: 7, lineH: 1.3 }), stripe(W / 2, 334, W - 24, 16, { wear: .25 })]);
  TP('ps_days', 'Days Without Incident · safety board', 'sg_1014', { sub: 'alu_white' }, { env: 'lab' }, (W, H) => [
    sh({ x: W / 2, y: 40, w: W - 24, h: 54, kind: 'safety', word: 'SAFETY FIRST' }), tx('THIS FACILITY HAS GONE', W / 2, 100, 222, 18, { size: 15 }),
    box(W / 2, 170, 152, 100, '#111111', { name: 'Counter', radius: 6 }), tx('0', W / 2, 170, 130, 90, { font: 'Share Tech Mono', size: 84, color: '#ff3b2f', glow: .8, glowColor: '#ff3b2f', name: 'Counter digits' }),
    tx('DAYS WITHOUT A\nCONTAINMENT BREACH', W / 2, 260, 222, 40, { size: 17 }), tx('Previous record: 3 days', W / 2, 294, 200, 10, { font: 'Inter', weight: 700, size: 8, color: '#444444' }),
    stripe(W / 2, 334, W - 24, 16)]);
  TP('ps_lockout', 'Do Not Operate · lockout tag', 'sg_tag', { sub: 'laminated' }, { env: 'lab', pose: 'hover' }, (W, H) => [
    sh({ x: W / 2, y: 31, w: W - 6, h: 22, kind: 'danger', word: 'DANGER', look: 'osha' }), tx('DO NOT\nOPERATE', W / 2, 58, 66, 26, { size: 11, lineH: 1 }), gl('sg_lock', W / 2, 84, 20),
    tx('NAME ____________\nDEPT ____________\nDATE ____________', W / 2, 114, 64, 24, { font: 'Courier Prime', weight: 700, size: 4.1, align: 'left', lineH: 1.6 }),
    tx('ONLY THE PERSON WHO HUNG\nTHIS TAG MAY REMOVE IT', W / 2, 137, 66, 8, { font: 'Inter', weight: 800, size: 2.8, lineH: 1.2 })]);
  TP('ps_chem', 'Solvent Store · chemical warning', 'sg_1410', { sub: 'alu_white' }, { env: 'lab' }, (W, H) => [
    sh({ x: W / 2, y: 30, w: W - 26, h: 44, kind: 'warning', word: 'WARNING' }),
    pic('ghs', 'hz_flame', 56, 116, 64), pic('ghs', 'hz_corrode', 126, 116, 64), pic('ghs', 'hz_toxic', 196, 116, 64), { type: 'nfpa', name: 'Hazard diamond', x: 290, y: 116, w: 80, h: 80, health: 3, fire: 3, react: 1, special: 'W' },
    tx('FLAMMABLE · CORROSIVE · TOXIC', W / 2, 186, 320, 22, { size: 17 }), tx('Store sealed. Keep away from ignition sources. Wear gloves and eye protection.', W / 2, 209, 320, 10, { font: 'Inter', weight: 600, size: 6.8 }),
    mono('SOLVENT STORE B · MERIDIAN CHEMICAL WORKS', W / 2, 238, 300)]);
  TP('ps_eyewash', 'Emergency Eyewash · safe-condition sign', 'sg_710', { sub: 'alu_white' }, { env: 'lab' }, (W, H) => [
    bg(W, H, '#00843d'), pic('safe', 'sg_wash', W / 2, 98, 118), tx('EMERGENCY\nEYEWASH', W / 2, 196, 160, 50, { size: 22, color: '#ffffff', lineH: 1 }), tx('FLUSH FOR 15 MINUTES', W / 2, 232, 150, 9, { font: 'Inter', weight: 800, size: 7, color: '#ffffff' })]);
  TP('ps_exit', 'Emergency Exit · way-out sign', 'sg_107', { sub: 'reflective' }, { env: 'lab' }, (W, H) => [
    bg(W, H, '#00843d'), gl('sg_exit', 56, 88, 98, { color: '#ffffff' }), tx('EMERGENCY\nEXIT', 180, 76, 134, 64, { size: 27, color: '#ffffff', lineH: 1 }),
    { type: 'shape', name: 'Arrow', kind: 'arrow', x: 180, y: 138, w: 92, h: 24, fill: '#ffffff' }]);
  TP('ps_quarantine', 'Quarantine Zone · public notice', 'ps_a3', { sub: 'poster_matte', age: .25, stains: .2, creases: .3, wear: .2 }, { env: 'interrogation' }, (W, H) => [
    { type: 'stripes', name: 'Hazard border', x: W / 2, y: H / 2, w: W, h: H, mode: 'border', bw: 16, band: 12, color: '#111111', color2: '#ffd100', locked: true },
    tx('QUARANTINE\nZONE', W / 2, 96, 250, 118, { font: 'Anton', size: 56, lineH: .96 }), gl('hz_virus', W / 2, 212, 116, { color: '#b3201a' }),
    tx('BY ORDER OF THE CIVIL CONTINGENCY OFFICE', W / 2, 294, 240, 12, { font: 'Oswald', weight: 700, size: 9.5 }),
    tx('Entry or exit without clearance is prohibited.\nReport symptoms to your block warden.', W / 2, 322, 232, 22, { font: 'Special Elite', size: 8.4, lineH: 1.35 }),
    { type: 'stamp', name: 'Seal', style: 'round', text: 'CONTINGENCY OFFICE', center: 'SEALED', text2: 'SECTOR 7', x: 222, y: 370, w: 58, h: 58, color: '#b3302a', rot: -12, distress: .45 },
    mono('NOTICE 7-114', 66, 388, 80, { align: 'left', color: '#333333', size: 6 })]);

  /* ----- propaganda ----- */
  TP('ps_propaganda', 'The Directorate Provides · constructivist', 'ps_a3', { sub: 'aged', age: .12, creases: .25, foldV: .35, foldH: .25, wear: .2 }, { env: 'softbox', backdrop: 'concrete' }, (W, H) => [
    rays(W, H, { n: 22, color: '#b8231b', color2: '#e9d4a2', ox: -.9, oy: .75 }),
    box(W * .56, H * .2, 470, 74, '#141414', { name: 'Black band', rot: -16 }), tx('THE DIRECTORATE\nPROVIDES', W * .57, H * .2, 300, 62, { font: 'Anton', size: 30, color: '#e9d4a2', rot: -16, lineH: 1 }),
    gl('pp_worker', W * .42, H * .53, 218), tx('WORK · UNITY · PROGRESS', W / 2, H - 62, 272, 36, { font: 'Anton', size: 31 }),
    tx('MINISTRY OF LABOUR · POSTER 41', W / 2, H - 26, 200, 9, { font: 'Oswald', weight: 600, size: 7, color: '#5a1a14', spacing: .1 })]);
  TP('ps_watching', 'The Council Is Watching · dystopian', 'ps_a3', { sub: 'poster_matte', age: .08, wear: .15 }, { env: 'interrogation' }, (W, H) => [
    bg(W, H, '#16161a'), rays(W, H, { n: 36, color: '#7a1712', alt: false, spread: .42, oy: -.28, fade: .6 }), gl('pp_eye', W / 2, H * .35, 200, { color: '#e8e2d0' }),
    tx('THE COUNCIL\nIS WATCHING', W / 2, H * .66, 262, 112, { font: 'Anton', size: 50, color: '#e8e2d0', lineH: .98 }),
    tx('REPORT DISLOYALTY · REPORT IDLENESS · REPORT DOUBT', W / 2, H * .815, 262, 12, { font: 'Oswald', weight: 600, size: 8.5, color: '#d0302a', spacing: .06 }),
    tx('OFFICE OF PUBLIC HARMONY', W / 2, H - 22, 200, 9, { font: 'Oswald', weight: 500, size: 6.5, color: '#8a8578', spacing: .14 })]);
  TP('ps_join', 'Join the Vanguard · recruitment', 'ps_a3', { sub: 'poster_matte', age: .2, creases: .2 }, {}, (W, H) => [
    bg(W, H, '#e9dfc8'), tx('YOUR SECTOR\nNEEDS YOU', W / 2, 78, 262, 108, { font: 'Anton', size: 48, color: '#b8231b', lineH: .98 }),
    gl('pp_wreath', W / 2, H * .47, 226, { color: '#1f3a5f' }), gl('pp_helmet', W / 2, H * .46, 118, { color: '#1f3a5f' }),
    tx('JOIN THE VANGUARD', W / 2, H * .775, 272, 40, { font: 'Anton', size: 36, color: '#1f3a5f' }),
    tx('ENLIST AT YOUR NEAREST DISTRICT OFFICE', W / 2, H * .855, 240, 10, { font: 'Oswald', weight: 600, size: 8, color: '#3a3a3a', spacing: .08 }),
    { type: 'stamp', name: 'Approved seal', style: 'round', text: 'MINISTRY OF DEFENCE', center: 'APPROVED', text2: 'FOR DISPLAY', x: W - 50, y: H - 44, w: 46, h: 46, color: '#b3302a', rot: -14, distress: .5 }]);
  TP('ps_stars', 'The Stars Are Ours · retro space age', 'ps_a3', { sub: 'poster_gloss' }, { env: 'neon', backdrop: 'blackglass' }, (W, H) => [
    bg(W, H, '#0f1d3a', { fill2: '#2a1a4a', grad: true, angle: 90 }), { type: 'pattern', name: 'Stars', x: W / 2, y: H / 2, w: W, h: H, kind: 'stars', color: '#ffffff', density: 60, locked: true },
    rays(W, H, { n: 18, color: '#e9b44c', alt: false, oy: 1.25, spread: .32, fade: .75 }), gl('planet', W * .28, H * .26, 92, { color: '#e98a4c' }), gl('rocket', W * .6, H * .39, 176, { color: '#f2ead8', rot: 28 }),
    tx('THE STARS\nARE OURS', W / 2, H * .75, 262, 104, { font: 'Big Shoulders Display', weight: 900, size: 52, color: '#f2ead8', lineH: .95 }),
    box(W / 2, H * .885, W, 20, '#0f1d3a', { name: 'Footer band' }), tx('COLONIAL EXPANSION BUREAU · SIGN UP TODAY', W / 2, H * .885, 250, 11, { font: 'Teko', weight: 500, size: 10, color: '#e9b44c', spacing: .12 })]);
  TP('ps_rations', 'Rations Are Victory · home front', 'ps_a3', { sub: 'aged', age: .2, foldV: .35, wear: .25 }, {}, (W, H) => [
    bg(W, H, '#e8dcc0'), box(W / 2, 54, W, 108, '#4a5a2a', { name: 'Olive band' }), tx('RATIONS ARE\nVICTORY', W / 2, 56, 262, 92, { font: 'Anton', size: 40, color: '#f2e8cc', lineH: .95 }),
    gl('pp_can', W / 2, H * .46, 150, { color: '#4a5a2a' }), gl('wheat', W / 2 - 98, H * .48, 100, { color: '#b8862b' }), gl('wheat', W / 2 + 98, H * .48, 100, { color: '#b8862b', flipX: true }),
    tx('WASTE NOTHING · SHARE EVERYTHING', W / 2, H * .72, 262, 22, { font: 'Oswald', weight: 700, size: 17, color: '#4a5a2a' }),
    tx('Every tin saved feeds a soldier at the front.', W / 2, H * .785, 240, 12, { font: 'Playfair Display', weight: 400, italic: true, size: 9, color: '#3a3a2a' }),
    tx('MINISTRY OF SUPPLY', W / 2, H - 26, 160, 9, { font: 'Oswald', weight: 600, size: 7, color: '#4a5a2a', spacing: .14 })]);
  TP('ps_fist', 'Rise Up · resistance stencil', 'ps_a3', { sub: 'newsprint', creases: .35, wear: .3, stains: .2 }, { env: 'interrogation' }, (W, H) => [
    rays(W, H, { n: 16, color: '#111111', color2: '#d72a1f', oy: -.15 }), { type: 'ellipse', name: 'Disc', x: W / 2, y: H * .42, w: 190, h: 190, fill: '#efe6d2' }, gl('pp_fist', W / 2, H * .42, 150),
    tx('RISE UP', W / 2, H * .75, 272, 84, { font: 'Stardos Stencil', weight: 700, size: 72, color: '#efe6d2' }),
    tx('THE FREE WARD STANDS TOGETHER', W / 2, H * .86, 252, 14, { font: 'Saira Stencil One', size: 11, color: '#efe6d2', spacing: .06 })]);
  TP('ps_curfew', 'Curfew in Effect · posted order', 'ps_a4', { sub: 'newsprint', creases: .3, wear: .25, stains: .2 }, { env: 'interrogation' }, (W, H) => [
    tx('NOTICE', W / 2, 40, 180, 34, { font: 'Alfa Slab One', size: 30 }), { type: 'line', name: 'Rule', x: W / 2, y: 63, w: 172, h: 1, lw: .8, color: '#111111' },
    tx('CURFEW\nIN EFFECT', W / 2, 104, 182, 70, { font: 'Anton', size: 34, lineH: .95 }), tx('20:00 — 06:00', W / 2, 150, 172, 22, { font: 'Courier Prime', weight: 700, size: 18 }),
    tx('All residents of Districts 3 to 9 must remain\nindoors between the hours above. Patrols are\nauthorised to detain anyone found outside\nwithout a movement permit.', W / 2, 196, 176, 40, { font: 'Special Elite', size: 6.2, align: 'left', lineH: 1.4 }),
    { type: 'stamp', name: 'Seal', style: 'round', text: 'OCCUPATION AUTHORITY', center: 'ORDER', text2: 'DISTRICT COMMAND', x: W * .73, y: 248, w: 52, h: 52, color: '#2d4a8a', rot: -8, distress: .45 },
    tx('By order of the District Commander', W * .33, 250, 104, 8, { font: 'Special Elite', size: 5, align: 'left' }), mono('ORDER No. 117 · POSTED 04.11', W / 2, 284, 160, { size: 4.5, color: '#444444' })]);
  TP('ps_wanted', 'Wanted · frontier bounty', 'ps_a3', { sub: 'aged', age: .25, stains: .35, wear: .35, creases: .3 }, { env: 'candle', backdrop: 'walnut' }, (W, H) => [
    tx('WANTED', W / 2, 60, 262, 72, { font: 'Rye', size: 64, color: '#2a1a10' }), tx('DEAD OR ALIVE', W / 2, 104, 222, 20, { font: 'Alfa Slab One', size: 16, color: '#2a1a10' }),
    { type: 'photo', name: 'Portrait', x: W / 2, y: 196, w: 150, h: 160, look: 'bw', sepia: .5, ph: 'portrait', phSeed: 13, border: 1.5, borderColor: '#2a1a10', radius: 0 },
    tx('“BLACK” JOREN VASK', W / 2, 296, 252, 24, { font: 'Rye', size: 20, color: '#2a1a10' }),
    tx('For train robbery, smuggling, and the\ntheft of one (1) cargo hauler', W / 2, 322, 242, 20, { font: 'Special Elite', size: 7.6, lineH: 1.3, color: '#2a1a10' }),
    box(W / 2, 362, 232, 46, '#000000', { name: 'Reward frame', fillOn: false, stroke: '#2a1a10', strokeW: 1.5 }), tx('REWARD  5,000 CREDITS', W / 2, 362, 220, 30, { font: 'Alfa Slab One', size: 24, color: '#8a1a10' }),
    tx('CONTACT THE MARSHAL OF NEW HALCYON', W / 2, 398, 230, 9, { font: 'Oswald', weight: 600, size: 7.5, color: '#2a1a10', spacing: .08 })]);
  TP('ps_dove', 'Peace Through Order · art deco', 'ps_a3', { sub: 'poster_gloss' }, { env: 'gallery' }, (W, H) => [
    bg(W, H, '#16223a'), rays(W, H, { n: 40, color: '#c9a646', alt: false, spread: .18, oy: -.2, fade: .75 }), gl('pp_wreath', W / 2, H * .4, 222, { color: '#c9a646', paint: 'gold' }), gl('pp_dove', W / 2, H * .4, 128, { color: '#f2ecdc' }),
    tx('PEACE\nTHROUGH ORDER', W / 2, H * .72, 262, 92, { font: 'Big Shoulders Display', weight: 800, size: 40, color: '#f2ecdc', lineH: 1 }),
    tx('THE CONCORD KEEPS THE PEACE', W / 2, H * .85, 240, 10, { font: 'Cinzel', weight: 700, size: 8, color: '#c9a646', spacing: .14 })]);
  TP('ps_industry', 'Build the Future · industrial deco', 'ps_a3', { sub: 'poster_matte' }, {}, (W, H) => [
    bg(W, H, '#f0d8a0', { fill2: '#d98a3c', grad: true, angle: 90 }), rays(W, H, { n: 24, color: '#f7e7c0', alt: false, oy: .3, spread: .45, fade: .45 }),
    { type: 'ellipse', name: 'Sun', x: W / 2, y: H * .6, w: 160, h: 160, fill: '#f7e7c0' }, gl('pp_city', W / 2, H * .62, 282, { color: '#1c2233' }),
    tx('BUILD THE\nFUTURE', W / 2, H * .16, 262, 104, { font: 'Big Shoulders Display', weight: 900, size: 48, color: '#1c2233', lineH: .95 }),
    box(W / 2, H - 46, W, 92, '#1c2233', { name: 'Footer band' }), tx('SEVEN-YEAR PLAN · EVERY HAND TO THE WORK', W / 2, H - 46, 262, 15, { font: 'Teko', weight: 600, size: 13, color: '#f0d8a0', spacing: .1 })]);
  TP('ps_unity', 'One People, One Purpose · bold colony', 'ps_a3', { sub: 'poster_matte', age: .1 }, {}, (W, H) => [
    bg(W, H, '#efe9dc'), box(W * .5, H * .4, 520, 150, '#c8241c', { name: 'Red sash', rot: -30 }), gl('pp_wreath', W / 2, H * .38, 214), gl('pp_globe', W / 2, H * .38, 134), gl('star', W / 2, 32, 38, { color: '#c8241c' }),
    tx('ONE PEOPLE', W / 2, H * .73, 262, 48, { font: 'Anton', size: 44 }), tx('ONE PURPOSE', W / 2, H * .835, 262, 48, { font: 'Anton', size: 44, color: '#c8241c' }),
    tx('UNITED COLONIES OF THE REACH', W / 2, H - 22, 200, 9, { font: 'Oswald', weight: 600, size: 7, spacing: .12 })]);
  TP('ps_neon', 'Comply · neon city broadcast', 'ps_a3', { sub: 'vinyl_black' }, { env: 'neon', backdrop: 'blackglass', bloom: .6 }, (W, H) => [
    gl('pp_eye', W / 2, H * .28, 150, { color: '#2de2ff', style: 'line', lineW: 2.4, glow: 5, glowColor: '#2de2ff' }),
    tx('COMPLY', W / 2, H * .54, 262, 60, { font: 'Russo One', size: 52, color: '#ff2d95', glow: 1, glowColor: '#ff2d95' }), tx('CONSUME', W / 2, H * .67, 262, 60, { font: 'Russo One', size: 52, color: '#2de2ff', glow: 1, glowColor: '#2de2ff' }),
    tx('CONNECT', W / 2, H * .8, 262, 60, { font: 'Russo One', size: 52, color: '#f2f542', glow: 1, glowColor: '#f2f542' }),
    tx('HALCYON-SATO CIVIC INFORMATION BUREAU', W / 2, H - 24, 240, 9, { font: 'Share Tech Mono', size: 7, color: '#8a8f9a', spacing: .08 })]);
})();
Forge.POSTER_WORDS = POSTER_WORDS;
Forge.TEMPLATES = TEMPLATES; Forge.renderThumb = renderThumb;
