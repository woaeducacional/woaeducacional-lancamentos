import { test } from "node:test";
import assert from "node:assert/strict";
import { createPixelController, PIXEL_ID, CONSENT_KEY } from "../src/app/blacknovember/_content/meta-pixel.mjs";
function fixture({ href = "https://woatalk.com.br/blacknovember", referrer = "", existing = false, gtm = false, autoLoad = true } = {}) {
  const values = new Map();
  const calls = [], scripts = [];
  const win = { location: new URL(href), localStorage: { getItem: k => values.get(k), setItem: (k,v) => values.set(k,v) }, setTimeout, clearTimeout };
  if (existing) win.fbq = () => {};
  if (gtm) win.google_tag_manager = {};
  const doc = { referrer, cookie: "", querySelector: () => null, createElement: () => ({ dataset: {} }), head: { appendChild(script) {
    scripts.push(script);
    win.fbq.callMethod = (...args) => calls.push(args);
    if (autoLoad) queueMicrotask(() => script.onload());
  } } };
  return { win, doc, calls, scripts, values, pixel: createPixelController(win, doc) };
}
test("consent gates script and official ID has no user data", async () => {
  const f = fixture();
  assert.equal(await f.pixel.pageView(), false);
  assert.equal(await f.pixel.lead(), false);
  assert.equal(f.scripts.length, 0);
  f.pixel.choose("granted");
  await f.pixel.pageView();
  assert.equal(f.scripts.length, 1);
  assert.deepEqual(f.calls.find(c => c[0] === "init"), ["init", "2168410580211263"]);
  assert.deepEqual(f.calls.find(c => c[0] === "set"), ["set", "autoConfig", false, PIXEL_ID]);
  assert.equal(f.win.fbq.disablePushState, true);
  assert.equal(f.values.get(CONSENT_KEY), "granted");
});
test("PageView deduplication across navigation without automatic Lead", async () => {
  const f = fixture();
  f.pixel.choose("granted");
  await Promise.all([f.pixel.pageView(), f.pixel.pageView()]);
  assert.equal(f.calls.filter(c => c[2] === "PageView").length, 1);
  f.win.location = new URL("https://woatalk.com.br/blacknovember/confirmacao");
  await f.pixel.pageView();
  await f.pixel.pageView();
  assert.equal(f.calls.filter(c => c[2] === "PageView").length, 2);
  assert.equal(f.calls.filter(c => c[2] === "Lead").length, 0);
});
test("Lead has empty parameters and revocation blocks further events", async () => {
  const f = fixture();
  f.pixel.choose("granted");
  await f.pixel.pageView();
  assert.equal(await f.pixel.lead(), true);
  assert.deepEqual(f.calls.find(c => c[2] === "Lead"), ["trackSingle", PIXEL_ID, "Lead", {}]);
  f.pixel.choose("denied");
  const n = f.calls.length;
  assert.equal(await f.pixel.lead(), false);
  assert.equal(await f.pixel.pageView(), false);
  assert.equal(f.calls.length, n);
  assert.deepEqual(f.calls[n-1], ["consent", "revoke"]);
  f.pixel.choose("granted");
  await f.pixel.pageView();
  assert.equal(f.calls.filter(c => c[2] === "PageView").length, 1);
});
test("unsafe URLs and external Pixel or GTM block installation", async () => {
  for (const options of [
    { href: "https://woatalk.com.br/blacknovember?email=teste@example.org" },
    { href: "https://woatalk.com.br/blacknovember#telefone" },
    { referrer: "https://example.org/?email=teste@example.org" },
    { existing: true }, { gtm: true },
  ]) {
    const f = fixture(options);
    f.pixel.choose("granted");
    assert.equal(await f.pixel.pageView(), false);
    assert.equal(await f.pixel.lead(), false);
    assert.equal(f.scripts.length, 0);
  }
});
test("storage failure cannot override refusal in current session", async () => {
  const f = fixture();
  f.values.set(CONSENT_KEY, "granted");
  await f.pixel.pageView();
  f.win.localStorage.setItem = () => { throw Error("blocked"); };
  f.pixel.choose("denied");
  assert.equal(await f.pixel.lead(), false);
});

test("revocation during SDK load suppresses pending events; new grant works", async () => {
  const f = fixture({ autoLoad: false });
  f.pixel.choose("granted");
  const pending = f.pixel.pageView();
  f.pixel.choose("denied");
  f.scripts[0].onload();
  assert.equal(await pending, false);
  assert.equal(f.calls.length, 0);
  f.pixel.choose("granted");
  await f.pixel.pageView();
  assert.equal(f.calls.filter(c => c[2] === "PageView").length, 1);
  assert.equal(f.calls.filter(c => c[2] === "Lead").length, 0);
});
