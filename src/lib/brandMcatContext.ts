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
import { diversifyByKey } from "@/lib/diversify";
import type { Supplier } from "@/types";

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
const RECOMMENDED_CATEGORY_PRODUCTS_COUNT = 10;
const CROSS_BRAND_COUNT = 8;

/** Every (brandId, mcatId) pair that has a BrandMCat line — shared across all BrandMcat page variants. */
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

  const crossBrandProducts = diversifyByKey(
    getProducts({ mcatId }).filter((p) => p.brandId !== brandId),
    (p) => p.brandId,
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

  // "You May Be Interested In" — products from sibling categories under the same parent,
  // deliberately not scoped to this brand (per the "remove brand detailing" note), diversified
  // across those categories so no single sibling category crowds out the others.
  const siblingCategoryIds = getMcats()
    .filter((m) => m.pmcatId === cat.pmcatId && m.id !== cat.id)
    .map((m) => m.id);
  const recommendedProducts = diversifyByKey(
    siblingCategoryIds.flatMap((id) => getProducts({ mcatId: id })),
    (p) => p.mcatId,
    RECOMMENDED_CATEGORY_PRODUCTS_COUNT
  );

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
    recommendedProducts,
    suppliers,
    reviews,
    rankedBrands,
  };
}

export type BrandMcatContext = NonNullable<ReturnType<typeof loadBrandMcatContext>>;
