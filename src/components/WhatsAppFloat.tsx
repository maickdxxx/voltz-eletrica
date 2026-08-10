import { MessageCircle } from "lucide-react";
import { useWhatsAppUrl } from "../coruja-template/content";

export function WhatsAppFloat() {
  const url = useWhatsAppUrl();
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="whatsapp-float"
      aria-label="Falar pelo WhatsApp"
      data-coruja-event="whatsapp_click"
      data-coruja-event-label="floating-whatsapp"
      data-coruja-url-path="global.brand.whatsapp"
      data-coruja-message-path="global.contact.whatsappMessage"
    >
      <MessageCircle size={26} />
      <span>WhatsApp</span>
    </a>
  );
}
