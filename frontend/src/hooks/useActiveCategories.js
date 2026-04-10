import { useCallback, useEffect, useMemo, useState } from "react";
import httpClient from "../configurations/httpCient";
import { API_ENDPOINTS } from "../configurations/apiEndpoints";
import { unwrapList, getErrorMessage } from "./utils/unwrapApiResponse";
import { getBearerHeaders } from "./utils/authHeaders";

function hasParent(cat) {
  if (cat == null || typeof cat !== "object") return false;
  if (cat.parentId != null) return true;
  const p = cat.parentCategory ?? cat.parent;
  return p != null && (p.id != null || typeof p === "string");
}

/**
 * Root categories for filters / CategoryGrid data sources.
 * @param {{ url?: string, allLabel?: string, requireAuth?: boolean, subscribeToUpdates?: boolean }} [options]
 */
export function useActiveCategories(options = {}) {
  const {
    url = API_ENDPOINTS.CATEGORIES_ACTIVE,
    allLabel = "All categories",
    requireAuth = false,
    subscribeToUpdates = false,
  } = options;

  const [selectOptions, setSelectOptions] = useState([{ value: "all", label: allLabel }]);
  const [rawCategories, setRawCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadSuccess, setLoadSuccess] = useState(false);
  const [version, setVersion] = useState(0);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = { ...getBearerHeaders() };
      if (requireAuth && !headers.Authorization) {
        setSelectOptions([{ value: "all", label: allLabel }]);
        setRawCategories([]);
        setError("Sign in required.");
        setLoadSuccess(false);
        return;
      }

      const resp = await httpClient.get(url, { headers });
      const list = unwrapList(resp?.data).filter((c) => c != null && typeof c === "object");

      const roots = list.filter((c) => !hasParent(c));

      const opts = [{ value: "all", label: allLabel }].concat(
        roots.map((c) => ({
          value: String(c.id ?? c.categoryId ?? ""),
          label: String(c.name ?? "Category"),
        })),
      );

      setSelectOptions(opts);
      setRawCategories(roots);
      setLoadSuccess(true);
    } catch (e) {
      console.error("[useActiveCategories]", e);
      setSelectOptions([{ value: "all", label: allLabel }]);
      setRawCategories([]);
      setError(getErrorMessage(e, "Could not load categories."));
      setLoadSuccess(false);
    } finally {
      setLoading(false);
    }
  }, [url, allLabel, requireAuth]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories, version]);

  useEffect(() => {
    if (!subscribeToUpdates || typeof window === "undefined") return undefined;

    const onCategoriesUpdated = () => {
      refetch();
      try {
        sessionStorage.removeItem("categories_dirty");
      } catch {
        /* ignore */
      }
    };

    window.addEventListener("categories-updated", onCategoriesUpdated);
    try {
      if (sessionStorage.getItem("categories_dirty") === "1") onCategoriesUpdated();
    } catch {
      /* ignore */
    }

    return () => window.removeEventListener("categories-updated", onCategoriesUpdated);
  }, [subscribeToUpdates, refetch]);

  const activeCategoryIdSet = useMemo(() => {
    const ids = rawCategories.map((c) => String(c.id ?? c.categoryId ?? "")).filter(Boolean);
    return new Set(ids);
  }, [rawCategories]);

  const activeCategoryNameSet = useMemo(() => {
    const names = rawCategories
      .map((c) => (c.name != null ? String(c.name).toLowerCase() : ""))
      .filter(Boolean);
    return new Set(names);
  }, [rawCategories]);

  return {
    categories: selectOptions,
    rawCategories,
    activeCategoryIdSet,
    activeCategoryNameSet,
    loading,
    error,
    loaded: loadSuccess,
    refetch,
  };
}
