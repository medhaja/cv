/**
 * The hero's illustrative agent-workflow graph: one Isocline-style run through
 * a 16-node DAG. Shared by the static SVG (SSR placeholder / fallback) and the
 * WebGL scene so both show the same layout and run.
 *
 * Nothing here is a metric. Run IDs and timings are illustrative.
 */

export type Kind =
  | "trigger"
  | "agent"
  | "knowledge"
  | "router"
  | "transform"
  | "parallel"
  | "tool"
  | "sandbox"
  | "merge"
  | "checkpoint"
  | "approval"
  | "retry"
  | "output";

export type GraphNode = { id: string; kind: Kind; label: string; pos: [number, number, number] };
export type PortType = "Text" | "JSON<schema>" | "Artifact<csv>";
export type GraphEdge = { from: string; to: string; type: PortType };

/** Depth is compressed so front nodes don't balloon in perspective; height keeps the graph in the top band. */
const Z_SCALE = 0.55;
const Y_SCALE = 0.8;

const RAW_NODES: GraphNode[] = [
  { id: "trigger", kind: "trigger", label: "trigger · webhook", pos: [-6.0, 0.3, 0] },
  { id: "plan", kind: "agent", label: "agent · plan", pos: [-4.5, 0.9, 1.0] },
  { id: "kb", kind: "knowledge", label: "knowledge · pgvector", pos: [-4.0, 2.4, -1.4] },
  { id: "router", kind: "router", label: "router", pos: [-2.9, 0.1, 0] },
  { id: "transform", kind: "transform", label: "transform", pos: [-1.9, -1.9, -1.2] },
  { id: "parallel", kind: "parallel", label: "parallel ×3", pos: [-1.4, 0.7, 1.2] },
  { id: "research", kind: "agent", label: "agent · research", pos: [0.2, 2.0, -0.6] },
  { id: "python", kind: "tool", label: "tool · python", pos: [0.4, 0.5, 1.6] },
  { id: "critique", kind: "agent", label: "agent · critique", pos: [0.1, -1.1, 0.2] },
  { id: "sandbox", kind: "sandbox", label: "sandbox · no network", pos: [1.0, -0.5, 3.0] },
  { id: "merge", kind: "merge", label: "merge", pos: [1.9, 0.4, 0.4] },
  { id: "checkpoint", kind: "checkpoint", label: "checkpoint", pos: [2.5, -1.6, -1.6] },
  { id: "approval", kind: "approval", label: "approval · human", pos: [3.3, 1.0, 1.0] },
  { id: "retry", kind: "retry", label: "retry · max 2", pos: [4.6, 0.1, -0.2] },
  { id: "write", kind: "agent", label: "agent · write", pos: [5.8, 0.9, 0.8] },
  { id: "output", kind: "output", label: "output", pos: [7.0, 0.2, 0] },
];

export const NODES: GraphNode[] = RAW_NODES.map((n) => ({ ...n, pos: [n.pos[0], n.pos[1] * Y_SCALE, n.pos[2] * Z_SCALE] }));

export const EDGES: GraphEdge[] = [
  { from: "trigger", to: "plan", type: "Text" },
  { from: "plan", to: "kb", type: "Text" },
  { from: "plan", to: "router", type: "JSON<schema>" },
  { from: "router", to: "parallel", type: "JSON<schema>" },
  { from: "router", to: "transform", type: "JSON<schema>" },
  { from: "parallel", to: "research", type: "Text" },
  { from: "parallel", to: "python", type: "JSON<schema>" },
  { from: "parallel", to: "critique", type: "Text" },
  { from: "python", to: "sandbox", type: "JSON<schema>" },
  { from: "research", to: "merge", type: "Text" },
  { from: "python", to: "merge", type: "Artifact<csv>" },
  { from: "critique", to: "merge", type: "Text" },
  { from: "merge", to: "checkpoint", type: "JSON<schema>" },
  { from: "merge", to: "approval", type: "JSON<schema>" },
  { from: "approval", to: "retry", type: "JSON<schema>" },
  { from: "retry", to: "write", type: "JSON<schema>" },
  { from: "write", to: "output", type: "Text" },
];

export const NODE_INDEX = Object.fromEntries(NODES.map((n, i) => [n.id, i])) as Record<string, number>;
export const edgeIndex = (from: string, to: string) => EDGES.findIndex((e) => e.from === from && e.to === to);

/** Cubic bezier control points: leave and enter horizontally, like a builder canvas. */
export function edgeControls(e: GraphEdge) {
  const a = NODES[NODE_INDEX[e.from]].pos;
  const b = NODES[NODE_INDEX[e.to]].pos;
  const dx = Math.max(Math.abs(b[0] - a[0]) * 0.5, 0.5);
  const c1: [number, number, number] = [a[0] + dx, a[1], a[2]];
  const c2: [number, number, number] = [b[0] - dx, b[1], b[2]];
  return { a, c1, c2, b };
}

export function bezier(
  p0: readonly number[],
  p1: readonly number[],
  p2: readonly number[],
  p3: readonly number[],
  t: number,
): [number, number, number] {
  const u = 1 - t;
  const w0 = u * u * u,
    w1 = 3 * u * u * t,
    w2 = 3 * u * t * t,
    w3 = t * t * t;
  return [0, 1, 2].map((k) => w0 * p0[k] + w1 * p1[k] + w2 * p2[k] + w3 * p3[k]) as [number, number, number];
}

/* ------------------------------------------------------------------ */
/* The run                                                              */
/* ------------------------------------------------------------------ */

export type NodeState = "pending" | "running" | "waiting" | "failed" | "completed" | "skipped";
export type RunEvent =
  | { t: number; kind: "node"; id: string; state: NodeState; log?: string }
  | { t: number; kind: "edge"; edge: number; dur: number }
  | { t: number; kind: "run"; state: "started" | "completed"; log: string };

const E = 0.42; // edge travel time (s)

/** One run, in seconds from start. Hand-timed so the fan-out lands out of order. */
function buildRun(): RunEvent[] {
  const ev: RunEvent[] = [];
  const node = (t: number, id: string, state: NodeState, log?: string) => ev.push({ t, kind: "node", id, state, log });
  const edge = (t: number, from: string, to: string, dur = E) => ev.push({ t, kind: "edge", edge: edgeIndex(from, to), dur });

  ev.push({ t: 0, kind: "run", state: "started", log: "run.started" });
  node(0.0, "trigger", "running", "node.started  trigger");
  node(0.3, "trigger", "completed");
  edge(0.3, "trigger", "plan");
  node(0.72, "plan", "running", "node.started  agent · plan");
  edge(0.8, "plan", "kb", 0.3);
  node(1.1, "kb", "completed", "tool.result   knowledge · 4 chunks");
  node(1.3, "plan", "completed", "node.completed agent · plan");
  edge(1.3, "plan", "router");
  node(1.72, "router", "running", "node.started  router");
  node(1.98, "router", "completed");
  node(1.98, "transform", "skipped", "branch.skipped transform");
  edge(1.98, "router", "parallel");
  node(2.4, "parallel", "running", "fan_out       ×3");
  node(2.58, "parallel", "completed");
  edge(2.58, "parallel", "research");
  edge(2.58, "parallel", "python");
  edge(2.58, "parallel", "critique");
  node(3.0, "research", "running");
  node(3.0, "python", "running");
  node(3.0, "critique", "running");
  edge(3.1, "python", "sandbox", 0.28);
  node(3.38, "sandbox", "completed", "sandbox.exit  0");
  node(3.45, "research", "completed");
  edge(3.45, "research", "merge");
  node(3.62, "critique", "completed");
  edge(3.62, "critique", "merge");
  node(3.87, "merge", "waiting", "merge.wait    1/3");
  node(3.9, "python", "completed");
  edge(3.9, "python", "merge");
  node(4.04, "merge", "waiting", "merge.wait    2/3");
  node(4.32, "merge", "running", "merge.ready   3/3");
  node(4.56, "merge", "completed");
  edge(4.56, "merge", "checkpoint", 0.3);
  node(4.86, "checkpoint", "completed", "checkpoint.saved");
  edge(4.56, "merge", "approval");
  node(4.98, "approval", "waiting", "run.waiting   approval · human");
  node(6.78, "approval", "running", "approval.granted");
  node(6.98, "approval", "completed");
  edge(6.98, "approval", "retry");
  node(7.4, "retry", "running", "node.started  retry · attempt 1");
  node(7.7, "retry", "failed", "node.failed   rate_limit · retrying");
  node(8.05, "retry", "running", "node.started  retry · attempt 2");
  node(8.35, "retry", "completed");
  edge(8.35, "retry", "write");
  node(8.77, "write", "running", "node.started  agent · write");
  node(9.2, "write", "completed");
  edge(9.2, "write", "output");
  node(9.62, "output", "running");
  node(9.85, "output", "completed");
  ev.push({ t: 9.86, kind: "run", state: "completed", log: "run.completed 15/16 nodes · 1 skipped" });
  return ev.sort((a, b) => a.t - b.t);
}

export const RUN = buildRun();
export const RUN_DURATION = 9.86;
/** Rest after completion before the next run starts. */
export const RUN_REST = 2.4;
export const MERGE_FANIN = 3;

/** Node states at time t (seconds into the run). */
export function nodeStatesAt(t: number): NodeState[] {
  const states: NodeState[] = NODES.map(() => "pending");
  for (const e of RUN) {
    if (e.t > t) break;
    if (e.kind === "node") states[NODE_INDEX[e.id]] = e.state;
  }
  return states;
}

/** Number of merge inputs that have arrived at time t. */
export function mergeArrivals(t: number) {
  let n = 0;
  for (const e of RUN) {
    if (e.kind === "edge" && EDGES[e.edge].to === "merge" && e.t + e.dur <= t) n++;
  }
  return n;
}

export const newRunId = () => "run_" + Math.random().toString(16).slice(2, 8);

/* ------------------------------------------------------------------ */
/* Camera / projection (shared so SVG and WebGL line up at rest)        */
/* ------------------------------------------------------------------ */

export const VIEW = {
  fov: 34, // vertical, degrees
  camZ: 22,
  /** World offset applied to the graph group: the top band, right of centre, clear of the headline. */
  offset: [1.8, 3.55, 0] as [number, number, number],
  /** Rounded plate size (world units). */
  plate: 0.46,
  plateDepth: 0.1,
  /** Scroll choreography over the first viewport: dolly back, drift right. */
  scrollCamZ: 32,
  scrollShiftX: 2.2,
  scrollOpacity: 0.35,
};

const F = 1 / Math.tan(((VIEW.fov / 2) * Math.PI) / 180);

/**
 * Perspective-project a world point (before group offset) into "viewport-height
 * units": (0,0) is the canvas centre and 1 unit = canvas height. Matches a
 * PerspectiveCamera at (0,0,camZ) looking down -z.
 */
export function project(p: readonly number[]): [number, number, number] {
  const x = p[0] + VIEW.offset[0];
  const y = p[1] + VIEW.offset[1];
  const z = p[2] + VIEW.offset[2];
  const k = F / (2 * (VIEW.camZ - z));
  return [x * k, -y * k, k];
}

/* ------------------------------------------------------------------ */
/* Static frame (SVG fallback): mid-run, approval waiting               */
/* ------------------------------------------------------------------ */

/** The moment the static SVG depicts: the run is paused on human approval. */
export const STATIC_T = 5.6;
