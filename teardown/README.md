# Isocline teardown drawing

Source for `public/img/isocline/isocline-stack*.svg` and `public/teardown/isocline.html`,
made with the `teardown` skill (tools/teardown, MIT, © Jakub Krehel).

```sh
cd teardown && npm install
node render-svg.cjs                                                        # SVGs for the site (out/)
node tools/teardown/scripts/build-viewer.cjs drawing.json dist/index.html  # interactive viewer
```

Then copy `out/isocline-stack.svg` and `out/isocline-stack-plain.svg` to `public/img/isocline/`,
and `dist/index.html` to `public/teardown/isocline.html`. Evidence and assumptions: `evidence.md`.
