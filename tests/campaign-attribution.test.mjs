import { test } from "node:test";
import assert from "node:assert/strict";
import { createCampaignAttribution } from "../src/app/blacknovember/_content/campaign-attribution.mjs";
function fixture(href, { storage = new Map(), referrer = "", policy = true, blocked = false } = {}) {
 const replacements = [];
 const location = new URL(href);
 location.replace = value => replacements.push(value);
 const win = { location, sessionStorage: {
  getItem: key => storage.get(key),
  setItem: (key,value) => { if(blocked) throw Error("blocked"); storage.set(key,value); },
 }};
 const doc = { referrer, querySelector: () => policy ? {content:"no-referrer"} : null };
 return { attribution:createCampaignAttribution(win,doc), win, doc, storage, replacements };
}
test("campaign URL reloads clean before SDK; five UTMs survive without arbitrary query", () => {
 const f=fixture("https://woatalk.com.br/blacknovember?utm_source=meta&utm_medium=paid&utm_campaign=qa%40example.org&utm_content=one&utm_term=two&email=private%40example.org&fbclid=secret#private");
 assert.equal(f.attribution.prepare(),false);
 assert.deepEqual(f.replacements,["https://woatalk.com.br/blacknovember"]);
 assert.equal(f.attribution.prepare(),false);
 assert.equal(f.replacements.length,1);
 const clean=fixture(f.replacements[0],{storage:f.storage});
 assert.equal(clean.attribution.prepare(),true);
 assert.deepEqual(clean.attribution.read(),{utm_source:"meta",utm_medium:"paid",utm_campaign:"qa@example.org",utm_content:"one",utm_term:"two"});
 const stored=JSON.stringify([...f.storage.values()]);
 assert(!stored.includes("private@example.org")); assert(!stored.includes("fbclid")); assert(!stored.includes("secret"));
});
test("sensitive document.referrer requires new document and no-referrer policy", () => {
 const f=fixture("https://woatalk.com.br/blacknovember",{referrer:"https://example.org/person/private?email=private@example.org"});
 assert.equal(f.attribution.prepare(),false);
 assert.deepEqual(f.replacements,["https://woatalk.com.br/blacknovember"]);
 const hostname=fixture("https://woatalk.com.br/blacknovember",{referrer:"https://personal-id.example.org/"});
 assert.equal(hostname.attribution.prepare(),false);
 assert.deepEqual(hostname.replacements,["https://woatalk.com.br/blacknovember"]);
 const noPolicy=fixture("https://woatalk.com.br/blacknovember",{referrer:f.doc.referrer,policy:false});
 assert.equal(noPolicy.attribution.prepare(),false); assert.equal(noPolicy.replacements.length,0);
});
test("blocked storage preserves attribution in memory but does not allow unsafe SDK document", () => {
 const f=fixture("https://woatalk.com.br/blacknovember?utm_source=meta&other=private",{blocked:true});
 assert.equal(f.attribution.prepare(),false);
 assert.deepEqual(f.attribution.read(),{utm_source:"meta"});
 assert.equal(f.replacements.length,0);
});
test("expired session attribution is discarded and UTM values stay capped at 200", () => {
 const old=new Map([["woa-campaign-attribution-v1",JSON.stringify({savedAt:0,utm:{utm_source:"old"}})]]);
 assert.deepEqual(fixture("https://woatalk.com.br/blacknovember",{storage:old}).attribution.read(),{});
 const f=fixture("https://woatalk.com.br/blacknovember?utm_source="+"a".repeat(300));
 assert.equal(f.attribution.read().utm_source.length,200);
});
test("only known campaign paths and anchors may be measured; embedded pages fail closed", () => {
 const f=fixture("https://woatalk.com.br/blacknovember#oferta");
 assert.equal(f.attribution.prepare(),true);assert.equal(f.replacements.length,0);
 const outside=fixture("https://woatalk.com.br/user/private");
 assert.equal(outside.attribution.prepare(),false);
 const embedded=fixture("https://woatalk.com.br/blacknovember");embedded.win.top={};
 assert.equal(embedded.attribution.prepare(),false);
});
