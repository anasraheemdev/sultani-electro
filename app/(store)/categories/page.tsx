import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Package } from "lucide-react";

export default async function CategoriesPage() {
    const supabase = await createClient();

    // Fetch all active categories with product count
    const { data: categories } = await supabase
        .from("categories")
        .select(`
            *,
            products:products(count)
        `)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

    return (
        <div className="container-custom py-12">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Shop by <span className="text-primary">Category</span>
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Browse our wide range of solar energy solutions and electronics.
                    Find the perfect products for your needs.
                </p>
            </div>

            {/* Categories Grid */}
            {categories && categories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category: any, index: number) => (
                        <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            className="group"
                        >
                            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                                {/* Category Image/Icon */}
                                <div className="relative h-64 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
                                    {category.image_url ? (
                                        <Image
                                            src={category.image_url}
                                            alt={category.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-8xl opacity-20">
                                                {category.icon || "📦"}
                                            </span>
                                        </div>
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Product Count Badge */}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                                        <Package className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-semibold">
                                            {category.products?.[0]?.count || 0} Products
                                        </span>
                                    </div>
                                </div>

                                {/* Category Info */}
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {category.description || "Explore our collection"}
                                    </p>

                                    {/* View Button */}
                                    <div className="flex items-center text-primary font-semibold group-hover:gap-3 transition-all">
                                        <span>Browse Products</span>
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>

                                {/* Bottom Accent */}
                                <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <Package className="h-20 w-20 mx-auto text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Categories Found</h2>
                    <p className="text-gray-600">Categories will appear here once added.</p>
                </div>
            )}
        </div>
    );
}
