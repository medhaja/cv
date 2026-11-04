/**
 * Motion runtime: GSAP core + ScrollTrigger + Lenis. Loaded as a separate chunk
 * after hydration (see MotionProvider), so none of it is in the initial JS.
 * Only the GSAP core and ScrollTrigger are imported; no other plugins.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

/** Offsets come from CSS (html scroll-padding-top, section scroll-margin), which Lenis honours, as native anchors do. */
const REVEAL = "main section h2, main .panel, main figure, main details, main table, main section ol > li, main section ul.grid > li, main section dl, main [data-reveal]";

/** Lenis on GSAP's ticker (one clock for Lenis + ScrollTrigger), plus smooth in-page anchors. */
export function startLenis() {
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, autoRaf: false });
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

  return {
    lenis,
    destroy() {
      document.removeEventListener("click", onClick, true);
      gsap.ticker.remove(tick);
      lenis.destroy();
    },
  };
}

/** Reveals: fade + 16px rise, 0.8s ease-out, 80ms stagger, once. Only content below the fold is hidden. */
export function startReveals() {
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
  if (!els.length) return () => {};

  // transition:none so CSS hover transitions (.lift) never smear the GSAP tween.
  gsap.set(els, { opacity: 0, y: 16, transition: "none" });
  const triggers = ScrollTrigger.batch(els, {
    start: "top 92%",
    once: true,
    onEnter: (batch) => {
      // A jump (anchor, fast scroll) can batch elements that are already above the
      // viewport: show those instantly so on-screen content never waits behind them.
      const passed = batch.filter((el) => el.getBoundingClientRect().bottom < 0);
      const inView = batch.filter((el) => !passed.includes(el));
      if (passed.length) gsap.set(passed, { opacity: 1, y: 0, clearProps: "transform,transition" });
      if (!inView.length) return;
      const stagger = inView.length <= 6 ? 0.08 : { amount: 0.4 }; // 80ms each, capped at 0.4s total
      gsap.to(inView, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", stagger, overwrite: true, clearProps: "transform,transition" });
    },
  });
  const refresh = () => ScrollTrigger.refresh();
  document.fonts?.ready.then(refresh);
  if (document.readyState !== "complete") window.addEventListener("load", refresh, { once: true });
  else refresh();

  return () => {
    window.removeEventListener("load", refresh);
    triggers.forEach((t) => t.kill());
    gsap.set(els, { clearProps: "opacity,transform,transition" });
  };
}
