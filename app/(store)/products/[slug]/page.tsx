import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductImageGallery } from "@/components/products/product-image-gallery";
import { ProductActions } from "@/components/products/product-actions";
import { ProductTabs } from "@/components/products/product-tabs";
import { ProductCard } from "@/components/products/product-card";
import { ChevronRight, Home, Star, Package, Shield, TruckIcon } from "lucide-react";
import { ProductSchema, BreadcrumbSchema } from "@/components/seo/json-ld";
import { SITE_CONFIG } from "@/lib/seo-config";

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    // Fetch product with all related data
    const { data: product } = await supabase
        .from("products")
        .select(`
            *,
            category:categories(id, name, slug),
            brand:brands(id, name, slug),
            images:product_images(image_url, alt_text, display_order),
            inventory(quantity)
        `)
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

    if (!product) {
        notFound();
    }

    // Fetch related products from same category
    const { data: relatedProducts } = await supabase
        .from("products")
        .select(`
            *,
            category:categories(name, slug),
            images:product_images(image_url, alt_text, display_order)
        `)
        .eq("category_id", product.category_id)
        .neq("id", product.id)
        .eq("is_active", true)
        .limit(4);

    const hasDiscount = product.discounted_price && product.discounted_price < product.price;
    const finalPrice = product.discounted_price || product.price;
    const discountPercent = hasDiscount
        ? Math.round(((product.price - product.discounted_price) / product.price) * 100)
        : 0;
    // Check inventory - if no inventory record exists, check product.stock_quantity or default to in stock
    const inventoryQuantity = product.inventory?.[0]?.quantity;
    const inStock = inventoryQuantity !== undefined && inventoryQuantity !== null
        ? inventoryQuantity > 0
        : (product.stock_quantity !== undefined ? product.stock_quantity > 0 : true);

    // Breadcrumb items for structured data
    const breadcrumbItems = [
        { name: "Home", url: SITE_CONFIG.url },
        { name: "Products", url: `${SITE_CONFIG.url}/products` },
        ...(product.category ? [{ name: product.category.name, url: `${SITE_CONFIG.url}/category/${product.category.slug}` }] : []),
        { name: product.name, url: `${SITE_CONFIG.url}/products/${product.slug}` },
    ];

    return (
        <div className="min-h-screen">
            {/* Product Structured Data */}
            <ProductSchema
                product={{
                    name: product.name,
                    description: product.short_description || product.name,
                    price: product.price,
                    discountedPrice: product.discounted_price,
                    image: product.images?.[0]?.image_url || '/placeholder.jpg',
                    sku: product.sku || product.slug,
                    slug: product.slug,
                    brand: product.brand?.name,
                    category: product.category?.name,
                    inStock: inStock,
                    rating: 4.8,
                    reviewCount: 24,
                }}
            />
            {/* Breadcrumb Structured Data */}
            <BreadcrumbSchema items={breadcrumbItems} />

            {/* Breadcrumb */}
            <div className="bg-gray-50 border-b">
                <div className="container-custom py-4">
                    <nav className="flex items-center gap-2 text-sm flex-wrap">
                        <Link href="/" className="text-gray-600 hover:text-primary transition-colors flex items-center gap-1">
                            <Home className="h-4 w-4" />
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <Link href="/products" className="text-gray-600 hover:text-primary transition-colors">
                            Products
                        </Link>
                        {product.category && (
                            <>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                                <Link
                                    href={`/categories/${product.category.slug}`}
                                    className="text-gray-600 hover:text-primary transition-colors"
                                >
                                    {product.category.name}
                                </Link>
                            </>
                        )}
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900 font-medium line-clamp-1">{product.name}</span>
                    </nav>
                </div>
            </div>

            {/* Product Details */}
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div>
                        <ProductImageGallery images={product.images || []} productName={product.name} />
                    </div>

                    {/* Product Info */}
                    <div>
                        {/* Category & Brand */}
                        <div className="flex items-center gap-3 mb-3">
                            {product.category && (
                                <Link
                                    href={`/categories/${product.category.slug}`}
                                    className="text-sm font-medium text-primary hover:text-primary-dark"
                                >
                                    {product.category.name}
                                </Link>
                            )}
                            {product.brand && (
                                <>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-sm text-gray-600">{product.brand.name}</span>
                                </>
                            )}
                        </div>

                        {/* Product Name */}
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <span className="text-sm text-gray-600">(4.8 stars)</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-600">24 reviews</span>
                        </div>

                        {/* Price */}
                        <div className="mb-6">
                            <div className="flex items-baseline gap-3 mb-2">
                                <span className="text-4xl font-bold text-gray-900">
                                    PKR {finalPrice.toLocaleString()}
                                </span>
                                {hasDiscount && (
                                    <>
                                        <span className="text-xl text-gray-400 line-through">
                                            PKR {product.price.toLocaleString()}
                                        </span>
                                        <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                                            {discountPercent}% OFF
                                        </span>
                                    </>
                                )}
                            </div>
                            <p className="text-sm text-gray-600">Inclusive of all taxes</p>
                        </div>

                        {/* Stock Status */}
                        <div className="mb-6">
                            {inStock ? (
                                <div className="flex items-center gap-2 text-green-600">
                                    <Package className="h-5 w-5" />
                                    <span className="font-semibold">In Stock</span>
                                    {inventoryQuantity !== undefined && inventoryQuantity !== null && (
                                        <span className="text-gray-600">({inventoryQuantity} available)</span>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-red-600">
                                    <Package className="h-5 w-5" />
                                    <span className="font-semibold">Out of Stock</span>
                                </div>
                            )}
                        </div>

                        {/* Short Description */}
                        {product.short_description && (
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                {product.short_description}
                            </p>
                        )}

                        {/* Actions */}
                        <ProductActions product={product} inStock={inStock} />

                        {/* Features */}
                        <div className="mt-8 pt-8 border-t">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-start gap-3">
                                    <TruckIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-sm">Free Delivery</p>
                                        <p className="text-xs text-gray-600">On orders over PKR 50,000</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-sm">Warranty</p>
                                        <p className="text-xs text-gray-600">
                                            {product.specifications?.warranty || "1 year"} warranty
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Package className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-sm">Easy Returns</p>
                                        <p className="text-xs text-gray-600">7 days return policy</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <ProductTabs
                    description={product.description || product.short_description || "No description available."}
                    features={product.features}
                    specifications={product.specifications}
                />

                {/* Related Products */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div className="mt-20">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold">Related Products</h2>
                            {product.category && (
                                <Link
                                    href={`/categories/${product.category.slug}`}
                                    className="text-primary hover:text-primary-dark font-semibold flex items-center gap-2"
                                >
                                    View All
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                            {relatedProducts.map((relatedProduct: any, index: number) => (
                                <ProductCard key={relatedProduct.id} product={relatedProduct} index={index} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Metadata
export async function generateMetadata({ params }: ProductPageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: product } = await supabase
        .from("products")
        .select("name, meta_title, meta_description, short_description, price, discounted_price, category:categories(name), brand:brands(name), images:product_images(image_url)")
        .eq("slug", slug)
        .single();

    if (!product) {
        return {
            title: "Product Not Found",
        };
    }

    const title = product.meta_title || `${product.name} - Buy Online at Best Price | SultaniElectro`;
    const brandData = product.brand as any;
    const categoryData = product.category as any;
    const brandName = Array.isArray(brandData) ? brandData[0]?.name : brandData?.name;
    const categoryName = Array.isArray(categoryData) ? categoryData[0]?.name : categoryData?.name;
    const description = product.meta_description ||
        `Buy ${product.name} online at best price in Pakistan. ${brandName || ''} ${categoryName || ''}. Free delivery on orders above PKR 50,000. Shop now at SultaniElectro!`;

    return {
        title,
        description,
        keywords: [
            product.name,
            `${product.name} price Pakistan`,
            `buy ${product.name} online`,
            brandName,
            categoryName,
            "solar panels Pakistan",
            "SultaniElectro",
        ].filter(Boolean),
        alternates: {
            canonical: `/products/${slug}`,
        },
        openGraph: {
            title,
            description,
            type: "product",
            url: `${SITE_CONFIG.url}/products/${slug}`,
            images: product.images?.[0]?.image_url ? [
                {
                    url: product.images[0].image_url,
                    width: 800,
                    height: 600,
                    alt: product.name,
                }
            ] : [],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: product.images?.[0]?.image_url ? [product.images[0].image_url] : [],
        },
    };
}
