import { AndroidLogo, AppleLogo, Browser } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import type { Dictionary } from "@/content/dictionary";
import type { Locale } from "@/content/i18n";
import { site } from "@/content/site";
import { Reveal } from "../reveal";
import { container, sectionBody, sectionTitle } from "../ui";
import { WebAppButton } from "../web-app-button";

const icons: Record<string, Icon> = { web: Browser, ios: AppleLogo, android: AndroidLogo };

/** Where Murtahil runs today, and what's still in beta. No store links until the release is real. */
export function Apps({ t, locale }: { t: Dictionary; locale: Locale }) {
  const a = t.apps;
  const live = site.webAppPublic;
  return (
    <section id="apps" aria-labelledby="apps-title" className="py-20 md:py-28">
      <div className={`${container} grid items-center gap-12 lg:grid-cols-12 lg:gap-14`}>
        <Reveal className="order-last lg:order-first lg:col-span-7">
          <div className="overflow-hidden rounded-[20px] bg-surface shadow-[0_0_0_1px_var(--line-2),0_40px_80px_-40px_rgb(var(--shadow-tint)/0.45)]">
            <img
              src={`/img/web-istanbul-${locale}-light.webp`}
              alt={a.alt}
              width={1600}
              height={1000}
              loading="lazy"
              decoding="async"
              className="only-light block h-auto w-full"
            />
            <img
              src={`/img/web-istanbul-${locale}-dark.webp`}
              alt={a.alt}
              width={1600}
              height={1000}
              loading="lazy"
              decoding="async"
              className="only-dark block h-auto w-full"
            />
          </div>
        </Reveal>

        <div className="flex flex-col gap-8 lg:col-span-5">
          <div className="flex flex-col gap-4">
            <h2 id="apps-title" className={sectionTitle}>
              {live ? a.title : a.titleSoon}
            </h2>
            <p className={sectionBody}>{live ? a.body : a.bodySoon}</p>
          </div>

          <ul className="flex flex-col divide-y divide-line border-y border-line">
            {a.items.map((item) => {
              const Glyph = icons[item.key];
              const available = item.key === "web" && live;
              return (
                <li key={item.key} className="flex gap-4 py-5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-surface text-ink shadow-[inset_0_0_0_1px_var(--line)]">
                    <Glyph size={22} aria-hidden />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-[17px] font-semibold text-ink">{item.name}</h3>
                      <span
                        className={`rounded-[8px] px-2 py-0.5 text-[12px] font-semibold ${
                          available ? "bg-route/14 text-accent-text" : "bg-surface-2 text-ink-2"
                        }`}
                      >
                        {available ? a.available : item.key === "web" ? a.comingSoon : a.beta}
                      </span>
                    </div>
                    <p className="text-[15px] leading-relaxed text-ink-2">{item.body}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div>
            <WebAppButton label={t.nav.openApp} soon={t.nav.soon} />
          </div>
        </div>
      </div>
    </section>
  );
}
