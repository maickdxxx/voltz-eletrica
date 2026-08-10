import { ArrowRight, CheckCircle2, MessageCircle, ShieldCheck, Sparkles, Target, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { useCollection, useContent, useWhatsAppUrl } from "../coruja-template/content";
import { withCorujaBasePath } from "../lib/coruja-preview";

type ValueItem = { title: string; text: string };
const icons = [ShieldCheck, Sparkles, Wrench, Target];

export function AboutPage() {
  const values = useCollection<ValueItem>("pages.about.values.items");
  const storyChecks = useCollection<string>("pages.about.story.checks");
  const whatsapp = useWhatsAppUrl();
  const quoteLabel = useContent<string>("global.actions.quoteLabel", "");
  const servicesLabel = useContent<string>("global.actions.servicesLabel", "");
  const whatsappLabel = useContent<string>("global.actions.whatsappLabel", "");
  return (
    <>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <div>
            <span className="eyebrow eyebrow-dark" data-coruja-path="pages.about.hero.eyebrow">{useContent("pages.about.hero.eyebrow")}</span>
            <h1 data-coruja-path="pages.about.hero.title">{useContent("pages.about.hero.title")}</h1>
            <p data-coruja-path="pages.about.hero.subtitle">{useContent("pages.about.hero.subtitle")}</p>
            <div className="page-hero-actions">
              <a href={whatsapp} target="_blank" rel="noreferrer" className="btn btn-primary btn-lg" data-coruja-path="global.actions.quoteLabel" data-coruja-text-path="global.actions.quoteLabel" data-coruja-url-path="global.brand.whatsapp" data-coruja-event="whatsapp_click" data-coruja-event-label="about-hero-whatsapp"><MessageCircle size={19} /><span data-coruja-path="global.actions.quoteLabel">{quoteLabel}</span></a>
              <Link to="/servicos" className="btn btn-ghost btn-lg"><span data-coruja-path="global.actions.servicesLabel">{servicesLabel}</span> <ArrowRight size={18} /></Link>
            </div>
          </div>
          <div className="page-hero-image">
            <img src={withCorujaBasePath(useContent("pages.about.hero.imageUrl"))} alt={useContent("pages.about.hero.imageAlt")} data-coruja-path="pages.about.hero.imageUrl" data-coruja-image-path="pages.about.hero.imageUrl" data-coruja-alt-path="pages.about.hero.imageAlt" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container narrow-copy">
          <span className="eyebrow" data-coruja-path="pages.about.story.eyebrow">{useContent("pages.about.story.eyebrow")}</span>
          <h2 data-coruja-path="pages.about.story.title">{useContent("pages.about.story.title")}</h2>
          <p className="lead" data-coruja-path="pages.about.story.text">{useContent("pages.about.story.text")}</p>
          <div className="story-checks">
            {storyChecks.map((item, index) => <span key={`${item}-${index}`}><CheckCircle2 /><span data-coruja-path={`pages.about.story.checks.${index}`}>{item}</span></span>)}
          </div>
        </div>
      </section>

      <section className="section values-section">
        <div className="container">
          <div className="section-heading center"><span className="eyebrow" data-coruja-path="pages.about.values.eyebrow">{useContent("pages.about.values.eyebrow")}</span><h2 data-coruja-path="pages.about.values.title">{useContent("pages.about.values.title")}</h2></div>
          <div className="values-grid">
            {values.map((item, index) => {
              const Icon = icons[index % icons.length];
              return (
                <article className="value-card" key={`${item.title}-${index}`} data-coruja-item-index={index}>
                  <div className="value-icon"><Icon /></div>
                  <h3 data-coruja-path={`pages.about.values.items.${index}.title`}>{item.title}</h3>
                  <p data-coruja-path={`pages.about.values.items.${index}.text`}>{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container final-cta-card compact">
          <div><span className="eyebrow eyebrow-dark" data-coruja-path="pages.about.closing.eyebrow">{useContent("pages.about.closing.eyebrow")}</span><h2 data-coruja-path="pages.about.closing.title">{useContent("pages.about.closing.title")}</h2><p data-coruja-path="pages.about.closing.text">{useContent("pages.about.closing.text")}</p></div>
          <a href={whatsapp} target="_blank" rel="noreferrer" className="btn btn-light btn-lg" data-coruja-path="global.actions.whatsappLabel" data-coruja-text-path="global.actions.whatsappLabel" data-coruja-url-path="global.brand.whatsapp" data-coruja-event="whatsapp_click" data-coruja-event-label="about-closing-whatsapp"><MessageCircle size={19} /><span data-coruja-path="global.actions.whatsappLabel">{whatsappLabel}</span></a>
        </div>
      </section>
    </>
  );
}
