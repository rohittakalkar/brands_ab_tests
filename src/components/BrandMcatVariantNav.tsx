import Link from "next/link";

const VARIANTS = [
  { n: 1, label: "IA & Compliance" },
  { n: 2, label: "Discovery" },
  { n: 3, label: "Conversion" },
  { n: 4, label: "Cross-sell" },
  { n: 5, label: "Trust-First" },
];

/** Dev-facing switcher so the 5 Brand MCAT variants can be compared side by side. Not part of any single variant's design. */
export default function BrandMcatVariantNav({ slug, category, active }: { slug: string; category: string; active: number }) {
  return (
    <div className="sticky top-0 z-30 flex gap-1.5 overflow-x-auto scrollbar-none border-b border-[var(--color-line)] bg-[var(--color-surface)]/95 px-3 py-2 backdrop-blur">
      {VARIANTS.map((v) => (
        <Link
          key={v.n}
          href={`/brand/${slug}/${category}/v${v.n}`}
          className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-bold whitespace-nowrap ${
            v.n === active ? "bg-[var(--color-ink)] text-white" : "bg-[var(--color-surface-2)] text-[var(--color-ink-dim)]"
          }`}
        >
          V{v.n} · {v.label}
        </Link>
      ))}
    </div>
  );
}
