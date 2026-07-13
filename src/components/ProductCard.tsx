import Link from "next/link";
import { Star, Phone } from "lucide-react";
import type { Product, Brand } from "@/types";
import GetBestPriceAction from "./GetBestPriceAction";
import CallNowAction from "./CallNowAction";

/** Up to 4 spec rows shown under the name — leads with the card's own headline spec, then fills
    in from the product's full spec table (skipping the headline spec if it's duplicated there). */
function specRows(product: Product): { label: string; value: string }[] {
  const rows = [{ label: product.keySpecLabel, value: product.keySpecValue }];
  for (const [label, value] of Object.entries(product.specifications)) {
    if (rows.length >= 4) break;
    if (label === product.keySpecLabel) continue;
    rows.push({ label, value });
  }
  return rows;
}

export default function ProductCard({
  product,
  brand,
  showPrice = true,
  contactPhone,
}: {
  product: Product;
  /** Seller (brand) record this product is listed under — its rating is shown as a badge on
      the product image. Omitted only for category-standin cards where price is also hidden. */
  brand?: Brand;
  /** Set false when this card is standing in for a category rather than the product itself
      (e.g. "You May Be Interested In") — price belongs on a product card, not a category one. */
  showPrice?: boolean;
  /** Supplier phone number for the "Call Now" CTA — looked up server-side by the caller (this
      card itself stays a plain, server-renderable component so it can sit inside either a
      Server or Client parent). Omitted (no button shown) where no supplier is on file. */
  contactPhone?: string;
}) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col gap-2 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-2.5 shadow-sm"
    >
      <div className="flex gap-2.5">
        <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl bg-[var(--color-surface-2)]">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-active:scale-95"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          {brand !== undefined && (
            <span className="absolute bottom-1 left-1 inline-flex items-center gap-0.5 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur">
              <Star className="size-2.5 fill-[var(--color-gold)] text-[var(--color-gold)]" aria-hidden="true" />
              {brand.rating.toFixed(1)}
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h3 className="text-[12.5px] font-bold leading-snug text-[var(--color-brand)] line-clamp-2">{product.name}</h3>
          {showPrice && (
            <span className="text-[12.5px] font-extrabold text-[var(--color-ink)]">{product.priceRange.split(" - ")[0]}</span>
          )}
          <dl className="mt-0.5 flex flex-col gap-px">
            {specRows(product).map((row) => (
              <div key={row.label} className="flex gap-1 text-[10px] leading-snug text-[var(--color-ink-dim)]">
                <dt className="shrink-0 font-medium">{row.label}:</dt>
                <dd className="truncate font-semibold text-[var(--color-ink)]">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="flex gap-1.5">
        <GetBestPriceAction
          productName={product.name}
          sellerName={brand?.name ?? product.brandName}
          label="Get Best Price"
          icon={<Star className="size-3" aria-hidden="true" />}
          className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-[var(--color-brand)] py-2 text-[11px] font-extrabold text-[var(--color-brand)] active:scale-[0.98]"
        />
        {contactPhone ? (
          <CallNowAction
            contactPhone={contactPhone}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[var(--color-brand)] py-2 text-[11px] font-extrabold text-white active:scale-[0.98]"
          />
        ) : (
          <span className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-[var(--color-surface-2)] py-2 text-[11px] font-extrabold text-[var(--color-ink-faint)]">
            <Phone className="size-3" aria-hidden="true" />
            Call Now
          </span>
        )}
      </div>
    </Link>
  );
}
