"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { SITE_THEMES, type SiteTheme } from "@/lib/siteThemes";

const STORAGE_KEY = "site-theme";
const THEME_COLOR_BY_ID = Object.fromEntries(SITE_THEMES.map((t) => [t.id, t.swatch])) as Record<SiteTheme, string>;

const ThemeContext = createContext<{ theme: SiteTheme; setTheme: (t: SiteTheme) => void } | null>(null);

/** Sitewide theme — swaps the `--color-brand*` tokens everything in the app already reads
    from (buttons, CTAs, prices, active states), so one attribute on <html> reskins the whole
    project. Defaults to off (the app's own pink identity); persists the choice in
    localStorage so it survives navigation and reloads. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<SiteTheme>("default");

  useEffect(() => {
    // Deliberately reads localStorage post-mount rather than in a lazy useState initializer:
    // state must start at "default" on both server and client so the very first client render
    // matches SSR exactly (no hydration mismatch) — the real value is applied a tick later,
    // by which point the no-flash inline script in layout.tsx has already painted the right
    // colors at the DOM level regardless of this component's state.
    const stored = window.localStorage.getItem(STORAGE_KEY) as SiteTheme | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setThemeState(stored);
  }, []);

  useEffect(() => {
    if (theme === "default") document.documentElement.removeAttribute("data-site-theme");
    else document.documentElement.setAttribute("data-site-theme", theme);
    // Keep the mobile browser's own status/address bar in sync with the picked theme —
    // otherwise that chrome stays whatever color it last happened to be.
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR_BY_ID[theme]);
  }, [theme]);

  const setTheme = (t: SiteTheme) => {
    setThemeState(t);
    window.localStorage.setItem(STORAGE_KEY, t);
  };

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useSiteTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useSiteTheme must be used within a ThemeProvider");
  return ctx;
}
