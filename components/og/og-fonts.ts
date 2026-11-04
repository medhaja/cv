import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Fonts for the build-time OG images (satori needs TTF/OTF, not woff2). */
export async function ogFonts() {
  const geist = join(process.cwd(), "node_modules/geist/dist/fonts");
  const [serif, sans, sansMedium, mono] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/InstrumentSerif-Regular.ttf")),
    readFile(join(geist, "geist-sans/Geist-Regular.ttf")),
    readFile(join(geist, "geist-sans/Geist-Medium.ttf")),
    readFile(join(geist, "geist-mono/GeistMono-Regular.ttf")),
  ]);
  return [
    { name: "Instrument Serif", data: serif, weight: 400 as const, style: "normal" as const },
    { name: "Geist", data: sans, weight: 400 as const, style: "normal" as const },
    { name: "Geist", data: sansMedium, weight: 500 as const, style: "normal" as const },
    { name: "Geist Mono", data: mono, weight: 400 as const, style: "normal" as const },
  ];
}

export const OG = {
  size: { width: 1200, height: 630 },
  ink950: "#0a0a0b",
  ink900: "#111113",
  line: "rgba(255,255,255,0.07)",
  lineStrong: "rgba(255,255,255,0.14)",
  fg: "#ededef",
  muted: "#a3a3ab",
  subtle: "#83838c",
  signal: "#ffb547",
};
