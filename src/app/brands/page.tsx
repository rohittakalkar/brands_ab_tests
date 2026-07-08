import Link from "next/link";
import { TrendingUp, ShieldCheck, Users, Clock } from "lucide-react";
import { getBrands, getBrandById, getMcats, getPMcats, FASTEST_GROWING_BRANDS, MARKETPLACE_METRICS } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import BrandLogo from "@/components/BrandLogo";
import BrandDirectory from "@/components/BrandDirectory";
import SectionCard from "@/components/SectionCard";
import SectionHeading from "@/components/SectionHeading";

export const metadata = { title: "All Brands — Brands" };

export default function BrandDirectoryPage() {
  const brands = [...getBrands()].sort((a, b) => b.rating - a.rating);
  const mcats = getMcats();
  const pcats = getPMcats().filter((p) => mcats.some((m) => m.pmcatId === p.id && getBrands({ mcatId: m.id }).length > 0));
  const mcatIdsByPcatId = Object.fromEntries(pcats.map((p) => [p.id, mcats.filter((m) => m.pmcatId === p.id).map((m) => m.id)]));

  // Real growth figures matched to their actual brand record — skipped if a name in the
  // reference list doesn't resolve to a real brand, rather than showing a broken tile.
  const fastestGrowing = FASTEST_GROWING_BRANDS
    .map((g) => ({ ...g, brand: getBrandById(g.name.toLowerCase()) }))
    .filter((g): g is typeof g & { brand: NonNullable<typeof g.brand> } => Boolean(g.brand));

  const avgRating = brands.reduce((sum, b) => sum + b.rating, 0) / brands.length;

  return (
    <div className="pb-6">
      <Breadcrumbs items={[{ label: "Brands" }]} />

      <div className="relative mx-4 mt-1 mb-2 overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-ink)] px-4 py-5">
        <TrendingUp className="pointer-events-none absolute -right-3 -top-3 size-24 text-white/10" aria-hidden="true" />
        <p className="relative text-[10px] font-black uppercase tracking-[0.15em] text-white/70">India&rsquo;s Verified Manufacturers</p>
        <h1 className="relative mt-1 text-2xl font-black leading-tight text-white text-balance">{brands.length} Brands. One Trusted Marketplace.</h1>
        <div className="relative mt-3 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10.5px] font-bold text-white backdrop-blur">
            <Users className="size-3.5" aria-hidden="true" />
            {MARKETPLACE_METRICS.activeBuyers} Active Buyers
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10.5px] font-bold text-white backdrop-blur">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            {avgRating.toFixed(1)}★ Avg. Rating
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10.5px] font-bold text-white backdrop-blur">
            <Clock className="size-3.5" aria-hidden="true" />
            {MARKETPLACE_METRICS.avgResponseTime} Avg. Response
          </span>
        </div>
      </div>

      {fastestGrowing.length > 0 && (
        <div className="px-4 pb-2">
          <SectionCard accent="rose" bordered={false}>
            <SectionHeading icon={TrendingUp} animation="bounce" accent="rose">Fastest Growing Brands</SectionHeading>
            <div className="-mx-2 mt-2 flex gap-2 overflow-x-auto scrollbar-none px-2 pb-1">
              {fastestGrowing.map(({ brand, growth }) => (
                <Link key={brand.id} href={`/brand/${brand.id}`} className="flex w-24 shrink-0 flex-col items-center gap-1.5 rounded-2xl border border-[var(--color-line)] p-2.5 text-center">
                  <span className="flex size-11 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-[var(--color-line)] p-1">
                    <BrandLogo logo={brand.logo} name={brand.name} />
                  </span>
                  <span className="line-clamp-1 text-[10.5px] font-bold leading-tight">{brand.name}</span>
                  <span className="rounded-full bg-[var(--color-verified-dim)] px-1.5 py-0.5 text-[9px] font-black text-[var(--color-verified)]">
                    ↑ {growth}
                  </span>
                </Link>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      <BrandDirectory brands={brands} pcats={pcats} mcatIdsByPcatId={mcatIdsByPcatId} />
    </div>
  );
}
