import type { ComponentType } from "react";
import { SECTION_ACCENTS, type SectionAccent } from "./SectionCard";

const ANIMATION_CLASS = {
  bounce: "animate-bounce",
  pulse: "animate-pulse",
  spin: "animate-spin",
} as const;

/**
 * Every section heading renders through this — bright, title-cased (not all-caps), and paired
 * with a small animated icon in the section's own accent color (matching that section's card
 * top-edge), so the heading and its container read as one unit rather than a generic label
 * sitting on top of an unrelated box.
 */
export default function SectionHeading({
  icon: Icon,
  animation,
  accent,
  children,
}: {
  icon: ComponentType<{ className?: string; style?: React.CSSProperties; "aria-hidden"?: boolean }>;
  animation: keyof typeof ANIMATION_CLASS;
  accent: SectionAccent;
  children: React.ReactNode;
}) {
  const color = SECTION_ACCENTS[accent];
  return (
    <h2 className="flex min-w-0 items-center gap-1.5 text-[11px] font-black" style={{ color }}>
      <Icon className={`size-3 shrink-0 ${ANIMATION_CLASS[animation]}`} style={{ color }} aria-hidden={true} />
      <span className="truncate">{children}</span>
    </h2>
  );
}
