"use client";

/**
 * Page transition (Framer Motion): 300ms cross-fade with an 8px rise between
 * home and case study. The first page load is never animated (no hidden SSR
 * content, no LCP delay); reduced motion gets no transition at all.
 */

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, type ReactNode } from "react";

let hasNavigated = false;

export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const animate = hasNavigated && !reduce;
  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
