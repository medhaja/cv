import { contact, site } from "@/content/site";
import { Label, Section } from "../ui";
import { CopyEmail } from "../CopyEmail";
import { LiftCard } from "../motion/LiftCard";
import { Icon } from "../Icon";

export function Contact() {
  return (
    <Section id="contact" label={contact.label} title={contact.title}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {contact.paths.map((p) => (
          <LiftCard key={p.label} className="glow-card p-6 md:col-span-6 md:p-8 lg:col-span-5 lg:first:col-start-4 lg:last:col-span-4">
            <Label as="p">{p.label}</Label>
            <h3 className="mt-5 text-heading font-medium">{p.title}</h3>
            <p className="mt-3 text-fg-muted">{p.text}</p>
          </LiftCard>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-1 gap-x-6 md:mt-24 md:grid-cols-12">
        <div className="md:col-span-9 md:col-start-4">
          <a href={`mailto:${site.email}`} className="cta-panel group block px-6 py-10 md:px-12 md:py-16">
            <span className="label block">{contact.emailCta.replace(site.email, "").trim()}</span>
            <span className="mt-4 flex items-end justify-between gap-6">
              {/* The address never breaks mid-word: its size follows the space available (container query units),
                  capped at display-lg, so it always fits on one line. */}
              <span className="@container block min-w-0 flex-1">
                <span className="block whitespace-nowrap font-display text-[clamp(1.375rem,10.4cqi,var(--text-display-lg))] leading-[1.1] transition-colors duration-150 group-hover:text-signal">
                  {site.email}
                </span>
              </span>
              <span aria-hidden="true" className="hidden size-14 shrink-0 place-items-center rounded-full bg-signal text-ink-950 shadow-[0_0_40px_rgb(255_181_71/0.5)] transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 sm:grid">
                <Icon name="arrow-up-right" size={24} />
              </span>
            </span>
          </a>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
            <CopyEmail email={site.email} />
            <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-small text-fg-subtle">
              <li>
                <a className="link" href={site.links.github} rel="noopener">
                  GitHub<span aria-hidden="true" className="ext-arrow">↗</span>
                </a>
              </li>
              <li>
                <a className="link" href={site.links.linkedin} rel="noopener">
                  LinkedIn<span aria-hidden="true" className="ext-arrow">↗</span>
                </a>
              </li>
              {site.links.resume && (
                <li>
                  <a className="link" href={site.links.resume}>
                    Résumé<span className="sr-only"> (PDF)</span>
                  </a>
                </li>
              )}
              {contact.meta.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
