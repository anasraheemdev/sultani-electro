import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: { q?: string; category?: string; minPrice?: string; maxPrice?: string };
}) {
    const supabase = await createClient();
    const query = searchParams.q || "";
    const category = searchParams.category;
    const minPrice = searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined;
    const maxPrice = searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined;

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

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">
                {query ? `Search Results for "${query}"` : "All Products"}
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-4">Filters</h3>

                            {/* Category Filter */}
                            <div className="mb-6">
                                <h4 className="text-sm font-medium mb-2">Category</h4>
                                <div className="space-y-2">
                                    {categories?.map((cat) => (
                                        <label key={cat.id} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="category"
                                                value={cat.id}
                                                defaultChecked={category === cat.id}
                                            />
                                            <span className="text-sm">{cat.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <h4 className="text-sm font-medium mb-2">Price Range</h4>
                                <div className="space-y-2">
                                    <input
                                        type="number"
                                        placeholder="Min Price"
                                        defaultValue={minPrice}
                                        className="w-full px-3 py-2 border rounded text-sm"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max Price"
                                        defaultValue={maxPrice}
                                        className="w-full px-3 py-2 border rounded text-sm"
                                    />
                                </div>
                            </div>

                            <Button className="w-full">Apply Filters</Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Products Grid */}
                <div className="lg:col-span-3">
                    {products && products.length > 0 ? (
                        <>
                            <p className="text-gray-500 mb-4">
                                Found {products.length} {products.length === 1 ? "product" : "products"}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product: any) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                                <h2 className="text-xl font-semibold mb-2">No products found</h2>
                                <p className="text-gray-500">
                                    Try adjusting your search or filters
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
