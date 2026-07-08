import Link from "next/link";
import CategoryIcon from "./CategoryIcon";

// Myntra's "Shop by Category" pattern: a circular icon avatar with a label underneath,
// not a square tile — reads as browsable/tappable the way a square info-card doesn't.
export default function CategoryTile({ category, href }: { category: { id: string; name: string; icon: string }; href: string }) {
  return (
    <Link href={href} className="flex w-[76px] shrink-0 flex-col items-center gap-2 text-center">
      <span className="flex size-8 items-center justify-center rounded-full bg-[var(--color-brand-dim)] text-[var(--color-brand)] transition-transform active:scale-95">
        <CategoryIcon icon={category.icon} className="size-3.5" />
      </span>
      <span className="text-[11px] font-semibold leading-tight text-[var(--color-ink)] line-clamp-2">{category.name}</span>
    </Link>
  );
}
