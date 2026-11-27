/* ================= infographic posters: rich text blocks, info cards, arrows and pictograms ================= */
/* Rich text markup, shared by text blocks and info cards:
     - point        a bullet point ("• point" and "* point" work too); wrapped lines hang under the text
     1. point       a numbered point
     *words*        highlight colour
     **words**      bold
     ||             on a line of its own: carry on in the next column
   A blank line leaves a gap. Text is measured at a fixed reference size, so line breaks are the same at every resolution. */
const RT = { cache: new Map(), m: document.createElement('canvas').getContext('2d'), w: new Map() };
const BULLETS = [['dot', 'Dot'], ['square', 'Square'], ['dash', 'Dash'], ['tick', 'Tick'], ['arrow', 'Arrow'], ['star', 'Star'], ['none', 'None']];
const VALIGNS = [['top', 'Top'], ['middle', 'Middle'], ['bottom', 'Bottom']];

function rtParse(src, upper) {
  const out = [];
  for (let line of String(src ?? '').replace(/\r/g, '').split('\n')) {
    if (line.trim() === '||') { out.push({ brk: true }); continue; }
    let bullet = null, m;
    if ((m = line.match(/^\s*(?:[-•▪]|\*(?=\s))\s+/))) { bullet = 'b'; line = line.slice(m[0].length); }
    else if ((m = line.match(/^\s*(\d{1,3}[.)])\s+/))) { bullet = m[1]; line = line.slice(m[0].length); }
    const runs = []; let b = false, h = false, cur = '';
    const push = () => { if (cur) runs.push({ t: upper ? cur.toUpperCase() : cur, b, h }); cur = ''; };
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '\\' && line[i + 1] === '*') { cur += '*'; i++; continue; }
      if (ch === '*' && line[i + 1] === '*') { push(); b = !b; i++; continue; }
      if (ch === '*') { push(); h = !h; continue; }
      cur += ch;
    }
    push(); out.push({ bullet, runs });
  }
  return out;
}
function rtWidth(o, t, bold) {   // width of t at a 100 px reference size, cached per font and weight
  const wt = bold ? o.bweight : o.weight, key = `${o.font}|${wt}|${o.italic ? 1 : 0}|${o.track || 0}|${t}`; let v = RT.w.get(key);
  if (v == null) {
    const m = RT.m; setFont(m, o.font, wt, 100, o.italic); setSp(m, (o.track || 0) * 100); v = m.measureText(t).width;
    if (RT.w.size > 20000) RT.w.clear(); RT.w.set(key, v);
  }
  return v;
}
/* o: { text, font, weight, bweight, size, w, h, lineH, para, track, upper, italic, cols, cgap, indent, fit } in millimetres */
function rtLayout(o) {
  const key = JSON.stringify([o.text, o.font, o.weight, o.bweight, o.size, o.w, o.h, o.lineH, o.para, o.track, o.upper, o.italic, o.cols, o.cgap, o.indent, o.fit, GEN.v]);
  let L = RT.cache.get(key); if (L) { RT.cache.delete(key); RT.cache.set(key, L); return L; }
  const P = rtParse(o.text, o.upper);
  const lay = size => {
    const n = Math.max(1, Math.min(3, Math.round(o.cols || 1))), gap = n > 1 ? (o.cgap ?? size * 2) : 0, cw = Math.max(1, (o.w - gap * (n - 1)) / n);
    const lh = size * (o.lineH || 1.25), ind = (o.indent ?? 1.25) * size, pg = (o.para ?? .3) * size, mw = (t, b) => rtWidth(o, t, b) / 100 * size;
    let over = false; const paras = [];
    for (const p of P) {
      if (p.brk) { paras.push(p); continue; }
      const x0 = p.bullet ? (p.bullet === 'b' ? ind : Math.max(ind, mw(p.bullet + ' ', true))) : 0, maxW = cw - x0, lines = [];
      let segs = [], x = 0, sp = 0;
      for (const r of p.runs) for (const t of r.t.split(/(\s+)/)) {
        if (!t) continue;
        if (/^\s+$/.test(t)) { if (segs.length) sp = mw(' ', r.b); continue; }
        const ww = mw(t, r.b);
        if (segs.length && x + sp + ww > maxW + 1e-6) { lines.push({ segs, w: x }); segs = []; x = 0; }
        else x += segs.length ? sp : 0;
        if (ww > maxW + 1e-6) over = true;
        segs.push({ t, x, b: r.b, h: r.h }); x += ww; sp = 0;
      }
      lines.push({ segs, w: x });
      paras.push({ lines, bullet: p.bullet, x0, height: lines.length * lh });
    }
    let cols;
    if (paras.some(p => p.brk)) { cols = [[]]; for (const p of paras) { if (p.brk) { if (cols.length < n) cols.push([]); continue; } cols[cols.length - 1].push(p); } }
    else if (n === 1) cols = [paras];
    else {   // balance the points across the columns
      const tot = paras.reduce((s, p) => s + p.height + pg, 0) - pg, target = tot / n; cols = [[]]; let acc = 0;
      for (const p of paras) { if (acc > 0 && acc + p.height / 2 > target && cols.length < n) { cols.push([]); acc = 0; } cols[cols.length - 1].push(p); acc += p.height + pg; }
    }
    const colH = cols.map(c => c.reduce((s, p, i) => s + p.height + (i ? pg : 0), 0));
    return { cols, colH, H: Math.max(0, ...colH), cw, gap, lh, size, pg, ind, over };
  };
  L = lay(o.size);
  if (o.fit && (L.H > o.h + 1e-6 || L.over)) {   // shrink until it fits the box
    let lo = .15, hi = 1;
    for (let i = 0; i < 12; i++) { const mid = (lo + hi) / 2, t = lay(o.size * mid); if (t.H > o.h + 1e-6 || t.over) hi = mid; else lo = mid; }
    L = lay(o.size * lo);
  }
  RT.cache.set(key, L); while (RT.cache.size > 300) RT.cache.delete(RT.cache.keys().next().value);
  return L;
}
function rtBullet(c, kind, x, y, s, col) {   // vector bullets, so they look the same in every font
  c.fillStyle = col; c.strokeStyle = col; c.beginPath();
  switch (kind) {
    case 'square': c.rect(x - s * .15, y - s * .15, s * .3, s * .3); c.fill(); break;
    case 'dash': c.rect(x - s * .24, y - s * .055, s * .48, s * .11); c.fill(); break;
    case 'tick': c.lineWidth = s * .13; c.lineCap = 'round'; c.lineJoin = 'round'; c.moveTo(x - s * .26, y); c.lineTo(x - s * .07, y + s * .2); c.lineTo(x + s * .28, y - s * .24); c.stroke(); break;
    case 'arrow': c.moveTo(x - s * .16, y - s * .24); c.lineTo(x + s * .24, y); c.lineTo(x - s * .16, y + s * .24); c.closePath(); c.fill(); break;
    case 'star': for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * .12 : s * .29; c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } c.closePath(); c.fill(); break;
    default: c.arc(x, y, s * .16, 0, Math.PI * 2); c.fill();
  }
}
/* draw a layout with its box's top-left corner at (left, top), in the element's millimetre space */
function rtDraw(c, L, o, ov, k, left, top, col) {
  const y0 = top + (o.valign === 'middle' ? (o.h - L.H) / 2 : o.valign === 'bottom' ? o.h - L.H : 0), px = L.size * k;
  c.save(); c.scale(1 / k, 1 / k); c.textBaseline = 'middle'; c.textAlign = 'left'; let cur = null;
  const font = b => { if (cur === b) return; cur = b; setFont(c, o.font, b ? o.bweight : o.weight, px, o.italic); setSp(c, (o.track || 0) * px); };
  L.cols.forEach((colm, ci) => {
    const cx = left + ci * (L.cw + L.gap); let y = y0;
    for (const p of colm) {
      p.lines.forEach((ln, li) => {
        const ly = y + li * L.lh + L.lh / 2; let ox = cx + p.x0;
        if (!p.bullet && o.align === 'center') ox = cx + (L.cw - ln.w) / 2; else if (!p.bullet && o.align === 'right') ox = cx + L.cw - ln.w;
        if (li === 0 && p.bullet) {
          if (p.bullet === 'b') { if (o.bullet !== 'none') { c.save(); c.scale(k, k); rtBullet(c, o.bullet, cx + L.size * .3, ly + L.size * .02, L.size, fillOf(ov, col.bullet)); c.restore(); } }
          else { font(true); c.fillStyle = fillOf(ov, col.bullet); c.fillText(p.bullet, cx * k, ly * k); }
        }
        for (const s of ln.segs) { font(s.b); c.fillStyle = fillOf(ov, s.h ? col.hi : col.text); c.fillText(s.t, (ox + s.x) * k, ly * k); }
      });
      y += p.height + L.pg;
    }
  });
  c.restore();
}
const RICH_DEF = { font: 'Inter', weight: 600, bweight: 800, size: 2.4, color: '#1a1a1a', hi: '#d50000', bcolor: '#1a1a1a', bullet: 'dot', align: 'left', valign: 'top', lineH: 1.3, para: .3, track: 0, upper: false, italic: false, cols: 1, cgap: 4, indent: 1.25, fit: true };
const RICH_P = [['font', 'Font', 'font'], ['weight', 'Weight', 'select', WEIGHTS], ['bweight', 'Weight of **bold**', 'select', WEIGHTS], ['size', 'Size (mm)', 'range', { min: .3, max: 20, step: .05 }], ['color', 'Colour', 'color'], ['hi', 'Colour of *highlights*', 'color'],
  ['bullet', 'Bullets', 'select', BULLETS], ['bcolor', 'Bullet colour', 'color', null, e => e.bullet !== 'none'], ['align', 'Align', 'select', ALIGNS], ['valign', 'Vertical', 'select', VALIGNS], ['lineH', 'Line height', 'range', { min: .7, max: 2.5, step: .01 }],
  ['para', 'Space between points (em)', 'range', { min: 0, max: 2, step: .05 }], ['track', 'Tracking (em)', 'range', { min: -.1, max: 1, step: .01 }], ['upper', 'Uppercase', 'check'], ['italic', 'Italic', 'check'],
  ['cols', 'Columns', 'range', { min: 1, max: 3, step: 1 }], ['cgap', 'Column gap (mm)', 'range', { min: 0, max: 30, step: .1 }, e => e.cols > 1], ['fit', 'Shrink to fit the box', 'check']];
const richOf = (el, w, h, o = {}) => ({ text: el.text, font: el.font, weight: el.weight, bweight: el.bweight, size: el.size, w, h, lineH: el.lineH, para: el.para, track: el.track, upper: el.upper, italic: el.italic, cols: el.cols, cgap: el.cgap, indent: el.indent, fit: el.fit, align: el.align, valign: el.valign, bullet: el.bullet, ...o });

def('textblock', 'Text block', { w: 40, h: 18, text: '- Wraps to fit its box\n- *Highlight* words with asterisks\n- **Bold** with double asterisks', ...RICH_DEF },
  [['text', 'Text  (- bullet · *highlight* · **bold** · || next column)', 'area'], ...RICH_P],
  function (c, el, ov, k) {
    const o = richOf(el, el.w, el.h), L = rtLayout(o);
    rtDraw(c, L, o, ov, k, -el.w / 2, -el.h / 2, { text: el.color, hi: el.hi, bullet: el.bcolor });
  }, 'M4 6h2M9 6h11M4 12h2M9 12h11M4 18h2M9 18h7');

/* ---------- info card: a header bar, a numbered step, a gradient panel or a plain box, each with rich body text ---------- */
const CARD_STYLES = [['header', 'Header bar'], ['step', 'Numbered step'], ['panel', 'Gradient panel'], ['plain', 'Plain box']];
def('infocard', 'Info card', {
  w: 40, h: 26, style: 'header', title: 'EXTREME HEAT', text: '- Days reach *50 °C*\n- Work outside at night\n- Drink water every 20 min', icon: 'ig_thermo', num: '1',
  fill: '#ffffff', fill2: '#e8a33d', gangle: 0, head: '#d50000', border: '#d50000', bw: .45, radius: 1, pad: 1.8, headH: 0, badge: '#1b4f8a', badgeText: '#ffffff', badgeR: 0,
  tfont: 'Montserrat', tweight: 900, tsize: 2.6, tcolor: '#ffffff', iconColor: '#ffffff', tupper: true, ttrack: .02, talign: 'left',
  ...RICH_DEF, size: 2
}, [['style', 'Style', 'select', CARD_STYLES], ['title', 'Title', 'text'], ['text', 'Body  (- bullet · *highlight* · **bold** · || next column)', 'area'], ['icon', 'Icon', 'select', [['', 'None'], ...ICON_OPTS]], ['num', 'Number', 'text', null, e => e.style === 'step'],
  ['§', 'Box'], ['fill', 'Fill', 'color'], ['fill2', 'Gradient to', 'color', null, e => e.style === 'panel'], ['gangle', 'Gradient angle', 'range', { min: 0, max: 360, step: 1 }, e => e.style === 'panel'], ['head', 'Header colour', 'color', null, e => e.style === 'header'],
  ['border', 'Border colour', 'color'], ['bw', 'Border (mm)', 'range', { min: 0, max: 4, step: .05 }], ['radius', 'Corner (mm)', 'range', { min: 0, max: 20, step: .1 }], ['pad', 'Padding (mm)', 'range', { min: 0, max: 12, step: .1 }],
  ['headH', 'Header height (mm, 0 = auto)', 'range', { min: 0, max: 30, step: .1 }, e => e.style === 'header'], ['badge', 'Badge colour', 'color', null, e => e.style === 'step'], ['badgeText', 'Number colour', 'color', null, e => e.style === 'step'], ['badgeR', 'Badge size (mm, 0 = auto)', 'range', { min: 0, max: 20, step: .1 }, e => e.style === 'step'],
  ['§', 'Title'], ['tfont', 'Font', 'font'], ['tweight', 'Weight', 'select', WEIGHTS], ['tsize', 'Size (mm)', 'range', { min: .3, max: 20, step: .05 }], ['tcolor', 'Colour', 'color'], ['iconColor', 'Icon colour', 'color', null, e => !!e.icon], ['talign', 'Align', 'select', ALIGNS, e => e.style !== 'step'], ['ttrack', 'Tracking (em)', 'range', { min: -.1, max: 1, step: .01 }], ['tupper', 'Uppercase', 'check'],
  ['§', 'Body'], ...RICH_P],
  function (c, el, ov, k) {
    const w = el.w, h = el.h, r = Math.min(el.radius || 0, w / 2, h / 2), bw = Math.max(0, el.bw || 0), pad = Math.max(0, el.pad ?? 1.5) + bw, st = el.style || 'header', ts = Math.max(.1, el.tsize || 2);
    const outline = () => { c.beginPath(); rr(c, -w / 2, -h / 2, w, h, r); };
    /* box */
    let fill = fillOf(ov, el.fill);
    if (st === 'panel' && ov.color == null) { const a = (el.gangle || 0) * Math.PI / 180, dx = Math.cos(a) * w / 2, dy = Math.sin(a) * h / 2, g = c.createLinearGradient(-dx, -dy, dx, dy); g.addColorStop(0, el.fill); g.addColorStop(1, el.fill2); fill = g; }
    if (el.fill !== 'transparent') { outline(); c.fillStyle = fill; c.fill(); }
    const titleText = el.tupper ? String(el.title || '').toUpperCase() : String(el.title || '');
    const title = (x, y, maxW, align) => {
      if (!titleText) return; c.save(); c.scale(1 / k, 1 / k); c.textBaseline = 'alphabetic'; c.textAlign = align; c.fillStyle = fillOf(ov, el.tcolor);
      const f = fitText(c, titleText, el.tfont, el.tweight, ts * k, Math.max(1, maxW * k), false, el.ttrack || 0), sx = align === 'center' ? (SP_OK ? (el.ttrack || 0) * f.size / 2 : 0) : 0;
      textMid(c, titleText, x * k + sx, y * k); c.restore();
    };
    const col = { text: el.color, hi: el.hi, bullet: el.bcolor }, bx = -w / 2 + pad, bwid = w - pad * 2;
    if (st === 'header' || st === 'step') {
      let bodyTop;
      if (st === 'header') {
        const hh = el.headH > 0 ? el.headH : ts * 2.15;
        c.save(); outline(); c.clip(); c.fillStyle = fillOf(ov, el.head); c.fillRect(-w / 2, -h / 2, w, hh); c.restore();
        let tx = bx, tw = bwid; const is = Math.min(hh * .62, ts * 1.35);
        if (el.icon) { drawIconAt(c, el.icon, tx + is / 2, -h / 2 + hh / 2, is, fillOf(ov, el.iconColor), k); tx += is + ts * .55; tw -= is + ts * .55; }
        const al = el.talign || 'left'; title(al === 'center' ? tx + tw / 2 : al === 'right' ? tx + tw : tx, -h / 2 + hh / 2, tw, al);
        bodyTop = -h / 2 + hh + Math.max(bw, pad * .45);
      } else {
        const br = el.badgeR > 0 ? el.badgeR : Math.min(w, h) * .11, cy = -h / 2 + pad + br;
        c.beginPath(); c.arc(0, cy, br, 0, Math.PI * 2); c.fillStyle = fillOf(ov, el.badge); c.fill();
        if (el.num) { c.save(); c.scale(1 / k, 1 / k); c.textAlign = 'center'; c.fillStyle = fillOf(ov, el.badgeText); fitText(c, String(el.num), el.tfont, el.tweight, br * 1.15 * k, br * 1.5 * k, false, 0); textMid(c, String(el.num), 0, cy * k); c.restore(); }
        else if (el.icon) drawIconAt(c, el.icon, 0, cy, br * 1.2, fillOf(ov, el.badgeText), k);
        const ty = cy + br + ts * 1.05; title(0, ty, bwid, 'center');
        bodyTop = ty + (titleText ? ts * .95 : -ts * .5);
      }
      const bh = h / 2 - pad * .85 - bodyTop;
      if (el.text && bh > 0) { const o = richOf(el, bwid, bh, st === 'step' && el.align === 'left' ? { align: 'center' } : {}); rtDraw(c, rtLayout(o), o, ov, k, bx, bodyTop, col); }
    } else {   // gradient panel or plain box: icon, title and body stacked as one group
      const al = el.talign || (st === 'panel' ? 'center' : 'left'), iconH = el.icon ? ts * 1.6 : 0, titleH = titleText ? ts * 1.45 : 0;
      const o = richOf(el, bwid, Math.max(.1, h - pad * 2 - iconH - titleH), { valign: 'top' }), L = el.text ? rtLayout(o) : { H: 0 };
      const gh = iconH + titleH + L.H, top = el.valign === 'middle' ? -gh / 2 : el.valign === 'bottom' ? h / 2 - pad - gh : -h / 2 + pad;
      if (el.icon) { const is = ts * 1.35; drawIconAt(c, el.icon, al === 'center' ? 0 : al === 'right' ? w / 2 - pad - is / 2 : bx + is / 2, top + is / 2, is, fillOf(ov, el.iconColor), k); }
      if (titleText) title(al === 'center' ? 0 : al === 'right' ? w / 2 - pad : bx, top + iconH + ts * .55, bwid, al);
      if (el.text) rtDraw(c, L, o, ov, k, bx, top + iconH + titleH, col);
    }
    if (bw > 0) { c.beginPath(); rr(c, -w / 2 + bw / 2, -h / 2 + bw / 2, w - bw, h - bw, Math.max(0, r - bw / 2)); c.lineWidth = bw; c.strokeStyle = fillOf(ov, el.border); c.stroke(); }
  }, 'M4 5h16v14H4zM4 9h16M7 13h6M7 16h8');

/* ---------- arrow ---------- */
const ARROW_KINDS = [['line', 'Line, open head'], ['solid', 'Line, solid head'], ['block', 'Block'], ['chevron', 'Chevron'], ['double', 'Double-headed'], ['curve', 'Curved']];
def('arrow', 'Arrow', { w: 12, h: 6, kind: 'line', color: '#1b4f8a', lw: .9, head: .5, dash: 0 },
  [['kind', 'Style', 'select', ARROW_KINDS], ['color', 'Colour', 'color'], ['lw', 'Thickness (mm)', 'range', { min: .05, max: 6, step: .05 }, e => e.kind !== 'block'], ['head', 'Head size', 'range', { min: .1, max: 1, step: .01 }], ['dash', 'Dash (mm)', 'range', { min: 0, max: 6, step: .05 }, e => e.kind === 'line' || e.kind === 'solid' || e.kind === 'curve' || e.kind === 'double']],
  function (c, el, ov) {
    const w = el.w, h = el.h, lw = Math.max(.02, Math.min(el.lw || .5, h)), col = fillOf(ov, el.color), hl = Math.max(lw, Math.min(w * .7, h * (el.head ?? .5) * 1.6)), hy = h / 2 * Math.min(1, (el.head ?? .5) * 1.6), x1 = w / 2 - lw * .6;
    c.strokeStyle = col; c.fillStyle = col; c.lineWidth = lw; c.lineCap = 'round'; c.lineJoin = 'round';
    const dash = on => c.setLineDash(on && el.dash > 0 ? [el.dash, el.dash * .8] : []);
    const openHead = (x, d) => { c.beginPath(); c.moveTo(x - d * hl, -hy + lw / 2); c.lineTo(x, 0); c.lineTo(x - d * hl, hy - lw / 2); c.stroke(); };
    const solidHead = (x, d) => { c.beginPath(); c.moveTo(x + d * lw * .6, 0); c.lineTo(x - d * hl, -hy); c.lineTo(x - d * hl, hy); c.closePath(); c.fill(); };
    switch (el.kind) {
      case 'block': { const t = h * Math.max(.18, .5 - (el.head ?? .5) * .3), hx = w / 2 - Math.min(w * .6, h * (el.head ?? .5) * 1.4); c.beginPath(); [[-w / 2, -t / 2], [hx, -t / 2], [hx, -h / 2], [w / 2, 0], [hx, h / 2], [hx, t / 2], [-w / 2, t / 2]].forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fill(); break; }
      case 'chevron': { c.beginPath(); c.moveTo(-w / 2 + lw / 2, -h / 2 + lw / 2); c.lineTo(w / 2 - lw / 2, 0); c.lineTo(-w / 2 + lw / 2, h / 2 - lw / 2); c.stroke(); break; }
      case 'double': { dash(true); c.beginPath(); c.moveTo(-w / 2 + hl * .5, 0); c.lineTo(w / 2 - hl * .5, 0); c.stroke(); dash(false); solidHead(w / 2 - lw * .6, 1); solidHead(-w / 2 + lw * .6, -1); break; }
      case 'curve': { dash(true); const bend = h * .9; c.beginPath(); c.moveTo(-w / 2 + lw / 2, h / 2 - lw / 2); c.quadraticCurveTo(0, h / 2 - bend * 1.6, w / 2 - hl * .7, -h / 2 + hy); c.stroke(); dash(false); c.save(); c.translate(w / 2 - lw * .6, -h / 2 + hy); c.rotate(Math.atan2(h * .9, w) * .55); solidHead(0, 1); c.restore(); break; }
      case 'solid': { dash(true); c.beginPath(); c.moveTo(-w / 2 + lw / 2, 0); c.lineTo(x1 - hl * .5, 0); c.stroke(); dash(false); solidHead(x1, 1); break; }
      default: { dash(true); c.beginPath(); c.moveTo(-w / 2 + lw / 2, 0); c.lineTo(x1 - lw * .2, 0); c.stroke(); dash(false); openHead(x1, 1); }
    }
    c.setLineDash([]);
  }, 'M3 12h16M13 6l6 6-6 6');

/* ---------- infographic pictograms (original, generic symbols drawn in the 100 × 100 icon box) ---------- */
ICON_CATS.push('Infographic');
(() => {
  const I = (id, label, f) => { ICONS[id] = { cat: 'Infographic', label, f }; };
  I('ig_thermo', 'Thermometer', g => { g.rect(39, 6, 22, 66, 11); g.circ(50, 76, 18); g.cut(() => { g.rect(45, 12, 10, 58, 5); g.circ(50, 76, 12); }); g.rect(46.5, 38, 7, 34, 3); g.circ(50, 76, 8.5); for (const y of [20, 32, 44]) g.line([[67, y], [77, y]], 4); });
  I('ig_drop', 'Water drop', g => { g.path('M 50 5 C 50 5 17 45 17 65 C 17 83 31 95 50 95 C 69 95 83 83 83 65 C 83 45 50 5 50 5 Z'); g.cut(() => g.spath('M 33 64 C 32 74 38 82 47 84', 5.5)); });
  I('ig_storm', 'Sandstorm', g => { [[8, 90, 14], [16, 84, 28], [24, 76, 42], [32, 70, 56], [40, 64, 70], [45, 60, 84]].forEach(([a, b, y], i) => g.line([[a + i * 1.5, y], [b + i * 1.5, y]], 8.5)); });
  I('ig_wind', 'Wind', g => { g.spath('M 8 36 L 60 36 C 72 36 79 29 77 20 C 75 11 62 10 59 19', 7); g.spath('M 8 54 L 78 54 C 89 54 95 62 92 71 C 89 80 76 80 73 72', 7); g.spath('M 8 72 L 46 72', 7); });
  I('ig_lungs', 'Lungs', g => { g.line([[50, 6], [50, 40]], 7); g.line([[50, 38], [40, 50]], 5.5); g.line([[50, 38], [60, 50]], 5.5); g.mirror(() => g.path('M 42 30 C 30 26 16 40 12 62 C 9 82 17 94 31 91 C 41 89 44 81 44 69 L 44 52 Z')); g.cut(() => { g.line([[50, 42], [42, 52]], 2); g.line([[50, 42], [58, 52]], 2); }); });
  I('ig_plant', 'Sprout', g => { g.spath('M 50 92 L 50 46', 6); g.path('M 49 60 C 30 62 15 50 13 28 C 34 26 48 38 49 60 Z'); g.path('M 51 48 C 54 27 68 14 89 14 C 89 37 75 50 51 48 Z'); g.rect(26, 88, 48, 7, 3.5); });
  I('ig_warn', 'Warning triangle (outline)', g => { g.spath('M 50 11 L 92 86 L 8 86 Z', 7.5); g.rect(45.5, 34, 9, 30, 4.5); g.circ(50, 74, 5.5); });
  I('ig_check', 'Tick', g => g.line([[15, 54], [39, 78], [87, 25]], 13));
  I('ig_checkc', 'Tick in circle', g => { g.circ(50, 50, 45); g.cut(() => g.line([[27, 52], [43, 68], [74, 35]], 10)); });
  I('ig_xmark', 'Cross mark', g => { g.line([[22, 22], [78, 78]], 14); g.line([[78, 22], [22, 78]], 14); });
  I('ig_info', 'Information', g => { g.circ(50, 50, 45); g.cut(() => { g.circ(50, 27, 7); g.rect(43.5, 40, 13, 38, 3); }); });
  I('ig_question', 'Question', g => { g.circ(50, 50, 45); g.cut(() => { g.spath('M 36 38 C 36 26 44 20 51 20 C 60 20 66 27 66 35 C 66 46 52 48 52 60', 9); g.circ(52, 74, 6); }); });
  I('ig_clock', 'Clock', g => { g.circS(50, 50, 40, 8); g.line([[50, 25], [50, 52], [67, 62]], 7); });
  I('ig_calendar', 'Calendar', g => { g.rect(10, 18, 80, 74, 8); g.cut(() => g.rect(18, 40, 64, 44, 3)); g.rect(25, 7, 9, 20, 4); g.rect(66, 7, 9, 20, 4); for (const [x, y] of [[24, 47], [44, 47], [64, 47], [24, 65], [44, 65]]) g.rect(x, y, 12, 11, 2); });
  I('ig_house', 'Shelter', g => { g.poly([[50, 8], [95, 47], [83, 47], [83, 91], [17, 91], [17, 47], [5, 47]]); g.cut(() => g.rect(41, 61, 18, 30, 2)); });
  I('ig_tent', 'Tent', g => { g.poly([[50, 10], [95, 88], [5, 88]]); g.cut(() => g.poly([[50, 47], [67, 88], [33, 88]])); });
  I('ig_radio', 'Radio', g => { g.rect(29, 30, 42, 64, 8); g.rect(35, 5, 8, 28, 3); g.cut(() => { for (const y of [45, 54, 63]) g.line([[39, y], [61, y]], 3.5); g.circ(50, 80, 5.5); }); });
  I('ig_siren', 'Siren', g => { g.path('M 26 74 L 26 50 C 26 36 37 26 50 26 C 63 26 74 36 74 50 L 74 74 Z'); g.rect(15, 77, 70, 14, 3); g.line([[50, 4], [50, 15]], 6); g.line([[19, 14], [26, 22]], 6); g.line([[81, 14], [74, 22]], 6); g.line([[5, 42], [15, 44]], 6); g.line([[95, 42], [85, 44]], 6); g.cut(() => g.spath('M 38 66 L 38 51 C 38 45 42 40 47 38', 5)); });
  I('ig_cup', 'Cup of water', g => { g.poly([[18, 14], [82, 14], [73, 93], [27, 93]]); g.cut(() => g.spath('M 25 38 C 35 31 43 45 50 38 C 57 31 65 45 75 38', 5.5)); });
  I('ig_food', 'Rations', g => { for (const x of [23, 31, 39]) g.line([[x, 8], [x, 32]], 4.5); g.path('M 19 30 L 43 30 C 43 41 38 47 35 47 L 35 93 L 27 93 L 27 47 C 24 47 19 41 19 30 Z'); g.path('M 61 54 L 61 8 C 76 13 81 33 78 54 Z'); g.rect(61, 50, 9, 43, 4); });
  I('ig_med', 'Medical cross', g => { g.rect(35, 8, 30, 84, 5); g.rect(8, 35, 84, 30, 5); });
  I('ig_heart', 'Health', g => { g.path('M 50 90 C 20 70 6 52 6 34 C 6 19 17 9 30 9 C 39 9 46 14 50 22 C 54 14 61 9 70 9 C 83 9 94 19 94 34 C 94 52 80 70 50 90 Z'); g.cut(() => g.line([[16, 46], [34, 46], [41, 32], [50, 60], [58, 40], [63, 46], [84, 46]], 5)); });
  I('ig_pin', 'Location pin', g => { g.path('M 50 96 C 50 96 16 58 16 38 C 16 18 31 6 50 6 C 69 6 84 18 84 38 C 84 58 50 96 50 96 Z'); g.cut(() => g.circ(50, 38, 13)); });
  I('ig_person', 'Person', g => { g.circ(50, 23, 15); g.path('M 21 95 L 25 57 C 27 46 36 42 50 42 C 64 42 73 46 75 57 L 79 95 Z'); });
  I('ig_people', 'Group', g => {
    g.circ(66, 28, 12); g.path('M 45 86 C 45 64 53 52 66 52 C 79 52 88 64 88 86 Z');
    g.cut(() => { g.circ(37, 35, 18); g.path('M 6 100 C 6 72 18 56 37 56 C 56 56 68 72 68 100 Z'); });
    g.circ(37, 35, 14); g.path('M 11 96 C 11 73 21 60 37 60 C 53 60 63 73 63 96 Z');
  });
  I('ig_idcard', 'ID card', g => { g.rect(6, 20, 88, 60, 8); g.cut(() => { g.circ(30, 43, 9); g.path('M 16 71 C 16 61 22 56 30 56 C 38 56 44 61 44 71 Z'); g.rect(52, 36, 32, 6, 3); g.rect(52, 50, 24, 6, 3); g.rect(52, 64, 28, 6, 3); }); });
  I('ig_bed', 'Rest', g => { g.rect(6, 28, 9, 62, 3); g.rect(6, 62, 88, 14, 3); g.rect(85, 62, 9, 28, 3); g.rect(20, 47, 22, 13, 6); g.rect(45, 45, 49, 17, 5); });
  I('ig_cactus', 'Cactus', g => { g.rect(41, 10, 18, 84, 9); g.spath('M 41 58 L 30 58 C 23 58 21 53 21 46 L 21 32', 12); g.spath('M 59 47 L 70 47 C 77 47 79 42 79 35 L 79 23', 12); g.rect(22, 88, 56, 7, 3.5); });
  I('ig_dunes', 'Desert dunes', g => { g.circ(70, 29, 13); g.path('M 4 70 C 22 51 40 51 58 67 C 70 57 84 55 96 63 L 96 92 L 4 92 Z'); g.cut(() => g.spath('M 4 81 C 26 65 50 70 67 82', 4)); });
  I('ig_scorpion', 'Scorpion', g => {
    g.ell(50, 60, 11.5, 16); g.circ(50, 78, 8.5);
    for (const [x, y, r] of [[50, 42, 6.5], [51.5, 33, 6], [55.5, 25, 5.5], [61.5, 19, 5], [68.5, 15.5, 4.5]]) g.circ(x, y, r);
    g.path('M 71 10.5 C 80 10 86 16 83 25 C 81 21 78 19 74 19 Z');
    g.mirror(() => { g.line([[43, 76], [32, 84]], 5.5); g.path('M 33 81 C 22 74 11 80 12 92 C 18 86 23 86 27 88 C 24 91 23 94 25 97 C 31 94 35 89 35 84 Z');
      for (const [y, d] of [[50, -9], [56, -3], [62, 3], [68, 9]]) g.line([[40, y], [27, y + d * .55], [19, y + d * 1.25]], 3.6); });
  });
  I('ig_bug', 'Insect', g => { g.ell(50, 60, 21, 28); g.circ(50, 27, 11); g.cut(() => g.line([[50, 36], [50, 88]], 3.2)); g.mirror(() => { for (const y of [47, 60, 73]) g.line([[31, y], [13, y - 7]], 4.5); g.line([[44, 19], [36, 7]], 3.5); }); });
  I('ig_shield', 'Safety shield', g => { g.path('M 50 6 L 86 18 L 86 46 C 86 70 70 86 50 94 C 30 86 14 70 14 46 L 14 18 Z'); g.cut(() => g.line([[31, 50], [45, 64], [70, 36]], 9)); });
  I('ig_battery', 'Battery', g => { g.rect(6, 29, 78, 42, 7); g.rect(86, 41, 8, 18, 3); g.cut(() => g.rect(13, 36, 64, 28, 3)); for (const x of [17, 36, 55]) g.rect(x, 40, 16, 20, 2); });
  I('ig_bulb', 'Idea', g => { g.path('M 50 6 C 30 6 17 21 17 39 C 17 53 27 61 31 70 L 69 70 C 73 61 83 53 83 39 C 83 21 70 6 50 6 Z'); g.rect(33, 74, 34, 7, 3); g.rect(37, 85, 26, 8, 4); });
  I('ig_speech', 'Speech bubble', g => g.path('M 15 12 L 85 12 C 90 12 94 16 94 21 L 94 61 C 94 66 90 70 85 70 L 41 70 L 21 89 L 24 70 L 15 70 C 10 70 6 66 6 61 L 6 21 C 6 16 10 12 15 12 Z'));
  I('ig_list', 'Checklist', g => { for (const y of [12, 41, 70]) { g.rect(8, y, 19, 19, 3); g.rect(37, y + 6, 55, 8, 4); } g.cut(() => { g.line([[12, 21], [16, 26], [23, 16]], 3.5); g.line([[12, 50], [16, 55], [23, 45]], 3.5); }); });
  I('ig_arrow', 'Arrow', g => g.poly([[7, 39], [55, 39], [55, 18], [94, 50], [55, 82], [55, 61], [7, 61]]));
  I('ig_sunhot', 'Heat', g => { g.circ(50, 38, 17); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, c = Math.cos(a), s = Math.sin(a); g.line([[50 + c * 26, 38 + s * 26], [50 + c * 35, 38 + s * 35]], 6); } for (const x of [26, 50, 74]) g.spath(`M ${x - 6} 96 C ${x - 12} 90 ${x} 84 ${x - 6} 78`, 5); });
  I('ig_water', 'Water ration', g => { g.rect(30, 6, 40, 12, 3); g.path('M 34 18 L 66 18 L 66 26 C 76 30 80 38 80 48 L 80 86 C 80 91 76 95 71 95 L 29 95 C 24 95 20 91 20 86 L 20 48 C 20 38 24 30 34 26 Z'); g.cut(() => g.path('M 50 44 C 50 44 38 58 38 66 C 38 73 43 78 50 78 C 57 78 62 73 62 66 C 62 58 50 44 50 44 Z')); });
  I('ig_goggles', 'Goggles', g => { g.rect(6, 34, 88, 34, 14); g.cut(() => { g.rect(14, 41, 30, 20, 9); g.rect(56, 41, 30, 20, 9); }); g.rect(44, 46, 12, 10, 2); });
  for (const [id, v] of Object.entries(ICONS)) if (v.cat === 'Infographic') ICON_OPTS.push([id, `Infographic · ${v.label}`]);
})();
Forge.rtLayout = rtLayout;
