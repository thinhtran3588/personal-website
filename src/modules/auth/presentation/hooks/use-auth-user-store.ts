"use client";

import { create } from "zustand";

import type { AuthUser } from "@/modules/auth/domain/types";

type AuthUserState = {
  user: AuthUser | null;
  loading: boolean;
  setAuthState: (user: AuthUser | null, loading: boolean) => void;
};

export const useAuthUserStore = create<AuthUserState>((set) => ({
  user: null,
  loading: true,
  setAuthState: (user, loading) => set({ user, loading }),
}));
