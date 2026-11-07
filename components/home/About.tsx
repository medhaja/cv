import { about, background } from "@/content/site";
import { Label, Section } from "../ui";
import { SmartLink } from "../SmartLink";
import { Icon } from "../Icon";

/** Thumbnail per certificate title (generated from the originals in /public/img). */
const CERT_THUMBS: Record<string, { src: string; w: number; h: number }> = {
  "AI Product Management Specialization": { src: "/img/certs/ai-product-management.webp", w: 720, h: 556 },
  "Large Language Model Operations (LLMOps) Specialization": { src: "/img/certs/llmops.webp", w: 720, h: 554 },
  "Machine Learning Engineering for Production (MLOps) Specialization": { src: "/img/certs/mlops.webp", w: 720, h: 556 },
  "Sustainable Business Strategy": { src: "/img/certs/hbs.webp", w: 556, h: 720 },
  "Deep Learning Specialization": { src: "/img/certs/deep-learning.webp", w: 720, h: 556 },
};

export function About() {
  return (
    <>
      <Section id="about" label={about.label} title={about.title}>
        <div className="grid grid-cols-1 gap-x-6 md:grid-cols-12">
          <div className="prose-body max-w-[64ch] text-lead text-fg-muted md:col-span-8 md:col-start-4 [&>p:first-child]:font-display [&>p:first-child]:text-display-md [&>p:first-child]:leading-[1.1] [&>p:first-child]:text-fg">
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section id="education" label={background.label} title={background.title}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-12">
          <div className="md:col-span-3">
            <Label as="h3">{background.education.label}</Label>
            <p className="glow-card mt-4 flex flex-col gap-1 p-5">
              <span aria-hidden="true" className="icon-tile icon-tile--signal mb-4">
                <Icon name="graduation-cap" size={20} />
              </span>
              <strong className="text-fg">{background.education.degree}</strong>
              <span className="text-fg-muted">{background.education.school}</span>
              <span className="mt-1 font-mono text-small tabular text-fg-subtle">{background.education.years}</span>
            </p>
          </div>

          <div className="md:col-span-9">
            <Label as="h3">{background.certsLabel}</Label>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-6">
              {background.certs.map((c, i, all) => {
                const t = CERT_THUMBS[c.title];
                /* 2 wide + 3 narrow on xl, so 5 certificates fill two rows with no empty cell. */
                const span = all.length === 5 ? (i < 2 ? "xl:col-span-3" : "xl:col-span-2") : "xl:col-span-2";
                const lastOdd = all.length % 2 === 1 && i === all.length - 1 ? "sm:col-span-2 xl:col-span-2" : "";
                return (
                  <li key={c.title} className={`flex ${span} ${lastOdd}`}>
                    <SmartLink
                      href={c.link.href}
                      external={c.link.external}
                      arrow={false}
                      className="glow-card cert-card group flex w-full flex-col overflow-hidden p-2"
                    >
                      {t && (
                        <span className="block overflow-hidden rounded-[10px] bg-ink-850">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={t.src} width={t.w} height={t.h} alt="" loading="lazy" decoding="async" className="cert-thumb block w-full" />
                        </span>
                      )}
                      <span className="flex flex-1 flex-col gap-1 px-3 pb-3 pt-4">
                        <span className="text-fg [text-wrap:balance]">{c.title}</span>
                        <span className="font-mono text-small text-fg-subtle">
                          {c.issuer}
                          {c.year && ` · ${c.year}`}
                        </span>
                        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 font-mono text-small text-fg transition-colors duration-150 group-hover:text-signal">
                          {c.link.label}
                          <span className="sr-only">{c.link.srLabel}</span>
                          <Icon name="arrow-up-right" size={14} />
                        </span>
                      </span>
                    </SmartLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
