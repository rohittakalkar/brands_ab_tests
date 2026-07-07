"use client";

import { ChevronRight } from "lucide-react";
import { viewMoreClassName } from "@/lib/viewMoreStyle";

/** Same look as ViewMoreLink, but for sections where "more" means revealing more of this same
    section in place (Most Selling, Best Sellers) rather than navigating elsewhere. */
export default function ViewMoreButton({ onClick, label = "View More", variant = 1 }: { onClick: () => void; label?: string; variant?: number }) {
  return (
    <button type="button" onClick={onClick} className={viewMoreClassName(variant)}>
      {label}
      <ChevronRight className="size-3" aria-hidden="true" />
    </button>
  );
}
