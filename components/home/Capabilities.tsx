import { capabilities } from "@/content/site";
import { Section } from "../ui";
import { SmartLink } from "../SmartLink";
import { LiftCard } from "../motion/LiftCard";

/** 5 cards: 3 + 2 on desktop (6-col sub-grid: 2/2/2 then 3/3). */
const spans = ["lg:col-span-2", "lg:col-span-2", "lg:col-span-2", "lg:col-span-3", "lg:col-span-3"];

export function Capabilities() {
  return (
    <Section id="capabilities" index="04" path="/capabilities" label={capabilities.label} title={capabilities.title}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {capabilities.items.map((c, i) => (
          <LiftCard
            key={c.title}
            className={`panel flex flex-col p-6 md:p-8 ${spans[i]} ${i === 4 ? "sm:col-span-2 lg:col-span-3" : ""}`}
          >
            <span className="font-mono text-label text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-6 text-heading font-medium">{c.title}</h3>
            <p className="mb-8 mt-3 text-fg-muted">{c.text}</p>
            <div className="mt-auto border-t border-line pt-5">
              <p className="label" id={`cap-${i}-evidence`}>
                Evidence:
              </p>
              <ul aria-labelledby={`cap-${i}-evidence`} className="mt-3 flex flex-col gap-2 text-small">
                {c.evidence.map((e) => (
                  <li key={e.label} className="flex gap-2">
                    <span aria-hidden="true" className="font-mono text-fg-subtle">
                      →
                    </span>
                    <SmartLink href={e.href} className="link !text-fg-muted hover:!text-fg">
                      {e.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          </LiftCard>
        ))}
      </div>
    </Section>
  );
}
