import type { Product } from "@/types";

/** Strips a trailing parenthetical config suffix like " (8GB RAM, 128GB Storage)" so
    RAM/Storage siblings of the same underlying model group together. */
export function baseModelName(name: string): string {
  return name.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

/** Groups products sharing the same brand line + base model name — the "variants" of one
    underlying product (e.g. different RAM/Storage configs of the same phone). Scoped to a
    single brand's own catalog, not cross-brand. */
function groupVariants(products: Product[]): Map<string, Product[]> {
  const groups = new Map<string, Product[]>();
  for (const p of products) {
    const key = `${p.brandMCatId ?? p.brandId}::${baseModelName(p.name)}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(p);
  }
  return groups;
}

/** Per-product-id lookup of sibling variants (excluding the product itself), for O(1) access
    when rendering each card. Only populated for products that actually have siblings. */
export function variantSiblingsById(products: Product[]): Record<string, Product[]> {
  const groups = groupVariants(products);
  const result: Record<string, Product[]> = {};
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    for (const p of group) {
      result[p.id] = group.filter((g) => g.id !== p.id);
    }
  }
  return result;
}
