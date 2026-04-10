/**
 * Normalize list payloads from Drumify {@code ApiResponse<List<T>>}, raw arrays, or Spring {@code Page}.
 * @param {*} data - axios response.data or already-unwrapped body
 * @returns {unknown[]}
 */
export function unwrapList(data) {
  if (data == null) return [];
  if (Array.isArray(data)) return data;
  if (typeof data !== "object") return [];

  if (Array.isArray(data.result)) return data.result;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.content)) return data.content;
  if (Array.isArray(data.items)) return data.items;

  return [];
}

/**
 * Single-object {@code result} (or common aliases).
 * @param {*} data
 * @returns {unknown|null}
 */
export function unwrapResult(data) {
  if (data == null) return null;
  if (typeof data !== "object") return null;
  if (data.result !== undefined && data.result !== null) return data.result;
  if (data.data !== undefined && data.data !== null) return data.data;
  return null;
}

/**
 * @param {unknown} err - axios error or Error
 * @param {string} fallback
 */
export function getErrorMessage(err, fallback) {
  const body = err && typeof err === "object" && "response" in err ? err.response?.data : null;
  const msg = body && typeof body === "object" ? body.message : null;
  if (typeof msg === "string" && msg.trim()) return msg;
  if (err && typeof err.message === "string" && err.message.trim()) return err.message;
  return fallback;
}
