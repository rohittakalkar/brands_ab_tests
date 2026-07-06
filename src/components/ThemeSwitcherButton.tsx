"use client";

import { useState } from "react";
import { Palette, Check } from "lucide-react";
import BottomSheet from "./BottomSheet";
import { useSiteTheme } from "./ThemeProvider";
import { SITE_THEMES } from "@/lib/siteThemes";

/** Header CTA that swaps the whole project's color theme — a marketplace-comparison mode for
    reviewing the same pages under a different platform's visual identity. */
export default function ThemeSwitcherButton() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useSiteTheme();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Change theme"
        className="relative shrink-0 p-1 text-[var(--color-ink)]"
      >
        <Palette className="size-5.5" aria-hidden="true" />
        {theme !== "default" && (
          <span
            className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full ring-2 ring-[var(--color-surface)]"
            style={{ background: "var(--color-brand)" }}
          />
        )}
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Marketplace Theme">
        <p className="-mt-1 mb-3 text-xs text-[var(--color-ink-dim)]">
          Restyles the whole app in another platform&rsquo;s colors. Off keeps this app&rsquo;s own look.
        </p>
        <div className="flex flex-col divide-y divide-[var(--color-line)]">
          {SITE_THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => { setTheme(t.id); setOpen(false); }}
              className="flex items-center gap-3 py-3 text-left"
            >
              <span className="size-6 shrink-0 rounded-full border border-black/10" style={{ background: t.swatch }} aria-hidden="true" />
              <span className="flex-1 text-[13px] font-semibold">{t.label}</span>
              {theme === t.id && <Check className="size-4 shrink-0 text-[var(--color-brand)]" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </BottomSheet>
    </>
  );
}
