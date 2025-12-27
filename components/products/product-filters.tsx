"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X, SlidersHorizontal, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    const [isOpen, setIsOpen] = useState(false);

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
        setIsOpen(false);
    };

    const clearFilters = () => {
        setSelectedCategory("");
        setSelectedBrand("");
        setMinPrice("");
        setMaxPrice("");
        router.push("/products");
    };

    const hasActiveFilters = selectedCategory || selectedBrand || minPrice || maxPrice;
    const activeFilterCount = [selectedCategory, selectedBrand, minPrice, maxPrice].filter(Boolean).length;

    return (
        <>
            {/* Filter Toggle Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-sm font-medium"
            >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
                        {activeFilterCount}
                    </span>
                )}
            </button>

            {/* Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40"
                    />
                )}
            </AnimatePresence>

            {/* Sliding Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl z-50 overflow-y-auto"
                    >
                        {/* Sidebar Header */}
                        <div className="sticky top-0 bg-white border-b px-4 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <SlidersHorizontal className="h-5 w-5 text-primary" />
                                <h3 className="font-bold text-lg">Filters</h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Filter Content */}
                        <div className="p-4 space-y-6">
                            {/* Clear Filters */}
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="w-full py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center gap-1 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                    Clear All Filters
                                </button>
                            )}

                            {/* Category Filter */}
                            <div>
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
                            <div className="h-px bg-gray-200" />

                            {/* Brand Filter */}
                            <div>
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
                            <div className="h-px bg-gray-200" />

                            {/* Price Range */}
                            <div>
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
                        </div>

                        {/* Sticky Footer */}
                        <div className="sticky bottom-0 bg-white border-t p-4">
                            <Button
                                onClick={applyFilters}
                                className="w-full bg-primary hover:bg-primary-dark text-white"
                            >
                                Apply Filters
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
