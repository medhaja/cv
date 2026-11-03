import {
  EDGES,
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
 * variant "camera": same projection as the 3D scene (desktop, crossfades into it)
 * variant "fit": viewBox fitted to the graph (mobile, sits above the headline)
 */
export function GraphStatic({ variant, className = "" }: { variant: "camera" | "fit"; className?: string }) {
  const states = nodeStatesAt(STATIC_T);
  const pts = NODES.map((n) => project(n.pos));

  // Edge state: traversed edges into completed/waiting nodes read as done.
  const done = (to: string) => ["completed", "waiting", "running"].includes(states[NODE_INDEX[to]]);
  const merging = EDGES.findIndex((e) => e.from === "merge" && e.to === "approval");

  let viewBox = "-0.5 -0.5 1 1";
  let fitFont = 0;
  if (variant === "fit") {
    const pad = 0.05;
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const minX = Math.min(...xs) - pad,
      maxX = Math.max(...xs) + pad;
    const minY = Math.min(...ys) - pad * 1.6,
      maxY = Math.max(...ys) + pad;
    viewBox = `${minX.toFixed(3)} ${minY.toFixed(3)} ${(maxX - minX).toFixed(3)} ${(maxY - minY).toFixed(3)}`;
    fitFont = ((maxX - minX) * 10) / 350;
  }

  const approval = pts[NODE_INDEX.approval];
  const merge = pts[NODE_INDEX.merge];

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      className={`graph-static h-full w-full overflow-visible ${className}`}
      role="img"
      aria-label="Illustration of an agent workflow run: a trigger, a planning agent and a router fan out to three parallel steps, merge, then pause for human approval before a retry, a writing agent and the output."
    >
      <defs>
        <radialGradient id="g-halo">
          <stop offset="0" stopColor="#ffb547" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffb547" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Edges */}
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

      {/* Approval halo (breathes via CSS unless reduced motion) */}
      <circle className="graph-halo" cx={approval[0]} cy={approval[1]} r={VIEW.plate * approval[2] * 2.4} fill="url(#g-halo)" />

      {/* Nodes */}
      <g>
        {NODES.map((n, i) => {
          const [x, y, k] = pts[i];
          const s = VIEW.plate * k;
          return <rect key={n.id} x={x - s / 2} y={y - s / 2} width={s} height={s} rx={s * 0.18} {...nodeStyle(states[i])} vectorEffect="non-scaling-stroke" />;
        })}
      </g>

      {/* Tags */}
      {variant === "camera" ? (
        <g fontFamily="var(--font-mono), ui-monospace, monospace" fontSize={0.0135} letterSpacing="0.02em">
          <text x={approval[0] + VIEW.plate * approval[2] * 0.9} y={approval[1] - VIEW.plate * approval[2] * 0.9} fill="#ffb547">
            awaiting approval · 00:00:03
          </text>
          <text x={merge[0] + VIEW.plate * merge[2] * 0.8} y={merge[1] + VIEW.plate * merge[2] * 1.5} fill="#83838c">
            merge {mergeArrivals(STATIC_T)}/3
          </text>
        </g>
      ) : (
        // Mobile: the SVG renders ~350px wide, so size type to ≈10px and centre it on the node.
        <g fontFamily="var(--font-mono), ui-monospace, monospace" fontSize={fitFont} textAnchor="middle">
          <text x={approval[0]} y={approval[1] - VIEW.plate * approval[2] * 1.1} fill="#ffb547">
            awaiting approval
          </text>
          <text x={merge[0] - VIEW.plate * merge[2] * 0.9} y={merge[1] + VIEW.plate * merge[2] * 1.9} fill="#83838c" textAnchor="end">
            merge {mergeArrivals(STATIC_T)}/3
          </text>
        </g>
      )}
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
