import Link from "next/link";
import { getBrands, getMcats, getPMcats, getProducts } from "@/lib/data";
import BrandTile from "@/components/BrandTile";
import CategoryTile from "@/components/CategoryTile";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const brands = [...getBrands()].sort((a, b) => b.rating - a.rating);
  const mcats = getMcats();
  // "Explore Category" surfaces the broader parent categories (e.g. "Pumps & Fluid Handling")
  // rather than every narrow micro-category — each links through to its first, most
  // representative sub-category since there's no dedicated parent-category listing page.
  const pcats = getPMcats()
    .map((p) => ({ ...p, firstMcatId: mcats.find((m) => m.pmcatId === p.id)?.id }))
    .filter((p): p is typeof p & { firstMcatId: string } => Boolean(p.firstMcatId));
  const products = getProducts();
  const brandsById = new Map(brands.map((b) => [b.id, b]));

  const topBrands = brands.slice(0, 8);
  const featured = products.slice(0, 8);

  return (
    <div className="flex flex-col gap-7 pb-4">
      <Link href="/brands" className="mx-4 mt-1.5 block overflow-hidden rounded-xl">
        <div className="relative aspect-[21/6] w-full">
          <img
            src="https://utils.imimg.com/imsrchui/imgs/Investor-banner.webp"
            alt="IndiaMART kaam yahi banta hai"
            className="absolute inset-0 h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </Link>

      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between px-4">
          <h2 className="text-[13px] font-black uppercase tracking-wide">Explore Category</h2>
          <Link href="/categories" className="text-[11px] font-bold text-[var(--color-brand)]">See All</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-none px-4 pb-1">
          {pcats.map((c) => <CategoryTile key={c.id} category={c} href={`/pcategory/${c.id}`} />)}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between px-4">
          <h2 className="text-[13px] font-black uppercase tracking-wide">Explore Brands</h2>
          <Link href="/categories" className="text-[11px] font-bold text-[var(--color-brand)]">See All</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-none px-4 pb-1">
          {topBrands.map((b) => <div key={b.id} className="w-[104px] shrink-0"><BrandTile brand={b} /></div>)}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between px-4">
          <h2 className="text-[13px] font-black uppercase tracking-wide">Explore Products</h2>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-3">
          {featured.map((p) => <ProductCard key={p.id} product={p} brandRating={brandsById.get(p.brandId)?.rating} />)}
        </div>
      </section>
    </div>
  );
}
