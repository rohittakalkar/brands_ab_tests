"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { useWishlist } from "./WishlistProvider";

export default function WishlistHeart({ id, size = "size-4", className = "" }: { id: string; size?: string; className?: string }) {
  const { has, toggle } = useWishlist();
  const [popping, setPopping] = useState(false);
  const active = has(id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
        setPopping(true);
        setTimeout(() => setPopping(false), 320);
      }}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={`flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm ${className}`}
    >
      <Heart
        className={`${size} ${popping ? "heart-pop" : ""} ${active ? "fill-[var(--color-brand)] text-[var(--color-brand)]" : "text-[var(--color-ink-dim)]"}`}
        aria-hidden="true"
      />
    </button>
  );
}
