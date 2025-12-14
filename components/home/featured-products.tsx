"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ProductCard } from "@/components/products/product-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    discounted_price: number | null;
    images: Array<{ id: string; image_url: string; alt_text: string | null }>;
    category: { id: string; name: string; slug: string } | null;
}

export function FeaturedProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        async function fetchFeaturedProducts() {
            const supabase = createClient();
            const { data } = await supabase
                .from("products")
                .select(
                    `
                    *,
                    category:categories(id, name, slug),
                    images:product_images(id, image_url, alt_text, display_order)
                `
                )
                .eq("is_featured", true)
                .eq("is_active", true)
                .order("created_at", { ascending: false })
                .limit(12);

            if (data) {
                setProducts(data as unknown as Product[]);
            }
            setLoading(false);
        }

        fetchFeaturedProducts();
    }, []);

    const scroll = (direction: "left" | "right") => {
        const container = document.getElementById("featured-products-container");
        if (!container) return;

        const scrollAmount = 300;
        const newPosition =
            direction === "left"
                ? scrollPosition - scrollAmount
                : scrollPosition + scrollAmount;

        container.scrollTo({ left: newPosition, behavior: "smooth" });
        setScrollPosition(newPosition);
    };

    if (loading) {
        return (
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-dark mb-8">Featured Products</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-lg" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-dark">Featured Products</h2>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => scroll("left")}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => scroll("right")}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div
                    id="featured-products-container"
                    className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {products.map((product) => (
                        <div key={product.id} className="flex-shrink-0 w-64">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
