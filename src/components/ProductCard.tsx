import Link from "next/link";
import { Star } from "lucide-react";
import type { Product } from "@/types";
import GetBestPriceAction from "./GetBestPriceAction";

export default function ProductCard({
  product,
  brandRating,
  showPrice = true,
}: {
  product: Product;
  brandRating?: number;
  /** Set false when this card is standing in for a category rather than the product itself
      (e.g. "You May Be Interested In") — price belongs on a product card, not a category one. */
  showPrice?: boolean;
}) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-1.5 shadow-sm"
    >
      <div className="relative aspect-[8/5] w-full overflow-hidden rounded-xl bg-[var(--color-surface-2)]">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-active:scale-95"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {product.certifications && product.certifications.length > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-[var(--color-verified)] backdrop-blur">
            Certified
          </span>
        )}
        {brandRating !== undefined && (
          <span className="absolute bottom-2 left-2 inline-flex items-center gap-0.5 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur">
            <Star className="size-2.5 fill-[var(--color-gold)] text-[var(--color-gold)]" aria-hidden="true" />
            {brandRating.toFixed(1)}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-0.5 px-0.5 pt-1.5">
        <h3 className="text-[11px] font-semibold leading-snug text-[var(--color-ink)] line-clamp-2">{product.name}</h3>
        {showPrice && (
          <span className="mt-0.5 text-[11.5px] font-extrabold text-[var(--color-ink)]">{product.priceRange.split(" - ")[0]}</span>
        )}
        <GetBestPriceAction
          productName={product.name}
          sellerName={product.brandName}
          label="Get Quotes"
          className="mt-1 w-full rounded-lg bg-[var(--color-brand)] py-1.5 text-[10px] font-extrabold text-white active:scale-[0.98]"
        />
      </div>
    </Link>
  );
}
