import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import Home from "../app/page";
import config from "../next.config";
import {
  lessons,
  plans,
  lots,
  integrations,
  safeHttps,
  pdfPath,
  whatsappUrl,
  assetPath,
  campaignDate,
  currentLot,
  lotStatus,
} from "../lib/campaign";
import { LessonCard } from "../components/lesson-card";
import { PricingTable } from "../components/pricing-table";
import { Enrollment } from "../components/enrollment";

const markup = () => new JSDOM(renderToStaticMarkup(<Home />)).window.document;
test("campanha possui quatro aulas, 12 preços, cinco benefícios e cinco idiomas", () => {
  const doc = markup();
  assert.equal(doc.querySelectorAll(".lesson-card").length, 4);
  assert.equal(doc.querySelectorAll("tbody td").length, 12);
  assert.equal(doc.querySelectorAll(".benefits li").length, 5);
  assert.equal(doc.querySelectorAll(".languages li").length, 5);
  assert.equal(doc.querySelectorAll("h1").length, 1);
  assert.equal(doc.querySelectorAll('tbody th[scope="row"]').length, 3);
  assert.equal(doc.querySelectorAll('thead th[scope="col"]').length, 5);
});
test("integrações ausentes não criam navegação fictícia ou solicitações ao YouTube", () => {
  const doc = markup();
  assert.equal(doc.querySelectorAll(".play-button:disabled").length, 3);
  assert.equal(
    doc.querySelectorAll(".lesson-footer button:disabled").length,
    0,
  );
  assert.equal(doc.querySelectorAll(".payment-button:disabled").length, 12);
  assert.equal(doc.querySelectorAll("iframe").length, 0);
  for (const anchor of doc.querySelectorAll('a[href^="#"]')) {
    const href = anchor.getAttribute("href")!;
    assert.match(href, /^#[a-z]+$/);
    assert.ok(doc.getElementById(href.slice(1)), `Âncora existente: ${href}`);
  }
});
test("preços preservam exatamente a referência, inclusive diferenças entre parcelas e à vista", () => {
  assert.deepEqual(
    plans.map((p) => p.prices.map((x) => [x.installment, x.cash])),
    [
      [
        [48.29, 467],
        [64.79, 627],
        [81.29, 787],
        [97.94, 947],
      ],
      [
        [71.05, 687],
        [95.4, 954],
        [122.1, 1221],
        [148.7, 1487],
      ],
      [
        [97.94, 947],
        [126.4, 1264],
        [158.1, 1581],
        [189.7, 1897],
      ],
    ],
  );
  assert.deepEqual(
    lots.map((l) => l.dates),
    ["01 a 08/11", "09 a 15/11", "16 a 22/11", "23 a 30/11"],
  );
});
test("links rejeitam esquemas inseguros e números inválidos", () => {
  for (const url of [
    "javascript:alert(1)",
    "http://example.com",
    "//example.com",
    "https://user:pass@example.com",
    "",
  ])
    assert.equal(safeHttps(url), null);
  assert.equal(
    safeHttps("https://example.com/checkout"),
    "https://example.com/checkout",
  );
  assert.equal(pdfPath("//example.com/a.pdf"), null);
  assert.equal(pdfPath("/../a.pdf"), null);
  assert.equal(whatsappUrl("telefone pendente"), null);
  assert.equal(whatsappUrl(null), null);
  assert.match(
    whatsappUrl("5511999999999")!,
    /^https:\/\/wa.me\/5511999999999\?text=/,
  );
});
test("basePath é consistente entre configuração, imagens e PDFs", () => {
  const prefix = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  assert.equal(config.basePath, prefix);
  assert.equal(assetPath("/images/ocean.webp"), `${prefix}/images/ocean.webp`);
  assert.equal(
    pdfPath("/materials/aula-1.pdf"),
    `${prefix}/materials/aula-1.pdf`,
  );
});
test("cada PDF é independente e o vídeo só é carregado após interação", async () => {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost",
  });
  Object.assign(globalThis, {
    window: dom.window,
    document: dom.window.document,
    HTMLElement: dom.window.HTMLElement,
  });
  const { render, fireEvent, cleanup } = await import("@testing-library/react");
  try {
    const first = {
      ...lessons[0],
      youtubeId: "HG7y8aPbSrM",
      pdf: "/materials/aula-1.pdf",
    };
    const second = { ...lessons[1], pdf: "/materials/aula-2.pdf" };
    const view = render(
      <>
        <LessonCard lesson={first} />
        <LessonCard lesson={second} />
      </>,
    );
    assert.equal(view.container.querySelector("iframe"), null);
    assert.deepEqual(
      [...view.container.querySelectorAll("a")].map((a) =>
        a.getAttribute("href"),
      ),
      [pdfPath(first.pdf), pdfPath(second.pdf)],
    );
    fireEvent.click(
      view.getByRole("button", { name: /Assistir à Superaula 1/ }),
    );
    assert.equal(view.container.querySelectorAll("iframe").length, 1);
    assert.equal(
      view.container.querySelector("iframe")?.getAttribute("src"),
      "https://www.youtube-nocookie.com/embed/HG7y8aPbSrM?autoplay=1",
    );
    assert.ok(view.getByRole("article", { name: /Superaula 1/ }));
  } finally {
    cleanup();
    dom.window.close();
    for (const key of ["window", "document", "HTMLElement"])
      Reflect.deleteProperty(globalThis, key);
  }
});
test("12 links oficiais correspondem aos planos e somente o lote vigente permite matrícula", () => {
  const ids = [
    [
      "9eg0onuzb6usegto",
      "jrfcw4vkwv3hey3m",
      "ox79a8c925o17s7tv",
      "v3jugdwrjh7gmgky",
    ],
    [
      "93rtufqntbidpmzc",
      "b65cirbkhghhptgq",
      "hdn630j5akbuymnj",
      "wj8jioz7kf18xbrf",
    ],
    [
      "kmzr22udf41fn6rb",
      "042pwkw5fmbr0ykz",
      "o5ejwsdqnni48pwh",
      "305oza8z8wbti6yg",
    ],
  ];
  assert.equal(Object.keys(integrations.checkout).length, 12);
  for (let lot = 0; lot < 4; lot++) {
    const doc = new JSDOM(
      renderToStaticMarkup(<PricingTable initialDate={lots[lot].start} />),
    ).window.document;
    assert.equal(doc.querySelectorAll("a.payment-button").length, 3);
    assert.equal(
      doc.querySelectorAll("button.payment-button:disabled").length,
      9,
    );
    plans.forEach((plan, index) => {
      const url = `https://www.asaas.com/000/c/${ids[index][lot]}`;
      assert.equal(integrations.checkout[`${plan.id}-lote-${lot + 1}`], url);
      assert.equal(
        doc.querySelectorAll("a.payment-button")[index].getAttribute("href"),
        url,
      );
    });
  }
});
test("datas incluem início e fim dos lotes e respeitam Brasília na virada UTC", () => {
  for (const lot of lots) {
    assert.equal(currentLot(lot.start)?.id, lot.id);
    assert.equal(currentLot(lot.end)?.id, lot.id);
  }
  assert.equal(currentLot("2026-10-31"), undefined);
  assert.equal(currentLot("2026-12-01"), undefined);
  assert.equal(currentLot(null), undefined);
  assert.equal(campaignDate(new Date("2026-11-09T02:59:59Z")), "2026-11-08");
  assert.equal(campaignDate(new Date("2026-11-09T03:00:00Z")), "2026-11-09");
  assert.equal(lotStatus(lots[0], "2026-11-09"), "Encerrado");
  assert.equal(lotStatus(lots[2], "2026-11-09"), "Em breve");
});
test("Pix oficial exige lote vigente; WhatsApp permanece disponível, sem confirmação automática", () => {
  for (const date of ["2026-11-10", "2026-10-31", "2026-12-01"]) {
    const doc = new JSDOM(
      renderToStaticMarkup(<Enrollment initialDate={date} />),
    ).window.document;
    assert.equal(
      doc.querySelector("a.pix-button")?.getAttribute("href") ?? null,
      date === "2026-11-10"
        ? "https://www.asaas.com/000/c/zdi9uwkmtojxpfeb"
        : null,
    );
    assert.ok(doc.querySelector('a[href^="https://wa.me/556181176884"]'));
    assert.match(
      doc.querySelector(".confirmation-note")!.textContent!,
      /após a verificação/,
    );
    assert.match(doc.body.textContent!, /exatamente o valor à vista/);
  }
});

test("materiais oficiais existem e somente a gravação da Aula 01 está habilitada", () => {
  assert.equal(lessons[0].youtubeId, "HG7y8aPbSrM");
  assert.ok(lessons.slice(1).every((lesson) => lesson.youtubeId === null));
  const doc = markup();
  assert.equal(doc.querySelectorAll(".lesson-footer a[download]").length, 4);
  assert.equal(new Set(lessons.map((lesson) => lesson.pdf)).size, 4);
  for (const lesson of lessons) {
    assert.equal(
      readFileSync(`public${lesson.pdf}`).subarray(0, 5).toString(),
      "%PDF-",
    );
    assert.ok(existsSync(`public${lesson.image}`));
  }
  for (const path of Object.values(integrations.assets))
    assert.ok(path && existsSync(`public${path}`));
});

test("página aberta troca o lote na meia-noite de Brasília", async (context) => {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost",
  });
  Object.assign(globalThis, {
    window: dom.window,
    document: dom.window.document,
    HTMLElement: dom.window.HTMLElement,
    IS_REACT_ACT_ENVIRONMENT: true,
  });
  context.mock.timers.enable({
    apis: ["Date", "setInterval"],
    now: new Date("2026-11-09T02:59:59Z"),
  });
  const { render, act, cleanup } = await import("@testing-library/react");
  try {
    const view = render(<PricingTable />);
    assert.ok(
      view.getByRole("link", { name: "Garantir vaga: 3 meses, lote 1" }),
    );
    act(() => context.mock.timers.tick(1000));
    assert.equal(
      view.queryByRole("link", { name: "Garantir vaga: 3 meses, lote 1" }),
      null,
    );
    assert.ok(
      view.getByRole("link", { name: "Garantir vaga: 3 meses, lote 2" }),
    );
  } finally {
    cleanup();
    context.mock.timers.reset();
    dom.window.close();
    for (const key of [
      "window",
      "document",
      "HTMLElement",
      "IS_REACT_ACT_ENVIRONMENT",
    ])
      Reflect.deleteProperty(globalThis, key);
  }
});
