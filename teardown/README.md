# Isocline teardown drawing

Source for `public/img/isocline/isocline-stack*.svg` and `public/teardown/isocline.html`,
made with the `teardown` skill (tools/teardown, MIT, © Jakub Krehel).

```sh
cd teardown && npm install
node render-svg.cjs                                                        # SVGs for the site (out/)
TEARDOWN_NO_PDF=1 node tools/teardown/scripts/build-viewer.cjs drawing.json dist/index.html  # interactive viewer (site build: no PDF export)
```

Then copy `out/isocline-stack.svg` and `out/isocline-stack-plain.svg` to `public/img/isocline/`,
and `dist/index.html` to `public/teardown/isocline.html`. Evidence and assumptions: `evidence.md`.

The site build omits PDF export: jsPDF references third-party CDNs, which the Pages workflow's script check (rightly) rejects.
