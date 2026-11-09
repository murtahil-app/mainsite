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
| Non-production branch deploy command | `npx wrangler preview` (needs the `[previews]` block in `wrangler.toml`) |
| Root directory | `/` |

The Worker's name in the dashboard must match `name` in `wrangler.toml` (`murtahil`). Node comes
from `.node-version` (22). From a terminal, `npm run deploy` builds and deploys with your own login.

Don't use `wrangler pages deploy` in a Workers build: the token Workers Builds creates can deploy
Workers but not Pages projects, and the API answers "Authentication error [code: 10000]".

What Cloudflare runs:

- `wrangler.toml` serves `out/` as static assets: `/en/` is `en/index.html`, `/en` redirects to
  `/en/`, and unknown paths get `out/404.html` (from `app/global-not-found.tsx`) with a 404 status.
- `worker/index.js` runs for `/` and redirects to `/ar/`, `/en/` or `/tr/` by the browser's
  Accept-Language, and `/delete` the same way to `/<language>/delete/`. (On another host,
  `out/index.html` and `out/delete/index.html` do this in the browser.) It also answers
  `/api/appwrite/` and `/api/billing-status` for the deletion page (see "Account deletion").
- `public/_headers`: security headers, and caching (`/_next/static/` forever; images a day).

Add the custom domain under the Worker's Settings > Domains & Routes; `content/site.ts` expects
`https://murtahil.net`.

## Before launch, and on launch day

`content/site.ts` holds the switch. While `webAppPublic` is `false`, every "Open the web app"
button is a grayed-out "Coming soon on 30/11/2026" (`launchDate`), the per-city "Plan a trip"
links are hidden, and the Apps section and FAQ use their pre-launch copy (`titleSoon`,
`bodySoon`, `aSoon` in `content/dictionary.ts`). On launch day set it to `true` and rebuild.

## Account deletion (`/delete`)

`murtahil.net/delete` is the account and data deletion page the store listings link to (Google Play
requires one). The Worker sends it to `/<language>/delete/`. Visitors sign in with the apps' own
accounts (the Murtahil Appwrite project, `site.accounts` in `content/site.ts`) by Google, Apple, or
email and password, see their account, plan and what is stored with it, and ask for either their
data or their whole account to be deleted. Each request becomes a row in a table, which is the queue.
Then the visitor is signed out, and the page says it may take up to 30 days.

- **Delete my data** writes the row, then signs the account out on every device, so no phone
  uploads its lists again while the request waits.
- **Delete my account** writes the row, then blocks the account (`PATCH /account/status`). A blocked
  account cannot sign in, and every session it had is ended.
- **Premium:** the page asks the stores, through the Murtahil function's `/billing/status`, whether
  the subscription still renews. While it does, account deletion is turned off and the page links to
  that store's subscription settings. Once it is cancelled, deletion is allowed. If the check can't
  be answered, the visitor has to tick "I've cancelled my subscription" instead. A plan granted by
  hand in the console needs nothing.

Both deletions ask the visitor to tick "can't be undone" and type a word. Nothing is blocked or
signed out unless the row was written. `lib/account.ts` holds the Appwrite calls, and
`components/delete-account.tsx` holds the page.

Appwrite answers only the Web platforms registered on the project, and the free plan has room for
`murtahil.inirl.net` only. So the page never calls Appwrite itself: it calls `/api/appwrite/...` on
this site, and the Worker makes each call as `murtahil.inirl.net` (only the routes the page uses).
A Google or Apple sign-in comes back to `https://murtahil.inirl.net/delete/`, a small page in
Riyadh-Transport-Android's `web/` folder, which sends it on to `murtahil.net/<language>/delete/`.
Test locally with `npm run build && npm run preview` (the Worker), not `npm run dev`, which has no
`/api/`.

What it needs, once:

1. **murtahil.inirl.net:** deploy Riyadh-Transport-Android's `web/` folder again, so `/delete/` is
   live next to `/verify`.
2. **Appwrite > Databases**, database `68f146de0013ba3e183a`: create the table `deletion_requests`
   with the columns `user_id` (string, 36, required), `scope` (enum `account`, `data`, required)
   and `email` (string, 320). Under Permissions, give **Create** to **Users** and nothing else, and
   turn on row security. Each row is then readable by its own account only, and nobody but the
   project can change or remove it.
3. **Sign in with Apple on the web** (below). Google already works.
4. **The Worker's client key** (below).

Moving to murtahil.net later: register it as a Web platform, set `signInReturn` in
`content/site.ts` to `null`, and set the Worker variable `APPWRITE_ORIGIN` to
`https://murtahil.net`. The return page on murtahil.inirl.net can then go.

### Sign in with Apple on the web

The iOS app uses Apple's own sheet and sends Apple's token straight to Appwrite, which needs no
web setup. A website can only use Apple's browser sign-in, which Appwrite runs as the Apple OAuth
provider; it is off on the project today. It needs a Services ID and a key from the same Apple team
as the app (`com.murtahil.app`), so that Apple gives the same user id on the web as in the app and
the same Murtahil account signs in.

1. **Appwrite Console > Auth > Settings > OAuth2 Providers > Apple.** Open it and copy the
   redirect URI it shows. It should be
   `https://fra.cloud.appwrite.io/v1/account/sessions/oauth2/callback/apple/68f141dd000f83849c21`.
   Leave the dialog open, and leave any native settings (the `com.murtahil.app` client ID) as they
   are: the iOS app depends on them.
2. **developer.apple.com > Certificates, Identifiers & Profiles > Identifiers.** Open the App ID
   `com.murtahil.app` and check that **Sign in with Apple** is ticked (it is, if the app's sign-in
   works).
3. **Identifiers > + > Services IDs > Continue.** Description `Murtahil Web`, identifier
   `com.murtahil.app.web` (any reverse-domain name that differs from the App ID). Register.
4. Open the new Services ID, tick **Sign in with Apple**, and choose **Configure**:
   - Primary App ID: `com.murtahil.app`
   - Domains and Subdomains: `fra.cloud.appwrite.io`
   - Return URLs: the redirect URI from step 1

   Next, Done, Continue, Save. Apple sends the sign-in to Appwrite, not to this site, which is why
   only Appwrite's domain goes here.
5. **Keys > +.** Name it `Murtahil Sign in with Apple`, tick **Sign in with Apple**, Configure,
   choose `com.murtahil.app` as the primary App ID, Save, Continue, Register. **Download** the
   `.p8` file (Apple offers it once only; keep it somewhere safe) and note the **Key ID**.
6. Note your **Team ID** (Membership details, or the top right corner of the developer site).
7. Back in Appwrite's Apple dialog, turn the provider on and fill in:
   - Services ID: `com.murtahil.app.web`
   - Key ID: from step 5
   - Team ID: from step 6
   - P8 file: the contents of the `.p8` file, from `-----BEGIN PRIVATE KEY-----` to the end

   Update.
8. Check it: on murtahil.net/delete, choose **Continue with Apple** and sign in with an Apple ID
   that already uses the iOS app. The page should show that account, with its saved places. A new,
   empty account means the Services ID is on a different team from the app.

### The Worker's client key

The page asks the Murtahil function (`/billing/status`) whether a Premium subscription still
renews. When the function has `APP_CLIENT_KEY` set, it refuses callers without it, so the Worker
needs the same value as a secret. A secret is stored encrypted on Cloudflare and never appears in
the page or in this repository.

1. Find the value: Appwrite Console > Functions > Murtahil-feedbacker > Settings > Environment
   variables > `APP_CLIENT_KEY`. If there is no such variable, the function takes calls without a
   key, and there is nothing to do.
2. Add it to the Worker, either way:
   - From this folder: `npx wrangler login` (once), then `npx wrangler secret put APP_CLIENT_KEY`
     and paste the value when asked. It applies to the deployed Worker straight away.
   - Or in the Cloudflare dashboard: Workers & Pages > `murtahil` > Settings > Variables and
     Secrets > Add, type **Secret**, name `APP_CLIENT_KEY`, the value, then Deploy.
3. For `npm run preview` on this machine, put `APP_CLIENT_KEY=<the value>` in a `.dev.vars` file in
   this folder (git ignores it).
4. Check it: sign in on murtahil.net/delete with an account on Premium. The Subscription line shows
   "Renews on ..." or "Cancelled ...". If the key is missing or wrong, the line is missing and the
   page asks the visitor to tick "I've cancelled" instead.

Secrets survive later deploys, from a terminal or from Git.

Carrying out a request (within 30 days): for `data`, clear the user's preferences (Auth > Users >
the user > Preferences) and their feedback and invitation details. For `account`, delete the user,
which also removes their sessions and plan membership. Then delete the row.

A password can't be reset on the site or in the apps yet. Set `contactEmail` in `content/site.ts`
and the sign-in form offers it for a forgotten password.

## Where things are

| path | what |
|---|---|
| `content/dictionary.ts` | every visible string, English and Arabic |
| `content/cities.ts` | the eleven cities: modes, kinds of times, counts, landmark captions |
| `content/site.ts` | the site's address, the web app's address and launch switch, the waitlist's WhatsApp number, a contact email |
| `app/[locale]/` | the layout (fonts, theme script, metadata), the homepage and `delete/` |
| `lib/account.ts`, `components/delete-account.tsx` | the account deletion page's Appwrite calls and UI |
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
