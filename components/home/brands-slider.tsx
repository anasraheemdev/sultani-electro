"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";

interface Brand {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
}

export function BrandsSlider() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBrands() {
            const supabase = createClient();
            const { data } = await supabase
                .from("brands")
                .select("*")
                .eq("is_active", true)
                .order("name");

            if (data) {
                setBrands(data);
            }
            setLoading(false);
        }

        fetchBrands();
    }, []);

    if (loading || brands.length === 0) return null;

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-dark text-center mb-8">
                    Popular Brands
                </h2>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-8">
                    {brands.map((brand) => (
                        <Link
                            key={brand.id}
                            href={`/products?brand=${brand.slug}`}
                            className="flex items-center justify-center p-4 bg-white rounded-lg border hover:shadow-lg transition-shadow"
                        >
                            {brand.logo_url ? (
                                <div className="relative w-full h-16">
                                    <Image
                                        src={brand.logo_url}
                                        alt={brand.name}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            ) : (
                                <span className="font-semibold text-gray-700">
                                    {brand.name}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
