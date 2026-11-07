"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { GraphStatic } from "./GraphStatic";
import { VIEW } from "./graph-data";
import type { OverlayRefs } from "./GraphScene";

// The WebGL scene (three + R3F) is a separate chunk, fetched only when the 3D mode is chosen.
const GraphScene = dynamic(() => import("./GraphScene"), { ssr: false });

type Mode = "static" | "3d";

/** Static unless: fine pointer, ≥768px, no reduced motion, >4 cores, WebGL available. */
function canRun3D() {
  const mm = (q: string) => window.matchMedia(q).matches;
  if (mm("(prefers-reduced-motion: reduce)")) return false;
  if (!mm("(pointer: fine)") || window.innerWidth < 768) return false;
  if ((navigator.hardwareConcurrency ?? 8) <= 4) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

type LogLine = { id: number; t: number; text: string };

export function HeroGraph() {
  const wrap = useRef<HTMLDivElement>(null);
  const regionWrap = useRef<HTMLDivElement>(null);
  const region = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("static");
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [log, setLog] = useState<LogLine[]>([]);
  const overlay = useRef<OverlayRefs>({ hover: null, edgeLabels: [], approval: null, merge: null, retry: null, readout: null });
  const seq = useRef(0);

  // Choose mode after first paint, when the main thread is idle. Re-check if reduced motion is toggled.
  useEffect(() => {
    const decide = () => {
      const ok = canRun3D();
      setMode(ok ? "3d" : "static");
      if (!ok) setReady(false);
    };
    // Boot the 3D chunk only after the hero intro has played (page loaded + ~1.8s) and the
    // main thread is idle, so parsing three.js never stalls the headline/CTA reveal.
    // The static SVG is already on screen, so nothing visibly changes while we wait.
    let timer = 0;
    let idle = 0;
    const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    const schedule = () => {
      timer = window.setTimeout(() => {
        idle = ric(decide, { timeout: 3000 }) as number;
      }, 1800);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", decide);
    return () => {
      window.removeEventListener("load", schedule);
      window.clearTimeout(timer);
      if (idle) {
        if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
        else window.clearTimeout(idle);
      }
      mq.removeEventListener("change", decide);
    };
  }, []);

  // Pause rendering when the hero is off-screen.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "80px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Scroll: graph settles behind the headline (fades to 35%). Applies to SVG and canvas alike.
  useEffect(() => {
    const els = [wrap.current, regionWrap.current].filter(Boolean) as HTMLElement[];
    if (!els.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const p = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
        for (const el of els) el.style.opacity = String(1 - (1 - VIEW.scrollOpacity) * p);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const onReady = useCallback(() => setReady(true), []);
  const onLog = useCallback((text: string, t: number) => {
    setLog((prev) => [...prev.slice(-2), { id: seq.current++, t, text }]);
  }, []);

  const show3d = mode === "3d";

  return (
    <>
      {/* Full-hero layer: the canvas may draw anywhere (scroll settles it behind the headline). */}
      <div ref={wrap} className="hero-graph pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        {show3d && (
          <>
            <GraphScene overlay={overlay} region={region} active={visible} onReady={onReady} onLog={onLog} />
            {/* Overlays positioned by the scene (transform written per frame). */}
            <div className={`absolute inset-0 overflow-hidden font-mono text-[11px] leading-none transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}>
              <Tag refFn={(el) => (overlay.current.approval = el)} className="text-signal" />
              <Tag refFn={(el) => (overlay.current.merge = el)} className="text-fg-subtle" />
              <Tag refFn={(el) => (overlay.current.retry = el)} className="text-fg" />
              {[0, 1, 2, 3, 4].map((i) => (
                <Tag key={i} refFn={(el) => (overlay.current.edgeLabels[i] = el)} className="-translate-x-1/2 rounded-xs bg-ink-950/80 px-1.5 py-1 text-fg-subtle" />
              ))}
              {/* Hover label last: always above port labels. */}
              <Tag refFn={(el) => (overlay.current.hover = el)} className="z-10 -translate-x-1/2 rounded-xs border border-line-strong bg-ink-900 px-2 py-1.5 text-fg" />
            </div>
          </>
        )}
      </div>

      {/* Graph region (in flow, above the text): the graph is framed to fit here, so it never sits under the copy. */}
      <div ref={regionWrap} className="pointer-events-none mx-auto mb-6 flex w-full max-w-site flex-1 flex-col px-5 md:mb-14 md:px-10 [@media(max-height:820px)]:md:mb-8 lg:absolute lg:right-0 lg:top-[8%] lg:mb-0 lg:h-[56%] lg:w-[44%] xl:w-[50%] lg:max-w-none lg:flex-none [@media(max-height:820px)]:lg:mb-0" aria-hidden="true">
        {/* Run log + readout row (illustrative, not metrics) */}
        <div className="hidden h-14 items-start justify-between font-mono text-[11px] leading-none text-fg-subtle md:flex [@media(max-height:820px)]:h-12">
          <ol className={`flex flex-col gap-1.5 transition-opacity duration-300 ${show3d && ready ? "opacity-100" : "opacity-0"}`}>
            {log.map((l, i) => (
              <li key={l.id} style={{ opacity: 0.45 + 0.275 * (i + 3 - log.length) }}>
                <span className="tabular mr-3 text-fg-subtle/70">+{l.t.toFixed(3).padStart(6, "0")}</span>
                <span className={l.text.startsWith("run.completed") ? "text-fg" : ""}>{l.text}</span>
              </li>
            ))}
          </ol>
          <span ref={(el) => void (overlay.current.readout = el)} className="text-right" />
        </div>

        <div ref={region} className="relative min-h-[120px] flex-1 md:min-h-[clamp(170px,26svh,320px)] md:ml-[calc(25%+18px)] [@media(max-height:820px)]:min-h-[140px] lg:ml-0 lg:min-h-0 [@media(max-height:820px)]:lg:min-h-0">
          {/* Static SVG: SSR placeholder + fallback. Cross-fades out once WebGL has drawn. */}
          <div className={`absolute inset-0 transition-opacity duration-300 ${ready && show3d ? "opacity-0" : "opacity-100"}`}>
            <GraphStatic size="narrow" className="md:hidden" />
            <GraphStatic size="wide" className="hidden md:block" />
          </div>
          {/* Loader: only while the 3D chunk loads and before its first frame; never in static mode. */}
          {show3d && (
            <span
              className={`absolute bottom-0 left-0 font-mono text-[11px] leading-none text-fg-subtle transition-opacity duration-300 ${ready ? "opacity-0" : "opacity-100"}`}
            >
              booting runtime…
            </span>
          )}
        </div>
      </div>
    </>
  );
}

/** Overlay label. The scene writes `transform` (position) and text; centring uses the separate `translate` property. */
function Tag({ refFn, className = "" }: { refFn: (el: HTMLDivElement | null) => void; className?: string }) {
  return <div ref={refFn} className={`absolute left-0 top-0 whitespace-pre opacity-0 transition-opacity duration-200 will-change-transform ${className}`} />;
}
