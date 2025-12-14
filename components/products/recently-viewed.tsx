"use client";

import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { ProductCard } from "@/components/products/product-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RecentlyViewedProducts() {
    const { products } = useRecentlyViewed();

    if (products.length === 0) return null;

    return (
        <div className="py-8">
            <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {products.slice(0, 6).map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                        <CardContent className="p-0">
                            <a href={`/products/${product.slug}`}>
                                <div className="aspect-square bg-gray-100 relative">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-3">
                                    <p className="text-sm font-semibold line-clamp-2 mb-1">
                                        {product.name}
                                    </p>
                                    <p className="text-sm font-bold text-primary">
                                        PKR {(product.discounted_price || product.price).toLocaleString()}
                                    </p>
                                </div>
                            </a>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
