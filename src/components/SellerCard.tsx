"use client";

import { useState } from "react";
import { Phone, Star } from "lucide-react";
import type { Product, Supplier } from "@/types";
import TrustBadge from "./TrustBadge";
import ProductQuickView from "./ProductQuickView";
import GetBestPriceAction from "./GetBestPriceAction";
import { useLongPress } from "@/lib/useLongPress";
import { priceLabel } from "@/lib/price";

/**
 * Seller-first card for the Best Sellers row — leads with who's selling (name, rating,
 * verification, response time) with the product as the secondary line underneath. Long-press
 * opens a quick view carrying both the seller and the product, not just the product.
 */
export default function SellerCard({ product, supplier, variants = [] }: { product: Product; supplier: Supplier | null; variants?: Product[] }) {
  const [quickView, setQuickView] = useState(false);
  const longPress = useLongPress(() => setQuickView(true));
  const sellerName = supplier?.name ?? product.brandName;

  return (
    <div {...longPress} className="flex w-60 shrink-0 flex-col gap-2 rounded-2xl border border-[var(--color-line)] p-3">
      <div className="flex items-center gap-2">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-2)] text-[10px] font-black text-[var(--color-ink-dim)]">
          {sellerName.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-extrabold leading-tight">{sellerName}</p>
          {supplier && (
            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[var(--color-ink-dim)]">
              <Star className="size-2.5 text-[var(--color-gold)]" fill="currentColor" aria-hidden="true" />
              {supplier.rating.toFixed(1)} ({supplier.reviewsCount})
            </span>
          )}
        </div>
      </div>

      {supplier && (
        <div className="flex flex-wrap gap-1">
          {supplier.isAuthorizedDealer && <TrustBadge type="authorized-dealer" />}
          {supplier.verified && <TrustBadge type="verified-supplier" />}
        </div>
      )}
      {supplier && (
        <p className="text-[8.5px] text-[var(--color-ink-faint)]">Responds in {supplier.responseTime} · {supplier.responseRate}% reply rate</p>
      )}

      <div className="flex items-center gap-2 rounded-xl bg-[var(--color-surface-2)] p-2">
        <div className="size-10 shrink-0 overflow-hidden rounded-lg bg-[var(--color-surface)]">
          <img src={product.image} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[9.5px] font-semibold leading-snug">{product.name}</p>
          <p className="text-[10.5px] font-extrabold">{priceLabel(product.priceRange, product.moq)}</p>
        </div>
      </div>

      <div className="flex gap-1.5">
        <GetBestPriceAction productName={product.name} sellerName={sellerName} className="flex-1 rounded-lg bg-[var(--color-brand)] py-1.5 text-[10px] font-extrabold text-white active:scale-[0.98]" />
        {supplier?.contactPhone && (
          <a
            href={`tel:${supplier.contactPhone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-1 rounded-lg border border-[var(--color-line)] px-2.5 text-[10px] font-extrabold text-[var(--color-ink)] active:scale-[0.98]"
          >
            <Phone className="size-3" aria-hidden="true" />
            Call Now
          </a>
        )}
      </div>
      <ProductQuickView product={product} supplier={supplier} variants={variants} open={quickView} onClose={() => setQuickView(false)} />
    </div>
  );
}
