import Link from "next/link";
import CategoryIcon from "./CategoryIcon";

// Myntra's "Shop by Category" pattern: a circular avatar with a label underneath, not a
// square tile — reads as browsable/tappable the way a square info-card doesn't. The avatar
// shows the category's real indiamart.com product photo where one exists; falls back to a
// generic icon for MCats that don't have a branded product yet.
export default function CategoryTile({ category, href }: { category: { id: string; name: string; image?: string; icon?: string }; href: string }) {
  return (
    <Link href={href} className="flex w-[76px] shrink-0 flex-col items-center gap-2 text-center">
      <span className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-[var(--color-brand-dim)] text-[var(--color-brand)] ring-1 ring-[var(--color-line)] transition-transform active:scale-95">
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        ) : (
          <CategoryIcon icon={category.icon ?? "Layers"} className="size-5" />
        )}
      </span>
      <span className="text-[11px] font-semibold leading-tight text-[var(--color-ink)] line-clamp-2">{category.name}</span>
    </Link>
  );
}
