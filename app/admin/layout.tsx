"use client";

import { useState, useEffect } from "react";
import { AdminSidebar, MobileMenuButton } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth";
import { LogOut, Home, Bell, Search, User, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
    "/admin": { title: "Dashboard", subtitle: "Overview of your store performance" },
    "/admin/analytics": { title: "Analytics", subtitle: "Detailed insights and reports" },
    "/admin/products": { title: "Products", subtitle: "Manage your product catalog" },
    "/admin/categories": { title: "Categories", subtitle: "Organize your products" },
    "/admin/brands": { title: "Brands", subtitle: "Manage product brands" },
    "/admin/orders": { title: "Orders", subtitle: "Track and manage orders" },
    "/admin/customers": { title: "Customers", subtitle: "View customer information" },
    "/admin/inventory": { title: "Inventory", subtitle: "Stock management" },
    "/admin/coupons": { title: "Coupons", subtitle: "Discount codes and promotions" },
    "/admin/banners": { title: "Banners", subtitle: "Homepage banners and slides" },
    "/admin/reviews": { title: "Reviews", subtitle: "Customer product reviews" },
    "/admin/settings": { title: "Settings", subtitle: "Store configuration" },
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            setCurrentTime(new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }));
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    const pageInfo = pageTitles[pathname] || { title: "Admin", subtitle: "Dashboard" };

    return (
        <div className="min-h-screen bg-slate-50">
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="lg:ml-[280px] min-h-screen flex flex-col">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-3 sticky top-0 z-30 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        {/* Left Side */}
                        <div className="flex items-center gap-4">
                            <MobileMenuButton onClick={() => setSidebarOpen(true)} />
                            <div className="hidden sm:block">
                                <h1 className="text-lg lg:text-xl font-bold text-slate-900">{pageInfo.title}</h1>
                                <p className="text-xs text-slate-500">{pageInfo.subtitle}</p>
                            </div>
                        </div>

                        {/* Center - Search (hidden on mobile) */}
                        <div className="hidden md:flex flex-1 max-w-md mx-4">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search products, orders, customers..."
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Time Display */}
                            <div className="hidden lg:block text-sm text-slate-500 font-medium">
                                {currentTime}
                            </div>

                            {/* Notifications */}
                            <button className="relative p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                <Bell className="h-5 w-5 text-slate-600" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* View Store */}
                            <Button asChild variant="outline" size="sm" className="hidden sm:flex rounded-xl border-slate-200 hover:border-primary hover:text-primary">
                                <Link href="/">
                                    <Home className="h-4 w-4 mr-2" />
                                    <span className="hidden md:inline">View Store</span>
                                </Link>
                            </Button>

                            {/* User Menu */}
                            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                    A
                                </div>
                                <div className="hidden lg:block">
                                    <p className="text-sm font-semibold text-slate-900">Admin</p>
                                    <p className="text-xs text-slate-500">Super Admin</p>
                                </div>
                                <form action={logout}>
                                    <Button type="submit" variant="ghost" size="sm" className="ml-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl">
                                        <LogOut className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Title (Mobile) */}
                <div className="sm:hidden px-4 pt-4">
                    <h1 className="text-lg font-bold text-slate-900">{pageInfo.title}</h1>
                    <p className="text-xs text-slate-500">{pageInfo.subtitle}</p>
                </div>

                {/* Main Content */}
                <main className="flex-1 p-4 lg:p-6">
                    {children}
                </main>

                {/* Footer */}
                <footer className="py-4 px-6 border-t border-slate-200 bg-white">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
                        <p>© 2024 SultaniElectro. All rights reserved.</p>
                        <p>Version 1.0.0</p>
                    </div>
                </footer>
            </div>
        </div>
    );
}
