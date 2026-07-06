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
 * V2 — "Databoard". Square carousel with a dedicated spec slide (Moglix's inline-spec pattern,
 * upgraded from a cramped image overlay into its own real slide), dense but controlled.
 */
export default function ProductCardV2({ product, brandRating, variants = [] }: { product: Product; brandRating?: number; variants?: Product[] }) {
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
        aspectClassName="aspect-square"
        className="rounded-xl"
        overlayTopRight={<WishlistHeart id={product.id} size="size-3.5" className="m-1.5 size-6.5" />}
        overlayTopLeft={
          badge ? <span className={`m-1.5 rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide ${badge.className}`}>{badge.label}</span> : undefined
        }
      />
      <div className="flex flex-col gap-0.5 px-0.5">
        <h3 className="text-[12px] font-semibold leading-snug text-[var(--color-ink)] line-clamp-2">{product.name}</h3>
        <div className="flex items-baseline justify-between">
          <span className="text-[13px] font-extrabold text-[var(--color-ink)]">{priceLabel(product.priceRange, product.moq)}</span>
          {brandRating !== undefined && (
            <span className="inline-flex items-center gap-0.5 text-[9.5px] font-bold text-[var(--color-ink-faint)]">
              <Star className="size-2.5 text-[var(--color-gold)]" fill="currentColor" aria-hidden="true" />
              {brandRating.toFixed(1)}
            </span>
          )}
        </div>
        <span className="text-[9.5px] font-bold text-[var(--color-ink-faint)]">MOQ {product.moq}</span>
        {variants.length > 0 && <VariantPickerButton current={product} variants={variants} />}
        <GetBestPriceAction productName={product.name} sellerName={product.brandName} />
      </div>
      <ProductQuickView product={product} variants={variants} open={quickView} onClose={() => setQuickView(false)} />
    </div>
  );
}
