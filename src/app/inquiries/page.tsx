import { MessageCircle } from "lucide-react";
import { getLeads } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = { title: "My Inquiries — Brands" };

export default function InquiriesPage() {
  const leads = getLeads();

  return (
    <div className="pb-6">
      <Breadcrumbs items={[{ label: "Inquiries" }]} />
      <div className="px-4 pt-2 pb-3">
        <h1 className="text-lg font-black">My Inquiries</h1>
      </div>

      {leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 px-8 py-20 text-center">
          <MessageCircle className="size-10 text-[var(--color-ink-faint)]" aria-hidden="true" />
          <p className="text-sm font-bold">No inquiries yet</p>
          <p className="text-xs text-[var(--color-ink-dim)]">
            When you request a quote from a product page, it&apos;ll show up here so you can track responses.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 px-4">
          {leads.map((lead) => (
            <div key={lead.id} className="rounded-2xl border border-[var(--color-line)] p-3.5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[13px] font-extrabold leading-snug">{lead.productName}</p>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${
                    lead.status === "completed"
                      ? "bg-[var(--color-verified-dim)] text-[var(--color-verified)]"
                      : lead.status === "connected"
                      ? "bg-indigo-50 text-indigo-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {lead.status}
                </span>
              </div>
              <p className="mt-1.5 text-[11px] text-[var(--color-ink-dim)]">Qty: {lead.quantity} · {lead.location}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
