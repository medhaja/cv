/**
 * The hero's workflow graph, paused on human approval, as a standalone SVG
 * string in pixel space, for the build-time OG images. Same geometry and run
 * state as GraphStatic; no text (labels are placed by the caller via `anchor`).
 */
import { EDGES, NODES, NODE_INDEX, STATIC_T, VIEW, edgeControls, nodeStatesAt, project, type NodeState } from "../hero/graph-data";

const STYLE: Record<NodeState, { fill: string; stroke: string; sw: number; dash?: string }> = {
  completed: { fill: "#2a2a2e", stroke: "#8e8e94", sw: 1.25 },
  running: { fill: "#ffb547", stroke: "#ffb547", sw: 1.25 },
  waiting: { fill: "#0a0a0b", stroke: "#ffb547", sw: 2 },
  skipped: { fill: "#111113", stroke: "rgba(255,255,255,0.18)", sw: 1.25, dash: "4 4" },
  failed: { fill: "#141416", stroke: "#303035", sw: 1.25 },
  pending: { fill: "#141416", stroke: "#303035", sw: 1.25 },
};

export function graphSvg(W: number, H: number) {
  const states = nodeStatesAt(STATIC_T);
  const pts = NODES.map((n) => project(n.pos));
  const half = (i: number) => (VIEW.plate * pts[i][2]) / 2;
  const minX = Math.min(...pts.map((p, i) => p[0] - half(i))),
    maxX = Math.max(...pts.map((p, i) => p[0] + half(i))),
    minY = Math.min(...pts.map((p, i) => p[1] - half(i))),
    maxY = Math.max(...pts.map((p, i) => p[1] + half(i)));
  // Fit ("meet") the graph bounds into W×H with a small inset for the halo.
  const pad = 0.06;
  const s = Math.min((W * (1 - 2 * pad)) / (maxX - minX), (H * (1 - 2 * pad)) / (maxY - minY));
  const ox = W / 2 - ((minX + maxX) / 2) * s,
    oy = H / 2 - ((minY + maxY) / 2) * s;
  const X = (x: number) => +(ox + x * s).toFixed(2),
    Y = (y: number) => +(oy + y * s).toFixed(2);

  const done = (to: string) => ["completed", "waiting", "running"].includes(states[NODE_INDEX[to]]);
  const merging = EDGES.findIndex((e) => e.from === "merge" && e.to === "approval");

  const edges = EDGES.map((e, i) => {
    const { a, c1, c2, b } = edgeControls(e);
    const [p0, p1, p2, p3] = [a, c1, c2, b].map(project);
    const d = `M${X(p0[0])} ${Y(p0[1])} C${X(p1[0])} ${Y(p1[1])} ${X(p2[0])} ${Y(p2[1])} ${X(p3[0])} ${Y(p3[1])}`;
    const lit = i === merging;
    const stroke = lit ? "#ffb547" : done(e.to) ? "rgba(237,237,239,0.34)" : "rgba(255,255,255,0.12)";
    const dash = states[NODE_INDEX[e.to]] === "skipped" ? ' stroke-dasharray="4 5"' : "";
    return `<path d="${d}" stroke="${stroke}" stroke-width="${lit ? 2 : 1.25}"${dash}/>`;
  }).join("");

  const ap = pts[NODE_INDEX.approval];
  const apR = VIEW.plate * ap[2] * s;
  const halo = `<circle cx="${X(ap[0])}" cy="${Y(ap[1])}" r="${(apR * 2.4).toFixed(2)}" fill="url(#halo)" opacity="0.8"/>`;

  const nodes = NODES.map((n, i) => {
    const size = VIEW.plate * pts[i][2] * s;
    const st = STYLE[states[i]];
    const dash = st.dash ? ` stroke-dasharray="${st.dash}"` : "";
    return `<rect x="${(X(pts[i][0]) - size / 2).toFixed(2)}" y="${(Y(pts[i][1]) - size / 2).toFixed(2)}" width="${size.toFixed(2)}" height="${size.toFixed(2)}" rx="${(size * 0.18).toFixed(2)}" fill="${st.fill}" stroke="${st.stroke}" stroke-width="${st.sw}"${dash}/>`;
  }).join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs><radialGradient id="halo"><stop offset="0" stop-color="#ffb547" stop-opacity="0.45"/><stop offset="1" stop-color="#ffb547" stop-opacity="0"/></radialGradient></defs><g fill="none" stroke-linecap="round">${edges}</g>${halo}${nodes}</svg>`;
  return {
    src: `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`,
    /** Pixel position of the approval node (top-right corner of its plate), for the label. */
    approval: { x: X(ap[0]) + apR * 0.55, y: Y(ap[1]) - apR * 0.55 },
  };
}
