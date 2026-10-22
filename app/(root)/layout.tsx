import type { Metadata } from "next";

// "/" only picks a language and moves on; the site itself lives under /en/, /ar/ and /tr/.
export const metadata: Metadata = {
  title: "Murtahil",
  alternates: { languages: { en: "/en/", ar: "/ar/", tr: "/tr/", "x-default": "/en/" } },
  icons: { icon: "/brand/icon.svg" },
  robots: { index: false },
};

export default function RootRedirectLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#f4f7f4", fontFamily: "system-ui, sans-serif" }}>{children}</body>
    </html>
  );
}
