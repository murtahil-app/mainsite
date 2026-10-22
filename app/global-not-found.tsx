import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";

// The site has two root layouts (/ and /[locale]/), so the 404 for unknown paths is its own page:
// exported as out/404.html, which the Worker's static assets serve for anything that doesn't exist.
// Bilingual, because an unknown path says nothing about the visitor's language.

const plex = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "600"], variable: "--font-plex", display: "swap" });
const plexArabic = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "600"], variable: "--font-plex-ar", display: "swap" });

const themeScript = `(function(){var d=document.documentElement,s=null;try{s=localStorage.getItem('murtahil-theme')}catch(e){}d.setAttribute('data-theme',s==='light'||s==='dark'?s:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'))})();`;

export const metadata: Metadata = {
  title: "Murtahil: page not found",
  robots: { index: false },
  icons: { icon: "/brand/icon.svg" },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" suppressHydrationWarning className={`${plex.variable} ${plexArabic.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <main className="mx-auto grid min-h-[100dvh] max-w-[1280px] content-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <img src="/brand/mark.svg" alt="Murtahil" width={409} height={512} className="h-14 w-auto lg:col-span-2" />
          <div className="flex flex-col items-start gap-4">
            <h1 className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-ink">
              This stop isn’t on the map.
            </h1>
            <p className="max-w-[44ch] text-lg leading-relaxed text-ink-2">
              The page you were looking for doesn’t exist or has moved.
            </p>
            <a href="/en/" className="mt-2 font-semibold text-link underline-offset-4 hover:underline">
              Go to the homepage
            </a>
          </div>
          <div lang="ar" dir="rtl" className="flex flex-col items-start gap-4 font-arabic">
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.3] text-ink">هذه المحطة ليست على الخريطة.</h2>
            <p className="max-w-[44ch] text-lg leading-[1.85] text-ink-2">الصفحة التي تبحث عنها غير موجودة أو نُقلت.</p>
            <a href="/ar/" className="mt-2 font-semibold text-link underline-offset-4 hover:underline">
              انتقل إلى الصفحة الرئيسية
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
