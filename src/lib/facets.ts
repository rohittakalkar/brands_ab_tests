import type { Product } from "@/types";

export interface Facet {
  key: string;
  values: string[];
}

const RAM_STORAGE_PATTERN = /(\d+)\s?GB RAM\s*\/\s*(\d+)\s?GB Storage/i;

/** A product's specs, plus any synthetic facets (e.g. RAM/Storage split out of a composite
    "8GB RAM / 256GB Storage" value) — shared between facet derivation and the actual filtering
    logic so the two never drift out of sync. */
export function getEffectiveSpecs(specifications: Record<string, string>): Record<string, string> {
  const specs: Record<string, string> = { ...specifications };
  for (const value of Object.values(specifications)) {
    const match = value.match(RAM_STORAGE_PATTERN);
    if (match) {
      specs["RAM"] = `${match[1]}GB`;
      specs["Storage"] = `${match[2]}GB`;
    }
  }
  return specs;
}

/**
 * Derives filter facets straight from whatever `specifications` this category's products
 * actually carry — no hardcoded "RAM"/"Storage"/"Power Range" list. A spec key only becomes a
 * facet if it appears on most products AND its value actually varies (a key every product
 * shares the same value for isn't a useful filter). This is what makes Sort/Filter adapt
 * per category instead of always showing the same fixed options.
 */
export function deriveFacets(products: Product[], maxFacets = 3, maxValuesPerFacet = 6): Facet[] {
  if (products.length === 0) return [];

  const valuesByKey = new Map<string, Set<string>>();
  const countByKey = new Map<string, number>();

  for (const p of products) {
    const specs = getEffectiveSpecs(p.specifications);
    for (const [key, value] of Object.entries(specs)) {
      if (!valuesByKey.has(key)) valuesByKey.set(key, new Set());
      valuesByKey.get(key)!.add(value);
      countByKey.set(key, (countByKey.get(key) ?? 0) + 1);
    }
  }

  const candidates: Facet[] = [];
  for (const [key, values] of valuesByKey) {
    const coverage = (countByKey.get(key) ?? 0) / products.length;
    if (values.size < 2 || coverage < 0.6) continue; // shared-by-everyone or too-sparse keys aren't useful filters
    const sorted = Array.from(values).sort((a, b) => {
      const na = parseFloat(a);
      const nb = parseFloat(b);
      return !isNaN(na) && !isNaN(nb) ? na - nb : a.localeCompare(b);
    });
    candidates.push({ key, values: sorted.slice(0, maxValuesPerFacet) });
  }

  // Prefer facets with a moderate number of distinct options — most useful for filtering,
  // versus a key with 20 near-unique values or one with only 2.
  candidates.sort((a, b) => Math.abs(4 - a.values.length) - Math.abs(4 - b.values.length));
  return candidates.slice(0, maxFacets);
}
