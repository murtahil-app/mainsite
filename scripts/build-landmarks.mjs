// Bakes the Murtahil city landmarks into standalone SVG files:  node scripts/build-landmarks.mjs
//
// Source: vendor/landmarks.js and vendor/landmarks.css, copied from the Murtahil web app
// (Murtahil-Web/landmarks.js and the landmark block of its style.css). There, one drawing serves a
// silhouette and a coloured scene, by day or by night, through CSS classes and custom properties.
// A website loads them as <img>, which cannot inherit page CSS, so every variant gets its own file
// with the tokens and rules written inside it:
//
//   public/landmarks/<city>-day.svg     the scene in colour, by day   (light theme)
//   public/landmarks/<city>-night.svg   the same scene by night        (dark theme)
//   public/landmarks/<key>-silhouette.svg  a flat silhouette, for the closing skyline
//
// Re-run after updating the vendored files.

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const out = path.join(root, "public", "landmarks");
fs.mkdirSync(out, { recursive: true });

// ------------------------------------------------------------------ the drawings
const window = {};
vm.runInNewContext(fs.readFileSync(path.join(root, "vendor", "landmarks.js"), "utf8"), { window });
const { landmarks, countries } = window.MurtahilArt;

// ------------------------------------------------------------------ the styles
const css = fs.readFileSync(path.join(root, "vendor", "landmarks.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

function block(selector) {
  const i = css.indexOf(selector + " {");
  if (i < 0) throw new Error("missing block " + selector);
  const open = css.indexOf("{", i);
  const close = css.indexOf("}", open);
  return css.slice(open + 1, close);
}
function tokens(body) {
  const map = {};
  for (const m of body.matchAll(/(--lm-[\w-]+)\s*:\s*([^;]+);/g)) map[m[1]] = m[2].trim();
  return map;
}

const day = tokens(block(":root"));
const night = { ...day, ...tokens(block(':root[data-theme="dark"]')) };
// The web app points the silhouette at its own palette; give it the identity's values.
day["--lm-silhouette"] = "#287A10";
night["--lm-silhouette"] = "#59C52B";

// Every rule that styles the drawing, without the hover transitions the web app animates.
const rules = css
  .split("\n")
  .filter((l) => l.startsWith(".lm"))
  .filter((l) => !l.startsWith(".lm *"))
  .join("\n");

function sheet(vars) {
  const decl = Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(";");
  return `<style>svg{${decl}}\n${rules}</style>`;
}

function file(svg, classes, vars) {
  const s = svg
    .replace('<svg class="lm"', `<svg xmlns="http://www.w3.org/2000/svg" class="${classes}"`)
    .replace(/(<svg[^>]*>)/, `$1${sheet(vars)}`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n${s}\n`;
}

let n = 0;
for (const [id, svg] of Object.entries(landmarks)) {
  fs.writeFileSync(path.join(out, `${id}-day.svg`), file(svg, "lm is-shown", day));
  fs.writeFileSync(path.join(out, `${id}-night.svg`), file(svg, "lm is-shown", night));
  n += 2;
}

// Silhouettes for the closing skyline: one per country, in the order the cities are listed.
// Countries of one city (Bahrain, Qatar, Egypt) use that city's drawing, as the web app's switcher does.
const skyline = {
  SA: countries.SA, TR: countries.TR, SY: countries.SY,
  BH: landmarks.bahrain, QA: landmarks.doha, EG: landmarks.cairo,
};
for (const [key, svg] of Object.entries(skyline)) {
  const vars = { ...night, "--lm-silhouette": "#1B5A12" };
  fs.writeFileSync(path.join(out, `${key.toLowerCase()}-silhouette.svg`), file(svg, "lm", vars));
  n += 1;
}

console.log(`wrote ${n} files to ${path.relative(root, out)}`);
