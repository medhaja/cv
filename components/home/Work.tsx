import { dashboardShot, earlierWork, isocline, runShot, selectedWork, work } from "@/content/site";
import { Rich } from "../Rich";
import { Button, Label, Section, ShotPanel, Tag, TextLink } from "../ui";
import { SmartLink } from "../SmartLink";
import { LiftCard } from "../motion/LiftCard";
import { CountUp } from "../fx/CountUp";
import { Icon } from "../Icon";

/** One icon per Isocline capability, in content order. */
const CAP_ICONS = ["flow-arrow", "database", "hand-palm", "arrow-counter-clockwise", "cube", "stack", "plugs"];
/** Bento spans on a 4-column grid: 2+2 / 1+1+1+1 / 2+(case study 2). */
const CAP_SPANS = ["lg:col-span-2", "lg:col-span-2", "", "", "", "", "lg:col-span-2"];
const FACT_ICONS = ["warning", "users-three", "wrench"];

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
        <div id="isocline" className="section-glow scroll-mt-24">
          <h2 id="isocline-title" translate="no" className="font-display text-[clamp(4rem,2rem+8vw,9rem)] leading-[0.9] tracking-[-0.03em]">
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
      <figure className="shot-stage">
        <div className="shot-tilt">
          <ShotPanel shot={runShot} />
        </div>
        <figcaption className="mt-4 font-mono text-small text-fg-subtle">{runShot.caption}</figcaption>
      </figure>

      {/* Proof tiles */}
      <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 md:gap-4">
        {isocline.stats.map((s) => (
          <div key={s.label} className="glow-card flex min-w-0 flex-col gap-3 p-5 md:p-7">
            <dt className="order-2 text-small text-fg">{s.label}</dt>
            <dd className="order-1 min-w-0 font-mono text-[clamp(2rem,1.1rem+4.2vw,3.5rem)] leading-none tabular [overflow-wrap:anywhere]">
              <CountUp value={s.value} className="stat-glow" />
            </dd>
            <dd className="order-3 font-mono text-[0.6875rem] leading-snug text-fg-subtle [overflow-wrap:anywhere]">{s.source}</dd>
          </div>
        ))}
      </dl>

      {/* Facts */}
      <dl className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 md:mt-24 md:grid-cols-12">
        {isocline.facts.map((f, i) => {
          const icon = FACT_ICONS[i] ?? "wrench";
          return (
          <div key={f.label} className="md:col-span-4">
            <span aria-hidden="true" className="icon-tile mb-5">
              <Icon name={icon} size={20} />
            </span>
            <Label as="dt">{f.label}</Label>
            <dd className="mt-3 text-fg-muted">
              <Rich text={f.text} />
            </dd>
          </div>
          );
        })}
      </dl>

      {/* Demonstrated workflow (one line; full version in the case study) */}
      <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-3 border-y border-line py-8 md:mt-20 md:grid-cols-12">
        <p className="label md:col-span-3">{isocline.demonstrated.label}</p>
        <div className="md:col-span-9">
          <p className="max-w-[64ch] text-lead text-fg">{isocline.demonstrated.text}</p>
          <p className="mt-3 font-mono text-small text-fg-subtle">{isocline.demonstrated.note}</p>
        </div>
      </div>

      {/* Architecture teardown: concept drawing made with the teardown skill (source in /teardown). */}
      <figure className="mt-16 grid grid-cols-1 gap-x-6 gap-y-6 md:mt-24 md:grid-cols-12">
        <figcaption className="md:col-span-3">
          <span className="label block">Architecture, layer by layer</span>{" "}
          <span className="mt-4 block max-w-[34ch] text-small text-fg-muted">
            Every tier as its own plate. PostgreSQL holds the authoritative state, so Redis can be lost without losing a run.
          </span>{" "}
          <span className="mt-2 block font-mono text-[0.6875rem] text-fg-subtle">Concept drawing. Sizes are illustrative.</span>
          <span className="mt-6 flex flex-col items-start gap-2 font-mono text-small">
            <a className="link inline-flex min-h-6 items-center" href="/teardown/isocline.html">
              Open the interactive drawing
            </a>
            <SmartLink className="link inline-flex min-h-6 items-center" href="/isocline/#architecture" arrow={false}>
              Read the architecture
            </SmartLink>
          </span>
        </figcaption>
        <div className="glow-card overflow-hidden md:col-span-9 [background:radial-gradient(60%_60%_at_45%_45%,rgb(255_181_71/0.07),transparent_70%),var(--color-ink-950)]">
          <picture>
            {/* Labels are unreadable at phone width, so phones get the plain drawing plus the legend below. */}
            <source media="(min-width: 640px)" srcSet="/img/isocline/isocline-stack.svg" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/isocline/isocline-stack-plain.svg"
              width={1260}
              height={891}
              loading="lazy"
              decoding="async"
              alt="Exploded concept drawing of Isocline's architecture. Top to bottom: the Web UI and SDK/CLI clients; the FastAPI API; PostgreSQL with pgvector, highlighted as the authoritative state, beside Redis; Celery workers and Beat; and model providers, tools and MCP servers, and the Python sandbox."
              className="block h-auto w-full"
            />
          </picture>
          <ol aria-hidden="true" className="grid gap-1.5 border-t border-line px-5 py-4 font-mono text-[0.75rem] text-fg-muted sm:hidden">
            <li>Clients: Web UI, SDK / CLI / HTTP</li>
            <li>API: FastAPI</li>
            <li>
              State: <span className="text-signal">PostgreSQL + pgvector</span>, Redis
            </li>
            <li>Execution: Celery workers, Beat</li>
            <li>Effects: model providers, tools / MCP, Python sandbox</li>
          </ol>
        </div>
      </figure>

      {/* Secondary image: dashboard */}
      <figure className="mt-16 grid grid-cols-1 gap-x-6 md:mt-20 md:grid-cols-12">
        <figcaption className="label mb-4 md:col-span-3 md:mb-0">{dashboardShot.title}</figcaption>
        <div className="shot-stage md:col-span-9">
          <div className="shot-tilt">
            <ShotPanel shot={dashboardShot} sizes="(min-width: 1280px) 880px, 100vw" />
          </div>
        </div>
      </figure>

      {/* Feature grid */}
      <div className="mt-16 md:mt-24">
        <Label as="h3" className="block">
          <span id="isocline-caps">{isocline.capabilitiesLabel}</span>
        </Label>
        <ul aria-labelledby="isocline-caps" className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
          {isocline.capabilities.map(([title, rest], i) => {
            const icon = CAP_ICONS[i] ?? "cube";
            return (
              <li key={title} className={`glow-card flex flex-col gap-5 p-6 md:p-7 ${CAP_SPANS[i] ?? ""}`}>
                <span aria-hidden="true" className={`icon-tile ${i < 2 ? "icon-tile--signal" : ""}`}>
                  <Icon name={icon} size={20} />
                </span>
                <p className={`text-fg-muted ${i < 2 || i === 6 ? "text-body md:text-lead" : "text-small"}`}>
                  <strong className="text-fg">{title}</strong>
                  {rest.startsWith(",") ? "" : " "}
                  {rest}
                </p>
              </li>
            );
          })}
          <li className="flex lg:col-span-2">
            <SmartLink
              href={caseStudy.href}
              className="glow-card group flex w-full flex-col justify-between gap-8 overflow-hidden p-6 md:p-7 [background:radial-gradient(120%_120%_at_100%_100%,rgb(255_181_71/0.16),transparent_55%),var(--color-ink-900)]"
            >
              <span className="label !text-signal">Case study</span>{" "}
              <span className="flex items-end justify-between gap-6">
                <span className="font-display text-display-md text-fg">{caseStudy.label}</span>
                <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-full bg-signal text-ink-950 transition-transform duration-200 group-hover:translate-x-1">
                  <Icon name="arrow-right" size={20} />
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
              <LiftCard as="article" key={p.id} id={p.id} aria-labelledby={`${p.id}-title`} className="glow-card scroll-mt-24 p-6 md:p-10">
                <p>
                  <Tag>{p.tag}</Tag>
                </p>
                <h3 id={`${p.id}-title`} className="mt-5 font-display text-display-md">
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
          <LiftCard as="article" key={p.id} id={p.id} aria-labelledby={`${p.id}-title`} className="glow-card flex scroll-mt-24 flex-col p-6 md:p-8">
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
