"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AddToCartButtonProps {
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        discounted_price: number | null;
        images: Array<{ image_url: string; alt_text: string | null }>;
    };
    inStock: boolean;
}

export function AddToCartButton({ product, inStock }: AddToCartButtonProps) {
    const [loading, setLoading] = useState(false);
    const { addItem } = useCartStore();
    const router = useRouter();

    const handleAddToCart = () => {
        setLoading(true);

        try {
            addItem({
                id: product.id,
                productId: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                discountedPrice: product.discounted_price,
                image: product.images[0]?.image_url || "/placeholder.jpg",
                maxStock: 100, // Default max stock
            });

            toast.success("Added to cart!", {
                description: `${product.name} has been added to your cart.`,
                action: {
                    label: "View Cart",
                    onClick: () => router.push("/cart"),
                },
            });
        } catch (error) {
            toast.error("Failed to add to cart", {
                description: "Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            size="lg"
            className="w-full"
            disabled={!inStock || loading}
            onClick={handleAddToCart}
        >
            {loading ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Adding...
                </>
            ) : (
                <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                </>
            )}
        </Button>
    );
}
