/* ================= ID Forge — templates ================= */
function makeEl(type, props) {
  const t = T[type]; props = props || {};
  if (type === 'photo' && props.look === undefined) props = { ...props, look: props.duo ? 'duo' : props.grayscale ? 'bw' : 'color', phSeed: props.phSeed ?? (Math.random() * 100 | 0) };
  const el = { ...COMMON_DEF, ...JSON.parse(JSON.stringify(t.d)), type, name: t.label, ...props, id: uid() };
  if (props.relief === undefined && !('relief' in t.d)) el.relief = FIN_RELIEF[el.finish] || 0;
  return el;
}
const E = makeEl;
const TEMPLATES = [
  { id: 'aurelian', name: 'Aurelian citizen card · polycarbonate', build() {
    const F = (label, value, x, y, w, o) => E('field', { name: label.split(' /')[0], label, value, x, y, w, h: 6.2, lsize: 1.18, vsize: 2.2, lcolor: '#4b706a', color: '#13201e', ...o });
    const iris = () => E('pattern', { name: 'Rainbow print', x: 42.8, y: 27, w: 85.6, h: 53.98, kind: 'iris', color: '#dcebe5', color2: '#efe2ee', color3: '#f0e9d2', locked: true });
    return {
      card: { fmt: 'id1', w: 85.6, h: 53.98, r: 3.18, thick: .76, sub: 'poly', ink: 'satin', lam: 'gloss', holoLam: 'stars', holoLamInt: .3, uvFibers: 90, fluor: 'off', relief: 1.6 },
      scene: { env: 'softbox', backdrop: 'slate', pose: 'hover', azim: -38, elev: 50, bloom: .4, dof: .15 },
      front: [iris(),
        E('guilloche', { name: 'Guilloche field', x: 42.8, y: 27, w: 85.6, h: 53.98, mode: 'field', lines: 64, f1: 3, f2: 7, amp: .75, lw: .05, c1: '#86b9ad', c2: '#c39bc1', c3: '#cbb57f', iris: true, opacity: .8, locked: true }),
        E('guilloche', { name: 'Rosette', x: 63, y: 31, w: 44, h: 44, mode: 'rosette', lines: 56, f1: 14, f2: 6, amp: .45, inner: .26, lw: .045, c1: '#3f8e81', c2: '#9a5f9c', opacity: .55, locked: true }),
        E('seal', { name: 'State seal', x: 9.4, y: 8.6, w: 11.5, h: 11.5, style: 'sun', text: 'AURELIAN · COMMONWEALTH · ', points: 14, color: '#1b4a44', finish: 'foil', foil: '#cfa755', relief: .22 }),
        E('text', { name: 'Issuer', x: 51, y: 6, w: 64, h: 4.6, text: 'AURELIAN COMMONWEALTH', font: 'Cinzel', weight: 700, size: 3, color: '#123c37', spacing: .14 }),
        E('text', { name: 'Document title', x: 51, y: 9.8, w: 64, h: 3, text: 'Citizen Identity Card · Carte civique', font: 'Inter', weight: 500, size: 1.5, color: '#3d6a63', spacing: .04 }),
        E('photo', { name: 'Portrait', x: 15.4, y: 31.6, w: 20.5, h: 26.5, radius: 1.4, finish: 'laser', relief: -.25, contrast: 1.1, phSeed: 31 }),
        F('Surname / Nom', 'VALE', 44.5, 17.2, 30), F('Given names / Prénoms', 'SERAPHINE ODILE', 44.5, 23.9, 30),
        F('Date of birth', '14 MAR 1994', 37.5, 30.6, 16), F('Sex', 'F', 52.5, 30.6, 8),
        F('Nationality', 'AURELIAN', 44.5, 37.3, 30), F('Date of expiry', '14 MAR 2034', 37.5, 44, 16), F('Card no.', 'AC7Q4118', 53.5, 44, 12),
        E('photo', { name: 'Ghost image', x: 73.8, y: 41.5, w: 10, h: 13, radius: .6, grayscale: true, opacity: .32, phSeed: 31 }),
        E('rect', { name: 'Clear window', x: 78, y: 23.5, w: 10, h: 13, radius: 1.4, finish: 'window' }),
        E('text', { name: 'Window hologram', x: 78, y: 23.5, w: 9, h: 9, text: 'AC', font: 'Cinzel', weight: 700, size: 5.2, align: 'center', color: '#ffffff', finish: 'holo', holoPat: 4 }),
        E('holo', { name: 'Kinegram', x: 24.4, y: 42.2, w: 11, h: 11, shape: 'circle', holoPat: 1, emblem: 'star', holoPat2: 6 }),
        E('seal', { name: 'UV emblem', x: 57, y: 27, w: 30, h: 30, style: 'sun', text: 'LUX · LEX · CIVITAS · ', points: 18, color: '#000000', finish: 'uv', uvColor: '#ff4fd8' }),
        E('sign', { name: 'Signature', x: 69.5, y: 49.3, w: 19, h: 5.4, text: 'Seraphine Vale', color: '#1d2b5c' }),
        E('micro', { name: 'Microtext', x: 42.8, y: 52.55, w: 80, h: .7, text: 'AURELIAN COMMONWEALTH • CIVITAS AURELIA • ', size: .42, color: '#5e8a82', locked: true }),
        E('seal', { name: 'Tactile seal', x: 79.4, y: 7, w: 8, h: 8, style: 'star', text: '', points: 8, finish: 'blind', relief: .9 }),
        E('text', { name: 'Serial', x: 72, y: 13.6, w: 24, h: 3, text: 'AC 7Q4 118 205', font: 'Share Tech Mono', weight: 400, size: 1.8, color: '#b2352b', align: 'right', spacing: .06 })
      ],
      back: [iris(),
        E('guilloche', { name: 'Rope band', x: 42.8, y: 7.5, w: 85.6, h: 9, mode: 'band', lines: 16, f1: 9, f2: 3, amp: .9, lw: .06, c1: '#4e9588', c2: '#a46aa2', c3: '#c8a85a', iris: true, locked: true }),
        F('Place of birth', 'MERIDIA, AURELIA', 36, 17.5, 40), F('Height', '168 CM', 65, 17.5, 14),
        F('Issuing office', 'CIVIC REGISTRY 12', 36, 24.5, 40), F('Date of issue', '14 MAR 2024', 65, 24.5, 14),
        E('photo', { name: 'Ghost image', x: 78.5, y: 22, w: 10, h: 13, radius: .6, finish: 'laser', relief: -.2, phSeed: 31 }),
        E('barcode', { x: 36, y: 34.2, w: 40, h: 6, data: 'AC7Q4118205', color: '#1b2a28' }),
        E('micro', { x: 42.8, y: 39.4, w: 80, h: .7, text: 'CIVITAS AURELIA • LUX ET LEX • ', size: .42, color: '#5e8a82' }),
        E('mrz', { x: 42.8, y: 46.6, w: 80, h: 11, text: 'I<AURAC7Q41182<<<<<<<<<<<<<<<\n9403140F3403147AUR<<<<<<<<<<<\nVALE<<SERAPHINE<ODILE<<<<<<<<<', color: '#16211f' }),
        E('text', { name: 'UV numeral', x: 63, y: 31, w: 22, h: 12, text: 'AC', font: 'Cinzel', weight: 900, size: 10, align: 'center', finish: 'uv', uvColor: '#5dff9a' })
      ]
    };
  } },
  { id: 'nocturne', name: 'Nocturne members’ card · smoked glass', build() {
    return {
      card: { fmt: 'id1', w: 85.6, h: 53.98, r: 3.6, thick: 1.2, sub: 'smoked', ink: 'matte', lam: 'none', relief: 1.4, fluor: 'off' },
      scene: { env: 'neon', backdrop: 'velvet', pose: 'hover', azim: 140, elev: 42, bloom: .55, dof: .25, keyInt: 1.2 },
      front: [
        E('guilloche', { name: 'Silk-screen rosette', x: 68, y: 20, w: 48, h: 48, mode: 'rosette', lines: 64, f1: 18, f2: 7, amp: .4, inner: .2, lw: .035, c1: '#ffffff', c2: '#d6d0c4', opacity: .22, locked: true }),
        E('text', { name: 'Wordmark', x: 42.8, y: 21, w: 70, h: 9, text: 'NOCTURNE', font: 'Cormorant Garamond', weight: 600, size: 7, align: 'center', color: '#f3eee4', spacing: .16 }),
        E('line', { name: 'Gold rule', x: 42.8, y: 27.3, w: 26, lw: .22, finish: 'foil', foil: '#d7b56d', relief: .1 }),
        E('text', { name: 'Subtitle', x: 42.8, y: 30.5, w: 60, h: 3, text: 'MEMBERS’ CIRCLE', font: 'Inter', weight: 500, size: 1.55, align: 'center', color: '#e2ddd3', spacing: .42 }),
        E('rect', { name: 'Frosted band', x: 42.8, y: 46.2, w: 85.6, h: 11.5, fill: '#ffffff', finish: 'laser', opacity: .26, relief: -.05 }),
        E('text', { name: 'Member', x: 26, y: 46.2, w: 40, h: 4, text: 'ELARA VOSS', font: 'Inter', weight: 600, size: 2.3, color: '#ffffff', spacing: .28, finish: 'foil', foil: '#e3e6ea' }),
        E('text', { name: 'Number', x: 62, y: 46.2, w: 36, h: 3, text: 'Nº 0007 · SINCE 2019', font: 'Share Tech Mono', weight: 400, size: 1.5, color: '#ece7de', align: 'right', spacing: .05 }),
        E('text', { name: 'Holo monogram', x: 75, y: 11, w: 10, h: 10, text: 'N', font: 'Cormorant Garamond', weight: 600, size: 8, align: 'center', color: '#ffffff', finish: 'holo', holoPat: 6 }),
        E('text', { name: 'UV motto', x: 21, y: 13, w: 34, h: 12, text: 'NOX', font: 'Cormorant Garamond', weight: 700, size: 13, align: 'center', finish: 'uv', uvColor: '#a184ff' })
      ],
      back: [
        E('rect', { name: 'Signature strip', x: 42.8, y: 13, w: 85.6, h: 8, fill: '#ebe6dc', opacity: .94 }),
        E('sign', { x: 30, y: 13, w: 30, h: 6, text: 'Elara Voss', color: '#2b2b33' }),
        E('text', { name: 'Panel code', x: 74, y: 13, w: 14, h: 3, text: '0007', font: 'Share Tech Mono', size: 1.8, color: '#2b2b33', align: 'center', italic: true }),
        E('text', { name: 'Terms', x: 42.8, y: 31, w: 76, h: 12, text: 'This card remains the property of the Nocturne Members’ Circle.\nPresent at the door after dusk. Not transferable.\nLost cards: speak quietly to the concierge.', font: 'Inter', weight: 400, size: 1.3, lineH: 1.55, color: '#d9d4ca' }),
        E('barcode', { x: 42.8, y: 45, w: 42, h: 6.5, data: 'NOX-0007-2019', color: '#efe9df' }),
        E('seal', { name: 'Foil crest', x: 80, y: 47.5, w: 6, h: 6, style: 'star', text: '', points: 6, finish: 'foil', foil: '#d7b56d' })
      ]
    };
  } },
  { id: 'drifter', name: 'Drifter’s paper ID · hobo-bag worn', build() {
    const border = (o) => E('rect', { name: 'Ruled border', x: 46, y: 30, w: 86, h: 54, fillOn: false, stroke: '#3b342a', strokeW: .3, radius: .4, opacity: .8, ...o });
    return {
      card: { fmt: 'slip', w: 92, h: 60, r: .8, thick: .2, sub: 'paper', tintOn: true, tint: '#efe4c8', ink: 'matte', lam: 'none', fluor: 'auto', age: .65, creases: .6, foldV: .7, foldH: .35, stains: .55, wear: .7, fade: .25, curl: .15, crumple: .45, relief: 2.2, seed: 4 },
      scene: { env: 'candle', backdrop: 'walnut', pose: 'desk', azim: -60, elev: 34, keyInt: 1.15, bloom: .22, dof: .35, grain: .35, vignette: .5 },
      front: [border(), border({ name: 'Inner rule', w: 84, h: 52, strokeW: .12 }),
        E('text', { name: 'Title', x: 46, y: 10.5, w: 80, h: 6, text: 'NINTH RAIL DISTRICT', font: 'Special Elite', weight: 400, size: 4.2, align: 'center', color: '#2a251e', spacing: .12 }),
        E('text', { name: 'Subtitle', x: 46, y: 15.2, w: 80, h: 3, text: 'PROVISIONAL TRAVEL CARD  ·  HAND ISSUED', font: 'Special Elite', weight: 400, size: 1.75, align: 'center', color: '#2a251e', spacing: .05 }),
        E('line', { x: 46, y: 18, w: 78, lw: .2, color: '#2a251e' }),
        E('photo', { name: 'Pasted photo', x: 19, y: 36, w: 20, h: 25, rot: -2.5, grayscale: true, sepia: .55, contrast: 1.1, border: .9, borderColor: '#f4efe2', radius: 0 }),
        E('rect', { name: 'Tape', x: 12.2, y: 23.6, w: 11, h: 4.2, rot: -32, fill: '#f3ead0', opacity: .75 }),
        E('rect', { name: 'Tape', x: 27.8, y: 48.6, w: 11, h: 4.2, rot: -28, fill: '#f3ead0', opacity: .7 }),
        E('text', { name: 'Typed details', x: 63, y: 33, w: 50, h: 22, text: 'NAME ....... JUDE HOLLOWAY\nBORN ....... 1981, ASH CREEK\nTRADE ...... TINKER / FIDDLER\nMARKS ...... SCAR, LEFT BROW\nVALID ...... WHILE THE RAILS RUN', font: 'Special Elite', weight: 400, size: 2.05, lineH: 1.55, color: '#2b2620', fit: false }),
        E('stamp', { name: 'Clerk stamp', x: 74, y: 46, w: 22, h: 22, rot: -14 }),
        E('sign', { x: 56, y: 52.4, w: 26, h: 6, text: 'J. Holloway', color: '#26335f' }),
        E('text', { name: 'Card number', x: 80, y: 6.6, w: 16, h: 3, text: 'No. 0417', font: 'Courier Prime', weight: 700, size: 2.2, color: '#9e2b22', align: 'right' })
      ],
      back: [border(),
        E('text', { name: 'Heading', x: 46, y: 9, w: 80, h: 4, text: 'CONDITIONS OF CARRIAGE', font: 'Special Elite', weight: 400, size: 2.6, align: 'center', color: '#2a251e', spacing: .1 }),
        E('text', { name: 'Rules', x: 46, y: 24, w: 80, h: 20, text: 'I.   Bearer travels by goodwill of the line.\nII.  Card void if sold, traded or soaked through.\nIII. Show on request to any lamp-man or clerk.\nIV.  If found, leave it at any depot stove.', font: 'Special Elite', weight: 400, size: 1.95, lineH: 1.6, color: '#2b2620', fit: false }),
        E('stamp', { name: 'Inspection stamp', style: 'rect', text: 'INSPECTED', center: '12 OCT', text2: 'YARD 4', color: '#27477a', x: 70, y: 46, w: 24, h: 12, rot: 7, distress: .6 }),
        E('text', { name: 'Pencil note', x: 38, y: 47, w: 44, h: 6, text: 'good for one winter at Pell’s — R.', font: 'Caveat', weight: 500, size: 3.4, color: '#4a4a4a', rot: -3, opacity: .8 }),
        E('pattern', { name: 'Thumbprint', x: 12.5, y: 47, w: 10, h: 12.5, rot: -12, kind: 'thumb', color: '#3b2a20', density: 22, opacity: .5, blend: 'multiply' })
      ]
    };
  } },
  { id: 'helix', name: 'Helix Dynamics badge · PVC portrait', build() {
    return {
      card: { fmt: 'id1p', w: 53.98, h: 85.6, r: 3.18, thick: .76, slot: 'slot', sub: 'pvc', ink: 'satin', lam: 'gloss' },
      scene: { env: 'lab', backdrop: 'mat', pose: 'hover', azim: -30, elev: 56, bloom: .3 },
      front: [
        E('rect', { name: 'Header band', x: 27, y: 12, w: 54, h: 24, fill: '#1b1d22' }),
        E('rect', { name: 'Accent', x: 27, y: 24.4, w: 54, h: 1.2, fill: '#ff6b2c' }),
        E('guilloche', { name: 'Helix mark', x: 12, y: 16, w: 10, h: 5, mode: 'band', lines: 2, f1: 2, f2: 0, amp: 0, lw: .55, c1: '#ff6b2c', c2: '#ffc4a8' }),
        E('text', { name: 'Company', x: 35.5, y: 15, w: 34, h: 4, text: 'HELIX DYNAMICS', font: 'Space Grotesk', weight: 700, size: 3.1, color: '#f2f2ee', spacing: .06 }),
        E('text', { name: 'Division', x: 35.5, y: 18.8, w: 34, h: 3, text: 'Field Operations', font: 'Inter', weight: 400, size: 1.6, color: '#a9adb5' }),
        E('photo', { name: 'Portrait', x: 27, y: 42.5, w: 27, h: 27, radius: 13.5, bg: '#e6e9ee', fg: '#98a1ab', border: .8, borderColor: '#ff6b2c' }),
        E('text', { name: 'Name', x: 27, y: 61, w: 48, h: 6, text: 'Imani Okafor', font: 'Space Grotesk', weight: 700, size: 4, align: 'center', color: '#17181c' }),
        E('text', { name: 'Role', x: 27, y: 66, w: 48, h: 3, text: 'Senior Field Engineer', font: 'Inter', weight: 500, size: 2, align: 'center', color: '#e0551d' }),
        E('rect', { name: 'Access pill', x: 27, y: 72.6, w: 30, h: 5.2, radius: 2.6, fill: '#17181c' }),
        E('text', { name: 'Access', x: 27, y: 72.6, w: 28, h: 3, text: 'ACCESS · LEVEL 4', font: 'Inter', weight: 700, size: 1.6, align: 'center', color: '#ffffff', spacing: .14 }),
        E('barcode', { x: 27, y: 79.8, w: 36, h: 4.2, data: 'HX-20417', showText: false, color: '#17181c' }),
        E('text', { name: 'Badge no.', x: 27, y: 83.6, w: 30, h: 2, text: 'ID 20417', font: 'Share Tech Mono', size: 1.3, align: 'center', color: '#6c7079', spacing: .1 }),
        E('rect', { name: 'Holo stripe', x: 50.4, y: 60, w: 3, h: 40, fill: '#ffffff', finish: 'holo', holoPat: 4 })
      ],
      back: [
        E('text', { name: 'Heading', x: 27, y: 15, w: 46, h: 4, text: 'IF FOUND', font: 'Space Grotesk', weight: 700, size: 2.8, align: 'center', color: '#17181c', spacing: .12 }),
        E('text', { name: 'Return note', x: 27, y: 22, w: 46, h: 8, text: 'Please return to any Helix Dynamics\nreception desk, or drop it in a postbox.\nPostage is already paid.', font: 'Inter', size: 1.5, lineH: 1.45, align: 'center', color: '#3a3d44' }),
        E('matrix', { x: 27, y: 40, w: 18, h: 18, data: 'helix-20417', color: '#17181c' }),
        E('field', { x: 27, y: 56.5, w: 44, h: 6.4, label: 'Emergency', value: 'Site security · ext 4400', align: 'center', upper: false, lcolor: '#e0551d', color: '#17181c' }),
        E('guilloche', { name: 'UV helix', x: 27, y: 67, w: 30, h: 8, mode: 'band', lines: 2, f1: 3, f2: 0, amp: 0, lw: .7, finish: 'uv', uvColor: '#ffb340' }),
        E('text', { name: 'Footer', x: 27, y: 80, w: 46, h: 3, text: 'Valid through 2027 · Property of Helix Dynamics', font: 'Inter', size: 1.25, align: 'center', color: '#6c7079' })
      ]
    };
  } },
  { id: 'orbital', name: 'Orbital crew credential · black metal', build() {
    const L = (o) => ({ finish: 'laser', relief: -.22, ...o });
    return {
      card: { fmt: 'id1', w: 85.6, h: 53.98, r: 3.18, thick: .8, sub: 'blackmetal', ink: 'satin', lam: 'none', relief: 1.5 },
      scene: { env: 'prism', backdrop: 'steel', pose: 'hover', azim: 25, elev: 42, bloom: .45, dof: .2 },
      front: [
        E('pattern', L({ name: 'Circuit engraving', x: 42.8, y: 27, w: 85.6, h: 53.98, kind: 'circuit', color: '#ffffff', lw: .1, density: 26, opacity: .38, locked: true })),
        E('ellipse', L({ name: 'Orbit ring', x: 66, y: 25, w: 42, h: 15, rot: -16, fillOn: false, strokeW: .16 })),
        E('ellipse', L({ name: 'Orbit ring', x: 66, y: 25, w: 30, h: 10.5, rot: -16, fillOn: false, strokeW: .12, opacity: .7 })),
        E('ellipse', L({ name: 'Planet', x: 66, y: 25, w: 9, h: 9, fillOn: true, fill: '#ffffff', opacity: .85 })),
        E('text', L({ name: 'Authority', x: 41, y: 7, w: 70, h: 4, text: 'ORBITAL TRANSIT AUTHORITY', font: 'Orbitron', weight: 700, size: 2.4, spacing: .18 })),
        E('text', { name: 'Class', x: 41, y: 11, w: 70, h: 3, text: 'CREW CREDENTIAL — CLASS III', font: 'Rajdhani', weight: 600, size: 1.9, spacing: .3, color: '#ffffff', finish: 'foil', foil: '#d9bd6a' }),
        E('chip', { x: 14.5, y: 26.5 }),
        E('text', L({ name: 'Crew name', x: 33, y: 40, w: 54, h: 4, text: 'R. TAKAHASHI-REYES', font: 'Rajdhani', weight: 700, size: 3, spacing: .14 })),
        E('field', L({ x: 22, y: 46.6, w: 32, label: 'Berth', value: '07 · LUNAR GATEWAY', lfont: 'Rajdhani', font: 'Rajdhani', lsize: 1.2, vsize: 2.1, lspacing: .2, lupper: true })),
        E('field', L({ x: 51, y: 46.6, w: 22, label: 'Clearance', value: 'EVA · DOCK', lfont: 'Rajdhani', font: 'Rajdhani', lsize: 1.2, vsize: 2.1, lspacing: .2, lupper: true })),
        E('holo', { name: 'Hex hologram', x: 76.5, y: 43.5, w: 12, h: 12, shape: 'hex', holoPat: 3, emblem: 'orbit', holoPat2: 1 }),
        E('guilloche', { name: 'UV rosette', x: 66, y: 25, w: 36, h: 36, mode: 'rosette', lines: 30, f1: 10, f2: 4, amp: .4, inner: .3, lw: .08, finish: 'uv', uvColor: '#3df5ff' }),
        E('text', L({ name: 'Serial', x: 73, y: 52, w: 22, h: 2, text: '0XA-71-9926', font: 'Share Tech Mono', size: 1.5, align: 'right' }))
      ],
      back: [
        E('rect', { name: 'Magnetic stripe', x: 42.8, y: 10.5, w: 85.6, h: 9, fill: '#09090a' }),
        E('rect', { name: 'Signature panel', x: 36, y: 25, w: 56, h: 7, fill: '#d6d8dd' }),
        E('sign', { x: 30, y: 25, w: 30, h: 5.5, text: 'R. Takahashi', color: '#24262d' }),
        E('text', L({ name: 'Terms', x: 42.8, y: 36.5, w: 76, h: 7, text: 'Property of the Orbital Transit Authority. Present at every airlock.\nIn vacuum, this card is the least of your concerns.', font: 'Rajdhani', weight: 600, size: 1.45, lineH: 1.5 })),
        E('barcode', L({ x: 30, y: 46.5, w: 40, h: 6, data: '0XA719926' })),
        E('micro', L({ x: 42.8, y: 52, w: 80, h: .7, text: 'ORBITAL TRANSIT AUTHORITY · ', size: .45 }))
      ]
    };
  } },
  { id: 'guild', name: 'Guild of Arcane Cartographers · fantasy charter', build() {
    const F = (label, value, y) => E('field', { name: label, label, value, x: 57, y, w: 40, h: 6.6, lfont: 'Cinzel', lweight: 700, lsize: 1.15, lspacing: .18, lupper: true, lcolor: '#7a5630', font: 'Cormorant Garamond', weight: 700, vsize: 2.9, upper: false, color: '#2e1c0f' });
    return {
      card: { fmt: 'id1', w: 85.6, h: 53.98, r: 2, thick: .5, sub: 'cardstock', tintOn: true, tint: '#ead9b5', ink: 'matte', lam: 'none', age: .25, wear: .3, stains: .15, relief: 2, fluor: 'off', seed: 7 },
      scene: { env: 'golden', backdrop: 'leather', pose: 'hover', azim: -50, elev: 38, bloom: .3, dof: .2 },
      front: [
        E('pattern', { name: 'Contours', x: 42.8, y: 27, w: 85.6, h: 53.98, kind: 'topo', color: '#9b7a4c', color2: '#7f6340', lw: .07, density: 14, opacity: .5, seed: 3, locked: true }),
        E('guilloche', { name: 'Gilt border', x: 42.8, y: 3.4, w: 80, h: 3, mode: 'band', lines: 6, f1: 22, f2: 4, amp: .9, lw: .09, finish: 'foil', foil: '#caa04f' }),
        E('guilloche', { name: 'Gilt border', x: 42.8, y: 50.6, w: 80, h: 3, mode: 'band', lines: 6, f1: 22, f2: 4, amp: .9, lw: .09, finish: 'foil', foil: '#caa04f' }),
        E('text', { name: 'Guild', x: 42.8, y: 10, w: 78, h: 6, text: 'Guild of Arcane Cartographers', font: 'UnifrakturMaguntia', weight: 400, size: 3.9, align: 'center', color: '#3a2414' }),
        E('text', { name: 'Charter', x: 42.8, y: 14.8, w: 70, h: 3, text: 'CHARTER OF THE SEVENTH SEA ROAD', font: 'Cinzel', weight: 600, size: 1.5, align: 'center', color: '#6b4a2a', spacing: .22 }),
        E('seal', { name: 'Compass rose', x: 17, y: 32, w: 22, h: 22, style: 'compass', text: 'TERRA · MARE · CAELUM · ', finish: 'foil', foil: '#c9a04e', relief: .25 }),
        F('Bearer', 'Ilsa Marrowind', 23), F('Rank', 'Journeyman Mapwright', 30), F('Sworn', 'Midsummer, 1142 A.R.', 37),
        E('ellipse', { name: 'Wax seal', x: 74, y: 44.5, w: 12.5, h: 12, fill: '#8e1f1f', fill2: '#5a0f0f', grad: true, angle: 60, relief: .7 }),
        E('seal', { name: 'Seal impression', x: 74, y: 44.5, w: 8.6, h: 8.6, style: 'star', text: '', points: 8, color: '#6a1414', relief: -.45 }),
        E('sign', { x: 52, y: 45.5, w: 24, h: 5.5, text: 'I. Marrowind', color: '#3a2414' }),
        E('text', { name: 'Hidden message', x: 46, y: 27, w: 60, h: 5, text: 'here be dragons', font: 'Cinzel', weight: 700, size: 3, align: 'center', rot: -8, finish: 'uv', uvColor: '#7dff9a' })
      ],
      back: [
        E('pattern', { name: 'Contours', x: 42.8, y: 27, w: 85.6, h: 53.98, kind: 'topo', color: '#9b7a4c', color2: '#7f6340', lw: .07, density: 12, opacity: .45, seed: 11, locked: true }),
        E('text', { name: 'Charter text', x: 42.8, y: 20, w: 74, h: 16, text: 'By this charter the bearer may pass all toll-stones,\nlighthouses and ferry-gates of the Seventh Sea Road,\nand shall be given ink, lamp-oil and a dry bench.', font: 'Cormorant Garamond', weight: 600, italic: true, size: 2.35, lineH: 1.4, align: 'center', color: '#3a2414' }),
        E('seal', { name: 'Laurel', x: 42.8, y: 38.5, w: 13, h: 13, style: 'laurel', text: '', finish: 'foil', foil: '#c9a04e', relief: .2 }),
        E('stamp', { name: 'Toll stamp', style: 'rect', text: 'TOLL-STONE', center: 'PAID', text2: 'IX', color: '#7a2a1a', x: 70, y: 45, w: 18, h: 9, rot: -10, distress: .5 }),
        E('micro', { x: 42.8, y: 51.5, w: 78, h: .7, text: 'GUILD OF ARCANE CARTOGRAPHERS · ', size: .45, color: '#6b4a2a' })
      ]
    };
  } },
  { id: 'prism', name: 'Prism festival pass · dichroic glass', build() {
    return {
      card: { fmt: 'id1p', w: 53.98, h: 85.6, r: 4, thick: 1, slot: 'hole', sub: 'aurora', ink: 'gloss', lam: 'none', holoLam: 'diamond', holoLamInt: .22, relief: 1.4 },
      scene: { env: 'prism', backdrop: 'concrete', pose: 'hover', azim: 30, elev: 55, bloom: .55, dof: .2 },
      front: [
        E('text', { name: 'Wordmark', x: 27, y: 24, w: 48, h: 12, text: 'PRISM', font: 'Archivo Black', weight: 400, size: 10, align: 'center', color: '#ffffff', spacing: .02 }),
        E('text', { name: 'Edition', x: 27, y: 31.5, w: 46, h: 3, text: 'FESTIVAL · 2026', font: 'Space Grotesk', weight: 600, size: 2.2, align: 'center', color: '#ffffff', spacing: .4 }),
        E('guilloche', { name: 'Spirograph', x: 27, y: 52, w: 30, h: 30, mode: 'spiro', lines: 12, f1: 7, f2: 3, amp: .8, lw: .12, finish: 'foil', foil: '#dfe3e8' }),
        E('text', { name: 'Access', x: 27, y: 72, w: 46, h: 5, text: 'ALL ACCESS', font: 'Space Grotesk', weight: 700, size: 3.4, align: 'center', color: '#ffffff', spacing: .3, finish: 'holo', holoPat: 0 }),
        E('text', { name: 'Holder', x: 27, y: 77.6, w: 46, h: 3, text: 'Noor Albrecht · Crew', font: 'Inter', weight: 500, size: 1.8, align: 'center', color: '#ffffff', opacity: .85 }),
        E('pattern', { name: 'UV stars', x: 27, y: 50, w: 50, h: 70, kind: 'stars', density: 30, finish: 'uv', uvColor: '#ff6bd6' })
      ],
      back: [
        E('matrix', { x: 27, y: 40, w: 18, h: 18, data: 'prism-26-0441', color: '#ffffff' }),
        E('text', { name: 'Note', x: 27, y: 60, w: 44, h: 8, text: 'Wristband exchange at Gate C.\nThis pass is non-transferable.', font: 'Inter', size: 1.6, lineH: 1.45, align: 'center', color: '#ffffff' }),
        E('barcode', { x: 27, y: 72, w: 40, h: 7, data: 'PRISM-26-0441', color: '#ffffff' })
      ]
    };
  } },
  { id: 'veloria', name: 'Republic of Veloria · passport data page', build() {
    const F = (label, value, x, y, w, o) => E('field', { name: label.split(' /')[0], label, value, x, y, w, h: 6.2, lsize: 1.2, vsize: 2.3, lcolor: '#4b6480', color: '#15202b', ...o });
    return {
      card: { fmt: 'id3', w: 125, h: 88, r: 3.18, thick: .76, sub: 'poly', ink: 'satin', lam: 'gloss', holoLam: 'guilloche', holoLamInt: .26, uvFibers: 140, fluor: 'off', relief: 1.6 },
      scene: { env: 'softbox', backdrop: 'linen', pose: 'hover', azim: -42, elev: 52, bloom: .35, dof: .2 },
      front: [
        E('pattern', { name: 'Rainbow print', x: 62.5, y: 44, w: 125, h: 88, kind: 'iris', color: '#ebe5d6', color2: '#dde9ef', color3: '#efe0e6', locked: true }),
        E('guilloche', { name: 'Guilloche field', x: 62.5, y: 44, w: 125, h: 88, mode: 'field', lines: 90, f1: 4, f2: 9, amp: .7, lw: .045, c1: '#9db7c9', c2: '#c6a2b4', c3: '#c8b98a', iris: true, opacity: .7, locked: true }),
        E('guilloche', { name: 'Rosette', x: 94, y: 46, w: 58, h: 58, mode: 'rosette', lines: 72, f1: 18, f2: 7, amp: .4, inner: .22, lw: .04, c1: '#5b7f9e', c2: '#9b6a86', opacity: .5, locked: true }),
        E('flag', { name: 'Flag', x: 13.5, y: 10, w: 16, h: 10.6, kind: 'chevron', c1: '#1f3f6e', c2: '#f1ece0', c3: '#2f7f73', emblem: 'sun', ecolor: '#e7c35a', wave: .3 }),
        E('text', { name: 'Issuer', x: 64, y: 8.4, w: 76, h: 5, text: 'REPUBLIC OF VELORIA', font: 'Cinzel', weight: 700, size: 4, color: '#1f3550', spacing: .12 }),
        E('text', { name: 'Document', x: 64, y: 13, w: 76, h: 3, text: 'PASSPORT · PASSEPORT · PASAPORTE', font: 'Inter', weight: 600, size: 1.7, color: '#4b6480', spacing: .14 }),
        F('Type', 'P', 47, 20.5, 10), F('Code', 'VLR', 60, 20.5, 12), F('Passport no.', 'V4K839120', 84, 20.5, 28),
        E('photo', { name: 'Engraved portrait', x: 21, y: 44, w: 30, h: 38, radius: 1, finish: 'laser', relief: -.25, lines: .6, contrast: 1.1, phSeed: 54 }),
        F('Surname / Nom', 'ASHGROVE', 62, 27.5, 40), F('Given names / Prénoms', 'MAELIS ORIANNE', 62, 34, 40), F('Nationality', 'VELORIAN', 62, 40.5, 40),
        F('Date of birth', '02 NOV 1991', 52, 47, 20), F('Sex', 'F', 67, 47, 8), F('Place of birth', 'SALTMERE', 84, 47, 22),
        F('Date of issue', '09 JUN 2025', 52, 53.5, 20), F('Authority', 'PASSPORT OFFICE · SALTMERE', 82, 53.5, 30), F('Date of expiry', '09 JUN 2035', 52, 60, 20),
        E('sign', { x: 82, y: 61, w: 28, h: 6, text: 'M. Ashgrove', color: '#1d2b5c' }),
        E('photo', { name: 'Ghost image', x: 108, y: 34, w: 14, h: 18, radius: .6, grayscale: true, opacity: .3, phSeed: 54 }),
        E('holo', { name: 'Shield OVD', x: 36, y: 60, w: 13, h: 15, shape: 'shield', holoPat: 3, emblem: 'star', holoPat2: 1 }),
        E('seal', { name: 'UV seal', x: 96, y: 44, w: 36, h: 36, style: 'sun', text: 'VELORIA · LIBERTAS · MARE · ', points: 20, finish: 'uv', uvColor: '#5ce1ff' }),
        E('micro', { x: 62.5, y: 70.5, w: 118, h: .7, text: 'REPUBLIC OF VELORIA · LIBERTAS ET MARE · ', size: .45, color: '#5b7f9e', locked: true }),
        E('mrz', { x: 62.5, y: 79, w: 118, h: 10, cols: 44, text: 'P<VLRASHGROVE<<MAELIS<ORIANNE<<<<<<<<<<<<<<<\nV4K839120<VLR9111025F3506094<<<<<<<<<<<<<<<0', color: '#15202b' }),
        E('seal', { name: 'Tactile seal', x: 114, y: 11, w: 10, h: 10, style: 'star', text: '', points: 10, finish: 'blind', relief: .9 }),
        E('text', { name: 'Serial', x: 121.5, y: 44, w: 40, h: 3, rot: -90, text: 'V4K839120', font: 'Share Tech Mono', size: 1.9, align: 'center', color: '#a5352d', spacing: .12 })
      ],
      back: [
        E('pattern', { name: 'Rainbow print', x: 62.5, y: 44, w: 125, h: 88, kind: 'iris', color: '#ebe5d6', color2: '#dde9ef', color3: '#efe0e6', locked: true }),
        E('guilloche', { name: 'Rope band', x: 62.5, y: 8, w: 125, h: 10, mode: 'band', lines: 18, f1: 12, f2: 4, amp: .9, lw: .05, c1: '#5b7f9e', c2: '#9b6a86', c3: '#c8b98a', iris: true, locked: true }),
        E('text', { name: 'Heading', x: 62.5, y: 18, w: 110, h: 4, text: 'OBSERVATIONS · OBSERVATIONS · OBSERVACIONES', font: 'Inter', weight: 600, size: 1.8, align: 'center', color: '#4b6480', spacing: .14 }),
        E('stamp', { name: 'Entry stamp', style: 'rect', text: 'ADMITTED', center: '14 AUG 2025', text2: 'PORT SALTMERE', color: '#27477a', x: 38, y: 40, w: 32, h: 16, rot: -6, distress: .55 }),
        E('stamp', { name: 'Exit stamp', text: 'DEPARTED', text2: 'NORTHWOLD AIR', center: '02 SEP', color: '#2d6b3a', x: 88, y: 52, w: 26, h: 26, rot: 12, distress: .5 }),
        E('text', { name: 'Visa note', x: 60, y: 72, w: 70, h: 6, text: 'Visa waiver — Straits Accord, 90 days', font: 'Caveat', weight: 500, size: 3.6, color: '#3a3a5a', rot: -2, opacity: .85 })
      ]
    };
  } },
  { id: 'starliner', name: 'Starliner pilot licence · carbon fibre', build() {
    const F = (label, value, x, y, w) => E('field', { label, value, x, y, w, h: 6.2, lfont: 'Rajdhani', font: 'Rajdhani', lweight: 600, lsize: 1.2, vsize: 2.3, lspacing: .2, lupper: true, lcolor: '#7fd1ff', color: '#ffffff' });
    return {
      card: { fmt: 'id1', w: 85.6, h: 53.98, r: 3.18, thick: .9, sub: 'carbon', ink: 'satin', lam: 'none', relief: 1.5 },
      scene: { env: 'neon', backdrop: 'blackglass', pose: 'hover', azim: 120, elev: 40, bloom: .6, dof: .2 },
      front: [
        E('pattern', { name: 'Star field', x: 42.8, y: 27, w: 85.6, h: 53.98, kind: 'stars', color: '#9bdcff', density: 26, opacity: .4, locked: true }),
        E('guilloche', { name: 'Holo spirograph', x: 70, y: 27, w: 38, h: 38, mode: 'spiro', lines: 14, f1: 9, f2: 4, amp: .7, lw: .08, finish: 'holo', holoPat: 7 }),
        E('frame', { name: 'Corner brackets', x: 42.8, y: 27, w: 81, h: 49.5, style: 'brackets', color: '#7fd1ff', lw: .25, size: 5 }),
        E('text', { name: 'Guild', x: 38, y: 7.5, w: 64, h: 4, text: 'STARLINER GUILD', font: 'Orbitron', weight: 800, size: 2.8, color: '#e9f6ff', spacing: .2 }),
        E('text', { name: 'Class', x: 38, y: 11.4, w: 64, h: 3, text: 'PILOT LICENCE · CLASS A · INTERSTELLAR', font: 'Rajdhani', weight: 600, size: 1.6, color: '#7fd1ff', spacing: .12 }),
        E('chip', { x: 14.5, y: 22, style: 'ornate', foil: '#cfd6de' }),
        E('photo', { name: 'Portrait', x: 15, y: 40, w: 17, h: 21, radius: 1, duo: true, tint: '#2b8fd6', border: .35, borderColor: '#7fd1ff' }),
        F('Pilot', 'TAVIAN K. ROURKE', 46, 22, 34), F('Rating', 'JUMP-CERTIFIED', 40, 29, 22), F('Hours', '11 402', 58, 29, 12), F('Home port', 'CERES DOCK 4', 46, 36, 34),
        E('qr', { x: 77, y: 45, w: 10, h: 10, data: 'STARLINER GUILD · TKR-11402 · fictional', color: '#0b1220', bg: '#e9f6ff', quiet: 1 }),
        E('text', { name: 'Serial', x: 46, y: 46.5, w: 34, h: 2, text: 'SL-0091-AX · EXP 2391', font: 'Share Tech Mono', size: 1.4, color: '#7fd1ff', spacing: .1 }),
        E('text', { name: 'UV motto', x: 46, y: 50.5, w: 34, h: 3, text: 'AD ASTRA PER ASPERA', font: 'Orbitron', weight: 700, size: 1.6, finish: 'uv', uvColor: '#3df5ff' })
      ],
      back: [
        E('rect', { name: 'Magnetic stripe', x: 42.8, y: 10, w: 85.6, h: 9, fill: '#08090b' }),
        E('rect', { name: 'Holo stripe', x: 42.8, y: 20, w: 85.6, h: 2.2, fill: '#ffffff', finish: 'holo', holoPat: 4 }),
        E('text', { name: 'Rules', x: 42.8, y: 33, w: 76, h: 10, text: 'This licence must be carried at all times while operating a jump-capable vessel.\nRevocation follows any unlicensed fold within 1 AU of an inhabited body.', font: 'Rajdhani', weight: 600, size: 1.5, lineH: 1.45, color: '#cfe9ff' }),
        E('barcode', { x: 30, y: 46, w: 40, h: 6, data: 'SL0091AX', color: '#e9f6ff' })
      ]
    };
  } },
  { id: 'thornwick', name: 'Thornwick Academy of the Arcane · student card', build() {
    const F = (label, value, x, y, w) => E('field', { label, value, x, y, w, h: 6.6, lfont: 'Cinzel', lweight: 700, lsize: 1.15, lspacing: .16, lupper: true, lcolor: '#7a5a9a', font: 'Cormorant Garamond', weight: 700, vsize: 2.8, upper: false, color: '#2a1840' });
    return {
      card: { fmt: 'id1', w: 85.6, h: 53.98, r: 3.18, thick: .8, sub: 'ivory', ink: 'matte', lam: 'none', relief: 1.8, holoLam: 'stars', holoLamInt: .18 },
      scene: { env: 'candle', backdrop: 'velvet', pose: 'hover', azim: -55, elev: 40, bloom: .4, dof: .3 },
      front: [
        E('pattern', { name: 'Lattice', x: 42.8, y: 27, w: 85.6, h: 53.98, kind: 'mesh', color: '#cdb98f', color2: '#bfa7c9', density: 20, lw: .05, opacity: .4, locked: true }),
        E('frame', { name: 'Filigree', x: 42.8, y: 27, w: 82, h: 50.5, style: 'filigree', color: '#8a6a2a', lw: .25, size: 9, finish: 'foil', foil: '#c9a04e' }),
        E('seal', { name: 'Crest', x: 13, y: 13, w: 14, h: 14, style: 'shield', text: 'SAPIENTIA · ARCANA · ', color: '#4a2a6a', finish: 'foil', foil: '#a58bd8', relief: .25 }),
        E('text', { name: 'Academy', x: 50, y: 11, w: 56, h: 5, text: 'Thornwick Academy', font: 'Cinzel', weight: 700, size: 3.6, align: 'center', color: '#3b1f5c' }),
        E('text', { name: 'Subtitle', x: 50, y: 15.4, w: 56, h: 3, text: 'OF THE ARCANE ARTS', font: 'Cinzel', weight: 600, size: 1.6, align: 'center', color: '#7a5a9a', spacing: .3 }),
        E('photo', { name: 'Portrait', x: 15, y: 37, w: 17, h: 21, radius: 3, sepia: .35, border: .5, borderColor: '#c9a04e' }),
        F('Student', 'Wren Halloway', 55, 23.5, 44), F('House', 'Emberwatch', 44, 30.5, 22), F('Year', 'Fourth', 66, 30.5, 14), F('Familiar', 'Raven, named Quill', 55, 37.5, 44),
        E('sign', { x: 56, y: 46, w: 26, h: 5.5, text: 'W. Halloway', color: '#2a1840' }),
        E('text', { name: 'Hidden motto', x: 50, y: 27, w: 60, h: 5, text: 'the stars remember', font: 'Cinzel', weight: 700, size: 2.8, align: 'center', rot: 6, finish: 'uv', uvColor: '#ffd36b' })
      ],
      back: [
        E('pattern', { name: 'Lattice', x: 42.8, y: 27, w: 85.6, h: 53.98, kind: 'mesh', color: '#cdb98f', color2: '#bfa7c9', density: 20, lw: .05, opacity: .35, locked: true }),
        E('text', { name: 'Privileges', x: 42.8, y: 20, w: 74, h: 14, text: 'The bearer may borrow from the open stacks,\nattend lectures in the Observatory,\nand keep one small familiar in residence.', font: 'Cormorant Garamond', weight: 600, italic: true, size: 2.4, lineH: 1.4, align: 'center', color: '#2a1840' }),
        E('stamp', { name: 'Restricted stamp', style: 'rect', text: 'LIBRARY', center: 'RESTRICTED', text2: 'SECTION IX', color: '#5a2a7a', x: 62, y: 42, w: 26, h: 12, rot: -8, distress: .45 }),
        E('barcode', { x: 25, y: 44, w: 30, h: 6, data: 'TAA-4-0417', color: '#2a1840' })
      ]
    };
  } },
  { id: 'meridian', name: 'Hotel Meridian key card · pearl & gold', build() {
    return {
      card: { fmt: 'id1', w: 85.6, h: 53.98, r: 3.18, thick: .76, sub: 'pearl', ink: 'satin', lam: 'gloss', relief: 1.5 },
      scene: { env: 'gallery', backdrop: 'marble', pose: 'desk', azim: -35, elev: 45, bloom: .35, dof: .25 },
      front: [
        E('pattern', { name: 'Sunburst', x: 42.8, y: 27, w: 85.6, h: 53.98, kind: 'rays', color: '#eadfc8', density: 56, amp: .8, opacity: .5, locked: true }),
        E('frame', { name: 'Deco frame', x: 42.8, y: 27, w: 79, h: 47.5, style: 'deco', color: '#b8892b', lw: .3, size: 10, finish: 'foil', foil: '#cfa555', relief: .15 }),
        E('shape', { name: 'Diamond', x: 42.8, y: 11, w: 4, h: 5.2, kind: 'diamond', fill: '#b8892b', finish: 'foil', foil: '#cfa555' }),
        E('text', { name: 'Hotel', x: 42.8, y: 19, w: 50, h: 3, text: 'HOTEL', font: 'Playfair Display', weight: 600, size: 2.2, align: 'center', color: '#1c2a3a', spacing: .5 }),
        E('text', { name: 'Name', x: 42.8, y: 26, w: 64, h: 9, text: 'MERIDIAN', font: 'Playfair Display', weight: 800, size: 7, align: 'center', color: '#1c2a3a', spacing: .12, finish: 'foil', foil: '#cfa555', relief: .12 }),
        E('line', { x: 42.8, y: 31.6, w: 24, lw: .2, color: '#b8892b', finish: 'foil', foil: '#cfa555' }),
        E('text', { name: 'Est', x: 42.8, y: 34.6, w: 60, h: 3, text: 'EST. 1931 · GRAND BOULEVARD', font: 'Inter', weight: 500, size: 1.4, align: 'center', color: '#5a6472', spacing: .32 }),
        E('text', { name: 'Room', x: 42.8, y: 44.5, w: 40, h: 3, text: 'ROOM 1207', font: 'Inter', weight: 700, size: 2, align: 'center', color: '#1c2a3a', spacing: .3 })
      ],
      back: [
        E('rect', { name: 'Magnetic stripe', x: 42.8, y: 10, w: 85.6, h: 9, fill: '#141414' }),
        E('text', { name: 'Note', x: 42.8, y: 27, w: 74, h: 10, text: 'Kindly return this key to the front desk at check-out.\nBreakfast is served in the Orangery from seven.', font: 'Playfair Display', weight: 400, italic: true, size: 1.9, lineH: 1.5, align: 'center', color: '#1c2a3a' }),
        E('qr', { x: 42.8, y: 43, w: 11, h: 11, data: 'https://example.com/meridian/room-1207', color: '#1c2a3a', bg: '#f5f1ec', quiet: 1 })
      ]
    };
  } },
  { id: 'nightmarket', name: 'Night Market press pass · neon badge', build() {
    return {
      card: { fmt: 'tall', w: 70, h: 110, r: 4, thick: .76, slot: 'slot', sub: 'pvc', ink: 'gloss', lam: 'gloss', relief: 1.2 },
      scene: { env: 'neon', backdrop: 'concrete', pose: 'lanyard', azim: 40, elev: 45, bloom: .6, dof: .25 },
      front: [
        E('pattern', { name: 'Aurora', x: 35, y: 55, w: 70, h: 110, kind: 'aurora', color: '#120a24', color2: '#ff3d8b', color3: '#3df5ff', amp: .8, seed: 5, locked: true }),
        E('text', { name: 'Night', x: 35, y: 22, w: 64, h: 13, text: 'NIGHT', font: 'Archivo Black', weight: 400, size: 12, align: 'center', color: '#ffffff' }),
        E('text', { name: 'Market', x: 35, y: 34, w: 64, h: 13, text: 'MARKET', font: 'Archivo Black', weight: 400, size: 12, align: 'center', color: '#ffffff' }),
        E('text', { name: 'Year', x: 35, y: 42.5, w: 60, h: 4, text: '· 2026 ·', font: 'Space Grotesk', weight: 600, size: 2.6, align: 'center', color: '#ffd23d', spacing: .4 }),
        E('photo', { name: 'Portrait', x: 35, y: 61, w: 26, h: 26, radius: 13, border: 1, borderColor: '#ffd23d', bg: '#2a1f45', fg: '#6b5a90' }),
        E('text', { name: 'Name', x: 35, y: 79, w: 64, h: 5, text: 'Juno Lindqvist', font: 'Space Grotesk', weight: 700, size: 3.6, align: 'center', color: '#ffffff' }),
        E('rect', { name: 'Press band', x: 35, y: 89, w: 70, h: 10, fill: '#ffd23d' }),
        E('text', { name: 'Press', x: 35, y: 89, w: 64, h: 8, text: 'PRESS', font: 'Archivo Black', weight: 400, size: 6.5, align: 'center', color: '#120a24', spacing: .25 }),
        E('text', { name: 'Outlet', x: 27, y: 100.5, w: 46, h: 3, text: 'THE LANTERN GAZETTE', font: 'Inter', weight: 700, size: 1.8, color: '#ffffff', spacing: .16 }),
        E('qr', { x: 59, y: 101, w: 11, h: 11, data: 'https://example.com/press/juno-lindqvist', color: '#120a24', bg: '#ffffff', quiet: 1 }),
        E('text', { name: 'All zones holo', x: 35, y: 47.5, w: 50, h: 3, text: 'ALL ZONES', font: 'Space Grotesk', weight: 700, size: 2, align: 'center', color: '#ffffff', spacing: .4, finish: 'holo', holoPat: 2 })
      ],
      back: [
        E('pattern', { name: 'Aurora', x: 35, y: 55, w: 70, h: 110, kind: 'aurora', color: '#120a24', color2: '#3df5ff', color3: '#ff3d8b', amp: .8, seed: 9, locked: true }),
        E('text', { name: 'Zones', x: 35, y: 20, w: 60, h: 5, text: 'ACCESS ZONES', font: 'Archivo Black', weight: 400, size: 4, align: 'center', color: '#ffffff', spacing: .06 }),
        ...['STAGE', 'BACKSTAGE', 'FOOD HALL', 'ROOFTOP'].map((z, i) => E('rect', { name: 'Zone ' + z, x: 35, y: 32 + i * 9, w: 50, h: 6.5, radius: 3.2, fill: i % 2 ? '#3df5ff' : '#ff3d8b' })),
        ...['STAGE', 'BACKSTAGE', 'FOOD HALL', 'ROOFTOP'].map((z, i) => E('text', { name: 'Zone label', x: 35, y: 32 + i * 9, w: 46, h: 4, text: z, font: 'Space Grotesk', weight: 700, size: 2.4, align: 'center', color: '#120a24', spacing: .2 })),
        E('text', { name: 'Small print', x: 35, y: 90, w: 60, h: 10, text: 'Non-transferable. Wear visibly at all times.\nThe dumpling stall closes at 2 a.m. Plan accordingly.', font: 'Inter', size: 1.6, lineH: 1.45, align: 'center', color: '#ffffff' })
      ]
    };
  } },
  { id: 'mars', name: 'Ares Colony residence permit · rust PVC', build() {
    const F = (label, value, y) => E('field', { label, value, x: 47, y, w: 30, h: 6.2, lfont: 'Rajdhani', font: 'Rajdhani', lweight: 600, lsize: 1.2, vsize: 2.3, lspacing: .18, lupper: true, lcolor: '#8a3e22', color: '#2b120a' });
    return {
      card: { fmt: 'id1', w: 85.6, h: 53.98, r: 3.18, thick: .76, sub: 'pvc', tintOn: true, tint: '#ecd6c2', ink: 'satin', lam: 'gloss', uvFibers: 60, relief: 1.5 },
      scene: { env: 'sunset', backdrop: 'concrete', pose: 'hover', azim: -60, elev: 30, bloom: .45, dof: .2 },
      front: [
        E('pattern', { name: 'Terrain contours', x: 42.8, y: 27, w: 85.6, h: 53.98, kind: 'topo', color: '#b8653f', color2: '#8a3e22', lw: .06, density: 16, opacity: .42, seed: 21, locked: true }),
        E('ellipse', { name: 'Planet', x: 70, y: 18, w: 24, h: 24, fill: '#d9744a', fill2: '#6e2812', grad: true, angle: 45, opacity: .92 }),
        E('ellipse', { name: 'Ring', x: 70, y: 18, w: 38, h: 9, rot: -18, fillOn: false, stroke: '#5a2412', strokeW: .25 }),
        E('text', { name: 'Administration', x: 36, y: 7, w: 64, h: 3, text: 'ARES COLONIAL ADMINISTRATION', font: 'Orbitron', weight: 700, size: 2.05, color: '#5a2412', spacing: .14 }),
        E('text', { name: 'Permit', x: 36, y: 11, w: 64, h: 3, text: 'RESIDENCE PERMIT · HAB DISTRICT 3', font: 'Rajdhani', weight: 600, size: 1.7, color: '#8a3e22', spacing: .2 }),
        E('photo', { name: 'Portrait', x: 15, y: 34, w: 19, h: 24, radius: 1, duo: true, tint: '#8a3e22' }),
        F('Resident', 'IDRIS VANTERPOOL', 25), F('Born', 'SOL 4411 · OLYMPUS', 32), F('Sector', 'HAB-3 / RING C', 39), F('Oxygen ration', 'CLASS II', 46),
        E('holo', { name: 'Hex OVD', x: 74, y: 36.5, w: 9, h: 9, shape: 'hex', holoPat: 3, emblem: 'orbit', holoPat2: 1 }),
        E('barcode', { x: 74, y: 47, w: 18, h: 6.5, kind: 'stack', data: 'ARES-HAB3-0417', color: '#5a2412' }),
        E('text', { name: 'UV slogan', x: 42.8, y: 50.5, w: 70, h: 3, text: 'WE ARE THE FIRST', font: 'Orbitron', weight: 700, size: 2, align: 'center', finish: 'uv', uvColor: '#ff6a3d' })
      ],
      back: [
        E('pattern', { name: 'Terrain contours', x: 42.8, y: 27, w: 85.6, h: 53.98, kind: 'topo', color: '#b8653f', color2: '#8a3e22', lw: .06, density: 14, opacity: .35, seed: 33, locked: true }),
        E('text', { name: 'Rules', x: 42.8, y: 20, w: 76, h: 14, text: 'Carry this permit beyond every pressure door.\nDust storms suspend all surface excursions.\nReport hull breaches before reporting anything else.', font: 'Rajdhani', weight: 600, size: 1.9, lineH: 1.45, align: 'center', color: '#2b120a' }),
        E('stamp', { name: 'Quarantine stamp', text: 'QUARANTINE', text2: 'PHOBOS PORT', center: 'CLEARED', color: '#5a2412', x: 66, y: 42, w: 20, h: 20, rot: -12, distress: .5 }),
        E('qr', { x: 22, y: 42, w: 12, h: 12, data: 'ARES COLONY · IDRIS VANTERPOOL · HAB-3 · fictional', color: '#2b120a', bg: '#ecd6c2', quiet: 1 })
      ]
    };
  } },
  { id: 'marque', name: 'Letter of marque · aged kraft', build() {
    return {
      card: { fmt: 'slip', w: 92, h: 60, r: .6, thick: .3, sub: 'kraft', ink: 'matte', lam: 'none', age: .6, stains: .5, wear: .6, creases: .5, foldV: .55, fade: .2, curl: .1, crumple: .3, relief: 2.2, seed: 12 },
      scene: { env: 'candle', backdrop: 'walnut', pose: 'desk', azim: -70, elev: 30, bloom: .25, dof: .35, grain: .35, vignette: .55 },
      front: [
        E('frame', { name: 'Rope border', x: 46, y: 30, w: 86, h: 54, style: 'rope', color: '#3b2414', lw: .22, size: 7 }),
        E('text', { name: 'Title', x: 46, y: 12.5, w: 78, h: 7, text: 'Letter of Marque', font: 'UnifrakturMaguntia', weight: 400, size: 5.4, align: 'center', color: '#2b1a0d' }),
        E('text', { name: 'Authority', x: 46, y: 18, w: 78, h: 3, text: 'BY ORDER OF THE ADMIRALTY OF THE SILVER STRAITS', font: 'Cinzel', weight: 600, size: 1.5, align: 'center', color: '#3b2414', spacing: .1 }),
        E('text', { name: 'Charter', x: 46, y: 30, w: 76, h: 16, text: 'The bearer, Captain Isolde Brannoc of the sloop Gull’s Revenge,\nis hereby licensed to seize any vessel flying the black lantern\nand to claim one third of all prizes in the name of the Straits.', font: 'Cormorant Garamond', weight: 600, italic: true, size: 2.2, lineH: 1.5, align: 'center', color: '#2b1a0d', fit: false }),
        E('seal', { name: 'Compass', x: 15, y: 47, w: 14, h: 14, style: 'compass', text: '', color: '#3b2414', opacity: .65, blend: 'multiply' }),
        E('sign', { x: 40, y: 48.5, w: 28, h: 6, text: 'Adm. H. Corvane', color: '#2b1a0d' }),
        E('ellipse', { name: 'Wax seal', x: 74, y: 47, w: 13, h: 12.5, fill: '#7e1717', fill2: '#4a0b0b', grad: true, angle: 60, relief: .75 }),
        E('seal', { name: 'Seal impression', x: 74, y: 47, w: 9, h: 9, style: 'laurel', text: '', color: '#5a1010', relief: -.45 })
      ],
      back: [
        E('text', { name: 'Ledger', x: 46, y: 20, w: 76, h: 20, text: 'Prizes taken —\n  the Merrow Dawn, 3 casks of indigo\n  the Saltwick, rope and a very angry parrot', font: 'Caveat', weight: 500, size: 3.4, lineH: 1.3, color: '#3a2a1a', fit: false, opacity: .85 }),
        E('stamp', { name: 'Registry stamp', style: 'rect', text: 'ADMIRALTY', center: 'REGISTERED', text2: 'FOLIO 88', color: '#6a2a1a', x: 64, y: 45, w: 26, h: 12, rot: -9, distress: .6 })
      ]
    };
  } },
  { id: 'wasteland', name: 'Wasteland survivor card · battered kraft', build() {
    return {
      card: { fmt: 'slip', w: 92, h: 60, r: 1.2, thick: .35, sub: 'kraft', ink: 'matte', lam: 'none', age: .5, stains: .75, wear: .85, creases: .75, foldH: .45, fade: .2, crumple: .55, curl: .2, relief: 2.4, seed: 23 },
      scene: { env: 'interrogation', backdrop: 'concrete', pose: 'desk', azim: 20, elev: 70, bloom: .2, dof: .25, grain: .5, vignette: .6 },
      front: [
        E('text', { name: 'Settlement', x: 46, y: 10, w: 80, h: 6, text: 'SETTLEMENT 9', font: 'Special Elite', weight: 400, size: 4.6, align: 'center', color: '#1d1a17', spacing: .14 }),
        E('text', { name: 'Subtitle', x: 46, y: 15.2, w: 80, h: 3, text: 'SURVIVOR REGISTRATION — KEEP DRY', font: 'Special Elite', weight: 400, size: 1.75, align: 'center', color: '#1d1a17', spacing: .06 }),
        E('photo', { name: 'Photo', x: 17, y: 35, w: 19, h: 24, rot: 3, grayscale: true, contrast: 1.3, halftone: .6, border: .8, borderColor: '#efe7d6', radius: 0 }),
        E('rect', { name: 'Tape', x: 12, y: 23.4, w: 10, h: 4, rot: -28, fill: '#d9d2bf', opacity: .75 }),
        E('text', { name: 'Typed record', x: 63, y: 34, w: 50, h: 22, text: 'NAME ..... RHYS CALLOWAY\nSKILLS ... MECHANIC, FIELD MEDIC\nBLOOD .... O NEG\nRATIONS .. 2 / DAY\nSTATUS ... CLEAN — NO BITES', font: 'Special Elite', weight: 400, size: 2, lineH: 1.55, color: '#1d1a17', fit: false }),
        E('stamp', { name: 'Cleared stamp', text: 'QUARANTINE', text2: 'GATE 3', center: 'CLEARED', color: '#2d5a2a', x: 76, y: 48, w: 21, h: 21, rot: -10, distress: .7 }),
        E('stamp', { name: 'Ration stamp', style: 'rect', text: 'RATION', center: '2 / DAY', text2: 'DEPOT', color: '#a02a1f', x: 44, y: 51.5, w: 20, h: 10, rot: 6, distress: .65 }),
        E('pattern', { name: 'Thumbprint', x: 84, y: 10, w: 8, h: 10, rot: 14, kind: 'thumb', color: '#4a1a12', density: 20, opacity: .6, blend: 'multiply' })
      ],
      back: [
        E('text', { name: 'Scrawl', x: 46, y: 22, w: 76, h: 14, text: 'trust no one\nwater at the old mill — boil it', font: 'Caveat', weight: 600, size: 4.2, lineH: 1.25, align: 'center', color: '#2a2622', rot: -3, fit: false }),
        E('stamp', { name: 'Void stamp', style: 'rect', text: 'VOID IF', center: 'BITTEN', text2: 'NO EXCEPTIONS', color: '#a02a1f', x: 46, y: 45, w: 30, h: 13, rot: 4, distress: .6 })
      ]
    };
  } },
  { id: 'velvet', name: 'Velvet Club black card · laser on metal', build() {
    const L = (o) => ({ finish: 'laser', relief: -.22, ...o });
    return {
      card: { fmt: 'id1', w: 85.6, h: 53.98, r: 3.18, thick: .8, sub: 'blackmetal', ink: 'satin', lam: 'none', relief: 1.4, edgeFin: 'gold' },
      scene: { env: 'gallery', backdrop: 'velvet', pose: 'hover', azim: -20, elev: 48, bloom: .35, dof: .3 },
      front: [
        E('pattern', L({ name: 'Crosshatch', x: 42.8, y: 27, w: 85.6, h: 53.98, kind: 'cross', color: '#ffffff', density: 70, lw: .04, opacity: .12, locked: true })),
        E('chip', { x: 13.5, y: 21 }),
        E('text', L({ name: 'Club', x: 46, y: 21, w: 60, h: 8, text: 'VELVET', font: 'Cormorant Garamond', weight: 600, size: 6.5, align: 'center', spacing: .4 })),
        E('line', L({ x: 46, y: 26.6, w: 18, lw: .18 })),
        E('text', L({ name: 'Members', x: 46, y: 30, w: 60, h: 3, text: 'PRIVATE MEMBERS', font: 'Inter', weight: 500, size: 1.4, align: 'center', spacing: .6 })),
        E('text', L({ name: 'Member', x: 28, y: 46.5, w: 40, h: 3, text: 'AURELIO DANESTI', font: 'Inter', weight: 600, size: 2, spacing: .3 })),
        E('text', L({ name: 'Number', x: 70, y: 46.5, w: 20, h: 3, text: '0001', font: 'Share Tech Mono', size: 1.9, align: 'right', spacing: .1 }))
      ],
      back: [
        E('rect', { name: 'Magnetic stripe', x: 42.8, y: 10, w: 85.6, h: 9, fill: '#08080a' }),
        E('rect', { name: 'Signature panel', x: 36, y: 25, w: 56, h: 7, fill: '#d6d8dd' }),
        E('sign', { x: 30, y: 25, w: 30, h: 5.5, text: 'A. Danesti', color: '#24262d' }),
        E('text', L({ name: 'Terms', x: 42.8, y: 40, w: 76, h: 6, text: 'Admission after nine. Jackets preferred. Secrets kept.', font: 'Inter', size: 1.5, align: 'center', spacing: .1 }))
      ]
    };
  } },
  { id: 'halvorsen', name: 'Halvorsen Institute student ID · portrait', build() {
    return {
      card: { fmt: 'id1p', w: 53.98, h: 85.6, r: 3.18, thick: .76, sub: 'pvc', ink: 'satin', lam: 'gloss' },
      scene: { env: 'white', backdrop: 'paper', pose: 'hover', azim: -30, elev: 55, bloom: .25 },
      front: [
        E('rect', { name: 'Header', x: 27, y: 15, w: 54, h: 30, fill: '#6b1d2a' }),
        E('seal', { name: 'Laurel', x: 27, y: 9, w: 10, h: 10, style: 'laurel', text: '', color: '#e9d7b0', finish: 'foil', foil: '#d9b45e' }),
        E('text', { name: 'Institute', x: 27, y: 19.5, w: 50, h: 4, text: 'HALVORSEN INSTITUTE', font: 'Playfair Display', weight: 700, size: 2.6, align: 'center', color: '#ffffff', spacing: .08 }),
        E('text', { name: 'Faculty', x: 27, y: 24, w: 50, h: 3, text: 'of Technology & Letters', font: 'Playfair Display', weight: 400, italic: true, size: 1.7, align: 'center', color: '#e9d7b0' }),
        E('photo', { name: 'Portrait', x: 27, y: 44, w: 24, h: 30, radius: 1.5, bg: '#e6e1d8' }),
        E('holo', { name: 'Glitter dot', x: 37, y: 56, w: 7, h: 7, shape: 'circle', holoPat: 2, emblem: 'ring', holoPat2: 0 }),
        E('text', { name: 'Name', x: 27, y: 64, w: 50, h: 5, text: 'Anouk Brandt-Seo', font: 'Inter', weight: 700, size: 3.2, align: 'center', color: '#1a1a1a' }),
        E('text', { name: 'Programme', x: 27, y: 68.5, w: 50, h: 3, text: 'Undergraduate · Architecture', font: 'Inter', weight: 500, size: 1.8, align: 'center', color: '#6b1d2a' }),
        E('field', { x: 17, y: 75, w: 22, label: 'Student no.', value: 'H-2031-7745', lsize: 1.1, vsize: 1.9, color: '#1a1a1a' }),
        E('field', { x: 39, y: 75, w: 16, label: 'Valid to', value: 'AUG 2028', lsize: 1.1, vsize: 1.9, color: '#1a1a1a' }),
        E('barcode', { x: 27, y: 82, w: 40, h: 4.5, data: 'H20317745', showText: false, color: '#1a1a1a' })
      ],
      back: [
        E('text', { name: 'Library', x: 27, y: 14, w: 46, h: 4, text: 'LIBRARY & CAMPUS ACCESS', font: 'Inter', weight: 700, size: 2, align: 'center', color: '#6b1d2a', spacing: .12 }),
        E('qr', { x: 27, y: 34, w: 22, h: 22, data: 'https://example.com/halvorsen/H-2031-7745', color: '#1a1a1a', bg: '#ffffff', quiet: 2 }),
        E('text', { name: 'Found', x: 27, y: 56, w: 46, h: 10, text: 'If found, please return to the porters’ lodge,\nHalvorsen Institute, 3 Kiln Lane.', font: 'Inter', size: 1.5, lineH: 1.45, align: 'center', color: '#3a3d44' }),
        E('micro', { x: 27, y: 80, w: 46, h: .7, text: 'HALVORSEN INSTITUTE · ', size: .4, color: '#6b1d2a' })
      ]
    };
  } },
  { id: 'grandprix', name: 'Circuit Federation racing licence · carbon', build() {
    const F = (label, value, x, y, w) => E('field', { label, value, x, y, w, h: 6.2, lfont: 'Oswald', font: 'Oswald', lweight: 500, lsize: 1.2, vsize: 2.4, lspacing: .14, lupper: true, lcolor: '#ff5a5a', color: '#ffffff' });
    return {
      card: { fmt: 'id1', w: 85.6, h: 53.98, r: 3.18, thick: .9, sub: 'carbon', ink: 'gloss', lam: 'none', relief: 1.4 },
      scene: { env: 'prism', backdrop: 'steel', pose: 'hover', azim: 30, elev: 40, bloom: .45, dof: .2 },
      front: [
        E('pattern', { name: 'Checker strip', x: 79, y: 27, w: 13.2, h: 53.98, kind: 'checker', color: '#ffffff', color2: '#111111', density: 7, opacity: .92, locked: true }),
        E('rect', { name: 'Red slash', x: 66, y: 27, w: 5, h: 64, rot: 18, fill: '#e02a2a', opacity: .9 }),
        E('flag', { name: 'Flag', x: 9.5, y: 8.6, w: 9, h: 6, kind: 'quarter', c1: '#111111', c2: '#ffffff', c3: '#e02a2a', emblem: 'none', wave: .3 }),
        E('text', { name: 'Federation', x: 39, y: 7.6, w: 54, h: 4, text: 'CIRCUIT FEDERATION', font: 'Oswald', weight: 700, size: 2.8, color: '#ffffff', spacing: .14 }),
        E('text', { name: 'Licence', x: 39, y: 11.6, w: 54, h: 3, text: 'INTERNATIONAL COMPETITION LICENCE · GRADE A', font: 'Inter', weight: 600, size: 1.3, color: '#ff5a5a', spacing: .1 }),
        E('photo', { name: 'Portrait', x: 14, y: 34, w: 17, h: 22, radius: .8, border: .4, borderColor: '#e02a2a' }),
        F('Driver', 'LIORA VASQUEZ-HOLM', 43, 22, 30), F('Team', 'ORBIT RACING', 43, 29, 30), F('Medical', 'VALID · 2027', 35, 36, 14), F('Blood', 'A+', 49, 36, 10),
        E('text', { name: 'Car number', x: 50, y: 46, w: 16, h: 12, text: '27', font: 'Oswald', weight: 700, size: 10, align: 'center', italic: true, color: '#e02a2a' }),
        E('text', { name: 'Holo CF', x: 34, y: 46.5, w: 12, h: 7, text: 'CF', font: 'Oswald', weight: 700, size: 5.5, align: 'center', color: '#ffffff', finish: 'holo', holoPat: 0 })
      ],
      back: [
        E('qr', { x: 18, y: 27, w: 18, h: 18, data: 'CIRCUIT FEDERATION · LVH-27 · fictional licence', color: '#111111', bg: '#ffffff', quiet: 1 }),
        E('text', { name: 'Rules', x: 54, y: 24, w: 52, h: 18, text: 'Licence holder agrees to the Federation code.\nRacing flags take precedence over radio.\nThe chequered flag is final.', font: 'Inter', size: 1.6, lineH: 1.5, color: '#e8e8e8' }),
        E('barcode', { x: 54, y: 44, w: 40, h: 6, data: 'CF-LVH-27', color: '#ffffff' })
      ]
    };
  } },
  { id: 'museum', name: 'Museum of Lost Things · staff badge', build() {
    return {
      card: { fmt: 'id1p', w: 53.98, h: 85.6, r: 3.18, thick: .76, slot: 'slot', sub: 'frostpvc', ink: 'satin', lam: 'none', relief: 1.4 },
      scene: { env: 'gallery', backdrop: 'marble', pose: 'stand', azim: -30, elev: 40, bloom: .3, dof: .35 },
      front: [
        E('pattern', { name: 'Watermark', x: 27, y: 42.8, w: 53.98, h: 85.6, kind: 'texttile', text: 'LOST · FOUND', color: '#1d2b33', density: 26, opacity: .06, locked: true }),
        E('text', { name: 'Museum', x: 27, y: 16.5, w: 48, h: 8, text: 'MUSEUM', font: 'Instrument Serif', weight: 400, size: 7, align: 'center', color: '#1d2b33', spacing: .06 }),
        E('text', { name: 'Of lost things', x: 27, y: 23, w: 48, h: 5, text: 'of Lost Things', font: 'Instrument Serif', weight: 400, italic: true, size: 4, align: 'center', color: '#1d2b33' }),
        E('line', { x: 27, y: 27.6, w: 28, lw: .15, color: '#1d2b33' }),
        E('photo', { name: 'Portrait', x: 27, y: 44, w: 26, h: 26, radius: 13, grayscale: true }),
        E('text', { name: 'Name', x: 27, y: 63, w: 48, h: 4, text: 'Oskar Wendehorst', font: 'Inter', weight: 600, size: 2.8, align: 'center', color: '#1d2b33' }),
        E('text', { name: 'Role', x: 27, y: 67.6, w: 48, h: 3, text: 'Keeper of Misplaced Umbrellas', font: 'Inter', weight: 400, italic: true, size: 1.8, align: 'center', color: '#4c5d66' }),
        E('rect', { name: 'Staff pill', x: 27, y: 75, w: 30, h: 5, radius: 2.5, fill: '#1d2b33' }),
        E('text', { name: 'Staff', x: 27, y: 75, w: 28, h: 3, text: 'STAFF · ALL WINGS', font: 'Inter', weight: 700, size: 1.5, align: 'center', color: '#ffffff', spacing: .16 })
      ],
      back: [
        E('text', { name: 'Note', x: 27, y: 40, w: 44, h: 22, text: 'If you have found this badge,\nyou have found something.\nPlease bring it to the\nRoom of Returns, east wing.', font: 'Instrument Serif', weight: 400, italic: true, size: 3, lineH: 1.35, align: 'center', color: '#1d2b33' }),
        E('barcode', { x: 27, y: 75, w: 36, h: 5, data: 'MLT-0088', color: '#1d2b33' })
      ]
    };
  } },
  { id: 'blank', name: 'Blank card · white PVC', build() { return { card: { fmt: 'id1', w: 85.6, h: 53.98, r: 3.18, thick: .76, sub: 'pvc' }, scene: {}, front: [], back: [] }; } }
];
function normEl(e) { const t = T[e.type]; if (!t) return null; if (e.type === 'photo' && e.look === undefined) e = { ...e, look: e.duo ? 'duo' : e.grayscale ? 'bw' : 'color', phSeed: hashStr(e.id || 'x') % 100 }; return { ...COMMON_DEF, ...JSON.parse(JSON.stringify(t.d)), ...e, id: e.id || uid() }; }
function normalize(o) { return { card: { ...CARD_DEF, ...(o.card || {}) }, scene: { ...SCENE_DEF, ...(o.scene || {}) }, front: (o.front || []).map(normEl).filter(Boolean), back: (o.back || []).map(normEl).filter(Boolean), assets: { ...(o.assets || {}) } }; }
function applyTemplate(id) {
  const t = TEMPLATES.find(t => t.id === id) || TEMPLATES[0]; const d = t.build();
  P.card = { ...CARD_DEF, ...d.card }; P.scene = { ...SCENE_DEF, ...d.scene }; P.front = d.front; P.back = d.back;
  selIds = []; selId = null; side = 'front';
}


/* ================= component presets ================= */
const COMPONENTS = (() => {
  const L = [];
  const add = (cat, name, make) => L.push({ cat, name, make });
  const full = (C, o) => ({ x: C.w / 2, y: C.h / 2, w: C.w, h: C.h, locked: true, ...o });
  // Security printing
  add('Security', 'Banknote rosette', C => [{ type: 'guilloche', name: 'Rosette', w: 34, h: 34, mode: 'rosette', lines: 64, f1: 16, f2: 6, amp: .45, inner: .25, lw: .04, c1: '#2f7f73', c2: '#8d5a99' }]);
  add('Security', 'Fine single-ink rosette', C => [{ type: 'guilloche', name: 'Rosette', w: 30, h: 30, mode: 'rosette', lines: 90, f1: 24, f2: 9, amp: .3, inner: .4, lw: .03, c1: '#5a6f80', c2: '#5a6f80' }]);
  add('Security', 'Wreath ring', C => [{ type: 'guilloche', name: 'Wreath', w: 30, h: 30, mode: 'ring', lines: 24, f1: 20, f2: 5, amp: .4, inner: .62, lw: .05, c1: '#7a5a2a', c2: '#2a5a7a' }]);
  add('Security', 'Spirograph', C => [{ type: 'guilloche', name: 'Spirograph', w: 26, h: 26, mode: 'spiro', lines: 10, f1: 8, f2: 3, amp: .8, lw: .06, c1: '#1f4f8a', c2: '#a43a6a' }]);
  add('Security', 'Rope band · top', C => [{ type: 'guilloche', name: 'Rope band', x: C.w / 2, y: 6, w: C.w, h: 8, mode: 'band', lines: 14, f1: 9, f2: 3, amp: .9, lw: .06, c1: '#4e9588', c2: '#a46aa2', c3: '#c8a85a', iris: true }]);
  add('Security', 'Rope band · bottom', C => [{ type: 'guilloche', name: 'Rope band', x: C.w / 2, y: C.h - 6, w: C.w, h: 8, mode: 'band', lines: 14, f1: 9, f2: 3, amp: .9, lw: .06, c1: '#4e9588', c2: '#a46aa2', c3: '#c8a85a', iris: true }]);
  add('Security', 'Wave field · full card', C => [{ type: 'guilloche', name: 'Wave field', ...full(C), mode: 'field', lines: 64, f1: 3, f2: 7, amp: .75, lw: .05, c1: '#86b9ad', c2: '#c39bc1', c3: '#cbb57f', iris: true, opacity: .75 }]);
  add('Security', 'Rainbow iris · full card', C => [{ type: 'pattern', name: 'Rainbow print', ...full(C), kind: 'iris', color: '#dcebe5', color2: '#efe2ee', color3: '#f0e9d2' }]);
  add('Security', 'Banknote lattice · full card', C => [{ type: 'pattern', name: 'Lattice', ...full(C), kind: 'mesh', color: '#9fb9b2', color2: '#c3a7c2', density: 22, lw: .05, opacity: .5 }]);
  add('Security', 'Topographic map · full card', C => [{ type: 'pattern', name: 'Contours', ...full(C), kind: 'topo', color: '#8fb5ad', color2: '#7a8fb5', density: 14, lw: .06, opacity: .5, seed: 7 }]);
  add('Security', 'Microtext line', C => [{ type: 'micro', x: C.w / 2, y: C.h - 1.8, w: C.w - 6, h: .7, text: 'FICTIONAL DOCUMENT · SPECIMEN · ', size: .42, color: '#5e8a82' }]);
  add('Security', 'Microtext border', C => [{ type: 'frame', name: 'Microtext border', x: C.w / 2, y: C.h / 2, w: C.w - 3, h: C.h - 3, style: 'micro', text: 'SPECIMEN · FICTIONAL · ', tsize: .4, color: '#5e8a82' }]);
  add('Security', 'Microtext ring', C => [{ type: 'micro', w: 18, h: 18, mode: 'ring', text: 'GENUINE · ', size: .45, color: '#5e8a82' }]);
  add('Security', 'Clear window + holo', C => [{ type: 'rect', name: 'Clear window', w: 11, h: 14, radius: 1.5, finish: 'window' }, { type: 'text', name: 'Window holo', w: 10, h: 9, text: 'A', font: 'Cinzel', weight: 700, size: 7, align: 'center', color: '#ffffff', finish: 'holo', holoPat: 4 }]);
  add('Security', 'UV sun emblem', C => [{ type: 'seal', name: 'UV emblem', w: 26, h: 26, style: 'sun', text: 'LUX · LEX · ', points: 16, finish: 'uv', uvColor: '#ff4fd8' }]);
  add('Security', 'UV hidden message', C => [{ type: 'text', name: 'UV message', w: 50, h: 5, text: 'verified original', font: 'Cinzel', weight: 700, size: 3, align: 'center', rot: -6, finish: 'uv', uvColor: '#7dff9a' }]);
  add('Security', 'Text watermark · full card', C => [{ type: 'pattern', name: 'Watermark', ...full(C), kind: 'texttile', text: 'SPECIMEN', color: '#334', density: 24, opacity: .07 }]);
  // Holograms
  add('Holograms', 'Star kinegram', C => [{ type: 'holo', name: 'Kinegram', w: 12, h: 12, shape: 'circle', holoPat: 1, emblem: 'star', holoPat2: 6 }]);
  add('Holograms', 'Hex mosaic', C => [{ type: 'holo', name: 'Hex OVD', w: 12, h: 12, shape: 'hex', holoPat: 3, emblem: 'orbit', holoPat2: 1 }]);
  add('Holograms', 'Glitter oval', C => [{ type: 'holo', name: 'Glitter oval', w: 15, h: 9, shape: 'oval', holoPat: 2, emblem: 'ring', holoPat2: 0 }]);
  add('Holograms', 'Shield OVD', C => [{ type: 'holo', name: 'Shield OVD', w: 12, h: 14, shape: 'shield', holoPat: 0, emblem: 'star', holoPat2: 5 }]);
  add('Holograms', 'Star-shaped foil', C => [{ type: 'holo', name: 'Star foil', w: 13, h: 13, shape: 'star', holoPat: 6, emblem: 'sun', holoPat2: 2 }]);
  add('Holograms', 'Holo stripe · vertical', C => [{ type: 'rect', name: 'Holo stripe', x: C.w - 5, y: C.h / 2, w: 3.5, h: C.h, fill: '#ffffff', finish: 'holo', holoPat: 4 }]);
  add('Holograms', 'Holo foil wordmark', C => [{ type: 'text', name: 'Holo text', w: 40, h: 7, text: 'AUTHENTIC', font: 'Cinzel', weight: 800, size: 4.5, align: 'center', color: '#ffffff', finish: 'holo', holoPat: 0 }]);
  add('Holograms', 'Holo seal burst', C => [{ type: 'shape', name: 'Holo burst', w: 14, h: 14, kind: 'burst', points: 24, inner: .84, fill: '#ffffff', finish: 'holo', holoPat: 6 }]);
  // Seals & stamps
  add('Seals & stamps', 'Sun seal · gold foil', C => [{ type: 'seal', name: 'Sun seal', w: 14, h: 14, style: 'sun', text: 'FICTIONAL · REALM · ', points: 14, color: '#1b4a44', finish: 'foil', foil: '#d6b25e', relief: .2 }]);
  add('Seals & stamps', 'Compass rose · foil', C => [{ type: 'seal', name: 'Compass rose', w: 18, h: 18, style: 'compass', text: 'TERRA · MARE · CAELUM · ', finish: 'foil', foil: '#c9a04e', relief: .22 }]);
  add('Seals & stamps', 'Laurel crest · foil', C => [{ type: 'seal', name: 'Laurel', w: 14, h: 14, style: 'laurel', text: '', finish: 'foil', foil: '#d6b25e', relief: .2 }]);
  add('Seals & stamps', 'Shield crest', C => [{ type: 'seal', name: 'Shield crest', w: 16, h: 16, style: 'shield', text: 'HONOR · ET · ARS · ', color: '#3b1f5c' }]);
  add('Seals & stamps', 'Rosette seal', C => [{ type: 'seal', name: 'Rosette seal', w: 16, h: 16, style: 'rosette', text: 'OFFICIUM · SIGILLUM · ', points: 9, color: '#7a2a1a' }]);
  add('Seals & stamps', 'Blind-embossed star', C => [{ type: 'seal', name: 'Tactile seal', w: 10, h: 10, style: 'star', text: '', points: 8, finish: 'blind', relief: .9 }]);
  add('Seals & stamps', 'Wax seal', C => [{ type: 'ellipse', name: 'Wax seal', w: 13, h: 12.5, fill: '#8e1f1f', fill2: '#4a0b0b', grad: true, angle: 60, relief: .75 }, { type: 'seal', name: 'Seal impression', w: 9, h: 9, style: 'star', text: '', points: 8, color: '#6a1414', relief: -.45 }]);
  add('Seals & stamps', 'APPROVED stamp', C => [{ type: 'stamp', name: 'Approved stamp', w: 22, h: 22, rot: -12, text: 'REGISTRY', text2: 'OFFICE', center: 'APPROVED', color: '#b3302a' }]);
  add('Seals & stamps', 'VOID stamp', C => [{ type: 'stamp', name: 'Void stamp', style: 'rect', w: 26, h: 12, rot: 8, text: 'SPECIMEN', center: 'VOID', text2: 'NOT VALID', color: '#b3302a', distress: .55 }]);
  add('Seals & stamps', 'PAID stamp', C => [{ type: 'stamp', name: 'Paid stamp', style: 'rect', w: 20, h: 10, rot: -9, text: 'FEE', center: 'PAID', text2: 'WITH THANKS', color: '#2d5a2a', distress: .5 }]);
  add('Seals & stamps', 'Entry stamp', C => [{ type: 'stamp', name: 'Entry stamp', style: 'rect', w: 28, h: 14, rot: -5, text: 'ADMITTED', center: '14 AUG', text2: 'PORT SALTMERE', color: '#27477a', distress: .5 }]);
  add('Seals & stamps', 'Inspected stamp', C => [{ type: 'stamp', name: 'Inspected', w: 18, h: 18, rot: 14, text: 'INSPECTED', text2: 'YARD 4', center: 'OK', color: '#5a2a7a', distress: .6 }]);
  add('Seals & stamps', 'Thumbprint', C => [{ type: 'pattern', name: 'Thumbprint', w: 9, h: 11.5, rot: -10, kind: 'thumb', color: '#3b2a20', density: 22, opacity: .5, blend: 'multiply' }]);
  // Identity
  add('Identity', 'Portrait + ghost image', C => { const s = Math.random() * 100 | 0; return [{ type: 'photo', name: 'Portrait', x: 15, y: C.h * .58, w: 20, h: 26, radius: 1.2, phSeed: s }, { type: 'photo', name: 'Ghost image', x: C.w - 12, y: C.h - 12, w: 10, h: 13, radius: .6, grayscale: true, opacity: .3, phSeed: s }]; });
  add('Identity', 'Colour portrait', C => [{ type: 'photo', name: 'Colour portrait', w: 22, h: 28, radius: 1.2, look: 'color', saturate: 1.1 }]);
  add('Identity', 'Round colour portrait', C => [{ type: 'photo', name: 'Round portrait', w: 24, h: 24, radius: 12, look: 'color', border: .6, borderColor: '#ffffff' }]);
  add('Identity', 'Colour-laser portrait', C => [{ type: 'photo', name: 'Colour-laser portrait', w: 22, h: 28, radius: 1, finish: 'laser', colorLaser: true, relief: -.2 }]);
  add('Identity', 'Colour halftone portrait', C => [{ type: 'photo', name: 'Colour halftone', w: 22, h: 28, look: 'color', halftone: .55 }]);
  add('Decoration', 'Full-bleed background photo', C => [{ type: 'photo', name: 'Background photo', x: C.w / 2, y: C.h / 2, w: C.w, h: C.h, radius: 0, look: 'color', opacity: 1 }]);
  add('Decoration', 'Faded photo backdrop', C => [{ type: 'photo', name: 'Photo backdrop', x: C.w / 2, y: C.h / 2, w: C.w, h: C.h, radius: 0, look: 'color', saturate: .6, brightness: 1.25, opacity: .35 }]);
  add('Identity', 'Engraved line portrait', C => [{ type: 'photo', name: 'Engraved portrait', w: 22, h: 28, radius: 1, finish: 'laser', relief: -.25, lines: .65 }]);
  add('Identity', 'Halftone portrait', C => [{ type: 'photo', name: 'Halftone portrait', w: 22, h: 28, halftone: .6, grayscale: true }]);
  add('Identity', 'Name block', C => [{ type: 'field', name: 'Surname', w: 32, h: 6.2, y: C.h / 2 - 3.5, label: 'Surname', value: 'ASHGROVE' }, { type: 'field', name: 'Given names', w: 32, h: 6.2, y: C.h / 2 + 3.5, label: 'Given names', value: 'ELARA JUNE' }]);
  add('Identity', 'Dates block', C => [{ type: 'field', name: 'Date of birth', x: C.w / 2 - 9, w: 17, h: 6.2, label: 'Date of birth', value: '14 MAR 1994' }, { type: 'field', name: 'Date of issue', x: C.w / 2 + 9, w: 17, h: 6.2, label: 'Date of issue', value: '01 JUN 2025' }, { type: 'field', name: 'Date of expiry', x: C.w / 2 - 9, y: C.h / 2 + 7, w: 17, h: 6.2, label: 'Date of expiry', value: '01 JUN 2035' }]);
  add('Identity', 'Signature strip', C => [{ type: 'rect', name: 'Signature strip', x: C.w / 2, y: 14, w: C.w, h: 8, fill: '#ebe6dc' }, { type: 'sign', x: C.w / 2 - 10, y: 14, w: 30, h: 6, text: 'E. Ashgrove', color: '#2b2b33' }]);
  add('Identity', 'Machine strip · 3 lines', C => [{ type: 'mrz', x: C.w / 2, y: C.h - 7.5, w: C.w - 6, h: 11, cols: 30, text: 'I<FORAB1234567<<<<<<<<<<<<<<<\n9403140F3403147FOR<<<<<<<<<<<0\nASHGROVE<<ELARA<JUNE<<<<<<<<<<' }]);
  add('Identity', 'Machine strip · 2 lines', C => [{ type: 'mrz', x: C.w / 2, y: C.h - 6, w: C.w - 6, h: 8, cols: 44, text: 'P<FORASHGROVE<<ELARA<JUNE<<<<<<<<<<<<<<<<<<<\nAB12345670FOR9403140F3403147<<<<<<<<<<<<<<00' }]);
  add('Identity', 'Code 128 barcode', C => [{ type: 'barcode', w: 36, h: 7, data: 'FOR-0042-1187' }]);
  add('Identity', 'Stacked barcode', C => [{ type: 'barcode', w: 40, h: 10, kind: 'stack', data: 'FOR-0042-1187' }]);
  add('Identity', 'QR code', C => [{ type: 'qr', w: 14, h: 14, data: 'https://example.com', quiet: 1 }]);
  add('Identity', 'QR code · round dots', C => [{ type: 'qr', w: 14, h: 14, data: 'https://example.com', dots: true, quiet: 1 }]);
  add('Identity', '2D code', C => [{ type: 'matrix', w: 12, h: 12, data: 'forge' }]);
  add('Identity', 'Gold contact chip', C => [{ type: 'chip', x: 14.5, y: C.h / 2 - 3 }]);
  add('Identity', 'Silver ornate chip', C => [{ type: 'chip', x: 14.5, y: C.h / 2 - 3, style: 'ornate', foil: '#d3d8de' }]);
  add('Identity', 'Magnetic stripe', C => [{ type: 'rect', name: 'Magnetic stripe', x: C.w / 2, y: 10, w: C.w, h: 9, fill: '#0b0b0c' }]);
  add('Identity', 'Red serial number', C => [{ type: 'text', name: 'Serial', w: 26, h: 3, text: 'AB 123 456 789', font: 'Share Tech Mono', size: 1.9, align: 'center', color: '#b2352b', spacing: .08 }]);
  add('Identity', 'Fictional flag', C => [{ type: 'flag', w: 16, h: 10.6 }]);
  // Decoration
  add('Decoration', 'Header band', C => [{ type: 'rect', name: 'Header band', x: C.w / 2, y: 6, w: C.w, h: 12, fill: '#1d4f4a', fill2: '#2f7f73', grad: true, angle: 0 }]);
  add('Decoration', 'Footer band', C => [{ type: 'rect', name: 'Footer band', x: C.w / 2, y: C.h - 4, w: C.w, h: 8, fill: '#1d4f4a' }]);
  add('Decoration', 'Art deco frame', C => [{ type: 'frame', name: 'Deco frame', x: C.w / 2, y: C.h / 2, w: C.w - 6, h: C.h - 6, style: 'deco', color: '#b8892b', size: 9, finish: 'foil', foil: '#cfa555' }]);
  add('Decoration', 'Filigree corners', C => [{ type: 'frame', name: 'Filigree', x: C.w / 2, y: C.h / 2, w: C.w - 4, h: C.h - 4, style: 'filigree', color: '#8a6a2a', size: 9 }]);
  add('Decoration', 'Double rule frame', C => [{ type: 'frame', name: 'Double rule', x: C.w / 2, y: C.h / 2, w: C.w - 5, h: C.h - 5, style: 'double', color: '#2a3a3a', lw: .3, radius: 2 }]);
  add('Decoration', 'Corner brackets', C => [{ type: 'frame', name: 'Brackets', x: C.w / 2, y: C.h / 2, w: C.w - 5, h: C.h - 5, style: 'brackets', color: '#2a3a3a', size: 6 }]);
  add('Decoration', 'Guilloche rope border', C => [{ type: 'frame', name: 'Rope border', x: C.w / 2, y: C.h / 2, w: C.w - 3, h: C.h - 3, style: 'rope', color: '#2f7f73', size: 6, lw: .12 }]);
  add('Decoration', 'Beaded border', C => [{ type: 'frame', name: 'Beads', x: C.w / 2, y: C.h / 2, w: C.w - 4, h: C.h - 4, style: 'beads', color: '#b8892b', size: 4, lw: .3, finish: 'foil', foil: '#cfa555' }]);
  add('Decoration', 'Ticket perforation', C => [{ type: 'frame', name: 'Perforation', x: C.w / 2, y: C.h / 2, w: C.w - 3, h: C.h - 3, style: 'perforated', size: 5, lw: .35, finish: 'window' }]);
  add('Decoration', 'Ribbon banner', C => [{ type: 'shape', name: 'Ribbon', w: 40, h: 7, kind: 'ribbon', fill: '#9e2b30' }, { type: 'text', name: 'Ribbon text', w: 32, h: 5, text: 'MEMBER', font: 'Cinzel', weight: 700, size: 2.8, align: 'center', color: '#fff4e0', spacing: .2 }]);
  add('Decoration', 'Star field · full card', C => [{ type: 'pattern', name: 'Star field', ...full(C), kind: 'stars', color: '#9bdcff', density: 26, opacity: .5 }]);
  add('Decoration', 'Circuit traces · full card', C => [{ type: 'pattern', name: 'Circuit', ...full(C), kind: 'circuit', color: '#2f7f73', density: 26, lw: .1, opacity: .35 }]);
  add('Decoration', 'Aurora gradient · full card', C => [{ type: 'pattern', name: 'Aurora', ...full(C), kind: 'aurora', color: '#120a24', color2: '#ff3d8b', color3: '#3df5ff', amp: .8 }]);
  add('Decoration', 'Sunburst rays · full card', C => [{ type: 'pattern', name: 'Sunburst', ...full(C), kind: 'rays', color: '#eadfc8', density: 56, amp: .8, opacity: .5 }]);
  add('Decoration', 'Diagonal stripes', C => [{ type: 'pattern', name: 'Stripes', w: 30, h: 8, kind: 'stripes', color: '#111111', color2: '#ffd23d', density: 14 }]);
  add('Decoration', 'Chevrons', C => [{ type: 'pattern', name: 'Chevrons', w: 40, h: 14, kind: 'chevron', color: '#2f7f73', density: 16, lw: .12 }]);
  add('Decoration', 'Fish scales', C => [{ type: 'pattern', name: 'Scales', w: 40, h: 20, kind: 'scales', color: '#2f7f73', density: 18, lw: .08 }]);
  add('Decoration', 'Checker strip', C => [{ type: 'pattern', name: 'Checker', x: C.w - 6, y: C.h / 2, w: 10, h: C.h, kind: 'checker', color: '#ffffff', color2: '#111111', density: 6 }]);
  add('Decoration', 'Seal burst badge', C => [{ type: 'shape', name: 'Burst', w: 16, h: 16, kind: 'burst', points: 20, inner: .84, fill: '#d6b25e', finish: 'foil', foil: '#d6b25e' }, { type: 'text', name: 'Burst text', w: 12, h: 6, text: 'VIP', font: 'Archivo Black', size: 4, align: 'center', color: '#1a1a1a' }]);
  // Text styles
  add('Text styles', 'Engraved serif title', C => [{ type: 'text', name: 'Title', w: 64, h: 5, text: 'FICTIONAL REALM', font: 'Cinzel', weight: 700, size: 3.4, align: 'center', color: '#123c37', spacing: .14 }]);
  add('Text styles', 'Blackletter title', C => [{ type: 'text', name: 'Title', w: 70, h: 6, text: 'Guild of Wanderers', font: 'UnifrakturMaguntia', size: 4.4, align: 'center', color: '#2b1a0d' }]);
  add('Text styles', 'Sci-fi title', C => [{ type: 'text', name: 'Title', w: 64, h: 4, text: 'ORBITAL AUTHORITY', font: 'Orbitron', weight: 800, size: 2.8, align: 'center', color: '#0b1d2a', spacing: .2 }]);
  add('Text styles', 'Art deco title', C => [{ type: 'text', name: 'Title', w: 64, h: 8, text: 'GRAND HOTEL', font: 'Playfair Display', weight: 800, size: 5.5, align: 'center', color: '#1c2a3a', spacing: .12, grad: true, color2: '#b8892b', gangle: 90 }]);
  add('Text styles', 'Curved title', C => [{ type: 'text', name: 'Curved title', w: 46, h: 6, text: 'ORDER OF THE LANTERN', font: 'Cinzel', weight: 700, size: 2.6, align: 'center', color: '#3b1f5c', arc: 70 }]);
  add('Text styles', 'Typewriter block', C => [{ type: 'text', name: 'Typed text', w: 50, h: 14, text: 'NAME ...... J. DOE\nTRADE ..... TINKER\nVALID ..... ONE WINTER', font: 'Special Elite', size: 2, lineH: 1.55, color: '#2b2620', fit: false }]);
  add('Text styles', 'Handwritten note', C => [{ type: 'text', name: 'Note', w: 50, h: 6, text: 'good for one free coffee', font: 'Caveat', weight: 500, size: 3.6, color: '#2b3a6a', rot: -4 }]);
  add('Text styles', 'Small caps label', C => [{ type: 'text', name: 'Label', w: 40, h: 3, text: 'MEMBER SINCE', font: 'Inter', weight: 600, size: 1.3, color: '#5d6b68', spacing: .3 }]);
  add('Text styles', 'Big bold number', C => [{ type: 'text', name: 'Number', w: 20, h: 12, text: '27', font: 'Oswald', weight: 700, size: 10, align: 'center', italic: true, color: '#e02a2a' }]);
  add('Text styles', 'Laser-engraved value', C => [{ type: 'text', name: 'Value', w: 40, h: 4, text: 'ENGRAVED VALUE', font: 'Inter', weight: 600, size: 2.2, color: '#222', finish: 'laser', relief: -.2 }]);
  // more holograms, seals, text
  add('Holograms', 'Rainbow foil band', C => [{ type: 'rect', name: 'Foil band', x: C.w / 2, y: C.h * .82, w: C.w, h: 4, fill: '#ffffff', finish: 'holo', holoPat: 0 }]);
  add('Holograms', 'Liquid holo disc', C => [{ type: 'holo', name: 'Liquid disc', w: 13, h: 13, shape: 'circle', holoPat: 7, emblem: 'wave', holoPat2: 4 }]);
  add('Holograms', 'Pixel hologram text', C => [{ type: 'text', name: 'Pixel holo text', w: 36, h: 6, text: 'GENUINE', font: 'Orbitron', weight: 800, size: 4, align: 'center', color: '#ffffff', finish: 'holo', holoPat: 3 }]);
  add('Holograms', 'Corner holo patch', C => [{ type: 'holo', name: 'Corner patch', x: C.w - 9, y: 9, w: 12, h: 12, shape: 'rect', holoPat: 5, emblem: 'sun', holoPat2: 2 }]);
  add('Seals & stamps', 'Notary seal · blind emboss', C => [{ type: 'seal', name: 'Notary seal', w: 16, h: 16, style: 'rosette', text: 'NOTARY · PUBLIC · FICTIONAL · ', points: 11, finish: 'blind', relief: .85 }]);
  add('Seals & stamps', 'Green wax seal', C => [{ type: 'ellipse', name: 'Wax seal', w: 13, h: 12.5, fill: '#2f6b3a', fill2: '#173a1e', grad: true, angle: 60, relief: .75 }, { type: 'seal', name: 'Seal impression', w: 9, h: 9, style: 'laurel', text: '', color: '#1e4a26', relief: -.45 }]);
  add('Text styles', 'Outlined display', C => [{ type: 'text', name: 'Display', w: 60, h: 10, text: 'VOLTAGE', font: 'Archivo Black', size: 8, align: 'center', color: '#ffd23d', stroke: '#111111', strokeW: .25 }]);
  add('Text styles', 'Gradient gold title', C => [{ type: 'text', name: 'Gold title', w: 64, h: 7, text: 'ROYAL CHARTER', font: 'Cinzel', weight: 800, size: 4.4, align: 'center', color: '#f3d98b', grad: true, color2: '#8a5a1c', gangle: 90, spacing: .1 }]);
  add('Text styles', 'Monospace data line', C => [{ type: 'text', name: 'Data line', w: 60, h: 3, text: 'REF 0042-AX · ISSUED 2026-11-16 · CLASS B', font: 'IBM Plex Mono', weight: 500, size: 1.6, color: '#333333', spacing: .05 }]);
  // full layouts that adapt to the card size
  add('ID layouts', 'ID front · photo left', C => [
    { type: 'text', name: 'Issuer', x: C.w * .58, y: C.h * .11, w: C.w * .76, h: 5, text: 'FICTIONAL REALM', font: 'Cinzel', weight: 700, size: 3, color: '#1b3a36', spacing: .14 },
    { type: 'text', name: 'Document', x: C.w * .58, y: C.h * .18, w: C.w * .76, h: 3, text: 'Identity card · Carte d’identité', font: 'Inter', weight: 500, size: 1.5, color: '#4a6a64' },
    { type: 'seal', name: 'Seal', x: C.w * .1, y: C.h * .15, w: Math.min(C.w, C.h) * .2, h: Math.min(C.w, C.h) * .2, style: 'sun', text: 'FICTIONAL · REALM · ', finish: 'foil', foil: '#d6b25e', relief: .2 },
    { type: 'photo', name: 'Portrait', x: C.w * .19, y: C.h * .58, w: C.w * .25, h: C.h * .5, radius: 1.2 },
    { type: 'field', name: 'Surname', x: C.w * .56, y: C.h * .34, w: C.w * .4, label: 'Surname', value: 'ASHGROVE' },
    { type: 'field', name: 'Given names', x: C.w * .56, y: C.h * .47, w: C.w * .4, label: 'Given names', value: 'ELARA JUNE' },
    { type: 'field', name: 'Date of birth', x: C.w * .47, y: C.h * .6, w: C.w * .22, label: 'Date of birth', value: '14 MAR 1994' },
    { type: 'field', name: 'Date of expiry', x: C.w * .71, y: C.h * .6, w: C.w * .22, label: 'Date of expiry', value: '14 MAR 2034' },
    { type: 'sign', x: C.w * .62, y: C.h * .82, w: C.w * .3, h: C.h * .1, text: 'E. Ashgrove' }]);
  add('Badge layouts', 'Portrait badge front', C => [
    { type: 'rect', name: 'Header', x: C.w / 2, y: C.h * .12, w: C.w, h: C.h * .24, fill: '#1b1d22' },
    { type: 'text', name: 'Company', x: C.w / 2, y: C.h * .14, w: C.w * .9, h: 4, text: 'NORTHWIND LABS', font: 'Space Grotesk', weight: 700, size: 3, align: 'center', color: '#ffffff', spacing: .08 },
    { type: 'photo', name: 'Portrait', x: C.w / 2, y: C.h * .45, w: Math.min(C.w, C.h) * .5, h: Math.min(C.w, C.h) * .5, radius: Math.min(C.w, C.h) * .25, border: .6, borderColor: '#ff6b2c' },
    { type: 'text', name: 'Name', x: C.w / 2, y: C.h * .7, w: C.w * .9, h: 5, text: 'Wren Okafor', font: 'Space Grotesk', weight: 700, size: 3.6, align: 'center', color: '#17181c' },
    { type: 'text', name: 'Role', x: C.w / 2, y: C.h * .76, w: C.w * .9, h: 3, text: 'Research Engineer', font: 'Inter', weight: 500, size: 1.9, align: 'center', color: '#e0551d' },
    { type: 'barcode', x: C.w / 2, y: C.h * .9, w: C.w * .7, h: C.h * .06, data: 'NWL-20417', showText: false, color: '#17181c' }]);
  add('Member layouts', 'Membership front · minimal', C => [
    { type: 'text', name: 'Club', x: C.w / 2, y: C.h * .4, w: C.w * .8, h: 9, text: 'MERIDIAN', font: 'Cormorant Garamond', weight: 600, size: 6.5, align: 'center', color: '#1c2a3a', spacing: .3 },
    { type: 'line', x: C.w / 2, y: C.h * .5, w: C.w * .22, lw: .2, color: '#b8892b', finish: 'foil', foil: '#cfa555' },
    { type: 'text', name: 'Members', x: C.w / 2, y: C.h * .57, w: C.w * .8, h: 3, text: 'PRIVATE MEMBERS', font: 'Inter', weight: 500, size: 1.4, align: 'center', color: '#5a6472', spacing: .5 },
    { type: 'text', name: 'Member', x: C.w * .3, y: C.h * .86, w: C.w * .5, h: 3, text: 'ELARA VOSS', font: 'Inter', weight: 600, size: 2, color: '#1c2a3a', spacing: .25 },
    { type: 'text', name: 'Number', x: C.w * .8, y: C.h * .86, w: C.w * .3, h: 3, text: 'Nº 0042', font: 'Share Tech Mono', size: 1.8, align: 'right', color: '#1c2a3a' }]);
  add('Back layouts', 'Back · stripe & signature', C => [
    { type: 'rect', name: 'Magnetic stripe', x: C.w / 2, y: C.h * .2, w: C.w, h: C.h * .17, fill: '#0b0b0c' },
    { type: 'rect', name: 'Signature panel', x: C.w * .42, y: C.h * .48, w: C.w * .65, h: C.h * .13, fill: '#e6e2d8' },
    { type: 'sign', x: C.w * .36, y: C.h * .48, w: C.w * .35, h: C.h * .1, text: 'E. Ashgrove', color: '#2b2b33' },
    { type: 'text', name: 'Terms', x: C.w / 2, y: C.h * .72, w: C.w * .88, h: C.h * .12, text: 'This card is the property of its fictional issuer.\nIf found, please return it to any branch.', font: 'Inter', size: 1.4, lineH: 1.5, align: 'center', color: '#444' }]);
  add('Back layouts', 'Back · machine strip & barcode', C => [
    { type: 'field', name: 'Place of birth', x: C.w * .3, y: C.h * .18, w: C.w * .45, label: 'Place of birth', value: 'SALTMERE' },
    { type: 'field', name: 'Date of issue', x: C.w * .74, y: C.h * .18, w: C.w * .3, label: 'Date of issue', value: '01 JUN 2025' },
    { type: 'barcode', x: C.w * .35, y: C.h * .45, w: C.w * .5, h: C.h * .12, data: 'AB1234567' },
    { type: 'mrz', x: C.w / 2, y: C.h * .82, w: C.w * .94, h: C.h * .22, cols: 30, text: 'I<FORAB1234567<<<<<<<<<<<<<<<\n9403140F3403147FOR<<<<<<<<<<<0\nASHGROVE<<ELARA<JUNE<<<<<<<<<<' }]);
  add('Security', 'Security underprint kit', C => [
    { type: 'pattern', name: 'Rainbow print', x: C.w / 2, y: C.h / 2, w: C.w, h: C.h, kind: 'iris', color: '#dcebe5', color2: '#efe2ee', color3: '#f0e9d2', locked: true },
    { type: 'guilloche', name: 'Wave field', x: C.w / 2, y: C.h / 2, w: C.w, h: C.h, mode: 'field', lines: 64, f1: 3, f2: 7, amp: .75, lw: .05, c1: '#86b9ad', c2: '#c39bc1', c3: '#cbb57f', iris: true, opacity: .75, locked: true },
    { type: 'guilloche', name: 'Rosette', x: C.w * .72, y: C.h * .55, w: Math.min(C.w, C.h) * .8, h: Math.min(C.w, C.h) * .8, mode: 'rosette', lines: 56, f1: 14, f2: 6, amp: .45, inner: .26, lw: .045, c1: '#3f8e81', c2: '#9a5f9c', opacity: .55, locked: true },
    { type: 'micro', x: C.w / 2, y: C.h - 1.6, w: C.w - 6, h: .7, text: 'FICTIONAL DOCUMENT · SPECIMEN · ', size: .42, color: '#5e8a82', locked: true }]);
  return L;
})();
function instantiateComponent(comp, C) {
  if (comp.user) return instantiateUser(comp, C);
  return comp.make(C).map(o => { const { type, ...rest } = o; const el = makeEl(type, rest); if (o.x === undefined) el.x = C.w / 2 + (o.dx || 0); if (o.y === undefined) el.y = C.h / 2 + (o.dy || 0); return el; });
}

/* ================= scene looks ================= */
const LOOKS = [
  { name: 'Product hero', s: { env: 'softbox', backdrop: 'slate', pose: 'hover', azim: -38, elev: 50, keyInt: 1, envInt: 1, exposure: 1, bloom: .35, dof: .15, vignette: .35, grain: .2, dust: true }, cam: 'hero' },
  { name: 'Catalogue white', s: { env: 'white', backdrop: 'paper', pose: 'hover', azim: -25, elev: 60, keyInt: .8, envInt: 1.2, exposure: 1.05, bloom: .15, dof: 0, vignette: .1, grain: .05, dust: false }, cam: 'hero' },
  { name: 'Noir desk', s: { env: 'interrogation', backdrop: 'walnut', pose: 'desk', azim: 30, elev: 62, keyInt: 1.6, envInt: .5, exposure: 1, bloom: .25, dof: .35, vignette: .75, grain: .5, dust: true } },
  { name: 'Evidence photo', s: { env: 'lab', backdrop: 'paper', pose: 'desk', azim: 0, elev: 80, keyInt: 1.2, envInt: 1, exposure: 1.05, bloom: .1, dof: 0, vignette: .15, grain: .25, dust: false }, cam: 'top' },
  { name: 'Museum vitrine', s: { env: 'gallery', backdrop: 'velvet', pose: 'stand', azim: -30, elev: 55, keyInt: 1.2, envInt: .8, exposure: 1, bloom: .3, dof: .35, vignette: .45, grain: .15, dust: true }, cam: 'hero' },
  { name: 'Neon alley', s: { env: 'neon', backdrop: 'blackglass', pose: 'hover', azim: 120, elev: 35, keyInt: 1, envInt: 1.2, exposure: 1, bloom: .75, dof: .25, vignette: .5, grain: .3, dust: true } },
  { name: 'Golden desk', s: { env: 'golden', backdrop: 'leather', pose: 'desk', azim: -60, elev: 32, keyInt: 1.2, envInt: 1, exposure: 1, bloom: .35, dof: .3, vignette: .45, grain: .25, dust: true } },
  { name: 'Jeweller macro', s: { env: 'softbox', backdrop: 'velvet', pose: 'hover', azim: -45, elev: 40, keyInt: 1.1, envInt: 1, exposure: 1, bloom: .4, dof: .85, vignette: .4, grain: .15, dust: true }, cam: 'macro' },
  { name: 'Blacklight inspection', s: { env: 'neon', backdrop: 'slate', pose: 'desk', azim: 0, elev: 60, keyInt: 1, envInt: 1, exposure: 1, bloom: .7, dof: .2, vignette: .5, grain: .25, dust: false }, uv: true, cam: 'top' },
  { name: 'Cold lab', s: { env: 'lab', backdrop: 'steel', pose: 'hover', azim: -20, elev: 55, keyInt: 1, envInt: 1, exposure: 1, bloom: .25, dof: .1, vignette: .2, grain: .1, dust: false } },
  { name: 'Candlelit study', s: { env: 'candle', backdrop: 'walnut', pose: 'desk', azim: -70, elev: 30, keyInt: 1.2, envInt: 1, exposure: 1, bloom: .3, dof: .4, vignette: .6, grain: .35, dust: true } },
  { name: 'Card table', s: { env: 'golden', backdrop: 'felt', pose: 'desk', azim: -40, elev: 45, keyInt: 1.1, envInt: 1, exposure: 1, bloom: .3, dof: .3, vignette: .45, grain: .2, dust: true } },
  { name: 'Sunset balcony', s: { env: 'sunset', backdrop: 'concrete', pose: 'hover', azim: -75, elev: 22, keyInt: 1.3, envInt: 1, exposure: 1, bloom: .55, dof: .25, vignette: .4, grain: .2, dust: true } },
  { name: 'Deep sea', s: { env: 'aqua', backdrop: 'blackglass', pose: 'hover', azim: 40, elev: 60, keyInt: .9, envInt: 1.2, exposure: 1, bloom: .55, dof: .3, vignette: .55, grain: .2, dust: true } },
  { name: 'On a lanyard', s: { env: 'softbox', backdrop: 'void', pose: 'lanyard', azim: -30, elev: 45, keyInt: 1, envInt: 1, exposure: 1, bloom: .3, dof: .2, vignette: .35, grain: .15, dust: false }, cam: 'hero' },
  { name: 'Cork board', s: { env: 'white', backdrop: 'cork', pose: 'desk', azim: -30, elev: 65, keyInt: 1, envInt: 1, exposure: 1, bloom: .15, dof: .15, vignette: .3, grain: .15, dust: false }, cam: 'top' },
  { name: 'Marble counter', s: { env: 'gallery', backdrop: 'marble', pose: 'desk', azim: -35, elev: 42, keyInt: 1.1, envInt: 1, exposure: 1, bloom: .3, dof: .3, vignette: .3, grain: .1, dust: false } }
];

/* ================= palettes & identities ================= */
const PALETTES = [['Original', 0, 1, 0], ['Warmer', 35, 1.05, 0], ['Cooler', -40, 1, 0], ['Shift 90°', 90, 1, 0], ['Opposite', 180, 1, 0], ['Shift −90°', -90, 1, 0], ['Vivid', 0, 1.5, 0], ['Pastel', 0, .55, .1], ['Monochrome', 0, 0, 0], ['Noir', 0, .25, -.12]];
const NAMEBANK = {
  given: ['Elara', 'Corin', 'Maelis', 'Tavian', 'Isolde', 'Brannoc', 'Seren', 'Oskar', 'Liora', 'Dariel', 'Wren', 'Anouk', 'Ilya', 'Mireille', 'Teodor', 'Imani', 'Rhys', 'Noor', 'Juno', 'Idris', 'Saskia', 'Caspian', 'Yara', 'Felix', 'Ottilie', 'Kenji', 'Amara', 'Lucan', 'Zofia', 'Bastian', 'Ines', 'Hollis', 'Marisol', 'Edvin', 'Priya', 'Thaddeus', 'Nadia', 'Ronan', 'Keziah', 'Soren', 'Aurelio', 'Talia', 'Emeric', 'Odessa', 'Jasper', 'Leocadia'],
  sur1: ['Ash', 'Thorn', 'Marrow', 'Hal', 'Quill', 'Vant', 'Corv', 'Brann', 'Wende', 'Lind', 'Holl', 'Ever', 'Stone', 'Black', 'Silver', 'Raven', 'Frost', 'Dun', 'Kestr', 'Wyn', 'Morr', 'Fen', 'Grey', 'Hart', 'Calder', 'Penn'],
  sur2: ['grove', 'wind', 'den', 'wood', 'ane', 'ley', 'ford', 'more', 'wick', 'mere', 'brook', 'vale', 'well', 'croft', 'stead', 'holm', 'ridge', 'field', 'hart', 'by', 'ton', 'rook', 'lowe', 'gate'],
  places: ['SALTMERE', 'ASHBY CROSS', 'PORT ELLING', 'WYVERN HOLLOW', 'MERROWGATE', 'CALDRIS', 'NORTHWOLD', 'FENWICK REACH', 'LANTERN BAY', 'GREYHAVEN', 'OLD KESTREL', 'SILVERFORD']
};
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
function randPerson(seed) {
  const R = rng(seed), pick = (a) => a[R() * a.length | 0], given = pick(NAMEBANK.given), given2 = R() < .5 ? pick(NAMEBANK.given) : '', sur = pick(NAMEBANK.sur1) + pick(NAMEBANK.sur2);
  const date = (y0, y1) => { const y = y0 + (R() * (y1 - y0 + 1) | 0), m = R() * 12 | 0, d = 1 + (R() * 28 | 0); return { y, m, d, str: `${String(d).padStart(2, '0')} ${MONTHS[m]} ${y}`, mrz: `${String(y % 100).padStart(2, '0')}${String(m + 1).padStart(2, '0')}${String(d).padStart(2, '0')}` }; };
  const dob = date(1958, 2006), iss = date(2021, 2026), exp = { ...iss, y: iss.y + 10 }; exp.str = `${String(exp.d).padStart(2, '0')} ${MONTHS[exp.m]} ${exp.y}`; exp.mrz = `${String(exp.y % 100).padStart(2, '0')}${String(exp.m + 1).padStart(2, '0')}${String(exp.d).padStart(2, '0')}`;
  const AL = 'ABCDEFGHJKLMNPQRSTUVWXYZ', id = AL[R() * 24 | 0] + AL[R() * 24 | 0] + String(1e6 + (R() * 9e6 | 0)), sex = R() < .45 ? 'F' : R() < .9 ? 'M' : 'X';
  return { given: (given + (given2 && given2 !== given ? ' ' + given2 : '')).toUpperCase(), first: given, sur: sur.toUpperCase(), surTitle: sur, sex, dob, iss, exp, id, place: pick(NAMEBANK.places), height: 150 + (R() * 46 | 0) };
}
function mrzFor(p, code, cols) {
  const nm = (s) => s.replace(/[^A-Z ]/g, '').trim().replace(/ +/g, '<'), pad = (s, n) => (s + '<'.repeat(n)).slice(0, n);
  if (cols >= 40) return [pad(`P<${code}${nm(p.sur)}<<${nm(p.given)}`, 44), pad(`${pad(p.id, 9)}0${code}${p.dob.mrz}0${p.sex}${p.exp.mrz}0`, 42) + '00'].join('\n');
  return [pad(`I<${code}${pad(p.id, 9)}0`, 30), pad(`${p.dob.mrz}0${p.sex}${p.exp.mrz}0${code}`, 29) + '0', pad(`${nm(p.sur)}<<${nm(p.given)}`, 30)].join('\n');
}

function instantiateUser(rec, C) {
  const sx = C.w / (rec.card?.w || C.w), sy = C.h / (rec.card?.h || C.h);
  for (const [k, v] of Object.entries(rec.assets || {})) if (!P.assets[k]) P.assets[k] = v;
  return (rec.els || []).map(o => { const el = normEl({ ...JSON.parse(JSON.stringify(o)), id: uid() }); if (!el) return null; el.x *= sx; el.y *= sy; if (Math.abs(o.w - (rec.card?.w || 0)) < .6) el.w = C.w; if (Math.abs(o.h - (rec.card?.h || 0)) < .6) el.h = C.h; return el; }).filter(Boolean);
}
