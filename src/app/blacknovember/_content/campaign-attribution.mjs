const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
const STORAGE_KEY = "woa-campaign-attribution-v1";
const MAX_AGE = 30 * 60 * 1000;
const PATHS = new Set(["/blacknovember", "/blacknovember/confirmacao", "/blacknovember/politica-de-privacidade"]);

export function createCampaignAttribution(win, doc) {
  let snapshot = {};
  let loaded = false;
  let redirecting = false;
  const safeHashes = new Set(["", "#oferta", "#inscricao", "#beneficios"]);
  function load() {
    if (loaded) return;
    loaded = true;
    try {
      const saved = JSON.parse(win.sessionStorage.getItem(STORAGE_KEY) || "null");
      if (saved && Number.isFinite(saved.savedAt) && saved.savedAt <= Date.now() && Date.now() - saved.savedAt < MAX_AGE) {
        for (const key of UTM_KEYS)
          if (typeof saved.utm?.[key] === "string") snapshot[key] = saved.utm[key].slice(0, 200);
      }
    } catch { /* Attribution remains in memory when storage is unavailable. */ }
  }
  function read() {
    load();
    const query = new URL(win.location.href).searchParams;
    if (UTM_KEYS.some(key => query.has(key))) {
      snapshot = {};
      for (const key of UTM_KEYS) {
        const value = query.get(key);
        if (value) snapshot[key] = value.slice(0, 200);
      }
    }
    return { ...snapshot };
  }
  function save() {
    try {
      win.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ savedAt: Date.now(), utm: snapshot }));
      return true;
    } catch { return false; }
  }
  function safeReferrer() {
    // Even a seemingly harmless external hostname or path can carry a personal identifier.
    return !doc.referrer;
  }
  function prepare({ navigate = true } = {}) {
    const url = new URL(win.location.href);
    if (!PATHS.has(url.pathname) || redirecting || (win.top && win.top !== win)) return false;
    const dirty = !!url.search || !safeHashes.has(url.hash);
    read();
    if (dirty || !safeReferrer()) {
      if (!navigate) return false;
      const persisted = save();
      // Start a fresh document so location, documentURI, navigation timing and referrer
      // are clean before any vendor code executes. Merely changing fbq parameters is insufficient.
      if (!persisted || doc.querySelector('meta[name="referrer"]')?.content !== "no-referrer") return false;
      redirecting = true;
      win.location.replace(url.origin + url.pathname);
      return false;
    }
    return true;
  }
  return { read, prepare };
}
let attribution;
export function getCampaignAttribution() {
  if (typeof window === "undefined") return undefined;
  return attribution ??= createCampaignAttribution(window, document);
}
export function getCampaignUtm() {
  return getCampaignAttribution()?.read() || {};
}
