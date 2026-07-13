"use client";

import { useState, type ReactNode } from "react";
import type { ComponentType } from "react";
import { ShoppingBag, LayoutGrid, User, Image as ImageIcon, PlayCircle, Star } from "lucide-react";

const TAB_ICONS: Record<string, ComponentType<{ className?: string; "aria-hidden"?: boolean }>> = {
  Products: ShoppingBag,
  Categories: LayoutGrid,
  About: User,
  Photos: ImageIcon,
  Videos: PlayCircle,
  Reviews: Star,
};

/**
 * Sticky horizontal tab strip matching the real IndiaMART seller page (Products / Categories /
 * About / Photos / Videos / Reviews) — each tab's content is server-rendered ahead of time by
 * the caller and handed in as `panels`, keyed by the same label used in `tabs`; this component
 * only owns which panel is visible, so the page itself stays a Server Component.
 */
export default function BrandTabs({ tabs, panels }: { tabs: string[]; panels: Record<string, ReactNode> }) {
  const [active, setActive] = useState(tabs[0]);

  return (
    <div>
      <div className="sticky top-14 z-20 flex overflow-x-auto scrollbar-none border-b border-[var(--color-line)] bg-[var(--color-surface)]">
        {tabs.map((tab) => {
          const Icon = TAB_ICONS[tab] ?? ShoppingBag;
          const isActive = tab === active;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActive(tab)}
              className={`flex shrink-0 flex-col items-center gap-0.5 px-4 py-2 text-[10px] font-bold ${
                isActive ? "border-b-2 border-[var(--color-brand)] text-[var(--color-brand)]" : "text-[var(--color-ink-faint)]"
              }`}
            >
              <Icon className="size-4" />
              {tab}
            </button>
          );
        })}
      </div>
      {panels[active]}
    </div>
  );
}
