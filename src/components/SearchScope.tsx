"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface SearchSuggestion {
  id: string;
  name: string;
}

interface SearchScopeValue {
  label: string | null;
  suggestions: SearchSuggestion[];
}

const EMPTY: SearchScopeValue = { label: null, suggestions: [] };

const SearchScopeContext = createContext<{ scope: SearchScopeValue; setScope: (v: SearchScopeValue | null) => void }>({
  scope: EMPTY,
  setScope: () => {},
});

export function SearchScopeProvider({ children }: { children: ReactNode }) {
  const [scope, setScopeState] = useState<SearchScopeValue>(EMPTY);
  const setScope = (v: SearchScopeValue | null) => setScopeState(v ?? EMPTY);
  return <SearchScopeContext.Provider value={{ scope, setScope }}>{children}</SearchScopeContext.Provider>;
}

export function useSearchScope() {
  return useContext(SearchScopeContext).scope;
}

/** Rendered by a Brand MCAT page (a Server Component) to hand the header search bar this page's
    context — "Search in {Brand} {Category}" instead of a generic placeholder, and typeahead
    suggestions scoped to this catalog instead of the whole site. Clears itself on unmount so
    navigating away doesn't leave a stale scope active on the next page. */
export function SetSearchScope({ label, suggestions }: { label: string; suggestions: SearchSuggestion[] }) {
  const { setScope } = useContext(SearchScopeContext);
  useEffect(() => {
    setScope({ label, suggestions });
    return () => setScope(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label]);
  return null;
}
