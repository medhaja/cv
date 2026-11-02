import { capabilities } from "@/content/site";
import { Section } from "../ui";
import { SmartLink } from "../SmartLink";

/** 5 cards: 3 + 2 on desktop (6-col sub-grid: 2/2/2 then 3/3). */
const spans = ["lg:col-span-2", "lg:col-span-2", "lg:col-span-2", "lg:col-span-3", "lg:col-span-3"];

export function Capabilities() {
  return (
    <Section id="capabilities" index="04" path="/capabilities" label={capabilities.label} title={capabilities.title}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {capabilities.items.map((c, i) => (
          <div
            key={c.title}
            className={`panel flex flex-col p-6 md:p-8 ${spans[i]} ${i === 4 ? "sm:col-span-2 lg:col-span-3" : ""}`}
          >
            <span className="font-mono text-label text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-6 text-heading font-medium">{c.title}</h3>
            <p className="mb-8 mt-3 text-fg-muted">{c.text}</p>
            <p className="mt-auto border-t border-line pt-5 font-mono text-[0.8125rem] leading-relaxed text-fg-subtle">
              Evidence:{" "}
              {c.evidence.map((e, j) => (
                <span key={e.href}>
                  {j > 0 && " · "}
                  <SmartLink href={e.href} className="link !text-fg-muted hover:!text-fg">
                    {e.label}
                  </SmartLink>
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
