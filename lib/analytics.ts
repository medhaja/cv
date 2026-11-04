/**
 * Analytics (production only).
 *
 * - GoatCounter: cookieless, always on. Loaded with `no_onload`, and every page
 *   view is counted explicitly via `countPage()`: once for the first load and once
 *   per client-side route change, so the first load is never double counted.
 * - Google Tag Manager (GTM-TDCVKN4Z, which carries GA4): loaded only after the
 *   visitor accepts. Consent Mode v2 defaults are set before the tag loads; Accept
 *   grants analytics_storage only (ad_* stay denied). Events are pushed only while
 *   consent is granted, so nothing collected before consent is replayed into GTM.
 */

export const GOATCOUNTER_ENDPOINT = "https://medhaja.goatcounter.com/count";
export const GOATCOUNTER_SRC = "https://gc.zgo.at/count.js";
export const GTM_ID = "GTM-TDCVKN4Z";
export const GTM_SRC = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;

export const enabled = process.env.NODE_ENV === "production";

/* ------------------------------ consent ------------------------------ */

export type Consent = "granted" | "denied";
const KEY = "medhaja.consent.v1";
export const OPEN_SETTINGS_EVENT = "medhaja:cookie-settings";

export function getConsent(): Consent | null {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

/** Session fallback when localStorage is unavailable (private modes, blocked storage). */
let memoryConsent: Consent | null = null;
export const currentConsent = () => getConsent() ?? memoryConsent;

export function setConsent(v: Consent) {
  memoryConsent = v;
  try {
    window.localStorage.setItem(KEY, v);
  } catch {
    /* storage unavailable: the choice lasts for this page view only */
  }
  if (v === "granted") loadGtm();
  else revokeGtm();
}

/* ----------------------------- GoatCounter ---------------------------- */

type GoatCounter = { count: (vars: { path: string }) => void };
declare global {
  interface Window {
    goatcounter?: GoatCounter;
    dataLayer?: unknown[];
  }
}

let gcState: "idle" | "loading" | "ready" = "idle";
const gcQueue: string[] = [];
let lastCounted: string | null = null;

export function loadGoatCounter() {
  if (!enabled || gcState !== "idle") return;
  gcState = "loading";
  const s = document.createElement("script");
  s.async = true;
  s.src = GOATCOUNTER_SRC;
  s.dataset.goatcounter = GOATCOUNTER_ENDPOINT;
  s.dataset.goatcounterSettings = JSON.stringify({ no_onload: true });
  s.onload = () => {
    gcState = "ready";
    gcQueue.splice(0).forEach((path) => window.goatcounter?.count({ path }));
  };
  document.head.appendChild(s);
}

/** Count one page view for `path`. Repeated calls for the same path in a row are ignored. */
export function countPage(path: string) {
  if (!enabled || path === lastCounted) return;
  lastCounted = path;
  if (gcState === "ready" && window.goatcounter?.count) window.goatcounter.count({ path });
  else gcQueue.push(path);
}

/* --------------------------------- GTM -------------------------------- */

let gtmLoaded = false;

/** Google's gtag(): pushes the Arguments object itself, exactly like the official snippet. */
function gtag(..._args: unknown[]): void;
function gtag() {
  // eslint-disable-next-line prefer-rest-params
  (window.dataLayer = window.dataLayer || []).push(arguments);
}

export function loadGtm() {
  if (!enabled) return;
  if (gtmLoaded) {
    gtag("consent", "update", { analytics_storage: "granted" });
    return;
  }
  gtmLoaded = true;
  window.dataLayer = window.dataLayer || [];
  // Consent Mode v2: defaults first, before the tag loads.
  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  // Accept grants analytics only; ads stay denied.
  gtag("consent", "update", { analytics_storage: "granted" });
  gtag("js", new Date());
  // Standard GTM start event (fires the container's Initialization / All Pages triggers).
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const s = document.createElement("script");
  s.async = true;
  s.src = GTM_SRC;
  document.head.appendChild(s);
}

function revokeGtm() {
  if (gtmLoaded) gtag("consent", "update", { analytics_storage: "denied" });
  // Remove GA cookies set while consent was granted.
  try {
    const host = location.hostname;
    for (const c of document.cookie.split(";")) {
      const name = c.split("=")[0].trim();
      if (!/^_ga/.test(name)) continue;
      for (const domain of ["", `;domain=${host}`, `;domain=.${host.replace(/^www\./, "")}`]) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/${domain}`;
      }
    }
  } catch {
    /* ignore */
  }
}

/** Push a GTM event, only while consent is granted and the container is loaded. */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (!enabled || !gtmLoaded || currentConsent() !== "granted") return;
  window.dataLayer?.push({ event, ...params });
}

/** Client-side route change (the first page view is sent by the GA4 tag itself). */
export function trackVirtualPageView(path: string) {
  // The route commits slightly before Next updates the URL and <title>: wait (up to
  // ~4s, as Next also waits for the View Transition) for the URL to match, then read the title. If the visitor has
  // already moved on, send the hit without a title rather than with the wrong one.
  const start = performance.now();
  const send = () => {
    const settled = location.pathname === path && document.title !== "";
    if (!settled && performance.now() - start < 4000) return void window.setTimeout(send, 50);
    track("virtual_page_view", { page_path: path, page_location: location.origin + path, ...(settled ? { page_title: document.title } : {}) });
  };
  window.setTimeout(send, 0);
}

/** Delegated link tracking: résumé downloads, outbound GitHub/LinkedIn/YouTube, mailto. */
export function trackLinkClick(a: HTMLAnchorElement) {
  const href = a.getAttribute("href") || "";
  if (href.startsWith("mailto:")) return track("email_click", { method: "mailto" });
  let url: URL;
  try {
    url = new URL(a.href, location.href);
  } catch {
    return;
  }
  if (url.origin === location.origin && /\.pdf$/i.test(url.pathname)) {
    return track("file_download", { file_name: url.pathname.split("/").pop(), file_extension: "pdf", link_url: url.href });
  }
  const host = url.hostname.replace(/^www\./, "");
  const platform =
    host === "github.com" ? "github" : host === "linkedin.com" ? "linkedin" : host === "youtube.com" || host === "youtu.be" ? "youtube" : null;
  if (platform) track("outbound_click", { platform, link_url: url.href, link_domain: host, outbound: true });
}
