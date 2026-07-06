import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Calendar, MapPin } from "lucide-react";
import { getBrands, getBrandById, getBrandMCats, getSuppliers } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import TrustBadge from "@/components/TrustBadge";
import BrandLogo from "@/components/BrandLogo";

export function generateStaticParams() {
  return getBrands().map((b) => ({ slug: b.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = getBrandById(slug);
  return { title: brand ? `${brand.name} — Brands` : "Brand — Brands" };
}

export default async function BrandHubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = getBrandById(slug);
  if (!brand) notFound();

  const lines = getBrandMCats({ brandId: slug });
  const sellers = getSuppliers({ brandId: slug }).slice(0, 3);

  return (
    <div className="pb-4">
      <Breadcrumbs items={[{ label: "Brands", href: "/brands" }, { label: brand.name }]} />

      <section className="bg-gradient-to-b from-[var(--color-brand-dim)] to-transparent px-4 pt-3 pb-5">
        <span className="mb-3 flex size-16 items-center justify-center overflow-hidden rounded-full bg-white p-2.5 shadow-sm">
          <BrandLogo logo={brand.logo} name={brand.name} />
        </span>
        <h1 className="text-xl font-black">{brand.name}</h1>
        <p className="mt-1 text-[13px] text-[var(--color-ink-dim)]">{brand.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {brand.verified && <TrustBadge type="verified-supplier" />}
          <TrustBadge type="manufacturer-oem" />
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[var(--color-ink-dim)]">
            <Star className="size-3 fill-[var(--color-gold)] text-[var(--color-gold)]" aria-hidden="true" /> {brand.rating.toFixed(1)} ({brand.reviewsCount}+)
          </span>
        </div>
        <div className="mt-3 flex gap-4 text-[11px] font-semibold text-[var(--color-ink-dim)]">
          <span className="flex items-center gap-1"><Calendar className="size-3" aria-hidden="true" /> Est. {brand.establishedYear}</span>
          <span className="flex items-center gap-1"><MapPin className="size-3" aria-hidden="true" /> {brand.headquarters.split(",")[0]}</span>
        </div>
      </section>

      {lines.length > 0 && (
        <section className="px-4 py-4">
          <h2 className="mb-3 text-[12px] font-black uppercase tracking-wide text-[var(--color-ink-dim)]">Shop by Product Line</h2>
          <div className="grid grid-cols-2 gap-3">
            {lines.map((line) => (
              <Link key={line.id} href={`/brand/${slug}/${line.mcatId}`} className="rounded-2xl border border-[var(--color-line)] p-3">
                <p className="text-[13px] font-extrabold">{line.name}</p>
                <p className="mt-1 line-clamp-2 text-[11px] text-[var(--color-ink-dim)]">{line.tagline}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {sellers.length > 0 && (
        <section className="px-4 pb-2">
          <h2 className="mb-3 text-[12px] font-black uppercase tracking-wide text-[var(--color-ink-dim)]">Authorized Sellers</h2>
          <div className="flex flex-col gap-2">
            {sellers.map((s) => (
              <div key={s.id} className="flex items-center gap-3 rounded-2xl border border-[var(--color-line)] p-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-2)] text-[10px] font-black text-[var(--color-ink-dim)]">
                  {s.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1 text-[11px]">
                  <p className="truncate font-extrabold">{s.name}</p>
                  <p className="text-[var(--color-ink-dim)]">{s.location} · {s.experienceYears} yrs</p>
                </div>
                {s.isAuthorizedDealer && <TrustBadge type="authorized-dealer" />}
              </div>
            ))}
          </div>
        </section>
      )}

      {lines[0] && (
        <div className="px-4 pt-3">
          <Link href={`/brand/${slug}/${lines[0].mcatId}`} className="block w-full rounded-xl bg-[var(--color-brand)] py-3.5 text-center text-sm font-extrabold text-white">
            View Full Catalog
          </Link>
        </div>
      )}
    </div>
  );
}
