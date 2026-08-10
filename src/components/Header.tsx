import { Menu, Phone, X, Zap } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { normalizePhone, useCollection, useContent, useWhatsAppUrl } from "../coruja-template/content";
import { withCorujaBasePath } from "../lib/coruja-preview";

type MenuItem = { label: string; path: string; visible?: boolean; order?: number; target?: string };

export function Header() {
  const [open, setOpen] = useState(false);
  const brand = useContent<string>("global.brand.name", "");
  const logo = useContent<string>("global.brand.logoUrl", "");
  const logoAlt = useContent<string>("global.brand.logoAlt", brand);
  const slogan = useContent<string>("global.brand.slogan", "");
  const phone = useContent<string>("global.brand.phone", "");
  const menu = useCollection<MenuItem>("global.menu.items")
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter(({ item }) => item.visible !== false)
    .sort((a, b) => Number(a.item.order ?? 0) - Number(b.item.order ?? 0));
  const whatsapp = useWhatsAppUrl();
  const quoteLabel = useContent<string>("global.actions.quoteLabel", "");
  const tel = normalizePhone(phone);

  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <span><Zap size={15} aria-hidden="true" /> <span data-coruja-path="global.brand.slogan">{slogan}</span></span>
          {phone && (
            <a href={`tel:+${tel}`} data-coruja-event="tel_click" data-coruja-event-label="header-phone" data-coruja-phone-raw="global.brand.phone">
              <Phone size={15} aria-hidden="true" />
              <span data-coruja-path="global.brand.phone">{phone}</span>
            </a>
          )}
        </div>
      </div>
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label={`${brand} - início`} onClick={() => setOpen(false)}>
            {logo ? (
              <img src={withCorujaBasePath(logo)} alt={logoAlt} data-coruja-path="global.brand.logoUrl" data-coruja-image-path="global.brand.logoUrl" data-coruja-alt-path="global.brand.logoAlt" />
            ) : (
              <span className="brand-fallback"><Zap size={22} /> <strong data-coruja-path="global.brand.name">{brand}</strong></span>
            )}
          </Link>
          <nav className={`nav ${open ? "is-open" : ""}`} aria-label="Menu principal">
            {menu.map(({ item, originalIndex }) => (
              <NavLink
                key={`${item.path}-${item.label}`}
                to={item.path}
                target={item.target === "_blank" ? "_blank" : undefined}
                onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? "active" : "")}
                data-coruja-item-index={originalIndex}
                data-coruja-text-path={`global.menu.items.${originalIndex}.label`}
                data-coruja-url-path={`global.menu.items.${originalIndex}.path`}
              >
                <span data-coruja-path={`global.menu.items.${originalIndex}.label`}>{item.label}</span>
              </NavLink>
            ))}
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary nav-cta"
              data-coruja-path="global.actions.quoteLabel"
              data-coruja-event="whatsapp_click"
              data-coruja-event-label="header-whatsapp"
              data-coruja-text-path="global.actions.quoteLabel"
              data-coruja-url-path="global.brand.whatsapp"
              data-coruja-message-path="global.contact.whatsappMessage"
            >
              <span data-coruja-path="global.actions.quoteLabel">{quoteLabel}</span>
            </a>
          </nav>
          <button className="menu-button" type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? "Fechar menu" : "Abrir menu"}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
    </>
  );
}
