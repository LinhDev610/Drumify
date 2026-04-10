import { useMemo } from "react";

/**
 * Client-side search / status / date filtering with null-safe field access.
 * @param {unknown} data
 * @param {object} [options]
 */
export function useSearchAndFilter(data = [], options = {}) {
  const {
    searchQuery = "",
    statusFilter = "all",
    dateFilter = "",
    searchFields = ["name", "title"],
    statusField = "status",
    statusMap = {
      pending: "Chờ duyệt",
      approved: "Đã duyệt",
      rejected: "Từ chối",
    },
  } = options;

  const filtered = useMemo(() => {
    const list = Array.isArray(data) ? data : [];

    return list.filter((item) => {
      if (item == null || typeof item !== "object") return false;

      const byStatus =
        statusFilter === "all" ||
        (statusFilter &&
          item[statusField] != null &&
          item[statusField] === statusMap[statusFilter]);

      const q = typeof searchQuery === "string" ? searchQuery.trim().toLowerCase() : "";
      const byKeyword =
        !q ||
        searchFields.some((field) => {
          const fieldValue = item[field];
          if (fieldValue == null) return false;
          return String(fieldValue).toLowerCase().includes(q);
        });

      let byDate = true;
      if (dateFilter && typeof dateFilter === "string") {
        const parseMmDdYyyy = (str) => {
          if (!str || typeof str !== "string") return null;
          const parts = str.split("/");
          if (parts.length !== 3) return null;
          const [mm, dd, yyyy] = parts;
          const m = parseInt(mm, 10);
          const d = parseInt(dd, 10);
          const y = parseInt(yyyy, 10);
          if (!m || !d || !y) return null;
          const dt = new Date(y, m - 1, d);
          if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
          return dt;
        };

        const filterDate = parseMmDdYyyy(dateFilter);
        if (filterDate) {
          const getItemDate = () => {
            if (item.createdAt) {
              return new Date(item.createdAt);
            }
            if (item.date) {
              const segs = String(item.date).split("/");
              if (segs.length === 3) {
                const [a, b, c] = segs;
                const first = parseInt(a, 10);
                const second = parseInt(b, 10);
                if (first > 12) {
                  return new Date(parseInt(c, 10), second - 1, first);
                }
                return new Date(parseInt(c, 10), first - 1, second);
              }
            }
            if (item.createDate) {
              const segs = String(item.createDate).split("/");
              if (segs.length === 3) {
                const [dd, mm, yyyy] = segs;
                return new Date(parseInt(yyyy, 10), parseInt(mm, 10) - 1, parseInt(dd, 10));
              }
            }
            return null;
          };

          const itemDate = getItemDate();
          if (itemDate && !Number.isNaN(itemDate.getTime())) {
            byDate =
              itemDate.getFullYear() === filterDate.getFullYear() &&
              itemDate.getMonth() === filterDate.getMonth() &&
              itemDate.getDate() === filterDate.getDate();
          } else {
            byDate = true;
          }
        }
      }

      return Boolean(byStatus && byKeyword && byDate);
    });
  }, [data, searchQuery, statusFilter, dateFilter, searchFields, statusField, statusMap]);

  return filtered;
}

export default useSearchAndFilter;
