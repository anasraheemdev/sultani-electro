"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    ChevronRight, Home, Package, Grid3X3, Heart, ShoppingCart,
    User, Settings, MapPin, CreditCard, Search, Tag, Truck,
    type LucideIcon
} from "lucide-react";

// Icon mapping for string-based icon names
const iconMap: Record<string, LucideIcon> = {
    package: Package,
    grid: Grid3X3,
    heart: Heart,
    cart: ShoppingCart,
    user: User,
    settings: Settings,
    location: MapPin,
    payment: CreditCard,
    search: Search,
    tag: Tag,
    truck: Truck,
};

interface PageHeroProps {
    title: string;
    highlightedWord?: string;
    description?: string;
    iconName?: string;
    breadcrumbs?: Array<{ label: string; href?: string }>;
    variant?: "default" | "gradient" | "dark" | "colorful";
}

export function PageHero({
    title,
    highlightedWord,
    description,
    iconName,
    breadcrumbs = [],
    variant = "default"
}: PageHeroProps) {
    const Icon = iconName ? iconMap[iconName] : null;

    const variantStyles = {
        default: "bg-gradient-to-br from-gray-50 via-white to-primary/5",
        gradient: "bg-gradient-to-br from-primary/10 via-cyan-50 to-secondary/10",
        dark: "bg-gradient-to-br from-gray-900 via-gray-800 to-primary/20 text-white",
        colorful: "bg-gradient-to-r from-primary via-cyan-500 to-secondary text-white"
    };

    const textColor = variant === "dark" || variant === "colorful" ? "text-white" : "text-gray-900";
    const descColor = variant === "dark" || variant === "colorful" ? "text-white/80" : "text-gray-600";
    const breadcrumbColor = variant === "dark" || variant === "colorful" ? "text-white/70" : "text-gray-600";

    // Split title to highlight a word
    let titleParts = { before: title, highlighted: "", after: "" };
    if (highlightedWord && title.includes(highlightedWord)) {
        const index = title.indexOf(highlightedWord);
        titleParts = {
            before: title.substring(0, index),
            highlighted: highlightedWord,
            after: title.substring(index + highlightedWord.length)
        };
    }

    return (
        <div className={`relative overflow-hidden ${variantStyles[variant]}`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
            </div>

            {/* Decorative Elements */}
            {(variant === "colorful" || variant === "dark") && (
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
            )}

            <div className="container-custom relative z-10 py-6 sm:py-10 lg:py-14">
                {/* Breadcrumbs */}
                {breadcrumbs.length > 0 && (
                    <motion.nav
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-xs sm:text-sm mb-4 sm:mb-6 flex-wrap"
                    >
                        <Link
                            href="/"
                            className={`${breadcrumbColor} hover:text-primary transition-colors flex items-center gap-1`}
                        >
                            <Home className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Home</span>
                        </Link>
                        {breadcrumbs.map((crumb, index) => (
                            <span key={index} className="flex items-center gap-2">
                                <ChevronRight className={`h-3 w-3 sm:h-4 sm:w-4 ${breadcrumbColor}`} />
                                {crumb.href ? (
                                    <Link
                                        href={crumb.href}
                                        className={`${breadcrumbColor} hover:text-primary transition-colors`}
                                    >
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className={`${textColor} font-medium`}>{crumb.label}</span>
                                )}
                            </span>
                        ))}
                    </motion.nav>
                )}

                {/* Title Section */}
                <div className="flex items-center gap-4 sm:gap-6">
                    {Icon && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className={`hidden sm:flex w-14 h-14 lg:w-20 lg:h-20 rounded-2xl lg:rounded-3xl items-center justify-center ${variant === "dark" || variant === "colorful"
                                    ? "bg-white/20 backdrop-blur-sm"
                                    : "bg-gradient-to-br from-primary to-cyan-500"
                                }`}
                        >
                            <Icon className={`h-7 w-7 lg:h-10 lg:w-10 ${variant === "dark" || variant === "colorful" ? "text-white" : "text-white"
                                }`} />
                        </motion.div>
                    )}

                    <div className="flex-1">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold ${textColor}`}
                        >
                            {titleParts.before}
                            {titleParts.highlighted && (
                                <span className={
                                    variant === "dark" || variant === "colorful"
                                        ? "text-yellow-300"
                                        : "bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent"
                                }>
                                    {titleParts.highlighted}
                                </span>
                            )}
                            {titleParts.after}
                        </motion.h1>

                        {description && (
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className={`mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg ${descColor} max-w-2xl`}
                            >
                                {description}
                            </motion.p>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Wave */}
            {variant !== "default" && (
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" className="w-full h-6 sm:h-10">
                        <path
                            fill={variant === "dark" || variant === "colorful" ? "#f9fafb" : "#ffffff"}
                            d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
                        />
                    </svg>
                </div>
            )}
        </div>
    );
}
