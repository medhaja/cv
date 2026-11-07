"use client";

import { useEffect } from "react";

/**
 * One delegated pointer listener for every `.glow-card`: writes the pointer
 * position into --mx / --my so the card's border and wash follow the cursor.
 * Fine pointers only; touch devices keep the static card.
 */
export function Spotlight() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let raf = 0;
    let last: { el: HTMLElement; x: number; y: number } | null = null;
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(".glow-card") as HTMLElement | null;
      if (!el) return;
      last = { el, x: e.clientX, y: e.clientY };
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!last) return;
        const r = last.el.getBoundingClientRect();
        last.el.style.setProperty("--mx", `${last.x - r.left}px`);
        last.el.style.setProperty("--my", `${last.y - r.top}px`);
      });
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
