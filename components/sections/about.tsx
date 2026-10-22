import { Check } from "@phosphor-icons/react/dist/ssr";
import type { Dictionary } from "@/content/dictionary";
import { container, eyebrow, sectionTitle } from "../ui";

/** The name, the mark, and where the data comes from (with the credits the data asks for). */
export function About({ t }: { t: Dictionary }) {
  const a = t.about;
  return (
    <section id="about" aria-labelledby="about-title" className="py-20 md:py-28">
      <div className={`${container} grid gap-12 lg:grid-cols-12 lg:gap-14`}>
        <div className="flex flex-col gap-6 lg:col-span-7">
          <p className={eyebrow}>{a.eyebrow}</p>
          <h2 id="about-title" className={sectionTitle}>
            {a.title}
          </h2>
          <p className="max-w-[40ch] text-[clamp(1.25rem,2vw,1.625rem)] font-medium leading-snug tracking-[-0.015em] text-ink">
            {a.body[0]}
          </p>
          <p className="max-w-[58ch] text-lg leading-relaxed text-ink-2">{a.body[1]}</p>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-5">
          {/* As the app icon composes it: the tower rising from the bottom edge, on Forest. */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] bg-stage shadow-[inset_0_0_0_1px_var(--stage-ring)]">
            <img
              src="/brand/mark.svg"
              alt={a.markAlt}
              width={409}
              height={512}
              loading="lazy"
              className="absolute bottom-0 left-1/2 h-[80%] w-auto -translate-x-1/2"
            />
          </div>
          <div className="rounded-[24px] bg-surface p-7 shadow-[inset_0_0_0_1px_var(--line)] md:p-8">
            <h3 className="text-[17px] font-semibold text-ink">{a.dataTitle}</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {a.data.map((d) => (
                <li key={d} className="flex gap-3 text-[15px] leading-relaxed text-ink-2">
                  <Check size={18} weight="bold" aria-hidden className="mt-1 shrink-0 text-accent-text" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
