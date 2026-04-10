import { useEffect, useState } from "react";

export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const ms = typeof delay === "number" && delay >= 0 ? delay : 300;
    const id = setTimeout(() => setDebouncedValue(value), ms);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debouncedValue;
}
