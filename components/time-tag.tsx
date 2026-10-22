import type { TimeKind } from "@/content/cities";
import { timeIcon } from "./icons";

// The four kinds of time, each with its own colour: Route Green for live (the live route),
// Signal for predicted, Harbor for the timetable, and a neutral for estimates.
const tone: Record<TimeKind, string> = {
  live: "bg-route/14 text-accent-text",
  predicted: "bg-signal/12 text-link",
  scheduled: "bg-harbor/10 text-harbor dark:bg-white/8 dark:text-[#a9c3ea]",
  estimated: "bg-surface-2 text-ink-2",
};

export function TimeTag({ kind, label, size = "md" }: { kind: TimeKind; label: string; size?: "sm" | "md" }) {
  const Icon = timeIcon[kind];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[8px] font-semibold ${tone[kind]} ${
        size === "sm" ? "h-7 px-2 text-[12px]" : "h-8 px-2.5 text-[13px]"
      }`}
    >
      <Icon size={size === "sm" ? 14 : 16} weight="bold" aria-hidden />
      {label}
    </span>
  );
}
