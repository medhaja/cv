"use client";

/**
 * Site-wide motion. Everything is skipped under prefers-reduced-motion: native
 * scrolling, no reveals, no hover transforms.
 *
 * GSAP, ScrollTrigger and Lenis live in ./motion-runtime, imported after
 * hydration so they stay out of the initial JS. Until it arrives the page
 * scrolls natively and everything is visible; reveals only ever hide content
 * that is below the fold at that moment, so nothing on screen blinks out.
 */

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import type Lenis from "lenis";

type Runtime = typeof import("./motion-runtime");
let runtime: Promise<Runtime> | null = null;
const loadRuntime = () => (runtime ??= import("./motion-runtime"));
const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function MotionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  /* ---------- Lenis ---------- */
  useEffect(() => {
    if (prefersReduced()) return;
    let cancelled = false;
    let destroy: (() => void) | undefined;
    loadRuntime().then((m) => {
      if (cancelled) return;
      const s = m.startLenis();
      lenisRef.current = s.lenis;
      destroy = s.destroy;
    });
    return () => {
      cancelled = true;
      destroy?.();
      lenisRef.current = null;
    };
  }, []);

  /* ---------- Route change: land at the hash (or the top) instantly ---------- */
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    const id = location.hash.slice(1);
    const el = id ? document.getElementById(decodeURIComponent(id)) : null;
    if (el) lenis.scrollTo(el, { immediate: true, force: true });
    else lenis.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  /* ---------- Reveals ---------- */
  useEffect(() => {
    if (prefersReduced()) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    loadRuntime().then((m) => {
      if (!cancelled) cleanup = m.startReveals();
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [pathname]);

  return <>{children}</>;
}
