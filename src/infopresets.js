/* ================= poster mode: infographic parts and templates ================= */
POSTER_CATS.splice(1, 0, 'Infographic');
(() => {   /* a 5:8 sheet, the shape of a phone-friendly infographic */
  const cu = FORMATS.custom; delete FORMATS.custom;
  FORMATS.ps_info = { label: 'Infographic · 5:8 · 300 × 480', w: 300, h: 480, r: 0, thick: .2, poster: true, slot: 'none' };
  FORMATS.ps_info916 = { label: 'Infographic · 9:16 · 270 × 480', w: 270, h: 480, r: 0, thick: .2, poster: true, slot: 'none' };
  FORMATS.custom = cu;
})();
(() => {
  const add = (name, make, o = {}) => COMPONENTS.push({ cat: 'Infographic', name, mode: 'poster', make, ...o });
  const S = C => Math.min(C.w, C.h * .8) / 300;   // components are drawn for a 300 mm wide sheet and scaled to the poster
  const HEAD = { font: 'Inter', weight: 700, bweight: 800, size: 5.4, color: '#111111', hi: '#d50000', bcolor: '#111111', bullet: 'dot', lineH: 1.25, para: .38, valign: 'top', align: 'left', fit: true };
  const card = (s, o) => ({ type: 'infocard', name: (o.title || 'Info card').slice(0, 28), style: 'header', fill: '#ffffff', bw: 1 * s, radius: 2 * s, pad: 4.2 * s, headH: 15 * s, tfont: 'Montserrat', tweight: 900, tsize: 7 * s, tcolor: '#ffffff', iconColor: '#ffffff', tupper: true, ttrack: .02, ...HEAD, size: 5.4 * s, ...o });
  const step = (s, o) => ({ type: 'infocard', name: 'Step ' + (o.num || ''), style: 'step', icon: '', fill: '#ffffff', border: '#1b4f8a', badge: '#1b4f8a', badgeText: '#ffffff', bw: 1 * s, radius: 2 * s, pad: 3 * s, badgeR: 7.75 * s, tfont: 'Montserrat', tweight: 900, tsize: 6.8 * s, tcolor: '#111111', tupper: true, ttrack: .01,
    font: 'Inter', weight: 600, bweight: 800, size: 5.2 * s, color: '#222222', hi: '#1b4f8a', bcolor: '#222222', bullet: 'none', lineH: 1.3, para: .3, align: 'center', valign: 'top', fit: true, ...o });
  const panel = (s, o) => ({ type: 'infocard', name: (o.title || 'Panel').slice(0, 28), style: 'panel', icon: '', talign: 'center', bw: 0, radius: 0, pad: 4 * s, gangle: 0, tfont: 'Montserrat', tweight: 900, tsize: 11 * s, tcolor: '#ffffff', tupper: true, ttrack: .01,
    font: 'Inter', weight: 700, bweight: 800, size: 6 * s, color: '#ffffff', hi: '#ffe066', bcolor: '#ffffff', bullet: 'none', lineH: 1.22, para: .3, align: 'center', valign: 'middle', fit: true, ...o });
  const tb = (s, text, x, y, w, h, o = {}) => ({ type: 'textblock', name: o.name || text.replace(/[*\-•|]/g, '').trim().split('\n')[0].slice(0, 28), text, x, y, w, h, ...HEAD, size: 5.4 * s, ...o });
  const tx = (text, x, y, w, h, o = {}) => ({ type: 'text', name: o.name || text.slice(0, 28), text, x, y, w, h, font: 'Montserrat', weight: 900, size: h * .8, color: '#111111', align: 'center', fit: true, lineH: 1, ...o });
  const arrow = (s, x, y, o = {}) => ({ type: 'arrow', name: 'Arrow', x, y, w: 9 * s, h: 6 * s, kind: 'line', color: '#1b4f8a', lw: 1.3 * s, head: .55, ...o });
  const box = (x, y, w, h, fill, o = {}) => ({ type: 'rect', name: o.name || 'Band', x, y, w, h, fill, radius: 0, ...o });
  const icon = (id, x, y, sz, color, o = {}) => ({ type: 'glyph', name: (ICONS[id] || {}).label || id, icon: id, x, y, w: sz, h: sz, color, ...o });

  /* ---------- info cards ---------- */
  const CARDS = [
    ['Info card · red header', 'ig_thermo', 'EXTREME HEAT', '#d50000', '#ffffff', '- Days reach *50 °C*. Nights fall to about 20 °C\n- Outdoor work happens at night\n- Drink a cup of water every 15–20 min'],
    ['Info card · black header', 'ig_drop', 'CHECK THE WET-BULB', '#111111', '#5ab3f0', '- Combines heat *and* humidity\n- 31 °C or higher: *stop all outdoor work*\n- Readings are posted at every airlock'],
    ['Info card · amber header', 'ig_storm', 'SANDSTORMS', '#b8641c', '#ffffff', '- Siren with *3 long blasts* = storm coming\n- Get to shelter right away\n- Caught outside? Get low, cover your face, radio in'],
    ['Info card · lungs (black)', 'ig_lungs', 'SAND & DUST', '#111111', '#f48fb1', '- Respirator & sealed goggles outside\n- Hot sand burns: boots & gloves always\n- Never go outside alone'],
    ['Info card · purple header', 'ig_scorpion', 'WILDLIFE', '#5b2c83', '#e0b991', '- Don\'t touch, eat or collect *any* native plant or animal\n- Shake out boots before putting them on'],
    ['Info card · blue header', 'ig_info', 'GOOD TO KNOW', '#1b4f8a', '#ffffff', '- Meals are served at *06:00* and *18:00*\n- Lights out at 22:00\n- Ask any warden for help'],
    ['Info card · green header', 'ig_plant', 'GREENHOUSES', '#2e7d32', '#ffffff', '- Wash hands before entering\n- Never take seeds outside\n- Report wilting plants *at once*'],
    ['Info card · orange header', 'ig_siren', 'ALARMS', '#e65100', '#ffffff', '- One long tone: *shelter in place*\n- Pulsing tone: go to your muster point\n- All clear: three short tones'],
  ];
  for (const [n, ic, title, head, icol, text] of CARDS) add(n, C => { const s = S(C); return [card(s, { title, icon: ic, head, border: head, iconColor: icol, text, x: C.w / 2, y: C.h / 2, w: 136 * s, h: 50 * s })]; });
  add('Info card · wide, two columns', C => { const s = S(C); return [card(s, { title: 'DANGEROUS WILDLIFE & PLANTS', icon: 'ig_scorpion', head: '#5b2c83', border: '#5b2c83', iconColor: '#e0b991', cols: 2, cgap: 10 * s,
    text: '- Don\'t touch, eat or collect *any* native plant or animal\n- Many can sting, bite, cut or poison, even small ones\n||\n- Shake out boots, gloves & gear before putting them on\n- Stung, bitten or cut? *Go to medical right away*', x: C.w / 2, y: C.h / 2, w: 277 * s, h: 51 * s })]; });
  add('Do and don\'t pair', C => { const s = S(C); return [
    card(s, { title: 'DO', icon: 'ig_checkc', head: '#2e7d32', border: '#2e7d32', bullet: 'tick', bcolor: '#2e7d32', hi: '#2e7d32', text: '- Carry water at all times\n- Check in at every airlock\n- Wear your badge where it shows', x: C.w / 2 - 70 * s, y: C.h / 2, w: 134 * s, h: 48 * s }),
    card(s, { title: 'DON\'T', icon: 'ig_xmark', head: '#c62828', border: '#c62828', bullet: 'dash', bcolor: '#c62828', text: '- Go outside alone\n- Touch native plants or animals\n- Prop open a pressure door', x: C.w / 2 + 70 * s, y: C.h / 2, w: 134 * s, h: 48 * s })]; });

  /* ---------- steps ---------- */
  add('Numbered step card', C => { const s = S(C); return [step(s, { num: '1', title: 'THAW OUT', text: 'Rest in recovery. Drink water. Move slowly.', x: C.w / 2, y: C.h / 2, w: 58 * s, h: 71 * s })]; });
  add('Numbered step · final (green)', C => { const s = S(C); return [step(s, { num: '4', title: 'START WORK', text: 'Begin your journey as a colony worker!', border: '#2e7d32', badge: '#2e7d32', fill: '#eef8ee', x: C.w / 2, y: C.h / 2, w: 58 * s, h: 71 * s })]; });
  const stepRow = (C, items) => {
    const s = S(C), n = items.length, cw = 58 * s, gap = 15 * s, tot = n * cw + (n - 1) * gap, x0 = C.w / 2 - tot / 2 + cw / 2, y = C.h / 2, out = [];
    items.forEach(([title, text], i) => { const last = i === n - 1; out.push(step(s, { num: String(i + 1), title, text, x: x0 + i * (cw + gap), y, w: cw, h: 71 * s, ...(last ? { border: '#2e7d32', badge: '#2e7d32', fill: '#eef8ee' } : {}) })); if (!last) out.push(arrow(s, x0 + i * (cw + gap) + cw / 2 + gap / 2, y)); });
    return out;
  };
  add('Step row · four steps with arrows', C => stepRow(C, [['THAW OUT', 'Rest in recovery. Drink water. Move slowly.'], ['MEDICAL', 'Get your health check & heat clearance.'], ['ADMIN', 'Get your job assignment, ID & quarters.'], ['START WORK', 'Begin your journey as a colony worker!']]));
  add('Step row · three steps with arrows', C => stepRow(C, [['ARRIVE', 'Collect your kit at the main hangar.'], ['LEARN', 'Two days of safety training.'], ['SETTLE IN', 'Move into your quarters and meet your crew.']]));

  /* ---------- panels ---------- */
  add('Before → after panels', C => { const s = S(C), y = C.h / 2, w = 133 * s, h = 42.5 * s; return [
    panel(s, { title: 'TODAY', text: 'A scorching desert. 50 °C days, sandstorms, no open water.', fill: '#c64516', fill2: '#eaa645', x: C.w / 2 - 11.25 * s - w / 2, y, w, h }),
    box(C.w / 2, y, 22.5 * s, h, '#111111', { name: 'Arrow strip' }), arrow(s, C.w / 2, y, { w: 13 * s, h: 9 * s, lw: 2.2 * s, color: '#f7c600', head: .6 }),
    panel(s, { title: 'TOMORROW', text: 'A green, living world like Earth, built by your hands.', fill: '#1d7a3c', fill2: '#3aa2cc', gangle: 340, x: C.w / 2 + 11.25 * s + w / 2, y, w, h })]; });
  for (const [n, a, b, t] of [['Gradient panel · sunset', '#c64516', '#eaa645', 'TODAY'], ['Gradient panel · living world', '#1d7a3c', '#3aa2cc', 'TOMORROW'], ['Gradient panel · night shift', '#1a1f4e', '#5b3c9e', 'NIGHT SHIFT'], ['Gradient panel · ocean', '#0b4f6c', '#20a4c4', 'THE SEA'], ['Gradient panel · warning', '#8e0000', '#e53935', 'ALERT']])
    add(n, C => { const s = S(C); return [panel(s, { title: t, text: 'A short line or two of text goes here.', fill: a, fill2: b, x: C.w / 2, y: C.h / 2, w: 133 * s, h: 42.5 * s })]; });
  add('Big number callout', C => { const s = S(C); return [{ ...panel(s, { title: '50 °C', text: 'Daytime high on the surface', fill: '#fff4e0', fill2: '#ffe0b2', tcolor: '#c64516', color: '#5d4037', tsize: 16 * s, size: 5.6 * s, bw: 1 * s, border: '#c64516', radius: 3 * s, x: C.w / 2, y: C.h / 2, w: 90 * s, h: 50 * s }), name: 'Big number' }]; });

  /* ---------- text ---------- */
  add('Bullet list', C => { const s = S(C); return [tb(s, '- First point, with a *highlighted* word\n- Second point\n- **Bold** third point that wraps onto a second line', C.w / 2, C.h / 2, 130 * s, 40 * s)]; });
  add('Two-column bullet list', C => { const s = S(C); return [tb(s, '- Respirator & goggles outside\n- Boots & gloves always\n- Never go out alone\n- Check the wet-bulb reading\n- Report injuries *at once*\n- Drink before you are thirsty', C.w / 2, C.h / 2, 270 * s, 32 * s, { cols: 2, cgap: 12 * s, name: 'Two-column list' })]; });
  add('Checklist with ticks', C => { const s = S(C); return [tb(s, '- Badge and ID\n- Respirator, tested\n- Two litres of water\n- Radio, charged', C.w / 2, C.h / 2, 110 * s, 40 * s, { bullet: 'tick', bcolor: '#2e7d32', name: 'Checklist' })]; });
  add('Numbered list', C => { const s = S(C); return [tb(s, '1. Stop what you are doing\n2. Put on your respirator\n3. Walk to the nearest shelter\n4. Wait for the all-clear', C.w / 2, C.h / 2, 120 * s, 44 * s, { bcolor: '#1b4f8a', name: 'Numbered list' })]; });
  add('Headline · two colours', C => { const s = S(C); return [tb(s, 'WELCOME TO\nPROJECT\n*DUNEWRIGHT*', C.w / 2, C.h / 2, 268 * s, 72 * s, { font: 'Montserrat', weight: 900, bweight: 900, size: 25 * s, lineH: .92, para: 0, align: 'center', valign: 'middle', color: '#111111', hi: '#1b5e9e', bullet: 'none', name: 'Headline' })]; });
  add('Kicker line with stars', C => { const s = S(C); return [tx('★ WELCOME, COLONIST! ★', C.w / 2, C.h / 2, 170 * s, 11 * s, { size: 8.6 * s, spacing: .16, color: '#b8860b', name: 'Kicker' })]; });
  add('Section heading · warning icons', C => { const s = S(C), y = C.h / 2; return [tx('PLANET CAUTIONS', C.w / 2, y, 108 * s, 12 * s, { size: 10.2 * s }), icon('ig_warn', C.w / 2 - 61 * s, y, 10 * s, '#111111'), icon('ig_warn', C.w / 2 + 61 * s, y, 10 * s, '#111111')]; });
  add('Section heading · plain', C => { const s = S(C); return [tx('YOUR FIRST STEPS', C.w / 2, C.h / 2, 160 * s, 12 * s, { size: 10.2 * s })]; });
  add('Section heading · with rules', C => { const s = S(C), y = C.h / 2; return [tx('GOOD TO KNOW', C.w / 2, y, 100 * s, 12 * s, { size: 10 * s }), { type: 'line', name: 'Rule', x: C.w / 2 - 92 * s, y, w: 70 * s, h: 2 * s, color: '#111111', lw: 1.2 * s }, { type: 'line', name: 'Rule', x: C.w / 2 + 92 * s, y, w: 70 * s, h: 2 * s, color: '#111111', lw: 1.2 * s }]; });

  /* ---------- bands ---------- */
  add('Welcome header band', C => { const s = S(C), h = 102 * s, y = h / 2 + C.h * .02; return [
    box(C.w / 2, y, C.w, h, '#16508c', { fill2: '#1c66aa', grad: true, angle: 90, name: 'Header band' }),
    tx('★ WELCOME, COLONIST! ★', C.w / 2, y - h * .38, 170 * s, 11 * s, { size: 8.6 * s, spacing: .16, color: '#f7c600', name: 'Kicker' }),
    tb(s, 'WELCOME TO\nPROJECT\n*DUNEWRIGHT*', C.w / 2, y + h * .02, 268 * s, 70 * s, { font: 'Montserrat', weight: 900, bweight: 900, size: 25 * s, lineH: .92, para: 0, align: 'center', valign: 'middle', color: '#ffffff', hi: '#f7c600', bullet: 'none', name: 'Headline' }),
    tx('You\'ve arrived at the start of something great. Thank you for being part of it.', C.w / 2, y + h * .41, 272 * s, 9 * s, { font: 'Inter', weight: 700, size: 6.6 * s, color: '#ffffff', name: 'Subtitle' })]; });
  add('Footer band with slogan', C => { const s = S(C), h = 25 * s, y = C.h - h / 2 - C.h * .015; return [box(C.w / 2, y, C.w, h, '#111111', { name: 'Footer band' }),
    tx('BUILD THE FUTURE • STAY SAFE DOING IT', C.w / 2, y - h * .13, 230 * s, 10 * s, { size: 9 * s, color: '#f7c600', name: 'Slogan' }),
    tx('Project Dunewright • Colony Administration', C.w / 2, y + h * .26, 200 * s, 6 * s, { font: 'Inter', weight: 500, size: 4.8 * s, color: '#ffffff', name: 'Footer credit' })]; });
  add('Hazard stripe bands · top and bottom', C => { const s = S(C), h = 6.8 * s; return [
    { type: 'stripes', name: 'Hazard band (top)', x: C.w / 2, y: h / 2 + 5.5 * s, w: C.w - 11 * s, h, band: h * .8, color: '#111111', color2: '#f7c600' },
    { type: 'stripes', name: 'Hazard band (bottom)', x: C.w / 2, y: C.h - h / 2 - 5.5 * s, w: C.w - 11 * s, h, band: h * .8, color: '#111111', color2: '#f7c600' }]; });
  add('Icon facts row', C => { const s = S(C), y = C.h / 2, items = [['ig_sunhot', '50 °C', 'days'], ['ig_drop', '4 L', 'water a day'], ['ig_wind', '120 km/h', 'storm winds'], ['crescent', '20 °C', 'nights']], out = [];
    items.forEach(([id, big, small], i) => { const x = C.w / 2 + (i - 1.5) * 66 * s, col = ['#c64516', '#1b6fb3', '#b8641c', '#3949ab'][i];
      out.push({ type: 'ellipse', name: 'Icon disc', x, y: y - 10 * s, w: 30 * s, h: 30 * s, fill: col }, icon(id, x, y - 10 * s, 17 * s, '#ffffff'), tx(big, x, y + 12 * s, 60 * s, 9 * s, { size: 8 * s, color: col }), tx(small, x, y + 20 * s, 60 * s, 6 * s, { font: 'Inter', weight: 600, size: 4.6 * s, color: '#333333' })); });
    return out; });
  for (const [n, kind, o] of [['Arrow · line', 'line', {}], ['Arrow · solid head', 'solid', {}], ['Arrow · block', 'block', { w: 16, h: 9 }], ['Arrow · double-headed', 'double', { w: 18 }], ['Arrow · curved', 'curve', { w: 16, h: 9 }], ['Chevron', 'chevron', { w: 6, h: 9 }]])
    add(n, C => { const s = S(C); return [arrow(s, C.w / 2, C.h / 2, { kind, ...o, w: (o.w || 12) * s, h: (o.h || 7) * s, lw: 1.6 * s })]; });

  /* ================= templates ================= */
  const TPI = (id, name, fmt, card, scene, front) => TEMPLATES.push({ id, name, mode: 'poster', build: () => { const f = FORMATS[fmt]; return { card: { mode: 'poster', fmt, w: f.w, h: f.h, r: f.r, shape: 'rect', thick: f.thick, slot: 'none', lam: 'none', ink: 'satin', res: 4096, ...card }, scene: { env: 'softbox', backdrop: 'concrete', pose: 'stand', ...scene }, front: front(f.w, f.h).map(o => { const { type, ...rest } = o; return E(type, rest); }), back: [] }; } });

  /* Welcome to Project Dunewright: a colony orientation sheet (laid out on a 1200 × 1920 grid, a quarter of a millimetre per unit) */
  TPI('ps_dunewright', 'Welcome to Project Dunewright · colony orientation', 'ps_info', { sub: 'poster_gloss', wear: 0, age: 0, tintOn: true, tint: '#ffffff' }, { env: 'softbox', backdrop: 'concrete' }, (W, H) => {
    const s = 1, u = v => v * .25, Y = '#f7c600', BLUE = '#1b4f8a';
    const hdr = (title, ic, head, icol, text, x0, y0, x1, y1, o = {}) => card(s, { title, icon: ic, head, border: head, iconColor: icol, text, x: u((x0 + x1) / 2), y: u((y0 + y1) / 2), w: u(x1 - x0), h: u(y1 - y0), ...o });
    const stp = (n, title, text, cx, o = {}) => step(s, { num: n, title, text, x: u(cx), y: u(857.5), w: u(232), h: u(285), ...o });
    return [
      box(u(11), H / 2, u(22), H, Y, { name: 'Frame (left)', locked: true }), box(W - u(11), H / 2, u(22), H, Y, { name: 'Frame (right)', locked: true }),
      box(W / 2, u(11), W, u(22), Y, { name: 'Frame (top)', locked: true }), box(W / 2, H - u(11), W, u(22), Y, { name: 'Frame (bottom)', locked: true }),
      box(u(600), u(252.5), u(1156), u(409), '#16508c', { fill2: '#1c66aa', grad: true, angle: 90, name: 'Header band' }),
      box(u(600), u(1820), u(1156), u(100), '#111111', { name: 'Footer band' }),
      { type: 'stripes', name: 'Hazard band (top)', x: u(600), y: u(35), w: u(1156), h: u(26), band: 5.2, color: '#111111', color2: Y },
      { type: 'stripes', name: 'Hazard band (bottom)', x: u(600), y: u(1884), w: u(1156), h: u(28), band: 5.2, color: '#111111', color2: Y },
      tx('★ WELCOME, COLONIST! ★', u(600), u(97), u(680), u(44), { size: 8.6, spacing: .16, color: Y, name: 'Kicker' }),
      tb(s, 'WELCOME TO\nPROJECT\n*DUNEWRIGHT*', u(600), u(262), u(1072), u(290), { font: 'Montserrat', weight: 900, bweight: 900, size: 25, lineH: .9, para: 0, align: 'center', valign: 'middle', color: '#ffffff', hi: Y, bullet: 'none', name: 'Headline' }),
      tx('You\'ve arrived at the start of something great. Thank you for being part of it.', u(600), u(420), u(1090), u(36), { font: 'Inter', weight: 700, size: 6.6, color: '#ffffff', name: 'Subtitle' }),
      panel(s, { title: 'TODAY', text: 'A scorching desert. 180°F days, sandstorms, no open water.', fill: '#c64516', fill2: '#eaa645', x: u(288.5), y: u(542), w: u(533), h: u(170) }),
      box(u(600), u(542), u(90), u(170), '#111111', { name: 'Arrow strip' }),
      arrow(s, u(600), u(542), { w: 13, h: 9, lw: 2.2, color: Y, head: .6 }),
      panel(s, { title: 'TOMORROW', text: 'A green, living world like Earth — built by your hands.', fill: '#1d7a3c', fill2: '#3aa2cc', gangle: 340, x: u(911.5), y: u(542), w: u(533), h: u(170) }),
      tx('YOUR FIRST STEPS', u(600), u(675), u(640), u(48), { size: 10.2, name: 'Steps heading' }),
      stp('1', 'THAW OUT', 'Rest in recovery. Drink water. Move slowly.', 162),
      arrow(s, u(308), u(857)),
      stp('2', 'MEDICAL', 'Get your health check & heat clearance.', 454),
      arrow(s, u(600), u(857)),
      stp('3', 'ADMIN', 'Get your job assignment, ID & quarters.', 746),
      arrow(s, u(892), u(857)),
      stp('4', 'START WORK', 'Begin your journey as a Dunewright worker!', 1038, { border: '#2e7d32', badge: '#2e7d32', fill: '#eef8ee' }),
      tx('PLANET CAUTIONS', u(600), u(1068), u(432), u(48), { size: 10.2, name: 'Cautions heading' }),
      icon('ig_warn', u(356), u(1068), 10, '#111111'), icon('ig_warn', u(844), u(1068), 10, '#111111'),
      hdr('EXTREME HEAT', 'ig_thermo', '#d50000', '#ffffff', '- Days reach *180°F*. Nights drop to about 70°F\n- Outdoor work happens at night\n- Drink 1 cup of water every 15–20 min', 46, 1103, 590, 1288),
      hdr('CHECK THE WET-BULB', 'ig_drop', '#111111', '#5ab3f0', '- Combines heat *and* humidity\n- 88°F or higher: *stop all outdoor work*\n- Readings are posted at every airlock', 610, 1103, 1155, 1288),
      hdr('SANDSTORMS', 'ig_storm', '#b8641c', '#ffffff', '- Siren with *3 long blasts* = storm coming\n- Get to shelter right away\n- Caught outside? Get low, cover your face, radio in', 46, 1308, 590, 1523),
      hdr('SAND & DUST', 'ig_lungs', '#111111', '#f48fb1', '- Respirator & sealed goggles outside\n- Hot sand burns — boots & gloves always\n- Never go outside alone', 610, 1308, 1155, 1523),
      hdr('DANGEROUS WILDLIFE & PLANTS', 'ig_scorpion', '#5b2c83', '#e0b991', '- Don\'t touch, eat or collect *any* native plant or animal\n- Many can sting, bite, cut or poison — even small ones\n||\n- Shake out boots, gloves & gear before putting them on\n- Stung, bitten or cut? *Go to medical right away*', 46, 1543, 1155, 1748, { cols: 2, cgap: 10 }),
      tx('BUILD THE FUTURE • STAY SAFE DOING IT', u(600), u(1807), u(920), u(40), { size: 9, color: Y, name: 'Slogan' }),
      tx('Project Dunewright • Colony Administration', u(600), u(1846), u(800), u(24), { font: 'Inter', weight: 500, size: 4.8, color: '#ffffff', name: 'Footer credit' }),
    ];
  });

  /* Outpost Kestrel: a polar research station's arrival sheet, to show the same parts in another palette */
  TPI('ps_kestrel', 'Outpost Kestrel · polar station arrival guide', 'ps_info', { sub: 'poster_gloss', wear: 0, age: 0, tintOn: true, tint: '#ffffff' }, { env: 'white', backdrop: 'concrete' }, (W, H) => {
    const s = 1, NAVY = '#0d2b45', ICE = '#e8f4fb', ORANGE = '#ff6d00', TEAL = '#00838f';
    return [
      box(W / 2, H / 2, W, H, ICE, { name: 'Background', locked: true }),
      box(W / 2, 62, W, 124, NAVY, { fill2: '#16456e', grad: true, angle: 90, name: 'Header band' }),
      icon('snowflake', W / 2, 22, 16, '#9fd6f2'),
      tx('OUTPOST KESTREL · 78° SOUTH', W / 2, 40, 200, 10, { font: 'Inter', weight: 800, size: 6.4, spacing: .2, color: '#9fd6f2', name: 'Kicker' }),
      tb(s, 'COLD IS THE\n*FIRST HAZARD*', W / 2, 74, 270, 52, { font: 'Montserrat', weight: 900, bweight: 900, size: 22, lineH: .95, para: 0, align: 'center', valign: 'middle', color: '#ffffff', hi: ORANGE, bullet: 'none', name: 'Headline' }),
      tx('Read this before you leave the hangar. Your crew is counting on you.', W / 2, 111, 260, 8, { font: 'Inter', weight: 600, size: 5.6, color: '#d6ecf8', name: 'Subtitle' }),
      ...[['ig_thermo', '−52 °C', 'winter low'], ['ig_wind', '160 km/h', 'katabatic winds'], ['ig_clock', '24 h', 'darkness in June'], ['ig_people', '41', 'people on station']].flatMap(([id, big, small], i) => { const x = 39 + i * 74, y = 150, col = [TEAL, '#3949ab', '#5e35b1', ORANGE][i];
        return [{ type: 'ellipse', name: 'Icon disc', x, y, w: 26, h: 26, fill: col }, icon(id, x, y, 15, '#ffffff'), tx(big, x, y + 21, 66, 9, { size: 8, color: NAVY }), tx(small, x, y + 29, 66, 6, { font: 'Inter', weight: 600, size: 4.4, color: '#455a64' })]; }),
      tx('ON ARRIVAL', W / 2, 202, 120, 11, { size: 9.4, color: NAVY, name: 'Steps heading' }),
      ...[['KIT UP', 'Collect your thermal layers and goggles.'], ['BRIEFING', 'Two hours of cold-safety training.'], ['BUDDY UP', 'Meet the partner you go outside with.']].flatMap(([title, text], i) => { const x = 50 + i * 100, last = i === 2;
        return [step(s, { num: String(i + 1), title, text, x, y: 240, w: 80, h: 58, border: last ? TEAL : NAVY, badge: last ? TEAL : NAVY, fill: last ? '#e0f7fa' : '#ffffff', tsize: 6.4, size: 5, badgeR: 7 }), ...(last ? [] : [arrow(s, x + 50, 240, { color: NAVY })])]; }),
      tx('STATION RULES', W / 2, 288, 130, 11, { size: 9.4, color: NAVY, name: 'Rules heading' }),
      icon('ig_warn', W / 2 - 60, 288, 9, ORANGE), icon('ig_warn', W / 2 + 60, 288, 9, ORANGE),
      card(s, { title: 'FROSTBITE', icon: 'ig_thermo', head: TEAL, border: TEAL, hi: '#d84315', text: '- Cover *every* inch of skin outside\n- Numb or white skin: *come inside now*\n- Warm hands slowly, never with fire', x: 79, y: 324, w: 138, h: 50 }),
      card(s, { title: 'WHITEOUT', icon: 'ig_wind', head: NAVY, border: NAVY, hi: '#d84315', text: '- Stop and hold the guide rope\n- Radio your position *every 5 min*\n- Never walk without a line', x: 221, y: 324, w: 138, h: 50 }),
      card(s, { title: 'DO', icon: 'ig_checkc', head: '#2e7d32', border: '#2e7d32', bullet: 'tick', bcolor: '#2e7d32', hi: '#2e7d32', text: '- Sign out at the door board\n- Carry a charged radio\n- Drink warm water often', x: 79, y: 384, w: 138, h: 50 }),
      card(s, { title: 'DON\'T', icon: 'ig_xmark', head: '#c62828', border: '#c62828', bullet: 'dash', bcolor: '#c62828', text: '- Go outside alone, ever\n- Touch metal with bare skin\n- Prop open an outer door', x: 221, y: 384, w: 138, h: 50 }),
      box(W / 2, 457, W, 46, NAVY, { name: 'Footer band' }),
      tx('NOBODY GOES OUT ALONE', W / 2, 452, 230, 11, { size: 9.6, color: '#ffffff', name: 'Slogan' }),
      tx('Outpost Kestrel · Polar Survey Directorate · a fictional station', W / 2, 466, 220, 6, { font: 'Inter', weight: 500, size: 4.4, color: '#9fd6f2', name: 'Footer credit' }),
    ];
  });
})();
