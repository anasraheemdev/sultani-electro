"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ShoppingCart, User, Search, Menu, Heart, X, LogOut, Settings, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export function Header() {
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const router = useRouter();

    const getTotalItems = useCartStore((state) => state.getTotalItems);
    const cartItemCount = mounted ? getTotalItems() : 0;

    const { scrollY } = useScroll();
    const headerY = useTransform(scrollY, [0, 100], [0, 10]);
    const headerOpacity = useTransform(scrollY, [0, 50], [0.95, 1]);

    useEffect(() => {
        setMounted(true);

        // Get current user
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
            setIsSearchFocused(false);
        }
    };

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setShowUserMenu(false);
        router.push("/");
        router.refresh();
    };

    return (
        <>
            {/* Spacer for fixed header - Increased for better spacing */}
            <div className="h-28 md:h-32" />

            {/* Floating Header */}
            <motion.header
                style={{ y: headerY, opacity: headerOpacity }}
                className="fixed top-4 left-0 right-0 z-50 px-4"
            >
                <div className="container-custom">
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50">
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-between gap-4">
                                {/* Logo */}
                                <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="text-2xl font-bold"
                                    >
                                        <span className="text-primary">Sultani</span>
                                        <span className="text-gray-900">Electro</span>
                                    </motion.div>
                                </Link>

                                {/* Search Bar - Desktop */}
                                <form
                                    onSubmit={handleSearch}
                                    className="hidden md:flex flex-1 max-w-2xl"
                                >
                                    <div className="relative w-full">
                                        <motion.div
                                            animate={{
                                                scale: isSearchFocused ? 1.02 : 1,
                                            }}
                                            transition={{ duration: 0.2 }}
                                            className="relative"
                                        >
                                            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="search"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onFocus={() => setIsSearchFocused(true)}
                                                onBlur={() => setIsSearchFocused(false)}
                                                placeholder="Search for products..."
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary focus:outline-none transition-all"
                                            />
                                        </motion.div>
                                    </div>
                                </form>

                                {/* Navigation Links - Desktop */}
                                <nav className="hidden lg:flex items-center gap-1">
                                    <Link
                                        href="/products"
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                                    >
                                        Products
                                    </Link>
                                    <Link
                                        href="/categories"
                                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                                    >
                                        Categories
                                    </Link>
                                </nav>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    {/* Wishlist */}
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="hidden md:flex rounded-full hover:bg-primary/10"
                                            asChild
                                        >
                                            <Link href="/wishlist">
                                                <Heart className="h-5 w-5" />
                                            </Link>
                                        </Button>
                                    </motion.div>

                                    {/* User Account / Dashboard */}
                                    {user ? (
                                        <div className="relative">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setShowUserMenu(!showUserMenu)}
                                                className="hidden md:flex items-center gap-2 rounded-full hover:bg-primary/10 p-1"
                                            >
                                                {user.user_metadata?.avatar_url ? (
                                                    <Image
                                                        src={user.user_metadata.avatar_url}
                                                        alt={user.user_metadata?.full_name || "User"}
                                                        width={36}
                                                        height={36}
                                                        className="rounded-full"
                                                    />
                                                ) : (
                                                    <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
                                                        {user.email?.[0].toUpperCase()}
                                                    </div>
                                                )}
                                            </motion.button>

                                            {/* User Dropdown Menu */}
                                            {showUserMenu && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
                                                >
                                                    <div className="p-4 border-b border-gray-100">
                                                        <p className="font-semibold text-sm">{user.user_metadata?.full_name || "User"}</p>
                                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                    </div>
                                                    <div className="p-2">
                                                        <Link
                                                            href="/dashboard"
                                                            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 rounded-xl transition-all"
                                                            onClick={() => setShowUserMenu(false)}
                                                        >
                                                            <Settings className="h-4 w-4" />
                                                            Dashboard
                                                        </Link>
                                                        <Link
                                                            href="/dashboard/orders"
                                                            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 rounded-xl transition-all"
                                                            onClick={() => setShowUserMenu(false)}
                                                        >
                                                            <Package className="h-4 w-4" />
                                                            My Orders
                                                        </Link>
                                                        <button
                                                            onClick={handleSignOut}
                                                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                        >
                                                            <LogOut className="h-4 w-4" />
                                                            Sign Out
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    ) : (
                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hidden md:flex rounded-full hover:bg-primary/10"
                                                asChild
                                            >
                                                <Link href="/login">
                                                    <User className="h-5 w-5" />
                                                </Link>
                                            </Button>
                                        </motion.div>
                                    )}

                                    {/* Cart */}
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="relative rounded-full hover:bg-primary/10"
                                            asChild
                                        >
                                            <Link href="/cart">
                                                <ShoppingCart className="h-5 w-5" />
                                                {cartItemCount > 0 && (
                                                    <motion.span
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center"
                                                    >
                                                        {cartItemCount}
                                                    </motion.span>
                                                )}
                                            </Link>
                                        </Button>
                                    </motion.div>

                                    {/* Mobile Menu Toggle */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="md:hidden rounded-full"
                                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    >
                                        {isMobileMenuOpen ? (
                                            <X className="h-5 w-5" />
                                        ) : (
                                            <Menu className="h-5 w-5" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Mobile Search */}
                            <form
                                onSubmit={handleSearch}
                                className="md:hidden mt-4"
                            >
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search products..."
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary focus:outline-none transition-all"
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Mobile Menu */}
                        {isMobileMenuOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="md:hidden border-t border-gray-200 rounded-b-3xl overflow-hidden"
                            >
                                <nav className="px-6 py-4 space-y-2">
                                    <Link
                                        href="/products"
                                        className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl transition-all"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Products
                                    </Link>
                                    <Link
                                        href="/categories"
                                        className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl transition-all"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Categories
                                    </Link>
                                    <Link
                                        href="/wishlist"
                                        className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl transition-all"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Wishlist
                                    </Link>
                                    {user ? (
                                        <>
                                            <Link
                                                href="/dashboard"
                                                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl transition-all"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                Dashboard
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    handleSignOut();
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <Link
                                            href="/login"
                                            className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl transition-all"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Login
                                        </Link>
                                    )}
                                </nav>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.header>
        </>
    );
}
