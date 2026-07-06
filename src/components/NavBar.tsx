"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";
import ThemeSwitcherButton from "./ThemeSwitcherButton";

export default function NavBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <header className="sticky top-0 z-30 flex items-center gap-2.5 border-b border-[var(--color-line)] bg-[var(--color-surface)]/95 backdrop-blur px-3 py-2.5 safe-top">
      <Link href="/" className="shrink-0 text-lg font-black tracking-tight text-[var(--color-ink)]">
        Brands<span className="text-[var(--color-brand)]">.</span>
      </Link>
      <form
        onSubmit={(e) => { e.preventDefault(); if (query.trim()) router.push(`/search?q=${encodeURIComponent(query)}`); }}
        className="flex flex-1 items-center gap-2 rounded-full bg-[var(--color-surface-2)] px-3 py-2"
      >
        <Search className="size-4 shrink-0 text-[var(--color-ink-faint)]" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search brands, products…"
          aria-label="Search"
          className="w-full min-w-0 bg-transparent text-[13px] outline-none placeholder:text-[var(--color-ink-faint)]"
        />
      </form>
      <ThemeSwitcherButton />
    </header>
  );
}
