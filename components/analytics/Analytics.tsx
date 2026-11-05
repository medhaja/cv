"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";
import { countPage, currentConsent, enabled, loadGoatCounter, loadGa, trackLinkClick, trackPageView } from "@/lib/analytics";

/** Runs after the page is interactive (load + idle), so neither script blocks rendering. */
function afterInteractive(fn: () => void) {
  const run = () => (window.requestIdleCallback ? window.requestIdleCallback(fn, { timeout: 3000 }) : window.setTimeout(fn, 1));
  if (document.readyState === "complete") run();
  else window.addEventListener("load", run, { once: true });
}

export function Analytics() {
  const pathname = usePathname();
  const first = useRef(true);

  // Load once: GoatCounter always; GA4 only if consent was already granted.
  useEffect(() => {
    if (!enabled) return;
    afterInteractive(() => {
      loadGoatCounter();
      if (currentConsent() === "granted") loadGa();
    });
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (a) trackLinkClick(a);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Page views. GoatCounter: every path, first load included (queued until the script
  // arrives). GA4: client-side route changes only; loadGa sends the first one.
  // A layout effect runs at commit; passive effects are held until a View Transition
  // finishes, which would delay (or, on a quick second navigation, mislabel) the hit.
  useLayoutEffect(() => {
    if (!enabled) return;
    countPage(pathname);
    if (first.current) {
      first.current = false;
      return;
    }
    // Let the new route's <title> commit first. Not cancelled on a quick next
    // navigation: every route the visitor reached is reported once.
    window.setTimeout(() => trackPageView(pathname), 0);
  }, [pathname]);

  return null;
}
