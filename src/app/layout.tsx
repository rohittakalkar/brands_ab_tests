import type { Metadata, Viewport } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import BottomNav from "@/components/BottomNav";
import { WishlistProvider } from "@/components/WishlistProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BottomNavVisibilityProvider } from "@/components/BottomNavVisibility";
import { SearchScopeProvider } from "@/components/SearchScope";

// Applies any saved theme before first paint — without this, the page would render with the
// default pink theme for a frame, then visibly snap to the saved theme once React hydrates.
// Also repaints the mobile browser's own status/address bar (the <meta name="theme-color">
// tag) to match — otherwise that chrome stays hardcoded pink even after switching themes.
const THEME_COLORS: Record<string, string> = {
  default: "#F0286B",
  industrybuying: "#F26522",
  tradeindia: "#0B5FA5",
  indiamart: "#0D0A8C",
  udaan: "#FF6E1B",
  moglix: "#E31E24",
  amazon: "#FF9900",
  flipkart: "#2874F0",
  blinkit: "#0C831F",
};
const NO_FLASH_THEME_SCRIPT = `
(function () {
  try {
    var THEME_COLORS = ${JSON.stringify(THEME_COLORS)};
    var t = window.localStorage.getItem("site-theme");
    if (t && t !== "default") document.documentElement.setAttribute("data-site-theme", t);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", THEME_COLORS[t] || THEME_COLORS.default);
  } catch (e) {}
})();
`;

export const metadata: Metadata = {
  title: "Brands — Shop Verified Manufacturers",
  description: "A mobile-only, brand-first B2B sourcing app: browse verified brands, their authorized sellers, and product catalogs.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#F0286B",
};

// Pure mobile — no desktop breakpoint, no parallel wide layout. The max-w-sm frame is a
// phone-width column even on a wide browser window, not a responsive concession.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }} />
      </head>
      <body className="min-h-full bg-[#EDEBEF]">
        <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col bg-[var(--color-canvas)] shadow-[0_0_40px_rgba(0,0,0,0.08)]">
          <ThemeProvider>
            <WishlistProvider>
              <SearchScopeProvider>
                <BottomNavVisibilityProvider>
                  <NavBar />
                  <main className="flex-1 pb-16">{children}</main>
                  <div className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-sm">
                    <BottomNav />
                  </div>
                </BottomNavVisibilityProvider>
              </SearchScopeProvider>
            </WishlistProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
