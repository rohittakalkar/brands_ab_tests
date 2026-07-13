import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Layers, Star, PlayCircle } from "lucide-react";
import {
  getBrands,
  getBrandById,
  getBrandMCats,
  getProducts,
  getContactPhoneByProductId,
  getBrandContactPhone,
  KEI_ABOUT,
  KEI_PHOTOS,
  KEI_VIDEO_ID,
  KEI_REVIEWS_SUMMARY,
  KEI_REVIEWS,
} from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductGrid from "@/components/ProductGrid";
import SectionCard from "@/components/SectionCard";
import SectionHeading from "@/components/SectionHeading";
import BrandTabs from "@/components/BrandTabs";
import StickyContactBar from "@/components/StickyContactBar";

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
  const productsByLine = lines.map((line) => ({ line, products: getProducts({ brandMCatId: line.id }) }));
  const contactPhoneByProductId = getContactPhoneByProductId(productsByLine.flatMap((l) => l.products));
  const brandsById = new Map([[brand.id, brand]]);
  const brandContactPhone = getBrandContactPhone(slug);
  const isKei = brand.id === "kei";

  const productsPanel = (
    <div className="flex flex-col gap-3 px-3 py-3">
      {productsByLine
        .filter(({ products }) => products.length > 0)
        .map(({ line, products }) => (
          <SectionCard key={line.id} accent="sky" bordered={false}>
            <SectionHeading icon={Layers} animation="pulse" accent="sky">{line.name}</SectionHeading>
            <p className="mt-1 mb-2 text-[11px] text-[var(--color-ink-dim)]">{line.tagline}</p>
            <ProductGrid
              products={products}
              brandsById={brandsById}
              pageSize={4}
              contactPhoneByProductId={contactPhoneByProductId}
              padded={false}
            />
            <Link
              href={`/brand/${slug}/${line.mcatId}`}
              className="mt-2 block text-center text-[11.5px] font-bold text-[var(--color-brand)]"
            >
              View more details
            </Link>
          </SectionCard>
        ))}
      {lines[0] && (
        <Link href={`/brand/${slug}/${lines[0].mcatId}`} className="mt-1 block w-full rounded-xl bg-[var(--color-brand)] py-3.5 text-center text-sm font-extrabold text-white">
          View Full Catalog
        </Link>
      )}
    </div>
  );

  const categoriesPanel = (
    <div className="grid grid-cols-2 gap-3 px-3 py-3">
      {lines.map((line) => (
        <Link key={line.id} href={`/brand/${slug}/${line.mcatId}`} className="rounded-2xl border border-[var(--color-line)] p-3">
          <p className="text-[13px] font-extrabold">{line.name}</p>
          <p className="mt-1 line-clamp-2 text-[11px] text-[var(--color-ink-dim)]">{line.tagline}</p>
        </Link>
      ))}
    </div>
  );

  const panels: Record<string, React.ReactNode> = { Products: productsPanel, Categories: categoriesPanel };
  const tabs = ["Products", "Categories"];

  if (isKei) {
    tabs.push("About", "Photos", "Videos", "Reviews");

    panels.About = (
      <div className="flex flex-col gap-3 px-3 py-3">
        <h2 className="text-center text-[13px] font-black uppercase tracking-wide">Fact Sheet</h2>
        <dl className="flex flex-col divide-y divide-[var(--color-line)] rounded-2xl border border-[var(--color-line)]">
          {[
            ["Company CEO", KEI_ABOUT.ceo],
            ["Registered Address", KEI_ABOUT.registeredAddress],
            ["Total Number of Employees", KEI_ABOUT.employees],
            ["GST Registration Date", KEI_ABOUT.gstRegistrationDate],
            ["GST Legal Status", KEI_ABOUT.gstLegalStatus],
            ["GST Nature of Business", KEI_ABOUT.natureOfBusiness],
            ["GST Additional NOB", KEI_ABOUT.additionalNob],
            ["GST No.", KEI_ABOUT.gstNo],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-3 px-3.5 py-2.5">
              <dt className="text-[11px] text-[var(--color-ink-dim)]">{label}</dt>
              <dd className="text-right text-[11.5px] font-bold text-[var(--color-brand)]">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="rounded-2xl border border-[var(--color-line)] p-3.5">
          <h3 className="text-[12px] font-extrabold">Contact Details</h3>
          <p className="mt-1 text-[12.5px] font-bold">{brand.name}</p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[var(--color-ink-dim)]">
            <MapPin className="size-3" aria-hidden="true" /> {brand.headquarters}
          </p>
        </div>
      </div>
    );

    panels.Photos = (
      <div className="flex flex-col gap-3 px-3 py-3">
        {KEI_PHOTOS.map((p) => (
          <figure key={p.image} className="overflow-hidden rounded-2xl border border-[var(--color-line)]">
            <img src={p.image} alt={p.label} className="w-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
            <figcaption className="px-3 py-2 text-[11.5px] font-bold text-[var(--color-ink)]">{p.label}</figcaption>
          </figure>
        ))}
      </div>
    );

    panels.Videos = (
      <div className="px-3 py-3">
        <a
          href={`https://www.youtube.com/watch?v=${KEI_VIDEO_ID}`}
          target="_blank"
          rel="noreferrer"
          className="relative block overflow-hidden rounded-2xl border border-[var(--color-line)]"
        >
          <img
            src={`https://img.youtube.com/vi/${KEI_VIDEO_ID}/hqdefault.jpg`}
            alt="KEI corporate video"
            className="w-full object-cover"
            referrerPolicy="no-referrer"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/25">
            <PlayCircle className="size-14 text-white" aria-hidden="true" />
          </span>
        </a>
      </div>
    );

    panels.Reviews = (
      <div className="flex flex-col gap-3 px-3 py-3">
        <h2 className="text-center text-[13px] font-black uppercase tracking-wide">Seller Ratings & Reviews</h2>
        <div className="flex items-center gap-4 rounded-2xl border border-[var(--color-line)] p-3.5">
          <div className="text-center">
            <p className="text-[28px] font-black leading-none">{KEI_REVIEWS_SUMMARY.avgRating}<span className="text-[13px] font-bold text-[var(--color-ink-faint)]">/5</span></p>
            <p className="mt-1 flex items-center justify-center gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={`avg-${i}`} className="size-3 fill-[var(--color-gold)] text-[var(--color-gold)]" aria-hidden="true" />
              ))}
            </p>
            <p className="mt-1 text-[10px] text-[var(--color-ink-dim)]">{KEI_REVIEWS_SUMMARY.totalCount} Ratings</p>
          </div>
          <div className="flex flex-1 flex-col gap-1">
            {[
              ["5 star", KEI_REVIEWS_SUMMARY.fiveStarPct],
              ["4 star", KEI_REVIEWS_SUMMARY.fourStarPct],
              ["3 star", KEI_REVIEWS_SUMMARY.threeStarPct],
              ["2 star", KEI_REVIEWS_SUMMARY.twoStarPct],
              ["1 star", KEI_REVIEWS_SUMMARY.oneStarPct],
            ].map(([label, pct]) => (
              <div key={label} className="flex items-center gap-2 text-[9.5px] text-[var(--color-ink-dim)]">
                <span className="w-9 shrink-0">{label}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                  <span className="block h-full rounded-full bg-[var(--color-gold)]" style={{ width: `${pct}%` }} />
                </span>
                <span className="w-7 shrink-0 text-right">{pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <h3 className="mt-1 text-[12px] font-extrabold">Customer Reviews</h3>
        {KEI_REVIEWS.map((r, i) => (
          <div key={`${r.date}-${r.name}-${i}`} className="rounded-2xl border border-[var(--color-line)] p-3">
            <div className="flex items-baseline justify-between gap-2">
              <p className="truncate text-[12px] font-extrabold">{r.name}</p>
              <span className="shrink-0 text-[9.5px] text-[var(--color-ink-faint)]">{r.city}</span>
            </div>
            <p className="mt-0.5 flex items-center gap-0.5">
              {Array.from({ length: r.rating }, (_, i2) => (
                <Star key={`${i}-${i2}`} className="size-3 fill-[var(--color-gold)] text-[var(--color-gold)]" aria-hidden="true" />
              ))}
            </p>
            {r.productName && <p className="mt-1 text-[10.5px] text-[var(--color-ink-dim)]">Product: {r.productName}</p>}
            {r.comment && <p className="mt-1 text-[11px] text-[var(--color-ink)]">{r.comment}</p>}
            <p className="mt-1 text-[9.5px] text-[var(--color-ink-faint)]">{r.date}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="pb-24">
      <Breadcrumbs items={[{ label: "Brands", href: "/brands" }, { label: brand.name }]} />

      {isKei && (
        <Link href={`/brand/${slug}/${lines[0]?.mcatId ?? ""}`} className="block">
          <img
            src="https://i.ibb.co/fVPDWxwT/kei-banner.png"
            alt="KEI Wires & Cables — World Class Quality Wires"
            className="w-full object-cover"
            referrerPolicy="no-referrer"
          />
        </Link>
      )}

      <section className="bg-gradient-to-b from-[var(--color-brand-dim)] to-transparent px-4 pt-3 pb-2">
        <div className="flex gap-4 text-[11px] font-semibold text-[var(--color-ink-dim)]">
          <span className="flex items-center gap-1"><Calendar className="size-3" aria-hidden="true" /> Est. {brand.establishedYear}</span>
          <span className="flex items-center gap-1"><MapPin className="size-3" aria-hidden="true" /> {brand.headquarters.split(",")[0]}</span>
        </div>
      </section>

      <BrandTabs tabs={tabs} panels={panels} />

      <StickyContactBar brandName={brand.name} contactPhone={brandContactPhone} />
    </div>
  );
}
