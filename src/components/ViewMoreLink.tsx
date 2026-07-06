import Link from "next/link";
import { ChevronRight } from "lucide-react";

/** A section-header "View More" — smart in that it always knows exactly where "more" of this
    particular section actually lives (the full catalog anchor, the category page, etc.),
    passed in by the caller rather than guessed. */
export default function ViewMoreLink({ href, label = "View More" }: { href: string; label?: string }) {
  return (
    <Link href={href} className="flex shrink-0 items-center gap-0.5 text-[9.5px] font-bold text-[var(--color-brand)]">
      {label}
      <ChevronRight className="size-3" aria-hidden="true" />
    </Link>
  );
}
