"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

const BottomNavVisibilityContext = createContext(false);

/** Single shared scroll-direction listener behind the bottom nav's show/hide behavior — any
    other fixed-to-the-bottom UI (e.g. ProductBrowser's sort/filter bar) reads the same value
    instead of running its own listener, so the two stay in sync: when the nav slides away, the
    bar above it can drop down to fill the space it vacated. */
export function BottomNavVisibilityProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (delta < -4) setVisible(true);
      else if (delta > 4) setVisible(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <BottomNavVisibilityContext.Provider value={visible}>{children}</BottomNavVisibilityContext.Provider>;
}

export function useBottomNavVisible() {
  return useContext(BottomNavVisibilityContext);
}
