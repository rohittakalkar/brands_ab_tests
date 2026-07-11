import type { ComponentType } from "react";
import { Sparkles } from "lucide-react";
import type { Product } from "@/types";
import SectionHeading from "./SectionHeading";

/** Products diversified across sibling categories under the same parent — brand-agnostic
    discovery, the last section on the page. A single mixed row rather than one row per
    category, so it reads as "you may also like this" instead of a directory of categories. */
export default function RecommendedCategories({
  products,
  CardComponent,
  contactPhoneByProductId,
}: {
  products: Product[];
  CardComponent: ComponentType<{ product: Product; brandRating?: number; showPrice?: boolean; contactPhone?: string }>;
  contactPhoneByProductId?: Record<string, string>;
}) {
  if (products.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <SectionHeading icon={Sparkles} animation="pulse" accent="emerald">You May Be Interested In</SectionHeading>
      <div className="-mx-2 flex items-start gap-2 overflow-x-auto scrollbar-none px-2 pb-1">
        {products.map((p) => (
          <div key={p.id} className="w-32 shrink-0">
            <CardComponent product={p} showPrice={false} contactPhone={contactPhoneByProductId?.[p.id]} />
          </div>
        ))}
      </div>
    </div>
  );
}
