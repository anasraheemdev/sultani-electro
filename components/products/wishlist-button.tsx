"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface WishlistButtonProps {
    productId: string;
    productName: string;
}

export function WishlistButton({ productId, productName }: WishlistButtonProps) {
    const [loading, setLoading] = useState(false);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function checkWishlist() {
            const supabase = createClient();
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                setUserId(user.id);

                const { data } = await supabase
                    .from("wishlists")
                    .select("id")
                    .eq("user_id", user.id)
                    .eq("product_id", productId)
                    .single();

                setIsInWishlist(!!data);
            }
        }

        checkWishlist();
    }, [productId]);

    const handleToggleWishlist = async () => {
        if (!userId) {
            toast.error("Please login first", {
                description: "You need to be logged in to add items to wishlist.",
                action: {
                    label: "Login",
                    onClick: () => router.push("/login"),
                },
            });
            return;
        }

        setLoading(true);
        const supabase = createClient();

        try {
            if (isInWishlist) {
                // Remove from wishlist
                const { error } = await supabase
                    .from("wishlists")
                    .delete()
                    .eq("user_id", userId)
                    .eq("product_id", productId);

                if (error) throw error;

                setIsInWishlist(false);
                toast.success("Removed from wishlist");
            } else {
                // Add to wishlist
                const { error } = await supabase.from("wishlists").insert({
                    user_id: userId,
                    product_id: productId,
                });

                if (error) throw error;

                setIsInWishlist(true);
                toast.success("Added to wishlist!", {
                    description: `${productName} has been added to your wishlist.`,
                });
            }
        } catch (error) {
            toast.error("Failed to update wishlist", {
                description: "Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            size="lg"
            onClick={handleToggleWishlist}
            disabled={loading}
            className={isInWishlist ? "border-red-500 text-red-500" : ""}
        >
            {loading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
                <Heart
                    className={`mr-2 h-5 w-5 ${isInWishlist ? "fill-red-500" : ""}`}
                />
            )}
            {isInWishlist ? "In Wishlist" : "Wishlist"}
        </Button>
    );
}
