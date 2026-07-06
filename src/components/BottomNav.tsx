"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Home, LayoutGrid, Tags, MessageCircle } from "lucide-react";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/category/industrial-pumps", label: "Categories", icon: LayoutGrid },
  { href: "/brands", label: "Brands", icon: Tags },
  { href: "/inquiries", label: "Inquiries", icon: MessageCircle },
];

export default function BottomNav() {
  const pathname = usePathname();
  // Hidden by default so the bar isn't permanently eating screen space — a scroll-up gesture
  // (the "I want to go somewhere" signal) reveals it; scrolling down hides it again.
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

  // PDP owns the bottom edge with its own sticky buy bar — a second fixed bar there would
  // stack two competing bottom-of-screen bars.
  if (pathname.startsWith("/product/")) return null;

  return (
    <nav
      className={`grid grid-cols-4 border-t border-[var(--color-line)] bg-[var(--color-surface)] safe-bottom transition-transform duration-200 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {items.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href.split("/").slice(0, 2).join("/"));
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className="flex flex-col items-center justify-center gap-1 py-2.5"
          >
            <Icon className={`size-5 ${active ? "text-[var(--color-brand)]" : "text-[var(--color-ink-faint)]"}`} aria-hidden="true" />
            <span className={`text-[9.5px] font-bold ${active ? "text-[var(--color-brand)]" : "text-[var(--color-ink-faint)]"}`}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
