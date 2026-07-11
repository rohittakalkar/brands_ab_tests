import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, MapPin } from "lucide-react";
import { getBrands, getBrandById, getBrandMCats } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";

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

  return (
    <div className="pb-4">
      <Breadcrumbs items={[{ label: "Brands", href: "/brands" }, { label: brand.name }]} />

      {brand.id === "kei" && (
        <Link href={`/brand/${slug}/${lines[0]?.mcatId ?? ""}`} className="block">
          <img
            src="https://i.ibb.co/fVPDWxwT/kei-banner.png"
            alt="KEI Wires & Cables — World Class Quality Wires"
            className="w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </Link>
      )}

      <section className="bg-gradient-to-b from-[var(--color-brand-dim)] to-transparent px-4 pt-3 pb-5">
        <div className="flex gap-4 text-[11px] font-semibold text-[var(--color-ink-dim)]">
          <span className="flex items-center gap-1"><Calendar className="size-3" aria-hidden="true" /> Est. {brand.establishedYear}</span>
          <span className="flex items-center gap-1"><MapPin className="size-3" aria-hidden="true" /> {brand.headquarters.split(",")[0]}</span>
        </div>
      </section>

      {lines.length > 0 && (
        <section className="px-4 py-4">
          <h2 className="mb-3 text-[12px] font-black uppercase tracking-wide text-[var(--color-ink-dim)]">Explore Category</h2>
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
