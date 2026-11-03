import type { Metadata } from "next";
import { caseStudy as cs, caseStudySections, dashboardShot, seo, site } from "@/content/site";
import { Rich } from "@/components/Rich";
import { Button, Container, Coord, Label, ShotPanel, TextLink } from "@/components/ui";
import { SmartLink } from "@/components/SmartLink";
import { CopyEmail } from "@/components/CopyEmail";

export const metadata: Metadata = {
  title: seo.isocline.title,
  description: seo.isocline.description,
  alternates: { canonical: "/isocline/" },
  openGraph: {
    type: "article",
    siteName: site.name,
    title: seo.isocline.title,
    description: seo.isocline.ogDescription,
    url: "/isocline/",
    images: [seo.ogImage.src],
  },
  twitter: { card: "summary_large_image", title: seo.isocline.title, description: seo.isocline.ogDescription },
};

export default function IsoclineCaseStudy() {
  const [primary, secondary, ...textLinks] = cs.actions;
  return (
    <article aria-labelledby="cs-title">
      {/* ------------------------------ Hero ------------------------------ */}
      <header className="pb-16 pt-16 md:pb-24 md:pt-24">
        <Container>
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-12">
            <div className="flex flex-col gap-4 md:col-span-3">
              <SmartLink href={cs.crumb.href} className="link self-start font-mono text-small">
                {cs.crumb.label}
              </SmartLink>
              <Label as="p">{cs.eyebrow}</Label>
            </div>
            <div className="md:col-span-9">
              <h1 id="cs-title" className="font-display text-display-lg text-balance">
                {cs.title}
              </h1>
              <p className="mt-8 max-w-[62ch] text-lead text-fg-muted">{cs.lead}</p>
            </div>
          </div>

          <dl className="mt-14 grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
            {cs.meta.map((m) => (
              <div key={m.label} className="border-b border-line py-5 sm:pr-6 lg:border-b-0">
                <Label as="dt">{m.label}</Label>
                <dd className="mt-2 text-small text-fg">{m.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Button link={primary} />
            <Button link={secondary} variant="secondary" />
            {textLinks.map((l) => (
              <TextLink key={l.href} link={l} className="text-small" />
            ))}
          </div>

          <figure className="mt-14 md:mt-20">
            <ShotPanel shot={dashboardShot} priority />
            <figcaption className="mt-4 max-w-[70ch] font-mono text-small text-fg-subtle">{cs.shotCaption}</figcaption>
          </figure>
        </Container>
      </header>

      {/* ---------------------------- Sections ---------------------------- */}
      <Container>
        <div className="grid grid-cols-1 gap-x-6 md:grid-cols-12">
          <nav aria-label="Case study sections" className="hidden md:col-span-3 md:block">
            <ol className="sticky top-24 flex flex-col gap-1 border-t border-line pt-6">
              {caseStudySections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="flex gap-3 py-1.5 text-small text-fg-muted transition-colors hover:text-fg">
                    <span className="font-mono text-fg-subtle">{s.n}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="min-w-0 md:col-span-9">
            <CsSection {...cs.problem}>
              <div className="prose-body text-fg-muted">
                {cs.problem.paragraphs.map((p) => (
                  <p key={p}>
                    <Rich text={p} />
                  </p>
                ))}
              </div>
              <h3 className="mt-12 text-heading font-medium">{cs.problem.usersTitle}</h3>
              <ul className="ticks mt-5 text-fg-muted">
                {cs.problem.users.map((u) => (
                  <li key={u}>
                    <Rich text={u} />
                  </li>
                ))}
              </ul>
            </CsSection>

            <CsSection {...cs.built}>
              <ul className="grid grid-cols-1 border-l border-t border-line lg:grid-cols-2">
                {cs.built.items.map((item) => (
                  <li key={item} className="border-b border-r border-line p-6 text-small text-fg-muted">
                    <Rich text={item} />
                  </li>
                ))}
              </ul>

              <div id="demonstrated" className="mt-12 scroll-mt-24 rounded-md border border-line bg-ink-900 p-6 md:p-8">
                <h3 className="text-heading font-medium">{cs.demonstrated.title}</h3>
                <p className="mt-4 max-w-[64ch] text-fg-muted">{cs.demonstrated.text}</p>
                <p className="mt-5 flex items-start gap-3 border-t border-line pt-5 font-mono text-small text-fg-subtle">
                  <span aria-hidden="true">—</span>
                  {cs.demonstrated.note}
                </p>
              </div>
            </CsSection>

            <CsSection {...cs.ownership}>
              <div className="prose-body text-lead text-fg-muted">
                {cs.ownership.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </CsSection>

            <CsSection {...cs.architecture}>
              <figure aria-labelledby="arch-caption">
                <ol className="panel flex flex-col gap-0 p-4 md:p-6">
                  {cs.architecture.tiers.map((tier, i) => (
                    <li key={tier.label}>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-[6.5rem_1fr] md:items-center">
                        <span className="label">{tier.label}</span>
                        <div className={`grid gap-3 ${tier.nodes.length === 3 ? "sm:grid-cols-3" : tier.nodes.length === 2 ? "sm:grid-cols-2" : ""}`}>
                          {tier.nodes.map((n) => (
                            <div
                              key={n.title}
                              className={`rounded-md border bg-ink-950 p-4 ${n.key ? "border-signal/60" : "border-line-strong"}`}
                            >
                              <strong className="block text-small text-fg">{n.title}</strong>
                              <span className="mt-1 block font-mono text-[0.75rem] leading-snug text-fg-subtle">{n.sub}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {i < cs.architecture.connectors.length && (
                        <p className="my-2 flex items-center gap-3 font-mono text-[0.75rem] text-fg-subtle md:ml-[7.25rem]">
                          <span aria-hidden="true">↓</span>
                          {cs.architecture.connectors[i]}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
                <figcaption id="arch-caption" className="mt-4 font-mono text-small text-fg-subtle">
                  <Rich text={cs.architecture.caption} />
                </figcaption>
              </figure>

              <h3 className="mt-16 text-heading font-medium">{cs.architecture.decisionsTitle}</h3>
              <ul className="mt-6 border-t border-line">
                {cs.architecture.decisions.map((d, i) => (
                  <li key={d.title} className="grid grid-cols-1 gap-x-6 gap-y-3 border-b border-line py-8 md:grid-cols-[3rem_1fr]">
                    <span className="font-mono text-small text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h4 className="text-body font-medium text-fg">{d.title}</h4>
                      <p className="mt-3 text-small text-fg-muted">
                        <Rich text={d.body} />
                      </p>
                      <p className="mt-4 border-l border-signal/50 pl-4 text-small text-fg-muted">
                        <span className="label mr-2">Trade-off</span>
                        <Rich text={d.tradeoff} />
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CsSection>

            <CsSection {...cs.limitations}>
              <p className="text-fg-muted">{cs.limitations.intro}</p>
              <ol className="mt-6 border-t border-line">
                {cs.limitations.items.map((item, i) => (
                  <li key={item} className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-b border-line py-5 text-small text-fg-muted">
                    <span className="font-mono text-fg-subtle">L{i + 1}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </CsSection>

            <CsSection {...cs.evidence}>
              <h3 className="text-heading font-medium">{cs.evidence.verification.title}</h3>
              <p className="mt-3 text-small text-fg-muted">{cs.evidence.verification.intro}</p>
              <div className="panel mt-6 overflow-x-auto">
                <table className="data-table">
                  <caption>{cs.evidence.verification.source}</caption>
                  <thead>
                    <tr>
                      <th scope="col" className="label">{cs.evidence.verification.columns[0]}</th>
                      <th scope="col" className="label !text-right">{cs.evidence.verification.columns[1]}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cs.evidence.verification.rows.map(([check, result]) => (
                      <tr key={check}>
                        <th scope="row">
                          <Rich text={check} />
                        </th>
                        <td className="num">{result}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 border-l border-line-strong pl-4 text-small text-fg-muted">
                <Rich text={cs.evidence.verification.note} />
              </p>

              <h3 className="mt-16 text-heading font-medium">{cs.evidence.benchmarks.title}</h3>
              <p className="mt-3 text-small text-fg-muted">{cs.evidence.benchmarks.intro}</p>
              <div className="panel mt-6 overflow-x-auto">
                <table className="data-table min-w-[36rem]">
                  <caption>{cs.evidence.benchmarks.source}</caption>
                  <thead>
                    <tr>
                      {cs.evidence.benchmarks.columns.map((c, i) => (
                        <th key={c} scope="col" className={`label ${i > 0 ? "!text-right" : ""} ${c === "n" ? "!normal-case" : ""}`}>
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cs.evidence.benchmarks.rows.map(([name, n, p50, p95]) => (
                      <tr key={name}>
                        <th scope="row">{name}</th>
                        <td className="num !text-fg-muted">{n}</td>
                        <td className="num">{p50}</td>
                        <td className="num">{p95}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="mt-16 text-heading font-medium">{cs.evidence.linksTitle}</h3>
              <ul className="mt-6 border-t border-line">
                {cs.evidence.links.map((l) => (
                  <li key={l.href} className="grid grid-cols-1 gap-x-6 gap-y-1 border-b border-line py-4 sm:grid-cols-[8rem_1fr] sm:items-baseline">
                    <span className="label">{l.label}</span>
                    <SmartLink href={l.href} className="link text-small">
                      {l.text}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </CsSection>
          </div>
        </div>
      </Container>

      {/* ------------------------------ CTA ------------------------------- */}
      <section aria-labelledby="cta-title" className="section mt-24">
        <Container>
          <Coord index="07" path="/contact" />
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-12">
            <Label as="p" className="md:col-span-3">
              {cs.cta.label}
            </Label>
            <div className="md:col-span-9">
              <h2 id="cta-title" className="font-display text-display-lg">
                {cs.cta.title}
              </h2>
              <p className="mt-6 max-w-[60ch] text-lead text-fg-muted">{cs.cta.lead}</p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Button link={cs.cta.actions[0]} />
                <CopyEmail email={site.email} />
                <Button link={cs.cta.actions[1]} variant="secondary" />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </article>
  );
}

function CsSection({ n, id, title, children }: { n: string; id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 border-t border-line py-16 md:py-24">
      <p className="font-mono text-small text-fg-subtle">{n}</p>
      <h2 id={`${id}-title`} className="mt-3 font-display text-display-md">
        {title}
      </h2>
      <div className="mt-10">{children}</div>
    </section>
  );
}
