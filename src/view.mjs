import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';

const F = window.Forge;
function start() {
  const host = document.getElementById('gl');
  const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(host.clientWidth || 800, host.clientHeight || 600, false);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.toneMapping = THREE.AgXToneMapping; renderer.toneMappingExposure = 1;
  host.appendChild(renderer.domElement);
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 2, 9000);
  camera.position.set(-50, 175, 150);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = .075; controls.minDistance = 18; controls.maxDistance = 1300; controls.maxPolarAngle = Math.PI * .495; controls.rotateSpeed = .75;
  controls.target.set(0, 16, 0); controls.update();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const lerp = (a, b, t) => a + (b - a) * t, ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, damp = (dt, k) => 1 - Math.exp(-dt * k);

  /* ---------- environments ---------- */
  const ENVS = {
    softbox: { wall: 0x2a2b2e, bg: '#18191c', key: [0xffffff, 2.6], p: [[0, 4.6, 0, 3.6, 3.6, 0xffffff, 6], [-4.8, 1.5, 1, 1.2, 6, 0xfff4e6, 4], [4.8, 1.2, -1, 1.2, 6, 0xe6f0ff, 3], [0, 1, -4.8, 6, 1.2, 0xffffff, 1.5]] },
    golden: { wall: 0x3a2a20, bg: '#24180f', key: [0xffc58a, 3.2], p: [[-4.8, .6, 2, 6, 2.4, 0xff9a4a, 7], [0, 4.8, 0, 8, 8, 0x6a8dff, .9], [4.8, 1, 0, 2, 3, 0xffd9a8, 1.5]] },
    neon: { wall: 0x07070b, bg: '#0b0a10', key: [0xd9e2ff, 1.5], p: [[-4.8, 1, 0, .5, 7, 0xff2fa8, 9], [4.8, 1, 0, .5, 7, 0x2ff3ff, 9], [0, 4.8, 0, 3, .6, 0xffffff, 3], [0, .5, -4.8, 6, .4, 0x8a5cff, 6]] },
    gallery: { wall: 0x6d6a66, bg: '#33312f', key: [0xfff1dc, 2.8], p: [[-2, 4.8, 1, 1.2, 1.2, 0xfff0d8, 14], [2, 4.8, -1, 1.2, 1.2, 0xfff0d8, 12], [0, 1, 4.8, 6, 3, 0xffffff, 1]] },
    lab: { wall: 0xc9d0d6, bg: '#c7ced4', key: [0xf3f8ff, 2.3], p: [[0, 4.8, 0, 8, 3, 0xf6fbff, 5], [-4.8, 2, 0, 2, 6, 0xffffff, 2], [4.8, 2, 0, 2, 6, 0xffffff, 2]] },
    candle: { wall: 0x120c08, bg: '#100b08', key: [0xffb066, 2.4], p: [[-3.5, .8, 3, .6, 1, 0xff9a3c, 16], [3, .4, -3, .4, .6, 0xff8a2a, 10], [0, 4.8, 0, 4, 4, 0x2a3550, .5]] },
    white: { wall: 0xe9e9e6, bg: '#e4e3df', key: [0xffffff, 2.2], p: [[0, 4.8, 0, 8, 8, 0xffffff, 4], [-4.8, 1.5, 0, 1, 8, 0xffffff, 3], [4.8, 1.5, 0, 1, 8, 0xffffff, 3], [0, 1.5, 4.8, 8, 3, 0xffffff, 2]] },
    sunset: { wall: 0x2a1a24, bg: '#2a1720', key: [0xff9a5c, 3.2], p: [[-4.8, .4, 1, 7, 1.8, 0xff6a3a, 7], [-4.8, 1.6, 1, 7, 1.2, 0xff3d8b, 4], [0, 4.8, 0, 8, 8, 0x5a3d9a, 1.1], [4.8, 1, 0, 2, 4, 0xffc48a, 1.2]] },
    interrogation: { wall: 0x060606, bg: '#070707', key: [0xfff0d6, 3.6], p: [[0, 4.8, 0, 1.4, 1.4, 0xfff0d6, 22], [0, -2, 4.8, 3, .4, 0x302820, 1]] },
    aqua: { wall: 0x03141c, bg: '#04161e', key: [0x7fe6ff, 1.8], p: [[0, 4.8, 0, 6, 6, 0x2fd0ff, 3.5], [-4.8, 1, 0, 1, 6, 0x0f7fa0, 3], [4.8, 1, 0, 1, 6, 0x1fb0a0, 3], [0, .5, -4.8, 6, .5, 0x7fffd4, 4]] },
    prism: { wall: 0x101014, bg: '#0e0e13', key: [0xffffff, 2], p: [[-4.8, 1.5, -2, 1, 5, 0xff3b3b, 6], [-4.8, 1.5, 2, 1, 5, 0xffd23b, 6], [4.8, 1.5, -2, 1, 5, 0x3bff8a, 5], [4.8, 1.5, 2, 1, 5, 0x3b7bff, 6], [0, 4.8, 0, 4, 4, 0xffffff, 3], [0, 1.5, -4.8, 5, 1, 0xc03bff, 5]] }
  };
  const envCache = {};
  function envTex(name) {
    if (envCache[name]) return envCache[name];
    const E = ENVS[name] || ENVS.softbox, s = new THREE.Scene();
    s.add(new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), new THREE.MeshBasicMaterial({ color: E.wall, side: THREE.BackSide })));
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(E.wall).multiplyScalar(.5) })); fl.rotation.x = -Math.PI / 2; fl.position.y = -4.9; s.add(fl);
    for (const [x, y, z, w, h, c, i] of E.p) { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(i * .45), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); s.add(m); }
    const t = pmrem.fromScene(s, .035).texture; s.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
    return envCache[name] = t;
  }

  /* ---------- lights ---------- */
  const key = new THREE.DirectionalLight(0xffffff, 2.5); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 9; key.shadow.blurSamples = 18; key.shadow.bias = -.0003; key.shadow.camera.near = 40; key.shadow.camera.far = 1000;
  scene.add(key, key.target);
  const uvFlood = new THREE.SpotLight(0x6c2bff, 0, 0, .75, .85, 0); uvFlood.position.set(0, 170, 70); scene.add(uvFlood, uvFlood.target);
  const torch = new THREE.SpotLight(0x8040ff, 0, 0, .3, .75, 0); scene.add(torch, torch.target);
  const torchU = { uTorchPos: { value: new THREE.Vector3(0, -1e4, 0) }, uTorchR: { value: 15 }, uTorchOn: { value: 0 } };

  /* ---------- materials ---------- */
  function patch(m) {
    m.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, torchU);
      sh.vertexShader = 'varying vec3 vTW;\n' + sh.vertexShader.replace('#include <project_vertex>', '#include <project_vertex>\n  vTW = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      sh.fragmentShader = 'uniform vec3 uTorchPos;\nuniform float uTorchR;\nuniform float uTorchOn;\nvarying vec3 vTW;\n' + sh.fragmentShader.replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n  totalEmissiveRadiance *= mix(1.0, (1.0 - smoothstep(uTorchR * 0.2, uTorchR, distance(vTW, uTorchPos))), uTorchOn);');
    };
    m.customProgramCacheKey = () => 'forge-torch-1';
    return m;
  }
  const faceMat = () => patch(new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 1, metalness: 0, side: THREE.DoubleSide, emissive: 0xffffff, emissiveIntensity: 0 }));
  const matF = faceMat(), matB = faceMat();
  const matE = new THREE.MeshPhysicalMaterial({ color: 0xeeeeee, roughness: .4 });
  const HOLO_VS = `varying vec2 vUv; varying vec3 vN; varying vec3 vW; varying vec3 vT; varying vec3 vB;
void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; mat3 m = mat3(modelMatrix); vN = normalize(m * normal); vT = normalize(m * vec3(1.0, 0.0, 0.0)); vB = normalize(m * vec3(0.0, 1.0, 0.0)); gl_Position = projectionMatrix * viewMatrix * w; }`;
  const HOLO_FS = `uniform sampler2D uMask; uniform float uTime; uniform float uInt; uniform float uLam; uniform float uLamType; uniform float uLevel; uniform float uAspect; uniform vec3 uLightDir;
varying vec2 vUv; varying vec3 vN; varying vec3 vW; varying vec3 vT; varying vec3 vB;
vec3 spec(float t){ t = fract(t); vec3 c = 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67))); return pow(c, vec3(1.35)); }
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float lam(vec2 p){
  vec2 c = vec2(0.5 * uAspect, 0.5);
  if (uLamType < 1.5) { vec2 g = p * 9.0; vec2 id = floor(g); vec2 f = fract(g) - 0.5; float r = h21(id); if (r < 0.5) return 0.0; f -= (vec2(h21(id + 3.1), h21(id + 7.7)) - 0.5) * 0.45; float a = atan(f.y, f.x); float d = length(f); float st = 0.15 + 0.07 * cos(a * 5.0); return 1.0 - smoothstep(st - 0.04, st, d); }
  if (uLamType < 2.5) return 1.0 - smoothstep(0.0, 0.32, abs(sin(p.y * 46.0 + sin(p.x * 9.0) * 2.2)));
  if (uLamType < 3.5) return 1.0 - smoothstep(0.0, 0.3, abs(sin(length(p - c) * 95.0)));
  if (uLamType < 4.5) { vec2 q = p * vec2(16.0, 18.475); q.x += mod(floor(q.y), 2.0) * 0.5; vec2 f = abs(fract(q) - 0.5); return 1.0 - smoothstep(0.0, 0.06, abs(max(f.x * 0.866 + f.y * 0.5, f.y) - 0.42)); }
  if (uLamType < 5.5) { vec2 d = p - c; return smoothstep(0.45, 0.9, sin(atan(d.y, d.x) * 40.0)); }
  if (uLamType < 6.5) { vec2 d = p - c; float r = length(d), a = atan(d.y, d.x); float v = sin(r * 70.0 + sin(a * 12.0) * 2.5) * sin(r * 41.0 - sin(a * 7.0) * 3.0); return smoothstep(0.72, 1.0, abs(v)); }
  vec2 q = p * 20.0; vec2 f = abs(fract(q) - 0.5); return 1.0 - smoothstep(0.0, 0.07, abs(f.x + f.y - 0.36));
}
void main(){
  vec3 m = texture2D(uMask, vUv).rgb;
  if (m.b < 0.5) discard;
  vec2 p = vec2(vUv.x * uAspect, vUv.y);
  float lv = uLamType > 0.5 ? lam(p) * uLam : 0.0;
  float e = m.r; float amt = max(e, lv);
  if (amt < 0.004) discard;
  vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vW); vec3 L = normalize(uLightDir); vec3 H = normalize(L + V);
  vec2 vt = vec2(dot(V, vT), dot(V, vB));
  float ph; float spark = 0.0; float pid = floor(m.g * 7.0 + 0.5);
  if (e >= lv) {
    vec2 c = vec2(0.5 * uAspect, 0.5);
    if (pid < 0.5) ph = vt.x * 1.7 + vt.y * 0.6 + p.x * 0.9;
    else if (pid < 1.5) { vec2 d = p - c; ph = length(d) * 15.0 + dot(normalize(d + 1e-4), vt) * 1.3; }
    else if (pid < 2.5) { vec2 cc = floor(p * 170.0); float r = h21(cc); ph = r + vt.x * 2.0; spark = step(0.982, fract(r * 7.0 + dot(vt, vec2(3.0, 2.0)) * 1.6)); }
    else if (pid < 3.5) { vec2 cc = floor(p * 60.0); float an = h21(cc) * 6.2832; ph = dot(vt, vec2(cos(an), sin(an))) * 2.6 + h21(cc + 1.7) * 0.3; }
    else if (pid < 4.5) ph = vt.x * 2.1 + sin(p.y * 260.0) * 0.08 + p.y * 2.0;
    else if (pid < 5.5) { vec2 d = p - c; ph = atan(d.y, d.x) * 0.48 + vt.y * 1.4; }
    else if (pid < 6.5) { vec2 d = p - c; float a = atan(d.y, d.x); ph = fract(a * 8.0 / 6.2832) * 0.6 + vt.x * 1.4 + vt.y; }
    else { float n = sin(p.x * 18.0 + sin(p.y * 22.0 + uTime * 0.25) * 1.5) + sin(p.y * 15.0 - p.x * 6.0); ph = n * 0.35 + vt.x * 1.8; }
  } else ph = vt.x * 1.5 + vt.y * 0.8 + p.x * 0.6 + p.y * 0.3;
  vec3 col = spec(ph);
  float nh = max(dot(N, H), 0.0);
  float glint = pow(nh, 24.0) * 1.25 + pow(nh, 4.0) * 0.35;
  float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  vec3 c = col * (0.13 + glint + fres * 0.38) * amt * uInt + vec3(spark) * amt * 1.0 * uInt;
  gl_FragColor = vec4(c * uLevel, 1.0);
}`;
  const holoMat = () => new THREE.ShaderMaterial({ uniforms: { uMask: { value: null }, uTime: { value: 0 }, uInt: { value: 1 }, uLam: { value: 0 }, uLamType: { value: 0 }, uLevel: { value: 1 }, uAspect: { value: 1.585 }, uLightDir: { value: new THREE.Vector3(0, 1, 0) } }, vertexShader: HOLO_VS, fragmentShader: HOLO_FS, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.FrontSide, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -4 });
  const holoMatF = holoMat(), holoMatB = holoMat();
  const LAM = { none: 0, stars: 1, waves: 2, rings: 3, hex: 4, sunburst: 5, guilloche: 6, diamond: 7 };

  /* ---------- card rig ---------- */
  const pose = new THREE.Group(), orient = new THREE.Group(), tiltG = new THREE.Group(), flipG = new THREE.Group(), cardG = new THREE.Group();
  scene.add(pose); pose.add(orient); orient.add(tiltG); tiltG.add(flipG); flipG.add(cardG); orient.rotation.x = -Math.PI / 2;
  let W = 85.6, H = 53.98, TH = .76, flexMode = false, geoSig = '', body = null, flexF = null, flexB = null, holoF = null, holoB = null, flexMinZ = 0, exp = null;
  function cardShape(C, inset) {
    const w = C.w, h = C.h, r = Math.max(.01, Math.min(C.r, w / 2, h / 2) - inset), x0 = -w / 2 + inset, y0 = -h / 2 + inset, x1 = w / 2 - inset, y1 = h / 2 - inset, s = new THREE.Shape();
    const pts = C.shape && C.shape !== 'rect' ? F.cardOutline(C.shape, w, h) : null;
    if (pts) { const kx = Math.max(.1, 1 - 2 * inset / w), ky = Math.max(.1, 1 - 2 * inset / h); pts.forEach(([px, py], i) => { const X = (px - w / 2) * kx, Y = (h / 2 - py) * ky; i ? s.lineTo(X, Y) : s.moveTo(X, Y); }); s.closePath(); }
    else { s.moveTo(x0 + r, y0); s.lineTo(x1 - r, y0); s.absarc(x1 - r, y0 + r, r, -Math.PI / 2, 0, false); s.lineTo(x1, y1 - r); s.absarc(x1 - r, y1 - r, r, 0, Math.PI / 2, false);
    s.lineTo(x0 + r, y1); s.absarc(x0 + r, y1 - r, r, Math.PI / 2, Math.PI, false); s.lineTo(x0, y0 + r); s.absarc(x0 + r, y0 + r, r, Math.PI, Math.PI * 1.5, false); }
    const SL = F.SLOT;
    if (C.slot === 'slot2' || C.slot === 'corners') for (const sx of [-1, 1]) { const p = new THREE.Path(); p.absarc(sx * (w / 2 - SL.corner.dx), h / 2 - SL.corner.cy, SL.corner.r + inset, 0, Math.PI * 2, true); s.holes.push(p); }
    if (C.slot === 'slot' || C.slot === 'slot2') { const sw = SL.slot.w + inset * 2, sh = SL.slot.h + inset * 2, cy = h / 2 - SL.slot.cy, rr = sh / 2, p = new THREE.Path(); p.moveTo(-sw / 2 + rr, cy - sh / 2); p.lineTo(sw / 2 - rr, cy - sh / 2); p.absarc(sw / 2 - rr, cy, rr, -Math.PI / 2, Math.PI / 2, false); p.lineTo(-sw / 2 + rr, cy + sh / 2); p.absarc(-sw / 2 + rr, cy, rr, Math.PI / 2, Math.PI * 1.5, false); s.holes.push(p); }
    else if (C.slot === 'hole') { const p = new THREE.Path(); p.absarc(0, h / 2 - SL.hole.cy, SL.hole.r + inset, 0, Math.PI * 2, true); s.holes.push(p); }
    return s;
  }
  function rigidGeo(C) {
    const bev = Math.min(.18, C.thick * .28), depth = Math.max(.01, C.thick - 2 * bev);
    const g = new THREE.ExtrudeGeometry(cardShape(C, bev), { depth, bevelEnabled: true, bevelThickness: bev, bevelSize: bev, bevelOffset: 0, bevelSegments: 3, curveSegments: 28 });
    g.translate(0, 0, -depth / 2);
    const pos = g.attributes.position, nor = g.attributes.normal, uv = g.attributes.uv;
    for (let i = 0; i < pos.count; i++) { const nz = nor.getZ(i), u = (pos.getX(i) + C.w / 2) / C.w, v = (pos.getY(i) + C.h / 2) / C.h; if (nz > .99) uv.setXY(i, u, v); else if (nz < -.99) uv.setXY(i, 1 - u, v); }
    uv.needsUpdate = true;
    const old = g.groups.slice(); g.clearGroups();
    for (const gr of old) {
      if (gr.materialIndex !== 0) { g.addGroup(gr.start, gr.count, 2); continue; }
      let rs = gr.start, rm = null;
      for (let t = gr.start; t < gr.start + gr.count; t += 3) { const m = nor.getZ(t) > 0 ? 0 : 1; if (rm === null) rm = m; else if (m !== rm) { g.addGroup(rs, t - rs, rm); rs = t; rm = m; } }
      g.addGroup(rs, gr.start + gr.count - rs, rm ?? 0);
    }
    return g;
  }
  function shapeGeo(C) { const g = new THREE.ShapeGeometry(cardShape(C, 0), 28), p = g.attributes.position, uv = g.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + C.w / 2) / C.w, (p.getY(i) + C.h / 2) / C.h); uv.needsUpdate = true; return g; }
  function dispZ(C, x, y) {
    const u = x / C.w, v = y / C.h; let z = 0;
    z += C.curl * 7 * (u * u - .083); z += C.foldV * 2.4 * (Math.abs(u) * 2 - .5); z += C.foldH * 1.8 * (Math.abs(v) * 2 - .5);
    if (C.crumple > 0) z += C.crumple * (2.2 * (F.fbm(x / 16 + 5, y / 16 + 2, 3) - .5) + 1.2 * Math.abs(F.fbm(x / 6.5, y / 6.5 + 9, 2) - .5) - .3);
    return z;
  }
  function flexGeo(C, dir, off) {
    const sx = Math.max(24, Math.round(C.w * 1.4)), sy = Math.max(16, Math.round(C.h * 1.4)), g = new THREE.PlaneGeometry(C.w, C.h, sx, sy);
    if (dir < 0) g.rotateY(Math.PI);
    const p = g.attributes.position; for (let i = 0; i < p.count; i++) p.setZ(i, dispZ(C, p.getX(i), p.getY(i)) + dir * (C.thick / 2 + off));
    g.computeVertexNormals(); return g;
  }
  const drop = (m) => { if (!m) return; if (m.parent) m.parent.remove(m); m.geometry.dispose(); };
  function rebuild(C, S) {
    [body, flexF, flexB, holoF, holoB].forEach(drop); body = flexF = flexB = holoF = holoB = null;
    W = C.w; H = C.h; TH = C.thick; flexMode = !!S.flex;
    if (!flexMode) {
      body = new THREE.Mesh(rigidGeo(C), [matF, matB, matE]); body.castShadow = true; cardG.add(body);
      const sg = shapeGeo(C); holoF = new THREE.Mesh(sg, holoMatF); holoF.position.z = TH / 2 + .004; holoB = new THREE.Mesh(sg.clone(), holoMatB); holoB.rotation.y = Math.PI; holoB.position.z = -TH / 2 - .004;
    } else {
      flexF = new THREE.Mesh(flexGeo(C, 1, 0), matF); flexB = new THREE.Mesh(flexGeo(C, -1, 0), matB);
      for (const m of [flexF, flexB]) { m.castShadow = true; cardG.add(m); }
      holoF = new THREE.Mesh(flexGeo(C, 1, .02), holoMatF); holoB = new THREE.Mesh(flexGeo(C, -1, .02), holoMatB);
      let mn = 0; const p = flexB.geometry.attributes.position; for (let i = 0; i < p.count; i++) mn = Math.min(mn, p.getZ(i)); flexMinZ = mn;
    }
    holoF.renderOrder = holoB.renderOrder = 2; holoF.visible = !!holoMatF.uniforms.uMask.value; holoB.visible = !!holoMatB.uniforms.uMask.value; cardG.add(holoF, holoB);
    for (const m of [matF, matB]) { m.side = flexMode ? THREE.FrontSide : THREE.DoubleSide; m.alphaTest = flexMode ? .5 : 0; m.needsUpdate = true; }
    buildExplode(C);
    const sz = Math.max(W, H) * .8 + 14; const sc = key.shadow.camera; sc.left = -sz; sc.right = sz; sc.top = sz; sc.bottom = -sz; sc.updateProjectionMatrix();
  }
  function buildExplode(C) {
    if (exp) exp.forEach(drop);
    const sg = shapeGeo(C), d = Math.max(.05, C.thick * .6), cg = new THREE.ExtrudeGeometry(cardShape(C, 0), { depth: d, bevelEnabled: false, curveSegments: 24 }); cg.translate(0, 0, -d / 2);
    const f = new THREE.Mesh(sg, matF), core = new THREE.Mesh(cg, matE), b = new THREE.Mesh(sg.clone(), matB), h = new THREE.Mesh(sg.clone(), holoMatF);
    b.rotation.y = Math.PI; h.renderOrder = 3; exp = [h, f, core, b]; exp.forEach(m => { m.visible = false; m.castShadow = m !== h; cardG.add(m); });
  }
  function setCard() {
    const C = F.P.card, S = F.sub();
    const sig = [C.w, C.h, C.r, C.thick, C.slot, !!S.flex, S.flex ? [C.curl, C.crumple, C.foldV, C.foldH].join(',') : ''].join('|');
    if (sig !== geoSig) { geoSig = sig; rebuild(C, S); }
    const clear = S.clear > 0, atten = new THREE.Color(clear && C.tintOn && S.tintable ? C.tint : (S.atten || '#ffffff'));
    for (const m of [matF, matB]) {
      const refl = F.P.scene.refl ?? .55;
      m.clearcoat = (C.lam === 'gloss' ? 1 : C.lam === 'matte' ? .7 : (S.cc || 0)) * Math.min(1, refl * 1.1);
      m.clearcoatRoughness = Math.min(1, (C.lam === 'matte' ? .42 : C.lam === 'gloss' ? .06 : (S.ccr ?? .1)) + (1 - Math.min(1, refl)) * .12);
      m.ior = S.ior || 1.5; m.thickness = C.thick; m.attenuationColor.copy(atten); m.attenuationDistance = clear ? (S.attenD || 1e6) : 1e6;
      m.iridescence = S.irid || 0; m.iridescenceIOR = 1.7; m.iridescenceThicknessRange = [220, 640];
      m.dispersion = S.disper || 0; m.bumpScale = C.relief; m.specularIntensity = Math.min(1, .25 + refl * .75);
    }
    matE.color.set(C.edgeOn && !flexMode ? C.edge : (S.edge || (clear ? '#ffffff' : S.color)));
    matE.roughness = Math.max(.05, S.rough * .8); matE.metalness = S.metal; matE.transmission = C.edgeOn ? 0 : (S.edgeClear ?? S.clear ?? 0); matE.thickness = C.thick * 2; matE.ior = S.ior || 1.5;
    matE.attenuationColor.copy(clear ? atten.clone().multiplyScalar(.85) : new THREE.Color('#dfe8e4')); matE.attenuationDistance = clear ? (S.attenD || 1e6) * .45 : 2.5; matE.clearcoat = clear ? 1 : .3; matE.dispersion = S.disper || 0; matE.iridescence = S.irid || 0;
    const fin = flexMode ? 'core' : (C.edgeFin || 'core'); matE.emissive.set(0x000000); matE.emissiveIntensity = 0; glowBase = S.glow ? 1.5 * (C.glowInt ?? 1) : 0; if (S.glow && fin === 'core') { matE.emissive.set(S.glow); matE.emissiveIntensity = 2.2 * (C.glowInt ?? 1); }
    if (fin !== 'core') { matE.transmission = 0; matE.attenuationDistance = 1e6; matE.clearcoat = .5; matE.iridescence = 0; if (fin === 'gold') { matE.color.set('#d9b25a'); matE.metalness = 1; matE.roughness = .22; } else if (fin === 'silver') { matE.color.set('#e4e7eb'); matE.metalness = 1; matE.roughness = .18; } else if (fin === 'black') { matE.color.set('#111214'); matE.metalness = 0; matE.roughness = .35; } else if (fin === 'glow') { matE.color.set('#0a2a30'); matE.metalness = 0; matE.roughness = .3; matE.emissive.set('#3df5ff'); matE.emissiveIntensity = 2.4; } }
    if (F.P.scene.pose === 'lanyard') buildLanyard();
    if (body) body.castShadow = !clear;
    blobMat.color.set(clear ? atten.clone().multiplyScalar(.6) : new THREE.Color(0, 0, 0)); blobBase = clear ? .3 : .55;
    holoMatF.uniforms.uLamType.value = holoMatB.uniforms.uLamType.value = LAM[C.holoLam] || 0;
    holoMatF.uniforms.uLam.value = C.holoLam !== 'none' ? C.holoLamInt : 0; holoMatB.uniforms.uLam.value = C.holoLam !== 'none' && C.holoLamBack ? C.holoLamInt : 0;
    holoMatF.uniforms.uAspect.value = holoMatB.uniforms.uAspect.value = W / H;
  }
  const tc = new WeakMap();
  function tex(canvas, srgb) {
    if (!canvas) return null; let t = tc.get(canvas);
    if (t && (t.userData.w !== canvas.width || t.userData.h !== canvas.height)) { t.dispose(); t = null; }
    if (!t) { t = new THREE.CanvasTexture(canvas); t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace; t.anisotropy = maxAniso; t.userData.w = canvas.width; t.userData.h = canvas.height; tc.set(canvas, t); }
    t.needsUpdate = true; return t;
  }
  const sigOf = (m) => [m.map, m.bumpMap, m.roughnessMap, m.metalnessMap, m.transmissionMap, m.emissiveMap].map(t => t ? 1 : 0).join('');
  function setMaps(r) {
    const S = F.sub(), m = r.side === 'front' ? matF : matB, hm = r.side === 'front' ? holoMatF : holoMatB, s0 = sigOf(m);
    m.map = tex(r.A, true); m.bumpMap = tex(r.H, false); m.roughnessMap = tex(r.R, false); m.metalnessMap = tex(r.M || null, false); m.transmissionMap = tex(r.T || null, false); m.emissiveMap = tex(r.X || null, true);
    m.roughness = 1; m.metalness = r.M ? 1 : S.metal; m.transmission = r.T ? 1 : 0;
    if (sigOf(m) !== s0) m.needsUpdate = true;
    hm.uniforms.uMask.value = r.O ? tex(r.O, false) : null;
    const hmesh = r.side === 'front' ? holoF : holoB; if (hmesh) hmesh.visible = !!r.O;
    if (exp && r.side === 'front') exp[0].userData.on = !!r.O;
  }

  /* ---------- lanyard ---------- */
  const lanyardG = new THREE.Group(); orient.add(lanyardG); lanyardG.visible = false; let lanyardSig = '', strapMat = null, glowBase = 0;
  const cordMat = new THREE.MeshPhysicalMaterial({ color: 0x111114, roughness: .55, sheen: .5 }), clipPlastic = new THREE.MeshPhysicalMaterial({ color: 0x2a2c30, roughness: .35, clearcoat: .6 });
  const metalMat = new THREE.MeshPhysicalMaterial({ color: 0xdfe3e8, metalness: 1, roughness: .22, clearcoat: .4 });
  function strapTexture(col, text) {
    const c = document.createElement('canvas'); c.width = 128; c.height = 1024; const x = c.getContext('2d'), hsl = {}; new THREE.Color(col).getHSL(hsl);
    x.fillStyle = col; x.fillRect(0, 0, 128, 1024); x.fillStyle = 'rgba(255,255,255,.05)'; for (let i = 0; i < 1024; i += 3) x.fillRect(0, i, 128, 1); x.fillStyle = 'rgba(0,0,0,.06)'; for (let i = 0; i < 128; i += 3) x.fillRect(i, 0, 1, 1024);
    x.fillStyle = 'rgba(0,0,0,.28)'; x.fillRect(0, 0, 7, 1024); x.fillRect(121, 0, 7, 1024); x.fillStyle = 'rgba(255,255,255,.25)'; for (let i = 0; i < 1024; i += 10) { x.fillRect(10, i, 1.5, 6); x.fillRect(116.5, i, 1.5, 6); }
    x.save(); x.translate(64, 0); x.rotate(Math.PI / 2); x.fillStyle = hsl.l > .6 ? 'rgba(20,20,24,.85)' : 'rgba(255,255,255,.9)'; x.font = '700 44px "Inter Tight", "Inter", sans-serif'; x.textBaseline = 'middle'; const t = String(text || ' '), tw = Math.max(40, x.measureText(t).width); for (let p = 8; p < 1024; p += tw + 24) x.fillText(t, p, 2); x.restore();
    const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; tx.wrapT = THREE.RepeatWrapping; tx.anisotropy = maxAniso; return tx;
  }
  function buildLanyard() {
    const C = F.P.card, s = F.P.scene, sig = [C.w, C.h, C.slot, C.shape, s.lanyardColor, s.lanyardText, s.lanyardStyle].join('|'); if (sig === lanyardSig) return; lanyardSig = sig;
    while (lanyardG.children.length) { const o = lanyardG.children.pop(); if (o.geometry) o.geometry.dispose(); }
    if (strapMat) { if (strapMat.map) strapMat.map.dispose(); strapMat.dispose(); }
    const SL = F.SLOT, topY = C.slot === 'slot' || C.slot === 'slot2' ? C.h / 2 - SL.slot.cy : C.slot === 'hole' ? C.h / 2 - SL.hole.cy : C.h / 2 + 2.5, style = s.lanyardStyle || 'strap';
    if (style !== 'strap') {   // thin cord: through a clip at the slot, or looped through the two corner holes
      cordMat.color.set(s.lanyardColor || '#111114');
      const tube = (pts, r = .75) => { const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p))), 90, r, 10, false), cordMat); lanyardG.add(m); };
      if (style === 'holes') {
        const hy = C.h / 2 - SL.corner.cy, hx = C.w / 2 - SL.corner.dx;
        for (const sx of [-1, 1]) { const x = sx * hx; tube([[x - sx * 1.2, hy - .2, 1.2], [x, hy - SL.corner.r - .4, 0], [x + sx * .8, hy, -1.4], [x + sx * 2, hy + 8, -2.4], [x * .7, hy + 60, -7], [sx * 5, hy + 200, -10], [sx * 2.5, hy + 330, -6]]); }
      } else {
        const tab = new THREE.Mesh(new THREE.BoxGeometry(5, 9, .5), clipPlastic); tab.position.set(0, topY + 2.4, 0);
        const body = new THREE.Mesh(new THREE.BoxGeometry(7.5, 11, 2.2), metalMat); body.position.set(0, topY + 11.5, 0);
        const jaw = new THREE.Mesh(new THREE.BoxGeometry(6, 2, 2.8), metalMat); jaw.position.set(0, topY + 6.8, 0);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(2.2, .45, 12, 32), metalMat); ring.position.set(0, topY + 19, 0);
        lanyardG.add(tab, body, jaw, ring);
        for (const sx of [-1, 1]) tube([[0, topY + 20.5, 0], [sx * 1.5, topY + 26, -1], [sx * 5, topY + 70, -6], [sx * 9, topY + 200, -10], [sx * 4, topY + 330, -6]]);
      }
      lanyardG.children.forEach(m => { m.castShadow = true; }); return;
    }
    const tex = strapTexture(s.lanyardColor || '#1f2a44', s.lanyardText), L = 340, wS = 14; tex.repeat.set(1, L / (wS * 8));
    strapMat = new THREE.MeshPhysicalMaterial({ map: tex, roughness: .78, sheen: .7, sheenColor: new THREE.Color(s.lanyardColor || '#1f2a44').offsetHSL(0, 0, .25), side: THREE.DoubleSide });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(4.4, .55, 14, 48), metalMat); ring.position.set(0, topY + 3.4, 0); ring.rotation.y = Math.PI / 2;
    const clasp = new THREE.Mesh(new THREE.CapsuleGeometry(1.6, 7, 8, 18), metalMat); clasp.position.set(0, topY + 12.5, 0);
    const swivel = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 2.6, 24), metalMat); swivel.position.set(0, topY + 18.6, 0);
    const loop = new THREE.Mesh(new THREE.BoxGeometry(wS * .8, 5, .9), strapMat); loop.position.set(0, topY + 22.5, -.3);
    lanyardG.add(ring, clasp, swivel, loop);
    for (const sx of [-1, 1]) {
      const g = new THREE.PlaneGeometry(wS, L, 1, 48), p = g.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i) + L / 2; p.setZ(i, -Math.sin(y / L * Math.PI) * 10 - sx * .4); } g.computeVertexNormals();
      const m = new THREE.Mesh(g, strapMat), th = .1; m.rotation.z = -sx * th; m.position.set(sx * Math.sin(th) * L / 2, topY + 24 + Math.cos(th) * L / 2, -.6); lanyardG.add(m);
    }
    lanyardG.children.forEach(m => { m.castShadow = true; });
  }

  /* ---------- set: backdrop, blob shadow, dust ---------- */
  const bgCol = new THREE.Color('#18191c'), baseBg = new THREE.Color('#18191c'), uvBg = new THREE.Color('#08050f'), fog = new THREE.Fog(0x18191c, 380, 1500);
  scene.background = bgCol; scene.fog = fog;
  let bd = null, voidMode = false, bdKey = '', envKey = '';
  function setBackdrop(kind) {
    if (bd) { scene.remove(bd); bd.geometry.dispose(); for (const k of ['map', 'bumpMap']) if (bd.material[k]) bd.material[k].dispose(); bd.material.dispose(); bd = null; }
    const o = F.backdrop(kind);
    if (!o) { voidMode = true; scene.fog = null; scene.background = scene.environment; scene.backgroundBlurriness = .6; return; }
    voidMode = false; scene.background = bgCol; scene.fog = fog; scene.backgroundBlurriness = 0;
    const rep = 2600 / o.tile, mk = (c, srgb) => { const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep, rep); t.anisotropy = maxAniso; t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace; return t; };
    const m = new THREE.MeshPhysicalMaterial({ map: mk(o.map, true), bumpMap: o.bump ? mk(o.bump, false) : null, bumpScale: o.bumpScale, roughness: o.rough, metalness: o.metal, clearcoat: o.cc || 0, clearcoatRoughness: .03, sheen: o.sheen, sheenColor: new THREE.Color(o.sheenColor), sheenRoughness: .45 });
    bd = new THREE.Mesh(new THREE.PlaneGeometry(2600, 2600), m); bd.rotation.x = -Math.PI / 2; bd.receiveShadow = true; scene.add(bd);
  }
  const blobCanvas = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'); for (let i = 0; i < 44; i++) { x.fillStyle = 'rgba(0,0,0,.045)'; const ins = 18 + i * 1.6; x.beginPath(); x.roundRect ? x.roundRect(ins, ins, 256 - ins * 2, 256 - ins * 2, 40 - i * .6) : x.rect(ins, ins, 256 - ins * 2, 256 - ins * 2); x.fill(); } return c; })();
  const blobTex = new THREE.CanvasTexture(blobCanvas); blobTex.colorSpace = THREE.NoColorSpace;
  const blobMat = new THREE.MeshBasicMaterial({ color: 0x000000, alphaMap: blobTex, transparent: true, depthWrite: false, opacity: .5 }); let blobBase = .5;
  const blob = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), blobMat); blob.rotation.x = -Math.PI / 2; const blobG = new THREE.Group(); blobG.add(blob); scene.add(blobG);
  const dustN = 700, dg = new THREE.BufferGeometry(), dp = new Float32Array(dustN * 3), dsd = new Float32Array(dustN);
  for (let i = 0; i < dustN; i++) { dp[i * 3] = (Math.random() - .5) * 340; dp[i * 3 + 1] = Math.random() * 150; dp[i * 3 + 2] = (Math.random() - .5) * 260; dsd[i] = Math.random(); }
  dg.setAttribute('position', new THREE.BufferAttribute(dp, 3)); dg.setAttribute('aSeed', new THREE.BufferAttribute(dsd, 1));
  const dustMat = new THREE.ShaderMaterial({ uniforms: { uTime: { value: 0 }, uPR: { value: 1 }, uCol: { value: new THREE.Color(1, .93, .82) }, uLevel: { value: 1 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `attribute float aSeed; uniform float uTime; uniform float uPR; varying float vA;
void main(){ vec3 p = position; float t = uTime * (0.12 + aSeed * 0.22); p.x += sin(t + aSeed * 40.0) * 9.0; p.y = mod(p.y - uTime * (0.6 + aSeed * 1.4), 150.0) + 1.0; p.z += cos(t * 0.7 + aSeed * 17.0) * 9.0;
vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = (1.0 + aSeed * 2.4) * uPR * (240.0 / max(1.0, -mv.z)); vA = 0.25 + 0.75 * fract(aSeed * 91.7); }`,
    fragmentShader: `uniform vec3 uCol; uniform float uLevel; varying float vA; void main(){ float a = 1.0 - smoothstep(0.0, 0.5, length(gl_PointCoord - 0.5)); gl_FragColor = vec4(uCol * a * vA * 0.32 * uLevel, 1.0); }` });
  const dust = new THREE.Points(dg, dustMat); dust.frustumCulled = false; scene.add(dust);

  /* ---------- post ---------- */
  const rt = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: 4 });
  const composer = new EffectComposer(renderer, rt);
  composer.addPass(new RenderPass(scene, camera));
  const bokeh = new BokehPass(scene, camera, { focus: 220, aperture: .00004, maxblur: .008 }); bokeh.enabled = false; composer.addPass(bokeh);
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), .25, .4, 1.45); composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const finish = new ShaderPass({ uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uGrain: { value: .2 }, uVig: { value: .35 }, uCA: { value: .25 }, uRes: { value: new THREE.Vector2(1, 1) } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform sampler2D tDiffuse; uniform float uTime; uniform float uGrain; uniform float uVig; uniform float uCA; uniform vec2 uRes; varying vec2 vUv;
float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main(){ vec2 d = vUv - 0.5; float r2 = dot(d, d); vec2 off = d * r2 * uCA * 0.05; vec3 c; c.r = texture2D(tDiffuse, vUv + off).r; c.g = texture2D(tDiffuse, vUv).g; c.b = texture2D(tDiffuse, vUv - off).b;
c *= mix(1.0, 1.0 - smoothstep(0.08, 0.85, r2 * 2.1), uVig); float n = h(floor(vUv * uRes) + fract(uTime) * 91.7); c += (n - 0.5) * uGrain * 0.07; gl_FragColor = vec4(c, 1.0); }` });
  composer.addPass(finish);

  /* ---------- state ---------- */
  let uvOn = false, uvT = 0, torchOn = false, flipTarget = 0, flipCur = 0, spinOn = false, tiltOn = false, tiltK = 0, expOn = false, expT = 0, sweepT = -1, poseY = 30, active = true, time = 0, tween = null, filming = null, keyBase = 2.6;
  const lightDir = new THREE.Vector3(0, 1, 0), center = new THREE.Vector3(), tmp = new THREE.Vector3();
  const labels = ['Holographic laminate', 'Front print', 'Core', 'Back print'].map(t => { const d = document.createElement('div'); d.textContent = t; document.getElementById('labels').appendChild(d); return d; });

  function setScene() {
    const s = F.P.scene, E = ENVS[s.env] || ENVS.softbox;
    if (s.env !== envKey) { envKey = s.env; scene.environment = envTex(s.env); if (voidMode) scene.background = scene.environment; }
    if (s.backdrop !== bdKey) { bdKey = s.backdrop; setBackdrop(s.backdrop); }
    baseBg.set(E.bg); fog.color.copy(baseBg); key.color.set(E.key[0]); keyBase = E.key[1];
    renderer.toneMapping = { agx: THREE.AgXToneMapping, aces: THREE.ACESFilmicToneMapping, neutral: THREE.NeutralToneMapping, none: THREE.NoToneMapping }[s.tone] ?? THREE.AgXToneMapping;
    renderer.toneMappingExposure = s.exposure;
    bokeh.enabled = s.dof > .01; bokeh.uniforms.aperture.value = s.dof * .00011; bokeh.uniforms.maxblur.value = .003 + s.dof * .011;
    finish.uniforms.uVig.value = s.vignette; finish.uniforms.uGrain.value = s.grain; finish.uniforms.uCA.value = s.ca;
    if (geoSig) setCard();
    dust.visible = !!s.dust; if (s.pose === 'lanyard') buildLanyard(); lanyardG.visible = s.pose === 'lanyard';
    const pr = s.quality === 'draft' ? 1 : s.quality === 'ultra' ? Math.min(window.devicePixelRatio || 1, 2) : Math.min(window.devicePixelRatio || 1, 1.5);
    if (Math.abs(renderer.getPixelRatio() - pr) > .01) { renderer.setPixelRatio(pr); composer.setPixelRatio(pr); resize(); }
    key.shadow.mapSize.setScalar(s.quality === 'draft' ? 1024 : 2048);
  }
  function resize() {
    const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); composer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
    const pr = renderer.getPixelRatio(); finish.uniforms.uRes.value.set(w * pr, h * pr); dustMat.uniforms.uPR.value = pr;
  }
  new ResizeObserver(resize).observe(host); resize();

  /* ---------- picking ---------- */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), plane = new THREE.Plane(), nrm = new THREE.Vector3(), pnt = new THREE.Vector3();
  function setRay(e) { const r = renderer.domElement.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera); }
  const toMM = (lp, sd) => ({ mx: sd === 'front' ? lp.x + W / 2 : W / 2 - lp.x, my: H / 2 - lp.y });
  function pickCard(e) {
    if (expT > .02) return null; setRay(e);
    const objs = body ? [body] : [flexF, flexB].filter(Boolean), hit = ray.intersectObjects(objs, false)[0]; if (!hit) return null;
    let sd; if (body) { if (!hit.face || hit.face.materialIndex === 2) return null; sd = hit.face.materialIndex === 0 ? 'front' : 'back'; } else sd = hit.object === flexF ? 'front' : 'back';
    return { side: sd, ...toMM(cardG.worldToLocal(hit.point.clone()), sd), point: hit.point.clone() };
  }
  function planeMM(e, sd) {
    setRay(e); cardG.updateMatrixWorld(); nrm.set(0, 0, sd === 'front' ? 1 : -1).transformDirection(cardG.matrixWorld); pnt.set(0, 0, sd === 'front' ? TH / 2 : -TH / 2).applyMatrix4(cardG.matrixWorld);
    plane.setFromNormalAndCoplanarPoint(nrm, pnt); const p = ray.ray.intersectPlane(plane, new THREE.Vector3()); return p ? toMM(cardG.worldToLocal(p), sd) : null;
  }
  function pickAny(e) { setRay(e); const objs = [body, flexF, flexB, bd].filter(Boolean); const h = ray.intersectObjects(objs, false)[0]; return h ? h.point.clone() : null; }
  const cvs = renderer.domElement; let down = null;
  cvs.addEventListener('pointerdown', e => {
    if (e.button !== 0) return; const hit = pickCard(e); down = { x: e.clientX, y: e.clientY, hit, drag: false };
    if (hit && F.pick3D(hit.side, hit.mx, hit.my, 'down')) { down.drag = true; controls.enabled = false; cvs.setPointerCapture(e.pointerId); cvs.style.cursor = 'grabbing'; }
  }, true);
  cvs.addEventListener('pointermove', e => {
    if (torchOn) { const p = pickAny(e); if (p) torchU.uTorchPos.value.copy(p); }
    if (down && down.drag) { const p = planeMM(e, down.hit.side); if (p) F.pick3D(down.hit.side, p.mx, p.my, 'move'); return; }
    if (!down && !torchOn) { const h = pickCard(e); cvs.style.cursor = h ? 'pointer' : 'grab'; }
  });
  const up = (e) => {
    if (!down) return; const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y) > 4;
    if (down.drag) { F.pick3D(down.hit.side, 0, 0, 'up'); controls.enabled = true; cvs.style.cursor = ''; }
    else if (!moved) { if (down.hit) F.pick3D(down.hit.side, down.hit.mx, down.hit.my, 'click'); else F.pick3D(null, 0, 0, 'click'); }
    down = null;
  };
  cvs.addEventListener('pointerup', up); cvs.addEventListener('pointercancel', up);
  cvs.addEventListener('pointerleave', () => { if (torchOn) torchU.uTorchPos.value.set(0, -1e4, 0); });
  cvs.addEventListener('dblclick', e => { const p = pickAny(e); if (!p) return; const dir = camera.position.clone().sub(controls.target).normalize(); tweenTo(p.clone().add(dir.multiplyScalar(Math.max(W, H) * .55)), p, 1); });

  function tweenTo(pos, tgt, dur) { tween = { p0: camera.position.clone(), t0: controls.target.clone(), p1: pos, t1: tgt, t: 0, dur: dur || 1.1 }; }
  function camPreset(name) {
    cardG.getWorldPosition(center); const s = Math.max(W, H) / 85.6, st = F.P.scene.pose === 'stand' || F.P.scene.pose === 'lanyard';
    const T = st ? { hero: [-70, 35, 230], front: [0, 4, 230], top: [0, 120, 200], macro: [30, 10, 60], edge: [190, 10, 30], low: [120, -10, 150] } : { hero: [-55, 165, 150], front: [0, 250, .01], top: [0, 260, .01], macro: [28, 40, 46], edge: [0, 16, 180], low: [135, 50, 110] };
    const o = T[name] || T.hero; let tgt = center.clone();
    if (name === 'macro') { tmp.set(W / 2 - 9, -H / 2 + 9, TH / 2); cardG.localToWorld(tmp); tgt = tmp.clone(); }
    tweenTo(tgt.clone().add(new THREE.Vector3(o[0] * s, o[1] * s, o[2] * s)), tgt, 1.3);
  }

  /* ---------- loop ---------- */
  const clock = new THREE.Clock();
  function update(dt) {
    const s = F.P.scene; time += dt;
    uvT += ((uvOn ? 1 : 0) - uvT) * damp(dt, 4.5);
    const df = flipTarget - flipCur; flipCur += df * damp(dt, 6.5); if (Math.abs(df) < 1e-3) flipCur = flipTarget; flipG.rotation.y = flipCur;
    const fl = Math.sin(Math.min(1, Math.abs(flipTarget - flipCur) / Math.PI) * Math.PI), sz = Math.max(W, H);
    let py, rx;
    if (s.pose === 'desk') { py = (flexMode ? -flexMinZ : TH / 2) + .06 + fl * W * .55; rx = -Math.PI / 2; }
    else if (s.pose === 'stand') { py = H / 2 + 5 + fl * 6; rx = -.12; }
    else if (s.pose === 'lanyard') { py = H / 2 + 34 + fl * 4; rx = 0; }
    else { py = 13 + sz * .08 + (s.float ? Math.sin(time * 1.1) * 1.3 : 0) + fl * sz * .14; rx = -Math.PI / 2; }
    if (expOn) py += sz * .15;
    poseY += (py - poseY) * damp(dt, 7); pose.position.y = poseY; orient.rotation.x += (rx - orient.rotation.x) * damp(dt, 5);
    orient.rotation.z += ((s.pose === 'lanyard' ? Math.sin(time * .9) * .035 : 0) - orient.rotation.z) * damp(dt, 4);
    if (spinOn && !filming) pose.rotation.y += dt * .5;
    if (filming) { filming.t += dt; pose.rotation.y = filming.yaw0 + (Math.min(1, filming.t / filming.dur)) * Math.PI * 2; if (filming.t >= filming.dur) filming = null; }
    tiltK += (((tiltOn || filming) && s.pose !== 'lanyard' ? 1 : 0) - tiltK) * damp(dt, 3);
    expT += ((expOn ? 1 : 0) - expT) * damp(dt, 4); if (Math.abs(expT - (expOn ? 1 : 0)) < 1e-3) expT = expOn ? 1 : 0;
    tiltG.rotation.x = tiltK * Math.sin(time * 1.15) * .16 - expT * .5; tiltG.rotation.y = tiltK * Math.sin(time * .8) * .27 + expT * .6;
    const showExp = expT > .002;
    if (body) body.visible = !showExp; if (flexF) flexF.visible = flexB.visible = !showExp;
    if (holoF) holoF.visible = !showExp && !!holoMatF.uniforms.uMask.value; if (holoB) holoB.visible = !showExp && !!holoMatB.uniforms.uMask.value;
    if (exp) { const sp = sz * .14 * expT; exp[0].visible = showExp && !!holoMatF.uniforms.uMask.value; exp[1].visible = exp[2].visible = exp[3].visible = showExp; exp[0].position.z = TH / 2 + .01 + sp * 2; exp[1].position.z = TH / 2 + sp; exp[3].position.z = -TH / 2 - sp; }
    cardG.updateWorldMatrix(true, false); cardG.getWorldPosition(center);
    let az = s.azim, el = s.elev;
    if (sweepT >= 0) { sweepT += dt / 3.4; const k = ease(Math.min(1, sweepT)); az = -170 + 340 * k; el = 22 + 14 * Math.sin(k * Math.PI); if (sweepT >= 1) sweepT = -1; }
    if (filming) az = s.azim + Math.sin(filming.t / filming.dur * Math.PI * 2) * 70;
    const ar = az * Math.PI / 180, er = el * Math.PI / 180;
    key.position.set(center.x + Math.sin(ar) * Math.cos(er) * 420, center.y + Math.sin(er) * 420, center.z + Math.cos(ar) * Math.cos(er) * 420); key.target.position.copy(center);
    lightDir.copy(key.position).sub(center).normalize();
    scene.environmentIntensity = lerp(s.envInt * .8, .02, uvT); key.intensity = lerp(keyBase * s.keyInt * .48, 0, uvT);
    if (voidMode) scene.backgroundIntensity = lerp(.45, .03, uvT); else { bgCol.copy(baseBg).lerp(uvBg, uvT); fog.color.copy(bgCol); }
    uvFlood.target.position.copy(center); uvFlood.intensity = uvT * (torchOn ? .35 : 2.2);
    torchU.uTorchOn.value = torchOn ? uvT : 0; torch.intensity = torchOn ? uvT * 7 : 0;
    if (torchOn) { torch.position.copy(torchU.uTorchPos.value).add(tmp.set(0, 75, 10)); torch.target.position.copy(torchU.uTorchPos.value); }
    matF.emissiveIntensity = Math.max(uvT * 2.6, matF.emissiveMap ? glowBase : 0); matB.emissiveIntensity = Math.max(uvT * 2.6, matB.emissiveMap ? glowBase : 0);
    for (const hm of [holoMatF, holoMatB]) { hm.uniforms.uTime.value = time; hm.uniforms.uLightDir.value.copy(lightDir); hm.uniforms.uLevel.value = 1 - .9 * uvT; }
    bloom.strength = s.bloom * .65 + uvT * .55; dustMat.uniforms.uTime.value = time; dustMat.uniforms.uLevel.value = 1 - uvT * .85; finish.uniforms.uTime.value = time;
    const upright = s.pose === 'stand' || s.pose === 'lanyard', lift = Math.max(.1, poseY - (upright ? H / 2 : 0)); blobG.position.set(center.x - lightDir.x / Math.max(.2, lightDir.y) * lift * .45, .25, center.z - lightDir.z / Math.max(.2, lightDir.y) * lift * .45); blobG.rotation.y = pose.rotation.y;
    if (upright) blob.scale.set(W * 1.25, TH + 16, 1); else { const sp = 1.32 + lift * .012; blob.scale.set(W * sp, H * sp, 1); }
    blobMat.opacity = blobBase * Math.max(.25, 1 - lift / 90) * (1 - uvT * .6); blobG.visible = !voidMode;
    if (tween) { tween.t += dt / tween.dur; const k = ease(Math.min(1, tween.t)); camera.position.lerpVectors(tween.p0, tween.p1, k); controls.target.lerpVectors(tween.t0, tween.t1, k); if (tween.t >= 1) tween = null; }
    if (bokeh.enabled) bokeh.uniforms.focus.value = camera.position.distanceTo(controls.target);
    if (showExp && expT > .25) { const r = renderer.domElement.getBoundingClientRect(); const zs = [exp[0].position.z, exp[1].position.z, 0, exp[3].position.z]; labels.forEach((d, i) => { if (i === 0 && !exp[0].visible) { d.style.display = 'none'; return; } tmp.set(W / 2 + 3, H / 2 - 4, zs[i]); cardG.localToWorld(tmp); tmp.project(camera); d.style.display = 'block'; d.style.opacity = Math.min(1, (expT - .25) * 2); d.style.transform = `translate(${(tmp.x * .5 + .5) * r.width}px, ${(-tmp.y * .5 + .5) * r.height}px) translate(6px,-50%)`; }); }
    else labels.forEach(d => d.style.display = 'none');
  }
  function frame(dt) { update(dt); controls.update(); composer.render(dt); }
  renderer.setAnimationLoop(() => { const dt = Math.min(clock.getDelta(), .05); if (active) frame(dt); });

  /* ---------- outputs ---------- */
  async function snapshot(v) { const out = await snapCanvas(v); return await new Promise(r => out.toBlob(r, 'image/png')); }
  async function snapshotPair(v) {
    const pT = flipTarget, pC = flipCur; flipTarget = flipCur = 0; const a = await snapCanvas(v); flipTarget = flipCur = Math.PI; const b = await snapCanvas(v); flipTarget = pT; flipCur = pC;
    const c = document.createElement('canvas'); c.width = a.width + b.width; c.height = Math.max(a.height, b.height); const x = c.getContext('2d'); x.drawImage(a, 0, 0); x.drawImage(b, a.width, 0); return await new Promise(r => c.toBlob(r, 'image/png'));
  }
  async function snapCanvas(v) {
    const w = host.clientWidth, h = host.clientHeight, pr0 = renderer.getPixelRatio(), maxT = renderer.capabilities.maxTextureSize;
    let pr = v <= 4 ? pr0 * v : v / w; pr = Math.min(pr, maxT / w, maxT / h, Math.sqrt(40e6 / (w * h)));
    const big = pr * pr * w * h > 9e6; if (big) { composer.renderTarget1.samples = 0; composer.renderTarget2.samples = 0; }
    renderer.setPixelRatio(pr); composer.setPixelRatio(pr); resize(); frame(0);
    const out = document.createElement('canvas'); out.width = renderer.domElement.width; out.height = renderer.domElement.height; out.getContext('2d').drawImage(renderer.domElement, 0, 0);
    if (big) { composer.renderTarget1.samples = 4; composer.renderTarget2.samples = 4; }
    renderer.setPixelRatio(pr0); composer.setPixelRatio(pr0); if (big) { composer.renderTarget1.setSize(1, 1); composer.renderTarget2.setSize(1, 1); } resize();
    return out;
  }
  async function record(sec, onP) {
    const stream = renderer.domElement.captureStream(60);
    const types = ['video/mp4;codecs=avc1', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4'], mime = types.find(t => MediaRecorder.isTypeSupported(t)) || '';
    const rec = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: 16e6 } : undefined), chunks = [];
    rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); }; const stopped = new Promise(r => rec.onstop = r);
    filming = { t: 0, dur: sec, yaw0: pose.rotation.y }; rec.start(250);
    await new Promise(r => { const iv = setInterval(() => { if (onP) onP(filming ? filming.t / sec : 1); if (!filming) { clearInterval(iv); r(); } }, 120); });
    rec.stop(); await stopped; stream.getTracks().forEach(t => t.stop());
    const type = rec.mimeType || mime || 'video/webm'; return { blob: new Blob(chunks, { type }), ext: type.includes('mp4') ? 'mp4' : 'webm' };
  }

  F.attachView({
    setCard, setScene, setMaps, resize, camPreset, snapshot, snapshotPair, record,
    setUV(on) { uvOn = !!on; }, setTorch(on) { torchOn = !!on; if (!on) torchU.uTorchPos.value.set(0, -1e4, 0); cvs.style.cursor = on ? 'crosshair' : ''; },
    flipTo(sd, instant) { flipTarget = sd === 'back' ? Math.PI : 0; if (instant) flipCur = flipTarget; },
    toggle(a) { if (a === 'spin') return spinOn = !spinOn; if (a === 'tilt') return tiltOn = !tiltOn; if (a === 'explode') return expOn = !expOn; return false; },
    sweep() { sweepT = 0; }, setActive(on) { active = !!on; clock.getDelta(); }
  });
}
try { start(); } catch (e) { console.error(e); window.Forge && window.Forge.viewFailed((e && e.message) || 'WebGL is unavailable'); }
