"use client";

import { ShoppingCart, X, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useUIStore } from "@/lib/store/ui-store";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
    const { items, removeItem, updateQuantity, totalPrice, itemCount } = useCart();
    const { isCartOpen, setCartOpen } = useUIStore();

    if (!isCartOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setCartOpen(false)}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        <h2 className="text-lg font-semibold">
                            Shopping Cart ({itemCount})
                        </h2>
                    </div>
                    <button
                        onClick={() => setCartOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Your cart is empty
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Add some products to get started
                            </p>
                            <Button onClick={() => setCartOpen(false)}>
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                                >
                                    {/* Image */}
                                    <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-md overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`/products/${item.slug}`}
                                            className="font-medium text-sm hover:text-primary line-clamp-2"
                                            onClick={() => setCartOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                        <p className="text-sm font-semibold text-primary mt-1">
                                            {formatPrice(item.discountedPrice || item.price)}
                                        </p>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() =>
                                                    updateQuantity(item.id, item.quantity - 1)
                                                }
                                                className="p-1 hover:bg-white rounded transition-colors"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="w-8 text-center text-sm font-medium">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    updateQuantity(item.id, item.quantity + 1)
                                                }
                                                className="p-1 hover:bg-white rounded transition-colors"
                                                disabled={item.quantity >= item.maxStock}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="p-2 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t p-6 space-y-4">
                        <div className="flex items-center justify-between text-lg font-semibold">
                            <span>Total:</span>
                            <span className="text-primary">{formatPrice(totalPrice)}</span>
                        </div>
                        <Link href="/cart" onClick={() => setCartOpen(false)}>
                            <Button className="w-full" size="lg">
                                View Cart
                            </Button>
                        </Link>
                        <Link href="/checkout" onClick={() => setCartOpen(false)}>
                            <Button className="w-full" variant="outline" size="lg">
                                Checkout
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
