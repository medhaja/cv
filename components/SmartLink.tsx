import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Props = Omit<ComponentProps<"a">, "href"> & {
  href: string;
  external?: boolean;
  children: ReactNode;
  /** Show the ↗ marker for external links (default true). */
  arrow?: boolean;
};

const isExternal = (href: string) => /^https?:\/\//.test(href);

/**
 * One link primitive for the whole site:
 * - internal routes → next/link (client navigation)
 * - hash / mailto / files → plain <a>
 * - external → <a rel="noopener"> with a mono ↗ marker
 */
export function SmartLink({ href, external, children, arrow = true, ...rest }: Props) {
  const ext = external ?? isExternal(href);
  if (ext) {
    return (
      <a href={href} rel="noopener" {...rest}>
        {children}
        {arrow && (
          <span aria-hidden="true" className="ext-arrow">
            ↗
          </span>
        )}
      </a>
    );
  }
  // Internal routes, including cross-page hashes like "/#work", use next/link (client
  // navigation + page transition). Same-page hashes are intercepted by MotionProvider.
  const isRoute = href.startsWith("/") && !/\.\w+$/.test(href.split("#")[0]);
  if (isRoute) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
