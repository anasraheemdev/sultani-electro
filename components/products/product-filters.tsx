"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X, SlidersHorizontal } from "lucide-react";

interface ProductFiltersProps {
    categories: Array<{ id: string; name: string; slug: string }>;
    brands: Array<{ id: string; name: string; slug: string }>;
    currentFilters: {
        category?: string;
        brand?: string;
        minPrice?: string;
        maxPrice?: string;
        sort?: string;
    };
}

export function ProductFilters({ categories, brands, currentFilters }: ProductFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectedCategory, setSelectedCategory] = useState(currentFilters.category || "");
    const [selectedBrand, setSelectedBrand] = useState(currentFilters.brand || "");
    const [minPrice, setMinPrice] = useState(currentFilters.minPrice || "");
    const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice || "");

    const applyFilters = () => {
        const params = new URLSearchParams();

        if (selectedCategory) params.set("category", selectedCategory);
        if (selectedBrand) params.set("brand", selectedBrand);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        if (currentFilters.sort) params.set("sort", currentFilters.sort);

        router.push(`/products?${params.toString()}`);
    };

    const clearFilters = () => {
        setSelectedCategory("");
        setSelectedBrand("");
        setMinPrice("");
        setMaxPrice("");
        router.push("/products");
    };

    const hasActiveFilters = selectedCategory || selectedBrand || minPrice || maxPrice;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-lg">Filters</h3>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                    >
                        <X className="h-4 w-4" />
                        Clear
                    </button>
                )}
            </div>

            {/* Category Filter */}
            <div className="mb-6">
                <h4 className="font-semibold text-sm mb-3 text-gray-900">Category</h4>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="radio"
                            name="category"
                            value=""
                            checked={selectedCategory === ""}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">
                            All Categories
                        </span>
                    </label>
                    {categories.map((category) => (
                        <label key={category.id} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="radio"
                                name="category"
                                value={category.id}
                                checked={selectedCategory === category.id}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-4 h-4 text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">
                                {category.name}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 my-6" />

            {/* Brand Filter */}
            <div className="mb-6">
                <h4 className="font-semibold text-sm mb-3 text-gray-900">Brand</h4>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="radio"
                            name="brand"
                            value=""
                            checked={selectedBrand === ""}
                            onChange={(e) => setSelectedBrand(e.target.value)}
                            className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">
                            All Brands
                        </span>
                    </label>
                    {brands.map((brand) => (
                        <label key={brand.id} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="radio"
                                name="brand"
                                value={brand.id}
                                checked={selectedBrand === brand.id}
                                onChange={(e) => setSelectedBrand(e.target.value)}
                                className="w-4 h-4 text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-gray-700 group-hover:text-primary transition-colors">
                                {brand.name}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 my-6" />

            {/* Price Range */}
            <div className="mb-6">
                <h4 className="font-semibold text-sm mb-3 text-gray-900">Price Range (PKR)</h4>
                <div className="space-y-3">
                    <input
                        type="number"
                        placeholder="Min Price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                    <input
                        type="number"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                </div>
            </div>

            {/* Apply Button */}
            <Button
                onClick={applyFilters}
                className="w-full bg-primary hover:bg-primary-dark text-white"
            >
                Apply Filters
            </Button>
        </div>
    );
}
