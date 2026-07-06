"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import type { Product } from "@/types";
import WishlistHeart from "./WishlistHeart";
import ProductImageCarousel from "./ProductImageCarousel";
import ProductQuickView from "./ProductQuickView";
import GetBestPriceAction from "./GetBestPriceAction";
import VariantPickerButton from "./VariantPickerButton";
import { useLongPress } from "@/lib/useLongPress";
import { pickProductBadge } from "@/lib/productBadge";
import { priceLabel } from "@/lib/price";

/**
 * V4 — "Compare". A consistent spec-line beneath the name so cards from different brands
 * line up for comparison in a cross-sell grid.
 */
export default function ProductCardV4({ product, brandRating, variants = [] }: { product: Product; brandRating?: number; variants?: Product[] }) {
  const [quickView, setQuickView] = useState(false);
  const longPress = useLongPress(() => setQuickView(true));
  const badge = pickProductBadge(product.id);

  return (
    <div {...longPress} className="flex flex-col gap-2">
      <ProductImageCarousel
        photos={product.images ?? [product.image]}
        specHighlights={Object.entries(product.specifications).slice(0, 4)}
        productId={product.id}
        productName={product.name}
        aspectClassName="aspect-[8/5]"
        className="rounded-2xl"
        overlayTopRight={<WishlistHeart id={product.id} size="size-3.5" className="m-2 size-7" />}
        overlayTopLeft={
          badge ? <span className={`m-2 rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide ${badge.className}`}>{badge.label}</span> : undefined
        }
      />
      <div className="flex flex-col gap-0.5 px-0.5">
        <h3 className="text-[11px] font-semibold leading-snug text-[var(--color-ink)] line-clamp-2">{product.name}</h3>
        <span className="truncate text-[9px] text-[var(--color-ink-dim)]">{product.keySpecLabel}: {product.keySpecValue}</span>
        <div className="mt-0.5 flex items-center gap-1.5">
          <span className="text-[11.5px] font-extrabold text-[var(--color-ink)]">{priceLabel(product.priceRange, product.moq)}</span>
          {brandRating !== undefined && (
            <span className="inline-flex items-center gap-0.5 text-[8.5px] font-bold text-[var(--color-ink-faint)]">
              <Star className="size-2.5 text-[var(--color-gold)]" fill="currentColor" aria-hidden="true" />
              {brandRating.toFixed(1)}
            </span>
          )}
        </div>
        {variants.length > 0 && <VariantPickerButton current={product} variants={variants} />}
        <GetBestPriceAction productName={product.name} sellerName={product.brandName} />
      </div>
      <ProductQuickView product={product} variants={variants} open={quickView} onClose={() => setQuickView(false)} />
    </div>
  );
}
