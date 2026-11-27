# Fiction Forge

A three.js studio for **fictional** props: ID cards and passes, faction emblems, and posters and signs, rendered in real time. A main menu at start-up (and the Menu button) switches between the three workshops; each keeps its own work.

**Live site:** https://vibratingcode.github.io/FictionForge/

## Features

- **Real-time 3D preview:** physically based materials, glossy coating, holographic overlays, UV-ink reveal under a blacklight torch, lanyard pose, depth of field, bloom, 11 lighting environments and 14 backdrops. A *Reflections / glare* slider runs from matte to mirror-gloss.
- **Substrates and finishes:** paper, PVC, polycarbonate, metal, wood, carbon, clear and smoked glass, and more. Background artwork prints as transparent ink, so the material shows through. Finishes include laser engraving, foil, embossing, ageing and wear, and gold, silver, black or glowing edges.
- **Flat editor:** layers, multi-select, align and distribute, snapping, grid and safe-area guides, undo and redo, and copy and paste.
- **20 card templates and 448 drop-in presets:** security patterns, holograms, identity blocks, frames and text styles; 200 rubber stamps and seals (office, travel entry and exit, postal marks and postmarks, genre stamps, notary, wax, foil and blind-embossed seals); 52 stickers, labels, ribbons and insignia; plus 95 full-side layouts (ID cards, badges and passes, memberships and loyalty cards, sci-fi, fantasy, noir and wasteland genres, and card backs). Layouts adapt to every card size and orientation.
- **My presets:** save any selection as your own reusable preset.
- **Photos:** colour, black-and-white, duotone, halftone and line-screen looks, plus ghost images and illustrated placeholder portraits.
- **Identity generator:** fills a card with a random fictional person. MRZ-style strips are decorative only.
- **Rubber stamps:** 15 shapes (round, oval, box, date band, hexagon, octagon, shield, starburst, triangle, entry stamp, postmark, notched ticket, notary gear, banner), 26 icons, wear, uneven ink and double strikes.
- **Faction logo maker:** a second mode (switch at the top) for emblems, with its own templates, presets and autosave. It includes 109 vector faction icons (beasts, weapons, celestial, arcane, tech, nature, royal and civic, industry, line symbols), adjustable geometric marks (concave starbursts, crescents, chevrons, diamond grids, notched triangles, horned marks, flame shards, radial blades), a procedural sigil generator, a tree-of-life generator, halftone fields, glow and outline-only styles, 32 emblems, 10 neon emblems and 12 flags. Emblem outlines include circle, shields, hexagon, octagon, diamond, banner, cog, starburst and flag, in brass, bronze, iron, enamel, leather, embroidered twill or slate.
- **Posters and signs:** a third mode for workplace-safety signs, propaganda and infographics. It has 27 fictional templates:
  - Safety signs: high voltage, anomalous zone, biohazard, radiation, PPE, restricted area, hostile fauna, days without incident, lockout tag, chemical store, eyewash and exit.
  - Propaganda and notices: constructivist, dystopian, recruitment, space age, home front, resistance, curfew notice, wanted poster, art deco and neon.
  - Infographics: a colony orientation sheet (Project Dunewright) and a polar station arrival guide.

  Mode-specific features:
  - **Elements:** signal-word headers (danger, warning, caution, notice and safety, in modern or classic style, with an optional second-language line), framed pictograms (warning triangle, prohibition, mandatory, safe condition, fire, chemical diamond and hazmat placard), hazard stripes with scuffing, adjustable sunbursts with swirl and fade, and a fire-diamond hazard rating.
  - **Infographics:** text blocks that wrap to their box, with bullets, numbered points, `*highlighted*` and `**bold**` words, up to three columns and shrink-to-fit; info cards with a coloured header bar and icon, numbered step cards, gradient panels and plain boxes; arrows in six styles; and 40 drop-in infographic parts (step rows, before-and-after panels, do-and-don't cards, header and footer bands, section headings and icon fact rows).
  - **Icons:** 100 more: 60 hazard, safety-gear and propaganda symbols, and 40 infographic pictograms such as thermometer, water drop, sandstorm, lungs, scorpion, shelter, radio and checklist.
  - **Sizes and materials:** A-series, US, 5:8 and 9:16 infographic sheets, and OSHA-size signs with four mounting holes. Materials include matte or gloss poster paper, newsprint, aged paper, painted or brushed aluminium, reflective sheeting, corrugated plastic, rusted tin (rust eats the print), wooden planks and concrete.
  - **Words and export:** a slogan and warning generator, and a print-file export at 150 or 300 dpi.
- **Fluorescent acrylic:** edge-lit acrylic in five colours. Laser engraving glows, and there are slot and corner-hole punches with cord, badge-clip or strap lanyards.
- **Real QR codes** (versions 1–10, error correction levels L, M, Q and H) and Code 128 barcodes.
- **Saving:** a design library stored in your browser (IndexedDB), autosave (photos are kept in IndexedDB, so saves stay small), and `.idforge.json` project files you can export and import.
- **Speed:** the 3D view only draws when something changes, expensive artwork is cached as pixel-exact bitmaps, and edits redraw only the layers they affect.
- **Export:** 3D beauty shots, front/back pairs, turntable videos, full-resolution flat sides and proof sheets.

## Fictional use only

Fiction Forge contains no real government templates, and the poster mode uses invented agencies and generic pictograms. The machine-readable zones (MRZ) are decorative text without valid check digits. Use it for games, film and TV props, worldbuilding, cosplay and design practice. Do not use it to imitate a real document.

## Development

The source is in `src/`. To bundle it into the single-file `index.html`, run:

```sh
python3 build.py
```

There are no other dependencies: three.js r170 loads from jsDelivr at runtime. Open `index.html` through any static server, or push to GitHub Pages.
