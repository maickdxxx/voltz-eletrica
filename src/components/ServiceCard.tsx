import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ServiceIcon } from "./ServiceIcon";

export type Service = {
  id?: string;
  slug: string;
  title: string;
  shortDescription?: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  imageAlt?: string;
  highlights?: string[];
  active?: boolean;
  order?: number;
  cta?: { label?: string; href?: string };
  seo?: { title?: string; description?: string; ogImageUrl?: string; ogImageAlt?: string };
};

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const base = `collections.services.${index}`;
  return (
    <article className="service-card" data-coruja-collection="services" data-coruja-item-id={service.id || service.slug} data-coruja-item-index={index}>
      <div className="service-icon"><ServiceIcon icon={service.icon} /></div>
      <div>
        <h3 data-coruja-path={`${base}.title`}>{service.title}</h3>
        <p data-coruja-path={`${base}.shortDescription`}>{service.shortDescription}</p>
      </div>
      <Link to={`/servicos/${service.slug}`} className="service-link" aria-label={`Ver ${service.title}`}>
        Ver detalhes <ArrowUpRight size={18} />
      </Link>
    </article>
  );
}
