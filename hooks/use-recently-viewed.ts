"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    discounted_price: number | null;
    image: string;
}

interface RecentlyViewedStore {
    products: Product[];
    addProduct: (product: Product) => void;
    clearAll: () => void;
}

export const useRecentlyViewed = create<RecentlyViewedStore>()(
    persist(
        (set) => ({
            products: [],
            addProduct: (product) =>
                set((state) => {
                    // Remove if already exists
                    const filtered = state.products.filter((p) => p.id !== product.id);
                    // Add to beginning, limit to 12 items
                    return {
                        products: [product, ...filtered].slice(0, 12),
                    };
                }),
            clearAll: () => set({ products: [] }),
        }),
        {
            name: "recently-viewed",
        }
    )
);
