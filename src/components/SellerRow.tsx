import { Flame } from "lucide-react";
import type { Product, Supplier } from "@/types";
import SellerCard from "./SellerCard";
import ViewMoreLink from "./ViewMoreLink";
import SectionHeading from "./SectionHeading";

/** The Best Sellers section specifically — seller-first cards rather than the product-first
    cards used everywhere else on the page. */
export default function SellerRow({
  items,
  heading,
  viewMoreHref,
  variantsByProductId,
}: {
  items: { product: Product; supplier: Supplier | null }[];
  heading: string;
  viewMoreHref?: string;
  variantsByProductId?: Record<string, Product[]>;
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <SectionHeading icon={Flame} animation="pulse" accent="rose">{heading}</SectionHeading>
        {viewMoreHref && <ViewMoreLink href={viewMoreHref} />}
      </div>
      <div className="-mx-2 flex items-start gap-2 overflow-x-auto scrollbar-none px-2 pb-1">
        {items.map(({ product, supplier }) => (
          <SellerCard key={product.id} product={product} supplier={supplier} variants={variantsByProductId?.[product.id] ?? []} />
        ))}
      </div>
    </div>
  );
}
