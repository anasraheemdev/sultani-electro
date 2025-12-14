import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/products/product-card";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductSort } from "@/components/products/product-sort";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface ProductsPageProps {
    searchParams: Promise<{
        category?: string;
        brand?: string;
        minPrice?: string;
        maxPrice?: string;
        sort?: string;
    }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const params = await searchParams;
    const supabase = await createClient();

    // Fetch categories for filter
    const { data: categories } = await supabase
        .from("categories")
        .select("id, name, slug")
        .eq("is_active", true)
        .order("name");

    // Fetch brands for filter
    const { data: brands } = await supabase
        .from("brands")
        .select("id, name, slug")
        .eq("is_active", true)
        .order("name");

    // Build query
    let query = supabase
        .from("products")
        .select(`
            *,
            category:categories(name, slug),
            brand:brands(name, slug),
            images:product_images(image_url, alt_text, display_order)
        `)
        .eq("is_active", true);

    // Apply filters
    if (params.category) {
        query = query.eq("category_id", params.category);
    }

    if (params.brand) {
        query = query.eq("brand_id", params.brand);
    }

    if (params.minPrice) {
        query = query.gte("price", parseFloat(params.minPrice));
    }

    if (params.maxPrice) {
        query = query.lte("price", parseFloat(params.maxPrice));
    }

    // Apply sorting
    switch (params.sort) {
        case "price-asc":
            query = query.order("price", { ascending: true });
            break;
        case "price-desc":
            query = query.order("price", { ascending: false });
            break;
        case "name-asc":
            query = query.order("name", { ascending: true });
            break;
        default:
            query = query.order("created_at", { ascending: false });
    }

    const { data: products } = await query;

    return (
        <div className="min-h-screen">
            {/* Breadcrumb */}
            <div className="bg-gray-50 border-b">
                <div className="container-custom py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1">
                            <Home className="h-4 w-4" />
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900 font-medium">Products</span>
                    </nav>
                </div>
            </div>

            {/* Header */}
            <div className="bg-gradient-to-br from-primary/5 via-white to-secondary/5 py-12">
                <div className="container-custom">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        All <span className="text-primary">Products</span>
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl">
                        Browse our complete collection of premium solar energy solutions and electronics
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:col-span-1">
                        <ProductFilters
                            categories={categories || []}
                            brands={brands || []}
                            currentFilters={params}
                        />
                    </aside>

                    {/* Products Grid */}
                    <main className="lg:col-span-3">
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600">
                                <span className="font-semibold text-gray-900">{products?.length || 0}</span> products found
                            </p>

                            {/* Sort Dropdown */}
                            <ProductSort />
                        </div>

                        {/* Products Grid */}
                        {products && products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {products.map((product: any, index: number) => (
                                    <ProductCard key={product.id} product={product} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-50 rounded-2xl">
                                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                    <span className="text-4xl">📦</span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h2>
                                <p className="text-gray-600 mb-6">
                                    Try adjusting your filters or browse all products
                                </p>
                                <Link
                                    href="/products"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                                >
                                    Clear Filters
                                </Link>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

// Metadata
export const metadata = {
    title: "All Products - SultaniElectro",
    description: "Browse our complete collection of solar panels, inverters, batteries, and electronics",
};
