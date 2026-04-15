import httpClient from "../configurations/httpCient";
import { CONFIG } from "../configurations/configuration";
import { unwrapList, unwrapResult } from "../hooks/utils/unwrapApiResponse";

const BASE = `${CONFIG.API_GATEWAY}/warehouse`;
const LOCATION_BASE = `${CONFIG.API_GATEWAY}/location`;

export async function fetchWarehouseDashboard() {
  const { data } = await httpClient.get(`${BASE}/dashboard`);
  return unwrapResult(data);
}

export async function fetchInventory() {
  const { data } = await httpClient.get(`${BASE}/inventory`);
  return unwrapList(data);
}

export async function updateInventoryThreshold(inventoryId, lowStockThreshold) {
  const { data } = await httpClient.patch(`${BASE}/inventory/${inventoryId}/threshold`, {
    lowStockThreshold
  });
  return unwrapResult(data);
}

export async function fetchSuppliers() {
  const { data } = await httpClient.get(`${BASE}/suppliers`);
  return unwrapList(data);
}

export async function fetchCategories() {
  const { data } = await httpClient.get(`${BASE}/categories`);
  return unwrapList(data);
}

export async function createCategory(payload) {
  const { data } = await httpClient.post(`${BASE}/categories`, payload);
  return unwrapResult(data);
}

export async function updateCategory(id, payload) {
  const { data } = await httpClient.put(`${BASE}/categories/${id}`, payload);
  return unwrapResult(data);
}

export async function updateCategoryStatus(id, status) {
  const { data } = await httpClient.patch(`${BASE}/categories/${id}/status`, null, {
    params: { status }
  });
  return unwrapResult(data);
}

export async function fetchWarehouseProducts() {
  const { data } = await httpClient.get(`${BASE}/products`);
  return unwrapList(data);
}

export async function createWarehouseProduct(payload) {
  const { data } = await httpClient.post(`${BASE}/products`, payload);
  return unwrapResult(data);
}

export async function updateWarehouseProduct(id, payload) {
  const { data } = await httpClient.put(`${BASE}/products/${id}`, payload);
  return unwrapResult(data);
}

export async function deleteWarehouseProduct(id) {
  const { data } = await httpClient.delete(`${BASE}/products/${id}`);
  return unwrapResult(data);
}

export async function updateWarehouseProductStatus(id, status) {
  const { data } = await httpClient.patch(`${BASE}/products/${id}/status`, null, {
    params: { status }
  });
  return unwrapResult(data);
}

export async function createSupplier(payload) {
  const { data } = await httpClient.post(`${BASE}/suppliers`, payload);
  return unwrapResult(data);
}

export async function updateSupplier(id, payload) {
  const { data } = await httpClient.put(`${BASE}/suppliers/${id}`, payload);
  return unwrapResult(data);
}

export async function deleteSupplier(id) {
  await httpClient.delete(`${BASE}/suppliers/${id}`);
}

export async function importStock(payload) {
  const { data } = await httpClient.post(`${BASE}/stock/import`, payload);
  return unwrapResult(data);
}

export async function exportStock(payload) {
  const { data } = await httpClient.post(`${BASE}/stock/export`, payload);
  return unwrapResult(data);
}

export async function adjustStock(payload) {
  const { data } = await httpClient.post(`${BASE}/stock/adjust`, payload);
  return unwrapResult(data);
}

export async function fetchMovements(from, to) {
  const { data } = await httpClient.get(`${BASE}/movements`, {
    params: { from, to }
  });
  return unwrapList(data);
}

export async function fetchPackingOrders() {
  const { data } = await httpClient.get(`${BASE}/orders/packing`);
  return unwrapList(data);
}

export async function shipOrder(orderId) {
  const { data } = await httpClient.post(`${BASE}/orders/${orderId}/ship`);
  return unwrapResult(data);
}

export async function confirmOrder(orderId) {
  const { data } = await httpClient.post(`${BASE}/orders/${orderId}/confirm`);
  return unwrapResult(data);
}

export async function createShipmentOrder(orderId) {
  const { data } = await httpClient.post(`${LOCATION_BASE}/orders/${orderId}/shipments/create`);
  return unwrapResult(data);
}

export async function fetchShipments() {
  const { data } = await httpClient.get(`${LOCATION_BASE}/shipments`);
  return unwrapList(data);
}

export async function updateShipment(shipmentId, payload) {
  const { data } = await httpClient.patch(`${LOCATION_BASE}/shipments/${shipmentId}`, payload);
  return unwrapResult(data);
}

export async function syncShipmentByOrder(orderId) {
  const { data } = await httpClient.post(`${LOCATION_BASE}/shipments/sync/${orderId}`);
  return unwrapResult(data);
}

export async function cancelOrder(orderId) {
  const { data } = await httpClient.post(`${BASE}/orders/${orderId}/cancel`);
  return unwrapResult(data);
}

export async function fetchWarehouseReport(from, to) {
  const { data } = await httpClient.get(`${BASE}/reports/summary`, {
    params: { from, to }
  });
  return unwrapResult(data);
}
