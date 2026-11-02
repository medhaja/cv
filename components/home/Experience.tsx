import { experience } from "@/content/site";
import { Section } from "../ui";

export function Experience() {
  return (
    <Section
      id="experience"
      index="03"
      path="/experience"
      label={experience.label}
      title={experience.title}
      aside={
        <p className="mt-6 hidden md:block">
          <span className="block font-mono text-stat tabular">{experience.stat.value}</span>
          <span className="mt-2 block text-small text-fg-muted">{experience.stat.label}</span>
        </p>
      }
    >
      <div className="grid grid-cols-1 gap-x-6 md:grid-cols-12">
        <p className="mb-10 flex items-baseline gap-3 md:hidden">
          <span className="font-mono text-stat tabular">{experience.stat.value}</span>
          <span className="text-small text-fg-muted">{experience.stat.label}</span>
        </p>

        <ol className="relative md:col-span-9 md:col-start-4">
          {/* Spine */}
          <span aria-hidden="true" className="absolute bottom-2 left-[5px] top-2 w-px bg-line-strong" />
          {experience.roles.map((r) => (
            <li key={r.org} className="relative grid grid-cols-1 gap-x-6 gap-y-2 pb-12 pl-8 last:pb-0 md:grid-cols-9">
              <span
                aria-hidden="true"
                className={`absolute left-0 top-[0.45rem] size-[11px] rounded-full border ${
                  r.current
                    ? "border-signal bg-signal shadow-[0_0_14px_3px_rgb(255_181_71/0.35)]"
                    : "border-line-strong bg-ink-950"
                }`}
              />
              <p className="font-mono text-small tabular text-fg-subtle md:col-span-2">
                <time dateTime={r.start.iso}>{r.start.label}</time> –{" "}
                {r.end ? <time dateTime={r.end.iso}>{r.end.label}</time> : "Present"}
              </p>
              <div className="md:col-span-7">
                <h3 className="flex flex-wrap items-center gap-3 text-heading font-medium">
                  {r.title}
                  {r.current && <span className="tag !border-signal/40 !text-signal">Current</span>}
                </h3>
                <p className="mt-1 text-fg-muted">{r.org}</p>
                {r.bullets && (
                  <ul className="ticks mt-5 text-small text-fg-muted">
                    {r.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
