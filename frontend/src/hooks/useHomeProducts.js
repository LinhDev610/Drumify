import { useCallback, useEffect, useMemo, useState } from "react";
import httpClient from "../configurations/httpCient";
import { CONFIG } from "../configurations/configuration";
import { API_ENDPOINTS } from "../configurations/apiEndpoints";
import { PRODUCT_LIMITS, RATING_THRESHOLD } from "../constants/catalog";
import { unwrapList, getErrorMessage } from "./utils/unwrapApiResponse";
import { mapProductToCard } from "./utils/mapProductToCard";
import { sortAndSlice } from "./utils/sortAndSlice";
import { getBearerHeaders } from "./utils/authHeaders";

const productsCache = {
  data: null,
  timestamp: null,
  TTL: 5 * 60 * 1000,
};

/**
 * Active catalog products for home/list UIs — normalized to card rows.
 * @param {{ skipCache?: boolean, requireAuth?: boolean }} [options]
 */
export function useHomeProducts(options = {}) {
  const { skipCache = false, requireAuth = false } = options;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  const apiBase = CONFIG.API_GATEWAY ?? "";

  useEffect(() => {
    let canceled = false;

    const now = Date.now();
    if (
      !skipCache &&
      productsCache.data &&
      productsCache.timestamp != null &&
      now - productsCache.timestamp < productsCache.TTL
    ) {
      setProducts(Array.isArray(productsCache.data) ? productsCache.data : []);
      setLoading(false);
      setError("");
      return undefined;
    }

    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const headers = { ...getBearerHeaders() };
        if (requireAuth && !headers.Authorization) {
          if (!canceled) {
            setProducts([]);
            setError("Sign in required to load products.");
            setLoading(false);
          }
          return;
        }

        const resp = await httpClient.get(API_ENDPOINTS.PRODUCTS_ACTIVE, { headers });
        if (canceled) return;

        const rawList = unwrapList(resp?.data);
        const normalized = rawList
          .map((p) => mapProductToCard(p, apiBase))
          .filter((row) => row != null);

        if (!skipCache) {
          productsCache.data = normalized;
          productsCache.timestamp = Date.now();
        }
        setProducts(normalized);
      } catch (err) {
        console.error("[useHomeProducts]", err);
        if (!canceled) {
          setProducts([]);
          setError(getErrorMessage(err, "Could not load products."));
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    run();
    return () => {
      canceled = true;
    };
  }, [apiBase, skipCache, requireAuth, version]);

  return { products, loading, error, refetch };
}

/**
 * Derive home sections from normalized card products (null-safe).
 * @param {unknown} allProducts
 */
export function useCategorizedProducts(allProducts) {
  return useMemo(() => {
    const list = Array.isArray(allProducts) ? allProducts.filter((p) => p != null) : [];

    const promotional = sortAndSlice(
      list.filter((p) => (p.discount ?? 0) > 0),
      (p) => p.discount || 0,
      PRODUCT_LIMITS.PROMOTIONAL,
    );

    const favorite = sortAndSlice(
      list.filter((p) => (p.averageRating ?? 0) >= RATING_THRESHOLD),
      (p) => p.quantitySold || 0,
      PRODUCT_LIMITS.FAVORITE,
    );

    const bestSeller = sortAndSlice(list, (p) => p.quantitySold || 0, PRODUCT_LIMITS.BEST_SELLER);

    const newest = sortAndSlice(
      list,
      (p) => (p.updatedAt ? new Date(p.updatedAt).getTime() : 0),
      PRODUCT_LIMITS.NEWEST,
    );

    return { promotional, favorite, bestSeller, newest };
  }, [allProducts]);
}
