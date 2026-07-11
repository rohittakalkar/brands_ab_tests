"use client";

import { Phone } from "lucide-react";

/** Isolated as its own Client Component so the parent product card can stay a plain,
    server-renderable component. Rendered as a <button> rather than an <a href="tel:...">
    because product cards already wrap themselves in a "view product" <Link> — nesting an
    <a> inside an <a> is invalid HTML and breaks hydration. */
export default function CallNowAction({ contactPhone, className }: { contactPhone: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = `tel:${contactPhone}`;
      }}
      className={
        className ??
        "flex flex-1 items-center justify-center gap-1 rounded-lg border border-[var(--color-line)] py-1.5 text-[10px] font-extrabold text-[var(--color-ink)] active:scale-[0.98]"
      }
    >
      <Phone className="size-3" aria-hidden="true" />
      Call Now
    </button>
  );
}
