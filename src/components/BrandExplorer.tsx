"use client";

import { useState } from "react";
import Link from "next/link";
import type { Brand } from "@/types";
import type { BrandMcatTile } from "@/lib/data";
import BrandLogo from "./BrandLogo";

export type { BrandMcatTile };

/** "Explore by Brands" — all brands shown up front as a horizontal row (same tile style as the
    home page's Top Brands banner); tapping one reveals the MCats that brand actually operates
    in here (e.g. "KEI House Wire", "KEI Armoured Cable") — not a flat list of every product.
    Each tile links to that brand's dedicated BrandMcat page (`/brand/[slug]/[category]`), not
    the generic category page — a brand-scoped catalog view, not a filtered general one. */
export default function BrandExplorer({
  brands,
  mcatTilesByBrandId,
}: {
  brands: Brand[];
  mcatTilesByBrandId: Record<string, BrandMcatTile[]>;
}) {
  const [activeBrandId, setActiveBrandId] = useState<string | null>(brands[0]?.id ?? null);

  if (brands.length === 0) return null;
  const activeBrand = brands.find((b) => b.id === activeBrandId) ?? null;
  const tiles = activeBrand ? mcatTilesByBrandId[activeBrand.id] ?? [] : [];

  return (
    <div className="flex flex-col gap-3">
      <div className="-mx-4 flex gap-3 overflow-x-auto scrollbar-none px-4 pb-1">
        {brands.map((b) => {
          const active = b.id === activeBrandId;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => setActiveBrandId(b.id)}
              className={`flex w-[88px] shrink-0 flex-col items-center gap-2 rounded-2xl border p-3 text-center shadow-sm transition-colors ${
                active ? "border-[var(--color-brand)] bg-[var(--color-brand-dim)]" : "border-[var(--color-line)] bg-[var(--color-surface)]"
              }`}
            >
              <span className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-[var(--color-line)] p-1.5">
                <BrandLogo logo={b.logo} name={b.name} />
              </span>
              <span className="text-[11px] font-bold leading-tight line-clamp-2">{b.name}</span>
            </button>
          );
        })}
      </div>

      {activeBrand && tiles.length > 0 && (
        <div className="flex flex-col gap-3">
          <Link href={`/brand/${activeBrand.id}`} className="text-[13px] font-extrabold text-[var(--color-ink)]">
            {activeBrand.name} <span className="text-[var(--color-brand)]">→</span>
          </Link>
          <div className="grid grid-cols-3 gap-x-2 gap-y-3">
            {tiles.map((t) => (
              <Link key={t.id} href={`/brand/${activeBrand.id}/${t.id}`} className="flex flex-col gap-1">
                <div className="aspect-square w-full overflow-hidden rounded-lg bg-[var(--color-surface-2)]">
                  <img src={t.image} alt={t.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                </div>
                <p className="line-clamp-2 text-[10.5px] font-semibold leading-tight text-[var(--color-ink)]">{t.name}</p>
                <p className="text-[9.5px] text-[var(--color-ink-faint)]">({t.productCount} models)</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
