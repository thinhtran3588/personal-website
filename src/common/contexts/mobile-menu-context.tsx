"use client";

import { createContext, useContext } from "react";

const MobileMenuContext = createContext(false);

export function useMobileMenu(): boolean {
  return useContext(MobileMenuContext);
}

export const MobileMenuProvider = MobileMenuContext.Provider;
