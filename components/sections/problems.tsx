import { ArrowElbowDownRight } from "@phosphor-icons/react/dist/ssr";
import type { Dictionary } from "@/content/dictionary";
import { Reveal } from "../reveal";
import { container, eyebrow, sectionTitle } from "../ui";

/** The problems, each paired with what Murtahil does about it. The heading stays in view while the list scrolls. */
export function Problems({ t }: { t: Dictionary }) {
  return (
    <section aria-labelledby="problems-title" className="py-20 md:py-28">
      <div className={`${container} grid gap-10 lg:grid-cols-12 lg:gap-8`}>
        <div className="lg:col-span-4">
          <div className="flex flex-col gap-4 lg:sticky lg:top-28">
            <p className={eyebrow}>{t.problems.eyebrow}</p>
            <h2 id="problems-title" className={`${sectionTitle} max-w-[14ch]`}>
              {t.problems.title}
            </h2>
          </div>
        </div>
        <ol className="flex flex-col border-b border-line lg:col-span-8">
          {t.problems.rows.map((row, i) => (
            <Reveal
              as="li"
              key={row.problem}
              delay={i * 0.04}
              className="grid gap-4 border-t border-line py-8 md:grid-cols-2 md:gap-10 md:py-10"
            >
              <p className="text-[clamp(1.25rem,2vw,1.5rem)] font-semibold leading-snug tracking-[-0.02em] text-ink">
                {row.problem}
              </p>
              <p className="flex gap-3 text-base leading-relaxed text-ink-2 md:text-[17px]">
                <ArrowElbowDownRight size={20} weight="bold" aria-hidden className="flip-rtl mt-1 shrink-0 text-accent-text" />
                <span>{row.answer}</span>
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
