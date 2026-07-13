"use client";

import { MessageSquare, Phone } from "lucide-react";
import GetBestPriceAction from "./GetBestPriceAction";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.45 1.27 4.9L2 22l5.25-1.38A9.96 9.96 0 0 0 12.04 22c5.52 0 10-4.48 10-10s-4.48-10-10-10Zm5.87 14.2c-.25.7-1.45 1.34-2 1.42-.5.08-1.15.11-1.86-.12-.43-.13-.98-.32-1.68-.62-2.96-1.28-4.89-4.25-5.04-4.45-.15-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.59-.37.78-.37.2 0 .39 0 .56.01.18.01.42-.07.66.5.25.6.84 2.07.91 2.22.08.15.13.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.02 1.12.99 2.06 1.3 2.36 1.44.3.15.48.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.66-.15.27.1 1.7.8 1.99.95.3.15.49.22.56.35.08.13.08.72-.17 1.42Z" />
    </svg>
  );
}

/** Fixed bottom action bar matching the real IndiaMART seller page — Contact / WhatsApp /
    Call Now always visible on a brand hub page, distinct from the per-product "Get Best Price"
    + "Call Now" pair on each card above. */
export default function StickyContactBar({ brandName, contactPhone }: { brandName: string; contactPhone?: string }) {
  const digits = contactPhone?.replace(/\D/g, "");

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-sm gap-1.5 border-t border-[var(--color-line)] bg-[var(--color-surface)]/95 px-3 py-2.5 backdrop-blur safe-bottom shadow-[0_-6px_16px_rgba(16,24,64,0.10)]">
      <GetBestPriceAction
        productName="your catalog"
        sellerName={brandName}
        label="Contact"
        icon={<MessageSquare className="size-3.5" aria-hidden="true" />}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[var(--color-ink)] py-2.5 text-[11px] font-extrabold text-white active:scale-[0.98]"
      />
      {digits ? (
        <a
          href={`https://wa.me/91${digits}`}
          target="_blank"
          rel="noreferrer"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#25D366] py-2.5 text-[11px] font-extrabold text-white active:scale-[0.98]"
        >
          <WhatsAppIcon className="size-3.5" />
          WhatsApp
        </a>
      ) : (
        <span className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[var(--color-surface-2)] py-2.5 text-[11px] font-extrabold text-[var(--color-ink-faint)]">
          <WhatsAppIcon className="size-3.5" />
          WhatsApp
        </span>
      )}
      {contactPhone ? (
        <a
          href={`tel:${contactPhone}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[var(--color-brand)] py-2.5 text-[11px] font-extrabold text-white active:scale-[0.98]"
        >
          <Phone className="size-3.5" aria-hidden="true" />
          Call Now
        </a>
      ) : (
        <span className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[var(--color-surface-2)] py-2.5 text-[11px] font-extrabold text-[var(--color-ink-faint)]">
          <Phone className="size-3.5" aria-hidden="true" />
          Call Now
        </span>
      )}
    </div>
  );
}
