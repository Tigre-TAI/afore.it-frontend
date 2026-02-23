"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Crumb = { href?: string; label: string };

type BreadcrumbContextValue = {
  items: Crumb[] | null;
  setItems: (items: Crumb[] | null) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [items, setItemsState] = useState<Crumb[] | null>(null);
  const setItems = useCallback((next: Crumb[] | null) => {
    setItemsState(next);
  }, []);
  return (
    <BreadcrumbContext.Provider value={{ items, setItems }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const ctx = useContext(BreadcrumbContext);
  return ctx ?? { items: null, setItems: () => {} };
}
