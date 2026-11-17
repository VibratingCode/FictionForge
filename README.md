# ID Forge

A three.js studio for designing **fictional** ID cards, badges and passes, from rough paper IDs to smoked-glass, translucent, holographic cards rendered in real time.

**Live site:** https://vibratingcode.github.io/FictionForge/

## Features

- **Real-time 3D preview:** physically based materials, glossy coating, holographic overlays, UV-ink reveal under a blacklight torch, lanyard pose, depth of field, bloom, 11 lighting environments and 14 backdrops. A *Reflections / glare* slider runs from matte to mirror-gloss.
- **Substrates and finishes:** paper, PVC, polycarbonate, metal, wood, carbon, clear and smoked glass, and more. Background artwork prints as transparent ink, so the material shows through. Finishes include laser engraving, foil, embossing, ageing and wear, and gold, silver, black or glowing edges.
- **Flat editor:** layers, multi-select, align and distribute, snapping, grid and safe-area guides, undo and redo, and copy and paste.
- **20 card templates and 196 drop-in presets:** security patterns, holograms, seals, identity blocks, frames and text styles, plus 95 full-side layouts (ID cards, badges and passes, memberships and loyalty cards, sci-fi, fantasy, noir and wasteland genres, and card backs). Layouts adapt to every card size and orientation.
- **My presets:** save any selection as your own reusable preset.
- **Photos:** colour, black-and-white, duotone, halftone and line-screen looks, plus ghost images and illustrated placeholder portraits.
- **Identity generator:** fills a card with a random fictional person. MRZ-style strips are decorative only.
- **Real QR codes** (versions 1–10, error correction levels L, M, Q and H) and Code 128 barcodes.
- **Saving:** a design library stored in your browser (IndexedDB), autosave, and `.idforge.json` project files you can export and import.
- **Export:** 3D beauty shots, front/back pairs, turntable videos, full-resolution flat sides and proof sheets.

## Fictional use only

ID Forge contains no real government templates. The machine-readable zones (MRZ) are decorative text without valid check digits. Use it for games, film and TV props, worldbuilding, cosplay and design practice. Do not use it to imitate a real document.

## Development

The source is in `src/`. To bundle it into the single-file `index.html`, run:

```sh
python3 build.py
```

There are no other dependencies: three.js r170 loads from jsDelivr at runtime. Open `index.html` through any static server, or push to GitHub Pages.
