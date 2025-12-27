"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Sparkles, CheckCircle, Star, Zap } from "lucide-react";

export function StaticHero() {
    return (
        <section className="relative min-h-[85vh] sm:min-h-screen flex items-center overflow-hidden bg-white py-8 sm:py-0">
            {/* Animated Background Shapes */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Large Background Circles */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-0 right-0 w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] bg-primary/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.08, 0.15, 0.08],
                    }}
                    transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-0 left-0 w-[300px] sm:w-[400px] lg:w-[600px] h-[300px] sm:h-[400px] lg:h-[600px] bg-orange-500/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.05, 0.1, 0.05],
                    }}
                    transition={{ duration: 10, repeat: Infinity, delay: 2 }}
                    className="absolute top-1/3 left-1/3 w-[350px] sm:w-[500px] lg:w-[700px] h-[350px] sm:h-[500px] lg:h-[700px] bg-cyan-500/10 rounded-full blur-3xl"
                />
            </div>

            {/* Geometric Pattern Overlay */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:4rem_4rem]" />
            </div>

            {/* Floating Elements - Hidden on mobile */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 100 }}
                        animate={{
                            opacity: [0, 0.3, 0],
                            y: [100, -100],
                            x: [0, Math.random() * 100 - 50],
                        }}
                        transition={{
                            duration: 8 + i * 2,
                            repeat: Infinity,
                            delay: i * 1.5,
                        }}
                        className="absolute"
                        style={{
                            left: `${10 + i * 15}%`,
                            top: '80%',
                        }}
                    >
                        <Zap className="h-6 w-6 text-primary/20" />
                    </motion.div>
                ))}
            </div>

            {/* Content */}
            <div className="container-custom relative z-10 px-4 sm:px-6">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 bg-primary/10 backdrop-blur-md border border-primary/20 rounded-full text-primary mb-4 sm:mb-6"
                        >
                            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="text-xs sm:text-sm font-bold">Pakistan's #1 Solar Provider</span>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 sm:mb-6 leading-tight"
                        >
                            Power Your Future with{" "}
                            <span className="relative inline-block">
                                <span className="bg-gradient-to-r from-primary via-cyan-500 to-primary bg-clip-text text-transparent">
                                    Solar Energy
                                </span>
                                <motion.span
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ delay: 0.8, duration: 0.8 }}
                                    className="absolute bottom-0.5 sm:bottom-2 left-0 h-1.5 sm:h-3 bg-primary/20 -z-10"
                                />
                            </span>
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 mb-4 sm:mb-8 leading-relaxed"
                        >
                            Premium solar panels, inverters, and energy storage systems.
                            Save up to 80% on electricity bills with trusted quality.
                        </motion.p>

                        {/* Features List */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-8"
                        >
                            {[
                                "25-Year Warranty",
                                "Free Installation",
                                "Expert Support",
                                "Best Prices"
                            ].map((feature, index) => (
                                <div key={index} className="flex items-center gap-1.5 sm:gap-2 text-gray-700">
                                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3 text-primary fill-primary" />
                                    </div>
                                    <span className="text-xs sm:text-sm lg:text-base font-medium">{feature}</span>
                                </div>
                            ))}
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-2 sm:gap-4"
                        >
                            <Link
                                href="/products"
                                className="group px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-gradient-to-r from-primary to-cyan-500 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base lg:text-lg hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all inline-flex items-center justify-center gap-2"
                            >
                                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                                Shop Solar Panels
                                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/categories"
                                className="px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-gray-100 border-2 border-gray-200 text-gray-900 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base lg:text-lg hover:bg-gray-50 hover:border-primary/30 transition-all inline-flex items-center justify-center gap-2"
                            >
                                View Categories
                            </Link>
                        </motion.div>

                        {/* Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="mt-6 sm:mt-12 flex items-center gap-4 sm:gap-8 flex-wrap"
                        >
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 fill-yellow-500" />
                                <span className="text-gray-900 font-semibold text-xs sm:text-sm lg:text-base">4.9/5 Rating</span>
                            </div>
                            <div className="h-6 sm:h-8 w-px bg-gray-300" />
                            <div className="text-gray-900">
                                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">5000+</span>
                                <span className="ml-1 sm:ml-2 text-xs sm:text-sm lg:text-base text-gray-600">Happy Customers</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Content - Abstract Design (Hidden on mobile/tablet) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="hidden lg:block relative"
                    >
                        <div className="relative w-full h-[500px] xl:h-[600px]">
                            {/* Central Glow */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        rotate: [0, 360],
                                    }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="w-60 xl:w-80 h-60 xl:h-80 rounded-full bg-gradient-to-br from-primary/20 to-cyan-500/20 blur-3xl"
                                />
                            </div>

                            {/* Orbiting Circles */}
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 15 + i * 5,
                                        repeat: Infinity,
                                        ease: "linear",
                                    }}
                                    className="absolute inset-0"
                                    style={{ opacity: 0.6 - i * 0.2 }}
                                >
                                    <div
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary/20"
                                        style={{
                                            width: `${250 + i * 80}px`,
                                            height: `${250 + i * 80}px`,
                                        }}
                                    >
                                        <motion.div
                                            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 xl:w-4 h-3 xl:h-4 rounded-full bg-gradient-to-br from-primary to-cyan-500 shadow-lg"
                                            animate={{
                                                scale: [1, 1.5, 1],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                delay: i * 0.3,
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            ))}

                            {/* Stats Cards Floating */}
                            {[
                                { value: "80%", label: "Energy Savings", position: "top-5 left-5", color: "from-blue-500 to-cyan-500" },
                                { value: "25Y", label: "Warranty", position: "top-5 right-5", color: "from-primary to-cyan-500" },
                                { value: "500+", label: "Products", position: "bottom-5 left-5", color: "from-purple-500 to-pink-500" },
                                { value: "24/7", label: "Support", position: "bottom-5 right-5", color: "from-orange-500 to-red-500" }
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 + index * 0.1 }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className={`absolute ${stat.position} bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl xl:rounded-2xl p-3 xl:p-4 cursor-pointer shadow-lg`}
                                >
                                    <div className={`text-xl xl:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-600 text-xs xl:text-sm font-medium mt-0.5 xl:mt-1">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator - Hidden on mobile */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2"
            >
                <span className="text-gray-500 text-xs sm:text-sm">Scroll to explore</span>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-5 sm:w-6 h-8 sm:h-10 border-2 border-gray-300 rounded-full p-1"
                >
                    <div className="w-0.5 sm:w-1 h-2 sm:h-3 bg-primary rounded-full mx-auto" />
                </motion.div>
            </motion.div>
        </section>
    );
}
