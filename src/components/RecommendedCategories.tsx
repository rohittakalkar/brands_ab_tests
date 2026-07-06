import type { ComponentType } from "react";
import { Sparkles } from "lucide-react";
import type { MCat, Product } from "@/types";
import CategoryIcon from "./CategoryIcon";
import ViewMoreLink from "./ViewMoreLink";
import SectionHeading from "./SectionHeading";

/** Sibling categories under the same parent — brand-agnostic discovery, the last section on
    the page. Each category shows 3 real product cards (the same card design used everywhere
    else on the page), not a bare label or a thumbnail strip. */
export default function RecommendedCategories({
  categories,
  CardComponent,
}: {
  categories: (MCat & { productCount: number; previewProducts: Product[] })[];
  CardComponent: ComponentType<{ product: Product; brandRating?: number }>;
}) {
  if (categories.length === 0) return null;
  return (
    <div className="flex flex-col gap-4">
      <SectionHeading icon={Sparkles} animation="pulse" accent="emerald">Recommended Categories</SectionHeading>
      {categories.map((c) => (
        <div key={c.id}>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-1.5">
              <CategoryIcon icon={c.icon} className="size-4 shrink-0 text-[var(--color-ink-dim)]" />
              <span className="truncate text-[12px] font-bold">{c.name}</span>
              <span className="shrink-0 text-[10px] text-[var(--color-ink-faint)]">· {c.productCount}</span>
            </div>
            <ViewMoreLink href={`/category/${c.id}`} />
          </div>
          <div className="-mx-3 flex items-start gap-3 overflow-x-auto scrollbar-none px-3 pb-1">
            {c.previewProducts.map((p) => (
              <div key={p.id} className="w-32 shrink-0">
                <CardComponent product={p} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
