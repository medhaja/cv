// Word-diff check: every sentence of the legacy pages must appear in the new build.
// Usage: npm run build && node scripts/content-diff.mjs
// legacy/ was deleted after the final check (Stage 6); its text nodes are frozen in
// scripts/legacy-baseline.json. `--snapshot` rewrites that file from legacy/ (only if it exists).
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const text = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->|<head[\s\S]*?<\/head>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ")
    .replace(/[↗→←]/g, " ")
    .replace(/\s+/g, " ");
const norm = (s) => s.replace(/\s+/g, " ").replace(/\s([,.;:)])/g, "$1").replace(/\(\s/g, "(").trim();
// Split legacy HTML into its text nodes; each one must appear verbatim in the new page.
const segments = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->|<head[\s\S]*?<\/head>/gi, " ")
    .split(/<[^>]+>/)
    .map((t) => norm(text(t)))
    .filter((t) => t.length > 1);

const pairs = [
  ["legacy/index.html", "out/index.html"],
  ["legacy/isocline.html", "out/isocline/index.html"],
];
const BASELINE = "scripts/legacy-baseline.json";
if (process.argv.includes("--snapshot")) {
  const snap = Object.fromEntries(pairs.map(([a]) => [a, [...new Set(segments(readFileSync(a, "utf8")))]]));
  writeFileSync(BASELINE, JSON.stringify(snap, null, 2) + "\n");
  console.log(`wrote ${BASELINE}`);
  process.exit(0);
}
const baseline = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, "utf8")) : {};
/** Legacy text nodes: from legacy/ while it exists, otherwise from the frozen baseline. */
const legacySegments = (a) => (existsSync(a) ? [...new Set(segments(readFileSync(a, "utf8")))] : baseline[a] ?? []);
const changes = JSON.parse(readFileSync("scripts/content-changes.json", "utf8"));
let unexpected = 0;
for (const [a, b] of pairs) {
  const newText = norm(text(readFileSync(b, "utf8")));
  const allowed = changes.removed[a] ?? {};
  const legacy = legacySegments(a);
  if (!legacy.length) throw new Error(`No legacy text for ${a}: restore ${BASELINE}`);
  const lost = legacy.filter((s) => !newText.includes(s));
  const expected = lost.filter((s) => s in allowed);
  const surprise = lost.filter((s) => !(s in allowed));
  unexpected += surprise.length;
  console.log(`
## ${a} → ${b}`);
  console.log(`  intentional removals/rewrites: ${expected.length}`);
  expected.forEach((s) => console.log(`    ✓ "${s}" (${allowed[s]})`));
  console.log(`  unexpected: ${surprise.length}`);
  surprise.forEach((s) => console.log(`    ✗ "${s}"`));
}
for (const [file, list] of Object.entries(changes.added)) {
  const t = norm(text(readFileSync(file, "utf8")));
  const absent = list.filter((s) => !t.includes(s));
  unexpected += absent.length;
  console.log(`
## owner-supplied additions in ${file}: ${list.length - absent.length}/${list.length} present verbatim`);
  absent.forEach((s) => console.log(`    ✗ missing: "${s}"`));
}
console.log(unexpected ? `\nFAIL: ${unexpected} unexpected difference(s)` : "\nOK: only intentional changes");
process.exitCode = unexpected ? 1 : 0;

// Strings that must NOT appear (owner rules, e.g. no 70% cost figure; hidden links stay hidden).
for (const [file, list] of Object.entries(changes.forbidden ?? {})) {
  const t = norm(text(readFileSync(file, "utf8")));
  const lower = t.toLowerCase();
  const found = list.filter((s) => lower.includes(s.toLowerCase()));
  console.log(`\n## forbidden strings in ${file}: ${found.length} found`);
  found.forEach((s) => console.log(`    ✗ present: "${s}"`));
  if (found.length) process.exitCode = 1;
}
if (process.exitCode) console.log("\nFAIL: forbidden or unexpected content");
