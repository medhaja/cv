"use client";

import { useEffect, useRef } from "react";

/**
 * Counts the leading integer of `value` up from zero the first time it scrolls
 * into view ("233" → 0…233, "10/10" → 0…10 + "/10", "6+" → 0…6 + "+").
 * The value is rendered once, as plain text, so copy-paste, reader mode and
 * search engines see "233", never a duplicate. Frames are written straight to
 * the DOM; the element is not a live region, so screen readers aren't spammed.
 */
export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const match = value.match(/^(\d+)(.*)$/);
    if (!el || !match || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return; // already visible: leave the real value
    const target = parseInt(match[1], 10);
    const suffix = match[2];
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        el.textContent = `0${suffix}`; // reset only now, so the real value is in the DOM until it is seen
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1400);
          el.textContent = `${Math.round((1 - Math.pow(1 - t, 4)) * target)}${suffix}`;
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = value;
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
