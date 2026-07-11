import { notFound } from "next/navigation";
import Link from "next/link";
import { getMcatById, getPMcatById, getMcats, getMcatVariants, getProducts, getBrands, getBrandById, getContactPhoneByProductId } from "@/lib/data";
import { diversifyByKey } from "@/lib/diversify";
import Breadcrumbs from "@/components/Breadcrumbs";
import BrandLogo from "@/components/BrandLogo";
import ProductGrid from "@/components/ProductGrid";
import ProductCard from "@/components/ProductCard";
import RecommendedCategories from "@/components/RecommendedCategories";
import SectionCard from "@/components/SectionCard";

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
  searchParams: Promise<{ brand?: string; mcat?: string }>;
}) {
  const { slug } = await params;
  const { brand: brandId, mcat: activeMcatId } = await searchParams;
  const category = getMcatById(slug);
  if (!category) notFound();

  // Mirrors the PMcat page this MCat is reached from: "Explore by Brands" is the first
  // section, and — matching that page's own default — KEI leads the strip and is selected by
  // default (falling back to the top-rated brand if KEI doesn't carry this particular MCat),
  // so a buyer lands straight on a real brand's products instead of an unscoped listing.
  const brands = [...getBrands({ mcatId: slug })].sort((a, b) => (a.id === "kei" ? -1 : b.id === "kei" ? 1 : b.rating - a.rating));
  const brandsById = new Map(brands.map((b) => [b.id, b]));
  const defaultBrandId = brands.find((b) => b.id === "kei")?.id ?? brands[0]?.id;
  const effectiveBrandId = brandId ?? defaultBrandId;
  const activeBrand = effectiveBrandId ? getBrandById(effectiveBrandId) : undefined;

  const pcat = getPMcatById(category.pmcatId);
  const categoryItems = getProducts({ mcatId: slug });
  const brandItems = activeBrand ? categoryItems.filter((p) => p.brandId === activeBrand.id) : categoryItems;
  const items = activeMcatId ? brandItems.filter((p) => p.subMcatId === activeMcatId) : brandItems;

  // Real MCatVariant names (e.g. "Aluminium Armoured Cable"), only populated for a few MCats
  // so far — used to label the active variant filter when one is applied via ?mcat=, but the
  // page always shows products directly rather than gating behind a variant-picker screen.
  const variants = getMcatVariants({ mcatId: slug });
  const mcatTiles = variants
    .map((v) => ({ ...v, mcatProducts: brandItems.filter((p) => p.subMcatId === v.id) }))
    .filter((v) => v.mcatProducts.length > 0);

  // "You May Be Interested In" — this same MCat's products from every brand *other* than the
  // one selected in "Explore by Brands", diversified across brands so no single other brand
  // crowds out the rest. Same pattern used on the BrandMcat page.
  const recommendedProducts = diversifyByKey(
    categoryItems.filter((p) => p.brandId !== activeBrand?.id),
    (p) => p.brandId,
    RECOMMENDED_CATEGORY_PRODUCTS_COUNT
  );

  const contactPhoneByProductId = getContactPhoneByProductId(categoryItems);

  return (
    <div className="pb-6">
      <Breadcrumbs
        items={[
          { label: pcat?.name ?? "Home" },
          ...(activeBrand ? [{ label: activeBrand.name, href: `/brand/${activeBrand.id}` }] : []),
          { label: category.name },
        ]}
      />

      <div className="px-4 pt-1 pb-3">
        <h1 className="text-lg font-black">{category.name}</h1>
        <p className="mt-1 text-[12px] font-semibold text-[var(--color-ink-dim)]">{brands.length} verified brands</p>
      </div>

      {brands.length > 0 && (
        <div className="mx-4 rounded-2xl border border-[var(--color-line)] p-4">
          <h2 className="mb-3 text-[13px] font-black text-[var(--color-ink)]">Explore by Brands</h2>
          <div className="-mx-1 flex gap-3 overflow-x-auto scrollbar-none px-1 pb-1">
            {brands.map((b) => {
              const active = b.id === activeBrand?.id;
              return (
                <Link
                  key={b.id}
                  href={`/category/${slug}?brand=${b.id}`}
                  className={`flex w-[88px] shrink-0 flex-col items-center gap-2 rounded-2xl border p-3 text-center shadow-sm transition-colors ${
                    active ? "border-[var(--color-brand)] bg-[var(--color-brand-dim)]" : "border-[var(--color-line)] bg-[var(--color-surface)]"
                  }`}
                >
                  <span className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-[var(--color-line)] p-1.5">
                    <BrandLogo logo={b.logo} name={b.name} />
                  </span>
                  <span className="text-[11px] font-bold leading-tight line-clamp-2">{b.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-4">
        {activeMcatId && mcatTiles.length > 0 && (
          <div className="mb-2 flex items-center gap-2 px-4 pb-1">
            <Link href={`/category/${slug}${activeBrand ? `?brand=${activeBrand.id}` : ""}`} className="text-[12px] font-bold text-[var(--color-brand)]">
              ← All types
            </Link>
            <span className="text-[12px] font-semibold text-[var(--color-ink-dim)]">
              {mcatTiles.find((m) => m.id === activeMcatId)?.name}
            </span>
          </div>
        )}
        <ProductGrid products={items} brandsById={brandsById} contactPhoneByProductId={contactPhoneByProductId} />
      </div>

      {recommendedProducts.length > 0 && (
        <div className="mt-2 px-4">
          <SectionCard accent="emerald" bordered={false}>
            <RecommendedCategories products={recommendedProducts} CardComponent={ProductCard} contactPhoneByProductId={contactPhoneByProductId} />
          </SectionCard>
        </div>
      )}
    </div>
  );
}
