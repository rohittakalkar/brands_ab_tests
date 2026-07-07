"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import type { Product } from "@/types";
import ProductImageCarousel from "./ProductImageCarousel";
import ProductQuickView from "./ProductQuickView";
import GetBestPriceAction from "./GetBestPriceAction";
import { useLongPress } from "@/lib/useLongPress";
import { priceLabel } from "@/lib/price";

/**
 * V3 — "Compact". Maximum decision-relevant information (name, price, MOQ, delivery, rating)
 * packed into a tight vertical stack, distinguished from the other variants by folding MOQ and
 * delivery time into one dense caption line instead of spreading them across the card. Vertical
 * (image-over-text), same as every other variant, so it renders correctly wherever a
 * CardComponent is dropped in — a narrow carousel slot or a 2-up grid cell — rather than a
 * horizontal row that only has room to work in a full-width single column.
 */
export default function ProductCardV3({ product, brandRating, variants = [] }: { product: Product; brandRating?: number; variants?: Product[] }) {
  const [quickView, setQuickView] = useState(false);
  const longPress = useLongPress(() => setQuickView(true));

  return (
    <div {...longPress} className="flex flex-col gap-2 rounded-xl border border-[var(--color-line)] p-2">
      <ProductImageCarousel
        photos={product.images ?? [product.image]}
        specHighlights={[]}
        productId={product.id}
        productName={product.name}
        aspectClassName="aspect-[8/5]"
        className="rounded-lg"
      />
      <div className="flex flex-col gap-0.5">
        <h3 className="line-clamp-2 text-[11px] font-bold leading-snug text-[var(--color-ink)]">{product.name}</h3>
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] font-extrabold text-[var(--color-ink)]">{priceLabel(product.priceRange, product.moq)}</span>
          {brandRating !== undefined && (
            <span className="inline-flex items-center gap-0.5 text-[8.5px] font-bold text-[var(--color-ink-faint)]">
              <Star className="size-2.5 text-[var(--color-gold)]" fill="currentColor" aria-hidden="true" />
              {brandRating.toFixed(1)}
            </span>
          )}
        </div>
        <p className="truncate text-[9px] text-[var(--color-ink-faint)]">MOQ {product.moq} · {product.deliveryTime}</p>
        <GetBestPriceAction productName={product.name} sellerName={product.brandName} />
      </div>
      <ProductQuickView product={product} variants={variants} open={quickView} onClose={() => setQuickView(false)} />
    </div>
  );
}
