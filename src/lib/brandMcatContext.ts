import "server-only";
import {
  getBrandById,
  getMcatById,
  getPMcatById,
  getMcats,
  getBrandMCats,
  getBrands,
  getProducts,
  getSuppliers,
  getReviews,
} from "@/lib/data";
import { variantSiblingsById } from "@/lib/variants";
import type { Product } from "@/types";

const MOST_SELLING_COUNT = 8;
const BEST_SELLER_COUNT = 8;
const CATEGORY_PREVIEW_COUNT = 10;
const CROSS_BRAND_COUNT = 8;

/** Round-robins across every other brand present in the category instead of a flat
    first-N slice, so a brand that happens to sort late in the data (e.g. a smaller
    catalog) still gets fair representation instead of being crowded out. */
function diversifyByBrand(products: Product[], count: number): Product[] {
  const byBrand = new Map<string, Product[]>();
  for (const p of products) {
    if (!byBrand.has(p.brandId)) byBrand.set(p.brandId, []);
    byBrand.get(p.brandId)!.push(p);
  }
  const queues = Array.from(byBrand.values());
  const result: Product[] = [];
  let i = 0;
  while (result.length < count && queues.some((q) => q.length > 0)) {
    const queue = queues[i % queues.length];
    if (queue.length > 0) result.push(queue.shift()!);
    i += 1;
  }
  return result;
}

/** Every (brandId, mcatId) pair that has a BrandMCat line — shared across all Brand MCAT page variants. */
export function brandMcatStaticParams() {
  const pairs: { slug: string; category: string }[] = [];
  for (const b of getBrands()) {
    for (const line of getBrandMCats({ brandId: b.id })) {
      pairs.push({ slug: b.id, category: line.mcatId });
    }
  }
  return pairs;
}

export function loadBrandMcatContext(brandId: string, mcatId: string) {
  const brand = getBrandById(brandId);
  const cat = getMcatById(mcatId);
  if (!brand || !cat) return null;

  const [line] = getBrandMCats({ brandId, mcatId });
  if (!line) return null;

  const pcat = getPMcatById(cat.pmcatId);
  const products = getProducts({ brandMCatId: line.id });

  const otherBrandsInCategory = getBrands({ mcatId })
    .filter((b) => b.id !== brandId)
    .sort((a, b) => b.buyersConnected - a.buyersConnected);

  const otherLinesForBrand = getBrandMCats({ brandId })
    .filter((l) => l.mcatId !== mcatId)
    .map((l) => ({ ...l, mcatName: getMcatById(l.mcatId)?.name ?? l.mcatId }));

  const crossBrandProducts = diversifyByBrand(
    getProducts({ mcatId }).filter((p) => p.brandId !== brandId),
    CROSS_BRAND_COUNT
  );

  const suppliers = getSuppliers({ brandId }).slice(0, 4);
  const reviews = getReviews({ brandId }).slice(0, 3);

  const rankedBrands = [brand, ...otherBrandsInCategory]
    .sort((a, b) => b.buyersConnected - a.buyersConnected)
    .slice(0, 5);

  // Data order is treated as relevance order — the top slice is "Most Selling," the next
  // slice down is "Best Sellers" — rather than inventing a synthetic sales-count field the
  // rest of the data model doesn't have.
  const mostSelling = products.slice(0, MOST_SELLING_COUNT);
  const bestSellers = products.slice(MOST_SELLING_COUNT, MOST_SELLING_COUNT + BEST_SELLER_COUNT);

  // Best Sellers is presented seller-first — each product is paired with the actual supplier
  // that lists it (not a generic brand-level supplier), so seller identity and rating are real.
  const bestSellersWithSupplier = bestSellers.map((p) => ({
    product: p,
    supplier: getSuppliers({ productId: p.id })[0] ?? null,
  }));

  // Sibling SKUs of the same underlying model (e.g. different RAM/Storage configs) within
  // this brand's own catalog — powers the "Explore other Variants (N)" picker on each card.
  const variantsByProductId = variantSiblingsById(products);

  // Sibling categories under the same parent — brand-agnostic discovery, deliberately not
  // scoped to this brand, per the "remove brand detailing" note. Each carries a small product
  // preview so "Recommended Categories" shows what's actually in there, not just a bare label.
  const recommendedCategories = getMcats()
    .filter((m) => m.pmcatId === cat.pmcatId && m.id !== cat.id)
    .map((m) => {
      const categoryProducts = getProducts({ mcatId: m.id });
      return { ...m, productCount: categoryProducts.length, previewProducts: categoryProducts.slice(0, CATEGORY_PREVIEW_COUNT) };
    })
    .filter((m) => m.productCount > 0);

  return {
    brand,
    cat,
    pcat,
    line,
    products,
    mostSelling,
    bestSellers,
    bestSellersWithSupplier,
    variantsByProductId,
    otherBrandsInCategory,
    otherLinesForBrand,
    crossBrandProducts,
    recommendedCategories,
    suppliers,
    reviews,
    rankedBrands,
  };
}

export type BrandMcatContext = NonNullable<ReturnType<typeof loadBrandMcatContext>>;
