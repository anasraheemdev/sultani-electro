"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Check, Minus } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    discounted_price: number | null;
    images: Array<{ image_url: string; alt_text: string | null }>;
    specifications?: Record<string, any>;
}

interface ProductComparisonProps {
    products: Product[];
    onRemove: (productId: string) => void;
}

export function ProductComparison({ products, onRemove }: ProductComparisonProps) {
    if (products.length === 0) {
        return (
            <Card>
                <CardContent className="p-12 text-center">
                    <p className="text-gray-500">No products to compare</p>
                </CardContent>
            </Card>
        );
    }

    // Extract all unique specification keys
    const allSpecs = new Set<string>();
    products.forEach((product) => {
        if (product.specifications) {
            Object.keys(product.specifications).forEach((key) => allSpecs.add(key));
        }
    });

    const specKeys = Array.from(allSpecs);

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="p-4 bg-gray-50 border text-left font-semibold">
                            Feature
                        </th>
                        {products.map((product) => (
                            <th key={product.id} className="p-4 bg-gray-50 border min-w-[250px]">
                                <div className="relative">
                                    <button
                                        onClick={() => onRemove(product.id)}
                                        className="absolute top-0 right-0 p-1 hover:bg-gray-200 rounded"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                    <div className="aspect-square bg-gray-100 mb-3 rounded overflow-hidden">
                                        {product.images[0] && (
                                            <Image
                                                src={product.images[0].image_url}
                                                alt={product.images[0].alt_text || product.name}
                                                width={200}
                                                height={200}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <Link
                                        href={`/products/${product.slug}`}
                                        className="font-semibold hover:text-primary line-clamp-2"
                                    >
                                        {product.name}
                                    </Link>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {/* Price */}
                    <tr>
                        <td className="p-4 border font-semibold bg-gray-50">Price</td>
                        {products.map((product) => (
                            <td key={product.id} className="p-4 border text-center">
                                <div>
                                    <p className="text-lg font-bold text-primary">
                                        {formatPrice(product.discounted_price || product.price)}
                                    </p>
                                    {product.discounted_price && (
                                        <p className="text-sm text-gray-400 line-through">
                                            {formatPrice(product.price)}
                                        </p>
                                    )}
                                </div>
                            </td>
                        ))}
                    </tr>

                    {/* Specifications */}
                    {specKeys.map((specKey) => (
                        <tr key={specKey}>
                            <td className="p-4 border font-semibold bg-gray-50 capitalize">
                                {specKey.replace(/_/g, " ")}
                            </td>
                            {products.map((product) => (
                                <td key={product.id} className="p-4 border text-center">
                                    {product.specifications?.[specKey] ? (
                                        typeof product.specifications[specKey] === "boolean" ? (
                                            product.specifications[specKey] ? (
                                                <Check className="h-5 w-5 text-green-600 mx-auto" />
                                            ) : (
                                                <Minus className="h-5 w-5 text-gray-400 mx-auto" />
                                            )
                                        ) : (
                                            <span>{product.specifications[specKey]}</span>
                                        )
                                    ) : (
                                        <Minus className="h-5 w-5 text-gray-400 mx-auto" />
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}

                    {/* Add to Cart */}
                    <tr>
                        <td className="p-4 border font-semibold bg-gray-50">Action</td>
                        {products.map((product) => (
                            <td key={product.id} className="p-4 border text-center">
                                <Button className="w-full">Add to Cart</Button>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
