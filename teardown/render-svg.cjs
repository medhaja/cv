// Renders the model to standalone SVGs (exploded + annotated) for the website, outside the viewer.
const fs = require('node:fs');
globalThis.self = globalThis;
globalThis.TechnicalGeometry = require('./tools/teardown/assets/geometry.js');
globalThis.TechnicalProjection = require('./tools/teardown/assets/projection.js');
require('./model.js');
const model = self.DrawingModels['isocline-stack'];
const variants = {
  exploded: {explosion: 1, fitExplosion: 1, isolated: null, fill: true, annotate: true},
  assembled: {explosion: 0, fitExplosion: 0, isolated: null, fill: true, annotate: false},
  plain: {explosion: 1, fitExplosion: 1, isolated: null, fill: true, annotate: false},
};
fs.mkdirSync('out', {recursive: true});
for (const [name, opts] of Object.entries(variants)) {
  const r = model({gap: 26}, opts);
  fs.writeFileSync(`out/${name}.markup.svg`, r.markup);
  console.log(name, r.markup.length, 'bytes');
}

// Wrap for the dark website: ink in the site's foreground, the key part (PostgreSQL) in signal amber.
const wrap = (markup, {title}) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 297" role="img" aria-labelledby="t d">
<title id="t">${title}</title>
<desc id="d">Concept drawing of Isocline's architecture as an exploded stack. Top to bottom: Web UI and SDK/CLI clients; the FastAPI API; PostgreSQL with pgvector (the authoritative state, highlighted) and Redis; Celery workers and Beat; and the effects tier of model providers, tools and MCP servers, and the Python sandbox. Sizes are illustrative.</desc>
<style>
  path[data-line-role]{fill:none;stroke:#cfcfd4;stroke-linecap:round;stroke-linejoin:round}
  path[data-line-role="outline"]{stroke-width:.5}
  path[data-line-role="edge"]{stroke-width:.32}
  path[data-line-role="detail"]{stroke-width:.22;stroke:#8a8a92}
  path[data-line-role="texture"]{stroke-width:.16;stroke:#6a6a72}
  path[data-line-role="axis"]{stroke-width:.2;stroke-dasharray:2 1;stroke:#6a6a72}
  path[data-fill]{fill:#141416}
  path[data-fill="postgres"]{fill:rgba(255,181,71,.16)}
  g[data-item="postgres"] path[data-line-role]{stroke:#ffb547}
  [data-annotations] path, [data-annotations] circle, [data-annotations] line{stroke:#5a5a62;stroke-width:.2;fill:none}
  [data-annotations] circle[data-ink-fill], [data-annotations] [data-ink-fill]{fill:#8a8a92;stroke:none}
  text[data-annotation]{font-family:"Geist Mono",ui-monospace,monospace;font-size:4.4px;letter-spacing:.08em;fill:#a1a1a8}
</style>
${markup}
</svg>`;
fs.writeFileSync('out/isocline-stack.svg', wrap(fs.readFileSync('out/exploded.markup.svg','utf8'), {title: 'Isocline, layer by layer'}));
fs.writeFileSync('out/isocline-stack-assembled.svg', wrap(fs.readFileSync('out/assembled.markup.svg','utf8'), {title: 'Isocline, assembled'}));
fs.writeFileSync('out/isocline-stack-plain.svg', wrap(fs.readFileSync('out/plain.markup.svg','utf8'), {title: 'Isocline, layer by layer'}));
console.log('wrapped');
