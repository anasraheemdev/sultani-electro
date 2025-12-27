"use client";

import Link from "next/link";
import NextImage from "next/image";
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
    X,
    Menu,
    Boxes,
    Image as ImageIcon,
    MessageSquare,
    FileText,
    Bell,
    ChevronRight,
} from "lucide-react";

const menuItems = [
    {
        section: "Main",
        items: [
            { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
            { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
        ]
    },
    {
        section: "Store Management",
        items: [
            { href: "/admin/products", icon: Package, label: "Products" },
            { href: "/admin/categories", icon: FolderTree, label: "Categories" },
            { href: "/admin/brands", icon: Tag, label: "Brands" },
            { href: "/admin/inventory", icon: Boxes, label: "Inventory" },
        ]
    },
    {
        section: "Sales",
        items: [
            { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
            { href: "/admin/customers", icon: Users, label: "Customers" },
            { href: "/admin/coupons", icon: FileText, label: "Coupons" },
        ]
    },
    {
        section: "Content",
        items: [
            { href: "/admin/banners", icon: ImageIcon, label: "Banners" },
            { href: "/admin/reviews", icon: MessageSquare, label: "Reviews" },
        ]
    },
    {
        section: "System",
        items: [
            { href: "/admin/settings", icon: Settings, label: "Settings" },
        ]
    },
];

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname();

    const isActive = (href: string, exact?: boolean) => {
        if (exact) return pathname === href;
        return pathname === href || pathname.startsWith(href + "/");
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    w-[280px] bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white h-screen fixed left-0 top-0 z-50
                    transform transition-transform duration-300 ease-in-out overflow-hidden
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0 flex flex-col
                    shadow-2xl
                `}
            >
                {/* Header */}
                <div className="p-4 flex items-center justify-between border-b border-white/10">
                    <Link href="/admin" className="flex items-center gap-3">
                        <NextImage
                            src="/logo.png"
                            alt="Sultani - Admin Panel"
                            width={120}
                            height={40}
                            className="h-9 w-auto object-contain brightness-0 invert"
                            priority
                        />
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6" style={{ scrollbarWidth: 'thin', scrollbarColor: '#334155 transparent' }}>
                    {menuItems.map((section, idx) => (
                        <div key={idx}>
                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 mb-2">
                                {section.section}
                            </p>
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const active = isActive(item.href, (item as any).exact);
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={onClose}
                                            className={`
                                                flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200
                                                ${active
                                                    ? "bg-gradient-to-r from-primary to-cyan-600 text-white shadow-lg shadow-primary/25"
                                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                                }
                                            `}
                                        >
                                            <Icon className={`h-[18px] w-[18px] flex-shrink-0 ${active ? 'text-white' : ''}`} />
                                            <span className="font-medium text-sm flex-1">{item.label}</span>
                                            {active && <ChevronRight className="h-4 w-4 opacity-60" />}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-white/10">
                    <div className="bg-gradient-to-r from-primary/20 to-cyan-600/20 rounded-xl p-4 border border-primary/20">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/30 flex items-center justify-center">
                                <Bell className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-white">Need Help?</p>
                                <p className="text-[10px] text-slate-400">Contact support</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

// Export mobile menu button
export function MobileMenuButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="lg:hidden p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Open menu"
        >
            <Menu className="h-5 w-5 text-slate-700" />
        </button>
    );
}
