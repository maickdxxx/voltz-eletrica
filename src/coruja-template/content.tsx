import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import defaultsJson from "./defaults.json";

type AnyObj = Record<string, any>;
type ContentSource = "inline" | "remote" | "defaults" | "none";
type CorujaState = { content: AnyObj; ready: boolean; loading: boolean; source: ContentSource };

export function getByPath<T = unknown>(obj: unknown, path: string): T | undefined {
  if (!obj || !path) return undefined;
  return path.split(".").reduce<any>((acc, key) => (acc == null ? acc : acc[key]), obj) as T | undefined;
}

function deepMerge(base: any, overlay: any): any {
  if (overlay === undefined || overlay === null) return base;
  if (Array.isArray(base) || Array.isArray(overlay)) return overlay;
  if (typeof base !== "object" || base === null || typeof overlay !== "object") return overlay;
  const out: AnyObj = { ...base };
  for (const key of Object.keys(overlay)) out[key] = key in base ? deepMerge(base[key], overlay[key]) : overlay[key];
  return out;
}

function unwrapContent(raw: any): AnyObj | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  if (raw.projectContent && typeof raw.projectContent === "object") return unwrapContent(raw.projectContent);
  if (raw.project_content && typeof raw.project_content === "object") return unwrapContent(raw.project_content);
  if (raw.siteContent && typeof raw.siteContent === "object") return unwrapContent(raw.siteContent);
  if (raw.site_content && typeof raw.site_content === "object") return unwrapContent(raw.site_content);
  if (raw.content && typeof raw.content === "object") return unwrapContent(raw.content);
  if (raw.data?.content && typeof raw.data.content === "object") return unwrapContent(raw.data.content);
  return raw as AnyObj;
}

function readInjectedContent(): AnyObj | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as { __CORUJA_CONTENT__?: AnyObj; __CORUJA_PROJECT_CONTENT__?: AnyObj; __CORUJA_SITE_CONTENT__?: AnyObj; __CORUJA_RUNTIME_PAYLOAD__?: AnyObj; __CORUJA__?: AnyObj };
  return unwrapContent(w.__CORUJA_CONTENT__) ?? unwrapContent(w.__CORUJA__?.content) ?? unwrapContent(w.__CORUJA__) ?? unwrapContent(w.__CORUJA_RUNTIME_PAYLOAD__) ?? unwrapContent(w.__CORUJA_PROJECT_CONTENT__) ?? unwrapContent(w.__CORUJA_SITE_CONTENT__);
}

function readEnv(key: string): string {
  try { return String((import.meta as unknown as { env?: Record<string, string | undefined> }).env?.[key] ?? "").trim(); } catch { return ""; }
}

function publicProjectId(): string { return readEnv("VITE_CORUJA_PROJECT_ID"); }
function apiBase(): string { return (readEnv("VITE_CORUJA_API_BASE") || "https://corujahost.com.br").replace(/\/$/, ""); }

async function fetchRemoteContent(projectId: string): Promise<AnyObj | undefined> {
  if (!projectId || typeof fetch === "undefined") return undefined;
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timer = controller ? window.setTimeout(() => controller.abort(), 8000) : null;
  try {
    const response = await fetch(`${apiBase()}/api/public/projects/${encodeURIComponent(projectId)}/content`, { method: "GET", headers: { accept: "application/json" }, signal: controller?.signal });
    if (!response.ok) return undefined;
    return unwrapContent(await response.json());
  } catch { return undefined; } finally { if (timer != null) window.clearTimeout(timer); }
}

function setByPath(target: AnyObj, path: string, value: unknown): AnyObj {
  const keys = path.split(".").filter(Boolean);
  if (!keys.length) return target;
  const out: AnyObj = Array.isArray(target) ? [...target] : { ...target };
  let cursor: any = out;
  for (let index = 0; index < keys.length - 1; index += 1) {
    const key = keys[index];
    const existing = cursor[key];
    cursor[key] = existing && typeof existing === "object" ? (Array.isArray(existing) ? [...existing] : { ...existing }) : {};
    cursor = cursor[key];
  }
  cursor[keys[keys.length - 1]] = value;
  return out;
}

function patchContent(current: AnyObj, detail: any): AnyObj {
  if (!detail || typeof detail !== "object") return current;
  if (detail.content && typeof detail.content === "object") return deepMerge(current, unwrapContent(detail.content) ?? detail.content);
  if (Array.isArray(detail.patches)) return detail.patches.reduce((next: AnyObj, patch: any) => (!patch || typeof patch.path !== "string" ? next : setByPath(next, patch.path, patch.value)), current);
  if (typeof detail.path === "string") return setByPath(current, detail.path, detail.value);
  return current;
}

function applyTheme(content: AnyObj) {
  if (typeof document === "undefined") return;
  const colors = getByPath<Record<string, string>>(content, "global.theme.colors") ?? {};
  const root = document.documentElement.style;
  const aliases: Record<string, string> = { primary: "--site-primary", secondary: "--site-secondary", accent: "--site-accent", background: "--site-background", surface: "--site-surface", text: "--site-text", muted: "--site-muted", dark: "--site-dark", whatsapp: "--site-whatsapp" };
  for (const [key, variable] of Object.entries(aliases)) { const value = colors[key]; if (typeof value === "string" && value.trim()) root.setProperty(variable, value.trim()); }
}

const CorujaContext = createContext<CorujaState>({ content: {}, ready: false, loading: true, source: "none" });

export function CorujaProvider({ children }: { children: ReactNode }) {
  const seed = useMemo<CorujaState>(() => {
    const injected = readInjectedContent();
    if (injected) return { content: deepMerge(defaultsJson, injected), ready: true, loading: false, source: "inline" };
    if (!publicProjectId()) return { content: defaultsJson as AnyObj, ready: true, loading: false, source: "defaults" };
    return { content: {}, ready: false, loading: true, source: "none" };
  }, []);
  const [state, setState] = useState<CorujaState>(seed);

  useEffect(() => { if (state.ready) applyTheme(state.content); }, [state.content, state.ready]);
  useEffect(() => {
    const projectId = publicProjectId();
    if (state.ready || !projectId) return;
    let cancelled = false;
    void fetchRemoteContent(projectId).then((remote) => {
      if (cancelled) return;
      if (remote) setState({ content: deepMerge(defaultsJson, remote), ready: true, loading: false, source: "remote" });
      else setState((current) => ({ ...current, loading: false }));
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const setFullContent = (raw: any) => { const next = unwrapContent(raw); if (next) setState({ content: deepMerge(defaultsJson, next), ready: true, loading: false, source: "inline" }); };
    const onPatch = (event: Event) => { const detail = (event as CustomEvent).detail ?? {}; setState((current) => ({ ...current, content: patchContent(current.content, detail) })); };
    const onContent = (event: Event) => { const detail = (event as CustomEvent).detail ?? {}; setFullContent(detail.content ?? detail); };
    const onMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== "object") return;
      const type = String(data.type ?? "");
      if (["CORUJA_PREVIEW_PATCH", "CORUJA_CONTENT_PATCH", "coruja:preview-patch"].includes(type)) { setState((current) => ({ ...current, content: patchContent(current.content, data) })); return; }
      if (["CORUJA_PREVIEW_CONTENT", "CORUJA_SET_CONTENT", "coruja:preview-content"].includes(type)) setFullContent(data.content ?? data.payload ?? data);
    };
    window.addEventListener("message", onMessage);
    window.addEventListener("coruja:preview-patch", onPatch as EventListener);
    window.addEventListener("coruja:preview-content", onContent as EventListener);
    window.addEventListener("CORUJA_PREVIEW_PATCH", onPatch as EventListener);
    window.addEventListener("CORUJA_CONTENT_PATCH", onPatch as EventListener);
    window.addEventListener("CORUJA_PREVIEW_CONTENT", onContent as EventListener);
    window.addEventListener("CORUJA_SET_CONTENT", onContent as EventListener);
    if (window.parent && window.parent !== window) window.parent.postMessage({ source: "coruja-site-preview", type: "CORUJA_EDITOR_READY" }, "*");
    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener("coruja:preview-patch", onPatch as EventListener);
      window.removeEventListener("coruja:preview-content", onContent as EventListener);
      window.removeEventListener("CORUJA_PREVIEW_PATCH", onPatch as EventListener);
      window.removeEventListener("CORUJA_CONTENT_PATCH", onPatch as EventListener);
      window.removeEventListener("CORUJA_PREVIEW_CONTENT", onContent as EventListener);
      window.removeEventListener("CORUJA_SET_CONTENT", onContent as EventListener);
    };
  }, []);

  return <CorujaContext.Provider value={state}>{children}</CorujaContext.Provider>;
}

export function CorujaContentGate({ children }: { children: ReactNode }) {
  const { ready } = useContext(CorujaContext);
  if (ready) return <>{children}</>;
  return <div aria-hidden="true" style={{ minHeight: "100vh", background: "#f4f6f8", padding: "24px" }}><div style={{ maxWidth: 1180, margin: "0 auto", height: 74, borderRadius: 18, background: "rgba(17,24,39,.06)" }} /><div style={{ maxWidth: 1180, margin: "24px auto 0", height: 460, borderRadius: 28, background: "rgba(17,24,39,.045)" }} /></div>;
}

export function useCoruja(): AnyObj { return useContext(CorujaContext).content; }
export function useCorujaReady(): boolean { return useContext(CorujaContext).ready; }

export function useContent<T = string>(path: string, fallback?: T): T {
  const { content, ready } = useContext(CorujaContext);
  if (!ready) { if (Array.isArray(fallback)) return fallback as T; if (typeof fallback === "string") return "" as T; return fallback as T; }
  const value = getByPath<T>(content, path);
  if (value !== undefined && value !== null && value !== "") return value;
  const fallbackValue = getByPath<T>(defaultsJson, path);
  return (fallbackValue !== undefined && fallbackValue !== null && fallbackValue !== "" ? fallbackValue : fallback) as T;
}

export function useCollection<T = AnyObj>(path: string): T[] { const value = useContent<T[]>(path, [] as T[]); return Array.isArray(value) ? value : []; }
export function normalizePhone(value: string): string { const digits = String(value ?? "").replace(/\D/g, ""); if (!digits) return ""; return digits.startsWith("55") ? digits : `55${digits}`; }
export function useWhatsAppUrl(message?: string): string { const raw = normalizePhone(useContent<string>("global.brand.whatsapp", "")); const defaultMessage = useContent<string>("global.contact.whatsappMessage", ""); if (!raw) return "#contato"; const text = message ?? defaultMessage; return `https://wa.me/${raw}${text ? `?text=${encodeURIComponent(text)}` : ""}`; }
