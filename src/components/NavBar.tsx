"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import ThemeSwitcherButton from "./ThemeSwitcherButton";
import { useSearchScope } from "./SearchScope";

export default function NavBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const { label, suggestions } = useSearchScope();

  // Scoped to whatever page is currently mounted (e.g. "Xiaomi Mobile Phones") via SearchScope —
  // falls back to the generic site-wide placeholder everywhere else.
  const placeholder = label ? `Search in ${label}` : "Search brands, products…";

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return suggestions.filter((s) => s.name.toLowerCase().includes(q)).slice(0, 6);
  }, [query, suggestions]);

  const go = (q: string) => {
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center gap-2.5 border-b border-[var(--color-line)] bg-[var(--color-surface)]/95 backdrop-blur px-3 py-2.5 safe-top">
      <Link href="/" className="shrink-0 text-[15px] font-black tracking-tight text-[var(--color-ink)]">
        india<span className="text-[var(--color-brand)]">MART</span>
        <span className="text-[var(--color-brand)]">.</span>
        <span className="font-black italic text-[var(--color-ink)]">Brandz</span>
      </Link>
      <div className="relative flex-1">
        <form
          onSubmit={(e) => { e.preventDefault(); go(query); }}
          className="flex items-center gap-2 rounded-full bg-[var(--color-surface-2)] px-3 py-2"
        >
          <Search className="size-4 shrink-0 text-[var(--color-ink-faint)]" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder={placeholder}
            aria-label="Search"
            className="w-full min-w-0 bg-transparent text-[13px] outline-none placeholder:text-[var(--color-ink-faint)]"
          />
        </form>

        {focused && matches.length > 0 && (
          <div className="absolute inset-x-0 top-full z-40 mt-1 overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] shadow-lg">
            {matches.map((s) => (
              <Link
                key={s.id}
                href={`/product/${s.id}`}
                onMouseDown={(e) => e.preventDefault()}
                className="flex items-center gap-2 border-b border-[var(--color-line)] px-3 py-2 text-[12px] font-medium text-[var(--color-ink)] last:border-b-0 active:bg-[var(--color-surface-2)]"
              >
                <Search className="size-3 shrink-0 text-[var(--color-ink-faint)]" aria-hidden="true" />
                <span className="truncate">{s.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
      <ThemeSwitcherButton />
    </header>
  );
}
