import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { waitlistLink } from "@/content/site";

/**
 * "Join the waitlist": opens WhatsApp on the waitlist number with the join message typed in, so joining
 * is one tap on send. Renders nothing until site.waitlistWhatsApp is set.
 */
export function WaitlistButton({ label, message, className }: { label: string; message: string; className: string }) {
  const href = waitlistLink(message);
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      <WhatsappLogo size={18} weight="bold" aria-hidden />
      {label}
    </a>
  );
}
