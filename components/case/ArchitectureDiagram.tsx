"use client";

/**
 * §04 architecture as an animated SVG: a request packet travels
 * Clients → API → State → Execution → Effects and the run's outcome returns
 * to PostgreSQL. Captions reuse the case study's own connector text.
 *
 * - wide (≥768px): tiers as rows, hops as straight lines
 * - narrow: nodes stacked, hops routed along a left rail
 * - reduced motion: no packet; full path drawn, all hops listed
 * - pauses off-screen; pause/play control (WCAG 2.2.2)
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { caseStudy } from "@/content/site";

type Tier = (typeof caseStudy.architecture.tiers)[number];
type Pt = [number, number];
type LNode = { id: string; tier: number; title: string; sub: string; key?: boolean; x: number; y: number; w: number; h: number; lines: string[] };
type Hop = { from: string; to: string[]; caption: string; route: Pt[][] };
type Layout = { W: number; H: number; nodes: LNode[]; hops: Hop[]; faint: Pt[][]; tierLabels: { text: string; x: number; y: number }[]; connectors: { text: string; x: number; y: number; anchor: "start" | "end" }[] };

const IDS = [["webui", "sdk"], ["fastapi"], ["postgres", "redis"], ["celery", "beat"], ["providers", "tools", "sandbox"]];

/** Hop script. Captions come from the case study's connector labels and decision titles. */
function script(c: readonly string[], decisions: { title: string }[]) {
  return [
    { from: "webui", to: ["fastapi"], caption: c[0] },
    { from: "fastapi", to: ["postgres"], caption: c[1] },
    { from: "postgres", to: ["redis"], caption: c[1] },
    { from: "redis", to: ["celery"], caption: c[2] },
    { from: "celery", to: ["providers", "tools", "sandbox"], caption: c[3] },
    { from: "celery", to: ["postgres"], caption: decisions[0].title },
  ];
}

function wrap(text: string, maxChars: number) {
  const out: string[] = [];
  let line = "";
  for (const w of text.split(" ")) {
    if ((line + " " + w).trim().length > maxChars && line) {
      out.push(line);
      line = w;
    } else line = (line + " " + w).trim();
  }
  if (line) out.push(line);
  return out;
}

function layout(variant: "wide" | "narrow", tiers: readonly Tier[], connectors: readonly string[]): Layout {
  const wide = variant === "wide";
  const W = wide ? 880 : 340;
  const x0 = wide ? 112 : 18; // node area start (narrow: rail at x=6)
  const area = W - x0;
  const gap = 14;
  const subChar = wide ? 6.6 : 6.0; // mono advance at 11px / 10px
  const nodes: LNode[] = [];
  const tierLabels: Layout["tierLabels"] = [];
  const conn: Layout["connectors"] = [];
  let y = 8;

  tiers.forEach((tier, ti) => {
    if (!wide) {
      tierLabels.push({ text: tier.label, x: x0, y: y + 10 });
      y += 22;
    }
    const n = tier.nodes.length;
    const nw = wide ? (area - (n - 1) * gap) / n : area;
    const rowNodes = tier.nodes.map((nd, i) => {
      const lines = wrap(nd.sub, Math.floor((nw - 28) / subChar));
      return { nd, i, lines, h: 34 + lines.length * (wide ? 15 : 14) };
    });
    const rowH = Math.max(...rowNodes.map((r) => r.h));
    rowNodes.forEach(({ nd, i, lines, h }) => {
      const node: LNode = {
        id: IDS[ti][i],
        tier: ti,
        title: nd.title,
        sub: nd.sub,
        key: "key" in nd ? nd.key : undefined,
        x: wide ? x0 + i * (nw + gap) : x0,
        y: wide ? y : y,
        w: nw,
        h: wide ? rowH : h,
        lines,
      };
      nodes.push(node);
      if (!wide) y += h + 10;
    });
    if (wide) {
      tierLabels.push({ text: tier.label, x: 0, y: y + rowH / 2 + 4 });
      y += rowH;
    } else y -= 10;
    if (ti < connectors.length) {
      const g = wide ? 50 : 40;
      conn.push({ text: connectors[ti], x: wide ? W : x0, y: y + g / 2 + 4, anchor: wide ? "end" : "start" });
      y += g;
    }
  });
  const H = y + 8;

  const by = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const top = (n: LNode): Pt => [n.x + n.w / 2, n.y];
  const bottom = (n: LNode): Pt => [n.x + n.w / 2, n.y + n.h];
  const left = (n: LNode): Pt => [n.x, n.y + n.h / 2];
  const right = (n: LNode): Pt => [n.x + n.w, n.y + n.h / 2];
  const RAIL = 6;
  const viaRail = (a: LNode, b: LNode): Pt[] => [left(a), [RAIL, left(a)[1]], [RAIL, left(b)[1]], left(b)];

  const route = (a: LNode, b: LNode): Pt[] => {
    if (!wide) return viaRail(a, b);
    if (a.tier === b.tier) return a.x < b.x ? [right(a), left(b)] : [left(a), right(b)];
    if (b.tier < a.tier) {
      // return path: from the top of a, offset left, to the bottom of b
      const s: Pt = [a.x + a.w * 0.25, a.y];
      const e: Pt = [b.x + b.w * 0.25, b.y + b.h];
      return [s, e];
    }
    return [bottom(a), top(b)];
  };

  const hops: Hop[] = script(connectors, caseStudy.architecture.decisions).map((h) => ({
    ...h,
    route: h.to.map((t) => route(by[h.from], by[t])),
  }));
  const faint: Pt[][] = [route(by.sdk, by.fastapi)];
  return { W, H, nodes, hops, faint, tierLabels, connectors: conn };
}

/* ---------- polyline helpers ---------- */
function lengths(pts: Pt[]) {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  return { seg, total: seg.reduce((a, b) => a + b, 0) };
}
function pointAt(pts: Pt[], u: number): Pt {
  const { seg, total } = lengths(pts);
  let d = u * total;
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i] || i === seg.length - 1) {
      const k = seg[i] ? Math.min(1, d / seg[i]) : 0;
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k];
    }
    d -= seg[i];
  }
  return pts[pts.length - 1];
}
const pathD = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
const ease = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

const HOP_S = 1.1;
const REST_S = 1.6;

export function ArchitectureDiagram() {
  const { tiers, connectors } = caseStudy.architecture;
  const L = useMemo(() => ({ wide: layout("wide", tiers, connectors), narrow: layout("narrow", tiers, connectors) }), [tiers, connectors]);

  const root = useRef<HTMLDivElement>(null);
  const packets = useRef<Record<"wide" | "narrow", (SVGGElement | null)[]>>({ wide: [], narrow: [] });
  const [hop, setHop] = useState(-1);
  const [playing, setPlaying] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReduced(mq.matches);
    set();
    mq.addEventListener("change", set);
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    if (root.current) io.observe(root.current);
    return () => {
      mq.removeEventListener("change", set);
      io.disconnect();
    };
  }, []);

  const clock = useRef(0);
  useEffect(() => {
    if (reduced || !playing || !inView) return;
    let raf = 0;
    let last = performance.now();
    const n = L.wide.hops.length;
    const cycle = n * HOP_S + REST_S;
    let lastHop = -2;
    const tick = (now: number) => {
      clock.current = (clock.current + Math.min(0.1, (now - last) / 1000)) % cycle;
      last = now;
      const t = clock.current;
      const h = t < n * HOP_S ? Math.floor(t / HOP_S) : -1;
      const u = h >= 0 ? ease((t - h * HOP_S) / HOP_S) : 0;
      if (h !== lastHop) {
        lastHop = h;
        setHop(h);
      }
      (["wide", "narrow"] as const).forEach((v) => {
        packets.current[v].forEach((g, i) => {
          if (!g) return;
          const route = h >= 0 ? L[v].hops[h].route[i] : undefined;
          if (!route) {
            g.style.opacity = "0";
            return;
          }
          const [x, y] = pointAt(route, u);
          g.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
          g.style.opacity = "1";
        });
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, playing, inView, L]);

  const active = hop >= 0 ? L.wide.hops[hop] : null;
  const caption = reduced ? null : active?.caption;

  return (
    <div ref={root}>
      <div className="panel overflow-hidden p-4 md:p-6">
        {(["wide", "narrow"] as const).map((v) => (
          <Svg key={v} L={L[v]} variant={v} hop={reduced ? -1 : hop} reduced={reduced} packetRefs={packets.current[v]} />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p className="min-h-[1.5em] font-mono text-small text-fg-muted">
          {reduced ? (
            <span className="text-fg-subtle">Request path: Clients → API → State → Execution → Effects</span>
          ) : (
            <>
              <span className="tabular mr-3 text-fg-subtle">{hop >= 0 ? `${hop + 1}/${L.wide.hops.length}` : "—"}</span>{" "}
              <span className={hop >= 0 ? "text-fg" : "text-fg-subtle"}>{caption ?? "…"}</span>
            </>
          )}
        </p>
        {!reduced && (
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-pressed={!playing}
            className="btn btn-secondary min-h-9 px-3 font-mono text-[0.75rem]"
          >
            {playing ? "pause" : "play"}
            <span className="sr-only">{"\u00a0"}the request-flow animation</span>
          </button>
        )}
      </div>

      {/* Full content for assistive tech (and the source of truth for the word diff). */}
      <ol className="sr-only">
        {tiers.map((t, i) => (
          <li key={t.label}>
            {t.label}:{" "}
            {t.nodes.map((n) => (
              <span key={n.title}>
                {n.title} ({n.sub}).{" "}
              </span>
            ))}
            {i < connectors.length && <span>Then: {connectors[i]}.</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Svg({
  L,
  variant,
  hop,
  reduced,
  packetRefs,
}: {
  L: Layout;
  variant: "wide" | "narrow";
  hop: number;
  reduced: boolean;
  packetRefs: (SVGGElement | null)[];
}) {
  const wide = variant === "wide";
  const cur = hop >= 0 ? L.hops[hop] : null;
  const visited = new Set(hop >= 0 ? L.hops.slice(0, hop + 1).flatMap((h) => [h.from, ...h.to]) : []);
  const activeIds = new Set(cur ? [cur.from, ...cur.to] : []);
  const maxFan = Math.max(...L.hops.map((h) => h.route.length));

  return (
    <svg
      viewBox={`0 0 ${L.W} ${L.H}`}
      className={`h-auto w-full ${wide ? "hidden md:block" : "md:hidden"}`}
      aria-hidden="true"
      focusable="false"
    >
      {/* faint structural links */}
      {L.faint.map((r, i) => (
        <path key={`f${i}`} d={pathD(r)} fill="none" stroke="rgb(255 255 255 / 0.10)" strokeDasharray="3 4" />
      ))}
      {/* hop paths */}
      {L.hops.map((h, i) =>
        h.route.map((r, j) => {
          const on = reduced || (hop >= 0 && i <= hop);
          return (
            <path
              key={`h${i}-${j}`}
              d={pathD(r)}
              fill="none"
              stroke={i === hop ? "#ffb547" : on ? "rgb(237 237 239 / 0.35)" : "rgb(255 255 255 / 0.12)"}
              strokeWidth={i === hop ? 1.5 : 1}
              strokeDasharray={i === L.hops.length - 1 ? "4 4" : undefined}
              style={{ transition: "stroke 300ms ease" }}
            />
          );
        }),
      )}

      {/* tier labels + connector captions */}
      <g fontFamily="var(--font-mono), ui-monospace, monospace" fontSize={wide ? 11 : 10} letterSpacing="0.08em" fill="#83838c">
        {L.tierLabels.map((t) => [
          <text key={t.text} x={t.x} y={t.y}>
            {t.text.toUpperCase()}
          </text>,
          " ",
        ])}
      </g>
      <g fontFamily="var(--font-mono), ui-monospace, monospace" fontSize={wide ? 11 : 10} fill="#83838c">
        {L.connectors.map((c) => [
          <text key={c.text} x={c.x} y={c.y} textAnchor={c.anchor}>
            {c.anchor === "end" ? `${c.text} ↓` : `↓ ${c.text}`}
          </text>,
          " ",
        ])}
      </g>

      {/* nodes */}
      {L.nodes.map((n) => {
        const isActive = activeIds.has(n.id);
        const seen = reduced || visited.has(n.id);
        const stroke = isActive ? "#ffb547" : n.key ? "rgb(255 181 71 / 0.55)" : seen ? "rgb(237 237 239 / 0.30)" : "rgb(255 255 255 / 0.14)";
        return (
          <g key={n.id}>
            <rect
              x={n.x + 0.5}
              y={n.y + 0.5}
              width={n.w - 1}
              height={n.h - 1}
              rx={8}
              fill={isActive ? "#17171a" : "#0a0a0b"}
              stroke={stroke}
              style={{ transition: "stroke 300ms ease, fill 300ms ease" }}
            />
            <text x={n.x + 14} y={n.y + 22} fontSize={wide ? 13 : 12.5} fontWeight={500} fill="#ededef" fontFamily="var(--font-sans), system-ui, sans-serif">
              {n.title}
            </text>{" "}
            <text fontFamily="var(--font-mono), ui-monospace, monospace" fontSize={wide ? 11 : 10} fill="#83838c">
              {n.lines.map((line, i) => (
                <tspan key={i} x={n.x + 14} y={n.y + 22 + (wide ? 17 : 16) + i * (wide ? 15 : 14)}>
                  {line}{" "}
                </tspan>
              ))}
            </text>{" "}
          </g>
        );
      })}

      {/* packets (positioned by the animation loop) */}
      {!reduced &&
        Array.from({ length: maxFan }, (_, i) => (
          <g key={`p${i}`} ref={(el) => void (packetRefs[i] = el)} style={{ opacity: 0 }}>
            <circle r={9} fill="#ffb547" opacity={0.18} />
            <circle r={3.5} fill="#ffb547" />
          </g>
        ))}
    </svg>
  );
}
