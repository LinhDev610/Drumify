import httpClient from "../configurations/httpCient";
import { unwrapList } from "../hooks/utils/unwrapApiResponse";

const BASE = "/store";

export async function fetchStoreProducts() {
  const { data } = await httpClient.get(`${BASE}/products`);
  return unwrapList(data);
}

export async function fetchStoreCategories() {
  const { data } = await httpClient.get(`${BASE}/categories`);
  return unwrapList(data);
}

export async function fetchStoreBanners() {
  const { data } = await httpClient.get(`${BASE}/banners`);
  return unwrapList(data);
}

export async function fetchStoreProductBySlug(slug) {
  const { data } = await httpClient.get(`${BASE}/products/${slug}`);
  return data.result;
}
