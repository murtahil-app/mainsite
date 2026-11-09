import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeleteAccount } from "@/components/delete-account";
import { Lockup } from "@/components/lockup";
import { container } from "@/components/ui";
import { dictionaries } from "@/content/dictionary";
import { isLocale, localeNames, locales, otherLocales, type Locale } from "@/content/i18n";

// Account and data deletion, the page the store listings link to (murtahil.net/delete sends visitors
// here in their language). The work happens in the browser: components/delete-account.tsx.

const legalSuffix: Record<Locale, string> = { en: "", ar: "_ar", tr: "_tr" };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = dictionaries[locale].deletion;
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: {
      canonical: `/${locale}/delete/`,
      languages: { ...Object.fromEntries(locales.map((l) => [l, `/${l}/delete/`])), "x-default": "/en/delete/" },
    },
    openGraph: null,
  };
}

export default async function DeletePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = dictionaries[locale];
  return (
    <>
      <header className="border-b border-line">
        <div className={`${container} flex h-[72px] items-center justify-between gap-4`}>
          <a href={`/${locale}/`} aria-label={t.brand.home} className="rounded-[8px]">
            <Lockup locale={locale} />
          </a>
          <nav className="flex items-center gap-4 text-[15px]">
            {otherLocales(locale).map((l) => (
              <a key={l} href={`/${l}/delete/`} hrefLang={l} lang={l} className="text-ink-2 transition-colors hover:text-ink">
                {localeNames[l]}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <main id="main" className={`${container} max-w-[760px] py-12 md:py-16`}>
        <DeleteAccount t={t.deletion} locale={locale} />
      </main>
      <footer className="border-t border-line">
        <div className={`${container} flex flex-wrap gap-x-5 gap-y-2 py-6 text-sm text-ink-3`}>
          <p>{t.footer.rights}</p>
          <a href={`/terms${legalSuffix[locale]}`} className="transition-colors hover:text-ink">
            {t.footer.terms}
          </a>
          <a href={`/privacy${legalSuffix[locale]}`} className="transition-colors hover:text-ink">
            {t.footer.privacy}
          </a>
        </div>
      </footer>
    </>
  );
}
