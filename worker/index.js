// The Cloudflare Worker in front of the static site (out/, served as Workers static assets). It runs
// first only for the paths in wrangler.toml (assets.run_worker_first); every other path is served
// straight from the static build, with public/_headers applied and out/404.html for anything that
// doesn't exist.
//
// "/" and "/delete": visitors go to their language before any HTML loads, by the browser's
// Accept-Language (the highest-ranked of Arabic, English and Turkish, English when it names none of
// them), "/delete" to /<language>/delete/ with its query kept. Without the Worker (another host),
// out/index.html and out/delete/index.html make the same choice in the browser.
//
// "/api/appwrite/...": the deletion page's calls to the apps' Appwrite project. Appwrite accepts calls
// only from the Web platforms registered on the project, and this site's domain isn't one yet (the
// free plan's limit), so the Worker makes each call as murtahil.inirl.net, which is. It sends the
// project itself, passes the session (X-Fallback-Cookies) both ways, drops cookies, and forwards only
// the routes the page uses. When murtahil.net is registered, APPWRITE_ORIGIN can name it instead.
//
// "/api/billing-status": asks whether a Premium subscription still renews. It passes the account's
// JWT to the Murtahil function's /billing/status (which asks Apple and Google) and adds the apps'
// client key, a Worker secret (`wrangler secret put APP_CLIENT_KEY`), so the key is never in the page.
// Same origin, so the function needs no CORS.

const LOCALES = ["ar", "en", "tr"];
const REDIRECTS = { "/": "/", "/delete": "/delete/", "/delete/": "/delete/" };
const FUNCTION_URL = "https://fb.murtahil.inirl.net/";

// The apps' Appwrite project, as content/site.ts names it (site.accounts).
const APPWRITE = "https://fra.cloud.appwrite.io/v1";
const APPWRITE_PROJECT = "68f141dd000f83849c21";
const APPWRITE_ORIGIN = "https://murtahil.inirl.net";
const APPWRITE_ROUTES = [
  /^\/account(\/identities|\/jwts|\/status|\/sessions(\/email|\/token|\/current)?)?$/,
  /^\/teams(\/[\w-]+\/memberships)?$/,
  /^\/tablesdb\/[\w-]+\/tables\/deletion_requests\/rows$/,
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/appwrite/")) return appwrite(request, url, env);
    if (url.pathname === "/api/billing-status") return billingStatus(request, env);
    const target = REDIRECTS[url.pathname];
    if (!target) return env.ASSETS.fetch(request);
    url.pathname = `/${pick(request.headers.get("Accept-Language") || "")}${target}`;
    return new Response(null, {
      status: 302,
      headers: { Location: url.toString(), Vary: "Accept-Language", "Cache-Control": "private, no-store" },
    });
  },
};

const json = (body, status) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

async function appwrite(request, url, env) {
  const path = url.pathname.slice("/api/appwrite".length);
  if (!APPWRITE_ROUTES.some((route) => route.test(path))) return json({ error: "not_found" }, 404);
  const headers = {
    "Content-Type": "application/json",
    "X-Appwrite-Project": APPWRITE_PROJECT,
    Origin: env.APPWRITE_ORIGIN || APPWRITE_ORIGIN,
  };
  const session = request.headers.get("X-Fallback-Cookies");
  if (session) headers["X-Fallback-Cookies"] = session;
  const ip = request.headers.get("CF-Connecting-IP");
  if (ip) headers["X-Forwarded-For"] = ip;
  let answer;
  try {
    answer = await fetch(APPWRITE + path + url.search, {
      method: request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.text(),
    });
  } catch {
    return json({ message: "Appwrite could not be reached", type: "appwrite_unreachable", code: 502 }, 502);
  }
  const out = { "Content-Type": answer.headers.get("Content-Type") || "application/json", "Cache-Control": "no-store" };
  const opened = answer.headers.get("X-Fallback-Cookies");
  if (opened) out["X-Fallback-Cookies"] = opened;
  return new Response(answer.body, { status: answer.status, headers: out });
}

async function billingStatus(request, env) {
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  let jwt = "";
  try {
    jwt = String((await request.json()).jwt || "");
  } catch {}
  if (!jwt) return json({ error: "sign_in_required" }, 401);
  const headers = { "Content-Type": "application/json" };
  if (env.APP_CLIENT_KEY) headers["X-Client-Key"] = env.APP_CLIENT_KEY;
  try {
    const answer = await fetch(`${env.FUNCTION_URL || FUNCTION_URL}billing/status`, {
      method: "POST",
      headers,
      body: JSON.stringify({ jwt }),
    });
    return new Response(answer.body, {
      status: answer.status,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch {
    return json({ error: "function_unreachable" }, 502);
  }
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
