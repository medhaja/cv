import { hero } from "@/content/site";
import { Rich } from "../Rich";
import { Container, Button, Label, TextLink } from "../ui";
import { HeroGraph } from "../hero/HeroGraph";

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[92svh] flex-col justify-end overflow-hidden pb-16 pt-[calc(22svh+5.5rem)] md:pb-24 md:pt-28"
    >
      <HeroGraph />
      {/* Scrim: keeps the headline at full contrast over the graph. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(to_top,var(--color-ink-950)_18%,rgb(10_10_11/0.85)_42%,rgb(10_10_11/0)_68%)] md:block"
      />

      <Container className="relative">
        <div className="grid grid-cols-1 gap-x-6 md:grid-cols-12">
          <div className="md:col-span-10 lg:col-span-9">
            <Label as="p">{hero.eyebrow}</Label>
            <h1 id="hero-title" className="mt-6 font-display text-display-xl text-balance">
              {hero.headline}
            </h1>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 md:mt-14 md:grid-cols-12">
          <p className="max-w-[60ch] text-lead text-fg-muted md:col-span-7 lg:col-span-6">
            <Rich text={hero.intro} />
          </p>

          <div className="flex flex-col gap-6 md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9">
            <p className="flex items-start gap-3 font-mono text-small text-fg">
              <span aria-hidden="true" className="mt-[0.45em] size-2 shrink-0 rounded-full bg-signal shadow-[0_0_12px_2px_rgb(255_181_71/0.45)]" />
              {hero.availability}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button link={hero.ctas[0]} />
              <Button link={hero.ctas[1]} variant="secondary" />
            </div>
            <ul className="flex gap-6 font-mono text-small">
              {hero.links.map((l) => (
                <li key={l.href}>
                  <TextLink link={l} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
