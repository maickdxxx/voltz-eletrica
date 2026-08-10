import { ArrowRight, Check, ChevronRight, CircleCheckBig, MessageCircle, ShieldCheck, Sparkles, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionHeading } from "../components/SectionHeading";
import { ServiceCard, type Service } from "../components/ServiceCard";
import { getByPath, useCollection, useCoruja, useWhatsAppUrl } from "../coruja-template/content";
import { withCorujaBasePath } from "../lib/coruja-preview";

type Testimonial = { id?: string; name: string; location?: string; quote: string; rating?: number | string; active?: boolean };
type Faq = { id?: string; question: string; answer: string; active?: boolean };
type Area = { id?: string; name: string; description?: string; active?: boolean };
type ProcessStep = { number: string; title: string; text: string };

export function HomePage() {
  const services = useCollection<Service>("collections.services")
    .map((service, originalIndex) => ({ service, originalIndex }))
    .filter(({ service }) => service.active !== false)
    .sort((a, b) => Number(a.service.order ?? 0) - Number(b.service.order ?? 0));
  const testimonials = useCollection<Testimonial>("collections.testimonials")
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter(({ item }) => item.active !== false);
  const faq = useCollection<Faq>("collections.faq")
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter(({ item }) => item.active !== false);
  const areas = useCollection<Area>("collections.serviceAreas")
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter(({ item }) => item.active !== false);
  const trust = useCollection<string>("pages.home.trust.items");
  const benefits = useCollection<string>("pages.home.about.benefits");
  const process = useCollection<ProcessStep>("pages.home.process.steps");
  const whatsapp = useWhatsAppUrl();
  const content = useCoruja();
  const text = (path: string, fallback = "") => getByPath<string>(content, path) ?? fallback;

  return (
    <>
      <section className="hero home-hero">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow eyebrow-dark" data-coruja-path="pages.home.hero.eyebrow">{text("pages.home.hero.eyebrow")}</span>
            <h1 data-coruja-path="pages.home.hero.title">{text("pages.home.hero.title")}</h1>
            <p className="hero-subtitle" data-coruja-path="pages.home.hero.subtitle">{text("pages.home.hero.subtitle")}</p>
            <div className="hero-actions">
              <a href={whatsapp} target="_blank" rel="noreferrer" className="btn btn-primary btn-lg" data-coruja-path="pages.home.hero.primaryCta.label" data-coruja-event="whatsapp_click" data-coruja-event-label="hero-whatsapp" data-coruja-text-path="pages.home.hero.primaryCta.label" data-coruja-url-path="global.brand.whatsapp" data-coruja-message-path="global.contact.whatsappMessage"><MessageCircle size={19} /><span data-coruja-path="pages.home.hero.primaryCta.label">{text("pages.home.hero.primaryCta.label")}</span></a>
              <a href={withCorujaBasePath(text("pages.home.hero.secondaryCta.href", "/servicos"))} className="btn btn-ghost btn-lg" data-coruja-path="pages.home.hero.secondaryCta.label" data-coruja-event="cta_click" data-coruja-event-label="hero-services" data-coruja-text-path="pages.home.hero.secondaryCta.label" data-coruja-url-path="pages.home.hero.secondaryCta.href"><span data-coruja-path="pages.home.hero.secondaryCta.label">{text("pages.home.hero.secondaryCta.label")}</span><ArrowRight size={19} /></a>
            </div>
            <div className="hero-mini-proof"><div className="proof-icon"><ShieldCheck size={22} /></div><div><strong data-coruja-path="pages.home.hero.proofTitle">{text("pages.home.hero.proofTitle")}</strong><span data-coruja-path="pages.home.hero.proofText">{text("pages.home.hero.proofText")}</span></div></div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-shell">
              <img src={withCorujaBasePath(text("pages.home.hero.imageUrl"))} alt={text("pages.home.hero.imageAlt")} data-coruja-path="pages.home.hero.imageUrl" data-coruja-image-path="pages.home.hero.imageUrl" data-coruja-alt-path="pages.home.hero.imageAlt" />
              <div className="hero-badge hero-badge-top"><Zap size={19} /><span><span data-coruja-path="pages.home.hero.badgeTopTitle">{text("pages.home.hero.badgeTopTitle")}</span><br /><strong data-coruja-path="pages.home.hero.badgeTopHighlight">{text("pages.home.hero.badgeTopHighlight")}</strong></span></div>
              <div className="hero-badge hero-badge-bottom"><CircleCheckBig size={19} /><span><span data-coruja-path="pages.home.hero.badgeBottomTitle">{text("pages.home.hero.badgeBottomTitle")}</span><br /><strong data-coruja-path="pages.home.hero.badgeBottomHighlight">{text("pages.home.hero.badgeBottomHighlight")}</strong></span></div>
            </div>
          </div>
        </div>
        <div className="container trust-row">{trust.map((item, index) => <span key={`${item}-${index}`}><Check size={16} /><span data-coruja-path={`pages.home.trust.items.${index}`}>{item}</span></span>)}</div>
      </section>

      <section className="section services-section"><div className="container"><SectionHeading eyebrow={text("pages.home.services.eyebrow")} title={text("pages.home.services.title")} text={text("pages.home.services.subtitle")} eyebrowPath="pages.home.services.eyebrow" titlePath="pages.home.services.title" textPath="pages.home.services.subtitle" /><div className="services-grid">{services.slice(0, 6).map(({ service, originalIndex }) => <ServiceCard key={service.id || service.slug} service={service} index={originalIndex} />)}</div><div className="center-action"><Link to="/servicos" className="text-link"><span data-coruja-path="pages.home.services.linkLabel">{text("pages.home.services.linkLabel")}</span> <ArrowRight size={18} /></Link></div></div></section>

      <section className="section about-split-section"><div className="container split-grid"><div className="media-card"><img src={withCorujaBasePath(text("pages.home.about.imageUrl"))} alt={text("pages.home.about.imageAlt")} data-coruja-path="pages.home.about.imageUrl" data-coruja-image-path="pages.home.about.imageUrl" data-coruja-alt-path="pages.home.about.imageAlt" /><div className="media-card-caption"><Sparkles size={20} /><span data-coruja-path="pages.home.about.highlight">{text("pages.home.about.highlight")}</span></div></div><div className="split-copy"><span className="eyebrow" data-coruja-path="pages.home.about.eyebrow">{text("pages.home.about.eyebrow")}</span><h2 data-coruja-path="pages.home.about.title">{text("pages.home.about.title")}</h2><p data-coruja-path="pages.home.about.text">{text("pages.home.about.text")}</p><div className="benefit-list">{benefits.map((item, index) => <span key={`${item}-${index}`}><CircleCheckBig /> <span data-coruja-path={`pages.home.about.benefits.${index}`}>{item}</span></span>)}</div><Link to="/sobre" className="btn btn-secondary"><span data-coruja-path="pages.home.about.linkLabel">{text("pages.home.about.linkLabel")}</span> <ArrowRight size={18} /></Link></div></div></section>

      <section className="emergency-band"><div className="container emergency-grid"><div><span className="eyebrow eyebrow-dark" data-coruja-path="pages.home.emergency.eyebrow">{text("pages.home.emergency.eyebrow")}</span><h2 data-coruja-path="pages.home.emergency.title">{text("pages.home.emergency.title")}</h2><p data-coruja-path="pages.home.emergency.text">{text("pages.home.emergency.text")}</p></div><a href={whatsapp} target="_blank" rel="noreferrer" className="btn btn-light btn-lg" data-coruja-path="pages.home.emergency.buttonLabel" data-coruja-event="whatsapp_click" data-coruja-event-label="home-emergency-whatsapp" data-coruja-text-path="pages.home.emergency.buttonLabel" data-coruja-url-path="global.brand.whatsapp"><MessageCircle size={19} /><span data-coruja-path="pages.home.emergency.buttonLabel">{text("pages.home.emergency.buttonLabel")}</span></a></div></section>

      <section className="section process-section"><div className="container"><SectionHeading eyebrow={text("pages.home.process.eyebrow")} title={text("pages.home.process.title")} eyebrowPath="pages.home.process.eyebrow" titlePath="pages.home.process.title" center /><div className="process-grid">{process.map((step, index) => <article className="process-card" key={`${step.number}-${step.title}`} data-coruja-item-index={index}><span className="process-number" data-coruja-path={`pages.home.process.steps.${index}.number`}>{step.number}</span><h3 data-coruja-path={`pages.home.process.steps.${index}.title`}>{step.title}</h3><p data-coruja-path={`pages.home.process.steps.${index}.text`}>{step.text}</p>{index < process.length - 1 && <ChevronRight className="process-arrow" />}</article>)}</div></div></section>

      {testimonials.length > 0 && <section className="section testimonials-section"><div className="container"><SectionHeading eyebrow={text("pages.home.testimonials.eyebrow")} title={text("pages.home.testimonials.title")} eyebrowPath="pages.home.testimonials.eyebrow" titlePath="pages.home.testimonials.title" center /><div className="testimonials-grid">{testimonials.map(({ item, originalIndex }) => <article className="testimonial-card" key={item.id || originalIndex} data-coruja-collection="testimonials" data-coruja-item-index={originalIndex}><div className="stars" aria-label={`${item.rating || 5} estrelas`}>{Array.from({ length: Math.min(5, Number(item.rating || 5)) }).map((_, star) => <Star key={star} size={17} fill="currentColor" />)}</div><blockquote data-coruja-path={`collections.testimonials.${originalIndex}.quote`}>“{item.quote}”</blockquote><div className="testimonial-person"><strong data-coruja-path={`collections.testimonials.${originalIndex}.name`}>{item.name}</strong><span data-coruja-path={`collections.testimonials.${originalIndex}.location`}>{item.location}</span></div></article>)}</div></div></section>}

      {faq.length > 0 && <section className="section faq-section"><div className="container faq-layout"><div><SectionHeading eyebrow={text("pages.home.faq.eyebrow")} title={text("pages.home.faq.title")} eyebrowPath="pages.home.faq.eyebrow" titlePath="pages.home.faq.title" /><p className="faq-support"><span data-coruja-path="pages.home.faq.supportText">{text("pages.home.faq.supportText")}</span> <a href={whatsapp} target="_blank" rel="noreferrer" data-coruja-path="pages.home.faq.supportLinkLabel" data-coruja-text-path="pages.home.faq.supportLinkLabel" data-coruja-url-path="global.brand.whatsapp" data-coruja-event="whatsapp_click" data-coruja-event-label="home-faq-whatsapp"><span data-coruja-path="pages.home.faq.supportLinkLabel">{text("pages.home.faq.supportLinkLabel")}</span></a></p></div><div className="faq-list">{faq.map(({ item, originalIndex }) => <details key={item.id || originalIndex} className="faq-item" data-coruja-collection="faq" data-coruja-item-index={originalIndex}><summary data-coruja-path={`collections.faq.${originalIndex}.question`}>{item.question}<span>+</span></summary><p data-coruja-path={`collections.faq.${originalIndex}.answer`}>{item.answer}</p></details>)}</div></div></section>}

      {areas.length > 0 && <section className="section areas-section"><div className="container"><SectionHeading eyebrow={text("pages.home.areas.eyebrow")} title={text("pages.home.areas.title")} text={text("pages.home.areas.subtitle")} eyebrowPath="pages.home.areas.eyebrow" titlePath="pages.home.areas.title" textPath="pages.home.areas.subtitle" center /><div className="areas-grid">{areas.map(({ item: area, originalIndex }) => <article key={area.id || originalIndex} className="area-card" data-coruja-collection="serviceAreas" data-coruja-item-index={originalIndex}><span className="area-dot" /><div><strong data-coruja-path={`collections.serviceAreas.${originalIndex}.name`}>{area.name}</strong><p data-coruja-path={`collections.serviceAreas.${originalIndex}.description`}>{area.description}</p></div></article>)}</div></div></section>}

      <section className="section final-cta-section"><div className="container final-cta-card"><div><span className="eyebrow eyebrow-dark" data-coruja-path="pages.home.closing.eyebrow">{text("pages.home.closing.eyebrow")}</span><h2 data-coruja-path="pages.home.closing.title">{text("pages.home.closing.title")}</h2><p data-coruja-path="pages.home.closing.text">{text("pages.home.closing.text")}</p></div><a href={whatsapp} target="_blank" rel="noreferrer" className="btn btn-light btn-lg" data-coruja-path="pages.home.closing.buttonLabel" data-coruja-event="whatsapp_click" data-coruja-event-label="home-closing-whatsapp" data-coruja-text-path="pages.home.closing.buttonLabel" data-coruja-url-path="global.brand.whatsapp"><MessageCircle size={20} /><span data-coruja-path="pages.home.closing.buttonLabel">{text("pages.home.closing.buttonLabel")}</span></a></div></section>
    </>
  );
}
