import { notFound } from "next/navigation";
import { Hero } from "@/components/hero";
import { About } from "@/components/sections/about";
import { Apps } from "@/components/sections/apps";
import { Cities } from "@/components/sections/cities";
import { Closing } from "@/components/sections/closing";
import { Faq } from "@/components/sections/faq";
import { Features } from "@/components/sections/features";
import { Languages } from "@/components/sections/languages";
import { Problems } from "@/components/sections/problems";
import { Times } from "@/components/sections/times";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { dictionaries } from "@/content/dictionary";
import { isLocale } from "@/content/i18n";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = dictionaries[locale];
  return (
    <>
      <SiteHeader t={t} locale={locale} />
      <main id="main">
        <Hero t={t} locale={locale} />
        <Cities t={t} locale={locale} />
        <Problems t={t} />
        <Features t={t} locale={locale} />
        <Times t={t} />
        <Languages t={t} />
        <Apps t={t} locale={locale} />
        <About t={t} />
        <Faq t={t} />
        <Closing t={t} />
      </main>
      <SiteFooter t={t} locale={locale} />
    </>
  );
}
