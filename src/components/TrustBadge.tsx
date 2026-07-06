import { ShieldCheck, BadgeCheck, Factory, Award } from "lucide-react";

export type TrustBadgeType = "verified-supplier" | "authorized-dealer" | "manufacturer-oem" | "certified-product";

const DEFS: Record<TrustBadgeType, { icon: typeof ShieldCheck; label: string; classes: string }> = {
  "verified-supplier": { icon: ShieldCheck, label: "Verified", classes: "bg-[var(--color-verified-dim)] text-[var(--color-verified)]" },
  "authorized-dealer": { icon: BadgeCheck, label: "Authorized Dealer", classes: "bg-indigo-50 text-indigo-700" },
  "manufacturer-oem": { icon: Factory, label: "OEM", classes: "bg-amber-50 text-amber-700" },
  "certified-product": { icon: Award, label: "Certified", classes: "bg-violet-50 text-violet-700" },
};

export default function TrustBadge({ type, className = "" }: { type: TrustBadgeType; className?: string }) {
  const def = DEFS[type];
  const Icon = def.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${def.classes} ${className}`}>
      <Icon className="size-3" aria-hidden="true" />
      {def.label}
    </span>
  );
}
