import { notFound } from "next/navigation";
import { getPMcatById, getPMcats, getMcatById, getMcats, getBrands, getBrandMCats, getProducts } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import BrandExplorer, { type BrandMcatTile } from "@/components/BrandExplorer";

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

  // Union of every brand across this parent category's sibling mcats — a buyer browsing
  // "Pumps & Fluid Handling" sees pumps AND valves brands together, not one mcat at a time.
  const brandsById = new Map([...mcatIds].flatMap((id) => getBrands({ mcatId: id })).map((b) => [b.id, b]));
  const brands = [...brandsById.values()].sort((a, b) => b.rating - a.rating);

  // Per brand, the mcats it actually operates in here — the real BrandMCat lines, not a bare
  // list of individual products, so selecting a brand shows its categories (e.g. "Power
  // Cables"), each linking through to that brand's BrandMcat page.
  const mcatTilesByBrandId: Record<string, BrandMcatTile[]> = {};
  for (const brand of brands) {
    const lines = getBrandMCats({ brandId: brand.id }).filter((l) => mcatIds.has(l.mcatId));
    mcatTilesByBrandId[brand.id] = lines
      .map((line) => ({ line, mcatProducts: getProducts({ brandMCatId: line.id }) }))
      .filter(({ mcatProducts }) => mcatProducts.length > 0)
      .map(({ line, mcatProducts }) => ({
        mcatId: line.mcatId,
        mcatName: getMcatById(line.mcatId)?.name ?? line.name,
        image: mcatProducts[0].image,
        productCount: mcatProducts.length,
      }));
  }

  const activeBrands = brands.filter((b) => (mcatTilesByBrandId[b.id]?.length ?? 0) > 0);

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
    </div>
  );
}
