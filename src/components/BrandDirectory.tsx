"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Star, Users, ShieldCheck, ChevronDown, Check } from "lucide-react";
import type { Brand, PMcat } from "@/types";
import BrandLogo from "./BrandLogo";
import TrustBadge from "./TrustBadge";
import BottomSheet from "./BottomSheet";

type SortKey = "rating" | "buyers" | "newest";
const SORT_LABEL: Record<SortKey, string> = {
  rating: "Highest Rated",
  buyers: "Most Buyers Connected",
  newest: "Newest Established",
};

/** Live search + sort + parent-category filter over the full brand catalog, rendering each
    match as a rich card (not the bare name+rating row the old directory used) — logo, tagline,
    trust badges, and the same buyer-facing stats (buyers connected, manufacturing footprint)
    a buyer would otherwise only see after clicking into the brand. */
export default function BrandDirectory({
  brands,
  pcats,
  mcatIdsByPcatId,
}: {
  brands: Brand[];
  pcats: PMcat[];
  mcatIdsByPcatId: Record<string, string[]>;
}) {
  const [query, setQuery] = useState("");
  const [activePcat, setActivePcat] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("rating");
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = brands;
    const q = query.trim().toLowerCase();
    if (q) result = result.filter((b) => b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q));
    if (activePcat) {
      const mcatIds = new Set(mcatIdsByPcatId[activePcat] ?? []);
      result = result.filter((b) => mcatIds.has(b.mcatId));
    }
    result = [...result];
    if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (sort === "buyers") result.sort((a, b) => b.buyersConnected - a.buyersConnected);
    else if (sort === "newest") result.sort((a, b) => b.establishedYear - a.establishedYear);
    return result;
  }, [brands, query, activePcat, sort, mcatIdsByPcatId]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 px-4">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-2)] px-3 py-2.5">
          <Search className="size-4 shrink-0 text-[var(--color-ink-faint)]" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search by brand name"
            className="w-full bg-transparent text-[13px] outline-none placeholder:text-[var(--color-ink-faint)]"
          />
        </div>
        <button
          type="button"
          onClick={() => setSortOpen(true)}
          className="flex shrink-0 items-center gap-1 rounded-xl border border-[var(--color-line)] px-3 py-2.5 text-[12px] font-bold text-[var(--color-ink)]"
        >
          Sort
          <ChevronDown className="size-3.5" aria-hidden="true" />
        </button>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto scrollbar-none px-4 pb-1">
        <button
          type="button"
          onClick={() => setActivePcat(null)}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-[11.5px] font-bold ${
            activePcat === null ? "border-[var(--color-brand)] bg-[var(--color-brand-dim)] text-[var(--color-brand-ink)]" : "border-[var(--color-line)] text-[var(--color-ink-dim)]"
          }`}
        >
          All
        </button>
        {pcats.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setActivePcat(p.id === activePcat ? null : p.id)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-[11.5px] font-bold ${
              activePcat === p.id ? "border-[var(--color-brand)] bg-[var(--color-brand-dim)] text-[var(--color-brand-ink)]" : "border-[var(--color-line)] text-[var(--color-ink-dim)]"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <p className="px-4 text-[11px] font-bold text-[var(--color-ink-faint)]">{filtered.length} brand{filtered.length === 1 ? "" : "s"} · {SORT_LABEL[sort]}</p>

      <div className="flex flex-col gap-2.5 px-4">
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-[var(--color-ink-dim)]">No brands match your search.</p>
        ) : (
          filtered.map((b) => (
            <Link key={b.id} href={`/brand/${b.id}`} className="flex flex-col gap-2.5 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-3 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-[var(--color-line)] p-1.5">
                  <BrandLogo logo={b.logo} name={b.name} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-extrabold">{b.name}</p>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-[var(--color-ink-dim)]">{b.description}</p>
                </div>
                <span className="flex shrink-0 items-center gap-0.5 text-[12px] font-black text-[var(--color-ink)]">
                  <Star className="size-3 fill-[var(--color-gold)] text-[var(--color-gold)]" aria-hidden="true" />
                  {b.rating.toFixed(1)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {b.verified && <TrustBadge type="verified-supplier" />}
                {b.isOEM && <TrustBadge type="manufacturer-oem" />}
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-[var(--color-surface-2)] px-3 py-2 text-[10.5px] font-bold text-[var(--color-ink-dim)]">
                <span className="flex items-center gap-1">
                  <Users className="size-3" aria-hidden="true" />
                  {b.buyersConnected.toLocaleString()}+ buyers
                </span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="size-3" aria-hidden="true" />
                  Since {b.establishedYear}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>

      <BottomSheet open={sortOpen} onClose={() => setSortOpen(false)} title="Sort by">
        <div className="flex flex-col">
          {(Object.keys(SORT_LABEL) as SortKey[]).map((key) => (
            <button
              key={key}
              onClick={() => { setSort(key); setSortOpen(false); }}
              className="flex items-center justify-between border-b border-[var(--color-line)] py-3 text-left text-[13px] font-semibold last:border-b-0"
            >
              {SORT_LABEL[key]}
              {sort === key && <Check className="size-4 text-[var(--color-brand)]" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}
