import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/products/product-card";
import { notFound } from "next/navigation";
import { SITE_CONFIG } from "@/lib/seo-config";
import { BreadcrumbSchema, CollectionSchema } from "@/components/seo/json-ld";
import { PageHero } from "@/components/ui/page-hero";
import { ShieldCheck, Zap, Award, Headphones, Star, Filter, Package } from "lucide-react";
import Link from "next/link";

interface CategoryPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: category } = await supabase
        .from("categories")
        .select("name, description, image_url")
        .eq("slug", slug)
        .single();

    if (!category) return { title: "Category Not Found" };

    const title = `${category.name} - Buy Online at Best Price Pakistan | SultaniElectro`;
    const description = category.description ||
        `Shop best ${category.name} online in Pakistan. Premium quality at competitive prices. Free delivery on orders above PKR 50,000. Buy now at SultaniElectro!`;

    return {
        title,
        description,
        keywords: [
            category.name,
            `${category.name} Pakistan`,
            `buy ${category.name} online`,
            `${category.name} price Pakistan`,
            "solar energy Pakistan",
            "SultaniElectro",
        ],
        alternates: {
            canonical: `/categories/${slug}`,
        },
        openGraph: {
            title,
            description,
            type: "website",
            url: `${SITE_CONFIG.url}/categories/${slug}`,
            images: category.image_url ? [{ url: category.image_url, alt: category.name }] : [],
        },
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
    const { data: products } = await supabase
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
        <div className="min-h-screen bg-white">
            <BreadcrumbSchema
                items={[
                    { name: "Home", url: SITE_CONFIG.url },
                    { name: "Categories", url: `${SITE_CONFIG.url}/categories` },
                    { name: category.name, url: `${SITE_CONFIG.url}/categories/${slug}` }
                ]}
            />

            <CollectionSchema
                name={category.name}
                description={category.description || ""}
                url={`${SITE_CONFIG.url}/categories/${slug}`}
                products={products?.map(p => ({
                    name: p.name,
                    url: `${SITE_CONFIG.url}/products/${p.slug}`,
                    image: p.images?.[0]?.image_url || "/placeholder.jpg",
                    price: p.discounted_price || p.price
                })) || []}
            />

            {/* Premium Hero Section */}
            <PageHero
                title={category.name}
                highlightedWord={category.name.split(' ')[0]}
                description={category.description || `Explore our high-performance ${category.name} solutions for your energy needs.`}
                iconName="grid"
                variant="gradient"
                breadcrumbs={[
                    { label: "Categories", href: "/categories" },
                    { label: category.name }
                ]}
            />

            <div className="container-custom py-8 sm:py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content Area */}
                    <div className="flex-1">
                        {/* Toolbar / Stats */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-gray-50/50 backdrop-blur-md p-4 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <Zap className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Browsing</p>
                                    <p className="text-sm font-bold text-gray-900">{products?.length || 0} Products available</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-gray-400 mr-2">SORT BY:</span>
                                <select className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer">
                                    <option>Newest First</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Popularity</option>
                                </select>
                            </div>
                        </div>

                        {/* Products Grid */}
                        {products && products.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                                {products.map((product, index) => (
                                    <ProductCard
                                        key={product.id}
                                        index={index}
                                        product={product}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Package className="h-10 w-10 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-500 max-w-xs mx-auto">
                                    We couldn't find any products in this category at the moment. Please check back later.
                                </p>
                                <Link
                                    href="/products"
                                    className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:shadow-lg transition-all"
                                >
                                    Browse All Products
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Trust Badges Section - Specific to Category */}
                <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: ShieldCheck, title: "Verified Quality", desc: "Every product is tested for peak performance" },
                        { icon: Zap, title: "Fast Installation", desc: "Expert setup within 48-72 hours" },
                        { icon: Award, title: "Official Warranty", desc: "Authentic manufacturer backed warranties" },
                        { icon: Headphones, title: "Expert Support", desc: "24/7 technical assistance for maintenance" }
                    ].map((badge, i) => (
                        <div key={i} className="flex gap-4 p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-primary/10 group">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                                <badge.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">{badge.title}</h4>
                                <p className="text-sm text-gray-500 leading-relaxed">{badge.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Related Categories / Navigation */}
                <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Not what you're looking for?</h4>
                        <p className="text-gray-500">Explore our other energy solutions and find the perfect match.</p>
                    </div>
                    <Link
                        href="/categories"
                        className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-primary transition-colors flex items-center gap-2 shadow-xl"
                    >
                        View All Categories
                        <Award className="h-5 w-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
