import { useCallback, useEffect, useState } from "react";
import httpClient from "../configurations/httpCient";
import { CONFIG } from "../configurations/configuration";
import { API_ENDPOINTS } from "../configurations/apiEndpoints";
import { unwrapList, getErrorMessage } from "./utils/unwrapApiResponse";
import { mapProductToCard } from "./utils/mapProductToCard";
import { getBearerHeaders } from "./utils/authHeaders";

const ENDPOINT_MAP = {
  "/products": () => API_ENDPOINTS.PRODUCTS,
  "/products/active": () => API_ENDPOINTS.PRODUCTS_ACTIVE,
};

function resolveUrl(endpoint) {
  if (endpoint == null || endpoint === "") return API_ENDPOINTS.PRODUCTS;
  const key = String(endpoint);
  const mapped = ENDPOINT_MAP[key];
  return mapped ? mapped() : key.startsWith("/") ? key : `/${key}`;
}

/**
 * Fetch products from a Drumify list endpoint; maps to card rows.
 * @param {{ endpoint?: string, requireAuth?: boolean }} [opts]
 */
export function useProducts(opts = {}) {
  const { endpoint = API_ENDPOINTS.PRODUCTS, requireAuth = false } = opts;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);
  const apiBase = CONFIG.API_GATEWAY ?? "";

  useEffect(() => {
    let canceled = false;
    const url = resolveUrl(endpoint);

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = { ...getBearerHeaders() };
        if (requireAuth && !headers.Authorization) {
          if (!canceled) {
            setProducts([]);
            setError("Sign in required.");
            setLoading(false);
          }
          return;
        }

        const resp = await httpClient.get(url, { headers });
        if (canceled) return;

        const rawList = unwrapList(resp?.data);
        const mapped = rawList
          .map((p) => mapProductToCard(p, apiBase))
          .filter((row) => row != null);

        setProducts(mapped);
      } catch (err) {
        console.error("[useProducts]", err);
        if (!canceled) {
          setError(getErrorMessage(err, "Could not load products."));
          setProducts([]);
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    run();
    return () => {
      canceled = true;
    };
  }, [endpoint, requireAuth, version, apiBase]);

  return { products, loading, error, refetch };
}
