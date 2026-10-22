export const locales = ["en", "ar", "tr"] as const;
export type Locale = (typeof locales)[number];

/** Each language in its own name, for the language links. */
export const localeNames: Record<Locale, string> = { en: "English", ar: "العربية", tr: "Türkçe" };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dirOf(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

/** The languages a page links to: every locale but its own. */
export function otherLocales(locale: Locale) {
  return locales.filter((l) => l !== locale);
}

/** A string in every language, as the city data stores it. */
export type Bi = { en: string; ar: string; tr: string };
