"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import BottomSheet from "./BottomSheet";

/**
 * The one CTA every buyer surface converges on. One click — no quantity/phone form first —
 * immediately confirms the interest was shared, then lets the buyer add details later from
 * Inquiries if they want to. Every "Get Best Price" trigger on the page (cards, quick view,
 * sticky bar) should render through this so the flow stays identical everywhere.
 */
export default function GetBestPriceAction({
  productName,
  sellerName,
  label = "Get Best Price",
  className,
  onDone,
}: {
  productName: string;
  sellerName: string;
  label?: string;
  className?: string;
  /** Called (in addition to closing this sheet) when the buyer taps "Done" — lets a caller
      that opened this from inside its own popup (e.g. a long-press quick view) close both
      at once, instead of leaving the quick view stranded open underneath. */
  onDone?: () => void;
}) {
  const [open, setOpen] = useState(false);

  const close = () => {
    setOpen(false);
    onDone?.();
  };

  return (
    <>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        className={
          className ??
          "w-full rounded-lg bg-[var(--color-brand)] py-1.5 text-[10px] font-extrabold text-white active:scale-[0.98]"
        }
      >
        {label}
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Request sent">
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <CheckCircle2 className="size-12 text-[var(--color-verified)]" aria-hidden="true" />
          <p className="text-sm font-bold">Your interest in {productName} was shared with {sellerName}.</p>
          <p className="text-xs text-[var(--color-ink-dim)]">They typically respond within a few hours — track it under Inquiries.</p>
          <button onClick={close} className="mt-1 w-full rounded-xl bg-[var(--color-ink)] py-3 text-sm font-bold text-white">
            Done
          </button>
        </div>
      </BottomSheet>
    </>
  );
}
