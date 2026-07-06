import Link from "next/link";
import { Star } from "lucide-react";
import type { Brand } from "@/types";
import BrandLogo from "./BrandLogo";

export default function BrandTile({ brand }: { brand: Brand }) {
  return (
    <Link
      href={`/brand/${brand.id}`}
      className="flex flex-col items-center gap-2 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-3 text-center transition-colors hover:border-[var(--color-brand)]"
    >
      <span className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-[var(--color-line)] p-1.5">
        <BrandLogo logo={brand.logo} name={brand.name} />
      </span>
      <span className="text-[11px] font-bold leading-tight line-clamp-2">{brand.name}</span>
      <span className="flex items-center gap-0.5 text-[10px] font-bold text-[var(--color-ink-dim)]">
        <Star className="size-2.5 fill-[var(--color-gold)] text-[var(--color-gold)]" aria-hidden="true" />
        {brand.rating.toFixed(1)}
      </span>
    </Link>
  );
}
