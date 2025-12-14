"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function ProductSort() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", e.target.value);
        router.push(`/products?${params.toString()}`);
    };

    return (
        <select
            value={searchParams.get("sort") || "newest"}
            onChange={handleSortChange}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary bg-white"
        >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
        </select>
    );
}
