export function getCorujaPreviewBasePath(): string {
  if (typeof window === "undefined") return "";
  const value = (window as unknown as { __CORUJA_PREVIEW_BASE_PATH__?: string }).__CORUJA_PREVIEW_BASE_PATH__;
  if (!value || value === "/") return "";
  return value.replace(/\/+$/, "");
}

export function getCorujaPreviewBasename(): string | undefined {
  return getCorujaPreviewBasePath() || undefined;
}

export function withCorujaBasePath(href: string): string {
  const base = getCorujaPreviewBasePath();
  if (!href || !base) return href;
  if (/^https?:\/\//i.test(href)) return href;
  if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("https://wa.me/")) return href;
  if (href.startsWith("/#")) return `${base}${href}`;
  if (href.startsWith("/")) return `${base}${href}`;
  if (href.startsWith("#")) return `${base}/${href}`;
  return href;
}
