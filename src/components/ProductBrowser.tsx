"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Search, ArrowUpDown, SlidersHorizontal, Check, ChevronDown, ChevronUp, LayoutGrid } from "lucide-react";
import type { Product } from "@/types";
import BottomSheet from "./BottomSheet";
import SectionHeading from "./SectionHeading";
import { leadingPrice } from "@/lib/price";
import { deriveFacets, getEffectiveSpecs } from "@/lib/facets";

type SortKey = "relevance" | "price-low" | "price-high";
const SORT_LABEL: Record<SortKey, string> = {
  relevance: "Relevance",
  "price-low": "Price: Low to High",
  "price-high": "Price: High to Low",
};

const PAGE_SIZE = 12;

/**
 * Inline search + "All Products" grid, with sort/filter surfaced as a sticky bar fixed to the
 * bottom of the screen (Myntra's persistent bottom bar), sitting just above the sticky buy bar
 * rather than a top bar that scrolls out of reach. Filters are derived from this category's own
 * product specs (see lib/facets.ts) rather than a fixed list, so Mobile Phones surfaces
 * RAM/Storage while Pumps would surface Rated Power — whatever this category's data actually
 * varies on. Card design is injected per page variant via pre-rendered elements.
 */
export default function ProductBrowser({
  products,
  cardsById,
  heading,
}: {
  products: Product[];
  /** Pre-rendered by the server-component caller — a component *reference* can't cross the
      Server → Client boundary, but an already-rendered element can. */
  cardsById: Record<string, ReactNode>;
  heading: string;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("relevance");
  const [certifiedOnly, setCertifiedOnly] = useState(false);
  const [facetSelections, setFacetSelections] = useState<Record<string, Set<string>>>({});
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const facets = useMemo(() => deriveFacets(products), [products]);
  // Only the first filter is expanded by default — the rest stay collapsed until asked for,
  // so the sheet opens onto something scannable instead of every facet's full value list at once.
  const [expandedFacets, setExpandedFacets] = useState<Set<string>>(() => new Set(facets[0] ? [facets[0].key] : []));
  const toggleFacetExpanded = (key: string) => {
    setExpandedFacets((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleFacetValue = (key: string, value: string) => {
    setFacetSelections((prev) => {
      const next = { ...prev };
      const current = new Set(next[key] ?? []);
      if (current.has(value)) current.delete(value);
      else current.add(value);
      next[key] = current;
      return next;
    });
  };

  // Which values of *this* facet would still return at least one product, given whatever's
  // already selected in every *other* facet — e.g. once Storage: 500MB is picked, a RAM
  // value that never appears on a 500MB SKU disables instead of silently vanishing, so the
  // buyer can see the combination doesn't exist rather than wondering where the option went.
  const availableValuesByFacet = useMemo(() => {
    const result: Record<string, Set<string>> = {};
    for (const facet of facets) {
      let pool = products;
      if (certifiedOnly) pool = pool.filter((p) => p.certifications && p.certifications.length > 0);
      for (const [key, values] of Object.entries(facetSelections)) {
        if (key === facet.key || values.size === 0) continue;
        pool = pool.filter((p) => values.has(getEffectiveSpecs(p.specifications)[key]));
      }
      result[facet.key] = new Set(pool.map((p) => getEffectiveSpecs(p.specifications)[facet.key]));
    }
    return result;
  }, [facets, products, certifiedOnly, facetSelections]);

  const filtered = useMemo(() => {
    let result = products;
    const q = query.trim().toLowerCase();
    if (q) result = result.filter((p) => p.name.toLowerCase().includes(q) || p.modelNumber.toLowerCase().includes(q));
    if (certifiedOnly) result = result.filter((p) => p.certifications && p.certifications.length > 0);
    for (const [key, values] of Object.entries(facetSelections)) {
      if (values.size === 0) continue;
      result = result.filter((p) => values.has(getEffectiveSpecs(p.specifications)[key]));
    }
    result = [...result];
    if (sort === "price-low") result.sort((a, b) => leadingPrice(a.priceRange) - leadingPrice(b.priceRange));
    else if (sort === "price-high") result.sort((a, b) => leadingPrice(b.priceRange) - leadingPrice(a.priceRange));
    return result;
  }, [products, query, certifiedOnly, facetSelections, sort]);

  const visible = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visible.length;
  const activeFilterCount = (certifiedOnly ? 1 : 0) + Object.values(facetSelections).reduce((n, s) => n + s.size, 0);

  return (
    <div id="all-products" className="flex flex-col gap-2 pb-16 scroll-mt-14">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-2)] px-3 py-2">
          <Search className="size-4 shrink-0 text-[var(--color-ink-faint)]" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setVisibleCount(PAGE_SIZE); }}
            type="text"
            placeholder="Search this brand's products"
            className="w-full bg-transparent text-[13px] outline-none placeholder:text-[var(--color-ink-faint)]"
          />
        </div>
      </div>

      <SectionHeading icon={LayoutGrid} animation="pulse" accent="sky">{heading} · {filtered.length}</SectionHeading>

      {visible.length === 0 ? (
        <p className="py-10 text-center text-sm text-[var(--color-ink-dim)]">No products match your search.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-2 gap-y-3">
            {visible.map((p) => cardsById[p.id])}
          </div>

          {remaining > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-[var(--color-ink)] py-3 text-[13px] font-extrabold text-[var(--color-ink)] active:bg-[var(--color-surface-2)]"
              >
                View {Math.min(PAGE_SIZE, remaining)} More Products
                <ChevronDown className="size-4" aria-hidden="true" />
              </button>
              <p className="mt-1.5 text-center text-[10.5px] text-[var(--color-ink-faint)]">{remaining} more in this catalog</p>
            </div>
          )}
        </>
      )}

      {/* Sticky bottom Sort/Filter bar — sits above the sticky buy bar, not a top bar that
          scrolls out of reach on a long product list. */}
      <div className="fixed inset-x-0 bottom-[68px] z-30 flex divide-x divide-[var(--color-line)] border-t border-[var(--color-line)] bg-[var(--color-surface)]/95 backdrop-blur shadow-[0_-4px_12px_rgba(16,24,64,0.08)]">
        <button
          type="button"
          onClick={() => setSortOpen(true)}
          className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-[12px] font-bold text-[var(--color-ink)]"
        >
          <ArrowUpDown className="size-3.5" aria-hidden="true" />
          Sort{sort !== "relevance" ? `: ${SORT_LABEL[sort]}` : ""}
        </button>
        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-[12px] font-bold ${activeFilterCount ? "text-[var(--color-brand)]" : "text-[var(--color-ink)]"}`}
        >
          <SlidersHorizontal className="size-3.5" aria-hidden="true" />
          Filter{activeFilterCount ? ` · ${activeFilterCount}` : ""}
        </button>
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

      <BottomSheet open={filterOpen} onClose={() => setFilterOpen(false)} title="Filter">
        <div className="flex flex-col divide-y divide-[var(--color-line)]">
          <label className="flex items-center justify-between py-3 first:pt-0">
            <span className="text-[13px] font-semibold">Certified products only</span>
            <input
              type="checkbox"
              checked={certifiedOnly}
              onChange={(e) => setCertifiedOnly(e.target.checked)}
              className="size-5 accent-[var(--color-brand)]"
            />
          </label>

          {facets.map((facet) => {
            const expanded = expandedFacets.has(facet.key);
            return (
              <div key={facet.key} className="py-3">
                <button
                  type="button"
                  onClick={() => toggleFacetExpanded(facet.key)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className="text-[11px] font-black uppercase tracking-wide text-[var(--color-ink-faint)]">
                    {facet.key}
                    {(facetSelections[facet.key]?.size ?? 0) > 0 && ` · ${facetSelections[facet.key]!.size}`}
                  </span>
                  {expanded ? <ChevronUp className="size-3.5 text-[var(--color-ink-faint)]" aria-hidden="true" /> : <ChevronDown className="size-3.5 text-[var(--color-ink-faint)]" aria-hidden="true" />}
                </button>
                {expanded && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {facet.values.map((value) => {
                      const active = facetSelections[facet.key]?.has(value) ?? false;
                      const isAvailable = availableValuesByFacet[facet.key]?.has(value) ?? true;
                      const disabled = !active && !isAvailable;
                      return (
                        <button
                          key={value}
                          type="button"
                          disabled={disabled}
                          onClick={() => toggleFacetValue(facet.key, value)}
                          className={`rounded-full border px-3 py-1.5 text-[12px] font-bold ${
                            active
                              ? "border-[var(--color-brand)] bg-[var(--color-brand-dim)] text-[var(--color-brand-ink)]"
                              : disabled
                                ? "cursor-not-allowed border-[var(--color-line)] text-[var(--color-ink-faint)] opacity-40"
                                : "border-[var(--color-line)] text-[var(--color-ink-dim)]"
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sticky within the sheet's own scroll area — stays visible while facet values above scroll. */}
        <div className="sticky bottom-0 -mx-5 border-t border-[var(--color-line)] bg-[var(--color-surface)] px-5 pb-1 pt-3">
          <button onClick={() => setFilterOpen(false)} className="w-full rounded-xl bg-[var(--color-brand)] py-3 text-sm font-bold text-white">
            Show {filtered.length} results
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}
