import { hero, site } from "@/content/site";
import { Rich } from "../Rich";
import { Container, Button, TextLink } from "../ui";
import { HeroGraph } from "../hero/HeroGraph";

/** "I build AI products from idea to deployment." → two lines, last word set in italic amber. */
function splitHeadline(text: string) {
  const i = text.indexOf(" from ");
  if (i === -1) return { first: text, second: "", last: "" };
  const first = text.slice(0, i);
  const rest = text.slice(i + 1);
  const j = rest.lastIndexOf(" ");
  return { first, second: rest.slice(0, j + 1), last: rest.slice(j + 1) };
}

export function Hero() {
  const h = splitHeadline(hero.headline);
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pb-14 pt-6 md:pb-20 lg:justify-end lg:pb-24"
    >
      <div aria-hidden="true" className="hero-aurora" />
      <div aria-hidden="true" className="hero-floor" />
      <HeroGraph />
      {/* Scrim: keeps the copy at full contrast where it overlaps the graph. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 hidden bg-[linear-gradient(to_top,var(--color-ink-950)_8%,rgb(10_10_11/0)_45%),linear-gradient(to_right,var(--color-ink-950)_18%,rgb(10_10_11/0.75)_42%,rgb(10_10_11/0)_62%)] lg:block"
      />

      <Container className="relative">
        <div className="max-w-[52rem]">
          <p className="hero-fade label block" style={{ ["--d" as string]: 0 }}>
            {hero.eyebrow}
          </p>

          <h1 id="hero-title" className="mt-4 font-display text-[clamp(3.25rem,1.6rem+4.6vw,5.75rem)] leading-[0.98] tracking-[-0.02em]">
            <span className="hero-line" style={{ ["--d" as string]: 1 }}>
              <span>{h.first}</span>{" "}
            </span>
            <span className="hero-line" style={{ ["--d" as string]: 2 }}>
              <span>
                {h.second}
                <em className="signal-text pr-[0.06em]">{h.last}</em>
              </span>
            </span>
          </h1>

          <p className="hero-fade mt-8 max-w-[56ch] text-lead text-fg-muted" style={{ ["--d" as string]: 3 }}>
            <Rich text={hero.intro} />
          </p>

          <p className="hero-fade status-pill mt-8 font-mono text-[0.8125rem] leading-snug text-fg" style={{ ["--d" as string]: 3 }}>
            <span aria-hidden="true" className="status-dot shrink-0" />
            {hero.availability}
          </p>

          <div className="hero-fade mt-8 flex flex-wrap items-center gap-x-6 gap-y-5" style={{ ["--d" as string]: 4 }} data-consent-avoid>
            <div className="flex flex-wrap gap-3">
              <Button link={hero.ctas[0]} />
              <Button link={hero.ctas[1]} variant="secondary" />
            </div>
            <ul className="flex gap-6 font-mono text-small [&_a]:inline-flex [&_a]:min-h-6 [&_a]:items-center">
              {hero.links.map((l) => (
                <li key={l.href}>
                  <TextLink link={l} />
                </li>
              ))}
              {site.links.resume && (
                <li>
                  <a className="link" href={site.links.resume}>
                    Résumé<span className="sr-only"> (PDF)</span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
