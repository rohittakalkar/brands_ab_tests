import Link from "next/link";
import { getBrands, getMcats, getPMcats, getProducts, getContactPhoneByProductId } from "@/lib/data";
import BrandTile from "@/components/BrandTile";
import CategoryTile from "@/components/CategoryTile";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const brands = [...getBrands()].sort((a, b) => b.rating - a.rating);
  const mcats = getMcats();
  // "Explore Category" surfaces the broadest real PMcats (e.g. "Pumps & Fluid Handling")
  // rather than every narrow MCat — each links through to its first, most representative
  // MCat since there's no dedicated PMcat listing page.
  const pmcats = getPMcats()
    .map((p) => ({ ...p, firstMcatId: mcats.find((m) => m.pmcatId === p.id)?.id }))
    .filter((p): p is typeof p & { firstMcatId: string } => Boolean(p.firstMcatId))
    .sort((a, b) => (a.id === "cables-switchgear" ? -1 : b.id === "cables-switchgear" ? 1 : 0));
  const products = getProducts();
  const brandsById = new Map(brands.map((b) => [b.id, b]));

  // KEI leads the strip, followed by other real-logo brands (no text-initial placeholders).
  const topBrands = [...brands]
    .sort((a, b) => (a.id === "kei" ? -1 : b.id === "kei" ? 1 : 0))
    .filter((b) => b.id === "kei" || b.logo.startsWith("http"))
    .slice(0, 8);
  const featured = products.filter((p) => p.brandId === "kei" && p.name.includes("Armoured"));
  const contactPhoneByProductId = getContactPhoneByProductId(featured);

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
          {pmcats.map((c) => <CategoryTile key={c.id} category={c} href={`/pcategory/${c.id}`} />)}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between px-4">
          <h2 className="text-[13px] font-black uppercase tracking-wide">Explore Brands</h2>
          <Link href="/brands" className="text-[11px] font-bold text-[var(--color-brand)]">See All</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-none px-4 pb-1">
          {topBrands.map((b) => <div key={b.id} className="w-[104px] shrink-0"><BrandTile brand={b} /></div>)}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between px-4">
          <h2 className="text-[13px] font-black uppercase tracking-wide">Explore Products</h2>
        </div>
        <div className="flex flex-col gap-3 px-3">
          {featured.map((p) => <ProductCard key={p.id} product={p} brand={brandsById.get(p.brandId)} contactPhone={contactPhoneByProductId[p.id]} />)}
        </div>
      </section>
    </div>
  );
}
