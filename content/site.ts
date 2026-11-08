// Deployment settings for the site. Everything here is a fact about the outside world that may
// change without the design changing: check these before going live.

export const site = {
  // The production address of this site (canonical URLs, hreflang, sitemap, social cards).
  // The web app lives on map.murtahil.net, so the site is expected at the bare domain.
  url: "https://murtahil.net",

  // The Murtahil web app (Murtahil-Web), with the MapTiler basemap. Its city switcher reads
  // ?city=<id>.
  webApp: "https://map.murtahil.net",

  // Until launch the web app isn't public: every "Open the web app" button shows a grayed-out
  // "Coming soon on <launchDate>" instead, and nothing links into the web app. Set to true on
  // launch day and the buttons and per-city links come back.
  webAppPublic: false,
  launchDate: "30/11/2026",

  // The WhatsApp number of the launch waitlist, digits only with the country code (e.g. "9665XXXXXXXX").
  // "Join the waitlist" opens a chat with it, the join message typed in; the waitlist backend (wawls)
  // answers there. Leave null and the buttons are hidden.
  waitlistWhatsApp: null as string | null,

  // A contact address. None exists yet; leave null and the footer omits it.
  contactEmail: null as string | null,
};

/** The web app opened on one city: its switcher reads ?city=<id>. */
export function webAppCity(cityId: string) {
  return `${site.webApp}/?city=${encodeURIComponent(cityId)}`;
}

/** A WhatsApp chat with the waitlist number, the join message already typed, or null without a number. */
export function waitlistLink(message: string) {
  if (!site.waitlistWhatsApp) return null;
  return `https://wa.me/${site.waitlistWhatsApp}?text=${encodeURIComponent(message)}`;
}
