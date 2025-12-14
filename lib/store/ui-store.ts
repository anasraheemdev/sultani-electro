"use client";

import { create } from "zustand";

interface UIStore {
    // Mobile menu
    isMobileMenuOpen: boolean;
    setMobileMenuOpen: (isOpen: boolean) => void;
    toggleMobileMenu: () => void;

    // Cart drawer
    isCartOpen: boolean;
    setCartOpen: (isOpen: boolean) => void;
    toggleCart: () => void;

    // Search modal
    isSearchOpen: boolean;
    setSearchOpen: (isOpen: boolean) => void;
    toggleSearch: () => void;

    // Product quick view
    quickViewProductId: string | null;
    setQuickViewProduct: (productId: string | null) => void;

    // Loading states
    isLoading: boolean;
    setLoading: (isLoading: boolean) => void;
}

export const useUIStore = create<UIStore>()((set) => ({
    // Mobile menu
    isMobileMenuOpen: false,
    setMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
    toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

    // Cart drawer
    isCartOpen: false,
    setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
    toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

    // Search modal
    isSearchOpen: false,
    setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),
    toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),

    // Product quick view
    quickViewProductId: null,
    setQuickViewProduct: (productId) => set({ quickViewProductId: productId }),

    // Loading states
    isLoading: false,
    setLoading: (isLoading) => set({ isLoading }),
}));
