import { getProducts, getBrands } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import BrandTile from "@/components/BrandTile";

export const metadata = { title: "Search — Brands" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();

  const allBrands = getBrands();
  const allProducts = getProducts();
  const brandsById = new Map(allBrands.map((b) => [b.id, b]));

  const matchedBrands = query ? allBrands.filter((b) => b.name.toLowerCase().includes(query)).slice(0, 6) : [];
  const matchedProducts = query
    ? allProducts.filter((p) => p.name.toLowerCase().includes(query) || p.brandName.toLowerCase().includes(query)).slice(0, 20)
    : [];

  return (
    <div className="pb-6">
      <Breadcrumbs items={[{ label: `"${q}"` || "Search" }]} />

      {!query ? (
        <p className="px-4 py-10 text-center text-sm text-[var(--color-ink-dim)]">Search for a brand, product, or model.</p>
      ) : matchedBrands.length === 0 && matchedProducts.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-[var(--color-ink-dim)]">No matches for &ldquo;{q}&rdquo;.</p>
      ) : (
        <>
          {matchedBrands.length > 0 && (
            <section className="px-4 pt-2">
              <h2 className="mb-2 text-[11px] font-black uppercase tracking-wide text-[var(--color-ink-dim)]">Brands</h2>
              <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
                {matchedBrands.map((b) => <div key={b.id} className="w-[100px] shrink-0"><BrandTile brand={b} /></div>)}
              </div>
            </section>
          )}
          {matchedProducts.length > 0 && (
            <section className="px-3 pt-4">
              <h2 className="mb-2 px-1 text-[11px] font-black uppercase tracking-wide text-[var(--color-ink-dim)]">Products</h2>
              <div className="grid grid-cols-2 gap-x-3 gap-y-5">
                {matchedProducts.map((p) => <ProductCard key={p.id} product={p} brandRating={brandsById.get(p.brandId)?.rating} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
