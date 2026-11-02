import { about, background } from "@/content/site";
import { Label, Section } from "../ui";
import { SmartLink } from "../SmartLink";

export function About() {
  return (
    <>
      <Section id="about" index="05" path="/about" label={about.label} title={about.title}>
        <div className="grid grid-cols-1 gap-x-6 md:grid-cols-12">
          <div className="prose-body max-w-[64ch] text-lead text-fg-muted md:col-span-8 md:col-start-4">
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section id="education" index="06" path="/background" label={background.label} title={background.title}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-12">
          <div className="md:col-span-3">
            <Label as="h3">{background.education.label}</Label>
            <p className="mt-4 flex flex-col gap-1">
              <strong className="text-fg">{background.education.degree}</strong>
              <span className="text-fg-muted">{background.education.school}</span>
              <span className="mt-1 font-mono text-small tabular text-fg-subtle">{background.education.years}</span>
            </p>
          </div>

          <div className="md:col-span-9">
            <Label as="h3">{background.certsLabel}</Label>
            <ul className="mt-4 border-t border-line">
              {background.certs.map((c) => (
                <li
                  key={c.title}
                  className="grid grid-cols-1 gap-x-6 gap-y-1 border-b border-line py-5 sm:grid-cols-[1fr_auto] sm:items-baseline"
                >
                  <span className="flex flex-col gap-1">
                    <span className="text-fg">{c.title}</span>
                    <span className="font-mono text-small text-fg-subtle">
                      {c.issuer}
                      {c.year && ` · ${c.year}`}
                    </span>
                  </span>
                  <SmartLink href={c.link.href} external={c.link.external} className="link mt-2 font-mono text-small sm:mt-0">
                    {c.link.label}
                    <span className="sr-only">{c.link.srLabel}</span>
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
