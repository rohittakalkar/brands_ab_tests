import { notFound } from "next/navigation";
import type { ComponentType, ReactNode } from "react";
import type { Product } from "@/types";
import { loadBrandMcatContext } from "@/lib/brandMcatContext";
import Breadcrumbs from "./Breadcrumbs";
import BrandMcatVariantNav from "./BrandMcatVariantNav";
import SectionCard from "./SectionCard";
import BestSellersRow from "./BestSellersRow";
import SellerRow from "./SellerRow";
import ProductBrowser from "./ProductBrowser";
import RelatedProductsSection from "./RelatedProductsSection";
import RecommendedCategories from "./RecommendedCategories";
import StickyBuyBar from "./StickyBuyBar";

/**
 * Shared body for all 5 Brand MCAT page variants. Structure is deliberately identical across
 * variants (breadcrumb → search → most selling → best sellers → all products → related
 * products → recommended categories) — the only thing that changes per variant is the
 * product-card design injected via `CardComponent`. Each section renders inside its own
 * rounded, bordered `SectionCard` with a distinct accent color, so a buyer can tell at a
 * glance where one section ends and the next begins rather than reading one continuous,
 * undifferentiated scroll. No brand bio/stat dump, no location fields, no articles, no
 * feedback widgets: every section here exists to move a buyer toward "Get Best Price," not to
 * describe the brand.
 */
export default function BrandMcatPageBody({
  slug,
  category,
  active,
  CardComponent,
}: {
  slug: string;
  category: string;
  active: number;
  CardComponent: ComponentType<{ product: Product; brandRating?: number; variants?: Product[] }>;
}) {
  const ctx = loadBrandMcatContext(slug, category);
  if (!ctx) notFound();
  const {
    brand,
    cat,
    pcat,
    line,
    products,
    mostSelling,
    bestSellersWithSupplier,
    crossBrandProducts,
    recommendedCategories,
    variantsByProductId,
  } = ctx;

  // ProductBrowser is a Client Component (it holds search/sort/filter state), and a component
  // *reference* can't be serialized across the Server → Client boundary — so every card is
  // pre-rendered here, on the server, and handed down as an already-rendered element instead.
  const cardsById: Record<string, ReactNode> = {};
  for (const p of products) {
    cardsById[p.id] = <CardComponent key={p.id} product={p} brandRating={brand.rating} variants={variantsByProductId[p.id] ?? []} />;
  }

  return (
    <div className="pb-36">
      <BrandMcatVariantNav slug={slug} category={category} active={active} />

      <Breadcrumbs
        items={[
          ...(pcat ? [{ label: pcat.name }] : []),
          { label: brand.name, href: `/brand/${brand.id}` },
          { label: cat.name },
        ]}
      />

      <div className="mt-3 flex flex-col gap-3 px-4">
        <SectionCard accent="amber">
          <BestSellersRow
            products={mostSelling}
            CardComponent={CardComponent}
            brandRating={brand.rating}
            heading={`Most Selling in ${cat.name}`}
            viewMoreHref="#all-products"
            variantsByProductId={variantsByProductId}
          />
        </SectionCard>

        <SectionCard accent="rose">
          <SellerRow
            items={bestSellersWithSupplier}
            heading={`Best Sellers in ${cat.name}`}
            viewMoreHref="#all-products"
            variantsByProductId={variantsByProductId}
          />
        </SectionCard>

        <SectionCard accent="sky">
          <ProductBrowser products={products} cardsById={cardsById} heading="All Products" />
        </SectionCard>

        <SectionCard accent="violet">
          <RelatedProductsSection products={crossBrandProducts} CardComponent={CardComponent} viewMoreHref={`/category/${cat.id}`} />
        </SectionCard>

        <SectionCard accent="emerald">
          <RecommendedCategories categories={recommendedCategories} CardComponent={CardComponent} />
        </SectionCard>
      </div>

      {/* <StickyBuyBar productName={line.name} sellerName={`an authorized ${brand.name} reseller`} /> */}
    </div>
  );
}
