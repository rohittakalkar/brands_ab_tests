import type { ReactNode } from "react";

export const SECTION_ACCENTS = {
  amber: "#0a0a0a",
  rose: "#0a0a0a",
  sky: "#0a0a0a",
  violet: "#0a0a0a",
  emerald: "#0a0a0a",
} as const;

export type SectionAccent = keyof typeof SECTION_ACCENTS;

/**
 * Every top-level section on the Brand MCAT page renders inside one of these — a rounded,
 * bordered, softly-elevated card so a buyer can tell at a glance where "Best Sellers" ends and
 * "All Products" begins, rather than one continuous unbroken scroll. The colored top edge is
 * the section's own identity marker (paired with the same color on its heading icon), kept as
 * a thin accent rather than a full background fill so it reads as organization, not decoration.
 */
export default function SectionCard({ accent, children }: { accent: SectionAccent; children: ReactNode }) {
  return (
    <section
      className="rounded-2xl p-3"
      style={{
        border: "1px solid #E8EAF3",
        borderTop: `2px solid ${SECTION_ACCENTS[accent]}`,
        boxShadow: "0 1px 2px rgba(16,24,64,0.04), 0 4px 12px rgba(16,24,64,0.06)",
      }}
    >
      {children}
    </section>
  );
}
