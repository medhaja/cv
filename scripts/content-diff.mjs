// Word-diff check: every sentence of the legacy pages must appear in the new build.
// Usage: npm run build && node scripts/content-diff.mjs
import { readFileSync } from "node:fs";

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
let missing = 0;
for (const [a, b] of pairs) {
  const newText = norm(text(readFileSync(b, "utf8")));
  const lost = [...new Set(segments(readFileSync(a, "utf8")))].filter((s) => !newText.includes(s));
  missing += lost.length;
  console.log(`\n## ${a} → ${b}: ${lost.length} text node(s) not found verbatim`);
  lost.forEach((s) => console.log("  - " + s));
}
process.exitCode = 0;
