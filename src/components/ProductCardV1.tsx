"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import type { Product } from "@/types";
import ProductImageCarousel from "./ProductImageCarousel";
import ProductQuickView from "./ProductQuickView";
import GetBestPriceAction from "./GetBestPriceAction";
import VariantPickerButton from "./VariantPickerButton";
import { useLongPress } from "@/lib/useLongPress";
import { priceLabel } from "@/lib/price";

/**
 * V1 — "Clarity". Tall image carousel, one clean text stack. Hierarchy carries the card;
 * nothing else competes for attention — no overlays on the photo itself, name first, then price
 * and rating on their own line.
 */
export default function ProductCardV1({ product, brandRating, variants = [] }: { product: Product; brandRating?: number; variants?: Product[] }) {
  const [quickView, setQuickView] = useState(false);
  const longPress = useLongPress(() => setQuickView(true));

  return (
    <div {...longPress} className="flex flex-col gap-2">
      <ProductImageCarousel
        photos={product.images ?? [product.image]}
        specHighlights={Object.entries(product.specifications).slice(0, 4)}
        productId={product.id}
        productName={product.name}
        aspectClassName="aspect-[8/5]"
        className="rounded-2xl"
      />
      <div className="flex flex-col gap-0.5 px-0.5">
        <h3 className="text-[11.5px] font-semibold leading-snug text-[var(--color-ink)] line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] font-extrabold text-[var(--color-ink)]">{priceLabel(product.priceRange, product.moq)}</span>
          {brandRating !== undefined && (
            <span className="inline-flex items-center gap-0.5 rounded bg-[var(--color-verified-dim)] px-1 py-0.5 text-[8.5px] font-bold text-[var(--color-verified)]">
              <Star className="size-2.5" fill="currentColor" aria-hidden="true" />
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
