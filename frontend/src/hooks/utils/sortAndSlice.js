function toSortableNumber(val) {
  if (val instanceof Date) return val.getTime();
  if (typeof val === "number" && !Number.isNaN(val)) return val;
  if (typeof val === "string" && val) {
    const t = Date.parse(val);
    return Number.isNaN(t) ? 0 : t;
  }
  return 0;
}

/**
 * @template T
 * @param {T[]|null|undefined} items
 * @param {(item: T) => number|string|Date|null|undefined} accessor
 * @param {number} [limit=10]
 * @returns {T[]}
 */
export function sortAndSlice(items, accessor, limit = 10) {
  const list = Array.isArray(items) ? items.filter((x) => x != null) : [];
  if (!list.length) return [];
  const lim = Math.max(0, Math.min(Number(limit) || 10, list.length));
  return [...list]
    .sort((a, b) => {
      const aVal = toSortableNumber(accessor(a));
      const bVal = toSortableNumber(accessor(b));
      return bVal - aVal;
    })
    .slice(0, lim);
}
