import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { OG, ogFonts } from "@/components/og/og-fonts";

/**
 * Case-study OG image (1200×630), rendered once at build time to out/og/isocline.png.
 * Uses the approved run-approval crop only (no dashboard, no approval JSON).
 */
export const dynamic = "force-static";

export async function GET() {
  const shot = await readFile(join(process.cwd(), "public/img/isocline/run-approval-1460.png"));
  const src = `data:image/png;base64,${shot.toString("base64")}`;
  const W = 1072,
    H = Math.round((W * 564) / 1460);
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: OG.ink950, padding: "52px 64px 0", fontFamily: "Geist", color: OG.fg, position: "relative" }}>
        <div style={{ position: "absolute", left: 40, top: 0, bottom: 0, width: 1, background: OG.line }} />
        <div style={{ position: "absolute", right: 40, top: 0, bottom: 0, width: 1, background: OG.line }} />

        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Geist Mono", fontSize: 17, color: OG.subtle, letterSpacing: "0.06em" }}>
          <div style={{ display: "flex", color: OG.signal }}>CASE STUDY</div>
          <div style={{ display: "flex" }}>medhaja.me/isocline</div>
        </div>
        <div style={{ display: "flex", flexShrink: 0, fontFamily: "Instrument Serif", fontSize: 64, lineHeight: 1.04, letterSpacing: "-0.02em", marginTop: 20, width: 900 }}>
          Isocline — a durable runtime for agent workflows
        </div>

        {/* Browser-frame panel bleeding off the bottom edge */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 36, flexShrink: 0, width: W + 2, border: `1px solid ${OG.lineStrong}`, borderBottom: "none", borderRadius: "10px 10px 0 0", background: OG.ink900, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", height: 30, padding: "0 14px", borderBottom: `1px solid ${OG.line}` }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: 8, background: OG.lineStrong, marginRight: 6 }} />
            ))}
            <div style={{ fontFamily: "Geist Mono", fontSize: 12, color: OG.subtle, marginLeft: 12 }}>Isocline</div>
          </div>
          <img src={src} width={W} height={H} alt="" />
        </div>
      </div>
    ),
    { ...OG.size, fonts: await ogFonts() },
  );
}
