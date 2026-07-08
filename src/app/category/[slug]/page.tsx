import Link from "next/link";
import { notFound } from "next/navigation";
import { TrendingUp, Tags } from "lucide-react";
import { getMcatById, getPMcatById, getMcats, getProducts, getBrands } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductGrid from "@/components/ProductGrid";
import ProductCard from "@/components/ProductCard";
import BrandTile from "@/components/BrandTile";
import RecommendedCategories from "@/components/RecommendedCategories";
import SectionCard from "@/components/SectionCard";
import SectionHeading from "@/components/SectionHeading";

const TRENDING_COUNT = 10;
const TOP_BRANDS_COUNT = 8;
const CATEGORY_PREVIEW_COUNT = 10;

export function generateStaticParams() {
  return getMcats().map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = getMcatById(slug);
  return { title: cat ? `${cat.name} — Brands` : "Category — Brands" };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getMcatById(slug);
  if (!category) notFound();

  const pmcat = getPMcatById(category.pmcatId);
  const items = getProducts({ mcatId: slug });
  const brands = getBrands({ mcatId: slug });
  const brandsById = new Map(brands.map((b) => [b.id, b]));

  // Data order is treated as relevance order (same convention as the Brand MCAT pages) rather
  // than inventing a synthetic trending/sales-count field the data model doesn't have.
  const trending = items.slice(0, TRENDING_COUNT);

  const topBrands = [...brands].sort((a, b) => b.rating - a.rating).slice(0, TOP_BRANDS_COUNT);

  // Sibling categories under the same parent, each with a small product preview — brand-agnostic
  // discovery, same pattern used on the Brand MCAT pages.
  const recommendedCategories = getMcats()
    .filter((m) => m.pmcatId === category.pmcatId && m.id !== category.id)
    .map((m) => {
      const categoryProducts = getProducts({ mcatId: m.id });
      return { ...m, productCount: categoryProducts.length, previewProducts: categoryProducts.slice(0, CATEGORY_PREVIEW_COUNT) };
    })
    .filter((m) => m.productCount > 0);

  return (
    <div className="pb-6">
      <Breadcrumbs items={[{ label: pmcat?.name ?? "Home" }, { label: category.name }]} />

      <div className="px-4 pt-1 pb-3">
        <h1 className="text-lg font-black">{category.name}</h1>
        <p className="mt-1 text-[12px] font-semibold text-[var(--color-ink-dim)]">
          {brands.length} verified brands · {items.length} models
        </p>
      </div>

      {trending.length > 0 && (
        <div className="px-4 pb-3">
          <SectionCard accent="amber">
            <SectionHeading icon={TrendingUp} animation="bounce" accent="amber">Trending in {category.name}</SectionHeading>
            <div className="-mx-2 mt-1.5 flex gap-2 overflow-x-auto scrollbar-none px-2 pb-1">
              {trending.map((p) => (
                <div key={p.id} className="w-32 shrink-0">
                  <ProductCard product={p} brandRating={brandsById.get(p.brandId)?.rating} />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      <ProductGrid products={items} brandsById={brandsById} />

      <div className="px-4 pt-4">
        <Link
          href="/brands"
          className="block w-full rounded-xl border-2 border-[var(--color-ink)] py-3 text-center text-[12.5px] font-extrabold text-[var(--color-ink)]"
        >
          Prefer to shop by brand instead? →
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-2 px-4">
        {topBrands.length > 0 && (
          <SectionCard accent="rose">
            <SectionHeading icon={Tags} animation="pulse" accent="rose">Top Brands in {category.name}</SectionHeading>
            <div className="-mx-2 mt-1.5 flex gap-2 overflow-x-auto scrollbar-none px-2 pb-1">
              {topBrands.map((b) => (
                <div key={b.id} className="w-24 shrink-0">
                  <BrandTile brand={b} />
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {recommendedCategories.length > 0 && (
          <SectionCard accent="emerald">
            <RecommendedCategories categories={recommendedCategories} CardComponent={ProductCard} />
          </SectionCard>
        )}
      </div>
    </div>
  );
}
