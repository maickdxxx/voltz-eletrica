import { Send } from "lucide-react";
import type { FormEvent } from "react";
import { normalizePhone, useCollection, useContent } from "../coruja-template/content";
import type { Service } from "./ServiceCard";

export function ContactForm() {
  const services = useCollection<Service>("collections.services").filter((item) => item.active !== false);
  const whatsapp = normalizePhone(useContent<string>("global.brand.whatsapp", ""));
  const nameLabel = useContent<string>("pages.contact.form.nameLabel", "");
  const namePlaceholder = useContent<string>("pages.contact.form.namePlaceholder", "");
  const phoneLabel = useContent<string>("pages.contact.form.phoneLabel", "");
  const phonePlaceholder = useContent<string>("pages.contact.form.phonePlaceholder", "");
  const serviceLabel = useContent<string>("pages.contact.form.serviceLabel", "");
  const messageLabel = useContent<string>("pages.contact.form.messageLabel", "");
  const messagePlaceholder = useContent<string>("pages.contact.form.messagePlaceholder", "");
  const submitText = useContent<string>("pages.contact.form.submitText", "");
  const openingMessage = useContent<string>("global.contact.whatsappMessage", "");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const phone = String(data.get("phone") ?? "");
    const service = String(data.get("service") ?? "");
    const message = String(data.get("message") ?? "");
    const text = [
      openingMessage,
      name ? `Nome: ${name}` : "",
      phone ? `Telefone: ${phone}` : "",
      service ? `Serviço: ${service}` : "",
      message ? `Detalhes: ${message}` : "",
    ].filter(Boolean).join("\n");
    if (whatsapp) window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} data-coruja-form="contact" data-coruja-event="form_submit" data-coruja-event-label="contact-form">
      <div className="field-grid">
        <label>
          <span data-coruja-path="pages.contact.form.nameLabel">{nameLabel}</span>
          <input name="name" required placeholder={namePlaceholder} data-coruja-placeholder-path="pages.contact.form.namePlaceholder" />
        </label>
        <label>
          <span data-coruja-path="pages.contact.form.phoneLabel">{phoneLabel}</span>
          <input name="phone" type="tel" required placeholder={phonePlaceholder} data-coruja-placeholder-path="pages.contact.form.phonePlaceholder" />
        </label>
      </div>
      <label>
        <span data-coruja-path="pages.contact.form.serviceLabel">{serviceLabel}</span>
        <select name="service" defaultValue="">
          <option value="">Selecione um serviço</option>
          {services.map((service) => <option key={service.slug} value={service.title}>{service.title}</option>)}
        </select>
      </label>
      <label>
        <span data-coruja-path="pages.contact.form.messageLabel">{messageLabel}</span>
        <textarea name="message" rows={5} placeholder={messagePlaceholder} data-coruja-placeholder-path="pages.contact.form.messagePlaceholder" />
      </label>
      <button className="btn btn-primary btn-full" type="submit">
        <Send size={18} /> <span data-coruja-path="pages.contact.form.submitText">{submitText}</span>
      </button>
      {!whatsapp && <p className="form-note">Cadastre um WhatsApp no Coruja Host para ativar o envio.</p>}
    </form>
  );
}
