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
import { PAGE_SEO, SEO_KEYWORDS } from "@/lib/seo-config";
import { FAQSchema } from "@/components/seo/json-ld";

export const metadata = {
    title: PAGE_SEO.home.title,
    description: PAGE_SEO.home.description,
    keywords: PAGE_SEO.home.keywords,
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: PAGE_SEO.home.title,
        description: PAGE_SEO.home.description,
        type: "website",
    },
};

// FAQ data for structured data
const homeFAQs = [
    {
        question: "What is the cost of solar panel installation in Pakistan?",
        answer: "Solar panel installation costs in Pakistan vary based on system size. A 5kW system typically costs 450,000-600,000 PKR, while a 10kW system ranges from 800,000-1,200,000 PKR. SultaniElectro offers competitive prices with free consultation."
    },
    {
        question: "Which is the best solar panel brand in Pakistan?",
        answer: "Top solar panel brands in Pakistan include Longi Solar, Jinko Solar, Canadian Solar, Trina Solar, and JA Solar. SultaniElectro offers all these premium brands with full warranty support."
    },
    {
        question: "How much can I save with solar panels in Pakistan?",
        answer: "Solar panels can reduce your electricity bills by 60-80%. A typical 5kW system can save you 10,000-15,000 PKR per month, with full ROI achieved in 3-4 years."
    },
    {
        question: "Does SultaniElectro offer installation services?",
        answer: "Yes, SultaniElectro provides professional installation services across Pakistan including Lahore, Karachi, Islamabad, and other major cities. Our certified engineers ensure quality installation with after-sales support."
    },
];


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
            {/* FAQ Structured Data */}
            <FAQSchema faqs={homeFAQs} />

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
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                            Your Trusted <span className="bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">Solar Partner</span>
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
                            We make switching to solar energy simple, affordable, and rewarding
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
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
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                            Simple <span className="bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">3-Step Process</span>
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base lg:text-lg">Get started with solar energy in just three easy steps</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
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
                                    <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                                        {stat.number}
                                    </div>
                                    <div className="text-gray-600 font-semibold text-sm sm:text-base lg:text-lg">{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section - Responsive */}
            <section className="py-12 sm:py-16 lg:py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-cyan-600 to-blue-700" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />

                <div className="container-custom relative z-10">
                    <div className="max-w-4xl mx-auto text-center text-white px-4">
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full font-semibold text-xs sm:text-sm mb-4 sm:mb-6">
                            <Leaf className="h-3 w-3 sm:h-4 sm:w-4" />
                            Start Saving Today
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                            Ready to Switch to
                            <br />
                            <span className="text-yellow-300">Solar Energy?</span>
                        </h2>
                        <p className="text-sm sm:text-base lg:text-xl mb-6 sm:mb-10 text-white/90 max-w-2xl mx-auto">
                            Join thousands of satisfied customers and start saving up to 80% on electricity bills
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <Link
                                href="/products"
                                className="group px-6 sm:px-10 py-3 sm:py-5 bg-white text-primary rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg hover:bg-gray-100 transition-all inline-flex items-center justify-center gap-2 shadow-2xl hover:scale-105"
                            >
                                Shop Solar Products
                                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/categories"
                                className="px-6 sm:px-10 py-3 sm:py-5 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-lg hover:bg-white/20 transition-all"
                            >
                                Explore Categories
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section - New */}
            <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
                <div className="container-custom">
                    <div className="text-center mb-8 sm:mb-12">
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 rounded-full text-primary font-semibold text-xs sm:text-sm mb-3 sm:mb-4">
                            <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                            Customer Reviews
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
                            What Our <span className="bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">Customers Say</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {[
                            {
                                name: "Ahmed Khan",
                                location: "Lahore",
                                rating: 5,
                                text: "Excellent quality solar panels! My electricity bills dropped by 70%. Highly recommend SultaniElectro."
                            },
                            {
                                name: "Sarah Ali",
                                location: "Karachi",
                                rating: 5,
                                text: "Professional installation and great after-sales support. The team was very helpful throughout the process."
                            },
                            {
                                name: "Muhammad Usman",
                                location: "Islamabad",
                                rating: 5,
                                text: "Best prices in the market! Got my complete solar system installed within a week. Amazing service!"
                            }
                        ].map((review, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <div className="flex gap-1 mb-3 sm:mb-4">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">"{review.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-primary font-bold text-sm sm:text-base">{review.name[0]}</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm sm:text-base">{review.name}</p>
                                        <p className="text-xs sm:text-sm text-gray-500">{review.location}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Banner - New */}
            <section className="py-8 sm:py-12 bg-white border-y">
                <div className="container-custom">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {[
                            { icon: Truck, text: "Free Delivery", subtext: "On orders over PKR 50K" },
                            { icon: Shield, text: "25-Year Warranty", subtext: "On solar panels" },
                            { icon: HeadphonesIcon, text: "24/7 Support", subtext: "Expert assistance" },
                            { icon: DollarSign, text: "Best Prices", subtext: "Price match guarantee" }
                        ].map((benefit, index) => {
                            const Icon = benefit.icon;
                            return (
                                <div key={index} className="flex items-center gap-3 sm:gap-4">
                                    <div className="w-10 h-10 sm:w-14 sm:h-14 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <Icon className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-xs sm:text-sm lg:text-base">{benefit.text}</p>
                                        <p className="text-[10px] sm:text-xs text-gray-500">{benefit.subtext}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Brand Trust Section - Responsive */}
            <section className="py-10 sm:py-16 bg-white">
                <div className="container-custom">
                    <div className="text-center mb-6 sm:mb-12">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Trusted Partner Brands</h3>
                        <p className="text-xs sm:text-sm lg:text-base text-gray-600">We work exclusively with world-leading solar manufacturers</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-12 opacity-60 hover:opacity-100 transition-opacity">
                        {["Longi Solar", "Jinko Solar", "Growatt", "Huawei", "Tesla Energy"].map((brand, index) => (
                            <div key={index} className="text-base sm:text-lg lg:text-2xl font-bold text-gray-400 hover:text-primary transition-colors cursor-pointer">
                                {brand}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Go Solar Section */}
            <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

                <div className="container-custom relative z-10">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                        {/* Left Content */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 rounded-full text-primary font-semibold text-xs sm:text-sm mb-4 sm:mb-6">
                                <Sun className="h-3 w-3 sm:h-4 sm:w-4" />
                                Why Go Solar?
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                                Save Money & <span className="bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">Save The Planet</span>
                            </h2>
                            <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 leading-relaxed">
                                Solar energy is the smartest investment you can make for your home or business.
                                Reduce your carbon footprint while enjoying significant savings on your electricity bills.
                            </p>

                            <div className="space-y-4">
                                {[
                                    { icon: DollarSign, title: "Up to 80% Savings", desc: "Dramatically reduce your monthly electricity bills" },
                                    { icon: Leaf, title: "Eco-Friendly", desc: "Clean, renewable energy that protects the environment" },
                                    { icon: TrendingUp, title: "Increased Property Value", desc: "Solar installations boost your property's market value" },
                                    { icon: Award, title: "Government Incentives", desc: "Take advantage of tax benefits and net metering" }
                                ].map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={index} className="flex items-start gap-3 sm:gap-4">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                                                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm sm:text-base lg:text-lg text-gray-900">{item.title}</h4>
                                                <p className="text-xs sm:text-sm text-gray-600">{item.desc}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                            {[
                                { value: "10M+", label: "kWh Generated", color: "from-primary to-cyan-500", icon: Zap },
                                { value: "5000+", label: "Happy Customers", color: "from-green-500 to-emerald-500", icon: Users },
                                { value: "₨50M+", label: "Customer Savings", color: "from-purple-500 to-pink-500", icon: DollarSign },
                                { value: "100%", label: "Quality Guaranteed", color: "from-orange-500 to-red-500", icon: Shield }
                            ].map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={index} className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 border border-gray-100">
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${stat.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4`}>
                                            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                        </div>
                                        <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                                            {stat.value}
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-600 font-medium">{stat.label}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-12 sm:py-16 lg:py-20 bg-white">
                <div className="container-custom">
                    <div className="text-center mb-8 sm:mb-12">
                        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 rounded-full text-primary font-semibold text-xs sm:text-sm mb-3 sm:mb-4">
                            <HeadphonesIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                            Got Questions?
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
                            Frequently Asked <span className="bg-gradient-to-r from-primary to-cyan-600 bg-clip-text text-transparent">Questions</span>
                        </h2>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
                        {[
                            { q: "How much can I save with solar panels?", a: "Most customers save 60-80% on their electricity bills. The exact savings depend on your current usage and the size of your solar system." },
                            { q: "What warranty do you offer?", a: "We offer 25 years warranty on solar panels, 10 years on inverters, and lifetime support for all our customers." },
                            { q: "How long does installation take?", a: "A typical residential installation takes 1-2 days. Commercial installations may take 3-7 days depending on the system size." },
                            { q: "Do you offer financing options?", a: "Yes! We offer flexible payment plans and EMI options with 0% markup. Contact us for customized financing solutions." }
                        ].map((faq, index) => (
                            <div key={index} className="bg-gray-50 hover:bg-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-colors group cursor-pointer">
                                <h4 className="font-bold text-sm sm:text-base lg:text-lg text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                    {faq.q}
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Premium Newsletter Section */}
            <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-cyan-600 to-blue-700" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />

                {/* Floating Decorations */}
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-300/10 rounded-full blur-2xl" />
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-cyan-300/10 rounded-full blur-xl" />

                <div className="container-custom relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-14 border border-white/20">
                            <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
                                {/* Left Content */}
                                <div className="text-center lg:text-left">
                                    <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold text-xs sm:text-sm mb-4">
                                        <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                                        Join 10,000+ Subscribers
                                    </div>
                                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">
                                        Get Exclusive <span className="text-yellow-300">Offers & Updates</span>
                                    </h3>
                                    <p className="text-white/80 text-sm sm:text-base mb-4 lg:mb-0">
                                        Subscribe to receive the latest solar energy tips, exclusive discounts, and new product announcements directly to your inbox.
                                    </p>
                                </div>

                                {/* Right Form */}
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder="Your email address"
                                            className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30 text-sm sm:text-base"
                                        />
                                    </div>
                                    <button className="w-full px-6 py-3 sm:py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all hover:shadow-2xl hover:scale-[1.02] flex items-center justify-center gap-2">
                                        Subscribe Now
                                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </button>
                                    <p className="text-white/60 text-xs text-center">
                                        By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
                                    </p>
                                </div>
                            </div>

                            {/* Benefits */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 sm:mt-10 pt-6 sm:pt-10 border-t border-white/20">
                                {[
                                    { icon: Zap, text: "Exclusive Deals" },
                                    { icon: Sun, text: "Solar Tips" },
                                    { icon: Award, text: "Early Access" },
                                    { icon: Shield, text: "No Spam" }
                                ].map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={index} className="flex items-center gap-2 text-white/80">
                                            <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-300" />
                                            <span className="text-xs sm:text-sm font-medium">{item.text}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact/Location Section */}
            <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                        {[
                            {
                                icon: MapPin,
                                title: "Visit Our Showroom",
                                lines: ["Main Boulevard, Gulberg III", "Lahore, Pakistan"],
                                color: "from-primary to-cyan-500"
                            },
                            {
                                icon: HeadphonesIcon,
                                title: "Call Us Anytime",
                                lines: ["+92 300 1234567", "+92 42 35761234"],
                                color: "from-green-500 to-emerald-500"
                            },
                            {
                                icon: Clock,
                                title: "Working Hours",
                                lines: ["Mon - Sat: 9AM - 8PM", "Sunday: 11AM - 6PM"],
                                color: "from-purple-500 to-pink-500"
                            }
                        ].map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div key={index} className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all text-center group hover:-translate-y-1">
                                    <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform`}>
                                        <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                                    </div>
                                    <h4 className="font-bold text-base sm:text-lg lg:text-xl text-gray-900 mb-2 sm:mb-3">{item.title}</h4>
                                    {item.lines.map((line, i) => (
                                        <p key={i} className="text-gray-600 text-sm sm:text-base">{line}</p>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
