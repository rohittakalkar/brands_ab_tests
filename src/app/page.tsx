import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { getBrands, getMcats, getProducts, getCatalogStats } from "@/lib/data";
import BrandTile from "@/components/BrandTile";
import CategoryTile from "@/components/CategoryTile";
import ProductCard from "@/components/ProductCard";
import BannerCarousel, { Banner } from "@/components/BannerCarousel";

export default function HomePage() {
  const brands = [...getBrands()].sort((a, b) => b.rating - a.rating);
  const categories = getMcats();
  const products = getProducts();
  const stats = getCatalogStats();
  const brandsById = new Map(brands.map((b) => [b.id, b]));

  const topBrands = brands.slice(0, 8);
  const featured = products.slice(0, 8);

  const banners: Banner[] = [
    {
      href: `/category/${categories[0].id}`,
      image: products.find((p) => p.mcatId === categories[0].id)?.image ?? products[0].image,
      eyebrow: "Power, uninterrupted",
      title: `Shop ${categories[0].name} from ${stats.totalBrands} verified brands`,
      cta: "Shop Now",
    },
    {
      href: `/brand/${topBrands[0].id}`,
      image: products.find((p) => p.brandId === topBrands[0].id)?.image ?? products[1].image,
      eyebrow: "Top rated manufacturer",
      title: `${topBrands[0].name} — ${topBrands[0].rating.toFixed(1)}★ across ${topBrands[0].reviewsCount}+ reviews`,
      cta: "Explore Brand",
    },
    {
      href: "/brands",
      image: products[2].image,
      eyebrow: `${stats.totalProducts}+ models`,
      title: "Every listing GST-verified, authorized-dealer checked",
      cta: "Browse Verified Brands",
    },
  ];

  return (
    <div className="flex flex-col gap-7 pb-4">
      <BannerCarousel banners={banners} />

      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between px-4">
          <h2 className="text-[13px] font-black uppercase tracking-wide">Shop by Category</h2>
          <Link href="/brands" className="text-[11px] font-bold text-[var(--color-brand)]">See All</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-none px-4 pb-1">
          {categories.map((c) => <CategoryTile key={c.id} category={c} />)}
        </div>
      </section>

      <section className="mx-4 flex items-center gap-2.5 rounded-2xl bg-[var(--color-verified-dim)] px-4 py-3">
        <ShieldCheck className="size-5 shrink-0 text-[var(--color-verified)]" aria-hidden="true" />
        <p className="text-[12px] font-bold text-[var(--color-verified)]">
          {stats.totalBrands} verified brands sourced through authorized sellers only
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between px-4">
          <h2 className="text-[13px] font-black uppercase tracking-wide">Top Rated Brands</h2>
          <Link href="/brands" className="text-[11px] font-bold text-[var(--color-brand)]">See All</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-none px-4 pb-1">
          {topBrands.map((b) => <div key={b.id} className="w-[104px] shrink-0"><BrandTile brand={b} /></div>)}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between px-4">
          <h2 className="text-[13px] font-black uppercase tracking-wide">Trending Now</h2>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-3">
          {featured.map((p) => <ProductCard key={p.id} product={p} brandRating={brandsById.get(p.brandId)?.rating} />)}
        </div>
      </section>
    </div>
  );
}
