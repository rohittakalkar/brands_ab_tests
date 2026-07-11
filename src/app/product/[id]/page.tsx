import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Clock, ChevronDown, Phone, Star, ShieldCheck, Globe, Boxes, Truck, BadgeCheck } from "lucide-react";
import {
  getProducts,
  getProductById,
  getBrandById,
  getMcatById,
  getBrandMCatById,
  getSuppliers,
  getReviews,
  getAlternativeProducts,
  getContactPhoneByProductId,
} from "@/lib/data";
import { variantSiblingsById } from "@/lib/variants";
import Breadcrumbs from "@/components/Breadcrumbs";
import TrustBadge from "@/components/TrustBadge";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import StickyBuyBar from "@/components/StickyBuyBar";
import SectionCard from "@/components/SectionCard";
import SectionHeading from "@/components/SectionHeading";

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
  const primarySupplier = suppliers[0];

  const variants = product.brandMCatId
    ? (variantSiblingsById(getProducts({ brandMCatId: product.brandMCatId }))[product.id] ?? [])
    : [];

  const related = product.brandMCatId
    ? getProducts({ brandMCatId: product.brandMCatId }).filter((p) => p.id !== id).slice(0, 4)
    : [];

  const alternatives = getAlternativeProducts(product.id);
  const contactPhoneByProductId = getContactPhoneByProductId(related.length > 0 ? related : [product]);

  // Reviews scoped to this exact product where we have them, falling back to the brand's
  // general reviews so the section still has real content on products without a review of
  // their own — never a fabricated review.
  const brandReviews = brand ? getReviews({ brandId: brand.id }) : [];
  const productReviews = brandReviews.filter((r) => r.productId === product.id);
  const reviews = (productReviews.length > 0 ? productReviews : brandReviews).slice(0, 4);
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : brand?.rating;

  const specEntries = Object.entries(product.specifications);
  const images = product.images ?? [product.image];

  // Real product fields restructured as FAQ copy — not fabricated content, just a different
  // presentation of the MOQ/warranty/delivery/certification facts already on the card above.
  const faqs = [
    { q: "What is the minimum order quantity?", a: `The minimum order quantity for ${product.name} is ${product.moq}.` },
    { q: "What is the expected delivery time?", a: `Typical delivery time is ${product.deliveryTime} from order confirmation.` },
    { q: "What warranty does this product carry?", a: `This product comes with a ${product.warranty} warranty from ${brand?.name ?? "the manufacturer"}.` },
    ...(product.certifications && product.certifications.length > 0
      ? [{ q: "What certifications does this product hold?", a: `${product.name} is certified: ${product.certifications.join(", ")}.` }]
      : []),
  ];

  return (
    <div className="pb-28">
      <Breadcrumbs
        items={[
          ...(category ? [{ label: category.name, href: `/category/${category.id}` }] : []),
          ...(brand ? [{ label: brand.name, href: `/brand/${brand.id}` }] : []),
          { label: product.name },
        ]}
      />

      <ProductGallery
        images={images}
        alt={product.name}
        overlay={
          <>
            <TrustBadge type="manufacturer-oem" />
            {brand?.verified && <TrustBadge type="verified-supplier" />}
            {product.certifications && product.certifications.length > 0 && <TrustBadge type="certified-product" />}
          </>
        }
      />

      <div className="px-4 pt-4">
        {brand && (
          <Link href={`/brand/${brand.id}`} className="text-[11px] font-black uppercase tracking-wide text-[var(--color-brand)]">
            {brand.name}
          </Link>
        )}
        <h1 className="mt-1 text-lg font-black leading-snug">{product.name}</h1>
        <p className="mt-1 font-mono text-[11px] text-[var(--color-ink-faint)]">Model: {product.modelNumber}</p>

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

        <p className="mt-3 text-[12.5px] leading-relaxed text-[var(--color-ink-dim)] line-clamp-4">{product.description}</p>

        {product.features.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.features.slice(0, 4).map((f) => (
              <span key={f} className="rounded-full bg-[var(--color-brand-dim)] px-2.5 py-1 text-[10.5px] font-bold text-[var(--color-brand-ink)]">{f}</span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2 px-4">
        {specEntries.length > 0 && (
          <SectionCard accent="sky" bordered={false}>
            <SectionHeading icon={Boxes} animation="pulse" accent="sky">Full Specifications</SectionHeading>
            <dl className="mt-2 text-[12.5px]">
              {specEntries.slice(0, 6).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 border-b border-[var(--color-line)] py-2 last:border-0">
                  <dt className="text-[var(--color-ink-dim)]">{k}</dt>
                  <dd className="text-right font-bold">{v}</dd>
                </div>
              ))}
            </dl>
            {specEntries.length > 6 && (
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-center gap-1 py-2 text-[11.5px] font-bold text-[var(--color-brand)]">
                  Show {specEntries.length - 6} More
                  <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <dl className="text-[12.5px]">
                  {specEntries.slice(6).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3 border-b border-[var(--color-line)] py-2 last:border-0">
                      <dt className="text-[var(--color-ink-dim)]">{k}</dt>
                      <dd className="text-right font-bold">{v}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            )}
          </SectionCard>
        )}

        {variants.length > 0 && (
          <SectionCard accent="violet" bordered={false}>
            <SectionHeading icon={BadgeCheck} animation="pulse" accent="violet">More Options from {brand?.name}</SectionHeading>
            <div className="-mx-2 mt-2 flex items-start gap-2 overflow-x-auto scrollbar-none px-2 pb-1">
              {[product, ...variants].map((v) => (
                <Link
                  key={v.id}
                  href={`/product/${v.id}`}
                  className={`flex w-28 shrink-0 flex-col gap-1 rounded-xl border p-1.5 ${
                    v.id === product.id ? "border-[var(--color-brand)] bg-[var(--color-brand-dim)]" : "border-[var(--color-line)]"
                  }`}
                >
                  <div className="aspect-square w-full overflow-hidden rounded-lg bg-[var(--color-surface-2)]">
                    <img src={v.image} alt={v.keySpecValue} className="h-full w-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                  </div>
                  <p className="line-clamp-2 text-[10px] font-bold leading-tight">{v.keySpecValue}</p>
                  {v.id === product.id && <span className="text-[9px] font-bold text-[var(--color-brand)]">Selected</span>}
                </Link>
              ))}
            </div>
          </SectionCard>
        )}

        {reviews.length > 0 && avgRating !== undefined && (
          <SectionCard accent="amber" bordered={false}>
            <SectionHeading icon={Star} animation="bounce" accent="amber">Reviews &amp; Ratings</SectionHeading>
            <div className="mt-2 flex items-center gap-3">
              <div className="text-center">
                <p className="text-2xl font-black">{avgRating.toFixed(1)}</p>
                <p className="text-[9px] font-bold text-[var(--color-ink-faint)]">/ 5.0</p>
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`size-3.5 ${i < Math.round(avgRating) ? "fill-[var(--color-gold)] text-[var(--color-gold)]" : "text-[var(--color-line)]"}`} aria-hidden="true" />
                  ))}
                </div>
                <p className="mt-0.5 text-[10.5px] text-[var(--color-ink-dim)]">{reviews.length} review{reviews.length > 1 ? "s" : ""}</p>
              </div>
            </div>

            {product.features.length > 0 && (
              <div className="mt-3">
                <p className="mb-1 text-[10px] font-black uppercase tracking-wide text-[var(--color-ink-faint)]">What buyers like</p>
                <ul className="flex flex-col gap-1">
                  {product.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex items-center gap-1.5 text-[11.5px] text-[var(--color-ink-dim)]">
                      <ShieldCheck className="size-3 shrink-0 text-[var(--color-verified)]" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-3 flex flex-col divide-y divide-[var(--color-line)]">
              {reviews.map((r) => (
                <div key={r.id} className="py-2.5 first:pt-0">
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-extrabold">{r.userName}</p>
                    <span className="inline-flex items-center gap-0.5 text-[10.5px] font-bold text-[var(--color-ink-dim)]">
                      <Star className="size-2.5 fill-[var(--color-gold)] text-[var(--color-gold)]" aria-hidden="true" />
                      {r.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-[10.5px] text-[var(--color-ink-faint)]">{r.userRole} · {r.companyName}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-[var(--color-ink-dim)]">{r.comment}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {faqs.length > 0 && (
          <SectionCard accent="rose" bordered={false}>
            <SectionHeading icon={ChevronDown} animation="bounce" accent="rose">Frequently Asked Questions</SectionHeading>
            <div className="mt-2 flex flex-col divide-y divide-[var(--color-line)]">
              {faqs.map((f) => (
                <details key={f.q} className="group py-2.5 first:pt-0">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-[12.5px] font-bold">
                    {f.q}
                    <ChevronDown className="size-3.5 shrink-0 text-[var(--color-ink-faint)] transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--color-ink-dim)]">{f.a}</p>
                </details>
              ))}
            </div>
          </SectionCard>
        )}

        {brand && (
          <SectionCard accent="emerald" bordered={false}>
            <SectionHeading icon={Globe} animation="pulse" accent="emerald">Support &amp; Official Info</SectionHeading>
            <div className="mt-2 flex flex-col gap-2.5">
              {brand.website && (
                <div className="flex items-start gap-2.5">
                  <Globe className="mt-0.5 size-4 shrink-0 text-[var(--color-ink-faint)]" aria-hidden="true" />
                  <div>
                    <p className="text-[12px] font-bold">Official Website</p>
                    <p className="text-[11px] text-[var(--color-ink-dim)]">{brand.website}</p>
                  </div>
                </div>
              )}
              {primarySupplier?.contactPhone && (
                <div className="flex items-start gap-2.5">
                  <Phone className="mt-0.5 size-4 shrink-0 text-[var(--color-ink-faint)]" aria-hidden="true" />
                  <div>
                    <p className="text-[12px] font-bold">Dealer Support</p>
                    <p className="text-[11px] text-[var(--color-ink-dim)]">{primarySupplier.contactPhone} · {primarySupplier.responseTime} avg. response</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-2.5">
                <Truck className="mt-0.5 size-4 shrink-0 text-[var(--color-ink-faint)]" aria-hidden="true" />
                <div>
                  <p className="text-[12px] font-bold">Warranty</p>
                  <p className="text-[11px] text-[var(--color-ink-dim)]">{product.warranty}, honored through the authorized dealer network</p>
                </div>
              </div>
            </div>
          </SectionCard>
        )}

        {suppliers.length > 0 && (
          <SectionCard accent="sky" bordered={false}>
            <SectionHeading icon={MapPin} animation="bounce" accent="sky">Find Sellers Near You</SectionHeading>
            <div className="mt-2 flex flex-col divide-y divide-[var(--color-line)]">
              {suppliers.map((s) => (
                <div key={s.id} className="flex items-center gap-3 py-2.5 first:pt-0">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-2)] text-[10px] font-black text-[var(--color-ink-dim)]">
                    {s.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-extrabold">{s.name}</p>
                    <p className="flex items-center gap-1 text-[10.5px] text-[var(--color-ink-dim)]">
                      <MapPin className="size-2.5 shrink-0" aria-hidden="true" /> {s.location}
                      {s.reviewsCount > 0 && (
                        <span className="inline-flex items-center gap-0.5">
                          · <Star className="size-2.5 fill-[var(--color-gold)] text-[var(--color-gold)]" aria-hidden="true" /> {s.rating.toFixed(1)} ({s.reviewsCount})
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] font-bold text-[var(--color-ink)]">{s.priceEstimate}</p>
                  </div>
                  {s.isAuthorizedDealer && <TrustBadge type="authorized-dealer" />}
                  {s.contactPhone && (
                    <a
                      href={`tel:${s.contactPhone}`}
                      className="flex shrink-0 items-center justify-center gap-1 rounded-lg border border-[var(--color-line)] px-2.5 py-1.5 text-[10.5px] font-extrabold text-[var(--color-ink)]"
                    >
                      <Phone className="size-3" aria-hidden="true" /> Call
                    </a>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-2 flex items-center gap-1 text-[10.5px] text-[var(--color-ink-faint)]">
              <Clock className="size-3" aria-hidden="true" /> Fastest responder: {suppliers[0].responseTime} · {suppliers[0].responseRate}% reply rate
            </p>
          </SectionCard>
        )}

        {related.length > 0 && (
          <SectionCard accent="violet" bordered={false}>
            <SectionHeading icon={Boxes} animation="pulse" accent="violet">More from {brandMCat?.name ?? brand?.name}</SectionHeading>
            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-5">
              {related.map((p) => <ProductCard key={p.id} product={p} brandRating={brand?.rating} contactPhone={contactPhoneByProductId[p.id]} />)}
            </div>
          </SectionCard>
        )}

        {alternatives.length > 0 && (
          <SectionCard accent="rose" bordered={false}>
            <SectionHeading icon={Boxes} animation="pulse" accent="rose">Compare with Other Brands</SectionHeading>
            <div className="-mx-2 mt-2 flex items-start gap-2 overflow-x-auto scrollbar-none px-2 pb-1">
              {alternatives.map((a) => (
                <Link
                  key={a.id}
                  href={`/category/${a.mcatId}`}
                  className="flex w-36 shrink-0 flex-col gap-1 rounded-xl border border-[var(--color-line)] p-2.5"
                >
                  <p className="text-[9px] font-black uppercase tracking-wide text-[var(--color-ink-faint)]">{a.brandName}</p>
                  <p className="line-clamp-1 text-[11.5px] font-bold">{a.modelNumber}</p>
                  <p className="text-[10.5px] text-[var(--color-ink-dim)]">{a.keySpecLabel}: {a.keySpecValue}</p>
                  <p className="mt-0.5 text-[12px] font-extrabold">{a.priceRange}</p>
                </Link>
              ))}
            </div>
          </SectionCard>
        )}
      </div>

      <StickyBuyBar productName={product.name} sellerName={primarySupplier?.name ?? `an authorized ${brand?.name ?? "seller"}`} />
    </div>
  );
}
