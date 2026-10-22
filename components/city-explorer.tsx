"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import type { Mode, TimeKind } from "@/content/cities";
import { modeIcon } from "./icons";
import { TimeTag } from "./time-tag";

export type CityView = {
  id: string;
  name: string;
  /** The name in the other script, under the main one. */
  altName: string;
  altLang: "en" | "ar";
  flag: string;
  country: string;
  modes: { key: Mode; name: string }[];
  times: { kind: TimeKind; name: string }[];
  summary: string;
  facts: { value: string; label: string }[];
  landmarks: string;
  /** The web app opened on this city; null until the web app is public. */
  href: string | null;
  plan: string;
};

export type CountryGroup = { name: string; flag: string; ids: string[] };

// A link from another page (/en/#city-bahrain) carries the city in the hash, but the router
// rewrites the URL during hydration and drops it; read it while this module loads, before that.
const hashOnLoad = typeof window === "undefined" ? "" : window.location.hash;

/**
 * The web app's city switcher, as a website section: countries and their cities on the leading
 * side, the chosen city's landmark scene and what Murtahil covers there beside it. The scenes are
 * the web app's own drawings; by night in dark mode.
 */
export function CityExplorer({
  cities,
  groups,
  labels,
  dir,
}: {
  cities: CityView[];
  groups: CountryGroup[];
  labels: { modes: string; times: string; choose: string };
  dir: "ltr" | "rtl";
}) {
  const comma = dir === "rtl" ? "، " : ", ";
  const [active, setActive] = useState(cities[0].id);
  const reduce = useReducedMotion();
  const desktopTabs = useRef<Record<string, HTMLButtonElement | null>>({});
  const mobileTabs = useRef<Record<string, HTMLButtonElement | null>>({});
  const city = cities.find((c) => c.id === active) ?? cities[0];
  const order = cities.map((c) => c.id);

  // Links elsewhere on the page (the footer's city list) open a city with #city-<id>.
  useEffect(() => {
    const ids = cities.map((c) => c.id);
    function fromHash(hash: string) {
      const m = /^#city-([a-z]+)$/.exec(hash);
      if (!m || !ids.includes(m[1])) return;
      setActive(m[1]);
      document.getElementById("cities")?.scrollIntoView({ block: "start" });
    }
    fromHash(hashOnLoad);
    const onChange = () => fromHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, [cities]);

  function onKey(e: React.KeyboardEvent, refs: React.RefObject<Record<string, HTMLButtonElement | null>>) {
    const i = order.indexOf(active);
    const forward = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
    const back = dir === "rtl" ? "ArrowRight" : "ArrowLeft";
    let next = -1;
    if (e.key === "ArrowDown" || e.key === forward) next = (i + 1) % order.length;
    else if (e.key === "ArrowUp" || e.key === back) next = (i - 1 + order.length) % order.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = order.length - 1;
    if (next < 0) return;
    e.preventDefault();
    setActive(order[next]);
    refs.current[order[next]]?.focus();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
      {/* Phones and tablets: one scrolling row of cities. */}
      <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:hidden">
        <div
          role="tablist"
          aria-label={labels.choose}
          aria-orientation="horizontal"
          className="flex w-max snap-x gap-2 pb-1"
          onKeyDown={(e) => onKey(e, mobileTabs)}
        >
          {cities.map((c) => {
            const on = c.id === active;
            return (
              <button
                key={c.id}
                ref={(el) => {
                  mobileTabs.current[c.id] = el;
                }}
                id={`city-tab-m-${c.id}`}
                type="button"
                role="tab"
                aria-selected={on}
                aria-controls="city-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(c.id)}
                className={`inline-flex h-11 snap-start items-center gap-2 rounded-[12px] px-3.5 text-[15px] font-medium transition-colors ${
                  on ? "bg-ink text-canvas" : "text-ink shadow-[inset_0_0_0_1px_var(--line-2)] hover:bg-surface-2"
                }`}
              >
                <img src={c.flag} alt="" width={20} height={14} className="h-3.5 w-5 rounded-[3px] object-cover" />
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktops: grouped by country, as the web app's switcher groups them. */}
      <div
        role="tablist"
        aria-label={labels.choose}
        aria-orientation="vertical"
        className="hidden flex-col gap-5 lg:col-span-4 lg:flex"
        onKeyDown={(e) => onKey(e, desktopTabs)}
      >
        {groups.map((g) => {
          // A country of one city with the same name (Bahrain) needs no heading over itself;
          // its flag moves into the row.
          const solo = g.ids.length === 1 && cities.find((x) => x.id === g.ids[0])?.name === g.name;
          return (
          <div key={g.name} role="presentation" className="flex flex-col gap-1">
            {!solo && (
              <div role="presentation" className="flex items-center gap-2 px-4 pb-1 text-[13px] font-semibold text-ink-3">
                <img src={g.flag} alt="" width={20} height={14} className="h-3.5 w-5 rounded-[3px] object-cover" />
                {g.name}
              </div>
            )}
            {g.ids.map((id) => {
              const c = cities.find((x) => x.id === id)!;
              const on = id === active;
              return (
                <button
                  key={id}
                  ref={(el) => {
                    desktopTabs.current[id] = el;
                  }}
                  id={`city-tab-${id}`}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls="city-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(id)}
                  className={`group relative flex w-full items-center gap-4 rounded-[12px] px-4 py-2.5 text-start transition-[background-color,box-shadow] duration-200 ${
                    on ? "bg-surface shadow-[inset_0_0_0_1px_var(--line-2)]" : "hover:bg-surface-2/70"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`absolute inset-y-3 start-0 w-[3px] rounded-full bg-route transition-opacity ${on ? "opacity-100" : "opacity-0"}`}
                  />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="flex items-center gap-2 text-[17px] font-semibold text-ink">
                      {solo && <img src={c.flag} alt="" width={20} height={14} className="h-3.5 w-5 rounded-[3px] object-cover" />}
                      {c.name}
                    </span>
                    <span className="truncate text-sm text-ink-3">{c.modes.map((m) => m.name).join(comma)}</span>
                  </span>
                  <ArrowRight
                    size={18}
                    weight="bold"
                    aria-hidden
                    className={`flip-rtl shrink-0 text-accent-text transition-opacity ${on ? "opacity-100" : "opacity-0"}`}
                  />
                </button>
              );
            })}
          </div>
          );
        })}
      </div>

      <div
        id="city-panel"
        role="tabpanel"
        aria-labelledby={`city-tab-${active}`}
        className="overflow-hidden rounded-[24px] bg-surface shadow-[inset_0_0_0_1px_var(--line)] lg:sticky lg:top-24 lg:col-span-8 lg:self-start"
      >
        <div className="relative h-[210px] overflow-hidden bg-[#ddf1fa] sm:h-[260px] lg:h-[300px] dark:bg-[#0b2433]">
          {cities.map((c) => {
            const on = c.id === active;
            const img = "absolute bottom-0 left-1/2 h-full w-[175%] max-w-none -translate-x-1/2 sm:w-[125%] lg:w-full";
            return (
              <div
                key={c.id}
                aria-hidden={!on}
                className={`absolute inset-0 transition-opacity duration-500 ease-brand ${on ? "opacity-100" : "opacity-0"}`}
              >
                <img src={`/landmarks/${c.id}-day.svg`} alt={on ? c.landmarks : ""} loading="lazy" decoding="async" className={`only-light ${img}`} />
                <img src={`/landmarks/${c.id}-night.svg`} alt={on ? c.landmarks : ""} loading="lazy" decoding="async" className={`only-dark ${img}`} />
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={city.id}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-col gap-7 p-6 md:p-8">
              <div className="flex flex-col gap-3">
                <p className="flex items-center gap-2 text-sm font-medium text-ink-3">
                  <img src={city.flag} alt="" width={20} height={14} className="h-3.5 w-5 rounded-[3px] object-cover" />
                  {city.country}
                </p>
                <h3 className="text-[clamp(1.75rem,3vw,2.25rem)] font-semibold leading-tight tracking-[-0.03em] text-ink">
                  {city.name}
                  <span lang={city.altLang} className="ms-3 align-baseline text-[0.6em] font-medium tracking-normal text-heading-tint">
                    {city.altName}
                  </span>
                </h3>
                <p className="max-w-[56ch] text-base leading-relaxed text-ink-2 md:text-[17px]">{city.summary}</p>
              </div>
              {city.facts.length > 0 && (
                // Up to six figures (Istanbul), three to a row: number over its label.
                <dl className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3">
                  {city.facts.map((f) => (
                    <div key={f.label} className="flex flex-col-reverse items-start justify-end gap-1.5">
                      <dt className="max-w-[24ch] text-sm leading-snug text-ink-3">{f.label}</dt>
                      <dd dir="ltr" className="tnum font-mono text-[1.75rem] font-medium leading-none tracking-[-0.02em] text-ink md:text-[2rem]">
                        {f.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            <div className="grid gap-6 border-t border-line p-6 md:grid-cols-2 md:p-8">
              <div className="flex flex-col gap-3">
                <h4 className="text-[13px] font-semibold text-ink-3">{labels.modes}</h4>
                <ul className="flex flex-wrap gap-2">
                  {city.modes.map((m) => {
                    const Icon = modeIcon[m.key];
                    return (
                      <li
                        key={m.key}
                        className="inline-flex h-8 items-center gap-1.5 rounded-[8px] px-2.5 text-[13px] font-medium text-ink-2 shadow-[inset_0_0_0_1px_var(--line-2)]"
                      >
                        <Icon size={16} aria-hidden />
                        {m.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="flex flex-col gap-3">
                <h4 className="text-[13px] font-semibold text-ink-3">{labels.times}</h4>
                <ul className="flex flex-wrap gap-2">
                  {city.times.map((tk) => (
                    <li key={tk.kind}>
                      <TimeTag kind={tk.kind} label={tk.name} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {city.href && (
            <div className="px-6 pb-6 md:px-8 md:pb-8">
              <a
                href={city.href}
                className="group inline-flex items-center gap-2 text-[15px] font-semibold text-link underline-offset-4 hover:underline"
              >
                {city.plan}
                <ArrowRight size={18} weight="bold" aria-hidden className="flip-rtl transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
              </a>
            </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
