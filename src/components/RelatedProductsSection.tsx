import type { ComponentType } from "react";
import { Repeat } from "lucide-react";
import type { Product } from "@/types";
import ViewMoreLink from "./ViewMoreLink";
import SectionHeading from "./SectionHeading";

/** Cross-brand products in the same category, diversified across brands rather than a flat
    first-N slice — a buyer can compare without leaving the page. Sits above Recommended
    Categories, the last section on the page. */
export default function RelatedProductsSection({
  products,
  CardComponent,
  viewMoreHref,
  variant = 1,
}: {
  products: Product[];
  CardComponent: ComponentType<{ product: Product; brandRating?: number; variants?: Product[] }>;
  viewMoreHref?: string;
  variant?: number;
}) {
  if (products.length === 0) return null;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <SectionHeading icon={Repeat} animation="spin" accent="violet">More Products from Other Brands</SectionHeading>
        {viewMoreHref && <ViewMoreLink href={viewMoreHref} variant={variant} />}
      </div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-3">
        {products.map((p) => (
          <CardComponent key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
