import { dashboardShot, earlierWork, isocline, work } from "@/content/site";
import { Rich } from "../Rich";
import { BrowserFrame, Button, Label, Section, Tag, TextLink } from "../ui";
import { SmartLink } from "../SmartLink";

export function Work() {
  return (
    <Section id="work" index="02" path="/work" label={work.label} title={work.title}>
      <Isocline />
      <EarlierWork />
    </Section>
  );
}

function Isocline() {
  const [caseStudy, repo, ...textLinks] = isocline.links;
  return (
    <article id="isocline" aria-labelledby="isocline-title" className="scroll-mt-24">
      {/* Title block */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-12">
        <div className="md:col-span-3">
          <ul className="flex flex-wrap gap-2 md:flex-col md:items-start">
            {isocline.tags.map((t) => (
              <li key={t}>
                <Tag>{t}</Tag>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-9">
          <h3 id="isocline-title" className="font-display text-display-md">
            {isocline.name}
          </h3>
          <p className="mt-4 max-w-[52ch] text-lead text-fg-muted">{isocline.tagline}</p>
        </div>
      </div>

      {/* Screenshot */}
      <figure className="mt-12 md:mt-16">
        <BrowserFrame shot={dashboardShot} />
      </figure>

      {/* Proof tiles */}
      <dl className="mt-6 grid grid-cols-2 overflow-hidden rounded-md border border-line lg:grid-cols-4">
        {isocline.stats.map((s, i) => (
          <div
            key={s.label}
            className={`flex flex-col gap-3 bg-ink-900 p-5 md:p-8 ${i % 2 === 1 ? "border-l border-line" : ""} ${i >= 2 ? "border-t border-line lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
          >
            <dt className="order-2 text-small text-fg">{s.label}</dt>
            <dd className="order-1 font-mono text-stat tabular text-fg">{s.value}</dd>
            <dd className="order-3 font-mono text-[0.6875rem] leading-snug text-fg-subtle [overflow-wrap:anywhere]">{s.source}</dd>
          </div>
        ))}
      </dl>

      {/* Facts */}
      <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 md:mt-24 md:grid-cols-12">
        {isocline.facts.map((f, i) => (
          <div key={f.label} className={`md:col-span-4 ${i === 0 ? "" : ""}`}>
            <Label as="dt">{f.label}</Label>
            <dd className="mt-3 text-fg-muted">
              <Rich text={f.text} />
            </dd>
          </div>
        ))}
      </dl>

      {/* Feature grid */}
      <div className="mt-16 md:mt-24">
        <Label as="h3" className="block">
          <span id="isocline-caps">{isocline.capabilitiesLabel}</span>
        </Label>
        <ul aria-labelledby="isocline-caps" className="mt-6 grid grid-cols-1 border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {isocline.capabilities.map(([title, rest], i) => (
            <li key={title} className="flex flex-col gap-3 border-b border-r border-line p-6">
              <span className="font-mono text-label text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-small text-fg-muted">
                <strong className="block text-body text-fg">{title.replace(/:$/, "")}</strong>
                {rest.replace(/^,\s*/, "")}
              </p>
            </li>
          ))}
          <li className="flex border-b border-r border-line">
            <SmartLink
              href={caseStudy.href}
              className="group flex w-full flex-col justify-between gap-6 p-6 transition-colors duration-150 hover:bg-ink-900"
            >
              <span className="label !text-signal">Case study</span>
              <span className="font-display text-heading text-fg md:text-[1.75rem]">
                {caseStudy.label}
                <span aria-hidden="true" className="ml-2 inline-block transition-transform duration-150 group-hover:translate-x-1">
                  →
                </span>
              </span>
            </SmartLink>
          </li>
        </ul>
      </div>

      {/* Links */}
      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
        <Button link={repo} variant="secondary" />
        {textLinks.map((l) => (
          <TextLink key={l.href} link={l} className="text-small" />
        ))}
      </div>
    </article>
  );
}

function EarlierWork() {
  return (
    <div aria-labelledby="earlier-title" className="mt-28 md:mt-40" role="region">
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-12">
        <Label as="p" className="md:col-span-3">
          {earlierWork.label}
        </Label>
        <div className="md:col-span-9">
          <h3 id="earlier-title" className="font-display text-display-md">
            {earlierWork.title}
          </h3>
          <p className="mt-4 max-w-[60ch] text-fg-muted">{earlierWork.note}</p>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {earlierWork.projects.map((p) => (
          <article key={p.id} id={p.id} aria-labelledby={`${p.id}-title`} className="panel flex scroll-mt-24 flex-col p-6 md:p-8">
            <p>
              <Tag>
                {p.year} · {p.category}
              </Tag>
            </p>
            <h4 id={`${p.id}-title`} className="mt-5 text-heading font-medium">
              {p.title}
            </h4>
            <dl className="mt-6 flex flex-col gap-5 text-small">
              {p.rows.map((r) => (
                <div key={r.label}>
                  <dt className="label">{r.label}</dt>
                  <dd className="mt-1.5 text-fg-muted">
                    <Rich text={r.text} />
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-auto flex gap-6 pt-8 font-mono text-small">
              {p.links.map((l) => (
                <TextLink key={l.href} link={l} />
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
