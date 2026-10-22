import { ArrowRight, ChatCircleText, MapPin, Path, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import type { Dictionary } from "@/content/dictionary";
import type { Locale } from "@/content/i18n";
import { Phone } from "../phone";
import { Reveal } from "../reveal";
import { container, sectionBody, sectionTitle } from "../ui";

const cellTitle = "text-[clamp(1.25rem,1.8vw,1.5rem)] font-semibold leading-snug tracking-[-0.02em]";
const cellBody = "max-w-[46ch] text-[15px] leading-relaxed md:text-base";

/**
 * Bento of what the phone apps do on the trip itself. Every picture is the app: iOS captures,
 * and the Android tracking cards as the app's screenshot tests render them.
 */
export function Features({ t, locale }: { t: Dictionary; locale: Locale }) {
  const f = t.features;
  const cards =
    locale === "ar"
      ? [{ src: "/img/card-countdown-ar.webp", w: 900, h: 307 }]
      : [
          { src: "/img/card-countdown.webp", w: 900, h: 305 },
          { src: "/img/card-deviated.webp", w: 900, h: 269 },
          { src: "/img/card-boarded.webp", w: 900, h: 226 },
        ];

  return (
    <section id="features" aria-labelledby="features-title" className="py-20 md:py-28">
      <div className={container}>
        <div className="flex max-w-[62ch] flex-col gap-4">
          <h2 id="features-title" className={sectionTitle}>
            {f.title}
          </h2>
          <p className={sectionBody}>{f.body}</p>
        </div>

        <div className="mt-10 grid gap-4 md:mt-14 md:grid-cols-2 lg:grid-cols-12">
          {/* Live navigation: the tall cell, on the brand stage. */}
          <Reveal className="md:col-span-2 lg:col-span-5 lg:row-span-2">
            <article className="relative flex h-full min-h-[600px] flex-col overflow-hidden rounded-[24px] bg-stage p-7 shadow-[inset_0_0_0_1px_var(--stage-ring)] md:min-h-[680px] md:p-9">
              <h3 className={`${cellTitle} text-[#eef5ee]`}>{f.nav.title}</h3>
              <p className={`${cellBody} mt-3 text-[#a9bbac]`}>{f.nav.body}</p>
              <div className="relative mt-8 flex-1">
                <Phone
                  src="/img/ios-live-navigation.webp"
                  alt={f.nav.alt}
                  width={720}
                  height={1558}
                  className="absolute left-1/2 top-0 w-[min(290px,74%)] -translate-x-1/2"
                />
              </div>
            </article>
          </Reveal>

          {/* Tracking on the lock screen: the trip's states, in order. */}
          <Reveal className="md:col-span-2 lg:col-span-7" delay={0.05}>
            <article className="grid h-full items-center gap-8 rounded-[24px] bg-surface p-7 shadow-[inset_0_0_0_1px_var(--line)] md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:p-9">
              <div className="flex flex-col gap-3">
                <span className="w-fit rounded-[8px] bg-route/14 px-2 py-1 text-[12px] font-semibold text-accent-text">
                  {f.track.badge}
                </span>
                <h3 className={`${cellTitle} text-ink`}>{f.track.title}</h3>
                <p className={`${cellBody} text-ink-2`}>{f.track.body}</p>
              </div>
              <figure className="flex flex-col gap-2.5">
                {cards.map((c, i) => (
                  <Reveal key={c.src} delay={0.15 + i * 0.14} y={14}>
                    <img
                      src={c.src}
                      alt={i === 0 ? f.track.alt : ""}
                      width={c.w}
                      height={c.h}
                      loading="lazy"
                      decoding="async"
                      className="block h-auto w-full rounded-[18px] shadow-[0_0_0_1px_var(--line),0_18px_40px_-24px_rgb(var(--shadow-tint)/0.5)]"
                      style={{ marginInlineStart: `${i * 14}px`, width: `calc(100% - ${i * 14}px)` }}
                    />
                  </Reveal>
                ))}
              </figure>
            </article>
          </Reveal>

          {/* The assistant: the conversation, cropped to the plan it returns. */}
          <Reveal className="lg:col-span-4" delay={0.08}>
            <article className="flex h-full min-h-[480px] flex-col overflow-hidden rounded-[24px] bg-surface shadow-[inset_0_0_0_1px_var(--line)] lg:h-[520px]">
              <div className="p-7 md:p-9 md:pb-0">
                <h3 className={`${cellTitle} text-ink`}>{f.assistant.title}</h3>
                <p className={`${cellBody} mt-3 text-ink-2`}>{f.assistant.body}</p>
              </div>
              <div className="relative mt-auto px-7 pt-8 md:px-9">
                <img
                  src="/img/ios-assistant-crop.webp"
                  alt={f.assistant.alt}
                  width={800}
                  height={1067}
                  loading="lazy"
                  decoding="async"
                  className="-mb-24 block h-auto w-full rounded-t-[20px] shadow-[0_0_0_1px_var(--line-2)]"
                />
              </div>
            </article>
          </Reveal>

          {/* Departures: the live arrivals list from a station page. */}
          <Reveal className="lg:col-span-3" delay={0.12}>
            <article className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-[24px] bg-surface shadow-[inset_0_0_0_1px_var(--line)] lg:h-[520px]">
              <div className="p-7 md:p-8">
                <h3 className={`${cellTitle} text-ink`}>{f.arrivals.title}</h3>
                <p className={`${cellBody} mt-3 text-ink-2`}>{f.arrivals.body}</p>
              </div>
              <div className="mt-auto px-5 pb-5 md:px-6 md:pb-6">
                <img
                  src="/img/ios-live-arrivals-crop.webp"
                  alt={f.arrivals.alt}
                  width={800}
                  height={626}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full rounded-[18px] shadow-[0_0_0_1px_var(--line-2)]"
                />
              </div>
            </article>
          </Reveal>

          {/* Sharing a pin in: a full-width band. */}
          <Reveal className="md:col-span-2 lg:col-span-12" delay={0.05}>
            <article className="flex flex-col gap-6 rounded-[24px] bg-route/12 p-7 md:flex-row md:items-center md:gap-10 md:p-9 dark:bg-route/10">
              <div aria-hidden className="flex shrink-0 items-center gap-3 text-accent-text">
                <span className="grid size-14 place-items-center rounded-[16px] bg-surface shadow-[inset_0_0_0_1px_var(--line)]">
                  <WhatsappLogo size={28} />
                </span>
                <span className="grid size-14 place-items-center rounded-[16px] bg-surface shadow-[inset_0_0_0_1px_var(--line)]">
                  <ChatCircleText size={28} />
                </span>
                <ArrowRight size={22} weight="bold" className="flip-rtl mx-1 text-ink-3" />
                <span className="grid size-14 place-items-center rounded-[16px] bg-route text-forest">
                  <MapPin size={28} weight="fill" />
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className={`${cellTitle} text-ink`}>{f.share.title}</h3>
                <p className={`${cellBody} text-ink-2`}>{f.share.body}</p>
              </div>
            </article>
          </Reveal>

          {/* Its reverse: a route out of Murtahil into a chat, as text. Still being built, and says so. */}
          <Reveal className="md:col-span-2 lg:col-span-12" delay={0.05}>
            <article className="flex flex-col gap-6 rounded-[24px] bg-signal/10 p-7 md:flex-row md:items-center md:justify-between md:gap-10 md:p-9">
              <div aria-hidden className="flex shrink-0 items-center gap-3 text-link md:order-last">
                <span className="grid size-14 place-items-center rounded-[16px] bg-route text-forest">
                  <Path size={28} weight="bold" />
                </span>
                <ArrowRight size={22} weight="bold" className="flip-rtl mx-1 text-ink-3" />
                <span className="grid size-14 place-items-center rounded-[16px] bg-surface shadow-[inset_0_0_0_1px_var(--line)]">
                  <WhatsappLogo size={28} />
                </span>
                <span className="grid size-14 place-items-center rounded-[16px] bg-surface shadow-[inset_0_0_0_1px_var(--line)]">
                  <ChatCircleText size={28} />
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className={`${cellTitle} text-ink`}>{f.shareRoute.title}</h3>
                </div>
                <p className={`${cellBody} text-ink-2`}>{f.shareRoute.body}</p>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
