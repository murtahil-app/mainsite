import type { TimeKind } from "@/content/cities";
import type { Dictionary } from "@/content/dictionary";
import { Reveal } from "../reveal";
import { TimeTag } from "../time-tag";
import { container, sectionBody, sectionTitle } from "../ui";

const kinds: TimeKind[] = ["live", "predicted", "scheduled", "estimated"];

/**
 * The four kinds of time, shown the way the apps show them: a departure board built from the
 * identity's departure-row and line-badge components, then what each label means.
 */
export function Times({ t }: { t: Dictionary }) {
  const s = t.timesSection;
  return (
    <section aria-labelledby="times-title" className="py-20 md:py-28">
      <div className={container}>
        <div className="flex max-w-[62ch] flex-col gap-4">
          <h2 id="times-title" className={sectionTitle}>
            {s.title}
          </h2>
          <p className={sectionBody}>{s.body}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 items-start gap-10 md:mt-14 lg:grid-cols-12 lg:gap-12">
          <figure className="min-w-0 lg:col-span-7">
            <ul className="divide-y divide-line overflow-hidden rounded-[24px] bg-surface shadow-[inset_0_0_0_1px_var(--line)]">
              {s.board.map((row, i) => (
                <Reveal as="li" key={row.badge} delay={i * 0.08} y={10} className="flex items-center gap-4 px-5 py-4 md:gap-5 md:px-6 md:py-5">
                  <span
                    dir="ltr"
                    className="tnum grid h-8 min-w-12 shrink-0 place-items-center rounded-[8px] px-2 font-mono text-[14px] font-semibold text-white"
                    style={{ backgroundColor: row.color }}
                  >
                    {row.badge}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-[16px] font-semibold text-ink md:text-[17px]">{row.dest}</span>
                    <span className="truncate text-sm text-ink-3">{row.place}</span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-4">
                    <span className="tnum whitespace-nowrap font-mono text-[17px] font-medium text-ink md:text-lg">{row.time}</span>
                    <TimeTag kind={row.kind} label={t.times[row.kind].name} size="sm" />
                  </span>
                </Reveal>
              ))}
            </ul>
            <figcaption className="mt-3 px-1 text-sm text-ink-3">{s.caption}</figcaption>
          </figure>

          <dl className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:col-span-5 lg:pt-2">
            {kinds.map((k) => (
              <div key={k} className="flex flex-col items-start gap-3">
                <dt>
                  <TimeTag kind={k} label={t.times[k].name} />
                </dt>
                <dd className="text-[15px] leading-relaxed text-ink-2">{t.times[k].body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
