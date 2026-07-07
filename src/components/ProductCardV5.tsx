"use client";

import { useState } from "react";
import { ShieldCheck, Star } from "lucide-react";
import type { Product } from "@/types";
import ProductImageCarousel from "./ProductImageCarousel";
import ProductQuickView from "./ProductQuickView";
import GetBestPriceAction from "./GetBestPriceAction";
import VariantPickerButton from "./VariantPickerButton";
import { useLongPress } from "@/lib/useLongPress";
import { priceLabel } from "@/lib/price";

/**
 * V5 — "Trust". Certification is woven into the card as its own text row (rating + GST
 * Verified + the certifying body) instead of an icon ribbon on the photo — trust signals read
 * as information here, not decoration.
 */
export default function ProductCardV5({ product, brandRating, variants = [] }: { product: Product; brandRating?: number; variants?: Product[] }) {
  const [quickView, setQuickView] = useState(false);
  const longPress = useLongPress(() => setQuickView(true));
  const isCertified = Boolean(product.certifications && product.certifications.length > 0);

  return (
    <div {...longPress} className="flex flex-col gap-2 overflow-hidden rounded-2xl border border-[var(--color-line)]">
      <ProductImageCarousel
        photos={product.images ?? [product.image]}
        specHighlights={Object.entries(product.specifications).slice(0, 4)}
        productId={product.id}
        productName={product.name}
        aspectClassName="aspect-[8/5]"
      />
      <div className="flex flex-col gap-1 px-2 pb-2">
        <h3 className="text-[11px] font-semibold leading-snug text-[var(--color-ink)] line-clamp-2">{product.name}</h3>
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          {brandRating !== undefined && (
            <span className="inline-flex items-center gap-0.5 text-[8.5px] font-bold text-[var(--color-ink-faint)]">
              <Star className="size-2.5 text-[var(--color-gold)]" fill="currentColor" aria-hidden="true" />
              {brandRating.toFixed(1)}
            </span>
          )}
          <span className="inline-flex items-center gap-0.5 rounded bg-[var(--color-verified-dim)] px-1 py-0.5 text-[8px] font-bold text-[var(--color-verified)]">
            <ShieldCheck className="size-2.5" aria-hidden="true" />
            GST Verified
          </span>
          {isCertified && (
            <span className="text-[8px] font-bold text-[var(--color-ink-faint)]">{product.certifiedBy ?? product.certifications![0]}</span>
          )}
        </div>
        <span className="text-[12.5px] font-extrabold text-[var(--color-ink)]">{priceLabel(product.priceRange, product.moq)}</span>
        {variants.length > 0 && <VariantPickerButton current={product} variants={variants} />}
        <GetBestPriceAction productName={product.name} sellerName={product.brandName} />
      </div>
      <ProductQuickView product={product} variants={variants} open={quickView} onClose={() => setQuickView(false)} />
    </div>
  );
}
