import { ViewTransition, type ReactNode } from "react";

/**
 * Route cross-fade (300ms) via React's <ViewTransition> + the browser View
 * Transitions API. Enter/exit only fire on client-side route navigations, so the
 * first page load never animates. Unsupported browsers swap instantly.
 * Keyframes/timing and the reduced-motion override live in globals.css.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-fade" exit="page-fade" default="none">
      {children}
    </ViewTransition>
  );
}
