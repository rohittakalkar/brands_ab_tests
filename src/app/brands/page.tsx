import Link from "next/link";
import { Star } from "lucide-react";
import { getBrands, getMcatById } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import TrustBadge from "@/components/TrustBadge";
import BrandLogo from "@/components/BrandLogo";

export const metadata = { title: "All Brands — Brands" };

export default function BrandDirectoryPage() {
  const brands = [...getBrands()].sort((a, b) => b.rating - a.rating);

  return (
    <div className="pb-4">
      <Breadcrumbs items={[{ label: "Brands" }]} />
      <div className="px-4 pt-2 pb-4">
        <h1 className="text-lg font-black">Verified Brands</h1>
        <p className="mt-1 text-[12px] font-semibold text-[var(--color-ink-dim)]">{brands.length} manufacturers, best-rated first.</p>
      </div>
      <div className="flex flex-col gap-2.5 px-4">
        {brands.map((b) => {
          const primaryCategory = getMcatById(b.mcatId);
          return (
            <Link key={b.id} href={`/brand/${b.id}`} className="flex items-start gap-3 rounded-2xl border border-[var(--color-line)] p-3">
              <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-[var(--color-line)] p-1.5">
                <BrandLogo logo={b.logo} name={b.name} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-extrabold">{b.name}</p>
                <p className="mt-0.5 line-clamp-1 text-[11px] text-[var(--color-ink-dim)]">{b.description}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {b.verified && <TrustBadge type="verified-supplier" />}
                  {primaryCategory && <span className="text-[10px] font-bold text-[var(--color-ink-faint)]">{primaryCategory.name}</span>}
                </div>
              </div>
              <span className="flex shrink-0 items-center gap-0.5 text-[12px] font-black text-[var(--color-ink)]">
                <Star className="size-3 fill-[var(--color-gold)] text-[var(--color-gold)]" aria-hidden="true" />
                {b.rating.toFixed(1)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
