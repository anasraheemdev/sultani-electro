import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/products/product-card";
import { ChevronRight, Home } from "lucide-react";

interface CategoryPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    // Fetch category
    const { data: category } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

    if (!category) {
        notFound();
    }

    // Fetch products in this category
    const { data: products } = await supabase
        .from("products")
        .select(`
            *,
            category:categories(name, slug),
            images:product_images(image_url, alt_text, display_order)
        `)
        .eq("category_id", category.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

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
                        <Link href="/categories" className="text-gray-600 hover:text-primary transition-colors">
                            Categories
                        </Link>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900 font-medium">{category.name}</span>
                    </nav>
                </div>
            </div>

            {/* Category Header */}
            <div className="bg-gradient-to-br from-primary/5 via-white to-secondary/5 py-12 md:py-16">
                <div className="container-custom">
                    <div className="max-w-3xl">
                        <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            {category.icon} Category
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {category.name}
                        </h1>
                        <p className="text-gray-600 text-lg">
                            {category.description || `Browse our collection of ${category.name.toLowerCase()}`}
                        </p>
                        <div className="mt-6 flex items-center gap-4 text-sm text-gray-600">
                            <span className="font-semibold">
                                {products?.length || 0} {products?.length === 1 ? "Product" : "Products"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Section */}
            <div className="container-custom py-12">
                {products && products.length > 0 ? (
                    <>
                        {/* Sort & Filter Bar */}
                        <div className="flex items-center justify-between mb-8">
                            <p className="text-gray-600">
                                Showing <span className="font-semibold text-gray-900">{products.length}</span> products
                            </p>

                            {/* Sort Dropdown - Future Enhancement */}
                            <select className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary">
                                <option>Sort by: Featured</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Newest First</option>
                            </select>
                        </div>

                        {/* Products Grid */}
                        <div className="product-grid">
                            {products.map((product: any, index: number) => (
                                <ProductCard key={product.id} product={product} index={index} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-4xl">{category.icon || "📦"}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Products Yet</h2>
                        <p className="text-gray-600 mb-6">
                            Products in this category will appear here soon.
                        </p>
                        <Link
                            href="/categories"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                        >
                            Browse Other Categories
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: category } = await supabase
        .from("categories")
        .select("name, description")
        .eq("slug", slug)
        .single();

    if (!category) {
        return {
            title: "Category Not Found",
        };
    }

    return {
        title: `${category.name} - SultaniElectro`,
        description: category.description || `Shop ${category.name} at SultaniElectro`,
    };
}
