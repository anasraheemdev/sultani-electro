"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { createClient } from "@/lib/supabase/client";

export function SearchBar() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        async function fetchSuggestions() {
            if (debouncedQuery.length < 2) {
                setSuggestions([]);
                return;
            }

            const supabase = createClient();
            const { data } = await supabase
                .from("products")
                .select("id, name, slug, price, discounted_price")
                .ilike("name", `%${debouncedQuery}%`)
                .eq("is_active", true)
                .limit(5);

            setSuggestions(data || []);
        }

        fetchSuggestions();
    }, [debouncedQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setShowSuggestions(false);
        }
    };

    const handleClear = () => {
        setQuery("");
        setSuggestions([]);
        setShowSuggestions(false);
    };

    return (
        <div className="relative w-full max-w-xl">
            <form onSubmit={handleSearch}>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Search for solar panels, inverters, batteries..."
                        className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-50">
                    {suggestions.map((product) => (
                        <a
                            key={product.id}
                            href={`/products/${product.slug}`}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b last:border-0"
                            onClick={() => {
                                setShowSuggestions(false);
                                setQuery("");
                            }}
                        >
                            <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{product.name}</p>
                                <p className="text-sm text-primary font-semibold">
                                    PKR{" "}
                                    {(
                                        product.discounted_price || product.price
                                    ).toLocaleString()}
                                </p>
                            </div>
                        </a>
                    ))}
                    <a
                        href={`/search?q=${encodeURIComponent(query)}`}
                        className="block p-3 text-center text-sm text-primary font-semibold hover:bg-gray-50"
                        onClick={() => setShowSuggestions(false)}
                    >
                        View all results for "{query}"
                    </a>
                </div>
            )}

            {/* Overlay to close suggestions */}
            {showSuggestions && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSuggestions(false)}
                />
            )}
        </div>
    );
}
