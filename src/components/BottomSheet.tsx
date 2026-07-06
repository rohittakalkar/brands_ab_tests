"use client";

import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

export default function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  // Portaled to <body> rather than rendered in place: any caller nested inside a positioned
  // ancestor with its own z-index (e.g. the sticky header) would otherwise trap this sheet
  // inside that ancestor's stacking context, capping it below other fixed elements elsewhere
  // on the page (StickyBuyBar, sticky sort/filter bar) no matter how high z-50 looks on paper.
  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
      />
      <div className="relative max-h-[75vh] overflow-y-auto rounded-t-3xl bg-[var(--color-surface)] shadow-[0_-8px_30px_rgba(0,0,0,0.15)] safe-bottom">
        <div className="sticky top-0 flex items-center justify-between border-b border-[var(--color-line)] bg-[var(--color-surface)] px-5 py-4">
          <h3 className="text-sm font-extrabold">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="rounded-full p-1 text-[var(--color-ink-faint)]">
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>,
    document.body
  );
}
