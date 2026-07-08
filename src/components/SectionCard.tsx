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
 * Every top-level section on the BrandMcat page renders inside one of these — a rounded,
 * bordered, softly-elevated card so a buyer can tell at a glance where "Best Sellers" ends and
 * "All Products" begins, rather than one continuous unbroken scroll. The colored top edge is
 * the section's own identity marker (paired with the same color on its heading icon), kept as
 * a thin accent rather than a full background fill so it reads as organization, not decoration.
 */
export default function SectionCard({
  accent,
  children,
  bordered = true,
  padded = true,
}: {
  accent: SectionAccent;
  children: ReactNode;
  /** Set false to drop the border/top-accent and rely on the shadow alone for separation. */
  bordered?: boolean;
  /** Set false to drop internal padding entirely, so content fills the section's full area. */
  padded?: boolean;
}) {
  return (
    <section
      className={`rounded-2xl ${padded ? "p-2" : "p-0"}`}
      style={{
        border: bordered ? "1px solid #E8EAF3" : "none",
        borderTop: bordered ? `2px solid ${SECTION_ACCENTS[accent]}` : "none",
        boxShadow: "0 1px 2px rgba(16,24,64,0.04), 0 4px 12px rgba(16,24,64,0.06)",
      }}
    >
      {children}
    </section>
  );
}
