/* ================= optional render profiler (off unless Forge.PROF.on = true) ================= */
const PROF = { on: false, t: {}, n: {} };
Forge.PROF = PROF;
(() => {
  const flushC = c => { try { c.getImageData(0, 0, 1, 1); } catch (e) { } };
  const wrap = (name, get, set, keyOf) => { const f0 = get(); set(function (...a) { if (!PROF.on) return f0.apply(this, a); flushC(a[0]); const t0 = performance.now(); const r = f0.apply(this, a); flushC(a[0]); const key = keyOf(a); PROF.t[key] = (PROF.t[key] || 0) + performance.now() - t0; PROF.n[key] = (PROF.n[key] || 0) + 1; return r; }); };
  wrap('drawEl', () => drawEl, f => { drawEl = f; }, a => ((a[3] && a[3].ch) || '?') + ' · ' + a[1].type);
  wrap('subTex', () => subTex, f => { subTex = f; }, a => a[1] + ' · substrate');
  wrap('age', () => age, f => { age = f; }, a => a[1] + ' · wear');
})();
