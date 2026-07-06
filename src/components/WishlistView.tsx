"use client";

import { Heart } from "lucide-react";
import type { Brand, Product } from "@/types";
import { useWishlist } from "./WishlistProvider";
import ProductCard from "./ProductCard";

export default function WishlistView({ products, brandsById }: { products: Product[]; brandsById: Map<string, Brand> }) {
  const { ids } = useWishlist();
  const saved = products.filter((p) => ids.has(p.id));

  if (saved.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-8 py-20 text-center">
        <Heart className="size-10 text-[var(--color-ink-faint)]" aria-hidden="true" />
        <p className="text-sm font-bold">Your wishlist is empty</p>
        <p className="text-xs text-[var(--color-ink-dim)]">Tap the heart on any product to save it here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-3 pt-2">
      {saved.map((p) => <ProductCard key={p.id} product={p} brandRating={brandsById.get(p.brandId)?.rating} />)}
    </div>
  );
}
