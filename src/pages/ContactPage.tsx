import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "../components/ContactForm";
import { normalizePhone, useContent, useWhatsAppUrl } from "../coruja-template/content";

export function ContactPage() {
  const phone = useContent<string>("global.brand.phone", "");
  const email = useContent<string>("global.brand.email", "");
  const hours = useContent<string>("global.contact.hours", "");
  const street = useContent<string>("global.brand.address.street", "");
  const number = useContent<string>("global.brand.address.number", "");
  const neighborhood = useContent<string>("global.brand.address.neighborhood", "");
  const city = useContent<string>("global.brand.address.city", "");
  const region = useContent<string>("global.brand.address.region", "");
  const latitude = useContent<string>("global.brand.address.latitude", "");
  const longitude = useContent<string>("global.brand.address.longitude", "");
  const address = [street, number, neighborhood, city, region].filter(Boolean).join(", ");
  const mapQuery = latitude && longitude ? `${latitude},${longitude}` : address;
  const whatsapp = useWhatsAppUrl();
  const formEnabled = useContent<boolean>("pages.contact.form.enabled", true);
  const whatsappLabel = useContent<string>("global.actions.whatsappLabel", "");
  const formEyebrow = useContent<string>("pages.contact.form.eyebrow", "");
  const infoTitle = useContent<string>("pages.contact.info.title", "");
  const mapEyebrow = useContent<string>("pages.contact.map.eyebrow", "");

  return (
    <>
      <section className="page-hero simple-page-hero">
        <div className="container page-hero-simple-copy">
          <span className="eyebrow eyebrow-dark" data-coruja-path="pages.contact.hero.eyebrow">{useContent("pages.contact.hero.eyebrow")}</span>
          <h1 data-coruja-path="pages.contact.hero.title">{useContent("pages.contact.hero.title")}</h1>
          <p data-coruja-path="pages.contact.hero.subtitle">{useContent("pages.contact.hero.subtitle")}</p>
        </div>
      </section>

      <section className="section contact-section">
        <div className="container contact-grid">
          <div className="contact-panel">
            <span className="eyebrow" data-coruja-path="pages.contact.form.eyebrow">{formEyebrow}</span>
            <h2 data-coruja-path="pages.contact.form.title">{useContent("pages.contact.form.title")}</h2>
            <p data-coruja-path="pages.contact.form.description">{useContent("pages.contact.form.description")}</p>
            {formEnabled ? <ContactForm /> : <a href={whatsapp} target="_blank" rel="noreferrer" className="btn btn-primary" data-coruja-path="global.actions.whatsappLabel" data-coruja-text-path="global.actions.whatsappLabel" data-coruja-url-path="global.brand.whatsapp" data-coruja-event="whatsapp_click" data-coruja-event-label="contact-form-disabled-whatsapp"><MessageCircle size={18} /><span data-coruja-path="global.actions.whatsappLabel">{whatsappLabel}</span></a>}
          </div>
          <aside className="contact-aside">
            <div className="contact-info-card">
              <h3 data-coruja-path="pages.contact.info.title">{infoTitle}</h3>
              {phone && <a href={`tel:+${normalizePhone(phone)}`} data-coruja-event="tel_click" data-coruja-event-label="contact-phone"><span><Phone /></span><div><small>Telefone</small><strong data-coruja-path="global.brand.phone">{phone}</strong></div></a>}
              <a href={whatsapp} target="_blank" rel="noreferrer" data-coruja-path="global.actions.whatsappLabel" data-coruja-text-path="global.actions.whatsappLabel" data-coruja-url-path="global.brand.whatsapp" data-coruja-event="whatsapp_click" data-coruja-event-label="contact-whatsapp"><span><MessageCircle /></span><div><small>WhatsApp</small><strong data-coruja-path="global.actions.whatsappLabel">{whatsappLabel}</strong></div></a>
              {email && <a href={`mailto:${email}`}><span><Mail /></span><div><small>E-mail</small><strong data-coruja-path="global.brand.email">{email}</strong></div></a>}
              {hours && <div className="contact-info-static"><span><Clock3 /></span><div><small>Horário</small><strong data-coruja-path="global.contact.hours">{hours}</strong></div></div>}
              {address && <div className="contact-info-static"><span><MapPin /></span><div><small>Base de atendimento</small><strong>{address}</strong></div></div>}
            </div>
          </aside>
        </div>
      </section>

      <section className="section map-section">
        <div className="container map-layout">
          <div><span className="eyebrow" data-coruja-path="pages.contact.map.eyebrow">{mapEyebrow}</span><h2 data-coruja-path="pages.contact.map.title">{useContent("pages.contact.map.title")}</h2><p data-coruja-path="pages.contact.map.description">{useContent("pages.contact.map.description")}</p></div>
          <div className="map-frame">
            {mapQuery ? <iframe title="Mapa da área de atendimento" src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=13&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /> : <div className="map-placeholder"><MapPin /><span>Cadastre o endereço no Coruja Host</span></div>}
          </div>
        </div>
      </section>
    </>
  );
}
