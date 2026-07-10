import { notFound } from "next/navigation";
import { getPMcatById, getPMcats, getMcats, getBrands, getBrandMcatTiles } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import BrandExplorer, { type BrandMcatTile } from "@/components/BrandExplorer";
import CategoryTile from "@/components/CategoryTile";

export function generateStaticParams() {
  return getPMcats().map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pcat = getPMcatById(slug);
  return { title: pcat ? `${pcat.name} — Brands` : "Category — Brands" };
}

export default async function PCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pcat = getPMcatById(slug);
  if (!pcat) notFound();

  const mcatIds = new Set(getMcats().filter((m) => m.pmcatId === pcat.id).map((m) => m.id));

  // Union of every brand across this PMcat's sibling MCats — a buyer browsing
  // "Pumps & Fluid Handling" sees pumps AND valves brands together, not one MCat at a time.
  const brandsById = new Map([...mcatIds].flatMap((id) => getBrands({ mcatId: id })).map((b) => [b.id, b]));
  const brands = [...brandsById.values()].sort((a, b) => b.rating - a.rating);

  // Per brand, every MCat it operates in — the real BrandMCat lines, not a bare list of
  // individual products, so selecting a brand shows all its categories (e.g. "Power Cables",
  // plus any MCat outside this PMcat too), each linking through to that brand's BrandMcat
  // page. Deliberately not scoped to this PMcat's own mcatIds — a buyer who picks a brand
  // should see everything that brand sells, not just the slice that happens to live here.
  const mcatTilesByBrandId: Record<string, BrandMcatTile[]> = {};
  for (const brand of brands) {
    mcatTilesByBrandId[brand.id] = getBrandMcatTiles(brand.id);
  }

  const activeBrands = brands.filter((b) => (mcatTilesByBrandId[b.id]?.length ?? 0) > 0);

  // Sibling top-level PMcats (e.g. "Power Generation Equipment", "Switch Gear", "Solar &
  // Renewable Energy") — lets a buyer jump to a completely different area, not just deeper
  // into this one. Only ones that actually carry a branded MCat somewhere.
  const otherPcats = getPMcats()
    .filter((p) => p.id !== pcat.id)
    .filter((p) => getMcats({ pmcatId: p.id }).some((m) => getBrands({ mcatId: m.id }).length > 0));

  return (
    <div className="pb-6">
      <Breadcrumbs items={[{ label: pcat.name }]} />

      <div className="px-4 pt-1 pb-3">
        <h1 className="text-lg font-black">{pcat.name}</h1>
        <p className="mt-1 text-[12px] font-semibold text-[var(--color-ink-dim)]">{activeBrands.length} verified brands</p>
      </div>

      <div className="mx-4 rounded-2xl border border-[var(--color-line)] p-4">
        <h2 className="mb-3 text-[13px] font-black text-[var(--color-ink)]">Explore by Brands</h2>
        <BrandExplorer brands={activeBrands} mcatTilesByBrandId={mcatTilesByBrandId} />
      </div>

      {otherPcats.length > 0 && (
        <div className="mx-4 mt-4 rounded-2xl border border-[var(--color-line)] p-4">
          <h2 className="mb-3 text-[13px] font-black text-[var(--color-ink)]">Explore Other Categories</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
            {otherPcats.map((p) => (
              <CategoryTile key={p.id} category={p} href={`/pcategory/${p.id}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
