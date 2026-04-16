import httpClient from "../configurations/httpCient";

const BASE = "/orders";

export async function placeOrder(orderData) {
  const { data } = await httpClient.post(`${BASE}/checkout`, orderData);
  return data.result;
}

export async function getMyOrders() {
    const { data } = await httpClient.get(`${BASE}/my-orders`);
    return data.result;
}
