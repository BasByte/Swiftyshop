"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import { Star } from "lucide-react";

interface ProductFiltersProps {
  categories: string[];
  dict: any;
}

export default function ProductFilters({ categories, dict }: ProductFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const updateFilter = (name: string, value: string) => {
    router.push(pathname + "?" + createQueryString(name, value), { scroll: false });
  };

  const currentCategory = searchParams.get("category") || "All";
  const inStock = searchParams.get("inStock") || "";
  const minRating = searchParams.get("minRating") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  return (
    <div className="w-full md:w-64 shrink-0 space-y-8 bg-white p-6 rounded-3xl border border-slate-200">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">{dict.products.categories}</h3>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateFilter("category", cat === "All" ? "" : cat)}
              className={`text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentCategory === cat
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
              }`}
            >
              {cat === 'All' ? dict.products.any : cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">{dict.products.priceRange}</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => updateFilter("minPrice", e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 font-medium outline-none"
          />
          <span className="text-slate-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 font-medium outline-none"
          />
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">{dict.products.availability}</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="inStock"
              checked={inStock === ""}
              onChange={() => updateFilter("inStock", "")}
              className="text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-slate-700">{dict.products.any}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="inStock"
              checked={inStock === "true"}
              onChange={() => updateFilter("inStock", "true")}
              className="text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-slate-700">{dict.products.inStock}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="inStock"
              checked={inStock === "false"}
              onChange={() => updateFilter("inStock", "false")}
              className="text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-slate-700">{dict.products.outOfStock}</span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">{dict.products.minRating}</h3>
        <div className="flex flex-col gap-2">
           {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => updateFilter("minRating", minRating === rating.toString() ? "" : rating.toString())}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                minRating === rating.toString() ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50 text-slate-600"
              }`}
            >
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}`}
                  />
                ))}
              </div>
              <span className="font-semibold">{dict.products.andUp}</span>
            </button>
           ))}
        </div>
      </div>
    </div>
  );
}
