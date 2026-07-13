import type { ComponentType } from "react";
import { Sparkles } from "lucide-react";
import type { Product, Brand } from "@/types";
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
  CardComponent: ComponentType<{ product: Product; brand?: Brand; showPrice?: boolean; contactPhone?: string }>;
  contactPhoneByProductId?: Record<string, string>;
}) {
  if (products.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <SectionHeading icon={Sparkles} animation="pulse" accent="emerald">You May Be Interested In</SectionHeading>
      <div className="flex flex-col gap-2 px-2">
        {products.map((p) => (
          <CardComponent key={p.id} product={p} showPrice={false} contactPhone={contactPhoneByProductId?.[p.id]} />
        ))}
      </div>
    </div>
  );
}
