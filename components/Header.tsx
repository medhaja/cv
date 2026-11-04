"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/content/site";

/** Home sections → nav item. Capabilities has no nav item, so nothing is highlighted there. */
const SECTION_TO_NAV: Record<string, string | null> = {
  work: "/#work",
  experience: "/#experience",
  capabilities: null,
  about: "/#about",
  education: "/#about",
  contact: "/#contact",
};

function useCurrentSection(enabled: boolean) {
  const [current, setCurrent] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) {
      setCurrent(null);
      return;
    }
    const ids = Object.keys(SECTION_TO_NAV);
    let raf = 0;
    const update = () => {
      const line = window.innerHeight * 0.35;
      let found: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) found = id;
      }
      setCurrent(found ? SECTION_TO_NAV[found] : null);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [enabled]);
  return current;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const current = useCurrentSection(pathname === "/");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header" style={{ viewTransitionName: "site-header" }}>
      <nav aria-label="Primary" className="mx-auto flex h-14 w-full max-w-site items-center justify-between px-5 md:px-10">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          {site.brand}
        </Link>

        <button
          type="button"
          className="nav-toggle md:hidden"
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="label">{open ? "Close" : "Menu"}</span>
        </button>

        <ul id="nav-menu" className={`nav-links ${open ? "is-open" : ""}`}>
          {site.nav.map((item) => {
            const on = current === item.href;
            return (
              <li key={item.href} className="relative">
                <Link href={item.href} aria-current={on ? "true" : undefined} onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
