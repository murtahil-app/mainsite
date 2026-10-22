import type { MetadataRoute } from "next";
import { locales } from "@/content/i18n";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}/`]));
  return locales.map((l) => ({
    url: `${site.url}/${l}/`,
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages },
  }));
}
