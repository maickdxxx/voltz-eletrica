import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCollection, useContent } from "../coruja-template/content";
import { withCorujaBasePath } from "../lib/coruja-preview";

type Service = {
  slug?: string;
  title?: string;
  active?: boolean;
  seo?: { title?: string; description?: string; ogImageUrl?: string; ogImageAlt?: string; noindex?: boolean };
  imageUrl?: string;
  imageAlt?: string;
};

function setMeta(name: string, content: string, property = false) {
  const attr = property ? "property" : "name";
  let node = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attr, name);
    document.head.appendChild(node);
  }
  node.content = content;
}

function setCanonical(href: string) {
  let node = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!node) {
    node = document.createElement("link");
    node.rel = "canonical";
    document.head.appendChild(node);
  }
  node.href = href;
}

function absoluteUrl(path: string): string {
  if (!path) return "";
  try {
    return new URL(path, window.location.origin).href;
  } catch {
    return path;
  }
}

export function DynamicHead() {
  const location = useLocation();
  const services = useCollection<Service>("collections.services");
  const legacyDefaultTitle = useContent<string>("global.seo.defaultTitle", "");
  const legacyDefaultDescription = useContent<string>("global.seo.defaultDescription", "");
  const defaultTitle = useContent<string>("global.seo.title", legacyDefaultTitle);
  const defaultDescription = useContent<string>("global.seo.description", legacyDefaultDescription);
  const defaultOg = useContent<string>("global.seo.ogImageUrl", "");
  const favicon = useContent<string>("global.brand.faviconUrl", "");
  const indexingEnabled = useContent<boolean>("global.seo.indexingEnabled", true);
  const brandName = useContent<string>("global.brand.name", "");
  const phone = useContent<string>("global.brand.phone", "");
  const whatsapp = useContent<string>("global.brand.whatsapp", "");
  const email = useContent<string>("global.brand.email", "");
  const street = useContent<string>("global.brand.address.street", "");
  const number = useContent<string>("global.brand.address.number", "");
  const neighborhood = useContent<string>("global.brand.address.neighborhood", "");
  const city = useContent<string>("global.brand.address.city", "");
  const region = useContent<string>("global.brand.address.region", "");
  const postalCode = useContent<string>("global.brand.address.postalCode", "");
  const country = useContent<string>("global.brand.address.country", "");

  const pageId = location.pathname === "/sobre" ? "about" : location.pathname === "/servicos" ? "services" : location.pathname === "/contato" ? "contact" : "home";
  const serviceSlug = location.pathname.startsWith("/servicos/") ? decodeURIComponent(location.pathname.split("/").filter(Boolean)[1] ?? "") : "";
  const service = services.find((item) => item.slug === serviceSlug && item.active !== false);
  const pageTitle = useContent<string>(`pages.${pageId}.seo.title`, defaultTitle);
  const pageDescription = useContent<string>(`pages.${pageId}.seo.description`, defaultDescription);
  const pageOg = useContent<string>(`pages.${pageId}.seo.ogImageUrl`, defaultOg);
  const pageOgAlt = useContent<string>(`pages.${pageId}.seo.ogImageAlt`, brandName);
  const pageNoindex = useContent<boolean>(`pages.${pageId}.seo.noindex`, false);

  useEffect(() => {
    const title = service?.seo?.title || (service?.title ? `${service.title} | ${brandName}` : pageTitle || defaultTitle);
    const description = service?.seo?.description || pageDescription || defaultDescription;
    const og = absoluteUrl(
      withCorujaBasePath(service?.seo?.ogImageUrl || service?.imageUrl || pageOg || defaultOg),
    );
    const ogAlt = service?.seo?.ogImageAlt || service?.imageAlt || pageOgAlt || brandName;
    const knownStaticPath = ["/", "/sobre", "/servicos", "/contato"].includes(location.pathname);
    const knownPage = knownStaticPath || Boolean(service);
    const noindex = !indexingEnabled || pageNoindex || service?.seo?.noindex === true || !knownPage;
    const finalTitle = knownPage ? title : `Página não encontrada${brandName ? ` | ${brandName}` : ""}`;
    const finalDescription = knownPage ? description : "";
    document.title = finalTitle;
    setMeta("description", finalDescription);
    setMeta("og:title", finalTitle, true);
    setMeta("og:description", finalDescription, true);
    setMeta("og:type", "website", true);
    setMeta("og:image", og, true);
    setMeta("og:image:alt", ogAlt, true);
    const canonicalUrl = window.location.href.split(/[?#]/)[0];
    setMeta("og:url", canonicalUrl, true);
    setCanonical(canonicalUrl);
    setMeta("twitter:card", "summary_large_image");
    setMeta("robots", noindex ? "noindex,nofollow" : "index,follow");

    let icon = document.head.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!icon) {
      icon = document.createElement("link");
      icon.rel = "icon";
      document.head.appendChild(icon);
    }
    icon.href = withCorujaBasePath(favicon);

    const schema = {
      "@context": "https://schema.org",
      "@type": "Electrician",
      name: brandName,
      image: og,
      telephone: phone || whatsapp,
      email,
      address: {
        "@type": "PostalAddress",
        streetAddress: [street, number, neighborhood].filter(Boolean).join(", "),
        addressLocality: city,
        addressRegion: region,
        postalCode,
        addressCountry: country,
      },
      areaServed: city || undefined,
    };
    let script = document.head.querySelector<HTMLScriptElement>("#coruja-local-business-schema");
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "coruja-local-business-schema";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
  }, [
    brandName, city, country, defaultDescription, defaultOg, defaultTitle, email, favicon, indexingEnabled,
    location.pathname, neighborhood, number, pageDescription, pageNoindex, pageOg, pageOgAlt, pageTitle, phone, postalCode, region, service, street, whatsapp,
  ]);

  return null;
}
