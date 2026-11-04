import type { ComponentProps } from "react";

/**
 * Card hover, CSS only (`.lift` in globals.css): a 2px lift plus a border-colour
 * change, 200ms ease-out. No scale. Under reduced motion only the border changes.
 */
export function LiftCard({ as = "div", className = "", ...rest }: { as?: "div" | "article" } & ComponentProps<"div">) {
  const Comp = as;
  return <Comp className={`lift ${className}`} {...rest} />;
}
