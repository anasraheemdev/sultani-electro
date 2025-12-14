"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    FolderTree,
    ShoppingCart,
    Users,
    BarChart3,
    Settings,
    Tag,
} from "lucide-react";

const menuItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/products", icon: Package, label: "Products" },
    { href: "/admin/categories", icon: FolderTree, label: "Categories" },
    { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
    { href: "/admin/brands", icon: Tag, label: "Brands" },
    { href: "/admin/customers", icon: Users, label: "Customers" },
    { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-0">
            <div className="p-6">
                <Link href="/admin" className="block">
                    <h1 className="text-2xl font-bold">
                        <span className="text-primary">Sultani</span>Electro
                    </h1>
                    <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
                </Link>
            </div>

            <nav className="px-3">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${isActive
                                    ? "bg-primary text-white"
                                    : "text-gray-300 hover:bg-gray-800"
                                }`}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
