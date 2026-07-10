import { notFound } from "next/navigation";
import Link from "next/link";
import { Tags, ShieldCheck, Boxes, Star } from "lucide-react";
import { getMcatById, getPMcatById, getMcats, getMcatVariants, getProducts, getBrands, getBrandById } from "@/lib/data";
import { diversifyByKey } from "@/lib/diversify";
import Breadcrumbs from "@/components/Breadcrumbs";
import CategoryIcon from "@/components/CategoryIcon";
import BrandLogo from "@/components/BrandLogo";
import ProductGrid from "@/components/ProductGrid";
import ProductCard from "@/components/ProductCard";
import BrandTile from "@/components/BrandTile";
import RecommendedCategories from "@/components/RecommendedCategories";
import SectionCard from "@/components/SectionCard";
import SectionHeading from "@/components/SectionHeading";

const TOP_BRANDS_COUNT = 8;
const RECOMMENDED_CATEGORY_PRODUCTS_COUNT = 10;

export function generateStaticParams() {
  return getMcats().map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = getMcatById(slug);
  return { title: cat ? `${cat.name} — Brands` : "Category — Brands" };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  // Same page, two entry points: browsed generally (no brand) vs. arrived at from a specific
  // brand's own mcat tile (?brand=). The layout stays identical either way — only the hero and
  // the Top Brands section change — so a buyer doesn't get a jarringly different page depending
  // on how they got here.
  searchParams: Promise<{ brand?: string; mcat?: string }>;
}) {
  const { slug } = await params;
  const { brand: brandId, mcat: activeMcatId } = await searchParams;
  const category = getMcatById(slug);
  if (!category) notFound();

  const activeBrand = brandId ? getBrandById(brandId) : undefined;

  const pcat = getPMcatById(category.pmcatId);
  const categoryItems = getProducts({ mcatId: slug });
  let items = activeBrand ? categoryItems.filter((p) => p.brandId === activeBrand.id) : categoryItems;
  if (activeMcatId) items = items.filter((p) => p.subMcatId === activeMcatId);
  const brands = getBrands({ mcatId: slug });
  const brandsById = new Map(brands.map((b) => [b.id, b]));

  const topBrands = [...brands].sort((a, b) => b.rating - a.rating).slice(0, TOP_BRANDS_COUNT);

  // Real MCatVariant drill-down (e.g. "Aluminium Armoured Cable"), only populated for a few
  // MCats so far — grouped straight from `Product.subMcatId` rather than a separate fetch.
  // When an MCat has variants, this page lists them first — a buyer picks the variant before
  // seeing products, matching the real IndiaMART parent-category page rather than dumping
  // every product from every variant into one flat grid.
  const variants = getMcatVariants({ mcatId: slug });
  const mcatTiles = variants
    .map((v) => ({ ...v, mcatProducts: categoryItems.filter((p) => p.subMcatId === v.id) }))
    .filter((v) => v.mcatProducts.length > 0);
  const showMcatList = mcatTiles.length > 0 && !activeMcatId;

  // "You May Be Interested In" — products from sibling categories under the same PMcat,
  // diversified across those categories so no single sibling crowds out the others. Same
  // pattern used on the BrandMcat pages.
  const siblingCategoryIds = getMcats()
    .filter((m) => m.pmcatId === category.pmcatId && m.id !== category.id)
    .map((m) => m.id);
  const recommendedProducts = diversifyByKey(
    siblingCategoryIds.flatMap((id) => getProducts({ mcatId: id })),
    (p) => p.mcatId,
    RECOMMENDED_CATEGORY_PRODUCTS_COUNT
  );

  return (
    <div className="pb-6">
      <Breadcrumbs
        items={[
          { label: pcat?.name ?? "Home" },
          ...(activeBrand ? [{ label: activeBrand.name, href: `/brand/${activeBrand.id}` }] : []),
          { label: category.name },
        ]}
      />

      {activeBrand ? (
        <div className="relative mx-4 mt-1 mb-2 overflow-hidden rounded-xl bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-ink)] px-3 py-2.5">
          <div className="relative flex items-center gap-2.5">
            <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-white/40 p-1">
              <BrandLogo logo={activeBrand.logo} name={activeBrand.name} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-bold uppercase tracking-wide text-white/70">{activeBrand.name}</p>
              <h1 className="text-[15px] font-black text-white text-balance">{category.name}</h1>
            </div>
          </div>
          <div className="relative mt-2 flex flex-wrap items-center gap-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[9.5px] font-bold text-white backdrop-blur">
              <Star className="size-3 fill-current" aria-hidden="true" />
              {activeBrand.rating.toFixed(1)} Rating
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[9.5px] font-bold text-white backdrop-blur">
              <Boxes className="size-3" aria-hidden="true" />
              {items.length} models
            </span>
          </div>
        </div>
      ) : (
        <div className="relative mx-4 mt-1 mb-2 overflow-hidden rounded-xl bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-ink)] px-3 py-2.5">
          <CategoryIcon
            icon={category.icon}
            className="pointer-events-none absolute -right-2 -top-2 size-14 text-white/10"
          />
          <h1 className="relative text-[15px] font-black text-white text-balance">{category.name}</h1>
          <div className="relative mt-1 flex flex-wrap items-center gap-1">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[9.5px] font-bold text-white backdrop-blur">
              <ShieldCheck className="size-3" aria-hidden="true" />
              {brands.length} verified brands
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[9.5px] font-bold text-white backdrop-blur">
              <Boxes className="size-3" aria-hidden="true" />
              {items.length} models
            </span>
          </div>
        </div>
      )}

      {showMcatList ? (
        <div className="grid grid-cols-2 gap-3 px-4">
          {mcatTiles.map((m) => (
            <Link
              key={m.id}
              href={`/category/${slug}?mcat=${m.id}${activeBrand ? `&brand=${activeBrand.id}` : ""}`}
              className="flex flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] shadow-sm"
            >
              <div className="aspect-[8/5] w-full overflow-hidden bg-[var(--color-surface-2)]">
                <img src={m.mcatProducts[0].image} alt={m.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
              </div>
              <div className="flex flex-col gap-0.5 p-2.5">
                <p className="text-[12.5px] font-bold leading-tight text-[var(--color-ink)]">{m.name}</p>
                <p className="text-[10.5px] font-semibold text-[var(--color-ink-faint)]">{m.mcatProducts.length} model{m.mcatProducts.length === 1 ? "" : "s"}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <>
          {mcatTiles.length > 0 && (
            <div className="mb-2 flex items-center gap-2 px-4 pb-1">
              <Link href={`/category/${slug}${activeBrand ? `?brand=${activeBrand.id}` : ""}`} className="text-[12px] font-bold text-[var(--color-brand)]">
                ← All types
              </Link>
              <span className="text-[12px] font-semibold text-[var(--color-ink-dim)]">
                {mcatTiles.find((m) => m.id === activeMcatId)?.name}
              </span>
            </div>
          )}
          <ProductGrid products={items} brandsById={brandsById} />
        </>
      )}

      <div className="mt-2 flex flex-col gap-2 px-4">
        {/* Redundant once the page is already scoped to one brand. */}
        {!activeBrand && topBrands.length > 0 && (
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

        {recommendedProducts.length > 0 && (
          <SectionCard accent="emerald" bordered={false}>
            <RecommendedCategories products={recommendedProducts} CardComponent={ProductCard} />
          </SectionCard>
        )}
      </div>
    </div>
  );
}
