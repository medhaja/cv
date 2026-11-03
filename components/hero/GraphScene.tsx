"use client";

/**
 * WebGL workflow graph (lazy-loaded; see HeroGraph). One draw call per layer:
 * instanced plates, instanced outlines, instanced glows, instanced pulses and
 * one merged LineSegments for every edge. Labels are DOM overlays positioned by
 * projecting world points each frame, so no extra text/HTML libraries ship.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import {
  EDGES,
  MERGE_FANIN,
  NODES,
  NODE_INDEX,
  RUN,
  RUN_DURATION,
  RUN_REST,
  VIEW,
  bezier,
  edgeControls,
  mergeArrivals,
  newRunId,
  nodeStatesAt,
  type NodeState,
} from "./graph-data";

export type OverlayRefs = {
  hover: HTMLDivElement | null;
  edgeLabels: (HTMLDivElement | null)[];
  approval: HTMLDivElement | null;
  merge: HTMLDivElement | null;
  retry: HTMLDivElement | null;
  readout: HTMLSpanElement | null;
};

type Props = {
  overlay: RefObject<OverlayRefs>;
  active: boolean;
  onReady: () => void;
  onLog: (line: string, t: number, runId: string) => void;
};

export default function GraphScene({ overlay, active, onReady, onLog }: Props) {
  return (
    <Canvas
      flat
      dpr={[1, 2]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: VIEW.fov, position: [0, 0, VIEW.camZ], near: 0.1, far: 100 }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      aria-hidden="true"
    >
      <Graph overlay={overlay} onReady={onReady} onLog={onLog} />
    </Canvas>
  );
}

/* ------------------------------------------------------------------ */

const C = {
  pendingFill: new THREE.Color("#141416"),
  pendingEdge: new THREE.Color("#303035"),
  doneFill: new THREE.Color("#2a2a2e"),
  doneEdge: new THREE.Color("#8e8e94"),
  signal: new THREE.Color("#ffb547"),
  void: new THREE.Color("#0a0a0b"),
  fg: new THREE.Color("#ededef"),
  muted: new THREE.Color("#83838c"),
  skippedFill: new THREE.Color("#111113"),
  skippedEdge: new THREE.Color("#26262a"),
  lineIdle: new THREE.Color("#2a2a2e"),
  lineDone: new THREE.Color("#5c5c62"),
};

const N = NODES.length;
const TRAIL = 7;
const MAX_PULSES = 8;
const SEG = 28; // samples per edge curve
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

function targetColors(state: NodeState, id: string, breath: number) {
  switch (state) {
    case "running":
      return [C.signal, C.signal, 1] as const;
    case "waiting":
      return id === "approval" ? ([C.void, C.signal, 0.35 + 0.35 * breath] as const) : ([C.void, C.muted, 0] as const);
    case "failed":
      return [C.void, C.fg, 0] as const;
    case "completed":
      return [C.doneFill, C.doneEdge, 0] as const;
    case "skipped":
      return [C.skippedFill, C.skippedEdge, 0] as const;
    default:
      return [C.pendingFill, C.pendingEdge, 0] as const;
  }
}

function glowTexture() {
  const s = 128;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grad.addColorStop(0, "rgba(255,255,255,0.9)");
  grad.addColorStop(0.35, "rgba(255,255,255,0.28)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function Graph({ overlay, onReady, onLog }: Omit<Props, "active">) {
  const group = useRef<THREE.Group>(null);
  const fill = useRef<THREE.InstancedMesh>(null);
  const outline = useRef<THREE.InstancedMesh>(null);
  const glow = useRef<THREE.InstancedMesh>(null);
  const pulses = useRef<THREE.InstancedMesh>(null);
  const lines = useRef<THREE.LineSegments>(null);
  const { camera, size, gl } = useThree();

  // Pointer: tracked on window (the canvas sits under the hero text and takes no events).
  const pointer = useRef({ x: 0, y: 0, inside: false, dirty: false, cx: 0, cy: 0 });
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      Object.assign(pointer.current, { cx: e.clientX, cy: e.clientY, dirty: true });
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  /* ---------- static resources ---------- */
  const res = useMemo(() => {
    const plate = new RoundedBoxGeometry(VIEW.plate, VIEW.plate, VIEW.plateDepth, 3, VIEW.plate * 0.16);
    const quad = new THREE.PlaneGeometry(1, 1);
    const dot = new THREE.CircleGeometry(0.5, 16);
    const tex = glowTexture();

    // Edge geometry: SEG segments per edge (pairs of points). Skipped branch is dashed (every other segment).
    const positions: number[] = [];
    const ranges: [number, number][] = [];
    EDGES.forEach((e) => {
      const { a, c1, c2, b } = edgeControls(e);
      const dashed = e.to === "transform";
      const start = positions.length / 3;
      for (let s = 0; s < SEG; s++) {
        if (dashed && s % 2 === 1) continue;
        positions.push(...bezier(a, c1, c2, b, s / SEG), ...bezier(a, c1, c2, b, (s + 1) / SEG));
      }
      ranges.push([start, positions.length / 3]);
    });
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    const colors = new Float32Array(positions.length);
    lineGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    return {
      plate,
      quad,
      dot,
      tex,
      lineGeo,
      ranges,
      fillMat: new THREE.MeshBasicMaterial({ color: "#ffffff" }),
      outlineMat: new THREE.MeshBasicMaterial({ color: "#ffffff", side: THREE.BackSide }),
      glowMat: new THREE.MeshBasicMaterial({
        color: "#ffffff",
        map: tex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
      pulseMat: new THREE.MeshBasicMaterial({
        color: "#ffb547",
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
      lineMat: new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.95 }),
    };
  }, []);

  useEffect(
    () => () => {
      res.plate.dispose();
      res.quad.dispose();
      res.dot.dispose();
      res.tex.dispose();
      res.lineGeo.dispose();
      res.fillMat.dispose();
      res.outlineMat.dispose();
      res.glowMat.dispose();
      res.pulseMat.dispose();
      res.lineMat.dispose();
    },
    [res],
  );

  /* ---------- mutable run state (no React re-renders per frame) ---------- */
  const sim = useRef({
    t: 0,
    cursor: 0,
    runId: newRunId(),
    fillCol: NODES.map(() => C.pendingFill.clone()),
    edgeCol: NODES.map(() => C.pendingEdge.clone()),
    glowAmt: NODES.map(() => 0),
    hovered: -1,
    edgeMask: "",
    tagText: { approval: "", merge: "", retry: "", hover: "" },
    frame: 0,
    cam: new THREE.Vector3(0, 0, VIEW.camZ),
  });

  /* ---------- initial instance transforms ---------- */
  useEffect(() => {
    const m = new THREE.Matrix4();
    NODES.forEach((n, i) => {
      m.makeTranslation(n.pos[0], n.pos[1], n.pos[2]);
      fill.current!.setMatrixAt(i, m);
      m.compose(new THREE.Vector3(...n.pos), new THREE.Quaternion(), new THREE.Vector3(1.14, 1.14, 1.3));
      outline.current!.setMatrixAt(i, m);
      fill.current!.setColorAt(i, C.pendingFill);
      outline.current!.setColorAt(i, C.pendingEdge);
      glow.current!.setColorAt(i, C.signal);
    });
    for (const mesh of [fill.current!, outline.current!]) {
      mesh.instanceMatrix.needsUpdate = true;
      mesh.instanceColor!.needsUpdate = true;
      mesh.computeBoundingSphere();
    }
    // Ready after the first frames have drawn: lets the SVG placeholder cross-fade out.
    let raf = requestAnimationFrame(() => (raf = requestAnimationFrame(onReady)));
    return () => cancelAnimationFrame(raf);
  }, [onReady]);

  /* ---------- per frame ---------- */
  const tmp = useMemo(
    () => ({
      m: new THREE.Matrix4(),
      v: new THREE.Vector3(),
      q: new THREE.Quaternion(),
      s: new THREE.Vector3(),
      c: new THREE.Color(),
      ndc: new THREE.Vector2(),
    }),
    [],
  );

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.1);
    const S = sim.current;
    const time = state.clock.elapsedTime;
    S.t += dt;
    S.frame++;

    // Loop the run.
    if (S.t > RUN_DURATION + RUN_REST) {
      S.t = 0;
      S.cursor = 0;
      S.runId = newRunId();
    }
    const T = S.t;

    // Emit log lines for events crossed this frame.
    while (S.cursor < RUN.length && RUN[S.cursor].t <= T) {
      const e = RUN[S.cursor];
      if ("log" in e && e.log) onLog(e.kind === "run" && e.state === "started" ? `run.started   ${S.runId}` : e.log, e.t, S.runId);
      S.cursor++;
    }

    const states = nodeStatesAt(T);
    const breath = 0.5 + 0.5 * Math.sin(time * Math.PI); // 0.5 Hz
    const k = 1 - Math.exp(-dt * 12);

    // Nodes: colours + glow.
    const f = fill.current!,
      o = outline.current!,
      g = glow.current!;
    for (let i = 0; i < N; i++) {
      const [tf, te, tg] = targetColors(states[i], NODES[i].id, breath);
      S.fillCol[i].lerp(tf, k);
      tmp.c.copy(te);
      if (S.hovered === i) tmp.c.lerp(C.fg, 0.6);
      S.edgeCol[i].lerp(tmp.c, k);
      S.glowAmt[i] += (tg - S.glowAmt[i]) * k;
      f.setColorAt(i, S.fillCol[i]);
      o.setColorAt(i, S.edgeCol[i]);

      const p = NODES[i].pos;
      const sc = VIEW.plate * 3.4 * S.glowAmt[i];
      tmp.m.compose(tmp.v.set(p[0], p[1], p[2] - 0.08), tmp.q.identity(), tmp.s.set(sc, sc, 1));
      g.setMatrixAt(i, tmp.m);
    }
    f.instanceColor!.needsUpdate = true;
    o.instanceColor!.needsUpdate = true;
    g.instanceMatrix.needsUpdate = true;

    // Pulses: a short comet per active edge.
    const pm = pulses.current!;
    let slot = 0;
    for (const e of RUN) {
      if (e.kind !== "edge" || T < e.t || T >= e.t + e.dur || slot >= MAX_PULSES) continue;
      const u = easeInOut((T - e.t) / e.dur);
      const { a, c1, c2, b } = edgeControls(EDGES[e.edge]);
      for (let j = 0; j < TRAIL; j++) {
        const uj = u - j * 0.035;
        const sc = uj < 0 ? 0 : (j === 0 ? 0.13 : 0.085) * (1 - j / TRAIL);
        const p = bezier(a, c1, c2, b, clamp01(uj));
        tmp.m.compose(tmp.v.set(p[0], p[1], p[2] + 0.06), tmp.q.identity(), tmp.s.set(sc, sc, 1));
        pm.setMatrixAt(slot * TRAIL + j, tmp.m);
      }
      slot++;
    }
    for (let i = slot * TRAIL; i < MAX_PULSES * TRAIL; i++) {
      tmp.m.makeScale(0, 0, 0);
      pm.setMatrixAt(i, tmp.m);
    }
    pm.instanceMatrix.needsUpdate = true;

    // Edges: brighten once traversed (only rewrite colours when the set changes).
    let mask = "";
    for (let i = 0; i < EDGES.length; i++) {
      const traversed = RUN.some((e) => e.kind === "edge" && e.edge === i && T >= e.t + e.dur);
      mask += traversed ? "1" : "0";
    }
    if (mask !== S.edgeMask) {
      S.edgeMask = mask;
      const col = res.lineGeo.getAttribute("color") as THREE.BufferAttribute;
      res.ranges.forEach(([a, b], i) => {
        const c = mask[i] === "1" ? C.lineDone : C.lineIdle;
        for (let v = a; v < b; v++) col.setXYZ(v, c.r, c.g, c.b);
      });
      col.needsUpdate = true;
    }

    // Pointer → NDC relative to the canvas; raycast the plates for hover.
    const P = pointer.current;
    if (P.dirty) {
      P.dirty = false;
      const r = gl.domElement.getBoundingClientRect();
      P.inside = P.cx >= r.left && P.cx <= r.right && P.cy >= r.top && P.cy <= r.bottom;
      P.x = P.inside ? ((P.cx - r.left) / r.width) * 2 - 1 : 0;
      P.y = P.inside ? -((P.cy - r.top) / r.height) * 2 + 1 : 0;
    }
    if (P.inside) {
      raycaster.setFromCamera(tmp.ndc.set(P.x, P.y), camera);
      const hit = raycaster.intersectObject(f, false)[0];
      S.hovered = hit?.instanceId ?? -1;
    } else S.hovered = -1;

    // Camera: scroll dolly + cursor parallax. Group: slow drift.
    const scroll = clamp01(window.scrollY / Math.max(1, window.innerHeight));
    const se = easeInOut(scroll);
    S.cam.set(P.x * 0.35, P.y * 0.22, VIEW.camZ + (VIEW.scrollCamZ - VIEW.camZ) * se);
    camera.position.lerp(S.cam, 0.08);
    camera.lookAt(0, 0, 0);

    const gr = group.current!;
    gr.position.set(VIEW.offset[0] + VIEW.scrollShiftX * se, VIEW.offset[1] + Math.sin(time * 0.25) * 0.08, VIEW.offset[2]);
    gr.rotation.set(Math.sin(time * 0.09) * 0.04, Math.sin(time * 0.13) * 0.1, 0);
    gr.updateMatrixWorld();

    // DOM overlays.
    const ov = overlay.current;
    if (!ov) return;
    const place = (el: HTMLElement | null, nodeId: string | [number, number, number], visible: boolean, dx = 0, dy = 0) => {
      if (!el) return;
      if (!visible) {
        if (el.style.opacity !== "0") el.style.opacity = "0";
        return;
      }
      const p = typeof nodeId === "string" ? NODES[NODE_INDEX[nodeId]].pos : nodeId;
      tmp.v.set(p[0], p[1], p[2]).applyMatrix4(gr.matrixWorld).project(camera);
      const x = ((tmp.v.x + 1) / 2) * size.width + dx;
      const y = ((1 - tmp.v.y) / 2) * size.height + dy;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      el.style.opacity = "1";
    };
    const setText = (el: HTMLElement | null, key: keyof typeof S.tagText, text: string) => {
      if (el && S.tagText[key] !== text) {
        S.tagText[key] = text;
        el.textContent = text;
      }
    };

    const ai = NODE_INDEX.approval;
    const waitStart = RUN.find((e) => e.kind === "node" && e.id === "approval" && e.state === "waiting")!.t;
    setText(ov.approval, "approval", `awaiting approval · 00:00:0${Math.max(0, Math.floor(T - waitStart))}`);
    place(ov.approval, "approval", states[ai] === "waiting", 22, -30);

    const mi = NODE_INDEX.merge;
    setText(ov.merge, "merge", `merge ${Math.min(mergeArrivals(T), MERGE_FANIN)}/${MERGE_FANIN}`);
    place(ov.merge, "merge", states[mi] === "waiting" || states[mi] === "running", 18, 22);

    const ri = NODE_INDEX.retry;
    const failedOnce = RUN.some((e) => e.kind === "node" && e.id === "retry" && e.state === "failed" && e.t <= T);
    setText(ov.retry, "retry", states[ri] === "failed" ? "attempt 1 failed · retrying" : "attempt 2");
    place(ov.retry, "retry", failedOnce && (states[ri] === "failed" || states[ri] === "running"), 18, 22);

    // Hover: node label + typed ports on connected edges.
    const h = S.hovered;
    if (h >= 0) setText(ov.hover, "hover", `${NODES[h].label} · ${states[h]}`);
    place(ov.hover, h >= 0 ? NODES[h].id : "trigger", h >= 0, 0, -34);
    const connected = h >= 0 ? EDGES.map((e, i) => [e, i] as const).filter(([e]) => e.from === NODES[h].id || e.to === NODES[h].id) : [];
    ov.edgeLabels.forEach((el, j) => {
      const c = connected[j];
      if (!c) return place(el, "trigger", false);
      const { a, c1, c2, b } = edgeControls(c[0]);
      if (el && el.textContent !== c[0].type) el.textContent = c[0].type;
      // Sit toward the far end of the edge so labels clear the hovered node and its tag.
      const along = c[0].from === NODES[h].id ? 0.62 : 0.38;
      place(el, bezier(a, c1, c2, b, along), true, 0, -10);
    });

    if (ov.readout && S.frame % 4 === 0) ov.readout.textContent = `${S.runId} · t+${T.toFixed(2).padStart(5, "0")}s`;
  });

  return (
    <group ref={group}>
      <lineSegments ref={lines} geometry={res.lineGeo} material={res.lineMat} />
      <instancedMesh ref={glow} args={[res.quad, res.glowMat, N]} frustumCulled={false} />
      <instancedMesh ref={outline} args={[res.plate, res.outlineMat, N]} />
      <instancedMesh ref={fill} args={[res.plate, res.fillMat, N]} />
      <instancedMesh ref={pulses} args={[res.dot, res.pulseMat, MAX_PULSES * TRAIL]} frustumCulled={false} />
    </group>
  );
}
