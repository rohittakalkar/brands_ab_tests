"use client";

import { useState } from "react";
import { Layers } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/types";
import BottomSheet from "./BottomSheet";
import { priceLabel } from "@/lib/price";

/**
 * "Explore other Variants (N)" — IndustryBuying's variant-consolidation pattern from the
 * benchmark. Opens a picker listing every configuration of this same underlying model
 * (current one marked "Selected") instead of listing each RAM/Storage combo as its own card.
 */
export default function VariantPickerButton({ current, variants }: { current: Product; variants: Product[] }) {
  const [open, setOpen] = useState(false);
  if (variants.length === 0) return null;
  const all = [current, ...variants];

  return (
    <>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        className="mt-1 flex w-full items-center justify-center gap-1 rounded-lg border border-[var(--color-line)] py-1.5 text-[9.5px] font-bold text-[var(--color-ink-dim)]"
      >
        <Layers className="size-3" aria-hidden="true" />
        Explore other Variants ({variants.length})
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} title={`${all.length} Variants Available`}>
        <div className="flex flex-col divide-y divide-[var(--color-line)]">
          {all.map((v) => (
            <Link
              key={v.id}
              href={`/product/${v.id}`}
              onClick={(e) => e.stopPropagation()}
              className={`flex items-center gap-3 py-3 ${v.id === current.id ? "opacity-60" : ""}`}
            >
              <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-[var(--color-surface-2)]">
                <img src={v.image} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-bold">{v.keySpecValue}</p>
                <p className="text-[12.5px] font-extrabold">{priceLabel(v.priceRange, v.moq)}</p>
              </div>
              {v.id === current.id && <span className="shrink-0 text-[10px] font-bold text-[var(--color-brand)]">Selected</span>}
            </Link>
          ))}
        </div>
      </BottomSheet>
    </>
  );
}
