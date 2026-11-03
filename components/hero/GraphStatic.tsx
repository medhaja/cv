import {
  EDGES,
  FIT,
  NODES,
  NODE_INDEX,
  STATIC_T,
  VIEW,
  edgeControls,
  mergeArrivals,
  nodeStatesAt,
  project,
  type NodeState,
} from "./graph-data";

/**
 * Static SVG of the workflow graph, paused on human approval.
 * - SSR placeholder for the WebGL hero (no blank-hero flash)
 * - fallback for reduced motion, touch / small screens and low-power devices
 *
 * The viewBox is the graph's projected bounds divided by FIT, so with
 * preserveAspectRatio="meet" it frames exactly like the WebGL camera does.
 * `size` only tunes tag type for the expected rendered scale.
 */
export function GraphStatic({ size, className = "" }: { size: "wide" | "narrow"; className?: string }) {
  const states = nodeStatesAt(STATIC_T);
  const pts = NODES.map((n) => project(n.pos));

  const done = (to: string) => ["completed", "waiting", "running"].includes(states[NODE_INDEX[to]]);
  const merging = EDGES.findIndex((e) => e.from === "merge" && e.to === "approval");

  const half = (i: number) => (VIEW.plate * pts[i][2]) / 2;
  const minX = Math.min(...pts.map((p, i) => p[0] - half(i))),
    maxX = Math.max(...pts.map((p, i) => p[0] + half(i))),
    minY = Math.min(...pts.map((p, i) => p[1] - half(i))),
    maxY = Math.max(...pts.map((p, i) => p[1] + half(i)));
  const vbW = (maxX - minX) / FIT.w,
    vbH = (maxY - minY) / FIT.h;
  const cx = (minX + maxX) / 2,
    cy = (minY + maxY) / 2;
  const viewBox = [cx - vbW / 2, cy - vbH / 2, vbW, vbH].map((v) => v.toFixed(4)).join(" ");
  // ≈11px type: wide regions are height-limited (~300px tall), narrow ones width-limited (~350px wide).
  const font = size === "wide" ? (11 * vbH) / 300 : (10 * vbW) / 350;

  const approval = pts[NODE_INDEX.approval];
  const merge = pts[NODE_INDEX.merge];
  const k = (p: number[]) => VIEW.plate * p[2];

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      className={`graph-static h-full w-full overflow-visible ${className}`}
      role="img"
      aria-label="Illustration of an agent workflow run: a trigger, a planning agent and a router fan out to three parallel steps, merge, then pause for human approval before a retry, a writing agent and the output."
    >
      <defs>
        <radialGradient id={`g-halo-${size}`}>
          <stop offset="0" stopColor="#ffb547" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffb547" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g fill="none" strokeLinecap="round">
        {EDGES.map((e, i) => {
          const { a, c1, c2, b } = edgeControls(e);
          const [p0, p1, p2, p3] = [a, c1, c2, b].map(project);
          const d = `M${p0[0]} ${p0[1]} C${p1[0]} ${p1[1]} ${p2[0]} ${p2[1]} ${p3[0]} ${p3[1]}`;
          const isSkipped = states[NODE_INDEX[e.to]] === "skipped";
          const lit = i === merging;
          return (
            <path
              key={i}
              d={d}
              stroke={lit ? "#ffb547" : done(e.to) ? "rgb(237 237 239 / 0.34)" : "rgb(255 255 255 / 0.12)"}
              strokeWidth={lit ? 1.5 : 1}
              strokeDasharray={isSkipped ? "3 4" : undefined}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </g>

      <circle className="graph-halo" cx={approval[0]} cy={approval[1]} r={k(approval) * 2.4} fill={`url(#g-halo-${size})`} />

      <g>
        {NODES.map((n, i) => {
          const [x, y] = pts[i];
          const s = VIEW.plate * pts[i][2];
          return <rect key={n.id} x={x - s / 2} y={y - s / 2} width={s} height={s} rx={s * 0.18} {...nodeStyle(states[i])} vectorEffect="non-scaling-stroke" />;
        })}
      </g>

      <g fontFamily="var(--font-mono), ui-monospace, monospace" fontSize={font}>
        {size === "wide" ? (
          <>
            <text x={approval[0] + k(approval) * 0.9} y={approval[1] - k(approval) * 0.9} fill="#ffb547">
              awaiting approval · 00:00:03
            </text>
            <text x={merge[0] - k(merge) * 0.9} y={merge[1] + k(merge) * 1.6} fill="#83838c" textAnchor="end">
              merge {mergeArrivals(STATIC_T)}/3
            </text>
          </>
        ) : (
          <>
            <text x={approval[0]} y={approval[1] - k(approval) * 1.1} fill="#ffb547" textAnchor="middle">
              awaiting approval
            </text>
            <text x={merge[0] - k(merge) * 0.9} y={merge[1] + k(merge) * 1.9} fill="#83838c" textAnchor="end">
              merge {mergeArrivals(STATIC_T)}/3
            </text>
          </>
        )}
      </g>
    </svg>
  );
}

function nodeStyle(state: NodeState) {
  switch (state) {
    case "completed":
      return { fill: "#2a2a2e", stroke: "#8e8e94", strokeWidth: 1 };
    case "running":
      return { fill: "#ffb547", stroke: "#ffb547", strokeWidth: 1 };
    case "waiting":
      return { fill: "#0a0a0b", stroke: "#ffb547", strokeWidth: 1.5 };
    case "skipped":
      return { fill: "#111113", stroke: "rgb(255 255 255 / 0.18)", strokeWidth: 1, strokeDasharray: "3 3" };
    default:
      return { fill: "#141416", stroke: "#303035", strokeWidth: 1 };
  }
}
