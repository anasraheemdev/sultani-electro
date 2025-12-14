import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/products/product-card";
import { notFound } from "next/navigation";

interface CategoryPageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: CategoryPageProps) {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: category } = await supabase
        .from("categories")
        .select("name, description")
        .eq("slug", slug)
        .single();

    if (!category) return {};

    return {
        title: category.name,
        description: category.description || `Shop ${category.name} at SultaniElectro`,
    };
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
    const { data: products, error } = await supabase
        .from("products")
        .select(
            `
      *,
      category:categories(id, name, slug),
      brand:brands(id, name, logo_url),
      images:product_images(id, image_url, alt_text, display_order),
      inventory(quantity)
    `
        )
        .eq("category_id", category.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Category Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-dark mb-2">{category.name}</h1>
                {category.description && (
                    <p className="text-gray-600">{category.description}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                    {products?.length || 0} products found
                </p>
            </div>

            {/* Products Grid */}
            {products && products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={{
                                id: product.id,
                                name: product.name,
                                slug: product.slug,
                                price: product.price,
                                discounted_price: product.discounted_price,
                                images: product.images || [],
                                category: product.category,
                            }}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-gray-500">No products found in this category.</p>
                </div>
            )}
        </div>
    );
}
