import { useCallback, useEffect, useMemo, useState } from "react";
import httpClient from "../configurations/httpCient";
import { CONFIG } from "../configurations/configuration";
import { API_ENDPOINTS } from "../configurations/apiEndpoints";
import { unwrapList, getErrorMessage } from "./utils/unwrapApiResponse";
import { normalizeMediaUrl } from "./utils/normalizeMediaUrl";
import { getBearerHeaders } from "./utils/authHeaders";

const bannersCache = {
  data: null,
  timestamp: null,
  TTL: 10 * 60 * 1000,
};

/**
 * Active banners (Drumify {@code Banner} entity shape).
 * @param {{ skipCache?: boolean, requireAuth?: boolean }} [options]
 */
export function useBanners(options = {}) {
  const { skipCache = false, requireAuth = false } = options;
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);
  const apiBase = CONFIG.API_GATEWAY ?? "";

  useEffect(() => {
    let canceled = false;

    const now = Date.now();
    if (
      !skipCache &&
      bannersCache.data &&
      bannersCache.timestamp != null &&
      now - bannersCache.timestamp < bannersCache.TTL
    ) {
      setBanners(Array.isArray(bannersCache.data) ? bannersCache.data : []);
      setLoading(false);
      setError(null);
      return undefined;
    }

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = { ...getBearerHeaders() };
        if (requireAuth && !headers.Authorization) {
          if (!canceled) {
            setBanners([]);
            setError("Sign in required.");
            setLoading(false);
          }
          return;
        }

        const resp = await httpClient.get(API_ENDPOINTS.BANNERS_ACTIVE, { headers });
        if (canceled) return;

        const raw = unwrapList(resp?.data);
        const normalized = raw
          .filter((b) => b != null && typeof b === "object")
          .filter((b) => b.imageUrl != null && String(b.imageUrl).trim() !== "")
          .map((b) => ({
            ...b,
            id: b.id != null ? String(b.id) : "",
            title: b.title != null ? String(b.title) : "",
            description: b.description != null ? String(b.description) : "",
            linkUrl: b.linkUrl != null ? String(b.linkUrl) : "",
            imageUrl: normalizeMediaUrl(b.imageUrl, apiBase),
            orderIndex: typeof b.orderIndex === "number" ? b.orderIndex : 0,
            contentType: b.contentType != null ? String(b.contentType) : null,
            status: b.status === true || b.status === false ? b.status : null,
          }))
          .filter((b) => b.id !== "");

        if (!skipCache) {
          bannersCache.data = normalized;
          bannersCache.timestamp = Date.now();
        }
        setBanners(normalized);
      } catch (e) {
        console.error("[useBanners]", e);
        if (!canceled) {
          setBanners([]);
          setError(getErrorMessage(e, "Could not load banners."));
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

  return { banners, loading, error, refetch };
}

/**
 * Group banners by {@code orderIndex} bands (same idea as LilaShop).
 * @param {unknown} allBanners
 */
export function useCategorizedBanners(allBanners) {
  return useMemo(() => {
    const list = Array.isArray(allBanners) ? allBanners.filter((b) => b != null) : [];

    const hero = list
      .filter((b) => (b.orderIndex ?? 0) < 100)
      .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
      .map((b) => b.imageUrl)
      .filter((u) => u != null && String(u).trim() !== "");

    const promo = list
      .filter((b) => {
        const idx = b.orderIndex ?? 0;
        return idx >= 100 && idx < 200;
      })
      .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
      .slice(0, 3)
      .map((b) => ({
        image: b.imageUrl || "",
        alt: b.title || "Promo banner",
        href: b.linkUrl || "#",
      }))
      .filter((p) => p.image);

    const bottom = list
      .filter((b) => {
        const idx = b.orderIndex ?? 0;
        return idx >= 200 && idx < 300;
      })
      .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
      .slice(0, 3)
      .map((b, idx) => ({
        image: b.imageUrl || "",
        alt: b.title || `Banner ${idx + 1}`,
        href: b.linkUrl || "#",
        variant: (idx % 3) + 1,
      }))
      .filter((b) => b.image);

    return { hero, promo, bottom };
  }, [allBanners]);
}
