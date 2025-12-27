"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Heart, Clock } from "lucide-react";

// TikTok Icon Component
const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);

export function Footer() {
    return (
        <footer className="relative mt-20 bg-white">
            {/* Decorative Top Wave */}
            <div className="absolute top-0 left-0 right-0 -translate-y-full">
                <svg
                    viewBox="0 0 1440 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full"
                >
                    <path
                        d="M0 120L60 110C120 100 240 80 360 73.3C480 67 600 73 720 76.7C840 80 960 80 1080 73.3C1200 67 1320 53 1380 46.7L1440 40V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0V120Z"
                        fill="white"
                    />
                </svg>
            </div>

            {/* Main Footer Content */}
            <div className="container-custom pt-16 pb-8">
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div>
                        <Link href="/" className="inline-block mb-4">
                            <Image
                                src="/logo.png"
                                alt="Electro Sultani - Pakistan's Leading Solar Provider"
                                width={150}
                                height={50}
                                className="h-10 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                            Electro Sultani is one of the leading Solar Solution Providers in Pakistan. Established since 1969, we provide premium energy solutions across the country.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                            <Clock className="h-4 w-4" />
                            <span>Established Since 1969</span>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            <motion.a
                                whileHover={{ scale: 1.1, y: -2 }}
                                href="https://facebook.com/sultanisolar"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                            >
                                <Facebook className="h-5 w-5" />
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.1, y: -2 }}
                                href="https://instagram.com/sultani.pk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                            >
                                <Instagram className="h-5 w-5" />
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.1, y: -2 }}
                                href="https://www.youtube.com/@sultanisolar"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                            >
                                <Youtube className="h-5 w-5" />
                            </motion.a>
                            <motion.a
                                whileHover={{ scale: 1.1, y: -2 }}
                                href="https://tiktok.com/@sultani.pk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                            >
                                <TikTokIcon />
                            </motion.a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Shop</h4>
                        <ul className="space-y-3">
                            {[
                                { href: "/products", label: "All Products" },
                                { href: "/categories", label: "Categories" },
                                { href: "/products?featured=true", label: "Featured" },
                                { href: "/products?sale=true", label: "Sale" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-600 hover:text-primary transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Support</h4>
                        <ul className="space-y-3">
                            {[
                                { href: "/dashboard", label: "My Account" },
                                { href: "/dashboard/orders", label: "Track Order" },
                                { href: "/wishlist", label: "Wishlist" },
                                { href: "/contact", label: "Contact Us" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-600 hover:text-primary transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Get in Touch</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm text-gray-600">
                                <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                <span>Dara Araian, Mujahid Rd, Rehmat Pura Dara Arain, Sialkot, 51310</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                                <a href="tel:03227858264" className="text-gray-600 hover:text-primary transition-colors">
                                    0322 7858264
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-sm">
                                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                                <a href="mailto:info@sultani.pk" className="text-gray-600 hover:text-primary transition-colors">
                                    info@sultani.pk
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8"></div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
                    <p className="text-gray-600">
                        © {new Date().getFullYear()} Electro Sultani. All rights reserved.
                    </p>

                    {/* ObrixLabs Credit */}
                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        href="https://www.obrixlabs.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                    >
                        <span className="text-gray-400">Developed by</span>
                        <span className="font-semibold text-primary">ObrixLabs</span>
                    </motion.a>

                    <div className="flex items-center gap-4 text-gray-600">
                        <Link href="/privacy" className="hover:text-primary transition-colors">
                            Privacy
                        </Link>
                        <span>•</span>
                        <Link href="/terms" className="hover:text-primary transition-colors">
                            Terms
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
