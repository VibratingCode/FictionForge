"""Bundle src/ into a single self-contained index.html (three.js loads from jsDelivr)."""
from pathlib import Path
S = Path(__file__).parent / 'src'
head = (S / 'head.html').read_text()
parts = [(S / f).read_text() for f in ['engine.js', 'qr.js', 'engine2.js', 'logo.js', 'logo2.js', 'presets.js', 'layouts.js', 'stamps.js', 'logopresets.js', 'ui.js']]
view = (S / 'view.mjs').read_text()
cdn = 'https://cdn.jsdelivr.net/npm/three@0.170.0'
out = head + "<script>\n(function(){\n'use strict';\n" + "\n".join(parts) + "\n})();\n</script>\n"
out += '<script type="importmap">{"imports":{"three":"%s/build/three.module.js","three/addons/":"%s/examples/jsm/"}}</script>\n' % (cdn, cdn)
out += '<script type="module">\n' + view + '\n</script>\n</body>\n</html>\n'
(Path(__file__).parent / 'index.html').write_text(out)
print(f'index.html: {len(out):,} bytes')
