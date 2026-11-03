"use client";

import { useEffect, useRef, useState } from "react";

type Item = { n: string; id: string; title: string };

/**
 * Sticky section nav for the case study: highlights the section under the
 * reading line (35% from the top) and fills a progress rule through §01–§06.
 */
export function ProgressNav({ items }: { items: Item[] }) {
  const [active, setActive] = useState<string | null>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const sections = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;
    let raf = 0;
    const update = () => {
      const line = window.innerHeight * 0.35;
      let current: string | null = null;
      for (const s of sections) if (s.getBoundingClientRect().top <= line) current = s.id;
      setActive(current);
      const first = sections[0].getBoundingClientRect().top + window.scrollY;
      const lastEl = sections[sections.length - 1];
      const end = lastEl.getBoundingClientRect().bottom + window.scrollY - window.innerHeight * 0.65;
      const p = Math.min(1, Math.max(0, (window.scrollY + line - first) / Math.max(1, end - first)));
      if (bar.current) bar.current.style.transform = `scaleY(${p})`;
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
  }, [items]);

  return (
    <nav aria-label="Case study sections" className="sticky top-24">
      <div className="relative pl-4">
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-line" />
        <span
          ref={bar}
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-px origin-top bg-signal transition-transform duration-150"
          style={{ transform: "scaleY(0)" }}
        />
        <ol className="flex flex-col gap-1">
          {items.map((s) => {
            const on = s.id === active;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={on ? "true" : undefined}
                  className={`flex gap-3 py-1.5 text-small transition-colors duration-150 hover:text-fg ${on ? "text-fg" : "text-fg-muted"}`}
                >
                  <span className={`font-mono ${on ? "text-signal" : "text-fg-subtle"}`}>{s.n}</span>
                  {s.title}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
