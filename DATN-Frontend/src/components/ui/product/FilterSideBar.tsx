// src/components/product/FilterSidebar.tsx
import React, { useEffect, useState } from "react";
import { useFilterParams } from "../../../hooks/useFilterParams";
import { useAppSelector } from "../../../redux/hook";

const sizes = ["S", "M", "L", "XL", "2XL", "3XL"];
const colors = ["BE", "Xanh", "Đen", "Trắng"];
const category = ["ao-nam", "nu", "Đồ đôi", "Trẻ em"];
type Category = {
  id: number;
  name: string;
  slug: string | null | undefined;
  children?: Category[];
};

type Color = {
  colorName: string | null;
  colorHex: string | null;
};

type FilterProps = {
  size: string[];
  color: Color[];
  maxPrice: string;
};
const FilterSidebar = () => {
  const { filters, toggleMulti, setSingle, resetFilters } = useFilterParams();
  const data = useAppSelector((state) => state.category);
  // console.log(data);

  const [filterOptions, setFilterOptions] = useState<FilterProps>({
    
    size: [],
    color: [],
    maxPrice: "0",
  });

  useEffect(() => {
    fetch("http://localhost:3000/api/product/props")
      .then((res) => res.json())
      .then((data) => {
        setFilterOptions(data.data);
        // console.log("filterOptions", data.data);
      });
  }, []);

  function findChildrenBySlug(
    categories: any,
    targetSlug: string | null
  ): any | null {
    for (const category of categories) {
      if (category.slug === targetSlug) {
        return category.children && category.children.length > 0
          ? category.children
          : null;
      }

      if (category.children && category.children.length > 0) {
        const result = findChildrenBySlug(category.children, targetSlug);
        if (result !== null) return result;
      }
    }

    return null;
  }

  const result = findChildrenBySlug(data.categories, filters.category ?? null);
  // console.log("result", result);
  return (
    <aside className="bg-slate-200 p-4 rounded shadow">
      <div className="mb-4">
        {result && <h3 className="font-semibold">Danh mục</h3>}
        {result?.map((g: any) => (
          <div key={g.id}>
            <label>
              <input
                type="radio"
                name="category"
                value={g.slug}
                checked={filters.category === g.slug}
                onChange={() => setSingle("category", g.slug)}
              />
              <span className="ml-2">{g.name}</span>
            </label>
          </div>
        ))}
      </div>

      {/* Size */}
      <div className="mb-4">
        <h3 className="font-semibold">Size</h3>
        <div className="grid grid-cols-2 gap-2">
          {filterOptions.size.map((s) => (
            <div key={s}>
              <label>
                <input
                  type="checkbox"
                  checked={filters.size?.includes(s)}
                  onChange={() => toggleMulti("size", s)}
                />
                <span className="ml-2">{s}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Màu sắc */}
      <div className="mb-4">
        <h3 className="font-semibold">Màu sắc</h3>
        {filterOptions.color
          .filter((c) => c.colorName) // bỏ null
          .map((c, index) => (
            <div key={index}>
              <label>
                <input
                  type="checkbox"
                  checked={filters.color?.includes(c.colorName!)}
                  onChange={() => toggleMulti("color", c.colorName!)}
                />
                <span className="ml-2">{c.colorName}</span>
              </label>
            </div>
          ))}
      </div>

      <button onClick={resetFilters} className="mt-4 text-red-500 underline">
        Xoá tất cả
      </button>
    </aside>
  );
};

export default FilterSidebar;
