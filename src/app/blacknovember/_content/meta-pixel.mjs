
import { createCampaignAttribution, getCampaignAttribution } from "./campaign-attribution.mjs";

export const PIXEL_ID = "2168410580211263";
export const CONSENT_KEY = "woa-ad-consent-v1";

// Factory also permits deterministic tests without contacting Meta or a database.
export function createPixelController(win, doc, attribution = createCampaignAttribution(win, doc)) {
  let initialized = false;
  let owned = false;
  let loading;
  let sdkLoaded = false;
  let lastPath;
  let choice;

  function consent() {
    if (choice !== undefined) return choice === "granted";
    try {
      return win.localStorage.getItem(CONSENT_KEY) === "granted";
    } catch {
      return choice === "granted";
    }
  }

  function safePage() {
    return attribution.prepare({ navigate: false });
  }

  function conflict() {
    return (!owned && (win.fbq || win._fbq)) ||
      win.google_tag_manager ||
      doc.querySelector(
        'script[src*="googletagmanager.com"],script[src*="fbevents.js"]:not([data-woa-pixel])'
      );
  }

  function ready() {
    if (!consent() || !safePage() || conflict()) {
      return Promise.resolve(false);
    }

    if (initialized) return Promise.resolve(true);

    if (sdkLoaded) {
      initialize();
      return Promise.resolve(true);
    }

    if (loading) return loading;

    const fbq = function (...args) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    };

    fbq.queue = [];
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.disablePushState = true;

    win.fbq = win._fbq = fbq;
    owned = true;

    loading = new Promise(resolve => {
      const script = doc.createElement("script");

      script.async = true;
      script.src = "https://connect.facebook.net/en_US/fbevents.js";
      script.dataset.woaPixel = "true";

      script.onload = () => {
        sdkLoaded = true;
        if (consent() && safePage()) initialize();
        resolve(initialized);
      };

      script.onerror = () => resolve(false);

      doc.head.appendChild(script);
    });

    return loading;
  }

  function initialize() {
    if (initialized) return;

    win.fbq("consent", "revoke");
    win.fbq("set", "autoConfig", false, PIXEL_ID);

    // No user-data argument: advanced matching is deliberately not enabled.
    win.fbq("init", PIXEL_ID);
    win.fbq("consent", "grant");

    initialized = true;
  }

  async function pageView() {
    if (!await ready() || !consent() || !safePage()) {
      return false;
    }

    const path = win.location.pathname;

    if (lastPath === path) return false;

    lastPath = path;

    win.fbq("trackSingle", PIXEL_ID, "PageView", {});

    return true;
  }

  // Lead utiliza o mesmo eventId da API de Conversoes da Meta.
  async function lead(eventId) {
    if (!consent() || !safePage()) return false;

    // Never retain a conversion for later consent,
    // a reload, or a slow/blocked SDK.
    let timer;

    const loaded = await Promise.race([
      ready(),
      new Promise(resolve => {
        timer = win.setTimeout(() => resolve(false), 1800);
      })
    ]);

    win.clearTimeout(timer);

    if (!loaded || !consent() || !safePage()) {
      return false;
    }

    // Prepara o evento Lead.
    const args = [
      "trackSingle",
      PIXEL_ID,
      "Lead",
      {}
    ];

    // Compartilha o identificador com a CAPI
    // para permitir deduplicacao dos eventos.
    if (
      typeof eventId === "string" &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(eventId)
    ) {
      args.push({ eventID: eventId });
    }

    // Envia o evento ao Meta Pixel.
    win.fbq(...args);

    // Give the SDK a brief opportunity to dispatch
    // before the full-page redirect.
    await new Promise(resolve => win.setTimeout(resolve, 150));

    return true;
  }

  function choose(value) {
    choice = value === "granted" ? "granted" : "denied";

    try {
      win.localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      /* session only */
    }

    if (choice === "denied") {
      if (owned && initialized) {
        win.fbq("consent", "revoke");
      }

      // Remove first-party Pixel cookies at host
      // and parent-domain scopes.
      const parts = win.location.hostname.split(".");

      for (const name of ["_fbp", "_fbc"]) {
        doc.cookie = `${name}=; Max-Age=0; path=/`;

        for (let i = 0; i < parts.length - 1; i++) {
          doc.cookie = `${name}=; Max-Age=0; path=/; domain=.${parts.slice(i).join(".")}`;
        }
      }
    } else {
      if (owned && initialized) {
        win.fbq("consent", "grant");
      }

      void pageView();
    }
  }

  return {
    pageView,
    lead,
    choose
  };
}

let controller;

export function getPixel() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return controller ??= createPixelController(
    window,
    document,
    getCampaignAttribution()
  );
}

// Chamado pelo formulario somente apos a API confirmar o cadastro.
export async function trackSavedLead(eventId) {
  try {
    await getPixel()?.lead(eventId);
  } catch {
    // Analytics must never block a saved signup.
  }
}
