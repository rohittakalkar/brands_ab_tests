import { notFound } from "next/navigation";
import { Tags } from "lucide-react";
import { loadBrandMcatContext, brandMcatStaticParams } from "@/lib/brandMcatContext";
import { getContactPhoneByProductId } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import BrandLogo from "@/components/BrandLogo";
import ProductGrid from "@/components/ProductGrid";
import ProductCard from "@/components/ProductCard";
import BrandTile from "@/components/BrandTile";
import RecommendedCategories from "@/components/RecommendedCategories";
import SectionCard from "@/components/SectionCard";
import SectionHeading from "@/components/SectionHeading";
import StickyBuyBar from "@/components/StickyBuyBar";

const DEFAULT_VISIBLE_PRODUCTS = 10;
const EXPLORE_BRANDS_COUNT = 8;

export function generateStaticParams() {
  return brandMcatStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; category: string }> }) {
  const { slug, category } = await params;
  const ctx = loadBrandMcatContext(slug, category);
  return { title: ctx ? `${ctx.brand.name} ${ctx.cat.name} — Brands` : "Brand Catalog — Brands" };
}

export default async function BrandMcatPage({ params }: { params: Promise<{ slug: string; category: string }> }) {
  const { slug, category } = await params;
  const ctx = loadBrandMcatContext(slug, category);
  if (!ctx) notFound();
  const { brand, cat, pcat, products, otherBrandsInCategory, crossBrandProducts } = ctx;

  const brandsById = new Map([[brand.id, brand]]);
  const otherBrands = otherBrandsInCategory.slice(0, EXPLORE_BRANDS_COUNT);
  // The MCat name shown here always leads with the brand's short name (e.g. "KEI Armoured
  // Cable"), matching the tiles on the PMcat page rather than a bare, brand-less category name.
  const mcatDisplayName = `${brand.name.split(" ")[0]} ${cat.name}`;
  const contactPhoneByProductId = getContactPhoneByProductId([...products, ...crossBrandProducts]);

  return (
    <div className="pb-28">
      <Breadcrumbs
        items={[
          ...(pcat ? [{ label: pcat.name }] : []),
          { label: brand.name, href: `/brand/${slug}` },
          { label: cat.name },
        ]}
      />

      <div className="mx-4 mt-1 mb-1.5 flex items-center gap-2 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-2.5 py-2 shadow-sm">
        <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-[var(--color-line)] p-1.5">
          <BrandLogo logo={brand.logo} name={brand.name} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[9.5px] font-bold uppercase tracking-wide text-[var(--color-ink-faint)]">{brand.name}</p>
          <h1 className="text-[14px] font-black leading-tight text-[var(--color-ink)] text-balance">{mcatDisplayName}</h1>
        </div>
        {products[0] && (
          <span className="flex shrink-0 flex-col items-center gap-1">
            <img
              src={products[0].image}
              alt=""
              className="size-11 rounded-lg object-cover ring-1 ring-[var(--color-line)]"
              referrerPolicy="no-referrer"
              aria-hidden="true"
            />
            <span className="whitespace-nowrap text-[7.5px] font-bold text-black">
              {products.length} models
            </span>
          </span>
        )}
      </div>

      <ProductGrid products={products} brandsById={brandsById} pageSize={DEFAULT_VISIBLE_PRODUCTS} contactPhoneByProductId={contactPhoneByProductId} />

      <div className="mt-2 flex flex-col gap-2 px-4">
        {otherBrands.length > 0 && (
          <SectionCard accent="rose" bordered={false}>
            <SectionHeading icon={Tags} animation="pulse" accent="rose">Explore Brands</SectionHeading>
            <div className="-mx-2 mt-1.5 flex gap-2 overflow-x-auto scrollbar-none px-2 pb-1">
              {otherBrands.map((b) => (
                <div key={b.id} className="w-24 shrink-0">
                  <BrandTile brand={b} href={`/brand/${b.id}/${category}`} />
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {crossBrandProducts.length > 0 && (
          <SectionCard accent="emerald" bordered={false}>
            <RecommendedCategories products={crossBrandProducts} CardComponent={ProductCard} contactPhoneByProductId={contactPhoneByProductId} />
          </SectionCard>
        )}
      </div>

      <StickyBuyBar productName={mcatDisplayName} sellerName={`an authorized ${brand.name} reseller`} />
    </div>
  );
}
