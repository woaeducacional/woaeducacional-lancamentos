// Link público do grupo oficial da campanha; pode ser substituído no ambiente.
export function getWhatsAppGroupUrl() {
  return (
    process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL?.trim() ||
    "https://chat.whatsapp.com/Bh29PWfLcNT4UIU07ksgYc"
  );
}

