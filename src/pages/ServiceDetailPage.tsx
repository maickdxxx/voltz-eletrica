import { ArrowLeft, CheckCircle2, MessageCircle, ShieldCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ServiceIcon } from "../components/ServiceIcon";
import { type Service } from "../components/ServiceCard";
import { useCollection, useContent, useWhatsAppUrl } from "../coruja-template/content";
import { withCorujaBasePath } from "../lib/coruja-preview";

export function ServiceDetailPage() {
  const { slug = "" } = useParams();
  const services = useCollection<Service>("collections.services");
  const index = services.findIndex((item) => item.slug === slug && item.active !== false);
  const service = index >= 0 ? services[index] : undefined;
  const whatsapp = useWhatsAppUrl();
  const quoteLabel = useContent<string>("global.actions.quoteLabel", "");
  const includedEyebrow = useContent<string>("pages.services.detail.includedEyebrow", "");
  const includedTitle = useContent<string>("pages.services.detail.includedTitle", "");
  const includedText = useContent<string>("pages.services.detail.includedText", "");
  const safetyTitle = useContent<string>("pages.services.detail.safetyTitle", "");
  const safetyText = useContent<string>("pages.services.detail.safetyText", "");
  const finalEyebrow = useContent<string>("pages.services.detail.finalEyebrow", "");
  const finalText = useContent<string>("pages.services.detail.finalText", "");
  const finalTitleTemplate = useContent<string>("pages.services.detail.finalTitleTemplate", "");

  if (!service) {
    return (
      <section className="section not-found"><div className="container"><span className="eyebrow">SERVIÇO</span><h1>Serviço não encontrado</h1><p>Este serviço pode ter sido removido ou teve o endereço alterado.</p><Link to="/servicos" className="btn btn-secondary"><ArrowLeft size={18} />Voltar aos serviços</Link></div></section>
    );
  }

  const base = `collections.services.${index}`;
  return (
    <>
      <section className="service-detail-hero">
        <div className="container service-detail-grid" data-coruja-collection="services" data-coruja-item-id={service.id || service.slug} data-coruja-item-index={index}>
          <div>
            <Link to="/servicos" className="back-link"><ArrowLeft size={17} />Todos os serviços</Link>
            <div className="service-detail-icon"><ServiceIcon icon={service.icon} size={32} /></div>
            <h1 data-coruja-path={`${base}.title`}>{service.title}</h1>
            <p data-coruja-path={`${base}.description`}>{service.description}</p>
            <div className="service-detail-actions">
              <a href={whatsapp} target="_blank" rel="noreferrer" className="btn btn-primary btn-lg" data-coruja-path={`${base}.cta.label`} data-coruja-text-path={`${base}.cta.label`} data-coruja-url-path="global.brand.whatsapp" data-coruja-event="whatsapp_click" data-coruja-event-label="service-detail-whatsapp"><MessageCircle size={19} /><span data-coruja-path={`${base}.cta.label`}>{service.cta?.label || quoteLabel}</span></a>
            </div>
          </div>
          <div className="service-detail-media">
            <img src={withCorujaBasePath(service.imageUrl || "")} alt={service.imageAlt || service.title} data-coruja-path={`${base}.imageUrl`} data-coruja-image-path={`${base}.imageUrl`} data-coruja-alt-path={`${base}.imageAlt`} />
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container service-detail-content">
          <div>
            <span className="eyebrow" data-coruja-path="pages.services.detail.includedEyebrow">{includedEyebrow}</span>
            <h2 data-coruja-path="pages.services.detail.includedTitle">{includedTitle}</h2>
            <p data-coruja-path="pages.services.detail.includedText">{includedText}</p>
          </div>
          <div className="highlights-list">
            {(service.highlights || []).map((highlight, highlightIndex) => <span key={`${highlight}-${highlightIndex}`}><CheckCircle2 /><span data-coruja-path={`${base}.highlights.${highlightIndex}`}>{highlight}</span></span>)}
          </div>
        </div>
      </section>
      <section className="service-safety-strip">
        <div className="container"><ShieldCheck /><div><strong data-coruja-path="pages.services.detail.safetyTitle">{safetyTitle}</strong><span data-coruja-path="pages.services.detail.safetyText">{safetyText}</span></div></div>
      </section>
      <section className="section"><div className="container final-cta-card compact"><div><span className="eyebrow eyebrow-dark" data-coruja-path="pages.services.detail.finalEyebrow">{finalEyebrow}</span><h2 data-coruja-path="pages.services.detail.finalTitleTemplate">{finalTitleTemplate.replace("{servico}", service.title.toLowerCase())}</h2><p data-coruja-path="pages.services.detail.finalText">{finalText}</p></div><a href={whatsapp} target="_blank" rel="noreferrer" className="btn btn-light btn-lg" data-coruja-path="global.actions.quoteLabel" data-coruja-text-path="global.actions.quoteLabel" data-coruja-url-path="global.brand.whatsapp" data-coruja-event="whatsapp_click" data-coruja-event-label="service-closing-whatsapp"><MessageCircle size={19} /><span data-coruja-path="global.actions.quoteLabel">{quoteLabel}</span></a></div></section>
    </>
  );
}
