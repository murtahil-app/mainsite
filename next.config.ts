import type { NextConfig } from "next";

// A static site: `next build` writes plain HTML, CSS and JS to out/. Hosted on Cloudflare Pages
// (build command `npm run build`, output directory `out`); public/_headers and functions/ are
// Cloudflare's, and any other static host can serve out/ as it is.
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  // The site has two root layouts, so unknown paths get app/global-not-found.tsx (out/404.html).
  experimental: { globalNotFound: true },
};

export default config;
