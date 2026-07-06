import type { ComponentType } from "react";
import { TrendingUp } from "lucide-react";
import type { Product } from "@/types";
import ViewMoreLink from "./ViewMoreLink";
import SectionHeading from "./SectionHeading";

/** A horizontally-scrolling row of the category's leading products. Data order is treated as
    relevance/best-selling order rather than inventing a synthetic sales-count field. */
export default function BestSellersRow({
  products,
  CardComponent,
  brandRating,
  heading,
  viewMoreHref,
  variantsByProductId,
}: {
  products: Product[];
  CardComponent: ComponentType<{ product: Product; brandRating?: number; variants?: Product[] }>;
  brandRating?: number;
  heading: string;
  viewMoreHref?: string;
  variantsByProductId?: Record<string, Product[]>;
}) {
  if (products.length === 0) return null;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <SectionHeading icon={TrendingUp} animation="bounce" accent="amber">{heading}</SectionHeading>
        {viewMoreHref && <ViewMoreLink href={viewMoreHref} />}
      </div>
      <div className="-mx-2 flex items-start gap-2 overflow-x-auto scrollbar-none px-2 pb-1">
        {products.map((p) => (
          <div key={p.id} className="w-36 shrink-0">
            <CardComponent product={p} brandRating={brandRating} variants={variantsByProductId?.[p.id] ?? []} />
          </div>
        ))}
      </div>
    </div>
  );
}
