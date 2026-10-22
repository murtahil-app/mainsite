import type { Dictionary } from "@/content/dictionary";
import { container } from "../ui";
import { WebAppButton } from "../web-app-button";

// One skyline from the five countries' landmark silhouettes, in the order the cities are listed.
const skyline = ["sa", "bh", "tr", "eg", "sy"];

/** The app's first question, on the brand stage, over the skyline of every country it covers. */
export function Closing({ t }: { t: Dictionary }) {
  return (
    <section aria-labelledby="cta-title" className="pb-16 pt-4 md:pb-24">
      <div className={container}>
        <div className="relative overflow-hidden rounded-[32px] bg-stage shadow-[inset_0_0_0_1px_var(--stage-ring)]">
          <div className="relative z-10 flex flex-col items-start gap-6 px-7 pb-40 pt-14 md:px-14 md:pb-52 md:pt-20">
            <h2
              id="cta-title"
              className="text-[clamp(3.25rem,9vw,7rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-[#eef5ee]"
            >
              {t.cta.title}
            </h2>
            <p className="max-w-[40ch] text-lg text-[#a9bbac] md:text-xl">{t.cta.body}</p>
            <WebAppButton label={t.nav.openApp} soon={t.nav.soon} onStage className="mt-2" />
          </div>
          {/* The five countries' skylines drift past, the page's one moving band. Static under reduced motion. */}
          <div aria-hidden dir="ltr" className="pointer-events-none absolute inset-x-0 bottom-0 h-28 overflow-hidden md:h-40">
            <div className="skyline flex h-full w-max">
              {[...skyline, ...skyline].map((k, i) => (
                <img
                  key={`${k}-${i}`}
                  src={`/landmarks/${k}-silhouette.svg`}
                  alt=""
                  width={368}
                  height={102}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-auto max-w-none"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
