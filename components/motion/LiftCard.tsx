"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ComponentProps } from "react";

/**
 * Card hover (Framer Motion): a 2px lift (transform only) plus a border-colour
 * change in CSS. No scale. Under reduced motion there is no lift at all (MotionConfig
 * alone would still apply the transform, just without animating it); only the border changes.
 */
export function LiftCard({ as = "div", className = "", ...rest }: { as?: "div" | "article" } & ComponentProps<typeof motion.div>) {
  const Comp = as === "article" ? motion.article : motion.div;
  const reduce = useReducedMotion();
  return (
    <Comp
      whileHover={reduce ? undefined : { y: -2 }}
      transition={{ type: "tween", duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className={`transition-colors duration-150 hover:border-line-strong focus-within:border-line-strong ${className}`}
      {...rest}
    />
  );
}
