"use client";

import { useState } from "react";
import { PauseIcon, PlayIcon } from "@phosphor-icons/react";

/** WCAG 2.2.2: anything that moves for more than 5 seconds needs a way to stop it. */
export function MarqueePause({ targetId }: { targetId: string }) {
  const [paused, setPaused] = useState(false);
  const toggle = () => {
    const next = !paused;
    setPaused(next);
    document.getElementById(targetId)?.toggleAttribute("data-paused", next);
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={paused}
      className="marquee-toggle"
    >
      {paused ? <PlayIcon aria-hidden="true" size={14} weight="fill" /> : <PauseIcon aria-hidden="true" size={14} weight="fill" />}
      <span className="sr-only">{paused ? "Play" : "Pause"} the tools strip</span>
    </button>
  );
}
