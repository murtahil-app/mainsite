"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { List, Moon, Sun, X } from "@phosphor-icons/react";
import type { Dictionary } from "@/content/dictionary";
import { localeNames, otherLocales, type Locale } from "@/content/i18n";
import { Lockup } from "./lockup";
import { container } from "./ui";
import { WebAppButton } from "./web-app-button";

const THEME_KEY = "murtahil-theme";

export function SiteHeader({ t, locale }: { t: Dictionary; locale: Locale }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const toggleRef = useRef<HTMLButtonElement>(null);

  const links: [string, string][] = [
    ["#cities", t.nav.cities],
    ["#features", t.nav.features],
    ["#apps", t.nav.apps],
    ["#about", t.nav.about],
    ["#faq", t.nav.faq],
  ];
  const others = otherLocales(locale);

  function toggleTheme() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    // Mute transitions for the switch so every surface changes together instead of shimmering.
    root.setAttribute("data-theme-switching", "");
    root.setAttribute("data-theme", next);
    requestAnimationFrame(() => requestAnimationFrame(() => root.removeAttribute("data-theme-switching")));
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* private mode: the choice lasts for this page only */
    }
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50 focus:rounded-[12px] focus:bg-surface focus:px-4 focus:py-2 focus:text-ink"
      >
        {t.skip}
      </a>
      <div className={`${container} flex h-16 items-center gap-4`}>
        <a href={`/${locale}/`} aria-label={t.brand.home} className="rounded-[8px]">
          <Lockup locale={locale} />
        </a>

        <nav aria-label={t.brand.latin} className="ms-8 hidden items-center gap-1 lg:flex">
          {links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-[12px] px-3 py-2 text-[15px] font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-1.5">
          {others.map((l) => (
            <a
              key={l}
              href={`/${l}/`}
              hrefLang={l}
              lang={l}
              className="hidden h-10 items-center rounded-[12px] px-3 text-[15px] font-medium text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink sm:inline-flex"
            >
              {localeNames[l]}
            </a>
          ))}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={t.nav.theme}
            title={t.nav.theme}
            className="grid size-10 place-items-center rounded-[12px] text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <Moon size={20} className="only-light" aria-hidden />
            <Sun size={20} className="only-dark" aria-hidden />
          </button>
          <span className="ms-2 hidden md:block">
            <WebAppButton label={t.nav.openApp} soon={t.nav.soon} compact />
          </span>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.nav.close : t.nav.menu}
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-[12px] text-ink transition-colors hover:bg-surface-2 lg:hidden"
          >
            {open ? <X size={22} aria-hidden /> : <List size={22} aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="mobile-nav"
            key="mobile-nav"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-line bg-canvas lg:hidden"
          >
            <nav aria-label={t.brand.latin} className={`${container} flex flex-col py-3`}>
              {links.map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="rounded-[12px] px-3 py-3 text-lg font-medium text-ink hover:bg-surface-2"
                >
                  {label}
                </a>
              ))}
              <span className="flex gap-1 sm:hidden">
                {others.map((l) => (
                  <a
                    key={l}
                    href={`/${l}/`}
                    hrefLang={l}
                    lang={l}
                    className="rounded-[12px] px-3 py-3 text-lg font-medium text-ink-2 hover:bg-surface-2"
                  >
                    {localeNames[l]}
                  </a>
                ))}
              </span>
              <span className="mt-3 flex md:hidden">
                <WebAppButton label={t.nav.openApp} soon={t.nav.soon} className="flex-1" />
              </span>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
