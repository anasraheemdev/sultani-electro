"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/database";

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    setUser: (user: User | null) => void;
    setIsAdmin: (isAdmin: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isAdmin: false,

            setUser: (user) => {
                set({
                    user,
                    isAuthenticated: !!user,
                });
            },

            setIsAdmin: (isAdmin) => {
                set({ isAdmin });
            },

            logout: () => {
                set({
                    user: null,
                    isAuthenticated: false,
                    isAdmin: false,
                });
            },
        }),
        {
            name: "sultani-auth",
        }
    )
);
