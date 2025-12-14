"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/products/product-card";
import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState<any[]>([]);

    useEffect(() => {
        // Load wishlist from localStorage
        const saved = localStorage.getItem("wishlist");
        if (saved) {
            setWishlistItems(JSON.parse(saved));
        }
    }, []);

    const removeFromWishlist = (productId: string) => {
        const updated = wishlistItems.filter(item => item.id !== productId);
        setWishlistItems(updated);
        localStorage.setItem("wishlist", JSON.stringify(updated));
    };

    return (
        <div className="container-custom py-12">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">My Wishlist</h1>
                <p className="text-gray-600">
                    {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
                </p>
            </div>

            {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlistItems.map((product: any, index: number) => (
                        <div key={product.id} className="relative">
                            <ProductCard product={product} index={index} />
                            <button
                                onClick={() => removeFromWishlist(product.id)}
                                className="absolute top-2 right-2 z-20 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl">
                    <Heart className="h-20 w-20 mx-auto text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h2>
                    <p className="text-gray-600 mb-6">
                        Save your favorite products to buy them later
                    </p>
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                    >
                        <ShoppingBag className="h-5 w-5" />
                        Start Shopping
                    </Link>
                </div>
            )}
        </div>
    );
}
