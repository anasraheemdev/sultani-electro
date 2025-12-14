"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/products/product-card";
import { createClient } from "@/lib/supabase/client";

interface RecommendedProductsProps {
    currentProductId: string;
    categoryId: string;
    priceRange?: { min: number; max: number };
}

export function RecommendedProducts({
    currentProductId,
    categoryId,
    priceRange,
}: RecommendedProductsProps) {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRecommendations() {
            const supabase = createClient();

            // Get products from same category, excluding current product
            let query = supabase
                .from("products")
                .select(`
                    *,
                    category:categories (id, name, slug),
                    images:product_images (id, image_url, alt_text, display_order)
                `)
                .eq("category_id", categoryId)
                .eq("is_active", true)
                .neq("id", currentProductId);

            // Filter by similar price range if provided
            if (priceRange) {
                const margin = (priceRange.max - priceRange.min) * 0.3; // 30% margin
                query = query
                    .gte("price", priceRange.min - margin)
                    .lte("price", priceRange.max + margin);
            }

            const { data } = await query
                .order("is_featured", { ascending: false })
                .limit(8);

            if (data) {
                setProducts(data);
            }
            setLoading(false);
        }

        fetchRecommendations();
    }, [currentProductId, categoryId, priceRange]);

    if (loading) {
        return (
            <div className="py-8">
                <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    if (products.length === 0) return null;

    return (
        <div className="py-8">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
