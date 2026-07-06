"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import BottomSheet from "./BottomSheet";

export default function StickyBuyBar({ productName, sellerName }: { productName: string; sellerName: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* One-click conversion — no call button (doesn't fit a B2B RFQ flow) and no
          quantity/phone form up front; the confirmation itself is the whole interaction. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-line)] bg-[var(--color-surface)]/95 backdrop-blur px-4 py-3 safe-bottom shadow-[0_-6px_16px_rgba(16,24,64,0.10)]">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full rounded-xl bg-[var(--color-brand)] py-3.5 text-center text-sm font-extrabold text-white shadow-[0_6px_16px_rgba(240,40,107,0.35)] active:scale-[0.99] transition-transform"
        >
          Get Best Price
        </button>
      </div>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Request sent">
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <CheckCircle2 className="size-12 text-[var(--color-verified)]" aria-hidden="true" />
          <p className="text-sm font-bold">Your interest in {productName} was shared with {sellerName}.</p>
          <p className="text-xs text-[var(--color-ink-dim)]">They typically respond within a few hours — track it under Inquiries.</p>
          <button onClick={() => setOpen(false)} className="mt-2 w-full rounded-xl bg-[var(--color-ink)] py-3 text-sm font-bold text-white">Done</button>
        </div>
      </BottomSheet>
    </>
  );
}
