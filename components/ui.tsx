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

/** Literal class names: Tailwind only generates utilities it can find verbatim in source. */
const BUTTON = { primary: "btn btn-primary", secondary: "btn btn-secondary" } as const;

export function Button({ link, variant = "primary" }: { link: LinkT; variant?: "primary" | "secondary" }) {
  return (
    <SmartLink href={link.href} external={link.external} className={BUTTON[variant]}>
      {link.label}
    </SmartLink>
  );
}

/** `context` is appended for screen readers only, so repeated labels ("Source", "Demo video") stay distinguishable. */
export function TextLink({ link, className = "", context }: { link: LinkT; className?: string; context?: string }) {
  return (
    <SmartLink href={link.href} external={link.external} className={`link ${className}`}>
      {link.label}
      {context && <span className="sr-only">: {context}</span>}
    </SmartLink>
  );
}

/**
 * Section frame: full-width rule carrying one row — mono coordinate (left) and
 * section label (right) — then, 24px / 32px below, the asymmetric 3 / 9 grid
 * (aside column + heading column). Bottom padding separates sections.
 */
export function Section({
  id,
  index,
  path,
  label,
  sublabel,
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
  /** Optional second label on the same row, e.g. "Work / Featured product". */
  sublabel?: string;
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
      <MarkerRow index={index} path={path}>
        <span id={`${id}-label`}>{label}</span>
        {sublabel && (
          <>
            <span aria-hidden="true" className="mx-2 text-fg-subtle/60">
              /
            </span>
            <span>{sublabel}</span>
          </>
        )}
      </MarkerRow>
      <Container className="mt-6 md:mt-8">
        {(title || head || aside) && (
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-12">
            {/* The aside column is desktop-only (mobile variants render inside the content). */}
            <div className="hidden md:col-span-3 md:block">{aside}</div>
            {title && (
              <h2 id={tid} className="font-display text-display-lg text-balance md:col-span-9">
                {title}
              </h2>
            )}
            {head && <div className="md:col-span-9">{head}</div>}
          </div>
        )}
        <div className="mt-12 md:mt-16">{children}</div>
      </Container>
    </section>
  );
}

/**
 * The rule + one row: coordinate (left, decorative) and the section label
 * (right on mobile; content column on desktop). Shared by both pages.
 */
export function MarkerRow({ index, path, children }: { index: string; path: string; children?: ReactNode }) {
  return (
    <div className="border-t border-line">
      <Container className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 py-3 md:grid-cols-12">
        <span aria-hidden="true" className="flex gap-5 font-mono text-[0.6875rem] tracking-[0.06em] text-fg-subtle md:col-span-3">
          <span>§{index}</span>
          <span>{path}</span>
        </span>
        {children && <p className="label text-right md:col-span-9 md:text-left">{children}</p>}
      </Container>
    </div>
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
  shot: { png: string; webp960: string; webpLarge: string; width: number; height: number; alt: string; urlBar: string };
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
        <source type="image/webp" srcSet={`${shot.webp960} 960w, ${shot.webpLarge} ${shot.width}w`} sizes={sizes} />
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
