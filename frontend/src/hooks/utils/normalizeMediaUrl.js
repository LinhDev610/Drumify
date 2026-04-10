import { CONFIG } from "../../configurations/configuration";

/**
 * Resolve relative media paths against the API gateway base URL.
 * @param {string|null|undefined} url
 * @param {string} [baseUrl] - defaults to CONFIG.API_GATEWAY
 */
export function normalizeMediaUrl(url, baseUrl) {
  if (url == null || url === "") return "";
  const s = String(url).trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  const base = String(baseUrl ?? CONFIG.API_GATEWAY ?? "").replace(/\/$/, "");
  const path = s.startsWith("/") ? s : `/${s}`;
  return base ? `${base}${path}` : s;
}
