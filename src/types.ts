// Real IndiaMART taxonomy depth: PMcat (e.g. "Electrical Cables & Wires") -> MCat (e.g.
// "Armoured Cable", "Power Cable", "House Wire" — the tier brands attach to directly via
// `BrandMCat.mcatId`) -> MCatVariant (e.g. "Aluminium Armoured Cable") -> Product.
export interface PMcat {
  id: string;
  name: string;
  icon: string;
  /** Real category photo sourced from indiamart.com, shown in place of the icon placeholder. */
  image: string;
}

/** The tier a Brand attaches to directly (via `BrandMCat.mcatId` / `Product.mcatId`) — e.g.
    "Armoured Cable", "House Wire", "Power Cable", "Solar Cable" for KEI. Reached either by
    drilling into its parent PMcat (category-browse path) or straight from a brand's own
    catalog (brand-browse path skips the PMcat step entirely). */
export interface MCat {
  id: string;
  name: string;
  icon: string;
  pmcatId: string;
  /** Real category photo sourced from indiamart.com, used when this MCat has no branded
      product of its own yet to borrow a photo from. */
  image?: string;
}

/** Deepest real taxonomy tier (e.g. "Aluminium Armoured Cable" under the "Armoured Cable"
    MCat) — populated only where the real indiamart.com sub-taxonomy has been verified;
    products key off `mcatId` (the MCat) regardless, with `subMcatId` as an optional finer tag. */
export interface MCatVariant {
  id: string;
  name: string;
  mcatId: string;
}

export interface BrandMCat {
  id: string;
  brandId: string;
  mcatId: string;
  name: string;
  tagline: string;
  description: string;
  applications: string[];
}

export interface Brand {
  id: string;
  name: string;
  logo: string; // Tailwind icon class or placeholder abbreviation
  description: string;
  longDescription?: string;
  mcatId: string;
  subCategories: string[];
  rating: number;
  reviewsCount: number;
  buyersConnected: number;
  establishedYear: number;
  businessType: string;
  gstNumber?: string;
  panNumber?: string;
  cinNumber?: string;
  website?: string;
  headquarters: string;
  employees: string;
  annualTurnover?: string;
  verified: boolean;
  verifiedSince?: number;
  isOEM: boolean;
  certifications: string[];
  manufacturingUnits: number;
  countriesServed: number;
  topProducts: string[];
  features?: string[];
  catalogueUrl?: string;
  catalogueSizeMb?: number;
  catalogueUpdated?: string;
  // Quantified service breakdown (distinct from the single blended `rating`) — answers
  // three separate buyer questions: does the seller reply, is the product as described,
  // does delivery happen on time. Aggregated at brand level since per-review breakdowns
  // aren't tracked in this catalog.
  serviceMetrics: {
    responseRate: number; // % of enquiries that receive a reply
    qualityRate: number;  // % of buyers satisfied with product quality
    deliveryRate: number; // % of orders delivered on time
  };
}

export interface ServiceCenter {
  id: string;
  brandId: string;
  name: string;
  location: string;
  servicesOffered: string[];
  contactPhone: string;
  workingHours: string;
}

export interface Product {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  mcatId: string;
  brandMCatId?: string;
  image: string;
  /** Additional genuinely-distinct angles/photos for a card carousel — omitted (or a single
      entry) where the source image pool doesn't actually have more than one real photo, so a
      card never repeats the same image across slides just to pad out a carousel. */
  images?: string[];
  modelNumber: string;
  keySpecLabel: string;
  keySpecValue: string;
  priceRange: string;
  moq: string;
  deliveryTime: string;
  warranty: string;
  specifications: Record<string, string>;
  description: string;
  features: string[];
  useCases?: string[];
  /** Real MCatVariant this product belongs to within its (MCat-level) mcatId, where verified. */
  subMcatId?: string;
  certifications?: string[];
  certifiedBy?: string;
  certifiedYear?: number;
}

export interface Supplier {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  productId?: string;
  location: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  verified: boolean;
  isAuthorizedDealer: boolean;
  authorizedSince?: number;
  responseTime: string;
  // Distinct from responseTime: answers "does this seller reply at all", not just "how
  // fast" — a seller can be fast when they do respond but still reply rarely.
  responseRate: number;
  deliveryTimeRange: string;
  priceEstimate: string;
  contactPhone: string;
}

export interface AlternativeProduct {
  id: string;
  productId: string;
  brandName: string;
  modelNumber: string;
  mcatId: string;
  priceRange: string;
  keySpecLabel: string;
  keySpecValue: string;
}

export interface Review {
  id: string;
  brandId: string;
  productId?: string;
  userName: string;
  userRole: string;
  companyName: string;
  rating: number;
  comment: string;
  date: string;
}
