"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, SlidersHorizontal, Check } from "lucide-react";
import type { Product, Brand } from "@/types";
import ProductCard from "./ProductCard";
import BottomSheet from "./BottomSheet";
import { leadingPrice } from "@/lib/price";

type SortKey = "relevance" | "price-low" | "price-high" | "rating";
const SORT_LABEL: Record<SortKey, string> = {
  relevance: "Relevance",
  "price-low": "Price: Low to High",
  "price-high": "Price: High to Low",
  rating: "Brand Rating",
};

export default function ProductGrid({ products, brandsById }: { products: Product[]; brandsById: Map<string, Brand> }) {
  const [sort, setSort] = useState<SortKey>("relevance");
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [certifiedOnly, setCertifiedOnly] = useState(false);

  const filtered = useMemo(() => {
    let result = certifiedOnly ? products.filter((p) => p.certifications && p.certifications.length > 0) : products;
    result = [...result];
    if (sort === "price-low") result.sort((a, b) => leadingPrice(a.priceRange) - leadingPrice(b.priceRange));
    else if (sort === "price-high") result.sort((a, b) => leadingPrice(b.priceRange) - leadingPrice(a.priceRange));
    else if (sort === "rating") result.sort((a, b) => (brandsById.get(b.brandId)?.rating ?? 0) - (brandsById.get(a.brandId)?.rating ?? 0));
    return result;
  }, [products, sort, certifiedOnly, brandsById]);

  return (
    <div className="flex flex-col gap-3">
      <div className="sticky top-14 z-20 flex divide-x divide-[var(--color-line)] border-y border-[var(--color-line)] bg-[var(--color-surface)]">
        <button
          type="button"
          onClick={() => setSortOpen(true)}
          className="flex flex-1 items-center justify-center gap-1.5 py-3 text-[12px] font-bold text-[var(--color-ink)]"
        >
          <ArrowUpDown className="size-3.5" aria-hidden="true" />
          Sort{sort !== "relevance" ? `: ${SORT_LABEL[sort]}` : ""}
        </button>
        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          className={`flex flex-1 items-center justify-center gap-1.5 py-3 text-[12px] font-bold ${certifiedOnly ? "text-[var(--color-brand)]" : "text-[var(--color-ink)]"}`}
        >
          <SlidersHorizontal className="size-3.5" aria-hidden="true" />
          Filter{certifiedOnly ? " · 1" : ""}
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-[var(--color-ink-dim)]">No products match this filter.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} brandRating={brandsById.get(p.brandId)?.rating} />
          ))}
        </div>
      )}

      <BottomSheet open={sortOpen} onClose={() => setSortOpen(false)} title="Sort by">
        <div className="flex flex-col">
          {(Object.keys(SORT_LABEL) as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => { setSort(key); setSortOpen(false); }}
              className="flex items-center justify-between py-3 text-left text-[13px] font-semibold border-b border-[var(--color-line)] last:border-b-0"
            >
              {SORT_LABEL[key]}
              {sort === key && <Check className="size-4 text-[var(--color-brand)]" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </BottomSheet>

      <BottomSheet open={filterOpen} onClose={() => setFilterOpen(false)} title="Filter">
        <label className="flex items-center justify-between py-2">
          <span className="text-[13px] font-semibold">Certified products only</span>
          <input
            type="checkbox"
            checked={certifiedOnly}
            onChange={(e) => setCertifiedOnly(e.target.checked)}
            className="size-5 accent-[var(--color-brand)]"
          />
        </label>
        <button
          onClick={() => setFilterOpen(false)}
          className="mt-4 w-full rounded-xl bg-[var(--color-brand)] py-3 text-sm font-bold text-white"
        >
          Show {filtered.length} results
        </button>
      </BottomSheet>
    </div>
  );
}
