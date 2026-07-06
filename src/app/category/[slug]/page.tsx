import Link from "next/link";
import { notFound } from "next/navigation";
import { getMcatById, getPMcatById, getMcats, getProducts, getBrands } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductGrid from "@/components/ProductGrid";

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

  return (
    <div className="pb-6">
      <Breadcrumbs items={[{ label: pmcat?.name ?? "Home" }, { label: category.name }]} />

      <div className="px-4 pt-1 pb-3">
        <h1 className="text-lg font-black">{category.name}</h1>
        <p className="mt-1 text-[12px] font-semibold text-[var(--color-ink-dim)]">
          {brands.length} verified brands · {items.length} models
        </p>
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
    </div>
  );
}
