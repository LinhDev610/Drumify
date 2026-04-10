import keycloak from "../../keycloak";

/** Optional Bearer for Drumify gateway (Keycloak token). */
export function getBearerHeaders() {
  const token = keycloak?.token;
  if (typeof token !== "string" || !token) return {};
  return { Authorization: `Bearer ${token}` };
}
