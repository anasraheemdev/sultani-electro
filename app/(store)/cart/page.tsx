"use client";

import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { DELIVERY_COST } from "@/lib/constants";

export default function CartPage() {
    const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } =
        useCartStore();

    const subtotal = getTotalPrice();
    const deliveryCost =
        subtotal >= DELIVERY_COST.FREE_THRESHOLD ? 0 : DELIVERY_COST.STANDARD;
    const total = subtotal + deliveryCost;

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto text-center">
                    <ShoppingBag className="h-24 w-24 mx-auto text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-dark mb-2">
                        Your cart is empty
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Add some products to get started!
                    </p>
                    <Button asChild size="lg">
                        <Link href="/products">Browse Products</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-dark mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <Card key={item.id}>
                            <CardContent className="p-4">
                                <div className="flex gap-4">
                                    {/* Image */}
                                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1">
                                        <Link
                                            href={`/products/${item.slug}`}
                                            className="font-semibold text-dark hover:text-primary transition-colors line-clamp-2"
                                        >
                                            {item.name}
                                        </Link>

                                        <div className="mt-2 flex items-center gap-2">
                                            {item.discountedPrice ? (
                                                <>
                                                    <span className="text-lg font-bold text-primary">
                                                        {formatPrice(item.discountedPrice)}
                                                    </span>
                                                    <span className="text-sm text-gray-400 line-through">
                                                        {formatPrice(item.price)}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-lg font-bold text-dark">
                                                    {formatPrice(item.price)}
                                                </span>
                                            )}
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className="h-8 w-8"
                                                    onClick={() =>
                                                        updateQuantity(item.id, item.quantity - 1)
                                                    }
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className="w-12 text-center font-semibold">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className="h-8 w-8"
                                                    onClick={() =>
                                                        updateQuantity(item.id, item.quantity + 1)
                                                    }
                                                    disabled={item.quantity >= item.maxStock}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold text-dark mb-4">
                                Order Summary
                            </h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        Subtotal ({getTotalItems()} items)
                                    </span>
                                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Delivery</span>
                                    <span className="font-semibold">
                                        {deliveryCost === 0 ? (
                                            <span className="text-green-600">FREE</span>
                                        ) : (
                                            formatPrice(deliveryCost)
                                        )}
                                    </span>
                                </div>

                                {subtotal < DELIVERY_COST.FREE_THRESHOLD && (
                                    <p className="text-xs text-gray-500">
                                        Add {formatPrice(DELIVERY_COST.FREE_THRESHOLD - subtotal)}{" "}
                                        more for free delivery!
                                    </p>
                                )}

                                <div className="border-t pt-3 flex justify-between">
                                    <span className="font-bold text-lg">Total</span>
                                    <span className="font-bold text-lg text-primary">
                                        {formatPrice(total)}
                                    </span>
                                </div>
                            </div>

                            <Button asChild size="lg" className="w-full">
                                <Link href="/checkout">Proceed to Checkout</Link>
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="w-full mt-3"
                            >
                                <Link href="/products">Continue Shopping</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
