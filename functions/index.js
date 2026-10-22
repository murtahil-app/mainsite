// Cloudflare Pages Function for "/" only: sends visitors to their language before any HTML loads,
// by the browser's Accept-Language (the highest-ranked of Arabic, English and Turkish, English when
// it names none of them).
// Every other path is served straight from the static build. Without Functions (another host),
// out/index.html does the same in the browser.

const LOCALES = ["ar", "en", "tr"];

export function onRequestGet({ request }) {
  const url = new URL(request.url);
  url.pathname = `/${pick(request.headers.get("Accept-Language") || "")}/`;
  return new Response(null, {
    status: 302,
    headers: { Location: url.toString(), Vary: "Accept-Language", "Cache-Control": "private, no-store" },
  });
}

function pick(header) {
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().toLowerCase().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      return { lang: tag.split("-")[0], q: q ? Number(q.slice(2)) || 0 : 1 };
    })
    .filter((x) => x.q > 0)
    .sort((a, b) => b.q - a.q);
  return ranked.find((x) => LOCALES.includes(x.lang))?.lang ?? "en";
}
