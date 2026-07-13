"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Product, Brand } from "@/types";
import ProductCard from "./ProductCard";

const DEFAULT_PAGE_SIZE = 20;

export default function ProductGrid({
  products,
  brandsById,
  pageSize = DEFAULT_PAGE_SIZE,
  contactPhoneByProductId,
  padded = true,
}: {
  products: Product[];
  brandsById: Map<string, Brand>;
  /** Number of products shown before "View More" — defaults to 20; a brand's own MCat page
      passes 10 to match IndiaMART's own catalog view. */
  pageSize?: number;
  /** Supplier phone per product id, looked up server-side by the caller — powers each card's
      "Call Now" CTA. */
  contactPhoneByProductId?: Record<string, string>;
  /** Set false when the caller already supplies its own horizontal inset (e.g. nested inside a
      padded SectionCard) — avoids stacking two layers of side margin on the same cards. */
  padded?: boolean;
}) {
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const visible = products.slice(0, visibleCount);
  const remaining = products.length - visible.length;
  const sidePadding = padded ? "px-3" : "";

  if (products.length === 0) {
    return <p className="px-4 py-10 text-center text-sm text-[var(--color-ink-dim)]">No products in this category yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className={`flex flex-col gap-3 ${sidePadding}`}>
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} brand={brandsById.get(p.brandId)} contactPhone={contactPhoneByProductId?.[p.id]} />
        ))}
      </div>

      {remaining > 0 && (
        <div className={sidePadding}>
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + pageSize)}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-[var(--color-line)] py-2 text-[12px] font-bold text-[var(--color-ink)]"
          >
            View More
            <ChevronDown className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
