import { ImageResponse } from "next/og";
import { hero, site } from "@/content/site";
import { graphSvg } from "@/components/og/graph-svg";
import { OG, ogFonts } from "@/components/og/og-fonts";

/** Home OG image (1200×630), rendered once at build time to out/og/home.png. */
export const dynamic = "force-static";

export async function GET() {
  const G = { w: 1072, h: 250 };
  const graph = graphSvg(G.w, G.h);
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: OG.ink950, padding: "52px 64px 56px", fontFamily: "Geist", color: OG.fg, position: "relative" }}>
        {/* Frame rules, as on the site */}
        <div style={{ position: "absolute", left: 40, top: 0, bottom: 0, width: 1, background: OG.line }} />
        <div style={{ position: "absolute", right: 40, top: 0, bottom: 0, width: 1, background: OG.line }} />

        <div style={{ display: "flex", position: "relative", width: G.w, height: G.h }}>
          <img src={graph.src} width={G.w} height={G.h} alt="" />
          <div style={{ position: "absolute", left: graph.approval.x + 6, top: graph.approval.y - 22, fontFamily: "Geist Mono", fontSize: 15, color: OG.signal }}>awaiting approval</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
          <div style={{ fontSize: 26, fontWeight: 500, letterSpacing: "-0.01em" }}>{site.name}</div>
          <div style={{ fontFamily: "Instrument Serif", fontSize: 72, lineHeight: 1.02, letterSpacing: "-0.02em", marginTop: 14 }}>{hero.headline}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 30, paddingTop: 20, borderTop: `1px solid ${OG.lineStrong}`, fontFamily: "Geist Mono", fontSize: 18, color: OG.subtle, letterSpacing: "0.04em" }}>
            <div style={{ display: "flex" }}>{`${site.jobTitle} · Bengaluru`}</div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 8, height: 8, borderRadius: 8, background: OG.signal, marginRight: 12 }} />
              medhaja.me
            </div>
          </div>
        </div>
      </div>
    ),
    { ...OG.size, fonts: await ogFonts() },
  );
}
