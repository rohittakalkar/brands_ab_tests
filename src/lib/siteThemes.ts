export type SiteTheme =
  | "default"
  | "industrybuying"
  | "tradeindia"
  | "indiamart"
  | "udaan"
  | "moglix"
  | "amazon"
  | "flipkart"
  | "blinkit";

export interface SiteThemeDef {
  id: SiteTheme;
  label: string;
  /** Swatch color shown in the picker — matches the theme's `--color-brand` override. */
  swatch: string;
}

/** Rendered in the theme picker, in this order. Colors approximate each platform's real
    primary brand color — actual CSS overrides live in globals.css under `[data-site-theme]`. */
export const SITE_THEMES: SiteThemeDef[] = [
  { id: "default", label: "Default (Off)", swatch: "#F0286B" },
  { id: "industrybuying", label: "IndustryBuying", swatch: "#F26522" },
  { id: "tradeindia", label: "TradeIndia", swatch: "#0B5FA5" },
  { id: "indiamart", label: "IndiaMart", swatch: "#0D0A8C" },
  { id: "udaan", label: "Udaan", swatch: "#FF6E1B" },
  { id: "moglix", label: "Moglix", swatch: "#E31E24" },
  { id: "amazon", label: "Amazon", swatch: "#FF9900" },
  { id: "flipkart", label: "Flipkart", swatch: "#2874F0" },
  { id: "blinkit", label: "Blinkit", swatch: "#0C831F" },
];
