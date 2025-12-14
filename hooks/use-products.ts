"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useProducts(filters?: {
    categoryId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    isFeatured?: boolean;
}) {
    return useQuery({
        queryKey: ["products", filters],
        queryFn: async () => {
            const supabase = createClient();
            let query = supabase
                .from("products")
                .select(
                    `
                    *,
                    category:categories(id, name, slug),
                    brand:brands(id, name, logo_url),
                    images:product_images(id, image_url, alt_text, display_order),
                    inventory(quantity, low_stock_threshold)
                `
                )
                .eq("is_active", true)
                .order("created_at", { ascending: false });

            if (filters?.categoryId) {
                query = query.eq("category_id", filters.categoryId);
            }

            if (filters?.search) {
                query = query.ilike("name", `%${filters.search}%`);
            }

            if (filters?.minPrice) {
                query = query.gte("price", filters.minPrice);
            }

            if (filters?.maxPrice) {
                query = query.lte("price", filters.maxPrice);
            }

            if (filters?.isFeatured !== undefined) {
                query = query.eq("is_featured", filters.isFeatured);
            }

            const { data, error } = await query;

            if (error) throw error;
            return data;
        },
    });
}

export function useProduct(slug: string) {
    return useQuery({
        queryKey: ["product", slug],
        queryFn: async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("products")
                .select(
                    `
                    *,
                    category:categories(id, name, slug),
                    brand:brands(id, name, logo_url),
                    images:product_images(id, image_url, alt_text, display_order),
                    videos:product_videos(id, video_url, thumbnail_url, title),
                    inventory(quantity, low_stock_threshold)
                `
                )
                .eq("slug", slug)
                .eq("is_active", true)
                .single();

            if (error) throw error;
            return data;
        },
        enabled: !!slug,
    });
}
