// Post-build for static hosting (GitHub Pages has no rewrites).
// Next 16's export writes segment payloads nested, e.g. isocline/__next.isocline/__PAGE__.txt,
// while the client router fetches the flat name isocline/__next.isocline.__PAGE__.txt.
// Copy each nested segment file to its flat sibling so client navigation and prefetch don't 404.
import { readdirSync, statSync, copyFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = "out";
let n = 0;
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (!statSync(p).isDirectory()) continue;
    if (name.startsWith("__next.")) flatten(p, dir, name);
    else walk(p);
  }
}
function flatten(segDir, parent, segName) {
  const files = [];
  const collect = (d) => {
    for (const f of readdirSync(d)) {
      const p = join(d, f);
      statSync(p).isDirectory() ? collect(p) : files.push(p);
    }
  };
  collect(segDir);
  for (const f of files) {
    const flat = `${segName}.${relative(segDir, f).split(/[\/]/).join(".")}`;
    copyFileSync(f, join(parent, flat));
    n++;
  }
}
walk(root);
console.log(`flatten-rsc: wrote ${n} flat segment file(s)`);
