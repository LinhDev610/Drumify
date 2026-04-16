import httpClient from "../configurations/httpCient";

const BASE = "/cart";

export async function getCart() {
  const { data } = await httpClient.get(BASE);
  return data.result;
}

export async function addItemToCart(variantId, quantity) {
  const { data } = await httpClient.post(`${BASE}/items`, null, {
    params: { variantId, quantity },
  });
  return data.result;
}

export async function updateCartItemQuantity(itemId, quantity) {
  const { data } = await httpClient.put(`${BASE}/items/${itemId}`, null, {
    params: { quantity },
  });
  return data.result;
}

export async function removeCartItem(itemId) {
  const { data } = await httpClient.delete(`${BASE}/items/${itemId}`);
  return data.result;
}
