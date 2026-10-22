import { ArrowUpRight, CalendarBlank } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/content/site";
import { button, fill } from "./ui";

/**
 * The one call to action for the web app. Before launch (site.webAppPublic false) it is a
 * grayed-out, non-interactive "Coming soon on <date>"; after, a Route Green link.
 */
export function WebAppButton({
  label,
  soon,
  onStage = false,
  compact = false,
  className = "",
}: {
  /** "Open the web app" */
  label: string;
  /** "Coming soon on {date}" */
  soon: string;
  /** On the Forest brand stage, whatever the page theme. */
  onStage?: boolean;
  /** The header's smaller size. */
  compact?: boolean;
  className?: string;
}) {
  const size = compact ? "!h-10 !px-4" : "";
  if (site.webAppPublic) {
    return (
      <a href={site.webApp} className={`${button.primary} ${size} ${className}`}>
        {label}
        {!compact && <ArrowUpRight size={18} weight="bold" className="flip-rtl" aria-hidden />}
      </a>
    );
  }
  const [before, after] = soon.split("{date}");
  return (
    <span aria-disabled="true" className={`${onStage ? button.disabledOnStage : button.disabled} ${size} ${className}`}>
      {!compact && <CalendarBlank size={18} aria-hidden />}
      <span>
        {before}
        <bdi dir="ltr" className="tnum">
          {site.launchDate}
        </bdi>
        {after}
      </span>
    </span>
  );
}

/** The same sentence as plain text, for places that are not buttons. */
export function soonText(soon: string) {
  return fill(soon, { date: site.launchDate });
}
