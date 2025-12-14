"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
    id: string;
    productId: string;
    name: string;
    slug: string;
    price: number;
    discountedPrice: number | null;
    image: string;
    quantity: number;
    maxStock: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "quantity">) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => {
                const items = get().items;
                const existingItem = items.find((i) => i.productId === item.productId);

                if (existingItem) {
                    // Update quantity if item exists
                    set({
                        items: items.map((i) =>
                            i.productId === item.productId
                                ? { ...i, quantity: Math.min(i.quantity + 1, i.maxStock) }
                                : i
                        ),
                    });
                } else {
                    // Add new item
                    set({
                        items: [...items, { ...item, quantity: 1 }],
                    });
                }
            },

            removeItem: (id) => {
                set({ items: get().items.filter((i) => i.id !== id) });
            },

            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(id);
                    return;
                }

                set({
                    items: get().items.map((i) =>
                        i.id === id ? { ...i, quantity: Math.min(quantity, i.maxStock) } : i
                    ),
                });
            },

            clearCart: () => {
                set({ items: [] });
            },

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getTotalPrice: () => {
                return get().items.reduce((total, item) => {
                    const price = item.discountedPrice || item.price;
                    return total + price * item.quantity;
                }, 0);
            },
        }),
        {
            name: "sultani-cart",
        }
    )
);
