import Link from "next/link";
import { notFound } from "next/navigation";
import { Tags, ShieldCheck, Boxes } from "lucide-react";
import { getMcatById, getPMcatById, getMcats, getProducts, getBrands } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import CategoryIcon from "@/components/CategoryIcon";
import ProductGrid from "@/components/ProductGrid";
import ProductCard from "@/components/ProductCard";
import BrandTile from "@/components/BrandTile";
import RecommendedCategories from "@/components/RecommendedCategories";
import SectionCard from "@/components/SectionCard";
import SectionHeading from "@/components/SectionHeading";

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

      <div className="relative mx-4 mt-1 mb-3 overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-ink)] px-4 py-5">
        <CategoryIcon
          icon={category.icon}
          className="pointer-events-none absolute -right-3 -top-3 size-24 text-white/10"
        />
        <h1 className="relative text-xl font-black text-white text-balance">{category.name}</h1>
        <div className="relative mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            {brands.length} verified brands
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
            <Boxes className="size-3.5" aria-hidden="true" />
            {items.length} models
          </span>
        </div>
      </div>

      <ProductGrid products={items} brandsById={brandsById} />

      <div className="px-4 pt-4">
        <Link
          href="/brands"
          className="block w-full rounded-xl border-2 border-[var(--color-ink)] py-3 text-center text-[12.5px] font-extrabold text-[var(--color-ink)]"
        >
          Prefer to shop by brand instead? →
        </Link>
      </div>

      <div className="mt-2 flex flex-col gap-2 px-4">
        {topBrands.length > 0 && (
          <SectionCard accent="rose" bordered={false}>
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
          <SectionCard accent="emerald" bordered={false}>
            <RecommendedCategories categories={recommendedCategories} CardComponent={ProductCard} />
          </SectionCard>
        )}
      </div>
    </div>
  );
}
