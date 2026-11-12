export type Lesson = {
  id: number;
  title: string;
  description: string;
  theme: "ocean" | "sunset" | "galaxy" | "eagle";
  topic: string;
  youtubeId: string | null;
  pdf: string | null;
  image: string | null;
};
export const lessons: Lesson[] = [
  {
    id: 1,
    title: "Destrave sua fala",
    description: "Apresente-se em inglês com confiança.",
    theme: "ocean",
    topic: "OCEANOS",
    youtubeId: "HG7y8aPbSrM",
    pdf: "/materials/aula-1.pdf",
    image: "/images/ocean.webp",
  },
  {
    id: 2,
    title: "Fale sobre o que você ama",
    description: "Converse sobre seus hobbies e interesses.",
    theme: "sunset",
    topic: "TERRA",
    youtubeId: null,
    pdf: "/materials/aula-2.pdf",
    image: "/images/eagle-sunset.webp",
  },
  {
    id: 3,
    title: "Fale sobre seu mundo",
    description: "Descreva sua cidade, clima e rotina.",
    theme: "galaxy",
    topic: "GALÁXIAS",
    youtubeId: null,
    pdf: "/materials/aula-3.pdf",
    image: "/images/galaxy.webp",
  },
  {
    id: 4,
    title: "Inglês para sua carreira",
    description: "Fale sobre sua profissão e seus próximos passos.",
    theme: "eagle",
    topic: "SUA CARREIRA",
    youtubeId: null,
    pdf: "/materials/aula-4.pdf",
    image: "/images/eagle.webp",
  },
];
export const lots = [
  { id: 1, dates: "01 a 08/11", start: "2026-11-01", end: "2026-11-08" },
  { id: 2, dates: "09 a 15/11", start: "2026-11-09", end: "2026-11-15" },
  { id: 3, dates: "16 a 22/11", start: "2026-11-16", end: "2026-11-22" },
  { id: 4, dates: "23 a 30/11", start: "2026-11-23", end: "2026-11-30" },
] as const;
export const plans = [
  {
    id: "3-meses",
    label: "3 meses",
    medal: "bronze",
    prices: [
      { installment: 48.29, cash: 467 },
      { installment: 64.79, cash: 627 },
      { installment: 81.29, cash: 787 },
      { installment: 97.94, cash: 947 },
    ],
  },
  {
    id: "6-meses",
    label: "6 meses",
    medal: "silver",
    prices: [
      { installment: 71.05, cash: 687 },
      { installment: 95.4, cash: 954 },
      { installment: 122.1, cash: 1221 },
      { installment: 148.7, cash: 1487 },
    ],
  },
  {
    id: "1-ano",
    label: "1 ano",
    medal: "gold",
    prices: [
      { installment: 97.94, cash: 947 },
      { installment: 126.4, cash: 1264 },
      { installment: 158.1, cash: 1581 },
      { installment: 189.7, cash: 1897 },
    ],
  },
] as const;
// Preencher apenas com dados oficiais aprovados. Ausência nunca produz links fictícios.
export const integrations = {
  checkout: {
    "3-meses-lote-1": "https://www.asaas.com/000/c/9eg0onuzb6usegto",
    "3-meses-lote-2": "https://www.asaas.com/000/c/jrfcw4vkwv3hey3m",
    "3-meses-lote-3": "https://www.asaas.com/000/c/ox79a8c925o17s7tv",
    "3-meses-lote-4": "https://www.asaas.com/000/c/v3jugdwrjh7gmgky",
    "6-meses-lote-1": "https://www.asaas.com/000/c/93rtufqntbidpmzc",
    "6-meses-lote-2": "https://www.asaas.com/000/c/b65cirbkhghhptgq",
    "6-meses-lote-3": "https://www.asaas.com/000/c/hdn630j5akbuymnj",
    "6-meses-lote-4": "https://www.asaas.com/000/c/wj8jioz7kf18xbrf",
    "1-ano-lote-1": "https://www.asaas.com/000/c/kmzr22udf41fn6rb",
    "1-ano-lote-2": "https://www.asaas.com/000/c/042pwkw5fmbr0ykz",
    "1-ano-lote-3": "https://www.asaas.com/000/c/o5ejwsdqnni48pwh",
    "1-ano-lote-4": "https://www.asaas.com/000/c/305oza8z8wbti6yg",
  } as Record<string, string>,
  whatsapp: "556181176884" as string | null, // DDI + DDD + número, apenas dígitos.
  pixUrl: "https://www.asaas.com/000/c/zdi9uwkmtojxpfeb" as string | null,
  assets: {
    ocean: "/images/ocean.webp" as string | null,
    eagle: "/images/eagle-3d.webp" as string | null,
    galaxy: "/images/galaxy.webp" as string | null,
  },
};
export const benefits = [
  "Aulas semanais de conversação ao vivo",
  "Turmas exclusivas de até 7 alunos",
  "App WOA Talk Starter + Oliver AI Tutor",
  "WOA PLAY: +400 aulas, mentorias e materiais",
  "Comunidade para praticar idiomas",
];
export const languages = [
  { flag: "/images/flags/us.svg", name: "Inglês" },
  { flag: "/images/flags/fr.svg", name: "Francês" },
  { flag: "/images/flags/es.svg", name: "Espanhol" },
  { flag: "/images/flags/it.svg", name: "Italiano" },
  { flag: "/images/flags/ru.svg", name: "Russo" },
];
export const currency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value,
  );
export function assetPath(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? "/BlackNovember/superaulas"}${path}`;
}
export function safeHttps(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && !parsed.username && !parsed.password
      ? parsed.href
      : null;
  } catch {
    return null;
  }
}
export function pdfPath(path: string | null): string | null {
  if (
    path?.startsWith("/") &&
    !path.startsWith("//") &&
    !/[\\?#]/.test(path) &&
    path.endsWith(".pdf") &&
    !path.split("/").includes("..")
  )
    return assetPath(path);
  return safeHttps(path);
}
export function whatsappUrl(number: string | null): string | null {
  return number && /^[1-9]\d{9,14}$/.test(number)
    ? `https://wa.me/${number}?text=${encodeURIComponent("Olá! Quero confirmar minha matrícula WOA Exclusive — Black November 2026.")}`
    : null;
}

export function campaignDate(now: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const value = (type: string) =>
    parts.find((part) => part.type === type)!.value;
  return `${value("year")}-${value("month")}-${value("day")}`;
}
export function lotStatus(lot: (typeof lots)[number], date: string | null) {
  if (!date) return "Verificando lote";
  if (date < lot.start) return "Em breve";
  if (date > lot.end) return "Encerrado";
  return "Vigente";
}
export function currentLot(date: string | null) {
  return lots.find((lot) => lotStatus(lot, date) === "Vigente");
}
