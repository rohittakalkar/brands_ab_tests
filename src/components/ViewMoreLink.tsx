import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { viewMoreClassName } from "@/lib/viewMoreStyle";

/** A section-header "View More" — smart in that it always knows exactly where "more" of this
    particular section actually lives (the category page, etc.), passed in by the caller rather
    than guessed. Styled per page variant (see lib/viewMoreStyle) so it isn't identical across
    all 5 designs. */
export default function ViewMoreLink({ href, label = "View More", variant = 1 }: { href: string; label?: string; variant?: number }) {
  return (
    <Link href={href} className={viewMoreClassName(variant)}>
      {label}
      <ChevronRight className="size-3" aria-hidden="true" />
    </Link>
  );
}
