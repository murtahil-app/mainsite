// Shared class lists. Shapes follow one documented scale (Components board):
//   buttons 12px, chips and line badges 8px, cards and panels 24px, the brand stage 32px.

export const container = "mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8";

const buttonBase =
  "inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[12px] px-5 text-[15px] font-semibold transition-[background-color,box-shadow,transform] duration-200 ease-brand active:scale-[0.98]";

const disabledBase =
  "inline-flex h-12 shrink-0 cursor-default select-none items-center justify-center gap-2 whitespace-nowrap rounded-[12px] px-5 text-[15px] font-semibold";

export const button = {
  // One green means go: Forest text on Route Green (6.7:1).
  primary: `${buttonBase} bg-route text-forest hover:bg-[#66d236]`,
  secondary: `${buttonBase} bg-transparent text-ink shadow-[inset_0_0_0_1px_var(--line-2)] hover:bg-surface-2`,
  // On the brand stage, whatever the page theme.
  secondaryOnStage: `${buttonBase} bg-transparent text-[#eef5ee] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.22)] hover:bg-white/8`,
  // Grayed out and inert: what isn't available yet (the web app before launch).
  disabled: `${disabledBase} bg-surface-2 text-ink-3 shadow-[inset_0_0_0_1px_var(--line)]`,
  disabledOnStage: `${disabledBase} bg-white/8 text-[#a9bbac] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.14)]`,
};

export const sectionTitle =
  "text-balance text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-ink";

export const sectionBody = "max-w-[62ch] text-lg leading-relaxed text-ink-2";

/** Small uppercase label above a heading. Rationed: at most one in three sections. */
export const eyebrow = "text-[13px] font-semibold uppercase tracking-[0.08em] text-accent-text";

export function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => values[k] ?? "");
}
