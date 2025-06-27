import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export type FilterParams = {
  sortBy?: string;
  sortType?: string;
  search?: string;
  category?: string;
  brand?: string;
  color?: string[];
  size?: string[];
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
};

export const useFilterParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getMulti = (key: string) =>
    searchParams.get(key)?.split(",").filter(Boolean) || [];

  // đọc filter params từ URL
  const filters: FilterParams = {
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    color: getMulti("color"),
    size: getMulti("size"),
  };
  

  const toggleMulti = useCallback(
    (key: string, value: string) => {
      const current = getMulti(key);
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      const newParams = new URLSearchParams(searchParams.toString());
      if (updated.length > 0) {
        newParams.set(key, updated.join(","));
      } else {
        newParams.delete(key);
      }
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

   const setSingle = useCallback(
    (key: string, value: string | null) => {
      const newParams = new URLSearchParams(searchParams.toString());
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  // 5. Reset toàn bộ filter
  const resetFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  return {
    filters,
    toggleMulti,
    setSingle,
    resetFilters,
  };
};
