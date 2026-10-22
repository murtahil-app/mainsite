import { cities } from "@/content/cities";
import type { Dictionary } from "@/content/dictionary";
import { localeNames, otherLocales, type Locale } from "@/content/i18n";
import { site } from "@/content/site";
import { Lockup } from "./lockup";
import { container } from "./ui";

const linkClass = "text-[15px] text-ink-2 transition-colors hover:text-ink";
const headClass = "text-[13px] font-semibold text-ink-3";

export function SiteFooter({ t, locale }: { t: Dictionary; locale: Locale }) {
  return (
    <footer className="border-t border-line">
      <div className={`${container} grid gap-12 py-14 md:py-16 lg:grid-cols-12`}>
        <div className="flex flex-col gap-4 lg:col-span-4">
          <Lockup locale={locale} size="lg" />
          <p className="max-w-[30ch] text-[15px] leading-relaxed text-ink-2">{t.footer.tagline}</p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8">
          <nav aria-labelledby="f-product" className="flex flex-col gap-3">
            <h2 id="f-product" className={headClass}>
              {t.footer.product}
            </h2>
            <a href={site.webAppPublic ? site.webApp : "#apps"} className={linkClass}>
              {t.apps.items[0].name}
            </a>
            <a href="#features" className={linkClass}>
              {t.nav.features}
            </a>
            <a href="#apps" className={linkClass}>
              {t.nav.apps}
            </a>
          </nav>

          <nav aria-labelledby="f-cities" className="flex flex-col gap-3">
            <h2 id="f-cities" className={headClass}>
              {t.footer.citiesTitle}
            </h2>
            {cities.map((c) => (
              <a key={c.id} href={`#city-${c.id}`} className={linkClass}>
                {c.name[locale]}
              </a>
            ))}
          </nav>

          <nav aria-labelledby="f-org" className="flex flex-col gap-3">
            <h2 id="f-org" className={headClass}>
              {t.footer.org}
            </h2>
            <a href="#about" className={linkClass}>
              {t.nav.about}
            </a>
            <a href="#faq" className={linkClass}>
              {t.nav.faq}
            </a>
            {site.contactEmail && (
              <a href={`mailto:${site.contactEmail}`} className={linkClass}>
                {site.contactEmail}
              </a>
            )}
            {otherLocales(locale).map((l) => (
              <a key={l} href={`/${l}/`} hrefLang={l} lang={l} className={linkClass}>
                {localeNames[l]}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-line">
        <div className={`${container} flex flex-col gap-2 py-6 text-sm text-ink-3 md:flex-row md:items-center md:justify-between`}>
          <p>{t.footer.rights}</p>
          <p>{t.footer.mapCredit}</p>
        </div>
      </div>
    </footer>
  );
}
