/* ================= 200 rubber stamps & seals, plus stickers, labels, ribbons and insignia ================= */
(() => {
  const INK = { red: '#b3302a', blue: '#2d4a8a', violet: '#5a3a8a', green: '#2f6b3a', black: '#26262a', purple: '#6a2a7a', teal: '#1f6f78', brown: '#6a3a1a', orange: '#c25e00', navy: '#1f2f5a', crimson: '#9a1b2b', magenta: '#b0207a', cyan: '#0f8aa0', olive: '#5a6420' };
  const SIZE = { round: [22, 22], gear: [22, 22], burst: [22, 22], oval: [30, 20], hex: [25, 21], octagon: [22, 22], shield: [19, 22], triangle: [24, 21], rect: [34, 17], box: [32, 12], date: [30, 17], entry: [36, 15], postmark: [44, 18], ticket: [32, 16], banner: [34, 18] };
  const FONTS = ['Courier Prime', 'Special Elite', 'Oswald', 'Archivo Black', 'IBM Plex Mono', 'Bebas Neue', 'Cinzel', 'Playfair Display', 'Share Tech Mono', 'Rajdhani'];
  const date = (seed, fmt = 0) => { const r = rng(hashStr(seed)); const d = 1 + (r() * 28 | 0), mo = r() * 12 | 0, y = 2019 + (r() * 8 | 0); return fmt === 1 ? `${String(d).padStart(2, '0')}.${String(mo + 1).padStart(2, '0')}.${String(y).slice(2)}` : fmt === 2 ? `${String(d).padStart(2, '0')} ${MONTHS[mo]}\n${y}` : `${String(d).padStart(2, '0')} ${MONTHS[mo]} ${y}`; };
  const stamp = (cat, name, style, center, text, text2, ink, o = {}) => COMPONENTS.push({ cat, name, make: C => {
    const u = Math.min(C.w, C.h) / 54, [w, h] = SIZE[style], sc = (o.scale || 1) * Math.min(1.5, u), seed = hashStr(name);
    return [{ type: 'stamp', name, x: C.w * (o.px ?? .64), y: C.h * (o.py ?? .6), w: w * sc, h: h * sc, style, center, text, text2, color: INK[ink] || ink, icon: o.icon || 'none', font: o.font || 'Courier Prime', rot: o.rot ?? ((seed % 17) - 8), distress: o.distress ?? (.22 + (seed % 5) * .07), uneven: o.uneven ?? (.15 + (seed % 4) * .1), ghost: o.ghost || 0, opacity: o.opacity ?? .88, ...(o.extra || {}) }];
  } });

  /* ---------- office (50) ---------- */
  const OFF = 'Office stamps';
  [
    ['Approved', 'box', 'APPROVED', '', '', 'green', { font: 'Archivo Black' }],
    ['Rejected', 'box', 'REJECTED', '', '', 'red', { font: 'Archivo Black' }],
    ['Denied', 'rect', 'DENIED', 'APPLICATION', 'REF 0417-C', 'red'],
    ['Paid', 'burst', 'PAID', 'ACCOUNTS', date('paid', 1), 'red', { font: 'Archivo Black' }],
    ['Received · date', 'date', date('recv'), 'RECEIVED', 'POST ROOM', 'blue'],
    ['Filed · date', 'date', date('filed'), 'FILED', 'CENTRAL REGISTRY', 'violet'],
    ['Copy', 'box', 'COPY', '', '', 'black', { font: 'Oswald' }],
    ['Original', 'rect', 'ORIGINAL', 'THIS IS AN', 'DOCUMENT', 'blue'],
    ['Draft', 'box', 'DRAFT', '', '', 'red', { font: 'Bebas Neue' }],
    ['Void', 'box', 'VOID', '', '', 'red', { font: 'Archivo Black', distress: .65 }],
    ['Cancelled', 'rect', 'CANCELLED', 'CERTIFICATE', 'NOT VALID', 'red'],
    ['Confidential', 'box', 'CONFIDENTIAL', '', '', 'red', { font: 'Special Elite' }],
    ['Top secret', 'rect', 'TOP SECRET', 'CLASSIFIED', 'EYES ONLY', 'crimson', { font: 'Oswald' }],
    ['Urgent', 'box', 'URGENT', '', '', 'red', { font: 'Archivo Black', ghost: .5 }],
    ['Priority', 'banner', 'PRIORITY', 'HANDLE AS', '', 'red', { font: 'Oswald' }],
    ['Verified · tick', 'round', 'VERIFIED', 'IDENTITY OFFICE', 'AURELIA', 'green', { icon: 'check' }],
    ['Checked · tick', 'round', 'CHECKED', 'QUALITY CONTROL', 'LINE 4', 'blue', { icon: 'check' }],
    ['Inspected', 'octagon', 'INSPECTED', 'INSPECTOR', 'Nº 12', 'black'],
    ['Certified · gear', 'gear', 'CERTIFIED', 'CERTIFIED BY THE', 'BOARD OF TRADE', 'blue'],
    ['Certified true copy', 'rect', 'TRUE COPY', 'CERTIFIED', 'COMMISSIONER', 'blue', { font: 'Playfair Display' }],
    ['For office use only', 'box', 'FOR OFFICE\nUSE ONLY', '', '', 'black', { font: 'IBM Plex Mono' }],
    ['Specimen', 'box', 'SPECIMEN', '', '', 'red', { font: 'Oswald' }],
    ['Sample', 'box', 'SAMPLE', '', '', 'blue', { font: 'Archivo Black' }],
    ['Not valid for travel', 'box', 'NOT VALID\nFOR TRAVEL', '', '', 'red', { font: 'Oswald' }],
    ['Expired', 'box', 'EXPIRED', '', '', 'crimson', { font: 'Archivo Black', ghost: .4 }],
    ['Renewed · date', 'date', date('renew'), 'RENEWED', 'LICENSING OFFICE', 'green'],
    ['Issued · date', 'date', date('issued'), 'ISSUED', 'COUNTY CLERK', 'blue', { font: 'Special Elite' }],
    ['Entered · date', 'date', date('entered', 1), 'ENTERED', 'LEDGER 7', 'violet', { font: 'IBM Plex Mono' }],
    ['Processed', 'date', date('proc'), 'PROCESSED', 'BATCH 0091', 'black'],
    ['Posted', 'round', 'POSTED', 'ACCOUNTS DEPT', 'ASHBY CROSS', 'blue'],
    ['Faxed', 'rect', 'FAXED', 'SENT BY', 'TIME ________', 'black', { font: 'Special Elite' }],
    ['Scanned', 'rect', 'SCANNED', 'DIGITISED', 'ARCHIVE SERVICES', 'teal', { font: 'IBM Plex Mono' }],
    ['Archived', 'hex', 'ARCHIVED', 'RECORDS', 'VAULT C', 'brown'],
    ['Duplicate', 'box', 'DUPLICATE', '', '', 'violet', { font: 'Oswald' }],
    ['Pending review', 'hex', 'PENDING', 'REVIEW', 'DESK 3', 'orange'],
    ['On hold', 'octagon', 'ON HOLD', 'DO NOT', 'PROCESS', 'red', { font: 'Oswald' }],
    ['Signed & sealed', 'rect', 'SIGNED', 'WITNESSED &', 'SEALED', 'blue', { font: 'Playfair Display' }],
    ['Witnessed · eye', 'round', 'WITNESSED', 'SIGNATURE OF', 'THE BEARER', 'violet', { icon: 'eye' }],
    ['Audited', 'hex', 'AUDITED', 'FINANCE', 'Q3 2026', 'green', { icon: 'check' }],
    ['Cleared · tick', 'round', 'CLEARED', 'SECURITY OFFICE', 'GREYHAVEN', 'green', { icon: 'check' }],
    ['Passed · shield', 'shield', 'PASSED', 'EXAMINATION', '2026', 'green', { icon: 'check' }],
    ['Failed · cross', 'box', 'FAILED', '', '', 'red', { icon: 'cross', font: 'Archivo Black' }],
    ['Overdue', 'burst', 'OVERDUE', 'LIBRARY', 'FINE DUE', 'red', { font: 'Oswald' }],
    ['Rush', 'burst', 'RUSH', '', '', 'orange', { font: 'Archivo Black' }],
    ['Final notice', 'box', 'FINAL\nNOTICE', '', '', 'crimson', { font: 'Archivo Black' }],
    ['Received with thanks', 'round', 'WITH THANKS', 'RECEIVED', 'THE TREASURER', 'blue', { font: 'Playfair Display' }],
    ['Do not copy', 'box', 'DO NOT COPY', '', '', 'red', { font: 'Oswald' }],
    ['Internal', 'box', 'INTERNAL', '', '', 'teal', { font: 'IBM Plex Mono' }],
    ['Seen · consulate', 'round', 'SEEN', 'CONSULATE OF', 'MERIDIAN', 'blue'],
    ['Authorised · crown', 'shield', 'AUTHORISED', 'BY ORDER', '', 'navy', { icon: 'crown', font: 'Cinzel' }],
  ].forEach(([n, s, c, t, t2, ink, o]) => stamp(OFF, n, s, c, t, t2, ink, o));

  /* ---------- travel (50): 25 fictional ports, entry & exit ---------- */
  const TRV = 'Travel stamps';
  const PORTS = [['SALTMERE HARBOUR', 'ship'], ['GREYHAVEN AIRFIELD', 'plane'], ['PORT ELLING', 'ship'], ['LANTERN BAY', 'anchor'], ['CALDRIS CENTRAL', 'train'], ['MERROWGATE', 'tower'], ['SILVERFORD', 'train'], ['NORTHWOLD PASS', 'mountain'], ['HALVORSEN ISLES', 'ship'], ['THORNWICK', 'tower'], ['VELORIA INTL', 'plane'], ['AURELIA SKYPORT', 'airship'], ['WYVERN HOLLOW', 'tree'], ['ASHBY CROSS', 'train'], ['FENWICK QUAY', 'anchor'], ['KESTREL FIELD', 'plane'], ['FROSTLINE BASE', 'mountain'], ['ARES BASIN', 'rocket'], ['OBERON STATION', 'planet'], ['DUSTLINE GATE', 'tower'], ['NEON MILE', 'eye'], ['MARROW CITY', 'train'], ['RUSTWATER', 'cog'], ['ELDERMOOR', 'tree'], ['STARFALL DOCKS', 'rocket']];
  const IN_STY = ['entry', 'round', 'oval', 'octagon', 'rect', 'hex', 'triangle', 'shield', 'ticket', 'entry'], OUT_STY = ['rect', 'entry', 'hex', 'oval', 'round', 'ticket', 'octagon', 'entry', 'shield', 'triangle'];
  const INKS = ['blue', 'violet', 'green', 'red', 'teal', 'black', 'purple', 'navy', 'brown', 'orange', 'magenta', 'olive'];
  const TF = ['IBM Plex Mono', 'Courier Prime', 'Oswald', 'Share Tech Mono', 'Rajdhani'];
  const title = s => s.toLowerCase().replace(/\b\w/g, m => m.toUpperCase());
  PORTS.forEach(([port, icon], i) => {
    for (const dir of ['in', 'out']) {
      const sty = (dir === 'in' ? IN_STY : OUT_STY)[i % 10], ink = INKS[(i * 2 + (dir === 'out')) % INKS.length], d = date(port + dir, i % 3 === 2 ? 1 : 0).replace('\n', ' ');
      const word = dir === 'in' ? ['ADMITTED', 'ENTRY', 'ARRIVAL', 'LANDED'][i % 4] : ['DEPARTED', 'EXIT', 'DEPARTURE', 'LEFT'][i % 4];
      const ic = sty === 'entry' ? icon : (dir === 'in' ? 'arrowIn' : 'arrowOut');
      const top = sty === 'triangle' ? word : port, mid = sty === 'triangle' ? d.slice(0, 6) : d, bot = sty === 'triangle' ? port : `${word} · ${['GATE', 'BERTH', 'DESK', 'PIER', 'BAY'][i % 5]} ${1 + (hashStr(port) % 19)}`;
      stamp(TRV, `${title(port)} · ${dir === 'in' ? 'entry' : 'exit'}`, sty, mid, top, bot, ink, { icon: ['round', 'oval', 'shield', 'hex', 'octagon', 'triangle', 'entry'].includes(sty) ? ic : 'none', font: TF[(i + (dir === 'out')) % TF.length], px: dir === 'in' ? .38 : .66, py: dir === 'in' ? .42 : .64 });
    }
  });

  /* ---------- postal & date (25) ---------- */
  const PST = 'Postal & date';
  ['Saltmere', 'Greyhaven', 'Lantern Bay', 'Caldris', 'Merrowgate', 'Silverford', 'Ashby Cross', 'Fenwick', 'Marrow City', 'Eldermoor'].forEach((t, i) => stamp(PST, `Postmark · ${t}`, 'postmark', date('pm' + t, 1), t.toUpperCase(), ['POST OFFICE', 'SORTING', 'CENTRAL', 'HARBOUR', 'NORTH'][i % 5], ['black', 'black', 'blue', 'black', 'red', 'black', 'violet', 'black', 'blue', 'black'][i], { font: i % 2 ? 'IBM Plex Mono' : 'Courier Prime', rot: (i % 5) - 2, px: .6, py: .5, icon: i === 2 ? 'ship' : i === 5 ? 'train' : i === 9 ? 'tree' : 'none' }));
  [
    ['Air mail', 'box', 'AIR MAIL', '', '', 'blue', { icon: 'plane', font: 'Oswald' }],
    ['By airship', 'banner', 'BY AIRSHIP', 'PAR DIRIGEABLE', '', 'violet', { icon: 'airship', font: 'Oswald' }],
    ['Registered', 'rect', 'REGISTERED', 'R', 'Nº 0412 77', 'blue', { font: 'Oswald' }],
    ['Postage paid', 'rect', 'POSTAGE PAID', 'SALTMERE', 'PERMIT 214', 'black', { font: 'IBM Plex Mono' }],
    ['First class', 'box', 'FIRST CLASS', '', '', 'red', { font: 'Archivo Black' }],
    ['Insufficient postage', 'box', 'INSUFFICIENT\nPOSTAGE', '', '', 'red', { icon: 'hand', font: 'Oswald' }],
    ['Return to sender', 'box', 'RETURN TO\nSENDER', '', '', 'violet', { icon: 'hand', font: 'Oswald' }],
    ['Missent', 'rect', 'MISSENT', 'MISSENT TO', 'SILVERFORD', 'black'],
    ['Forwarded', 'oval', 'FORWARDED', 'POST OFFICE', 'GREYHAVEN', 'blue'],
    ['Delivered · tick', 'round', 'DELIVERED', 'COURIER', 'SIGNED', 'green', { icon: 'check' }],
    ['Signed for', 'date', date('signed'), 'SIGNED FOR', 'COUNTER 2', 'blue'],
    ['Parcel post', 'ticket', 'PARCEL POST', 'HANDLE WITH CARE', 'THIS WAY UP', 'brown', { font: 'Oswald' }],
    ['Express', 'burst', 'EXPRESS', '', '', 'red', { font: 'Archivo Black' }],
    ['Hold at counter', 'rect', 'HOLD AT\nCOUNTER', 'COLLECT FROM', 'BRANCH 9', 'black'],
    ['Opened for inspection', 'oval', 'OPENED', 'FOR INSPECTION', 'RESEALED', 'red'],
  ].forEach(([n, s, c, t, t2, ink, o]) => stamp(PST, n, s, c, t, t2, ink, o));

  /* ---------- genre (50) ---------- */
  const GEN = 'Genre stamps';
  [
    // fantasy
    ['By order of the crown', 'shield', 'BY ORDER', 'OF THE CROWN', 'THORNWICK', 'crimson', { icon: 'crown', font: 'Cinzel' }],
    ['Guild approved', 'gear', 'GUILD', 'APPROVED BY THE', 'GUILD OF SMITHS', 'brown', { font: 'Cinzel', icon: 'cog' }],
    ['Sealed by the archmage', 'round', 'SEALED', 'BY THE ARCHMAGE', 'NINE LANTERNS', 'violet', { icon: 'star', font: 'Cinzel' }],
    ['Dragon-proofed', 'triangle', 'PROOFED', 'DRAGON', '', 'red', { icon: 'hazard', font: 'Cinzel' }],
    ['Royal treasury · tax paid', 'burst', 'TAX PAID', 'ROYAL TREASURY', 'ANNO XLII', 'olive', { font: 'Cinzel' }],
    ['Cursed · do not open', 'box', 'CURSED · DO\nNOT OPEN', '', '', 'black', { icon: 'skull', font: 'Cinzel' }],
    ['North gate passage', 'entry', 'PASSAGE', 'NORTH GATE', 'GRANTED BY THE WARDEN', 'brown', { icon: 'tower', font: 'Cinzel' }],
    ['Adventurers guild · rank B', 'shield', 'RANK B', 'ADVENTURERS', 'GUILD', 'navy', { icon: 'star', font: 'Cinzel' }],
    ['Inn of the gilded stag', 'round', 'LODGING', 'INN OF THE', 'GILDED STAG', 'brown', { font: 'Playfair Display' }],
    ['Quest complete', 'banner', 'QUEST COMPLETE', '', '', 'green', { font: 'Cinzel' }],
    ['Bounty paid', 'burst', 'BOUNTY PAID', 'SHERIFF', 'ELDERMOOR', 'crimson', { font: 'Playfair Display' }],
    ['Magic licence renewed', 'date', 'MOON IX · YR 412', 'RENEWED', 'COLLEGE OF ARCANA', 'purple', { font: 'Cinzel' }],
    // sci-fi
    ['Decontaminated', 'hex', 'DECON', 'AIRLOCK 3', 'CLEAN', 'teal', { icon: 'hazard', font: 'Rajdhani' }],
    ['Cleared for docking', 'entry', 'DOCK 14', 'CLEARED FOR DOCKING', 'OBERON STATION', 'cyan', { icon: 'rocket', font: 'Share Tech Mono' }],
    ['Orbital customs', 'octagon', 'CUSTOMS', 'ORBITAL', 'DECK 4', 'blue', { icon: 'planet', font: 'Rajdhani' }],
    ['Quarantine', 'triangle', 'QUARANTINE', 'BIOHAZARD', '', 'orange', { icon: 'hazard', font: 'Rajdhani' }],
    ['Cryo certified', 'round', 'CRYO OK', 'CRYOGENIC', 'CERTIFIED', 'cyan', { icon: 'star', font: 'Share Tech Mono' }],
    ['Gravity class 2', 'hex', 'G-CLASS 2', 'GRAVITY', 'RATED', 'violet', { font: 'Rajdhani' }],
    ['Colony entry · Ares Basin', 'entry', date('ares', 1), 'ARES BASIN COLONY', 'ENTRY · HAB 12', 'red', { icon: 'planet', font: 'Share Tech Mono' }],
    ['AI verified', 'round', 'AI VERIFIED', 'NEURAL AUDIT', 'PASS', 'magenta', { icon: 'eye', font: 'Rajdhani' }],
    ['Void-rated', 'box', 'VOID-RATED', '', '', 'black', { font: 'Rajdhani' }],
    ['Jump gate transit', 'oval', 'GATE 7', 'JUMP GATE', 'TRANSIT', 'blue', { icon: 'rocket', font: 'Rajdhani' }],
    ['Synthetic registered', 'gear', 'SYNTH', 'REGISTERED', 'SERIES 9', 'magenta', { font: 'Rajdhani' }],
    ['Oxygen quota paid', 'burst', 'O₂ PAID', 'QUOTA', 'HAB 12', 'cyan', { font: 'Rajdhani' }],
    ['Restricted sector', 'triangle', 'RESTRICTED', 'SECTOR 9', '', 'red', { icon: 'hazard', font: 'Rajdhani' }],
    // noir & vintage
    ['Evidence', 'box', 'EVIDENCE', '', '', 'red', { font: 'Special Elite' }],
    ['Case closed', 'rect', 'CASE CLOSED', 'MARROW CITY PD', 'FILE 47', 'black', { font: 'Special Elite' }],
    ['Bureau of inquiry', 'gear', 'BUREAU', 'BUREAU OF', 'INQUIRY', 'navy', { font: 'Playfair Display' }],
    ['Passed by censor', 'round', 'PASSED', 'PASSED BY', 'CENSOR 14', 'violet', { font: 'Special Elite' }],
    ['File no. 47', 'box', 'FILE Nº 47', '', '', 'black', { font: 'Special Elite' }],
    ['Telegram received', 'date', date('tele', 1), 'TELEGRAM RECEIVED', 'HARBOUR WIRELESS', 'blue', { font: 'Special Elite' }],
    ['Missing', 'box', 'MISSING', '', '', 'red', { font: 'Playfair Display' }],
    ['Witness statement', 'rect', 'STATEMENT', 'WITNESS', 'TAKEN BY DET. ROOK', 'black', { font: 'Special Elite' }],
    // wasteland
    ['Rad-free', 'triangle', 'RAD-FREE', 'TESTED', '', 'olive', { icon: 'hazard', font: 'Oswald' }],
    ['Water ration issued', 'date', date('water', 1), 'WATER RATION', 'ISSUED · 3 TAGS', 'blue', { font: 'Oswald' }],
    ['Scrap weighed', 'octagon', '40 T', 'SCRAP', 'WEIGHED', 'brown', { icon: 'cog', font: 'Oswald' }],
    ['Gate 4 cleared', 'entry', 'CLEARED', 'GATE 4', 'DUSTLINE ASSEMBLY', 'red', { icon: 'tower', font: 'Oswald' }],
    ['Condemned', 'box', 'CONDEMNED', '', '', 'black', { font: 'Bebas Neue', distress: .7 }],
    ['Survivor registered', 'round', 'REGISTERED', 'SURVIVOR', 'SECTOR 9', 'olive', { font: 'Oswald' }],
    ['No trade', 'box', 'NO TRADE', '', '', 'red', { icon: 'cross', font: 'Bebas Neue' }],
    ['Fuel rationed', 'hex', 'FUEL', 'RATIONED', 'CLASS C', 'orange', { font: 'Oswald' }],
    ['Outpost visited', 'round', 'VISITED', 'OUTPOST', 'RUSTWATER', 'brown', { icon: 'mountain', font: 'Oswald' }],
    // cyber
    ['Access granted', 'box', 'ACCESS GRANTED', '', '', 'green', { icon: 'check', font: 'Share Tech Mono' }],
    ['Access denied', 'box', 'ACCESS DENIED', '', '', 'red', { icon: 'cross', font: 'Share Tech Mono' }],
    ['Encrypted', 'hex', 'ENCRYPTED', 'AES-∞', 'NODE 7', 'cyan', { icon: 'key', font: 'Share Tech Mono' }],
    ['Firewall passed', 'shield', 'PASSED', 'FIREWALL', 'v9.2', 'green', { icon: 'check', font: 'Share Tech Mono' }],
    ['Blacklisted', 'box', 'BLACKLISTED', '', '', 'magenta', { icon: 'skull', font: 'Share Tech Mono' }],
    ['Corp property', 'rect', 'CORP PROPERTY', 'HALCYON', 'DO NOT REMOVE', 'black', { font: 'Rajdhani' }],
    ['Neon Mile checkpoint', 'entry', date('neon', 1), 'NEON MILE', 'CHECKPOINT 3', 'magenta', { icon: 'eye', font: 'Share Tech Mono' }],
    ['Data purged', 'burst', 'PURGED', 'DATA', '0 BYTES LEFT', 'cyan', { font: 'Share Tech Mono' }],
  ].forEach(([n, s, c, t, t2, ink, o]) => stamp(GEN, n, s, c, t, t2, ink, o));

  /* ---------- seals (25): notary gears, wax, foil and blind embossing ---------- */
  const SEA = 'Seals & stamps';
  const REALMS = ['AURELIAN COMMONWEALTH', 'REPUBLIC OF VELORIA', 'MERIDIAN UNION', 'HALVORSEN ISLES', 'KINGDOM OF THORNWICK', 'FREE CITY OF SALTMERE'];
  REALMS.forEach((r, i) => stamp(SEA, `Notary seal · ${title(r)}`, 'gear', 'SEAL', 'NOTARY PUBLIC', r, i % 2 ? 'blue' : 'black', { font: i % 3 === 0 ? 'Cinzel' : 'Playfair Display', icon: ['star', 'crown', 'sun', 'anchor', 'tower', 'ship'][i], scale: .9, distress: .15, uneven: .2, px: .7, py: .66, ...(i >= 3 ? { extra: { finish: 'blind', relief: .8, blend: 'source-over', opacity: 1 } } : {}) }));
  const WAX = [['Crimson', '#8e1f1f', 'star'], ['Royal blue', '#2a3f8a', 'compass'], ['Forest green', '#2f6b3a', 'laurel'], ['Black', '#1a1a1c', 'shield'], ['Ochre', '#b07a1a', 'sun'], ['Purple', '#5a2a7a', 'rosette'], ['Copper', '#9a5a2a', 'star'], ['Teal', '#1f6f78', 'compass'], ['Rose', '#b04a6a', 'rosette'], ['Ivory', '#e8dcc0', 'laurel']];
  WAX.forEach(([n, c, sty], i) => COMPONENTS.push({ cat: SEA, name: `Wax seal · ${n.toLowerCase()}`, make: C => { const s = 13 * Math.min(1.4, Math.min(C.w, C.h) / 54), x = C.w * .8, y = C.h * .74; return [{ type: 'ellipse', name: 'Wax seal', x, y, w: s * 1.06, h: s, fill: c, fill2: shiftColor(c, 0, 1, -.18), grad: true, angle: 60, relief: .75, rot: (i * 37) % 30 - 15 }, { type: 'seal', name: 'Seal impression', x, y, w: s * .72, h: s * .72, style: sty, text: i % 2 ? 'SIGILLUM · ' : '', points: 8 + (i % 4) * 2, color: shiftColor(c, 0, 1, c === '#e8dcc0' ? -.25 : -.14), relief: -.45 }]; } }));
  [['Gold', '#d6b25e', 'sun'], ['Silver', '#c8ccd3', 'compass'], ['Copper', '#c47a4a', 'rosette'], ['Rose gold', '#d9a08a', 'laurel']].forEach(([n, f, sty]) => COMPONENTS.push({ cat: SEA, name: `Foil seal · ${n.toLowerCase()}`, make: C => [{ type: 'seal', name: `${n} seal`, x: C.w * .8, y: C.h * .28, w: 15, h: 15, style: sty, text: 'GENUINE · AUTHENTIC · ', points: 16, finish: 'foil', foil: f, relief: .25 }] }));
  [['Blind emboss · rosette', 'rosette'], ['Blind emboss · laurel', 'laurel'], ['Blind emboss · compass', 'compass'], ['Blind emboss · shield', 'shield'], ['Holographic seal', 'star']].forEach(([n, sty], i) => COMPONENTS.push({ cat: SEA, name: n, make: C => [{ type: 'seal', name: n, x: C.w * .78, y: C.h * .7, w: 17, h: 17, style: sty, text: 'OFFICIAL · SEAL · ', points: 12, ...(i === 4 ? { finish: 'holo', holoPat: 2 } : { finish: 'blind', relief: .85 }) }] }));

  /* ---------- stickers & labels (25) ---------- */
  const STK = 'Stickers & labels', add = (cat, name, make) => COMPONENTS.push({ cat, name, make });
  const T = (text, x, y, w, h, o = {}) => ({ type: 'text', name: o.name || text, x, y, w, h, text, font: 'Inter', weight: 800, size: h * .7, align: 'center', color: '#ffffff', ...o });
  add(STK, 'Validation sticker · holo 2026', C => [{ type: 'holo', name: 'Validation sticker', x: C.w - 9, y: 9, w: 11, h: 11, shape: 'circle', holoPat: 4, emblem: 'none' }, T('26', C.w - 9, 9, 8, 5, { color: '#20242a', font: 'Archivo Black' })]);
  add(STK, 'Validation sticker · green 2027', C => [{ type: 'ellipse', name: 'Sticker', x: C.w - 9, y: 9, w: 10, h: 10, fill: '#2f9a4a' }, T('27', C.w - 9, 9, 8, 4.6, { font: 'Archivo Black' })]);
  add(STK, 'Quarter sticker · Q3', C => [{ type: 'rect', name: 'Sticker', x: C.w - 9, y: 9, w: 10, h: 10, radius: 2, fill: '#f2b632' }, T('Q3', C.w - 9, 9, 8, 4.6, { color: '#2a2010', font: 'Archivo Black' })]);
  add(STK, 'Semester sticker · spring', C => [{ type: 'rect', name: 'Sticker', x: C.w - 12, y: 8, w: 18, h: 6.5, radius: 3.25, fill: '#e0306a' }, T('SPRING 26', C.w - 12, 8, 16, 3.6, { spacing: .08 })]);
  add(STK, 'Verified holo shield', C => [{ type: 'holo', name: 'Verified shield', x: C.w * .82, y: C.h * .32, w: 12, h: 14, shape: 'shield', holoPat: 0, emblem: 'star' }, T('VERIFIED', C.w * .82, C.h * .32 + 9.5, 16, 2.6, { color: '#30363e', spacing: .15 })]);
  add(STK, 'Corner ribbon · staff', C => [{ type: 'rect', name: 'Corner ribbon', x: C.w - 7, y: 7, w: 34, h: 5.6, rot: 45, fill: '#c4202b' }, T('STAFF', C.w - 7, 7, 18, 3.4, { rot: 45, spacing: .2 })]);
  add(STK, 'Corner ribbon · new', C => [{ type: 'rect', name: 'Corner ribbon', x: 7, y: 7, w: 34, h: 5.6, rot: -45, fill: '#1f7f4a' }, T('NEW', 7, 7, 14, 3.4, { rot: -45, spacing: .2 })]);
  add(STK, 'VIP gold tab', C => [{ type: 'rect', name: 'VIP tab', x: C.w * .8, y: C.h * .2, w: 20, h: 7, radius: 3.5, fill: '#d6b25e', finish: 'foil', foil: '#d6b25e' }, T('VIP', C.w * .8, C.h * .2, 16, 4.4, { color: '#2a2010', font: 'Cinzel', spacing: .3 })]);
  add(STK, 'Access level dots', C => [T('ACCESS', C.w * .78, C.h * .78 - 4, 20, 2.2, { color: '#3a4048', spacing: .3, weight: 700 }), ...[0, 1, 2, 3, 4].map(i => ({ type: 'ellipse', name: 'Level dot ' + (i + 1), x: C.w * .78 - 8 + i * 4, y: C.h * .78, w: 3, h: 3, fill: i < 3 ? '#c4202b' : '#ffffff', stroke: '#c4202b', strokeW: .3 }))]);
  add(STK, 'Temporary band', C => [{ type: 'rect', name: 'Temporary band', x: C.w / 2, y: C.h - 4, w: C.w, h: 8, fill: '#c4202b' }, T('TEMPORARY', C.w / 2, C.h - 4, C.w * .8, 4.4, { spacing: .5, font: 'Oswald', weight: 700 })]);
  add(STK, 'Escort required band', C => [{ type: 'pattern', name: 'Stripes', x: C.w / 2, y: C.h - 4, w: C.w, h: 8, kind: 'stripes', color: '#111111', color2: '#f2b632', density: 10 }, { type: 'rect', name: 'Label', x: C.w / 2, y: C.h - 4, w: 40, h: 5.6, fill: '#111111' }, T('ESCORT REQUIRED', C.w / 2, C.h - 4, 36, 3.2, { color: '#f2b632', spacing: .2, font: 'Oswald', weight: 700 })]);
  add(STK, 'Barcode label', C => [{ type: 'rect', name: 'Label', x: C.w * .7, y: C.h * .8, w: 30, h: 12, radius: 1, fill: '#ffffff', stroke: '#c9ccd1', strokeW: .2 }, { type: 'barcode', name: 'Barcode', x: C.w * .7, y: C.h * .8 - 1, w: 26, h: 7, data: 'LBL-' + '20417', showText: false }, T('LBL-20417', C.w * .7, C.h * .8 + 4.2, 26, 2, { color: '#20242a', font: 'IBM Plex Mono', weight: 500 })]);
  add(STK, 'Asset tag', C => [{ type: 'rect', name: 'Asset tag', x: C.w * .7, y: C.h * .78, w: 34, h: 14, radius: 1.6, fill: '#d9dde2', finish: 'foil', foil: '#c8ccd3' }, T('PROPERTY OF NORTHWIND LABS', C.w * .7, C.h * .78 - 4.6, 30, 2.1, { color: '#20242a', weight: 700, spacing: .08 }), { type: 'barcode', name: 'Barcode', x: C.w * .7, y: C.h * .78 + 1, w: 28, h: 6, data: 'NWL-08812', showText: false }, T('NWL-08812', C.w * .7, C.h * .78 + 5.4, 20, 1.8, { color: '#20242a', font: 'IBM Plex Mono', weight: 500 })]);
  add(STK, 'QR sticker · scan me', C => [{ type: 'rect', name: 'Sticker', x: C.w * .82, y: C.h * .62, w: 16, h: 20, radius: 2, fill: '#ffffff', stroke: '#111111', strokeW: .35 }, { type: 'qr', name: 'QR code', x: C.w * .82, y: C.h * .62 - 2, w: 13, h: 13, data: 'https://example.com/scan', quiet: 1 }, T('SCAN ME', C.w * .82, C.h * .62 + 7, 13, 2.6, { color: '#111111', spacing: .2 })]);
  add(STK, 'Donor heart', C => [{ type: 'shape', name: 'Heart', x: C.w * .84, y: C.h * .3, w: 10, h: 9, kind: 'heart', fill: '#d6303a' }, T('DONOR', C.w * .84, C.h * .3 + 7, 14, 2.4, { color: '#d6303a', spacing: .2 })]);
  add(STK, 'Blood type label', C => [{ type: 'rect', name: 'Label', x: C.w * .84, y: C.h * .3, w: 14, h: 10, radius: 1.2, fill: '#b3202a' }, T('BLOOD', C.w * .84, C.h * .3 - 2.6, 12, 2, { spacing: .2 }), T('O+', C.w * .84, C.h * .3 + 1.4, 12, 5, { font: 'Archivo Black' })]);
  add(STK, 'Parking zone disc', C => [{ type: 'ellipse', name: 'Parking disc', x: C.w * .82, y: C.h * .3, w: 14, h: 14, fill: '#1f5f9e' }, T('P', C.w * .82, C.h * .3 - 1.2, 10, 7, { font: 'Archivo Black' }), T('ZONE B', C.w * .82, C.h * .3 + 3.8, 10, 2, { spacing: .15 })]);
  add(STK, 'Number tag', C => [{ type: 'rect', name: 'Number tag', x: C.w * .84, y: C.h * .2, w: 14, h: 7, radius: 1.4, fill: '#111111' }, T('047', C.w * .84, C.h * .2, 12, 4.4, { font: 'Share Tech Mono', weight: 400, spacing: .1 })]);
  add(STK, 'Tested dot', C => [{ type: 'ellipse', name: 'Tested dot', x: C.w * .86, y: C.h * .2, w: 9, h: 9, fill: '#2f9a4a' }, T('OK', C.w * .86, C.h * .2, 7, 3.8, { font: 'Archivo Black' })]);
  add(STK, 'Lot & batch label', C => [{ type: 'rect', name: 'Label', x: C.w * .72, y: C.h * .8, w: 30, h: 11, radius: .8, fill: '#ffffff', stroke: '#20242a', strokeW: .25 }, { type: 'field', name: 'Lot', x: C.w * .72 - 7.5, y: C.h * .8, w: 13, h: 7, label: 'LOT', value: 'A-2207', color: '#20242a', lcolor: '#6a7078', font: 'IBM Plex Mono' }, { type: 'field', name: 'Batch', x: C.w * .72 + 7.5, y: C.h * .8, w: 13, h: 7, label: 'BATCH', value: '0914', color: '#20242a', lcolor: '#6a7078', font: 'IBM Plex Mono' }]);
  add(STK, 'Sample watermark', C => [T('SAMPLE', C.w / 2, C.h / 2, C.w * .9, C.h * .32, { name: 'Sample watermark', rot: -22, color: '#c4202b', opacity: .16, font: 'Archivo Black', spacing: .1 })]);
  add(STK, 'Not for sale strip', C => [{ type: 'rect', name: 'Strip', x: C.w / 2, y: 5, w: C.w, h: 5, fill: '#111111' }, T('NOT FOR SALE · DISPLAY ONLY · NOT FOR SALE', C.w / 2, 5, C.w * .94, 2.6, { color: '#f2f2f2', spacing: .25, weight: 700 })]);
  add(STK, 'Warning triangle label', C => [{ type: 'shape', name: 'Warning', x: C.w * .84, y: C.h * .3, w: 12, h: 11, kind: 'polygon', sides: 3, fill: '#f2b632', stroke: '#111111', strokeW: .5 }, T('!', C.w * .84, C.h * .3 + 1.6, 6, 6, { color: '#111111', font: 'Archivo Black' })]);
  add(STK, 'Press armband label', C => [{ type: 'rect', name: 'Armband', x: C.w * .3, y: C.h - 6, w: 30, h: 7, fill: '#1f4f9e' }, T('PRESS', C.w * .3, C.h - 6, 26, 4.6, { font: 'Archivo Black', spacing: .3 })]);
  add(STK, 'Holo strip · thin', C => [{ type: 'holo', name: 'Holo strip', x: C.w * .5, y: C.h * .88, w: C.w * .9, h: 3, shape: 'rect', holoPat: 6, emblem: 'none' }]);

  /* ---------- ribbons & insignia (25) ---------- */
  const RIB = 'Ribbons & insignia';
  [['Member', '#1f4f9e'], ['Honours', '#8a1c2a'], ['Est. 1887', '#2f6b3a'], ['Champion', '#b8892b']].forEach(([t, c]) => add(RIB, `Ribbon banner · ${t.toLowerCase()}`, C => [{ type: 'shape', name: 'Ribbon', x: C.w / 2, y: C.h * .2, w: 40, h: 9, kind: 'ribbon', fill: c }, T(t.toUpperCase(), C.w / 2, C.h * .2 - .6, 28, 3.6, { font: 'Cinzel', spacing: .2 })]));
  [['1st', '#d6b25e', '#8a1c2a'], ['2nd', '#c8ccd3', '#1f4f9e'], ['3rd', '#c47a4a', '#2f6b3a']].forEach(([t, f, rc]) => add(RIB, `Award rosette · ${t}`, C => { const x = C.w * .82, y = C.h * .34; return [{ type: 'rect', name: 'Tail L', x: x - 2.4, y: y + 8, w: 4, h: 11, rot: 14, fill: rc }, { type: 'rect', name: 'Tail R', x: x + 2.4, y: y + 8, w: 4, h: 11, rot: -14, fill: rc }, { type: 'shape', name: 'Rosette', x, y, w: 14, h: 14, kind: 'burst', points: 24, inner: .82, fill: rc }, { type: 'ellipse', name: 'Medallion', x, y, w: 10, h: 10, fill: f, finish: 'foil', foil: f }, T(t.toUpperCase(), x, y, 8, 3.6, { color: '#2a2010', font: 'Archivo Black' })]; }));
  [1, 2, 3].forEach(n => add(RIB, `Rank chevrons · ${n}`, C => Array.from({ length: n }, (_, i) => ({ type: 'shape', name: 'Chevron ' + (i + 1), x: C.w * .84, y: C.h * .26 + i * 3.4, w: 12, h: 5, kind: 'chevron', fill: '#b8892b', finish: 'foil', foil: '#d6b25e', rot: 180 }))));
  [1, 2, 3].forEach(n => add(RIB, `Rank stars · ${n}`, C => Array.from({ length: n }, (_, i) => ({ type: 'shape', name: 'Star ' + (i + 1), x: C.w * .84 - (n - 1) * 2.6 + i * 5.2, y: C.h * .2, w: 4.6, h: 4.6, kind: 'star', points: 5, inner: .42, fill: '#c8ccd3', finish: 'foil', foil: '#c8ccd3' }))));
  add(RIB, 'Laurel · merit', C => [{ type: 'seal', name: 'Laurel', x: C.w * .8, y: C.h * .32, w: 16, h: 16, style: 'laurel', text: '', color: '#2f6b3a' }, T('MERIT', C.w * .8, C.h * .32 + 10, 14, 2.8, { color: '#2f6b3a', font: 'Cinzel', spacing: .25 })]);
  [['Crest · azure', '#1f4f9e', '#d6b25e'], ['Crest · gules', '#8a1c2a', '#f3efe4'], ['Crest · vert', '#2f6b3a', '#d6b25e']].forEach(([n, c, c2]) => add(RIB, n, C => { const x = C.w * .82, y = C.h * .32; return [{ type: 'shape', name: 'Shield', x, y, w: 13, h: 15, kind: 'shield', fill: c, stroke: c2, strokeW: .5 }, { type: 'shape', name: 'Chevron', x, y: y + 1.2, w: 9, h: 4, kind: 'chevron', fill: c2, rot: 180 }, { type: 'shape', name: 'Star', x, y: y - 3.4, w: 4, h: 4, kind: 'star', points: 5, inner: .42, fill: c2 }]; }));
  add(RIB, 'Diamond badge', C => [{ type: 'shape', name: 'Diamond', x: C.w * .82, y: C.h * .3, w: 14, h: 14, kind: 'diamond', fill: '#2a2f7a' }, T('A', C.w * .82, C.h * .3, 8, 7, { font: 'Cinzel' })]);
  add(RIB, 'Medal on ribbon', C => { const x = C.w * .82, y = C.h * .3; return [{ type: 'pattern', name: 'Ribbon', x, y: y - 5, w: 7, h: 9, kind: 'stripes', color: '#8a1c2a', color2: '#f3efe4', density: 6 }, { type: 'ellipse', name: 'Medal', x, y: y + 3.5, w: 10, h: 10, fill: '#d6b25e', finish: 'foil', foil: '#d6b25e', relief: .4 }, { type: 'shape', name: 'Medal star', x, y: y + 3.5, w: 6, h: 6, kind: 'star', points: 5, inner: .42, fill: '#b8892b' }]; });
  add(RIB, 'Diagonal sash', C => [{ type: 'rect', name: 'Sash', x: C.w / 2, y: C.h / 2, w: Math.hypot(C.w, C.h) * 1.2, h: 6, rot: -28, fill: '#8a1c2a', opacity: .9 }, { type: 'rect', name: 'Sash edge', x: C.w / 2, y: C.h / 2, w: Math.hypot(C.w, C.h) * 1.2, h: 7.2, rot: -28, fillOn: false, stroke: '#d6b25e', strokeW: .35 }]);
  add(RIB, 'Heart badge', C => [{ type: 'shape', name: 'Heart', x: C.w * .84, y: C.h * .26, w: 11, h: 10, kind: 'heart', fill: '#e0306a' }]);
  add(RIB, 'Arrow tag', C => [{ type: 'shape', name: 'Arrow', x: C.w * .78, y: C.h * .2, w: 22, h: 8, kind: 'arrow', fill: '#111111' }, T('THIS WAY', C.w * .76, C.h * .2, 14, 3, { spacing: .15 })]);
  add(RIB, 'Luggage tag · crew', C => [{ type: 'shape', name: 'Tag', x: C.w * .8, y: C.h * .3, w: 22, h: 12, kind: 'tag', fill: '#f2b632' }, T('CREW', C.w * .82, C.h * .3, 14, 4.4, { color: '#2a2010', font: 'Archivo Black', spacing: .15 })]);
  add(RIB, 'Sunburst badge · new', C => [{ type: 'shape', name: 'Burst', x: C.w * .84, y: C.h * .26, w: 14, h: 14, kind: 'burst', points: 18, inner: .8, fill: '#e0306a' }, T('NEW!', C.w * .84, C.h * .26, 10, 3.6, { font: 'Archivo Black', rot: -12 })]);
  add(RIB, 'Wings insignia', C => { const x = C.w * .8, y = C.h * .22, o = [{ type: 'ellipse', name: 'Centre', x, y, w: 4.6, h: 4.6, fill: '#c8ccd3', finish: 'foil', foil: '#c8ccd3' }]; for (const s of [-1, 1]) for (let i = 0; i < 3; i++) o.push({ type: 'rect', name: 'Feather', x: x + s * (5 + i * 1.4), y: y - 1 + i * 1.4, w: 8 - i * 1.8, h: 1.2, radius: .6, rot: s * 10, fill: '#c8ccd3', finish: 'foil', foil: '#c8ccd3' }); return o; });
  add(RIB, 'Service bars', C => [['#8a1c2a', '#f3efe4'], ['#1f4f9e', '#d6b25e'], ['#2f6b3a', '#111111']].map(([a, b], i) => ({ type: 'pattern', name: 'Bar ' + (i + 1), x: C.w * .8 - 7 + i * 7, y: C.h * .2, w: 6.6, h: 2.6, kind: 'stripes', color: a, color2: b, density: 5 })));
  add(RIB, 'Monogram roundel', C => [{ type: 'ellipse', name: 'Roundel', x: C.w * .82, y: C.h * .3, w: 14, h: 14, fillOn: false, stroke: '#b8892b', strokeW: .5, finish: 'foil', foil: '#d6b25e' }, T('AF', C.w * .82, C.h * .3, 10, 6, { color: '#b8892b', font: 'Cinzel', finish: 'foil', foil: '#d6b25e' })]);

  const order = ['Security', 'Holograms', 'Seals & stamps', 'Office stamps', 'Travel stamps', 'Postal & date', 'Genre stamps', 'Stickers & labels', 'Ribbons & insignia', 'Identity', 'Decoration', 'Text styles', ...LAYOUT_CATS];
  COMPONENTS.sort((a, b) => order.indexOf(a.cat) - order.indexOf(b.cat));
})();
