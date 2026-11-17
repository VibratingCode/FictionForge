/* ================= layout presets: 90 full-side layouts that adapt to card size & orientation ================= */
function cardBase() {
  const S = sub(), C = P.card;
  if (C.tintOn && !S.clear) return C.tint;
  if (S.clear) { const m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/.exec(S.disp || ''); if (!m) return '#e8eef0'; const a = m[4] === undefined ? 1 : +m[4], mix = v => Math.round(+v * a + 236 * (1 - a)); return rgb2hex(mix(m[1]), mix(m[2]), mix(m[3])); }
  return S.color;
}
function cardIsDark() { const [r, g, b] = hex2rgb(cardBase()); return (.3 * r + .59 * g + .11 * b) / 255 < .42; }
const LAYOUT_CATS = ['ID layouts', 'Badge layouts', 'Member layouts', 'Genre layouts', 'Back layouts'];

function layKit(C, seed) {
  const W = C.w, H = C.h, u = Math.min(W, H) / 54, port = H / W > 1.12, m = 3.4 * u, dark = cardIsDark();
  const p = randPerson(hashStr(seed)), face = hashStr(seed + '·face') % 100;
  const cx = r => (r.x0 + r.x1) / 2, cy = r => (r.y0 + r.y1) / 2, rw = r => r.x1 - r.x0, rh = r => r.y1 - r.y0;
  const K = { C, W, H, u, port, m, dark, p, face, T: null, rw, rh };
  const N = (r) => (x0, y0, x1, y1) => ({ x0: r.x0 + x0 * rw(r), y0: r.y0 + y0 * rh(r), x1: r.x0 + x1 * rw(r), y1: r.y0 + y1 * rh(r) });
  K.N = N;
  K.R = N({ x0: 0, y0: 0, x1: W, y1: H });                       // full card, no margins
  K.I = N({ x0: m, y0: m, x1: W - m, y1: H - m });               // inside the safe margin
  K.B = (x0, y0, x1, y1) => ({ x0: m + x0 * (W - 2 * m), y0: y0 * H, x1: m + x1 * (W - 2 * m), y1: y1 * H }); // margins left/right only
  K.box = r => ({ x: cx(r), y: cy(r), w: rw(r), h: rh(r) });
  K.sq = (r, ax = .5, ay = .5) => { const s = Math.min(rw(r), rh(r)); return { x: r.x0 + s / 2 + (rw(r) - s) * ax, y: r.y0 + s / 2 + (rh(r) - s) * ay, w: s, h: s }; };
  K.full = (o = {}) => ({ x: W / 2, y: H / 2, w: W, h: H, locked: true, ...o });
  K.theme = (pal = {}) => {
    const T = { band: '#1d4f4a', band2: null, onBand: '#ffffff', acc: '#2f7f73', ink: '#16201f', mut: '#5d6b68', soft: '#dbe7e3', soft2: '#eadff0', font: 'Inter', head: 'Inter', ...pal };
    T.band2 = T.band2 || shiftColor(T.band, 18, 1, .1); T.pInk = T.ink;
    if (dark) { T.ink = '#f1f3f2'; T.mut = '#aeb8ba'; T.acc = shiftColor(T.acc, 0, 1, .18); T.soft = shiftColor(T.soft, 0, 1, -.55); T.soft2 = shiftColor(T.soft2, 0, 1, -.55); }
    return (K.T = T);
  };
  K.text = (r, text, o = {}) => { const { s, name, ...rest } = o; return { type: 'text', name: name || String(text).split('\n')[0].slice(0, 22), ...K.box(r), text: String(text), font: K.T.font, weight: 600, size: Math.min((s || 3) * u, rh(r) * .74), color: K.T.ink, align: 'left', ...rest }; };
  K.center = (r, text, o = {}) => K.text(r, text, { align: 'center', ...o });
  K.right = (r, text, o = {}) => K.text(r, text, { align: 'right', ...o });
  K.fields = (r, list, cols = 2, o = {}) => {
    const gx = (o.gap ?? 1.8) * u, rows = []; let cur = [], used = 0;
    for (const it of list) { const sp = Math.min(cols, it[2] || 1); if (used + sp > cols) { rows.push(cur); cur = []; used = 0; } cur.push([it, used, sp]); used += sp; }
    if (cur.length) rows.push(cur);
    const cw = (rw(r) - gx * (cols - 1)) / cols, ch = Math.min(rh(r) / rows.length, (o.maxH || 7.6) * u), off = o.vc ? (rh(r) - ch * rows.length) / 2 : 0, out = [];
    rows.forEach((row, ri) => row.forEach(([[label, value], c0, sp]) => {
      const w = cw * sp + gx * (sp - 1), x0 = r.x0 + c0 * (cw + gx), y = r.y0 + off + ri * ch + ch / 2;
      out.push({ type: 'field', name: label.replace(/^\d+[a-z]?\.\s*/, '') || label, x: x0 + w / 2, y, w, h: ch * .94, label, value: String(value), lsize: ch * .19, vsize: ch * (o.big || .37), lcolor: K.T.mut, color: K.T.ink, font: K.T.font, lfont: K.T.font, align: o.align || 'left', ...(o.f || {}) });
      if (o.under) out.push(K.hline(x0, x0 + w, y + ch * .47, K.T.mut, .12, { opacity: .7 }));
    }));
    return out;
  };
  K.photo = (r, o = {}) => {
    const { round, asp, ax = .5, ay = .5, name, ...rest } = o, a = round ? 1 : (asp || 22 / 28);
    let h = rh(r), w = h * a; if (w > rw(r)) { w = rw(r); h = w / a; }
    return { type: 'photo', name: name || 'Portrait', x: r.x0 + w / 2 + (rw(r) - w) * ax, y: r.y0 + h / 2 + (rh(r) - h) * ay, w, h, radius: round ? w / 2 : u, look: 'color', phSeed: face, ...rest };
  };
  K.ghost = (r, o = {}) => K.photo(r, { name: 'Ghost image', look: 'bw', opacity: .3, radius: .4 * u, ...o });
  K.rect = (r, fill, o = {}) => ({ type: 'rect', name: 'Panel', ...K.box(r), fill, ...o });
  K.ell = (r, fill, o = {}) => ({ type: 'ellipse', name: 'Ellipse', ...K.box(r), fill, ...o });
  K.hline = (x0, x1, y, color, lw = .2, o = {}) => ({ type: 'line', name: 'Rule', x: (x0 + x1) / 2, y, w: x1 - x0, h: 1, color, lw: lw * u, ...o });
  K.vline = (x, y0, y1, color, lw = .2, o = {}) => ({ type: 'line', name: 'Rule', x, y: (y0 + y1) / 2, w: y1 - y0, h: 1, color, lw: lw * u, rot: 90, ...o });
  K.seal = (r, o = {}) => { const { ax, ay, ...rest } = o; return { type: 'seal', name: 'Seal', ...K.sq(r, ax, ay), style: 'sun', text: 'FICTIONAL · REALM · ', color: K.T.acc, ...rest }; };
  K.holo = (r, o = {}) => { const { ax, ay, ...rest } = o; return { type: 'holo', name: 'Hologram', ...K.sq(r, ax, ay), shape: 'circle', holoPat: 1, emblem: 'star', holoPat2: 6, ...rest }; };
  K.qr = (r, data, o = {}) => { const { ax, ay, ...rest } = o; return { type: 'qr', name: 'QR code', ...K.sq(r, ax, ay), data, quiet: 1, color: '#111111', ...rest }; };
  K.barcode = (r, data, o = {}) => ({ type: 'barcode', name: 'Barcode', ...K.box(r), data, color: K.T.ink, ...o });
  K.mrz = (r, lines = 3, o = {}) => { const cols = lines === 2 ? 44 : 30; return { type: 'mrz', name: 'Machine strip', ...K.box(r), cols, text: mrzFor(p, 'FOR', cols), color: K.T.ink, ...o }; };
  K.sign = (r, o = {}) => ({ type: 'sign', name: 'Signature', ...K.box(r), text: p.first[0] + '. ' + p.surTitle, color: dark ? '#dfe6ff' : '#1f2b5c', ...o });
  K.chip = (x, y, o = {}) => { const s = Math.min(u, 1.25); return { type: 'chip', name: 'Contact chip', x, y, w: 11.6 * s, h: 9 * s, ...o }; };
  K.pill = (r, fill, text, color, o = {}) => [K.rect(r, fill, { name: 'Tag', radius: rh(r) / 2 }), K.center(r, text, { name: 'Tag text', color, weight: 700, size: rh(r) * .52, spacing: .12, ...o })];
  K.chips = (r, labels, fill, color) => { const g = 1.2 * u, w = (rw(r) - g * (labels.length - 1)) / labels.length, out = []; labels.forEach((l, i) => { const x0 = r.x0 + i * (w + g); out.push(K.rect({ x0, y0: r.y0, x1: x0 + w, y1: r.y1 }, fill, { name: 'Category ' + l, radius: .8 * u }), K.center({ x0, y0: r.y0, x1: x0 + w, y1: r.y1 }, l, { name: 'Category ' + l + ' text', color, weight: 700, size: rh(r) * .5 })); }); return out; };
  K.under = (kind, o = {}) => ({ type: 'pattern', name: 'Underprint', ...K.full(), kind, color: K.T.soft, color2: K.T.soft2, color3: K.T.soft, density: 34, lw: .05, opacity: .7, ...o });
  K.name = () => p.first + ' ' + p.surTitle;
  K.digits = (n = 8) => String(hashStr(seed + '#')).padStart(10, '7').slice(0, n);
  K.today = () => { const d = new Date(); return { day: String(d.getDate()).padStart(2, '0'), mon: MONTHS[d.getMonth()], year: d.getFullYear() }; };
  return K;
}

(() => {
  const lay = (cat, name, fn, v = {}) => COMPONENTS.push({ cat, name, layout: true, make: C => fn(layKit(C, name), v) });
  const P_ = (band, acc, extra = {}) => ({ band, acc, ...extra });

  /* ---------- ID & licence ---------- */
  function classic(K, v) {
    const T = K.theme(v.pal), { I, B, R, p, port, W, H, m, u } = K, o = [], hb = port ? .15 : .21, onB = v.head !== 'rule';
    if (v.under) o.push(K.under(v.under));
    if (onB) o.push(K.rect(R(0, 0, 1, hb), T.band, { name: 'Header band', ...(v.head === 'grad' ? { grad: true, fill2: T.band2, angle: 0 } : {}) }));
    else o.push(K.hline(m, W - m, H * hb, T.acc, .35));
    const sx = port ? .2 : .13;
    o.push(K.seal(B(0, hb * .12, sx, hb * .88), onB ? { finish: 'foil', foil: '#d6b25e', relief: .2, text: v.seal } : { color: T.acc, text: v.seal, ax: 0 }));
    o.push(K.text(B(sx + .03, hb * .1, 1, hb * .6), v.title, { name: 'Issuer', font: T.head, weight: 700, s: 3.2, spacing: .1, color: onB ? T.onBand : T.ink }));
    o.push(K.text(B(sx + .03, hb * .58, 1, hb * .9), v.sub, { name: 'Document type', weight: 500, s: 1.6, color: onB ? T.onBand : T.mut, opacity: onB ? .85 : 1 }));
    const F = [['Surname', p.sur, 2], ['Given names', p.given, 2], ['Date of birth', p.dob.str], ['Sex', p.sex], ['Document no.', p.id], ['Date of expiry', p.exp.str]];
    if (port) o.push(K.photo(I(.2, .18, .8, .5)), ...K.fields(I(0, .53, 1, .87), F, 2), K.sign(I(.15, .89, .85, 1)));
    else { o.push(K.photo(I(0, .27, .3, .84), { ax: 0 }), ...K.fields(I(.34, .27, 1, .8), F, 2), K.sign(I(.34, .83, .78, 1))); if (v.holo) o.push(K.holo(I(.84, .8, 1, 1), { ax: 1 })); }
    if (v.micro) o.push({ type: 'micro', name: 'Microtext', x: W / 2, y: H - 1.4 * u, w: W - 2 * m, h: .6 * u, text: v.title + ' · ', size: .4 * u, color: T.acc });
    return o;
  }
  lay('ID layouts', 'Classic ID · header band', classic, { head: 'band', pal: P_('#1d4f4a', '#2f7f73'), title: 'AURELIAN COMMONWEALTH', sub: 'Identity card · Carte d’identité', seal: 'AURELIA · ', micro: true });
  lay('ID layouts', 'Classic ID · thin rule', classic, { head: 'rule', pal: P_('#6e1f2b', '#8a2a36', { head: 'Cormorant Garamond' }), title: 'REPUBLIC OF VELORIA', sub: 'National identity card', seal: 'VELORIA · LIBERTAS · ', under: 'iris', holo: true });
  lay('ID layouts', 'Classic ID · gradient header', classic, { head: 'grad', pal: P_('#1b2f5a', '#2f5fa8', { band2: '#3b78c4' }), title: 'HALVORSEN ISLES', sub: 'Resident identity card', seal: 'HALVORSEN · ', holo: true, under: 'mesh' });

  function mirror(K, v) {
    const T = K.theme(v.pal), { I, p, port, u } = K, o = [];
    if (v.watermark) o.push(K.seal(port ? I(.1, .45, .9, .95) : I(.02, .2, .62, 1), { name: 'Watermark seal', style: 'rosette', text: '', points: 12, color: T.acc, opacity: .1 }));
    const ph = v.round ? { round: true, border: .5 * u, borderColor: T.acc } : {};
    const F = [['Surname', p.sur, 2], ['Given names', p.given, 2], ['Nationality', v.nat], ['Sex', p.sex], ['Date of birth', p.dob.str], ['Expires', p.exp.str], ['Card no.', p.id, 2]];
    if (port) o.push(K.center(I(0, 0, 1, .06), v.title, { name: 'Issuer', font: T.head, weight: 700, s: 2.8, color: T.acc, spacing: .08 }), K.center(I(0, .06, 1, .1), v.sub, { name: 'Document type', weight: 500, s: 1.4, color: T.mut }), K.photo(I(.22, .13, .78, .44), ph), ...K.fields(I(0, .48, 1, .86), F, 2), K.ghost(I(.74, .87, 1, 1), { ax: 1 }), K.sign(I(0, .88, .7, 1)));
    else o.push(K.text(I(0, 0, .64, .12), v.title, { name: 'Issuer', font: T.head, weight: 700, s: 3.2, color: T.acc, spacing: .08 }), K.text(I(0, .12, .64, .2), v.sub, { name: 'Document type', weight: 500, s: 1.5, color: T.mut }), K.photo(I(.68, 0, 1, .74), { ax: 1, ...ph }), ...K.fields(I(0, .26, .64, .92), F, 2), K.ghost(I(.68, .78, .8, 1), { ax: 0 }), K.sign(I(.81, .8, 1, 1)));
    return o;
  }
  lay('ID layouts', 'Photo right · ghost image', mirror, { pal: P_('#24405e', '#24405e'), title: 'MERIDIAN UNION', sub: 'Citizen card', nat: 'MERIDIAN' });
  lay('ID layouts', 'Photo right · seal watermark', mirror, { pal: P_('#4a3a12', '#8a6a1c', { head: 'Cinzel' }), title: 'KINGDOM OF THORNWICK', sub: 'Subject’s identity card', nat: 'THORNWICKER', watermark: true });
  lay('ID layouts', 'Photo right · round photo', mirror, { pal: P_('#0f5a52', '#13897c', { head: 'Space Grotesk' }), title: 'NORTHWOLD TERRITORIES', sub: 'Territorial ID', nat: 'NORTHWOLD', round: true });

  function datapage(K, v) {
    const T = K.theme(v.pal), { I, p, port } = K, o = [], bot = v.lines ? (port ? .78 : .72) : (port ? .88 : .84);
    if (v.under) o.push(K.under(v.under, { opacity: .5 }));
    if (port) {
      o.push(K.center(I(0, 0, 1, .06), v.title, { name: 'Title', font: T.head, weight: 700, s: 2.6, spacing: .1, color: T.acc }), K.center(I(0, .06, 1, .1), 'TYPE ' + v.type + '   ·   CODE FOR', { name: 'Type & code', font: 'IBM Plex Mono', weight: 500, s: 1.3, color: T.mut }));
      o.push(K.photo(I(.2, .12, .8, .4)));
      o.push(...K.fields(I(0, .43, 1, bot), [['Surname', p.sur, 2], ['Given names', p.given, 2], ['Nationality', v.nat], ['Date of birth', p.dob.str], ['Sex', p.sex], ['Place of birth', p.place], ['Date of issue', p.iss.str], ['Date of expiry', p.exp.str], ['Document no.', p.id, 2]], 2));
      if (v.lines) o.push(K.mrz(I(0, .81, 1, 1), v.lines)); else o.push(K.sign(I(.15, .9, .85, 1)));
    } else {
      o.push(K.text(I(0, 0, .66, .1), v.title, { name: 'Title', font: T.head, weight: 700, s: 2.8, spacing: .1, color: T.acc }), K.right(I(.66, 0, 1, .1), 'TYPE ' + v.type + '  ·  CODE FOR', { name: 'Type & code', font: 'IBM Plex Mono', weight: 500, s: 1.4, color: T.mut }));
      o.push(K.photo(I(0, .14, .25, bot), { ax: 0 }));
      o.push(...K.fields(I(.29, .13, v.lines ? 1 : .86, bot), [['Surname', p.sur, 3], ['Given names', p.given, 3], ['Nationality', v.nat], ['Date of birth', p.dob.str], ['Sex', p.sex], ['Place of birth', p.place, 2], ['Date of issue', p.iss.str], ['Date of expiry', p.exp.str], ['Authority', v.auth, 2]], 3));
      if (v.lines) o.push(K.mrz(I(0, .76, 1, 1), v.lines));
      else o.push(K.ghost(I(.88, .5, 1, .84), { ax: 1 }), K.sign(I(.29, .87, .7, 1)), K.holo(I(.88, .13, 1, .4), { ax: 1, shape: 'oval', emblem: 'ring', holoPat: 2 }));
    }
    return o;
  }
  lay('ID layouts', 'Data page · 2-line strip', datapage, { pal: P_('#2b3f66', '#2b3f66', { soft: '#dde4f1', soft2: '#efe3ea' }), title: 'PASSPORT · FREE CITY OF SALTMERE', type: 'P', nat: 'SALTMERIAN', auth: 'HARBOUR REGISTRY', lines: 2, under: 'iris' });
  lay('ID layouts', 'Data page · 3-line strip', datapage, { pal: P_('#2f5a3a', '#2f6b44', { soft: '#dcebdf', soft2: '#efe8d6' }), title: 'IDENTITY DOCUMENT · CALDRIS', type: 'I', nat: 'CALDRIAN', auth: 'CIVIL BUREAU', lines: 3, under: 'topo' });
  lay('ID layouts', 'Data page · signature', datapage, { pal: P_('#5a2a4a', '#7a2f62', { head: 'Cinzel', soft: '#efdfe8', soft2: '#e2e6f0' }), title: 'TRAVEL CARD · WYVERN HOLLOW', type: 'T', nat: 'HOLLOWER', auth: 'WARDEN’S OFFICE', lines: 0, under: 'mesh' });

  function sideband(K, v) {
    const T = K.theme(v.pal), { R, p, port, W, H, m, u } = K, o = [], bw = port ? .15 : .13;
    o.push(K.rect(R(0, 0, bw, 1), T.band, { name: 'Side band', grad: true, fill2: T.band2, angle: 90 }));
    o.push({ type: 'text', name: 'Band text', x: W * bw / 2, y: H / 2, w: H * .86, h: W * bw * .55, text: v.vert, font: T.head, weight: 700, size: Math.min(W * bw * .32, H * .8 / (v.vert.length * 1.05)), align: 'center', color: T.onBand, spacing: .18, rot: -90 });
    const Cn = K.N({ x0: W * bw + m * .9, y0: m, x1: W - m, y1: H - m });
    const F = [['Surname', p.sur, 2], ['Given names', p.given, 2], ['Date of birth', p.dob.str], ['Expires', p.exp.str], ['Number', p.id, 2]];
    if (port) o.push(K.text(Cn(0, 0, 1, .06), v.title, { name: 'Issuer', font: T.head, weight: 700, s: 2.6, color: T.acc }), K.text(Cn(0, .06, 1, .1), v.sub, { name: 'Document type', weight: 500, s: 1.3, color: T.mut }), K.photo(Cn(.1, .13, .9, .44)), ...K.fields(Cn(0, .48, 1, .86), F, 2), K.sign(Cn(0, .88, .8, 1)));
    else o.push(K.text(Cn(0, 0, 1, .12), v.title, { name: 'Issuer', font: T.head, weight: 700, s: 3, color: T.acc, spacing: .06 }), K.text(Cn(0, .12, 1, .19), v.sub, { name: 'Document type', weight: 500, s: 1.5, color: T.mut }), K.photo(Cn(0, .26, .34, .9), { ax: 0 }), ...K.fields(Cn(.38, .25, 1, .82), F, 2), K.sign(Cn(.38, .84, .85, 1)));
    if (v.holo) o.push(K.holo({ x0: 0, y0: H - W * bw - m, x1: W * bw, y1: H - m }, { shape: 'hex', holoPat: 3, emblem: 'orbit', w: W * bw * .7, h: W * bw * .7 }));
    return o;
  }
  lay('ID layouts', 'Side band · emerald', sideband, { pal: P_('#0d5a44', '#0f7a5c', { band2: '#18a07a' }), vert: 'IDENTITY · CARD', title: 'GREYHAVEN CANTON', sub: 'Cantonal identity card', holo: true });
  lay('ID layouts', 'Side band · crimson', sideband, { pal: P_('#8a1c2a', '#a3243a', { head: 'Playfair Display' }), vert: 'RESIDENT', title: 'PORT ELLING', sub: 'Residence permit', holo: false });
  lay('ID layouts', 'Side band · graphite', sideband, { pal: P_('#24272c', '#3a4048', { band2: '#4a525c', head: 'Space Grotesk' }), vert: 'ACCESS · CARD', title: 'OLD KESTREL WORKS', sub: 'Personnel identity', holo: true });

  function driving(K, v) {
    const T = K.theme(v.pal), { I, p, port } = K, o = [K.under('waves', { color: T.soft, color2: T.soft2, color3: T.soft, density: 26, opacity: .8 })];
    const F = [['1. Surname', p.sur, 2], ['2. Given names', p.given, 2], ['3. Date of birth', p.dob.str], ['4a. Issued', p.iss.str], ['4b. Expires', p.exp.str], ['5. Permit no.', p.id]];
    const badge = (r) => { const s = K.sq(r, 1, 0); return [{ type: 'ellipse', name: 'Code badge', ...s, fill: T.band }, { type: 'text', name: 'Code', ...s, text: 'FOR', font: 'Archivo Black', size: s.h * .32, align: 'center', color: T.onBand }]; };
    if (port) o.push(K.text(I(0, 0, .78, .06), v.title, { name: 'Title', font: T.head, weight: 800, s: 2.8, color: T.acc }), K.text(I(0, .06, .78, .1), v.sub, { name: 'Authority', weight: 500, s: 1.3, color: T.mut }), ...badge(I(.8, 0, 1, .1)), K.photo(I(.2, .13, .8, .42)), ...K.fields(I(0, .45, 1, .8), F, 2), ...K.chips(I(0, .83, 1, .9), v.cats, T.band, T.onBand), K.sign(I(.15, .92, .85, 1)));
    else o.push(K.text(I(0, 0, .62, .11), v.title, { name: 'Title', font: T.head, weight: 800, s: 3.2, color: T.acc, spacing: .04 }), K.text(I(0, .11, .62, .18), v.sub, { name: 'Authority', weight: 500, s: 1.5, color: T.mut }), ...badge(I(.82, 0, 1, .2)), K.photo(I(0, .24, .27, .84), { ax: 0 }), ...K.fields(I(.31, .22, 1, .78), F, 2), ...K.chips(I(.31, .83, 1, .97), v.cats, T.band, T.onBand), K.sign(I(0, .87, .27, 1)));
    return o;
  }
  lay('ID layouts', 'Driving permit · rose', driving, { pal: P_('#a3245a', '#b3285f', { soft: '#f6d9e6', soft2: '#e6dcf2', head: 'Archivo Black' }), title: 'DRIVING PERMIT', sub: 'Saltmere Road Authority', cats: ['AM', 'A1', 'B', 'BE', 'C1'] });
  lay('ID layouts', 'Driving permit · sky', driving, { pal: P_('#1f5f9e', '#1f5f9e', { soft: '#d8e8f6', soft2: '#e2f2ea', head: 'Space Grotesk' }), title: 'OPERATOR LICENCE', sub: 'Meridian Transit Board', cats: ['M', 'B', 'C', 'D', 'T'] });
  lay('ID layouts', 'Driving permit · sage', driving, { pal: P_('#2f6b44', '#2f6b44', { soft: '#dcebd8', soft2: '#f0ead2', head: 'Oswald' }), title: 'WAGON & DRAY PERMIT', sub: 'Northwold Highways Guild', cats: ['CART', 'DRAY', 'COACH'] });

  function overlap(K, v) {
    const T = K.theme(v.pal), { I, B, R, p, port, u } = K, o = [], bh = port ? .3 : .4;
    o.push(K.rect(R(0, 0, 1, bh), T.band, { name: 'Header band', grad: true, fill2: T.band2, angle: 0 }));
    if (v.pat) o.push({ type: 'pattern', name: 'Band pattern', ...K.box(R(0, 0, 1, bh)), kind: v.pat, color: '#ffffff', color2: '#ffffff', density: 18, lw: .06, opacity: .18, seed: 4 });
    const ph = { border: .8 * u, borderColor: '#ffffff', radius: 1.2 * u };
    if (port) o.push(K.center(I(0, 0, 1, .05), v.title, { name: 'Issuer', font: T.head, weight: 700, s: 2.4, color: T.onBand, spacing: .1 }), K.center(I(0, .05, 1, .085), v.sub, { name: 'Document type', weight: 500, s: 1.3, color: T.onBand, opacity: .85 }), K.photo(I(.22, .11, .78, .45), ph), ...K.fields(I(0, .5, 1, .95), [['Surname', p.sur, 2], ['Given names', p.given, 2], ['Date of birth', p.dob.str], ['Sex', p.sex], ['Valid until', p.exp.str], ['Permit no.', p.id]], 2));
    else { o.push(K.photo(I(0, .14, .28, .9), { ax: 0, ...ph }), K.text(B(.32, .07, .9, .22), v.title, { name: 'Issuer', font: T.head, weight: 700, s: 3.2, color: T.onBand, spacing: .08 }), K.text(B(.32, .22, .9, .32), v.sub, { name: 'Document type', weight: 500, s: 1.6, color: T.onBand, opacity: .85 }), ...K.fields(I(.32, .48, 1, .95), [['Surname', p.sur, 2], ['Sex', p.sex], ['Given names', p.given, 3], ['Date of birth', p.dob.str], ['Valid until', p.exp.str], ['Permit no.', p.id]], 3)); if (v.flag) o.push({ type: 'flag', name: 'Flag', ...K.box(B(.86, .08, 1, .28)), ...v.flag }); }
    return o;
  }
  lay('ID layouts', 'Overlap photo · residence', overlap, { pal: P_('#21507a', '#21507a', { band2: '#2f7fb0' }), title: 'LANTERN BAY', sub: 'Residence permit · Titre de séjour', pat: 'topo', flag: { kind: 'chevron', c1: '#1f6f78', c2: '#e9dcc0', c3: '#c46a2a', emblem: 'sun', ecolor: '#f2d06b' } });
  lay('ID layouts', 'Overlap photo · work permit', overlap, { pal: P_('#7a3a14', '#9a4a1a', { band2: '#c46a2a', head: 'Space Grotesk' }), title: 'SILVERFORD', sub: 'Work permit', pat: 'mesh' });
  lay('ID layouts', 'Overlap photo · citizen', overlap, { pal: P_('#3b2a6a', '#4b3a8a', { band2: '#7a5ab8', head: 'Cinzel' }), title: 'MERROWGATE', sub: 'Citizen card', pat: 'waves', flag: { kind: 'diagonal', c1: '#5a3a8a', c2: '#d6b25e', c3: '#2f7f73', emblem: 'circle', ecolor: '#ffffff' } });

  function minimal(K, v) {
    const T = K.theme(v.pal), { I, p, port, W, m, u, H } = K, o = [], F = [['Born', p.dob.str], ['Expires', p.exp.str], ['Sex', p.sex]];
    const iw = W - 2 * m;
    if (port) o.push(K.center(I(0, 0, 1, .05), v.label, { name: 'Label', weight: 600, s: 1.3, spacing: .35, color: T.mut }), K.photo(I(.18, .08, .82, .45), { look: v.look, radius: .4 * u }), K.center(I(0, .5, 1, .6), p.surTitle, { name: 'Surname', font: T.head, weight: 600, s: 5.5 }), K.center(I(0, .6, 1, .66), p.given, { name: 'Given names', weight: 500, s: 2, color: T.mut }), K.hline(W / 2 - iw * .15, W / 2 + iw * .15, m + (H - 2 * m) * .7, T.acc, .25), ...K.fields(I(0, .74, 1, .87), F, 3, { align: 'center' }), K.center(I(0, .92, 1, 1), 'Nº ' + p.id, { name: 'Number', font: 'IBM Plex Mono', weight: 500, s: 1.7, color: T.mut }));
    else o.push(K.text(I(0, 0, .66, .08), v.label, { name: 'Label', weight: 600, s: 1.3, spacing: .35, color: T.mut }), K.text(I(0, .3, .68, .5), p.surTitle, { name: 'Surname', font: T.head, weight: 600, s: 6 }), K.text(I(0, .5, .68, .6), p.given, { name: 'Given names', weight: 500, s: 2.2, color: T.mut }), K.hline(m, m + iw * .68, m + (H - 2 * m) * .66, T.acc, .25), ...K.fields(I(0, .7, .68, .88), F, 3), K.photo(I(.74, 0, 1, .66), { ax: 1, ay: 0, look: v.look, radius: .4 * u }), K.right(I(.7, .88, 1, 1), 'Nº ' + p.id, { name: 'Number', font: 'IBM Plex Mono', weight: 500, s: 1.7, color: T.mut }));
    return o;
  }
  lay('ID layouts', 'Minimal ID · serif', minimal, { pal: P_('#1c2a3a', '#b8892b', { head: 'Cormorant Garamond' }), label: 'IDENTITY · ASHBY CROSS', look: 'color' });
  lay('ID layouts', 'Minimal ID · grotesk', minimal, { pal: P_('#111111', '#ff5a1f', { head: 'Space Grotesk', font: 'Space Grotesk' }), label: 'CIVIC PASS · FENWICK', look: 'color' });
  lay('ID layouts', 'Minimal ID · mono', minimal, { pal: P_('#222222', '#2a6af0', { head: 'IBM Plex Mono', font: 'IBM Plex Mono' }), label: 'REGISTRY RECORD', look: 'bw' });

  function paper(K, v) {
    const T = K.theme(v.pal), { I, p, port, W, H, m, u } = K, o = [];
    if (v.ledger) { for (let i = 1; i < 12; i++) o.push(K.hline(0, W, H * i / 12, '#9cb9d6', .12, { name: 'Ruled line', opacity: .7, locked: true })); o.push(K.vline(port ? W * .1 : W * .07, 0, H, '#d0505a', .15, { name: 'Margin', locked: true })); }
    o.push({ type: 'frame', name: 'Border', ...K.box(K.R(.025, .025 * W / H, .975, 1 - .025 * W / H)), style: 'double', color: T.mut, lw: .2 * u, radius: .8 * u });
    const lf = v.lfont || 'Special Elite', vf = v.vfont || 'Special Elite', hand = vf === 'Caveat';
    const F = [['Name', K.name()], ['Born', p.dob.str + ' · ' + p.place], ['Occupation', v.occ], ['Address', v.addr], ['Valid until', p.exp.str]];
    const fo = { under: true, f: { lfont: lf, font: vf, upper: !hand, color: hand ? (K.dark ? '#c9d6ff' : '#2b3a6a') : T.ink, lweight: 400, weight: hand ? 600 : 400, italic: false } }, big = hand ? .5 : .37;
    let ph;
    if (port) { o.push(K.center(I(0, .01, 1, .07), v.title, { name: 'Title', font: lf, weight: 400, s: 2.4, spacing: .12 }), K.center(I(0, .07, 1, .1), v.sub, { name: 'Subtitle', font: lf, weight: 400, s: 1.2, color: T.mut })); ph = K.photo(I(.22, .13, .78, .43), { look: v.look, sepia: v.sepia || 0, border: .9 * u, borderColor: '#ffffff', radius: 0, rot: -2 }); o.push(ph, ...K.fields(I(0, .47, 1, .88), F, 1, { ...fo, big }), K.sign(I(.2, .9, .8, 1))); }
    else { o.push(K.center(I(0, .01, 1, .13), v.title, { name: 'Title', font: lf, weight: 400, s: 2.6, spacing: .14 }), K.center(I(0, .13, 1, .19), v.sub, { name: 'Subtitle', font: lf, weight: 400, s: 1.3, color: T.mut })); ph = K.photo(I(.02, .25, .3, .88), { look: v.look, sepia: v.sepia || 0, border: .9 * u, borderColor: '#ffffff', radius: 0, rot: -2 }); o.push(ph, ...K.fields(I(.36, .24, 1, .86), F, 1, { ...fo, big }), K.sign(I(.6, .87, 1, 1))); }
    o.push({ type: 'stamp', name: 'Stamp', x: ph.x + ph.w * .42, y: ph.y + ph.h * .36, w: 15 * u, h: 15 * u, rot: -14, text: v.st1, text2: v.st2, center: v.stc, color: v.stamp, opacity: .8 });
    return o;
  }
  lay('ID layouts', 'Paper ID · typewriter', paper, { pal: P_('#3a2f24', '#5a4630'), title: 'DISTRICT OF ASHBY CROSS', sub: 'Certificate of identity', occ: 'CLOCKMAKER', addr: '7 LANTERN ROW', look: 'bw', st1: 'ASHBY CROSS', st2: 'CLERK', stc: 'SEEN', stamp: '#2d4a8a' });
  lay('ID layouts', 'Paper ID · handwritten', paper, { pal: P_('#3a2f24', '#5a4630'), title: 'TRAVELLER’S PAPERS', sub: 'Issued at the border house', occ: 'Cartographer', addr: 'No fixed abode', look: 'sepia', sepia: .8, vfont: 'Caveat', st1: 'BORDER HOUSE', st2: 'NORTH GATE', stc: 'PASS', stamp: '#8a2a1a' });
  lay('ID layouts', 'Paper ID · ruled ledger', paper, { pal: P_('#24324a', '#2b3f66'), title: 'MUNICIPAL LEDGER CARD', sub: 'Entry nº 4471', occ: 'DOCK CLERK', addr: '22 SALT QUAY', look: 'bw', lfont: 'Courier Prime', vfont: 'Courier Prime', ledger: true, st1: 'REGISTRY', st2: 'SALTMERE', stc: 'FILED', stamp: '#b3302a' });

  /* ---------- badges & passes ---------- */
  function staff(K, v) {
    const T = K.theme(v.pal), { I, R, p, port, W, H, m, u } = K, o = [];
    const ph = v.round ? { round: true, border: .7 * u, borderColor: T.acc } : { radius: 1.5 * u, border: .6 * u, borderColor: '#ffffff' };
    if (port) {
      o.push(K.rect(R(0, 0, 1, .3), T.band, { name: 'Header band', grad: !!v.grad, fill2: T.band2, angle: 0 }), K.center(I(0, .01, 1, .09), v.co, { name: 'Company', font: T.head, weight: 700, s: 3, color: T.onBand, spacing: .06 }), K.center(I(0, .09, 1, .14), v.tag, { name: 'Tagline', weight: 500, s: 1.4, color: T.onBand, opacity: .8 }));
      o.push(K.photo(I(.18, .2, .82, .58), ph), K.center(I(0, .62, 1, .7), K.name(), { name: 'Name', font: T.head, weight: 700, s: 3.8 }), K.center(I(0, .7, 1, .75), v.role, { name: 'Role', weight: 600, s: 2, color: T.acc }), ...K.pill(I(.22, .78, .78, .84), T.acc, v.dept, T.onBand));
      o.push(v.qr ? K.qr(I(.36, .86, .64, 1), 'https://example.com/staff/' + p.id) : K.barcode(I(.08, .88, .92, 1), v.code + '-' + K.digits(5), { showText: false }));
    } else {
      o.push(K.rect(R(0, 0, .36, 1), T.band, { name: 'Side panel', grad: !!v.grad, fill2: T.band2, angle: 90 }));
      const Np = K.N({ x0: m, y0: m, x1: W * .36 - m, y1: H - m }), Nr = K.N({ x0: W * .36 + m * 1.2, y0: m, x1: W - m, y1: H - m });
      o.push(K.photo(Np(0, 0, 1, .74), ph), K.center(Np(0, .78, 1, .9), v.co, { name: 'Company', font: T.head, weight: 700, s: 2.2, color: T.onBand }), K.center(Np(0, .9, 1, 1), v.tag, { name: 'Tagline', weight: 500, s: 1.2, color: T.onBand, opacity: .8 }));
      o.push(K.text(Nr(0, 0, 1, .1), v.site, { name: 'Site', weight: 600, s: 1.3, spacing: .25, color: T.mut }), K.text(Nr(0, .2, 1, .38), K.name(), { name: 'Name', font: T.head, weight: 700, s: 4.2 }), K.text(Nr(0, .38, 1, .48), v.role, { name: 'Role', weight: 600, s: 2, color: T.acc }), ...K.pill(Nr(0, .56, .62, .67), T.acc, v.dept, T.onBand));
      o.push(v.qr ? K.qr(Nr(.66, .52, 1, 1), 'https://example.com/staff/' + p.id, { ax: 1 }) : K.barcode(Nr(0, .76, 1, 1), v.code + '-' + K.digits(5), { showText: false }));
    }
    return o;
  }
  lay('Badge layouts', 'Staff badge · ember', staff, { pal: P_('#1b1d22', '#ff6b2c', { head: 'Space Grotesk' }), co: 'NORTHWIND LABS', tag: 'Applied tinkering', site: 'CAMPUS 2 · LEVEL 4', role: 'Research Engineer', dept: 'PROTOTYPING', code: 'NWL', round: true });
  lay('Badge layouts', 'Staff badge · indigo', staff, { pal: P_('#2a2f7a', '#4a54d6', { band2: '#5a3ab8' }), co: 'HELIX BIOWORKS', tag: 'Living materials', site: 'LAB WING C', role: 'Lab Technician', dept: 'CULTURES', code: 'HXB', grad: true });
  lay('Badge layouts', 'Staff badge · lime', staff, { pal: P_('#16301f', '#5fae2a', { head: 'Rajdhani' }), co: 'VERDANT SYSTEMS', tag: 'Grid & greenhouse', site: 'DOME 7', role: 'Field Operator', dept: 'HYDROPONICS', code: 'VDS', qr: true });

  function press(K, v) {
    const T = K.theme(v.pal), { I, B, R, p, port } = K, o = [];
    if (port) o.push(K.rect(R(0, 0, 1, .22), T.band, { name: 'Header band' }), K.center(I(0, 0, 1, .16), v.word, { name: 'Pass word', font: 'Archivo Black', weight: 400, s: 12, color: T.onBand, spacing: .04 }), K.photo(I(.2, .23, .8, .56)), K.center(I(0, .6, 1, .68), K.name(), { name: 'Name', weight: 700, s: 3.4 }), K.center(I(0, .68, 1, .74), v.outlet, { name: 'Outlet', weight: 600, s: 2, color: T.acc }), ...K.fields(I(0, .77, 1, .86), [['Pass no.', K.digits(6)], ['Valid', p.exp.str]], 2, { align: 'center' }), K.qr(I(.36, .87, .64, 1), 'https://example.com/press/' + p.id));
    else o.push(K.rect(R(0, 0, 1, .3), T.band, { name: 'Header band' }), K.text(B(0, .03, .62, .27), v.word, { name: 'Pass word', font: 'Archivo Black', weight: 400, s: 10, color: T.onBand }), K.right(B(.62, .06, 1, .26), v.event, { name: 'Event', weight: 600, s: 1.5, lineH: 1.35, color: T.onBand, fit: true }), K.photo(I(0, .36, .27, 1), { ax: 0 }), K.text(I(.31, .36, 1, .5), K.name(), { name: 'Name', weight: 700, s: 3.6 }), K.text(I(.31, .5, 1, .6), v.outlet, { name: 'Outlet', weight: 600, s: 2, color: T.acc }), ...K.fields(I(.31, .64, .76, .86), [['Pass no.', K.digits(6)], ['Valid', p.exp.str]], 2), K.qr(I(.8, .6, 1, 1), 'https://example.com/press/' + p.id, { ax: 1, ay: 1 }));
    return o;
  }
  lay('Badge layouts', 'Press pass · red', press, { pal: P_('#c4202b', '#c4202b'), word: 'PRESS', outlet: 'The Saltmere Gazette', event: 'ACCREDITED MEDIA\n2026 SEASON' });
  lay('Badge layouts', 'Press pass · black & yellow', press, { pal: P_('#111111', '#c79a00', { onBand: '#ffd23d' }), word: 'MEDIA', outlet: 'Kestrel Radio Network', event: 'GRAND PRIX · PIT LANE\nALL SESSIONS' });
  lay('Badge layouts', 'Press pass · photographer', press, { pal: P_('#1f4f9e', '#1f4f9e'), word: 'PHOTO', outlet: 'Lantern Bay Chronicle', event: 'PITCHSIDE\nNO FLASH' });

  function visitor(K, v) {
    const T = K.theme(v.pal), { I, B, R, port, H } = K, o = [], d = K.today();
    const band = port ? .24 : .44, F = [['Name', K.name()], ['Host', v.host], ['Area', v.area]];
    o.push(K.rect(R(0, 0, 1, band), T.band, { name: 'Header band' }));
    if (v.stripes) o.push({ type: 'pattern', name: 'Hazard stripes', ...K.box(R(0, band, 1, band + .05)), kind: 'stripes', color: '#111111', color2: T.band, density: 10 });
    if (port) o.push(K.center(I(0, 0, 1, .18), v.word, { name: 'Pass word', font: 'Bebas Neue', weight: 400, s: 12, color: T.onBand, spacing: .04 }), K.center(I(0, .3, 1, .42), d.day + ' ' + d.mon, { name: 'Date', font: 'Oswald', weight: 700, s: 7, color: T.acc }), K.center(I(0, .42, 1, .47), 'VALID ON THIS DAY ONLY', { name: 'Validity', weight: 600, s: 1.2, spacing: .2, color: T.mut }), ...K.fields(I(0, .52, 1, .84), F, 1, { under: true }), K.barcode(I(.1, .88, .9, 1), 'V-' + K.digits(6), { showText: false }));
    else o.push(K.center(B(0, .04, 1, .4), v.word, { name: 'Pass word', font: 'Bebas Neue', weight: 400, s: 16, color: T.onBand, spacing: .05 }), ...K.fields(I(0, .54, .66, .97), F, 1, { under: true }), K.center(I(.7, .5, 1, .78), d.day, { name: 'Day', font: 'Oswald', weight: 700, s: 9, color: T.acc }), K.center(I(.7, .78, 1, .9), d.mon + ' ' + d.year, { name: 'Month', weight: 700, s: 1.8 }), K.center(I(.7, .9, 1, 1), 'TODAY ONLY', { name: 'Validity', weight: 600, s: 1.1, spacing: .2, color: T.mut }));
    return o;
  }
  lay('Badge layouts', 'Visitor · signal yellow', visitor, { pal: P_('#ffd23d', '#b38a00', { onBand: '#111111' }), word: 'VISITOR', host: 'Reception', area: 'Ground floor' });
  lay('Badge layouts', 'Contractor · hazard', visitor, { pal: P_('#ff8a1f', '#c25e00', { onBand: '#111111' }), word: 'CONTRACTOR', host: 'Facilities', area: 'Plant room B', stripes: true });
  lay('Badge layouts', 'Guest · teal', visitor, { pal: P_('#0f7f86', '#0f7f86'), word: 'GUEST', host: 'Events team', area: 'Atrium & terrace' });

  function clearance(K, v) {
    const T = K.theme(v.pal), { I, B, R, p, port, W, H, m } = K, o = [];
    if (port) {
      o.push(K.rect(R(0, 0, 1, .11), T.band, { name: 'Header bar' }), K.center(B(0, .02, 1, .09), 'SECURITY CLEARANCE', { name: 'Header', weight: 700, s: 2, spacing: .2, color: T.onBand }));
      o.push(K.photo(I(.2, .1, .8, .4)), K.center(I(0, .43, 1, .48), 'LEVEL', { name: 'Level label', weight: 700, s: 1.5, spacing: .4, color: T.mut }), K.center(I(0, .47, 1, .63), v.level, { name: 'Level', font: 'Oswald', weight: 700, s: 14, color: T.acc }));
      o.push(...K.fields(I(0, .65, 1, .86), [['Name', K.name(), 2], ['Division', v.div], ['Badge no.', p.id]], 2), K.chip(m + 7.5 * K.u, m + (H - 2 * m) * .93), K.right(I(.4, .88, 1, .97), v.org, { name: 'Organisation', font: 'IBM Plex Mono', weight: 500, s: 1.3, color: T.mut }), K.rect(R(0, .965, 1, 1), T.acc, { name: 'Bottom stripe' }));
    } else {
      o.push(K.rect(R(0, 0, 1, .15), T.band, { name: 'Header bar' }), K.text(B(0, .02, .7, .13), 'SECURITY CLEARANCE', { name: 'Header', weight: 700, s: 2.2, spacing: .2, color: T.onBand }), K.right(B(.7, .02, 1, .13), v.org, { name: 'Organisation', font: 'IBM Plex Mono', weight: 500, s: 1.4, color: T.onBand }));
      o.push(K.photo(I(0, .24, .26, .82), { ax: 0 }), ...K.fields(I(.3, .24, .7, .72), [['Name', K.name()], ['Division', v.div], ['Badge no.', p.id]], 1), K.center(I(.72, .22, 1, .32), 'LEVEL', { name: 'Level label', weight: 700, s: 1.5, spacing: .4, color: T.mut }), K.center(I(.72, .3, 1, .82), v.level, { name: 'Level', font: 'Oswald', weight: 700, s: 22, color: T.acc }));
      o.push(K.chip(m + (W - 2 * m) * .3 + 6.5 * K.u, m + (H - 2 * m) * .88), K.rect(R(0, .95, 1, 1), T.acc, { name: 'Bottom stripe' }));
    }
    return o;
  }
  lay('Badge layouts', 'Clearance · level 3', clearance, { pal: P_('#7a1414', '#c4202b'), level: '3', div: 'VAULT OPERATIONS', org: 'MERIDIAN ARCHIVE' });
  lay('Badge layouts', 'Clearance · level 2', clearance, { pal: P_('#6a4a0a', '#d08a00'), level: '2', div: 'RESEARCH WING', org: 'CALDRIS INSTITUTE' });
  lay('Badge layouts', 'Clearance · level 1', clearance, { pal: P_('#1d4a2a', '#2f9a4a'), level: '1', div: 'GENERAL STAFF', org: 'NORTHWOLD WORKS' });

  function conference(K, v) {
    const T = K.theme(v.pal), { I, B, R, p, port } = K, o = [];
    if (port) o.push(K.center(I(0, 0, 1, .07), v.event, { name: 'Event', font: T.head, weight: 700, s: 2.4, color: T.acc }), K.center(I(0, .07, 1, .11), v.date, { name: 'Dates', weight: 500, s: 1.4, color: T.mut }), K.center(I(0, .22, 1, .37), p.first, { name: 'First name', font: T.head, weight: 700, s: 7.5 }), K.center(I(0, .37, 1, .46), p.surTitle, { name: 'Surname', font: T.head, weight: 500, s: 4 }), K.center(I(0, .49, 1, .55), v.co, { name: 'Company', weight: 500, s: 1.8, color: T.mut }), K.qr(I(.3, .59, .7, .82), 'https://example.com/badge/' + p.id), K.rect(R(0, .86, 1, 1), T.band, { name: 'Role strip' }), K.center(B(0, .875, 1, .985), v.role, { name: 'Role', font: 'Archivo Black', weight: 400, s: 4, spacing: .2, color: T.onBand }));
    else o.push(K.text(I(0, 0, .7, .12), v.event, { name: 'Event', font: T.head, weight: 700, s: 2.4, color: T.acc }), K.right(I(.7, 0, 1, .12), v.date, { name: 'Dates', weight: 500, s: 1.4, color: T.mut }), K.text(I(0, .2, .72, .44), p.first, { name: 'First name', font: T.head, weight: 700, s: 7.5 }), K.text(I(0, .44, .72, .58), p.surTitle, { name: 'Surname', font: T.head, weight: 500, s: 4 }), K.text(I(0, .6, .72, .7), v.co, { name: 'Company', weight: 500, s: 1.8, color: T.mut }), K.qr(I(.76, .16, 1, .72), 'https://example.com/badge/' + p.id, { ax: 1 }), K.rect(R(0, .8, 1, 1), T.band, { name: 'Role strip' }), K.center(B(0, .82, 1, .98), v.role, { name: 'Role', font: 'Archivo Black', weight: 400, s: 4, spacing: .2, color: T.onBand }));
    return o;
  }
  lay('Badge layouts', 'Conference · attendee', conference, { pal: P_('#2a6af0', '#2a6af0', { head: 'Space Grotesk' }), event: 'LANTERN SUMMIT', date: '12–14 MAR', co: 'Fenwick & Daughters', role: 'ATTENDEE' });
  lay('Badge layouts', 'Conference · speaker', conference, { pal: P_('#e0306a', '#e0306a', { head: 'Space Grotesk' }), event: 'ORBITAL DESIGN WEEK', date: '3–5 OCT', co: 'Halvorsen Studio', role: 'SPEAKER' });
  lay('Badge layouts', 'Conference · crew', conference, { pal: P_('#111111', '#111111', { head: 'Rajdhani' }), event: 'NORTHWOLD EXPO', date: '21–23 JUN', co: 'Event operations', role: 'CREW' });

  function student(K, v) {
    const T = K.theme(v.pal), { I, p, port, W, m } = K, o = [], F = [['Name', K.name(), 2], ['Programme', v.prog, 2], ['Student no.', p.id], ['Valid until', p.exp.str]];
    if (port) o.push(K.seal(I(.36, 0, .64, .11), { style: v.seal, text: v.motto, color: T.acc }), K.center(I(0, .12, 1, .18), v.inst, { name: 'Institution', font: T.head, weight: 700, s: 2.6 }), K.center(I(0, .18, 1, .22), 'Student identity card', { name: 'Card type', weight: 500, s: 1.3, color: T.mut }), K.photo(I(.22, .25, .78, .54)), ...K.fields(I(0, .57, 1, .86), F, 2, { align: 'center' }), K.barcode(I(0, .88, 1, 1), p.id));
    else o.push(K.seal(I(0, 0, .13, .22), { style: v.seal, text: v.motto, color: T.acc, ax: 0 }), K.text(I(.15, 0, .8, .13), v.inst, { name: 'Institution', font: T.head, weight: 700, s: 3 }), K.text(I(.15, .13, .8, .21), 'Student identity card', { name: 'Card type', weight: 500, s: 1.5, color: T.mut }), ...K.pill(I(.82, .02, 1, .14), T.acc, v.year, '#ffffff'), K.hline(m, W - m, m + (K.H - 2 * m) * .25, T.acc, .3), K.photo(I(.72, .3, 1, .94), { ax: 1 }), ...K.fields(I(0, .3, .68, .76), F, 2), K.barcode(I(0, .8, .66, 1), p.id));
    return o;
  }
  lay('Badge layouts', 'Student card · navy', student, { pal: P_('#1c2f5a', '#1c2f5a', { head: 'Cormorant Garamond' }), inst: 'University of Greyhaven', prog: 'BSc Natural Philosophy', seal: 'shield', motto: 'LUX · ET · LEX · ', year: '2026–27' });
  lay('Badge layouts', 'Student card · maroon', student, { pal: P_('#6a1a24', '#7a1f2b', { head: 'Playfair Display' }), inst: 'Caldris Conservatory', prog: 'Diploma in Composition', seal: 'laurel', motto: '', year: '2026–27' });
  lay('Badge layouts', 'Student card · forest', student, { pal: P_('#1f4a2a', '#2a6a3a', { head: 'Cinzel' }), inst: 'Wyvern Hollow College', prog: 'Applied Botany', seal: 'rosette', motto: 'RADIX · FLORET · ', year: '2026–27' });

  function access(K, v) {
    const T = K.theme(v.pal), { I, p, port, W, H } = K, o = [], diag = Math.hypot(W, H) * 1.3, bh = H * (port ? .17 : .3), rot = port ? -58 : -20;
    o.push({ type: 'rect', name: 'Access band', x: W / 2, y: H / 2, w: diag, h: bh, rot, fill: T.band, ...(v.holo ? { finish: 'holo', holoPat: 0, fill: '#ffffff' } : {}) });
    o.push({ type: 'text', name: 'Band text', x: W / 2, y: H / 2, w: diag * .5, h: bh * .62, rot, text: v.word, font: 'Archivo Black', weight: 400, size: bh * .42, align: 'center', color: v.holo ? '#111111' : T.onBand, spacing: .08 });
    if (port) o.push(K.text(I(0, 0, .74, .07), v.event, { name: 'Event', font: T.head, weight: 700, s: 2.6 }), K.text(I(0, .07, .74, .11), v.date, { name: 'Dates', weight: 500, s: 1.4, color: T.mut }), K.right(I(.36, .82, 1, .89), K.name(), { name: 'Name', weight: 700, s: 2.8 }), K.right(I(.36, .89, 1, .94), v.role, { name: 'Role', weight: 600, s: 1.8, color: T.acc }), K.right(I(.36, .95, 1, 1), 'Nº ' + K.digits(4), { name: 'Pass no.', font: 'IBM Plex Mono', weight: 500, s: 1.3, color: T.mut }));
    else o.push(K.text(I(0, 0, .62, .13), v.event, { name: 'Event', font: T.head, weight: 700, s: 2.8 }), K.text(I(0, .13, .62, .2), v.date, { name: 'Dates', weight: 500, s: 1.5, color: T.mut }), K.right(I(.62, 0, 1, .13), 'Nº ' + K.digits(4), { name: 'Pass no.', font: 'IBM Plex Mono', weight: 500, s: 1.6, color: T.mut }), K.text(I(0, .76, .62, .88), K.name(), { name: 'Name', weight: 700, s: 3 }), K.text(I(0, .88, .62, .98), v.role, { name: 'Role', weight: 600, s: 1.8, color: T.acc }), K.qr(I(.8, .7, 1, 1), 'https://example.com/pass/' + p.id, { ax: 1, ay: 1 }));
    return o;
  }
  lay('Badge layouts', 'All access · holo band', access, { pal: P_('#ffffff', '#7a3ab8', { head: 'Space Grotesk' }), word: 'ALL ACCESS', event: 'AURORA FESTIVAL', date: '18–20 JUL · LANTERN BAY', role: 'Production', holo: true });
  lay('Badge layouts', 'Backstage · black band', access, { pal: P_('#111111', '#e02a2a', { head: 'Oswald' }), word: 'BACKSTAGE', event: 'THE IRON TIDES · WORLD TOUR', date: 'NIGHT 14 · SALTMERE ARENA', role: 'Stage crew' });
  lay('Badge layouts', 'Crew pass · neon band', access, { pal: P_('#ff2d95', '#d4106f', { head: 'Rajdhani' }), word: 'CREW', event: 'NEON MILE NIGHT RUN', date: '31 OCT · CITY LOOP', role: 'Marshal' });

  function ticket(K, v) {
    const T = K.theme(v.pal), { p, port, W, H, m, u } = K, o = [], cut = port ? .76 : .74;
    if (port) o.push(K.hline(m * .5, W - m * .5, H * cut, T.mut, .3, { name: 'Perforation', dash: 1 }));
    else o.push(K.vline(W * cut, m * .5, H - m * .5, T.mut, .3, { name: 'Perforation', dash: 1 }));
    const Mn = port ? K.N({ x0: m, y0: m, x1: W - m, y1: H * cut - m }) : K.N({ x0: m, y0: m, x1: W * cut - m, y1: H - m });
    const St = port ? K.N({ x0: m, y0: H * cut + m * .7, x1: W - m, y1: H - m * .7 }) : K.N({ x0: W * cut + m * .6, y0: m, x1: W - m * .6, y1: H - m });
    o.push(K.text(Mn(0, 0, 1, .24), v.title, { name: 'Title', font: T.head, weight: 700, s: 4.2, color: T.acc }), K.text(Mn(0, .24, 1, .33), v.sub, { name: 'Venue', weight: 500, s: 1.6, color: T.mut }));
    o.push(...K.fields(Mn(0, .38, 1, .62), v.f1, v.f1.length), ...K.fields(Mn(0, .66, 1, 1), v.f2, v.f2.length, { maxH: 12, big: .5 }));
    if (port) o.push(K.barcode(St(0, 0, 1, .72), v.code + K.digits(6), { showText: false }), K.center(St(0, .76, 1, 1), v.stub + ' · ' + v.code + K.digits(6), { name: 'Stub text', font: 'IBM Plex Mono', weight: 500, s: 1.4, color: T.mut }));
    else { const sw = St(0, 0, 1, 1); o.push({ type: 'barcode', name: 'Barcode', x: (sw.x0 + sw.x1) / 2 + (sw.x1 - sw.x0) * .12, y: H / 2, w: (sw.y1 - sw.y0) * .92, h: (sw.x1 - sw.x0) * .58, rot: 90, data: v.code + K.digits(6), showText: false, color: T.ink }, { type: 'text', name: 'Stub text', x: sw.x0 + (sw.x1 - sw.x0) * .16, y: H / 2, w: (sw.y1 - sw.y0) * .92, h: (sw.x1 - sw.x0) * .28, rot: -90, text: v.stub, font: 'Archivo Black', weight: 400, size: (sw.x1 - sw.x0) * .2, align: 'center', color: T.acc, spacing: .1 }); }
    return o;
  }
  lay('Badge layouts', 'Ticket · concert', ticket, { pal: P_('#3a1a6a', '#6a2ad6', { head: 'Oswald' }), title: 'THE LANTERN ORCHESTRA', sub: 'Saltmere Opera House', f1: [['Date', '14 FEB'], ['Doors', '19:30'], ['Price', '42.00 CR']], f2: [['Tier', 'B'], ['Row', '14'], ['Seat', '22']], stub: 'ADMIT ONE', code: 'LO' });
  lay('Badge layouts', 'Ticket · cinema', ticket, { pal: P_('#a3141f', '#c4202b', { head: 'Bebas Neue' }), title: 'MIDNIGHT ON MARROW STREET', sub: 'Palace Picturehouse · Screen 3', f1: [['Date', 'FRI 13'], ['Show', '23:45'], ['Rating', 'PG-13']], f2: [['Row', 'G'], ['Seat', '7']], stub: 'ADMIT ONE', code: 'PP' });
  lay('Badge layouts', 'Ticket · boarding pass', ticket, { pal: P_('#0f4c81', '#0f4c81', { head: 'Space Grotesk' }), title: 'KESTREL AIRSHIPS', sub: 'Boarding pass · Economy', f1: [['From', 'SALTMERE'], ['To', 'GREYHAVEN'], ['Flight', 'KA 214']], f2: [['Gate', 'B4'], ['Boards', '19:05'], ['Seat', '22A']], stub: 'BOARDING', code: 'KA' });

  /* ---------- membership & loyalty ---------- */
  function member(K, v) {
    const T = K.theme(v.pal), { I, p, port, W, H, m } = K, o = [], iw = W - 2 * m, foil = v.foil ? { finish: 'foil', foil: v.foil } : {};
    if (port) { if (v.crest) o.push(K.seal(I(.33, .16, .67, .34), { style: v.crest, text: '', color: T.acc, ...foil })); o.push(K.center(I(0, .36, 1, .48), v.word, { name: 'Wordmark', font: T.head, weight: 600, s: 5.5, spacing: .25, color: T.acc, ...foil }), K.hline(W / 2 - iw * .15, W / 2 + iw * .15, m + (H - 2 * m) * .515, T.acc, .2, foil), K.center(I(0, .54, 1, .59), v.tag, { name: 'Tagline', weight: 500, s: 1.3, spacing: .45, color: T.mut }), K.center(I(0, .83, 1, .89), K.name().toUpperCase(), { name: 'Member', weight: 600, s: 2, spacing: .22 }), K.center(I(0, .9, 1, .96), 'Nº ' + K.digits(4), { name: 'Number', font: 'IBM Plex Mono', weight: 500, s: 1.7, color: T.mut })); }
    else { if (v.crest) o.push(K.seal(I(.42, .02, .58, .26), { style: v.crest, text: '', color: T.acc, ...foil })); const y = v.crest ? .3 : .24; o.push(K.center(I(.06, y, .94, y + .24), v.word, { name: 'Wordmark', font: T.head, weight: 600, s: 6.5, spacing: .3, color: T.acc, ...foil }), K.hline(W / 2 - iw * .1, W / 2 + iw * .1, m + (H - 2 * m) * (y + .29), T.acc, .2, foil), K.center(I(0, y + .32, 1, y + .4), v.tag, { name: 'Tagline', weight: 500, s: 1.4, spacing: .5, color: T.mut }), K.text(I(0, .86, .6, 1), K.name().toUpperCase(), { name: 'Member', weight: 600, s: 2, spacing: .25 }), K.right(I(.6, .86, 1, 1), 'Nº ' + K.digits(4), { name: 'Number', font: 'IBM Plex Mono', weight: 500, s: 1.8, color: T.mut })); }
    return o;
  }
  lay('Member layouts', 'Private club · gold foil', member, { pal: P_('#1c2a3a', '#1c2a3a', { head: 'Cormorant Garamond' }), word: 'MERIDIAN', tag: 'PRIVATE MEMBERS', foil: '#d6b25e', crest: 'laurel' });
  lay('Member layouts', 'Wine society · burgundy', member, { pal: P_('#5a1424', '#6a1a2b', { head: 'Playfair Display' }), word: 'VINTNERS', tag: 'SOCIETY OF THE CELLAR', crest: 'rosette' });
  lay('Member layouts', 'Racquet club · green', member, { pal: P_('#1f4a32', '#245a3c', { head: 'Cinzel' }), word: 'HOLLOWAY', tag: 'LAWN & RACQUET CLUB' });

  function library(K, v) {
    const T = K.theme(v.pal), { I, p, port } = K, o = [], F = [['Member', K.name()], ['Card no.', '2 9104 ' + K.digits(6)]];
    if (port) { o.push(K.center(I(0, 0, 1, .08), v.title, { name: 'Title', font: T.head, weight: 700, s: 2.8 }), K.center(I(0, .08, 1, .12), v.sub, { name: 'Subtitle', weight: 500, s: 1.4, color: T.mut })); let y = .3; if (v.photo) { o.push(K.photo(I(.25, .16, .75, .42), { look: 'bw' })); y = .48; } o.push(K.barcode(I(0, y, 1, y + .2), '29104' + K.digits(6)), ...K.fields(I(0, y + .25, 1, y + .4), F, 1, { align: 'center' }), K.center(I(0, .93, 1, 1), v.note, { name: 'Note', weight: 500, s: 1.1, color: T.mut })); }
    else { o.push(K.center(I(0, 0, 1, .13), v.title, { name: 'Title', font: T.head, weight: 700, s: 3 }), K.center(I(0, .13, 1, .2), v.sub, { name: 'Subtitle', weight: 500, s: 1.5, color: T.mut })); const x = v.photo ? .26 : 0; if (v.photo) o.push(K.photo(I(0, .26, .22, .88), { ax: 0, look: 'bw' })); o.push(K.barcode(I(x, .28, 1, .62), '29104' + K.digits(6)), ...K.fields(I(x, .66, 1, .86), F, 2), K.center(I(0, .9, 1, 1), v.note, { name: 'Note', weight: 500, s: 1.2, color: T.mut })); }
    if (v.band) o.push(K.rect(K.R(0, 0, 1, port ? .012 : .02), T.acc, { name: 'Top rule' }), K.rect(K.R(0, port ? .988 : .98, 1, 1), T.acc, { name: 'Bottom rule' }));
    return o;
  }
  lay('Member layouts', 'Library card · classic', library, { pal: P_('#2a3f2a', '#2a5a3a', { head: 'Playfair Display' }), title: 'ASHBY CROSS PUBLIC LIBRARY', sub: 'Borrower’s card', note: 'Please return this card if found · Not transferable', band: true });
  lay('Member layouts', 'Library card · modern', library, { pal: P_('#e0551d', '#e0551d', { head: 'Space Grotesk', font: 'Space Grotesk' }), title: 'FENWICK READING ROOMS', sub: 'Scan to borrow · open late', note: 'fenwick-reading.example' });
  lay('Member layouts', 'Archive reader pass', library, { pal: P_('#3a2a1a', '#6a4a2a', { head: 'Cinzel' }), title: 'MERIDIAN STATE ARCHIVE', sub: 'Reader’s ticket · Rare holdings', note: 'Pencils only in the reading room', photo: true, band: true });

  function gym(K, v) {
    const T = K.theme(v.pal), { I, R, p, port } = K, o = [];
    const stripes = r => ({ type: 'pattern', name: 'Stripes', ...K.box(r), kind: 'stripes', color: T.band, color2: T.acc, density: 9 });
    if (port) o.push(stripes(R(0, 0, 1, .36)), K.qr(I(.24, .06, .76, .34), 'https://example.com/m/' + p.id, { quiet: 2, bg: '#ffffff' }), K.center(I(0, .42, 1, .56), v.brand, { name: 'Brand', font: 'Bebas Neue', weight: 400, s: 8 }), K.center(I(0, .56, 1, .61), v.tier, { name: 'Tier', weight: 700, s: 1.6, spacing: .25, color: T.acc }), K.center(I(0, .72, 1, .79), K.name(), { name: 'Member', weight: 700, s: 2.8 }), K.center(I(0, .79, 1, .84), 'MEMBER SINCE ' + p.iss.y, { name: 'Since', weight: 600, s: 1.3, spacing: .15, color: T.mut }), K.center(I(0, .92, 1, 1), p.id, { name: 'Member no.', font: 'IBM Plex Mono', weight: 500, s: 1.6, color: T.mut }));
    else o.push(stripes(R(.6, 0, 1, 1)), K.qr(I(.68, .14, .98, .86), 'https://example.com/m/' + p.id, { quiet: 2, bg: '#ffffff' }), K.text(I(0, .02, .56, .3), v.brand, { name: 'Brand', font: 'Bebas Neue', weight: 400, s: 8 }), K.text(I(0, .3, .56, .4), v.tier, { name: 'Tier', weight: 700, s: 1.6, spacing: .25, color: T.acc }), K.text(I(0, .64, .56, .76), K.name(), { name: 'Member', weight: 700, s: 2.6 }), K.text(I(0, .76, .56, .86), 'MEMBER SINCE ' + p.iss.y, { name: 'Since', weight: 600, s: 1.3, spacing: .15, color: T.mut }), K.text(I(0, .9, .56, 1), p.id, { name: 'Member no.', font: 'IBM Plex Mono', weight: 500, s: 1.6, color: T.mut }));
    return o;
  }
  lay('Member layouts', 'Gym · volt', gym, { pal: P_('#111111', '#c8ff1f'), brand: 'IRONWORKS GYM', tier: 'BLACK MEMBER' });
  lay('Member layouts', 'Climbing wall · orange', gym, { pal: P_('#2a1a0a', '#ff7a1f'), brand: 'CRUX BOULDERING', tier: 'UNLIMITED' });
  lay('Member layouts', 'Swim club · aqua', gym, { pal: P_('#0a3a5a', '#2fd3e0'), brand: 'TIDEPOOL SWIM CLUB', tier: 'LANE PASS' });

  function punch(K, v) {
    const T = K.theme(v.pal), { I, p, port, u } = K, o = [], cols = port ? 2 : 5, rows = 10 / cols;
    const grid = port ? I(0, .34, 1, .9) : I(0, .32, 1, .84), cw = K.rw(grid) / cols, ch = K.rh(grid) / rows, d = Math.min(cw, ch) * .76, done = 3 + hashStr(v.title) % 4;
    if (port) o.push(K.center(I(0, 0, 1, .1), v.title, { name: 'Title', font: T.head, weight: 700, s: 4.4, color: T.acc }), K.center(I(0, .1, 1, .14), v.sub, { name: 'Subtitle', weight: 500, s: 1.4, color: T.mut }), { type: 'shape', name: 'Badge', ...K.sq(I(.36, .16, .64, .31)), kind: 'burst', points: 18, inner: .82, fill: T.acc }, K.center(I(.36, .16, .64, .31), v.badge, { name: 'Badge text', font: 'Archivo Black', weight: 400, s: 1.8, color: '#ffffff', lineH: 1 }));
    else o.push(K.text(I(0, 0, .74, .17), v.title, { name: 'Title', font: T.head, weight: 700, s: 4.6, color: T.acc }), K.text(I(0, .17, .74, .25), v.sub, { name: 'Subtitle', weight: 500, s: 1.5, color: T.mut }), { type: 'shape', name: 'Badge', ...K.sq(I(.78, 0, 1, .27), 1, 0), kind: 'burst', points: 18, inner: .82, fill: T.acc }, K.center(I(.78, 0, 1, .27), v.badge, { name: 'Badge text', font: 'Archivo Black', weight: 400, s: 1.8, color: '#ffffff', lineH: 1 }));
    for (let i = 0; i < 10; i++) {
      const c = i % cols, r = i / cols | 0, x = grid.x0 + cw * (c + .5), y = grid.y0 + ch * (r + .5), last = i === 9;
      o.push({ type: 'ellipse', name: 'Punch ' + (i + 1), x, y, w: d, h: d, fillOn: last || i < done, fill: last ? T.acc : T.acc, opacity: !last && i < done ? .85 : 1, stroke: T.acc, strokeW: .28 * u });
      if (last) o.push({ type: 'text', name: 'Free', x, y, w: d * .9, h: d * .5, text: 'FREE', font: 'Archivo Black', weight: 400, size: d * .24, align: 'center', color: '#ffffff' });
    }
    o.push(K.center(port ? I(0, .92, 1, 1) : I(0, .88, 1, 1), v.foot, { name: 'Footer', weight: 500, s: 1.3, color: T.mut }));
    return o;
  }
  lay('Member layouts', 'Coffee punch card', punch, { pal: P_('#4a2a1a', '#7a4a2a', { head: 'Playfair Display' }), title: 'Gearwheel Coffee', sub: 'One punch per cup · any size', badge: '10TH\nFREE', foot: 'Lantern Row · open from 7' });
  lay('Member layouts', 'Bakery stamp card', punch, { pal: P_('#a34a6a', '#c45a7a', { head: 'Caveat', font: 'Inter' }), title: 'Rosemary & Rye', sub: 'Collect ten loaves', badge: 'A LOAF\nON US', foot: 'Baked fresh every dawn' });
  lay('Member layouts', 'Car wash card', punch, { pal: P_('#0f4c81', '#1a7ad6', { head: 'Archivo Black' }), title: 'SUDS & SHINE', sub: 'Ten washes, one on the house', badge: 'FREE\nWASH', foot: 'Bay 3 · Silverford ring road' });

  function transit(K, v) {
    const T = K.theme(v.pal), { I, R, p, port, W, u } = K, o = [];
    const gfx = port ? R(0, .42, 1, .66) : R(0, .46, 1, .78);
    if (v.kind === 'metro') { const lc = [T.acc, T.c2, T.c3]; lc.forEach((c, i) => { const y = gfx.y0 + K.rh(gfx) * (.22 + i * .28); o.push({ type: 'rect', name: 'Route line ' + (i + 1), x: W / 2, y, w: W, h: 2.2 * u, radius: 0, fill: c }); }); [.2, .45, .7].forEach((f, i) => o.push({ type: 'ellipse', name: 'Station ' + (i + 1), x: W * f, y: gfx.y0 + K.rh(gfx) * .5, w: 3.4 * u, h: 3.4 * u, fill: '#ffffff', stroke: '#111111', strokeW: .5 * u })); }
    else if (v.kind === 'tram') o.push(K.rect({ x0: 0, y0: gfx.y0 + K.rh(gfx) * .25, x1: W, y1: gfx.y0 + K.rh(gfx) * .55 }, T.acc, { name: 'Livery stripe' }), K.rect({ x0: 0, y0: gfx.y0 + K.rh(gfx) * .62, x1: W, y1: gfx.y0 + K.rh(gfx) * .7 }, T.band, { name: 'Livery pinstripe' }));
    else o.push({ type: 'pattern', name: 'Waves', ...K.box(gfx), kind: 'waves', color: T.acc, color2: T.c2, color3: T.c3, density: 16, lw: .12, amp: 1 });
    if (port) o.push(K.center(I(0, 0, 1, .1), v.word, { name: 'Wordmark', font: T.head, weight: 700, s: 5 }), K.center(I(0, .1, 1, .14), v.sub, { name: 'Subtitle', weight: 500, s: 1.4, color: T.mut }), ...K.pill(I(.24, .18, .76, .24), T.band, v.zone, '#ffffff'), K.center(I(0, .9, 1, 1), '6014 ' + K.digits(4) + ' ' + K.digits(8).slice(4), { name: 'Card number', font: 'Share Tech Mono', weight: 400, s: 2, spacing: .1 }));
    else o.push(K.text(I(0, 0, .64, .2), v.word, { name: 'Wordmark', font: T.head, weight: 700, s: 5.2 }), K.text(I(0, .2, .64, .28), v.sub, { name: 'Subtitle', weight: 500, s: 1.5, color: T.mut }), ...K.pill(I(.74, .02, 1, .16), T.band, v.zone, '#ffffff'), K.text(I(0, .88, .7, 1), '6014 ' + K.digits(4) + ' ' + K.digits(8).slice(4), { name: 'Card number', font: 'Share Tech Mono', weight: 400, s: 2.1, spacing: .1 }));
    return o;
  }
  lay('Member layouts', 'Transit · metro lines', transit, { pal: P_('#111111', '#e02a2a', { c2: '#ffb000', c3: '#1a7ad6', head: 'Space Grotesk' }), word: 'MERROW METRO', sub: 'Stored-value travel card', zone: 'ZONES 1–3', kind: 'metro' });
  lay('Member layouts', 'Transit · tram livery', transit, { pal: P_('#1f4a32', '#e8b21f', { head: 'Oswald' }), word: 'CALDRIS TRAMS', sub: 'Season ticket', zone: 'ALL LINES', kind: 'tram' });
  lay('Member layouts', 'Transit · ferry pass', transit, { pal: P_('#0a3a5a', '#2f7fc4', { c2: '#5fb8e0', c3: '#bfe6f2', head: 'Playfair Display' }), word: 'Lantern Bay Ferries', sub: 'Harbour hopper pass', zone: '30 DAYS', kind: 'ferry' });

  function hotel(K, v) {
    const T = K.theme(v.pal), { I, p, port, W, m, u } = K, o = [], foil = v.foil ? { finish: 'foil', foil: v.foil } : {};
    if (v.kind === 'deco') o.push({ type: 'frame', name: 'Deco frame', ...K.box(K.I(0, 0, 1, 1)), style: 'deco', color: T.acc, size: 8 * u, ...foil });
    if (v.kind === 'resort') o.push({ type: 'pattern', name: 'Sunburst', ...K.full(), kind: 'rays', color: T.soft, density: 48, amp: .8, opacity: .55 });
    const st = port ? [.2, .38, .44, .58, .62, .66, .86, .92] : [.1, .42, .44, .64, .66, .76, .84, .94];
    if (v.kind !== 'modern') o.push(K.seal(I(.35, st[0], .65, st[1]), { style: v.kind === 'deco' ? 'laurel' : 'sun', text: '', points: 16, color: T.acc, ...foil }));
    o.push(K.center(I(v.kind === 'deco' ? .1 : 0, st[2], v.kind === 'deco' ? .9 : 1, st[3]), v.name, { name: 'Hotel name', font: T.head, weight: v.kind === 'modern' ? 500 : 700, s: v.kind === 'resort' ? 7 : 4.6, spacing: v.kind === 'modern' ? .45 : .14, color: T.acc, ...foil }));
    o.push(K.center(I(0, st[4], 1, st[5]), v.sub, { name: 'Subtitle', weight: 500, s: 1.4, spacing: .35, color: T.mut }));
    o.push(K.center(I(0, st[6], 1, st[7]), 'ROOM KEY · PLEASE RETURN TO RECEPTION', { name: 'Key note', weight: 600, s: 1.1, spacing: .2, color: T.mut }));
    if (v.kind === 'modern') o.push(K.rect(K.R(0, .97, 1, 1), T.acc, { name: 'Accent rule' }));
    return o;
  }
  lay('Member layouts', 'Hotel key · art deco', hotel, { pal: P_('#1c2a3a', '#1c2a3a', { head: 'Playfair Display' }), name: 'THE ALDERMERE', sub: 'GRAND HOTEL · EST. 1931', kind: 'deco', foil: '#d6b25e' });
  lay('Member layouts', 'Hotel key · modern', hotel, { pal: P_('#111111', '#c9a04e', { head: 'Space Grotesk' }), name: 'NORTH & PINE', sub: 'ROOMS · BAR · ROOF', kind: 'modern' });
  lay('Member layouts', 'Resort key · sunburst', hotel, { pal: P_('#0f6a6a', '#0f7f7a', { head: 'Caveat', soft: '#f6e3b4' }), name: 'Palmhaven', sub: 'ISLAND RESORT & SPA', kind: 'resort' });

  /* ---------- genre ---------- */
  function scifi(K, v) {
    const T = K.theme(v.pal), { I, p, port, W, H, u } = K, o = [{ type: 'frame', name: 'HUD brackets', ...K.box(K.R(.02, .02 * W / H, .98, 1 - .02 * W / H)), style: 'brackets', color: T.acc, size: 5 * u, lw: .3 * u }];
    const mono = { f: { font: 'Share Tech Mono', lfont: 'Orbitron', weight: 400, lweight: 600, lspacing: .12, lupper: true } };
    const F = [['Name', p.sur + ', ' + p.first, 2], ['Rank', v.rank], ['Deck', v.deck], ['Service no.', p.id], ['Clearance', v.clr]];
    const data = `GENOME ${hashStr(p.id).toString(16).toUpperCase().padStart(8, '0')} · ORIGIN ${p.place} · ${v.extra}`;
    const ph = { radius: .4 * u, border: .4 * u, borderColor: T.acc, look: v.look || 'color' };
    if (port) o.push(K.center(I(0, 0, 1, .06), v.head, { name: 'Header', font: 'Orbitron', weight: 700, s: 2, spacing: .2, color: T.acc }), K.photo(I(.22, .08, .78, .38), ph), ...K.fields(I(0, .41, 1, .72), F, 2, mono), K.qr(I(0, .75, .3, .95), 'https://example.com/crew/' + p.id, { ax: 0, dots: true, bgOn: false, color: T.ink }), K.holo(I(.7, .76, 1, .95), { ax: 1, shape: 'hex', holoPat: 3, emblem: 'orbit' }), K.center(I(.32, .78, .68, .93), data, { name: 'Data line', font: 'Share Tech Mono', weight: 400, size: 1.05 * u, lineH: 1.4, color: T.mut }));
    else o.push(K.text(I(0, 0, 1, .12), v.head, { name: 'Header', font: 'Orbitron', weight: 700, s: 2, spacing: .2, color: T.acc }), K.photo(I(0, .18, .28, .8), { ax: 0, ...ph }), ...K.fields(I(.32, .18, .78, .8), F, 2, mono), K.qr(I(.82, .16, 1, .5), 'https://example.com/crew/' + p.id, { ax: 1, dots: true, bgOn: false, color: T.ink }), K.holo(I(.82, .54, 1, .82), { ax: 1, shape: 'hex', holoPat: 3, emblem: 'orbit' }), K.text(I(.32, .86, 1, 1), data, { name: 'Data line', font: 'Share Tech Mono', weight: 400, s: 1.1, color: T.mut }));
    return o;
  }
  lay('Genre layouts', 'Starship crew', scifi, { pal: P_('#0b1d2a', '#16a3b8'), head: 'UES KESTREL · CREW MANIFEST', rank: 'LT. CMDR', deck: 'DECK 7', clr: 'BRIDGE', extra: 'CRYO OK' });
  lay('Genre layouts', 'Colony resident', scifi, { pal: P_('#2a1a0a', '#e0861f'), head: 'ARES BASIN COLONY · RESIDENT', rank: 'SETTLER', deck: 'HAB 12', clr: 'DOME', extra: 'O₂ RATION A' });
  lay('Genre layouts', 'Android registry', scifi, { pal: P_('#1a0a2a', '#c43ad6'), head: 'SYNTHETIC PERSONS REGISTRY', rank: 'UNIT', deck: 'SERIES 9', clr: 'CIVIL', extra: 'EMPATHY v4.2', look: 'duo' });

  function fantasy(K, v) {
    const T = K.theme(v.pal), { I, p, port, W, H, u } = K, o = [{ type: 'frame', name: 'Filigree', ...K.box(K.R(.03, .03 * W / H, .97, 1 - .03 * W / H)), style: 'filigree', color: T.acc, size: 8 * u }];
    const wax = (r) => { const s = K.sq(r, .5, .5); return [{ type: 'ellipse', name: 'Wax seal', ...s, fill: v.wax, fill2: shiftColor(v.wax, 0, 1, -.18), grad: true, angle: 60, relief: .75 }, { type: 'seal', name: 'Seal impression', x: s.x, y: s.y, w: s.w * .7, h: s.h * .7, style: 'star', text: '', points: 8, color: shiftColor(v.wax, 0, 1, -.12), relief: -.45 }]; };
    const ph = { look: 'sepia', sepia: .9, lines: v.lines || 0, radius: 0 }, F = [['Charter no.', 'XLII-' + K.digits(3)], ['Sworn', p.iss.str]];
    if (port) { const pr = I(.24, .14, .76, .46), pe = K.photo(pr, ph); pe.radius = pe.w / 2; o.push(K.center(I(.04, 0, .96, .12), v.title, { name: 'Arched title', font: 'Cinzel', weight: 700, s: 2.2, arc: 60, color: T.acc }), pe, K.center(I(0, .49, 1, .59), K.name(), { name: 'Name', font: v.nameFont, weight: 400, s: 4 }), K.center(I(0, .59, 1, .64), v.rank, { name: 'Rank', font: 'Cormorant Garamond', weight: 600, italic: true, s: 2, color: T.mut }), ...K.fields(I(0, .67, 1, .8), F, 2, { align: 'center', f: { font: 'Cormorant Garamond', lfont: 'Cinzel' } }), ...wax(I(.36, .82, .64, 1))); }
    else { const pe = K.photo(I(.03, .24, .3, .9), ph); pe.radius = pe.w / 2; o.push(K.center(I(.1, 0, .9, .22), v.title, { name: 'Arched title', font: 'Cinzel', weight: 700, s: 2.4, arc: 50, color: T.acc }), pe, K.text(I(.35, .3, .96, .46), K.name(), { name: 'Name', font: v.nameFont, weight: 400, s: 4.2 }), K.text(I(.35, .46, .96, .55), v.rank, { name: 'Rank', font: 'Cormorant Garamond', weight: 600, italic: true, s: 2.1, color: T.mut }), ...K.fields(I(.35, .6, .78, .8), F, 2, { f: { font: 'Cormorant Garamond', lfont: 'Cinzel' } }), ...wax(I(.8, .66, 1, 1))); }
    return o;
  }
  lay('Genre layouts', 'Guild charter', fantasy, { pal: P_('#3a2a10', '#7a5a1c'), title: 'GUILD OF WANDERING CARTOGRAPHERS', rank: 'Journeyman of maps', nameFont: 'UnifrakturMaguntia', wax: '#8e1f1f' });
  lay('Genre layouts', 'Mage academy', fantasy, { pal: P_('#2a1a4a', '#5a3a9a'), title: 'ACADEMY OF THE NINE LANTERNS', rank: 'Second-year adept', nameFont: 'Cinzel', wax: '#2a3f8a', lines: .5 });
  lay('Genre layouts', 'Royal courier', fantasy, { pal: P_('#1a3a2a', '#2f6a44'), title: 'ROYAL POST OF THORNWICK', rank: 'Courier of the long road', nameFont: 'Cormorant Garamond', wax: '#2f6b3a' });

  function noir(K, v) {
    const T = K.theme(v.pal), { I, p, port, W, H, u } = K, o = [{ type: 'frame', name: 'Deco corners', ...K.box(K.R(.025, .025 * W / H, .975, 1 - .025 * W / H)), style: 'deco', color: T.acc, size: 7 * u }];
    const F = [['Licensee', K.name(), 2], ['Licence no.', v.pre + '-' + K.digits(4)], ['Issued', p.iss.str], ['Height', p.height + ' cm'], ['Eyes', v.eyes]];
    const typed = { f: { font: 'Courier Prime', lfont: 'Playfair Display', lweight: 700, weight: 700 } };
    const ph = { look: 'bw', sepia: .55, border: .7 * u, borderColor: '#f4efe2', radius: 0 };
    if (port) o.push(K.center(I(.04, .02, .96, .08), v.title, { name: 'Bureau', font: 'Playfair Display', weight: 800, s: 2.3, spacing: .1 }), K.center(I(0, .08, 1, .11), v.sub, { name: 'Licence type', font: 'Playfair Display', italic: true, weight: 500, s: 1.4, color: T.mut }), K.photo(I(.22, .14, .78, .44), ph), ...K.fields(I(.02, .47, .98, .8), F, 2, typed), K.sign(I(.04, .82, .6, .94)), K.right(I(.5, .94, .98, 1), 'Nº ' + K.digits(6), { name: 'Serial', font: 'Share Tech Mono', weight: 400, s: 1.8, color: '#b2352b' }), K.seal(I(.66, .8, .96, .94), { style: 'rosette', text: '', points: 10, finish: 'blind', relief: .85 }));
    else o.push(K.center(I(.04, .02, .96, .13), v.title, { name: 'Bureau', font: 'Playfair Display', weight: 800, s: 2.6, spacing: .12 }), K.center(I(0, .13, 1, .19), v.sub, { name: 'Licence type', font: 'Playfair Display', italic: true, weight: 500, s: 1.5, color: T.mut }), K.photo(I(.04, .25, .3, .88), { ax: 0, ...ph }), ...K.fields(I(.35, .25, .96, .74), F, 2, typed), K.sign(I(.35, .78, .62, .98)), K.right(I(.62, .86, .96, .98), 'Nº ' + K.digits(6), { name: 'Serial', font: 'Share Tech Mono', weight: 400, s: 1.8, color: '#b2352b' }), K.seal(I(.8, .56, .98, .84), { style: 'rosette', text: '', points: 10, finish: 'blind', relief: .85, ax: 1 }));
    return o;
  }
  lay('Genre layouts', 'Private eye licence', noir, { pal: P_('#2a2018', '#6a4a2a'), title: 'BUREAU OF INQUIRY · MARROW CITY', sub: 'Licence to conduct private investigations', pre: 'PI', eyes: 'GREY' });
  lay('Genre layouts', 'Press card 1947', noir, { pal: P_('#1a1a1a', '#3a3a3a'), title: 'THE MARROW CITY EVENING STAR', sub: 'Accredited correspondent', pre: 'ES', eyes: 'BROWN' });
  lay('Genre layouts', 'Radio operator', noir, { pal: P_('#1a2a3a', '#2a4a6a'), title: 'HARBOUR WIRELESS SERVICE', sub: 'Certified radio operator · second class', pre: 'RO', eyes: 'BLUE' });

  function cyber(K, v) {
    const T = K.theme(v.pal), { I, R, p, port, W, H, u } = K, o = [];
    [[0, .16, .03, .28, T.acc], [0, .32, .018, .36, T.c2], [0, .62, .04, .66, T.acc], [.96, .04, 1, .07, T.c2], [.9, .9, 1, .93, T.acc]].forEach(([a, b, c, d, f], i) => o.push(K.rect(R(a, b, c, d), f, { name: 'Glitch bar ' + (i + 1) })));
    const mono = { f: { font: 'Share Tech Mono', lfont: 'Share Tech Mono', weight: 400, lweight: 400, lupper: true } }, F = [['ID', p.id], ['LVL', v.lvl], ['EXP', String(p.exp.y)]];
    const tail = `//${hashStr(p.sur).toString(16).toUpperCase()} · SIG OK · ${v.org}`;
    if (port) { o.push(K.center(I(0, 0, 1, .05), v.org, { name: 'Org', font: 'Share Tech Mono', weight: 400, s: 1.5, spacing: .3, color: T.acc })); if (v.photo) o.push(K.photo(I(.18, .07, .82, .4), { look: 'duo', tint: T.acc, radius: 0 })); else o.push(K.qr(I(.2, .08, .8, .4), 'https://example.com/n/' + p.id, { dots: true, bgOn: false, color: T.ink })); o.push(K.center(I(0, .45, 1, .58), p.sur, { name: 'Handle', font: 'Rajdhani', weight: 700, s: 7 }), K.center(I(0, .58, 1, .63), v.role, { name: 'Role', font: 'Share Tech Mono', weight: 400, s: 1.6, color: T.mut }), ...K.fields(I(0, .68, 1, .82), F, 3, { align: 'center', ...mono }), K.center(I(0, .9, 1, 1), tail, { name: 'Signature line', font: 'Share Tech Mono', weight: 400, s: 1.1, color: T.mut })); }
    else { o.push(K.text(I(0, 0, .7, .12), v.org, { name: 'Org', font: 'Share Tech Mono', weight: 400, s: 1.6, spacing: .3, color: T.acc })); if (v.photo) o.push(K.photo(I(.72, .04, 1, .78), { ax: 1, look: 'duo', tint: T.acc, radius: 0 })); else o.push(K.qr(I(.72, .06, 1, .66), 'https://example.com/n/' + p.id, { ax: 1, dots: true, bgOn: false, color: T.ink })); o.push(K.text(I(0, .2, .68, .44), p.sur, { name: 'Handle', font: 'Rajdhani', weight: 700, s: 7 }), K.text(I(0, .44, .68, .52), v.role, { name: 'Role', font: 'Share Tech Mono', weight: 400, s: 1.7, color: T.mut }), ...K.fields(I(0, .6, .68, .84), F, 3, mono), K.text(I(0, .9, 1, 1), tail, { name: 'Signature line', font: 'Share Tech Mono', weight: 400, s: 1.1, color: T.mut })); }
    return o;
  }
  lay('Genre layouts', 'Netrunner ID', cyber, { pal: P_('#0a0a12', '#ff2d95', { c2: '#2de2ff' }), org: 'NEON MILE // FREELANCE', role: 'NETRUNNER · TIER B', lvl: '07' });
  lay('Genre layouts', 'Corp employee', cyber, { pal: P_('#0a0a12', '#ffd23d', { c2: '#ff5a1f' }), org: 'HALCYON ARCOLOGY', role: 'DATA HYGIENE · F-44', lvl: '03', photo: true });
  lay('Genre layouts', 'Street clinic pass', cyber, { pal: P_('#0a0a12', '#3dff8a', { c2: '#2de2ff' }), org: 'RIPPERDOC CO-OP', role: 'PATIENT · WALK-IN', lvl: '01' });

  function waste(K, v) {
    const T = K.theme(v.pal), { I, R, p, port } = K, o = [{ type: 'pattern', name: 'Hazard stripes', ...K.box(port ? R(0, .91, 1, 1) : R(0, .85, 1, 1)), kind: 'stripes', color: '#111111', color2: v.haz, density: 9 }];
    const mono = { f: { font: 'Share Tech Mono', lfont: 'Oswald', weight: 400, lweight: 500, lupper: true } }, F = [['Name', K.name(), 2], ['Permit', p.id], [v.f1[0], v.f1[1]], [v.f2[0], v.f2[1]], ['Expires', p.exp.str]];
    const ph = { look: 'bw', contrast: 1.35, halftone: .35, radius: 0 }, stamp = (r) => ({ type: 'stamp', name: 'Stamp', ...K.box(r), style: 'rect', rot: 10, text: v.st1, center: v.stc, text2: v.st2, color: '#b3302a', distress: .6 });
    if (port) o.push(K.center(I(0, 0, 1, .07), v.title, { name: 'Title', font: 'Bebas Neue', weight: 400, s: 4.4, spacing: .06 }), K.center(I(0, .07, 1, .1), v.sub, { name: 'Subtitle', font: 'Share Tech Mono', weight: 400, s: 1.3, color: T.mut }), K.photo(I(.22, .12, .78, .42), ph), ...K.fields(I(0, .45, 1, .76), F, 2, mono), stamp(I(.3, .77, .9, .9)));
    else o.push(K.text(I(0, 0, 1, .14), v.title, { name: 'Title', font: 'Bebas Neue', weight: 400, s: 5, spacing: .06 }), K.text(I(0, .14, 1, .2), v.sub, { name: 'Subtitle', font: 'Share Tech Mono', weight: 400, s: 1.4, color: T.mut }), K.photo(I(0, .24, .28, .78), { ax: 0, ...ph }), ...K.fields(I(.32, .24, .74, .78), F, 2, mono), stamp(I(.76, .36, 1, .66)));
    return o;
  }
  lay('Genre layouts', 'Wasteland permit', waste, { pal: P_('#2a2010', '#8a6a1c'), title: 'SECTOR 9 · SALVAGE PERMIT', sub: 'Issued by the Dustline Assembly', f1: ['Rations', 'CLASS C'], f2: ['Water tags', '3'], haz: '#f2b632', st1: 'GATE 4', st2: 'DUSTLINE', stc: 'INSPECTED' });
  lay('Genre layouts', 'Expedition member', waste, { pal: P_('#1a2a3a', '#2f5a8a'), title: 'FROSTLINE EXPEDITION', sub: 'Polar survey party · season 3', f1: ['Unit', 'SLED B'], f2: ['Blood', 'O+'], haz: '#ff5a1f', st1: 'BASE CAMP', st2: 'NORTH', stc: 'CLEARED' });
  lay('Genre layouts', 'Salvage licence', waste, { pal: P_('#2a1a1a', '#8a2a1a'), title: 'RUSTWATER SCRAP GUILD', sub: 'Licensed salvager · heavy metals', f1: ['Rig', 'CRANE 2'], f2: ['Quota', '40 T'], haz: '#e0d21f', st1: 'YARD 7', st2: 'RUSTWATER', stc: 'PAID' });

  /* ---------- backs ---------- */
  function backInfo(K, v) {
    const T = K.theme(v.pal), { I, R, p, port, u } = K, o = [K.rect(port ? R(0, .06, 1, .17) : R(0, .09, 1, .27), '#0b0b0c', { name: 'Magnetic stripe' })];
    const terms = 'This card remains the property of its fictional issuer.\nIt is not transferable and must be shown on request.\nIf found, please return it to any branch office.';
    const label = 'AUTHORISED SIGNATURE · NOT VALID UNLESS SIGNED';
    if (port) {
      o.push(K.rect(I(0, .2, 1, .3), '#ebe6dc', { name: 'Signature panel' }), K.sign(I(.04, .2, .7, .3), { color: '#1f2b5c' }), K.center(I(0, .31, 1, .35), label, { name: 'Signature label', weight: 600, s: .95, spacing: .1, color: T.mut }));
      if (v.kind === 'terms') o.push(K.center(I(0, .4, 1, .74), terms, { name: 'Terms', weight: 500, s: 1.3, lineH: 1.5, color: T.mut }), K.holo(I(.36, .78, .64, .98), { shape: 'oval', emblem: 'ring', holoPat: 2 }));
      if (v.kind === 'qr') o.push(K.qr(I(.28, .4, .72, .66), 'https://example.com/verify/' + p.id), K.center(I(0, .7, 1, .98), terms, { name: 'Terms', weight: 500, s: 1.2, lineH: 1.5, color: T.mut }));
      if (v.kind === 'contact') o.push(...K.fields(I(0, .4, 1, .76), [['Next of kin', v.kin, 2], ['Phone', '+00 555 0142'], ['Reference', p.id], ['Notes', v.notes, 2]], 2), K.center(I(0, .82, 1, .98), 'Carry this card at all times.', { name: 'Note', weight: 500, s: 1.2, color: T.mut }));
    } else {
      o.push(K.rect(I(0, .36, .66, .54), '#ebe6dc', { name: 'Signature panel' }), K.sign(I(.02, .36, .5, .54), { color: '#1f2b5c' }), K.text(I(0, .55, .66, .62), label, { name: 'Signature label', weight: 600, s: .95, spacing: .1, color: T.mut }));
      if (v.kind === 'terms') o.push(K.text(I(0, .66, 1, .98), terms, { name: 'Terms', weight: 500, s: 1.3, lineH: 1.45, color: T.mut }), K.holo(I(.72, .34, 1, .62), { ax: 1, shape: 'oval', emblem: 'ring', holoPat: 2 }));
      if (v.kind === 'qr') o.push(K.qr(I(.72, .32, 1, .64), 'https://example.com/verify/' + p.id, { ax: 1 }), K.text(I(0, .68, 1, .98), terms, { name: 'Terms', weight: 500, s: 1.25, lineH: 1.45, color: T.mut }));
      if (v.kind === 'contact') o.push(...K.fields(I(0, .66, 1, .98), [['Next of kin', v.kin], ['Phone', '+00 555 0142'], ['Notes', v.notes]], 3), K.right(I(.7, .36, 1, .5), 'REF ' + p.id, { name: 'Reference', font: 'IBM Plex Mono', weight: 500, s: 1.5, color: T.mut }));
    }
    return o;
  }
  lay('Back layouts', 'Back · stripe, signature & terms', backInfo, { pal: P_('#333333', '#555555'), kind: 'terms' });
  lay('Back layouts', 'Back · stripe & verify QR', backInfo, { pal: P_('#333333', '#555555'), kind: 'qr' });
  lay('Back layouts', 'Back · emergency contact', backInfo, { pal: P_('#333333', '#b3302a'), kind: 'contact', kin: 'M. Ashgrove (sister)', notes: 'Wears contact lenses' });

  function backId(K, v) {
    const T = K.theme(v.pal), { I, p, port, W, m, u } = K, o = [];
    const F = [['Place of birth', p.place, 2], ['Date of issue', p.iss.str], ['Authority', v.auth, 2], ['Height', p.height + ' cm']];
    if (v.kind === 'cats') {
      const rows = ['AM', 'A1', 'B', 'BE', 'C1'], tb = port ? I(0, .08, 1, .7) : I(0, .1, 1, .78), rh = K.rh(tb) / rows.length, cols = [.0, .2, .48, .76];
      ['Cat.', 'Valid from', 'Valid until', 'Codes'].forEach((h, i) => o.push(K.text({ x0: tb.x0 + K.rw(tb) * cols[i], y0: tb.y0 - rh * .7, x1: tb.x0 + K.rw(tb) * (cols[i + 1] || 1), y1: tb.y0 }, h, { name: 'Header ' + h, weight: 700, s: 1.1, spacing: .1, color: T.mut })));
      rows.forEach((c, r) => { const y0 = tb.y0 + r * rh; o.push(K.hline(tb.x0, tb.x1, y0, T.mut, .1, { opacity: .6 })); const vals = [c, r < 3 ? p.iss.str : '—', r < 3 ? p.exp.str : '—', r === 2 ? '01.01' : '']; vals.forEach((t, i) => t && o.push(K.text({ x0: tb.x0 + K.rw(tb) * cols[i], y0, x1: tb.x0 + K.rw(tb) * (cols[i + 1] || 1), y1: y0 + rh }, t, { name: 'Cell ' + c + i, font: i ? 'IBM Plex Mono' : 'Archivo Black', weight: i ? 500 : 400, s: i ? 1.5 : 2, color: i ? T.ink : T.acc }))); });
      o.push(K.hline(tb.x0, tb.x1, tb.y1, T.mut, .1, { opacity: .6 }), K.barcode(port ? I(0, .76, 1, .9) : I(0, .84, .6, 1), p.id, { showText: false }), port ? K.center(I(0, .92, 1, 1), 'Nº ' + p.id, { name: 'Number', font: 'IBM Plex Mono', weight: 500, s: 1.4, color: T.mut }) : K.right(I(.62, .86, 1, 1), 'Nº ' + p.id, { name: 'Number', font: 'IBM Plex Mono', weight: 500, s: 1.6, color: T.mut }));
      return o;
    }
    if (port) { o.push(...K.fields(I(0, 0, 1, .3), F, 2)); if (v.kind === '2d') o.push({ type: 'matrix', name: '2D code', ...K.sq(I(0, .34, .4, .58), 0, .5), data: p.id, color: T.ink }, K.barcode(I(.44, .36, 1, .56), p.id, { kind: 'stack', showText: false })); else o.push(K.barcode(I(0, .34, .62, .54), p.id), K.ghost(I(.68, .32, 1, .58), { ax: 1 })); o.push(K.mrz(I(0, .64, 1, 1), 3)); }
    else { o.push(...K.fields(I(0, 0, 1, .3), F, 3)); if (v.kind === '2d') o.push({ type: 'matrix', name: '2D code', ...K.sq(I(0, .34, .22, .66), 0, .5), data: p.id, color: T.ink }, K.barcode(I(.26, .38, .7, .62), p.id, { kind: 'stack', showText: false }), K.holo(I(.76, .32, 1, .66), { ax: 1, shape: 'shield', emblem: 'star', holoPat: 0 })); else o.push(K.barcode(I(0, .36, .62, .6), p.id), K.ghost(I(.72, .32, 1, .64), { ax: 1 })); o.push(K.mrz(I(0, .7, 1, 1), 3)); }
    return o;
  }
  lay('Back layouts', 'Back · 3-line machine strip', backId, { pal: P_('#333333', '#2f7f73'), auth: 'CIVIL REGISTRY', kind: 'strip' });
  lay('Back layouts', 'Back · 2D code & stacked barcode', backId, { pal: P_('#333333', '#2b3f66'), auth: 'HARBOUR REGISTRY', kind: '2d' });
  lay('Back layouts', 'Back · licence categories', backId, { pal: P_('#333333', '#a3245a'), auth: 'ROAD AUTHORITY', kind: 'cats' });

  function backBrand(K, v) {
    const T = K.theme(v.pal), { I, p, port, W, H, m, u } = K, o = [];
    const micro = { type: 'micro', name: 'Microtext', x: W / 2, y: H - 1.4 * u, w: W - 2 * m, h: .6 * u, text: v.org + ' · ', size: .4 * u, color: T.acc };
    if (v.kind === 'logo') {
      const s = port ? [.14, .36, .4, .5, .54, .64, .68, .74] : [.06, .4, .44, .58, .62, .72, .76, .86];
      o.push(K.seal(I(.3, s[0], .7, s[1]), { style: v.seal, text: v.org + ' · ', color: T.acc }), K.center(I(0, s[2], 1, s[3]), v.org, { name: 'Organisation', font: T.head, weight: 700, s: 3, spacing: .1 }), K.center(I(.05, s[4], .95, s[5]), 'If found, please return to any office of the issuer.\nThis card is a work of fiction.', { name: 'Return note', weight: 500, s: 1.3, lineH: 1.4, color: T.mut }), K.center(I(0, s[6], 1, s[7]), v.web, { name: 'Web', font: 'IBM Plex Mono', weight: 500, s: 1.5, color: T.acc }), micro);
    } else if (v.kind === 'ghost') {
      if (port) o.push(K.ghost(I(.08, .02, .92, .6), { opacity: .16 }), K.holo(I(.3, .62, .7, .84), { shape: 'shield', holoPat: 0, emblem: 'star' }), K.center(I(0, .86, 1, .92), 'GENUINE DOCUMENT · TILT TO VERIFY', { name: 'Verify note', weight: 700, s: 1.2, spacing: .15, color: T.mut }), micro);
      else o.push(K.ghost(I(0, 0, .5, 1), { ax: 0, opacity: .16 }), K.holo(I(.58, .08, .96, .58), { shape: 'shield', holoPat: 0, emblem: 'star' }), K.center(I(.52, .64, 1, .74), 'GENUINE DOCUMENT · TILT TO VERIFY', { name: 'Verify note', weight: 700, s: 1.2, spacing: .15, color: T.mut }), { type: 'micro', name: 'Microtext ring', ...K.sq(I(.62, .76, .9, 1)), mode: 'ring', text: 'GENUINE · ', size: .42 * u, color: T.acc }, micro);
    } else {
      const lines = v.org + '\n' + v.addr + '\n' + v.web;
      if (port) o.push(K.center(I(0, 0, 1, .2), lines, { name: 'Contact', weight: 500, s: 1.6, lineH: 1.5 }), K.qr(I(.22, .24, .78, .6), 'https://' + v.web, {}), K.center(I(0, .64, 1, .7), v.handle, { name: 'Handle', weight: 700, s: 1.8, color: T.acc }), K.center(I(0, .76, 1, .98), 'Fictional organisation. Card issued for display and play.', { name: 'Fine print', weight: 500, s: 1.1, color: T.mut }));
      else o.push(K.text(I(0, .06, .62, .52), lines, { name: 'Contact', weight: 500, s: 1.7, lineH: 1.5 }), K.qr(I(.68, .04, 1, .64), 'https://' + v.web, { ax: 1 }), K.text(I(0, .6, .62, .7), v.handle, { name: 'Handle', weight: 700, s: 1.8, color: T.acc }), K.text(I(0, .84, 1, 1), 'Fictional organisation. Card issued for display and play.', { name: 'Fine print', weight: 500, s: 1.1, color: T.mut }));
    }
    return o;
  }
  lay('Back layouts', 'Back · centred logo', backBrand, { pal: P_('#1d4f4a', '#2f7f73', { head: 'Cinzel' }), kind: 'logo', org: 'AURELIAN COMMONWEALTH', seal: 'compass', web: 'aurelia.example/return' });
  lay('Back layouts', 'Back · ghost portrait & holo', backBrand, { pal: P_('#24405e', '#24405e'), kind: 'ghost', org: 'MERIDIAN UNION' });
  lay('Back layouts', 'Back · contact & QR', backBrand, { pal: P_('#111111', '#ff6b2c', { head: 'Space Grotesk' }), kind: 'contact', org: 'NORTHWIND LABS', addr: 'Campus 2, Silverford', web: 'northwind.example', handle: '@northwindlabs' });

  /* tag the older built-in layouts and order the categories */
  for (const c of COMPONENTS) if (LAYOUT_CATS.includes(c.cat)) c.layout = true;
  const order = ['Security', 'Holograms', 'Seals & stamps', 'Identity', 'Decoration', 'Text styles', ...LAYOUT_CATS];
  COMPONENTS.sort((a, b) => order.indexOf(a.cat) - order.indexOf(b.cat));
})();

Forge.FORMATS = FORMATS; Forge.COMPONENTS = COMPONENTS; Forge.instantiateComponent = instantiateComponent;
