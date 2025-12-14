import { createClient } from "@/lib/supabase/server";
import { StaticHero } from "@/components/home/static-hero";
import { ProductCard } from "@/components/products/product-card";
import {
    ArrowRight, Zap, Shield, Truck, HeadphonesIcon,
    TrendingUp, Award, Users, Battery, Sun, Leaf,
    CheckCircle, Star, DollarSign, Clock, MapPin,
    Sparkles, ShoppingBag, Play
} from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "SultaniElectro - Premium Solar Energy Solutions in Pakistan",
    description: "Leading provider of solar panels, inverters, and energy storage systems. Premium quality, best prices, nationwide delivery.",
};

export default async function HomePage() {
    const supabase = await createClient();

    // Fetch featured products
    const { data: featuredProducts } = await supabase
        .from("products")
        .select(`
            *,
            category:categories(name, slug),
            brand:brands(name),
            images:product_images(image_url, alt_text, display_order),
            inventory(quantity)
        `)
        .eq("is_featured", true)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(8);

    // Fetch categories
    const { data: categories } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order")
        .limit(6);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <StaticHero />

            {/* Value Proposition Section */}
            <section className="py-20 bg-white relative">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold text-sm mb-4">
                            <Sparkles className="h-4 w-4" />
                            Why Choose SultaniElectro
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Your Trusted <span className="bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">Solar Partner</span>
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            We make switching to solar energy simple, affordable, and rewarding
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Zap,
                                title: "Premium Quality",
                                desc: "Top-tier solar products from world-leading manufacturers like Longi, Jinko, and Growatt",
                                color: "from-yellow-500 to-orange-500"
                            },
                            {
                                icon: Shield,
                                title: "25-Year Warranty",
                                desc: "Industry-leading warranty coverage on all solar panels with comprehensive support",
                                color: "from-blue-500 to-cyan-500"
                            },
                            {
                                icon: Truck,
                                title: "Free Delivery",
                                desc: "Complimentary nationwide shipping on all orders above PKR 50,000",
                                color: "from-green-500 to-emerald-500"
                            },
                            {
                                icon: HeadphonesIcon,
                                title: "Expert Support",
                                desc: "24/7 technical assistance and consultation from certified solar engineers",
                                color: "from-purple-500 to-pink-500"
                            }
                        ].map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="group relative bg-white rounded-3xl p-8 border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative">
                                        <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                                            <Icon className="h-8 w-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                        <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Simple <span className="bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">3-Step Process</span>
                        </h2>
                        <p className="text-gray-600 text-lg">Get started with solar energy in just three easy steps</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "01",
                                title: "Choose Your System",
                                desc: "Browse our premium solar products and select the perfect solution for your energy needs",
                                icon: ShoppingBag
                            },
                            {
                                step: "02",
                                title: "Get Expert Consultation",
                                desc: "Our certified engineers provide free site assessment and customized solar solutions",
                                icon: HeadphonesIcon
                            },
                            {
                                step: "03",
                                title: "Professional Installation",
                                desc: "Sit back while our experts install and activate your solar system with warranty",
                                icon: CheckCircle
                            }
                        ].map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div key={index} className="relative">
                                    <div className="bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="text-6xl font-bold bg-gradient-to-br from-primary to-cyan-500 bg-clip-text text-transparent opacity-20">
                                                    {item.step}
                                                </div>
                                                <div className="w-14 h-14 bg-gradient-to-br from-primary to-cyan-500 rounded-2xl flex items-center justify-center">
                                                    <Icon className="h-7 w-7 text-white" />
                                                </div>
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                            <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            {categories && categories.length > 0 && (
                <section className="py-20 bg-white">
                    <div className="container-custom">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold text-sm mb-4">
                                <Sun className="h-4 w-4" />
                                Product Categories
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">
                                Explore Our <span className="bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">Solar Range</span>
                            </h2>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                Comprehensive selection of premium solar energy products for every need
                            </p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                            {categories.map((category: any) => {
                                // Map category names to icons
                                const iconMap: { [key: string]: any } = {
                                    'Solar Panels': Sun,
                                    'Inverters': Zap,
                                    'Batteries': Battery,
                                    'Accessories': Shield,
                                    'Monitoring': TrendingUp,
                                };
                                const CategoryIcon = iconMap[category.name] || Sun;

                                return (
                                    <Link
                                        key={category.id}
                                        href={`/categories/${category.slug}`}
                                        className="group"
                                    >
                                        <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 text-center border border-gray-100 hover:border-primary/30 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="relative">
                                                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4 group-hover:bg-primary/20 transition-colors">
                                                    <CategoryIcon className="h-8 w-8 text-primary" />
                                                </div>
                                                <h3 className="font-bold text-sm group-hover:text-primary transition-colors">
                                                    {category.name}
                                                </h3>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Products */}
            {featuredProducts && featuredProducts.length > 0 && (
                <section className="py-20 bg-gray-50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl" />

                    <div className="container-custom relative">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold text-sm mb-4">
                                    <Star className="h-4 w-4" />
                                    Customer Favorites
                                </div>
                                <h2 className="text-4xl md:text-5xl font-bold mb-2">
                                    Featured <span className="bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">Products</span>
                                </h2>
                                <p className="text-gray-600 text-lg">
                                    Handpicked premium solar solutions trusted by thousands
                                </p>
                            </div>
                            <Link
                                href="/products"
                                className="hidden md:inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-cyan-500 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
                            >
                                View All Products
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {featuredProducts.map((product: any, index: number) => (
                                <ProductCard key={product.id} product={product} index={index} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Stats & Trust Section */}
            <section className="py-20 bg-white">
                <div className="container-custom">
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { icon: Users, number: "5,000+", label: "Happy Customers", color: "from-blue-500 to-cyan-500" },
                            { icon: Award, number: "500+", label: "Premium Products", color: "from-purple-500 to-pink-500" },
                            { icon: MapPin, number: "50+", label: "Cities Covered", color: "from-green-500 to-emerald-500" },
                            { icon: TrendingUp, number: "98%", label: "Satisfaction Rate", color: "from-orange-500 to-red-500" }
                        ].map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={index}
                                    className="text-center group cursor-pointer"
                                >
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-3xl mb-6 group-hover:scale-110 transition-transform">
                                        <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center`}>
                                            <Icon className="h-8 w-8 text-white" />
                                        </div>
                                    </div>
                                    <div className={`text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                                        {stat.number}
                                    </div>
                                    <div className="text-gray-600 font-semibold text-lg">{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-cyan-600 to-blue-700" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />

                <div className="container-custom relative z-10">
                    <div className="max-w-4xl mx-auto text-center text-white">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full font-semibold text-sm mb-6">
                            <Leaf className="h-4 w-4" />
                            Start Saving Today
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Ready to Switch to
                            <br />
                            <span className="text-yellow-300">Solar Energy?</span>
                        </h2>
                        <p className="text-xl mb-10 text-white/90 max-w-2xl mx-auto">
                            Join thousands of satisfied customers and start saving up to 80% on electricity bills
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/products"
                                className="group px-10 py-5 bg-white text-primary rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all inline-flex items-center justify-center gap-2 shadow-2xl hover:scale-105"
                            >
                                Shop Solar Products
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/categories"
                                className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all"
                            >
                                Explore Categories
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Brand Trust Section */}
            <section className="py-16 bg-white border-t">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Trusted Partner Brands</h3>
                        <p className="text-gray-600">We work exclusively with world-leading solar manufacturers</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-12 opacity-60 hover:opacity-100 transition-opacity">
                        {["Longi Solar", "Jinko Solar", "Growatt", "Huawei", "Tesla Energy"].map((brand, index) => (
                            <div key={index} className="text-2xl font-bold text-gray-400 hover:text-primary transition-colors cursor-pointer">
                                {brand}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
