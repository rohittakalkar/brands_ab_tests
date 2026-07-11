import Link from "next/link";
import type { Brand } from "@/types";
import BrandLogo from "./BrandLogo";

export default function BrandTile({ brand, href }: { brand: Brand; href?: string }) {
  return (
    <Link
      href={href ?? `/brand/${brand.id}`}
      className="flex h-full flex-col items-center justify-start gap-2 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-3 text-center shadow-sm transition-colors hover:border-[var(--color-brand)]"
    >
      <span className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-[var(--color-line)] p-1.5">
        <BrandLogo logo={brand.logo} name={brand.name} />
      </span>
      <span className="text-[11px] font-bold leading-tight line-clamp-2">{brand.name}</span>
    </Link>
  );
}
