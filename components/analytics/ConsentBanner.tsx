"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { OPEN_SETTINGS_EVENT, currentConsent, enabled, setConsent, type Consent } from "@/lib/analytics";

/**
 * Cookie banner for Google Analytics only (GoatCounter is cookieless and always on).
 * - Bottom of the screen, small, two equal-weight buttons; not a modal, no focus trap.
 * - Shown when no choice is stored, or when "Cookie settings" is used in the footer.
 * - Never covers primary CTAs: while it would overlap an element marked
 *   [data-consent-avoid] (hero CTAs, case-study actions) it stays hidden, and appears
 *   once they scroll clear.
 * - Slide-in only without prefers-reduced-motion (CSS: .consent).
 */
export function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [choice, setChoice] = useState<Consent | null>(null);
  const ref = useRef<HTMLElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const fromSettings = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const stored = currentConsent();
    setChoice(stored);
    if (!stored) setOpen(true);
    const onOpen = (e: Event) => {
      returnFocus.current = (e as CustomEvent<HTMLElement | null>).detail ?? null;
      fromSettings.current = true;
      setChoice(currentConsent());
      setOpen(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, onOpen);
  }, []);

  // Hide while overlapping a protected element (checked on scroll/resize, rAF-throttled).
  useEffect(() => {
    if (!open) return;
    let raf = 0;
    const check = () => {
      const el = ref.current;
      if (!el) return;
      // Where the banner sits when shown (its layout box is unaffected by the hidden state's transform).
      const b = el.getBoundingClientRect();
      const pad = 8;
      const hit = [...document.querySelectorAll<HTMLElement>("[data-consent-avoid]")].some((a) =>
        [...a.children].some((c) => {
          const r = c.getBoundingClientRect();
          return r.width > 0 && r.left < b.right + pad && r.right > b.left - pad && r.top < b.bottom + pad && r.bottom > b.top - pad;
        }),
      );
      setBlocked(hit && !fromSettings.current);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [open]);

  // Opened from "Cookie settings": move focus into the banner.
  useEffect(() => {
    if (open && fromSettings.current) ref.current?.querySelector<HTMLElement>("button")?.focus();
  }, [open]);

  const decide = useCallback((v: Consent) => {
    setConsent(v);
    setChoice(v);
    setOpen(false);
    if (fromSettings.current) returnFocus.current?.focus();
    fromSettings.current = false;
  }, []);

  if (!enabled || !open) return null;

  return (
    <section
      ref={ref}
      aria-label="Cookie preferences"
      className={`consent fixed inset-x-3 bottom-3 z-40 rounded-md border border-line-strong bg-ink-900 p-4 shadow-[0_20px_40px_-20px_rgb(0_0_0/0.8)] sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-sm ${blocked ? "is-blocked" : ""}`}
      inert={blocked}
    >
      <p className="label !text-fg-muted">cookies</p>
      <p className="mt-2 text-small text-fg-muted">
        Allow Google Analytics cookies? Visits are counted anonymously with GoatCounter either way.
        {choice && <span className="text-fg-subtle"> Current choice: {choice === "granted" ? "accepted" : "declined"}.</span>}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <button type="button" className="btn btn-secondary min-h-10 font-mono" onClick={() => decide("granted")}>
          Accept
        </button>
        <button type="button" className="btn btn-secondary min-h-10 font-mono" onClick={() => decide("denied")}>
          Decline
        </button>
      </div>
    </section>
  );
}

/** Footer list item that reopens the banner. Rendered only where analytics run (production builds). */
export function CookieSettingsButton() {
  if (!enabled) return null;
  return (
    <li>
      <button
        type="button"
        className="link font-mono"
        onClick={(e) => window.dispatchEvent(new CustomEvent(OPEN_SETTINGS_EVENT, { detail: e.currentTarget }))}
      >
        Cookie settings
      </button>
    </li>
  );
}
