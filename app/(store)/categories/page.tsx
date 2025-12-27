import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Package, Grid, Zap, Layers } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { BreadcrumbSchema } from "@/components/seo/json-ld";
import { SITE_CONFIG } from "@/lib/seo-config";

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
        <div className="min-h-screen bg-white">
            <BreadcrumbSchema
                items={[
                    { name: "Home", url: SITE_CONFIG.url },
                    { name: "Categories", url: `${SITE_CONFIG.url}/categories` }
                ]}
            />

            {/* Hero Banner */}
            <PageHero
                title="Shop by Category"
                highlightedWord="Category"
                description="Discover our extensive range of high-performance solar solutions, premium batteries, and advanced electronics tailored for your energy needs."
                iconName="grid"
                variant="gradient"
                breadcrumbs={[{ label: "Categories" }]}
            />

            {/* Categories Grid */}
            <div className="container-custom py-12 sm:py-20">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <Layers className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">All Collections</h2>
                        <p className="text-sm text-gray-500">Explore {categories?.length || 0} specialized categories</p>
                    </div>
                </div>

                {categories && categories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                        {categories.map((category: any, index: number) => (
                            <Link
                                key={category.id}
                                href={`/categories/${category.slug}`}
                                className="group block h-full"
                            >
                                <div className="relative p-1 rounded-[2.5rem] bg-gradient-to-br from-gray-100 to-transparent hover:from-primary/20 hover:to-secondary/20 transition-all duration-500 h-full">
                                    <div className="bg-white rounded-[2.2rem] overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-gray-100">
                                        {/* Category Image Area */}
                                        <div className="relative h-72 bg-gray-50 overflow-hidden">
                                            {category.image_url ? (
                                                <Image
                                                    src={category.image_url}
                                                    alt={category.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-primary/5">
                                                    <span className="text-9xl opacity-10 grayscale group-hover:grayscale-0 group-hover:opacity-20 transition-all duration-500">
                                                        {category.icon || "📦"}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                                            {/* Product Count Badge */}
                                            <div className="absolute top-6 right-6 px-4 py-2 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 text-white flex items-center gap-2 transform group-hover:translate-x-[-4px] transition-transform">
                                                <Package className="h-4 w-4" />
                                                <span className="text-xs font-bold uppercase tracking-widest">
                                                    {category.products?.[0]?.count || 0} Items
                                                </span>
                                            </div>

                                            {/* Floating Icon Overlay on Hover */}
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                <div className="w-16 h-16 bg-white/90 backdrop-blur-xl rounded-full flex items-center justify-center transform scale-50 group-hover:scale-100 transition-all duration-500 shadow-2xl">
                                                    <ArrowRight className="h-8 w-8 text-primary" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Category Content Area */}
                                        <div className="p-8 flex-1 flex flex-col">
                                            <div className="mb-4">
                                                <div className="inline-flex items-center gap-2 text-primary-dark font-bold text-xs uppercase tracking-[0.2em] mb-3">
                                                    <Zap className="h-3.5 w-3.5" />
                                                    Premium Selection
                                                </div>
                                                <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-primary transition-colors leading-tight">
                                                    {category.name}
                                                </h3>
                                                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                                                    {category.description || `Discover high-quality ${category.name.toLowerCase()} products designed for reliability.`}
                                                </p>
                                            </div>

                                            <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-50">
                                                <span className="text-sm font-bold text-gray-900 group-hover:translate-x-1 transition-transform">Browse Collection</span>
                                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                                    <ArrowRight className="h-5 w-5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                        <Package className="h-24 w-24 mx-auto text-gray-300 mb-6 animate-pulse" />
                        <h2 className="text-3xl font-black text-gray-900 mb-3">No Collections Found</h2>
                        <p className="text-gray-500 max-w-sm mx-auto">We're currently updating our inventory. Please check back shortly for new arrivals.</p>
                        <Link href="/" className="inline-flex items-center gap-2 mt-10 px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-primary transition-all shadow-xl">
                            Return to Homepage
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
