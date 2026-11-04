import type { Metadata } from "next";
import { Button, Container, MarkerRow } from "@/components/ui";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `Page not found · ${site.name}`,
  description: "This page doesn't exist on medhaja.me.",
};

/** 404 (out/404.html, served by GitHub Pages for unknown paths). */
export default function NotFound() {
  return (
    <section aria-labelledby="nf-title" className="section pt-16 md:pt-24">
      <MarkerRow index="404" path="/not-found">
        Not found
      </MarkerRow>
      <Container className="mt-6 md:mt-8">
        <div className="grid grid-cols-1 gap-x-6 md:grid-cols-12">
          <div className="md:col-span-9 md:col-start-4">
            <p className="font-mono text-small text-signal">run.failed · route not found</p>
            <h1 id="nf-title" className="mt-6 font-display text-display-lg text-balance">
              This page doesn’t exist.
            </h1>
            <p className="mt-6 max-w-[56ch] text-lead text-fg-muted">The link may be old or mistyped. Everything on the site is reachable from the home page.</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button link={{ label: "Go to the home page", href: "/" }} />
              <Button link={{ label: "Isocline case study", href: "/isocline/" }} variant="secondary" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
