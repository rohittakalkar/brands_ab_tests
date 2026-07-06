export interface ProductBadgeInfo {
  label: string;
  className: string;
}

const BADGES: ProductBadgeInfo[] = [
  { label: "Trending", className: "bg-[var(--color-brand-dim)] text-[var(--color-brand-ink)]" },
  { label: "New Arrival", className: "bg-indigo-50 text-indigo-700" },
  { label: "Top Rated", className: "bg-amber-50 text-amber-700" },
  { label: "Fast Moving", className: "bg-[var(--color-verified-dim)] text-[var(--color-verified)]" },
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Deterministic (not random) per-product label so the same product always gets the same badge
 * across renders/builds. Roughly 1 in 3 products gets a badge — real catalogs don't tag
 * everything, and a badge on every card would read as noise rather than a signal.
 */
export function pickProductBadge(productId: string): ProductBadgeInfo | null {
  const h = hashString(productId);
  if (h % 3 !== 0) return null;
  return BADGES[Math.floor(h / 3) % BADGES.length];
}
