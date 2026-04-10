import { useCallback, useEffect, useState } from "react";
import httpClient from "../configurations/httpCient";
import { CONFIG } from "../configurations/configuration";
import { API_ENDPOINTS } from "../configurations/apiEndpoints";
import { unwrapList, getErrorMessage } from "./utils/unwrapApiResponse";
import { normalizeMediaUrl } from "./utils/normalizeMediaUrl";
import { getBearerHeaders } from "./utils/authHeaders";

const cache = {
  data: null,
  timestamp: null,
  TTL: 5 * 60 * 1000,
};

/**
 * Normalize voucher row for UI (Drumify {@code Voucher} fields).
 * @param {object} v
 * @param {string} apiBase
 */
function normalizeVoucher(v, apiBase) {
  if (v == null || typeof v !== "object") return null;
  const id = v.id != null ? String(v.id) : null;
  if (!id) return null;
  return {
    ...v,
    id,
    code: v.code != null ? String(v.code) : "",
    name: v.name != null ? String(v.name) : "",
    description: v.description != null ? String(v.description) : "",
    imageUrl: normalizeMediaUrl(v.imageUrl ?? "", apiBase),
    discountValue: v.discountValue != null ? Number(v.discountValue) : 0,
    discountValueType: v.discountValueType != null ? String(v.discountValueType) : "",
    minOrderValue: v.minOrderValue != null ? Number(v.minOrderValue) : null,
    maxOrderValue: v.maxOrderValue != null ? Number(v.maxOrderValue) : null,
    expiryDate: v.expiryDate ?? null,
    startDate: v.startDate ?? null,
    status: v.status != null ? String(v.status) : "",
  };
}

/**
 * Active vouchers for strips / checkout hints.
 * @param {number} [limit=6]
 * @param {{ skipCache?: boolean, requireAuth?: boolean }} [options]
 */
export function useVouchers(limit = 6, options = {}) {
  const { skipCache = false, requireAuth = false } = options;
  const safeLimit = Math.max(0, Number(limit) || 6);

  const [vouchers, setVouchers] = useState([]);
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
      cache.data &&
      cache.timestamp != null &&
      now - cache.timestamp < cache.TTL
    ) {
      const slice = Array.isArray(cache.data) ? cache.data.slice(0, safeLimit) : [];
      setVouchers(slice);
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
            setVouchers([]);
            setError("Sign in required.");
            setLoading(false);
          }
          return;
        }

        const resp = await httpClient.get(API_ENDPOINTS.VOUCHERS_ACTIVE, { headers });
        if (canceled) return;

        const raw = unwrapList(resp?.data);
        const normalized = raw
          .map((v) => normalizeVoucher(v, apiBase))
          .filter((row) => row != null);

        if (!skipCache) {
          cache.data = normalized;
          cache.timestamp = Date.now();
        }

        setVouchers(normalized.slice(0, safeLimit));
      } catch (e) {
        console.error("[useVouchers]", e);
        if (!canceled) {
          setVouchers([]);
          setError(getErrorMessage(e, "Could not load vouchers."));
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    run();
    return () => {
      canceled = true;
    };
  }, [apiBase, safeLimit, skipCache, requireAuth, version]);

  return { vouchers, loading, error, refetch };
}
