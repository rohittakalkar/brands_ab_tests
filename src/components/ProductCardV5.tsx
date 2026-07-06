"use client";

import { useState } from "react";
import { ShieldCheck, Star } from "lucide-react";
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
 * V5 — "Trust". Certification is woven into the card itself — a corner ribbon plus a
 * dedicated caption line below price — rather than left implicit.
 */
export default function ProductCardV5({ product, brandRating, variants = [] }: { product: Product; brandRating?: number; variants?: Product[] }) {
  const [quickView, setQuickView] = useState(false);
  const longPress = useLongPress(() => setQuickView(true));
  const badge = pickProductBadge(product.id);
  const isCertified = Boolean(product.certifications && product.certifications.length > 0);

  return (
    <div {...longPress} className="flex flex-col gap-2 overflow-hidden rounded-2xl border border-[var(--color-line)]">
      <ProductImageCarousel
        photos={product.images ?? [product.image]}
        specHighlights={Object.entries(product.specifications).slice(0, 4)}
        productId={product.id}
        productName={product.name}
        aspectClassName="aspect-[8/5]"
        overlayTopRight={<WishlistHeart id={product.id} size="size-3.5" className="m-2 size-7" />}
        overlayTopLeft={
          isCertified ? (
            <span className="flex items-center gap-1 rounded-br-xl bg-[var(--color-verified)] py-1 pl-2 pr-2.5 text-[9.5px] font-black uppercase tracking-wide text-white">
              <ShieldCheck className="size-3" aria-hidden="true" />
              Certified
            </span>
          ) : undefined
        }
      />
      <div className="flex flex-col gap-0.5 px-2 pb-2">
        {badge && <span className={`w-fit rounded px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wide ${badge.className}`}>{badge.label}</span>}
        <h3 className="text-[11px] font-semibold leading-snug text-[var(--color-ink)] line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-1.5">
          <span className="text-[12.5px] font-extrabold text-[var(--color-ink)]">{priceLabel(product.priceRange, product.moq)}</span>
          {brandRating !== undefined && (
            <span className="inline-flex items-center gap-0.5 text-[8.5px] font-bold text-[var(--color-ink-faint)]">
              <Star className="size-2.5 text-[var(--color-gold)]" fill="currentColor" aria-hidden="true" />
              {brandRating.toFixed(1)}
            </span>
          )}
        </div>
        {isCertified && (
          <p className="border-t border-[var(--color-line)] pt-1 text-[8.5px] font-bold text-[var(--color-ink-faint)]">
            {product.certifiedBy ?? product.certifications![0]}
          </p>
        )}
        {variants.length > 0 && <VariantPickerButton current={product} variants={variants} />}
        <GetBestPriceAction productName={product.name} sellerName={product.brandName} />
      </div>
      <ProductQuickView product={product} variants={variants} open={quickView} onClose={() => setQuickView(false)} />
    </div>
  );
}
