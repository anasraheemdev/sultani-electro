"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Heart, Share2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "sonner";

interface ProductActionsProps {
    product: any;
    inStock: boolean;
}

export function ProductActions({ product, inStock }: ProductActionsProps) {
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const { addItem } = useCartStore();
    const router = useRouter();

    const handleAddToCart = () => {
        if (!inStock) return;

        addItem({
            id: product.id,
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            discountedPrice: product.discounted_price,
            image: product.images?.[0]?.image_url || "/placeholder.jpg",
            maxStock: product.inventory?.[0]?.quantity || 100,
            quantity,
        });

        toast.success("Added to cart!", {
            description: `${quantity} x ${product.name} added to your cart.`,
            action: {
                label: "View Cart",
                onClick: () => router.push("/cart"),
            },
        });
    };

    const handleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist!");
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: product.short_description,
                    url: window.location.href,
                });
            } catch (error) {
                // User cancelled share
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        }
    };

    return (
        <div className="space-y-4">
            {/* Quantity Selector */}
            <div>
                <label className="block text-sm font-semibold mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="p-3 hover:bg-gray-50 transition-colors"
                            disabled={!inStock}
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-6 font-semibold">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="p-3 hover:bg-gray-50 transition-colors"
                            disabled={!inStock}
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                    {inStock && product.inventory?.[0]?.quantity <= 10 && (
                        <span className="text-sm text-orange-600 font-medium">
                            Only {product.inventory[0].quantity} left!
                        </span>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
                <Button
                    size="lg"
                    className="w-full text-base"
                    disabled={!inStock}
                    onClick={handleAddToCart}
                >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    {inStock ? "Add to Cart" : "Out of Stock"}
                </Button>

                <div className="grid grid-cols-2 gap-3">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleWishlist}
                        className={isWishlisted ? "border-red-500 text-red-500" : ""}
                    >
                        <Heart className={`mr-2 h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
                        Wishlist
                    </Button>
                    <Button variant="outline" size="lg" onClick={handleShare}>
                        <Share2 className="mr-2 h-5 w-5" />
                        Share
                    </Button>
                </div>
            </div>
        </div>
    );
}
