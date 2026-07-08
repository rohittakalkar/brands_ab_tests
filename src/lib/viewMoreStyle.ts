/**
 * Each of the 5 BrandMcat page variants gets its own "View More" treatment instead of one
 * identical link everywhere — a plain text link for V1's minimal "Clarity" design reads very
 * differently from a solid pill in V5's "Trust" design, and using the same one everywhere would
 * flatten that distinction. Keyed by the page variant number (1-5), shared by every section's
 * View More control so a given page stays internally consistent.
 */
export function viewMoreClassName(variant: number): string {
  switch (variant) {
    case 2:
      return "flex shrink-0 items-center gap-1 rounded-full border border-[var(--color-line)] px-2.5 py-1 text-[9.5px] font-extrabold text-[var(--color-ink)]";
    case 3:
      return "flex shrink-0 items-center gap-0.5 text-[9.5px] font-bold uppercase tracking-wide text-[var(--color-ink-dim)]";
    case 4:
      return "flex shrink-0 items-center gap-0.5 text-[9.5px] font-bold text-[var(--color-brand)] underline underline-offset-2";
    case 5:
      return "flex shrink-0 items-center gap-1 rounded-full bg-[var(--color-brand)] px-2.5 py-1 text-[9.5px] font-extrabold text-white";
    default:
      return "flex shrink-0 items-center gap-0.5 text-[9.5px] font-bold text-[var(--color-brand)]";
  }
}
