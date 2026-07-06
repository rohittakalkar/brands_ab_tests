import { notFound } from "next/navigation";
import { getBrandById, getMcatById, getBrandMCats, getProducts, getBrands } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductGrid from "@/components/ProductGrid";
import StickyBuyBar from "@/components/StickyBuyBar";

export function generateStaticParams() {
  const pairs: { slug: string; category: string }[] = [];
  for (const b of getBrands()) {
    for (const line of getBrandMCats({ brandId: b.id })) pairs.push({ slug: b.id, category: line.mcatId });
  }
  return pairs;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; category: string }> }) {
  const { slug, category } = await params;
  const brand = getBrandById(slug);
  const cat = getMcatById(category);
  return { title: brand && cat ? `${brand.name} ${cat.name} — Brands` : "Brand Catalog — Brands" };
}

export default async function BrandMcatPage({ params }: { params: Promise<{ slug: string; category: string }> }) {
  const { slug, category } = await params;
  const brand = getBrandById(slug);
  const cat = getMcatById(category);
  if (!brand || !cat) notFound();

  const [line] = getBrandMCats({ brandId: slug, mcatId: category });
  if (!line) notFound();

  const items = getProducts({ brandMCatId: line.id });
  const brandsById = new Map([[brand.id, brand]]);

  return (
    <div className="pb-28">
      <Breadcrumbs items={[{ label: "Brands", href: "/brands" }, { label: brand.name, href: `/brand/${slug}` }, { label: cat.name }]} />

      <div className="px-4 pt-1 pb-3">
        <h1 className="text-lg font-black">{line.name}</h1>
        <p className="mt-1 text-[12px] text-[var(--color-ink-dim)]">{line.tagline}</p>
      </div>

      <ProductGrid products={items} brandsById={brandsById} />

      <StickyBuyBar productName={line.name} sellerName={`an authorized ${brand.name} reseller`} />
    </div>
  );
}
