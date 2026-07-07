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
import type { Product, Supplier } from "@/types";

const MOST_SELLING_COUNT = 8;
const BEST_SELLER_COUNT = 8;

// Built once per page (not once per product) — getSuppliers({productId}) rescans the whole
// supplier table per call, so doing that per-product would be O(products x suppliers) instead
// of a single O(suppliers) pass.
let supplierByProductIdCache: Map<string, Supplier> | null = null;
function supplierByProductId(): Map<string, Supplier> {
  if (!supplierByProductIdCache) {
    supplierByProductIdCache = new Map();
    for (const s of getSuppliers()) {
      if (s.productId && !supplierByProductIdCache.has(s.productId)) supplierByProductIdCache.set(s.productId, s);
    }
  }
  return supplierByProductIdCache;
}
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

  // Data order is treated as relevance order. The catalog is split in half so "Most Selling"
  // and "Best Sellers" each have their own expansion pool for their in-section "View More" —
  // without the split, expanding both past their initial slice would eventually show the same
  // products in both sections.
  const half = Math.ceil(products.length / 2);
  const mostSellingPool = products.slice(0, half);
  const bestSellersPool = products.slice(half);
  const mostSelling = mostSellingPool.slice(0, MOST_SELLING_COUNT);

  // Best Sellers is presented seller-first — each product is paired with the actual supplier
  // that lists it (not a generic brand-level supplier), so seller identity and rating are real.
  const supplierMap = supplierByProductId();
  const bestSellersPoolWithSupplier = bestSellersPool.map((p) => ({ product: p, supplier: supplierMap.get(p.id) ?? null }));
  const bestSellers = bestSellersPool.slice(0, BEST_SELLER_COUNT);
  const bestSellersWithSupplier = bestSellersPoolWithSupplier.slice(0, BEST_SELLER_COUNT);

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
    mostSellingPool,
    bestSellers,
    bestSellersWithSupplier,
    bestSellersPoolWithSupplier,
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
