"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/content/site";

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header">
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
          {site.nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
