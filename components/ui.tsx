import type { ReactNode } from "react";
import { SmartLink } from "./SmartLink";
import type { Link as LinkT } from "@/content/site";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-site px-5 md:px-10 ${className}`}>{children}</div>;
}

/** Mono uppercase eyebrow / meta label. */
export function Label({ children, className = "", as: As = "span" }: { children: ReactNode; className?: string; as?: "span" | "p" | "h3" | "dt" }) {
  return <As className={`label ${className}`}>{children}</As>;
}

export function Tag({ children }: { children: ReactNode }) {
  return <span className="tag">{children}</span>;
}

export function Button({ link, variant = "primary" }: { link: LinkT; variant?: "primary" | "secondary" }) {
  return (
    <SmartLink href={link.href} external={link.external} className={`btn btn-${variant}`}>
      {link.label}
    </SmartLink>
  );
}

export function TextLink({ link, className = "" }: { link: LinkT; className?: string }) {
  return (
    <SmartLink href={link.href} external={link.external} className={`link ${className}`}>
      {link.label}
    </SmartLink>
  );
}

/**
 * Section frame: full-width rule with a mono coordinate, then the
 * asymmetric 3 / 9 grid (label column + content column).
 */
export function Section({
  id,
  index,
  path,
  label,
  title,
  children,
  titleId,
  aside,
  head,
}: {
  id: string;
  index: string;
  path: string;
  label: string;
  title?: ReactNode;
  titleId?: string;
  children: ReactNode;
  aside?: ReactNode;
  /** Replaces the h2 slot (content column) when a section needs a custom heading block. */
  head?: ReactNode;
}) {
  const tid = titleId ?? `${id}-title`;
  return (
    <section id={id} aria-labelledby={title ? tid : `${id}-label`} className="section">
      <Container>
        <Coord index={index} path={path} />
        <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-12">
          <div className="md:col-span-3">
            <p id={`${id}-label`} className="label">
              {label}
            </p>
            {aside}
          </div>
          {title && (
            <h2 id={tid} className="font-display text-display-lg text-balance md:col-span-9">
              {title}
            </h2>
          )}
          {head && <div className="md:col-span-9">{head}</div>}
        </div>
        <div className="mt-12 md:mt-16">{children}</div>
      </Container>
    </section>
  );
}

/** Dashboard screenshot: browser frame on an ink-850 panel. No CSS filters on the image. */
export function ShotPanel(props: Parameters<typeof BrowserFrame>[0]) {
  return (
    <div className="rounded-md border border-line bg-ink-850 p-3 sm:p-6 lg:p-12">
      <BrowserFrame {...props} />
    </div>
  );
}

/** Browser-frame mockup around the dashboard screenshot. */
export function BrowserFrame({
  shot,
  priority = false,
  sizes = "(min-width: 1280px) 1200px, 100vw",
}: {
  shot: { png: string; webp960: string; webp1600: string; width: number; height: number; alt: string; urlBar: string };
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className="browser">
      <div className="browser-bar" aria-hidden="true">
        <span className="browser-dots">
          <i />
          <i />
          <i />
        </span>
        <code>{shot.urlBar}</code>
      </div>
      <picture>
        <source type="image/webp" srcSet={`${shot.webp960} 960w, ${shot.webp1600} 1600w`} sizes={sizes} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shot.png}
          width={shot.width}
          height={shot.height}
          alt={shot.alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="block h-auto w-full"
        />
      </picture>
    </div>
  );
}

/** Full-width section rule with a mono coordinate, aligned to the content edge. */
export function Coord({ index, path }: { index: string; path: string }) {
  return (
    <div className="coord" aria-hidden="true">
      <div className="mx-auto flex w-full max-w-site gap-5 px-5 md:px-10">
        <span>§{index}</span>
        <span>{path}</span>
      </div>
    </div>
  );
}
