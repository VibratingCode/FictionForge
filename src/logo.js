/* ================= faction icons (vector glyph library) + procedural sigils ================= */
const ICONS = {};
const ICON_CATS = ['Beasts', 'Weapons', 'Celestial', 'Arcane', 'Tech', 'Nature', 'Royal & civic', 'Industry', 'Line symbols'];
(() => {
  const I = (cat, id, label, f) => { ICONS[id] = { cat, label, f }; };
  /* every icon draws white into a 100×100 box with the helper g */
  I('Beasts', 'wolf', 'Wolf', g => { g.sym([[50, 30], [60, 26], [73, 6], [79, 30], [88, 44], [81, 57], [71, 68], [62, 83], [50, 93]]); g.cut(() => { g.mirror(() => g.poly([[55, 52], [68, 45], [65, 54]])); g.poly([[44, 78], [56, 78], [50, 85]]); g.mirror(() => g.poly([[62, 26], [70, 12], [72, 28]])); }); });
  I('Beasts', 'eagle', 'Eagle', g => { g.ell(50, 54, 9, 17); g.circ(50, 30, 8); g.poly([[50, 31], [58, 35], [50, 39]]); g.mirror(() => { g.poly([[56, 40], [97, 21], [95, 30], [58, 48]]); g.poly([[57, 46], [98, 36], [95, 44], [58, 53]]); g.poly([[57, 52], [96, 52], [92, 59], [57, 58]]); g.poly([[56, 58], [90, 69], [85, 75], [55, 63]]); }); g.poly([[43, 67], [57, 67], [63, 87], [50, 80], [37, 87]]); g.cut(() => g.circ(47, 28, 1.8)); });
  I('Beasts', 'raven', 'Raven', g => { g.poly([[16, 80], [30, 74], [40, 72], [52, 68], [62, 58], [68, 46], [70, 38], [85, 34], [71, 31], [65, 28], [55, 29], [46, 35], [36, 48], [26, 56], [20, 60], [30, 62], [18, 72]]); g.cut(() => g.circ(62, 34, 2.2)); g.line([[50, 70], [46, 86]], 2.5); g.line([[56, 66], [56, 86]], 2.5); });
  I('Beasts', 'lion', 'Lion', g => { g.star(50, 50, 18, 46, 34); g.cut(() => g.ell(50, 52, 27, 31)); g.sym([[50, 26], [63, 29], [70, 43], [67, 61], [59, 74], [50, 79]]); g.cut(() => { g.mirror(() => g.poly([[55, 45], [64, 42], [62, 49]])); g.poly([[44, 58], [56, 58], [50, 65]]); g.line([[50, 65], [50, 70], [44, 73]], 2); g.line([[50, 70], [56, 73]], 2); }); });
  I('Beasts', 'stag', 'Stag', g => { g.sym([[50, 46], [57, 46], [63, 53], [61, 67], [56, 82], [50, 89]]); g.mirror(() => { g.poly([[61, 50], [76, 44], [65, 57]]); g.line([[57, 46], [65, 30], [71, 12]], 4); g.line([[64, 33], [78, 29]], 3.5); g.line([[68, 22], [82, 16]], 3.5); g.line([[65, 30], [60, 17]], 3.5); }); g.cut(() => { g.mirror(() => g.circ(56, 60, 2.2)); g.ell(50, 84, 3.5, 2.5); }); });
  I('Beasts', 'bearpaw', 'Bear paw', g => { g.ell(50, 66, 21, 17); [[26, 42, 7.5], [40, 31, 8], [60, 31, 8], [74, 42, 7.5]].forEach(([x, y, r]) => { g.circ(x, y, r); g.poly([[x - 3, y - r + 1], [x, y - r - 9], [x + 3, y - r + 1]]); }); });
  I('Beasts', 'serpent', 'Serpent', g => { g.spath('M 26 88 C 4 72 62 66 52 48 C 44 34 24 34 34 20 C 42 10 60 12 66 18', 9); g.ell(70, 20, 9, 6, -.5); g.cut(() => g.circ(72, 17, 1.6)); g.line([[78, 22], [86, 24], [90, 20]], 1.6); g.line([[86, 24], [90, 28]], 1.6); });
  I('Beasts', 'dragon', 'Dragon', g => { g.poly([[14, 74], [28, 54], [40, 40], [52, 30], [60, 22], [58, 6], [68, 18], [80, 24], [94, 32], [90, 39], [76, 41], [88, 49], [72, 51], [64, 61], [57, 76], [50, 94], [40, 81], [30, 85], [26, 74]]); for (let t = .12; t < .9; t += .19) { const px = 52 + (18 - 52) * t, py = 30 + (72 - 30) * t; g.poly([[px + 3.6, py - 4.4], [px - 9, py - 7], [px - 3.6, py + 4.4]]); } g.line([[60, 22], [48, 4]], 3.4); g.line([[66, 20], [64, 2]], 3); g.cut(() => { g.poly([[68, 27], [77, 30], [70, 33]]); g.poly([[94, 33], [76, 41], [88, 38]]); g.circ(86, 30, 1.2); }); });
  I('Beasts', 'spider', 'Spider', g => { g.circ(50, 44, 9); g.ell(50, 64, 12, 15); g.mirror(() => { g.line([[56, 42], [72, 30], [84, 14]], 3.6); g.line([[58, 47], [78, 42], [93, 33]], 3.6); g.line([[58, 53], [78, 58], [90, 71]], 3.6); g.line([[56, 58], [70, 71], [78, 89]], 3.6); }); g.cut(() => g.mirror(() => g.circ(54, 42, 1.8))); });
  I('Beasts', 'owl', 'Owl', g => { g.sym([[50, 22], [62, 22], [71, 10], [73, 30], [79, 48], [75, 70], [63, 86], [50, 90]]); g.cut(() => { g.mirror(() => g.circ(37, 44, 11)); g.poly([[46, 56], [54, 56], [50, 64]]); }); g.mirror(() => g.circ(37, 44, 5)); g.cut(() => g.mirror(() => g.circ(36, 43, 1.6))); g.cut(() => g.mirror(() => g.line([[40, 72], [44, 78]], 1.6))); });
  I('Beasts', 'ram', 'Ram', g => { g.sym([[50, 38], [58, 38], [63, 52], [59, 72], [50, 87]]); g.mirror(() => g.spiral(73, 44, 3, 15, 1.35, 6)); g.cut(() => { g.mirror(() => g.circ(55, 52, 2)); g.mirror(() => g.circ(53, 80, 1.6)); }); });
  I('Beasts', 'bull', 'Bull', g => { g.sym([[50, 36], [62, 36], [67, 50], [63, 68], [59, 80], [50, 85]]); g.mirror(() => { g.spath('M 62 40 Q 90 40 88 14', 7); g.poly([[66, 42], [80, 38], [70, 48]]); }); g.cut(() => { g.mirror(() => g.circ(57, 52, 2.2)); g.mirror(() => g.ell(55, 78, 2.4, 3.2)); }); });
  I('Beasts', 'bat', 'Bat', g => { g.sym([[50, 40], [54, 32], [57, 42], [66, 38], [82, 30], [97, 40], [89, 46], [85, 58], [77, 54], [70, 63], [62, 57], [56, 67], [50, 71]]); g.cut(() => g.mirror(() => g.circ(53, 47, 1.4))); });
  I('Beasts', 'scorpion', 'Scorpion', g => { g.ell(50, 66, 9, 13); g.spath('M 50 58 C 50 34 30 28 38 14', 6); g.poly([[36, 10], [44, 14], [34, 18]]); g.mirror(() => { g.line([[56, 62], [70, 52], [74, 40]], 3.5); g.ell(76, 34, 6, 8, .4); g.line([[57, 70], [72, 74]], 2.6); g.line([[57, 76], [70, 84]], 2.6); g.line([[55, 64], [70, 63]], 2.6); }); g.cut(() => g.mirror(() => g.line([[78, 26], [76, 34]], 2))); });

  I('Weapons', 'sword', 'Sword', g => { g.poly([[50, 5], [55, 14], [55, 64], [45, 64], [45, 14]]); g.rect(29, 63, 42, 6, 2); g.rect(46, 69, 8, 17, 2); g.circ(50, 90, 5); g.cut(() => g.line([[50, 16], [50, 60]], 1.4)); });
  I('Weapons', 'swords', 'Crossed swords', g => { for (const a of [-.72, .72]) g.rot(50, 50, a, () => { g.poly([[50, 4], [54, 12], [54, 62], [46, 62], [46, 12]]); g.rect(32, 61, 36, 5, 2); g.rect(46.5, 66, 7, 15, 2); g.circ(50, 85, 4.5); }); });
  I('Weapons', 'axe', 'Axe', g => { g.rect(46.5, 8, 7, 86, 3); g.path('M 53 16 Q 88 10 90 44 Q 72 40 53 48 Z'); g.path('M 47 20 Q 30 22 30 36 Q 38 32 47 34 Z'); });
  I('Weapons', 'axes', 'Crossed axes', g => { for (const [a, fl] of [[-.6, true], [.6, false]]) g.rot(50, 50, a, () => g.flip(fl, () => { g.rect(47, 8, 6, 86, 3); g.path('M 53 14 Q 84 10 86 40 Q 70 36 53 44 Z'); })); });
  I('Weapons', 'hammer', 'War hammer', g => { g.rect(46.5, 30, 7, 64, 3); g.rect(24, 12, 52, 22, 3); g.cut(() => { g.rect(28, 16, 4, 14, 1); g.rect(68, 16, 4, 14, 1); }); g.poly([[46, 12], [54, 12], [50, 4]]); });
  I('Weapons', 'spear', 'Spear', g => { g.line([[50, 96], [50, 26]], 5); g.poly([[50, 3], [59, 22], [50, 30], [41, 22]]); g.poly([[44, 34], [56, 34], [50, 44]]); g.cut(() => g.line([[50, 9], [50, 24]], 1.4)); });
  I('Weapons', 'trident', 'Trident', g => { g.line([[50, 96], [50, 30]], 5); g.poly([[50, 4], [56, 18], [53, 18], [53, 34], [47, 34], [47, 18], [44, 18]]); g.mirror(() => { g.spath('M 50 40 Q 72 40 72 16', 4.5); g.poly([[72, 6], [77, 18], [67, 18]]); }); });
  I('Weapons', 'bow', 'Bow & arrow', g => { g.arcS(18, 50, 44, -1.1, 1.1, 5); g.line([[38.8, 10.4], [38.8, 89.6]], 1.4); g.line([[16, 50], [86, 50]], 3.2); g.poly([[96, 50], [84, 43], [86, 50], [84, 57]]); g.poly([[22, 50], [12, 42], [10, 46], [16, 50], [10, 54], [12, 58]]); });
  I('Weapons', 'dagger', 'Dagger', g => { g.poly([[50, 6], [56, 22], [55, 56], [45, 56], [44, 22]]); g.spath('M 30 52 Q 50 64 70 52', 5); g.rect(46, 60, 8, 22, 2); g.poly([[50, 82], [57, 90], [50, 96], [43, 90]]); });
  I('Weapons', 'mace', 'Mace', g => { g.rect(46.5, 40, 7, 54, 3); g.star(50, 28, 10, 24, 15); g.circ(50, 28, 15); g.cut(() => g.circ(50, 28, 4)); });
  I('Weapons', 'shield', 'Round shield', g => { g.circ(50, 50, 42); g.cut(() => g.circ(50, 50, 35)); g.circ(50, 50, 30); g.cut(() => { for (let i = 0; i < 8; i++) g.rot(50, 50, i * Math.PI / 4, () => g.line([[50, 22], [50, 38]], 2)); }); g.circ(50, 50, 9); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g.circ(50 + Math.cos(a) * 38.5, 50 + Math.sin(a) * 38.5, 1.8); } });
  I('Weapons', 'arrows', 'Crossed arrows', g => { for (const a of [-.75, .75]) g.rot(50, 50, a, () => { g.line([[50, 92], [50, 16]], 3.2); g.poly([[50, 4], [57, 18], [43, 18]]); g.poly([[50, 80], [57, 90], [57, 97], [50, 88], [43, 97], [43, 90]]); }); });

  I('Celestial', 'sun', 'Sun', g => { g.circ(50, 50, 18); for (let i = 0; i < 16; i++) g.rot(50, 50, i * Math.PI / 8, () => g.poly(i % 2 ? [[47, 26], [53, 26], [50, 14]] : [[46, 28], [54, 28], [50, 4]])); });
  I('Celestial', 'sunrise', 'Rising sun', g => { g.path('M 22 72 A 28 28 0 0 1 78 72 Z'); for (let i = 0; i <= 8; i++) { const a = Math.PI + i * Math.PI / 8; g.poly([[50 + Math.cos(a - .07) * 33, 72 + Math.sin(a - .07) * 33], [50 + Math.cos(a) * 48, 72 + Math.sin(a) * 48], [50 + Math.cos(a + .07) * 33, 72 + Math.sin(a + .07) * 33]]); } g.rect(6, 76, 88, 4, 2); g.rect(18, 84, 64, 3, 1.5); });
  I('Celestial', 'crescent', 'Crescent moon', g => { g.circ(50, 50, 38); g.cut(() => g.circ(66, 42, 32)); g.star(76, 66, 4, 7, 2.4); });
  I('Celestial', 'eclipse', 'Eclipse', g => { for (let i = 0; i < 36; i++) g.rot(50, 50, i * Math.PI / 18, () => g.poly([[49, 22], [51, 22], [50, i % 2 ? 10 : 4]])); g.circ(50, 50, 28); g.cut(() => g.circ(50, 50, 24)); g.circ(53, 48, 22); });
  I('Celestial', 'star', 'Star', g => { g.star(50, 53, 5, 46, 19); });
  I('Celestial', 'compass', 'Compass star', g => { g.star(50, 50, 8, 47, 13); g.cut(() => g.circ(50, 50, 6)); g.circ(50, 50, 3); g.cut(() => { g.circ(50, 50, 30); }); g.star(50, 50, 4, 47, 9); g.cut(() => g.circ(50, 50, 4)); });
  I('Celestial', 'comet', 'Comet', g => { g.circ(70, 30, 12); g.poly([[60, 22], [64, 40], [12, 92]]); g.line([[58, 18], [18, 50]], 2); g.line([[74, 44], [44, 86]], 2); });
  I('Celestial', 'planet', 'Ringed planet', g => { g.circ(50, 50, 22); g.rot(50, 50, -.35, () => { g.cut(() => g.ringE(50, 50, 44, 11, 10)); g.ringE(50, 50, 44, 11, 4); }); });
  I('Celestial', 'constellation', 'Constellation', g => { const p = [[16, 70], [32, 54], [48, 60], [62, 38], [80, 26], [86, 50], [70, 74]]; g.line(p, 1.6); g.line([[62, 38], [86, 50]], 1.6); p.forEach(([x, y], i) => g.star(x, y, 4, i % 3 ? 5 : 8, i % 3 ? 1.8 : 2.6)); });
  I('Celestial', 'triplemoon', 'Triple moon', g => { g.circ(50, 50, 12); g.circ(22, 50, 14); g.cut(() => g.circ(16, 50, 12)); g.circ(78, 50, 14); g.cut(() => g.circ(84, 50, 12)); });
  I('Celestial', 'galaxy', 'Spiral galaxy', g => { g.circ(50, 50, 8); for (const a of [0, Math.PI]) g.rot(50, 50, a, () => g.spiral(50, 50, 8, 44, .85, 5, true)); for (let i = 0; i < 9; i++) { const a = i * 2.4, r = 14 + i * 3.6; g.circ(50 + Math.cos(a) * r, 50 + Math.sin(a) * r, 1.2); } });

  I('Arcane', 'eye', 'Eye', g => { g.path('M 4 50 Q 50 6 96 50 Q 50 94 4 50 Z'); g.cut(() => g.path('M 12 50 Q 50 16 88 50 Q 50 84 12 50 Z')); g.circ(50, 50, 17); g.cut(() => g.circ(50, 50, 7)); g.circ(50, 50, 4); });
  I('Arcane', 'eyetri', 'Eye in triangle', g => { g.poly([[50, 6], [96, 88], [4, 88]]); g.cut(() => g.poly([[50, 18], [86, 82], [14, 82]])); g.path('M 26 62 Q 50 38 74 62 Q 50 86 26 62 Z'); g.cut(() => g.circ(50, 62, 8)); g.circ(50, 62, 4); });
  I('Arcane', 'hand', 'Open hand', g => { g.rect(28, 46, 44, 42, 12); [[29, 18, 30], [40, 10, 38], [51, 12, 36], [62, 18, 30]].forEach(([x, y, h]) => g.rect(x, y, 10, h, 5)); g.rot(30, 66, -.7, () => g.rect(14, 54, 12, 26, 6)); g.cut(() => g.line([[38, 74], [62, 74]], 1.6)); });
  I('Arcane', 'flame', 'Flame', g => { g.path('M 50 4 C 66 26 80 38 76 60 C 73 82 61 94 50 95 C 33 93 22 79 25 60 C 27 45 38 40 41 26 C 46 34 48 39 53 41 C 51 29 53 16 50 4 Z'); g.cut(() => g.path('M 50 50 C 58 60 64 66 62 76 C 60 86 54 89 50 89 C 43 88 38 83 39 75 C 40 68 46 64 46 56 Z')); });
  I('Arcane', 'chalice', 'Chalice', g => { g.sym([[50, 18], [76, 18], [74, 34], [64, 47], [55, 52], [55, 72], [67, 84], [67, 91], [50, 91]]); g.cut(() => g.rect(26, 23, 48, 3, 1)); g.circ(50, 10, 5); });
  I('Arcane', 'hourglass', 'Hourglass', g => { g.rect(20, 6, 60, 7, 2); g.rect(20, 87, 60, 7, 2); g.line([[24, 13], [24, 87]], 3); g.line([[76, 13], [76, 87]], 3); g.poly([[30, 15], [70, 15], [52, 50], [70, 85], [30, 85], [48, 50]]); g.cut(() => g.poly([[35, 18], [65, 18], [50, 46]])); g.cut(() => g.poly([[40, 82], [60, 82], [50, 66]]), true); });
  I('Arcane', 'key', 'Key', g => { g.circS(28, 50, 15, 6); g.cut(() => g.circ(28, 50, 4)); g.rect(42, 46, 50, 8, 2); g.rect(72, 54, 7, 14, 1); g.rect(84, 54, 7, 10, 1); g.mirror(() => { }, false); });
  I('Arcane', 'book', 'Open book', g => { g.path('M 50 24 Q 30 14 6 20 L 6 80 Q 30 74 50 84 Z'); g.path('M 50 24 Q 70 14 94 20 L 94 80 Q 70 74 50 84 Z'); g.cut(() => { g.line([[50, 24], [50, 84]], 2.4); for (let i = 0; i < 5; i++) { g.line([[14, 32 + i * 9], [42, 34 + i * 9]], 1.6); g.line([[58, 34 + i * 9], [86, 32 + i * 9]], 1.6); } }); });
  I('Arcane', 'rose', 'Rose', g => { for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * Math.PI * 2 / 5; g.circ(50 + Math.cos(a) * 12, 36 + Math.sin(a) * 12, 13); } g.circ(50, 36, 16); g.cut(() => { g.spiralLine(50, 36, 2, 15, 1.8, 2); for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + Math.PI / 5 + i * Math.PI * 2 / 5; g.line([[50 + Math.cos(a) * 15, 36 + Math.sin(a) * 15], [50 + Math.cos(a) * 25, 36 + Math.sin(a) * 25]], 1.8); } }); g.line([[50, 58], [50, 96]], 4); g.ell(36, 78, 10, 5, -.5); g.ell(64, 72, 10, 5, .5); });
  I('Arcane', 'skull', 'Skull', g => { g.circ(50, 40, 32); g.rect(31, 50, 38, 30, 8); g.cut(() => { g.mirror(() => g.ell(37, 46, 9, 10)); g.poly([[50, 56], [56, 66], [44, 66]]); for (let i = 0; i < 5; i++) g.line([[37 + i * 6.5, 72], [37 + i * 6.5, 82]], 2.2); }); });
  I('Arcane', 'skullbones', 'Skull & crossbones', g => { for (const a of [-.78, .78]) g.rot(50, 58, a, () => { g.line([[50, 18], [50, 98]], 7); g.mirror(() => { g.circ(54, 16, 5); g.circ(54, 99, 5); }); }); g.circ(50, 40, 25); g.rect(35, 48, 30, 22, 6); g.cut(() => { g.mirror(() => g.ell(40, 44, 7, 8)); g.poly([[50, 52], [55, 60], [45, 60]]); for (let i = 0; i < 4; i++) g.line([[41 + i * 6, 64], [41 + i * 6, 72]], 2); }); });
  I('Arcane', 'potion', 'Potion flask', g => { g.circ(50, 64, 29); g.rect(42, 14, 16, 30, 2); g.rect(37, 8, 26, 8, 3); g.cut(() => { g.path('M 23 60 Q 36 54 50 60 Q 64 66 77 60 L 77 58 Q 64 62 50 56 Q 36 50 23 56 Z'); g.circ(40, 74, 3); g.circ(58, 80, 2); }); });
  I('Arcane', 'crystal', 'Crystal', g => { g.poly([[50, 4], [74, 30], [64, 92], [36, 92], [26, 30]]); g.cut(() => { g.line([[26, 30], [74, 30]], 1.6); g.line([[50, 4], [42, 30], [50, 92]], 1.6); g.line([[50, 4], [58, 30], [50, 92]], 1.6); }); });
  I('Arcane', 'candle', 'Candle', g => { g.rect(38, 40, 24, 50, 3); g.path('M 38 44 Q 44 52 44 60 Q 46 52 50 46 Q 56 50 58 44 Z'); g.rect(30, 88, 40, 6, 3); g.path('M 50 8 C 58 18 58 28 50 34 C 42 28 42 18 50 8 Z'); g.line([[50, 34], [50, 40]], 1.4); });
  I('Arcane', 'ouroboros', 'Ouroboros', g => { g.circS(50, 52, 34, 9); g.cut(() => g.rect(56, 10, 18, 14)); g.ell(64, 18, 9, 7, .3); g.cut(() => g.circ(66, 16, 1.6)); g.poly([[52, 16], [58, 22], [50, 24]]); });

  I('Tech', 'atom', 'Atom', g => { for (const a of [0, Math.PI / 3, -Math.PI / 3]) g.rot(50, 50, a, () => g.ringE(50, 50, 44, 15, 3.2)); g.circ(50, 50, 8); });
  I('Tech', 'gear', 'Gear', g => { g.gear(50, 50, 44, 34, 14); g.cut(() => g.circ(50, 50, 22)); g.circ(50, 50, 14); g.cut(() => g.circ(50, 50, 6)); for (let i = 0; i < 4; i++) g.rot(50, 50, i * Math.PI / 2, () => g.rect(47, 22, 6, 14)); });
  I('Tech', 'chip', 'Circuit chip', g => { g.rect(24, 24, 52, 52, 4); g.cut(() => g.rect(34, 34, 32, 32, 2)); g.rect(40, 40, 20, 20, 1); for (let i = 0; i < 5; i++) { const p = 30 + i * 10; g.line([[p, 24], [p, 10]], 2.6); g.line([[p, 76], [p, 90]], 2.6); g.line([[24, p], [10, p]], 2.6); g.line([[76, p], [90, p]], 2.6); } });
  I('Tech', 'rocket', 'Rocket', g => { g.path('M 50 4 C 66 18 68 44 62 70 L 38 70 C 32 44 34 18 50 4 Z'); g.mirror(() => g.poly([[61, 52], [76, 70], [76, 82], [62, 72]])); g.cut(() => g.circ(50, 34, 7)); g.path('M 42 74 L 58 74 Q 56 88 50 96 Q 44 88 42 74 Z'); });
  I('Tech', 'satellite', 'Satellite', g => { g.rot(50, 50, -.6, () => { g.rect(40, 38, 20, 24, 3); g.rect(6, 42, 30, 16, 1); g.rect(64, 42, 30, 16, 1); g.cut(() => { for (const x of [16, 26, 74, 84]) g.line([[x, 42], [x, 58]], 1.4); g.line([[6, 50], [36, 50]], 1.4); g.line([[64, 50], [94, 50]], 1.4); }); g.line([[50, 62], [50, 74]], 2.4); g.path('M 38 84 Q 50 72 62 84 Z'); }); });
  I('Tech', 'bolt', 'Lightning bolt', g => { g.poly([[60, 3], [22, 55], [46, 55], [36, 97], [78, 40], [54, 40], [68, 3]]); });
  I('Tech', 'robot', 'Robot head', g => { g.rect(20, 28, 60, 52, 10); g.line([[50, 28], [50, 14]], 3); g.circ(50, 11, 5); g.rect(12, 46, 8, 16, 2); g.rect(80, 46, 8, 16, 2); g.cut(() => { g.rect(30, 42, 14, 10, 2); g.rect(56, 42, 14, 10, 2); for (let i = 0; i < 5; i++) g.rect(32 + i * 7.6, 62, 4, 10, 1); }); });
  I('Tech', 'hexcore', 'Hex core', g => { g.hex(50, 50, 46); g.cut(() => g.hex(50, 50, 39)); g.hex(50, 50, 30); g.cut(() => g.circ(50, 50, 14)); g.circ(50, 50, 7); });
  I('Tech', 'dna', 'Double helix', g => { const a = [], b = []; for (let y = 6; y <= 94; y += 2) { a.push([50 + Math.sin(y / 14) * 22, y]); b.push([50 - Math.sin(y / 14) * 22, y]); } g.line(a, 4); g.line(b, 4); for (let y = 10; y < 92; y += 8) g.line([[50 + Math.sin(y / 14) * 22, y], [50 - Math.sin(y / 14) * 22, y]], 2); });
  I('Tech', 'broadcast', 'Broadcast', g => { g.circ(50, 50, 7); for (let i = 1; i <= 3; i++) { g.arcS(50, 50, 8 + i * 11, -.6, .6, 4); g.arcS(50, 50, 8 + i * 11, Math.PI - .6, Math.PI + .6, 4); } g.poly([[44, 56], [56, 56], [62, 96], [38, 96]]); });
  I('Tech', 'crosshair', 'Crosshair', g => { g.circS(50, 50, 32, 4.5); g.circS(50, 50, 14, 2.5); g.circ(50, 50, 3); [[50, 2, 50, 26], [50, 74, 50, 98], [2, 50, 26, 50], [74, 50, 98, 50]].forEach(([a, b, c, d]) => g.line([[a, b], [c, d]], 3.4)); });
  I('Tech', 'trefoil', 'Trefoil hazard', g => { g.circ(50, 52, 8); for (let i = 0; i < 3; i++) g.rot(50, 52, i * Math.PI * 2 / 3, () => g.path('M 50 52 m -12 -6 A 13 13 0 0 1 62 46 L 74 26 A 36 36 0 0 0 26 26 Z')); g.cut(() => g.circS(50, 52, 12, 4)); });
  I('Tech', 'drone', 'Drone', g => { g.rect(40, 40, 20, 20, 5); for (const [x, y] of [[20, 20], [80, 20], [20, 80], [80, 80]]) { g.line([[50, 50], [x, y]], 5); g.circS(x, y, 13, 3); g.circ(x, y, 3); } g.cut(() => g.circ(50, 50, 4)); });

  I('Nature', 'oak', 'Oak tree', g => { [[50, 24, 18], [32, 34, 15], [68, 34, 15], [24, 50, 13], [76, 50, 13], [40, 48, 16], [60, 48, 16]].forEach(([x, y, r]) => g.circ(x, y, r)); g.poly([[45, 56], [55, 56], [58, 86], [42, 86]]); g.line([[42, 86], [30, 94]], 3); g.line([[58, 86], [70, 94]], 3); g.line([[50, 86], [50, 96]], 3); });
  I('Nature', 'pine', 'Pine', g => { g.poly([[50, 4], [70, 30], [60, 30], [78, 54], [64, 54], [84, 80], [16, 80], [36, 54], [22, 54], [40, 30], [30, 30]]); g.rect(45, 80, 10, 14, 1); });
  I('Nature', 'leaf', 'Leaf', g => { g.path('M 50 4 C 84 26 84 70 50 92 C 16 70 16 26 50 4 Z'); g.cut(() => { g.line([[50, 14], [50, 86]], 2.2); for (let i = 0; i < 5; i++) { const y = 26 + i * 11; g.line([[50, y + 6], [68, y - 4]], 1.6); g.line([[50, y + 6], [32, y - 4]], 1.6); } }); g.line([[50, 90], [50, 98]], 3); });
  I('Nature', 'wheat', 'Wheat', g => { g.line([[50, 96], [50, 12]], 2.6); for (let i = 0; i < 6; i++) { const y = 16 + i * 11; g.ell(42, y + 4, 4, 8, -.5); g.ell(58, y + 4, 4, 8, .5); } g.ell(50, 10, 3.5, 7); });
  I('Nature', 'mountain', 'Mountain', g => { g.poly([[2, 86], [36, 26], [52, 52], [66, 34], [98, 86]]); g.cut(() => { g.poly([[36, 26], [27, 42], [33, 40], [37, 46], [42, 38], [45, 40]]); g.poly([[66, 34], [59, 45], [64, 43], [67, 48], [71, 43], [74, 46]]); }); });
  I('Nature', 'wave', 'Wave', g => { g.path('M 4 80 C 20 80 22 40 46 30 C 66 22 86 34 86 52 C 86 64 74 70 66 62 C 60 56 66 48 72 52 C 70 40 54 38 46 48 C 36 60 40 80 4 80 Z'); g.line([[4, 88], [96, 88]], 3); g.line([[14, 95], [86, 95]], 2.4); });
  I('Nature', 'lotus', 'Lotus', g => { g.path('M 50 20 C 62 38 62 60 50 76 C 38 60 38 38 50 20 Z'); g.mirror(() => { g.path('M 52 76 C 58 56 70 44 86 40 C 86 60 74 72 52 76 Z'); g.path('M 52 78 C 66 72 84 72 96 76 C 84 86 66 86 52 78 Z'); }); });
  I('Nature', 'mushroom', 'Mushroom', g => { g.path('M 8 54 C 8 24 30 10 50 10 C 70 10 92 24 92 54 Z'); g.path('M 40 54 L 60 54 Q 62 76 64 92 L 36 92 Q 38 76 40 54 Z'); g.cut(() => { g.circ(32, 34, 6); g.circ(56, 24, 5); g.circ(70, 42, 5); g.circ(46, 44, 3.5); }); });
  I('Nature', 'feather', 'Feather', g => { g.path('M 80 6 C 52 16 26 42 22 82 C 40 70 60 58 72 40 C 66 40 62 40 58 38 C 68 34 76 26 80 6 Z'); g.cut(() => g.spath('M 80 6 C 60 30 40 54 22 82', 2)); g.line([[24, 80], [12, 96]], 2.6); });
  I('Nature', 'snowflake', 'Snowflake', g => { for (let i = 0; i < 6; i++) g.rot(50, 50, i * Math.PI / 3, () => { g.line([[50, 50], [50, 6]], 4); g.line([[50, 22], [40, 12]], 3); g.line([[50, 22], [60, 12]], 3); g.line([[50, 36], [42, 28]], 3); g.line([[50, 36], [58, 28]], 3); }); g.hex(50, 50, 9); });

  I('Royal & civic', 'crown', 'Crown', g => { g.poly([[12, 78], [10, 30], [30, 52], [50, 20], [70, 52], [90, 30], [88, 78]]); g.rect(12, 80, 76, 10, 2); g.circ(10, 26, 5); g.circ(50, 15, 6); g.circ(90, 26, 5); g.cut(() => { g.mirror(() => g.circ(32, 68, 4)); g.diamond(50, 66, 6, 8); }); });
  I('Royal & civic', 'castle', 'Castle', g => { g.rect(14, 34, 22, 60); g.rect(64, 34, 22, 60); g.rect(30, 48, 40, 46); [14, 23.5, 33, 64, 73.5, 83].forEach(x => g.rect(x - (x > 50 ? 0 : 0), 24, 7, 11)); [30, 40, 50, 60].forEach(x => g.rect(x + 1, 40, 6, 9)); g.cut(() => { g.path('M 42 94 L 42 74 A 8 8 0 0 1 58 74 L 58 94 Z'); g.rect(22, 50, 6, 10, 3); g.rect(72, 50, 6, 10, 3); }); });
  I('Royal & civic', 'tower', 'Watchtower', g => { g.poly([[32, 30], [68, 30], [64, 94], [36, 94]]); g.rect(26, 18, 48, 12); [26, 37, 48, 59, 70].forEach(x => g.rect(x, 8, 5, 10)); g.cut(() => { g.path('M 44 94 L 44 78 A 6 6 0 0 1 56 78 L 56 94 Z'); g.rect(46, 44, 8, 14, 4); }); });
  I('Royal & civic', 'fleur', 'Fleur-de-lis', g => { g.path('M 50 4 C 62 18 64 38 54 58 L 46 58 C 36 38 38 18 50 4 Z'); g.mirror(() => g.path('M 54 58 C 60 40 78 30 90 38 C 96 44 92 56 82 56 C 86 50 82 44 76 46 C 68 48 64 56 62 64 Z')); g.rect(28, 58, 44, 8, 3); g.mirror(() => g.path('M 52 66 L 58 66 C 62 76 66 84 74 90 C 64 92 56 84 52 74 Z')); g.path('M 46 66 L 54 66 L 52 88 L 48 88 Z'); });
  I('Royal & civic', 'scales', 'Scales', g => { g.rect(47, 14, 6, 74); g.rect(30, 88, 40, 6, 3); g.circ(50, 12, 5); g.line([[14, 22], [86, 22]], 4); g.mirror(() => { g.line([[84, 24], [72, 56]], 1.4); g.line([[84, 24], [96, 56]], 1.4); g.path('M 68 56 L 100 56 Q 84 74 68 56 Z'); }); });
  I('Royal & civic', 'anchor', 'Anchor', g => { g.circS(50, 16, 8, 4.5); g.rect(46.5, 24, 7, 62); g.rect(28, 32, 44, 6, 3); g.arcS(50, 50, 38, Math.PI * .12, Math.PI * .88, 6); g.mirror(() => g.poly([[93, 50], [82, 66], [96, 64]])); });
  I('Royal & civic', 'ship', 'Galleon', g => { g.path('M 8 66 L 92 66 Q 86 84 70 88 L 26 88 Q 14 84 8 66 Z'); [30, 52, 72].forEach((x, i) => { g.line([[x, 66], [x, 10 + i * 4]], 2.4); g.path(`M ${x - 12} ${22 + i * 4} Q ${x} ${18 + i * 4} ${x + 12} ${22 + i * 4} L ${x + 10} ${40 + i * 4} Q ${x} ${36 + i * 4} ${x - 10} ${40 + i * 4} Z`); g.path(`M ${x - 14} ${44 + i * 3} Q ${x} ${40 + i * 3} ${x + 14} ${44 + i * 3} L ${x + 12} ${60} Q ${x} ${56} ${x - 12} ${60} Z`); }); g.poly([[52, 10], [60, 13], [52, 16]]); g.cut(() => { for (let i = 0; i < 6; i++) g.circ(24 + i * 10, 74, 1.8); }); g.line([[2, 94], [98, 94]], 2.4); });
  I('Royal & civic', 'column', 'Column', g => { g.rect(24, 8, 52, 8, 1); g.rect(30, 16, 40, 5, 1); g.rect(32, 21, 36, 62); g.rect(28, 83, 44, 5, 1); g.rect(22, 88, 56, 7, 1); g.cut(() => { for (let i = 0; i < 4; i++) g.line([[39 + i * 7.3, 24], [39 + i * 7.3, 80]], 2); }); });
  I('Royal & civic', 'torch', 'Torch', g => { g.poly([[44, 52], [56, 52], [53, 96], [47, 96]]); g.path('M 34 42 L 66 42 L 62 54 L 38 54 Z'); g.path('M 50 4 C 64 18 70 28 64 38 C 60 42 56 40 54 36 C 58 28 52 22 50 16 C 48 24 42 30 46 38 C 42 40 38 40 36 36 C 32 26 40 16 50 4 Z'); });
  I('Royal & civic', 'lighthouse', 'Lighthouse', g => { g.poly([[38, 34], [62, 34], [68, 90], [32, 90]]); g.rect(36, 22, 28, 12, 2); g.path('M 34 22 L 66 22 L 50 10 Z'); g.rect(24, 90, 52, 6, 2); g.cut(() => { g.poly([[37, 48], [63, 48], [64, 56], [36, 56]]); g.poly([[35, 66], [65, 66], [66, 74], [34, 74]]); g.rect(44, 25, 12, 6, 1); }); g.poly([[64, 26], [98, 14], [98, 38]]); g.poly([[36, 26], [2, 14], [2, 38]]); });
  I('Royal & civic', 'wings', 'Wings', g => { g.mirror(() => { g.poly([[54, 40], [97, 22], [95, 31], [56, 48]]); g.poly([[54, 46], [99, 37], [96, 45], [56, 53]]); g.poly([[54, 52], [96, 54], [92, 61], [55, 58]]); g.poly([[54, 57], [88, 71], [82, 76], [53, 62]]); }); g.diamond(50, 50, 6, 12); });
  I('Royal & civic', 'keys', 'Crossed keys', g => { for (const a of [-.75, .75]) g.rot(50, 50, a, () => { g.circS(50, 16, 10, 4.5); g.rect(47, 26, 6, 66); g.rect(53, 78, 10, 5, 1); g.rect(53, 86, 8, 5, 1); }); });

  I('Industry', 'anvil', 'Anvil', g => { g.path('M 4 30 L 70 30 L 96 22 L 92 36 Q 76 44 70 50 L 66 62 L 76 70 L 76 80 L 24 80 L 24 70 L 34 62 L 30 46 Q 14 44 4 30 Z'); g.rect(18, 82, 64, 8, 2); });
  I('Industry', 'pickaxe', 'Pickaxe', g => { g.rot(50, 50, -.6, () => { g.rect(46.5, 18, 7, 78, 3); g.path('M 6 30 Q 50 2 94 30 Q 50 16 6 30 Z'); g.rect(43, 16, 14, 10, 2); }); });
  I('Industry', 'wrench', 'Wrench', g => { g.rot(50, 50, -.78, () => { g.rect(45, 30, 10, 54, 4); g.circ(50, 22, 16); g.cut(() => g.rect(44, 4, 12, 18)); g.circ(50, 88, 9); g.cut(() => g.circ(50, 88, 4)); }); });
  I('Industry', 'tools', 'Hammer & wrench', g => { g.rot(50, 50, .78, () => { g.rect(46, 26, 8, 66, 3); g.rect(30, 10, 40, 18, 3); }); g.rot(50, 50, -.78, () => { g.rect(45, 30, 10, 54, 4); g.circ(50, 22, 15); g.cut(() => g.rect(44, 5, 12, 17)); }); });
  I('Industry', 'factory', 'Factory', g => { g.path('M 6 94 L 6 50 L 30 36 L 30 50 L 54 36 L 54 50 L 78 36 L 78 94 Z'); g.rect(80, 14, 12, 80); g.cut(() => { for (let i = 0; i < 3; i++) g.rect(12 + i * 22, 64, 12, 10, 1); }); g.circ(86, 8, 4); g.circ(80, 4, 3); });
  I('Industry', 'cogs', 'Twin cogs', g => { g.gear(36, 58, 30, 23, 10); g.cut(() => g.circ(36, 58, 9)); g.gear(70, 30, 22, 16, 8); g.cut(() => g.circ(70, 30, 6)); });

  const R0 = (g) => g.circS(50, 50, 30, 4.5);
  I('Line symbols', 'lhalf', 'Half-lit world', g => { R0(g); g.path('M 50 22 A 28 28 0 0 1 50 78 Z'); });
  I('Line symbols', 'ldouble', 'Double ring', g => { R0(g); g.circS(50, 50, 24, 2.6); });
  I('Line symbols', 'ldots', 'Ring & flanking dots', g => { R0(g); g.circ(8, 50, 3.6); g.circ(92, 50, 3.6); });
  I('Line symbols', 'lbands', 'Banded world', g => { R0(g); [40, 50, 60].forEach(y => { const dx = Math.sqrt(26 * 26 - (y - 50) ** 2); g.line([[50 - dx, y], [50 + dx, y]], 3.6); }); });
  I('Line symbols', 'lhorizon', 'Horizon line', g => { R0(g); g.cut(() => g.rect(0, 46, 100, 8)); g.line([[2, 50], [98, 50]], 4.5); });
  I('Line symbols', 'lsplit', 'Split world', g => { R0(g); g.cut(() => g.rect(45, 0, 10, 100)); g.line([[50, 10], [50, 90]], 4.5); });
  I('Line symbols', 'lwinds', 'Wind world', g => { R0(g); g.spath('M 30 42 L 58 42 C 66 42 66 32 58 32 C 52 32 52 38 56 38', 3.4); g.spath('M 28 52 L 66 52 C 76 52 76 64 66 64 C 60 64 60 58 64 58', 3.4); g.line([[32, 62], [50, 62]], 3.4); });
  I('Line symbols', 'lmoon', 'World & moon', g => { g.circS(42, 50, 28, 4.5); g.circS(76, 58, 13, 4); });
  I('Line symbols', 'lslash', 'Hatched world', g => { R0(g); g.clip(50, 50, 27, () => { for (const q of [112, 126, 140, 154]) g.line([[q - 92, 92], [92, q - 92]], 3.4); }); });
  I('Line symbols', 'lcore', 'Ring & core', g => { R0(g); g.circ(50, 50, 8); });
  I('Line symbols', 'ltri', 'Ring & delta', g => { R0(g); g.line([[50, 30], [68, 62], [32, 62], [50, 30]], 3.6); });
  I('Line symbols', 'lorbit', 'Orbit', g => { g.circS(50, 50, 18, 4.5); g.rot(50, 50, -.4, () => g.ringE(50, 50, 40, 14, 3)); g.circ(86, 36, 4); });
  I('Line symbols', 'lsprout', 'Sprouting world', g => { R0(g); g.line([[50, 78], [50, 34]], 3.4); g.spath('M 50 58 C 40 54 36 46 36 36', 3.4); g.spath('M 50 58 C 60 54 64 46 64 36', 3.4); g.spath('M 50 68 C 34 64 28 54 28 46', 3); g.spath('M 50 68 C 66 64 72 54 72 46', 3); });
  I('Line symbols', 'lwave', 'Tide world', g => { R0(g); g.spath('M 22 52 C 30 42 38 42 44 50 C 50 58 58 58 64 50 C 70 42 76 44 78 48', 3.6); });
  I('Line symbols', 'lcross', 'Quartered ring', g => { R0(g); g.line([[50, 24], [50, 76]], 3.4); g.line([[24, 50], [76, 50]], 3.4); });
  I('Line symbols', 'leclipse', 'Inner crescent', g => { R0(g); g.path('M 50 28 A 22 22 0 1 0 50 72 A 16 22 0 1 1 50 28 Z'); });
})();
const ICON_OPTS = ICON_CATS.flatMap(cat => Object.entries(ICONS).filter(([, v]) => v.cat === cat).map(([k, v]) => [k, `${cat} · ${v.label}`]));

/* drawing helper: works in a 100×100 box on context x, filling with the current fillStyle */
function glyphHelper(x) {
  const g = {
    poly(p) { x.beginPath(); p.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.closePath(); x.fill(); },
    sym(half) { const p = half.concat(half.slice(1, -1).reverse().map(([a, b]) => [100 - a, b])); g.poly(p); },
    circ(cx, cy, r) { x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.fill(); },
    circS(cx, cy, r, w = 3) { x.lineWidth = w; x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.stroke(); },
    ell(cx, cy, rx, ry, rot = 0) { x.beginPath(); x.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2); x.fill(); },
    ringE(cx, cy, rx, ry, w) { x.lineWidth = w; x.beginPath(); x.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); x.stroke(); },
    rect(a, b, w, h, r = 0) { x.beginPath(); if (r) rr(x, a, b, w, h, r); else x.rect(a, b, w, h); x.fill(); },
    line(p, w = 3) { x.lineWidth = w; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath(); p.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.stroke(); },
    arcS(cx, cy, r, a0, a1, w = 3) { x.lineWidth = w; x.lineCap = 'round'; x.beginPath(); x.arc(cx, cy, r, a0, a1); x.stroke(); },
    path(d) { x.fill(new Path2D(d)); },
    spath(d, w) { x.lineWidth = w; x.lineCap = 'round'; x.lineJoin = 'round'; x.stroke(new Path2D(d)); },
    star(cx, cy, n, ro, ri, rot = -Math.PI / 2) { x.beginPath(); for (let i = 0; i < n * 2; i++) { const a = rot + i * Math.PI / n, r = i % 2 ? ri : ro; x.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } x.closePath(); x.fill(); },
    hex(cx, cy, r) { x.beginPath(); for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; x.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } x.closePath(); x.fill(); },
    diamond(cx, cy, rx, ry) { g.poly([[cx, cy - ry], [cx + rx, cy], [cx, cy + ry], [cx - rx, cy]]); },
    gear(cx, cy, ro, ri, n) { x.beginPath(); for (let i = 0; i < n; i++) { const b = i * Math.PI * 2 / n, d = Math.PI / n; for (const [a, r] of [[b - d * .55, ri], [b - d * .35, ro], [b + d * .35, ro], [b + d * .55, ri]]) x.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } x.closePath(); x.fill(); },
    spiral(cx, cy, r0, r1, turns, w, taper) { const n = 80; for (let i = 0; i < n; i++) { const t0 = i / n, t1 = (i + 1) / n, a0 = t0 * turns * Math.PI * 2, a1 = t1 * turns * Math.PI * 2, q0 = r0 + (r1 - r0) * t0, q1 = r0 + (r1 - r0) * t1; x.lineWidth = taper ? w * (1 - t0 * .85) : w; x.lineCap = 'round'; x.beginPath(); x.moveTo(cx + Math.cos(a0) * q0, cy + Math.sin(a0) * q0); x.lineTo(cx + Math.cos(a1) * q1, cy + Math.sin(a1) * q1); x.stroke(); } },
    spiralLine(cx, cy, r0, r1, turns, w) { x.lineWidth = w; x.beginPath(); for (let i = 0; i <= 120; i++) { const t = i / 120, a = t * turns * Math.PI * 2, r = r0 + (r1 - r0) * t; x.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } x.stroke(); },
    mirror(f, on = true) { f(); if (!on) return; x.save(); x.translate(100, 0); x.scale(-1, 1); f(); x.restore(); },
    flip(on, f) { if (!on) return f(); x.save(); x.translate(100, 0); x.scale(-1, 1); f(); x.restore(); },
    rot(cx, cy, a, f) { x.save(); x.translate(cx, cy); x.rotate(a); x.translate(-cx, -cy); f(); x.restore(); },
    cut(f) { x.save(); x.globalCompositeOperation = 'destination-out'; f(); x.restore(); },
    clip(cx, cy, r, f) { x.save(); x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.clip(); f(); x.restore(); },
  };
  return g;
}
const _gly = { M: document.createElement('canvas'), O: document.createElement('canvas'), T: document.createElement('canvas') };
function glyphMask(icon, pw, ph, flip) {   // white icon centred in pw×ph
  const M = _gly.M; M.width = pw; M.height = ph; const x = M.getContext('2d'), s = Math.min(pw, ph) / 100;
  x.save(); x.translate((pw - 100 * s) / 2, (ph - 100 * s) / 2); x.scale(s, s); if (flip) { x.translate(100, 0); x.scale(-1, 1); }
  x.fillStyle = '#fff'; x.strokeStyle = '#fff'; const ic = ICONS[icon] || ICONS.star; try { ic.f(glyphHelper(x)); } catch (e) { }
  x.restore(); return M;
}
function tintedCopy(src, dst, fill) { dst.width = src.width; dst.height = src.height; const x = dst.getContext('2d'); x.drawImage(src, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = fill; x.fillRect(0, 0, dst.width, dst.height); x.globalCompositeOperation = 'source-over'; return dst; }

function paintMask(c, el, ov, k, maskFn) {
  const ow = el.outlineW > 0 ? el.outlineW : 0, gl = el.glow > 0 ? el.glow : 0, line = el.style === 'line', lw = line ? Math.max(.15, el.lineW || .6) : 0;
  const pm = ow + lw + gl * 1.8, pw = Math.max(8, Math.ceil((el.w + pm * 2) * k)), ph = Math.max(8, Math.ceil((el.h + pm * 2) * k)), pad = Math.round(pm * k), iw = Math.max(4, pw - pad * 2), ih = Math.max(4, ph - pad * 2);
  const M = maskFn(iw, ih), O = _gly.O; O.width = pw; O.height = ph; const o = O.getContext('2d');
  const ring = (src, r, fill) => { const T = tintedCopy(src, _gly.T, fill); const n = Math.max(12, Math.min(40, Math.round(r * 3))); for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; o.drawImage(T, pad + Math.cos(a) * r, pad + Math.sin(a) * r); } o.drawImage(T, pad, pad); };
  if (ov.ch === 'X' && ov.uv && gl) {   // emissive layer: the halo and the mark itself, in the glow colour
    o.filter = `blur(${Math.max(1, gl * k * .7)}px)`; o.drawImage(tintedCopy(M, _gly.T, el.glowColor || '#6ab0ff'), pad, pad); o.filter = 'none'; o.drawImage(tintedCopy(M, _gly.T, el.glowColor || '#6ab0ff'), pad, pad);
    c.drawImage(O, -el.w / 2 - pm, -el.h / 2 - pm, el.w + pm * 2, el.h + pm * 2); return;
  }
  if (gl && ov.ch === 'A') { o.save(); o.filter = `blur(${Math.max(1, gl * k * .8)}px)`; const T = tintedCopy(M, _gly.T, el.glowColor || '#6ab0ff'); o.globalAlpha = .9; o.drawImage(T, pad, pad); o.drawImage(T, pad, pad); o.restore(); }
  let fill = fillOf(ov, el.color);
  if (el.grad && ov.ch === 'A') { const a = (el.gangle || 0) * Math.PI / 180, cx = pw / 2, cy = ph / 2, r = Math.max(pw, ph) / 2, gr = o.createLinearGradient(cx - Math.cos(a) * r, cy - Math.sin(a) * r, cx + Math.cos(a) * r, cy + Math.sin(a) * r); gr.addColorStop(0, el.color); gr.addColorStop(1, el.color2); fill = gr; }
  if (line) {   // outline-only: dilate, then punch the original shape out
    const L = _gly.L || (_gly.L = document.createElement('canvas')); L.width = pw; L.height = ph; const l = L.getContext('2d'), T = tintedCopy(M, _gly.T, '#fff'), r = lw * k, n = Math.max(12, Math.min(40, Math.round(r * 3)));
    for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; l.drawImage(T, pad + Math.cos(a) * r, pad + Math.sin(a) * r); }
    l.globalCompositeOperation = 'destination-out'; l.drawImage(M, pad, pad); l.globalCompositeOperation = 'source-in'; l.fillStyle = fill; l.fillRect(0, 0, pw, ph); l.globalCompositeOperation = 'source-over'; o.drawImage(L, 0, 0);
  } else { if (ow > 0) ring(M, ow * k, fillOf(ov, el.outline)); o.drawImage(tintedCopy(M, _gly.T, fill), pad, pad); }
  c.drawImage(O, -el.w / 2 - pm, -el.h / 2 - pm, el.w + pm * 2, el.h + pm * 2);
}
const PAINT_DEF = { color: '#1b1d22', color2: '#7a5af0', grad: false, gangle: 90, style: 'solid', lineW: .6, outline: '#ffffff', outlineW: 0, glow: 0, glowColor: '#6ab0ff', flipX: false };
const PAINT_P = [['color', 'Colour', 'color'], ['grad', 'Gradient', 'check'], ['color2', 'Second colour', 'color', null, e => e.grad], ['gangle', 'Gradient angle', 'range', { min: 0, max: 360, step: 1 }, e => e.grad], ['style', 'Style', 'select', [['solid', 'Solid'], ['line', 'Outline only']]], ['lineW', 'Line weight (mm)', 'range', { min: .15, max: 3, step: .05 }, e => e.style === 'line'], ['outlineW', 'Outline (mm)', 'range', { min: 0, max: 3, step: .05 }, e => e.style !== 'line'], ['outline', 'Outline colour', 'color', null, e => e.outlineW > 0 && e.style !== 'line'], ['glow', 'Glow (mm)', 'range', { min: 0, max: 8, step: .1 }], ['glowColor', 'Glow colour', 'color', null, e => e.glow > 0], ['flipX', 'Mirror', 'check']];
def('glyph', 'Faction icon', { w: 32, h: 32, icon: 'wolf', ...PAINT_DEF }, [['icon', 'Icon', 'select', ICON_OPTS], ...PAINT_P],
  function (c, el, ov, k) { paintMask(c, el, ov, k, (iw, ih) => glyphMask(el.icon, iw, ih, el.flipX)); }, 'M12 3l3 6 6 1-4 4 1 7-6-3-6 3 1-7-4-4 6-1z');

/* procedural sigils: seeded, rotationally symmetric marks */
const SIGIL_STYLES = [['arcane', 'Arcane'], ['runic', 'Angular'], ['tech', 'Circuit'], ['organic', 'Organic'], ['star', 'Stellar']];
def('sigil', 'Sigil', { w: 32, h: 32, seed: 7, sym: 6, style: 'arcane', detail: 5, lw: 3.2, ring: true, color: '#1b1d22' },
  [['seed', 'Seed', 'num', { min: 1, max: 99999, step: 1 }], ['style', 'Style', 'select', SIGIL_STYLES], ['sym', 'Symmetry', 'range', { min: 2, max: 12, step: 1 }], ['detail', 'Detail', 'range', { min: 2, max: 10, step: 1 }], ['lw', 'Line weight', 'range', { min: 1, max: 8, step: .1 }], ['ring', 'Outer ring', 'check'], ['color', 'Colour', 'color']],
  function (c, el, ov, k) {
    const pw = Math.max(8, Math.ceil(el.w * k)), ph = Math.max(8, Math.ceil(el.h * k)), M = _gly.M; M.width = pw; M.height = ph; const x = M.getContext('2d'), s = Math.min(pw, ph) / 100;
    x.translate(pw / 2, ph / 2); x.scale(s, s); x.strokeStyle = x.fillStyle = '#fff'; x.lineCap = 'round'; x.lineJoin = 'round';
    const R = rng(el.seed * 7919 + 13), n = Math.max(2, el.sym | 0), wedge = Math.PI * 2 / n, lw = el.lw, P = (r, a) => [Math.cos(a - Math.PI / 2) * r, Math.sin(a - Math.PI / 2) * r];
    const parts = []; const rr0 = () => 10 + R() * 34;
    for (let i = 0; i < el.detail; i++) {
      const st = el.style, a = R() * wedge * .5, r1 = rr0(), r2 = Math.min(44, r1 + 6 + R() * 18);
      if (st === 'tech') parts.push(R() < .55 ? { t: 'path', p: [P(r1, a), P(r2, a), P(r2, a + wedge * .25 * (R() < .5 ? 1 : -1))] } : { t: 'sq', p: P(r2, a), s: 2 + R() * 3 });
      else if (st === 'runic') parts.push({ t: 'path', p: [P(r1, a), P(r2, a + (R() - .5) * .5), P(r2 - 6 - R() * 8, a + wedge * .3)] });
      else if (st === 'organic') parts.push({ t: 'curve', p: [P(r1, a), P((r1 + r2) / 2, a + wedge * .4), P(r2, a)] }, ...(R() < .4 ? [{ t: 'dot', p: P(r2 + 3, a), s: 2 + R() * 2 }] : []));
      else if (st === 'star') parts.push({ t: 'tri', p: [P(r1, a - .08), P(r2 + 4, a), P(r1, a + .08)] }, ...(R() < .5 ? [{ t: 'dot', p: P(r1 - 4, a), s: 1.6 + R() * 2 }] : []));
      else parts.push(R() < .45 ? { t: 'path', p: [P(r1, a), P(r2, a)] } : R() < .6 ? { t: 'arc', r: r1, a0: a, a1: a + wedge * (.2 + R() * .3) } : { t: 'circ', p: P(r2, a), s: 2 + R() * 4 });
    }
    const drawPart = (q) => { x.lineWidth = lw; if (q.t === 'path') { x.beginPath(); q.p.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.stroke(); } else if (q.t === 'curve') { x.beginPath(); x.moveTo(...q.p[0]); x.quadraticCurveTo(...q.p[1], ...q.p[2]); x.stroke(); } else if (q.t === 'arc') { x.beginPath(); x.arc(0, 0, q.r, q.a0 - Math.PI / 2, q.a1 - Math.PI / 2); x.stroke(); } else if (q.t === 'circ') { x.beginPath(); x.arc(q.p[0], q.p[1], q.s, 0, Math.PI * 2); x.stroke(); } else if (q.t === 'dot') { x.beginPath(); x.arc(q.p[0], q.p[1], q.s, 0, Math.PI * 2); x.fill(); } else if (q.t === 'sq') { x.fillRect(q.p[0] - q.s / 2, q.p[1] - q.s / 2, q.s, q.s); } else if (q.t === 'tri') { x.beginPath(); q.p.forEach(([a, b], i) => i ? x.lineTo(a, b) : x.moveTo(a, b)); x.closePath(); x.fill(); } };
    for (let i = 0; i < n; i++) { x.save(); x.rotate(i * wedge); parts.forEach(drawPart); x.scale(-1, 1); parts.forEach(drawPart); x.restore(); }
    x.beginPath(); x.arc(0, 0, 4 + R() * 4, 0, Math.PI * 2); x.fill();
    if (el.ring) { x.lineWidth = lw; x.beginPath(); x.arc(0, 0, 47, 0, Math.PI * 2); x.stroke(); if (R() < .6) { x.lineWidth = lw * .5; x.beginPath(); x.arc(0, 0, 42, 0, Math.PI * 2); x.stroke(); } }
    const T = tintedCopy(M, _gly.T, fillOf(ov, el.color)); c.drawImage(T, -el.w / 2, -el.h / 2, el.w, el.h);
  }, 'M12 2v20M2 12h20M5 5l14 14M19 5L5 19');
Forge.ICONS = ICONS;
