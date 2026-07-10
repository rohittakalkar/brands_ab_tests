import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getPMcats, getMcats, getBrands } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import CategoryIcon from "@/components/CategoryIcon";
import BrandTile from "@/components/BrandTile";

export const metadata = { title: "All Categories — Brands" };

const TOP_BRANDS_PER_PMCAT = 8;

export default function CategoriesPage() {
  const mcats = getMcats();

  // Every PMcat, each shown by the brands that actually operate in it — a brand-first
  // directory rather than a bare list of category names, matching how the rest of the app
  // leads with brands over generic listings.
  const sections = getPMcats()
    .map((pcat) => {
      const mcatIds = mcats.filter((m) => m.pmcatId === pcat.id).map((m) => m.id);
      const brandsById = new Map(mcatIds.flatMap((id) => getBrands({ mcatId: id })).map((b) => [b.id, b]));
      const topBrands = [...brandsById.values()].sort((a, b) => b.rating - a.rating).slice(0, TOP_BRANDS_PER_PMCAT);
      return { pcat, topBrands };
    })
    .filter((s) => s.topBrands.length > 0);

  return (
    <div className="pb-6">
      <Breadcrumbs items={[{ label: "Categories" }]} />

      <div className="px-4 pt-1 pb-3">
        <h1 className="text-lg font-black">All Categories</h1>
        <p className="mt-1 text-[12px] font-semibold text-[var(--color-ink-dim)]">Browse by the brands in each category.</p>
      </div>

      <div className="flex flex-col gap-2 px-4">
        {sections.map(({ pcat, topBrands }) => (
          <div key={pcat.id} className="rounded-2xl border border-[var(--color-line)] p-3">
            <Link href={`/pcategory/${pcat.id}`} className="flex items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-2">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-dim)] text-[var(--color-brand)]">
                  <CategoryIcon icon={pcat.icon} className="size-4" />
                </span>
                <span className="truncate text-[13px] font-extrabold">{pcat.name}</span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-[var(--color-ink-faint)]" aria-hidden="true" />
            </Link>
            <div className="-mx-3 mt-2.5 flex gap-2 overflow-x-auto scrollbar-none px-3 pb-1">
              {topBrands.map((b) => (
                <div key={b.id} className="w-[88px] shrink-0">
                  <BrandTile brand={b} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
