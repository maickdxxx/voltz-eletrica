import { ArrowRight, MessageCircle } from "lucide-react";
import { ServiceCard, type Service } from "../components/ServiceCard";
import { useCollection, useContent, useWhatsAppUrl } from "../coruja-template/content";

export function ServicesPage() {
  const services = useCollection<Service>("collections.services")
    .map((service, originalIndex) => ({ service, originalIndex }))
    .filter(({ service }) => service.active !== false)
    .sort((a, b) => Number(a.service.order ?? 0) - Number(b.service.order ?? 0));
  const whatsapp = useWhatsAppUrl();
  const whatsappLabel = useContent<string>("global.actions.whatsappLabel", "");
  return (
    <>
      <section className="page-hero simple-page-hero">
        <div className="container page-hero-simple-copy">
          <span className="eyebrow eyebrow-dark" data-coruja-path="pages.services.hero.eyebrow">{useContent("pages.services.hero.eyebrow")}</span>
          <h1 data-coruja-path="pages.services.hero.title">{useContent("pages.services.hero.title")}</h1>
          <p data-coruja-path="pages.services.hero.subtitle">{useContent("pages.services.hero.subtitle")}</p>
        </div>
      </section>
      <section className="section services-page-section">
        <div className="container">
          <div className="services-intro">
            <div><span className="eyebrow" data-coruja-path="pages.services.intro.eyebrow">{useContent("pages.services.intro.eyebrow")}</span><h2 data-coruja-path="pages.services.intro.title">{useContent("pages.services.intro.title")}</h2></div>
            <p data-coruja-path="pages.services.intro.text">{useContent("pages.services.intro.text")}</p>
          </div>
          <div className="services-grid services-grid-page">
            {services.map(({ service, originalIndex }) => <ServiceCard key={service.id || service.slug} service={service} index={originalIndex} />)}
          </div>
        </div>
      </section>
      <section className="section final-cta-section">
        <div className="container final-cta-card compact">
          <div><span className="eyebrow eyebrow-dark" data-coruja-path="pages.services.closing.eyebrow">{useContent("pages.services.closing.eyebrow")}</span><h2 data-coruja-path="pages.services.closing.title">{useContent("pages.services.closing.title")}</h2><p data-coruja-path="pages.services.closing.text">{useContent("pages.services.closing.text")}</p></div>
          <a href={whatsapp} target="_blank" rel="noreferrer" className="btn btn-light btn-lg" data-coruja-path="global.actions.whatsappLabel" data-coruja-text-path="global.actions.whatsappLabel" data-coruja-url-path="global.brand.whatsapp" data-coruja-event="whatsapp_click" data-coruja-event-label="services-closing-whatsapp"><MessageCircle size={19} /><span data-coruja-path="global.actions.whatsappLabel">{whatsappLabel}</span> <ArrowRight size={18} /></a>
        </div>
      </section>
    </>
  );
}
