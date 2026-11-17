/* ---------- QR code (model 2, byte mode, versions 1–10) ---------- */
const QR_ECC = { L: [7, 10, 15, 20, 26, 18, 20, 24, 30, 18], M: [10, 16, 26, 18, 24, 16, 18, 22, 22, 26], Q: [13, 22, 18, 26, 18, 24, 18, 22, 20, 24], H: [17, 28, 22, 16, 22, 28, 26, 26, 24, 28] };
const QR_BLK = { L: [1, 1, 1, 1, 1, 2, 2, 2, 2, 4], M: [1, 1, 1, 2, 2, 4, 4, 4, 5, 5], Q: [1, 1, 2, 2, 4, 4, 6, 6, 8, 8], H: [1, 1, 2, 4, 4, 4, 5, 6, 8, 8] };
const QR_FMT = { L: 1, M: 0, Q: 3, H: 2 };
function qrEncode(text, ecl) {
  ecl = QR_ECC[ecl] ? ecl : 'M';
  const bytes = Array.from(new TextEncoder().encode(String(text)));
  const rawMods = (v) => { let r = (16 * v + 128) * v + 64; if (v >= 2) { const na = Math.floor(v / 7) + 2; r -= (25 * na - 10) * na - 55; if (v >= 7) r -= 36; } return r; };
  const dataCw = (v) => Math.floor(rawMods(v) / 8) - QR_ECC[ecl][v - 1] * QR_BLK[ecl][v - 1];
  let ver = 0;
  for (let v = 1; v <= 10; v++) { const cc = v < 10 ? 8 : 16; if (4 + cc + bytes.length * 8 <= dataCw(v) * 8) { ver = v; break; } }
  if (!ver) return null;
  const bits = []; const put = (val, n) => { for (let i = n - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
  put(4, 4); put(bytes.length, ver < 10 ? 8 : 16); for (const b of bytes) put(b, 8);
  const cap = dataCw(ver) * 8; put(0, Math.min(4, cap - bits.length)); while (bits.length % 8) bits.push(0);
  const data = []; for (let i = 0; i < bits.length; i += 8) { let b = 0; for (let j = 0; j < 8; j++) b = b << 1 | bits[i + j]; data.push(b); }
  for (let p = 0xEC; data.length < dataCw(ver); p ^= 0xEC ^ 0x11) data.push(p);
  const mul = (x, y) => { let z = 0; for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x; } return z; };
  const nb = QR_BLK[ecl][ver - 1], el = QR_ECC[ecl][ver - 1], raw = Math.floor(rawMods(ver) / 8);
  const div = []; for (let i = 0; i < el - 1; i++) div.push(0); div.push(1);
  let root = 1; for (let i = 0; i < el; i++) { for (let j = 0; j < div.length; j++) { div[j] = mul(div[j], root); if (j + 1 < div.length) div[j] ^= div[j + 1]; } root = mul(root, 2); }
  const rem = (d) => { const r = div.map(() => 0); for (const b of d) { const f = b ^ r.shift(); r.push(0); div.forEach((c, i) => { r[i] ^= mul(c, f); }); } return r; };
  const nShort = nb - raw % nb, shortLen = Math.floor(raw / nb), blocks = [];
  for (let i = 0, k = 0; i < nb; i++) { const d = data.slice(k, k + shortLen - el + (i < nShort ? 0 : 1)); k += d.length; const e = rem(d); if (i < nShort) d.push(0); blocks.push(d.concat(e)); }
  const cw = []; for (let i = 0; i < blocks[0].length; i++) for (let j = 0; j < blocks.length; j++) if (i !== shortLen - el || j >= nShort) cw.push(blocks[j][i]);
  const n = ver * 4 + 17, M = [], F = []; for (let i = 0; i < n; i++) { M.push(new Array(n).fill(false)); F.push(new Array(n).fill(false)); }
  const setF = (x, y, d) => { M[y][x] = d; F[y][x] = true; };
  for (let i = 0; i < n; i++) { setF(6, i, i % 2 === 0); setF(i, 6, i % 2 === 0); }
  const finder = (cx, cy) => { for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) { const x = cx + dx, y = cy + dy; if (x >= 0 && x < n && y >= 0 && y < n) { const d = Math.max(Math.abs(dx), Math.abs(dy)); setF(x, y, d !== 2 && d !== 4); } } };
  finder(3, 3); finder(n - 4, 3); finder(3, n - 4);
  const al = []; if (ver > 1) { const na = Math.floor(ver / 7) + 2, step = Math.ceil((ver * 4 + 4) / (na * 2 - 2)) * 2; al.push(6); for (let p = n - 7; al.length < na; p -= step) al.splice(1, 0, p); }
  for (let i = 0; i < al.length; i++) for (let j = 0; j < al.length; j++) { if ((i === 0 && j === 0) || (i === 0 && j === al.length - 1) || (i === al.length - 1 && j === 0)) continue; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) setF(al[i] + dx, al[j] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1); }
  const drawFmt = (mask) => {
    const d = QR_FMT[ecl] << 3 | mask; let r = d; for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537); const b = (d << 10 | r) ^ 0x5412, g = (i) => ((b >>> i) & 1) === 1;
    for (let i = 0; i <= 5; i++) setF(8, i, g(i)); setF(8, 7, g(6)); setF(8, 8, g(7)); setF(7, 8, g(8)); for (let i = 9; i < 15; i++) setF(14 - i, 8, g(i));
    for (let i = 0; i < 8; i++) setF(n - 1 - i, 8, g(i)); for (let i = 8; i < 15; i++) setF(8, n - 15 + i, g(i)); setF(8, n - 8, true);
  };
  drawFmt(0);
  if (ver >= 7) { let r = ver; for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1F25); const b = ver << 12 | r; for (let i = 0; i < 18; i++) { const bit = ((b >>> i) & 1) === 1, a = n - 11 + i % 3, c = Math.floor(i / 3); setF(a, c, bit); setF(c, a, bit); } }
  let bi = 0; const total = cw.length * 8;
  for (let right = n - 1; right >= 1; right -= 2) { if (right === 6) right = 5; for (let vert = 0; vert < n; vert++) for (let j = 0; j < 2; j++) { const x = right - j, up = ((right + 1) & 2) === 0, y = up ? n - 1 - vert : vert; if (!F[y][x] && bi < total) { M[y][x] = ((cw[bi >>> 3] >>> (7 - (bi & 7))) & 1) === 1; bi++; } } }
  const maskFn = [(x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0, (x) => x % 3 === 0, (x, y) => (x + y) % 3 === 0, (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, (x, y) => x * y % 2 + x * y % 3 === 0, (x, y) => (x * y % 2 + x * y % 3) % 2 === 0, (x, y) => ((x + y) % 2 + x * y % 3) % 2 === 0];
  const applyMask = (m) => { for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!F[y][x] && maskFn[m](x, y)) M[y][x] = !M[y][x]; };
  const penalty = () => {
    let p = 0;
    for (let pass = 0; pass < 2; pass++) for (let a = 0; a < n; a++) { let run = 1; for (let b = 1; b < n; b++) { const v = pass ? M[b][a] : M[a][b], u = pass ? M[b - 1][a] : M[a][b - 1]; if (v === u) { run++; if (run === 5) p += 3; else if (run > 5) p++; } else run = 1; } }
    for (let y = 0; y < n - 1; y++) for (let x = 0; x < n - 1; x++) { const c = M[y][x]; if (c === M[y][x + 1] && c === M[y + 1][x] && c === M[y + 1][x + 1]) p += 3; }
    const pat = [true, false, true, true, true, false, true];
    for (let pass = 0; pass < 2; pass++) for (let a = 0; a < n; a++) for (let b = 0; b + 6 < n; b++) { let ok = true; for (let k = 0; k < 7 && ok; k++) if ((pass ? M[b + k][a] : M[a][b + k]) !== pat[k]) ok = false; if (ok) p += 40; }
    let dark = 0; for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (M[y][x]) dark++; p += Math.floor(Math.abs(dark * 20 - n * n * 10) / (n * n)) * 10;
    return p;
  };
  let best = 0, bestP = Infinity;
  for (let m = 0; m < 8; m++) { applyMask(m); drawFmt(m); const p = penalty(); if (p < bestP) { bestP = p; best = m; } applyMask(m); }
  applyMask(best); drawFmt(best);
  return { size: n, version: ver, modules: M };
}
