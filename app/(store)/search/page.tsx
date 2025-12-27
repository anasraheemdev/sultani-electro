import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/products/product-card";
import Link from "next/link";
import { Search, Filter, Package, SlidersHorizontal, Grid3X3, Sparkles, TrendingUp, X } from "lucide-react";

export const metadata = {
    title: "Search Products - SultaniElectro",
    description: "Search for solar panels, inverters, batteries and more at SultaniElectro Pakistan.",
};

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; category?: string; minPrice?: string; maxPrice?: string }>;
}) {
    const supabase = await createClient();
    const params = await searchParams;
    const query = params.q || "";
    const category = params.category;
    const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
    const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;

    let productsQuery = supabase
        .from("products")
        .select(`
            *,
            category:categories (id, name, slug),
            images:product_images (id, image_url, alt_text, display_order)
        `)
        .eq("is_active", true);

    // Search by name or description
    if (query) {
        productsQuery = productsQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    }

    // Filter by category
    if (category) {
        productsQuery = productsQuery.eq("category_id", category);
    }

    // Filter by price range
    if (minPrice !== undefined) {
        productsQuery = productsQuery.gte("price", minPrice);
    }
    if (maxPrice !== undefined) {
        productsQuery = productsQuery.lte("price", maxPrice);
    }

    const { data: products } = await productsQuery.order("created_at", { ascending: false });

    const { data: categories } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("name");

    // Popular search suggestions
    const popularSearches = ["Solar Panels", "Inverters", "Batteries", "5kW System", "Longi Solar", "Hybrid Inverter"];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Search Section */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }} />
                </div>

                <div className="container-custom py-12 md:py-16 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        {/* Title */}
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Sparkles className="h-5 w-5 text-primary" />
                            <span className="text-primary font-medium text-sm">Find Your Perfect Solar Solution</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                            {query ? (
                                <>Results for "<span className="text-primary">{query}</span>"</>
                            ) : (
                                "Search Products"
                            )}
                        </h1>

                        {/* Search Form */}
                        <form action="/search" method="GET" className="relative max-w-2xl mx-auto mb-6">
                            <div className="relative">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="q"
                                    defaultValue={query}
                                    placeholder="Search for solar panels, inverters, batteries..."
                                    className="w-full pl-14 pr-32 py-4 bg-white rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/30 shadow-2xl text-lg"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-cyan-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
                                >
                                    Search
                                </button>
                            </div>
                        </form>

                        {/* Popular Searches */}
                        <div className="flex flex-wrap justify-center gap-2">
                            <span className="text-gray-400 text-sm mr-1">Popular:</span>
                            {popularSearches.map((term) => (
                                <Link
                                    key={term}
                                    href={`/search?q=${encodeURIComponent(term)}`}
                                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded-full transition-all"
                                >
                                    {term}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="container-custom py-8 md:py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar - Desktop */}
                    <aside className="lg:w-72 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <SlidersHorizontal className="h-4 w-4 text-primary" />
                                </div>
                                <h3 className="font-bold text-lg">Filters</h3>
                            </div>

                            {/* Categories */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Grid3X3 className="h-4 w-4" />
                                    Categories
                                </h4>
                                <div className="space-y-2">
                                    <Link
                                        href={`/search${query ? `?q=${query}` : ''}`}
                                        className={`block px-3 py-2 rounded-lg text-sm transition-all ${!category ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        All Categories
                                    </Link>
                                    {categories?.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            href={`/search?${query ? `q=${query}&` : ''}category=${cat.id}`}
                                            className={`block px-3 py-2 rounded-lg text-sm transition-all ${category === cat.id ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-gray-100 my-6" />

                            {/* Price Range */}
                            <form action="/search" method="GET">
                                <input type="hidden" name="q" value={query} />
                                {category && <input type="hidden" name="category" value={category} />}

                                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4" />
                                    Price Range (PKR)
                                </h4>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="number"
                                        name="minPrice"
                                        placeholder="Min"
                                        defaultValue={minPrice}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                    />
                                    <span className="text-gray-400 self-center">-</span>
                                    <input
                                        type="number"
                                        name="maxPrice"
                                        placeholder="Max"
                                        defaultValue={maxPrice}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-gray-900 text-white py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                                >
                                    Apply Filters
                                </button>
                            </form>

                            {/* Clear Filters */}
                            {(category || minPrice || maxPrice) && (
                                <Link
                                    href={`/search${query ? `?q=${query}` : ''}`}
                                    className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-500 hover:text-red-500 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                    Clear all filters
                                </Link>
                            )}
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Package className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900">
                                        {products?.length || 0} Products Found
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {query ? `Showing results for "${query}"` : 'Browse all products'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Products */}
                        {products && products.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                                {products.map((product: any, index: number) => (
                                    <ProductCard key={product.id} product={product} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                                <div className="w-20 h-20 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
                                    <Search className="h-10 w-10 text-gray-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">No products found</h2>
                                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                    We couldn't find any products matching your search. Try adjusting your filters or search for something else.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                    <Link
                                        href="/search"
                                        className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                                    >
                                        Clear Search
                                    </Link>
                                    <Link
                                        href="/products"
                                        className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
                                    >
                                        Browse All Products
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
