import type { Dictionary } from "@/content/dictionary";
import { Reveal } from "../reveal";
import { container, sectionBody, sectionTitle } from "../ui";

/** The same departure in three languages, each set in its own direction. Numbers stay in Plex Mono. */
export function Languages({ t }: { t: Dictionary }) {
  const l = t.languages;
  return (
    <section aria-labelledby="languages-title" className="border-y border-line bg-surface/60 py-20 md:py-28 dark:bg-surface/40">
      <div className={container}>
        <div className="flex max-w-[62ch] flex-col gap-4">
          <h2 id="languages-title" className={sectionTitle}>
            {l.title}
          </h2>
          <p className={sectionBody}>{l.body}</p>
        </div>

        <div className="mt-10 flex flex-col md:mt-14">
          {l.samples.map((s, i) => {
            const [before, after] = s.text.split("4");
            const rtl = s.lang === "ar";
            return (
              <Reveal
                key={s.lang}
                delay={i * 0.08}
                className="grid items-baseline gap-2 border-t border-line py-7 md:grid-cols-[180px_minmax(0,1fr)] md:gap-10 md:py-9"
              >
                <span lang={s.lang} className="text-sm font-semibold text-ink-3">
                  {s.name}
                </span>
                <p
                  lang={s.lang}
                  dir={rtl ? "rtl" : "ltr"}
                  className={`text-start font-medium text-ink ${
                    rtl
                      ? "font-arabic text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.5]"
                      : "text-[clamp(1.5rem,3vw,2.6rem)] leading-[1.15] tracking-[-0.025em]"
                  }`}
                >
                  {before}
                  <span dir="ltr" className="tnum font-mono font-medium text-link">
                    4
                  </span>
                  {after}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
