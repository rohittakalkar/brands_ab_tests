import Link from "next/link";
import type { Product } from "@/types";
import WishlistHeart from "./WishlistHeart";

export default function ProductCard({ product, brandRating }: { product: Product; brandRating?: number }) {
  return (
    <Link href={`/product/${product.id}`} className="group flex flex-col overflow-hidden rounded-2xl bg-[var(--color-surface)]">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[var(--color-surface-2)]">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-active:scale-95"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <WishlistHeart id={product.id} size="size-3.5" className="absolute right-2 top-2 size-7" />
        {product.certifications && product.certifications.length > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-[var(--color-verified)] backdrop-blur">
            Certified
          </span>
        )}
      </div>
      <div className="flex flex-col gap-0.5 px-0.5 pt-2">
        <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-ink-faint)] truncate">{product.brandName}</span>
        <h3 className="text-[12.5px] font-semibold leading-snug text-[var(--color-ink)] line-clamp-2">{product.name}</h3>
        <div className="mt-0.5 flex items-baseline gap-1.5">
          <span className="text-[13px] font-extrabold text-[var(--color-ink)]">{product.priceRange.split(" - ")[0]}</span>
          {product.priceRange.includes(" - ") && <span className="text-[10px] text-[var(--color-ink-faint)]">onwards</span>}
        </div>
        {brandRating !== undefined && (
          <span className="mt-0.5 inline-flex w-fit items-center gap-1 rounded bg-[var(--color-verified-dim)] px-1.5 py-0.5 text-[10px] font-bold text-[var(--color-verified)]">
            {brandRating.toFixed(1)} ★
          </span>
        )}
      </div>
    </Link>
  );
}
