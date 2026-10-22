import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";
import "../globals.css";
import { dictionaries } from "@/content/dictionary";
import { dirOf, isLocale, locales, type Locale } from "@/content/i18n";
import { site } from "@/content/site";

const plex = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-ar",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

// Runs before first paint: the saved theme, else the system's, and follows the system after that
// until the visitor picks one. Same storage key as the web app.
const themeScript = `(function(){var d=document.documentElement,k='murtahil-theme',m=matchMedia('(prefers-color-scheme: dark)');function a(){var s=null;try{s=localStorage.getItem(k)}catch(e){}d.setAttribute('data-theme',s==='light'||s==='dark'?s:(m.matches?'dark':'light'))}a();m.addEventListener('change',a)})();`;

// Open Graph names a locale with its region.
const ogLocale: Record<Locale, string> = { en: "en_US", ar: "ar_SA", tr: "tr_TR" };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = dictionaries[locale];
  return {
    metadataBase: new URL(site.url),
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: `/${locale}/`,
      languages: { ...Object.fromEntries(locales.map((l) => [l, `/${l}/`])), "x-default": "/en/" },
    },
    openGraph: {
      type: "website",
      siteName: "Murtahil",
      title: t.meta.title,
      description: t.meta.description,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      url: `/${locale}/`,
      images: [{ url: `/og-${locale}.png`, width: 1200, height: 630, alt: t.meta.title }],
    },
    twitter: { card: "summary_large_image", title: t.meta.title, description: t.meta.description, images: [`/og-${locale}.png`] },
    icons: { icon: "/brand/icon.svg", apple: "/brand/apple-touch-icon.png" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f7f4" },
    { media: "(prefers-color-scheme: dark)", color: "#071f08" },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html
      lang={locale}
      dir={dirOf(locale)}
      suppressHydrationWarning
      className={`${plex.variable} ${plexArabic.variable} ${plexMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
