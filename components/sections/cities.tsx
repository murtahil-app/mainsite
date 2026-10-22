import { cities, countries, modeNames, type CountryCode } from "@/content/cities";
import type { Dictionary } from "@/content/dictionary";
import { dirOf, type Locale } from "@/content/i18n";
import { site, webAppCity } from "@/content/site";
import { CityExplorer, type CityView, type CountryGroup } from "../city-explorer";
import { container, fill, sectionBody, sectionTitle } from "../ui";

const flag = (c: CountryCode) => `/flags/${c.toLowerCase()}.svg`;

export function Cities({ t, locale }: { t: Dictionary; locale: Locale }) {
  const other = locale === "ar" ? "en" : "ar";
  const views: CityView[] = cities.map((c) => ({
    id: c.id,
    name: c.name[locale],
    altName: c.name[other],
    altLang: other,
    flag: flag(c.country),
    country: countries[c.country][locale],
    modes: c.modes.map((m) => ({ key: m, name: modeNames[m][locale] })),
    times: c.times.map((k) => ({
      kind: k,
      name: k === "live" && c.liveInAppsOnly ? t.cities.liveInApps : t.times[k].name,
    })),
    summary: c.summary[locale],
    // Turkish groups thousands with a dot (a comma there is the decimal point).
    facts: c.facts.map((f) => ({ value: locale === "tr" ? f.value.replace(/,/g, ".") : f.value, label: f.label[locale] })),
    landmarks: c.landmarks[locale],
    href: site.webAppPublic ? webAppCity(c.id) : null,
    plan: fill(t.cities.plan, { city: c.name[locale] }),
  }));

  const groups: CountryGroup[] = [];
  for (const c of cities) {
    const name = countries[c.country][locale];
    let g = groups.find((x) => x.name === name);
    if (!g) groups.push((g = { name, flag: flag(c.country), ids: [] }));
    g.ids.push(c.id);
  }

  return (
    <section id="cities" aria-labelledby="cities-title" className="py-20 md:py-28">
      <div className={container}>
        <div className="flex max-w-[62ch] flex-col gap-4">
          <h2 id="cities-title" className={sectionTitle}>
            {t.cities.title}
          </h2>
          <p className={sectionBody}>{t.cities.body}</p>
        </div>
        <div className="mt-10 md:mt-14">
          <CityExplorer
            cities={views}
            groups={groups}
            dir={dirOf(locale)}
            labels={{ modes: t.cities.modes, times: t.cities.times, choose: t.cities.choose }}
          />
        </div>
      </div>
    </section>
  );
}
