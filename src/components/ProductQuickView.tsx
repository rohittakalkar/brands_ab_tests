"use client";

import { Star } from "lucide-react";
import type { Product, Supplier } from "@/types";
import BottomSheet from "./BottomSheet";
import TrustBadge from "./TrustBadge";
import GetBestPriceAction from "./GetBestPriceAction";
import VariantPickerButton from "./VariantPickerButton";
import { priceLabel } from "@/lib/price";

/** Long-press reveals this — the handful of decision-relevant details a compact card can't fit
    (full spec snapshot, delivery, warranty, and — when the card was seller-first — who's
    actually selling it), plus the one buyer action that matters, not the entire PDP. */
export default function ProductQuickView({
  product,
  supplier,
  variants = [],
  open,
  onClose,
}: {
  product: Product;
  supplier?: Supplier | null;
  variants?: Product[];
  open: boolean;
  onClose: () => void;
}) {
  const specs = Object.entries(product.specifications).slice(0, 4);
  return (
    <BottomSheet open={open} onClose={onClose} title={product.name}>
      <div className="flex gap-3">
        <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-[var(--color-surface-2)]">
          <img src={product.image} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-extrabold">{priceLabel(product.priceRange, product.moq)}</p>
          <p className="text-[11px] text-[var(--color-ink-faint)]">MOQ {product.moq} · {product.deliveryTime} · {product.warranty} warranty</p>
        </div>
      </div>

      <p className="mt-3 text-[12.5px] leading-snug text-[var(--color-ink-dim)] line-clamp-3">{product.description}</p>

      {specs.length > 0 && (
        <dl className="mt-3 divide-y divide-[var(--color-line)] border-t border-[var(--color-line)]">
          {specs.map(([k, v]) => (
            <div key={k} className="flex justify-between py-2 text-[12px]">
              <dt className="text-[var(--color-ink-dim)]">{k}</dt>
              <dd className="font-bold">{v}</dd>
            </div>
          ))}
        </dl>
      )}

      {supplier && (
        <div className="mt-3 rounded-xl bg-[var(--color-surface-2)] p-3">
          <p className="mb-1.5 text-[10px] font-black uppercase tracking-wide text-[var(--color-ink-faint)]">Sold by</p>
          <div className="flex items-center justify-between">
            <p className="text-[12.5px] font-extrabold">{supplier.name}</p>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-[var(--color-ink-dim)]">
              <Star className="size-3 text-[var(--color-gold)]" fill="currentColor" aria-hidden="true" />
              {supplier.rating.toFixed(1)}
            </span>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {supplier.isAuthorizedDealer && <TrustBadge type="authorized-dealer" />}
            {supplier.verified && <TrustBadge type="verified-supplier" />}
          </div>
        </div>
      )}

      {variants.length > 0 && <VariantPickerButton current={product} variants={variants} />}

      <div className="mt-4">
        <GetBestPriceAction
          productName={product.name}
          sellerName={supplier?.name ?? product.brandName}
          className="w-full rounded-xl bg-[var(--color-brand)] py-3.5 text-sm font-extrabold text-white"
          onDone={onClose}
        />
      </div>
    </BottomSheet>
  );
}
