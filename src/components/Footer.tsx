import { Facebook, Instagram, Mail, MapPin, Phone, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { normalizePhone, useCollection, useContent, useWhatsAppUrl } from "../coruja-template/content";

type FooterLink = { label: string; path: string };

export function Footer() {
  const brand = useContent<string>("global.brand.name", "");
  const slogan = useContent<string>("global.brand.slogan", "");
  const description = useContent<string>("global.footer.description", "");
  const copy = useContent<string>("global.footer.copy", "");
  const links = useCollection<FooterLink>("global.footer.links");
  const phone = useContent<string>("global.brand.phone", "");
  const email = useContent<string>("global.brand.email", "");
  const instagram = useContent<string>("global.social.instagram", "");
  const facebook = useContent<string>("global.social.facebook", "");
  const city = useContent<string>("global.brand.address.city", "");
  const region = useContent<string>("global.brand.address.region", "");
  const whatsapp = useWhatsAppUrl();
  const whatsappLabel = useContent<string>("global.actions.whatsappLabel", "");

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand"><Zap size={28} /><span data-coruja-path="global.brand.name">{brand}</span></div>
          <p data-coruja-path="global.footer.description">{description}</p>
          <small data-coruja-path="global.brand.slogan">{slogan}</small>
        </div>
        <div>
          <h3>Navegação</h3>
          <div className="footer-links">
            {links.map((item, index) => <Link key={item.path} to={item.path} data-coruja-item-index={index} data-coruja-text-path={`global.footer.links.${index}.label`} data-coruja-url-path={`global.footer.links.${index}.path`}><span data-coruja-path={`global.footer.links.${index}.label`}>{item.label}</span></Link>)}
          </div>
        </div>
        <div>
          <h3>Contato</h3>
          <div className="footer-links contact-links">
            {phone && <a href={`tel:+${normalizePhone(phone)}`} data-coruja-event="tel_click" data-coruja-event-label="footer-phone"><Phone size={16} /><span data-coruja-path="global.brand.phone">{phone}</span></a>}
            {email && <a href={`mailto:${email}`}><Mail size={16} /><span data-coruja-path="global.brand.email">{email}</span></a>}
            {(city || region) && <span><MapPin size={16} /><span>{[city, region].filter(Boolean).join(" - ")}</span></span>}
            <a href={whatsapp} target="_blank" rel="noreferrer" data-coruja-path="global.actions.whatsappLabel" data-coruja-text-path="global.actions.whatsappLabel" data-coruja-url-path="global.brand.whatsapp" data-coruja-event="whatsapp_click" data-coruja-event-label="footer-whatsapp"><span data-coruja-path="global.actions.whatsappLabel">{whatsappLabel}</span></a>
          </div>
        </div>
        <div>
          <h3>Redes sociais</h3>
          <div className="social-links">
            {instagram && <a href={instagram} target="_blank" rel="noreferrer" aria-label="Instagram" data-coruja-url-path="global.social.instagram"><Instagram /></a>}
            {facebook && <a href={facebook} target="_blank" rel="noreferrer" aria-label="Facebook" data-coruja-url-path="global.social.facebook"><Facebook /></a>}
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span data-coruja-path="global.footer.copy">{copy}</span>
      </div>
    </footer>
  );
}
