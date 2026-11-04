import type { Metadata } from "next";
import { caseStudy as cs, caseStudySections, dashboardShot, runShot, seo, site } from "@/content/site";
import { Rich } from "@/components/Rich";
import { Button, Container, Label, MarkerRow, ShotPanel, TextLink } from "@/components/ui";
import { SmartLink } from "@/components/SmartLink";
import { CopyEmail } from "@/components/CopyEmail";
import { ArchitectureDiagram } from "@/components/case/ArchitectureDiagram";
import { ProgressNav } from "@/components/case/ProgressNav";
import { PageTransition } from "@/components/motion/PageTransition";
import { JsonLd } from "@/components/JsonLd";
import { isoclineLd } from "@/content/structured-data";

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
    images: [seo.ogImages.isocline],
  },
  twitter: { card: "summary_large_image", title: seo.isocline.title, description: seo.isocline.ogDescription, images: [seo.ogImages.isocline] },
};

export default function IsoclineCaseStudy() {
  const [primary, secondary, ...textLinks] = cs.actions;
  return (
    <>
    <JsonLd data={isoclineLd} />
    <PageTransition>
    <article aria-labelledby="cs-title">
      {/* ------------------------------ Hero ------------------------------ */}
      <header className="pb-16 pt-10 md:pb-24 md:pt-14">
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

          <dl className="mt-10 grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-4 md:mt-12">
            {cs.meta.map((m) => (
              <div key={m.label} className="border-b border-line py-5 sm:pr-6 lg:border-b-0">
                <Label as="dt">{m.label}</Label>
                <dd className="mt-2 text-small text-fg">{m.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Button link={primary} />
            <Button link={secondary} variant="secondary" />
            {textLinks.map((l) => (
              <TextLink key={l.href} link={l} className="text-small" />
            ))}
          </div>

          {/* Lead image: the demonstrated workflow, paused at human approval */}
          <figure className="mt-10 md:mt-12">
            <ShotPanel shot={runShot} priority />
            <figcaption className="mt-4 font-mono text-small text-fg-subtle">{runShot.caption}</figcaption>
          </figure>
        </Container>
      </header>

      {/* ---------------------------- Sections ---------------------------- */}
      <Container>
        <div className="grid grid-cols-1 gap-x-6 md:grid-cols-12">
          <div className="hidden md:col-span-3 md:block">
            <ProgressNav items={caseStudySections} />
          </div>

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

              {/* Secondary image: dashboard */}
              <figure className="mt-12">
                <ShotPanel shot={dashboardShot} sizes="(min-width: 1280px) 880px, 100vw" />
                <figcaption className="mt-4 font-mono text-small text-fg-subtle">
                  <span className="text-fg-muted">{dashboardShot.title}.</span> {cs.shotCaption}
                </figcaption>
              </figure>
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
                <ArchitectureDiagram />
                <figcaption id="arch-caption" className="mt-4 font-mono text-small text-fg-subtle">
                  <Rich text={cs.architecture.caption} />
                </figcaption>
              </figure>

              <h3 className="mt-16 text-heading font-medium">{cs.architecture.decisionsTitle}</h3>
              <ul className="mt-6 flex flex-col gap-3">
                {cs.architecture.decisions.map((d, i) => (
                  <li key={d.title}>
                    <details className="decision group rounded-md border border-line bg-ink-900 open:border-line-strong">
                      <summary className="flex cursor-pointer list-none items-start gap-4 p-5 md:p-6">
                        <span className="pt-0.5 font-mono text-small text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                        <span className="flex-1 text-body font-medium text-fg">{d.title}</span>
                        <span aria-hidden="true" className="mt-0.5 font-mono text-fg-subtle transition-transform duration-200 group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <div className="grid grid-cols-1 gap-4 border-t border-line px-5 pb-6 pt-5 md:grid-cols-2 md:gap-6 md:px-6 md:pl-[3.75rem]">
                        <div>
                          <p className="label">Decision</p>
                          <p className="mt-2 text-small text-fg-muted">
                            <Rich text={d.body} />
                          </p>
                        </div>
                        <div className="border-l border-signal/50 pl-4 md:pl-6">
                          <p className="label">Trade-off</p>
                          <p className="mt-2 text-small text-fg-muted">
                            <Rich text={d.tradeoff} />
                          </p>
                        </div>
                      </div>
                    </details>
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
                      <th scope="col" className="label">
                        {cs.evidence.verification.columns[0]}
                      </th>
                      <th scope="col" className="label !text-right">
                        {cs.evidence.verification.columns[1]}
                      </th>
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

              {/* ≥640px: table. Below: one card per benchmark (no sideways scroll). */}
              <div className="panel mt-6 hidden overflow-x-auto sm:block">
                <table className="data-table">
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
              <div className="mt-6 sm:hidden">
                <ul className="flex flex-col gap-3">
                  {cs.evidence.benchmarks.rows.map(([name, n, p50, p95]) => (
                    <li key={name} className="panel p-4">
                      <p className="text-small text-fg-muted">{name}</p>
                      <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3 font-mono tabular">
                        {[
                          ["n", n],
                          ["P50", p50],
                          ["P95", p95],
                        ].map(([k, v]) => (
                          <div key={k}>
                            <dt className="text-[0.6875rem] text-fg-subtle">{k}</dt>
                            <dd className={`mt-0.5 text-small ${k === "n" ? "text-fg-muted" : "text-fg"}`}>{v}</dd>
                          </div>
                        ))}
                      </dl>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 font-mono text-[0.75rem] text-fg-subtle">{cs.evidence.benchmarks.source}</p>
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
      <section aria-labelledby="cta-title" className="section mt-8">
        <MarkerRow index="07" path="/contact">
          {cs.cta.label}
        </MarkerRow>
        <Container className="mt-6 md:mt-8">
          <div className="grid grid-cols-1 gap-x-6 md:grid-cols-12">
            <div className="md:col-span-9 md:col-start-4">
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
    </PageTransition>
    </>
  );
}

/** Case-study section: rule + marker row (§0n left, path right), heading 24px / 32px below. */
function CsSection({ n, id, title, children }: { n: string; id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 pb-16 md:pb-24">
      <div className="flex items-baseline justify-between border-t border-line py-3 font-mono text-[0.6875rem] tracking-[0.06em] text-fg-subtle">
        <span>§{n}</span>
        <span aria-hidden="true">/{id}</span>
      </div>
      <h2 id={`${id}-title`} className="mt-6 font-display text-display-md md:mt-8">
        {title}
      </h2>
      <div className="mt-10">{children}</div>
    </section>
  );
}
