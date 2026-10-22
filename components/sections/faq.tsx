import { Plus } from "@phosphor-icons/react/dist/ssr";
import type { Dictionary } from "@/content/dictionary";
import { site } from "@/content/site";
import { container, sectionTitle } from "../ui";

/** Native disclosure widgets: keyboard and screen-reader support without script. */
export function Faq({ t }: { t: Dictionary }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="py-20 md:py-28">
      <div className={container}>
        <div className="mx-auto max-w-[820px]">
          <h2 id="faq-title" className={sectionTitle}>
            {t.faq.title}
          </h2>
          <div className="mt-10 border-t border-line">
            {t.faq.items.map((item) => (
              <details key={item.q} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[clamp(1.0625rem,1.6vw,1.25rem)] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="grid size-9 shrink-0 place-items-center rounded-[12px] text-ink-2 shadow-[inset_0_0_0_1px_var(--line-2)] transition-transform duration-300 ease-brand group-open:rotate-45">
                    <Plus size={18} weight="bold" aria-hidden />
                  </span>
                </summary>
                <p className="max-w-[64ch] pb-7 text-[17px] leading-relaxed text-ink-2">
                  {!site.webAppPublic && item.aSoon ? item.aSoon : item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
