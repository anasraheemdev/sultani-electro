"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        discounted_price: number | null;
        category?: {
            name: string;
            slug: string;
        } | null;
        images?: Array<{
            image_url: string;
            alt_text: string | null;
        }>;
    };
    index?: number;
}


export function ProductCard({ product, index = 0 }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const { addItem } = useCartStore();
    const router = useRouter();

    const hasDiscount = product.discounted_price && product.discounted_price < product.price;
    const finalPrice = product.discounted_price || product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.price - product.discounted_price!) / product.price) * 100)
        : 0;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        addItem({
            id: product.id,
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            discountedPrice: product.discounted_price,
            image: product.images?.[0]?.image_url || "/placeholder.jpg",
            maxStock: 100,
        });

        toast.success("Added to cart!", {
            description: `${product.name} has been added to your cart.`,
            action: {
                label: "View Cart",
                onClick: () => router.push("/cart"),
            },
        });
    };

    const handleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsWishlisted(!isWishlisted);

        if (!isWishlisted) {
            toast.success("Added to wishlist!", {
                description: `${product.name} has been added to your wishlist.`,
            });
        } else {
            toast.info("Removed from wishlist", {
                description: `${product.name} has been removed from your wishlist.`,
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
            className="group"
        >
            <div
                className="relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Section - Smaller aspect ratio */}
                <Link href={`/products/${product.slug}`} className="block relative">
                    <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                        {product.images?.[0] && (
                            <motion.div
                                animate={{ scale: isHovered ? 1.08 : 1 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="relative w-full h-full"
                            >
                                <Image
                                    src={product.images[0].image_url}
                                    alt={product.images[0].alt_text || product.name}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    className="object-cover"
                                />
                            </motion.div>
                        )}

                        {/* Gradient Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isHovered ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
                        />

                        {/* Discount Badge - Smaller */}
                        {hasDiscount && (
                            <div className="absolute top-2 left-2 z-10">
                                <div className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                                    -{discountPercent}%
                                </div>
                            </div>
                        )}

                        {/* Wishlist Button - Smaller */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleWishlist}
                            className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-lg ${isWishlisted
                                ? "bg-red-500 text-white"
                                : "bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white"
                                }`}
                        >
                            <Heart
                                className={`h-4 w-4 transition-all ${isWishlisted ? "fill-current" : ""
                                    }`}
                            />
                        </motion.button>

                        {/* Add to Cart Button - Smaller */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{
                                y: isHovered ? 0 : 20,
                                opacity: isHovered ? 1 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                            className="absolute bottom-2 left-2 right-2 z-10"
                        >
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-white text-gray-900 font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 hover:bg-primary hover:text-white transition-all shadow-lg text-xs"
                            >
                                <ShoppingBag className="h-3.5 w-3.5" />
                                Add to Cart
                            </button>
                        </motion.div>
                    </div>
                </Link>

                {/* Product Info - Reduced padding */}
                <div className="p-3">
                    {/* Category */}
                    {product.category && (
                        <Link
                            href={`/categories/${product.category.slug}`}
                            className="inline-block text-xs font-medium text-primary hover:text-primary-dark mb-1 uppercase tracking-wide"
                        >
                            {product.category.name}
                        </Link>
                    )}

                    {/* Product Name - Smaller font */}
                    <Link href={`/products/${product.slug}`}>
                        <h3 className="font-bold text-sm mb-1.5 line-clamp-2 hover:text-primary transition-colors leading-snug min-h-[2.5rem]">
                            {product.name}
                        </h3>
                    </Link>

                    {/* Rating - Smaller */}
                    <div className="flex items-center gap-1 mb-2">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className="h-3 w-3 fill-amber-400 text-amber-400"
                                />
                            ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-0.5">(4.8)</span>
                    </div>

                    {/* Price - Responsive */}
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1.5">
                            <span className="text-xs sm:text-sm md:text-base font-bold text-gray-900">
                                PKR {finalPrice.toLocaleString()}
                            </span>
                            {hasDiscount && (
                                <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                                    PKR {product.price.toLocaleString()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Border Accent */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-0.5 bg-gradient-to-r from-primary via-secondary to-accent origin-left"
                />
            </div>
        </motion.div>
    );
}
