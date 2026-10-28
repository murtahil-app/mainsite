# Murtahil website

The organisation site for Murtahil (مرتحل): what the apps do, the cities they cover, and the
problems they solve. It is bilingual (English at `/en/`, Arabic at `/ar/`, mirrored right to left)
and follows the light/dark system setting, with a toggle.

Built with Next.js (static export), Tailwind CSS v4 and Motion, on the Murtahil identity: IBM Plex
Sans, Plex Sans Arabic and Plex Mono; Forest, Route Green and Harbor.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # writes the static site to out/
npm run preview  # out/ through the Worker on Cloudflare's local runtime (after a build)
```

## Hosting: a Cloudflare Worker

The site is a Cloudflare Worker with static assets (Cloudflare's recommended setup for new sites,
and what the dashboard's "Workers & Pages > Create" makes from a Git repository). In the Worker's
Settings > Build:

| setting | value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |

The Worker's name in the dashboard must match `name` in `wrangler.toml` (`murtahil`). Node comes
from `.node-version` (22). From a terminal, `npm run deploy` builds and deploys with your own login.

Don't use `wrangler pages deploy` in a Workers build: the token Workers Builds creates can deploy
Workers but not Pages projects, and the API answers "Authentication error [code: 10000]".

What Cloudflare runs:

- `wrangler.toml` serves `out/` as static assets: `/en/` is `en/index.html`, `/en` redirects to
  `/en/`, and unknown paths get `out/404.html` (from `app/global-not-found.tsx`) with a 404 status.
- `worker/index.js` runs for `/` only and redirects to `/ar/`, `/en/` or `/tr/` by the browser's
  Accept-Language. (On another host, `out/index.html` does the same in the browser.)
- `public/_headers`: security headers, and caching (`/_next/static/` forever; images a day).

Add the custom domain under the Worker's Settings > Domains & Routes; `content/site.ts` expects
`https://murtahil.net`.

## Before launch, and on launch day

`content/site.ts` holds the switch. While `webAppPublic` is `false`, every "Open the web app"
button is a grayed-out "Coming soon on 30/11/2026" (`launchDate`), the per-city "Plan a trip"
links are hidden, and the Apps section and FAQ use their pre-launch copy (`titleSoon`,
`bodySoon`, `aSoon` in `content/dictionary.ts`). On launch day set it to `true` and rebuild.

## Where things are

| path | what |
|---|---|
| `content/dictionary.ts` | every visible string, English and Arabic |
| `content/cities.ts` | the ten cities: modes, kinds of times, counts, landmark captions |
| `content/site.ts` | the site's address, the web app's address and launch switch, a contact email |
| `app/[locale]/` | the layout (fonts, theme script, metadata) and the homepage |
| `components/sections/` | one file per homepage section |
| `components/city-explorer.tsx` | the interactive city section |
| `app/globals.css` | identity tokens for both themes, Tailwind theme |
| `public/landmarks/` | city scenes by day and night, country silhouettes (generated) |
| `public/img/` | screenshots (see below) |
| `vendor/` | the web app's landmark drawings and their CSS, the source of `public/landmarks/` |

## Copy rules

From the identity and the campaign brief: short, present tense, no exclamation marks; say what to
do next and when. No claims the apps can't back ("the only", "the best", accuracy, savings), no
prices or store links until the store release, and never a word against other apps, operators or
the transport itself. No em or en dashes. Every count in `content/cities.ts` comes from the city's
backend: its README, its data files or the live API the apps use (the comment at the top of that file
says how); leave `facts` empty rather than estimate.

Times are always one of four kinds: live, predicted, scheduled, estimated. Say "live" only where a
city really has live data.

## Assets

- **Landmarks:** `node scripts/build-landmarks.mjs` bakes `vendor/landmarks.js` and
  `vendor/landmarks.css` (copied from Murtahil-Web) into standalone SVGs, one per city and theme.
  Re-copy the vendor files and re-run after the web app's drawings change.
- **Web app screenshots** (`web-*`): the web app on map.murtahil.net (the MapTiler basemap),
  captured with Playwright at 1440 x 900 (2x), planning real trips (Doha: Hamad International Airport
  T1 to Katara, departing at 21:00; Istanbul: Kadıköy to Taksim).
- **iOS screenshots** (`ios-*`): phones always show the native app. `ios-route-riyadh` is an
  iPhone 12 capture; the others come from `Riyadh-Transport-iOS/pics/`, the assistant and arrivals
  ones cropped. `components/phone.tsx` frames them as an iPhone with a Dynamic Island.
- **Tracking cards** (`card-*`): `Riyadh-Transport-Android/app/build/screens/tracking-card/`, as
  the app's screenshot tests render them.
- **Social cards:** `python3 scripts/og/render.py` renders `scripts/og/card.html` to
  `public/og-en.png` and `public/og-ar.png`.
- **Mark and icons:** `public/brand/`, from the apps' `brand/` vector masters and the iOS app icon.

Screenshots show maps by MapTiler and Apple Maps with OpenStreetMap data; the footer credits them.

## Still open

- `content/site.ts`: add a contact email if there is one.
- The Arabic page shows the iOS app in English (there are no Arabic iOS captures yet); Arabic
  captures of the route, live navigation, assistant and arrivals screens would replace them cleanly.
- "A route is a shareable plan" describes a feature still in development; its tile carries a
  "Coming soon" tag (`features.shareRoute.badge`) until it ships.
