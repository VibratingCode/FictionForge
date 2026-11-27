"""Bundle src/ into a single self-contained index.html (three.js loads from jsDelivr)."""
from pathlib import Path
S = Path(__file__).parent / 'src'
head = (S / 'head.html').read_text()
parts = [(S / f).read_text() for f in ['engine.js', 'textures.js', 'qr.js', 'engine2.js', 'logo.js', 'poster_icons.js', 'logo2.js', 'poster.js', 'presets.js', 'layouts.js', 'stamps.js', 'logopresets.js', 'posterpresets.js', 'prof.js', 'ui.js']]
view = (S / 'view.mjs').read_text()
cdn = 'https://cdn.jsdelivr.net/npm/three@0.170.0'
# the import map and module preloads go in <head>, so three.js downloads while the editor script is still starting up
pre = '<script type="importmap">{"imports":{"three":"%s/build/three.module.js","three/addons/":"%s/examples/jsm/"}}</script>\n' % (cdn, cdn)
for m in ['build/three.module.js', 'examples/jsm/controls/OrbitControls.js', 'examples/jsm/postprocessing/EffectComposer.js', 'examples/jsm/postprocessing/RenderPass.js',
          'examples/jsm/postprocessing/UnrealBloomPass.js', 'examples/jsm/postprocessing/OutputPass.js', 'examples/jsm/postprocessing/ShaderPass.js', 'examples/jsm/postprocessing/BokehPass.js']:
    pre += '<link rel="modulepreload" href="%s/%s" crossorigin>\n' % (cdn, m)
assert head.count('</head>') == 1
head = head.replace('</head>', pre + '</head>')
out = head + "<script>\n(function(){\n'use strict';\n" + "\n".join(parts) + "\n})();\n</script>\n"
out += '<script type="module">\n' + view + '\n</script>\n</body>\n</html>\n'
(Path(__file__).parent / 'index.html').write_text(out)
print(f'index.html: {len(out):,} bytes')
