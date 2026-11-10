"use client";
import { useEffect, useState } from "react";
import { campaignDate } from "./campaign";
/** O build não congela o lote: a data é atualizada no navegador e ao retomar a aba. */
export function useCampaignDate(initialDate?: string) {
  const [date, setDate] = useState<string | null>(initialDate ?? null);
  useEffect(() => {
    const update = () => setDate(campaignDate(new Date()));
    update();
    const timer = setInterval(update, 1000);
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return date;
}
