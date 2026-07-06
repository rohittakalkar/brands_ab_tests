"use client";

import { useState } from "react";
import { Check, Star } from "lucide-react";
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
 * V1 — "Clarity". Tall image carousel, one clean text stack, a single restrained trust tick
 * instead of a ribbon. Hierarchy carries the card; nothing else competes for attention.
 */
export default function ProductCardV1({ product, brandRating, variants = [] }: { product: Product; brandRating?: number; variants?: Product[] }) {
  const [quickView, setQuickView] = useState(false);
  const longPress = useLongPress(() => setQuickView(true));
  const badge = pickProductBadge(product.id);
  const isCertified = Boolean(product.certifications && product.certifications.length > 0);

  return (
    <div {...longPress} className="flex flex-col gap-2">
      <ProductImageCarousel
        photos={product.images ?? [product.image]}
        specHighlights={Object.entries(product.specifications).slice(0, 4)}
        productId={product.id}
        productName={product.name}
        aspectClassName="aspect-[4/5]"
        className="rounded-2xl"
        overlayTopRight={<WishlistHeart id={product.id} size="size-3.5" className="m-2 size-7" />}
        overlayTopLeft={
          isCertified ? (
            <span className="m-2 flex size-6 items-center justify-center rounded-full bg-white/95 text-[var(--color-verified)] shadow-sm">
              <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
            </span>
          ) : undefined
        }
      />
      <div className="flex flex-col gap-1 px-0.5">
        {badge && (
          <span className={`w-fit rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide ${badge.className}`}>{badge.label}</span>
        )}
        <h3 className="text-[13px] font-semibold leading-snug text-[var(--color-ink)] line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-1.5">
          <span className="text-[13.5px] font-extrabold text-[var(--color-ink)]">{priceLabel(product.priceRange, product.moq)}</span>
          {brandRating !== undefined && (
            <span className="inline-flex items-center gap-0.5 rounded bg-[var(--color-verified-dim)] px-1 py-0.5 text-[9.5px] font-bold text-[var(--color-verified)]">
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
