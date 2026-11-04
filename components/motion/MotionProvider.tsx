"use client";

/**
 * Site-wide motion (Stage 4). Everything here is skipped under
 * prefers-reduced-motion: native scrolling, no reveals, no hover transforms.
 *
 * - Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger and Lenis
 *   share one clock.
 * - In-page anchor links: smooth scroll with a header offset, then move focus
 *   to the target and update the hash. The skip link is left native so focus
 *   moves to <main> exactly as the browser does it.
 * - Reveals: ScrollTrigger.batch → fade + 16px rise, 0.8s, ease-out, 80ms
 *   stagger, once. Only content that starts below the fold is hidden, so
 *   nothing visible on load ever blinks out (and no-JS shows everything).
 */

import { MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

/** Offsets come from CSS (html scroll-padding-top, section scroll-margin), which Lenis honours, as native anchors do. */
const REVEAL = "main section h2, main .panel, main figure, main details, main table, main section ol > li, main section ul.grid > li, main section dl, main [data-reveal]";
const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function MotionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  /* ---------- Lenis ---------- */
  useEffect(() => {
    if (prefersReduced()) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, autoRaf: false });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // In-page anchors (capture phase, so this runs before next/link's handler).
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.classList.contains("skip-link") || a.target === "_blank") return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, {
        onComplete: () => {
          // Update the hash only after the scroll: Next's patched history.pushState must not interrupt Lenis mid-flight.
          if (location.hash !== url.hash) history.pushState(history.state, "", url.hash);
          if (!target.hasAttribute("tabindex") && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(target.tagName)) target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        },
      });
    };
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      gsap.ticker.remove(tick);
      lenis.destroy();
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
    const all = [...document.querySelectorAll<HTMLElement>(REVEAL)].filter((el) => !el.closest("#hero"));
    // Animate the outermost candidate only, and only if it starts below the fold.
    const set = new Set(all);
    const els = all.filter((el) => {
      let p = el.parentElement;
      while (p) {
        if (set.has(p)) return false;
        p = p.parentElement;
      }
      return el.getBoundingClientRect().top > window.innerHeight * 0.92;
    });
    if (!els.length) return;

    gsap.set(els, { opacity: 0, y: 16 });
    const triggers = ScrollTrigger.batch(els, {
      start: "top 92%",
      once: true,
      onEnter: (batch) => {
        // A jump (anchor, fast scroll) can batch elements that are already above the
        // viewport: show those instantly so on-screen content never waits behind them.
        const passed = batch.filter((el) => el.getBoundingClientRect().bottom < 0);
        const inView = batch.filter((el) => !passed.includes(el));
        if (passed.length) gsap.set(passed, { opacity: 1, y: 0, clearProps: "transform" });
        if (!inView.length) return;
        const stagger = inView.length <= 6 ? 0.08 : { amount: 0.4 }; // 80ms each, capped at 0.4s total
        gsap.to(inView, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", stagger, overwrite: true, clearProps: "transform" });
      },
    });
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      triggers.forEach((t) => t.kill());
      gsap.set(els, { clearProps: "opacity,transform" });
    };
  }, [pathname]);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
