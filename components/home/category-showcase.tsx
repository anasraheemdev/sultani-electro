"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Sun, Zap, Battery, Wrench, Smartphone, Home } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
    {
        name: "Solar Panels",
        slug: "solar-panels",
        icon: Sun,
        description: "High-efficiency panels",
        color: "bg-orange-500",
    },
    {
        name: "Inverters",
        slug: "inverters",
        icon: Zap,
        description: "Smart power conversion",
        color: "bg-blue-500",
    },
    {
        name: "Batteries",
        slug: "batteries",
        icon: Battery,
        description: "Energy storage solutions",
        color: "bg-green-500",
    },
    {
        name: "Solar Accessories",
        slug: "solar-accessories",
        icon: Wrench,
        description: "Complete installation kits",
        color: "bg-purple-500",
    },
    {
        name: "Electronics",
        slug: "electronics",
        icon: Smartphone,
        description: "Consumer electronics",
        color: "bg-pink-500",
    },
    {
        name: "Home Appliances",
        slug: "home-appliances",
        icon: Home,
        description: "Energy-efficient appliances",
        color: "bg-indigo-500",
    },
];

export function CategoryShowcase() {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
                        Shop by Category
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore our wide range of solar energy products and electronics
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categories.map((category, index) => {
                        const Icon = category.icon;
                        return (
                            <motion.div
                                key={category.slug}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link href={`/category/${category.slug}`}>
                                    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                                        <CardContent className="p-6 text-center">
                                            <div
                                                className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                                            >
                                                <Icon className="h-8 w-8 text-white" />
                                            </div>
                                            <h3 className="font-semibold text-dark mb-1">
                                                {category.name}
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                {category.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
