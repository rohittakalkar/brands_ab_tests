import type { Metadata, Viewport } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import BottomNav from "@/components/BottomNav";
import { BottomNavVisibilityProvider } from "@/components/BottomNavVisibility";
import { SearchScopeProvider } from "@/components/SearchScope";
import { getProducts } from "@/lib/data";
import { diversifyByKey } from "@/lib/diversify";

// Header autosuggest's fallback pool for every page that doesn't set its own page-scoped
// suggestions (i.e. everywhere except a Brand MCat page) — diversified across brands so it
// isn't just whichever brand's products happen to sort first in the catalog.
const DEFAULT_SEARCH_SUGGESTIONS = diversifyByKey(getProducts(), (p) => p.brandId, 60).map((p) => ({ id: p.id, name: p.name }));

export const metadata: Metadata = {
  title: "Brands — Shop Verified Manufacturers",
  description: "A mobile-only, brand-first B2B sourcing app: browse verified brands, their authorized sellers, and product catalogs.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0099E5",
};

// Pure mobile — no desktop breakpoint, no parallel wide layout. The max-w-sm frame is a
// phone-width column even on a wide browser window, not a responsive concession.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#EDEBEF]">
        <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col bg-[var(--color-canvas)] shadow-[0_0_40px_rgba(0,0,0,0.08)]">
          <SearchScopeProvider>
            <BottomNavVisibilityProvider>
              <NavBar defaultSuggestions={DEFAULT_SEARCH_SUGGESTIONS} />
              <main className="flex-1 pb-16">{children}</main>
              <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-sm">
                <BottomNav />
              </div>
            </BottomNavVisibilityProvider>
          </SearchScopeProvider>
        </div>
      </body>
    </html>
  );
}
