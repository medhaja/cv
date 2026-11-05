import { dashboardShot, earlierWork, isocline, runShot, selectedWork, work } from "@/content/site";
import { Rich } from "../Rich";
import { Button, Label, Section, ShotPanel, Tag, TextLink } from "../ui";
import { SmartLink } from "../SmartLink";
import { LiftCard } from "../motion/LiftCard";

export function Work() {
  return (
    <Section
      id="work"
      label={work.label}
      sublabel={work.title}
      aside={
        <ul className="mt-6 hidden flex-col items-start gap-2 md:flex">
          {isocline.tags.map((t) => (
            <li key={t}>
              <Tag>{t}</Tag>
            </li>
          ))}
        </ul>
      }
      head={
        <div id="isocline" className="scroll-mt-24">
          <h2 id="isocline-title" className="font-display text-display-xl">
            {isocline.name}
          </h2>
          <p className="mt-6 max-w-[52ch] text-lead text-fg-muted">{isocline.tagline}</p>
          <ul className="mt-6 flex flex-wrap gap-2 md:hidden">
            {isocline.tags.map((t) => (
              <li key={t}>
                <Tag>{t}</Tag>
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <Isocline />
      <SelectedWork />
      <EarlierWork />
    </Section>
  );
}

function Isocline() {
  const [caseStudy, repo, ...textLinks] = isocline.links;
  return (
    <div>
      {/* Lead image: demo run paused at human approval */}
      <figure>
        <ShotPanel shot={runShot} />
        <figcaption className="mt-4 font-mono text-small text-fg-subtle">{runShot.caption}</figcaption>
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

      {/* Demonstrated workflow (one line; full version in the case study) */}
      <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-3 border-y border-line py-8 md:mt-20 md:grid-cols-12">
        <p className="label md:col-span-3">{isocline.demonstrated.label}</p>
        <div className="md:col-span-9">
          <p className="max-w-[64ch] text-lead text-fg">{isocline.demonstrated.text}</p>
          <p className="mt-3 font-mono text-small text-fg-subtle">{isocline.demonstrated.note}</p>
        </div>
      </div>

      {/* Secondary image: dashboard */}
      <figure className="mt-16 grid grid-cols-1 gap-x-6 md:mt-20 md:grid-cols-12">
        <figcaption className="label mb-4 md:col-span-3 md:mb-0">{dashboardShot.title}</figcaption>
        <div className="md:col-span-9">
          <ShotPanel shot={dashboardShot} sizes="(min-width: 1280px) 880px, 100vw" />
        </div>
      </figure>

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
                <strong className="text-fg">{title}</strong>
                {rest.startsWith(",") ? "" : " "}
                {rest}
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
    </div>
  );
}

function SelectedWork() {
  return (
    <div aria-labelledby="selected-title" className="mt-28 md:mt-40" role="region">
      <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-12">
        <h2 id="selected-title" className="label md:col-span-3">
          {selectedWork.label}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:col-span-9">
          {selectedWork.projects.map((p) => {
            const links = p.links.filter((l): l is { label: string; href: string; external?: boolean } => !!l.href);
            return (
              <LiftCard as="article" key={p.id} id={p.id} aria-labelledby={`${p.id}-title`} className="panel scroll-mt-24 p-6 md:p-8">
                <p>
                  <Tag>{p.tag}</Tag>
                </p>
                <h3 id={`${p.id}-title`} className="mt-5 text-heading font-medium md:text-[1.75rem] md:leading-tight">
                  {p.title}
                </h3>
                <p className="mt-4 max-w-[64ch] text-lead text-fg-muted">{p.description}</p>
                {links.length > 0 && (
                  <div className="mt-8 flex gap-6 font-mono text-small">
                    {links.map((l) => (
                      <TextLink key={l.href} link={l} context={p.title} />
                    ))}
                  </div>
                )}
              </LiftCard>
            );
          })}
        </div>
      </div>
    </div>
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
          <h2 id="earlier-title" className="font-display text-display-md">
            {earlierWork.title}
          </h2>
          <p className="mt-4 max-w-[60ch] text-fg-muted">{earlierWork.note}</p>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {earlierWork.projects.map((p) => (
          <LiftCard as="article" key={p.id} id={p.id} aria-labelledby={`${p.id}-title`} className="panel flex scroll-mt-24 flex-col p-6 md:p-8">
            <p>
              <Tag>
                {p.year} · {p.category}
              </Tag>
            </p>
            <h3 id={`${p.id}-title`} className="mt-5 text-heading font-medium">
              {p.title}
            </h3>
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
                <TextLink key={l.href} link={l} context={p.title} />
              ))}
            </div>
          </LiftCard>
        ))}
      </div>
    </div>
  );
}
