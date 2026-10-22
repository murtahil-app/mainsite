import type { NextConfig } from "next";

// A static site: `next build` writes plain HTML, CSS and JS to out/. Served by a Cloudflare Worker as
// static assets (wrangler.toml, worker/index.js, public/_headers); any other static host can serve
// out/ as it is.
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  // The site has two root layouts, so unknown paths get app/global-not-found.tsx (out/404.html).
  experimental: { globalNotFound: true },
};

export default config;
