import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Clock, ChevronDown } from "lucide-react";
import { getProducts, getProductById, getBrandById, getMcatById, getBrandMCatById, getSuppliers } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import TrustBadge from "@/components/TrustBadge";
import ProductCard from "@/components/ProductCard";
import StickyBuyBar from "@/components/StickyBuyBar";

export function generateStaticParams() {
  return getProducts().map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);
  return { title: product ? `${product.name} — Brands` : "Product — Brands" };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const brand = getBrandById(product.brandId);
  const category = getMcatById(product.mcatId);
  const brandMCat = product.brandMCatId ? getBrandMCatById(product.brandMCatId) : undefined;
  const suppliers = getSuppliers({ productId: product.id });
  const related = product.brandMCatId
    ? getProducts({ brandMCatId: product.brandMCatId }).filter((p) => p.id !== id).slice(0, 4)
    : [];

  return (
    <div className="pb-28">
      <Breadcrumbs
        items={[
          ...(category ? [{ label: category.name, href: `/category/${category.id}` }] : []),
          ...(brand ? [{ label: brand.name, href: `/brand/${brand.id}` }] : []),
          { label: product.name },
        ]}
      />

      {/* Full-bleed hero image — the single biggest visual lever on this page. */}
      <div className="relative mx-4 mt-1 aspect-square overflow-hidden rounded-2xl bg-[var(--color-surface-2)]">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          <TrustBadge type="manufacturer-oem" />
          {brand?.verified && <TrustBadge type="verified-supplier" />}
          {product.certifications && product.certifications.length > 0 && <TrustBadge type="certified-product" />}
        </div>
      </div>

      <div className="px-4 pt-4">
        {brand && (
          <Link href={`/brand/${brand.id}`} className="text-[11px] font-black uppercase tracking-wide text-[var(--color-brand)]">
            {brand.name}
          </Link>
        )}
        <h1 className="mt-1 text-lg font-black leading-snug">{product.name}</h1>
        <p className="mt-1 font-mono text-[11px] text-[var(--color-ink-faint)]">{product.modelNumber}</p>

        <div className="mt-3 flex items-end justify-between rounded-2xl bg-[var(--color-surface-2)] p-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--color-ink-faint)]">Price</p>
            <p className="text-xl font-black">{product.priceRange}</p>
          </div>
          <div className="text-right text-[11px] text-[var(--color-ink-dim)]">
            <p className="font-bold">MOQ: {product.moq}</p>
            <p>{product.deliveryTime}</p>
          </div>
        </div>

        <details className="group mt-4 rounded-2xl border border-[var(--color-line)] open:pb-2">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5 text-[13px] font-extrabold">
            Specifications
            <ChevronDown className="size-4 text-[var(--color-ink-faint)] transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <dl className="px-4 pb-2 text-[12.5px]">
            {Object.entries(product.specifications).map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-[var(--color-line)] py-2 last:border-0">
                <dt className="text-[var(--color-ink-dim)]">{k}</dt>
                <dd className="font-bold">{v}</dd>
              </div>
            ))}
          </dl>
        </details>

        {product.features.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.features.slice(0, 4).map((f) => (
              <span key={f} className="rounded-full bg-[var(--color-brand-dim)] px-2.5 py-1 text-[10.5px] font-bold text-[var(--color-brand-ink)]">{f}</span>
            ))}
          </div>
        )}

        {suppliers.length > 0 && (
          <div className="mt-5 rounded-2xl border border-[var(--color-line)] p-3.5">
            <p className="mb-2 text-[10px] font-black uppercase tracking-wide text-[var(--color-ink-faint)]">Sold by</p>
            {suppliers.slice(0, 1).map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-2)] text-[10px] font-black text-[var(--color-ink-dim)]">
                  {s.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12.5px] font-extrabold">{s.name}</p>
                  <p className="flex items-center gap-1 text-[10.5px] text-[var(--color-ink-dim)]">
                    <MapPin className="size-2.5" aria-hidden="true" /> {s.location}
                  </p>
                </div>
                {s.isAuthorizedDealer && <TrustBadge type="authorized-dealer" />}
              </div>
            ))}
            <p className="mt-2 flex items-center gap-1 text-[10.5px] text-[var(--color-ink-faint)]">
              <Clock className="size-3" aria-hidden="true" /> Responds in {suppliers[0].responseTime} · {suppliers[0].responseRate}% reply rate
            </p>
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-3 text-[12px] font-black uppercase tracking-wide text-[var(--color-ink-dim)]">
              More from {brandMCat?.name ?? brand?.name}
            </h2>
            <div className="grid grid-cols-2 gap-x-3 gap-y-5">
              {related.map((p) => <ProductCard key={p.id} product={p} brandRating={brand?.rating} />)}
            </div>
          </div>
        )}
      </div>

      <StickyBuyBar productName={product.name} sellerName={suppliers[0]?.name ?? `an authorized ${brand?.name ?? "seller"}`} />
    </div>
  );
}
