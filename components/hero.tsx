import { ArrowDown } from "@phosphor-icons/react/dist/ssr";
import type { Dictionary } from "@/content/dictionary";
import type { Locale } from "@/content/i18n";
import { Phone } from "./phone";
import { site } from "@/content/site";
import { button, container } from "./ui";
import { WebAppButton } from "./web-app-button";

/**
 * Asymmetric split: the tagline across the top, the pitch and actions on the leading side, and the
 * product on the brand stage: the web app planning a Doha trip on a desktop, and the iPhone app a
 * Riyadh one.
 */
export function Hero({ t, locale }: { t: Dictionary; locale: Locale }) {
  return (
    <section className="relative overflow-x-clip pb-20 md:pb-28">
      <div className={`${container} pt-10 md:pt-16 lg:pt-20`}>
        <h1 className="rise max-w-[20ch] text-balance text-[clamp(2.6rem,6.4vw,5rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-ink">
          {t.hero.title}
        </h1>

        <div className="mt-8 grid gap-12 md:mt-10 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-8 lg:col-span-4 lg:pt-3">
            <p className="rise max-w-[38ch] text-lg leading-relaxed text-ink-2 [animation-delay:90ms] md:text-xl">
              {t.hero.sub}
            </p>
            <div className="rise flex flex-wrap gap-3 [animation-delay:170ms]">
              <WebAppButton label={t.nav.openApp} soon={t.nav.soon} />
              {/* Before launch the web app button is inert, so the cities take the green. */}
              <a href="#cities" className={site.webAppPublic ? button.secondary : button.primary}>
                {t.hero.secondary}
                <ArrowDown size={18} aria-hidden />
              </a>
            </div>
          </div>

          <div className="relative lg:col-span-8">
            <div className="rise relative aspect-[16/11] overflow-hidden rounded-[32px] bg-stage shadow-[inset_0_0_0_1px_var(--stage-ring)] [animation-delay:120ms] sm:aspect-[16/10]">
              <img
                src={`/img/web-doha-${locale}.webp`}
                alt={t.hero.webAlt}
                width={1600}
                height={1000}
                fetchPriority="high"
                decoding="async"
                className="absolute start-[6%] top-[9%] w-[124%] max-w-none rounded-[14px] shadow-[0_0_0_1px_rgb(255_255_255/0.08),0_40px_80px_-30px_rgb(0_0_0/0.6)] sm:w-[118%]"
              />
            </div>
            <div className="rise absolute -bottom-12 end-[3%] w-[36%] max-w-[230px] [--rise:48px] [animation-delay:320ms] [animation-duration:1.1s] sm:-bottom-14 sm:w-[27%]">
              <Phone
                src="/img/ios-route-riyadh.webp"
                alt={t.hero.phoneAlt}
                width={720}
                height={1558}
                eager
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
