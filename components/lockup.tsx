import type { Locale } from "@/content/i18n";

/**
 * The primary lockup: the tower, then the Latin and Arabic wordmarks stacked beside it.
 * On Arabic pages the Arabic wordmark leads (the identity's RTL lockup).
 */
export function Lockup({ locale, size = "md" }: { locale: Locale; size?: "md" | "lg" }) {
  const big = size === "lg";
  const latin = (
    <span key="l" lang="en" className={`font-semibold leading-none tracking-[-0.03em] ${big ? "text-[26px]" : "text-[18px]"}`}>
      Murtahil
    </span>
  );
  const arabic = (
    <span key="a" lang="ar" className={`font-arabic font-medium leading-[1.15] ${big ? "text-[18px]" : "text-[13px]"}`}>
      مرتحل
    </span>
  );
  return (
    <span className="flex items-center gap-2.5">
      <img
        src="/brand/mark.svg"
        alt=""
        width={409}
        height={512}
        className={big ? "h-11 w-auto" : "h-8 w-auto"}
      />
      <span className={`flex flex-col ${big ? "gap-1.5" : "gap-1"} text-ink`}>
        {locale === "ar" ? [arabic, latin] : [latin, arabic]}
      </span>
    </span>
  );
}
